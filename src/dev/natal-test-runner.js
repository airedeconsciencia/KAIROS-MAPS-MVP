/**
 * Fase 2.1a-2b — Test aislado vía KairosChartService
 * No conectado a app.js ni index.html principal.
 */
'use strict';

const TEST_CASE = {
  label: 'Golden G1 — Maó, Menorca',
  date: '1990-06-12',
  time: '14:35',
  lat: 39.8885,
  lon: 4.2658,
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

function logChart(chart, label) {
  log('');
  log(`── ${label} ──`);
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
}

async function run() {
  const t0 = performance.now();

  try {
    const S = window.KairosChartService;
    if (!S) throw new Error('KairosChartService no disponible — cargar services/chart-service.js');

    log('Caso: ' + TEST_CASE.label);
    log(`Input: ${TEST_CASE.date} ${TEST_CASE.time} | TZ ${TEST_CASE.timezone} | ${TEST_CASE.lat}, ${TEST_CASE.lon}`);

    if (typeof window.luxon === 'undefined') throw new Error('Luxon no disponible');
    log('Luxon: OK');
    log('KairosChartService: OK');

    log('initNatalEngine() — 1ª llamada…');
    const tInit1Start = performance.now();
    const init1 = await S.initNatalEngine();
    const tInit1 = performance.now() - tInit1Start;
    log(`initNatalEngine (1): OK (${tInit1.toFixed(0)} ms)`, 'ok');
    log(`  wasmMs: ${init1.timings?.wasmMs ?? '—'} · planetaryMs: ${init1.timings?.planetaryMs ?? '—'} · totalMs: ${init1.timings?.totalMs ?? '—'}`);

    if (!window.swisseph_native?.SweModule) {
      throw new Error('swisseph_native no inicializado tras initNatalEngine');
    }
    log(`  swisseph_native / SweModule: OK`, 'ok');

    log('initNatalEngine() — 2ª llamada (singleton)…');
    const tInit2Start = performance.now();
    const init2 = await S.initNatalEngine();
    const tInit2 = performance.now() - tInit2Start;
    log(`initNatalEngine (2): OK (${tInit2.toFixed(0)} ms) cached=${!!init2.timings?.cached}`, init2.timings?.cached ? 'ok' : 'warn');

    log('generateNatalChart() — 1ª llamada…');
    const tChart1Start = performance.now();
    const chart1 = await S.generateNatalChart(TEST_CASE);
    const tChart1 = performance.now() - tChart1Start;
    log(`generateNatalChart (1): OK (${tChart1.toFixed(0)} ms) fromCache=${!!chart1.fromCache}`, 'ok');

    log('generateNatalChart() — 2ª llamada (cache)…');
    const tChart2Start = performance.now();
    const chart2 = await S.generateNatalChart(TEST_CASE);
    const tChart2 = performance.now() - tChart2Start;
    log(`generateNatalChart (2): OK (${tChart2.toFixed(0)} ms) fromCache=${!!chart2.fromCache}`, chart2.fromCache ? 'ok' : 'warn');

    if (!chart2.fromCache) {
      log('Cache no activada en 2ª llamada', 'warn');
    }

    const status = S.getStatus();
    log('');
    log('── KairosChartService.getStatus() ──');
    log(`  ready: ${status.ready}`);
    log(`  initInFlight: ${status.initInFlight}`);
    log(`  callCount: ${status.callCount}`);
    log(`  cacheSize: ${status.cacheSize}`);
    log(`  hasSwisseph: ${status.hasSwisseph}`);
    log(`  swephPathReady: ${status.swephPathReady}`);
    if (status.lastError) log(`  lastError: ${status.lastError.code} — ${status.lastError.message}`, 'warn');

    const tTotal = performance.now() - t0;
    log('');
    log(`Tiempo total harness: ${tTotal.toFixed(0)} ms`);

    logChart(chart1, 'resultado carta (1ª llamada)');

    window.__natalTestResult = {
      ok: true,
      timings: {
        init1Ms: tInit1,
        init2Ms: tInit2,
        chart1Ms: tChart1,
        chart2Ms: tChart2,
        totalMs: tTotal,
        serviceTimings: init1.timings
      },
      chart: chart1,
      chart2FromCache: chart2.fromCache,
      status
    };

    log('');
    log('TEST PASSED — chart-service operativo vía harness dev', 'ok');
  } catch (err) {
    const code = err.code ? ` [${err.code}]` : '';
    log((err.message || String(err)) + code, 'err');
    if (err.stack) log(err.stack.split('\n').slice(0, 6).join('\n'), 'err');
    window.__natalTestResult = { ok: false, error: err.message, code: err.code, stack: err.stack };
    log('TEST FAILED', 'err');
  }
}

run();
