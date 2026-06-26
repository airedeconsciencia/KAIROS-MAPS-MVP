#!/usr/bin/env bash
# Kairos Maps — Smoke Shadow Analytics Export (7.8b)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_SCRIPT="$ROOT/scripts/export-shadow-analytics-json.sh"
OUT_FILE="$ROOT/tmp/shadow-analytics-f7.8b.json"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
APP="$ROOT/src/ui/app.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Shadow Analytics export smoke (7.8b)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$EXPORT_SCRIPT" "$NARRATIVE" "$APP"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

"$EXPORT_SCRIPT"

export OUT_FILE NARRATIVE APP ROOT

node <<'NODE'
const fs = require('fs');

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function objectHasInvalidNumber(obj, path) {
  path = path || '';
  if (obj == null) return null;
  if (typeof obj === 'number') {
    if (!isFiniteNumber(obj)) return path || 'root';
    return null;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      const bad = objectHasInvalidNumber(obj[i], path + '[' + i + ']');
      if (bad) return bad;
    }
    return null;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const bad = objectHasInvalidNumber(obj[key], path ? path + '.' + key : key);
      if (bad) return bad;
    }
  }
  return null;
}

const outFile = process.env.OUT_FILE;
assert('Archivo export existe', fs.existsSync(outFile), outFile);

let payload;
let parseOk = true;
try {
  payload = JSON.parse(fs.readFileSync(outFile, 'utf8'));
} catch (err) {
  parseOk = false;
  payload = null;
}

assert('Export genera JSON válido', parseOk, parseOk ? 'parsed' : 'parse error');

assert(
  'schemaVersion correcto',
  payload && payload.schemaVersion === '7.8b-0.1',
  payload && payload.schemaVersion
);

assert('cityCount = 106', payload && payload.cityCount === 106, 'cityCount=' + (payload && payload.cityCount));
assert('countryCount = 103', payload && payload.countryCount === 103, 'countryCount=' + (payload && payload.countryCount));
assert('archetypeCount = 28', payload && payload.archetypeCount === 28, 'archetypeCount=' + (payload && payload.archetypeCount));
assert('dimensionCount = 10', payload && payload.dimensionCount === 10, 'dimensionCount=' + (payload && payload.dimensionCount));
assert(
  'reviewRequiredCount = 7',
  payload && payload.reviewRequiredCount === 7,
  'reviewRequiredCount=' + (payload && payload.reviewRequiredCount)
);
assert(
  'neutralFallbackRate = 0',
  payload && payload.neutralFallbackRate === 0,
  'neutralFallbackRate=' + (payload && payload.neutralFallbackRate)
);

const requiredTopLevel = [
  'generatedAt',
  'schemaVersion',
  'cityCount',
  'countryCount',
  'archetypeCount',
  'dimensionCount',
  'reviewRequiredCount',
  'neutralFallbackRate',
  'datasetAnalytics',
  'archetypeStatistics',
  'dimensionStatistics',
  'confidenceStatistics'
];

const missingFields = requiredTopLevel.filter(function (field) {
  return !payload || !Object.prototype.hasOwnProperty.call(payload, field);
});

assert(
  'Campos mínimos presentes',
  missingFields.length === 0,
  missingFields.length ? 'missing=' + missingFields.join(',') : 'ok'
);

const raw = fs.readFileSync(outFile, 'utf8');
const forbiddenKeys = [
  'displayName',
  'summary',
  'compatibleGoals',
  'incompatibleLabels',
  'favorece',
  'desafia',
  'observar',
  'aprovecha',
  'integracion',
  'birthDate',
  'birthPlace',
  'birthTime',
  'natalChart',
  'natal',
  'lectura',
  'readingText'
];

const foundForbidden = forbiddenKeys.filter(function (key) {
  return raw.indexOf('"' + key + '"') !== -1;
});

assert(
  'No contiene narrative text / lecturas / birth data keys',
  foundForbidden.length === 0,
  foundForbidden.length ? foundForbidden.join(', ') : 'ok'
);

const birthPatterns = [
  /"birth(?:Date|Place|Time|Data)"/i,
  /"natal(?:Chart|Data|Input)?"/i,
  /"dateOfBirth"/i,
  /"horaNacimiento"/i,
  /"fechaNacimiento"/i
];

const foundBirthPattern = birthPatterns.find(function (pattern) {
  return pattern.test(raw);
});

assert(
  'No contiene birth data patterns',
  !foundBirthPattern,
  foundBirthPattern ? String(foundBirthPattern) : 'ok'
);

const invalidNumber = objectHasInvalidNumber(payload);
assert(
  'No contiene NaN/Infinity',
  !invalidNumber,
  invalidNumber || 'ok'
);

const narrativeSrc = fs.readFileSync(process.env.NARRATIVE, 'utf8');
const appSrc = fs.readFileSync(process.env.APP, 'utf8');

assert(
  'Narrative no modificado por export tooling',
  narrativeSrc.indexOf('export-shadow-analytics-json') === -1,
  'no references'
);
assert(
  'app.js no modificado por export tooling',
  appSrc.indexOf('export-shadow-analytics-json') === -1 &&
    appSrc.indexOf('shadow-analytics-f7.8b') === -1,
  'no references'
);

console.log('');
console.log('Export:', outFile);
console.log('generatedAt:', payload && payload.generatedAt);
console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
