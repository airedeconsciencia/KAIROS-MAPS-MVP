#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Modulation (7.5a–7.5e city mapping)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CATALOG="$ROOT/src/content/cities-catalog.js"
ARCHETYPES="$ROOT/src/content/city-identity-archetypes.js"
DIMENSIONS="$ROOT/src/content/identity-dimensions.js"
PROFILE="$ROOT/src/content/identity-modulation-profile.js"
INDEX="$ROOT/src/content/city-identity-index.js"
SERVICE="$ROOT/src/services/identity-modulation-service.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Modulation smoke (7.5a–7.5e)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$SERVICE" \
  "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG ARCHETYPES DIMENSIONS PROFILE INDEX SERVICE NARRATIVE PREMIUM KNOWLEDGE ROOT

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
  process.env.SERVICE
].forEach(load);

const Catalog = ctx.window.KairosCitiesCatalog;
const Archetypes = ctx.window.KairosCityIdentityArchetypes;
const Profile = ctx.window.KairosIdentityModulationProfile;
const Index = ctx.window.KairosCityIdentityIndex;
const Mod = ctx.window.KairosIdentityModulation;

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

assert(
  'Servicio carga (schema 7.5e)',
  Mod && Mod.SCHEMA_VERSION === '7.5e-0.1',
  'schema=' + (Mod && Mod.SCHEMA_VERSION)
);

assert(
  'Index schema 7.5e',
  Index.SCHEMA_VERSION === '7.5e-0.1',
  'schema=' + Index.SCHEMA_VERSION
);

const identities = Index.listCityIdentities();
const slugs = identities.map(function (e) { return e.citySlug; });
const uniqueSlugs = new Set(slugs);

assert(
  '106 city identities',
  identities.length === 106 && Index.EXPECTED_CITY_COUNT === 106,
  'count=' + identities.length
);

assert(
  'citySlug únicos',
  uniqueSlugs.size === 106,
  'unique=' + uniqueSlugs.size
);

let archetypeOk = true;
let profileOk = true;
let confidenceOk = true;
const archetypeSlugs = new Set(Archetypes.ARCHETYPE_SLUGS);

identities.forEach(function (entry) {
  if (!archetypeSlugs.has(entry.identityArchetype)) archetypeOk = false;
  if (!Profile.hasProfile(entry.identityArchetype)) profileOk = false;
  if (entry.confidence === 'B' && entry.status !== 'review_required') confidenceOk = false;
  if (entry.confidence !== 'B' && entry.status !== 'approved') confidenceOk = false;
});

assert(
  'Todos los identityArchetypes existen',
  archetypeOk,
  '28 archetypes'
);

assert(
  'Todos los profiles existen',
  profileOk,
  'profiles=28'
);

assert(
  'confidence B => review_required',
  confidenceOk,
  'status rules'
);

const coverage = Index.getIdentityCoverage();
assert(
  'coverage = 106/106',
  coverage.complete === true && coverage.mapped === 106,
  JSON.stringify({ mapped: coverage.mapped, expected: coverage.expected })
);

let catalogOk = true;
Catalog.CITIES.forEach(function (city) {
  const slug = Catalog.cityIdFromRef(city);
  if (!Index.hasCityIdentity(slug)) catalogOk = false;
});

assert(
  'Catálogo completo en index',
  catalogOk,
  'catalog cities=' + Catalog.CITIES.length
);

const unknown = Mod.resolveIdentity({ citySlug: 'ciudad-inexistente-xx' });
assert(
  'Unknown city → neutral',
  unknown.found === false && unknown.neutralFallback === true,
  'reason=' + unknown.reason
);

const lisboa = Mod.resolveIdentity({ citySlug: 'lisboa-pt' });
assert(
  'resolveIdentity({ citySlug }) funciona',
  lisboa.found === true &&
    lisboa.identityArchetype === 'quiet_integration' &&
    lisboa.profile.cityIdentity.confidence === 'A',
  'archetype=' + lisboa.identityArchetype
);

assert(
  'modulation.enabled = false por defecto',
  lisboa.profile.modulation.enabled === false,
  'enabled=' + lisboa.profile.modulation.enabled
);

let coeffsOk = true;
Archetypes.ARCHETYPE_SLUGS.forEach(function (slug) {
  const coeffs = Mod.buildModulationCoefficients(slug);
  CHANNELS.forEach(function (channel) {
    if (!channelValid(coeffs.channels[channel])) coeffsOk = false;
  });
});

assert(
  'Coeficientes en rango para 28 arquetipos',
  coeffsOk,
  '[-0.3, +0.3]'
);

const neutralCoeffs = Mod.buildModulationCoefficients(null);
let neutralZero = true;
CHANNELS.forEach(function (channel) {
  collectNumericValues(neutralCoeffs.channels[channel]).forEach(function (v) {
    if (v !== 0) neutralZero = false;
  });
});

assert(
  'Perfil neutro · coeficientes = 0',
  neutralZero,
  'neutral'
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
  'Runtime sin identity-modulation cargado',
  !!runtimeCtx.window.KairosNarrativeIntelligence &&
    !!runtimeCtx.window.KairosCityPremiumComposition &&
    !runtimeCtx.window.KairosIdentityModulation,
  'isolated'
);

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const premiumSrc = fs.readFileSync(process.env.PREMIUM, 'utf8');
const knowledgeSrc = fs.readFileSync(process.env.KNOWLEDGE, 'utf8');

assert(
  'Narrative no importa identity-modulation',
  narrativeSrc.indexOf('KairosIdentityModulation') === -1 &&
    narrativeSrc.indexOf('identity-modulation-service') === -1,
  'no references'
);
assert(
  'Premium no importa identity-modulation',
  premiumSrc.indexOf('KairosIdentityModulation') === -1 &&
    premiumSrc.indexOf('identity-modulation-service') === -1,
  'no references'
);
assert(
  'Knowledge no importa identity-modulation',
  knowledgeSrc.indexOf('KairosIdentityModulation') === -1 &&
    knowledgeSrc.indexOf('identity-modulation-service') === -1,
  'no references'
);

console.log('');
console.log('Coverage:', JSON.stringify(coverage.byConfidence));
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
