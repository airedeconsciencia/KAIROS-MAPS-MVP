#!/usr/bin/env bash
# Kairos Maps — Smoke Shadow Analytics (7.9c)
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
ANALYTICS="$ROOT/src/services/shadow-analytics-service.js"
PREVIEW="$ROOT/src/dev/shadow-analytics-preview.html"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
APP="$ROOT/src/ui/app.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Shadow Analytics smoke (7.9c)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" "$EDITORIAL" \
  "$MODULATION" "$SHADOW" "$COMPARISON" "$ANALYTICS" "$PREVIEW" \
  "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE" "$APP"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG ARCHETYPES DIMENSIONS PROFILE INDEX SIGNATURES EDITORIAL MODULATION SHADOW COMPARISON ANALYTICS PREVIEW
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
  process.env.COMPARISON,
  process.env.ANALYTICS
].forEach(load);

const Catalog = ctx.window.KairosCitiesCatalog;
const Archetypes = ctx.window.KairosCityIdentityArchetypes;
const Profile = ctx.window.KairosIdentityModulationProfile;
const Index = ctx.window.KairosCityIdentityIndex;
const Signatures = ctx.window.KairosCitySignatures;
const Shadow = ctx.window.KairosIdentityShadowRuntime;
const Analytics = ctx.window.KairosShadowAnalytics;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function objectHasInvalidNumber(obj, path) {
  path = path || '';
  if (obj == null) return null;
  if (typeof obj === 'number') {
    if (!isFiniteNumber(obj)) return path || 'root';
    return null;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      const bad = objectHasInvalidNumber(obj[i], path + '[' + i + ']');
      if (bad) return bad;
    }
    return null;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const bad = objectHasInvalidNumber(obj[key], path ? path + '.' + key : key);
      if (bad) return bad;
    }
  }
  return null;
}

assert(
  'Analytics carga (schema 7.9c)',
  Analytics && Analytics.SCHEMA_VERSION === '7.9c-0.1',
  'schema=' + (Analytics && Analytics.SCHEMA_VERSION)
);

assert(
  '106 signatures',
  Signatures.getSignatureCoverage().mapped === 106,
  'signatures=' + Signatures.getSignatureCoverage().mapped
);

assert(
  '106 ciudades en index',
  Index.listCityIdentities().length === 106 && Index.EXPECTED_CITY_COUNT === 106,
  'count=' + Index.listCityIdentities().length
);

const countryCount = new Set(Catalog.CITIES.map(function (c) { return c.country; })).size;
assert(
  '103 países en catálogo',
  Catalog.EXPECTED_COUNTRY_COUNT === 103 && countryCount === 103,
  'countries=' + countryCount
);

assert(
  '28 arquetipos',
  Archetypes.ARCHETYPE_SLUGS.length === 28,
  'archetypes=' + Archetypes.ARCHETYPE_SLUGS.length
);

assert(
  '10 dimensiones',
  Profile.PROFILE_DIMENSION_SLUGS.length === 10 &&
    Analytics.DIMENSION_SLUGS.length === 10,
  'dimensions=' + Analytics.DIMENSION_SLUGS.length
);

const dataset = Analytics.computeDatasetAnalytics();
assert(
  'Dataset consistente (106 ciudades)',
  dataset.datasetSize === 106,
  'datasetSize=' + dataset.datasetSize
);

assert(
  'Coverage 100%',
  dataset.coverage.cities.complete === true &&
    dataset.coverage.cities.mapped === 106 &&
    dataset.coverage.countries.complete === true,
  JSON.stringify(dataset.coverage)
);

assert(
  'reviewRequired = 7',
  dataset.reviewRequired.count === 7,
  'count=' + dataset.reviewRequired.count
);

assert(
  'neutralFallbackRate = 0 en dataset curado',
  dataset.neutralFallbackRate === 0,
  'rate=' + dataset.neutralFallbackRate
);

assert(
  'signatureAppliedCount = 106',
  dataset.signatureAppliedCount === 106 && dataset.signatureAppliedRate === 1,
  'count=' + dataset.signatureAppliedCount
);

assert(
  'Variance válida en dataset',
  isFiniteNumber(dataset.averageDimensionVariance) &&
    isFiniteNumber(dataset.averageCoefficientVariance) &&
    dataset.averageDimensionVariance > 0 &&
    dataset.averageCoefficientVariance > 0,
  JSON.stringify({
    averageDimensionVariance: dataset.averageDimensionVariance,
    averageCoefficientVariance: dataset.averageCoefficientVariance
  })
);

const archetypeStats = Analytics.computeArchetypeStatistics();
const dimensionStats = Analytics.computeDimensionStatistics();
const confidenceStats = Analytics.computeConfidenceStatistics();

assert(
  'Archetype statistics para 28 arquetipos',
  archetypeStats.length === 28,
  'count=' + archetypeStats.length
);

let archetypeCitySum = 0;
let archetypeStatsOk = true;
let archetypeVarianceNonZero = true;
archetypeStats.forEach(function (item) {
  archetypeCitySum += item.cityCount;
  if (!isFiniteNumber(item.variance.aggregate)) archetypeStatsOk = false;
  if (item.cityCount > 1 && item.variance.aggregate === 0) archetypeVarianceNonZero = false;
  Object.keys(item.dimensionalCentroid).forEach(function (key) {
    if (!isFiniteNumber(item.dimensionalCentroid[key])) archetypeStatsOk = false;
  });
});

assert(
  'Archetype city sum = 106',
  archetypeCitySum === 106,
  'sum=' + archetypeCitySum
);

assert(
  'Archetype variance válida',
  archetypeStatsOk,
  '28 archetypes'
);

assert(
  'Archetype multi-city variance > 0 (signatures)',
  archetypeVarianceNonZero,
  'effective profile spread'
);

assert(
  'Dimension statistics para 10 dimensiones',
  dimensionStats.length === 10,
  'count=' + dimensionStats.length
);

let dimensionStatsOk = true;
dimensionStats.forEach(function (item) {
  ['mean', 'standardDeviation', 'variance', 'min', 'max'].forEach(function (field) {
    if (!isFiniteNumber(item[field])) dimensionStatsOk = false;
  });
  if (item.sampleSize !== 106) dimensionStatsOk = false;
});

assert(
  'Dimension stats válidas',
  dimensionStatsOk,
  '10 dimensions'
);

assert(
  'Confidence statistics coherentes',
  confidenceStats.totals.A === 61 &&
    confidenceStats.totals.M === 38 &&
    confidenceStats.totals.B === 7 &&
    confidenceStats.reviewRequired.count === 7,
  JSON.stringify(confidenceStats.totals)
);

let cityAnalyticsOk = true;
Index.listCityIdentities().forEach(function (entry) {
  const analytics = Analytics.computeAnalytics(entry.citySlug);
  const shadow = Shadow.computeShadowIdentity(entry.citySlug);
  if (!analytics.metrics || analytics.metrics.neutralFallback) cityAnalyticsOk = false;
  if (!analytics.metrics.signatureApplied) cityAnalyticsOk = false;
  if (!shadow.effectiveProfile) cityAnalyticsOk = false;
  if (!isFiniteNumber(analytics.metrics.dimensionVariance)) cityAnalyticsOk = false;
  if (!isFiniteNumber(analytics.metrics.coefficientVariance)) cityAnalyticsOk = false;
});

assert(
  'computeAnalytics para 106 ciudades',
  cityAnalyticsOk,
  'per-city metrics'
);

const invalidDataset = objectHasInvalidNumber(dataset);
const invalidArchetypes = objectHasInvalidNumber(archetypeStats);
const invalidDimensions = objectHasInvalidNumber(dimensionStats);
const invalidConfidence = objectHasInvalidNumber(confidenceStats);

assert(
  'Dataset sin NaN/Infinity',
  !invalidDataset,
  invalidDataset || 'ok'
);
assert(
  'Archetype stats sin NaN/Infinity',
  !invalidArchetypes,
  invalidArchetypes || 'ok'
);
assert(
  'Dimension stats sin NaN/Infinity',
  !invalidDimensions,
  invalidDimensions || 'ok'
);
assert(
  'Confidence stats sin NaN/Infinity',
  !invalidConfidence,
  invalidConfidence || 'ok'
);

const runtimeCtx = { window: {}, console: console };
vm.createContext(runtimeCtx);
vm.runInContext(fs.readFileSync(process.env.NARRATIVE, 'utf8'), runtimeCtx, { filename: process.env.NARRATIVE });
vm.runInContext(fs.readFileSync(process.env.PREMIUM, 'utf8'), runtimeCtx, { filename: process.env.PREMIUM });
vm.runInContext(fs.readFileSync(process.env.KNOWLEDGE, 'utf8'), runtimeCtx, { filename: process.env.KNOWLEDGE });

assert(
  'Runtime productivo sin analytics cargado',
  !!runtimeCtx.window.KairosNarrativeIntelligence &&
    !runtimeCtx.window.KairosShadowAnalytics,
  'isolated'
);

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');

assert(
  'Narrative no importa shadow analytics',
  narrativeSrc.indexOf('KairosShadowAnalytics') === -1 &&
    narrativeSrc.indexOf('shadow-analytics-service') === -1,
  'no references'
);
assert(
  'Premium no importa shadow analytics',
  premiumSrc.indexOf('KairosShadowAnalytics') === -1 &&
    premiumSrc.indexOf('shadow-analytics-service') === -1,
  'no references'
);
assert(
  'Knowledge no importa shadow analytics',
  knowledgeSrc.indexOf('KairosShadowAnalytics') === -1 &&
    knowledgeSrc.indexOf('shadow-analytics-service') === -1,
  'no references'
);
assert(
  'app.js no importa shadow analytics',
  appSrc.indexOf('KairosShadowAnalytics') === -1 &&
    appSrc.indexOf('shadow-analytics-service') === -1 &&
    appSrc.indexOf('shadow-analytics-preview') === -1,
  'no references'
);

const previewSrc = fs.readFileSync(process.env.PREVIEW, 'utf8');
assert(
  'Preview operativo',
  previewSrc.indexOf('shadow-analytics-service.js') !== -1 &&
    previewSrc.indexOf('city-signatures.js') !== -1 &&
    previewSrc.indexOf('KairosShadowAnalytics') !== -1 &&
    previewSrc.indexOf('Dataset Summary') !== -1 &&
    previewSrc.indexOf('Top Archetypes') !== -1,
  'shadow-analytics-preview.html'
);

console.log('');
console.log('Top archetypes:', JSON.stringify(dataset.archetypeDistribution.slice(0, 3)));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
