#!/usr/bin/env bash
# Kairos Maps — Smoke lecturas ciudad (Fase 3.8d editorial)
# Piloto: MERCURIO_AC, VENUS_AC, LUNA_AC, SATURNO_AC × amor/trabajo/descanso
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
const rows = R.inspectAll(I);

let fail = 0;
const bodies = [];

console.log('Piloto 3.8d — palabras por lectura (objetivo 120–250):\n');
rows.forEach(function (row) {
  const ok = row.issues.length === 0;
  const tag = ok ? 'OK' : 'FAIL';
  if (!ok) fail += 1;
  console.log(`  [${tag}] ${row.key} / ${row.aspect}: ${row.words} palabras`);
  if (row.issues.length) {
    row.issues.forEach(function (i) { console.log(`         → ${i}`); });
  }
  bodies.push(row.text);
});

const dup = new Map();
bodies.forEach(function (t, idx) {
  const norm = t.replace(/\{ciudad\}/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (dup.has(norm)) {
    console.log(`\n  WARN duplicado cercano: fila ${idx + 1} ≈ fila ${dup.get(norm) + 1}`);
    fail += 1;
  } else {
    dup.set(norm, idx);
  }
});

const legacy = [];
const aspects = ['amor', 'trabajo', 'descanso'];
Object.keys(I).forEach(function (k) {
  if (R.PILOT_KEYS.indexOf(k) !== -1) return;
  aspects.forEach(function (a) {
    const e = I[k][a];
    if (typeof e === 'string') legacy.push(R.wordCount(e));
  });
});
legacy.sort((a, b) => a - b);
console.log('\nLegacy (36 combos × 3 aspectos, string):');
console.log(`  min=${legacy[0]} med=${legacy[Math.floor(legacy.length / 2)]} max=${legacy[legacy.length - 1]}`);
console.log(`  bajo 35 palabras: ${legacy.filter((w) => w < 35).length}/${legacy.length}`);

console.log('');
if (fail) {
  console.log(`RESULTADO: FAIL (${fail} incidencias)`);
  process.exit(1);
}
console.log('RESULTADO: OK');
NODE
