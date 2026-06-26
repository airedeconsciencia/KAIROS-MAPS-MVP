#!/usr/bin/env bash
# Kairos Maps — MENA editorial family architecture smoke (F6.0)
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
echo " KAIROS MAPS — MENA architecture smoke (F6.0)"
echo " Scope: 12 familias · 14 packs MENA explicit · 8 países MENA · 7 MED"
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

assert(
  'SCHEMA f6.2',
  EFR.SCHEMA_VERSION === '3.8h.2-f6.2-0.1',
  EFR.SCHEMA_VERSION
);
assert(
  '12 familias registradas',
  EFR.REGISTERED_FAMILIES.length === 12,
  'count=' + EFR.REGISTERED_FAMILIES.length + ' families=' + EFR.REGISTERED_FAMILIES.join(',')
);
assert(
  'MENA after WEST_AFRICAN before GLOBAL_NEUTRAL',
  EFR.REGISTERED_FAMILIES.indexOf('MENA') === EFR.REGISTERED_FAMILIES.indexOf('WEST_AFRICAN') + 1 &&
    EFR.REGISTERED_FAMILIES.indexOf('GLOBAL_NEUTRAL') === EFR.REGISTERED_FAMILIES.indexOf('MENA') + 1,
  'order=' + EFR.REGISTERED_FAMILIES.slice(-3).join('>')
);
assert('isRegisteredFamily(MENA)', EFR.isRegisteredFamily('MENA') === true, 'MENA');

const menaCountries = Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).filter(function (slug) {
  return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'MENA';
});
assert(
  '8 countries MENA (F6.2 expansion)',
  menaCountries.length === 8 &&
    ['united_arab_emirates', 'qatar', 'saudi_arabia', 'israel', 'jordan', 'lebanon', 'kuwait', 'oman'].every(function (slug) {
      return menaCountries.indexOf(slug) !== -1;
    }),
  'count=' + menaCountries.length + ' slugs=' + menaCountries.join(',')
);

const medCountries = Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).filter(function (slug) {
  return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'MEDITERRANEAN';
});
assert(
  '7 countries MEDITERRANEAN post-F6.1',
  medCountries.length === 7,
  'count=' + medCountries.length + ' slugs=' + medCountries.join(',')
);

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
  { label: 'REGIONAL_TOPUP_BY_GOAL', map: Premium.REGIONAL_TOPUP_BY_GOAL },
  { label: 'PREMIUM_BLOCK_VARIATIONS_BY_REGION', map: Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION }
];

const packMissing = [];
PACK_MAPS.forEach(function (entry) {
  const resolved = EFR.resolveRegionalPack(entry.map, 'MENA');
  if (!resolved.pack || resolved.meta.resolvedFrom !== 'explicit') {
    packMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  '14/14 packs MENA explicit',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14'
);

const spineKeys = Object.keys(Narrative.NARRATIVE_SPINE_BY_REGION || {});
assert(
  'NARRATIVE_SPINE_BY_REGION has 12 families',
  spineKeys.length === 12 && spineKeys.indexOf('MENA') !== -1,
  'count=' + spineKeys.length
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' SMOKE: ALL PASS');
NODE
