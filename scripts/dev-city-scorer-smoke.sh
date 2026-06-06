#!/usr/bin/env bash
# Kairos Maps — Smoke City Scorer (Fase 3.8b)
# Roberto × amor / trabajo / descanso — determinismo y diferenciación.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
TEMPLATES="$ROOT/src/content/city-summary-templates.js"
CATALOG="$ROOT/src/content/cities-catalog.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — City Scorer smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$TEMPLATES" "$CATALOG" "$SCORER" "$ASTRO"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  echo "Descargando astronomy-engine…"
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE TEMPLATES CATALOG SCORER ASTRO ASTRONOMY ROOT

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (typeof ctx.Astronomy === 'undefined' && ctx.window && ctx.window.Astronomy) {
  ctx.Astronomy = ctx.window.Astronomy;
}
if (typeof ctx.Astronomy === 'undefined') {
  throw new Error('Astronomy global no disponible tras cargar astronomy-engine');
}

const files = [
  process.env.ASTRO,
  process.env.NATAL_LITE,
  process.env.COMPOSITION,
  process.env.GOAL_SIGNAL,
  process.env.TEMPLATES,
  process.env.CATALOG,
  process.env.SCORER,
  process.env.BRIDGE
];

files.forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const GS = ctx.window.KairosGoalSignal;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Astro = ctx.window.KairosAstro;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;

if (!GS) throw new Error('KairosGoalSignal no definido');
if (!Bridge) throw new Error('KairosNatalMapBridge no definido');
if (!Scorer) throw new Error('KairosCityScorer no definido');
if (!Astro) throw new Error('KairosAstro no definido');

const Catalog = ctx.window.KairosCitiesCatalog;
if (!Catalog) throw new Error('KairosCitiesCatalog no definido');
const CITIES = Catalog.CITIES;

const PLANETS = Astro.PLANETS.map(function (p) { return p.id; });
const ANGLES = Astro.ANGLES;

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

const robertoComposition = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' });
const bridgeProfile = robertoComposition.meta && robertoComposition.meta.bridgeProfile;

function buildInput(goalId) {
  const goalContext = GS.buildContext({ mainGoal: goalId });
  const bridgeResult = Bridge.buildBridge({
    tags: bridgeProfile.tags,
    themes: bridgeProfile.themes,
    tensionMode: bridgeProfile.tensionMode === true,
    mapLines: lines.map(function (l) {
      return { id: l.id, planet: l.planet, angle: l.angle };
    }),
    goalContext: goalContext
  });

  return {
    lines: lines,
    cities: CITIES,
    goalContext: goalContext,
    bridgeResult: bridgeResult,
    options: {
      proxKm: Scorer.PROX_KM,
      maxSuggestions: 3,
      minScore: 0.28,
      enabledPlanets: new Set(PLANETS),
      enabledAngles: new Set(ANGLES)
    }
  };
}

function topCityIds(result) {
  return (result.suggestions || []).map(function (s) { return s.cityId; });
}

function formatTop(result) {
  return (result.suggestions || []).map(function (s) {
    return s.cityName + ' (' + s.country + ') · score=' + s.score.toFixed(4);
  });
}

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

const amorInput = buildInput('amor');
const trabajoInput = buildInput('trabajo');
const descansoInput = buildInput('descanso');

const amor = Scorer.scoreCities(amorInput);
const trabajo = Scorer.scoreCities(trabajoInput);
const descanso = Scorer.scoreCities(descansoInput);
const amorAgain = Scorer.scoreCities(amorInput);

assert(
  'Roberto amor: 1–3 sugerencias',
  amor.ok && amor.suggestions.length >= 1 && amor.suggestions.length <= 3,
  formatTop(amor).join(' · ')
);

assert(
  'Roberto trabajo: 1–3 sugerencias',
  trabajo.ok && trabajo.suggestions.length >= 1 && trabajo.suggestions.length <= 3,
  formatTop(trabajo).join(' · ')
);

assert(
  'Roberto descanso: 1–3 sugerencias',
  descanso.ok && descanso.suggestions.length >= 1 && descanso.suggestions.length <= 3,
  formatTop(descanso).join(' · ')
);

const amorIds = topCityIds(amor);
const trabajoIds = topCityIds(trabajo);
const descansoIds = topCityIds(descanso);

assert(
  'amor ≠ trabajo (top cityIds)',
  amorIds.join('|') !== trabajoIds.join('|'),
  'amor=' + amorIds.join(',') + ' · trabajo=' + trabajoIds.join(',')
);

assert(
  'trabajo ≠ descanso (top cityIds)',
  trabajoIds.join('|') !== descansoIds.join('|'),
  'trabajo=' + trabajoIds.join(',') + ' · descanso=' + descansoIds.join(',')
);

assert(
  'determinismo estable (amor ×2)',
  JSON.stringify(amorAgain.suggestions.map(function (s) {
    return { cityId: s.cityId, score: s.score };
  })) === JSON.stringify(amor.suggestions.map(function (s) {
    return { cityId: s.cityId, score: s.score };
  })),
  'stable=' + amorIds.join(',')
);

assert(
  'humanSummary presente y sin palabras prohibidas',
  [amor, trabajo, descanso].every(function (result) {
    return result.suggestions.every(function (s) {
      if (!s.humanSummary) return false;
      var lower = s.humanSummary.toLowerCase();
      return ['destino', 'perfecto', 'garantizado', 'alma gemela'].every(function (w) {
        return lower.indexOf(w) === -1;
      });
    });
  }),
  'templates OK'
);

console.log('');
console.log('═'.repeat(60));
console.log('Roberto UTC:', robertoUtcIso);
console.log('Líneas mapa:', lines.length);
console.log('Amor top-3:     ', formatTop(amor).join('\n                '));
console.log('Trabajo top-3:  ', formatTop(trabajo).join('\n                '));
console.log('Descanso top-3: ', formatTop(descanso).join('\n                '));
console.log('═'.repeat(60));
console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
console.log('═'.repeat(60));
console.log('');

process.exit(allPass ? 0 : 1);
NODE
