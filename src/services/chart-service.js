/**
 * Kairos Maps — chart-service (Fase 2.1a-2)
 * Puente entre la app y kairos-core. Sin DOM, sin UI, sin app.js.
 */
(function () {
  'use strict';

  class ChartServiceError extends Error {
    constructor(code, message, cause) {
      super(message);
      this.name = 'ChartServiceError';
      this.code = code;
      this.cause = cause || null;
    }
  }

  let _ready = false;
  let _initPromise = null;
  let _lastError = null;
  let _lastTimings = {};
  let _callCount = 0;
  const _cache = new Map();

  function requireGlobal(name, label) {
    if (name === 'luxon') {
      if (typeof window.luxon === 'undefined') {
        throw new ChartServiceError('MISSING_LUXON', `${label || name} no disponible`);
      }
      return window.luxon;
    }
    if (typeof window[name] === 'undefined') {
      throw new ChartServiceError('MISSING_ENGINE', `${label || name} no disponible — revisar orden de scripts`);
    }
    return window[name];
  }

  function validateBirthData(input) {
    if (!input || typeof input !== 'object') {
      throw new ChartServiceError('INVALID_INPUT', 'birthData debe ser un objeto');
    }

    const date = input.date;
    const time = input.time;
    const timezone = input.timezone;
    const lat = input.lat != null ? input.lat : input.latitude;
    const lon = input.lon != null ? input.lon : input.longitude;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ChartServiceError('INVALID_INPUT', 'date debe ser YYYY-MM-DD');
    }
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      throw new ChartServiceError('INVALID_INPUT', 'time debe ser HH:mm');
    }
    if (!timezone || typeof timezone !== 'string') {
      throw new ChartServiceError('INVALID_INPUT', 'timezone IANA requerido');
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
      throw new ChartServiceError('INVALID_INPUT', 'lat inválida [-90, 90]');
    }
    if (Number.isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      throw new ChartServiceError('INVALID_INPUT', 'lon inválida [-180, 180]');
    }

    const luxon = requireGlobal('luxon');
    const [y, m, d] = date.split('-').map(Number);
    const [h, min] = time.split(':').map(Number);
    const dt = luxon.DateTime.fromObject(
      { year: y, month: m, day: d, hour: h, minute: min, second: 0 },
      { zone: timezone }
    );
    if (!dt.isValid) {
      throw new ChartServiceError('INVALID_TIMEZONE', `Zona horaria inválida: ${timezone}`);
    }

    return { date, time, timezone, lat: latNum, lon: lonNum };
  }

  function cacheKey(data) {
    return [data.date, data.time, data.timezone, data.lat, data.lon].join('|');
  }

  function mapChartPayload(raw, normalized) {
    return {
      metadata: raw.metadata,
      planets: raw.planets,
      houses: raw.houses,
      angles: raw.angles,
      aspects: raw.aspects,
      input: {
        date: normalized.date,
        time: normalized.time,
        timezone: normalized.timezone,
        lat: normalized.lat,
        lon: normalized.lon,
        utc: raw.input?.utc || null
      },
      computedAt: new Date().toISOString()
    };
  }

  async function restoreSwephPath() {
    if (window.swisseph_native?.set_ephe_path) {
      window.swisseph_native.set_ephe_path('sweph');
    }
  }

  async function doInit() {
    const t0 = performance.now();
    _lastError = null;

    try {
      requireGlobal('luxon');
      requireGlobal('generateFullChart');
      requireGlobal('initPlanetaryEngine');

      const tWasmStart = performance.now();
      if (typeof window.initKairosCore === 'function') {
        await window.initKairosCore();
      } else if (!window.swisseph_native?._kairosReady) {
        throw new ChartServiceError(
          'BOOTSTRAP_MISSING',
          'initKairosCore no disponible — cargar engines/kairos-core/bootstrap.js como module'
        );
      }
      const wasmMs = performance.now() - tWasmStart;

      if (!window.swisseph_native?.SweModule) {
        throw new ChartServiceError('WASM_INIT_FAILED', 'swisseph_native no inicializado correctamente');
      }

      const tPeStart = performance.now();
      if (window.__kairosCoreReady) {
        await window.__kairosCoreReady;
      }
      await window.initPlanetaryEngine();
      await restoreSwephPath();
      const planetaryMs = performance.now() - tPeStart;

      _ready = true;
      _lastTimings = {
        wasmMs: Math.round(wasmMs),
        planetaryMs: Math.round(planetaryMs),
        totalMs: Math.round(performance.now() - t0),
        at: new Date().toISOString()
      };

      return { ok: true, ready: true, timings: { ..._lastTimings } };
    } catch (err) {
      _ready = false;
      _lastError = err instanceof ChartServiceError
        ? { code: err.code, message: err.message }
        : { code: 'INIT_FAILED', message: err.message || String(err) };
      if (err instanceof ChartServiceError) throw err;
      throw new ChartServiceError('INIT_FAILED', err.message || String(err), err);
    }
  }

  async function initNatalEngine() {
    if (_ready) {
      return { ok: true, ready: true, timings: { ..._lastTimings, cached: true } };
    }
    if (!_initPromise) {
      _initPromise = doInit().catch(function (err) {
        _initPromise = null;
        throw err;
      });
    }
    return _initPromise;
  }

  async function ensureReady() {
    return initNatalEngine();
  }

  async function generateNatalChart(birthData, options) {
    const opts = options || {};
    const t0 = performance.now();
    _callCount += 1;

    await initNatalEngine();

    const normalized = validateBirthData(birthData);
    const key = cacheKey(normalized);

    if (!opts.skipCache && _cache.has(key)) {
      const cached = _cache.get(key);
      return {
        ...cached,
        fromCache: true,
        elapsedMs: Math.round(performance.now() - t0)
      };
    }

    try {
      const raw = await window.generateFullChart(
        normalized.date,
        normalized.time,
        normalized.lat,
        normalized.lon,
        normalized.timezone
      );
      await restoreSwephPath();

      const payload = mapChartPayload(raw, normalized);
      payload.elapsedMs = Math.round(performance.now() - t0);
      payload.fromCache = false;

      if (!opts.skipCache) {
        _cache.set(key, payload);
      }

      return payload;
    } catch (err) {
      _lastError = {
        code: 'CALC_ERROR',
        message: err.message || String(err)
      };
      if (err instanceof ChartServiceError) throw err;
      throw new ChartServiceError('CALC_ERROR', err.message || String(err), err);
    }
  }

  function clearCache() {
    _cache.clear();
  }

  function getStatus() {
    return {
      ready: _ready,
      initInFlight: !!_initPromise && !_ready,
      callCount: _callCount,
      cacheSize: _cache.size,
      lastTimings: { ..._lastTimings },
      lastError: _lastError ? { ..._lastError } : null,
      hasSwisseph: !!window.swisseph_native,
      swephPathReady: !!window.swisseph_native?._kairosReady
    };
  }

  window.KairosChartService = {
    ChartServiceError: ChartServiceError,
    initNatalEngine: initNatalEngine,
    ensureReady: ensureReady,
    generateNatalChart: generateNatalChart,
    validateBirthData: validateBirthData,
    mapChartPayload: mapChartPayload,
    clearCache: clearCache,
    getStatus: getStatus
  };
})();
