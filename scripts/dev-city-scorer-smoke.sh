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
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — City Scorer smoke (Node)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$TEMPLATES" "$SCORER" "$ASTRO"; do
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

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE TEMPLATES SCORER ASTRO ASTRONOMY ROOT

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

const CITIES = [
  { name: 'Madrid', country: 'España', lat: 40.4168, lon: -3.7038 },
  { name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { name: 'París', country: 'Francia', lat: 48.8566, lon: 2.3522 },
  { name: 'Londres', country: 'Reino Unido', lat: 51.5074, lon: -0.1278 },
  { name: 'Roma', country: 'Italia', lat: 41.9028, lon: 12.4964 },
  { name: 'Berlín', country: 'Alemania', lat: 52.5200, lon: 13.4050 },
  { name: 'Ámsterdam', country: 'Países Bajos', lat: 52.3676, lon: 4.9041 },
  { name: 'Atenas', country: 'Grecia', lat: 37.9838, lon: 23.7275 },
  { name: 'Estocolmo', country: 'Suecia', lat: 59.3293, lon: 18.0686 },
  { name: 'Estambul', country: 'Turquía', lat: 41.0082, lon: 28.9784 },
  { name: 'Nueva York', country: 'EE. UU.', lat: 40.7128, lon: -74.0060 },
  { name: 'Los Ángeles', country: 'EE. UU.', lat: 34.0522, lon: -118.2437 },
  { name: 'Toronto', country: 'Canadá', lat: 43.6532, lon: -79.3832 },
  { name: 'Ciudad de México', country: 'México', lat: 19.4326, lon: -99.1332 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816 },
  { name: 'Río de Janeiro', country: 'Brasil', lat: -22.9068, lon: -43.1729 },
  { name: 'Lima', country: 'Perú', lat: -12.0464, lon: -77.0428 },
  { name: 'Tokio', country: 'Japón', lat: 35.6762, lon: 139.6503 },
  { name: 'Seúl', country: 'Corea del Sur', lat: 37.5665, lon: 126.9780 },
  { name: 'Bangkok', country: 'Tailandia', lat: 13.7563, lon: 100.5018 },
  { name: 'Singapur', country: 'Singapur', lat: 1.3521, lon: 103.8198 },
  { name: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  { name: 'Ciudad del Cabo', country: 'Sudáfrica', lat: -33.9249, lon: 18.4241 },
  { name: 'El Cairo', country: 'Egipto', lat: 30.0444, lon: 31.2357 },
  { name: 'Nairobi', country: 'Kenia', lat: -1.2921, lon: 36.8219 },
  { name: 'Sídney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Auckland', country: 'Nueva Zelanda', lat: -36.8485, lon: 174.7633 }
];

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
