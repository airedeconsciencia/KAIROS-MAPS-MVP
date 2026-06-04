#!/usr/bin/env bash
# Kairos Maps — Smoke City Premium Composition (Fase 3.8e DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"
INTERP="$ROOT/src/content/interpretations.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — City Premium Composition smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$SCORER" "$ASTRO" "$INTERP" "$PREMIUM"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  echo "Descargando astronomy-engine…"
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE SCORER ASTRO INTERP PREMIUM ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (typeof ctx.Astronomy === 'undefined' && ctx.window && ctx.window.Astronomy) {
  ctx.Astronomy = ctx.window.Astronomy;
}

[
  process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE,
  process.env.COMPOSITION,
  process.env.BRIDGE,
  process.env.SCORER,
  process.env.ASTRO,
  process.env.INTERP,
  process.env.PREMIUM
].forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Premium = ctx.window.KairosCityPremiumComposition;

const CITIES = [
  { name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { name: 'Toronto', country: 'Canadá', lat: 43.6532, lon: -79.3832 },
  { name: 'Ciudad del Cabo', country: 'Sudáfrica', lat: -33.9249, lon: 18.4241 }
];

const GOALS = ['amor', 'trabajo', 'descanso'];

const robertoUtcIso = (function () {
  try {
    return execSync(
      "python3 -c \"from datetime import datetime; import zoneinfo; " +
      "dt=datetime(1973,5,29,7,30,tzinfo=zoneinfo.ZoneInfo('Europe/Madrid')); " +
      "print(dt.astimezone(zoneinfo.ZoneInfo('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z'))\"",
      { encoding: 'utf8' }
    ).trim();
  } catch (e) {
    return '1973-05-29T05:30:00.000Z';
  }
})();

const robertoUtc = vm.runInContext("new Date('" + robertoUtcIso + "')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const robertoComposition = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' });
const bridgeProfile = robertoComposition.meta && robertoComposition.meta.bridgeProfile;

function buildInput(goalId) {
  const goalContext = GS.buildContext({ mainGoal: goalId });
  const bridgeResult = Bridge.buildBridge({
    tags: bridgeProfile.tags,
    themes: bridgeProfile.themes,
    tensionMode: bridgeProfile.tensionMode === true,
    mapLines: lines.map(function (l) {
      return { id: l.id, planet: l.planet, angle: l.angle };
    }),
    goalContext: goalContext
  });
  return {
    lines: lines,
    goalContext: goalContext,
    bridgeResult: bridgeResult,
    options: {
      proxKm: Scorer.PROX_KM,
      maxSuggestions: 3,
      minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
}

function wordCount(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert(
  'Compositor existe (KairosCityPremiumComposition)',
  Premium && typeof Premium.composeCityReading === 'function',
  'schema=' + (Premium && Premium.SCHEMA_VERSION)
);

const samples = [];
const bodies = [];

GOALS.forEach(function (goalId) {
  const input = buildInput(goalId);
  CITIES.forEach(function (city) {
    const ranked = Scorer.rankInfluences(city, input);
    const scored = Scorer.scoreCity(city, input);
    const reading = Premium.composeCityReading({
      city: city,
      goal: goalId,
      relevantInfluences: ranked.slice(0, 5),
      bridgeProfile: bridgeProfile,
      profile: { firstName: 'Roberto' },
      score: scored ? scored.score : null
    });
    const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
    bodies.push(full);
    samples.push({
      city: city.name,
      goal: goalId,
      reading: reading
    });
  });
});

const lisboaAmor = samples.find(function (s) { return s.city === 'Lisboa' && s.goal === 'amor'; });
const torontoTrabajo = samples.find(function (s) { return s.city === 'Toronto' && s.goal === 'trabajo'; });

assert(
  'Lectura Lisboa amor ok:true',
  lisboaAmor && lisboaAmor.reading.ok === true,
  lisboaAmor ? 'words=' + lisboaAmor.reading.meta.wordCount : 'missing'
);

assert(
  'Longitud mínima (≥600) en todas las muestras',
  samples.every(function (s) { return s.reading.meta.wordCount >= Premium.MIN_WORDS; }),
  samples.map(function (s) { return s.city + '/' + s.goal + '=' + s.reading.meta.wordCount; }).join(' · ')
);

assert(
  'Longitud máxima (≤1800) en todas las muestras',
  samples.every(function (s) { return s.reading.meta.wordCount <= Premium.MAX_WORDS; }),
  null
);

assert(
  'Mínimo 5 secciones por lectura',
  samples.every(function (s) { return s.reading.sections.length >= 5; }),
  lisboaAmor ? lisboaAmor.reading.sections.map(function (x) { return x.title; }).join(' | ') : null
);

const dup = new Map();
let dupFail = false;
bodies.forEach(function (t, idx) {
  const norm = t.replace(/\s+/g, ' ').trim().toLowerCase();
  if (dup.has(norm)) {
    dupFail = true;
    console.log('  Duplicado exacto: muestra ' + (dup.get(norm) + 1) + ' ≈ ' + (idx + 1));
  } else {
    dup.set(norm, idx);
  }
});
assert('Sin duplicados exactos entre muestras', !dupFail, bodies.length + ' lecturas');

let forbiddenFail = false;
samples.forEach(function (s) {
  const lower = s.reading.sections.map(function (x) { return x.body; }).join(' ').toLowerCase();
  Premium.FORBIDDEN.forEach(function (p) {
    if (lower.indexOf(p) !== -1) {
      forbiddenFail = true;
      console.log('  Prohibida en ' + s.city + '/' + s.goal + ': ' + p);
    }
  });
});
assert('Sin frases prohibidas (voice_tone)', !forbiddenFail, null);

const detInput = buildInput('amor');
const lisboa = CITIES[0];
const ranked = Scorer.rankInfluences(lisboa, detInput);
const a = Premium.composeCityReading({
  city: lisboa,
  goal: 'amor',
  relevantInfluences: ranked.slice(0, 5),
  bridgeProfile: bridgeProfile,
  profile: { firstName: 'Roberto' }
});
const b = Premium.composeCityReading({
  city: lisboa,
  goal: 'amor',
  relevantInfluences: ranked.slice(0, 5),
  bridgeProfile: bridgeProfile,
  profile: { firstName: 'Roberto' }
});
assert(
  'Determinismo estable (Lisboa amor ×2)',
  JSON.stringify(a.sections) === JSON.stringify(b.sections),
  'seed=' + a.meta.deterministicSeed
);

console.log('\n' + '═'.repeat(60));
console.log('Ejemplo Toronto trabajo —', torontoTrabajo.reading.meta.wordCount, 'palabras');
console.log('Título:', torontoTrabajo.reading.title);
torontoTrabajo.reading.sections.forEach(function (sec) {
  console.log('\n## ' + sec.title + ' (' + wordCount(sec.body) + ' palabras)');
  console.log(sec.body.slice(0, 280) + (sec.body.length > 280 ? '…' : ''));
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
