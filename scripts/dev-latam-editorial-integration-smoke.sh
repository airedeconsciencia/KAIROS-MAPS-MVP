#!/usr/bin/env bash
# Kairos Maps — Smoke LATAM editorial integration (PRE-F1.3)
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
echo " KAIROS MAPS — LATAM editorial integration smoke (PRE-F1.3)"
echo " Scope: CDMX · BA · Rio · Lima · amends · anti-IBERIAN"
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

const LATAM_CITIES = [
  { name: 'Ciudad de México', country: 'México' },
  { name: 'Buenos Aires', country: 'Argentina' },
  { name: 'Río de Janeiro', country: 'Brasil' },
  { name: 'Lima', country: 'Perú' }
];
const GOALS = ['amor', 'trabajo', 'descanso'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];

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

assert(
  'LATAM en resolver (MX, AR, BR, PE, CO, CL, UY, EC)',
  ['mexico', 'argentina', 'brazil', 'peru', 'colombia', 'chile', 'uruguay', 'ecuador'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'LATAM';
  }),
  JSON.stringify({
    mexico: EFR.COUNTRY_EDITORIAL_FAMILY.mexico,
    argentina: EFR.COUNTRY_EDITORIAL_FAMILY.argentina,
    brazil: EFR.COUNTRY_EDITORIAL_FAMILY.brazil,
    peru: EFR.COUNTRY_EDITORIAL_FAMILY.peru,
    colombia: EFR.COUNTRY_EDITORIAL_FAMILY.colombia,
    chile: EFR.COUNTRY_EDITORIAL_FAMILY.chile,
    uruguay: EFR.COUNTRY_EDITORIAL_FAMILY.uruguay,
    ecuador: EFR.COUNTRY_EDITORIAL_FAMILY.ecuador
  })
);

assert(
  '8 familias en pools narrativos (incl. GLOBAL_NEUTRAL scaffold)',
  Narrative.NARRATIVE_SPINE_BY_REGION && Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length === 8,
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

const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';

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

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
