#!/usr/bin/env bash
# Kairos Maps — Smoke Reloc composition (Fase 3.7b.4)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELOC_LITE="$ROOT/src/content/reloc-lite.js"
RELOC_PROFILE="$ROOT/src/services/relocation-profile-service.js"
RELOC_COMP="$ROOT/src/services/reloc-composition-service.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Reloc composition smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$RELOC_LITE" "$RELOC_PROFILE" "$RELOC_COMP" "$GOAL_SIGNAL"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export RELOC_LITE RELOC_PROFILE RELOC_COMP GOAL_SIGNAL ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

[
  process.env.GOAL_SIGNAL,
  process.env.RELOC_LITE,
  process.env.RELOC_PROFILE,
  process.env.RELOC_COMP
].forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const RelocProfile = ctx.window.KairosRelocationProfile;
const RelocComp = ctx.window.KairosRelocComposition;
const GS = ctx.window.KairosGoalSignal;

if (!RelocProfile) throw new Error('KairosRelocationProfile no definido');
if (!RelocComp) throw new Error('KairosRelocComposition no definido');
if (!GS) throw new Error('KairosGoalSignal no definido');

const compose = RelocComp.composeRelocationReading;
const build = RelocProfile.buildRelocationProfile;

const ROBERTO_NATAL = { sun: 'gemini', moon: 'aries', asc: 'cancer' };
const LISBOA = {
  name: 'Lisboa',
  country: 'Portugal',
  lat: 38.7223,
  lon: -9.1393,
  cityId: 'lisboa-pt'
};
const RELOC_LISBOA = {
  AC: { sign: 'libra', slug: 'libra', degree: 12.4 },
  MC: { sign: 'capricorn', slug: 'capricorn', degree: 8.1 },
  IC: { sign: 'cancer', slug: 'cancer', degree: 8.1 },
  DC: { sign: 'aries', slug: 'aries', degree: 12.4 }
};

function baseInput(goal) {
  return {
    natalChart: ROBERTO_NATAL,
    targetLocation: LISBOA,
    relocatedAngles: RELOC_LISBOA,
    goalContext: GS.buildContext({ mainGoal: goal })
  };
}

function validateComposed(result) {
  if (result.ok !== true) return 'result.ok !== true';
  if (!result.title || typeof result.title !== 'string') return 'title missing';
  if (!result.reading || typeof result.reading !== 'string') return 'reading missing';
  if (!result.reading.length) return 'reading empty';
  if (!Array.isArray(result.fragmentIds) || !result.fragmentIds.length) return 'fragmentIds missing';
  if (!result.meta || typeof result.meta !== 'object') return 'meta missing';
  if (typeof result.meta.charCount !== 'number') return 'meta.charCount missing';
  if (!Array.isArray(result.meta.styleWarnings)) return 'meta.styleWarnings not array';
  if (!Array.isArray(result.meta.clichesDetected)) return 'meta.clichesDetected not array';
  if (!Array.isArray(result.meta.includedRoles)) return 'meta.includedRoles not array';
  if (!Array.isArray(result.meta.omittedRoles)) return 'meta.omittedRoles not array';
  if (typeof result.meta.roleCoveragePercent !== 'number') return 'meta.roleCoveragePercent missing';
  return null;
}

function hasFourRoles(result) {
  var expected = ['ASC', 'MC', 'IC', 'DC'];
  var included = result.meta.includedRoles || [];
  return expected.every(function (role) { return included.indexOf(role) !== -1; });
}

function roleCoverageOk(result, fragmentCount) {
  if ((result.meta.omittedRoles || []).length !== 0) return false;
  if (fragmentCount === 4 && result.meta.roleCoveragePercent !== 100) return false;
  return hasFourRoles(result);
}

function inCharRange(result) {
  var len = result.reading.length;
  return len >= RelocComp.MIN_CHARS && len <= RelocComp.MAX_CHARS;
}

function noCriticalWarnings(result) {
  if (result.meta.criticalWarnings) return false;
  if (result.meta.clichesDetected.length > 0) return false;
  if (result.meta.styleWarnings.indexOf('too_short') !== -1) return false;
  return true;
}

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

const ROBERTO_REAL_ANGLES = {
  AC: { slug: 'gemini' },
  MC: { slug: 'pisces' },
  IC: { slug: 'virgo' },
  DC: { slug: 'sagittarius' }
};
const ROBERTO_NATAL_ANGLES = {
  sun: 'gemini',
  moon: 'aries',
  asc: 'cancer',
  angles: {
    AC: { slug: 'cancer' },
    MC: { slug: 'pisces' },
    IC: { slug: 'virgo' },
    DC: { slug: 'capricorn' }
  }
};

const cases = [
  { id: 1, label: 'Roberto → Lisboa mock (amor)', goal: 'amor' },
  { id: 2, label: 'goal trabajo', goal: 'trabajo' },
  { id: 3, label: 'goal descanso', goal: 'descanso' },
  {
    id: 6,
    label: 'Roberto → Lisboa real (delta + presence)',
    goal: 'amor',
    natalChart: ROBERTO_NATAL_ANGLES,
    relocatedAngles: ROBERTO_REAL_ANGLES,
    expectFragmentIds: [
      'RELOC_ASC_TO_AIR',
      'RELOC_DC_TO_FIRE',
      'RELOC_IC_PRESENT_EARTH',
      'RELOC_MC_PRESENT_WATER'
    ]
  }
];

const composedResults = [];

cases.forEach(function (c) {
  var input = c.natalChart
    ? {
        natalChart: c.natalChart,
        targetLocation: LISBOA,
        relocatedAngles: c.relocatedAngles,
        goalContext: GS.buildContext({ mainGoal: c.goal })
      }
    : baseInput(c.goal);
  const profile = build(input);
  const goalContext = GS.buildContext({ mainGoal: c.goal });
  const result = compose({ relocationProfile: profile, goalContext: goalContext });
  const validationError = validateComposed(result);
  const rangeOk = result.ok && inCharRange(result);
  const warnOk = result.ok && noCriticalWarnings(result);
  const rolesOk = result.ok && roleCoverageOk(result, (profile.sourceIds && profile.sourceIds.fragmentIds || []).length);
  var fragmentsOk = true;
  if (c.expectFragmentIds) {
    fragmentsOk = c.expectFragmentIds.every(function (id) {
      return profile.sourceIds.fragmentIds.indexOf(id) !== -1;
    }) && profile.sourceIds.fragmentIds.length === 4;
  }
  const casePass = !validationError && rangeOk && warnOk && rolesOk && fragmentsOk;

  if (c.id === 6) composedResults.unshift(result);
  else composedResults.push(result);

  assert(
    'CASE ' + c.id + ': ' + c.label,
    casePass,
    validationError
      ? validationError
      : 'charCount=' + (result.meta && result.meta.charCount) +
        ' · includedRoles=' + JSON.stringify(result.meta && result.meta.includedRoles) +
        ' · omittedRoles=' + JSON.stringify(result.meta && result.meta.omittedRoles) +
        ' · roleCoveragePercent=' + (result.meta && result.meta.roleCoveragePercent) +
        ' · styleWarnings=' + JSON.stringify(result.meta && result.meta.styleWarnings)
  );
});

const profileForFail = build(baseInput('amor'));
const failInput = Object.assign({}, profileForFail);
failInput.sourceIds = Object.assign({}, profileForFail.sourceIds, { fragmentIds: [] });
const failResult = compose({ relocationProfile: failInput });
assert(
  'CASE 4: fragmentos ausentes → ok:false',
  failResult.ok === false && failResult.reason === 'no_fragments',
  'reason=' + failResult.reason
);

const detProfile = build(baseInput('amor'));
const detGoal = GS.buildContext({ mainGoal: 'amor' });
const det1 = compose({ relocationProfile: detProfile, goalContext: detGoal });
const det2 = compose({ relocationProfile: detProfile, goalContext: detGoal });
assert(
  'CASE 5: determinismo estable',
  det1.ok && det2.ok &&
    JSON.stringify(det1.reading) === JSON.stringify(det2.reading) &&
    JSON.stringify(det1.fragmentIds) === JSON.stringify(det2.fragmentIds) &&
    JSON.stringify(det1.meta.includedRoles) === JSON.stringify(det2.meta.includedRoles),
  'includedRoles=' + JSON.stringify(det1.meta.includedRoles)
);

try {
  execSync(process.env.ROOT + '/scripts/dev-reloc-lite-smoke.sh', {
    stdio: 'pipe',
    encoding: 'utf8'
  });
  assert('dev-reloc-lite-smoke.sh', true, 'OVERALL: PASS');
} catch (e) {
  assert('dev-reloc-lite-smoke.sh', false, (e.stdout || e.message || '').split('\n').slice(-3).join(' '));
}

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
if (composedResults[0] && composedResults[0].ok) {
  console.log('Ejemplo lectura compuesta (Roberto → Lisboa):');
  console.log('title:', composedResults[0].title);
  console.log('reading:', composedResults[0].reading);
  console.log('charCount:', composedResults[0].meta.charCount);
  console.log('includedRoles:', JSON.stringify(composedResults[0].meta.includedRoles));
  console.log('omittedRoles:', JSON.stringify(composedResults[0].meta.omittedRoles));
  console.log('roleCoveragePercent:', composedResults[0].meta.roleCoveragePercent);
  console.log('fragmentIds:', JSON.stringify(composedResults[0].fragmentIds));
}
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
