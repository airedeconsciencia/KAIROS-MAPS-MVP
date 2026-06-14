#!/usr/bin/env bash
# Kairos Maps — GLOBAL_NEUTRAL editorial copy smoke (F2.2d2)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

RESOLVER="$ROOT/src/services/editorial-family-resolver.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"

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

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — GLOBAL_NEUTRAL editorial smoke (F2.2d2)"
echo " Scope: anti-leak · anti-overlap · 14 claves · DEFAULT GLOBAL_NEUTRAL"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$RESOLVER" "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export ROOT RESOLVER NARRATIVE PREMIUM KNOWLEDGE ASTRONOMY \
  GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE CATALOG ARCHETYPES COUNTRY_SERVICE \
  SCORER ASTRO INTERP BLOCKS

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

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

const EFR = ctx.window.KairosEditorialFamily;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Premium = ctx.window.KairosCityPremiumComposition;
const Knowledge = ctx.window.KairosPremiumKnowledge;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function norm(s) {
  return String(s || '').trim();
}

function collectStrings(value, out) {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(function (v) { collectStrings(v, out); });
    return;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach(function (k) { collectStrings(value[k], out); });
  }
}

const PACK_MAPS = [
  { label: 'HUMAN_THEME_PATTERNS_BY_REGION', map: Narrative.HUMAN_THEME_PATTERNS_BY_REGION },
  { label: 'SUMMARY_FRAME_POOL_BY_REGION', map: Narrative.SUMMARY_FRAME_POOL_BY_REGION },
  { label: 'OBSERVE_TAIL_BY_REGION', map: Narrative.OBSERVE_TAIL_BY_REGION },
  { label: 'NARRATIVE_SPINE_BY_REGION', map: Narrative.NARRATIVE_SPINE_BY_REGION },
  { label: 'SPINE_FAVORECE_OPEN_BY_REGION', map: Premium.SPINE_FAVORECE_OPEN_BY_REGION },
  { label: 'HUMAN_SCENE_BY_REGION', map: Premium.HUMAN_SCENE_BY_REGION },
  { label: 'OBSERVE_ENTERO_TAIL_BY_REGION', map: Premium.OBSERVE_ENTERO_TAIL_BY_REGION },
  { label: 'VOICE_TRANSITION_BY_REGION', map: Premium.VOICE_TRANSITION_BY_REGION },
  { label: 'GOAL_PADS_BY_REGION', map: Premium.GOAL_PADS_BY_REGION },
  { label: 'REGIONAL_EDITORIAL_MICRO_BY_GOAL', map: Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL },
  { label: 'REGIONAL_EDITORIAL_PADS', map: Premium.REGIONAL_EDITORIAL_PADS },
  { label: 'REGIONAL_TOPUP_VARIANTS', map: Premium.REGIONAL_TOPUP_VARIANTS },
  { label: 'REGIONAL_TOPUP_BY_GOAL', map: Premium.REGIONAL_TOPUP_BY_GOAL, skipOverlap: true },
  { label: 'PREMIUM_BLOCK_VARIATIONS_BY_REGION', map: Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION }
];

const OVERLAP_FAMILIES = ['IBERIAN', 'LATAM', 'ANGLO', 'EAST_ASIAN', 'AFRICAN_COASTAL', 'MEDITERRANEAN'];
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];
const LATAM_LEAK = [
  'cercanía habitada',
  'lo cotidiano cercano',
  'planes demasiado cuidados',
  'verdad, no personaje',
  'pausa habitada',
  'calor humano',
  'calor relacional',
  'palabra tarda'
];

const neutralStrings = [];
collectStrings(PACK_MAPS.reduce(function (acc, entry) {
  acc[entry.label] = entry.map && entry.map.GLOBAL_NEUTRAL;
  return acc;
}, {}), neutralStrings);

const otherStrings = [];
OVERLAP_FAMILIES.forEach(function (family) {
  PACK_MAPS.forEach(function (entry) {
    if (!entry.map || !entry.map[family]) return;
    collectStrings(entry.map[family], otherStrings);
  });
});

const overlapSources = PACK_MAPS.filter(function (e) { return !e.skipOverlap; });
const overlapNeutral = [];
overlapSources.forEach(function (entry) {
  collectStrings(entry.map && entry.map.GLOBAL_NEUTRAL, overlapNeutral);
});

const otherSet = new Set(otherStrings.map(norm).filter(Boolean));
const overlapHits = [];
overlapNeutral.map(norm).filter(Boolean).forEach(function (s) {
  if (otherSet.has(s)) overlapHits.push(s.slice(0, 72));
});

const iberianHits = [];
const latamHits = [];
neutralStrings.forEach(function (s) {
  const n = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  IBERIAN_LEAK.forEach(function (m) {
    const token = m.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (n.indexOf(token) !== -1) iberianHits.push(m + ' → ' + s.slice(0, 60));
  });
  LATAM_LEAK.forEach(function (m) {
    const token = m.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (n.indexOf(token) !== -1) latamHits.push(m + ' → ' + s.slice(0, 60));
  });
});

assert('DEFAULT_FAMILY === GLOBAL_NEUTRAL', EFR.DEFAULT_FAMILY === 'GLOBAL_NEUTRAL', EFR.DEFAULT_FAMILY);
assert('GLOBAL_NEUTRAL registered', EFR.isRegisteredFamily('GLOBAL_NEUTRAL') === true, 'registered');

const packMissing = [];
PACK_MAPS.forEach(function (entry) {
  const resolved = EFR.resolveRegionalPack(entry.map, 'GLOBAL_NEUTRAL');
  if (!resolved.pack || resolved.meta.resolvedFrom === 'missing') {
    packMissing.push(entry.label);
  }
});
assert(
  'resolveRegionalPack(GLOBAL_NEUTRAL) 14/14 explicit',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14'
);

assert(
  'grep anti-leak IBERIAN = 0',
  iberianHits.length === 0,
  iberianHits.slice(0, 3).join(' · ') || '0 hits'
);
assert(
  'grep anti-leak LATAM = 0',
  latamHits.length === 0,
  latamHits.slice(0, 3).join(' · ') || '0 hits'
);
assert(
  'grep anti-overlap GLOBAL_NEUTRAL = 0',
  overlapHits.length === 0,
  overlapHits.slice(0, 5).join(' · ') || '0 exact overlaps'
);

assert(
  'HUMAN_THEME ≥5 por goal',
  ['amor', 'trabajo', 'descanso'].every(function (g) {
    return Narrative.HUMAN_THEME_PATTERNS_BY_REGION.GLOBAL_NEUTRAL[g].length >= 5;
  }),
  JSON.stringify({
    amor: Narrative.HUMAN_THEME_PATTERNS_BY_REGION.GLOBAL_NEUTRAL.amor.length,
    trabajo: Narrative.HUMAN_THEME_PATTERNS_BY_REGION.GLOBAL_NEUTRAL.trabajo.length,
    descanso: Narrative.HUMAN_THEME_PATTERNS_BY_REGION.GLOBAL_NEUTRAL.descanso.length
  })
);

assert(
  'SUMMARY_FRAME ≥3 por goal',
  ['amor', 'trabajo', 'descanso'].every(function (g) {
    return Narrative.SUMMARY_FRAME_POOL_BY_REGION.GLOBAL_NEUTRAL[g].length >= 3;
  }),
  'frames ok'
);

assert(
  'SPINE_FAVORECE ≥6 variantes',
  Premium.SPINE_FAVORECE_OPEN_BY_REGION.GLOBAL_NEUTRAL.length >= 6,
  'count=' + Premium.SPINE_FAVORECE_OPEN_BY_REGION.GLOBAL_NEUTRAL.length
);

assert(
  'TOPUP ≥10 variantes',
  Premium.REGIONAL_TOPUP_VARIANTS.GLOBAL_NEUTRAL.length >= 10,
  'count=' + Premium.REGIONAL_TOPUP_VARIANTS.GLOBAL_NEUTRAL.length
);

console.log('');
console.log('Neutral strings:', neutralStrings.length);
console.log('Overlap families scanned:', OVERLAP_FAMILIES.join(', '));
console.log('');
console.log('════════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' SMOKE: ALL PASS');
NODE
