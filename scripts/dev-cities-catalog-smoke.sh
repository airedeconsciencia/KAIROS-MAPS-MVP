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
  '105 ciudades (F6.2 MENA expansion)',
  Catalog.CITIES.length === 105,
  'count=' + Catalog.CITIES.length
);

const countries = Catalog.getCountries();
assert(
  '102 países únicos (F6.2 MENA expansion)',
  countries.length === 102,
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
  'COUNTRY_IDS alineados (102)',
  Object.keys(Catalog.COUNTRY_IDS).length === 102,
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

const e1cWave = [
  { name: 'Copenhague', countryId: 'denmark', code: 'dk' },
  { name: 'Helsinki', countryId: 'finland', code: 'fi' }
];
const e1cIssues = [];
e1cWave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) e1cIssues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      e1cIssues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      e1cIssues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('E1c ciudades + slugs (F3.13c)', e1cIssues.length === 0, e1cIssues.join(' · '));

const e2Wave = [
  { name: 'Casablanca', countryId: 'morocco', code: 'ma' },
  { name: 'Túnez', countryId: 'tunisia', code: 'tn' }
];
const e2Issues = [];
e2Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) e2Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      e2Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      e2Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('E2 Magreb ciudades + slugs (F3.14)', e2Issues.length === 0, e2Issues.join(' · '));

const f315Wave = [
  { name: 'Shanghái', countryId: 'china', code: 'cn' },
  { name: 'Taipéi', countryId: 'taiwan', code: 'tw' }
];
const f315Issues = [];
f315Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f315Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f315Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f315Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F3.15 Asia Oriental ciudades + slugs', f315Issues.length === 0, f315Issues.join(' · '));

const f316Wave = [
  { name: 'Dubái', countryId: 'united_arab_emirates', code: 'ae' },
  { name: 'Doha', countryId: 'qatar', code: 'qa' },
  { name: 'Riad', countryId: 'saudi_arabia', code: 'sa' }
];
const f316Issues = [];
f316Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f316Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f316Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f316Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F3.16 Golfo ciudades + slugs', f316Issues.length === 0, f316Issues.join(' · '));

const f317Wave = [
  { name: 'Addis Abeba', countryId: 'ethiopia', code: 'et' },
  { name: 'Dar es Salaam', countryId: 'tanzania', code: 'tz' }
];
const f317Issues = [];
f317Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f317Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f317Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f317Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F3.17 África Este ciudades + slugs', f317Issues.length === 0, f317Issues.join(' · '));

const f41Wave = [
  { name: 'Tel Aviv', countryId: 'israel', code: 'il' },
  { name: 'Amán', countryId: 'jordan', code: 'jo' }
];
const f41Issues = [];
f41Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f41Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f41Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f41Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.1 Levante ciudades + slugs', f41Issues.length === 0, f41Issues.join(' · '));

const f43Wave = [
  { name: 'Kampala', countryId: 'uganda', code: 'ug' },
  { name: 'Kigali', countryId: 'rwanda', code: 'rw' }
];
const f43Issues = [];
f43Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f43Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f43Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f43Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.3 África Este+ ciudades + slugs', f43Issues.length === 0, f43Issues.join(' · '));

const f42Wave = [
  { name: 'Dublín', countryId: 'ireland', code: 'ie' },
  { name: 'Zagreb', countryId: 'croatia', code: 'hr' },
  { name: 'Budapest', countryId: 'hungary', code: 'hu' }
];
const f42Issues = [];
f42Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f42Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f42Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f42Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.2 Europa residual ciudades + slugs', f42Issues.length === 0, f42Issues.join(' · '));

const f44Wave = [
  { name: 'Luanda', countryId: 'angola', code: 'ao' },
  { name: 'Maputo', countryId: 'mozambique', code: 'mz' }
];
const f44Issues = [];
f44Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f44Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f44Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f44Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.4 África Austral ciudades + slugs', f44Issues.length === 0, f44Issues.join(' · '));

const f45Wave = [
  { name: 'Asunción', countryId: 'paraguay', code: 'py' },
  { name: 'La Paz', countryId: 'bolivia', code: 'bo' }
];
const f45Issues = [];
f45Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f45Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f45Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f45Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.5 LATAM residual ciudades + slugs', f45Issues.length === 0, f45Issues.join(' · '));

const f46Wave = [
  { name: 'Phnom Penh', countryId: 'cambodia', code: 'kh' },
  { name: 'Vientián', countryId: 'laos', code: 'la' }
];
const f46Issues = [];
f46Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f46Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f46Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f46Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.6 SEA residual ciudades + slugs', f46Issues.length === 0, f46Issues.join(' · '));

const f47Wave = [
  { name: 'Yangón', countryId: 'myanmar', code: 'mm' },
  { name: 'Bandar Seri Begawan', countryId: 'brunei', code: 'bn' }
];
const f47Issues = [];
f47Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f47Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f47Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f47Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.7 SEA residual final ciudades + slugs', f47Issues.length === 0, f47Issues.join(' · '));

const f48Wave = [
  { name: 'Kingston', countryId: 'jamaica', code: 'jm' },
  { name: 'Port of Spain', countryId: 'trinidad_and_tobago', code: 'tt' },
  { name: 'Bridgetown', countryId: 'barbados', code: 'bb' }
];
const f48Issues = [];
f48Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f48Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f48Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f48Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.8 ANGLO Caribe ciudades + slugs', f48Issues.length === 0, f48Issues.join(' · '));

const f49Wave = [
  { name: 'Thimphu', countryId: 'bhutan', code: 'bt' },
  { name: 'Malé', countryId: 'maldives', code: 'mv' },
  { name: 'Kabul', countryId: 'afghanistan', code: 'af' }
];
const f49Issues = [];
f49Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f49Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f49Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f49Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.9 SOUTH_ASIAN residual ciudades + slugs', f49Issues.length === 0, f49Issues.join(' · '));

const f410Wave = [
  { name: 'Bamako', countryId: 'mali', code: 'ml' },
  { name: 'Uagadugú', countryId: 'burkina_faso', code: 'bf' },
  { name: 'Niamey', countryId: 'niger', code: 'ne' }
];
const f410Issues = [];
f410Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f410Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f410Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f410Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.10 WEST_AFRICAN Sahel ciudades + slugs', f410Issues.length === 0, f410Issues.join(' · '));

const f411Wave = [
  { name: 'Antananarivo', countryId: 'madagascar', code: 'mg' },
  { name: 'Port Louis', countryId: 'mauritius', code: 'mu' },
  { name: 'Windhoek', countryId: 'namibia', code: 'na' }
];
const f411Issues = [];
f411Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f411Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f411Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f411Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F4.11 AFRICAN_COASTAL Southern ciudades + slugs', f411Issues.length === 0, f411Issues.join(' · '));

const f51Wave = [
  { name: 'Nassau', countryId: 'bahamas', code: 'bs' },
  { name: 'Belmopán', countryId: 'belize', code: 'bz' },
  { name: 'Georgetown', countryId: 'guyana', code: 'gy' }
];
const f51Issues = [];
f51Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f51Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f51Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f51Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F5.1 ANGLO Caribbean II ciudades + slugs', f51Issues.length === 0, f51Issues.join(' · '));

const f52Wave = [
  { name: 'Ulán Bator', countryId: 'mongolia', code: 'mn' },
  { name: 'Dili', countryId: 'timor_leste', code: 'tl' }
];
const f52Issues = [];
f52Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f52Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f52Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f52Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F5.2 EAST_ASIAN + SOUTHEAST_ASIAN closure ciudades + slugs', f52Issues.length === 0, f52Issues.join(' · '));

const f62Wave = [
  { name: 'Beirut', countryId: 'lebanon', code: 'lb' },
  { name: 'Ciudad de Kuwait', countryId: 'kuwait', code: 'kw' },
  { name: 'Mascate', countryId: 'oman', code: 'om' }
];
const f62Issues = [];
f62Wave.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) f62Issues.push('missing city ' + entry.name);
  else {
    if (Catalog.resolveCountryId(city.country) !== entry.countryId) {
      f62Issues.push(entry.name + ' countryId=' + Catalog.resolveCountryId(city.country));
    }
    if (Catalog.resolveCountryCode(city.country) !== entry.code) {
      f62Issues.push(entry.name + ' code=' + Catalog.resolveCountryCode(city.country));
    }
  }
});
assert('F6.2 MENA expansion ciudades + slugs', f62Issues.length === 0, f62Issues.join(' · '));

assert(
  'SCHEMA catálogo f6.2',
  Catalog.SCHEMA_VERSION === '3.8f.1-f6.2-0.1',
  Catalog.SCHEMA_VERSION
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
