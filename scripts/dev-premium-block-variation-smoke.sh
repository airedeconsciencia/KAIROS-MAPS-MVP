#!/usr/bin/env bash
# Kairos Maps — Smoke variación premium blocks regional (Fase 3.8f.7f DEV)
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
echo " KAIROS MAPS — Premium block variation smoke (7f)"
echo " Scope: PREMIUM_BLOCK_VARIATIONS_BY_REGION"
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
const Knowledge = ctx.window.KairosPremiumKnowledge;
const Catalog = ctx.window.KairosCitiesCatalog;

const BASELINE_MAX_REPEAT = 4;
const TARGET_MAX_REPEAT = 2;

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

function blockTexts(blocks, filterFn) {
  return (blocks || []).filter(filterFn).map(function (b) { return b.text || ''; }).join(' | ');
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
  const knowledge = Knowledge.getBlocksForContext({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    narrativeContext: nc
  });
  const blocks = knowledge.blocks || [];
  const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
  return {
    city: c.city.name,
    goal: c.goal,
    regionExpected: c.region,
    regionResolved: knowledge.meta.regionFamily || Knowledge.resolveRegionFamily(c.city.name, c.city.country),
    reading: reading,
    nc: nc,
    blocks: blocks,
    full: full,
    humanObservation: blockTexts(blocks, function (b) {
      return b.stage === 'observar' || b.slot === 'context';
    }) || (nc.humanObserve || '').slice(0, 80),
    humanChallenge: blockTexts(blocks, function (b) {
      return b.stage === 'desafia' || b.slot === 't2';
    }) || (nc.humanConflict || '').slice(0, 80),
    humanIntegration: blockTexts(blocks, function (b) {
      return b.stage === 'integrar' || b.slot === 'synthesis' || b.slot === 'reloc';
    }) || (nc.guidingQuestion || '').slice(0, 80),
    humanClosing: nc.humanClosing || ''
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

const regionsUsed = new Set(readings.map(function (r) { return r.regionResolved; }));
assert(
  '5 familias regionales activas',
  regionsUsed.size === 5,
  Array.from(regionsUsed).join(', ')
);

assert(
  'PREMIUM_BLOCK_VARIATIONS_BY_REGION exportado',
  Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION &&
    Object.keys(Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION).length === 5,
  'regions=' + (Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION ? Object.keys(Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION).length : 0)
);

const amor = readings.filter(function (r) { return r.goal === 'amor'; });
const obs = new Set(amor.map(function (r) { return r.humanObservation.slice(0, 48); }));
const ch = new Set(amor.map(function (r) { return r.humanChallenge.slice(0, 48); }));
const integ = new Set(amor.map(function (r) { return r.humanIntegration.slice(0, 48); }));
const close = new Set(amor.map(function (r) { return r.humanClosing.slice(0, 48); }));

assert('humanObservation únicos amor 5/5', obs.size === 5, 'unique=' + obs.size);
assert('humanChallenge únicos amor 5/5', ch.size === 5, 'unique=' + ch.size);
assert('humanIntegration únicos amor 5/5', integ.size === 5, 'unique=' + integ.size);
assert('humanClosing únicos amor 5/5', close.size === 5, 'unique=' + close.size);

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

const showcase = ['Lisboa', 'Barcelona', 'Tokio', 'Toronto', 'Ciudad del Cabo'];
console.log('\n' + '═'.repeat(60));
console.log('Comparación editorial (amor — bloques regionales)');
showcase.forEach(function (cityName) {
  const r = readings.find(function (x) { return x.city === cityName && x.goal === 'amor'; });
  if (!r) return;
  const t2 = (r.blocks || []).filter(function (b) { return b.slot === 't2'; }).map(function (b) { return b.text; })[0] || '';
  const t1 = (r.blocks || []).filter(function (b) { return b.slot === 't1'; }).map(function (b) { return b.text; })[0] || '';
  console.log('\n' + cityName + ' [' + r.regionResolved + ']');
  console.log('  t1: ' + t1.slice(0, 100) + (t1.length > 100 ? '…' : ''));
  console.log('  t2: ' + t2.slice(0, 100) + (t2.length > 100 ? '…' : ''));
  console.log('  closing: ' + r.humanClosing.slice(0, 100) + '…');
});

console.log('\n' + '═'.repeat(60));
console.log('Métricas premium block regional (15 lecturas)');
console.log('  maxRepeat corpus:', phraseStats.max, '(baseline', BASELINE_MAX_REPEAT + ')');
console.log('  observation unique amor:', obs.size + '/5');
console.log('  challenge unique amor:', ch.size + '/5');
console.log('  integration unique amor:', integ.size + '/5');
console.log('  closing unique amor:', close.size + '/5');

const topRepeats = [...phraseStats.counts.entries()]
  .sort(function (a, b) { return b[1] - a[1]; })
  .slice(0, 8)
  .map(function (e) { return e[1] + '/15 ' + e[0].slice(0, 64); });
console.log('  top corpus repeats:', topRepeats.join(' | '));

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
