/**
 * KAIROS MAPS — Reloc chart adapter (Fase 3.7b.6 DEV)
 *
 * Puente: KairosChartService (WASM) → RelocationProfile input.
 * Misma fecha/hora/timezone de nacimiento + lat/lon ciudad destino.
 * Sin motores nuevos, sin DOM.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.1.0-reloc-chart-adapter';
  var BIRTH_TIMEZONE_POLICY = 'birth_timezone';

  var SIGN_SLUG_BY_NAME = {
    Aries: 'aries',
    Tauro: 'taurus',
    'Géminis': 'gemini',
    'Cáncer': 'cancer',
    Leo: 'leo',
    Virgo: 'virgo',
    Libra: 'libra',
    Escorpio: 'scorpio',
    Sagitario: 'sagittarius',
    Capricornio: 'capricorn',
    Acuario: 'aquarius',
    Piscis: 'pisces'
  };

  var ANGLE_KEYS = [
    { chart: 'ASC', profile: 'AC' },
    { chart: 'MC', profile: 'MC' },
    { chart: 'DC', profile: 'DC' },
    { chart: 'IC', profile: 'IC' }
  ];

  function fail(reason, detail) {
    return {
      ok: false,
      reason: reason,
      detail: detail || null,
      natalChart: null,
      targetLocation: null,
      relocatedAngles: null,
      relocatedHouses: null,
      goalContext: null,
      meta: { schemaVersion: SCHEMA_VERSION }
    };
  }

  function signSlug(signName) {
    if (!signName) return null;
    var key = String(signName).trim();
    return SIGN_SLUG_BY_NAME[key] || SIGN_SLUG_BY_NAME[key.replace(/\s+/g, ' ')] || null;
  }

  function norm360(lon) {
    var n = Number(lon);
    if (Number.isNaN(n)) return null;
    n = n % 360;
    return n < 0 ? n + 360 : n;
  }

  function degreeInSign(pos) {
    if (!pos) return null;
    if (pos.deg != null && pos.min != null) {
      return pos.deg + (pos.min / 60) + ((pos.sec || 0) / 3600);
    }
    if (pos.longitude != null) return pos.longitude % 30;
    return null;
  }

  function validateBirthData(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var date = raw.date;
    var time = raw.time;
    var timezone = raw.timezone;
    var lat = raw.lat != null ? raw.lat : raw.latitude;
    var lon = raw.lon != null ? raw.lon : raw.longitude;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return null;
    if (!time || !/^\d{2}:\d{2}$/.test(String(time))) return null;
    if (!timezone || typeof timezone !== 'string') return null;
    var latNum = parseFloat(lat);
    var lonNum = parseFloat(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) return null;
    return {
      date: String(date),
      time: String(time),
      timezone: String(timezone),
      lat: latNum,
      lon: lonNum,
      birthPlace: raw.birthPlace || raw.place || null
    };
  }

  function validateTargetLocation(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var lat = Number(raw.lat);
    var lon = Number(raw.lon);
    var name = raw.name != null ? String(raw.name).trim() : '';
    if (!name || Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      name: name,
      country: raw.country != null ? String(raw.country).trim() : null,
      lat: lat,
      lon: lon,
      cityId: raw.cityId || null
    };
  }

  function angleFromChartPos(pos) {
    if (!pos || pos.longitude == null) return null;
    var slug = signSlug(pos.sign);
    if (!slug) return null;
    return {
      sign: pos.sign,
      signSlug: slug,
      slug: slug,
      degree: degreeInSign(pos),
      longitude: norm360(pos.longitude)
    };
  }

  function anglesFromChart(chart) {
    if (!chart || !chart.angles) return null;
    var out = {};
    var missing = [];
    ANGLE_KEYS.forEach(function (pair) {
      var mapped = angleFromChartPos(chart.angles[pair.chart]);
      if (!mapped) {
        missing.push(pair.profile);
        return;
      }
      out[pair.profile] = mapped;
    });
    if (missing.length) return null;
    return out;
  }

  function natalChartFromCharts(natalChartPayload, birthData) {
    var planets = natalChartPayload && natalChartPayload.planets;
    var angles = natalChartPayload && natalChartPayload.angles;
    var natalAngles = anglesFromChart(natalChartPayload);
    var chart = {
      sun: planets && planets.SUN ? signSlug(planets.SUN.sign) : null,
      moon: planets && planets.MOON ? signSlug(planets.MOON.sign) : null,
      asc: angles && angles.ASC ? signSlug(angles.ASC.sign) : null
    };
    if (natalAngles) {
      chart.angles = {
        AC: {
          sign: natalAngles.AC.sign,
          slug: natalAngles.AC.slug,
          degree: natalAngles.AC.degree
        },
        MC: {
          sign: natalAngles.MC.sign,
          slug: natalAngles.MC.slug,
          degree: natalAngles.MC.degree
        },
        IC: {
          sign: natalAngles.IC.sign,
          slug: natalAngles.IC.slug,
          degree: natalAngles.IC.degree
        },
        DC: {
          sign: natalAngles.DC.sign,
          slug: natalAngles.DC.slug,
          degree: natalAngles.DC.degree
        }
      };
    }
    chart.birthMeta = {
      date: birthData.date,
      time: birthData.time,
      timezone: birthData.timezone,
      lat: birthData.lat,
      lon: birthData.lon,
      place: birthData.birthPlace
    };
    return chart;
  }

  function relocatedHousesFromChart(chart) {
    if (!chart || !Array.isArray(chart.houses)) return [];
    return chart.houses.map(function (house, idx) {
      if (!house) return null;
      return {
        house: idx + 1,
        sign: house.sign,
        slug: signSlug(house.sign),
        longitude: house.longitude != null ? norm360(house.longitude) : null,
        deg: house.deg,
        min: house.min
      };
    }).filter(Boolean);
  }

  function getChartService() {
    if (typeof window !== 'undefined' && window.KairosChartService) {
      return window.KairosChartService;
    }
    return null;
  }

  function profileAnglesFromAdapterAngles(relocatedAngles) {
    var out = {};
    ['AC', 'MC', 'IC', 'DC'].forEach(function (key) {
      var ref = relocatedAngles[key];
      if (!ref) return;
      out[key] = {
        sign: ref.sign,
        slug: ref.slug,
        degree: ref.degree
      };
    });
    return out;
  }

  async function buildRelocationInputFromChart(input) {
    try {
      if (!input || typeof input !== 'object') {
        return fail('invalid_input');
      }

      var birthData = validateBirthData(input.birthData);
      if (!birthData) {
        return fail('missing_birth_data');
      }

      var targetLocation = validateTargetLocation(input.targetLocation);
      if (!targetLocation) {
        return fail('missing_target_location');
      }

      var ChartService = getChartService();
      if (!ChartService || typeof ChartService.generateNatalChart !== 'function') {
        return fail('chart_service_unavailable');
      }

      var goalContext = input.goalContext || null;

      var natalBirthPayload = {
        date: birthData.date,
        time: birthData.time,
        timezone: birthData.timezone,
        lat: birthData.lat,
        lon: birthData.lon
      };

      var relocBirthPayload = {
        date: birthData.date,
        time: birthData.time,
        timezone: birthData.timezone,
        lat: targetLocation.lat,
        lon: targetLocation.lon
      };

      var natalChartResult;
      var relocChartResult;
      try {
        natalChartResult = await ChartService.generateNatalChart(natalBirthPayload, { skipCache: true });
        relocChartResult = await ChartService.generateNatalChart(relocBirthPayload, { skipCache: true });
      } catch (err) {
        return fail('chart_calculation_failed', err && err.message ? err.message : String(err));
      }

      var relocatedAngles = anglesFromChart(relocChartResult);
      if (!relocatedAngles || !relocatedAngles.AC || !relocatedAngles.MC) {
        return fail('missing_angles');
      }

      var natalChart = natalChartFromCharts(natalChartResult, birthData);
      var relocatedHouses = relocatedHousesFromChart(relocChartResult);

      return {
        ok: true,
        natalChart: natalChart,
        targetLocation: targetLocation,
        relocatedAngles: relocatedAngles,
        relocatedHouses: relocatedHouses,
        goalContext: goalContext,
        meta: {
          schemaVersion: SCHEMA_VERSION,
          calculatedBy: 'KairosChartService',
          source: 'real',
          timezonePolicy: BIRTH_TIMEZONE_POLICY,
          targetLocationName: targetLocation.name,
          birthUtc: natalChartResult.input && natalChartResult.input.utc,
          relocUtc: relocChartResult.input && relocChartResult.input.utc,
          engine: relocChartResult.metadata && relocChartResult.metadata.engine,
          houseSystem: relocChartResult.metadata && relocChartResult.metadata.house_system
        },
        charts: {
          natal: natalChartResult,
          relocated: relocChartResult
        }
      };
    } catch (e) {
      return fail('internal_error', e && e.message ? e.message : String(e));
    }
  }

  function buildProfileInputFromAdapter(adapterResult) {
    if (!adapterResult || !adapterResult.ok) return adapterResult;
    return {
      natalChart: adapterResult.natalChart,
      targetLocation: adapterResult.targetLocation,
      relocatedAngles: profileAnglesFromAdapterAngles(adapterResult.relocatedAngles),
      relocatedHouses: adapterResult.relocatedHouses,
      goalContext: adapterResult.goalContext
    };
  }

  function angularSeparation(lonA, lonB) {
    if (lonA == null || lonB == null) return null;
    var diff = Math.abs(norm360(lonA) - norm360(lonB));
    return diff > 180 ? 360 - diff : diff;
  }

  function verifyAngleOppositions(relocatedAngles, toleranceDeg) {
    var tol = toleranceDeg != null ? toleranceDeg : 1.5;
    var ac = relocatedAngles.AC && relocatedAngles.AC.longitude;
    var dc = relocatedAngles.DC && relocatedAngles.DC.longitude;
    var mc = relocatedAngles.MC && relocatedAngles.MC.longitude;
    var ic = relocatedAngles.IC && relocatedAngles.IC.longitude;
    return {
      acDc: angularSeparation(ac, dc) != null && Math.abs(angularSeparation(ac, dc) - 180) <= tol,
      mcIc: angularSeparation(mc, ic) != null && Math.abs(angularSeparation(mc, ic) - 180) <= tol
    };
  }

  window.KairosRelocChartAdapter = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    BIRTH_TIMEZONE_POLICY: BIRTH_TIMEZONE_POLICY,
    SIGN_SLUG_BY_NAME: SIGN_SLUG_BY_NAME,
    signSlug: signSlug,
    buildRelocationInputFromChart: buildRelocationInputFromChart,
    buildProfileInputFromAdapter: buildProfileInputFromAdapter,
    verifyAngleOppositions: verifyAngleOppositions,
    anglesFromChart: anglesFromChart
  };
})();
