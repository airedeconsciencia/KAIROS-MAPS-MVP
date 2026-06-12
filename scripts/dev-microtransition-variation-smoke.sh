#!/usr/bin/env bash
# Kairos Maps — Smoke micro-transitions & observe tails (Fase 3.8f.7g DEV)
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
echo " KAIROS MAPS — Micro-transition variation smoke (7g)"
echo " Scope: observe tails + voice transitions + editorial micro"
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
  process.env.BRIDGE, process.env.CATALOG, process.env.RESOLVER, process.env.ARCHETYPES,
  process.env.COUNTRY_SERVICE, process.env.SCORER, process.env.ASTRO,
  process.env.INTERP, process.env.BLOCKS, process.env.KNOWLEDGE,
  process.env.NARRATIVE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Premium = ctx.window.KairosCityPremiumComposition;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Catalog = ctx.window.KairosCitiesCatalog;

const BASELINE_MAX_REPEAT = 4;
const TARGET_MAX_REPEAT = 2;
const REPEAT_CEILING = 2;

const LEGACY_PHRASES = [
  'habitar {ciudad} es ver si la primera impresion aguanta',
  'devuelve en lo cotidiano lo que la cabeza aun debate',
  'y ahi aparece algo distinto — sin contradecir lo anterior',
  'no hace falta apresurar el dia',
  'un bloque bien habitado puede bastarte'
];

const PILOT = [
  { city: Catalog.findCityByName('Lisboa'), goal: 'amor', region: 'IBERIAN' },
  { city: Catalog.findCityByName('Lisboa'), goal: 'trabajo', region: 'IBERIAN' },
  { city: Catalog.findCityByName('Lisboa'), goal: 'descanso', region: 'IBERIAN' },
  { city: Catalog.findCityByName('Toronto'), goal: 'amor', region: 'ANGLO' },
  { city: Catalog.findCityByName('Toronto'), goal: 'trabajo', region: 'ANGLO' },
  { city: Catalog.findCityByName('Toronto'), goal: 'descanso', region: 'ANGLO' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'amor', region: 'MEDITERRANEAN' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'trabajo', region: 'MEDITERRANEAN' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'descanso', region: 'MEDITERRANEAN' },
  { city: Catalog.findCityByName('Tokio'), goal: 'amor', region: 'EAST_ASIAN' },
  { city: Catalog.findCityByName('Tokio'), goal: 'trabajo', region: 'EAST_ASIAN' },
  { city: Catalog.findCityByName('Tokio'), goal: 'descanso', region: 'EAST_ASIAN' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'amor', region: 'AFRICAN_COASTAL' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'trabajo', region: 'AFRICAN_COASTAL' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'descanso', region: 'AFRICAN_COASTAL' }
];

const robertoUtc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

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

function normalizeSentence(text, cityName) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\{ciudad\}/g, '{ciudad}')
    .replace(new RegExp(String(cityName || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '{ciudad}')
    .replace(/\s+/g, ' ')
    .trim();
}

function maxPhraseRepeat(readings) {
  const counts = new Map();
  readings.forEach(function (r) {
    r.full.split(/[\n.!?]+/).forEach(function (s) {
      const sent = normalizeSentence(s, r.city);
      if (sent.length < 24) return;
      counts.set(sent, (counts.get(sent) || 0) + 1);
    });
  });
  let max = 0;
  counts.forEach(function (c) {
    if (c > max) max = c;
  });
  return { max: max, counts: counts };
}

function poolMaxRepeat(poolTexts) {
  const counts = new Map();
  poolTexts.forEach(function (t) {
    const sent = normalizeSentence(t, '{ciudad}');
    if (sent.length < 16) return;
    counts.set(sent, (counts.get(sent) || 0) + 1);
  });
  let max = 0;
  counts.forEach(function (c) {
    if (c > max) max = c;
  });
  return max;
}

function countLegacyHits(readings) {
  let hits = 0;
  readings.forEach(function (r) {
    const blob = r.full.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    LEGACY_PHRASES.forEach(function (m) {
      if (blob.indexOf(m) !== -1) hits += 1;
    });
  });
  return hits;
}

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const readings = PILOT.map(function (c) {
  const input = buildInput(c.goal);
  const ranked = Scorer.rankInfluences(c.city, input);
  const reading = Premium.composeCityReading({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
  const nc = reading.meta.narrativeContext || {};
  const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
  return {
    city: c.city.name,
    goal: c.goal,
    region: nc.regionFamily || Narrative.resolveRegionFamily(c.city.name, c.city.country),
    nc: nc,
    full: full,
    reading: reading
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

const regionsUsed = new Set(readings.map(function (r) { return r.region; }));
assert(
  '5 ciudades piloto × familias regionales',
  regionsUsed.size === 5,
  Array.from(regionsUsed).join(', ')
);

assert(
  'OBSERVE_TAIL_BY_REGION exportado',
  Narrative.OBSERVE_TAIL_BY_REGION && Object.keys(Narrative.OBSERVE_TAIL_BY_REGION).length === 5,
  'regions=' + (Narrative.OBSERVE_TAIL_BY_REGION ? Object.keys(Narrative.OBSERVE_TAIL_BY_REGION).length : 0)
);

assert(
  'VOICE_TRANSITION_BY_REGION exportado',
  Premium.VOICE_TRANSITION_BY_REGION && Object.keys(Premium.VOICE_TRANSITION_BY_REGION).length === 5,
  'regions=' + (Premium.VOICE_TRANSITION_BY_REGION ? Object.keys(Premium.VOICE_TRANSITION_BY_REGION).length : 0)
);

const observeTails = [];
Object.keys(Narrative.OBSERVE_TAIL_BY_REGION).forEach(function (region) {
  ['amor', 'trabajo', 'descanso'].forEach(function (goal) {
    (Narrative.OBSERVE_TAIL_BY_REGION[region][goal] || []).forEach(function (t) {
      observeTails.push(t);
    });
  });
});
assert(
  'HUMAN_ATMO observe tail pools sin frases ≥3 repeticiones',
  poolMaxRepeat(observeTails) <= REPEAT_CEILING,
  'poolMax=' + poolMaxRepeat(observeTails)
);

const transitionLines = [];
Object.keys(Premium.VOICE_TRANSITION_BY_REGION).forEach(function (region) {
  Object.keys(Premium.VOICE_TRANSITION_BY_REGION[region]).forEach(function (cat) {
    Premium.VOICE_TRANSITION_BY_REGION[region][cat].forEach(function (t) {
      transitionLines.push(t);
    });
  });
});
assert(
  'VOICE_TRANSITION pools sin frases ≥3 repeticiones internas',
  poolMaxRepeat(transitionLines) <= REPEAT_CEILING,
  'poolMax=' + poolMaxRepeat(transitionLines)
);

const editorialLines = [];
Object.keys(Premium.REGIONAL_EDITORIAL_PADS).forEach(function (region) {
  Premium.REGIONAL_EDITORIAL_PADS[region].forEach(function (t) {
    editorialLines.push(t);
  });
});
Object.keys(Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL || {}).forEach(function (region) {
  ['amor', 'trabajo', 'descanso'].forEach(function (goal) {
    ((Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL[region] || {})[goal] || []).forEach(function (t) {
      editorialLines.push(t);
    });
  });
});
assert(
  'REGIONAL editorial pads sin frases ≥3 repeticiones internas',
  poolMaxRepeat(editorialLines) <= REPEAT_CEILING,
  'poolMax=' + poolMaxRepeat(editorialLines)
);

const legacyHits = countLegacyHits(readings);
assert('Frases legacy repetidas = 0', legacyHits === 0, 'legacyHits=' + legacyHits);

const phraseStats = maxPhraseRepeat(readings);
assert(
  'maxRepeat corpus ≤ ' + TARGET_MAX_REPEAT + ' (baseline ' + BASELINE_MAX_REPEAT + ')',
  phraseStats.max <= TARGET_MAX_REPEAT,
  'maxRepeat=' + phraseStats.max
);

assert(
  'Longitud 500–900 palabras',
  readings.every(function (r) {
    const w = r.reading.meta.wordCount;
    return w >= Premium.MIN_WORDS && w <= Premium.MAX_WORDS;
  }),
  readings.map(function (r) { return r.city + '/' + r.goal + '=' + r.reading.meta.wordCount; }).join(' · ')
);

const amor = readings.filter(function (r) { return r.goal === 'amor'; });
const observeUnique = new Set(amor.map(function (r) {
  return (r.nc.humanObserve || '').slice(-80);
}));
assert('Observe tail distinto por región (amor 5/5)', observeUnique.size === 5, 'unique=' + observeUnique.size);

console.log('\n' + '═'.repeat(60));
console.log('Métricas micro-transition (15 lecturas)');
console.log('  maxRepeat corpus:', phraseStats.max, '(baseline', BASELINE_MAX_REPEAT + ')');
console.log('  legacy hits:', legacyHits);
console.log('  observe tail unique amor:', observeUnique.size + '/5');

const topRepeats = [...phraseStats.counts.entries()]
  .sort(function (a, b) { return b[1] - a[1]; })
  .slice(0, 8)
  .map(function (e) { return e[1] + '/15 ' + e[0].slice(0, 64); });
console.log('  top corpus repeats:', topRepeats.join(' | '));

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
