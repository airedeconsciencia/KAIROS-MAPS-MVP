#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Calibration + City Signatures (7.9b)
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
CALIBRATION="$ROOT/src/services/identity-calibration-service.js"
PREVIEW="$ROOT/src/dev/identity-calibration-preview.html"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
APP="$ROOT/src/ui/app.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Calibration smoke (7.9b)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SIGNATURES" "$EDITORIAL" \
  "$MODULATION" "$SHADOW" "$COMPARISON" "$ANALYTICS" "$CALIBRATION" "$PREVIEW" \
  "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE" "$APP"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG ARCHETYPES DIMENSIONS PROFILE INDEX SIGNATURES EDITORIAL MODULATION SHADOW COMPARISON ANALYTICS CALIBRATION PREVIEW
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
  process.env.ANALYTICS,
  process.env.CALIBRATION
].forEach(load);

const Index = ctx.window.KairosCityIdentityIndex;
const Signatures = ctx.window.KairosCitySignatures;
const Calibration = ctx.window.KairosIdentityCalibration;
const Profile = ctx.window.KairosIdentityModulationProfile;

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

const cities = Index.listCityIdentities().map(function (entry) { return entry.citySlug; });

assert(
  'Calibration carga (schema 7.9b)',
  Calibration && Calibration.SCHEMA_VERSION === '7.9b-0.1',
  'schema=' + (Calibration && Calibration.SCHEMA_VERSION)
);

assert(
  'City signatures carga (schema 7.9b)',
  Signatures && Signatures.SCHEMA_VERSION === '7.9b-0.1',
  'schema=' + (Signatures && Signatures.SCHEMA_VERSION)
);

const coverage = Signatures.getSignatureCoverage();
assert(
  '106 firmas',
  coverage.mapped === 106 && coverage.complete === true,
  JSON.stringify(coverage)
);

let signatureRangesOk = true;
Signatures.listCitySignatures().forEach(function (signature) {
  const validation = Signatures.validateAdjustments(signature.adjustments);
  if (!validation.ok) signatureRangesOk = false;
});

assert(
  'rangos válidos en 106 firmas',
  signatureRangesOk,
  '[-0.25,+0.25] sum<=1.2'
);

let selfDistanceOk = true;
let symmetricOk = true;
let numbersOk = true;
let nearestOk = true;
let sameArchetypeDistinctOk = true;

cities.forEach(function (slug) {
  const selfDistance = Calibration.distance(slug, slug);
  if (selfDistance.distanceScore !== 0) selfDistanceOk = false;
  if (!isFiniteNumber(selfDistance.distanceScore)) numbersOk = false;

  const other = cities.find(function (candidate) { return candidate !== slug; });
  if (other) {
    const ab = Calibration.distance(slug, other);
    const ba = Calibration.distance(other, slug);
    if (ab.distanceScore !== ba.distanceScore) symmetricOk = false;
    if (!isFiniteNumber(ab.distanceScore)) numbersOk = false;
    if (objectHasInvalidNumber(ab)) numbersOk = false;
  }

  const nearest = Calibration.findNearestCities(slug, 5);
  if (!nearest.results.length) nearestOk = false;
  if (nearest.results[0].citySlug === slug) nearestOk = false;
  for (let i = 1; i < nearest.results.length; i += 1) {
    if (nearest.results[i].distanceScore < nearest.results[i - 1].distanceScore) nearestOk = false;
  }
  const recomputed = Calibration.distance(slug, nearest.results[0].citySlug);
  if (recomputed.distanceScore !== nearest.results[0].distanceScore) nearestOk = false;
});

const byArchetype = {};
Index.listCityIdentities().forEach(function (entry) {
  if (!byArchetype[entry.identityArchetype]) byArchetype[entry.identityArchetype] = [];
  byArchetype[entry.identityArchetype].push(entry.citySlug);
});

Object.keys(byArchetype).forEach(function (archetype) {
  const group = byArchetype[archetype];
  if (group.length < 2) return;
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      const dist = Calibration.distance(group[i], group[j]);
      if (dist.distanceScore === 0) sameArchetypeDistinctOk = false;
    }
  }
});

assert('distance(city,city)=0', selfDistanceOk, 'self distance');
assert('distancia simétrica', symmetricOk, 'A→B = B→A');
assert('sin NaN/Infinity en distancias', numbersOk, 'finite numbers');
assert('mismo arquetipo ≠ distancia cero', sameArchetypeDistinctOk, 'all archetype pairs');
assert('nearest cities consistente', nearestOk, 'sorted + distance match');

function pairDistance(a, b) {
  return Calibration.distance(a, b).distanceScore;
}

assert(
  'Lisboa != Asunción (mismo arquetipo)',
  pairDistance('lisboa-pt', 'asuncion-py') > 0,
  'distance=' + pairDistance('lisboa-pt', 'asuncion-py')
);

assert(
  'Tokio != Seúl (proxy Osaka · technological_acceleration)',
  pairDistance('tokio-jp', 'seul-kr') > 0,
  'distance=' + pairDistance('tokio-jp', 'seul-kr')
);

assert(
  'Barcelona != Madrid (proxy Valencia · España)',
  pairDistance('barcelona-es', 'madrid-es') > 0,
  'distance=' + pairDistance('barcelona-es', 'madrid-es')
);

assert(
  'Dubái != Doha',
  pairDistance('dubai-ae', 'doha-qa') > 0,
  'distance=' + pairDistance('dubai-ae', 'doha-qa')
);

const effective = Calibration.computeEffectiveDimensions('lisboa-pt');
assert(
  'computeEffectiveDimensions estructura',
  effective.baseProfile && effective.citySignature && effective.effectiveProfile,
  'base + signature + effective'
);

const signature = Calibration.computeCitySignature('lisboa-pt');
assert(
  'computeCitySignature encontrada',
  signature.found === true && signature.revision === '7.9b-0.1',
  'revision=' + signature.revision
);

const archetypeRank = Calibration.rankCitiesByArchetype('quiet_integration');
assert(
  'archetype ranking consistente',
  archetypeRank.cityCount === archetypeRank.cities.length && archetypeRank.cityCount === 6,
  'quiet_integration count=' + archetypeRank.cityCount
);

const invalidEffective = objectHasInvalidNumber(effective);
assert('effective sin NaN/Infinity', !invalidEffective, invalidEffective || 'ok');

const runtimeCtx = { window: {}, console: console };
vm.createContext(runtimeCtx);
vm.runInContext(fs.readFileSync(process.env.NARRATIVE, 'utf8'), runtimeCtx, { filename: process.env.NARRATIVE });
vm.runInContext(fs.readFileSync(process.env.PREMIUM, 'utf8'), runtimeCtx, { filename: process.env.PREMIUM });
vm.runInContext(fs.readFileSync(process.env.KNOWLEDGE, 'utf8'), runtimeCtx, { filename: process.env.KNOWLEDGE });

assert(
  'Runtime productivo sin calibration cargado',
  !!runtimeCtx.window.KairosNarrativeIntelligence &&
    !runtimeCtx.window.KairosIdentityCalibration &&
    !runtimeCtx.window.KairosCitySignatures,
  'isolated'
);

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');
const shadowSrc = fs.readFileSync(process.env.SHADOW, 'utf8');
const analyticsSrc = fs.readFileSync(process.env.ANALYTICS, 'utf8');

assert(
  'Narrative no importa calibration/signatures',
  narrativeSrc.indexOf('KairosIdentityCalibration') === -1 &&
    narrativeSrc.indexOf('KairosCitySignatures') === -1,
  'no references'
);
assert(
  'Shadow runtime sincronizado con signatures',
  shadowSrc.indexOf('KairosCitySignatures') !== -1 &&
    shadowSrc.indexOf('effectiveProfile') !== -1 &&
    shadowSrc.indexOf('signatureApplied') !== -1,
  'signature sync present'
);
assert(
  'Shadow analytics no modificado',
  analyticsSrc.indexOf('KairosCitySignatures') === -1 &&
    analyticsSrc.indexOf('city-signatures') === -1,
  'no references'
);
assert(
  'app.js sin calibration/signatures',
  appSrc.indexOf('KairosCitySignatures') === -1 &&
    appSrc.indexOf('city-signatures') === -1,
  'no references'
);

const previewSrc = fs.readFileSync(process.env.PREVIEW, 'utf8');
assert(
  'Preview operativo (signatures + effective profile)',
  previewSrc.indexOf('city-signatures.js') !== -1 &&
    previewSrc.indexOf('Base Profile') !== -1 &&
    previewSrc.indexOf('Effective Profile') !== -1,
  'identity-calibration-preview.html'
);

console.log('');
console.log('Nearest Lisboa:', JSON.stringify(Calibration.findNearestCities('lisboa-pt', 3).results));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
