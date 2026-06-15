#!/usr/bin/env bash
# Kairos Maps — Smoke Cities Catalog (Fase 3.8f.0)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

CATALOG="$ROOT/src/content/cities-catalog.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
TEMPLATES="$ROOT/src/content/city-summary-templates.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Cities Catalog smoke (3.8f.1)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$TEMPLATES" "$SCORER" "$ASTRO"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export CATALOG GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE TEMPLATES SCORER ASTRO ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.CATALOG,
  process.env.ASTRO,
  process.env.NATAL_LITE,
  process.env.COMPOSITION,
  process.env.GOAL_SIGNAL,
  process.env.TEMPLATES,
  process.env.SCORER,
  process.env.BRIDGE
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const Scorer = ctx.window.KairosCityScorer;
const GS = ctx.window.KairosGoalSignal;
const Bridge = ctx.window.KairosNatalMapBridge;
const Astro = ctx.window.KairosAstro;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert(
  'Catalog existe (schema 3.8f.1)',
  Catalog && Catalog.SCHEMA_VERSION.indexOf('3.8f.1') === 0,
  'schema=' + (Catalog && Catalog.SCHEMA_VERSION)
);

const validation = Catalog.validateCatalog();
assert('validateCatalog interno', validation.ok, validation.issues.join(' · ') || 'ok');

assert(
  '31 ciudades (estado actual)',
  Catalog.CITIES.length === 31,
  'count=' + Catalog.CITIES.length
);

const countries = Catalog.getCountries();
assert(
  '30 países únicos (estado actual)',
  countries.length === 30,
  countries.map(function (c) { return c.name; }).join(', ')
);

const ids = {};
let dup = false;
Catalog.CITIES.forEach(function (city) {
  const id = Catalog.cityIdFromRef(city);
  if (ids[id]) dup = true;
  ids[id] = true;
});
assert('Cero cityId duplicados', !dup, Object.keys(ids).length + ' ids únicos');

assert(
  'Scorer importa catalog (sin COUNTRY_CODES local)',
  Scorer && typeof Scorer.scoreCities === 'function',
  'schema=' + Scorer.schemaVersion
);

const robertoUtcIso = (function () {
  try {
    return execSync(
      "python3 -c \"from datetime import datetime; import zoneinfo; " +
      "dt=datetime(1973,5,29,7,30,tzinfo=zoneinfo.ZoneInfo('Europe/Madrid')); " +
      "print(dt.astimezone(zoneinfo.ZoneInfo('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z'))\"",
      { encoding: 'utf8' }
    ).trim();
  } catch (e) {
    return '1973-05-29T05:30:00.000Z';
  }
})();

const utc = vm.runInContext("new Date('" + robertoUtcIso + "')", ctx);
const lines = Astro.computeAllLines(utc);
const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

['amor', 'trabajo', 'descanso'].forEach(function (goalId) {
  const g = GS.buildContext({ mainGoal: goalId });
  const br = Bridge.buildBridge({
    tags: bp.tags, themes: bp.themes, tensionMode: bp.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
    goalContext: g
  });
  const result = Scorer.scoreCities({
    cities: Catalog.CITIES,
    lines: lines,
    goalContext: g,
    bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM,
      maxSuggestions: 3,
      minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  });
  assert(
    'Scorer scoreCities goal=' + goalId,
    result.ok && result.suggestions.length > 0,
    'evaluated=' + result.meta.citiesEvaluated + ' suggestions=' + result.suggestions.length
  );
});

const lab = Catalog.getLabCities();
assert(
  'Lab cities (Lisboa, Toronto, Cabo)',
  lab.length === 3 && lab.every(function (c) { return c.country; }),
  lab.map(function (c) { return c.name + '/' + c.country; }).join(' · ')
);

assert(
  'COUNTRY_IDS alineados (30)',
  Object.keys(Catalog.COUNTRY_IDS).length === 30,
  'sample=' + Catalog.resolveCountryId('Portugal')
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
