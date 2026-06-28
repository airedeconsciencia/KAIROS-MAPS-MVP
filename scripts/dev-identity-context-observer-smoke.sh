#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Context Observer (8.1)
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
OBSERVER="$ROOT/src/services/identity-context-observer-service.js"
PREVIEW="$ROOT/src/dev/identity-context-observer-preview.html"
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
echo " KAIROS MAPS — Identity Context Observer smoke (8.1)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" \
  "$MODULATION" "$SHADOW" "$IDENTITY_CTX" "$OBSERVER" "$PREVIEW" "$COUNTRY_ARCHETYPES" \
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
  IDENTITY_CTX OBSERVER PREVIEW COUNTRY_ARCHETYPES COUNTRY_SERVICE SCORER ASTRO BLOCKS \
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
  process.env.SHADOW, process.env.IDENTITY_CTX, process.env.OBSERVER,
  process.env.COUNTRY_ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE, process.env.COMPOSITION, process.env.BRIDGE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.NARRATIVE,
  process.env.KNOWLEDGE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Observer = ctx.window.KairosIdentityContextObserver;
const IdentityCtx = ctx.window.KairosIdentityContext;
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

assert(
  'Observer service exists (8.1)',
  Observer && Observer.SCHEMA_VERSION === '8.1-0.1',
  'schema=' + (Observer && Observer.SCHEMA_VERSION)
);

const scan = Observer.observeAllCatalogCities();
assert(
  'Observer scan 106 ciudades',
  scan.cityCount === 106 && scan.enabledViolations === 0 && scan.mutationCount === 0,
  JSON.stringify({
    cityCount: scan.cityCount,
    enabledViolations: scan.enabledViolations,
    mutationCount: scan.mutationCount,
    notOkCount: scan.notOkCount
  })
);

assert(
  'Campos requeridos presentes (106)',
  scan.results.every(function (r) {
    return r.missingFields && r.missingFields.length === 0;
  }),
  'missing=' + scan.results.filter(function (r) { return r.missingFields.length; }).length
);

assert(
  'enabled:false en 106 ciudades',
  scan.results.every(function (r) {
    return r.identityContext && r.identityContext.enabled === false;
  }),
  null
);

assert(
  'Observer warnings no bloqueantes',
  scan.results.every(function (r) { return r.blocking === false; }),
  null
);

const fallback = Observer.observeBuiltContext('__missing_city_slug__');
assert(
  'Fallback neutral desconocido',
  fallback.identityContext &&
    fallback.identityContext.enabled === false &&
    fallback.identityContext.identityArchetype == null,
  JSON.stringify({
    warnings: fallback.warnings,
    reason: fallback.shadowMetadata && fallback.shadowMetadata.reason
  })
);
assert(
  'Fallback sin mutación',
  fallback.mutationDetected === false,
  null
);

const review = Observer.observeBuiltContext('beirut-lb');
assert(
  'Beirut review_required warning',
  review.warnings.indexOf('review_required_city') !== -1,
  JSON.stringify(review.warnings)
);

const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(utc);
const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function buildRankedInput(city, goalId) {
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
    bridgeProfile: bp
  };
}

function narrativeTextBlob(nc) {
  if (!nc) return '';
  return JSON.stringify({
    regionFamily: nc.regionFamily,
    humanTheme: nc.humanTheme,
    humanConflict: nc.humanConflict,
    humanOpportunity: nc.humanOpportunity,
    humanOpportunityAction: nc.humanOpportunityAction,
    humanObserve: nc.humanObserve,
    humanClosing: nc.humanClosing,
    guidingQuestion: nc.guidingQuestion,
    narrativeSummary: nc.narrativeSummary,
    countryContext: nc.countryContext
  });
}

function premiumTextBlob(reading) {
  return JSON.stringify((reading.sections || []).map(function (s) {
    return { id: s.id, title: s.title, body: s.body };
  }));
}

const lisboa = Catalog.findCityByName('Lisboa');
const baseInput = buildRankedInput(lisboa, 'amor');
const narrative = Narrative.deriveNarrativeContext(baseInput);
const nc = narrative.narrativeContext;
const beforeIc = JSON.stringify(nc.identityContext);

const pipelineReport = Observer.observePipelineIdentityContext(nc.identityContext);
assert(
  'Pipeline observer no muta identityContext',
  pipelineReport.mutationDetected === false &&
    JSON.stringify(nc.identityContext) === beforeIc,
  null
);

const ncSansIdentity = JSON.parse(JSON.stringify(nc));
delete ncSansIdentity.identityContext;
assert(
  'Narrative output byte-identical sin identityContext',
  narrativeTextBlob(nc) === narrativeTextBlob(ncSansIdentity),
  'spine unchanged'
);

const premiumWith = Premium.composeCityReading(Object.assign({}, baseInput, { profile: { name: 'Roberto' } }));
const premiumSans = Premium.composeCityReading(Object.assign({
  narrativeContext: ncSansIdentity
}, baseInput, { profile: { name: 'Roberto' } }));
assert(
  'Premium output byte-identical',
  premiumTextBlob(premiumWith) === premiumTextBlob(premiumSans),
  'words=' + (premiumWith.meta && premiumWith.meta.wordCount)
);

const appSrc = fs.readFileSync(process.env.APP, 'utf8');
const indexSrc = fs.readFileSync(process.env.INDEX_HTML, 'utf8');
const observerSrc = fs.readFileSync(process.env.OBSERVER, 'utf8');
const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');

assert(
  'app.js sin referencias Identity',
  appSrc.indexOf('KairosIdentity') === -1 &&
    appSrc.indexOf('identity-context') === -1,
  null
);
assert(
  'index.html sin wiring productivo Identity',
  indexSrc.indexOf('identity-context') === -1 &&
    indexSrc.indexOf('city-identity') === -1 &&
    indexSrc.indexOf('city-signatures') === -1,
  null
);
assert(
  'Observer no importado en narrative/knowledge',
  narrativeSrc.indexOf('KairosIdentityContextObserver') === -1 &&
    knowledgeSrc.indexOf('KairosIdentityContextObserver') === -1,
  'observer isolated'
);
assert(
  'Observer service read-only (no input mutations)',
  !/[^.]identityContext\s*=/.test(observerSrc) &&
    !/narrativeContext\s*=/.test(observerSrc),
  'report output only'
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
