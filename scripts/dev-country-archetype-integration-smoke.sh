#!/usr/bin/env bash
# Kairos Maps — Smoke Country Archetype × Narrative Intelligence (Fase 3.8f.6 DEV)
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
BLOCKS="$ROOT/src/content/premium-blocks.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Country × Narrative integration (3.8f.6)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$CATALOG" \
  "$ARCHETYPES" "$COUNTRY_SERVICE" "$SCORER" "$ASTRO" "$BLOCKS" "$NARRATIVE"; do
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
  SCORER ASTRO BLOCKS NARRATIVE ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.GOAL_SIGNAL, process.env.NATAL_LITE, process.env.COMPOSITION,
  process.env.BRIDGE, process.env.CATALOG, process.env.ARCHETYPES,
  process.env.COUNTRY_SERVICE, process.env.SCORER, process.env.ASTRO,
  process.env.BLOCKS, process.env.NARRATIVE
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Catalog = ctx.window.KairosCitiesCatalog;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const utc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(utc);
const bp = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function buildInput(goalId) {
  const g = GS.buildContext({ mainGoal: goalId });
  const br = Bridge.buildBridge({
    tags: bp.tags, themes: bp.themes, tensionMode: bp.tensionMode === true,
    mapLines: lines.map(function (l) { return { id: l.id, planet: l.planet, angle: l.angle }; }),
    goalContext: g
  });
  return {
    lines, goalContext: g, bridgeResult: br,
    options: {
      proxKm: Scorer.PROX_KM, maxSuggestions: 3, minScore: 0.28,
      enabledPlanets: new Set(Astro.PLANETS.map(function (p) { return p.id; })),
      enabledAngles: new Set(Astro.ANGLES)
    }
  };
}

function derive(city, goal) {
  const ranked = Scorer.rankInfluences(city, buildInput(goal));
  return Narrative.deriveNarrativeContext({
    city: city,
    goal: goal,
    relevantInfluences: ranked.slice(0, 5),
    bridgeProfile: bp
  });
}

const CURATED_CASES = [
  { label: 'Lisboa · Portugal · amor', city: Catalog.findCityByName('Lisboa'), goal: 'amor' },
  { label: 'Toronto · Canadá · trabajo', city: Catalog.findCityByName('Toronto'), goal: 'trabajo' },
  { label: 'Ciudad del Cabo · Sudáfrica · descanso', city: Catalog.findCityByName('Ciudad del Cabo'), goal: 'descanso' },
  { label: 'Tokio · Japón · trabajo', city: Catalog.findCityByName('Tokio'), goal: 'trabajo' },
  {
    label: 'Barcelona · España · amor',
    city: { name: 'Barcelona', country: 'España', lat: 41.3874, lon: 2.1686 },
    goal: 'amor'
  }
];

function schemaOk(version) {
  if (!version) return false;
  if (version.indexOf('3.8f.6') === 0) return true;
  if (version.indexOf('3.8f.') === 0) {
    var m = version.match(/^3\.8f\.(\d+)/);
    return m && parseInt(m[1], 10) >= 6;
  }
  return false;
}

assert(
  'Narrative schema 3.8f.6+',
  schemaOk(Narrative && Narrative.SCHEMA_VERSION),
  'schema=' + (Narrative && Narrative.SCHEMA_VERSION)
);

const curatedResults = CURATED_CASES.map(function (c) {
  return { label: c.label, result: derive(c.city, c.goal) };
});

assert(
  'countryContext ok en países curados (5 casos)',
  curatedResults.every(function (s) {
    var cc = s.result.narrativeContext.countryContext;
    return cc && cc.ok === true && cc.countryId && cc.countryName && cc.selectedModifiers;
  }),
  curatedResults.map(function (s) {
    var cc = s.result.narrativeContext.countryContext;
    return s.label + ' → ' + (cc ? cc.countryId + ' lines=' + (cc.lines || []).length : 'missing');
  }).join(' · ')
);

assert(
  'Máximo 2 líneas país por lectura',
  curatedResults.every(function (s) {
    return (s.result.narrativeContext.countryContext.lines || []).length <= 2;
  }),
  curatedResults.map(function (s) {
    return s.label + '=' + s.result.narrativeContext.countryContext.lines.length;
  }).join(' · ')
);

assert(
  'Máximo 1 línea país por sección',
  curatedResults.every(function (s) {
    var seen = {};
    return (s.result.narrativeContext.countryContext.lines || []).every(function (line) {
      if (seen[line.section]) return false;
      seen[line.section] = true;
      return true;
    });
  }),
  null
);

assert(
  'No en todas las secciones (≤2 de 3)',
  curatedResults.every(function (s) {
    return (s.result.narrativeContext.countryContext.lines || []).length <= 2;
  }),
  null
);

const kenya = derive(
  { name: 'Nairobi', country: 'Kenia', lat: -1.2921, lon: 36.8219 },
  'amor'
);
assert(
  'Fail-soft país no curado (Kenia)',
  kenya.ok && kenya.narrativeContext.countryContext &&
    kenya.narrativeContext.countryContext.ok === false &&
    kenya.narrativeContext.countryContext.lines.length === 0 &&
    kenya.narrativeContext.humanTheme,
  'reason=' + (kenya.narrativeContext.countryContext.meta && kenya.narrativeContext.countryContext.meta.reason)
);

assert(
  'cityAtmosphere presente en 5 ciudades piloto (incl. Barcelona y Tokio)',
  curatedResults.every(function (s) {
    var nc = s.result.narrativeContext;
    return nc.cityAtmosphere && nc.cityAtmosphere.citySlug &&
      nc.citySuccessTone && nc.cityAtmosphere.zodiacSignature &&
      nc.cityAtmosphere.zodiacSignature.length >= 2;
  }),
  curatedResults.map(function (s) {
    var atm = s.result.narrativeContext.cityAtmosphere;
    return s.label.split(' · ')[0] + '=' + (atm ? atm.citySlug : 'missing');
  }).join(' · ')
);

let dedupFail = false;
curatedResults.forEach(function (s) {
  var nc = s.result.narrativeContext;
  var cc = nc.countryContext;
  if (!cc || !cc.ok || !cc.lines || !nc.cityAtmosphere) return;
  var bundle = Narrative._dev.collectCityAtmosphereBundle(nc.cityAtmosphere);
  cc.lines.forEach(function (line) {
    bundle.forEach(function (cityLine) {
      if (Narrative._dev.linesOverlapCityCountry(cityLine, line.text)) {
        dedupFail = true;
        console.log('  Duplicado ciudad-país en ' + s.label + ': ' + line.text.slice(0, 60));
      }
    });
  });
});
assert('Sin duplicados exactos ciudad-país en frases usadas', !dedupFail, null);

const noCountry = derive({ name: 'Barcelona', lat: 41.3874, lon: 2.1686 }, 'amor');
assert(
  'Fail-soft sin país (Barcelona sin country) + cityAtmosphere presente',
  noCountry.ok && noCountry.narrativeContext.countryContext &&
    noCountry.narrativeContext.countryContext.ok === false &&
    noCountry.narrativeContext.cityAtmosphere &&
    noCountry.narrativeContext.cityAtmosphere.citySlug === 'barcelona',
  'reason=' + (noCountry.narrativeContext.countryContext.meta && noCountry.narrativeContext.countryContext.meta.reason)
);

const ZODIAC = [
  /\bes\s+(piscis|capricornio|sagitario|aries|tauro|géminis|geminis|cáncer|cancer|leo|virgo|libra|escorpio|acuario)\b/i,
  /\b(portugal|españa|francia|japón|japon|italia|brasil|argentina|canadá|canada|sudáfrica|sudáfrica)\s+es\s+/i
];
let zodiacFail = false;
curatedResults.forEach(function (s) {
  var cc = s.result.narrativeContext.countryContext;
  var blob = JSON.stringify(cc.lines || []) + ' ' +
    [s.result.narrativeContext.narrativeSummary, s.result.narrativeContext.humanObserve,
      s.result.narrativeContext.humanClosing].join(' ');
  ZODIAC.forEach(function (re) {
    if (re.test(blob)) {
      zodiacFail = true;
      console.log('  Frase determinista en ' + s.label + ': ' + re);
    }
  });
});
assert('Sin determinismo zodiacal ni "País es …"', !zodiacFail, null);

const tourismTokens = Narrative.GLOBAL_TOURISM_TOKENS || [];
let tourismFail = false;
curatedResults.forEach(function (s) {
  var cc = s.result.narrativeContext.countryContext;
  var blob = (cc.lines || []).map(function (l) { return l.text; }).join(' ').toLowerCase();
  tourismTokens.forEach(function (tok) {
    if (blob.indexOf(tok) !== -1) {
      tourismFail = true;
      console.log('  Token turístico "' + tok + '" en country lines ' + s.label);
    }
  });
});
assert('Sin clichés turísticos en líneas país', !tourismFail, null);

const lisboaA = derive(Catalog.findCityByName('Lisboa'), 'amor');
const lisboaB = derive(Catalog.findCityByName('Lisboa'), 'amor');
assert(
  'Determinismo estable (Lisboa amor ×2)',
  JSON.stringify(lisboaA.narrativeContext.countryContext) ===
    JSON.stringify(lisboaB.narrativeContext.countryContext),
  'lines=' + lisboaA.narrativeContext.countryContext.lines.length
);

console.log('\n' + '═'.repeat(60));
console.log('Country context — casos piloto');
curatedResults.forEach(function (s) {
  var cc = s.result.narrativeContext.countryContext;
  console.log('  ' + s.label);
  console.log('    countryId:', cc.countryId, '· ok:', cc.ok);
  console.log('    warnings:', (cc.warnings || []).join(', ') || '—');
  if (cc.selectedModifiers) {
    console.log('    goalLines:', (cc.selectedModifiers.goalLines || []).join(' | ') || '—');
    console.log('    lineLines:', (cc.selectedModifiers.lineLines || []).join(' | ') || '—');
  }
  (cc.lines || []).forEach(function (line) {
    console.log('    [' + line.section + ']', line.text);
  });
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
