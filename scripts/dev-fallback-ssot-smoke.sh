#!/usr/bin/env bash
# Kairos Maps — Fallback SSOT smoke (F2.2c)
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
echo " KAIROS MAPS — Fallback SSOT smoke (F2.2c)"
echo " Scope: no logical IBERIAN fallbacks · EFR SSOT · LATAM"
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
  SCORER ASTRO INTERP BLOCKS KNOWLEDGE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = process.env.ROOT;
const FILES = [
  process.env.RESOLVER,
  process.env.NARRATIVE,
  process.env.PREMIUM,
  process.env.KNOWLEDGE
];

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

const FORBIDDEN = [
  { re: /\|\|\s*'IBERIAN'/g, label: "|| 'IBERIAN'" },
  { re: /\|\|\s*"IBERIAN"/g, label: '|| "IBERIAN"' },
  { re: /return\s+'IBERIAN'/g, label: "return 'IBERIAN'" },
  { re: /\|\|\s*[A-Za-z0-9_]+\.IBERIAN/g, label: '|| *.IBERIAN pool fallback' }
];

FILES.forEach(function (file) {
  const base = path.basename(file);
  const raw = fs.readFileSync(file, 'utf8');
  const src = stripComments(raw);
  FORBIDDEN.forEach(function (rule) {
    rule.re.lastIndex = 0;
    const hits = src.match(rule.re) || [];
    const allowedInResolver = base === 'editorial-family-resolver.js' &&
      rule.label === "return 'IBERIAN'" &&
      hits.length === 0;
    if (allowedInResolver) return;
    if (base === 'editorial-family-resolver.js' && rule.label === "return 'IBERIAN'") {
      assert(base + ' sin return IBERIAN', hits.length === 0, 'hits=' + hits.length);
      return;
    }
    assert(base + ' sin ' + rule.label, hits.length === 0, hits.length ? hits.slice(0, 3).join(' · ') : '0');
  });
});

const resolverSrc = fs.readFileSync(process.env.RESOLVER, 'utf8');
assert(
  'DEFAULT_FAMILY = GLOBAL_NEUTRAL (F2.2d3)',
  /DEFAULT_FAMILY\s*=\s*'GLOBAL_NEUTRAL'/.test(resolverSrc),
  'DEFAULT_FAMILY'
);
assert(
  'REGISTERED_FAMILIES exportado',
  /REGISTERED_FAMILIES/.test(resolverSrc) && /isRegisteredFamily/.test(resolverSrc),
  'EFR API'
);
assert(
  'resolveRegionalPack exportado',
  /resolveRegionalPack/.test(resolverSrc),
  'EFR API'
);

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
const Catalog = ctx.window.KairosCitiesCatalog;
const Premium = ctx.window.KairosCityPremiumComposition;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Astro = ctx.window.KairosAstro;
const IBERIAN_LEAK = ['plaza', 'sobremesa', 'barrio', 'compañía cotidiana'];

assert('EFR.DEFAULT_FAMILY === GLOBAL_NEUTRAL', EFR.DEFAULT_FAMILY === 'GLOBAL_NEUTRAL', EFR.DEFAULT_FAMILY);
assert('isRegisteredFamily(LATAM)', EFR.isRegisteredFamily('LATAM') === true, 'LATAM');
assert('isRegisteredFamily(WESTERN_EUROPE)', EFR.isRegisteredFamily('WESTERN_EUROPE') === true, 'F2.5c');
assert('isRegisteredFamily(SOUTHEAST_ASIAN)', EFR.isRegisteredFamily('SOUTHEAST_ASIAN') === true, 'F2.6c');
assert('isRegisteredFamily(SOUTH_ASIAN)', EFR.isRegisteredFamily('SOUTH_ASIAN') === true, 'F2.7c');
assert('isRegisteredFamily(WEST_AFRICAN)', EFR.isRegisteredFamily('WEST_AFRICAN') === true, 'F3.3c');
assert('isRegisteredFamily(MENA)', EFR.isRegisteredFamily('MENA') === true, 'F6.0');
assert('isRegisteredFamily(GLOBAL_NEUTRAL)', EFR.isRegisteredFamily('GLOBAL_NEUTRAL') === true, 'F2.2d1');

const Narrative = ctx.window.KairosNarrativeIntelligence;
const Knowledge = ctx.window.KairosPremiumKnowledge;
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
  const resolved = EFR.resolveRegionalPack(entry.map, 'GLOBAL_NEUTRAL');
  if (!resolved.pack || resolved.meta.resolvedFrom === 'missing') {
    packMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  'resolveRegionalPack(GLOBAL_NEUTRAL) never missing (14 maps)',
  packMissing.length === 0,
  packMissing.join(' · ') || '14/14 explicit'
);

const packMenaMissing = [];
PACK_MAPS.forEach(function (entry) {
  const resolved = EFR.resolveRegionalPack(entry.map, 'MENA');
  if (!resolved.pack || resolved.meta.resolvedFrom !== 'explicit') {
    packMenaMissing.push(entry.label + ':' + resolved.meta.resolvedFrom);
  }
});
assert(
  'resolveRegionalPack(MENA) never missing (14 maps)',
  packMenaMissing.length === 0,
  packMenaMissing.join(' · ') || '14/14 explicit MENA'
);

const menaSlugs = Object.keys(EFR.COUNTRY_EDITORIAL_FAMILY).filter(function (slug) {
  return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'MENA';
});
assert(
  '8 countries MENA (F6.2 expansion)',
  menaSlugs.length === 8 &&
    ['united_arab_emirates', 'qatar', 'saudi_arabia', 'israel', 'jordan', 'lebanon', 'kuwait', 'oman'].every(function (slug) {
      return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'MENA';
    }),
  'slugs=' + menaSlugs.join(',')
);

assert(
  'SOUTHEAST_ASIAN countries resolver (F3.6b SEA+)',
  ['thailand', 'singapore', 'vietnam', 'malaysia', 'indonesia', 'philippines'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'SOUTHEAST_ASIAN';
  }),
  JSON.stringify({
    thailand: EFR.COUNTRY_EDITORIAL_FAMILY.thailand,
    singapore: EFR.COUNTRY_EDITORIAL_FAMILY.singapore,
    vietnam: EFR.COUNTRY_EDITORIAL_FAMILY.vietnam,
    malaysia: EFR.COUNTRY_EDITORIAL_FAMILY.malaysia,
    indonesia: EFR.COUNTRY_EDITORIAL_FAMILY.indonesia,
    philippines: EFR.COUNTRY_EDITORIAL_FAMILY.philippines
  })
);

assert(
  'SOUTH_ASIAN countries resolver (F3.7b SA+)',
  ['india', 'pakistan', 'bangladesh', 'sri_lanka', 'nepal'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'SOUTH_ASIAN';
  }),
  JSON.stringify({
    india: EFR.COUNTRY_EDITORIAL_FAMILY.india,
    pakistan: EFR.COUNTRY_EDITORIAL_FAMILY.pakistan,
    bangladesh: EFR.COUNTRY_EDITORIAL_FAMILY.bangladesh,
    sri_lanka: EFR.COUNTRY_EDITORIAL_FAMILY.sri_lanka,
    nepal: EFR.COUNTRY_EDITORIAL_FAMILY.nepal
  })
);

assert(
  'WEST_AFRICAN countries resolver (F3.3c)',
  ['nigeria', 'ghana', 'senegal', 'ivory_coast', 'sierra_leone', 'liberia', 'benin', 'togo', 'guinea', 'gambia'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'WEST_AFRICAN';
  }),
  JSON.stringify({
    nigeria: EFR.COUNTRY_EDITORIAL_FAMILY.nigeria,
    ghana: EFR.COUNTRY_EDITORIAL_FAMILY.ghana,
    senegal: EFR.COUNTRY_EDITORIAL_FAMILY.senegal
  })
);

assert(
  'WESTERN_EUROPE countries resolver (F2.5c)',
  ['france', 'germany', 'netherlands', 'sweden'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'WESTERN_EUROPE';
  }),
  JSON.stringify({
    france: EFR.COUNTRY_EDITORIAL_FAMILY.france,
    germany: EFR.COUNTRY_EDITORIAL_FAMILY.germany,
    netherlands: EFR.COUNTRY_EDITORIAL_FAMILY.netherlands,
    sweden: EFR.COUNTRY_EDITORIAL_FAMILY.sweden
  })
);

assert(
  'LATAM countries resolver (F3.8b LATAM+)',
  ['mexico', 'argentina', 'brazil', 'peru', 'colombia', 'chile', 'uruguay', 'ecuador', 'costa_rica', 'panama'].every(function (slug) {
    return EFR.COUNTRY_EDITORIAL_FAMILY[slug] === 'LATAM';
  }),
  JSON.stringify({
    mexico: EFR.COUNTRY_EDITORIAL_FAMILY.mexico,
    argentina: EFR.COUNTRY_EDITORIAL_FAMILY.argentina,
    costa_rica: EFR.COUNTRY_EDITORIAL_FAMILY.costa_rica,
    panama: EFR.COUNTRY_EDITORIAL_FAMILY.panama
  })
);

assert(
  'País no mapeado → DEFAULT GLOBAL_NEUTRAL (F2.2d3)',
  EFR.resolveEditorialFamily({ cityName: 'Reykjavik', countryId: 'iceland' }) === 'GLOBAL_NEUTRAL',
  EFR.resolveEditorialFamily({ cityName: 'Reykjavik', countryId: 'iceland' })
);
assert(
  'Oslo/norway → WESTERN_EUROPE (F3.13a E1a)',
  EFR.resolveEditorialFamily({ cityName: 'Oslo', countryId: 'norway' }) === 'WESTERN_EUROPE',
  EFR.resolveEditorialFamily({ cityName: 'Oslo', countryId: 'norway' })
);

const packTest = EFR.resolveRegionalPack({ IBERIAN: { amor: ['x'] }, LATAM: { amor: ['y'] } }, 'LATAM');
assert(
  'resolveRegionalPack explicit LATAM',
  packTest.pack && packTest.pack.amor[0] === 'y' && packTest.meta.resolvedFrom === 'explicit',
  JSON.stringify(packTest.meta)
);

const packDefault = EFR.resolveRegionalPack({ GLOBAL_NEUTRAL: { amor: ['x'] } }, null);
assert(
  'resolveRegionalPack null → DEFAULT GLOBAL_NEUTRAL pack',
  packDefault.pack && packDefault.pack.amor[0] === 'x' && packDefault.meta.resolvedFrom === 'explicit',
  JSON.stringify(packDefault.meta)
);

const robertoUtc = vm.runInContext("new Date('1973-05-29T05:30:00.000Z')", ctx);
const lines = Astro.computeAllLines(robertoUtc);
const bridgeProfile = compose({ sun: 'gemini', moon: 'aries', asc: 'cancer' }).meta.bridgeProfile;

function sparseBA() {
  const city = Catalog.findCityByName('Buenos Aires');
  const reading = Premium.composeCityReading({
    city: city,
    goal: 'trabajo',
    relevantInfluences: [],
    bridgeProfile: bridgeProfile,
    profile: { firstName: 'Roberto' }
  });
  const nc = reading.meta.narrativeContext || {};
  const km = reading.meta.knowledgeMeta || {};
  const full = (reading.sections || []).map(function (s) { return s.body; }).join('\n\n');
  const norm = full.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const iberian = IBERIAN_LEAK.filter(function (m) {
    return norm.indexOf(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1;
  });
  return {
    ok: reading.ok,
    regionN: nc.regionFamily || null,
    regionK: km.regionFamily || null,
    englishThemeHit: reading.meta.englishThemeHit || null,
    sparseFallback: !!reading.meta.sparseInfluencesFallback,
    iberian: iberian.length,
    words: reading.meta.wordCount
  };
}

const ba = sparseBA();
assert(
  'BA / trabajo / sparse ok:true',
  ba.ok === true && ba.englishThemeHit === null && ba.sparseFallback === true,
  JSON.stringify(ba)
);
assert(
  'BA / trabajo / sparse regionFamily LATAM',
  ba.regionN === 'LATAM' && ba.regionK === 'LATAM',
  'regionN=' + ba.regionN + ' regionK=' + ba.regionK
);
assert(
  'BA / trabajo / sparse IBERIAN leak 0',
  ba.iberian === 0,
  'hits=' + ba.iberian
);

console.log('');
console.log('════════════════════════════════════════════════════════════');
if (fail) {
  console.log(' FAIL — ' + fail + ' assertion(s)');
  process.exit(1);
}
console.log(' SMOKE: ALL PASS');
NODE
