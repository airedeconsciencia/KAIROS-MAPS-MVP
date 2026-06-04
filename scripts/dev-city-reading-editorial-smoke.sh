#!/usr/bin/env bash
# Kairos Maps — Smoke lecturas ciudad (Fase 3.8d editorial)
# Piloto 3.8d + 3.8d.2 + 3.8d.3 (KairosCityReading.PILOT_KEYS)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INTERP="$ROOT/src/content/interpretations.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — City reading editorial smoke"
echo "══════════════════════════════════════════════════════════"
echo ""

if [[ ! -f "$INTERP" ]]; then
  echo "ERROR: No se encuentra: $INTERP"
  exit 1
fi

export INTERP
node <<'NODE'
const fs = require('fs');
global.window = {};
eval(fs.readFileSync(process.env.INTERP, 'utf8'));

const I = window.INTERPRETATIONS;
const R = window.KairosCityReading;
const aspects = ['amor', 'trabajo', 'descanso'];
const rows = R.inspectAll(I);

const TEMPLATE_PHRASES = [
  'contrastar sensación y hechos',
  'qué te activa y qué te agota',
  'dale unos días para contrastar',
  'sin convertirlo en veredicto inmediato'
];

let fail = 0;
const bodies = [];
const expectedCombos = 27;
const expectedReadings = R.EXPECTED_EXPANDED_READINGS || expectedCombos * aspects.length;

console.log('Piloto editorial (' + R.PILOT_KEYS.length + ' combos, objetivo ' + expectedCombos + ') — palabras (120–250):\n');
rows.forEach(function (row) {
  const ok = row.issues.length === 0;
  const tag = ok ? 'OK' : 'FAIL';
  if (!ok) fail += 1;
  console.log(`  [${tag}] ${row.key} / ${row.aspect}: ${row.words} palabras`);
  if (row.issues.length) {
    row.issues.forEach(function (i) { console.log(`         → ${i}`); });
  }
  bodies.push(row.text);
  const lower = row.text.toLowerCase();
  TEMPLATE_PHRASES.forEach(function (p) {
    if (lower.indexOf(p) !== -1) {
      console.log(`         → template:${p}`);
      fail += 1;
    }
  });
});

if (R.PILOT_KEYS.length !== expectedCombos) {
  console.log(`\n  FAIL combos piloto: ${R.PILOT_KEYS.length} (esperado ${expectedCombos})`);
  fail += 1;
}

const dup = new Map();
bodies.forEach(function (t, idx) {
  const norm = t.replace(/\{ciudad\}/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (dup.has(norm)) {
    console.log(`\n  WARN duplicado exacto: fila ${idx + 1} ≈ fila ${dup.get(norm) + 1}`);
    fail += 1;
  } else {
    dup.set(norm, idx);
  }
});

const legacy = [];
Object.keys(I).forEach(function (k) {
  if (R.PILOT_KEYS.indexOf(k) !== -1) return;
  aspects.forEach(function (a) {
    const e = I[k][a];
    if (typeof e === 'string') legacy.push(R.wordCount(e));
  });
});
legacy.sort((a, b) => a - b);
const expandedCount = R.PILOT_KEYS.length * aspects.length;
const totalReadings = Object.keys(I).length * aspects.length;
const legacyCount = totalReadings - expandedCount;

console.log('\nCobertura: ' + expandedCount + '/' + totalReadings + ' lecturas expandidas');
if (expandedCount !== expectedReadings) {
  console.log('  FAIL cobertura expandida: ' + expandedCount + ' (esperado ' + expectedReadings + ')');
  fail += 1;
}

console.log('\nLegacy (' + legacyCount + ' lecturas string):');
if (legacy.length) {
  console.log(`  min=${legacy[0]} med=${legacy[Math.floor(legacy.length / 2)]} max=${legacy[legacy.length - 1]}`);
  console.log(`  bajo 35 palabras: ${legacy.filter((w) => w < 35).length}/${legacy.length}`);
}

console.log('');
if (fail) {
  console.log(`RESULTADO: FAIL (${fail} incidencias)`);
  process.exit(1);
}
console.log('RESULTADO: OK');
NODE
