#!/usr/bin/env bash
# Kairos Maps — Smoke Unified Editorial Family Resolver (Fase 3.8h.2 DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

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
echo " KAIROS MAPS — Editorial Family Resolver smoke (3.8h.2)"
echo " Scope: resolver maestro · split-brain · slug canónico"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" "$RESOLVER" \
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

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG RESOLVER ARCHETYPES COUNTRY_SERVICE \
  SCORER ASTRO INTERP BLOCKS KNOWLEDGE NARRATIVE PREMIUM ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.CATALOG, process.env.RESOLVER,
  process.env.ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.KNOWLEDGE,
  process.env.NARRATIVE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const EFR = ctx.window.KairosEditorialFamily;
const Knowledge = ctx.window.KairosPremiumKnowledge;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Premium = ctx.window.KairosCityPremiumComposition;
const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert('KairosEditorialFamily cargado', !!EFR, 'schema=' + (EFR && EFR.SCHEMA_VERSION));
assert(
  '30 países en COUNTRY_EDITORIAL_FAMILY',
  Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length === 30,
  'count=' + Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length
);
assert(
  '27 ciudades del catálogo resuelven familia',
  Catalog.CITIES.length === 27,
  'cities=' + Catalog.CITIES.length
);

const countries = Catalog.getCountries();
assert('26 países en catálogo', countries.length === 26, 'count=' + countries.length);

const countryMismatches = [];
countries.forEach(function (entry) {
  const coerced = EFR.coerceCountryId(entry.name);
  if (coerced !== entry.countryId) {
    countryMismatches.push(entry.name + ': expected=' + entry.countryId + ' got=' + coerced);
  }
  const family = EFR.resolveEditorialFamily({ cityName: '', countryId: entry.countryId });
  if (!family || family === 'undefined') {
    countryMismatches.push(entry.countryId + ': missing family');
  }
});
assert('country slug mismatches = 0', countryMismatches.length === 0, countryMismatches.join(' · '));

const cityFamilies = {};
Catalog.CITIES.forEach(function (city) {
  const slug = EFR.coerceCountryId(city.country);
  const family = EFR.resolveEditorialFamily({ cityName: city.name, countryId: slug });
  cityFamilies[city.name] = family;
});
assert(
  '27 ciudades resuelven familia editorial',
  Object.keys(cityFamilies).length === 27,
  Object.keys(cityFamilies).length + ' ciudades'
);

const SPLIT_BRAIN_CASES = [
  { city: 'Londres', country: 'Reino Unido', expected: 'ANGLO' },
  { city: 'Atenas', country: 'Grecia', expected: 'MEDITERRANEAN' },
  { city: 'Nueva York', country: 'EE. UU.', expected: 'ANGLO' },
  { city: 'Seúl', country: 'Corea del Sur', expected: 'EAST_ASIAN' },
  { city: 'Ciudad del Cabo', country: 'Sudáfrica', expected: 'AFRICAN_COASTAL' },
  { city: 'El Cairo', country: 'Egipto', expected: 'AFRICAN_COASTAL' },
  { city: 'Nairobi', country: 'Kenia', expected: 'AFRICAN_COASTAL' },
  { city: 'Ciudad de México', country: 'México', expected: 'LATAM' },
  { city: 'Buenos Aires', country: 'Argentina', expected: 'LATAM' },
  { city: 'Lima', country: 'Perú', expected: 'LATAM' }
];

const splitBrainHits = [];
SPLIT_BRAIN_CASES.forEach(function (c) {
  const slug = EFR.coerceCountryId(c.country);
  const fromSlug = EFR.resolveEditorialFamily({ cityName: c.city, countryId: slug });
  const fromDisplay = EFR.resolveEditorialFamily({ cityName: c.city, countryDisplay: c.country });
  if (fromSlug !== c.expected) {
    splitBrainHits.push(c.city + ' slug→' + fromSlug + ' expected=' + c.expected);
  }
  if (fromDisplay !== c.expected) {
    splitBrainHits.push(c.city + ' display→' + fromDisplay + ' expected=' + c.expected);
  }
  if (fromSlug !== fromDisplay) {
    splitBrainHits.push(c.city + ' slug/display mismatch ' + fromSlug + ' vs ' + fromDisplay);
  }
});
assert('8 casos históricos split-brain = 0', splitBrainHits.length === 0, splitBrainHits.join(' · '));

const resolverDuplicates = [
  typeof Narrative.resolveRegionFamily === 'function',
  typeof Premium.resolveRegionFamily === 'function',
  typeof Knowledge.resolveRegionFamily === 'function'
];
assert(
  'Exports resolveRegionFamily delegados (3 servicios)',
  resolverDuplicates.every(Boolean),
  'narrative=' + resolverDuplicates[0] + ' premium=' + resolverDuplicates[1] + ' knowledge=' + resolverDuplicates[2]
);

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
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function buildInput(city, goalId) {
  const goalContext = GS.buildContext({ mainGoal: goalId });
  const bridgeResult = Bridge.buildBridge({
    tags: bridgeProfile.tags,
    themes: bridgeProfile.themes,
    tensionMode: bridgeProfile.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
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

const pipelineSplitBrain = [];
const mockInfluences = [
  { line: { planet: 'venus', planetKey: 'VENUS', angle: 'AC' }, distKm: 431, composite: 0.6 },
  { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'AC' }, distKm: 210, composite: 0.55 },
  { line: { planet: 'marte', planetKey: 'MARTE', angle: 'MC' }, distKm: 120, composite: 0.5 }
];

SPLIT_BRAIN_CASES.forEach(function (c) {
  const city = Catalog.findCityByName(c.city);
  if (!city) {
    pipelineSplitBrain.push('missing city ' + c.city);
    return;
  }
  const input = buildInput(city, 'amor');
  const ranked = Scorer.rankInfluences(city, input);
  const influences = ranked.length ? ranked.slice(0, 5) : mockInfluences;
  const reading = Premium.composeCityReading({
    city: city,
    goal: 'amor',
    relevantInfluences: influences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
  if (!reading.ok) {
    pipelineSplitBrain.push(c.city + ': reading failed ' + (reading.meta && reading.meta.error));
    return;
  }
  const ncFamily = reading.meta.narrativeContext && reading.meta.narrativeContext.regionFamily;
  const kmFamily = reading.meta.knowledgeMeta && reading.meta.knowledgeMeta.regionFamily;
  if (ncFamily !== kmFamily) {
    pipelineSplitBrain.push(c.city + ': narrative=' + ncFamily + ' knowledge=' + kmFamily);
  }
  if (ncFamily !== c.expected) {
    pipelineSplitBrain.push(c.city + ': pipeline family=' + ncFamily + ' expected=' + c.expected);
  }
});
assert(
  'Pipeline knowledge ≡ narrative (8 casos)',
  pipelineSplitBrain.length === 0,
  pipelineSplitBrain.join(' · ')
);

console.log('\n' + '═'.repeat(60));
console.log('Familias por país (muestra):');
countries.slice(0, 6).forEach(function (entry) {
  console.log(' ', entry.countryId, '→', EFR.resolveEditorialFamily({ countryId: entry.countryId }));
});
console.log('…');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
