#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Micro Modulation (8.5A toneBias canary)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

CATALOG="$ROOT/src/content/cities-catalog.js"
RESOLVER="$ROOT/src/services/editorial-family-resolver.js"
ARCHETYPES="$ROOT/src/content/city-identity-archetypes.js"
DIMENSIONS="$ROOT/src/content/identity-dimensions.js"
PROFILE="$ROOT/src/content/identity-modulation-profile.js"
INDEX="$ROOT/src/content/city-identity-index.js"
SIGNATURES="$ROOT/src/content/city-signatures.js"
MODULATION="$ROOT/src/services/identity-modulation-service.js"
SHADOW="$ROOT/src/services/identity-shadow-runtime-service.js"
IDENTITY_CTX="$ROOT/src/services/identity-context-service.js"
MICRO="$ROOT/src/services/identity-micro-modulation-service.js"
PREVIEW="$ROOT/src/dev/identity-micro-modulation-preview.html"
COUNTRY_ARCHETYPES="$ROOT/src/content/country-archetypes.js"
COUNTRY_SERVICE="$ROOT/src/services/country-archetype-service.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"
BLOCKS="$ROOT/src/content/premium-blocks.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
INTERP="$ROOT/src/content/interpretations.js"
APP="$ROOT/src/ui/app.js"
INDEX_HTML="$ROOT/src/index.html"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Micro Modulation smoke (8.5A)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" \
  "$MODULATION" "$SHADOW" "$IDENTITY_CTX" "$MICRO" "$PREVIEW" "$COUNTRY_ARCHETYPES" \
  "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$BLOCKS" "$NARRATIVE" "$KNOWLEDGE" "$PREMIUM" \
  "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$INTERP" "$APP" "$INDEX_HTML"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export CATALOG RESOLVER ARCHETYPES DIMENSIONS PROFILE INDEX SIGNATURES MODULATION SHADOW \
  IDENTITY_CTX MICRO PREVIEW COUNTRY_ARCHETYPES COUNTRY_SERVICE SCORER ASTRO BLOCKS \
  NARRATIVE KNOWLEDGE PREMIUM GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE INTERP APP INDEX_HTML \
  ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.CATALOG, process.env.RESOLVER, process.env.DIMENSIONS, process.env.ARCHETYPES,
  process.env.PROFILE, process.env.INDEX, process.env.SIGNATURES, process.env.MODULATION,
  process.env.SHADOW, process.env.IDENTITY_CTX, process.env.MICRO,
  process.env.COUNTRY_ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE, process.env.COMPOSITION, process.env.BRIDGE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.NARRATIVE,
  process.env.KNOWLEDGE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Micro = ctx.window.KairosIdentityMicroModulation;
const Premium = ctx.window.KairosCityPremiumComposition;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert(
  'Micro Modulation service exists (8.5A4)',
  Micro && Micro.SCHEMA_VERSION === '8.5a4-0.1' && Micro.CONTRACT_SCHEMA_VERSION === '1.0.0',
  'schema=' + (Micro && Micro.SCHEMA_VERSION)
);

assert(
  'Canary Lisboa · strength cap 0.5',
  Micro.CANARY_CITY_SLUG === 'lisboa-pt' && Micro.MAX_MODULATION_STRENGTH === 0.5,
  JSON.stringify({ canary: Micro.CANARY_CITY_SLUG, max: Micro.MAX_MODULATION_STRENGTH })
);

function buildRankedInput(city, goalId) {
  const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
  const lines = Astro.computeAllLines(utc);
  const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;
  const g = GS.buildContext({ mainGoal: goalId });
  const br = Bridge.buildBridge({
    tags: bp.tags,
    themes: bp.themes,
    tensionMode: bp.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
    goalContext: g
  });
  const ranked = Scorer.rankInfluences(city, {
    lines, goalContext: g, bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  });
  return {
    city, goal: goalId,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bp,
    readingContext: { mode: 'city_reading', locale: 'es', subjectScope: 'individual' }
  };
}

const SAMPLE_CITIES = [
  { name: 'Lisboa', canary: true },
  { name: 'Toronto', canary: false },
  { name: 'Beirut', canary: false },
  { name: 'Kabul', canary: false },
  { name: 'Ciudad del Cabo', canary: false },
  { slug: 'reykjavik-is', fallback: { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 }, canary: false }
];

function resolveCity(sample) {
  if (sample.slug) {
    return Catalog.CITIES.find(function (c) {
      return Catalog.cityIdFromRef(c) === sample.slug;
    }) || sample.fallback;
  }
  return Catalog.findCityByName(sample.name);
}

const lisboa = Catalog.findCityByName('Lisboa');
const lisboaInput = buildRankedInput(lisboa, 'amor');
const lisboaReading = Premium.composeCityReading(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }));

const zeroResult = Micro.applyMicroModulation(lisboaReading, Object.assign({}, lisboaInput, { modulationStrength: 0 }));
assert(
  'modulationStrength=0 → byte-identical (Lisboa)',
  zeroResult.comparison && zeroResult.comparison.byteIdentical === true,
  JSON.stringify(zeroResult.metrics)
);

assert(
  'modulationStrength=0 → meaningStability=1',
  zeroResult.metrics && zeroResult.metrics.meaningStability === 1,
  null
);

const maxResult = Micro.composeWithMicroModulation(
  Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }),
  { modulationStrength: 0.5 }
);
assert(
  'Lisboa canary · applyPolicy allowed · toneBias only',
  maxResult.ok &&
    maxResult.envelope.applyPolicy.allowed === true &&
    maxResult.meta.canaryApplied === true &&
    maxResult.applied &&
    maxResult.applied.variables.length === 1 &&
    maxResult.applied.variables[0] === 'toneBias',
  JSON.stringify({
    gate: maxResult.metrics && maxResult.metrics.gate,
    applied: maxResult.applied,
    policy: maxResult.envelope && maxResult.envelope.applyPolicy
  })
);

assert(
  'Lisboa strength capped at 0.5',
  maxResult.metrics.modulationStrength === 0.5 &&
    maxResult.envelope.identityModulationContract.modulationStrength === 0.5,
  'strength=' + maxResult.metrics.modulationStrength
);

assert(
  'Contract enabled=false · variablesActive toneBias',
  maxResult.envelope.identityModulationContract.enabled === false &&
    maxResult.envelope.identityModulationContract.meta.variablesActive[0] === 'toneBias',
  null
);

assert(
  'Lisboa meaningStability=1 con micro modulación',
  maxResult.comparison.meaningStable === true && maxResult.metrics.meaningStability === 1,
  null
);

const nonCanaryResults = SAMPLE_CITIES.filter(function (s) { return !s.canary; }).map(function (sample) {
  const city = resolveCity(sample);
  const input = buildRankedInput(city, 'amor');
  const reading = Premium.composeCityReading(Object.assign({}, input, { profile: { name: 'Smoke' } }));
  return Micro.applyMicroModulation(reading, Object.assign({}, input, { modulationStrength: 0.5 }));
});

assert(
  'Solo Lisboa canary · otras ciudades byte-identical a strength 0.5',
  nonCanaryResults.every(function (r) {
    return r.comparison.byteIdentical === true && r.meta.canaryApplied === false;
  }),
  JSON.stringify(nonCanaryResults.map(function (r) {
    return { city: r.meta.citySlug, byteIdentical: r.comparison.byteIdentical, gate: r.metrics.gate };
  }))
);

const beirut = Catalog.findCityByName('Beirut');
const beirutInput = buildRankedInput(beirut, 'amor');
const beirutReading = Premium.composeCityReading(Object.assign({}, beirutInput, { profile: { name: 'Smoke' } }));
const beirutBlocked = Micro.applyMicroModulation(beirutReading, Object.assign({}, beirutInput, { modulationStrength: 0.5 }));
assert(
  'Beirut applyPolicy bloqueada',
  beirutBlocked.envelope.applyPolicy.allowed === false &&
    beirutBlocked.comparison.byteIdentical === true,
  JSON.stringify(beirutBlocked.envelope.applyPolicy)
);

assert(
  'Lisboa @ 0.5 → ≥3 secciones con cambio modal',
  maxResult.comparison.sectionsAffected >= 3,
  JSON.stringify({
    sectionsAffected: maxResult.comparison.sectionsAffected,
    warnings: maxResult.warnings
  })
);

assert(
  'Lisboa @ 0.5 → umbral escalado activo',
  maxResult.applied &&
    maxResult.applied.thresholds &&
    maxResult.applied.thresholds.direct === 0.04,
  JSON.stringify(maxResult.applied && maxResult.applied.thresholds)
);

assert(
  'toneBias transform unitario (puede → podría @ strength 0.5)',
  Micro.applyToneTransform('Aquí puede fluir.', -0.0525, 0.5) === 'Aquí podría fluir.',
  null
);

assert(
  'Lexical Guard protege "puede que"',
  Micro.applyToneTransform(
    'En Portugal, puede que el encuentro se sostenga en presencia tranquila.',
    -0.0525,
    0.5
  ) === 'En Portugal, puede que el encuentro se sostenga en presencia tranquila.',
  null
);

assert(
  'Lexical Guard permite "puede abrir" → "podría abrir"',
  Micro.applyToneTransform('En Lisboa, la conversación puede abrir antes que la escena.', -0.0525, 0.5) ===
    'En Lisboa, la conversación podría abrir antes que la escena.',
  null
);

assert(
  'observar sin "podría que" tras micro modulación Lisboa',
  (function () {
    var observar = (maxResult.reading.sections || []).find(function (s) { return s.id === 'observar'; });
    return observar && observar.body.indexOf('podría que') === -1 && observar.body.indexOf('puede que') !== -1;
  })(),
  (maxResult.reading.sections || []).find(function (s) { return s.id === 'observar'; })
    ? (maxResult.reading.sections.find(function (s) { return s.id === 'observar'; }).body.match(/podr[ií]a que/gi) || []).length
    : 'missing'
);

assert(
  'toneBias no altera bajo umbral escalado',
  Micro.applyToneTransform('Aquí puede fluir.', -0.03, 0.5) === 'Aquí puede fluir.',
  null
);

const premiumBefore = Premium.composeCityReading(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }));
const premiumAfter = Premium.composeCityReading(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }));
Micro.composeWithMicroModulation(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }), { modulationStrength: 0.5 });
assert(
  'Premium service intacto tras micro modulación',
  JSON.stringify(premiumBefore.sections) === JSON.stringify(premiumAfter.sections),
  'words=' + (premiumBefore.meta && premiumBefore.meta.wordCount)
);

function stripVolatileNarrativeContext(narrativeContext) {
  if (!narrativeContext) return narrativeContext;
  var clone = JSON.parse(JSON.stringify(narrativeContext));
  if (clone.identityContext && clone.identityContext.shadowMetadata) {
    delete clone.identityContext.shadowMetadata.computedAt;
  }
  return clone;
}

const narrativeBefore = Narrative.deriveNarrativeContext(lisboaInput);
Micro.composeWithMicroModulation(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }), { modulationStrength: 0.5 });
const narrativeAfter = Narrative.deriveNarrativeContext(lisboaInput);
assert(
  'Narrative service intacto tras micro modulación',
  JSON.stringify(stripVolatileNarrativeContext(narrativeBefore.narrativeContext)) ===
    JSON.stringify(stripVolatileNarrativeContext(narrativeAfter.narrativeContext)),
  null
);

const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(utc);
const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;
const g = GS.buildContext({ mainGoal: 'amor' });
const bridgeBefore = Bridge.buildBridge({
  tags: bp.tags, themes: bp.themes, tensionMode: false,
  mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
  goalContext: g
});
Micro.composeWithMicroModulation(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }), { modulationStrength: 0.5 });
const bridgeAfter = Bridge.buildBridge({
  tags: bp.tags, themes: bp.themes, tensionMode: false,
  mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
  goalContext: g
});
const goalBefore = JSON.stringify(g);
const scorerBefore = JSON.stringify(Scorer.rankInfluences(lisboa, {
  lines, goalContext: g, bridgeResult: bridgeBefore,
  options: { proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
    enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
    enabledAngles: new Set(Astro.ANGLES) }
}));
Micro.composeWithMicroModulation(Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }), { modulationStrength: 0.5 });
const goalAfter = JSON.stringify(GS.buildContext({ mainGoal: 'amor' }));
const scorerAfter = JSON.stringify(Scorer.rankInfluences(lisboa, {
  lines, goalContext: g, bridgeResult: bridgeAfter,
  options: { proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
    enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
    enabledAngles: new Set(Astro.ANGLES) }
}));

assert('Micro no altera Bridge', JSON.stringify(bridgeBefore) === JSON.stringify(bridgeAfter), null);
assert('Micro no altera Goal', goalBefore === goalAfter, null);
assert('Micro no altera Scorer', scorerBefore === scorerAfter, null);

const microSrc = fs.readFileSync(process.env.MICRO, 'utf8');
const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');
const indexSrc = fs.readFileSync(process.env.INDEX_HTML, 'utf8');

assert(
  'Micro aislado de narrative/knowledge/premium (no imports)',
  narrativeSrc.indexOf('KairosIdentityMicroModulation') === -1 &&
    knowledgeSrc.indexOf('KairosIdentityMicroModulation') === -1 &&
    premiumSrc.indexOf('KairosIdentityMicroModulation') === -1,
  'isolated'
);

assert(
  'Micro no escribe en consumidores prohibidos',
  microSrc.indexOf('KairosNatalMapBridge') === -1 &&
    microSrc.indexOf('KairosGoalSignal') === -1 &&
    microSrc.indexOf('KairosCityScorer') === -1 &&
    microSrc.indexOf('applyRhythm') === -1 &&
    microSrc.indexOf('applyDensity') === -1 &&
    microSrc.indexOf('simulateReadingSections') === -1,
  'toneBias apply only'
);

assert(
  'app.js sin Micro Modulation',
  appSrc.indexOf('identity-micro-modulation') === -1 &&
    appSrc.indexOf('KairosIdentityMicroModulation') === -1,
  null
);

assert(
  'index.html sin wiring Micro Modulation',
  indexSrc.indexOf('identity-micro-modulation') === -1,
  null
);

assert(
  'Preview DEV existe',
  fs.existsSync(process.env.PREVIEW),
  process.env.PREVIEW
);

console.log('');
console.log('Lisboa micro metrics:', JSON.stringify(maxResult.metrics));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAILURES=' + fail);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
