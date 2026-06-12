#!/usr/bin/env bash
# Kairos Maps — Smoke Premium Knowledge Layer (Fase 3.8e.3)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CATALOG="$ROOT/src/content/cities-catalog.js"
RESOLVER="$ROOT/src/services/editorial-family-resolver.js"
BLOCKS="$ROOT/src/content/premium-blocks.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Premium Knowledge smoke (3.8e.3)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$CATALOG" "$RESOLVER" "$BLOCKS" "$KNOWLEDGE"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export CATALOG RESOLVER BLOCKS KNOWLEDGE
node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.env.CATALOG, 'utf8'), ctx, { filename: process.env.CATALOG });
vm.runInContext(fs.readFileSync(process.env.RESOLVER, 'utf8'), ctx, { filename: process.env.RESOLVER });
vm.runInContext(fs.readFileSync(process.env.BLOCKS, 'utf8'), ctx, { filename: process.env.BLOCKS });
vm.runInContext(fs.readFileSync(process.env.KNOWLEDGE, 'utf8'), ctx, { filename: process.env.KNOWLEDGE });

const Blocks = ctx.window.KairosPremiumBlocks;
const Knowledge = ctx.window.KairosPremiumKnowledge;

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

const catalog = Blocks.catalog();
const STAGES = Blocks.TAXONOMY.stages;
const GOALS = ['amor', 'trabajo', 'descanso'];

assert(
  'Bloques cargados (KairosPremiumBlocks)',
  Blocks && Blocks.BLOCKS.length > 0,
  'total=' + catalog.totalBlocks + ' schema=' + Blocks.SCHEMA_VERSION
);

assert(
  'Knowledge service (KairosPremiumKnowledge)',
  Knowledge && typeof Knowledge.getBlocksForContext === 'function',
  'schema=' + Knowledge.SCHEMA_VERSION
);

let missingSource = 0;
let missingText = 0;
const ids = new Set();
Blocks.BLOCKS.forEach(function (b) {
  if (!b.text || !String(b.text).trim()) missingText += 1;
  if (!b.sources || !b.sources.length || !b.sources[0].doc) missingSource += 1;
  if (ids.has(b.id)) {
    console.log('  ID duplicado:', b.id);
    fail += 1;
  }
  ids.add(b.id);
});
assert('Cada bloque tiene text y sources', missingText === 0 && missingSource === 0,
  'sinText=' + missingText + ' sinSource=' + missingSource);

const docRefs = catalog.byDoc;
assert(
  'Referencias documentales (DOC-17/6/5/7)',
  docRefs['DOC-17'] > 0 && docRefs['DOC-6'] > 0 && docRefs['DOC-5'] > 0 && docRefs['DOC-7'] > 0,
  JSON.stringify(docRefs)
);

var goalFail = 0;
GOALS.forEach(function (g) {
  if ((catalog.byGoal[g] || 0) < 3) {
    console.log('  Cobertura goal baja:', g, catalog.byGoal[g]);
    goalFail += 1;
  }
});
assert('Cobertura por goal (≥3 bloques en catálogo c/u)', goalFail === 0,
  'amor=' + catalog.byGoal.amor + ' trabajo=' + catalog.byGoal.trabajo + ' descanso=' + catalog.byGoal.descanso);

var stageFail = 0;
STAGES.forEach(function (st) {
  if ((catalog.byStage[st] || 0) < 1) {
    console.log('  Stage sin bloques:', st);
    stageFail += 1;
  }
});
assert('Cobertura por stage (todas las jerarquías)', stageFail === 0,
  JSON.stringify(catalog.byStage));

const lisboaCtx = {
  city: { name: 'Lisboa' },
  goal: 'amor',
  relevantInfluences: [
    { line: { planet: 'venus', planetKey: 'VENUS', angle: 'AC' }, distKm: 431, composite: 0.6 },
    { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'AC' }, distKm: 210, composite: 0.55 }
  ],
  bridgeProfile: { themes: ['belonging', 'communication'], tensionMode: false }
};

const a = Knowledge.getBlocksForContext(lisboaCtx);
const b = Knowledge.getBlocksForContext(lisboaCtx);
assert(
  'Selección Lisboa amor ok',
  a.ok && a.blocks.length >= 5,
  'count=' + a.blocks.length + ' ids=' + a.meta.selectedIds.slice(0, 4).join(',') + '…'
);
assert(
  'Determinismo estable',
  JSON.stringify(a.meta.selectedIds) === JSON.stringify(b.meta.selectedIds),
  'seed=' + a.meta.deterministicSeed
);

const doc17Keys = Blocks.DOC17_PILOT_KEYS;
let orphanInterp = 0;
doc17Keys.forEach(function (key) {
  if (!Blocks.INDEX.byInterpKey[key] || !Blocks.INDEX.byInterpKey[key].length) {
    console.log('  Piloto sin bloques:', key);
    orphanInterp += 1;
  }
});
assert('Sin combos piloto huérfanos', orphanInterp === 0, doc17Keys.length + ' combos');

const toronto = Knowledge.getBlocksForContext({
  city: { name: 'Toronto' },
  goal: 'trabajo',
  relevantInfluences: [
    { line: { planet: 'marte', planetKey: 'MARTE', angle: 'AC' }, distKm: 40, composite: 0.65 },
    { line: { planet: 'saturno', planetKey: 'SATURNO', angle: 'IC' }, distKm: 293, composite: 0.52 }
  ],
  bridgeProfile: { themes: ['belonging'], tensionMode: false },
  relocationProfile: { ok: true, angles: ['MC'] }
});
assert('Toronto trabajo + reloc', toronto.ok && toronto.meta.coverage.byDoc['DOC-7'] >= 1,
  'DOC-7=' + (toronto.meta.coverage.byDoc['DOC-7'] || 0));

console.log('\n' + '═'.repeat(60));
console.log('Catálogo:', catalog.totalBlocks, 'bloques · pilot DOC-17:', catalog.pilotCombos, 'combos');
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
