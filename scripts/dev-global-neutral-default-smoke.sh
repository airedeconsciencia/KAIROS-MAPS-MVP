#!/usr/bin/env bash
# Kairos Maps — GLOBAL_NEUTRAL DEFAULT switch smoke (F2.2d3)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
CATALOG="$ROOT/src/content/cities-catalog.js"
RESOLVER="$ROOT/src/services/editorial-family-resolver.js"
ARCHETYPES="$ROOT/src/content/country-archetypes.js"
COUNTRY_SERVICE="$ROOT/src/services/country-archetype-service.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"
INTERP="$ROOT/src/content/interpretations.js"
BLOCKS="$ROOT/src/content/premium-blocks.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — GLOBAL_NEUTRAL DEFAULT smoke (F2.2d3)"
echo " Scope: DEFAULT switch · Reykjavik · regresión LATAM · Lisboa · Oslo WE"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" "$RESOLVER" \
  "$ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$INTERP" "$BLOCKS" \
  "$KNOWLEDGE" "$NARRATIVE" "$PREMIUM"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG RESOLVER ARCHETYPES COUNTRY_SERVICE \
  SCORER ASTRO INTERP BLOCKS KNOWLEDGE NARRATIVE PREMIUM ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.CATALOG, process.env.RESOLVER,
  process.env.ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.KNOWLEDGE,
  process.env.NARRATIVE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const EFR = ctx.window.KairosEditorialFamily;
const Premium = ctx.window.KairosCityPremiumComposition;
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

const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const LATAM_LEAK = [
  'cercanía habitada',
  'lo cotidiano cercano',
  'planes demasiado cuidados',
  'verdad, no personaje',
  'pausa habitada',
  'calor humano',
  'calor relacional'
];
const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';

const REYKJAVIK = { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 };
const OSLO = Catalog.findCityByName('Oslo');
const BOGOTA = { name: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 };

assert(
  'DEFAULT_FAMILY === GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY === 'GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY
);
assert(
  'Schema F2.2d3+',
  EFR.SCHEMA_VERSION.indexOf('f2.2d3') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f2.3b') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f2.5c') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f2.6c') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f2.7c') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.3c') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.6b') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.7b') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.8b') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.8') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.7') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.6') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.5') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.4') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.2') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.3') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f4.1') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.17') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.16') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.15') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.14') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.13c') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.13b') !== -1 ||
    EFR.SCHEMA_VERSION.indexOf('f3.13a') !== -1,
  EFR.SCHEMA_VERSION
);

assert(
  'País no mapeado (Reykjavik/iceland) → GLOBAL_NEUTRAL',
  EFR.resolveEditorialFamily({ cityName: 'Reykjavik', countryId: 'iceland' }) === 'GLOBAL_NEUTRAL',
  EFR.resolveEditorialFamily({ cityName: 'Reykjavik', countryId: 'iceland' })
);
assert(
  'Oslo/norway → WESTERN_EUROPE (F3.13a E1a)',
  EFR.resolveEditorialFamily({ cityName: 'Oslo', countryId: 'norway' }) === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'Oslo', countryId: 'norway' })
);
assert(
  'Bogotá/colombia → LATAM (F2.3b wave 1)',
  EFR.resolveEditorialFamily({ cityName: 'Bogotá', countryId: 'colombia' }) === 'LATAM',
  EFR.resolveEditorialFamily({ cityName: 'Bogotá', countryId: 'colombia' })
);
assert(
  'Lisboa/portugal → IBERIAN explícito',
  EFR.resolveEditorialFamily({ cityName: 'Lisboa', countryId: 'portugal' }) === 'IBERIAN',
  EFR.resolveEditorialFamily({ cityName: 'Lisboa', countryId: 'portugal' })
);
assert(
  'París/france → WESTERN_EUROPE (F2.5c)',
  EFR.resolveEditorialFamily({ cityName: 'París', countryId: 'france' }) === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'París', countryId: 'france' })
);
assert(
  'Nairobi/kenya → AFRICAN_COASTAL explícito (no DEFAULT)',
  EFR.resolveEditorialFamily({ cityName: 'Nairobi', countryId: 'kenya' }) === 'AFRICAN_COASTAL',
  'Kenia mapeado en COUNTRY_EDITORIAL_FAMILY — no cae en GLOBAL_NEUTRAL'
);

['vietnam', 'malaysia', 'indonesia', 'philippines'].forEach(function (slug) {
  assert(
    slug + ' → SOUTHEAST_ASIAN (F3.6b SEA+)',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug }) === 'SOUTHEAST_ASIAN',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug })
  );
});
assert(
  'Malasia display → malaysia slug → SOUTHEAST_ASIAN',
  EFR.coerceCountryId('Malasia') === 'malaysia' &&
    EFR.resolveEditorialFamily({ cityName: 'Kuala Lumpur', countryDisplay: 'Malasia' }) === 'SOUTHEAST_ASIAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Malasia'),
    family: EFR.resolveEditorialFamily({ cityName: 'Kuala Lumpur', countryDisplay: 'Malasia' })
  })
);

['pakistan', 'bangladesh', 'sri_lanka', 'nepal'].forEach(function (slug) {
  assert(
    slug + ' → SOUTH_ASIAN (F3.7b SA+)',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug }) === 'SOUTH_ASIAN',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug })
  );
});
assert(
  'Pakistán display → pakistan slug → SOUTH_ASIAN',
  EFR.coerceCountryId('Pakistán') === 'pakistan' &&
    EFR.resolveEditorialFamily({ cityName: 'Karachi', countryDisplay: 'Pakistán' }) === 'SOUTH_ASIAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Pakistán'),
    family: EFR.resolveEditorialFamily({ cityName: 'Karachi', countryDisplay: 'Pakistán' })
  })
);
assert(
  'Sri Lanka display → sri_lanka slug → SOUTH_ASIAN',
  EFR.coerceCountryId('Sri Lanka') === 'sri_lanka' &&
    EFR.resolveEditorialFamily({ cityName: 'Colombo', countryDisplay: 'Sri Lanka' }) === 'SOUTH_ASIAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Sri Lanka'),
    family: EFR.resolveEditorialFamily({ cityName: 'Colombo', countryDisplay: 'Sri Lanka' })
  })
);

['mexico', 'argentina', 'brazil', 'peru', 'colombia', 'chile', 'uruguay', 'ecuador', 'costa_rica', 'panama'].forEach(function (slug) {
  assert(
    'LATAM resolver ' + slug,
    EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'LATAM',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug })
  );
});
assert(
  'Costa Rica display → costa_rica slug → LATAM (F3.8b)',
  EFR.coerceCountryId('Costa Rica') === 'costa_rica' &&
    EFR.resolveEditorialFamily({ cityName: 'San José', countryDisplay: 'Costa Rica' }) === 'LATAM',
  JSON.stringify({
    slug: EFR.coerceCountryId('Costa Rica'),
    family: EFR.resolveEditorialFamily({ cityName: 'San José', countryDisplay: 'Costa Rica' })
  })
);
assert(
  'Panamá display → panama slug → LATAM (F3.8b)',
  EFR.coerceCountryId('Panamá') === 'panama' &&
    EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryDisplay: 'Panamá' }) === 'LATAM',
  JSON.stringify({
    slug: EFR.coerceCountryId('Panamá'),
    family: EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryDisplay: 'Panamá' })
  })
);

const robertoUtc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

const mockInfluences = [
  { line: { planet: 'venus', planetKey: 'VENUS', angle: 'AC' }, distKm: 431, composite: 0.6 },
  { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'AC' }, distKm: 210, composite: 0.55 },
  { line: { planet: 'marte', planetKey: 'MARTE', angle: 'MC' }, distKm: 120, composite: 0.5 }
];

function scanReading(reading) {
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = full.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  return {
    ok: reading.ok,
    words: reading.meta.wordCount,
    regionN: nc.regionFamily || null,
    regionK: km.regionFamily || null,
    humanConflict: nc.humanConflict || null,
    humanTheme: nc.humanTheme || null,
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1,
    iberian: IBERIAN_LEAK.filter(function (m) {
      return norm.indexOf(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
    }).length,
    latam: LATAM_LEAK.filter(function (m) {
      return norm.indexOf(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
    }).length
  };
}

function composeReading(city, goal) {
  return Premium.composeCityReading({
    city: city,
    goal: goal,
    relevantInfluences: mockInfluences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
}

['amor', 'trabajo', 'descanso'].forEach(function (goal) {
  const reading = composeReading(REYKJAVIK, goal);
  const s = scanReading(reading);
  assert(
    'Reykjavik / ' + goal + ' → GLOBAL_NEUTRAL pipeline',
    s.regionN === 'GLOBAL_NEUTRAL' && s.regionK === 'GLOBAL_NEUTRAL',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK })
  );
  assert(
    'Reykjavik / ' + goal + ' ok:true · words 500–900',
    s.ok === true && s.words >= 500 && s.words <= 900,
    JSON.stringify({ ok: s.ok, words: s.words })
  );
  assert(
    'Reykjavik / ' + goal + ' leak + legacy 0',
    s.iberian === 0 && s.latam === 0 && !s.p03 && !s.p06 && !s.p10,
    JSON.stringify({ iberian: s.iberian, latam: s.latam, p03: s.p03, p06: s.p06, p10: s.p10 })
  );
});

const bogotaGoals = ['amor', 'trabajo', 'descanso'];
bogotaGoals.forEach(function (goal) {
  const reading = composeReading(BOGOTA, goal);
  const s = scanReading(reading);
  assert(
    'Bogotá / ' + goal + ' → LATAM',
    s.regionN === 'LATAM' && s.regionK === 'LATAM',
    JSON.stringify(s)
  );
  assert(
    'Bogotá / ' + goal + ' IBERIAN leak 0 · gates 0',
    s.iberian === 0 && !s.p03 && !s.p06 && !s.p10 && s.ok === true &&
      s.words >= 500 && s.words <= 900,
    JSON.stringify({ iberian: s.iberian, p03: s.p03, p06: s.p06, p10: s.p10, words: s.words })
  );
});

const wave1Latam = [
  { label: 'Santiago / amor', city: { name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693 }, goal: 'amor' },
  { label: 'Montevideo / trabajo', city: { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lon: -56.1645 }, goal: 'trabajo' },
  { label: 'Quito / descanso', city: { name: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678 }, goal: 'descanso' }
];
wave1Latam.forEach(function (c) {
  const reading = composeReading(c.city, c.goal);
  const s = scanReading(reading);
  assert(
    c.label + ' → LATAM',
    s.regionN === 'LATAM' && s.regionK === 'LATAM' && s.iberian === 0 &&
      s.ok === true && s.words >= 500 && s.words <= 900 && !s.p03 && !s.p06 && !s.p10,
    JSON.stringify(s)
  );
});

const nairobi = Catalog.findCityByName('Nairobi');
const nairobiReading = composeReading(nairobi, 'trabajo');
const nairobiScan = scanReading(nairobiReading);
assert(
  'Nairobi / trabajo → AFRICAN_COASTAL (explicit map)',
  nairobiScan.regionN === 'AFRICAN_COASTAL' && nairobiScan.regionK === 'AFRICAN_COASTAL',
  JSON.stringify(nairobiScan)
);

const lisboa = Catalog.findCityByName('Lisboa');
const lisboaAmor = composeReading(lisboa, 'amor');
const lisboaScan = scanReading(lisboaAmor);
assert(
  'Lisboa / amor → IBERIAN explícito',
  lisboaScan.regionN === 'IBERIAN' && lisboaScan.regionK === 'IBERIAN',
  JSON.stringify(lisboaScan)
);

const reykjavikAmor = composeReading(REYKJAVIK, 'amor');
const reykjavikScan = scanReading(reykjavikAmor);
assert(
  'QA comparativa Lisboa ≠ Reykjavik (humanConflict)',
  lisboaScan.humanConflict && reykjavikScan.humanConflict &&
    lisboaScan.humanConflict !== reykjavikScan.humanConflict,
  'Lisboa=' + (lisboaScan.humanConflict || '').slice(0, 50) + ' · Reykjavik=' + (reykjavikScan.humanConflict || '').slice(0, 50)
);

const latamCases = [
  { city: 'Ciudad de México', country: 'México', expected: 'LATAM' },
  { city: 'Buenos Aires', country: 'Argentina', expected: 'LATAM' }
];
latamCases.forEach(function (c) {
  const city = Catalog.findCityByName(c.city);
  const reading = composeReading(city, 'amor');
  const s = scanReading(reading);
  assert(
    c.city + ' / amor → LATAM regresión',
    s.regionN === 'LATAM' && s.regionK === 'LATAM' && s.iberian === 0,
    JSON.stringify(s)
  );
});

console.log('');
console.log('QA neutral (Reykjavik amor sample):');
console.log('  region:', reykjavikScan.regionN);
console.log('  humanConflict:', (reykjavikScan.humanConflict || '').slice(0, 90) + '…');
console.log('  words:', reykjavikScan.words);
console.log('');
console.log('QA IBERIAN (Lisboa amor sample):');
console.log('  region:', lisboaScan.regionN);
console.log('  humanConflict:', (lisboaScan.humanConflict || '').slice(0, 90) + '…');
console.log('');
console.log('Nota: Nairobi permanece AFRICAN_COASTAL — Kenia está mapeado explícitamente.');
console.log('Producción no tocada (solo src/ + scripts/).');
console.log('');
console.log('════════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' SMOKE: ALL PASS');
NODE
