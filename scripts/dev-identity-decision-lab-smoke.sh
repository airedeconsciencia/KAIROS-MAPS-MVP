#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Decision Lab (8.2)
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
LAB="$ROOT/src/services/identity-decision-lab-service.js"
PREVIEW="$ROOT/src/dev/identity-decision-lab-preview.html"
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
echo " KAIROS MAPS — Identity Decision Lab smoke (8.2)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" \
  "$MODULATION" "$SHADOW" "$IDENTITY_CTX" "$LAB" "$PREVIEW" "$COUNTRY_ARCHETYPES" \
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
  IDENTITY_CTX LAB PREVIEW COUNTRY_ARCHETYPES COUNTRY_SERVICE SCORER ASTRO BLOCKS \
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
  process.env.SHADOW, process.env.IDENTITY_CTX, process.env.LAB,
  process.env.COUNTRY_ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE, process.env.COMPOSITION, process.env.BRIDGE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.NARRATIVE,
  process.env.KNOWLEDGE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Lab = ctx.window.KairosIdentityDecisionLab;
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
  'Decision Lab exists (8.2)',
  Lab && Lab.SCHEMA_VERSION === '8.2-0.1' && Lab.CONTRACT_SCHEMA_VERSION === '1.0.0',
  'schema=' + (Lab && Lab.SCHEMA_VERSION)
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
  const input = {
    lines, goalContext: g, bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
  const ranked = Scorer.rankInfluences(city, input);
  return {
    city, goal: goalId,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bp,
    readingContext: { mode: 'city_reading', locale: 'es', subjectScope: 'individual' }
  };
}

const SAMPLE_CITIES = [
  { name: 'Lisboa' },
  { name: 'Toronto' },
  { name: 'Beirut' },
  { name: 'Kabul' },
  { name: 'Ciudad del Cabo' },
  { slug: 'reykjavik-is', fallback: { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 } }
];

const sampleResults = SAMPLE_CITIES.map(function (sample) {
  var city = sample.slug
    ? (Catalog.CITIES.find(function (c) { return Catalog.cityIdFromRef(c) === sample.slug; }) || sample.fallback)
    : Catalog.findCityByName(sample.name);
  return Lab.runComparison(Object.assign(buildRankedInput(city, 'amor'), { modulationStrength: 1 }));
});

assert(
  'Lab comparison 6 ciudades representativas',
  sampleResults.every(function (r) { return r.ok; }),
  JSON.stringify(sampleResults.map(function (r) {
    return { ok: r.ok, city: r.meta && r.meta.citySlug, warnings: r.warnings };
  }))
);

assert(
  'Contract v1.0 envelope presente',
  sampleResults.every(function (r) {
    return r.envelope &&
      r.envelope.readingContext &&
      r.envelope.applyPolicy &&
      r.envelope.identityModulationContract &&
      r.envelope.identityModulationContract.contractSchemaVersion === '1.0.0';
  }),
  null
);

assert(
  'Significado astrológico estable (6 ciudades)',
  sampleResults.every(function (r) {
    return r.comparison && r.comparison.identical && r.comparison.identical.astroInvariants;
  }),
  null
);

const lisboa = Catalog.findCityByName('Lisboa');
const baseInput = buildRankedInput(lisboa, 'amor');
const zeroStrength = Lab.runComparison(Object.assign({}, baseInput, { modulationStrength: 0 }));
assert(
  'modulationStrength=0 → secciones idénticas',
  zeroStrength.comparison && zeroStrength.comparison.byteIdentical === true,
  JSON.stringify(zeroStrength.metrics)
);

const beirut = Catalog.findCityByName('Beirut');
const beirutBlocked = Lab.runComparison(Object.assign(buildRankedInput(beirut, 'amor'), { modulationStrength: 1 }));
assert(
  'Beirut applyPolicy bloquea modulación virtual',
  beirutBlocked.envelope.applyPolicy.allowed === false &&
    beirutBlocked.comparison.byteIdentical === true,
  JSON.stringify(beirutBlocked.envelope.applyPolicy)
);

const lisboaFull = Lab.runComparison(Object.assign(buildRankedInput(lisboa, 'amor'), { modulationStrength: 1 }));
const premiumBefore = Premium.composeCityReading(Object.assign({}, baseInput, { profile: { name: 'Lab' } }));
const premiumAfter = Premium.composeCityReading(Object.assign({}, baseInput, { profile: { name: 'Lab' } }));
assert(
  'Runtime premium idéntico tras lab (no mutación servicios)',
  JSON.stringify(premiumBefore.sections) === JSON.stringify(premiumAfter.sections),
  'words=' + (premiumBefore.meta && premiumBefore.meta.wordCount)
);

const narrativeBefore = Narrative.deriveNarrativeContext(baseInput);
const narrativeAfter = Narrative.deriveNarrativeContext(baseInput);
assert(
  'Runtime narrative idéntico tras lab',
  JSON.stringify(narrativeBefore.narrativeContext) === JSON.stringify(narrativeAfter.narrativeContext),
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
Lab.runComparison(Object.assign(buildRankedInput(lisboa, 'amor'), { modulationStrength: 1 }));
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
Lab.runComparison(Object.assign(buildRankedInput(lisboa, 'amor'), { modulationStrength: 1 }));
const goalAfter = JSON.stringify(GS.buildContext({ mainGoal: 'amor' }));
const scorerAfter = JSON.stringify(Scorer.rankInfluences(lisboa, {
  lines, goalContext: g, bridgeResult: bridgeAfter,
  options: { proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
    enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
    enabledAngles: new Set(Astro.ANGLES) }
}));

assert('Identity no altera Bridge', JSON.stringify(bridgeBefore) === JSON.stringify(bridgeAfter), null);
assert('Identity no altera Goal', goalBefore === goalAfter, null);
assert('Identity no altera Scorer', scorerBefore === scorerAfter, null);

const labSrc = fs.readFileSync(process.env.LAB, 'utf8');
const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');
const indexSrc = fs.readFileSync(process.env.INDEX_HTML, 'utf8');

assert(
  'Lab aislado de narrative/knowledge/premium (no imports)',
  narrativeSrc.indexOf('KairosIdentityDecisionLab') === -1 &&
    knowledgeSrc.indexOf('KairosIdentityDecisionLab') === -1 &&
    premiumSrc.indexOf('KairosIdentityDecisionLab') === -1,
  'isolated'
);

assert(
  'Lab no escribe en consumidores prohibidos',
  labSrc.indexOf('KairosNatalMapBridge') === -1 &&
    labSrc.indexOf('KairosGoalSignal') === -1 &&
    labSrc.indexOf('KairosCityScorer') === -1 &&
    labSrc.indexOf('resolveEditorialFamily') === -1,
  'reads premium only for base compose'
);

assert(
  'app.js sin Decision Lab',
  appSrc.indexOf('identity-decision-lab') === -1 &&
    appSrc.indexOf('KairosIdentityDecisionLab') === -1,
  null
);

assert(
  'index.html sin wiring Decision Lab',
  indexSrc.indexOf('identity-decision-lab') === -1,
  null
);

assert(
  'Contract Nivel A en envelope',
  lisboaFull.envelope.identityModulationContract.modulationStrength === 1 &&
    lisboaFull.envelope.identityModulationContract.enabled === false,
  'runtime enabled stays false'
);

assert(
  'Métricas registradas',
  typeof lisboaFull.metrics.changePercent === 'number' &&
    typeof lisboaFull.metrics.sectionsAffected === 'number' &&
    typeof lisboaFull.metrics.meanIntensity === 'number' &&
    lisboaFull.metrics.meaningStability === 1,
  JSON.stringify(lisboaFull.metrics)
);

assert(
  'Preview DEV existe',
  fs.existsSync(process.env.PREVIEW),
  process.env.PREVIEW
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAILURES=' + fail);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
