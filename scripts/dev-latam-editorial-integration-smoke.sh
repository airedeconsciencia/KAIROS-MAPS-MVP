#!/usr/bin/env bash
# Kairos Maps — LATAM editorial integration smoke (F3.8c LATAM+ Wave A)
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
echo " KAIROS MAPS — LATAM editorial integration (F3.8c Wave A)"
echo " Scope: 53/50 catálogo · CR/PA · amends · regresiones · anti-leak"
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

const LATAM_COUNTRIES = ['mexico', 'argentina', 'brazil', 'peru', 'colombia', 'chile', 'uruguay', 'ecuador', 'costa_rica', 'panama'];
const LATAM_CITIES = [
  { name: 'Ciudad de México', country: 'México' },
  { name: 'Buenos Aires', country: 'Argentina' },
  { name: 'Río de Janeiro', country: 'Brasil' },
  { name: 'Lima', country: 'Perú' }
];
const LATAM_PLUS_CITIES = [
  { name: 'San José', slug: 'costa_rica' },
  { name: 'Ciudad de Panamá', slug: 'panama' }
];
const GOALS = ['amor', 'trabajo', 'descanso'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const SEA_LEAK = ['gracia en la densidad', 'flujo compartido', 'ritual ligero', 'suavidad como eje central'];
const WE_LEAK = ['umbral', 'medida performativa', 'exposición profesional', 'reserva sobria'];
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

function scanReading(reading, slug) {
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = normFold(full);
  const regionE = EFR.resolveEditorialFamily({
    cityName: reading.meta.cityName || '',
    countryId: slug
  });
  return {
    ok: reading.ok,
    words: reading.meta.wordCount,
    regionN: nc.regionFamily || null,
    regionK: km.regionFamily || null,
    regionE: regionE,
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

assert(
  '53 ciudades / 50 países catálogo (F3.11j baseline; LATAM Wave A intacto)',
  Catalog.CITIES.length === 53 && Catalog.getCountries().length === 50,
  'cities=' + Catalog.CITIES.length + ' countries=' + Catalog.getCountries().length
);

assert(
  'SCHEMA catálogo f3.11j',
  Catalog.SCHEMA_VERSION === '3.8f.1-f3.11j-0.1',
  Catalog.SCHEMA_VERSION
);

LATAM_PLUS_CITIES.forEach(function (entry) {
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
  'LATAM en resolver (10 slugs F3.8b)',
  LATAM_COUNTRIES.every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'LATAM';
  }),
  JSON.stringify({
    mexico: EFR.COUNTRY_EDITORIAL_FAMILY.mexico,
    costa_rica: EFR.COUNTRY_EDITORIAL_FAMILY.costa_rica,
    panama: EFR.COUNTRY_EDITORIAL_FAMILY.panama
  })
);

assert(
  '50 países resolver (F3.8b LATAM+)',
  Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length === 50,
  'count=' + Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).length
);

assert(
  'SCHEMA f3.8b',
  EFR.SCHEMA_VERSION === '3.8h.2-f3.8b-0.1',
  EFR.SCHEMA_VERSION
);

assert(
  'Costa Rica display → costa_rica → LATAM (F3.8b)',
  EFR.coerceCountryId('Costa Rica') === 'costa_rica' &&
    EFR.resolveEditorialFamily({ cityName: 'San José', countryDisplay: 'Costa Rica' }) === 'LATAM',
  JSON.stringify({
    slug: EFR.coerceCountryId('Costa Rica'),
    family: EFR.resolveEditorialFamily({ cityName: 'San José', countryDisplay: 'Costa Rica' })
  })
);

assert(
  'Panamá display → panama → LATAM (F3.8b)',
  EFR.coerceCountryId('Panamá') === 'panama' &&
    EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryDisplay: 'Panamá' }) === 'LATAM',
  JSON.stringify({
    slug: EFR.coerceCountryId('Panamá'),
    family: EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryDisplay: 'Panamá' })
  })
);

assert(
  'Alias cr/pa → LATAM (F3.8b)',
  EFR.resolveEditorialFamily({ cityName: 'San José', countryId: 'cr' }) === 'LATAM' &&
    EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryId: 'pa' }) === 'LATAM',
  JSON.stringify({
    cr: EFR.resolveEditorialFamily({ cityName: 'San José', countryId: 'cr' }),
    pa: EFR.resolveEditorialFamily({ cityName: 'Ciudad de Panamá', countryId: 'pa' })
  })
);

assert(
  '11 familias en pools narrativos (incl. GLOBAL_NEUTRAL scaffold)',
  Narrative.NARRATIVE_SPINE_BY_REGION && Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length === 11,
  'spine=' + Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION || {}).length
);

assert(
  'LATAM en GOAL_PADS + PREMIUM_BLOCK',
  Premium.GOAL_PADS_BY_REGION.LATAM &&
    Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.LATAM,
  'goalPads=' + !!Premium.GOAL_PADS_BY_REGION.LATAM + ' blocks=' + !!Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.LATAM
);

const summaryAmor = (Narrative.SUMMARY_FRAME_POOL_BY_REGION.LATAM || {}).amor || [];
const observeAmor = (Narrative.OBSERVE_TAIL_BY_REGION.LATAM || {}).amor || [];
const goalPadAmor = (Premium.GOAL_PADS_BY_REGION.LATAM || {}).amor || [];
const premiumT3Amor = (((Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.LATAM || {}).doc17 || {}).t3 || {}).amor || '';

assert(
  'Amend SUMMARY amor[1] cercanía habitada',
  summaryAmor[0] && summaryAmor[0].indexOf('cercanía habitada') !== -1,
  summaryAmor[0]
);
assert(
  'Amend OBSERVE amor[2] lo cotidiano cercano',
  observeAmor[1] && observeAmor[1].indexOf('lo cotidiano cercano') !== -1,
  observeAmor[1]
);
assert(
  'Amend GOAL_PADS pad[4] planes demasiado cuidados (amor)',
  goalPadAmor[4] && goalPadAmor[4].indexOf('planes demasiado cuidados') !== -1,
  goalPadAmor[4]
);
assert(
  'Amend PREMIUM_BLOCK doc17.t3.amor verdad, no personaje',
  premiumT3Amor.indexOf('verdad, no personaje') !== -1,
  premiumT3Amor
);

const readings = [];
LATAM_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name) || entry;
  GOALS.forEach(function (goal) {
    const input = buildInput(goal);
    const ranked = Scorer.rankInfluences(city, input);
    const influences = ranked.length ? ranked.slice(0, 5) : mockInfluences;
    const reading = Premium.composeCityReading({
      city: city,
      goal: goal,
      relevantInfluences: influences,
      bridgeProfile: bridgeProfile,
      profile: { firstName: 'Roberto' }
    });
    const nc = reading.meta.narrativeContext || {};
    const km = reading.meta.knowledgeMeta || {};
    const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
    const norm = full.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    readings.push({
      city: city.name,
      goal: goal,
      reading: reading,
      nc: nc,
      full: full,
      norm: norm,
      regionN: nc.regionFamily,
      regionK: km.regionFamily,
      regionE: EFR.resolveEditorialFamily({ cityName: city.name, countryId: city.country })
    });
  });
});

assert('12 lecturas LATAM (4 ciudades × 3 goals)', readings.length === 12, 'count=' + readings.length);

const splitBrain = readings.filter(function (r) {
  return r.regionN !== r.regionK || r.regionN !== 'LATAM' || r.regionE !== 'LATAM';
});
assert(
  'Split-brain LATAM = 0 (narrative ≡ knowledge ≡ resolver)',
  splitBrain.length === 0,
  splitBrain.map(function (r) {
    return r.city + '/' + r.goal + ' n=' + r.regionN + ' k=' + r.regionK + ' e=' + r.regionE;
  }).join(' · ')
);

const iberianLeaks = [];
readings.forEach(function (r) {
  IBERIAN_LEAK.forEach(function (marker) {
    const m = marker.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (r.norm.indexOf(m) !== -1) {
      iberianLeaks.push(r.city + '/' + r.goal + ':' + marker);
    }
  });
});
assert(
  'Sin marcadores IBERIAN leak en lecturas LATAM',
  iberianLeaks.length === 0,
  iberianLeaks.join(' · ')
);

const wordFails = readings.filter(function (r) {
  const w = r.reading.meta.wordCount;
  return w < Premium.MIN_WORDS || w > Premium.MAX_WORDS;
});
assert(
  'Longitud 500–900 palabras (12 lecturas)',
  wordFails.length === 0,
  wordFails.map(function (r) {
    return r.city + '/' + r.goal + '=' + r.reading.meta.wordCount;
  }).join(' · ')
);

console.log('\n' + '═'.repeat(60));
console.log('Muestra CDMX amor:');
const cdmx = readings.find(function (r) { return r.city === 'Ciudad de México' && r.goal === 'amor'; });
if (cdmx) {
  console.log('  region:', cdmx.regionN);
  console.log('  summary:', (cdmx.nc.narrativeSummary || '').slice(0, 90) + '…');
  console.log('  words:', cdmx.reading.meta.wordCount);
}

function scanWave1(reading, countryId) {
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = full.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  const regionE = EFR.resolveEditorialFamily({ cityName: reading.meta.cityName || '', countryId: countryId });
  return {
    ok: reading.ok,
    words: reading.meta.wordCount,
    regionN: nc.regionFamily,
    regionK: km.regionFamily,
    regionE: regionE,
    iberian: IBERIAN_LEAK.filter(function (m) {
      return norm.indexOf(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
    }).length,
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1
  };
}

function composeWave1(city, goal) {
  return Premium.composeCityReading({
    city: city,
    goal: goal,
    relevantInfluences: mockInfluences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
}

const WAVE1_QA = [
  { label: 'Bogotá / amor', city: { name: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 }, goal: 'amor', slug: 'colombia' },
  { label: 'Bogotá / trabajo', city: { name: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 }, goal: 'trabajo', slug: 'colombia' },
  { label: 'Bogotá / descanso', city: { name: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 }, goal: 'descanso', slug: 'colombia' },
  { label: 'Santiago / amor', city: { name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693 }, goal: 'amor', slug: 'chile' },
  { label: 'Montevideo / trabajo', city: { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lon: -56.1645 }, goal: 'trabajo', slug: 'uruguay' },
  { label: 'Quito / descanso', city: { name: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678 }, goal: 'descanso', slug: 'ecuador' }
];

WAVE1_QA.forEach(function (c) {
  const reading = composeWave1(c.city, c.goal);
  const s = scanWave1(reading, c.slug);
  assert(
    c.label + ' → LATAM',
    s.regionN === 'LATAM' && s.regionK === 'LATAM' && s.regionE === 'LATAM',
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    c.label + ' ok:true · words 500–900',
    s.ok === true && s.words >= Premium.MIN_WORDS && s.words <= Premium.MAX_WORDS,
    JSON.stringify({ ok: s.ok, words: s.words })
  );
  assert(
    c.label + ' IBERIAN leak 0 · legacy 0',
    s.iberian === 0 && !s.p03 && !s.p06 && !s.p10,
    JSON.stringify({ iberian: s.iberian, p03: s.p03, p06: s.p06, p10: s.p10 })
  );
});

function scanLatamPlus(reading, slug) {
  return scanReading(reading, slug);
}

console.log('\n' + '═'.repeat(60));
console.log('QA obligatorio F3.8c — San José · Ciudad de Panamá (catálogo)');
console.log('═'.repeat(60));

const latamPlusReadings = [];
LATAM_PLUS_CITIES.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.name);
  if (!city) throw new Error('catalog missing ' + entry.name);
  GOALS.forEach(function (goal) {
    const reading = composeReading(city, goal, entry.slug);
    const s = scanLatamPlus(reading, entry.slug);
    latamPlusReadings.push({
      city: entry.name,
      goal: goal,
      slug: entry.slug,
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
      entry.name + ' / ' + goal + ' → LATAM (n=k=e)',
      s.regionN === 'LATAM' && s.regionK === 'LATAM' && s.regionE === 'LATAM',
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → split-brain 0',
      s.regionN === s.regionK && s.regionK === s.regionE,
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
    assert(
      entry.name + ' / ' + goal + ' → leaks 0',
      s.iberian === 0 && s.sea === 0 && s.we === 0,
      JSON.stringify({ iberian: s.iberian, sea: s.sea, we: s.we })
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
      'leaks=' + (s.iberian + s.sea + s.we),
      'ph=' + s.placeholders,
      'P03/P06/P10=' + (s.p03 ? 1 : 0) + '/' + (s.p06 ? 1 : 0) + '/' + (s.p10 ? 1 : 0)
    );
  });
});

assert('6 lecturas LATAM+ catálogo (2 ciudades × 3 goals)', latamPlusReadings.length === 6, 'count=' + latamPlusReadings.length);

const QA_REGRESSION = [
  { label: 'Nairobi / trabajo → AFRICAN_COASTAL', cityName: 'Nairobi', slug: 'kenya', goal: 'trabajo', expected: 'AFRICAN_COASTAL' },
  { label: 'Ciudad de México / amor → LATAM', cityName: 'Ciudad de México', slug: 'mexico', goal: 'amor', expected: 'LATAM' },
  { label: 'Delhi / amor → SOUTH_ASIAN', cityName: 'Delhi', slug: 'india', goal: 'amor', expected: 'SOUTH_ASIAN' },
  { label: 'Bangkok / amor → SOUTHEAST_ASIAN', cityName: 'Bangkok', slug: 'thailand', goal: 'amor', expected: 'SOUTHEAST_ASIAN' },
  { label: 'París / amor → WESTERN_EUROPE', cityName: 'París', slug: 'france', goal: 'amor', expected: 'WESTERN_EUROPE' },
  { label: 'Lisboa / amor → IBERIAN', cityName: 'Lisboa', slug: 'portugal', goal: 'amor', expected: 'IBERIAN' },
  { label: 'Oslo / amor → GLOBAL_NEUTRAL', cityName: 'Oslo', slug: 'norway', goal: 'amor', expected: 'GLOBAL_NEUTRAL' }
];

console.log('\n' + '═'.repeat(60));
console.log('Regresiones F3.8c');
console.log('═'.repeat(60));

QA_REGRESSION.forEach(function (c) {
  const city = Catalog.findCityByName(c.cityName) || { name: c.cityName, country: c.slug };
  const reading = composeReading(city, c.goal, c.slug);
  const s = scanReading(reading, c.slug);
  assert(
    c.label,
    s.regionN === c.expected && s.regionK === c.expected && s.regionE === c.expected,
    JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
  );
  assert(
    c.label + ' ok:true · words 500–900',
    s.ok === true && s.words >= Premium.MIN_WORDS && s.words <= Premium.MAX_WORDS,
    JSON.stringify({ ok: s.ok, words: s.words })
  );
  assert(
    c.label + ' P03/P06/P10 = 0',
    !s.p03 && !s.p06 && !s.p10,
    JSON.stringify({ p03: s.p03, p06: s.p06, p10: s.p10 })
  );
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
