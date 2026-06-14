#!/usr/bin/env bash
# Kairos Maps — WESTERN_EUROPE editorial integration smoke (F2.5c)
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
echo " KAIROS MAPS — WESTERN_EUROPE editorial integration (F2.5c)"
echo " Scope: París · Berlín · Ámsterdam · Estocolmo · anti-leak"
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

const WE_CITIES = [
  { name: 'París', country: 'Francia', slug: 'france' },
  { name: 'Berlín', country: 'Alemania', slug: 'germany' },
  { name: 'Ámsterdam', country: 'Países Bajos', slug: 'netherlands' },
  { name: 'Estocolmo', country: 'Suecia', slug: 'sweden' }
];
const GOALS = ['amor', 'trabajo', 'descanso'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const MED_LEAK = ['paseo', 'acera', 'vitrina urbana'];
const ANGLO_LEAK = ['agenda', 'calendario', 'bloque reservado', 'productividad'];
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
    iberian: scanLeakMarkers(norm, IBERIAN_LEAK),
    med: scanLeakMarkers(norm, MED_LEAK),
    anglo: scanLeakMarkers(norm, ANGLO_LEAK),
    p03: norm.indexOf(P03) !== -1,
    p06: norm.indexOf(P06) !== -1,
    p10: norm.indexOf(P10) !== -1
  };
}

assert(
  'WESTERN_EUROPE registered in resolver',
  EFR.isRegisteredFamily('WESTERN_EUROPE') === true,
  'registered=' + EFR.isRegisteredFamily('WESTERN_EUROPE')
);

assert(
  'france → WESTERN_EUROPE',
  EFR.COUNTRY_EDITORIAL_FAMILY.france === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'París', countryId: 'france' })
);
assert(
  'germany → WESTERN_EUROPE',
  EFR.COUNTRY_EDITORIAL_FAMILY.germany === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'Berlín', countryId: 'germany' })
);
assert(
  'netherlands → WESTERN_EUROPE',
  EFR.COUNTRY_EDITORIAL_FAMILY.netherlands === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'Ámsterdam', countryId: 'netherlands' })
);
assert(
  'sweden → WESTERN_EUROPE',
  EFR.COUNTRY_EDITORIAL_FAMILY.sweden === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'Estocolmo', countryId: 'sweden' })
);

assert(
  '8 familias en pools narrativos',
  Narrative.NARRATIVE_SPINE_BY_REGION && Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length === 8,
  'spine=' + Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION || {}).length
);

assert(
  'WESTERN_EUROPE en GOAL_PADS + PREMIUM_BLOCK',
  Premium.GOAL_PADS_BY_REGION.WESTERN_EUROPE &&
    Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.WESTERN_EUROPE,
  'goalPads=' + !!Premium.GOAL_PADS_BY_REGION.WESTERN_EUROPE +
    ' blocks=' + !!Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION.WESTERN_EUROPE
);

const readings = [];
WE_CITIES.forEach(function (entry) {
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
    const norm = normFold(full);
    readings.push({
      city: city.name,
      goal: goal,
      slug: entry.slug,
      reading: reading,
      norm: norm,
      regionN: nc.regionFamily,
      regionK: km.regionFamily,
      regionE: EFR.resolveEditorialFamily({ cityName: city.name, countryId: entry.slug })
    });
  });
});

assert('12 lecturas WESTERN_EUROPE (4 ciudades × 3 goals)', readings.length === 12, 'count=' + readings.length);

const splitBrain = readings.filter(function (r) {
  return r.regionN !== r.regionK ||
    r.regionN !== 'WESTERN_EUROPE' ||
    r.regionE !== 'WESTERN_EUROPE';
});
assert(
  'Split-brain WESTERN_EUROPE = 0 (narrative ≡ knowledge ≡ resolver)',
  splitBrain.length === 0,
  splitBrain.map(function (r) {
    return r.city + '/' + r.goal + ' n=' + r.regionN + ' k=' + r.regionK + ' e=' + r.regionE;
  }).join(' · ')
);

const gnFallback = readings.filter(function (r) {
  return r.regionN === 'GLOBAL_NEUTRAL' || r.regionK === 'GLOBAL_NEUTRAL' || r.regionE === 'GLOBAL_NEUTRAL';
});
assert(
  'GLOBAL_NEUTRAL fallback = 0 en lecturas WE',
  gnFallback.length === 0,
  gnFallback.map(function (r) {
    return r.city + '/' + r.goal + ' n=' + r.regionN + ' k=' + r.regionK + ' e=' + r.regionE;
  }).join(' · ')
);

function collectLeaks(readings, markers, label) {
  const hits = [];
  readings.forEach(function (r) {
    markers.forEach(function (marker) {
      const m = normFold(marker);
      if (r.norm.indexOf(m) !== -1) hits.push(r.city + '/' + r.goal + ':' + label + ':' + marker);
    });
  });
  return hits;
}

assert(
  'IBERIAN leak = 0',
  collectLeaks(readings, IBERIAN_LEAK, 'IBERIAN').length === 0,
  collectLeaks(readings, IBERIAN_LEAK, 'IBERIAN').join(' · ')
);
assert(
  'MEDITERRANEAN leak = 0',
  collectLeaks(readings, MED_LEAK, 'MED').length === 0,
  collectLeaks(readings, MED_LEAK, 'MED').join(' · ')
);
assert(
  'ANGLO leak = 0',
  collectLeaks(readings, ANGLO_LEAK, 'ANGLO').length === 0,
  collectLeaks(readings, ANGLO_LEAK, 'ANGLO').join(' · ')
);

const okFails = readings.filter(function (r) { return r.reading.ok !== true; });
assert(
  'ok:true (12 lecturas)',
  okFails.length === 0,
  okFails.map(function (r) { return r.city + '/' + r.goal; }).join(' · ')
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

const legacyFails = [];
readings.forEach(function (r) {
  const s = scanReading(r.reading, r.slug);
  if (s.p03 || s.p06 || s.p10) {
    legacyFails.push(r.city + '/' + r.goal + ' p03=' + s.p03 + ' p06=' + s.p06 + ' p10=' + s.p10);
  }
});
assert('P03/P06/P10 = 0 (12 lecturas)', legacyFails.length === 0, legacyFails.join(' · '));

function composeReading(city, goal) {
  return Premium.composeCityReading({
    city: city,
    goal: goal,
    relevantInfluences: mockInfluences,
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
}

const QA_WE = [
  { label: 'París / amor-trabajo-descanso → WESTERN_EUROPE', cityName: 'París', slug: 'france', goals: GOALS },
  { label: 'Berlín / amor-trabajo-descanso → WESTERN_EUROPE', cityName: 'Berlín', slug: 'germany', goals: GOALS },
  { label: 'Ámsterdam / amor-trabajo-descanso → WESTERN_EUROPE', cityName: 'Ámsterdam', slug: 'netherlands', goals: GOALS },
  { label: 'Estocolmo / amor-trabajo-descanso → WESTERN_EUROPE', cityName: 'Estocolmo', slug: 'sweden', goals: GOALS }
];

QA_WE.forEach(function (entry) {
  const city = Catalog.findCityByName(entry.cityName);
  entry.goals.forEach(function (goal) {
    const reading = composeReading(city, goal);
    const s = scanReading(reading, entry.slug);
    assert(
      entry.cityName + ' / ' + goal + ' → WESTERN_EUROPE',
      s.regionN === 'WESTERN_EUROPE' && s.regionK === 'WESTERN_EUROPE' && s.regionE === 'WESTERN_EUROPE',
      JSON.stringify({ regionN: s.regionN, regionK: s.regionK, regionE: s.regionE })
    );
  });
});

const QA_REGRESSION = [
  { label: 'Lisboa / amor → IBERIAN', cityName: 'Lisboa', slug: 'portugal', goal: 'amor', expected: 'IBERIAN' },
  { label: 'Oslo / amor → GLOBAL_NEUTRAL', cityName: 'Oslo', slug: 'norway', goal: 'amor', expected: 'GLOBAL_NEUTRAL' },
  { label: 'Ciudad de México / amor → LATAM', cityName: 'Ciudad de México', slug: 'mexico', goal: 'amor', expected: 'LATAM' }
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
console.log('Muestra París amor:');
const paris = readings.find(function (r) { return r.city === 'París' && r.goal === 'amor'; });
if (paris) {
  console.log('  region:', paris.regionN);
  console.log('  words:', paris.reading.meta.wordCount);
}

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
