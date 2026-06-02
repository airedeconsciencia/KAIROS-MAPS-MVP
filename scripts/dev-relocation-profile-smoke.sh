#!/usr/bin/env bash
# Kairos Maps — Smoke Relocation Profile scaffold (Fase 3.7b)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELOC="$ROOT/src/services/relocation-profile-service.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Relocation Profile smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$RELOC" "$GOAL_SIGNAL" "$BRIDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export RELOC GOAL_SIGNAL BRIDGE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

[process.env.GOAL_SIGNAL, process.env.RELOC, process.env.BRIDGE].forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const Reloc = ctx.window.KairosRelocationProfile;
const GS = ctx.window.KairosGoalSignal;
const Bridge = ctx.window.KairosNatalMapBridge;

if (!Reloc) throw new Error('KairosRelocationProfile no definido');
if (!GS) throw new Error('KairosGoalSignal no definido');
if (!Bridge) throw new Error('KairosNatalMapBridge no definido');

const build = Reloc.buildRelocationProfile;

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

function mockMapLines() {
  const planets = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno'];
  const angles = ['MC', 'IC', 'AC', 'DC'];
  const lines = [];
  planets.forEach(function (planet) {
    angles.forEach(function (angle) {
      lines.push({ id: planet + '-' + angle.toLowerCase(), planet: planet, angle: angle });
    });
  });
  return lines;
}

const validInput = {
  natalChart: ROBERTO_NATAL,
  targetLocation: LISBOA,
  relocatedAngles: RELOC_LISBOA,
  goalContext: GS.buildContext({ mainGoal: 'amor' })
};

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

const valid = build(validInput);
assert(
  '1. input válido mock → ok:true',
  valid.ok === true && valid.profileType === 'RELOCATION',
  'profileType=' + valid.profileType + ' · tags=' + JSON.stringify(valid.tags.slice(0, 4))
);

assert(
  'bridgeProfile tags/themes presentes',
  valid.bridgeProfile &&
    Array.isArray(valid.bridgeProfile.tags) &&
    valid.bridgeProfile.tags.length > 0 &&
    Array.isArray(valid.bridgeProfile.themes) &&
    valid.bridgeProfile.themes.length > 0,
  'themes=' + JSON.stringify(valid.bridgeProfile && valid.bridgeProfile.themes)
);

const noTarget = build(Object.assign({}, validInput, { targetLocation: null }));
assert(
  '2. falta targetLocation → ok:false',
  noTarget.ok === false && noTarget.reason === 'missing_target_location',
  'reason=' + noTarget.reason
);

const noAngles = build(Object.assign({}, validInput, { relocatedAngles: null }));
assert(
  '3. faltan relocatedAngles → ok:false',
  noAngles.ok === false && noAngles.reason === 'missing_relocated_angles',
  'reason=' + noAngles.reason
);

const trabajoCtx = GS.buildContext({ mainGoal: 'trabajo' });
const withTrabajo = build(Object.assign({}, validInput, { goalContext: trabajoCtx }));
assert(
  '4. goalContext trabajo',
  withTrabajo.ok && withTrabajo.meta.goal === 'trabajo',
  'goal=' + withTrabajo.meta.goal + ' · themes=' + JSON.stringify(withTrabajo.themes)
);

const descansoCtx = GS.buildContext({ mainGoal: 'descanso' });
const withDescanso = build(Object.assign({}, validInput, { goalContext: descansoCtx }));
assert(
  '5. goalContext descanso',
  withDescanso.ok && withDescanso.meta.goal === 'descanso',
  'goal=' + withDescanso.meta.goal + ' · themes=' + JSON.stringify(withDescanso.themes)
);

assert(
  'trabajo ≠ descanso themes',
  JSON.stringify(withTrabajo.themes) !== JSON.stringify(withDescanso.themes),
  'trabajo=' + JSON.stringify(withTrabajo.themes) + ' · descanso=' + JSON.stringify(withDescanso.themes)
);

const again = build(validInput);
assert(
  '6. determinismo estable',
  JSON.stringify({
    profileKey: again.profileKey,
    tags: again.tags,
    themes: again.themes,
    tensionMode: again.tensionMode
  }) === JSON.stringify({
    profileKey: valid.profileKey,
    tags: valid.tags,
    themes: valid.themes,
    tensionMode: valid.tensionMode
  }),
  'profileKey=' + valid.profileKey
);

const bridgeResult = Bridge.buildBridge({
  tags: valid.bridgeProfile.tags,
  themes: valid.bridgeProfile.themes,
  tensionMode: valid.bridgeProfile.tensionMode,
  mapLines: mockMapLines(),
  goalContext: validInput.goalContext
});

assert(
  'Bridge acepta bridgeProfile reloc',
  bridgeResult.ok && bridgeResult.priorityLines.length > 0,
  'priorityLines[0]=' + (bridgeResult.priorityLines[0] || '—')
);

console.log('');
console.log('═'.repeat(60));
console.log('Ejemplo output (válido):');
console.log(JSON.stringify({
  ok: valid.ok,
  profileType: valid.profileType,
  profileKey: valid.profileKey,
  tags: valid.tags,
  themes: valid.themes,
  bridgeProfile: valid.bridgeProfile,
  meta: valid.meta
}, null, 2));
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
