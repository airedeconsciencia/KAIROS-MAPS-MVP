#!/usr/bin/env bash
# Kairos Maps — Smoke Country × Premium Composition (Fase 3.8f.4 DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
CATALOG="$ROOT/src/content/cities-catalog.js"
ARCHETYPES="$ROOT/src/content/country-archetypes.js"
COUNTRY_SERVICE="$ROOT/src/services/country-archetype-service.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"
INTERP="$ROOT/src/content/interpretations.js"
BLOCKS="$ROOT/src/content/premium-blocks.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Country × Premium Composition (3.8f.4)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" \
  "$ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$INTERP" "$BLOCKS" \
  "$KNOWLEDGE" "$NARRATIVE" "$PREMIUM"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG ARCHETYPES COUNTRY_SERVICE \
  SCORER ASTRO INTERP BLOCKS KNOWLEDGE NARRATIVE PREMIUM ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.CATALOG, process.env.ARCHETYPES,
  process.env.COUNTRY_SERVICE, process.env.SCORER, process.env.ASTRO,
  process.env.INTERP, process.env.BLOCKS, process.env.KNOWLEDGE,
  process.env.NARRATIVE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Premium = ctx.window.KairosCityPremiumComposition;
const Catalog = ctx.window.KairosCitiesCatalog;

const DISALLOWED = ['favorece', 'desafia', 'aprovecha'];
const ALLOWED = ['sintesis', 'observar', 'integracion'];

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

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

function composeReading(city, goal) {
  const ranked = Scorer.rankInfluences(city, buildInput(goal));
  return Premium.composeCityReading({
    city: city,
    goal: goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bp,
    profile: { firstName: 'Roberto' }
  });
}

const CASES = [
  { label: 'Lisboa · Portugal · amor', city: Catalog.findCityByName('Lisboa'), goal: 'amor' },
  { label: 'Toronto · Canadá · trabajo', city: Catalog.findCityByName('Toronto'), goal: 'trabajo' },
  { label: 'Ciudad del Cabo · Sudáfrica · descanso', city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'descanso' },
  { label: 'Tokio · Japón · trabajo', city: Catalog.findCityByName('Tokio'), goal: 'trabajo' },
  {
    label: 'Barcelona · España · amor',
    city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 },
    goal: 'amor'
  }
];

assert(
  'Compositor schema 3.8f.4',
  Premium && Premium.SCHEMA_VERSION.indexOf('3.8f.4') === 0,
  'schema=' + (Premium && Premium.SCHEMA_VERSION)
);

const results = CASES.map(function (c) {
  return { label: c.label, reading: composeReading(c.city, c.goal) };
});

assert(
  'Lecturas ok en países curados (5 casos)',
  results.every(function (s) { return s.reading.ok; }),
  results.map(function (s) {
    return s.label + ' ok=' + s.reading.ok + ' words=' + s.reading.meta.wordCount;
  }).join(' · ')
);

assert(
  'countryContext ok en meta (curados)',
  results.every(function (s) {
    var cc = s.reading.meta.countryContext;
    return cc && cc.ok === true && cc.lines && cc.lines.length <= 2;
  }),
  results.map(function (s) {
    var cc = s.reading.meta.countryContext;
    return s.label + ' lines=' + (cc ? cc.lines.length : 0);
  }).join(' · ')
);

assert(
  'countryLinesUsed ≤ 2',
  results.every(function (s) { return (s.reading.meta.countryLinesUsed || 0) <= 2; }),
  results.map(function (s) {
    return s.label + '=' + s.reading.meta.countryLinesUsed;
  }).join(' · ')
);

assert(
  'countryLinesUsed > 0 en curados',
  results.every(function (s) { return (s.reading.meta.countryLinesUsed || 0) >= 1; }),
  null
);

assert(
  'Máximo 1 línea país por sección (sectionsUsed)',
  results.every(function (s) {
    var used = s.reading.meta.countrySectionsUsed || [];
    var seen = {};
    return used.every(function (sec) {
      if (seen[sec]) return false;
      seen[sec] = true;
      return ALLOWED.indexOf(sec) !== -1;
    });
  }),
  null
);

let disallowedFail = false;
results.forEach(function (s) {
  var cc = s.reading.meta.countryContext;
  if (!cc || !cc.lines) return;
  cc.lines.forEach(function (line) {
    if (DISALLOWED.indexOf(line.section) !== -1) {
      disallowedFail = true;
      console.log('  Línea país en sección prohibida ' + line.section + ' · ' + s.label);
    }
  });
  (s.reading.meta.countrySectionsUsed || []).forEach(function (sec) {
    if (DISALLOWED.indexOf(sec) !== -1) {
      disallowedFail = true;
      console.log('  sectionsUsed prohibida ' + sec + ' · ' + s.label);
    }
  });
});
assert('Sin líneas país en favorece/desafía/aprovecha', !disallowedFail, null);

let presenceFail = false;
results.forEach(function (s) {
  var bundle = s.reading.sections.map(function (sec) { return sec.body; }).join(' ').toLowerCase();
  if (bundle.indexOf('quizá') === -1 && bundle.indexOf('puede que') === -1 &&
      bundle.indexOf('tal vez') === -1) {
    presenceFail = true;
    console.log('  Falta voz experiencial en ' + s.label);
  }
});
assert('Human presence preservado (voz experiencial en lectura)', !presenceFail, null);

let atmosFail = false;
results.forEach(function (s) {
  if ((s.reading.meta.atmosphereLinesUsed || 0) < 1) {
    atmosFail = true;
    console.log('  Falta atmosphere en ' + s.label);
  }
  var nc = s.reading.meta.narrativeContext;
  if (!nc || !nc.cityAtmosphere || !nc.cityAtmosphere.citySlug) {
    atmosFail = true;
    console.log('  Sin cityAtmosphere en ' + s.label);
  }
});
assert('City atmosphere preservada (5 ciudades piloto)', !atmosFail, null);

const kenya = composeReading(
  { name: 'Nairobi', country: 'Kenia', lat: -1.2921, lon: 36.8219 },
  'amor'
);
assert(
  'Fail-soft país no curado (Kenia)',
  kenya.meta.countryContext && kenya.meta.countryContext.ok === false &&
    (kenya.meta.countryLinesUsed || 0) === 0,
  'ok=' + kenya.ok + ' reason=' + (kenya.meta.countryContext && kenya.meta.countryContext.meta && kenya.meta.countryContext.meta.reason)
);

const lisboaA = composeReading(Catalog.findCityByName('Lisboa'), 'amor');
const lisboaB = composeReading(Catalog.findCityByName('Lisboa'), 'amor');
assert(
  'Determinismo estable (Lisboa amor ×2)',
  JSON.stringify(lisboaA.meta.countrySectionsUsed) === JSON.stringify(lisboaB.meta.countrySectionsUsed) &&
    lisboaA.meta.countryLinesUsed === lisboaB.meta.countryLinesUsed,
  'linesUsed=' + lisboaA.meta.countryLinesUsed
);

console.log('\n' + '═'.repeat(60));
console.log('Country × Composition — casos piloto');
results.forEach(function (s) {
  var m = s.reading.meta;
  var cc = m.countryContext;
  console.log('  ' + s.label);
  console.log('    words=' + m.wordCount + ' · countryLinesUsed=' + m.countryLinesUsed);
  console.log('    sectionsUsed=' + (m.countrySectionsUsed || []).join(', '));
  console.log('    atmosphereLinesUsed=' + m.atmosphereLinesUsed);
  console.log('    humanPresenceTransforms=' + m.humanPresenceTransforms);
  (cc.lines || []).forEach(function (line) {
    var sec = s.reading.sections.find(function (x) { return x.id === line.section; });
    var present = sec && Premium._dev.countryLinePresentIn(sec.body, line.text);
    console.log('    [' + line.section + '] present=' + present + ' · ' + line.text.slice(0, 72) + '…');
  });
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
