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
  '59 ciudades (F3.13b E1b resolver expansion)',
  Catalog.CITIES.length === 59,
  'count=' + Catalog.CITIES.length
);

const countries = Catalog.getCountries();
assert(
  '56 países únicos (F3.13b E1b resolver expansion)',
  countries.length === 56,
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
  'COUNTRY_IDS alineados (56)',
  Object.keys(Catalog.COUNTRY_IDS).length === 56,
  'sample=' + Catalog.resolveCountryId('Pakistán')
);

const seaWaveA = [
  { name: 'Ho Chi Minh City', countryId: 'vietnam', code: 'vn' },
  { name: 'Kuala Lumpur', countryId: 'malaysia', code: 'my' },
  { name: 'Jakarta', countryId: 'indonesia', code: 'id' },
  { name: 'Manila', countryId: 'philippines', code: 'ph' }
];
const seaIssues = [];
seaWaveA.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) seaIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      seaIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      seaIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('SEA+ Wave A ciudades + slugs (F3.6c)', seaIssues.length === 0, seaIssues.join(' · '));

const saWaveA = [
  { name: 'Karachi', countryId: 'pakistan', code: 'pk' },
  { name: 'Dhaka', countryId: 'bangladesh', code: 'bd' },
  { name: 'Colombo', countryId: 'sri_lanka', code: 'lk' },
  { name: 'Kathmandu', countryId: 'nepal', code: 'np' }
];
const saIssues = [];
saWaveA.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) saIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      saIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      saIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('SA+ Wave A ciudades + slugs (F3.7c)', saIssues.length === 0, saIssues.join(' · '));

const latamWaveA = [
  { name: 'San José', countryId: 'costa_rica', code: 'cr' },
  { name: 'Ciudad de Panamá', countryId: 'panama', code: 'pa' }
];
const latamIssues = [];
latamWaveA.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) latamIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      latamIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      latamIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('LATAM+ Wave A ciudades + slugs (F3.8c)', latamIssues.length === 0, latamIssues.join(' · '));

const waWaveB = [
  { name: 'Abidjan', countryId: 'ivory_coast', code: 'ci' }
];
const waIssues = [];
waWaveB.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) waIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      waIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      waIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('WA Wave B ciudades + slugs (F3.9b)', waIssues.length === 0, waIssues.join(' · '));

const densificationWaveA = [
  { name: 'Barcelona', countryId: 'spain', code: 'es' },
  { name: 'Mumbai', countryId: 'india', code: 'in' }
];
const densificationIssues = [];
densificationWaveA.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) densificationIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      densificationIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      densificationIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('Densification Wave A ciudades + slugs (F3.10b)', densificationIssues.length === 0, densificationIssues.join(' · '));

const waWaveC = [
  { name: 'Freetown', countryId: 'sierra_leone', code: 'sl' },
  { name: 'Monrovia', countryId: 'liberia', code: 'lr' },
  { name: 'Conakry', countryId: 'guinea', code: 'gn' }
];
const waWaveCIssues = [];
waWaveC.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) waWaveCIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      waWaveCIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      waWaveCIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('WA Wave C Batch 1 ciudades + slugs (F3.11c)', waWaveCIssues.length === 0, waWaveCIssues.join(' · '));

const waWaveC2 = [
  { name: 'Cotonou', countryId: 'benin', code: 'bj' },
  { name: 'Lomé', countryId: 'togo', code: 'tg' },
  { name: 'Banjul', countryId: 'gambia', code: 'gm' }
];
const waWaveC2Issues = [];
waWaveC2.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) waWaveC2Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      waWaveC2Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      waWaveC2Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('WA Wave C Batch 2 ciudades + slugs (F3.11j)', waWaveC2Issues.length === 0, waWaveC2Issues.join(' · '));

const e1aWave = [
  { name: 'Oslo', countryId: 'norway', code: 'no' },
  { name: 'Zúrich', countryId: 'switzerland', code: 'ch' },
  { name: 'Viena', countryId: 'austria', code: 'at' }
];
const e1aIssues = [];
e1aWave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) e1aIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      e1aIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      e1aIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('E1a ciudades + slugs (F3.13a)', e1aIssues.length === 0, e1aIssues.join(' · '));

const e1bWave = [
  { name: 'Bruselas', countryId: 'belgium', code: 'be' },
  { name: 'Varsovia', countryId: 'poland', code: 'pl' },
  { name: 'Praga', countryId: 'czech_republic', code: 'cz' }
];
const e1bIssues = [];
e1bWave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) e1bIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      e1bIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      e1bIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('E1b ciudades + slugs (F3.13b)', e1bIssues.length === 0, e1bIssues.join(' · '));

assert(
  'SCHEMA catálogo f3.13b',
  Catalog.SCHEMA_VERSION === '3.8f.1-f3.13b-0.1',
  Catalog.SCHEMA_VERSION
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
