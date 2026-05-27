#!/usr/bin/env bash
# Kairos Maps — Smoke composición natal lite (Fase 3.3c1)
# Verifica natal-lite.js + natal-composition-service.js con Node.
# Sin UI, sin Puppeteer, sin dependencias npm.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Natal composition smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "Raíz repo: $ROOT"
echo ""

for f in "$NATAL_LITE" "$COMPOSITION"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

echo "Archivos: OK"
echo "  • src/content/natal-lite.js"
echo "  • src/services/natal-composition-service.js"
echo ""

export NATAL_LITE COMPOSITION

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const natalLitePath = process.env.NATAL_LITE;
const compositionPath = process.env.COMPOSITION;

const ctx = { window: {} };
vm.createContext(ctx);

try {
  vm.runInContext(fs.readFileSync(natalLitePath, 'utf8'), ctx, { filename: natalLitePath });
  if (typeof ctx.window.KairosNatalLite === 'undefined') {
    throw new Error('KairosNatalLite no definido tras cargar natal-lite.js');
  }
  vm.runInContext(fs.readFileSync(compositionPath, 'utf8'), ctx, { filename: compositionPath });
  if (typeof ctx.window.KairosNatalComposition === 'undefined') {
    throw new Error('KairosNatalComposition no definido tras cargar natal-composition-service.js');
  }
} catch (err) {
  console.error('LOAD FAIL:', err.message);
  process.exit(1);
}

const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

const cases = [
  {
    id: 1,
    label: "Sol Géminis · Luna Cáncer · Asc Libra",
    input: { sun: 'gemini', moon: 'cancer', asc: 'libra' },
    expect: { tensionMode: false, bridgeFrom: 'ASC' }
  },
  {
    id: 2,
    label: "Sol Virgo · Luna Sagitario · Asc Escorpio",
    input: { sun: 'virgo', moon: 'sagittarius', asc: 'scorpio' },
    expect: { tensionMode: true, bridgeFrom: 'MOON' }
  },
  {
    id: 3,
    label: "Sol Leo · Luna Capricornio · Asc Géminis",
    input: { sun: 'leo', moon: 'capricorn', asc: 'gemini' },
    expect: { tensionMode: true, bridgeFrom: 'MOON' }
  },
  {
    id: 4,
    label: "Golden G1 · Sol Géminis · Luna Acuario · Asc Libra",
    input: { sun: 'gemini', moon: 'aquarius', asc: 'libra' },
    expect: { tensionMode: false, bridgeFrom: 'ASC' }
  }
];

function validateResult(result) {
  if (result.ok !== true) return 'result.ok !== true';
  if (!result.title || typeof result.title !== 'string') return 'title missing';
  if (!result.reading || typeof result.reading !== 'string') return 'reading missing';
  if (!result.meta || typeof result.meta !== 'object') return 'meta missing';
  if (result.meta.tensionScore == null) return 'meta.tensionScore missing';
  if (!Array.isArray(result.meta.styleWarnings)) return 'meta.styleWarnings not array';
  if (!Array.isArray(result.meta.clichesDetected)) return 'meta.clichesDetected not array';
  return null;
}

let allPass = true;

cases.forEach(function (c) {
  const result = compose(c.input);
  const validationError = validateResult(result);
  const modeOk = result.meta && result.meta.tensionMode === c.expect.tensionMode;
  const bridgeOk = result.meta && result.meta.bridgeFrom === c.expect.bridgeFrom;
  const casePass = !validationError && modeOk && bridgeOk;

  if (!casePass) allPass = false;

  console.log('─'.repeat(60));
  console.log('CASE ' + c.id + ': ' + c.label);
  console.log('RESULT:', casePass ? 'PASS' : 'FAIL');
  if (validationError) console.log('  validation:', validationError);
  if (!modeOk) {
    console.log('  tensionMode:', result.meta && result.meta.tensionMode,
      '(expected', c.expect.tensionMode + ')');
  }
  if (!bridgeOk) {
    console.log('  bridgeFrom:', result.meta && result.meta.bridgeFrom,
      '(expected', c.expect.bridgeFrom + ')');
  }
  if (result.ok) {
    console.log('  title:', result.title);
    console.log('  tensionScore:', result.meta.tensionScore);
    console.log('  tensionMode:', result.meta.tensionMode);
    console.log('  bridgeFrom:', result.meta.bridgeFrom);
    console.log('  charCount:', result.meta.charCount);
    console.log('  styleWarnings:', JSON.stringify(result.meta.styleWarnings));
    console.log('  clichesDetected:', JSON.stringify(result.meta.clichesDetected));
  }
});

console.log('');
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
