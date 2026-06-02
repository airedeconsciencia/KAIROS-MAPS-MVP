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
  'listFragments() = 16 (matriz 4×4)',
  Array.isArray(list) && list.length === 16,
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

const coverage = RelocLite.inspectCoverage();
assert(
  'inspectCoverage() 16/16 matrix 100%',
  coverage.ok === true &&
    coverage.totalFragments === 16 &&
    coverage.matrixExpected === 16 &&
    coverage.matrixPresent === 16 &&
    coverage.matrixPercent === 100 &&
    coverage.missingMatrix.length === 0,
  'matrix=' + coverage.matrixPresent + '/' + coverage.matrixExpected +
    ' · percent=' + coverage.matrixPercent + '%'
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
  'sourceIds.fragmentIds incluye reloc-lite (4 ángulos Lisboa)',
  Array.isArray(profile.sourceIds.fragmentIds) &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_ASC_TO_AIR') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_MC_TO_EARTH') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_IC_TO_WATER') !== -1 &&
    profile.sourceIds.fragmentIds.indexOf('RELOC_DC_TO_FIRE') !== -1 &&
    profile.sourceIds.fragmentIds.length === 4,
  'fragmentIds=' + JSON.stringify(profile.sourceIds.fragmentIds)
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
