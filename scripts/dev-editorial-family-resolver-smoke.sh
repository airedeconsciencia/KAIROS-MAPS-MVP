#!/usr/bin/env bash
# Kairos Maps — Smoke Unified Editorial Family Resolver (Fase 3.8h.2 DEV)
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
echo " KAIROS MAPS — Editorial Family Resolver smoke (3.8h.2)"
echo " Scope: resolver maestro · split-brain · slug canónico"
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
const { execSync } = require('child_process');

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
const Knowledge = ctx.window.KairosPremiumKnowledge;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Premium = ctx.window.KairosCityPremiumComposition;
const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert('KairosEditorialFamily cargado', !!EFR, 'schema=' + (EFR && EFR.SCHEMA_VERSION));
assert(
  'SCHEMA f3.15',
  EFR.SCHEMA_VERSION === '3.8h.2-f3.15-0.1',
  EFR.SCHEMA_VERSION
);
assert(
  '62 países en COUNTRY_EDITORIAL_FAMILY',
  Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length === 62,
  'count=' + Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length
);
assert(
  '65 ciudades del catálogo resuelven familia',
  Catalog.CITIES.length === 65,
  'cities=' + Catalog.CITIES.length
);

const countries = Catalog.getCountries();
assert('62 países en catálogo', countries.length === 62, 'count=' + countries.length);

const countryMismatches = [];
countries.forEach(function (entry) {
  const coerced = EFR.coerceCountryId(entry.name);
  if (coerced !== entry.countryId) {
    countryMismatches.push(entry.name + ': expected=' + entry.countryId + ' got=' + coerced);
  }
  const family = EFR.resolveEditorialFamily({ cityName: '', countryId: entry.countryId });
  if (!family || family === 'undefined') {
    countryMismatches.push(entry.countryId + ': missing family');
  }
});
assert('country slug mismatches = 0', countryMismatches.length === 0, countryMismatches.join(' · '));

const cityFamilies = {};
Catalog.CITIES.forEach(function (city) {
  const slug = EFR.coerceCountryId(city.country);
  const family = EFR.resolveEditorialFamily({ cityName: city.name, countryId: slug });
  cityFamilies[city.name] = family;
});
assert(
  '65 ciudades resuelven familia editorial',
  Object.keys(cityFamilies).length === 65,
  Object.keys(cityFamilies).length + ' ciudades'
);

const SPLIT_BRAIN_CASES = [
  { city: 'Londres', country: 'Reino Unido', expected: 'ANGLO' },
  { city: 'Atenas', country: 'Grecia', expected: 'MEDITERRANEAN' },
  { city: 'Barcelona', country: 'España', expected: 'MEDITERRANEAN' },
  { city: 'Nueva York', country: 'EE. UU.', expected: 'ANGLO' },
  { city: 'Seúl', country: 'Corea del Sur', expected: 'EAST_ASIAN' },
  { city: 'Ciudad del Cabo', country: 'Sudáfrica', expected: 'AFRICAN_COASTAL' },
  { city: 'El Cairo', country: 'Egipto', expected: 'AFRICAN_COASTAL' },
  { city: 'Nairobi', country: 'Kenia', expected: 'AFRICAN_COASTAL' },
  { city: 'Ciudad de México', country: 'México', expected: 'LATAM' },
  { city: 'Buenos Aires', country: 'Argentina', expected: 'LATAM' },
  { city: 'Lima', country: 'Perú', expected: 'LATAM' },
  { city: 'París', country: 'Francia', expected: 'WESTERN_EUROPE' },
  { city: 'Berlín', country: 'Alemania', expected: 'WESTERN_EUROPE' },
  { city: 'Ámsterdam', country: 'Países Bajos', expected: 'WESTERN_EUROPE' },
  { city: 'Estocolmo', country: 'Suecia', expected: 'WESTERN_EUROPE' },
  { city: 'Bangkok', country: 'Tailandia', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Singapur', country: 'Singapur', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Delhi', country: 'India', expected: 'SOUTH_ASIAN' },
  { city: 'Mumbai', country: 'India', expected: 'SOUTH_ASIAN' },
  { city: 'Karachi', country: 'Pakistán', expected: 'SOUTH_ASIAN' },
  { city: 'Dhaka', country: 'Bangladesh', expected: 'SOUTH_ASIAN' },
  { city: 'Colombo', country: 'Sri Lanka', expected: 'SOUTH_ASIAN' },
  { city: 'Kathmandu', country: 'Nepal', expected: 'SOUTH_ASIAN' },
  { city: 'Bogotá', country: 'Colombia', expected: 'LATAM' },
  { city: 'Santiago', country: 'Chile', expected: 'LATAM' },
  { city: 'Montevideo', country: 'Uruguay', expected: 'LATAM' },
  { city: 'Quito', country: 'Ecuador', expected: 'LATAM' },
  { city: 'San José', country: 'Costa Rica', expected: 'LATAM' },
  { city: 'Ciudad de Panamá', country: 'Panamá', expected: 'LATAM' },
  { city: 'Lisboa', country: 'Portugal', expected: 'IBERIAN' },
  { city: 'Lagos', country: 'Nigeria', expected: 'WEST_AFRICAN' },
  { city: 'Accra', country: 'Ghana', expected: 'WEST_AFRICAN' },
  { city: 'Dakar', country: 'Senegal', expected: 'WEST_AFRICAN' },
  { city: 'Abidjan', country: 'Costa de Marfil', expected: 'WEST_AFRICAN' },
  { city: 'Freetown', country: 'Sierra Leona', expected: 'WEST_AFRICAN' },
  { city: 'Monrovia', country: 'Liberia', expected: 'WEST_AFRICAN' },
  { city: 'Conakry', country: 'Guinea', expected: 'WEST_AFRICAN' },
  { city: 'Cotonou', country: 'Benín', expected: 'WEST_AFRICAN' },
  { city: 'Lomé', country: 'Togo', expected: 'WEST_AFRICAN' },
  { city: 'Banjul', country: 'Gambia', expected: 'WEST_AFRICAN' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Kuala Lumpur', country: 'Malasia', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Jakarta', country: 'Indonesia', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Manila', country: 'Filipinas', expected: 'SOUTHEAST_ASIAN' },
  { city: 'Oslo', country: 'Noruega', expected: 'WESTERN_EUROPE' },
  { city: 'Zúrich', country: 'Suiza', expected: 'WESTERN_EUROPE' },
  { city: 'Viena', country: 'Austria', expected: 'WESTERN_EUROPE' },
  { city: 'Bruselas', country: 'Bélgica', expected: 'WESTERN_EUROPE' },
  { city: 'Varsovia', country: 'Polonia', expected: 'WESTERN_EUROPE' },
  { city: 'Praga', country: 'República Checa', expected: 'WESTERN_EUROPE' },
  { city: 'Copenhague', country: 'Dinamarca', expected: 'WESTERN_EUROPE' },
  { city: 'Helsinki', country: 'Finlandia', expected: 'WESTERN_EUROPE' },
  { city: 'Casablanca', country: 'Marruecos', expected: 'MEDITERRANEAN' },
  { city: 'Túnez', country: 'Túnez', expected: 'MEDITERRANEAN' },
  { city: 'Shanghái', country: 'China', expected: 'EAST_ASIAN' },
  { city: 'Taipéi', country: 'Taiwán', expected: 'EAST_ASIAN' }
];

const splitBrainHits = [];
SPLIT_BRAIN_CASES.forEach(function (c) {
  const slug = EFR.coerceCountryId(c.country);
  const fromSlug = EFR.resolveEditorialFamily({ cityName: c.city, countryId: slug });
  const fromDisplay = EFR.resolveEditorialFamily({ cityName: c.city, countryDisplay: c.country });
  if (fromSlug !== c.expected) {
    splitBrainHits.push(c.city + ' slug→' + fromSlug + ' expected=' + c.expected);
  }
  if (fromDisplay !== c.expected) {
    splitBrainHits.push(c.city + ' display→' + fromDisplay + ' expected=' + c.expected);
  }
  if (fromSlug !== fromDisplay) {
    splitBrainHits.push(c.city + ' slug/display mismatch ' + fromSlug + ' vs ' + fromDisplay);
  }
});
assert('56 casos split-brain = 0', splitBrainHits.length === 0, splitBrainHits.join(' · '));

const resolverDuplicates = [
  typeof Narrative.resolveRegionFamily === 'function',
  typeof Premium.resolveRegionFamily === 'function',
  typeof Knowledge.resolveRegionFamily === 'function'
];
assert(
  'Exports resolveRegionFamily delegados (3 servicios)',
  resolverDuplicates.every(Boolean),
  'narrative=' + resolverDuplicates[0] + ' premium=' + resolverDuplicates[1] + ' knowledge=' + resolverDuplicates[2]
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

const robertoUtc = vm.runInContext("new Date('" + robertoUtcIso + "')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function buildInput(city, goalId) {
  const goalContext = GS.buildContext({ mainGoal: goalId });
  const bridgeResult = Bridge.buildBridge({
    tags: bridgeProfile.tags,
    themes: bridgeProfile.themes,
    tensionMode: bridgeProfile.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
    goalContext: goalContext
  });
  return {
    lines: lines,
    goalContext: goalContext,
    bridgeResult: bridgeResult,
    options: {
      proxKm: Scorer.PROX_KM,
      maxSuggestions: 3,
      minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
}

const pipelineSplitBrain = [];
const mockInfluences = [
  { line: { planet: 'venus', planetKey: 'VENUS', angle: 'AC' }, distKm: 431, composite: 0.6 },
  { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'AC' }, distKm: 210, composite: 0.55 },
  { line: { planet: 'marte', planetKey: 'MARTE', angle: 'MC' }, distKm: 120, composite: 0.5 }
];

SPLIT_BRAIN_CASES.forEach(function (c) {
  const city = Catalog.findCityByName(c.city) || {
    name: c.city,
    country: c.country,
    lat: 0,
    lon: 0
  };
  const input = buildInput(city, 'amor');
  const ranked = Scorer.rankInfluences(city, input);
  const influences = ranked.length ? ranked.slice(0, 5) : mockInfluences;
  const reading = Premium.composeCityReading({
    city: city,
    goal: 'amor',
    relevantInfluences: influences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
  if (!reading.ok) {
    pipelineSplitBrain.push(c.city + ': reading failed ' + (reading.meta && reading.meta.error));
    return;
  }
  const ncFamily = reading.meta.narrativeContext && reading.meta.narrativeContext.regionFamily;
  const kmFamily = reading.meta.knowledgeMeta && reading.meta.knowledgeMeta.regionFamily;
  if (ncFamily !== kmFamily) {
    pipelineSplitBrain.push(c.city + ': narrative=' + ncFamily + ' knowledge=' + kmFamily);
  }
  if (ncFamily !== c.expected) {
    pipelineSplitBrain.push(c.city + ': pipeline family=' + ncFamily + ' expected=' + c.expected);
  }
});
assert(
  'Pipeline knowledge ≡ narrative (56 casos)',
  pipelineSplitBrain.length === 0,
  pipelineSplitBrain.join(' · ')
);

const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const PLACEHOLDER_BAN = ['PLACEHOLDER', 'FIXME', 'lorem ipsum', '[TBD]', '[[', '{{'];

function normFold(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scanDensificationReading(reading, countryId, expectedFamily) {
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = normFold(full);
  const regionE = EFR.resolveEditorialFamily({
    cityName: reading.meta.cityName || '',
    countryId: countryId
  });
  const iberian = IBERIAN_LEAK.filter(function (m) {
    return norm.indexOf(normFold(m)) !== -1;
  }).length;
  const placeholders = PLACEHOLDER_BAN.filter(function (m) {
    return norm.indexOf(normFold(m)) !== -1;
  }).length;
  return {
    ok: reading.ok,
    words: reading.meta.wordCount,
    regionN: nc.regionFamily || null,
    regionK: km.regionFamily || null,
    regionE: regionE,
    expectedFamily: expectedFamily,
    conflict: nc.humanConflict || '',
    full: full,
    iberian: iberian,
    placeholders: placeholders,
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1,
    splitBrain: (nc.regionFamily !== km.regionFamily) ||
      (nc.regionFamily !== expectedFamily) ||
      (km.regionFamily !== expectedFamily) ||
      (regionE !== expectedFamily)
  };
}

function composeDensificationReading(city, goal, slug) {
  const input = buildInput(city, goal);
  const ranked = Scorer.rankInfluences(city, input);
  const influences = ranked.length ? ranked.slice(0, 5) : mockInfluences;
  return Premium.composeCityReading({
    city: city,
    goal: goal,
    relevantInfluences: influences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
}

console.log('\n' + '═'.repeat(60));
console.log('F3.10b Densification Wave A — Barcelona MEDITERRANEAN');
console.log('═'.repeat(60));

const barcelona = Catalog.findCityByName('Barcelona');
['amor', 'trabajo', 'descanso'].forEach(function (goal) {
  const reading = composeDensificationReading(barcelona, goal, 'spain');
  const s = scanDensificationReading(reading, 'spain', 'MEDITERRANEAN');
  assert(
    'Barcelona / ' + goal + ' → ok:true',
    s.ok === true,
    'ok=' + s.ok
  );
  assert(
    'Barcelona / ' + goal + ' → words 500–900',
    s.words >= Premium.MIN_WORDS && s.words <= Premium.MAX_WORDS,
    'words=' + s.words
  );
  assert(
    'Barcelona / ' + goal + ' → MEDITERRANEAN (n=k=e)',
    s.regionN === 'MEDITERRANEAN' && s.regionK === 'MEDITERRANEAN' && s.regionE === 'MEDITERRANEAN',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    'Barcelona / ' + goal + ' → split-brain 0',
    !s.splitBrain,
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    'Barcelona / ' + goal + ' → placeholders 0',
    s.placeholders === 0,
    'hits=' + s.placeholders
  );
  assert(
    'Barcelona / ' + goal + ' → P03/P06/P10 = 0',
    !s.p03 && !s.p06 && !s.p10,
    'p03=' + s.p03 + ' p06=' + s.p06 + ' p10=' + s.p10
  );
});

const madridAmor = scanDensificationReading(
  composeDensificationReading(Catalog.findCityByName('Madrid'), 'amor', 'spain'),
  'spain',
  'MEDITERRANEAN'
);
const barcelonaAmor = scanDensificationReading(
  composeDensificationReading(barcelona, 'amor', 'spain'),
  'spain',
  'MEDITERRANEAN'
);
assert(
  'Madrid amor ≠ Barcelona amor (texto distinto)',
  madridAmor.full !== barcelonaAmor.full,
  madridAmor.full === barcelonaAmor.full ? 'textos idénticos' : 'ok distintos'
);
assert(
  'Madrid amor ≠ Barcelona amor (conflicto distinto)',
  madridAmor.conflict !== barcelonaAmor.conflict &&
    madridAmor.conflict &&
    barcelonaAmor.conflict,
  madridAmor.conflict === barcelonaAmor.conflict ? 'conflictos idénticos' : 'ok distintos'
);
console.log(
  '  Madrid vs Barcelona amor:',
  madridAmor.regionE,
  'vs',
  barcelonaAmor.regionE,
  '| words',
  madridAmor.words,
  'vs',
  barcelonaAmor.words
);

console.log('\n' + '═'.repeat(60));
console.log('Familias por país (muestra):');
countries.slice(0, 6).forEach(function (entry) {
  console.log(' ', entry.countryId, '→', EFR.resolveEditorialFamily({ countryId: entry.countryId }));
});
console.log('…');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
