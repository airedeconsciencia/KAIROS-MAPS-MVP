#!/usr/bin/env bash
# Kairos Maps — Smoke variación Premium Knowledge (Fase 3.8f.7b DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
CATALOG="$ROOT/src/content/cities-catalog.js"
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
echo " KAIROS MAPS — Premium knowledge variation smoke (3.8f.7b)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" \
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

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG ARCHETYPES COUNTRY_SERVICE \
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
  process.env.BRIDGE, process.env.CATALOG, process.env.ARCHETYPES,
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
const Knowledge = ctx.window.KairosPremiumKnowledge;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Catalog = ctx.window.KairosCitiesCatalog;
const Blocks = ctx.window.KairosPremiumBlocks;

const LEGACY_CERCANA = 'la señal es notable pero no máxima';
const LEGACY_EXACTA = 'muy cerca del trazo la experiencia puede ser intensa';
const GHOST_IDS = [
  'doc6_integrado_sobre_sombra',
  'doc6_objetivo_amor_dc_venus',
  'doc6_objetivo_trabajo_mc',
  'doc6_objetivo_descanso_ic'
];
const INTENSITY_IDS = ['doc6_intensidad_linea_cercana', 'doc6_intensidad_linea_exacta'];

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
  const narrative = Narrative.deriveNarrativeContext({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile
  });
  const knowledge = Knowledge.getBlocksForContext({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    narrativeContext: narrative.narrativeContext
  });
  const scored = Scorer.scoreCity(c.city, input);
  const reading = Premium.composeCityReading({
    city: c.city,
    goal: c.goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' },
    score: scored ? scored.score : null
  });
  const intensityTexts = (knowledge.blocks || []).filter(function (b) {
    return INTENSITY_IDS.indexOf(b.id) !== -1;
  }).map(function (b) { return b.text; });
  return {
    city: c.city.name,
    goal: c.goal,
    knowledge: knowledge,
    reading: reading,
    selectedIds: knowledge.meta.selectedIds || [],
    usedIds: reading.meta.blocksUsed || [],
    intensityTexts: intensityTexts,
    full: reading.sections.map(function (s) { return s.body; }).join('\n\n')
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

assert(
  'pickBlockVariant exportado',
  typeof Knowledge.pickBlockVariant === 'function',
  null
);

const blockById = {};
Blocks.BLOCKS.forEach(function (b) { blockById[b.id] = b; });
assert(
  'variantsByGoal en bloques intensidad',
  INTENSITY_IDS.every(function (id) {
    var b = blockById[id];
    return b && b.variantsByGoal && b.variantsByGoal.amor && b.variantsByGoal.trabajo && b.variantsByGoal.descanso;
  }),
  INTENSITY_IDS.join(', ')
);

const resolvedCercana = readings.map(function (r) {
  return (r.knowledge.blocks || []).filter(function (b) {
    return b.id === 'doc6_intensidad_linea_cercana';
  }).map(function (b) { return b.text; })[0] || '';
}).filter(Boolean);

const legacyCercanaHits = readings.filter(function (r) {
  return r.full.toLowerCase().indexOf(LEGACY_CERCANA) !== -1 ||
    r.intensityTexts.some(function (t) { return t.toLowerCase().indexOf(LEGACY_CERCANA) !== -1; });
}).length;

assert(
  'Texto legacy cercana ausente (baseline 10/15 idéntico)',
  legacyCercanaHits === 0,
  'hits=' + legacyCercanaHits + '/15'
);

const cercanaMaxRepeat = maxRepeat(resolvedCercana);
assert(
  'doc6_intensidad_linea_cercana resuelto: maxRepeat ≤ 4 (baseline 10/15 mismo texto)',
  cercanaMaxRepeat <= 4 || resolvedCercana.length <= 4,
  'maxRepeat=' + cercanaMaxRepeat + ' samples=' + resolvedCercana.length
);

const allIntensityResolved = [];
readings.forEach(function (r) {
  r.intensityTexts.forEach(function (t) { allIntensityResolved.push(t); });
});
const uniqueIntensity = new Set(allIntensityResolved.map(function (t) {
  return t.trim().toLowerCase();
}));
assert(
  'Al menos 3 variantes distintas de intensidad (knowledge resuelto)',
  uniqueIntensity.size >= 3,
  'unique=' + uniqueIntensity.size
);

const intensityMaxRepeat = maxRepeat(allIntensityResolved);
assert(
  'Ningún texto intensidad idéntico en 15/15 lecturas',
  intensityMaxRepeat < 15,
  'maxRepeat=' + intensityMaxRepeat
);

GHOST_IDS.forEach(function (ghostId) {
  const selCount = readings.filter(function (r) {
    return r.selectedIds.indexOf(ghostId) !== -1;
  }).length;
  assert(
    'Ghost selection ' + ghostId + ' ≤ 2/15 (baseline integrado 15/15)',
    selCount <= 2,
    'selected=' + selCount + '/15'
  );
});

assert(
  'doc6_integrado_sobre_sombra no selected 15/15 con narrative',
  readings.filter(function (r) {
    return r.selectedIds.indexOf('doc6_integrado_sobre_sombra') !== -1;
  }).length === 0,
  'selected=' + readings.filter(function (r) {
    return r.selectedIds.indexOf('doc6_integrado_sobre_sombra') !== -1;
  }).length
);

assert(
  'Longitud 500–900 palabras',
  readings.every(function (r) {
    const w = r.reading.meta.wordCount;
    return w >= Premium.MIN_WORDS && w <= Premium.MAX_WORDS;
  }),
  readings.map(function (r) {
    return r.city + '/' + r.goal + '=' + r.reading.meta.wordCount;
  }).join(' · ')
);

console.log('\n' + '═'.repeat(60));
console.log('Métricas knowledge (15 lecturas piloto)');
console.log('  legacy cercana hits:', legacyCercanaHits);
console.log('  cercana maxRepeat (resolved):', cercanaMaxRepeat, '/', resolvedCercana.length);
console.log('  intensidad unique texts:', uniqueIntensity.size);
console.log('  intensidad maxRepeat:', intensityMaxRepeat);
console.log('  ghost integrado selected:',
  readings.filter(function (r) {
    return r.selectedIds.indexOf('doc6_integrado_sobre_sombra') !== -1;
  }).length + '/15');

console.log('\nVariantes cercana por goal:');
['amor', 'trabajo', 'descanso'].forEach(function (g) {
  const sample = readings.find(function (r) {
    return r.goal === g && r.intensityTexts.length &&
      (r.knowledge.blocks || []).some(function (b) { return b.id === 'doc6_intensidad_linea_cercana'; });
  });
  if (sample) {
    const txt = (sample.knowledge.blocks || []).find(function (b) {
      return b.id === 'doc6_intensidad_linea_cercana';
    });
    console.log('  ' + g + ':', txt ? txt.text.slice(0, 72) + '…' : '(none)');
  }
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
