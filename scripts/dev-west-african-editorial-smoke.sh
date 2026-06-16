#!/usr/bin/env bash
# Kairos Maps — WEST_AFRICAN editorial copy smoke (F3.3b)
# Content-only gate: packs exist · registered F3.3c · no overlap · banlists · rotation · P03/P06/P10
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
RESOLVER="$ROOT/src/services/editorial-family-resolver.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — WEST_AFRICAN editorial smoke (F3.3b)"
echo " Scope: 14 packs · registered · anti-overlap · banlists"
echo " Rotation parity vs SOUTH_ASIAN · P03/P06/P10 · doc17"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$NARRATIVE" "$PREMIUM" "$KNOWLEDGE" "$RESOLVER"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$CACHE_DIR"
if [[ ! -f "$ASTRONOMY" ]]; then
  curl -fsSL "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js" -o "$ASTRONOMY"
fi

export ROOT NARRATIVE PREMIUM KNOWLEDGE RESOLVER ASTRONOMY

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.ASTRONOMY, 'utf8'), ctx, { filename: process.env.ASTRONOMY });
if (ctx.window.Astronomy) ctx.Astronomy = ctx.window.Astronomy;

[
  process.env.RESOLVER,
  process.env.KNOWLEDGE,
  process.env.NARRATIVE,
  process.env.PREMIUM
].forEach(function (p) {
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
});

const EFR = ctx.window.KairosEditorialFamily;
const Narrative = ctx.window.KairosNarrativeIntelligence;
const Premium = ctx.window.KairosCityPremiumComposition;
const Knowledge = ctx.window.KairosPremiumKnowledge;

const FAMILY = 'WEST_AFRICAN';

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

function normFold(s) {
  return norm(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

const OVERLAP_FAMILIES = [
  'IBERIAN', 'MEDITERRANEAN', 'ANGLO', 'EAST_ASIAN', 'AFRICAN_COASTAL',
  'LATAM', 'WESTERN_EUROPE', 'SOUTHEAST_ASIAN', 'SOUTH_ASIAN', 'GLOBAL_NEUTRAL'
];

const AC_BAN = ['horizonte', 'viento', 'amplitud', 'paisaje'];
const LATAM_BAN = ['compañía', 'calor humano', 'lo reservado', 'sobremesa', 'plaza'];
const SA_BAN = ['coherencia interior', 'deber', 'obligación', 'multiplicidad'];
const SEA_BAN = ['suavidad', 'armonía', 'flujo', 'gracia', 'ritual ligero'];
const CLICHE_BAN = [
  'alma africana', 'tribal', 'safari', 'ritmo africano', 'resiliencia', 'pobreza',
  'superación', 'ancestros', 'espíritu de africa', 'nollywood', 'afrobeats'
];
const PLACEHOLDER_BAN = ['PLACEHOLDER', 'FIXME', 'lorem ipsum', '[TBD]', '[[', '{{'];

const P03 = 'puede que descubras una puerta';
const P06 = 'el ritmo del cuerpo vuelve a importar';
const P10 = 'lo que sigue no corrige';

assert(
  'WEST_AFRICAN registered in resolver (F3.3c)',
  EFR.isRegisteredFamily(FAMILY) === true,
  'registered=' + EFR.isRegisteredFamily(FAMILY)
);

const packResolveMissing = [];
PACK_MAPS.forEach(function (entry) {
  const resolved = EFR.resolveRegionalPack(entry.map, FAMILY);
  if (!resolved.pack || resolved.meta.resolvedFrom === 'missing') {
    packResolveMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  'resolveRegionalPack(WEST_AFRICAN) 14/14 explicit',
  packResolveMissing.length === 0,
  packResolveMissing.join(' · ') || '14/14 explicit'
);

const packMissing = [];
const packEmpty = [];
PACK_MAPS.forEach(function (entry) {
  const pack = entry.map && entry.map[FAMILY];
  if (!pack) {
    packMissing.push(entry.label);
    return;
  }
  const strings = [];
  collectStrings(pack, strings);
  if (!strings.length) packEmpty.push(entry.label);
});
assert('14/14 WEST_AFRICAN packs exist', packMissing.length === 0, packMissing.join(' · ') || '14/14');
assert('14/14 packs non-empty', packEmpty.length === 0, packEmpty.join(' · ') || 'ok');

const waStrings = [];
PACK_MAPS.forEach(function (entry) {
  collectStrings(entry.map && entry.map[FAMILY], waStrings);
});

const placeholderHits = [];
waStrings.forEach(function (s) {
  PLACEHOLDER_BAN.forEach(function (m) {
    if (norm(s).toUpperCase().indexOf(m) !== -1) placeholderHits.push(m + ' → ' + s.slice(0, 60));
  });
});
assert('no placeholders', placeholderHits.length === 0, placeholderHits.slice(0, 3).join(' · ') || '0');

const otherStrings = [];
OVERLAP_FAMILIES.forEach(function (family) {
  PACK_MAPS.forEach(function (entry) {
    if (!entry.map || !entry.map[family]) return;
    collectStrings(entry.map[family], otherStrings);
  });
});

const gnStrings = [];
PACK_MAPS.forEach(function (entry) {
  collectStrings(entry.map && entry.map.GLOBAL_NEUTRAL, gnStrings);
});

const overlapSources = PACK_MAPS.filter(function (e) { return !e.skipOverlap; });
const overlapWa = [];
overlapSources.forEach(function (entry) {
  collectStrings(entry.map && entry.map[FAMILY], overlapWa);
});

const otherSet = new Set(otherStrings.map(norm).filter(Boolean));
const gnSet = new Set(gnStrings.map(norm).filter(Boolean));
const overlapHits = [];
overlapWa.map(norm).filter(Boolean).forEach(function (s) {
  if (otherSet.has(s)) overlapHits.push('other: ' + s.slice(0, 72));
  if (gnSet.has(s)) overlapHits.push('GN: ' + s.slice(0, 72));
});

assert('anti-overlap exact = 0', overlapHits.length === 0, overlapHits.slice(0, 5).join(' · ') || '0');

function banScan(bans, label) {
  const hits = [];
  waStrings.forEach(function (s) {
    const n = normFold(s);
    bans.forEach(function (m) {
      const token = normFold(m);
      if (n.indexOf(token) !== -1) hits.push(m + ' → ' + s.slice(0, 60));
    });
  });
  assert('banlist ' + label + ' = 0', hits.length === 0, hits.slice(0, 3).join(' · ') || '0');
}

banScan(AC_BAN, 'AFRICAN_COASTAL');
banScan(LATAM_BAN, 'LATAM');
banScan(SA_BAN, 'SOUTH_ASIAN');
banScan(SEA_BAN, 'SOUTHEAST_ASIAN');
banScan(CLICHE_BAN, 'anti-cliché');

let p03 = 0, p06 = 0, p10 = 0;
waStrings.forEach(function (s) {
  const n = normFold(s);
  if (n.indexOf(P03) !== -1) p03 += 1;
  if (n.indexOf(P06) !== -1) p06 += 1;
  if (n.indexOf(P10) !== -1) p10 += 1;
});
assert('P03 = 0', p03 === 0, 'hits=' + p03);
assert('P06 = 0', p06 === 0, 'hits=' + p06);
assert('P10 = 0', p10 === 0, 'hits=' + p10);

const sa = {
  theme: Narrative.HUMAN_THEME_PATTERNS_BY_REGION.SOUTH_ASIAN,
  frames: Narrative.SUMMARY_FRAME_POOL_BY_REGION.SOUTH_ASIAN,
  observe: Narrative.OBSERVE_TAIL_BY_REGION.SOUTH_ASIAN,
  pads: Premium.GOAL_PADS_BY_REGION.SOUTH_ASIAN,
  favorece: Premium.SPINE_FAVORECE_OPEN_BY_REGION.SOUTH_ASIAN,
  topup: Premium.REGIONAL_TOPUP_VARIANTS.SOUTH_ASIAN,
  scene: Premium.HUMAN_SCENE_BY_REGION.SOUTH_ASIAN,
  entero: Premium.OBSERVE_ENTERO_TAIL_BY_REGION.SOUTH_ASIAN,
  micro: Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL.SOUTH_ASIAN,
  regionalPads: Premium.REGIONAL_EDITORIAL_PADS.SOUTH_ASIAN
};

const wa = {
  theme: Narrative.HUMAN_THEME_PATTERNS_BY_REGION[FAMILY],
  frames: Narrative.SUMMARY_FRAME_POOL_BY_REGION[FAMILY],
  observe: Narrative.OBSERVE_TAIL_BY_REGION[FAMILY],
  pads: Premium.GOAL_PADS_BY_REGION[FAMILY],
  favorece: Premium.SPINE_FAVORECE_OPEN_BY_REGION[FAMILY],
  topup: Premium.REGIONAL_TOPUP_VARIANTS[FAMILY],
  scene: Premium.HUMAN_SCENE_BY_REGION[FAMILY],
  entero: Premium.OBSERVE_ENTERO_TAIL_BY_REGION[FAMILY],
  micro: Premium.REGIONAL_EDITORIAL_MICRO_BY_GOAL[FAMILY],
  regionalPads: Premium.REGIONAL_EDITORIAL_PADS[FAMILY]
};

function countGoal(arr, n) {
  return ['amor', 'trabajo', 'descanso'].every(function (g) { return arr[g].length >= n; });
}

assert('rotation HUMAN_THEME ≥3/goal (SA parity)', countGoal(wa.theme, 3) && countGoal(sa.theme, 3),
  JSON.stringify({ wa: wa.theme.amor.length, sa: sa.theme.amor.length }));
assert('rotation SUMMARY_FRAME ≥2/goal', countGoal(wa.frames, 2) && countGoal(sa.frames, 2), 'ok');
assert('rotation OBSERVE_TAIL ≥2/goal', countGoal(wa.observe, 2) && countGoal(sa.observe, 2), 'ok');
assert('rotation GOAL_PADS ≥8/goal', countGoal(wa.pads, 8) && countGoal(sa.pads, 8), 'ok');
assert('rotation SPINE_FAVORECE ≥6', wa.favorece.length >= 6 && sa.favorece.length >= 6,
  'wa=' + wa.favorece.length + ' sa=' + sa.favorece.length);
assert('rotation TOPUP ≥10', wa.topup.length >= 10 && sa.topup.length >= 10,
  'wa=' + wa.topup.length + ' sa=' + sa.topup.length);
assert('rotation HUMAN_SCENE ≥3/goal', countGoal(wa.scene, 3) && countGoal(sa.scene, 3), 'ok');
assert('rotation OBSERVE_ENTERO ≥2/goal', countGoal(wa.entero, 2) && countGoal(sa.entero, 2), 'ok');
assert('rotation MICRO ≥2/goal', countGoal(wa.micro, 2) && countGoal(sa.micro, 2), 'ok');
assert('rotation REGIONAL_PADS ≥8', wa.regionalPads.length >= 8 && sa.regionalPads.length >= 8,
  'wa=' + wa.regionalPads.length + ' sa=' + sa.regionalPads.length);

const spine = Narrative.NARRATIVE_SPINE_BY_REGION[FAMILY];
assert('NARRATIVE_SPINE structure complete',
  spine && spine.conflictByGoal && spine.opportunityByGoal && spine.summaryFrame &&
  spine.guiding && spine.closingByGoal && spine.actionByGoal &&
  ['amor', 'trabajo', 'descanso'].every(function (g) {
    return spine.closingByGoal[g].length >= 3 && spine.actionByGoal[g].length >= 3;
  }),
  'spine ok');

const kb = Knowledge.PREMIUM_BLOCK_VARIATIONS_BY_REGION[FAMILY];
assert('PREMIUM_BLOCK doc17 + byBlockId',
  kb && kb.doc17 && kb.byBlockId && kb.doc17.t1 && kb.byBlockId.doc6_intensidad_linea_cercana,
  'knowledge ok');

const saStrings = [];
PACK_MAPS.forEach(function (entry) {
  collectStrings(entry.map && entry.map.SOUTH_ASIAN, saStrings);
});

assert('string count ~SA parity (≥180)', waStrings.length >= 180,
  'wa=' + waStrings.length + ' sa=' + saStrings.length);

console.log('');
console.log('WEST_AFRICAN strings:', waStrings.length);
console.log('SOUTH_ASIAN strings:', saStrings.length);
console.log('Overlap families scanned:', OVERLAP_FAMILIES.join(', '));
console.log('');
console.log('════════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' SMOKE: ALL PASS');
NODE
