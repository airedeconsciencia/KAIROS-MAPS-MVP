#!/usr/bin/env bash
# Kairos Maps — WEST_AFRICAN editorial integration smoke (F3.9b Wave B)
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
echo " KAIROS MAPS — WEST_AFRICAN editorial integration (F3.9b Wave B)"
echo " Scope: Lagos · Accra · Dakar · Abidjan · Freetown · Monrovia · Conakry · Cotonou · Lomé · Banjul · catálogo SSOT · anti-leak · regresiones"
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
const Knowledge = ctx.window.KairosPremiumKnowledge;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Premium = ctx.window.KairosCityPremiumComposition;
const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;

const WA_CITIES = [
  { name: 'Lagos', slug: 'nigeria' },
  { name: 'Accra', slug: 'ghana' },
  { name: 'Dakar', slug: 'senegal' },
  { name: 'Abidjan', slug: 'ivory_coast' },
  { name: 'Freetown', slug: 'sierra_leone' },
  { name: 'Monrovia', slug: 'liberia' },
  { name: 'Conakry', slug: 'guinea' },
  { name: 'Cotonou', slug: 'benin' },
  { name: 'Lomé', slug: 'togo' },
  { name: 'Banjul', slug: 'gambia' }
];
const WA_COUNTRIES = [
  'nigeria', 'ghana', 'senegal', 'ivory_coast', 'sierra_leone',
  'liberia', 'benin', 'togo', 'guinea', 'gambia'
];
const GOALS = ['amor', 'trabajo', 'descanso'];
const AC_LEAK = ['horizonte', 'viento', 'amplitud', 'paisaje'];
const LATAM_LEAK = ['compañía', 'calor humano', 'lo reservado', 'sobremesa', 'plaza'];
const SA_LEAK = ['coherencia interior', 'deber', 'obligación', 'multiplicidad'];
const SEA_LEAK = ['gracia en la densidad', 'flujo compartido', 'ritual ligero', 'suavidad como eje central'];
const GN_LEAK = ['persona antes que personaje', 'prisa de impresionar', 'performance del momento', 'silencio cómodo', 'obra callada'];
const PLACEHOLDER_BAN = ['PLACEHOLDER', 'FIXME', 'lorem ipsum', '[TBD]', '[[', '{{'];
const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';

const robertoUtc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;
const mockInfluences = [
  { line: { planet: 'venus', planetKey: 'VENUS', angle: 'AC' }, distKm: 431, composite: 0.6 },
  { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'AC' }, distKm: 210, composite: 0.55 },
  { line: { planet: 'marte', planetKey: 'MARTE', angle: 'MC' }, distKm: 120, composite: 0.5 }
];

function buildInput(goalId) {
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

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function normFold(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scanLeakMarkers(norm, markers) {
  return markers.filter(function (m) {
    return norm.indexOf(normFold(m)) !== -1;
  }).length;
}

function scanPlaceholders(norm) {
  return PLACEHOLDER_BAN.filter(function (m) {
    return norm.indexOf(normFold(m)) !== -1;
  }).length;
}

function scanReading(reading, countryId) {
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = normFold(full);
  const regionE = EFR.resolveEditorialFamily({
    cityName: reading.meta.cityName || '',
    countryId: countryId
  });
  return {
    ok: reading.ok,
    words: reading.meta.wordCount,
    regionN: nc.regionFamily || null,
    regionK: km.regionFamily || null,
    regionE: regionE,
    conflict: nc.humanConflict || '',
    full: full,
    norm: norm,
    ac: scanLeakMarkers(norm, AC_LEAK),
    latam: scanLeakMarkers(norm, LATAM_LEAK),
    sa: scanLeakMarkers(norm, SA_LEAK),
    sea: scanLeakMarkers(norm, SEA_LEAK),
    gn: scanLeakMarkers(norm, GN_LEAK),
    placeholders: scanPlaceholders(norm),
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1
  };
}

function composeReading(city, goal, slug) {
  const input = buildInput(goal);
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

assert(
  '53 ciudades / 50 países catálogo (F3.11j WEST_AFRICAN Wave C Batch 2)',
  Catalog.CITIES.length === 53 && Catalog.getCountries().length === 50,
  'cities=' + Catalog.CITIES.length + ' countries=' + Catalog.getCountries().length
);

assert(
  'SCHEMA catálogo f3.11j',
  Catalog.SCHEMA_VERSION === '3.8f.1-f3.11j-0.1',
  Catalog.SCHEMA_VERSION
);

WA_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  assert(
    'catálogo contiene ' + entry.name,
    !!city,
    'missing in KairosCitiesCatalog'
  );
  if (city) {
    assert(
      entry.name + ' countryId alineado resolver',
      Catalog.resolveCountryId(city.country) === entry.slug,
      Catalog.resolveCountryId(city.country)
    );
  }
});

assert(
  'Costa de Marfil display → ivory_coast → WEST_AFRICAN (F3.9b)',
  EFR.coerceCountryId('Costa de Marfil') === 'ivory_coast' &&
    EFR.resolveEditorialFamily({ cityName: 'Abidjan', countryDisplay: 'Costa de Marfil' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Costa de Marfil'),
    family: EFR.resolveEditorialFamily({ cityName: 'Abidjan', countryDisplay: 'Costa de Marfil' })
  })
);

assert(
  'Sierra Leona display → sierra_leone → WEST_AFRICAN (F3.11c)',
  EFR.coerceCountryId('Sierra Leona') === 'sierra_leone' &&
    EFR.resolveEditorialFamily({ cityName: 'Freetown', countryDisplay: 'Sierra Leona' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Sierra Leona'),
    family: EFR.resolveEditorialFamily({ cityName: 'Freetown', countryDisplay: 'Sierra Leona' })
  })
);

assert(
  'Liberia display → liberia → WEST_AFRICAN (F3.11c)',
  EFR.coerceCountryId('Liberia') === 'liberia' &&
    EFR.resolveEditorialFamily({ cityName: 'Monrovia', countryDisplay: 'Liberia' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Liberia'),
    family: EFR.resolveEditorialFamily({ cityName: 'Monrovia', countryDisplay: 'Liberia' })
  })
);

assert(
  'Guinea display → guinea → WEST_AFRICAN (F3.11c)',
  EFR.coerceCountryId('Guinea') === 'guinea' &&
    EFR.resolveEditorialFamily({ cityName: 'Conakry', countryDisplay: 'Guinea' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Guinea'),
    family: EFR.resolveEditorialFamily({ cityName: 'Conakry', countryDisplay: 'Guinea' })
  })
);

assert(
  'Benín display → benin → WEST_AFRICAN (F3.11j)',
  EFR.coerceCountryId('Benín') === 'benin' &&
    EFR.resolveEditorialFamily({ cityName: 'Cotonou', countryDisplay: 'Benín' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Benín'),
    family: EFR.resolveEditorialFamily({ cityName: 'Cotonou', countryDisplay: 'Benín' })
  })
);

assert(
  'Togo display → togo → WEST_AFRICAN (F3.11j)',
  EFR.coerceCountryId('Togo') === 'togo' &&
    EFR.resolveEditorialFamily({ cityName: 'Lomé', countryDisplay: 'Togo' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Togo'),
    family: EFR.resolveEditorialFamily({ cityName: 'Lomé', countryDisplay: 'Togo' })
  })
);

assert(
  'Gambia display → gambia → WEST_AFRICAN (F3.11j)',
  EFR.coerceCountryId('Gambia') === 'gambia' &&
    EFR.resolveEditorialFamily({ cityName: 'Banjul', countryDisplay: 'Gambia' }) === 'WEST_AFRICAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Gambia'),
    family: EFR.resolveEditorialFamily({ cityName: 'Banjul', countryDisplay: 'Gambia' })
  })
);

assert(
  '11 familias registradas',
  EFR.REGISTERED_FAMILIES.length === 11 && EFR.isRegisteredFamily('WEST_AFRICAN') === true,
  'count=' + EFR.REGISTERED_FAMILIES.length + ' registered=' + EFR.isRegisteredFamily('WEST_AFRICAN')
);

assert(
  'DEFAULT_FAMILY sigue GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY === 'GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY
);

assert(
  'SCHEMA resolver f3.8b (50 países; sin cambio F3.9b)',
  EFR.SCHEMA_VERSION === '3.8h.2-f3.8b-0.1',
  EFR.SCHEMA_VERSION
);

const countryMiss = WA_COUNTRIES.filter(function (slug) {
  return EFR.COUNTRY_EDITORIAL_FAMILY[slug] !== 'WEST_AFRICAN';
});
assert(
  '10 países v1 → WEST_AFRICAN',
  countryMiss.length === 0,
  countryMiss.join(' · ') || WA_COUNTRIES.join(', ')
);

assert(
  '11 familias en pools narrativos',
  Narrative.NARRATIVE_SPINE_BY_REGION && Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length === 11,
  'spine=' + Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION || {}).length
);

const PACK_MAPS = [
  { label: 'HUMAN_THEME_PATTERNS_BY_REGION', map: Narrative.HUMAN_THEME_PATTERNS_BY_REGION },
  { label: 'SUMMARY_FRAME_POOL_BY_REGION', map: Narrative.SUMMARY_FRAME_POOL_BY_REGION },
  { label: 'OBSERVE_TAIL_BY_REGION', map: Narrative.OBSERVE_TAIL_BY_REGION },
  { label: 'NARRATIVE_SPINE_BY_REGION', map: Narrative.NARRATIVE_SPINE_BY_REGION },
  { label: 'SPINE_FAVORECE_OPEN_BY_REGION', map: Premium.SPINE_FAVORECE_OPEN_BY_REGION },
  { label: 'HUMAN_SCENE_BY_REGION', map: Premium.HUMAN_SCENE_BY_REGION },
  { label: 'OBSERVE_ENTERO_TAIL_BY_REGION', map: Premium.OBSERVE_ENTERO_TAIL_BY_REGION },
  { label: 'VOICE_TRANSITION_BY_REGION', map: Premium.VOICE_TRANSITION_BY_REGION },
  { label: 'GOAL_PADS_BY_REGION', map: Premium.GOAL_PADS_BY_REGION },
  { label: 'REGIONAL_EDITORIAL_MICRO_BY_GOAL', map: Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL },
  { label: 'REGIONAL_EDITORIAL_PADS', map: Premium.REGIONAL_EDITORIAL_PADS },
  { label: 'REGIONAL_TOPUP_VARIANTS', map: Premium.REGIONAL_TOPUP_VARIANTS },
  { label: 'REGIONAL_TOPUP_BY_GOAL', map: Premium.REGIONAL_TOPUP_BY_GOAL },
  { label: 'PREMIUM_BLOCK_VARIATIONS_BY_REGION', map: Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION }
];

const packMissing = [];
PACK_MAPS.forEach(function (entry) {
  const resolved = EFR.resolveRegionalPack(entry.map, 'WEST_AFRICAN');
  if (!resolved.pack || resolved.meta.resolvedFrom !== 'explicit') {
    packMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  '14/14 packs WEST_AFRICAN explicit',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14'
);

assert(
  'WEST_AFRICAN en GOAL_PADS + PREMIUM_BLOCK',
  Premium.GOAL_PADS_BY_REGION.WEST_AFRICAN &&
    Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.WEST_AFRICAN,
  'goalPads=' + !!Premium.GOAL_PADS_BY_REGION.WEST_AFRICAN +
    ' blocks=' + !!Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.WEST_AFRICAN
);

const readings = [];
WA_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal, entry.slug);
    const s = scanReading(reading, entry.slug);
    readings.push({
      city: city.name,
      goal: goal,
      slug: entry.slug,
      reading: reading,
      scan: s
    });
  });
});

assert('30 lecturas WA (10 ciudades × 3 goals)', readings.length === 30, 'count=' + readings.length);

readings.forEach(function (r) {
  const s = r.scan;
  assert(
    r.city + ' / ' + r.goal + ' → ok:true',
    s.ok === true,
    'ok=' + s.ok
  );
  assert(
    r.city + ' / ' + r.goal + ' → words 500–900',
    s.words >= Premium.MIN_WORDS && s.words <= Premium.MAX_WORDS,
    'words=' + s.words
  );
  assert(
    r.city + ' / ' + r.goal + ' → WEST_AFRICAN (n=k=e)',
    s.regionN === 'WEST_AFRICAN' && s.regionK === 'WEST_AFRICAN' && s.regionE === 'WEST_AFRICAN',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    r.city + ' / ' + r.goal + ' → placeholders 0',
    s.placeholders === 0,
    'hits=' + s.placeholders
  );
  assert(
    r.city + ' / ' + r.goal + ' → AC leak 0',
    s.ac === 0,
    'hits=' + s.ac
  );
  assert(
    r.city + ' / ' + r.goal + ' → LATAM leak 0',
    s.latam === 0,
    'hits=' + s.latam
  );
  assert(
    r.city + ' / ' + r.goal + ' → SA leak 0',
    s.sa === 0,
    'hits=' + s.sa
  );
  assert(
    r.city + ' / ' + r.goal + ' → SEA leak 0',
    s.sea === 0,
    'hits=' + s.sea
  );
  assert(
    r.city + ' / ' + r.goal + ' → GN leak 0',
    s.gn === 0,
    'hits=' + s.gn
  );
  assert(
    r.city + ' / ' + r.goal + ' → P03/P06/P10 = 0',
    !s.p03 && !s.p06 && !s.p10,
    'p03=' + s.p03 + ' p06=' + s.p06 + ' p10=' + s.p10
  );
});

const splitBrain = readings.filter(function (r) {
  return r.scan.regionN !== r.scan.regionK || r.scan.regionN !== r.scan.regionE;
});
assert(
  'Split-brain WEST_AFRICAN = 0',
  splitBrain.length === 0,
  splitBrain.map(function (r) {
    return r.city + '/' + r.goal;
  }).join(' · ')
);

const QA_REGRESSION = [
  { label: 'Delhi / amor → SOUTH_ASIAN', cityName: 'Delhi', slug: 'india', goal: 'amor', expected: 'SOUTH_ASIAN' },
  { label: 'Bangkok / amor → SOUTHEAST_ASIAN', cityName: 'Bangkok', slug: 'thailand', goal: 'amor', expected: 'SOUTHEAST_ASIAN' },
  { label: 'París / amor → WESTERN_EUROPE', cityName: 'París', slug: 'france', goal: 'amor', expected: 'WESTERN_EUROPE' },
  { label: 'Lisboa / amor → IBERIAN', cityName: 'Lisboa', slug: 'portugal', goal: 'amor', expected: 'IBERIAN' },
  { label: 'Ciudad de México / amor → LATAM', cityName: 'Ciudad de México', slug: 'mexico', goal: 'amor', expected: 'LATAM' },
  { label: 'Nairobi / trabajo → AFRICAN_COASTAL', cityName: 'Nairobi', slug: 'kenya', goal: 'trabajo', expected: 'AFRICAN_COASTAL' },
  { label: 'Oslo / amor → GLOBAL_NEUTRAL', cityName: 'Oslo', slug: 'norway', goal: 'amor', expected: 'GLOBAL_NEUTRAL' }
];

QA_REGRESSION.forEach(function (c) {
  const city = Catalog.findCityByName(c.cityName) || { name: c.cityName, country: c.slug };
  const reading = composeReading(city, c.goal, c.slug);
  const s = scanReading(reading, c.slug);
  assert(
    c.label,
    s.regionN === c.expected && s.regionK === c.expected && s.regionE === c.expected,
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
});

console.log('\n' + '═'.repeat(60));
console.log('QA matriz — diferenciación editorial');
console.log('═'.repeat(60));

function bodyFor(cityName, goal, slug) {
  const city = Catalog.findCityByName(cityName) || { name: cityName, country: slug };
  const reading = composeReading(city, goal, slug);
  return scanReading(reading, slug);
}

const qaPairs = [
  { label: 'Lagos amor ≠ Delhi amor', a: bodyFor('Lagos', 'amor', 'nigeria'), b: bodyFor('Delhi', 'amor', 'india') },
  { label: 'Lagos amor ≠ Nairobi amor', a: bodyFor('Lagos', 'amor', 'nigeria'), b: bodyFor('Nairobi', 'amor', 'kenya') },
  { label: 'Accra amor ≠ Oslo amor', a: bodyFor('Accra', 'amor', 'ghana'), b: bodyFor('Oslo', 'amor', 'norway') }
];

qaPairs.forEach(function (pair) {
  const sameText = pair.a.full === pair.b.full;
  const sameConflict = pair.a.conflict === pair.b.conflict;
  const sameRegion = pair.a.regionE === pair.b.regionE;
  assert(
    pair.label + ' (texto distinto)',
    !sameText,
    sameText ? 'textos idénticos' : 'ok distintos'
  );
  assert(
    pair.label + ' (conflicto distinto)',
    !sameConflict && pair.a.conflict && pair.b.conflict,
    sameConflict ? 'conflictos idénticos' : 'ok distintos'
  );
  assert(
    pair.label + ' (región distinta)',
    !sameRegion,
    pair.a.regionE + ' vs ' + pair.b.regionE
  );
  console.log(' ', pair.label + ':', pair.a.regionE, 'vs', pair.b.regionE, '| words', pair.a.words, 'vs', pair.b.words);
});

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F3.9b — Abidjan (catálogo)');
console.log('═'.repeat(60));

const abidjanReadings = readings.filter(function (r) { return r.city === 'Abidjan'; });
abidjanReadings.forEach(function (r) {
  const s = r.scan;
  console.log(
    ' ',
    r.slug + ' / ' + r.goal + ':',
    'ok=' + s.ok,
    'words=' + s.words,
    'n=k=e=' + s.regionN,
    'ac=' + s.ac,
    'latam=' + s.latam,
    'sa=' + s.sa,
    'sea=' + s.sea,
    'gn=' + s.gn,
    'ph=' + s.placeholders,
    'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
  );
});

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F3.11c — Wave C Batch 1 (catálogo)');
console.log('═'.repeat(60));

['Freetown', 'Monrovia', 'Conakry'].forEach(function (cityName) {
  const waveCReadings = readings.filter(function (r) { return r.city === cityName; });
  waveCReadings.forEach(function (r) {
    const s = r.scan;
    console.log(
      ' ',
      r.city + ' / ' + r.slug + ' / ' + r.goal + ':',
      'ok=' + s.ok,
      'words=' + s.words,
      'n=k=e=' + s.regionN,
      'ac=' + s.ac,
      'latam=' + s.latam,
      'sa=' + s.sa,
      'sea=' + s.sea,
      'gn=' + s.gn,
      'ph=' + s.placeholders,
      'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
    );
  });
});

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F3.11j — Wave C Batch 2 (catálogo)');
console.log('═'.repeat(60));

['Cotonou', 'Lomé', 'Banjul'].forEach(function (cityName) {
  const waveC2Readings = readings.filter(function (r) { return r.city === cityName; });
  waveC2Readings.forEach(function (r) {
    const s = r.scan;
    console.log(
      ' ',
      r.city + ' / ' + r.slug + ' / ' + r.goal + ':',
      'ok=' + s.ok,
      'words=' + s.words,
      'n=k=e=' + s.regionN,
      'ac=' + s.ac,
      'latam=' + s.latam,
      'sa=' + s.sa,
      'sea=' + s.sea,
      'gn=' + s.gn,
      'ph=' + s.placeholders,
      'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
    );
  });
});

console.log('\n' + '═'.repeat(60));
console.log('Muestra Lagos amor:');
const lagosAmor = readings.find(function (r) { return r.city === 'Lagos' && r.goal === 'amor'; });
if (lagosAmor) {
  console.log('  region:', lagosAmor.scan.regionN);
  console.log('  words:', lagosAmor.scan.words);
  console.log('  conflict:', lagosAmor.scan.conflict.slice(0, 120) + '…');
}

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
