#!/usr/bin/env bash
# Kairos Maps — SOUTHEAST_ASIAN editorial integration smoke (F3.6c SEA+ catalog)
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
echo " KAIROS MAPS — SOUTHEAST_ASIAN editorial integration (F3.6c)"
echo " Scope: catálogo VN · MY · ID · PH · 12 lecturas · anti-leak · regresiones"
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

const SEA_PLUS_CITIES = [
  { name: 'Ho Chi Minh City', slug: 'vietnam' },
  { name: 'Kuala Lumpur', slug: 'malaysia' },
  { name: 'Jakarta', slug: 'indonesia' },
  { name: 'Manila', slug: 'philippines' }
];
const SEA_F46_CITIES = [
  { name: 'Phnom Penh', slug: 'cambodia' },
  { name: 'Vientián', slug: 'laos' }
];
const SEA_F47_CITIES = [
  { name: 'Yangón', slug: 'myanmar' },
  { name: 'Bandar Seri Begawan', slug: 'brunei' }
];
const SEA_F52_CITIES = [
  { name: 'Dili', slug: 'timor_leste' }
];
const SEA_COUNTRIES = ['thailand', 'singapore', 'vietnam', 'malaysia', 'indonesia', 'philippines', 'cambodia', 'laos', 'myanmar', 'brunei', 'timor_leste'];
const GOALS = ['amor', 'trabajo', 'descanso'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const EAST_ASIAN_LEAK = ['secuencia', 'detalle observado', 'rutina precisa', 'proceso callado', 'gesto mínimo'];
const WE_LEAK = ['umbral', 'medida performativa', 'exposición profesional', 'reserva sobria'];
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
    full: full,
    norm: norm,
    iberian: scanLeakMarkers(norm, IBERIAN_LEAK),
    eastAsian: scanLeakMarkers(norm, EAST_ASIAN_LEAK),
    we: scanLeakMarkers(norm, WE_LEAK),
    placeholders: scanPlaceholders(norm),
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1
  };
}

function composeReading(city, goal) {
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
  '11 familias registradas',
  EFR.REGISTERED_FAMILIES.length === 11 && EFR.isRegisteredFamily('SOUTHEAST_ASIAN') === true,
  'count=' + EFR.REGISTERED_FAMILIES.length
);

assert(
  '102 ciudades / 99 países catálogo (baseline F5.2; SEA Wave A intacto)',
  Catalog.CITIES.length === Catalog.EXPECTED_CITY_COUNT &&
    Catalog.getCountries().length === Catalog.EXPECTED_COUNTRY_COUNT &&
    Catalog.EXPECTED_CITY_COUNT === 102 &&
    Catalog.EXPECTED_COUNTRY_COUNT === 99,
  'cities=' + Catalog.CITIES.length + ' countries=' + Catalog.getCountries().length
);

assert(
  'SCHEMA catálogo f5.2',
  Catalog.SCHEMA_VERSION === '3.8f.1-f5.2-0.1',
  Catalog.SCHEMA_VERSION
);

SEA_PLUS_CITIES.forEach(function (entry) {
  assert(
    'catálogo contiene ' + entry.name,
    !!Catalog.findCityByName(entry.name),
    'missing in KairosCitiesCatalog'
  );
});

assert(
  'SCHEMA resolver f5.2 (99 países; SEA+ intacto)',
  EFR.SCHEMA_VERSION === '3.8h.2-f5.2-0.1',
  EFR.SCHEMA_VERSION
);

SEA_COUNTRIES.forEach(function (slug) {
  assert(
    slug + ' → SOUTHEAST_ASIAN',
    EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'SOUTHEAST_ASIAN',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug })
  );
});

assert(
  'india → SOUTH_ASIAN (no confundir con indonesia/id)',
  EFR.COUNTRY_EDITORIAL_FAMILY.india === 'SOUTH_ASIAN' &&
    EFR.coerceCountryId('Indonesia') === 'indonesia' &&
    EFR.coerceCountryId('id') === 'indonesia',
  JSON.stringify({
    india: EFR.COUNTRY_EDITORIAL_FAMILY.india,
    indonesia: EFR.coerceCountryId('Indonesia')
  })
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
  const resolved = EFR.resolveRegionalPack(entry.map, 'SOUTHEAST_ASIAN');
  if (!resolved.pack || resolved.meta.resolvedFrom !== 'explicit') {
    packMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  '14/14 packs SOUTHEAST_ASIAN explicit',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14'
);

assert(
  '99 países resolver (F5.2 East Asia + SEA closure; incl. SEA 11/11)',
  Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length === 99,
  'count=' + Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length
);

const readings = [];
SEA_PLUS_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal);
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

assert('12 lecturas SEA+ (4 países × 3 goals)', readings.length === 12, 'count=' + readings.length);

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F4.6 — Phnom Penh · Vientián (catálogo)');
console.log('═'.repeat(60));

const seaF46Readings = [];
SEA_F46_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal);
    const s = scanReading(reading, entry.slug);
    seaF46Readings.push({
      city: city.name,
      goal: goal,
      slug: entry.slug,
      reading: reading,
      scan: s
    });
    assert(
      entry.name + ' / ' + goal + ' → ok:true',
      s.ok === true,
      'ok=' + s.ok
    );
    assert(
      entry.name + ' / ' + goal + ' → words 500–900',
      s.words >= Premium.MIN_WORDS && s.words <= Premium.MAX_WORDS,
      'words=' + s.words
    );
    assert(
      entry.name + ' / ' + goal + ' → SOUTHEAST_ASIAN (n=k=e)',
      s.regionN === 'SOUTHEAST_ASIAN' && s.regionK === 'SOUTHEAST_ASIAN' && s.regionE === 'SOUTHEAST_ASIAN',
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → split-brain 0',
      s.regionN === s.regionK && s.regionK === s.regionE,
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → leaks 0',
      s.iberian === 0 && s.eastAsian === 0 && s.we === 0,
      JSON.stringify({ iberian: s.iberian, eastAsian: s.eastAsian, we: s.we })
    );
    assert(
      entry.name + ' / ' + goal + ' → placeholders 0',
      s.placeholders === 0,
      'hits=' + s.placeholders
    );
    assert(
      entry.name + ' / ' + goal + ' → P03/P06/P10 = 0',
      !s.p03 && !s.p06 && !s.p10,
      'p03=' + s.p03 + ' p06=' + s.p06 + ' p10=' + s.p10
    );
    console.log(
      ' ',
      entry.slug + ' / ' + goal + ':',
      'ok=' + s.ok,
      'words=' + s.words,
      'n=k=e=' + s.regionN,
      'leaks=' + (s.iberian + s.eastAsian + s.we),
      'ph=' + s.placeholders,
      'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
    );
  });
});

assert('6 lecturas F4.6 SEA residual (2 ciudades × 3 goals)', seaF46Readings.length === 6, 'count=' + seaF46Readings.length);

assert(
  'Camboya display → cambodia → SOUTHEAST_ASIAN (F4.6)',
  EFR.coerceCountryId('Camboya') === 'cambodia' &&
    EFR.resolveEditorialFamily({ cityName: 'Phnom Penh', countryDisplay: 'Camboya' }) === 'SOUTHEAST_ASIAN',
  'cambodia'
);

assert(
  'Laos display → laos → SOUTHEAST_ASIAN (F4.6)',
  EFR.coerceCountryId('Laos') === 'laos' &&
    EFR.resolveEditorialFamily({ cityName: 'Vientián', countryDisplay: 'Laos' }) === 'SOUTHEAST_ASIAN',
  'laos'
);

assert(
  'Alias kh/la → SOUTHEAST_ASIAN (F4.6)',
  EFR.resolveEditorialFamily({ cityName: 'Phnom Penh', countryId: 'kh' }) === 'SOUTHEAST_ASIAN' &&
    EFR.resolveEditorialFamily({ cityName: 'Vientián', countryId: 'la' }) === 'SOUTHEAST_ASIAN',
  'kh/la'
);

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F4.7 — Yangón · Bandar Seri Begawan (catálogo)');
console.log('═'.repeat(60));

const seaF47Readings = [];
SEA_F47_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal);
    const s = scanReading(reading, entry.slug);
    seaF47Readings.push({ city: entry.name, goal: goal, slug: entry.slug, scan: s });
    assert(entry.name + ' / ' + goal + ' → ok:true', s.ok === true, 'ok=' + s.ok);
    assert(
      entry.name + ' / ' + goal + ' → SOUTHEAST_ASIAN (n=k=e)',
      s.regionN === 'SOUTHEAST_ASIAN' && s.regionK === 'SOUTHEAST_ASIAN' && s.regionE === 'SOUTHEAST_ASIAN',
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → split-brain 0',
      s.regionN === s.regionK && s.regionK === s.regionE,
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
  });
});

assert('6 lecturas F4.7 SEA residual final (2 ciudades × 3 goals)', seaF47Readings.length === 6, 'count=' + seaF47Readings.length);

const seaF52Readings = [];
SEA_F52_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal);
    const s = scanReading(reading, entry.slug);
    seaF52Readings.push({ city: entry.name, goal: goal, slug: entry.slug, scan: s });
    assert(
      entry.name + ' / ' + goal + ' → SOUTHEAST_ASIAN (n=k=e)',
      s.regionN === 'SOUTHEAST_ASIAN' && s.regionK === 'SOUTHEAST_ASIAN' && s.regionE === 'SOUTHEAST_ASIAN',
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → split-brain 0',
      s.regionN === s.regionK && s.regionK === s.regionE,
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
  });
});

assert('3 lecturas F5.2 SEA closure (1 ciudad × 3 goals)', seaF52Readings.length === 3, 'count=' + seaF52Readings.length);

assert(
  'Myanmar display → myanmar → SOUTHEAST_ASIAN (F4.7)',
  EFR.coerceCountryId('Myanmar') === 'myanmar' &&
    EFR.resolveEditorialFamily({ cityName: 'Yangón', countryDisplay: 'Myanmar' }) === 'SOUTHEAST_ASIAN',
  'myanmar'
);

assert(
  'Brunéi display → brunei → SOUTHEAST_ASIAN (F4.7)',
  EFR.coerceCountryId('Brunéi') === 'brunei' &&
    EFR.resolveEditorialFamily({ cityName: 'Bandar Seri Begawan', countryDisplay: 'Brunéi' }) === 'SOUTHEAST_ASIAN',
  'brunei'
);

assert(
  'Alias mm/bn → SOUTHEAST_ASIAN (F4.7)',
  EFR.resolveEditorialFamily({ cityName: 'Yangón', countryId: 'mm' }) === 'SOUTHEAST_ASIAN' &&
    EFR.resolveEditorialFamily({ cityName: 'Bandar Seri Begawan', countryId: 'bn' }) === 'SOUTHEAST_ASIAN',
  'mm/bn'
);

assert(
  'Timor-Leste display → timor_leste → SOUTHEAST_ASIAN (F5.2)',
  EFR.coerceCountryId('Timor-Leste') === 'timor_leste' &&
    EFR.resolveEditorialFamily({ cityName: 'Dili', countryDisplay: 'Timor-Leste' }) === 'SOUTHEAST_ASIAN',
  'timor_leste'
);

assert(
  'Alias tl → SOUTHEAST_ASIAN (F5.2)',
  EFR.resolveEditorialFamily({ cityName: 'Dili', countryId: 'tl' }) === 'SOUTHEAST_ASIAN',
  'tl'
);

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
    r.city + ' / ' + r.goal + ' → SOUTHEAST_ASIAN (n=k=e)',
    s.regionN === 'SOUTHEAST_ASIAN' && s.regionK === 'SOUTHEAST_ASIAN' && s.regionE === 'SOUTHEAST_ASIAN',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    r.city + ' / ' + r.goal + ' → leaks 0',
    s.iberian === 0 && s.eastAsian === 0 && s.we === 0,
    'iberian=' + s.iberian + ' eastAsian=' + s.eastAsian + ' we=' + s.we
  );
  assert(
    r.city + ' / ' + r.goal + ' → placeholders 0',
    s.placeholders === 0,
    'hits=' + s.placeholders
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
  'Split-brain SOUTHEAST_ASIAN = 0',
  splitBrain.length === 0,
  splitBrain.map(function (r) {
    return r.city + '/' + r.goal;
  }).join(' · ')
);

const QA_REGRESSION = [
  { label: 'Nairobi / amor → AFRICAN_COASTAL', cityName: 'Nairobi', slug: 'kenya', goal: 'amor', expected: 'AFRICAN_COASTAL' },
  { label: 'Ciudad de México / amor → LATAM', cityName: 'Ciudad de México', slug: 'mexico', goal: 'amor', expected: 'LATAM' },
  { label: 'Delhi / amor → SOUTH_ASIAN', cityName: 'Delhi', slug: 'india', goal: 'amor', expected: 'SOUTH_ASIAN' },
  { label: 'Bangkok / amor → SOUTHEAST_ASIAN', cityName: 'Bangkok', slug: 'thailand', goal: 'amor', expected: 'SOUTHEAST_ASIAN' },
  { label: 'Singapur / amor → SOUTHEAST_ASIAN', cityName: 'Singapur', slug: 'singapore', goal: 'amor', expected: 'SOUTHEAST_ASIAN' },
  { label: 'Atenas / amor → MEDITERRANEAN', cityName: 'Atenas', slug: 'greece', goal: 'amor', expected: 'MEDITERRANEAN' },
  { label: 'París / amor → WESTERN_EUROPE', cityName: 'París', slug: 'france', goal: 'amor', expected: 'WESTERN_EUROPE' },
  { label: 'Lisboa / amor → IBERIAN', cityName: 'Lisboa', slug: 'portugal', goal: 'amor', expected: 'IBERIAN' },
  { label: 'Reykjavik / amor → GLOBAL_NEUTRAL', cityName: 'Reykjavik', slug: 'iceland', goal: 'amor', expected: 'GLOBAL_NEUTRAL' }
];

QA_REGRESSION.forEach(function (c) {
  const city = Catalog.findCityByName(c.cityName) || { name: c.cityName, country: c.slug };
  const reading = composeReading(city, c.goal);
  const s = scanReading(reading, c.slug);
  assert(
    c.label,
    s.regionN === c.expected && s.regionK === c.expected && s.regionE === c.expected,
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
});

console.log('\n' + '═'.repeat(60));
console.log('QA matriz — 12 lecturas SEA+ (catálogo SSOT · baseline F3.7c)');
console.log('═'.repeat(60));
readings.forEach(function (r) {
  const s = r.scan;
  console.log(
    ' ',
    r.slug + ' / ' + r.goal + ':',
    'ok=' + s.ok,
    'words=' + s.words,
    'n=k=e=' + s.regionN,
    'leaks=' + (s.iberian + s.eastAsian + s.we),
    'ph=' + s.placeholders,
    'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
  );
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
