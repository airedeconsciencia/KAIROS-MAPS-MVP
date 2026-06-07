#!/usr/bin/env bash
# Kairos Maps — Smoke Country Archetype (Fase 3.8f.2 pilot)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CATALOG="$ROOT/src/content/cities-catalog.js"
ARCHETYPES="$ROOT/src/content/country-archetypes.js"
SERVICE="$ROOT/src/services/country-archetype-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Country Archetype smoke (3.8f.2)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$ARCHETYPES" "$SERVICE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG ARCHETYPES SERVICE ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

[
  process.env.CATALOG,
  process.env.ARCHETYPES,
  process.env.SERVICE
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Archetypes = ctx.window.KairosCountryArchetypes;
const Service = ctx.window.KairosCountryArchetype;
const Catalog = ctx.window.KairosCitiesCatalog;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const PILOT = [
  'portugal', 'spain', 'france', 'united_kingdom', 'italy',
  'japan', 'brazil', 'argentina', 'south_africa', 'canada'
];

assert(
  'Servicio existe (schema 3.8f.2)',
  Service && Service.SCHEMA_VERSION.indexOf('3.8f.2') === 0,
  'schema=' + (Service && Service.SCHEMA_VERSION)
);

assert(
  '10 países piloto en índice',
  Archetypes && Archetypes.PILOT_COUNTRY_IDS.length === 10,
  Archetypes.PILOT_COUNTRY_IDS.join(', ')
);

PILOT.forEach(function (id) {
  const a = Archetypes.getArchetype(id);
  assert('País existe: ' + id, !!a, a ? a.name : 'missing');
});

assert(
  'curated:true en los 10',
  PILOT.every(function (id) {
    const a = Archetypes.getArchetype(id);
    return a && a.curated === true;
  }),
  'all curated'
);

function editorialText(archetype) {
  var copy = Object.assign({}, archetype);
  delete copy.avoidCliches;
  delete copy.id;
  delete copy.name;
  delete copy.region;
  delete copy.curated;
  delete copy.sourceNotes;
  return JSON.stringify(copy);
}

const DETERMINISTIC_BAD = [
  /\bes\s+Piscis\b/i,
  /\bes\s+Capricornio\b/i,
  /\bes\s+Sagitario\b/i,
  /\bPortugal\s+es\s+/i,
  /\bJapón\s+es\s+Capricornio/i,
  /\bEspaña\s+es\s+Sagitario/i
];

const TOURIST_BAD = ['fado', 'samba', 'sushi', 'flamenco', 'torre eiffel', 'safari'];

let detOk = true;
let touristInBody = false;

PILOT.forEach(function (id) {
  const a = Archetypes.getArchetype(id);
  const text = editorialText(a);
  DETERMINISTIC_BAD.forEach(function (re) {
    if (re.test(text)) detOk = false;
  });
  TOURIST_BAD.forEach(function (token) {
    if (text.toLowerCase().indexOf(token) !== -1) touristInBody = true;
  });
});

assert('Sin afirmaciones deterministas zodiacales', detOk, 'no "es Piscis/Capricornio/Sagitario"');
assert('Sin clichés turísticos en cuerpo (solo avoidCliches)', !touristInBody, 'tokens clean');

assert(
  'goalModifiers amor/trabajo/descanso en los 10',
  PILOT.every(function (id) {
    const g = Archetypes.getArchetype(id).goalModifiers;
    return g && g.amor && g.amor.length && g.trabajo && g.trabajo.length &&
      g.descanso && g.descanso.length;
  }),
  'all goals'
);

assert(
  'lineModifiers moon/venus/saturn en los 10',
  PILOT.every(function (id) {
    const l = Archetypes.getArchetype(id).lineModifiers;
    return l && l.moon && l.moon.length && l.venus && l.venus.length && l.saturn && l.saturn.length;
  }),
  'all lines'
);

assert(
  'avoidCliches existe en los 10',
  PILOT.every(function (id) {
    const a = Archetypes.getArchetype(id);
    return a.avoidCliches && a.avoidCliches.length >= 3;
  }),
  'avoid lists present'
);

const missing = Service.resolveCountryArchetype({ city: { name: 'X' } });
assert(
  'Fail-soft missing_country',
  missing.ok === false && missing.reason === 'missing_country',
  'reason=' + missing.reason
);

const kenya = Service.resolveCountryArchetype({
  city: Catalog.findCityByName('Nairobi'),
  goal: 'amor',
  linePlanet: 'moon'
});
assert(
  'Fail-soft country_not_curated (Kenia)',
  kenya.ok === false && kenya.reason === 'country_not_curated',
  'countryId=' + kenya.countryId
);

const lisboa = Catalog.findCityByName('Lisboa');
const ptMoonAmor = Service.resolveCountryArchetype({
  city: lisboa,
  goal: 'amor',
  linePlanet: 'moon'
});
const ptMoonAmor2 = Service.resolveCountryArchetype({
  city: lisboa,
  goal: 'amor',
  linePlanet: 'moon'
});

assert(
  'Resolve Portugal Luna amor ok',
  ptMoonAmor.ok === true && ptMoonAmor.countryId === 'portugal',
  ptMoonAmor.exampleSnippet && ptMoonAmor.exampleSnippet.slice(0, 80)
);

assert(
  'Determinismo estable (Portugal Luna amor ×2)',
  JSON.stringify(ptMoonAmor.selectedModifiers) === JSON.stringify(ptMoonAmor2.selectedModifiers),
  'seed=' + ptMoonAmor.meta.seed
);

const jpSaturnTrabajo = Service.resolveCountryArchetype({
  city: Catalog.findCityByName('Tokio'),
  goal: 'trabajo',
  linePlanet: 'saturn'
});
assert(
  'Resolve Japón Saturno trabajo ok',
  jpSaturnTrabajo.ok === true && jpSaturnTrabajo.countryId === 'japan',
  jpSaturnTrabajo.exampleSnippet && jpSaturnTrabajo.exampleSnippet.slice(0, 80)
);

const caMoonDescanso = Service.resolveCountryArchetype({
  city: Catalog.findCityByName('Toronto'),
  goal: 'descanso',
  linePlanet: 'moon'
});
assert(
  'Resolve Canadá Luna descanso ok',
  caMoonDescanso.ok === true && caMoonDescanso.countryId === 'canada',
  caMoonDescanso.exampleSnippet && caMoonDescanso.exampleSnippet.slice(0, 80)
);

console.log('');
console.log('Lab ejemplos:');
console.log('  Portugal/Luna/amor:', ptMoonAmor.exampleSnippet);
console.log('  Japón/Saturno/trabajo:', jpSaturnTrabajo.exampleSnippet);
console.log('  Canadá/Luna/descanso:', caMoonDescanso.exampleSnippet);

console.log('');
console.log('════════════════════════════════════════════════════════════');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: FAIL (' + fail + ')');
console.log('════════════════════════════════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
NODE
