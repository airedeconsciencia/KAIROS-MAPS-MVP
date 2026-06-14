#!/usr/bin/env bash
# Kairos Maps — Smoke Editorial De-duplication P0 (Fase 3.8h.5 DEV)
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
echo " KAIROS MAPS — Editorial de-duplication smoke (3.8h.5)"
echo " Scope: P03/P06/P10 · P1 N01-N03 · maxRepeat ≤ 2"
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
  process.env.BRIDGE, process.env.CATALOG, process.env.RESOLVER,
  process.env.ARCHETYPES, process.env.COUNTRY_SERVICE, process.env.SCORER,
  process.env.ASTRO, process.env.INTERP, process.env.BLOCKS, process.env.KNOWLEDGE,
  process.env.NARRATIVE, process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Catalog = ctx.window.KairosCitiesCatalog;
const EFR = ctx.window.KairosEditorialFamily;
const Premium = ctx.window.KairosCityPremiumComposition;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const GOALS = ['amor', 'trabajo', 'descanso'];

const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';
const LEGACY_FAV = [
  'puede que descubras una puerta',
  'quizá notes que se abre algo con suavidad',
  'tal vez se insinúe un gesto posible'
];

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert(
  'SPINE_FAVORECE_OPEN_BY_REGION exportado',
  Premium.SPINE_FAVORECE_OPEN_BY_REGION &&
    Object.keys(Premium.SPINE_FAVORECE_OPEN_BY_REGION).length === 8,
  'regions=' + (Premium.SPINE_FAVORECE_OPEN_BY_REGION
    ? Object.keys(Premium.SPINE_FAVORECE_OPEN_BY_REGION).join(',')
    : 'missing')
);

LEGACY_FAV.forEach(function (marker) {
  var hit = false;
  Object.keys(Premium.SPINE_FAVORECE_OPEN_BY_REGION).forEach(function (region) {
    Premium.SPINE_FAVORECE_OPEN_BY_REGION[region].forEach(function (line) {
      if (line.toLowerCase().indexOf(marker) !== -1) hit = true;
    });
  });
  assert('Pool favorece sin legacy: «' + marker + '»', !hit, hit ? 'found in pool' : null);
});

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
const mock = [
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

let okReadings = 0;
let p03 = 0;
let p06 = 0;
let p10 = 0;
const phraseCounts = new Map();

Catalog.CITIES.forEach(function (city) {
  GOALS.forEach(function (goal) {
    const input = buildInput(goal);
    const ranked = Scorer.rankInfluences(city, input);
    const inf = ranked.length ? ranked.slice(0, 5) : mock;
    const reading = Premium.composeCityReading({
      city: city,
      goal: goal,
      relevantInfluences: inf,
      bridgeProfile: bridgeProfile,
      profile: { firstName: 'Roberto' }
    });
    if (!reading.ok) return;
    okReadings += 1;
    const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n').toLowerCase();
    if (full.indexOf(P03) !== -1) p03 += 1;
    if (full.indexOf(P06) !== -1) p06 += 1;
    if (full.indexOf(P10) !== -1) p10 += 1;
    [P03, P06, P10, 'bajar el volumen de una música demasiado alta', 'mezcla con delicadeza'].forEach(function (p) {
      if (full.indexOf(p) !== -1) {
        phraseCounts.set(p, (phraseCounts.get(p) || 0) + 1);
      }
    });
  });
});

const maxRepeat = phraseCounts.size
  ? Math.max.apply(null, Array.from(phraseCounts.values()))
  : 0;

assert('Lecturas OK generadas (≥75)', okReadings >= 75, 'count=' + okReadings);
assert('P03 ausente (puede que descubras una puerta) = 0', p03 === 0, 'hits=' + p03 + '/' + okReadings);
assert('P06 reducido (ritmo del cuerpo) = 0', p06 === 0, 'hits=' + p06 + '/' + okReadings);
assert('P10 reducido (lo que sigue no corrige) = 0', p10 === 0, 'hits=' + p10 + '/' + okReadings);
assert('maxRepeat corpus P0 ≤ 2', maxRepeat <= 2, 'maxRepeat=' + maxRepeat + ' ' + JSON.stringify(Object.fromEntries(phraseCounts)));

const QA_CITIES = ['Nueva York', 'Londres', 'Seúl', 'El Cairo', 'Nairobi'];
const UNIVERSAL_AMOR = 'invita al encuentro honesto, sin prisa de brillar';
const BLOQUE_RESERVADO = 'bloque reservado';
const DIRECCION_INTERNA = 'dirección interna';
const COHERENCIA_CIERRE = 'la coherencia no tiene que ser total';
const PAUSA_REAL_CIERRE = 'basta una pausa real que te sostenga';
const TU_SENTIDO = 'tu sentido';
let qaOk = 0;
let universalAmorHits = 0;
let bloqueReservadoHits = 0;
let direccionInternaMax = 0;
let coherenciaCierreHits = 0;
let pausaRealHits = 0;
let tuSentidoMax = 0;
let splitBrainQa = 0;

function countPhrase(text, phrase) {
  const low = text.toLowerCase();
  const p = phrase.toLowerCase();
  let n = 0;
  let i = 0;
  while ((i = low.indexOf(p, i)) !== -1) {
    n += 1;
    i += p.length;
  }
  return n;
}

Catalog.CITIES.filter(function (city) {
  return QA_CITIES.indexOf(city.name) !== -1;
}).forEach(function (city) {
  const famN = Narrative.resolveRegionFamily(city.name, city.country);
  const famP = Premium.resolveRegionFamily(city.name, city.country);
  if (famN !== famP) splitBrainQa += 1;
  GOALS.forEach(function (goal) {
    const input = buildInput(goal);
    const ranked = Scorer.rankInfluences(city, input);
    const inf = ranked.length ? ranked.slice(0, 5) : mock;
    const reading = Premium.composeCityReading({
      city: city,
      goal: goal,
      relevantInfluences: inf,
      bridgeProfile: bridgeProfile,
      profile: { firstName: 'Roberto' }
    });
    if (!reading.ok) return;
    qaOk += 1;
    const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
    const low = full.toLowerCase();
    if (goal === 'amor' && low.indexOf(UNIVERSAL_AMOR) !== -1) universalAmorHits += 1;
    if (low.indexOf(BLOQUE_RESERVADO) !== -1) bloqueReservadoHits += 1;
    const di = countPhrase(full, DIRECCION_INTERNA);
    if (di > direccionInternaMax) direccionInternaMax = di;
    if (low.indexOf(COHERENCIA_CIERRE) !== -1) coherenciaCierreHits += 1;
    if (low.indexOf(PAUSA_REAL_CIERRE) !== -1) pausaRealHits += 1;
    const ts = countPhrase(full, TU_SENTIDO);
    if (ts > tuSentidoMax) tuSentidoMax = ts;
  });
});

assert('QA piloto 15 lecturas OK', qaOk === 15, 'count=' + qaOk);
assert('Cola amor universal ausente (0/5 amor)', universalAmorHits === 0, 'hits=' + universalAmorHits + '/5');
assert('«bloque reservado» = 0 en QA piloto', bloqueReservadoHits === 0, 'hits=' + bloqueReservadoHits);
assert('«dirección interna» max 1 por lectura QA', direccionInternaMax <= 1, 'max=' + direccionInternaMax);
assert('P2-2 coherencia cierre repetido = 0', coherenciaCierreHits === 0, 'hits=' + coherenciaCierreHits);
assert('P2-2 pausa real cierre = 0', pausaRealHits === 0, 'hits=' + pausaRealHits);
assert('P2-4 «tu sentido» max 1 por lectura QA', tuSentidoMax <= 1, 'max=' + tuSentidoMax);
assert('split-brain QA piloto = 0', splitBrainQa === 0, 'mismatches=' + splitBrainQa);

console.log('\n' + '═'.repeat(60));
console.log('Corpus P0 hits:', JSON.stringify({ p03: p03, p06: p06, p10: p10, maxRepeat: maxRepeat }));
console.log('QA P1:', JSON.stringify({
  readings: qaOk,
  universalAmor: universalAmorHits,
  bloqueReservado: bloqueReservadoHits,
  direccionInternaMax: direccionInternaMax,
  splitBrain: splitBrainQa
}));
console.log('QA P2:', JSON.stringify({
  coherenciaCierre: coherenciaCierreHits,
  pausaRealCierre: pausaRealHits,
  tuSentidoMax: tuSentidoMax
}));
console.log('Readings:', okReadings);
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
