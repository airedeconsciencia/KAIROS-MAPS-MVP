#!/usr/bin/env bash
# Kairos Maps — Smoke regionalización knowledge premium (Fase 3.8f.7c DEV)
# Scope: pads/topups regionalizados del compositor — NO narrative spine / blocks.
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
echo " KAIROS MAPS — Knowledge regionalization smoke (3.8f.7c)"
echo " Scope: compositor regional pads/topups only"
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
const Catalog = ctx.window.KairosCitiesCatalog;

/** Frases exactas del pad universal pre-7c (auditoría). */
const LEGACY_AUDIT_UNIVERSAL = [
  { label: 'un hilo vivo puede bastarte', needle: 'un hilo vivo puede bastarte' },
  { label: 'escúchalo como brújula', needle: 'escúchalo como brújula, no como fallo' },
  { label: 'el mapa abre una puerta', needle: 'el mapa abre una puerta' },
  { label: 'no necesitas prisa: solo presencia', needle: 'no necesitas prisa: solo presencia' },
  {
    label: 'afloja la prisa de concluir',
    needle: 'afloja la prisa de concluir; deja que la experiencia te devuelva su propio ritmo'
  }
];

const METAPHOR_MARKERS = ['brújula', 'hilo', 'puerta'];

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

function instantiateTemplate(template, cityName) {
  return String(template || '').replace(/\{ciudad\}/g, cityName);
}

function buildRegionalTemplates() {
  const templates = [];
  const pads = Premium.REGIONAL_EDITORIAL_PADS || {};
  const tops = Premium.REGIONAL_TOPUP_VARIANTS || {};
  Object.keys(pads).forEach(function (region) {
    pads[region].forEach(function (tpl) {
      templates.push({ region: region, kind: 'pad', raw: tpl });
    });
  });
  Object.keys(tops).forEach(function (region) {
    tops[region].forEach(function (tpl) {
      templates.push({ region: region, kind: 'topup', raw: tpl });
    });
  });
  return templates;
}

const REGIONAL_TEMPLATES = buildRegionalTemplates();

function normalizedRegionalForms(cityName) {
  return REGIONAL_TEMPLATES.map(function (item) {
    return {
      region: item.region,
      kind: item.kind,
      norm: normalizeSentence(instantiateTemplate(item.raw, cityName), cityName)
    };
  });
}

function paragraphMatchesRegional(para, cityName) {
  const norm = normalizeSentence(para, cityName);
  return normalizedRegionalForms(cityName).some(function (item) {
    return item.norm === norm;
  });
}

function identifyRegionalParagraph(para, cityName) {
  const norm = normalizeSentence(para, cityName);
  for (let i = 0; i < REGIONAL_TEMPLATES.length; i++) {
    const item = REGIONAL_TEMPLATES[i];
    if (normalizeSentence(instantiateTemplate(item.raw, cityName), cityName) === norm) {
      return item;
    }
  }
  return null;
}

let fail = 0;
const warnings = [];

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function warn(label, detail) {
  warnings.push({ label: label, detail: detail });
  console.log('─'.repeat(60));
  console.log('WARNING (out-of-scope): ' + label);
  if (detail) console.log(' ', detail);
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
  const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
  const countryId = reading.meta.countryContext
    ? reading.meta.countryContext.countryId
    : c.city.country;
  const resolved = Premium.resolveRegionFamily(c.city.name, countryId);
  return {
    city: c.city.name,
    goal: c.goal,
    regionExpected: c.region,
    regionResolved: resolved,
    reading: reading,
    full: full
  };
});

assert('15 lecturas piloto generadas', readings.length === 15, 'count=' + readings.length);

const regionByCity = {};
readings.forEach(function (r) {
  if (!regionByCity[r.city]) regionByCity[r.city] = r.regionResolved;
});
const expectedRegions = {
  Lisboa: 'IBERIAN',
  Barcelona: 'MEDITERRANEAN',
  Toronto: 'ANGLO',
  Tokio: 'EAST_ASIAN',
  'Ciudad del Cabo': 'AFRICAN_COASTAL'
};
const regionLines = Object.keys(expectedRegions).map(function (city) {
  return city + '→' + (regionByCity[city] || '?');
});
const regionOk = Object.keys(expectedRegions).every(function (city) {
  return regionByCity[city] === expectedRegions[city];
});
assert('resolveRegionFamily piloto 5 ciudades', regionOk, regionLines.join(' · '));

LEGACY_AUDIT_UNIVERSAL.forEach(function (item) {
  const hits = readings.filter(function (r) {
    return r.full.toLowerCase().indexOf(item.needle.toLowerCase()) !== -1;
  }).length;
  assert(
    'Legacy universal ausente: «' + item.label + '»',
    hits === 0,
    'hits=' + hits + '/15'
  );
});

const regionalPhraseCounts = new Map();
REGIONAL_TEMPLATES.forEach(function (item) {
  regionalPhraseCounts.set(item.raw, 0);
});

readings.forEach(function (r) {
  r.full.split(/\n\n+/).forEach(function (para) {
    const match = identifyRegionalParagraph(para, r.city);
    if (!match) return;
    regionalPhraseCounts.set(match.raw, (regionalPhraseCounts.get(match.raw) || 0) + 1);
  });
});

const regionalOver10 = [];
regionalPhraseCounts.forEach(function (count, raw) {
  if (count >= 10) {
    regionalOver10.push(raw.slice(0, 56) + '… (' + count + '/15)');
  }
});
assert(
  '0 frases exactas del compositor regional en ≥10/15 lecturas',
  regionalOver10.length === 0,
  regionalOver10.slice(0, 5).join(' | ') || 'none'
);

let compositorMetaphorFails = [];
readings.forEach(function (r) {
  const paragraphs = r.full.split(/\n\n+/).filter(Boolean);
  const regionalParas = paragraphs.filter(function (p) { return paragraphMatchesRegional(p, r.city); });
  METAPHOR_MARKERS.forEach(function (marker) {
    const hits = regionalParas.filter(function (p) {
      return p.toLowerCase().indexOf(marker) !== -1;
    });
    if (hits.length > 0) {
      compositorMetaphorFails.push(r.city + '/' + r.goal + ' «' + marker + '» en pad/topup regional');
    }
  });
  const seenNorm = new Set();
  regionalParas.forEach(function (p) {
    const norm = normalizeSentence(p, r.city);
    if (seenNorm.has(norm)) {
      compositorMetaphorFails.push(r.city + '/' + r.goal + ' pad/topup regional duplicado');
    }
    seenNorm.add(norm);
  });
});
assert(
  'Sin brújula/hilo/puerta ni duplicados en pads/topups regionales',
  compositorMetaphorFails.length === 0,
  compositorMetaphorFails.join(' · ') || 'none'
);

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

const globalCounts = new Map();
readings.forEach(function (r) {
  r.full.split(/[\n.!?]+/).forEach(function (s) {
    const sent = normalizeSentence(s, r.city);
    if (sent.length < 24) return;
    globalCounts.set(sent, (globalCounts.get(sent) || 0) + 1);
  });
});

const allRegionalNorms = new Set();
REGIONAL_TEMPLATES.forEach(function (item) {
  ['Lisboa', 'Barcelona', 'Toronto', 'Tokio', 'Ciudad del Cabo'].forEach(function (city) {
    allRegionalNorms.add(normalizeSentence(instantiateTemplate(item.raw, city), city));
  });
});

let globalMax = 0;
const outOfScopeRepeats = [];
globalCounts.forEach(function (count, sent) {
  if (count > globalMax) globalMax = count;
  if (count >= 5 && !allRegionalNorms.has(sent)) {
    outOfScopeRepeats.push(count + '/15 ' + sent.slice(0, 72));
  }
});

if (globalMax > 4) {
  warn(
    'maxRepeat frase exacta corpus=' + globalMax + ' (narrative spine / blocks — fuera scope 7c)',
    outOfScopeRepeats.slice(0, 5).join(' | ') || 'none listed'
  );
}

const regionsUsed = new Set(readings.map(function (r) { return r.regionResolved; }));
console.log('\n' + '═'.repeat(60));
console.log('Métricas scope 7c (15 lecturas piloto)');
console.log('  familias activas:', Array.from(regionsUsed).join(', '));
console.log('  frases regionales ≥10/15:', regionalOver10.length);
console.log('  compositor metaphor issues:', compositorMetaphorFails.length);
LEGACY_AUDIT_UNIVERSAL.forEach(function (item) {
  const hits = readings.filter(function (r) {
    return r.full.toLowerCase().indexOf(item.needle.toLowerCase()) !== -1;
  }).length;
  console.log('  legacy «' + item.label + '»: ' + hits + '/15');
});

if (warnings.length) {
  console.log('\n' + '═'.repeat(60));
  console.log('WARNINGS out-of-scope (' + warnings.length + ')');
  warnings.forEach(function (w) {
    console.log('  · ' + w.label);
    if (w.detail) console.log('    ' + w.detail);
  });
}

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS (scope 7c)' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
