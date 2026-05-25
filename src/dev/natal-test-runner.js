/**
 * Fase 2.1a-1 — Test aislado generateFullChart()
 * No conectado a app.js ni index.html principal.
 */
'use strict';

const TEST_CASE = {
  label: 'Golden G1 — Maó, Menorca',
  birthDate: '1990-06-12',
  birthTime: '14:35',
  latitude: 39.8885,
  longitude: 4.2658,
  timezone: 'Europe/Madrid'
};

const out = document.getElementById('output');
const lines = [];

function log(line, kind) {
  const prefix = kind === 'err' ? '[ERROR] ' : kind === 'warn' ? '[WARN]  ' : kind === 'ok' ? '[OK]    ' : '[INFO]  ';
  const msg = prefix + line;
  lines.push(msg);
  console.log(msg);
  out.textContent = lines.join('\n');
}

function fmtPos(label, pos) {
  if (!pos) return `${label}: —`;
  return `${label}: ${pos.sign} ${pos.deg}° ${pos.min}' (${pos.longitude?.toFixed(4)}°)`;
}

async function ensurePlanetaryReady() {
  if (typeof initPlanetaryEngine !== 'function') {
    throw new Error('initPlanetaryEngine no cargado — revisar orden de scripts');
  }
  await initPlanetaryEngine();
  if (window.swisseph_native?.set_ephe_path) {
    window.swisseph_native.set_ephe_path('sweph');
  }
}

async function run() {
  const t0 = performance.now();

  try {
    log('Caso: ' + TEST_CASE.label);
    log(`Input: ${TEST_CASE.birthDate} ${TEST_CASE.birthTime} | TZ ${TEST_CASE.timezone} | ${TEST_CASE.latitude}, ${TEST_CASE.longitude}`);

    if (typeof window.luxon === 'undefined') {
      throw new Error('Luxon no disponible');
    }
    log('Luxon: OK');

    if (typeof generateFullChart !== 'function') {
      throw new Error('generateFullChart no disponible — chart_engine.js');
    }
    log('chart_engine.js: OK');

    log('Inicializando WASM (bootstrap.js)…');
    const tWasmStart = performance.now();
    await window.initKairosCore();
    const tWasm = performance.now() - tWasmStart;

    if (!window.swisseph_native) {
      throw new Error('window.swisseph_native no creado tras bootstrap');
    }
    log(`swisseph_native: OK (${tWasm.toFixed(0)} ms)`, 'ok');
    log(`  _kairosReady: ${!!window.swisseph_native._kairosReady}`);
    log(`  initSwissEph / SweModule: ${!!window.swisseph_native.SweModule}`);

    log('Inicializando planetary_engine…');
    const tPeStart = performance.now();
    await window.__kairosCoreReady;
    await ensurePlanetaryReady();
    const tPe = performance.now() - tPeStart;
    log(`planetary_engine: OK (${tPe.toFixed(0)} ms)`, 'ok');

    if (typeof window.swisseph_native.calc_ut === 'function') {
      log('Smoke calc_ut (Sol): probando…');
      const luxonDt = window.luxon.DateTime.fromObject(
        { year: 1990, month: 6, day: 12, hour: 14, minute: 35 },
        { zone: 'Europe/Madrid' }
      );
      const utc = luxonDt.toUTC();
      const jd = window.swisseph_native.utc_to_jd(
        utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second, 1
      );
      const sun = window.swisseph_native.calc_ut(jd.julianDayUT, 0, 2 | 256);
      log(`  Sol longitud: ${sun[0].toFixed(4)}°`, 'ok');
    }

    log('Ejecutando generateFullChart()…');
    const tChartStart = performance.now();
    const chart = await generateFullChart(
      TEST_CASE.birthDate,
      TEST_CASE.birthTime,
      TEST_CASE.latitude,
      TEST_CASE.longitude,
      TEST_CASE.timezone
    );
    const tChart = performance.now() - tChartStart;
    const tTotal = performance.now() - t0;

    log(`generateFullChart: OK (${tChart.toFixed(0)} ms)`, 'ok');
    log(`Tiempo total: ${tTotal.toFixed(0)} ms`);
    log('');
    log('── metadata ──');
    log(`  engine: ${chart.metadata?.engine}`);
    log(`  motor: ${chart.metadata?.motor}`);
    log(`  house_system: ${chart.metadata?.house_system}`);
    log(`  utc: ${chart.input?.utc}`);
    log('');
    log('── ángulos ──');
    log('  ' + fmtPos('ASC', chart.angles?.ASC));
    log('  ' + fmtPos('MC', chart.angles?.MC));
    log('  ' + fmtPos('DC', chart.angles?.DC));
    log('  ' + fmtPos('IC', chart.angles?.IC));
    log('');
    log('── planetas (muestra) ──');
    for (const key of ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS']) {
      const p = chart.planets?.[key];
      if (p) log(`  ${key}: ${p.sign} ${p.deg}° ${p.min}' (${p.longitude?.toFixed(4)}°)${p.isRetro ? ' R' : ''}`);
    }
    log(`  Total cuerpos: ${Object.keys(chart.planets || {}).length}`);
    log('');
    log(`── casas Placidus: ${chart.houses?.length ?? 0} cúspides ──`);
    if (chart.houses?.[0]) {
      log('  Casa 1: ' + fmtPos('', chart.houses[0]));
      log('  Casa 10: ' + fmtPos('', chart.houses[9]));
    }
    log('');
    log(`── aspectos: ${chart.aspects?.length ?? 0} ──`);
    (chart.aspects || []).slice(0, 5).forEach(a => {
      log(`  ${a.p1} ${a.aspect} ${a.p2} · orbe ${a.formattedOrb}${a.isApplying ? ' · applying' : ''}`);
    });

    log('');
    log('── estructura top-level ──');
    log('  keys: ' + Object.keys(chart).join(', '));

    window.__natalTestResult = {
      ok: true,
      timings: { wasmMs: tWasm, planetaryMs: tPe, chartMs: tChart, totalMs: tTotal },
      chart
    };
    log('');
    log('TEST PASSED — núcleo operativo en entorno Kairos Maps', 'ok');
  } catch (err) {
    log(err.message || String(err), 'err');
    if (err.stack) log(err.stack.split('\n').slice(0, 6).join('\n'), 'err');
    window.__natalTestResult = { ok: false, error: err.message, stack: err.stack };
    log('TEST FAILED', 'err');
  }
}

run();
