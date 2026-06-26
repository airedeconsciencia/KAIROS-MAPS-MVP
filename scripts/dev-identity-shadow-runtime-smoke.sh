#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Shadow Runtime (7.9c)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CATALOG="$ROOT/src/content/cities-catalog.js"
ARCHETYPES="$ROOT/src/content/city-identity-archetypes.js"
DIMENSIONS="$ROOT/src/content/identity-dimensions.js"
PROFILE="$ROOT/src/content/identity-modulation-profile.js"
INDEX="$ROOT/src/content/city-identity-index.js"
SIGNATURES="$ROOT/src/content/city-signatures.js"
EDITORIAL="$ROOT/src/services/editorial-family-resolver.js"
MODULATION="$ROOT/src/services/identity-modulation-service.js"
SHADOW="$ROOT/src/services/identity-shadow-runtime-service.js"
COMPARISON="$ROOT/src/services/shadow-comparison-service.js"
PREVIEW="$ROOT/src/dev/identity-shadow-preview.html"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
APP="$ROOT/src/ui/app.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Shadow Runtime smoke (7.9c)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" "$EDITORIAL" \
  "$MODULATION" "$SHADOW" "$COMPARISON" "$PREVIEW" "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE" "$APP"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG ARCHETYPES DIMENSIONS PROFILE INDEX SIGNATURES EDITORIAL MODULATION SHADOW COMPARISON PREVIEW
export NARRATIVE PREMIUM KNOWLEDGE APP ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

function load(path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
}

[
  process.env.CATALOG,
  process.env.DIMENSIONS,
  process.env.ARCHETYPES,
  process.env.PROFILE,
  process.env.INDEX,
  process.env.SIGNATURES,
  process.env.EDITORIAL,
  process.env.MODULATION,
  process.env.SHADOW,
  process.env.COMPARISON
].forEach(load);

const Catalog = ctx.window.KairosCitiesCatalog;
const Index = ctx.window.KairosCityIdentityIndex;
const Profile = ctx.window.KairosIdentityModulationProfile;
const Signatures = ctx.window.KairosCitySignatures;
const Mod = ctx.window.KairosIdentityModulation;
const Shadow = ctx.window.KairosIdentityShadowRuntime;
const Comparison = ctx.window.KairosShadowComparison;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const CHANNELS = ['narrative', 'premium', 'knowledge', 'atmosphere'];

function collectNumericValues(channel) {
  const values = [];
  if (!channel) return values;
  values.push(channel.rhythmBias, channel.densityBias, channel.toneBias);
  Object.keys(channel.weightBoosts || {}).forEach(function (key) {
    values.push(channel.weightBoosts[key]);
  });
  Object.keys(channel.sectionBias || {}).forEach(function (key) {
    values.push(channel.sectionBias[key]);
  });
  return values;
}

function channelValid(channel) {
  if (!channel) return false;
  return collectNumericValues(channel).every(function (v) {
    return Mod.coefficientInRange(v);
  });
}

function traceComplete(trace) {
  if (!trace || trace.shadowMode !== true) return false;
  if (!trace.resolution || !trace.modulation || !trace.runtime) return false;
  if (trace.runtime.modulationApplied !== false || trace.runtime.runtimeImpact !== 'none') return false;
  if (!trace.modulation.channels) return false;
  if (!trace.profiles || !trace.profiles.effectiveProfile) return false;
  return CHANNELS.every(function (channel) {
    const ch = trace.modulation.channels[channel];
    return ch && ch.source && Array.isArray(ch.dimensionsUsed) && ch.signatureApplied === true;
  });
}

function effectiveDistance(a, b, slugs) {
  const shadowA = Shadow.computeShadowIdentity(a);
  const shadowB = Shadow.computeShadowIdentity(b);
  let sum = 0;
  slugs.forEach(function (slug) {
    const d = Number(shadowA.effectiveProfile[slug]) - Number(shadowB.effectiveProfile[slug]);
    sum += d * d;
  });
  return Math.sqrt(sum);
}

assert(
  'Shadow runtime carga (schema 7.9c)',
  Shadow && Shadow.SCHEMA_VERSION === '7.9c-0.1' && Shadow.SHADOW_MODE === 'shadow',
  'schema=' + (Shadow && Shadow.SCHEMA_VERSION)
);

assert(
  'Shadow comparison carga (schema 7.9c)',
  Comparison && Comparison.SCHEMA_VERSION === '7.9c-0.1',
  'schema=' + (Comparison && Comparison.SCHEMA_VERSION)
);

assert(
  '106 signatures',
  Signatures.getSignatureCoverage().mapped === 106,
  'signatures=' + Signatures.getSignatureCoverage().mapped
);

const identities = Index.listCityIdentities();
assert(
  '106 city identities',
  identities.length === 106 && Index.EXPECTED_CITY_COUNT === 106,
  'count=' + identities.length
);

const countries = Catalog.listCountries ? Catalog.listCountries() : [];
const countryCount = countries.length || new Set(Catalog.CITIES.map(function (c) { return c.country; })).size;
assert(
  '103 países en catálogo',
  Catalog.EXPECTED_COUNTRY_COUNT === 103 && countryCount === 103,
  'countries=' + countryCount
);

const coverage = Index.getIdentityCoverage();
assert(
  '100% cobertura identity index',
  coverage.complete === true && coverage.mapped === 106,
  JSON.stringify({ mapped: coverage.mapped, expected: coverage.expected })
);

let shadowOk = true;
let coeffsOk = true;
let traceOk = true;
let comparisonOk = true;
let effectiveOk = true;
let sameArchetypeDistinctOk = true;
const slugs = Profile.PROFILE_DIMENSION_SLUGS;

identities.forEach(function (entry) {
  const shadow = Shadow.computeShadowIdentity(entry.citySlug);
  const comparison = Comparison.computeComparison(entry.citySlug);

  if (!shadow || shadow.ok !== true) shadowOk = false;
  if (!shadow.baseProfile || !shadow.citySignature || !shadow.effectiveProfile) effectiveOk = false;
  if (shadow.trace && shadow.trace.signatureApplied !== true) traceOk = false;
  if (shadow.modulationCoefficients && shadow.modulationCoefficients.enabled !== false) shadowOk = false;
  if (shadow.shadowMetadata && shadow.shadowMetadata.runtimeImpact !== 'none') shadowOk = false;
  if (shadow.shadowMetadata && shadow.shadowMetadata.modulationApplied !== false) shadowOk = false;
  if (shadow.shadowMetadata && shadow.shadowMetadata.signatureApplied !== true) shadowOk = false;
  if (!shadow.identityArchetype || shadow.identityArchetype !== entry.identityArchetype) shadowOk = false;
  if (!traceComplete(shadow.trace)) traceOk = false;

  CHANNELS.forEach(function (channel) {
    const ch = shadow.modulationCoefficients &&
      shadow.modulationCoefficients.channels &&
      shadow.modulationCoefficients.channels[channel];
    if (!channelValid(ch)) coeffsOk = false;
  });

  if (!comparison || !comparison.deltaSummary) comparisonOk = false;
  if (!comparison.editorialFamily) comparisonOk = false;
  if (comparison.identityArchetype.shadow !== entry.identityArchetype) comparisonOk = false;
  if (comparison.deltaSummary.runtimeImpact !== 'none') comparisonOk = false;
  if (comparison.deltaSummary.modulationWouldApply !== false) comparisonOk = false;
  if (!comparison.profiles || !comparison.profiles.effectiveProfile) comparisonOk = false;
});

const byArchetype = {};
identities.forEach(function (entry) {
  if (!byArchetype[entry.identityArchetype]) byArchetype[entry.identityArchetype] = [];
  byArchetype[entry.identityArchetype].push(entry.citySlug);
});
Object.keys(byArchetype).forEach(function (archetype) {
  const group = byArchetype[archetype];
  if (group.length < 2) return;
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      if (effectiveDistance(group[i], group[j], slugs) === 0) sameArchetypeDistinctOk = false;
    }
  }
});

assert(
  'effectiveProfile presente (106 ciudades)',
  effectiveOk,
  'base + signature + effective'
);

assert(
  'computeShadowIdentity para 106 ciudades',
  shadowOk,
  'all cities shadow-resolved'
);

assert(
  'Coeficientes shadow acotados (106 ciudades)',
  coeffsOk,
  '[-0.3, +0.3]'
);

assert(
  'Trace completo (106 ciudades)',
  traceOk,
  'shadow + modulation channels'
);

assert(
  'ShadowComparison para 106 ciudades',
  comparisonOk,
  'editorialFamily + deltaSummary + effective'
);

assert(
  'mismo arquetipo ≠ distancia cero (effective)',
  sameArchetypeDistinctOk,
  'signature-differentiated pairs'
);

assert(
  'Lisboa != Asunción (effective)',
  effectiveDistance('lisboa-pt', 'asuncion-py', slugs) > 0,
  'distance=' + effectiveDistance('lisboa-pt', 'asuncion-py', slugs)
);

const unknown = Shadow.computeShadowIdentity('ciudad-inexistente-xx');
const unknownComparison = Comparison.computeComparison('ciudad-inexistente-xx');
assert(
  'Fallback neutro · ciudad desconocida',
  unknown.shadowMetadata.neutralFallback === true &&
    unknown.identityArchetype === null &&
    unknownComparison.deltaSummary.neutralFallback === true &&
    unknownComparison.deltaSummary.identityResolved === false,
  'reason=' + unknown.reason
);

const lisboa = Shadow.computeShadowIdentity('lisboa-pt');
const lisboaComparison = Comparison.computeComparison('lisboa-pt');
assert(
  'Shadow Lisboa · signature sync',
  lisboa.identityArchetype === 'quiet_integration' &&
    lisboa.shadowMetadata.editorialFamily === 'IBERIAN' &&
    lisboa.shadowMetadata.signatureApplied === true &&
    lisboaComparison.profiles.signatureApplied === true &&
    lisboaComparison.editorialFamily === 'IBERIAN',
  'family=' + lisboa.shadowMetadata.editorialFamily
);

function loadInto(targetCtx, path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), targetCtx, { filename: path });
}

const runtimeCtx = { window: {}, console: console };
vm.createContext(runtimeCtx);
loadInto(runtimeCtx, process.env.NARRATIVE);
loadInto(runtimeCtx, process.env.PREMIUM);
loadInto(runtimeCtx, process.env.KNOWLEDGE);

assert(
  'Runtime productivo sin shadow cargado',
  !!runtimeCtx.window.KairosNarrativeIntelligence &&
    !!runtimeCtx.window.KairosCityPremiumComposition &&
    !runtimeCtx.window.KairosIdentityShadowRuntime &&
    !runtimeCtx.window.KairosShadowComparison,
  'isolated'
);

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');

assert(
  'Narrative no importa shadow runtime',
  narrativeSrc.indexOf('KairosIdentityShadowRuntime') === -1 &&
    narrativeSrc.indexOf('identity-shadow-runtime-service') === -1 &&
    narrativeSrc.indexOf('KairosShadowComparison') === -1,
  'no references'
);
assert(
  'Premium no importa shadow runtime',
  premiumSrc.indexOf('KairosIdentityShadowRuntime') === -1 &&
    premiumSrc.indexOf('identity-shadow-runtime-service') === -1 &&
    premiumSrc.indexOf('KairosShadowComparison') === -1,
  'no references'
);
assert(
  'Knowledge no importa shadow runtime',
  knowledgeSrc.indexOf('KairosIdentityShadowRuntime') === -1 &&
    knowledgeSrc.indexOf('identity-shadow-runtime-service') === -1 &&
    knowledgeSrc.indexOf('KairosShadowComparison') === -1,
  'no references'
);
assert(
  'app.js no importa shadow runtime',
  appSrc.indexOf('KairosIdentityShadowRuntime') === -1 &&
    appSrc.indexOf('identity-shadow-runtime-service') === -1 &&
    appSrc.indexOf('KairosShadowComparison') === -1 &&
    appSrc.indexOf('identity-shadow-preview') === -1,
  'no references'
);

const previewSrc = fs.readFileSync(process.env.PREVIEW, 'utf8');
const previewOk =
  previewSrc.indexOf('identity-shadow-runtime-service.js') !== -1 &&
  previewSrc.indexOf('city-signatures.js') !== -1 &&
  previewSrc.indexOf('shadow-comparison-service.js') !== -1 &&
  previewSrc.indexOf('KairosIdentityShadowRuntime') !== -1 &&
  previewSrc.indexOf('KairosShadowComparison') !== -1 &&
  previewSrc.indexOf('Base Profile') !== -1 &&
  previewSrc.indexOf('Effective Profile') !== -1;

assert(
  'Preview operativo (scripts + paneles)',
  previewOk,
  'identity-shadow-preview.html'
);

console.log('');
console.log('Coverage:', JSON.stringify(coverage.byConfidence));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
