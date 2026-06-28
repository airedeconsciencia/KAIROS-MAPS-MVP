#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Context Pipeline (8.0)
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

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Context Pipeline smoke (8.0)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" \
  "$MODULATION" "$SHADOW" "$IDENTITY_CTX" "$COUNTRY_ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" \
  "$ASTRO" "$BLOCKS" "$NARRATIVE" "$KNOWLEDGE" "$PREMIUM" "$GOAL_SIGNAL" "$NATAL_LITE" \
  "$COMPOSITION" "$BRIDGE" "$INTERP"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export CATALOG RESOLVER ARCHETYPES DIMENSIONS PROFILE INDEX SIGNATURES MODULATION SHADOW IDENTITY_CTX \
  COUNTRY_ARCHETYPES COUNTRY_SERVICE SCORER ASTRO BLOCKS NARRATIVE KNOWLEDGE PREMIUM GOAL_SIGNAL \
  NATAL_LITE COMPOSITION BRIDGE INTERP ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.CATALOG, process.env.RESOLVER, process.env.DIMENSIONS, process.env.ARCHETYPES,
  process.env.PROFILE, process.env.INDEX, process.env.SIGNATURES, process.env.MODULATION,
  process.env.SHADOW, process.env.IDENTITY_CTX, process.env.COUNTRY_ARCHETYPES,
  process.env.COUNTRY_SERVICE, process.env.GOAL_SIGNAL, process.env.NATAL_LITE,
  process.env.COMPOSITION, process.env.BRIDGE, process.env.SCORER, process.env.ASTRO,
  process.env.INTERP, process.env.BLOCKS, process.env.NARRATIVE, process.env.KNOWLEDGE,
  process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Index = ctx.window.KairosCityIdentityIndex;
const IdentityCtx = ctx.window.KairosIdentityContext;
const EFR = ctx.window.KairosEditorialFamily;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Knowledge = ctx.window.KairosPremiumKnowledge;
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
  'Identity Context service exists (8.0)',
  IdentityCtx && IdentityCtx.SCHEMA_VERSION === '8.0-0.1',
  'schema=' + (IdentityCtx && IdentityCtx.SCHEMA_VERSION)
);

const cities = Catalog.CITIES.slice();
assert('Catalog city count 106', cities.length === 106, 'count=' + cities.length);

let mapped = 0;
let enabledViolations = 0;
cities.forEach(function (city) {
  const slug = Catalog.cityIdFromRef(city);
  const ic = IdentityCtx.buildIdentityContext(slug);
  if (!ic || ic.enabled !== false) enabledViolations += 1;
  if (ic && ic.citySlug && Index.hasCityIdentity(ic.citySlug)) mapped += 1;
});

assert(
  'identityContext for 106 catalog cities',
  mapped === 106 && enabledViolations === 0,
  JSON.stringify({ mapped: mapped, expected: 106, enabledViolations: enabledViolations })
);

const fallback = IdentityCtx.buildIdentityContext('__missing_city_slug__');
assert(
  'fallback neutral for unknown slug',
  fallback.enabled === false && fallback.identityArchetype == null && fallback.confidence == null,
  JSON.stringify({
    enabled: fallback.enabled,
    archetype: fallback.identityArchetype,
    reason: fallback.shadowMetadata && fallback.shadowMetadata.reason
  })
);

const nullFallback = IdentityCtx.buildIdentityContext(null);
assert(
  'fallback neutral for null slug',
  nullFallback.enabled === false && nullFallback.citySlug == null,
  'citySlug=' + nullFallback.citySlug
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
    lines: lines,
    goalContext: g,
    bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM,
      maxSuggestions: 3,
      minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
  const ranked = Scorer.rankInfluences(city, input);
  return {
    city: city,
    goal: goalId,
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

function knowledgeTextBlob(result) {
  return JSON.stringify((result.blocks || []).map(function (b) {
    return { id: b.id, text: b.text, stage: b.stage };
  }));
}

function premiumTextBlob(reading) {
  return JSON.stringify((reading.sections || []).map(function (s) {
    return { id: s.id, title: s.title, body: s.body };
  }));
}

const labCases = [
  { cityName: 'Lisboa', goal: 'amor' },
  { cityName: 'Toronto', goal: 'trabajo' },
  { cityName: 'Ciudad del Cabo', goal: 'descanso' }
];

labCases.forEach(function (c) {
  const city = Catalog.findCityByName(c.cityName);
  const baseInput = buildRankedInput(city, c.goal);
  const narrative = Narrative.deriveNarrativeContext(baseInput);
  const nc = narrative.narrativeContext;

  assert(
    c.cityName + ' / ' + c.goal + ' → identityContext attached',
    !!(nc && nc.identityContext && nc.identityContext.enabled === false),
    'archetype=' + (nc && nc.identityContext && nc.identityContext.identityArchetype)
  );

  const ncSansIdentity = JSON.parse(JSON.stringify(nc));
  const identitySnapshot = ncSansIdentity.identityContext;
  delete ncSansIdentity.identityContext;
  assert(
    c.cityName + ' / ' + c.goal + ' → narrative text byte-identical sans identityContext key',
    narrativeTextBlob(nc) === narrativeTextBlob(ncSansIdentity),
    'spine unchanged'
  );

  const knowledgeWith = Knowledge.getBlocksForContext(Object.assign({}, baseInput, { narrativeContext: nc }));
  const knowledgeSans = Knowledge.getBlocksForContext(Object.assign({}, baseInput, { narrativeContext: ncSansIdentity }));
  assert(
    c.cityName + ' / ' + c.goal + ' → knowledge output byte-identical',
    knowledgeTextBlob(knowledgeWith) === knowledgeTextBlob(knowledgeSans),
    'blocks=' + ((knowledgeWith.blocks || []).length)
  );

  const premiumWith = Premium.composeCityReading(Object.assign({}, baseInput, { profile: { name: 'Roberto' } }));
  const premiumSans = Premium.composeCityReading(Object.assign({
    narrativeContext: ncSansIdentity
  }, baseInput, { profile: { name: 'Roberto' } }));
  assert(
    c.cityName + ' / ' + c.goal + ' → premium output byte-identical',
    premiumTextBlob(premiumWith) === premiumTextBlob(premiumSans),
    'words=' + (premiumWith.meta && premiumWith.meta.wordCount)
  );

  const familyFromResolver = EFR.resolveEditorialFamily({
    cityName: city.name,
    countryId: Catalog.resolveCountryId(city.country)
  });
  const familyFromIdentity = identitySnapshot && identitySnapshot.editorialFamily;
  assert(
    c.cityName + ' / ' + c.goal + ' → split-brain 0 (resolver vs identity family)',
    familyFromResolver === familyFromIdentity,
    JSON.stringify({ resolver: familyFromResolver, identity: familyFromIdentity })
  );
});

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');

assert(
  'Narrative no importa identity-modulation directo',
  narrativeSrc.indexOf('KairosIdentityModulation') === -1 &&
    narrativeSrc.indexOf('identity-modulation-service') === -1,
  'uses KairosIdentityContext only'
);
assert(
  'Premium no importa identity stack',
  premiumSrc.indexOf('KairosIdentityContext') === -1 &&
    premiumSrc.indexOf('KairosIdentityModulation') === -1,
  'transport via narrativeContext only'
);
assert(
  'Knowledge no lee identityContext en selección',
  knowledgeSrc.indexOf('identityContext.') === -1 &&
    knowledgeSrc.indexOf('identityContext[') === -1,
  'attach only'
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAILURES=' + fail);
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
