#!/usr/bin/env bash
# Kairos Maps — Smoke Reloc Lite content (Fase 3.7b.3)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELOC_LITE="$ROOT/src/content/reloc-lite.js"
RELOC_PROFILE="$ROOT/src/services/relocation-profile-service.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Reloc Lite smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$RELOC_LITE" "$RELOC_PROFILE" "$GOAL_SIGNAL" "$BRIDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export RELOC_LITE RELOC_PROFILE GOAL_SIGNAL BRIDGE ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

[process.env.GOAL_SIGNAL, process.env.RELOC_LITE, process.env.RELOC_PROFILE, process.env.BRIDGE].forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const RelocLite = ctx.window.KairosRelocLite;
const RelocProfile = ctx.window.KairosRelocationProfile;
const GS = ctx.window.KairosGoalSignal;

if (!RelocLite) throw new Error('KairosRelocLite no definido');
if (!RelocProfile) throw new Error('KairosRelocationProfile no definido');

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

const list = RelocLite.listFragments();
assert(
  'listFragments() = 32 (delta 16 + presence 16)',
  Array.isArray(list) && list.length === 32,
  'count=' + list.length
);

const airFrag = RelocLite.getFragment('RELOC_ASC_TO_AIR');
assert(
  "getFragment('RELOC_ASC_TO_AIR') ok",
  airFrag && airFrag.id === 'RELOC_ASC_TO_AIR' && airFrag.headline,
  'headline=' + (airFrag && airFrag.headline.slice(0, 48)) + '…'
);

const mcAir = RelocLite.getFragment('RELOC_MC_TO_AIR');
assert(
  "getFragment('RELOC_MC_TO_AIR') ok",
  mcAir && mcAir.role === 'MC' && mcAir.condition.element === 'air',
  'headline=' + (mcAir && mcAir.headline.slice(0, 48)) + '…'
);

const icFire = RelocLite.getFragment('RELOC_IC_TO_FIRE');
assert(
  "getFragment('RELOC_IC_TO_FIRE') ok",
  icFire && icFire.role === 'IC' && icFire.condition.element === 'fire',
  'headline=' + (icFire && icFire.headline.slice(0, 48)) + '…'
);

const dcEarth = RelocLite.getFragment('RELOC_DC_TO_EARTH');
assert(
  "getFragment('RELOC_DC_TO_EARTH') ok",
  dcEarth && dcEarth.role === 'DC' && dcEarth.condition.element === 'earth',
  'headline=' + (dcEarth && dcEarth.headline.slice(0, 48)) + '…'
);

const mcPresentWater = RelocLite.getFragment('RELOC_MC_PRESENT_WATER');
assert(
  "getFragment('RELOC_MC_PRESENT_WATER') presence ok",
  mcPresentWater && mcPresentWater.role === 'MC' && mcPresentWater.condition.element === 'water',
  'headline=' + (mcPresentWater && mcPresentWater.headline.slice(0, 48)) + '…'
);

const icPresentEarth = RelocLite.getFragment('RELOC_IC_PRESENT_EARTH');
assert(
  "getFragment('RELOC_IC_PRESENT_EARTH') presence ok",
  icPresentEarth && icPresentEarth.role === 'IC' && icPresentEarth.condition.element === 'earth',
  'headline=' + (icPresentEarth && icPresentEarth.headline.slice(0, 48)) + '…'
);

const coverage = RelocLite.inspectCoverage();
assert(
  'inspectCoverage() delta 16/16 + presence 16/16',
  coverage.ok === true &&
    coverage.totalFragments === 32 &&
    coverage.deltaExpected === 16 &&
    coverage.deltaPresent === 16 &&
    coverage.deltaPercent === 100 &&
    coverage.presenceExpected === 16 &&
    coverage.presencePresent === 16 &&
    coverage.presencePercent === 100 &&
    coverage.missingDelta.length === 0 &&
    coverage.missingPresence.length === 0,
  'delta=' + coverage.deltaPresent + '/' + coverage.deltaExpected +
    ' · presence=' + coverage.presencePresent + '/' + coverage.presenceExpected
);

const forbidden = ['destino', 'perfecto', 'alma gemela', 'garantizado', 'debes mudarte'];
const badCopy = list.some(function (item) {
  var frag = RelocLite.getFragment(item.id);
  var text = ((frag.headline || '') + ' ' + (frag.body || '')).toLowerCase();
  return forbidden.some(function (w) { return text.indexOf(w) !== -1; });
});
assert(
  'voice_tone: sin palabras prohibidas',
  !badCopy,
  'forbidden scan OK'
);

const validInput = {
  natalChart: { sun: 'gemini', moon: 'aries', asc: 'cancer' },
  targetLocation: { name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  relocatedAngles: {
    AC: { sign: 'libra', slug: 'libra', degree: 12.4 },
    MC: { sign: 'capricorn', slug: 'capricorn', degree: 8.1 },
    IC: { sign: 'cancer', slug: 'cancer', degree: 8.1 },
    DC: { sign: 'aries', slug: 'aries', degree: 12.4 }
  },
  goalContext: GS.buildContext({ mainGoal: 'amor' })
};

const profile = RelocProfile.buildRelocationProfile(validInput);
assert(
  'buildRelocationProfile sigue ok:true',
  profile.ok === true,
  'profileType=' + profile.profileType
);

assert(
  'sourceIds.fragmentIds incluye reloc-lite (4 ángulos Lisboa mock, todos delta)',
  Array.isArray(profile.sourceIds.fragmentIds) &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_ASC_TO_AIR') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_MC_TO_EARTH') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_IC_TO_WATER') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_DC_TO_FIRE') !== -1 &&
    profile.sourceIds.fragmentIds.length === 4,
  'fragmentIds=' + JSON.stringify(profile.sourceIds.fragmentIds)
);

var robertoRealInput = {
  natalChart: {
    sun: 'gemini',
    moon: 'aries',
    asc: 'cancer',
    angles: {
      AC: { slug: 'cancer' },
      MC: { slug: 'pisces' },
      IC: { slug: 'virgo' },
      DC: { slug: 'capricorn' }
    }
  },
  targetLocation: validInput.targetLocation,
  relocatedAngles: {
    AC: { slug: 'gemini' },
    MC: { slug: 'pisces' },
    IC: { slug: 'virgo' },
    DC: { slug: 'sagittarius' }
  },
  goalContext: validInput.goalContext
};
var robertoReal = RelocProfile.buildRelocationProfile(robertoRealInput);
var realMeta = robertoReal.sourceIds.fragmentMeta || [];
var metaTypes = {};
realMeta.forEach(function (m) { metaTypes[m.angleKey] = m.fragmentType; });
assert(
  'Roberto → Lisboa real: 4 fragmentIds (AC/DC delta, MC/IC presence)',
  robertoReal.ok === true &&
    robertoReal.sourceIds.fragmentIds.length === 4 &&
    robertoReal.sourceIds.fragmentIds.indexOf('RELOC_ASC_TO_AIR') !== -1 &&
    robertoReal.sourceIds.fragmentIds.indexOf('RELOC_DC_TO_FIRE') !== -1 &&
    robertoReal.sourceIds.fragmentIds.indexOf('RELOC_MC_PRESENT_WATER') !== -1 &&
    robertoReal.sourceIds.fragmentIds.indexOf('RELOC_IC_PRESENT_EARTH') !== -1 &&
    metaTypes.AC === 'delta' && metaTypes.DC === 'delta' &&
    metaTypes.MC === 'presence' && metaTypes.IC === 'presence',
  'fragmentIds=' + JSON.stringify(robertoReal.sourceIds.fragmentIds) +
    ' · metaTypes=' + JSON.stringify(metaTypes)
);

try {
  execSync(process.env.ROOT + '/scripts/dev-relocation-profile-smoke.sh', {
    stdio: 'pipe',
    encoding: 'utf8'
  });
  assert('dev-relocation-profile-smoke.sh', true, 'OVERALL: PASS');
} catch (e) {
  assert('dev-relocation-profile-smoke.sh', false, (e.stdout || e.message || '').split('\n').slice(-3).join(' '));
}

console.log('');
console.log('═'.repeat(60));
console.log('Ejemplo fragmento RELOC_ASC_TO_AIR:');
console.log(JSON.stringify({
  id: airFrag.id,
  role: airFrag.role,
  headline: airFrag.headline,
  bridgeTags: airFrag.bridgeTags
}, null, 2));
console.log('');
console.log('RelocationProfile.sourceIds (Lisboa mock):');
console.log(JSON.stringify(profile.sourceIds, null, 2));
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
