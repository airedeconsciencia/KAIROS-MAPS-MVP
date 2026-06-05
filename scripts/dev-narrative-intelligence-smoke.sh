#!/usr/bin/env bash
# Kairos Maps — Smoke Narrative Intelligence (Fase 3.8e.9b DEV)
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
BLOCKS="$ROOT/src/content/premium-blocks.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Narrative Intelligence smoke (3.8e.9b)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$SCORER" "$ASTRO" "$BLOCKS" "$NARRATIVE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE SCORER ASTRO BLOCKS NARRATIVE ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.SCORER, process.env.ASTRO, process.env.BLOCKS, process.env.NARRATIVE
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Narrative = ctx.window.KairosNarrativeIntelligence;

const CITIES = [
  { name: 'Lisboa', lat: 38.7223, lon: -9.1393 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { name: 'Ciudad del Cabo', lat: -33.9249, lon: 18.4241 }
];
const CASES = [
  { city: 0, goal: 'amor' },
  { city: 1, goal: 'trabajo' },
  { city: 2, goal: 'descanso' }
];

const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(utc);
const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function buildInput(goalId) {
  const g = GS.buildContext({ mainGoal: goalId });
  const br = Bridge.buildBridge({
    tags: bp.tags, themes: bp.themes, tensionMode: bp.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
    goalContext: g
  });
  return {
    lines, goalContext: g, bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
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
  'Servicio existe (schema 3.8e.9a)',
  Narrative && Narrative.SCHEMA_VERSION.indexOf('3.8e.9a') === 0,
  'schema=' + (Narrative && Narrative.SCHEMA_VERSION)
);

const samples = [];
CASES.forEach(function (c) {
  const city = CITIES[c.city];
  const input = buildInput(c.goal);
  const ranked = Scorer.rankInfluences(city, input);
  const r = Narrative.deriveNarrativeContext({
    city: city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bp
  });
  samples.push({ city: city.name, goal: c.goal, result: r });
});

function hasField(nc, path) {
  var parts = path.split('.');
  var cur = nc;
  for (var i = 0; i < parts.length; i++) {
    if (!cur || cur[parts[i]] == null || cur[parts[i]] === '') return false;
    cur = cur[parts[i]];
  }
  return true;
}

assert(
  'dominantTheme presente (3 casos)',
  samples.every(function (s) { return hasField(s.result.narrativeContext, 'dominantTheme.label'); }),
  null
);
assert(
  'centralTension presente',
  samples.every(function (s) { return hasField(s.result.narrativeContext, 'centralTension.label'); }),
  null
);
assert(
  'mainOpportunity presente',
  samples.every(function (s) { return hasField(s.result.narrativeContext, 'mainOpportunity.label'); }),
  null
);
assert(
  'guidingQuestion presente',
  samples.every(function (s) { return hasField(s.result.narrativeContext, 'guidingQuestion'); }),
  null
);
assert(
  'narrativeSummary presente',
  samples.every(function (s) { return hasField(s.result.narrativeContext, 'narrativeSummary'); }),
  null
);
assert(
  'Capa editorial humanizada (humanTheme, humanConflict, humanOpportunity, humanClosing)',
  samples.every(function (s) {
    var nc = s.result.narrativeContext;
    return hasField(nc, 'humanTheme') && hasField(nc, 'humanConflict') &&
      hasField(nc, 'humanOpportunity') && hasField(nc, 'humanClosing');
  }),
  null
);
assert(
  'Voz premium: sin tono clínico en bundle humanizado',
  samples.every(function (s) {
    var bundle = [
      s.result.narrativeContext.humanTheme,
      s.result.narrativeContext.humanConflict,
      s.result.narrativeContext.humanOpportunity,
      s.result.narrativeContext.humanObserve,
      s.result.narrativeContext.humanClosing
    ].join(' ').toLowerCase();
    return bundle.indexOf('conviene') === -1 &&
      bundle.indexOf('un apunte útil') === -1 &&
      bundle.indexOf('no hace falta') === -1;
  }),
  null
);
assert(
  'Sin citar labels internos en texto humanizado',
  samples.every(function (s) {
    var nc = s.result.narrativeContext;
    var bundle = [nc.humanTheme, nc.humanConflict, nc.humanOpportunity, nc.narrativeSummary].join(' ').toLowerCase();
    return bundle.indexOf('«') === -1 &&
      bundle.indexOf('nota ') === -1 &&
      bundle.indexOf(nc.dominantTheme.label.toLowerCase().slice(0, 20)) === -1;
  }),
  null
);
assert(
  'deepInfluenceKeys <= 2',
  samples.every(function (s) {
    return s.result.narrativeContext.deepInfluenceKeys.length <= 2 &&
      s.result.narrativeContext.deepInfluenceKeys.length >= 1;
  }),
  samples.map(function (s) {
    return s.city + '/' + s.goal + '=' + s.result.narrativeContext.deepInfluenceKeys.join(',');
  }).join(' · ')
);

const lisboa = samples[0];
const detA = Narrative.deriveNarrativeContext({
  city: CITIES[0], goal: 'amor',
  relevantInfluences: Scorer.rankInfluences(CITIES[0], buildInput('amor')).slice(0, 5),
  bridgeProfile: bp
});
const detB = Narrative.deriveNarrativeContext({
  city: CITIES[0], goal: 'amor',
  relevantInfluences: Scorer.rankInfluences(CITIES[0], buildInput('amor')).slice(0, 5),
  bridgeProfile: bp
});
assert(
  'Determinismo estable (Lisboa amor ×2)',
  JSON.stringify(detA.narrativeContext) === JSON.stringify(detB.narrativeContext),
  'seed=' + detA.meta.deterministicSeed
);

assert(
  'cityAtmosphere presente (Lisboa, Toronto, Cabo)',
  samples.every(function (s) {
    var nc = s.result.narrativeContext;
    return nc.cityAtmosphere && nc.cityAtmosphere.citySlug &&
      nc.cityRhythm && nc.cityEmotionalTexture && nc.cityGoalTone &&
      nc.cityImages && nc.atmosphereWarnings &&
      nc.cityAtmosphere.selectedLines && nc.cityAtmosphere.selectedLines.length >= 3 &&
      nc.cityAtmosphere.selectedLines.length <= 5;
  }),
  samples.map(function (s) {
    var atm = s.result.narrativeContext.cityAtmosphere;
    return s.city + '=' + (atm ? atm.citySlug + ' lines=' + atm.selectedLines.length : 'missing');
  }).join(' · ')
);

const barcelona = Narrative.deriveNarrativeContext({
  city: { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
  goal: 'amor',
  relevantInfluences: Scorer.rankInfluences(
    { name: 'Barcelona', lat: 41.3874, lon: 2.1686 },
    buildInput('amor')
  ).slice(0, 5),
  bridgeProfile: bp
});
assert(
  'Ciudad desconocida fail-soft (sin cityAtmosphere)',
  barcelona.ok && !barcelona.narrativeContext.cityAtmosphere &&
    !barcelona.narrativeContext.cityRhythm,
  'Barcelona citySlug=' + barcelona.meta.citySlug
);

const tourismTokens = Narrative.GLOBAL_TOURISM_TOKENS || [];
let tourismFail = false;
samples.forEach(function (s) {
  var bundle = [
    s.result.narrativeContext.narrativeSummary,
    s.result.narrativeContext.humanTheme,
    s.result.narrativeContext.humanObserve,
    (s.result.narrativeContext.cityAtmosphere.selectedLines || []).join(' ')
  ].join(' ').toLowerCase();
  tourismTokens.forEach(function (tok) {
    if (bundle.indexOf(tok) !== -1) {
      tourismFail = true;
      console.log('  Token turístico "' + tok + '" en ' + s.city + '/' + s.goal);
    }
  });
});
assert('Sin tokens turísticos prohibidos (lab 3)', !tourismFail, null);

console.log('\n' + '═'.repeat(60));
console.log('Lab — spine por caso');
samples.forEach(function (s) {
  var nc = s.result.narrativeContext;
  console.log('  ' + s.city + ' / ' + s.goal);
  console.log('    humanTheme:', nc.humanTheme);
  console.log('    humanConflict:', nc.humanConflict);
  console.log('    humanOpportunity:', nc.humanOpportunity);
  console.log('    humanClosing:', nc.humanClosing);
  console.log('    pregunta:', nc.guidingQuestion);
  if (nc.cityAtmosphere) {
    console.log('    citySlug:', nc.cityAtmosphere.citySlug);
    console.log('    selectedLines:');
    nc.cityAtmosphere.selectedLines.forEach(function (line) {
      console.log('      ·', line);
    });
  }
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
