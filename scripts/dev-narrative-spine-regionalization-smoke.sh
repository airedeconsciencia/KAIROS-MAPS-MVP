#!/usr/bin/env bash
# Kairos Maps — Smoke regionalización narrative spine (Fase 3.8f.7d DEV)
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
echo " KAIROS MAPS — Narrative spine regionalization smoke (7d)"
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

const BASELINE_MAX_REPEAT = 5;
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

function maxPhraseRepeat(texts, cityName) {
  const counts = new Map();
  texts.forEach(function (entry) {
    const text = typeof entry === 'string' ? entry : entry.text;
    const city = typeof entry === 'string' ? cityName : entry.city;
    String(text || '').split(/[\n.!?]+/).forEach(function (s) {
      const sent = normalizeSentence(s, city);
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

const LEGACY_SPINE_MARKERS = [
  'puede activar una prisa muy humana',
  'el cuerpo pide pausa; la mente sigue midiendo terreno',
  'un gesto pequeño puede bastarte',
  'lo que hoy aparece',
  'puede que descubras',
  'leyendo desde el amor y el vinculo, notes esto',
  'leyendo desde el trabajo y el proposito, notes esto',
  'leyendo desde el descanso y el cuerpo, notes esto'
];

function countLegacySpineHits(readings) {
  let hits = 0;
  readings.forEach(function (r) {
    const spineBlob = [
      r.nc.narrativeSummary,
      r.nc.humanConflict,
      r.nc.humanOpportunity,
      r.nc.humanOpportunityAction,
      r.nc.humanClosing,
      r.nc.guidingQuestion
    ].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    LEGACY_SPINE_MARKERS.forEach(function (m) {
      if (spineBlob.indexOf(m) !== -1) hits += 1;
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
    regionExpected: c.region,
    regionResolved: nc.regionFamily || Narrative.resolveRegionFamily(c.city.name, c.city.country),
    reading: reading,
    nc: nc,
    full: full
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

const regionsUsed = new Set(readings.map(function (r) { return r.regionResolved; }));
assert(
  '5 familias regionales activas',
  regionsUsed.size === 5 &&
    ['IBERIAN', 'MEDITERRANEAN', 'ANGLO', 'EAST_ASIAN', 'AFRICAN_COASTAL'].every(function (r) {
      return regionsUsed.has(r);
    }),
  Array.from(regionsUsed).join(', ')
);

readings.forEach(function (r) {
  if (r.regionResolved !== r.regionExpected) {
    assert('Región ' + r.city + '/' + r.goal, false, 'got=' + r.regionResolved);
  }
});

const amorByRegion = readings.filter(function (r) { return r.goal === 'amor'; });
const summaries = new Set(amorByRegion.map(function (r) { return (r.nc.narrativeSummary || '').slice(0, 48); }));
const conflicts = new Set(amorByRegion.map(function (r) { return (r.nc.humanConflict || '').slice(0, 48); }));
const opportunities = new Set(amorByRegion.map(function (r) { return (r.nc.humanOpportunity || '').slice(0, 48); }));
const closings = new Set(amorByRegion.map(function (r) { return (r.nc.humanClosing || '').slice(0, 48); }));

assert('Narrative Summary distinto por región (amor 5/5)', summaries.size === 5, 'unique=' + summaries.size);
assert('Human Conflict distinto por región (amor 5/5)', conflicts.size === 5, 'unique=' + conflicts.size);
assert('Human Opportunity distinto por región (amor 5/5)', opportunities.size === 5, 'unique=' + opportunities.size);
assert('Human Closing distinto por región (amor 5/5)', closings.size === 5, 'unique=' + closings.size);

const spineTexts = readings.map(function (r) {
  return {
    city: r.city,
    text: [
      r.nc.narrativeSummary,
      r.nc.humanConflict,
      r.nc.humanOpportunity,
      r.nc.humanOpportunityAction,
      r.nc.guidingQuestion,
      r.nc.humanClosing
    ].join('\n')
  };
});
const spinePhraseStats = maxPhraseRepeat(spineTexts);
const corpusPhraseStats = maxPhraseRepeat(readings.map(function (r) { return { city: r.city, text: r.full }; }));
const legacyHits = countLegacySpineHits(readings);
const spineReduced50 = spinePhraseStats.max <= Math.ceil(BASELINE_MAX_REPEAT * 0.5);
const corpusReduced50 = corpusPhraseStats.max <= Math.ceil(BASELINE_MAX_REPEAT * 0.5);

assert(
  'maxRepeat spine ≤ ' + TARGET_MAX_REPEAT + ' (baseline ' + BASELINE_MAX_REPEAT + ')',
  spinePhraseStats.max <= TARGET_MAX_REPEAT || spineReduced50,
  'spineMax=' + spinePhraseStats.max + ' target≤' + TARGET_MAX_REPEAT + ' reduced50%=' + spineReduced50
);
assert(
  'Frases legacy del spine eliminadas (0 hits)',
  legacyHits === 0,
  'legacyHits=' + legacyHits
);

assert(
  'Longitud 500–900 palabras',
  readings.every(function (r) {
    const w = r.reading.meta.wordCount;
    return w >= Premium.MIN_WORDS && w <= Premium.MAX_WORDS;
  }),
  readings.map(function (r) { return r.city + '/' + r.goal + '=' + r.reading.meta.wordCount; }).join(' · ')
);

assert(
  'NARRATIVE_SPINE_BY_REGION exportado',
  Narrative.NARRATIVE_SPINE_BY_REGION && Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length === 5,
  'regions=' + (Narrative.NARRATIVE_SPINE_BY_REGION ? Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION).length : 0)
);

const showcase = ['Lisboa', 'Barcelona', 'Tokio', 'Toronto', 'Ciudad del Cabo'];
console.log('\n' + '═'.repeat(60));
console.log('Comparación editorial (amor)');
showcase.forEach(function (cityName) {
  const r = readings.find(function (x) { return x.city === cityName && x.goal === 'amor'; });
  if (!r) return;
  console.log('\n' + cityName + ' [' + r.regionResolved + ']');
  console.log('  summary: ' + (r.nc.narrativeSummary || '').slice(0, 110) + '…');
  console.log('  conflict: ' + (r.nc.humanConflict || '').slice(0, 110) + '…');
  console.log('  opportunity: ' + (r.nc.humanOpportunity || '').slice(0, 110) + '…');
  console.log('  closing: ' + (r.nc.humanClosing || '').slice(0, 110) + '…');
});

console.log('\n' + '═'.repeat(60));
console.log('Métricas spine regional (15 lecturas)');
console.log('  maxRepeat spine:', spinePhraseStats.max, '(baseline', BASELINE_MAX_REPEAT + ')');
console.log('  maxRepeat corpus:', corpusPhraseStats.max, '(baseline', BASELINE_MAX_REPEAT + ', reduced50%=' + corpusReduced50 + ')');
console.log('  legacy spine hits:', legacyHits);
console.log('  summary unique amor:', summaries.size + '/5');
console.log('  conflict unique amor:', conflicts.size + '/5');
console.log('  opportunity unique amor:', opportunities.size + '/5');
console.log('  closing unique amor:', closings.size + '/5');

const topRepeats = [...corpusPhraseStats.counts.entries()]
  .sort(function (a, b) { return b[1] - a[1]; })
  .slice(0, 5)
  .map(function (e) { return e[1] + '/15 ' + e[0].slice(0, 64); });
console.log('  top corpus repeats:', topRepeats.join(' | '));

const topSpineRepeats = [...spinePhraseStats.counts.entries()]
  .sort(function (a, b) { return b[1] - a[1]; })
  .slice(0, 5)
  .map(function (e) { return e[1] + '/15 ' + e[0].slice(0, 64); });
console.log('  top spine repeats:', topSpineRepeats.join(' | '));

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
