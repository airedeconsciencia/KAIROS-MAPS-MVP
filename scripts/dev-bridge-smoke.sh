#!/usr/bin/env bash
# Kairos Maps — Smoke Bridge Natal → Mapa (Fase 3.6b)
# Verifica natal-map-bridge-service.js con Node.
# Sin UI, sin Puppeteer, sin dependencias npm.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Natal Map Bridge smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "Raíz repo: $ROOT"
echo ""

for f in "$NATAL_LITE" "$COMPOSITION" "$BRIDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

echo "Archivos: OK"
echo "  • src/content/natal-lite.js"
echo "  • src/services/natal-composition-service.js"
echo "  • src/services/natal-map-bridge-service.js"
echo ""

export NATAL_LITE COMPOSITION BRIDGE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const natalLitePath = process.env.NATAL_LITE;
const compositionPath = process.env.COMPOSITION;
const bridgePath = process.env.BRIDGE;
const ctx = { window: {} };
vm.createContext(ctx);

try {
  vm.runInContext(fs.readFileSync(natalLitePath, 'utf8'), ctx, { filename: natalLitePath });
  vm.runInContext(fs.readFileSync(compositionPath, 'utf8'), ctx, { filename: compositionPath });
  vm.runInContext(fs.readFileSync(bridgePath, 'utf8'), ctx, { filename: bridgePath });
  if (typeof ctx.window.KairosNatalMapBridge === 'undefined') {
    throw new Error('KairosNatalMapBridge no definido');
  }
  if (typeof ctx.window.KairosNatalComposition === 'undefined') {
    throw new Error('KairosNatalComposition no definido');
  }
} catch (err) {
  console.error('LOAD FAIL:', err.message);
  process.exit(1);
}

const build = ctx.window.KairosNatalMapBridge.buildBridge;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

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

const robertoTags = ['communication', 'stimulation', 'reflection', 'movement', 'initiative', 'emotional_safety', 'intimacy'];
const robertoThemes = ['communication', 'movement', 'intimacy'];

const communicationInput = {
  tags: ['communication', 'stimulation', 'reflection'],
  themes: ['communication'],
  tensionMode: false,
  mapLines: mockMapLines()
};

const tensionInput = {
  tags: robertoTags,
  themes: robertoThemes,
  tensionMode: true,
  mapLines: mockMapLines()
};

const incompleteInput = {
  tags: ['communication', 'reflection'],
  themes: [],
  tensionMode: false,
  mapLines: mockMapLines().slice(0, 8)
};

const emptyInput = {
  tags: [],
  themes: [],
  tensionMode: false,
  mapLines: []
};

function validateShape(result) {
  if (!result || typeof result !== 'object') return 'result not object';
  if (!Array.isArray(result.matches)) return 'matches not array';
  if (!Array.isArray(result.priorityLines)) return 'priorityLines not array';
  if (typeof result.confidence !== 'number') return 'confidence not number';
  if (result.matches.some(function (m) {
    return !m.lineId || typeof m.score !== 'number' || !m.priority;
  })) return 'match shape invalid';
  if (result.matches.some(function (m) {
    return typeof m.score === 'number' && (m.score < 0 || m.score > 1);
  })) return 'score out of range';
  return null;
}

function hasInterpretiveText(result) {
  const blob = JSON.stringify(result).toLowerCase();
  const banned = ['identidad', 'lugar', 'ciudad', 'puede', 'amor', 'trabajo'];
  return banned.some(function (word) { return blob.indexOf('"' + word) !== -1; });
}

let allPass = true;

function runCase(id, label, input, expect) {
  const result = build(input);
  const shapeError = validateShape(result);
  const interpretive = hasInterpretiveText(result);
  let casePass = !shapeError && !interpretive;

  if (expect.ok != null && result.ok !== expect.ok) casePass = false;
  if (expect.error && result.error !== expect.error) casePass = false;
  if (expect.minPriority != null && result.priorityLines.length < expect.minPriority) casePass = false;
  if (expect.maxPriority != null && result.priorityLines.length > expect.maxPriority) casePass = false;
  if (expect.minConfidence != null && result.confidence < expect.minConfidence) casePass = false;
  if (expect.includesLine && result.priorityLines.indexOf(expect.includesLine) === -1) casePass = false;

  if (!casePass) allPass = false;

  console.log('─'.repeat(60));
  console.log('CASE ' + id + ': ' + label);
  console.log('RESULT:', casePass ? 'PASS' : 'FAIL');
  if (shapeError) console.log('  shape:', shapeError);
  if (interpretive) console.log('  interpretive text detected');
  if (expect.ok != null && result.ok !== expect.ok) {
    console.log('  ok:', result.ok, '(expected', expect.ok + ')');
  }
  if (expect.error && result.error !== expect.error) {
    console.log('  error:', result.error, '(expected', expect.error + ')');
  }
  console.log('  confidence:', result.confidence);
  console.log('  priorityLines:', JSON.stringify(result.priorityLines));
  if (result.ok && result.matches.length) {
    const top = result.matches.slice(0, 3).map(function (m) {
      return m.lineId + ':' + m.score;
    });
    console.log('  top matches:', top.join(', '));
  }
  return result;
}

console.log('── payload válido (communication) ──');
const validResult = runCase(1, 'tags communication · 40 líneas · sin tension', communicationInput, {
  ok: true,
  minPriority: 1,
  minConfidence: 0.4,
  includesLine: 'mercurio-mc'
});

console.log('');
console.log('── payload válido (tensionMode) ──');
runCase('1b', 'Roberto-like tags · tensionMode · luna-ic priorizada', tensionInput, {
  ok: true,
  minPriority: 1,
  minConfidence: 0.4,
  includesLine: 'luna-ic'
});

console.log('');
console.log('── payload incompleto ──');
runCase(2, 'tags parciales · sin themes · 8 líneas', incompleteInput, {
  ok: true,
  maxPriority: 5
});

console.log('');
console.log('── payload vacío (sin líneas) ──');
runCase(3, 'mapLines vacío', emptyInput, {
  ok: false,
  error: 'NO_LINES'
});

console.log('');
console.log('── payload sin señal ──');
runCase(4, 'tags/themes vacíos con líneas', {
  tags: [],
  themes: [],
  tensionMode: false,
  mapLines: mockMapLines().slice(0, 4)
}, {
  ok: false,
  error: 'NO_SIGNAL'
});

console.log('');
console.log('── determinismo ──');
const runA = build(communicationInput);
const runB = build(communicationInput);
const deterministic = JSON.stringify(runA) === JSON.stringify(runB);
console.log('─'.repeat(60));
console.log('CASE 5: respuesta determinista');
console.log('RESULT:', deterministic ? 'PASS' : 'FAIL');
if (!deterministic) {
  allPass = false;
  console.log('  JSON A != JSON B');
}

console.log('');
console.log('── compositor → bridge (Roberto) ──');
const robertoComposition = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' });
const robertoProfile = robertoComposition.meta && robertoComposition.meta.bridgeProfile;
const compositorBridgeInput = robertoProfile ? {
  tags: robertoProfile.tags,
  themes: robertoProfile.themes,
  tensionMode: robertoProfile.tensionMode,
  mapLines: mockMapLines()
} : null;
const compositorBridge = compositorBridgeInput ? build(compositorBridgeInput) : null;
const compositorPass = !!(
  robertoComposition.ok &&
  robertoProfile &&
  compositorBridge &&
  compositorBridge.ok &&
  compositorBridge.priorityLines.length >= 1
);
console.log('─'.repeat(60));
console.log('CASE 6: compositor bridgeProfile → buildBridge (Roberto)');
console.log('RESULT:', compositorPass ? 'PASS' : 'FAIL');
if (robertoProfile) {
  console.log('  themes:', JSON.stringify(robertoProfile.themes));
  console.log('  priorityLines:', JSON.stringify(compositorBridge && compositorBridge.priorityLines));
  console.log('  confidence:', compositorBridge && compositorBridge.confidence);
}
if (!compositorPass) allPass = false;

console.log('');
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
