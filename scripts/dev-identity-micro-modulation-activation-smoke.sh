#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Micro Modulation Controlled Activation (8.7)
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
DEV_ACTIVATION="$ROOT/src/services/identity-micro-modulation-dev-activation.js"
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
echo " KAIROS MAPS — Micro Modulation Controlled Activation (8.7)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" \
  "$MODULATION" "$SHADOW" "$IDENTITY_CTX" "$MICRO" "$DEV_ACTIVATION" "$PREVIEW" \
  "$COUNTRY_ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$BLOCKS" "$NARRATIVE" \
  "$KNOWLEDGE" "$PREMIUM" "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$INTERP" \
  "$APP" "$INDEX_HTML"; do
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
  IDENTITY_CTX MICRO DEV_ACTIVATION PREVIEW COUNTRY_ARCHETYPES COUNTRY_SERVICE SCORER ASTRO \
  BLOCKS NARRATIVE KNOWLEDGE PREMIUM GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE INTERP APP \
  INDEX_HTML ASTRONOMY ROOT

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
  process.env.SHADOW, process.env.IDENTITY_CTX, process.env.MICRO, process.env.DEV_ACTIVATION,
  process.env.COUNTRY_ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE, process.env.COMPOSITION, process.env.BRIDGE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.NARRATIVE,
  process.env.KNOWLEDGE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Micro = ctx.window.KairosIdentityMicroModulation;
const DevActivation = ctx.window.KairosIdentityMicroModulationDevActivation;
const Premium = ctx.window.KairosCityPremiumComposition;
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
  'Dev Activation service exists (8.7)',
  DevActivation && DevActivation.SCHEMA_VERSION === '8.7-0.1',
  'schema=' + (DevActivation && DevActivation.SCHEMA_VERSION)
);

assert(
  'Feature flag default OFF',
  DevActivation.DEFAULT_ENABLED === false &&
    DevActivation.isControlledActivationEnabled({}) === false &&
    DevActivation.isControlledActivationEnabled({ controlledActivationEnabled: false }) === false,
  JSON.stringify({ default: DevActivation.DEFAULT_ENABLED })
);

assert(
  'Baseline scope · variables toneBias + rhythmBias only',
  DevActivation.ALLOWED_VARIABLES.join(',') === 'toneBias,rhythmBias' &&
    DevActivation.validateBaselineScope({ variablesActive: ['toneBias', 'rhythmBias'] }).ok === true &&
    DevActivation.validateBaselineScope({ variablesActive: ['sectionBias'] }).ok === false,
  null
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

const lisboa = Catalog.findCityByName('Lisboa');
const lisboaInput = buildRankedInput(lisboa, 'amor');

const defaultOff = DevActivation.composeReadingWithControlledActivation(
  Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }),
  { modulationStrength: 0.5 }
);
assert(
  'Default OFF @ 0.5 → byte-identical (Lisboa)',
  defaultOff.comparison.byteIdentical === true &&
    defaultOff.metrics.gate === 'activation_disabled' &&
    defaultOff.activation.controlledActivationEnabled === false,
  JSON.stringify({ gate: defaultOff.metrics.gate, byteIdentical: defaultOff.comparison.byteIdentical })
);

const enabledLisboa = DevActivation.composeReadingWithControlledActivation(
  Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }),
  { controlledActivationEnabled: true, modulationStrength: 0.5 }
);
assert(
  'Controlled ON · Lisboa @ 0.5 → toneBias + rhythmBias',
  enabledLisboa.ok &&
    enabledLisboa.meta.canaryApplied === true &&
    enabledLisboa.applied &&
    enabledLisboa.applied.variables.indexOf('toneBias') !== -1 &&
    enabledLisboa.applied.variables.indexOf('rhythmBias') !== -1 &&
    enabledLisboa.metrics.meaningStability === 1,
  JSON.stringify({
    applied: enabledLisboa.applied && enabledLisboa.applied.variables,
    meaningStability: enabledLisboa.metrics && enabledLisboa.metrics.meaningStability
  })
);

const enabledZero = DevActivation.composeReadingWithControlledActivation(
  Object.assign({}, lisboaInput, { profile: { name: 'Smoke' } }),
  { controlledActivationEnabled: true, modulationStrength: 0 }
);
assert(
  'Controlled ON · Lisboa @ 0 → byte-identical',
  enabledZero.comparison.byteIdentical === true &&
    enabledZero.metrics.meaningStability === 1,
  null
);

const toronto = Catalog.findCityByName('Toronto');
const torontoInput = buildRankedInput(toronto, 'amor');
const torontoEnabled = DevActivation.composeReadingWithControlledActivation(
  Object.assign({}, torontoInput, { profile: { name: 'Smoke' } }),
  { controlledActivationEnabled: true, modulationStrength: 0.5 }
);
assert(
  'Non-canary Toronto @ 0.5 → byte-identical',
  torontoEnabled.comparison.byteIdentical === true &&
    torontoEnabled.meta.canaryApplied === false,
  JSON.stringify({ gate: torontoEnabled.metrics && torontoEnabled.metrics.gate })
);

['Beirut', 'Kabul'].forEach(function (cityName) {
  const city = Catalog.findCityByName(cityName);
  const input = buildRankedInput(city, 'amor');
  const blocked = DevActivation.composeReadingWithControlledActivation(
    Object.assign({}, input, { profile: { name: 'Smoke' } }),
    { controlledActivationEnabled: true, modulationStrength: 0.5 }
  );
  assert(
    cityName + ' applyPolicy bloqueada @ controlled ON',
    blocked.envelope.applyPolicy.allowed === false &&
      blocked.comparison.byteIdentical === true,
    JSON.stringify(blocked.envelope.applyPolicy)
  );
});

const reykjavik = Catalog.CITIES.find(function (c) {
  return Catalog.cityIdFromRef(c) === 'reykjavik-is';
}) || { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 };
const reykjavikInput = buildRankedInput(reykjavik, 'amor');
const reykjavikBlocked = DevActivation.composeReadingWithControlledActivation(
  Object.assign({}, reykjavikInput, { profile: { name: 'Smoke' } }),
  { controlledActivationEnabled: true, modulationStrength: 0.5 }
);
assert(
  'Reykjavik neutral fallback bloqueada @ controlled ON',
  reykjavikBlocked.envelope.applyPolicy.allowed === false &&
    reykjavikBlocked.comparison.byteIdentical === true,
  JSON.stringify(reykjavikBlocked.envelope.applyPolicy)
);

const devActivationSrc = fs.readFileSync(process.env.DEV_ACTIVATION, 'utf8');
const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');
const indexSrc = fs.readFileSync(process.env.INDEX_HTML, 'utf8');
const previewSrc = fs.readFileSync(process.env.PREVIEW, 'utf8');

assert(
  'Dev Activation aislado de narrative/knowledge/premium',
  narrativeSrc.indexOf('KairosIdentityMicroModulationDevActivation') === -1 &&
    knowledgeSrc.indexOf('KairosIdentityMicroModulationDevActivation') === -1 &&
    premiumSrc.indexOf('KairosIdentityMicroModulationDevActivation') === -1,
  null
);

assert(
  'Dev Activation no toca Bridge/Goal/Scorer',
  devActivationSrc.indexOf('KairosNatalMapBridge') === -1 &&
    devActivationSrc.indexOf('KairosGoalSignal') === -1 &&
    devActivationSrc.indexOf('KairosCityScorer') === -1,
  null
);

assert(
  'app.js sin Controlled Activation wiring',
  appSrc.indexOf('identity-micro-modulation-dev-activation') === -1 &&
    appSrc.indexOf('KairosIdentityMicroModulationDevActivation') === -1 &&
    appSrc.indexOf('identity-micro-modulation') === -1,
  null
);

assert(
  'index.html sin Controlled Activation wiring',
  indexSrc.indexOf('identity-micro-modulation-dev-activation') === -1 &&
    indexSrc.indexOf('identity-micro-modulation') === -1,
  null
);

assert(
  'Preview DEV carga Dev Activation (F8.7)',
  previewSrc.indexOf('identity-micro-modulation-dev-activation.js') !== -1 &&
    previewSrc.indexOf('KairosIdentityMicroModulationDevActivation') !== -1,
  null
);

console.log('');
console.log('Lisboa controlled metrics:', JSON.stringify(enabledLisboa.metrics));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAILURES=' + fail);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
