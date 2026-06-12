#!/usr/bin/env bash
# Kairos Maps — Smoke variación editorial premium (Fase 3.8f.7a DEV)
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
echo " KAIROS MAPS — Premium editorial variation smoke (3.8f.7a)"
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

const BASELINE_MODAL = { puedeQue: 69, talVez: 54 };
const BASELINE_BOILERPLATE = 'con el tiempo, puede que';
const LEGACY_CLOSING_AMOR = 'atreverte a ser más verdadero antes que más visible';
const LEGACY_OBSERVE = 'confirme o matice lo que el cuerpo ya intuía';
const LEGACY_PADS = [
  'un gesto pequeño puede bastarte',
  'dale tiempo antes de juzgar',
  'mira si lo que sientes hoy sigue vivo dentro de un mes'
];

const PILOT = [
  { city: Catalog.findCityByName('Lisboa'), goal: 'amor' },
  { city: Catalog.findCityByName('Lisboa'), goal: 'trabajo' },
  { city: Catalog.findCityByName('Lisboa'), goal: 'descanso' },
  { city: Catalog.findCityByName('Toronto'), goal: 'amor' },
  { city: Catalog.findCityByName('Toronto'), goal: 'trabajo' },
  { city: Catalog.findCityByName('Toronto'), goal: 'descanso' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'amor' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'trabajo' },
  { city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 }, goal: 'descanso' },
  { city: Catalog.findCityByName('Tokio'), goal: 'amor' },
  { city: Catalog.findCityByName('Tokio'), goal: 'trabajo' },
  { city: Catalog.findCityByName('Tokio'), goal: 'descanso' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'amor' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'trabajo' },
  { city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'descanso' }
];

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

function countPhrase(text, phrase) {
  const lower = text.toLowerCase();
  const p = phrase.toLowerCase();
  let n = 0;
  let idx = 0;
  while ((idx = lower.indexOf(p, idx)) !== -1) {
    n += 1;
    idx += p.length;
  }
  return n;
}

function maxRepeat(values) {
  const m = new Map();
  let max = 0;
  values.forEach(function (v) {
    const k = String(v).trim().toLowerCase();
    if (!k) return;
    const c = (m.get(k) || 0) + 1;
    m.set(k, c);
    if (c > max) max = c;
  });
  return max;
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
  const scored = Scorer.scoreCity(c.city, input);
  const reading = Premium.composeCityReading({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' },
    score: scored ? scored.score : null
  });
  const narrative = Narrative.deriveNarrativeContext({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile
  });
  const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
  return {
    city: c.city.name,
    goal: c.goal,
    reading: reading,
    narrative: narrative,
    full: full,
    closing: narrative.narrativeContext.humanClosing || '',
    observe: narrative.narrativeContext.humanObserve || '',
    action: narrative.narrativeContext.humanOpportunityAction || ''
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

const closings = readings.map(function (r) { return r.closing; });
const closingMax = maxRepeat(closings);
assert(
  'Cierre exacto repetido máximo 2 veces',
  closingMax <= 2,
  'maxRepeat=' + closingMax
);

const observes = readings.map(function (r) { return r.observe; });
const observeMax = maxRepeat(observes);
assert(
  'Observe exacto repetido máximo 2 veces',
  observeMax <= 2,
  'maxRepeat=' + observeMax
);

const legacyObserveHits = readings.filter(function (r) {
  return r.observe.toLowerCase().indexOf(LEGACY_OBSERVE) !== -1;
}).length;
assert(
  'Sin boilerplate legacy «lo que el cuerpo ya intuía»',
  legacyObserveHits === 0,
  'hits=' + legacyObserveHits + '/15'
);

const legacyBoilerHits = readings.filter(function (r) {
  return r.full.toLowerCase().indexOf(BASELINE_BOILERPLATE) !== -1;
}).length;
assert(
  'Sin patrón «Con el tiempo, puede que» en lecturas',
  legacyBoilerHits === 0,
  'hits=' + legacyBoilerHits + '/15'
);

let puedeQue = 0;
let talVez = 0;
readings.forEach(function (r) {
  puedeQue += countPhrase(r.full, 'puede que');
  talVez += countPhrase(r.full, 'tal vez');
});
const puedeQueMax = Math.floor(BASELINE_MODAL.puedeQue * 0.7);
const talVezMax = Math.floor(BASELINE_MODAL.talVez * 0.7);
assert(
  '«puede que» reducido ≥30% vs baseline (69→≤' + puedeQueMax + ')',
  puedeQue <= puedeQueMax,
  'actual=' + puedeQue + ' baseline=' + BASELINE_MODAL.puedeQue
);
assert(
  '«tal vez» reducido ≥30% vs baseline (54→≤' + talVezMax + ')',
  talVez <= talVezMax,
  'actual=' + talVez + ' baseline=' + BASELINE_MODAL.talVez
);

const amorActions = readings.filter(function (r) { return r.goal === 'amor'; }).map(function (r) {
  return r.action;
});
const amorActionMax = maxRepeat(amorActions);
assert(
  'Acción amor variada (máx 2 repeticiones exactas en 5 lecturas)',
  amorActionMax <= 2 && amorActions.length === 5,
  'maxRepeat=' + amorActionMax + ' unique=' + new Set(amorActions.map(function (a) {
    return a.toLowerCase();
  })).size
);

const amorClosings = readings.filter(function (r) { return r.goal === 'amor'; }).map(function (r) {
  return r.closing;
});
const amorClosingLegacy = amorClosings.filter(function (c) {
  return c.toLowerCase().indexOf(LEGACY_CLOSING_AMOR) !== -1;
}).length;
assert(
  'Cierre amor no clonado en 5/5 (legacy ≤2)',
  amorClosingLegacy <= 2,
  'legacyHits=' + amorClosingLegacy + '/5'
);

LEGACY_PADS.forEach(function (pad) {
  const hits = readings.filter(function (r) {
    return r.full.toLowerCase().indexOf(pad) !== -1;
  }).length;
  assert('Pad legacy «' + pad.slice(0, 40) + '…» ≤2/15', hits <= 2, 'hits=' + hits);
});

assert(
  'Longitud 500–900 palabras en 15 lecturas',
  readings.every(function (r) {
    const w = r.reading.meta.wordCount;
    return w >= Premium.MIN_WORDS && w <= Premium.MAX_WORDS;
  }),
  readings.map(function (r) {
    return r.city + '/' + r.goal + '=' + r.reading.meta.wordCount;
  }).join(' · ')
);

console.log('\n' + '═'.repeat(60));
console.log('Métricas variación (15 lecturas piloto)');
console.log('  cierre maxRepeat:', closingMax);
console.log('  observe maxRepeat:', observeMax);
console.log('  amor action maxRepeat:', amorActionMax);
console.log('  «puede que»: ' + puedeQue + ' (baseline ' + BASELINE_MODAL.puedeQue + ', target ≤' + puedeQueMax + ')');
console.log('  «tal vez»: ' + talVez + ' (baseline ' + BASELINE_MODAL.talVez + ', target ≤' + talVezMax + ')');
console.log('  amor cierre legacy:', amorClosingLegacy + '/5');

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
