#!/usr/bin/env bash
# Kairos Maps — Smoke Identity Modulation (7.5a–7.5d engine)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

ARCHETYPES="$ROOT/src/content/city-identity-archetypes.js"
DIMENSIONS="$ROOT/src/content/identity-dimensions.js"
PROFILE="$ROOT/src/content/identity-modulation-profile.js"
SERVICE="$ROOT/src/services/identity-modulation-service.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Identity Modulation smoke (7.5a–7.5d)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$SERVICE" "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export ARCHETYPES DIMENSIONS PROFILE SERVICE NARRATIVE PREMIUM KNOWLEDGE ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

function load(path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
}

[
  process.env.DIMENSIONS,
  process.env.ARCHETYPES,
  process.env.PROFILE,
  process.env.SERVICE
].forEach(load);

const Archetypes = ctx.window.KairosCityIdentityArchetypes;
const Profile = ctx.window.KairosIdentityModulationProfile;
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
const CHANNEL_FIELDS = ['weightBoosts', 'rhythmBias', 'densityBias', 'toneBias', 'sectionBias', 'trace'];

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
  return CHANNEL_FIELDS.every(function (field) {
    return channel[field] != null;
  }) && collectNumericValues(channel).every(function (v) {
    return Mod.coefficientInRange(v);
  });
}

assert(
  'Servicio carga (schema 7.5d)',
  Mod && Mod.SCHEMA_VERSION === '7.5d-0.1',
  'schema=' + (Mod && Mod.SCHEMA_VERSION)
);

assert(
  '28 arquetipos en catálogo',
  Archetypes.ARCHETYPE_SLUGS.length === 28,
  'count=' + Archetypes.ARCHETYPE_SLUGS.length
);

assert(
  '28 perfiles dimensionales',
  Object.keys(Profile.IDENTITY_PROFILES).length === 28,
  'profiles=' + Object.keys(Profile.IDENTITY_PROFILES).length
);

let coeffsOk = true;
Archetypes.ARCHETYPE_SLUGS.forEach(function (slug) {
  const coeffs = Mod.buildModulationCoefficients(slug);
  if (!coeffs || coeffs.meta.neutralFallback) coeffsOk = false;
  if (coeffs.enabled !== false) coeffsOk = false;
  CHANNELS.forEach(function (channel) {
    if (!channelValid(coeffs.channels[channel])) coeffsOk = false;
  });
});

assert(
  'Coeficientes existen para los 28 · rango [-0.3, +0.3]',
  coeffsOk,
  'channels=' + CHANNELS.join(', ')
);

const neutralCoeffs = Mod.buildModulationCoefficients(null);
let neutralZero = true;
CHANNELS.forEach(function (channel) {
  const ch = neutralCoeffs.channels[channel];
  if (ch.rhythmBias !== 0 || ch.densityBias !== 0 || ch.toneBias !== 0) neutralZero = false;
  collectNumericValues(ch).forEach(function (v) {
    if (v !== 0) neutralZero = false;
  });
});

assert(
  'Perfil neutro · coeficientes = 0',
  neutralZero && neutralCoeffs.meta.neutralFallback === true,
  'reason=' + neutralCoeffs.meta.reason
);

const unknown = Mod.resolveIdentity({ identityArchetype: 'no_existe' });
assert(
  'Unknown slug fail-soft',
  unknown.ok === true && unknown.found === false &&
    unknown.neutralFallback === true &&
    unknown.profile.modulation.enabled === false,
  'reason=' + unknown.reason
);

const resolved = Mod.resolveIdentity({ identityArchetype: 'layered_capital' });
assert(
  'Resolve conocido · modulation.enabled=false',
  resolved.found === true &&
    resolved.neutralFallback === false &&
    resolved.profile.modulation.enabled === false,
  'slug=' + resolved.identityArchetype
);

const trace = Mod.getModulationTrace('creative_expansion');
assert(
  'getModulationTrace devuelve canales',
  trace && trace.channels && CHANNELS.every(function (c) {
    return trace.channels[c] && trace.channels[c].source === 'identity_profile';
  }),
  'archetype=' + trace.archetypeSlug
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
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
