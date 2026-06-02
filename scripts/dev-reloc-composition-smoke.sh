#!/usr/bin/env bash
# Kairos Maps — Smoke Reloc composition (Fase 3.7b.3)
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
  return null;
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

const cases = [
  { id: 1, label: 'Roberto → Lisboa mock (amor)', goal: 'amor' },
  { id: 2, label: 'goal trabajo', goal: 'trabajo' },
  { id: 3, label: 'goal descanso', goal: 'descanso' }
];

const composedResults = [];

cases.forEach(function (c) {
  const profile = build(baseInput(c.goal));
  const result = compose({ relocationProfile: profile, goalContext: profile.meta && profile.meta.goalContext });
  const validationError = validateComposed(result);
  const rangeOk = result.ok && inCharRange(result);
  const warnOk = result.ok && noCriticalWarnings(result);
  const casePass = !validationError && rangeOk && warnOk;

  composedResults.push(result);

  assert(
    'CASE ' + c.id + ': ' + c.label,
    casePass,
    validationError
      ? validationError
      : 'charCount=' + (result.meta && result.meta.charCount) +
        ' · fragmentIds=' + JSON.stringify(result.fragmentIds) +
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
const det1 = compose({ relocationProfile: detProfile, goalContext: detProfile.meta && detProfile.meta.goalContext });
const det2 = compose({ relocationProfile: detProfile, goalContext: detProfile.meta && detProfile.meta.goalContext });
assert(
  'CASE 5: determinismo estable',
  det1.ok && det2.ok &&
    JSON.stringify(det1.reading) === JSON.stringify(det2.reading) &&
    JSON.stringify(det1.fragmentIds) === JSON.stringify(det2.fragmentIds),
  'fragmentIds=' + JSON.stringify(det1.fragmentIds)
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
if (composedResults[0] && composedResults[0].ok) {
  console.log('Ejemplo lectura compuesta (Roberto → Lisboa):');
  console.log('title:', composedResults[0].title);
  console.log('reading:', composedResults[0].reading);
  console.log('charCount:', composedResults[0].meta.charCount);
  console.log('fragmentIds:', JSON.stringify(composedResults[0].fragmentIds));
}
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
