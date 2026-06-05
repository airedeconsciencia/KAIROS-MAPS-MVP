#!/usr/bin/env bash
# Kairos Maps — Smoke City Premium Composition (Fase 3.8e.6a DEV)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT/.cache/smoke"
ASTRONOMY="$CACHE_DIR/astronomy.browser.min.js"

GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"
NATAL_LITE="$ROOT/src/content/natal-lite.js"
COMPOSITION="$ROOT/src/services/natal-composition-service.js"
BRIDGE="$ROOT/src/services/natal-map-bridge-service.js"
SCORER="$ROOT/src/content/city-scorer.js"
ASTRO="$ROOT/src/engines/astro.js"
INTERP="$ROOT/src/content/interpretations.js"
BLOCKS="$ROOT/src/content/premium-blocks.js"
KNOWLEDGE="$ROOT/src/services/premium-knowledge-service.js"
NARRATIVE="$ROOT/src/services/narrative-intelligence-service.js"
PREMIUM="$ROOT/src/services/city-premium-composition-service.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — City Premium Composition smoke (3.8e.6a)"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$GOAL_SIGNAL" "$NATAL_LITE" "$COMPOSITION" "$BRIDGE" "$SCORER" "$ASTRO" "$INTERP" "$BLOCKS" "$KNOWLEDGE" "$NARRATIVE" "$PREMIUM"; do
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

export GOAL_SIGNAL NATAL_LITE COMPOSITION BRIDGE SCORER ASTRO INTERP BLOCKS KNOWLEDGE NARRATIVE PREMIUM ASTRONOMY ROOT

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

[
  process.env.GOAL_SIGNAL,
  process.env.NATAL_LITE,
  process.env.COMPOSITION,
  process.env.BRIDGE,
  process.env.SCORER,
  process.env.ASTRO,
  process.env.INTERP,
  process.env.BLOCKS,
  process.env.KNOWLEDGE,
  process.env.NARRATIVE,
  process.env.PREMIUM
].forEach(function (path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
});

const Astro = ctx.window.KairosAstro;
const GS = ctx.window.KairosGoalSignal;
const compose = ctx.window.KairosNatalComposition.composeNatalLiteReading;
const Bridge = ctx.window.KairosNatalMapBridge;
const Scorer = ctx.window.KairosCityScorer;
const Premium = ctx.window.KairosCityPremiumComposition;
const Knowledge = ctx.window.KairosPremiumKnowledge;

const CITIES = [
  { name: 'Lisboa', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { name: 'Toronto', country: 'Canadá', lat: 43.6532, lon: -79.3832 },
  { name: 'Ciudad del Cabo', country: 'Sudáfrica', lat: -33.9249, lon: 18.4241 }
];

const GOALS = ['amor', 'trabajo', 'descanso'];

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

function sectionOverlap(a, b) {
  const sa = a.split(/(?<=[.!?…])\s+/).map(function (s) {
    return s.trim().toLowerCase().slice(0, 50);
  }).filter(Boolean);
  const sb = b.split(/(?<=[.!?…])\s+/).map(function (s) {
    return s.trim().toLowerCase().slice(0, 50);
  }).filter(Boolean);
  let hits = 0;
  sa.forEach(function (x) {
    if (sb.indexOf(x) !== -1) hits += 1;
  });
  return hits;
}

let fail = 0;
function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) fail += 1;
}

assert(
  'Compositor existe (schema 3.8e.6a)',
  Premium && Premium.SCHEMA_VERSION.indexOf('3.8e.6a') === 0,
  'schema=' + (Premium && Premium.SCHEMA_VERSION)
);

assert(
  'Narrative Intelligence cargada',
  ctx.window.KairosNarrativeIntelligence &&
    typeof ctx.window.KairosNarrativeIntelligence.deriveNarrativeContext === 'function',
  null
);

assert(
  'Knowledge layer cargada',
  Knowledge && typeof Knowledge.getBlocksForContext === 'function',
  'blocks catalog=' + (ctx.window.KairosPremiumBlocks && ctx.window.KairosPremiumBlocks.BLOCKS.length)
);

const samples = [];
const bodies = [];

GOALS.forEach(function (goalId) {
  const input = buildInput(goalId);
  CITIES.forEach(function (city) {
    const ranked = Scorer.rankInfluences(city, input);
    const scored = Scorer.scoreCity(city, input);
    const reading = Premium.composeCityReading({
      city: city,
      goal: goalId,
      relevantInfluences: ranked.slice(0, 5),
      bridgeProfile: bridgeProfile,
      profile: { firstName: 'Roberto' },
      score: scored ? scored.score : null
    });
    const full = reading.sections.map(function (s) { return s.body; }).join('\n\n');
    bodies.push(full);
    samples.push({ city: city.name, goal: goalId, reading: reading });
  });
});

const lisboaAmor = samples.find(function (s) { return s.city === 'Lisboa' && s.goal === 'amor'; });
const torontoTrabajo = samples.find(function (s) { return s.city === 'Toronto' && s.goal === 'trabajo'; });
const caboDescanso = samples.find(function (s) { return s.city === 'Ciudad del Cabo' && s.goal === 'descanso'; });

assert(
  'Lisboa amor ok:true',
  lisboaAmor && lisboaAmor.reading.ok === true,
  lisboaAmor ? 'words=' + lisboaAmor.reading.meta.wordCount + ' sparse=' + lisboaAmor.reading.meta.sparseInfluences : 'missing'
);

assert(
  'Longitud 500–900 en todas las muestras',
  samples.every(function (s) {
    const w = s.reading.meta.wordCount;
    return w >= Premium.MIN_WORDS && w <= Premium.MAX_WORDS;
  }),
  samples.map(function (s) { return s.city + '/' + s.goal + '=' + s.reading.meta.wordCount; }).join(' · ')
);

assert(
  'Mínimo 6 secciones',
  samples.every(function (s) { return s.reading.sections.length >= 6; }),
  lisboaAmor ? lisboaAmor.reading.sections.map(function (x) { return x.id; }).join(', ') : null
);

assert(
  'sourceBreakdown presente',
  samples.every(function (s) {
    const sb = s.reading.meta.sourceBreakdown;
    return sb && typeof sb.premiumBlocks === 'number' && typeof sb.interpretationFallbacks === 'number';
  }),
  lisboaAmor ? JSON.stringify(lisboaAmor.reading.meta.sourceBreakdown) : null
);

assert(
  'premiumBlocks > interpretationFallbacks (unidades) o wordSharePremium ≥ 70%',
  samples.every(function (s) {
    const sb = s.reading.meta.sourceBreakdown;
    return sb.premiumBlockUnits > sb.interpretationFallbacks ||
      (s.reading.meta.narrativeContext && sb.wordSharePremium >= 70);
  }),
  samples.map(function (s) {
    const sb = s.reading.meta.sourceBreakdown;
    return s.city + '/' + s.goal + ' premium=' + sb.premiumBlockUnits + ' fb=' + sb.interpretationFallbacks +
      ' wordsPremium=' + sb.wordSharePremium + '%';
  }).join(' · ')
);

assert(
  'knowledgeAutoResolved en todas las muestras',
  samples.every(function (s) { return s.reading.meta.knowledgeAutoResolved === true; }),
  'blockCount ejemplo=' + (lisboaAmor && lisboaAmor.reading.meta.knowledgeBlockCount)
);

assert(
  'narrativeContext presente en todas las muestras',
  samples.every(function (s) {
    const nc = s.reading.meta.narrativeContext;
    return nc && nc.dominantTheme && nc.centralTension && nc.mainOpportunity && nc.guidingQuestion;
  }),
  lisboaAmor ? lisboaAmor.reading.meta.narrativeContext.dominantTheme.label : null
);

const METHODOLOGY_MARKERS = Premium.METHODOLOGY_PHRASE_MARKERS || [];

assert(
  'Eje narrativo humanizado en las 6 secciones (lab 3 casos)',
  [lisboaAmor, torontoTrabajo, caboDescanso].every(function (s) {
    if (!s) return false;
    const nc = s.reading.meta.narrativeContext;
    const full = s.reading.sections.map(function (x) { return x.body; }).join(' ').toLowerCase();
    const questionHit = full.indexOf(nc.guidingQuestion.toLowerCase().slice(0, 20)) !== -1;
    const sintesis = s.reading.sections[0] ? s.reading.sections[0].body : '';
    const sintesisHasSummary = sintesis.indexOf(nc.narrativeSummary.slice(0, 28)) !== -1;
    const favorece = s.reading.sections.filter(function (x) { return x.id === 'favorece'; })[0];
    const desafia = s.reading.sections.filter(function (x) { return x.id === 'desafia'; })[0];
    const favHit = favorece && nc.humanOpportunity &&
      favorece.body.toLowerCase().indexOf(nc.humanOpportunity.toLowerCase().slice(0, 24)) !== -1;
    const desHit = desafia && nc.humanConflict &&
      desafia.body.toLowerCase().indexOf(nc.humanConflict.toLowerCase().slice(0, 24)) !== -1;
    const integracion = s.reading.sections.filter(function (x) { return x.id === 'integracion'; })[0];
    const integracionHasQuestion = integracion &&
      integracion.body.toLowerCase().indexOf(nc.guidingQuestion.toLowerCase().slice(0, 18)) !== -1;
    const integracionHasClosing = integracion && nc.humanClosing &&
      integracion.body.toLowerCase().indexOf(nc.humanClosing.toLowerCase().slice(0, 20)) !== -1;
    return questionHit && sintesisHasSummary && favHit && desHit &&
      integracionHasQuestion && integracionHasClosing;
  }),
  null
);

let systemVoiceFail = false;
[lisboaAmor, torontoTrabajo, caboDescanso].forEach(function (s) {
  if (!s) return;
  const full = s.reading.sections.map(function (x) { return x.body; }).join(' ');
  if (/Nota \d/i.test(full)) systemVoiceFail = true;
  if (full.indexOf('«') !== -1) systemVoiceFail = true;
  if (/El tema «/i.test(full)) systemVoiceFail = true;
  if (/La oportunidad «/i.test(full)) systemVoiceFail = true;
  if (/La tensión «/i.test(full)) systemVoiceFail = true;
});
assert('Sin lenguaje de sistema (Nota X, «tema», «oportunidad»)', !systemVoiceFail, null);

function countWord(text, word) {
  const re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
  return (text.match(re) || []).length;
}

let voiceFail = false;
const labCases = [lisboaAmor, torontoTrabajo, caboDescanso];
labCases.forEach(function (s) {
  if (!s) return;
  const full = s.reading.sections.map(function (x) { return x.body; }).join(' ');
  const lower = full.toLowerCase();
  const nc = s.reading.meta.narrativeContext;
  const integracion = s.reading.sections.filter(function (x) { return x.id === 'integracion'; })[0];
  if (countWord(lower, 'conviene') > 4) {
    voiceFail = true;
    console.log('  Exceso conviene en ' + s.city + '/' + s.goal + ': ' + countWord(lower, 'conviene'));
  }
  if (countWord(lower, 'puede') > 14) {
    voiceFail = true;
    console.log('  Exceso puede en ' + s.city + '/' + s.goal + ': ' + countWord(lower, 'puede'));
  }
  if ((lower.match(/puede que/g) || []).length > 4) {
    voiceFail = true;
    console.log('  Exceso "puede que" en ' + s.city + '/' + s.goal);
  }
  if (countWord(lower, 'no hace falta') > 1) {
    voiceFail = true;
    console.log('  Exceso "no hace falta" en ' + s.city + '/' + s.goal);
  }
  if (lower.indexOf('un apunte útil') !== -1) {
    voiceFail = true;
    console.log('  Frase clínica "un apunte útil" en ' + s.city + '/' + s.goal);
  }
  if (lower.indexOf('en la práctica') !== -1) {
    voiceFail = true;
    console.log('  Frase funcional "en la práctica" en ' + s.city + '/' + s.goal);
  }
  if (lower.indexOf('un último apunte para') !== -1) {
    voiceFail = true;
    console.log('  Cierre genérico en ' + s.city + '/' + s.goal);
  }
  if (nc && nc.humanClosing && integracion &&
      integracion.body.toLowerCase().indexOf(nc.humanClosing.toLowerCase().slice(0, 22)) === -1) {
    voiceFail = true;
    console.log('  Falta humanClosing en integración: ' + s.city + '/' + s.goal);
  }
});
assert('Voz premium: sin exceso clínico y cierre humanClosing (lab 3)', !voiceFail, null);

assert(
  'Sin repeticiones metodológicas excesivas (≤1 duplicado por marcador)',
  samples.every(function (s) {
    const full = s.reading.sections.map(function (x) { return x.body; }).join(' ').toLowerCase();
    let bad = false;
    METHODOLOGY_MARKERS.forEach(function (marker) {
      const first = full.indexOf(marker);
      if (first === -1) return;
      const second = full.indexOf(marker, first + marker.length);
      if (second !== -1) bad = true;
    });
    return !bad && (s.reading.meta.methodologyPhraseRepeats == null || s.reading.meta.methodologyPhraseRepeats <= 1);
  }),
  'repeats ejemplo=' + (lisboaAmor && lisboaAmor.reading.meta.methodologyPhraseRepeats)
);

let englishFail = false;
samples.forEach(function (s) {
  if (s.reading.meta.englishThemeHit) {
    englishFail = true;
    console.log('  Theme EN en ' + s.city + '/' + s.goal + ': ' + s.reading.meta.englishThemeHit);
  }
  const lower = s.reading.sections.map(function (x) { return x.body; }).join(' ').toLowerCase();
  (Premium.EN_THEME_KEYS || []).forEach(function (key) {
    if (lower.indexOf(key) !== -1) {
      englishFail = true;
      console.log('  Tag técnico visible: ' + key + ' en ' + s.city + '/' + s.goal);
    }
  });
});
assert('Sin tags/themes técnicos en inglés visibles', !englishFail, null);

const dup = new Map();
let dupFail = false;
bodies.forEach(function (t, idx) {
  const norm = t.replace(/\s+/g, ' ').trim().toLowerCase();
  if (dup.has(norm)) {
    dupFail = true;
    console.log('  Duplicado exacto: muestra ' + (dup.get(norm) + 1) + ' ≈ ' + (idx + 1));
  } else {
    dup.set(norm, idx);
  }
});
assert('Sin duplicados exactos entre muestras', !dupFail, bodies.length + ' lecturas');

let forbiddenFail = false;
samples.forEach(function (s) {
  const lower = s.reading.sections.map(function (x) { return x.body; }).join(' ').toLowerCase();
  Premium.FORBIDDEN.forEach(function (p) {
    if (lower.indexOf(p) !== -1) {
      forbiddenFail = true;
      console.log('  Prohibida en ' + s.city + '/' + s.goal + ': ' + p);
    }
  });
});
assert('Sin frases prohibidas (voice_tone)', !forbiddenFail, null);

let overlapFail = false;
samples.forEach(function (s) {
  const secs = s.reading.sections;
  for (let i = 0; i < secs.length; i++) {
    for (let j = i + 1; j < secs.length; j++) {
      const hits = sectionOverlap(secs[i].body, secs[j].body);
      if (hits >= 2) {
        overlapFail = true;
        console.log('  Repetición literal ' + hits + ' frases: ' + s.city + '/' + s.goal + ' ' + secs[i].id + '↔' + secs[j].id);
      }
    }
  }
});
assert('Sin repetición literal entre secciones (≥2 frases iguales)', !overlapFail, null);

const detInput = buildInput('amor');
const lisboa = CITIES[0];
const ranked = Scorer.rankInfluences(lisboa, detInput);
const a = Premium.composeCityReading({
  city: lisboa,
  goal: 'amor',
  relevantInfluences: ranked.slice(0, 5),
  bridgeProfile: bridgeProfile,
  profile: { firstName: 'Roberto' }
});
const b = Premium.composeCityReading({
  city: lisboa,
  goal: 'amor',
  relevantInfluences: ranked.slice(0, 5),
  bridgeProfile: bridgeProfile,
  profile: { firstName: 'Roberto' }
});
assert(
  'Determinismo estable (Lisboa amor ×2)',
  JSON.stringify(a.sections) === JSON.stringify(b.sections),
  'seed=' + a.meta.deterministicSeed
);

console.log('\n' + '═'.repeat(60));
console.log('Lab casos — palabras y sourceBreakdown');
[lisboaAmor, torontoTrabajo, caboDescanso].forEach(function (s) {
  if (!s) return;
  const sb = s.reading.meta.sourceBreakdown;
  console.log('  ' + s.city + ' / ' + s.goal + ': ' + s.reading.meta.wordCount + ' palabras · ok=' + s.reading.ok);
  console.log('    breakdown: premium=' + sb.premiumBlocks + ' synth=' + sb.synthesisBlocks +
    ' reloc=' + sb.relocationBlocks + ' fb=' + sb.interpretationFallbacks);
  console.log('    wordSharePremium=' + sb.wordSharePremium + '% · blocks=' + s.reading.meta.knowledgeBlockCount);
  const nc = s.reading.meta.narrativeContext;
  if (nc) {
    console.log('    humanTheme:', nc.humanTheme);
    console.log('    humanConflict:', nc.humanConflict.slice(0, 72) + '…');
    console.log('    humanClosing:', nc.humanClosing);
    console.log('    pregunta:', nc.guidingQuestion);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(fail === 0 ? 'SMOKE: ALL PASS' : 'SMOKE: ' + fail + ' FAIL(S)');
process.exit(fail === 0 ? 0 : 1);
NODE
