#!/usr/bin/env bash
# Kairos Maps — SOUTH_ASIAN editorial integration smoke (F3.7c SA+ Wave A)
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
echo " KAIROS MAPS — SOUTH_ASIAN editorial integration (F3.7c)"
echo " Scope: PK · BD · LK · NP catálogo · 12 lecturas · anti-leak · regresiones"
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

const SA_PLUS_CITIES = [
  { name: 'Karachi', slug: 'pakistan' },
  { name: 'Dhaka', slug: 'bangladesh' },
  { name: 'Colombo', slug: 'sri_lanka' },
  { name: 'Kathmandu', slug: 'nepal' }
];
const SA_COUNTRIES = ['india', 'pakistan', 'bangladesh', 'sri_lanka', 'nepal'];
const DELHI_CITY = { name: 'Delhi', country: 'India', slug: 'india' };
const GOALS = ['amor', 'trabajo', 'descanso'];
const PLACEHOLDER_BAN = ['PLACEHOLDER', 'FIXME', 'lorem ipsum', '[TBD]', '[[', '{{'];
const MEGACITY_BAN = ['megaciudad', 'metropoli', 'metrópoli', 'millones de habitantes'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const SEA_LEAK = ['gracia en la densidad', 'flujo compartido', 'ritual ligero', 'suavidad como eje central'];
const WE_LEAK = ['umbral', 'medida performativa', 'exposición profesional', 'reserva sobria'];
const GN_LEAK = ['persona antes que personaje', 'prisa de impresionar', 'performance del momento', 'silencio cómodo', 'obra callada'];
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

function scanPlaceholders(norm) {
  return PLACEHOLDER_BAN.filter(function (m) {
    return norm.indexOf(normFold(m)) !== -1;
  }).length;
}

function scanLeakMarkers(norm, markers) {
  return markers.filter(function (m) {
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
    iberian: scanLeakMarkers(norm, IBERIAN_LEAK),
    sea: scanLeakMarkers(norm, SEA_LEAK),
    we: scanLeakMarkers(norm, WE_LEAK),
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
  '11 familias registradas',
  EFR.REGISTERED_FAMILIES.length === 11 && EFR.isRegisteredFamily('SOUTH_ASIAN') === true,
  'count=' + EFR.REGISTERED_FAMILIES.length + ' registered=' + EFR.isRegisteredFamily('SOUTH_ASIAN')
);

assert(
  'DEFAULT_FAMILY sigue GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY === 'GLOBAL_NEUTRAL',
  EFR.DEFAULT_FAMILY
);

assert(
  '70 ciudades / 67 países catálogo (F3.17 África Este; SA Wave A intacto)',
  Catalog.CITIES.length === 70 && Catalog.getCountries().length === 67,
  'cities=' + Catalog.CITIES.length + ' countries=' + Catalog.getCountries().length
);

assert(
  'SCHEMA catálogo f3.17',
  Catalog.SCHEMA_VERSION === '3.8f.1-f3.17-0.1',
  Catalog.SCHEMA_VERSION
);

SA_PLUS_CITIES.forEach(function (entry) {
  assert(
    'catálogo contiene ' + entry.name,
    !!Catalog.findCityByName(entry.name),
    'missing in KairosCitiesCatalog'
  );
});

assert(
  '67 países resolver (F3.17 África Este)',
  Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length === 67,
  'count=' + Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length
);

assert(
  'SCHEMA f3.17',
  EFR.SCHEMA_VERSION === '3.8h.2-f3.17-0.1',
  EFR.SCHEMA_VERSION
);

SA_COUNTRIES.forEach(function (slug) {
  assert(
    slug + ' → SOUTH_ASIAN',
    EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'SOUTH_ASIAN',
    EFR.resolveEditorialFamily({ cityName: '', countryId: slug })
  );
});

assert(
  'Pakistán display → pakistan (no GLOBAL_NEUTRAL)',
  EFR.coerceCountryId('Pakistán') === 'pakistan' &&
    EFR.resolveEditorialFamily({ cityName: 'Karachi', countryDisplay: 'Pakistán' }) === 'SOUTH_ASIAN',
  JSON.stringify({
    slug: EFR.coerceCountryId('Pakistán'),
    family: EFR.resolveEditorialFamily({ cityName: 'Karachi', countryDisplay: 'Pakistán' })
  })
);

assert(
  'Sri Lanka display → sri_lanka (alias espacio)',
  EFR.coerceCountryId('Sri Lanka') === 'sri_lanka' &&
    EFR.resolveEditorialFamily({ cityName: 'Colombo', countryDisplay: 'Sri Lanka' }) === 'SOUTH_ASIAN',
  EFR.resolveEditorialFamily({ cityName: 'Colombo', countryDisplay: 'Sri Lanka' })
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
  const resolved = EFR.resolveRegionalPack(entry.map, 'SOUTH_ASIAN');
  if (!resolved.pack || resolved.meta.resolvedFrom !== 'explicit') {
    packMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  '14/14 packs SOUTH_ASIAN explicit',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14'
);

assert(
  'SOUTH_ASIAN en GOAL_PADS + PREMIUM_BLOCK',
  Premium.GOAL_PADS_BY_REGION.SOUTH_ASIAN &&
    Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.SOUTH_ASIAN,
  'goalPads=' + !!Premium.GOAL_PADS_BY_REGION.SOUTH_ASIAN +
    ' blocks=' + !!Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.SOUTH_ASIAN
);

const readings = [];
SA_PLUS_CITIES.forEach(function (entry) {
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

assert('12 lecturas SA+ (4 países × 3 goals)', readings.length === 12, 'count=' + readings.length);

const MUMBAI_CITY = { name: 'Mumbai', slug: 'india' };
const mumbaiReadings = [];
GOALS.forEach(function (goal) {
  const city = Catalog.findCityByName(MUMBAI_CITY.name);
  if (!city) throw new Error('catalog missing ' + MUMBAI_CITY.name);
  const reading = composeReading(city, goal, MUMBAI_CITY.slug);
  const s = scanReading(reading, MUMBAI_CITY.slug);
  mumbaiReadings.push({
    city: city.name,
    goal: goal,
    slug: MUMBAI_CITY.slug,
    reading: reading,
    scan: s
  });
});

assert('3 lecturas Mumbai (F3.10b Densification Wave A)', mumbaiReadings.length === 3, 'count=' + mumbaiReadings.length);

mumbaiReadings.forEach(function (r) {
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
    r.city + ' / ' + r.goal + ' → SOUTH_ASIAN (n=k=e)',
    s.regionN === 'SOUTH_ASIAN' && s.regionK === 'SOUTH_ASIAN' && s.regionE === 'SOUTH_ASIAN',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    r.city + ' / ' + r.goal + ' → IBERIAN leak 0',
    s.iberian === 0,
    'hits=' + s.iberian
  );
  assert(
    r.city + ' / ' + r.goal + ' → SEA leak 0',
    s.sea === 0,
    'hits=' + s.sea
  );
  assert(
    r.city + ' / ' + r.goal + ' → WESTERN_EUROPE leak 0',
    s.we === 0,
    'hits=' + s.we
  );
  assert(
    r.city + ' / ' + r.goal + ' → GLOBAL_NEUTRAL leak 0',
    s.gn === 0,
    'hits=' + s.gn
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
    r.city + ' / ' + r.goal + ' → SOUTH_ASIAN (n=k=e)',
    s.regionN === 'SOUTH_ASIAN' && s.regionK === 'SOUTH_ASIAN' && s.regionE === 'SOUTH_ASIAN',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    r.city + ' / ' + r.goal + ' → IBERIAN leak 0',
    s.iberian === 0,
    'hits=' + s.iberian
  );
  assert(
    r.city + ' / ' + r.goal + ' → SEA leak 0',
    s.sea === 0,
    'hits=' + s.sea
  );
  assert(
    r.city + ' / ' + r.goal + ' → WESTERN_EUROPE leak 0',
    s.we === 0,
    'hits=' + s.we
  );
  assert(
    r.city + ' / ' + r.goal + ' → GLOBAL_NEUTRAL leak 0',
    s.gn === 0,
    'hits=' + s.gn
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

const splitBrain = readings.concat(mumbaiReadings).filter(function (r) {
  return r.scan.regionN !== r.scan.regionK || r.scan.regionN !== r.scan.regionE;
});
assert(
  'Split-brain SOUTH_ASIAN = 0',
  splitBrain.length === 0,
  splitBrain.map(function (r) {
    return r.city + '/' + r.goal;
  }).join(' · ')
);

const QA_REGRESSION = [
  { label: 'Nairobi / trabajo → AFRICAN_COASTAL', cityName: 'Nairobi', slug: 'kenya', goal: 'trabajo', expected: 'AFRICAN_COASTAL' },
  { label: 'Ciudad de México / amor → LATAM', cityName: 'Ciudad de México', slug: 'mexico', goal: 'amor', expected: 'LATAM' },
  { label: 'Delhi / amor → SOUTH_ASIAN', cityName: 'Delhi', slug: 'india', goal: 'amor', expected: 'SOUTH_ASIAN' },
  { label: 'Bangkok / amor → SOUTHEAST_ASIAN', cityName: 'Bangkok', slug: 'thailand', goal: 'amor', expected: 'SOUTHEAST_ASIAN' },
  { label: 'París / amor → WESTERN_EUROPE', cityName: 'París', slug: 'france', goal: 'amor', expected: 'WESTERN_EUROPE' },
  { label: 'Lisboa / amor → IBERIAN', cityName: 'Lisboa', slug: 'portugal', goal: 'amor', expected: 'IBERIAN' },
  { label: 'Reykjavik / amor → GLOBAL_NEUTRAL', cityName: 'Reykjavik', slug: 'iceland', goal: 'amor', expected: 'GLOBAL_NEUTRAL' }
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
  { label: 'Delhi amor ≠ Mumbai amor', intraRegion: true, a: bodyFor('Delhi', 'amor', 'india'), b: bodyFor('Mumbai', 'amor', 'india') },
  { label: 'Delhi amor ≠ Bangkok amor', a: bodyFor('Delhi', 'amor', 'india'), b: bodyFor('Bangkok', 'amor', 'thailand') },
  { label: 'Delhi amor ≠ París amor', a: bodyFor('Delhi', 'amor', 'india'), b: bodyFor('París', 'amor', 'france') },
  { label: 'Delhi amor ≠ Reykjavik amor', a: bodyFor('Delhi', 'amor', 'india'), b: bodyFor('Reykjavik', 'amor', 'iceland') }
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
  if (!pair.intraRegion) {
    assert(
      pair.label + ' (región distinta)',
      !sameRegion,
      pair.a.regionE + ' vs ' + pair.b.regionE
    );
  }
  console.log(' ', pair.label + ':', pair.a.regionE, 'vs', pair.b.regionE, '| words', pair.a.words, 'vs', pair.b.words);
});

console.log('\n' + '═'.repeat(60));
console.log('Spot-check editorial obligatorio (F3.7c)');
console.log('═'.repeat(60));

const karachiAmor = bodyFor('Karachi', 'amor', 'pakistan');
const delhiAmorSpot = bodyFor('Delhi', 'amor', 'india');
assert(
  'Karachi / amor ≠ Delhi / amor (texto distinto)',
  karachiAmor.full !== delhiAmorSpot.full,
  karachiAmor.full === delhiAmorSpot.full ? 'textos idénticos' : 'ok distintos'
);
assert(
  'Karachi / amor ≠ Delhi / amor (conflicto distinto)',
  karachiAmor.conflict !== delhiAmorSpot.conflict &&
    karachiAmor.conflict &&
    delhiAmorSpot.conflict,
  karachiAmor.conflict === delhiAmorSpot.conflict ? 'conflictos idénticos' : 'ok distintos'
);
assert(
  'Karachi / amor → SOUTH_ASIAN',
  karachiAmor.regionN === 'SOUTH_ASIAN' &&
    karachiAmor.regionK === 'SOUTH_ASIAN' &&
    karachiAmor.regionE === 'SOUTH_ASIAN',
  JSON.stringify({ regionN: karachiAmor.regionN, regionK: karachiAmor.regionK, regionE: karachiAmor.regionE })
);

const kathmanduDescanso = bodyFor('Kathmandu', 'descanso', 'nepal');
const megacityHits = MEGACITY_BAN.filter(function (m) {
  return kathmanduDescanso.norm.indexOf(normFold(m)) !== -1;
});
assert(
  'Kathmandu / descanso sin tono megaciudad',
  megacityHits.length === 0,
  megacityHits.join(' · ') || '0 hits'
);

const colomboAmor = bodyFor('Colombo', 'amor', 'sri_lanka');
assert(
  'Colombo / amor → SOUTH_ASIAN (no GLOBAL_NEUTRAL)',
  colomboAmor.regionN === 'SOUTH_ASIAN' &&
    colomboAmor.regionK === 'SOUTH_ASIAN' &&
    colomboAmor.regionE === 'SOUTH_ASIAN',
  JSON.stringify({ regionN: colomboAmor.regionN, regionK: colomboAmor.regionK, regionE: colomboAmor.regionE })
);
assert(
  'Colombo / amor → SEA leak 0',
  colomboAmor.sea === 0,
  'hits=' + colomboAmor.sea
);
assert(
  'Colombo / amor → GLOBAL_NEUTRAL leak 0',
  colomboAmor.gn === 0,
  'hits=' + colomboAmor.gn
);
console.log('  Kathmandu/descanso megacity ban:', megacityHits.length === 0 ? 'ok' : megacityHits.join(' · '));
console.log('  Colombo/amor region:', colomboAmor.regionE, '| sea=', colomboAmor.sea, '| gn=', colomboAmor.gn);

console.log('\n' + '═'.repeat(60));
console.log('QA matriz — 12 lecturas SA+ (F3.7c catálogo)');
console.log('═'.repeat(60));
readings.forEach(function (r) {
  const s = r.scan;
  console.log(
    ' ',
    r.slug + ' / ' + r.goal + ':',
    'ok=' + s.ok,
    'words=' + s.words,
    'n=k=e=' + s.regionN,
    'gn=' + s.gn,
    'ph=' + s.placeholders,
    'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
  );
});

const delhiReading = composeReading(
  Catalog.findCityByName(DELHI_CITY.name) || DELHI_CITY,
  'amor',
  DELHI_CITY.slug
);
const delhiScan = scanReading(delhiReading, DELHI_CITY.slug);
assert(
  'Delhi / amor regresión → SOUTH_ASIAN',
  delhiScan.regionN === 'SOUTH_ASIAN' && delhiScan.regionK === 'SOUTH_ASIAN' && delhiScan.regionE === 'SOUTH_ASIAN',
  JSON.stringify({ regionN: delhiScan.regionN, regionK: delhiScan.regionK, regionE: delhiScan.regionE })
);

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
