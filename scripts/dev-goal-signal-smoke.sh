#!/usr/bin/env bash
# Kairos Maps — Smoke GoalSignal + Bridge goal-aware (Fase 3.7c.1)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — GoalSignal + Bridge smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {} };
vm.createContext(ctx);

const files = [
  process.env.NATAL_LITE,
  process.env.COMPOSITION,
  process.env.GOAL_SIGNAL,
  process.env.BRIDGE
];

files.forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const GS = ctx.window.KairosGoalSignal;
const Bridge = ctx.window.KairosNatalMapBridge;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

if (!GS) throw new Error('KairosGoalSignal no definido');
if (!Bridge) throw new Error('KairosNatalMapBridge no definido');

const PLANETS = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'pluton'];
const ANGLES = ['MC', 'IC', 'AC', 'DC'];

function mockMapLines() {
  const lines = [];
  PLANETS.forEach(function (planet) {
    ANGLES.forEach(function (angle) {
      lines.push({ id: planet + '-' + angle.toLowerCase(), planet: planet, angle: angle });
    });
  });
  return lines;
}

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

const trabajo = GS.resolve('trabajo');
assert(
  'resolve(trabajo)',
  trabajo && trabajo.id === 'trabajo' && trabajo.scoring.planetBoosts.jupiter === 1,
  'id=' + (trabajo && trabajo.id)
);

const profesion = GS.resolve('profesion');
assert(
  'resolve(profesion) → trabajo',
  profesion && profesion.id === 'trabajo',
  'id=' + (profesion && profesion.id)
);

const viaje = GS.resolve('viaje');
assert(
  'resolve(viaje) → viajes',
  viaje && viaje.id === 'viajes',
  'id=' + (viaje && viaje.id)
);

const ctxProfile = GS.buildContext({ mainGoal: 'amor' });
assert(
  'buildContext(profile)',
  ctxProfile && ctxProfile.primary.id === 'amor' && ctxProfile.effectiveScoring,
  'primary=' + (ctxProfile && ctxProfile.primary.id)
);

const robertoComposition = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' });
const robertoProfile = robertoComposition.meta && robertoComposition.meta.bridgeProfile;
const mapLines = mockMapLines();

const baseInput = {
  tags: robertoProfile.tags,
  themes: robertoProfile.themes,
  tensionMode: robertoProfile.tensionMode === true,
  mapLines: mapLines
};

const withoutGoal = Bridge.buildBridge(baseInput);
const withAmor = Bridge.buildBridge(Object.assign({}, baseInput, {
  goalContext: GS.buildContext({ mainGoal: 'amor' })
}));
const withTrabajo = Bridge.buildBridge(Object.assign({}, baseInput, {
  goalContext: GS.buildContext({ mainGoal: 'trabajo' })
}));

const baselineAgain = Bridge.buildBridge(baseInput);
const baselineStable = JSON.stringify(withoutGoal.priorityLines) === JSON.stringify(baselineAgain.priorityLines);

assert(
  'sin goalContext: determinismo baseline',
  baselineStable && withoutGoal.ok,
  'priorityLines[0]=' + (withoutGoal.priorityLines[0] || '—')
);

const amorTop = withAmor.priorityLines[0] || '';
const trabajoTop = withTrabajo.priorityLines[0] || '';
const goalsDiffer = amorTop !== trabajoTop;

assert(
  'Roberto: amor vs trabajo → distinto priorityLines[0]',
  withAmor.ok && withTrabajo.ok && goalsDiffer,
  'amor=' + amorTop + ' · trabajo=' + trabajoTop
);

function topHasPlanet(result, planets) {
  const top3 = result.priorityLines.slice(0, 3);
  return top3.some(function (lineId) {
    return planets.some(function (p) { return lineId.indexOf(p + '-') === 0; });
  });
}

function topHasAngle(result, angles) {
  const top3 = result.priorityLines.slice(0, 3);
  return top3.some(function (lineId) {
    return angles.some(function (a) { return lineId.endsWith('-' + a.toLowerCase()); });
  });
}

function topHasPlanetAngle(result, planets, angles, limit) {
  const slice = result.priorityLines.slice(0, limit || 3);
  return slice.some(function (lineId) {
    const parts = lineId.split('-');
    if (parts.length < 2) return false;
    const angle = parts[parts.length - 1].toUpperCase();
    const planet = parts.slice(0, -1).join('-');
    return planets.indexOf(planet) !== -1 && angles.indexOf(angle) !== -1;
  });
}

assert(
  'goal trabajo: suben líneas MC / Júpiter / Mercurio / Sol (top-5)',
  topHasPlanetAngle(withTrabajo, ['jupiter', 'mercurio', 'sol', 'venus'], ['MC'], 5),
  'top5=' + JSON.stringify(withTrabajo.priorityLines.slice(0, 5))
);

assert(
  'goal amor: top-3 incluye Venus/Luna/DC',
  topHasPlanet(withAmor, ['venus', 'luna']) &&
    topHasAngle(withAmor, ['DC']),
  'top3=' + JSON.stringify(withAmor.priorityLines.slice(0, 3))
);

const withDescanso = Bridge.buildBridge(Object.assign({}, baseInput, {
  goalContext: GS.buildContext({ mainGoal: 'descanso' })
}));

assert(
  'goal descanso: top-3 incluye Luna/Venus/IC',
  topHasPlanet(withDescanso, ['luna', 'venus']) &&
    topHasAngle(withDescanso, ['IC']),
  'top3=' + JSON.stringify(withDescanso.priorityLines.slice(0, 3))
);

const metaUnchangedShape = withoutGoal.meta && withAmor.meta &&
  typeof withoutGoal.meta.goalApplied === 'boolean' &&
  withAmor.meta.goalApplied === true &&
  withoutGoal.meta.goalApplied === false;

assert(
  'meta.goalApplied flag',
  metaUnchangedShape,
  'baseline goalApplied=' + withoutGoal.meta.goalApplied + ' · amor=' + withAmor.meta.goalApplied
);

console.log('');
console.log('═'.repeat(60));
console.log('Roberto baseline (sin goal):', JSON.stringify(withoutGoal.priorityLines.slice(0, 5)));
console.log('Roberto amor top-5:         ', JSON.stringify(withAmor.priorityLines.slice(0, 5)));
console.log('Roberto trabajo top-5:      ', JSON.stringify(withTrabajo.priorityLines.slice(0, 5)));
console.log('Roberto descanso top-5:     ', JSON.stringify(withDescanso.priorityLines.slice(0, 5)));
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
