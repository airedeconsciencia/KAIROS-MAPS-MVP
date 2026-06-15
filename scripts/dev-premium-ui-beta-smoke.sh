#!/usr/bin/env bash
# Kairos Maps — Smoke Premium UI Beta (Fase 3.8g.2 DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

INDEX="$ROOT/src/index.html"
APP="$ROOT/src/ui/app.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
CATALOG="$ROOT/src/content/cities-catalog.js"
RESOLVER="$ROOT/src/services/editorial-family-resolver.js"
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
echo " KAIROS MAPS — Premium UI Beta smoke (3.8h.2b)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$INDEX" "$APP" "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" "$RESOLVER" \
  "$ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$INTERP" "$BLOCKS" "$KNOWLEDGE" "$NARRATIVE" "$PREMIUM"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export INDEX APP GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG RESOLVER ARCHETYPES COUNTRY_SERVICE \
  SCORER ASTRO INTERP BLOCKS KNOWLEDGE NARRATIVE PREMIUM ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const indexHtml = fs.readFileSync(process.env.INDEX, 'utf8');
const appJs = fs.readFileSync(process.env.APP, 'utf8');

const scriptOrder = [
  'content/country-archetypes.js',
  'services/country-archetype-service.js',
  'content/premium-blocks.js',
  'services/editorial-family-resolver.js',
  'services/narrative-intelligence-service.js',
  'services/premium-knowledge-service.js',
  'services/city-premium-composition-service.js'
];

let lastIdx = -1;
scriptOrder.forEach(function (needle) {
  const idx = indexHtml.indexOf(needle);
  if (idx === -1 || idx <= lastIdx) {
    assert('index.html carga ' + needle + ' en orden', false, 'idx=' + idx + ' last=' + lastIdx);
    return;
  }
  lastIdx = idx;
});
assert(
  'index.html carga 7 scripts premium en orden',
  lastIdx > indexHtml.indexOf('natal-map-bridge-service.js') &&
    lastIdx < indexHtml.indexOf('engines/astro.js'),
  'premium block entre bridge y astro.js'
);

assert(
  'index.html cache-bust editorial-family-resolver (f2.2d5)',
  indexHtml.indexOf('services/editorial-family-resolver.js?v=f2.2d5') !== -1,
  null
);

assert(
  'index.html incluye toggle interp-mode-toggle',
  indexHtml.indexOf('id="interp-mode-toggle"') !== -1 &&
    indexHtml.indexOf('data-mode="classic"') !== -1 &&
    indexHtml.indexOf('data-mode="deep"') !== -1,
  null
);

assert(
  'app.js define isPremiumBetaEnabled',
  /function isPremiumBetaEnabled\s*\(\)/.test(appJs),
  null
);

assert(
  'app.js define renderPremiumReading y fallback classic',
  /function renderPremiumReading\s*\(/.test(appJs) &&
    /function renderClassicInterpretationBody\s*\(/.test(appJs) &&
    /state\.readingMode = 'classic'/.test(appJs),
  null
);

function betaFromQuery(qs) {
  try {
    return new URLSearchParams(qs).get('premium') === '1';
  } catch (e) {
    return false;
  }
}

assert('sin ?premium=1 → beta off (query sim)', !betaFromQuery(''), null);
assert('con ?premium=1 → beta on (query sim)', betaFromQuery('?premium=1'), null);

const ctx = { window: {}, console: console, localStorage: { _m: {}, getItem: function (k) { return this._m[k] || null; }, setItem: function (k, v) { this._m[k] = v; } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.CATALOG, process.env.RESOLVER, process.env.ARCHETYPES,
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
const EFR = ctx.window.KairosEditorialFamily;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Knowledge = ctx.window.KairosPremiumKnowledge;

assert(
  'window.KairosEditorialFamily existe (carga app simulada)',
  !!EFR && typeof EFR.resolveEditorialFamily === 'function',
  'schema=' + (EFR && EFR.SCHEMA_VERSION)
);

assert(
  '10 familias registradas (F2.7c)',
  EFR.REGISTERED_FAMILIES.length === 10 && EFR.isRegisteredFamily('SOUTH_ASIAN') === true,
  'count=' + EFR.REGISTERED_FAMILIES.length
);

assert(
  'Delhi / india → SOUTH_ASIAN',
  EFR.resolveEditorialFamily({ cityName: 'Delhi', countryId: 'india' }) === 'SOUTH_ASIAN',
  EFR.resolveEditorialFamily({ cityName: 'Delhi', countryId: 'india' })
);

const nySlug = 'united_states';
const nyNarrative = Narrative.resolveRegionFamily('Nueva York', nySlug);
const nyPremium = Premium.resolveRegionFamily('Nueva York', nySlug);
const nyKnowledge = Knowledge.resolveRegionFamily('Nueva York', nySlug);
assert(
  'Narrative.resolveRegionFamily(Nueva York, united_states) → ANGLO',
  nyNarrative === 'ANGLO',
  'got=' + nyNarrative
);
assert(
  'Premium.resolveRegionFamily(Nueva York, united_states) → ANGLO',
  nyPremium === 'ANGLO',
  'got=' + nyPremium
);
assert(
  'Knowledge.resolveRegionFamily(Nueva York, united_states) → ANGLO',
  nyKnowledge === 'ANGLO',
  'got=' + nyKnowledge
);

const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(utc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

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

const PILOT_CITIES = [
  Catalog.findCityByName('Lisboa'),
  Catalog.findCityByName('Toronto'),
  Catalog.findCityByName('Ciudad del Cabo'),
  { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 },
  Catalog.findCityByName('Tokio')
];

const GOALS = ['amor', 'trabajo', 'descanso'];
let allOk = true;
const sectionIds = ['sintesis', 'favorece', 'desafia', 'aprovecha', 'observar', 'integracion'];

PILOT_CITIES.forEach(function (city, ci) {
  if (!city) {
    allOk = false;
    return;
  }
  const goalId = GOALS[ci % GOALS.length];
  const input = buildInput(goalId);
  const ranked = Scorer.rankInfluences(city, input);
  const reading = Premium.composeCityReading({
    city: city,
    goal: goalId,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
  const ids = (reading.sections || []).map(function (s) { return s.id; });
  const ok = reading.ok === true &&
    reading.meta.wordCount >= Premium.MIN_WORDS &&
    sectionIds.every(function (id) { return ids.indexOf(id) !== -1; });
  if (!ok) allOk = false;
});

assert(
  'premium OK en Lisboa/Toronto/Cabo/Barcelona/Tokio (5 ciudades piloto)',
  allOk,
  'goals rotados amor/trabajo/descanso'
);

const lisboa = Catalog.findCityByName('Lisboa');
const sparseReading = Premium.composeCityReading({
  city: lisboa,
  goal: 'amor',
  relevantInfluences: [],
  bridgeProfile: bridgeProfile,
  profile: { firstName: 'Roberto' }
});
assert(
  'fail-soft: sin influencias → lectura OK (zona neutra)',
  sparseReading.ok === true &&
    sparseReading.meta &&
    sparseReading.meta.sparseInfluencesFallback === true &&
    sparseReading.meta.wordCount >= Premium.MIN_WORDS,
  'ok=' + sparseReading.ok + ' sparse=' +
    (sparseReading.meta && sparseReading.meta.sparseInfluencesFallback) +
    ' words=' + (sparseReading.meta && sparseReading.meta.wordCount)
);

assert(
  'compositor global disponible tras carga producto simulada',
  Premium && typeof Premium.composeCityReading === 'function',
  'schema=' + Premium.SCHEMA_VERSION
);

console.log('');
console.log('══════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' ALL PASS — Premium UI Beta smoke (3.8h.2b)');
console.log('══════════════════════════════════════════════════════════');
NODE
