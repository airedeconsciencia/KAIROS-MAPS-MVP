#!/usr/bin/env bash
# Kairos Maps — Smoke debug cobertura Natal Lite (Fase 3.3d2)
# Verifica KairosNatalLiteDebug.inspect / stats con Node.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NATAL_LITE="$ROOT/src/content/natal-lite.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Natal Lite debug smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "Raíz repo: $ROOT"
echo ""

if [[ ! -f "$NATAL_LITE" ]]; then
  echo "ERROR: No se encuentra: $NATAL_LITE"
  exit 1
fi

export NATAL_LITE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const natalLitePath = process.env.NATAL_LITE;
const ctx = { window: {}, console: console };
vm.createContext(ctx);

try {
  vm.runInContext(fs.readFileSync(natalLitePath, 'utf8'), ctx, { filename: natalLitePath });
  if (typeof ctx.window.KairosNatalLiteDebug === 'undefined') {
    throw new Error('KairosNatalLiteDebug no definido');
  }
} catch (err) {
  console.error('LOAD FAIL:', err.message);
  process.exit(1);
}

const Debug = ctx.window.KairosNatalLiteDebug;
const inspect = Debug.inspect;
const stats = Debug.stats;

const inspectCases = [
  {
    id: 'Roberto',
    label: 'Roberto · 1973-05-29 Maó',
    input: { sun: 'gemini', moon: 'aries', asc: 'cancer' },
    expect: { ok: true, coveragePercent: 100, missing: [] }
  },
  {
    id: 'G1',
    label: 'Golden G1 · Maó demo',
    input: { sun: 'gemini', moon: 'aquarius', asc: 'libra' },
    expect: { ok: true, coveragePercent: 100, missing: [] }
  },
  {
    id: 'G2',
    label: 'G2 Madrid DST',
    input: { sun: 'aries', moon: 'cancer', asc: 'aries' },
    expect: { ok: true, coveragePercent: 100, missing: [] }
  },
  {
    id: 'MISSING-A',
    label: 'Control missing · Sol Tauro · Luna Piscis · Asc Leo',
    input: { sun: 'taurus', moon: 'pisces', asc: 'leo' },
    expect: {
      ok: false,
      coveragePercent: 33,
      missing: ['SUN_TAURUS', 'MOON_PISCES'],
      available: ['ASC_LEO']
    }
  },
  {
    id: 'MISSING-B',
    label: 'Control missing · Sol Tauro · Luna Aries · Asc Tauro',
    input: { sun: 'taurus', moon: 'aries', asc: 'taurus' },
    expect: {
      ok: false,
      coveragePercent: 33,
      missing: ['SUN_TAURUS', 'ASC_TAURUS'],
      available: ['MOON_ARIES']
    }
  }
];

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = a.slice().sort();
  const sb = b.slice().sort();
  return sa.every(function (v, i) { return v === sb[i]; });
}

let allPass = true;

console.log('── inspect() ──');
inspectCases.forEach(function (c) {
  const result = inspect(c.input);
  const okMatch = result.ok === c.expect.ok;
  const covMatch = result.coveragePercent === c.expect.coveragePercent;
  const missMatch = arraysEqual(result.missing, c.expect.missing);
  const availMatch = !c.expect.available || arraysEqual(result.available, c.expect.available);
  const casePass = okMatch && covMatch && missMatch && availMatch;

  if (!casePass) allPass = false;

  console.log('─'.repeat(60));
  console.log('CASE', c.id + ':', c.label);
  console.log('RESULT:', casePass ? 'PASS' : 'FAIL');
  if (!okMatch) console.log('  ok:', result.ok, '(expected', c.expect.ok + ')');
  if (!covMatch) console.log('  coveragePercent:', result.coveragePercent, '(expected', c.expect.coveragePercent + ')');
  if (!missMatch) console.log('  missing:', JSON.stringify(result.missing), '(expected', JSON.stringify(c.expect.missing) + ')');
  if (!availMatch) console.log('  available:', JSON.stringify(result.available), '(expected', JSON.stringify(c.expect.available) + ')');
  if (casePass) {
    console.log('  ok:', result.ok, '| coverage:', result.coveragePercent + '%');
    console.log('  available:', JSON.stringify(result.available));
    if (result.missing.length) console.log('  missing:', JSON.stringify(result.missing));
  }
});

console.log('');
console.log('── stats() ──');
const s = stats();
const statsOk = s.totalFragments === 20
  && s.byRole.SUN.covered === 6
  && s.byRole.MOON.covered === 6
  && s.byRole.ASC.covered === 8
  && s.gaps.SUN.indexOf('taurus') !== -1
  && s.gaps.MOON.indexOf('pisces') !== -1;

if (!statsOk) allPass = false;

console.log('totalFragments:', s.totalFragments, statsOk ? 'OK' : 'FAIL');
console.log('SUN covered:', s.byRole.SUN.covered + '/' + s.byRole.SUN.total);
console.log('MOON covered:', s.byRole.MOON.covered + '/' + s.byRole.MOON.total);
console.log('ASC covered:', s.byRole.ASC.covered + '/' + s.byRole.ASC.total);
console.log('SUN gaps sample:', s.gaps.SUN.slice(0, 4).join(', '), '…');
console.log('stats():', statsOk ? 'PASS' : 'FAIL');

console.log('');
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
