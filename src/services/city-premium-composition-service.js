/**
 * KAIROS MAPS — City Premium Reading composition (Fase 3.8e.4 DEV)
 *
 * Lectura integrada: premium-blocks (primario) + interpretations.js (fallback).
 * Sin IA, sin inventar datos astrológicos.
 *
 * Depende de: KairosPremiumKnowledge, KairosPremiumBlocks, INTERPRETATIONS (opcional)
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.4-dev-0.1';
  var MIN_WORDS = 500;
  var MAX_WORDS = 1500;
  var MAX_INFLUENCES = 5;

  var THEME_ES = {
    belonging: 'pertenencia',
    communication: 'comunicación',
    movement: 'movimiento',
    harmony: 'armonía',
    visibility: 'visibilidad',
    emotional_safety: 'seguridad emocional',
    intimacy: 'intimidad',
    initiative: 'iniciativa',
    reflection: 'reflexión',
    regulation: 'regulación',
    stimulation: 'estimulación',
    protection: 'protección',
    control: 'control',
    expansion: 'expansión',
    precision: 'precisión',
    intensity: 'intensidad',
    permeability: 'permeabilidad',
    reserve: 'reserva'
  };

  var EN_THEME_KEYS = Object.keys(THEME_ES);

  var SECTION_DEFS = [
    { id: 'sintesis', title: 'Síntesis del lugar' },
    { id: 'favorece', title: 'Qué puede favorecer' },
    { id: 'desafia', title: 'Qué puede desafiar' },
    { id: 'aprovecha', title: 'Cómo aprovecharlo' },
    { id: 'observar', title: 'Qué observar si permaneces aquí' },
    { id: 'integracion', title: 'Integración final' }
  ];

  var SLOT_TO_FALLBACK = {
    sintesis: ['cierre'],
    favorece: ['favorece'],
    desafia: ['desafia'],
    aprovecha: ['aprovecha'],
    observar: ['aprovecha', 'cierre'],
    integracion: ['cierre']
  };

  var MAX_FALLBACK_SENTENCES = 4;

  var SYNTHESIS_OPEN = {
    amor: 'Para {nombre}, {ciudad} puede leerse hoy como un escenario de {objetivo}: una lectura integrada, no una lista de piezas sueltas.',
    trabajo: 'Para {nombre}, {ciudad} condensa hoy una lectura de {objetivo}: varias señales del mapa en un solo arco.',
    descanso: 'Para {nombre}, {ciudad} ofrece hoy una lectura de {objetivo}: ritmo del entorno y lo que tu sistema pide, con claridad.'
  };

  var GOAL_LABELS = {
    amor: 'amor y vínculo',
    trabajo: 'trabajo y propósito',
    descanso: 'descanso y bienestar'
  };

  var MIN_LENGTH_BRIDGE =
    'Para cerrar: {ciudad} no es promesa automática ni condena — es campo de prueba donde alineas ritmo, vínculos y objetivo con paciencia, revisando cada mes si el entorno sigue nutriendo lo que viniste a cultivar.';
  var MIN_LENGTH_TAIL =
    'Un último apunte para {ciudad}: sostén el ritmo y deja que la experiencia se confirme con hechos pequeños, sin prisa.';

  var SECTION_FILLERS = {
    sintesis: 'La lectura siguiente ordena esas señales en un solo hilo aplicable a tu objetivo en {ciudad} — sin convertir el mapa en una lista fría.',
    favorece: 'Lo favorable en {ciudad} aparece cuando alineas ritmo cotidiano y vínculos con lo que el mapa ya activó en las líneas dominantes.',
    desafia: 'Los roces del lugar no anulan su potencial: marcan dónde conviene bajar velocidad y aclarar expectativas contigo mismo.',
    aprovecha: 'Aprovechar {ciudad} es iterar: un gesto concreto por semana y observar qué cambia en cuerpo y ánimo.',
    observar: 'Si permaneces en {ciudad}, revisa cada pocas semanas si el ritmo del lugar sigue acompañando lo que buscas — no solo la primera impresión.',
    integracion: 'Esta lectura integra señales del mapa con tu objetivo: úsala como brújula práctica en {ciudad}, no como veredicto cerrado.'
  };

  var INFLUENCE_TRANSITIONS = [
    '',
    'La segunda capa del lugar aparece en cómo ',
    'Junto a esto, también conviene mirar cómo ',
    'No todo empuja en la misma dirección: ',
    'Ahí aparece una tensión interesante, porque '
  ];

  var FORBIDDEN = [
    'universo quiere', 'destino está escrito', 'energías cósmicas',
    'todo ocurre por una razón', 'vibra alto', 'alma gemela',
    'universo conspira', 'manifestar', 'frecuencia vibracional',
    'portal energético', 'llama gemela', 'abundancia infinita',
    'misión cósmica', 'garantizado', 'debes mudarte',
    'el universo', 'dimensión superior', 'despertar espiritual'
  ];

  function wordCount(text) {
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function sectionsWordTotal(sections) {
    return sections.reduce(function (n, s) { return n + wordCount(s.body); }, 0);
  }

  function syncSectionWords(sections) {
    sections.forEach(function (s) { s.words = wordCount(s.body); });
    return sections;
  }

  function hash32(str) {
    var h = 2166136261;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function replaceCity(text, cityName, name) {
    return String(text)
      .replace(/\{ciudad\}/g, cityName)
      .replace(/\{nombre\}/g, name || 'ti');
  }

  function resolveGoalId(goal) {
    if (!goal) return 'amor';
    if (typeof goal === 'string') return goal;
    return goal.id || goal.aspectKey || 'amor';
  }

  function resolveAspect(goalId, goal) {
    if (goal && typeof goal === 'object' && goal.aspectKey) return goal.aspectKey;
    return goalId;
  }

  function resolveName(profile) {
    if (!profile) return 'ti';
    return profile.firstName || profile.displayName || profile.name || 'ti';
  }

  function interpKey(line) {
    if (!line) return '';
    var pk = line.planetKey || String(line.planet || '').toUpperCase();
    if (!pk) return '';
    return pk + '_' + line.angle;
  }

  function normalizeSentence(s, cityName) {
    return s
      .toLowerCase()
      .replace(/\{ciudad\}/g, '')
      .replace(new RegExp(cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeInfluences(relevantInfluences) {
    if (!Array.isArray(relevantInfluences)) return [];
    return relevantInfluences.slice(0, MAX_INFLUENCES).map(function (item) {
      if (item.line) return item;
      return {
        line: item,
        composite: item.composite || 0,
        distKm: item.distKm || item.dist || 0,
        lineId: item.lineId || item.id
      };
    });
  }

  function classifyBlockSource(block) {
    if (block.slot === 'reloc') return 'relocationBlocks';
    if (block.slot === 'synthesis' || block.slot === 'context') return 'synthesisBlocks';
    if (block.interpKey || (block.id && String(block.id).indexOf('doc17_') === 0)) {
      return 'premiumBlocks';
    }
    return 'synthesisBlocks';
  }

  function sectionIdForBlock(block) {
    if (block.stage === 'observar') return 'observar';
    if (block.stage === 'favorece') return block.slot === 'reloc' ? 'sintesis' : 'favorece';
    if (block.stage === 'desafia') return 'desafia';
    if (block.stage === 'aprovechar') return 'aprovecha';
    if (block.slot === 'context') return 'sintesis';
    if (block.slot === 'reloc') {
      return block.stage === 'integrar' ? 'integracion' : 'sintesis';
    }
    if (block.slot === 'synthesis') {
      if (block.stage === 'integrar') {
        var bid = block.id || '';
        if (bid.indexOf('conclusion') !== -1 || bid.indexOf('alineacion') !== -1 ||
            bid.indexOf('combinar') !== -1 || bid.indexOf('integrado') !== -1 ||
            bid.indexOf('intensidad') !== -1) {
          return 'integracion';
        }
        return 'sintesis';
      }
      if (block.stage === 'desafia') return 'desafia';
      if (block.stage === 'observar') return 'observar';
    }
    if (block.interpKey || (block.id && String(block.id).indexOf('doc17_') === 0)) {
      if (block.stage === 'integrar') return 'integracion';
      if (block.stage === 'observar') return 'observar';
      if (block.stage === 'desafia') return 'desafia';
      if (block.stage === 'aprovechar') return 'aprovecha';
      return 'favorece';
    }
    return 'integracion';
  }

  function slotOrder(block) {
    var o = { t1: 1, t2: 2, t3: 3, t4: 4, synthesis: 5, context: 6, reloc: 7 };
    return o[block.slot] || 9;
  }

  function themesOverlap(block, usedThemes) {
    var themes = block.themes || [];
    if (!themes.length) return false;
    return themes.some(function (t) { return usedThemes[t]; });
  }

  function claimText(text, cityName, globalSeen) {
    var norm = normalizeSentence(text, cityName);
    if (!norm || globalSeen[norm]) return false;
    globalSeen[norm] = true;
    return true;
  }

  function markThemes(block, usedThemes) {
    (block.themes || []).forEach(function (t) { usedThemes[t] = true; });
  }

  function resolveKnowledgeBlocks(input, ctx) {
    if (input.knowledgeBlocks && input.knowledgeBlocks.length) {
      return { blocks: input.knowledgeBlocks, autoResolved: false };
    }
    var Knowledge = window.KairosPremiumKnowledge;
    if (!Knowledge || typeof Knowledge.getBlocksForContext !== 'function') {
      return { blocks: [], autoResolved: false };
    }
    var result = Knowledge.getBlocksForContext({
      city: input.city,
      goal: ctx.goalId,
      relevantInfluences: ctx.influences,
      bridgeProfile: input.bridgeProfile,
      relocationProfile: input.relocationProfile || null,
      duration: input.duration || null
    });
    return {
      blocks: result && result.blocks ? result.blocks : [],
      autoResolved: true,
      knowledgeMeta: result ? result.meta : null
    };
  }

  function partitionBlocks(blocks) {
    var bySection = {};
    SECTION_DEFS.forEach(function (def) { bySection[def.id] = []; });
    blocks.forEach(function (block) {
      var sid = sectionIdForBlock(block);
      if (bySection[sid]) bySection[sid].push(block);
    });
    return bySection;
  }

  function buildSectionFromBlocks(sectionId, blockList, ctx, globalSeen, sectionThemes, stats, maxWords, usedBlockIds) {
    var parts = [];
    var words = 0;
    var lastKey = null;
    var rank = 0;

    if (sectionId === 'sintesis' && blockList.length) {
      var hasIntroBlock = blockList.some(function (b) {
        return b.id === 'doc5_metodologia_promesa_natal' || b.slot === 'context';
      });
      if (!hasIntroBlock) {
        var open = SYNTHESIS_OPEN[ctx.goalId] || SYNTHESIS_OPEN.amor;
        var openText = replaceCity(
          open.replace(/\{objetivo\}/g, GOAL_LABELS[ctx.goalId] || ctx.goalId),
          ctx.cityName,
          ctx.name
        );
        if (claimText(openText, ctx.cityName, globalSeen)) {
          parts.push(openText);
          words += wordCount(openText);
        }
      }
    }

    var sorted = blockList.slice().sort(function (a, b) {
      var sa = slotOrder(a);
      var sb = slotOrder(b);
      if (sa !== sb) return sa - sb;
      return hash32(ctx.seed + ':' + sectionId + a.id) - hash32(ctx.seed + ':' + sectionId + b.id);
    });

    sorted.forEach(function (block) {
      var text = replaceCity(block.text, ctx.cityName, ctx.name);
      var norm = normalizeSentence(text, ctx.cityName);
      if (!norm || globalSeen[norm]) return;

      var prefix = '';
      if (block.interpKey && block.interpKey !== lastKey) {
        prefix = INFLUENCE_TRANSITIONS[1 + (hash32(ctx.seed + block.interpKey + rank) % (INFLUENCE_TRANSITIONS.length - 1))];
        rank += 1;
        lastKey = block.interpKey;
      }

      if (prefix && parts.length) {
        var lower = text.charAt(0).toLowerCase() + text.slice(1);
        text = prefix + lower;
      }

      if (!claimText(text, ctx.cityName, globalSeen)) return;

      var kind = classifyBlockSource(block);
      if (!usedBlockIds[block.id]) {
        usedBlockIds[block.id] = true;
        stats[kind] = (stats[kind] || 0) + 1;
        stats._wordsByKind = stats._wordsByKind || {};
        stats._wordsByKind[kind] = (stats._wordsByKind[kind] || 0) + wordCount(text);
      }

      markThemes(block, sectionThemes);
      parts.push(text);
      words += wordCount(text);
    });

    return { text: parts.join('\n\n'), words: words };
  }

  /* ── Fallback: interpretations.js ── */

  function slotFromSections(sections, slot) {
    if (!sections || !sections.length) return '';
    var titleMap = {
      favorece: 'Qué puede favorecer',
      desafia: 'Qué puede desafiar',
      aprovecha: 'Cómo aprovecharlo'
    };
    var want = titleMap[slot];
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (want && sec.title === want) return sec.body || '';
      if (slot === 'cierre' && (!sec.title || sec.title === null)) return sec.body || '';
    }
    if (slot === 'cierre' && sections.length) return sections[sections.length - 1].body || '';
    return '';
  }

  function extractSlots(entry) {
    if (!entry) return { favorece: '', desafia: '', aprovecha: '', cierre: '' };
    if (typeof entry === 'string') {
      return { favorece: entry, desafia: '', aprovecha: '', cierre: '' };
    }
    if (entry.expanded && entry.sections) {
      return {
        favorece: slotFromSections(entry.sections, 'favorece'),
        desafia: slotFromSections(entry.sections, 'desafia'),
        aprovecha: slotFromSections(entry.sections, 'aprovecha'),
        cierre: slotFromSections(entry.sections, 'cierre')
      };
    }
    var Reader = window.KairosCityReading;
    var text = Reader && Reader.readingText ? Reader.readingText(entry) : '';
    return { favorece: text, desafia: '', aprovecha: '', cierre: '' };
  }

  function splitSentences(text) {
    return String(text)
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?…])\s+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 12; });
  }

  function buildFallbackPool(influences, aspect, interpretations, cityName) {
    var pool = [];
    influences.forEach(function (inf, rank) {
      var line = inf.line || inf;
      var key = interpKey(line);
      var combo = interpretations[key];
      if (!combo) return;
      var entry = combo[aspect];
      var slots = extractSlots(entry);
      var weight = 1 / (rank + 1);
      Object.keys(slots).forEach(function (slot) {
        var body = replaceCity(slots[slot], cityName, null);
        if (!body) return;
        splitSentences(body).forEach(function (sent, idx) {
          pool.push({
            text: sent,
            weight: weight - idx * 0.02,
            key: key,
            slot: slot === 'cierre' ? 'cierre' : slot
          });
        });
      });
    });
    return pool;
  }

  function fillFromFallback(sectionId, pool, ctx, globalSeen, stats, maxWords, fallbackBudget) {
    var slots = SLOT_TO_FALLBACK[sectionId] || [];
    if (!slots.length) return { text: '', words: 0 };
    var parts = [];
    var words = 0;
    var used = 0;
    var candidates = pool.filter(function (p) { return slots.indexOf(p.slot) !== -1; })
      .sort(function (a, b) {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return hash32(ctx.seed + 'fb' + a.text) - hash32(ctx.seed + 'fb' + b.text);
      });
    var cap = fallbackBudget != null ? fallbackBudget : MAX_FALLBACK_SENTENCES;
    for (var i = 0; i < candidates.length && words < maxWords && used < cap; i++) {
      var sent = candidates[i].text;
      if (!claimText(sent, ctx.cityName, globalSeen)) continue;
      parts.push(sent);
      words += wordCount(sent);
      used += 1;
      stats.interpretationFallbacks += 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.interpretationFallbacks =
        (stats._wordsByKind.interpretationFallbacks || 0) + wordCount(sent);
    }
    return { text: parts.join(' '), words: words };
  }

  function sectionBudgets(n) {
    if (n <= 2) {
      return { sintesis: 150, favorece: 180, desafia: 160, aprovecha: 150, observar: 110, integracion: 130 };
    }
    return { sintesis: 160, favorece: 200, desafia: 170, aprovecha: 160, observar: 120, integracion: 140 };
  }

  function applySectionFillers(sections, ctx, globalSeen, stats, minTotal) {
    var total = sectionsWordTotal(sections);
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var forceAll = total < minTotal;
    Object.keys(SECTION_FILLERS).forEach(function (sid) {
      if (!forceAll && total >= minTotal) return;
      var sec = copy.find(function (s) { return s.id === sid; });
      var filler = SECTION_FILLERS[sid];
      if (!sec || !filler) return;
      if (!forceAll && sec.words >= 35) return;
      var text = replaceCity(filler, ctx.cityName, ctx.name);
      if (!claimText(text, ctx.cityName, globalSeen)) return;
      stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      total += wordCount(text);
    });
    return copy;
  }

  function injectUnusedKnowledgeBlocks(sections, blocks, ctx, globalSeen, stats, usedBlockIds) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    blocks.slice().sort(function (a, b) {
      return slotOrder(a) - slotOrder(b);
    }).forEach(function (block) {
      if (usedBlockIds[block.id]) return;
      var sid = sectionIdForBlock(block);
      var sec = copy.find(function (s) { return s.id === sid; });
      if (!sec) return;
      var text = replaceCity(block.text, ctx.cityName, ctx.name);
      if (!claimText(text, ctx.cityName, globalSeen)) return;
      var kind = classifyBlockSource(block);
      usedBlockIds[block.id] = true;
      stats[kind] = (stats[kind] || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind[kind] = (stats._wordsByKind[kind] || 0) + wordCount(text);
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
    });
    return copy;
  }

  function fillFromFallbackAny(pool, ctx, globalSeen, stats, maxWords, cap) {
    var parts = [];
    var words = 0;
    var used = 0;
    var candidates = pool.slice().sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return hash32(ctx.seed + 'any' + a.text) - hash32(ctx.seed + 'any' + b.text);
    });
    for (var i = 0; i < candidates.length && words < maxWords && used < cap; i++) {
      var sent = candidates[i].text;
      if (!claimText(sent, ctx.cityName, globalSeen)) continue;
      parts.push(sent);
      words += wordCount(sent);
      used += 1;
      stats.interpretationFallbacks += 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.interpretationFallbacks =
        (stats._wordsByKind.interpretationFallbacks || 0) + wordCount(sent);
    }
    return { text: parts.join(' '), words: words };
  }

  function ensureMinWordCount(sections, pool, ctx, globalSeen, stats, minTotal, fallbackCap) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: wordCount(s.body) };
    });
    var order = ['observar', 'integracion', 'favorece', 'aprovecha', 'desafia', 'sintesis'];
    var guard = 0;
    while (sectionsWordTotal(copy) < minTotal && guard < 40) {
      guard += 1;
      var remaining = fallbackCap - (stats.interpretationFallbacks || 0);
      if (remaining <= 0) break;
      var progressed = false;
      order.forEach(function (sid) {
        if (remaining <= 0) return;
        var sec = copy.find(function (s) { return s.id === sid; });
        if (!sec) return;
        var fb = fillFromFallback(sid, pool, ctx, globalSeen, stats, 160, Math.min(3, remaining));
        if (!fb.text) return;
        remaining = fallbackCap - (stats.interpretationFallbacks || 0);
        sec.body = sec.body ? sec.body + '\n\n' + fb.text : fb.text;
        sec.words = wordCount(sec.body);
        progressed = true;
      });
      if (!progressed) {
        var integracion = copy.find(function (s) { return s.id === 'integracion'; });
        if (!integracion) break;
        var anyFb = fillFromFallbackAny(
          pool,
          ctx,
          globalSeen,
          stats,
          minTotal,
          Math.min(4, fallbackCap - (stats.interpretationFallbacks || 0))
        );
        if (!anyFb.text) break;
        integracion.body = integracion.body ? integracion.body + '\n\n' + anyFb.text : anyFb.text;
        integracion.words = wordCount(integracion.body);
        progressed = true;
      }
      if (sectionsWordTotal(copy) >= minTotal) break;
    }
    return copy;
  }

  function softFillSections(sections, pool, ctx, globalSeen, stats, minTotal, extraCap) {
    var total = sectionsWordTotal(sections);
    if (total >= minTotal) return sections;
    var copy = sections.slice();
    var order = ['observar', 'integracion', 'favorece', 'aprovecha', 'desafia'];
    var remaining = extraCap != null ? extraCap : (MAX_FALLBACK_SENTENCES - (stats.interpretationFallbacks || 0));
    for (var o = 0; o < order.length && total < minTotal && remaining > 0; o++) {
      var sid = order[o];
      var sec = copy.find(function (s) { return s.id === sid; });
      if (!sec) continue;
      var need = Math.min(60, minTotal - total);
      var fb = fillFromFallback(sid, pool, ctx, globalSeen, stats, need, remaining);
      if (!fb.text) continue;
      remaining -= fb.text.split(/(?<=[.!?…])\s+/).filter(Boolean).length;
      sec.body = sec.body ? sec.body + '\n\n' + fb.text : fb.text;
      sec.words = wordCount(sec.body);
      total += fb.words;
    }
    return copy;
  }

  function trimToMaxWords(sections, maxTotal) {
    var total = sections.reduce(function (n, s) { return n + s.words; }, 0);
    if (total <= maxTotal) return sections;
    var excess = total - maxTotal;
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    for (var i = copy.length - 1; i >= 0 && excess > 0; i--) {
      if (copy[i].id === 'sintesis') continue;
      var words = copy[i].body.trim().split(/\s+/);
      while (words.length > 30 && excess > 0) {
        words.pop();
        excess -= 1;
      }
      copy[i].body = words.join(' ');
      copy[i].words = wordCount(copy[i].body);
    }
    return copy;
  }

  function detectPatterns(influences) {
    var angles = {};
    var planets = {};
    influences.forEach(function (inf) {
      var line = inf.line || inf;
      if (!line) return;
      angles[line.angle] = (angles[line.angle] || 0) + 1;
      var p = line.planet || line.planetKey;
      if (p) planets[p] = (planets[p] || 0) + 1;
    });
    function topKey(obj) {
      var best = null;
      var max = 0;
      Object.keys(obj).forEach(function (k) {
        if (obj[k] > max) { max = obj[k]; best = k; }
      });
      return best;
    }
    var topAngle = topKey(angles);
    return {
      dominantAngle: topAngle,
      influenceCount: influences.length
    };
  }

  function finalizeSourceBreakdown(stats, totalWords, usedBlockCount) {
    var breakdown = {
      premiumBlocks: stats.premiumBlocks || 0,
      synthesisBlocks: stats.synthesisBlocks || 0,
      relocationBlocks: stats.relocationBlocks || 0,
      interpretationFallbacks: stats.interpretationFallbacks || 0
    };
    var wk = stats._wordsByKind || {};
    var premiumWords = (wk.premiumBlocks || 0) + (wk.synthesisBlocks || 0) + (wk.relocationBlocks || 0);
    breakdown.premiumBlockUnits = usedBlockCount != null
      ? usedBlockCount
      : breakdown.premiumBlocks + breakdown.synthesisBlocks + breakdown.relocationBlocks;
    breakdown.totalUnits = breakdown.premiumBlockUnits + breakdown.interpretationFallbacks;
    breakdown.wordSharePremium = totalWords > 0
      ? Math.round((premiumWords / totalWords) * 1000) / 10
      : 0;
    breakdown.wordShareFallback = totalWords > 0
      ? Math.round(((wk.interpretationFallbacks || 0) / totalWords) * 1000) / 10
      : 0;
    return breakdown;
  }

  function collectDocuments(blocks) {
    var docs = {};
    blocks.forEach(function (b) {
      (b.sources || []).forEach(function (s) {
        docs[s.doc] = (docs[s.doc] || 0) + 1;
      });
    });
    return docs;
  }

  function containsForbidden(text) {
    var lower = String(text).toLowerCase();
    for (var i = 0; i < FORBIDDEN.length; i++) {
      if (lower.indexOf(FORBIDDEN[i]) !== -1) return FORBIDDEN[i];
    }
    return null;
  }

  function containsEnglishThemeKeys(text) {
    var lower = String(text).toLowerCase();
    for (var i = 0; i < EN_THEME_KEYS.length; i++) {
      if (lower.indexOf(EN_THEME_KEYS[i]) !== -1) return EN_THEME_KEYS[i];
    }
    return null;
  }

  function composeCityReading(input) {
    var empty = {
      ok: false,
      title: '',
      sections: [],
      meta: { schemaVersion: SCHEMA_VERSION, error: 'invalid_input' }
    };

    if (!input || !input.city || !input.city.name) return empty;

    var city = input.city;
    var cityName = city.name;
    var goalId = resolveGoalId(input.goal);
    var aspect = resolveAspect(goalId, input.goal);
    var name = resolveName(input.profile);
    var influences = normalizeInfluences(input.relevantInfluences);

    if (!influences.length) {
      empty.meta.error = 'no_influences';
      return empty;
    }

    var seed = hash32(cityName + '|' + goalId + '|' + aspect + '|' + influences.length);
    var ctx = {
      cityName: cityName,
      name: name,
      goalId: goalId,
      aspect: aspect,
      seed: seed,
      influences: influences,
      patterns: detectPatterns(influences)
    };

    var knowledgeWrap = resolveKnowledgeBlocks(input, ctx);
    var knowledgeBlocks = knowledgeWrap.blocks || [];
    var bySection = partitionBlocks(knowledgeBlocks);
    var budgets = sectionBudgets(influences.length);
    var globalSeen = {};
    var stats = {
      premiumBlocks: 0,
      synthesisBlocks: 0,
      relocationBlocks: 0,
      interpretationFallbacks: 0,
      _wordsByKind: {}
    };
    var usedBlockIds = {};

    var sections = [];
    SECTION_DEFS.forEach(function (def) {
      var sectionThemes = {};
      var built = buildSectionFromBlocks(
        def.id,
        bySection[def.id] || [],
        ctx,
        globalSeen,
        sectionThemes,
        stats,
        budgets[def.id],
        usedBlockIds
      );
      sections.push({
        id: def.id,
        title: def.title,
        body: built.text,
        words: built.words
      });
    });

    sections = injectUnusedKnowledgeBlocks(sections, knowledgeBlocks, ctx, globalSeen, stats, usedBlockIds);
    sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS);

    var interpretations = window.INTERPRETATIONS;
    syncSectionWords(sections);
    var preTrimWords = sectionsWordTotal(sections);
    var premiumUnits = Object.keys(usedBlockIds).length;
    var fallbackCap = MAX_FALLBACK_SENTENCES;
    if (preTrimWords < MIN_WORDS) {
      var needWords = MIN_WORDS - preTrimWords;
      var estSentences = Math.ceil(needWords / 22);
      fallbackCap = Math.min(12, Math.max(estSentences, 2));
    }
    if (premiumUnits > 0) {
      fallbackCap = Math.min(fallbackCap, Math.max(0, premiumUnits - 1));
    }

    if (interpretations) {
      var fbPool = buildFallbackPool(influences, aspect, interpretations, cityName);
      sections = sections.map(function (sec) {
        if (sec.words >= 35 || (stats.interpretationFallbacks || 0) >= fallbackCap) return sec;
        var beforeFb = stats.interpretationFallbacks || 0;
        var fb = fillFromFallback(
          sec.id,
          fbPool,
          ctx,
          globalSeen,
          stats,
          budgets[sec.id] - sec.words,
          fallbackCap - beforeFb
        );
        if (!fb.text) return sec;
        return {
          id: sec.id,
          title: sec.title,
          body: sec.body ? sec.body + '\n\n' + fb.text : fb.text,
          words: wordCount(sec.body ? sec.body + '\n\n' + fb.text : fb.text)
        };
      });
      sections = ensureMinWordCount(sections, fbPool, ctx, globalSeen, stats, MIN_WORDS, fallbackCap);
    }

    sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS);

    if (interpretations) {
      syncSectionWords(sections);
      var postWords = sectionsWordTotal(sections);
      if (postWords < MIN_WORDS) {
        var extraCap = Math.min(8, Math.max(0, premiumUnits - 1) - (stats.interpretationFallbacks || 0));
        if (extraCap > 0) {
          var fbPool2 = buildFallbackPool(influences, aspect, interpretations, cityName);
          sections = ensureMinWordCount(sections, fbPool2, ctx, globalSeen, stats, MIN_WORDS, extraCap);
        }
        sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS);
      }
    }

    syncSectionWords(sections);
    var preTrimTotal = sectionsWordTotal(sections);
    if (preTrimTotal < MIN_WORDS) {
      var integracionSec = sections.find(function (s) { return s.id === 'integracion'; });
      if (integracionSec) {
        [MIN_LENGTH_BRIDGE, MIN_LENGTH_TAIL].forEach(function (tpl) {
          if (sectionsWordTotal(sections) >= MIN_WORDS) return;
          var bridgeText = replaceCity(tpl, cityName, name);
          if (!claimText(bridgeText, cityName, globalSeen)) return;
          integracionSec.body = integracionSec.body
            ? integracionSec.body + '\n\n' + bridgeText
            : bridgeText;
          integracionSec.words = wordCount(integracionSec.body);
          stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
          stats._wordsByKind = stats._wordsByKind || {};
          stats._wordsByKind.synthesisBlocks =
            (stats._wordsByKind.synthesisBlocks || 0) + wordCount(bridgeText);
        });
      }
    }

    sections = trimToMaxWords(sections, MAX_WORDS);

    var fullText = sections.map(function (s) { return s.body; }).join('\n\n');
    var totalWords = wordCount(fullText);
    var forbidden = containsForbidden(fullText);
    var englishTheme = containsEnglishThemeKeys(fullText);
    var sourceBreakdown = finalizeSourceBreakdown(stats, totalWords, Object.keys(usedBlockIds).length);

    var used = influences.map(function (inf, i) {
      var line = inf.line;
      return {
        rank: i + 1,
        lineId: inf.lineId || (line && line.id),
        planet: line && line.planet,
        angle: line && line.angle,
        planetKey: line && line.planetKey,
        distKm: Math.round((inf.distKm || 0) * 10) / 10,
        composite: Math.round((inf.composite || 0) * 10000) / 10000,
        interpKey: interpKey(line)
      };
    });

    return {
      ok: totalWords >= MIN_WORDS && totalWords <= MAX_WORDS && !forbidden && !englishTheme,
      title: cityName + ' para ' + name,
      sections: sections.map(function (s) {
        return { id: s.id, title: s.title, body: s.body };
      }),
      meta: {
        schemaVersion: SCHEMA_VERSION,
        cityName: cityName,
        country: city.country || null,
        goalId: goalId,
        aspect: aspect,
        wordCount: totalWords,
        wordBand: [MIN_WORDS, MAX_WORDS],
        influencesUsed: used,
        patterns: ctx.patterns,
        score: input.score != null ? input.score : null,
        forbiddenHit: forbidden,
        englishThemeHit: englishTheme,
        deterministicSeed: seed,
        sparseInfluences: influences.length <= 2,
        knowledgeAutoResolved: knowledgeWrap.autoResolved,
        knowledgeBlockCount: knowledgeBlocks.length,
        blocksUsed: Object.keys(usedBlockIds),
        documentsUsed: collectDocuments(knowledgeBlocks),
        sourceBreakdown: sourceBreakdown,
        knowledgeMeta: knowledgeWrap.knowledgeMeta || null
      }
    };
  }

  window.KairosCityPremiumComposition = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MIN_WORDS: MIN_WORDS,
    MAX_WORDS: MAX_WORDS,
    THEME_ES: THEME_ES,
    EN_THEME_KEYS: EN_THEME_KEYS,
    FORBIDDEN: FORBIDDEN,
    composeCityReading: composeCityReading,
    _dev: {
      classifyBlockSource: classifyBlockSource,
      sectionIdForBlock: sectionIdForBlock
    }
  };
})();
