/**
 * KAIROS MAPS — City Premium Reading composition (Fase 3.8e.9b DEV)
 *
 * Lectura integrada: voz premium cálida + premium-blocks + fallback.
 * Sin IA, sin inventar datos astrológicos.
 *
 * Depende de: KairosNarrativeIntelligence, KairosPremiumKnowledge, KairosPremiumBlocks
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.9b-dev-0.1';
  var MAX_ATMOSPHERE_LINES = 3;
  var MIN_WORDS = 500;
  var MAX_WORDS = 900;
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

  var SPINE_FAVORECE_OPEN = [
    'Algo se abre con suavidad: ',
    'Hay una puerta que merece la pena mirar: ',
    'Se insinúa un gesto posible: '
  ];

  var SPINE_APROVECHA_OPEN = [
    'En {ciudad}, un gesto pequeño puede sostener lo anterior: ',
    'Para habituar la apertura en {ciudad}, prueba esto: ',
    'Un paso concreto en {ciudad}: '
  ];

  var METHODOLOGY_BLOCK_IDS = {
    doc6_jerarquia_natal_linea: true,
    doc5_metodologia_promesa_natal: true,
    doc5_multiples_influencias: true,
    doc6_conclusion_alineacion: true,
    doc6_contradiccion_friccion_evolutiva: true,
    doc5_no_pildora_magica: true,
    doc17_max_dos_profundas: true
  };

  var METHODOLOGY_PHRASE_MARKERS = [
    'no sustituye tu trabajo interior',
    'no es una sola nota',
    'nunca la línea aislada',
    'no se anulan',
    'no clasifica como destino',
    'no sustituye entregables',
    'como mucho dos capas',
    'con foco en',
    'cuando una energía está poco integrada',
    'la línea aislada',
    'la promesa natal',
    'el entorno ofrece escenario',
    'esta lectura ordena'
  ];

  var METHODOLOGY_SUPPRESS_MARKERS = [
    'con foco en',
    'cuando una energía está poco integrada',
    'la línea aislada',
    'la promesa natal',
    'el entorno ofrece escenario',
    'esta lectura ordena',
    'nunca la línea aislada',
    'como mucho dos capas'
  ];

  var PROHIBITED_TRANSITIONS = [
    'ahí aparece una tensión interesante',
    'junto a esto',
    'la segunda capa del lugar',
    'no todo empuja en la misma dirección',
    'también conviene mirar cómo'
  ];

  var VOICE_METAPHOR_MARKERS = [
    'habitación que se ordena',
    'escena cotidiana',
    'como brújula',
    'pequeña expedición'
  ];

  var VOICE_TRANSITION_POOL = {
    matiz: [
      'Detrás de eso hay otra textura, más silenciosa.',
      'Con el tiempo, el matiz se aclara.',
      'Lo que viene después no corrige: completa.',
      'Hay un contraste que no es oposición: es matiz.',
      'Lo que parecía claro se vuelve más fino al repetirse.',
      'Hay otra lectura posible del mismo momento.'
    ],
    contradiccion: [
      'La segunda mirada suele ser más honesta que la primera.',
      'Y ahí aparece algo distinto — sin contradecir lo anterior.',
      'Lo que hoy choca puede ser dos ritmos conviviendo.',
      'La lectura gana profundidad cuando aceptas la contradicción.',
      'Entre lo que favorece y lo que desafía hay un pasillo estrecho.'
    ],
    capa: [
      'Hay una capa que solo aparece cuando bajas el ruido.',
      'Lo que sigue no es anexo: es otra cara del mismo lugar.',
      'Detrás del impulso hay una pregunta más lenta.',
      'Hay un hilo que conecta lo visible con lo no dicho.'
    ],
    advertencia: [
      'Si te quedas un poco más, el tono cambia.',
      'Algo se mueve cuando dejas de exigirte respuesta inmediata.',
      'Detrás de la urgencia hay algo que pide tiempo.',
      'La escena cambia cuando dejas de medirla con prisa.'
    ],
    cierre: [
      'Entre una señal y otra hay espacio para elegir.',
      'La escena cotidiana confirma o matiza lo que intuías.',
      'Hay un giro pequeño que altera el sentido de todo.'
    ],
    cuerpo: [
      'La lectura se afina cuando el cuerpo también opina.',
      'Algo se revela cuando sueltas la necesidad de encajar todo.',
      'No todo lo que se activa apunta al mismo norte.'
    ],
    ciudad: [
      'Hay momentos en que el lugar habla por contraste, no por confirmación.',
      'Lo que activa el lugar no siempre activa lo mismo en ti.',
      'Hay señales que se entienden mejor en la repetición.'
    ]
  };

  var SECTION_TRANSITION_CATS = {
    sintesis: ['capa', 'matiz'],
    favorece: ['matiz', 'ciudad'],
    desafia: ['contradiccion', 'advertencia'],
    aprovecha: ['cuerpo', 'matiz'],
    observar: ['cuerpo', 'cierre'],
    integracion: ['cierre', 'ciudad']
  };

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
    return relevantInfluences.slice(0, MAX_INFLUENCES).map(function (item, rank) {
      if (item.line) {
        return {
          line: item.line,
          composite: item.composite || 0,
          distKm: item.distKm != null ? item.distKm : item.dist,
          lineId: item.lineId || item.id,
          rank: rank
        };
      }
      return {
        line: item,
        composite: item.composite || 0,
        distKm: item.distKm || item.dist || 0,
        lineId: item.lineId || item.id,
        rank: rank
      };
    }).sort(function (a, b) {
      if (b.composite !== a.composite) return b.composite - a.composite;
      return (a.rank || 0) - (b.rank || 0);
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

  function resolveNarrativeContext(input, ctx) {
    if (input.narrativeContext) {
      return { narrativeContext: input.narrativeContext, autoResolved: false };
    }
    var Narrative = window.KairosNarrativeIntelligence;
    if (!Narrative || typeof Narrative.deriveNarrativeContext !== 'function') {
      return { narrativeContext: null, autoResolved: false };
    }
    var result = Narrative.deriveNarrativeContext({
      city: input.city,
      goal: ctx.goalId,
      relevantInfluences: input.relevantInfluences || ctx.influences,
      bridgeProfile: input.bridgeProfile,
      relocationProfile: input.relocationProfile || null
    });
    return {
      narrativeContext: result && result.narrativeContext ? result.narrativeContext : null,
      autoResolved: true,
      narrativeMeta: result ? result.meta : null
    };
  }

  function resolveKnowledgeBlocks(input, ctx, narrativeContext) {
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
      duration: input.duration || null,
      narrativeContext: narrativeContext
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

  function isMethodologyBlock(block) {
    return !!(block && block.id && METHODOLOGY_BLOCK_IDS[block.id]);
  }

  function isMethodologyPhrase(text) {
    var lower = String(text).toLowerCase();
    for (var i = 0; i < METHODOLOGY_PHRASE_MARKERS.length; i++) {
      if (lower.indexOf(METHODOLOGY_PHRASE_MARKERS[i]) !== -1) return true;
    }
    return false;
  }

  function hasMethodologySuppressMarker(text) {
    var lower = String(text || '').toLowerCase();
    for (var i = 0; i < METHODOLOGY_SUPPRESS_MARKERS.length; i++) {
      if (lower.indexOf(METHODOLOGY_SUPPRESS_MARKERS[i]) !== -1) return true;
    }
    return false;
  }

  function initVoiceContext(ctx) {
    ctx._usedTransitions = ctx._usedTransitions || {};
    ctx._usedMetaphors = ctx._usedMetaphors || {};
    ctx._softenedBlocks = ctx._softenedBlocks || 0;
    ctx._methodologyHits = ctx._methodologyHits || 0;
    ctx._clinicalTerms = ctx._clinicalTerms || {
      conviene: 0,
      moderarExpectativas: 0,
      observarSi: 0,
      enLaPractica: 0
    };
  }

  function softenClinicalTerms(text, ctx) {
    if (!text) return '';
    initVoiceContext(ctx);
    var out = text;
    var lower = out.toLowerCase();

    if (lower.indexOf('en la práctica') !== -1) {
      out = out.replace(/\ben la práctica\b/gi, 'con el tiempo');
      ctx._clinicalTerms.enLaPractica += 1;
    }
    if (lower.indexOf('moderar expectativas') !== -1) {
      out = out.replace(/conviene moderar expectativas/gi, 'ayuda aflojar expectativas');
      out = out.replace(/moderar expectativas/gi, 'aflojar expectativas');
      ctx._clinicalTerms.moderarExpectativas += 1;
    }
    if (/\bobservar si\b/i.test(out)) {
      out = out.replace(/\bobservar si\b/gi, 'mirar si');
      ctx._clinicalTerms.observarSi += 1;
    }

    var convMatches = out.match(/\bconviene\b/gi) || [];
    if (convMatches.length) {
      if (ctx._clinicalTerms.conviene >= 1) {
        out = out.replace(/\bconviene\b/gi, 'puede');
      }
      ctx._clinicalTerms.conviene += convMatches.length;
    }

    return out;
  }

  function softenMethodologyText(text, ctx) {
    if (!text) return { text: '', softened: false, suppressed: false, hit: false };

    initVoiceContext(ctx);
    var original = String(text);
    var lower = original.toLowerCase();
    var hit = hasMethodologySuppressMarker(original) || isMethodologyPhrase(original);
    var softened = false;
    var suppressed = false;
    var t = original;

    if (lower.indexOf('esta lectura ordena') !== -1) {
      return { text: '', softened: false, suppressed: true, hit: true };
    }

    if (lower.indexOf('con foco en trabajo') !== -1) {
      t = 'En trabajo, ' + ctx.cityName +
        ' no habla solo de hacer más, sino de entender qué merece ser visto.';
      softened = true;
    } else if (lower.indexOf('con foco en amor') !== -1) {
      t = 'En amor, ' + ctx.cityName +
        ' pide presencia en el encuentro antes que rellenar vacíos desde fuera.';
      softened = true;
    } else if (lower.indexOf('con foco en descanso') !== -1) {
      t = 'En descanso, ' + ctx.cityName +
        ' invita a bajar exigencia sin convertir la pausa en otro rendimiento.';
      softened = true;
    } else if (lower.indexOf('cuando una energía está poco integrada') !== -1) {
      t = 'A veces el lugar devuelve de golpe algo que aún no estaba del todo asumido.';
      softened = true;
    } else if (lower.indexOf('la promesa natal') !== -1) {
      t = 'El mapa natal sigue siendo tu referencia; el lugar solo activa lo que ya traes.';
      softened = true;
    } else if (lower.indexOf('el entorno ofrece escenario') !== -1) {
      t = original.replace(
        /[^.!?…]*el entorno ofrece escenario[^.!?…]*[.!?…]?\s*/gi,
        ''
      ).trim();
      if (!t || t.length < 24) {
        suppressed = true;
        t = '';
      }
      softened = true;
    } else if (lower.indexOf('nunca la línea aislada') !== -1 ||
        lower.indexOf('la línea aislada') !== -1) {
      t = 'Una sola señal nunca cuenta toda la historia del lugar.';
      softened = true;
    } else if (lower.indexOf('como mucho dos capas') !== -1) {
      t = 'Con dos hilos vivos basta para leer el lugar sin abrir demasiados frentes.';
      softened = true;
    } else if (lower.indexOf('no clasifica como destino') !== -1) {
      t = ctx.cityName + ' no se lee como destino bueno o malo: se lee según lo que necesitas aprender ahora.';
      softened = true;
    } else if (lower.indexOf('conviene moderar expectativas') !== -1) {
      t = 'Cerca del trazo la experiencia puede ser intensa; si aún no canalizas esa energía, afloja ritmo y expectativas.';
      softened = true;
    } else if (lower.indexOf('conviene leer ambos planos') !== -1) {
      t = 'El impulso del territorio y la carta relocada cuentan historias distintas — merece la pena leerlas juntas sin mezclarlas.';
      softened = true;
    }

    if (suppressed || !t) {
      if (hit) ctx._methodologyHits += 1;
      return { text: '', softened: softened, suppressed: true, hit: hit };
    }

    t = softenClinicalTerms(t, ctx);
    if (softened) ctx._softenedBlocks += 1;
    if (hit) ctx._methodologyHits += 1;

    return { text: t, softened: softened, suppressed: false, hit: hit };
  }

  function applyTextPolish(text, ctx, narrativeContext) {
    if (!text) return '';
    var polished = text;
    if (narrativeContext) {
      var soft = softenMethodologyText(replaceCity(text, ctx.cityName, ctx.name), ctx);
      if (soft.suppressed) return '';
      polished = soft.text;
    } else {
      polished = softenClinicalTerms(replaceCity(text, ctx.cityName, ctx.name), ctx);
    }
    return polished;
  }

  function metaphorFingerprint(text) {
    var lower = String(text || '').toLowerCase();
    for (var i = 0; i < VOICE_METAPHOR_MARKERS.length; i++) {
      if (lower.indexOf(VOICE_METAPHOR_MARKERS[i]) !== -1) {
        return VOICE_METAPHOR_MARKERS[i];
      }
    }
    return '';
  }

  function claimMetaphor(text, ctx) {
    var fp = metaphorFingerprint(text);
    if (!fp) return true;
    initVoiceContext(ctx);
    if (ctx._usedMetaphors[fp]) return false;
    ctx._usedMetaphors[fp] = true;
    return true;
  }

  function pickVoiceTransition(ctx, sectionId, blockKey, rank) {
    initVoiceContext(ctx);
    var cats = SECTION_TRANSITION_CATS[sectionId] || ['matiz', 'contradiccion'];
    var attempts = 0;
    var maxAttempts = 24;

    while (attempts < maxAttempts) {
      var cat = cats[(rank + attempts) % cats.length];
      var pool = VOICE_TRANSITION_POOL[cat] || VOICE_TRANSITION_POOL.matiz;
      var idx = hash32(ctx.seed + ':' + sectionId + ':' + blockKey + ':' + attempts) % pool.length;
      var line = pool[idx];
      var banned = false;
      var lowerLine = line.toLowerCase();
      for (var p = 0; p < PROHIBITED_TRANSITIONS.length; p++) {
        if (lowerLine.indexOf(PROHIBITED_TRANSITIONS[p]) !== -1) banned = true;
      }
      if (!banned && !ctx._usedTransitions[line]) {
        ctx._usedTransitions[line] = true;
        return line;
      }
      attempts += 1;
    }
    return '';
  }

  function countMethodologyHitsInText(fullText) {
    var lower = String(fullText || '').toLowerCase();
    var hits = 0;
    METHODOLOGY_SUPPRESS_MARKERS.forEach(function (marker) {
      if (lower.indexOf(marker) !== -1) hits += 1;
    });
    return hits;
  }

  function collectRepeatedTransitions(fullText, ctx) {
    var repeated = [];
    initVoiceContext(ctx);
    Object.keys(ctx._usedTransitions).forEach(function (line) {
      var fp = line.toLowerCase().slice(0, 28);
      var first = fullText.toLowerCase().indexOf(fp);
      if (first === -1) return;
      var second = fullText.toLowerCase().indexOf(fp, first + fp.length);
      if (second !== -1) repeated.push(line);
    });
    return repeated;
  }

  function spineField(nc, key, fallbackKey) {
    if (nc[key]) return nc[key];
    return nc[fallbackKey] || '';
  }

  function atmosphereFingerprint(line) {
    var s = String(line || '').toLowerCase().trim();
    var m = s.match(/^en [^,]+,\s*(.+)/);
    if (m) s = m[1];
    return s.slice(0, 36);
  }

  function fragmentAlreadyIn(text, fragment) {
    if (!text || !fragment) return false;
    var fp = atmosphereFingerprint(fragment);
    return fp.length >= 12 && text.toLowerCase().indexOf(fp) !== -1;
  }

  function countAtmosphereHits(text, selectedLines) {
    if (!text || !selectedLines || !selectedLines.length) return 0;
    var hits = 0;
    selectedLines.forEach(function (line) {
      if (fragmentAlreadyIn(text, line)) hits += 1;
    });
    return hits;
  }

  function countEmbeddedAtmosphere(nc) {
    if (!nc || !nc.cityAtmosphere || !nc.cityAtmosphere.selectedLines) return 0;
    var spine = [
      nc.narrativeSummary,
      nc.humanTheme,
      nc.humanObserve,
      nc.humanConflict,
      nc.humanOpportunity,
      nc.humanClosing
    ].join('\n');
    return countAtmosphereHits(spine, nc.cityAtmosphere.selectedLines);
  }

  function takeAtmosphereLine(ctx, line) {
    if (!line) return '';
    ctx._atmosphereLinesUsed = ctx._atmosphereLinesUsed || 0;
    if (ctx._atmosphereLinesUsed >= MAX_ATMOSPHERE_LINES) return '';
    ctx._atmosphereLinesUsed += 1;
    return line;
  }

  function mergeAtmosphereLead(ctx, base, extra) {
    if (!extra || fragmentAlreadyIn(base, extra)) return base || '';
    var line = takeAtmosphereLine(ctx, extra);
    if (!line) return base || '';
    return base ? base + '\n\n' + line : line;
  }

  function buildSpineLead(sectionId, narrativeContext, ctx) {
    if (!narrativeContext) return '';
    var nc = narrativeContext;
    var city = ctx.cityName;
    var seed = ctx.seed || '';
    switch (sectionId) {
      case 'sintesis': {
        var syn = nc.narrativeSummary || '';
        if (nc.cityEmotionalTexture) {
          syn = mergeAtmosphereLead(ctx, syn, nc.cityEmotionalTexture);
        }
        return syn;
      }
      case 'favorece':
        return SPINE_FAVORECE_OPEN[hash32(seed + ':fav') % SPINE_FAVORECE_OPEN.length] +
          spineField(nc, 'humanOpportunity', 'mainOpportunity.label');
      case 'desafia':
        return spineField(nc, 'humanConflict', 'centralTension.label');
      case 'aprovecha':
        return replaceCity(
          SPINE_APROVECHA_OPEN[hash32(seed + ':apr') % SPINE_APROVECHA_OPEN.length],
          city,
          ctx.name
        ) + spineField(nc, 'humanOpportunityAction', 'humanOpportunity');
      case 'observar': {
        var obs = nc.humanObserve ||
          ('Si permaneces en ' + city + ', mira si lo vivido aquí sigue teniendo latido en el día a día.');
        if (nc.cityImages && !fragmentAlreadyIn(obs, nc.cityImages)) {
          obs = mergeAtmosphereLead(ctx, obs, nc.cityImages);
        }
        return obs;
      }
      case 'integracion': {
        var lines = [];
        if (nc.guidingQuestion) lines.push(nc.guidingQuestion);
        if (nc.humanClosing) lines.push(nc.humanClosing);
        return lines.join('\n\n');
      }
      default:
        return '';
    }
  }

  function appendSpineLead(parts, sectionId, narrativeContext, ctx, globalSeen, stats) {
    var lead = buildSpineLead(sectionId, narrativeContext, ctx);
    if (!lead) return 0;
    var text = replaceCity(lead, ctx.cityName, ctx.name);
    if (!claimText(text, ctx.cityName, globalSeen)) return 0;
    parts.push(text);
    stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
    stats._wordsByKind = stats._wordsByKind || {};
    stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
    return wordCount(text);
  }

  function buildSectionFromBlocks(sectionId, blockList, ctx, globalSeen, sectionThemes, stats, maxWords, usedBlockIds, narrativeContext, methodologyBudget) {
    var parts = [];
    var words = 0;
    var lastKey = null;
    var rank = 0;
    var methLeft = methodologyBudget != null ? methodologyBudget : 0;

    if (narrativeContext) {
      words += appendSpineLead(parts, sectionId, narrativeContext, ctx, globalSeen, stats);
    } else if (sectionId === 'sintesis' && blockList.length) {
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

    var sorted = blockList.slice().sort(function (a, b) {
      var sa = slotOrder(a);
      var sb = slotOrder(b);
      if (sa !== sb) return sa - sb;
      return hash32(ctx.seed + ':' + sectionId + a.id) - hash32(ctx.seed + ':' + sectionId + b.id);
    });

    sorted.forEach(function (block) {
      if (narrativeContext && isMethodologyBlock(block)) {
        if (methLeft <= 0) return;
        methLeft -= 1;
      }
      var text = applyTextPolish(block.text, ctx, narrativeContext);
      if (!text) return;
      var norm = normalizeSentence(text, ctx.cityName);
      if (!norm || globalSeen[norm]) return;
      if (!claimMetaphor(text, ctx)) return;

      var prefix = '';
      if (block.interpKey && block.interpKey !== lastKey && parts.length) {
        prefix = pickVoiceTransition(ctx, sectionId, block.interpKey, rank);
        rank += 1;
        lastKey = block.interpKey;
      }

      if (prefix) {
        text = prefix + ' ' + text;
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

  var HUMAN_EDITORIAL_PADS = [
    'En {ciudad}, lo esencial suele aparecer en gestos pequeños — no en el gran momento.',
    '{ciudad} enseña despacio, como una habitación que se ordena poco a poco.',
    'El mapa abre una puerta; caminarla es otra historia — y también la más honesta.',
    'Algo hermoso vive en la repetición tranquila, no solo en la epifanía.',
    'Tal vez el lugar no pida prisa: pida presencia.',
    'Cuando algo incomoda, escúchalo como brújula, no como fallo.',
    'Lo contradictorio de hoy puede volverse legible si aflojas la urgencia de resolver.',
    'Anota una escena concreta — un encuentro, un cansancio — y léela con calma más tarde.',
    'Un gesto pequeño basta para seguir habitando {ciudad} con verdad.',
    'Dale tiempo al lugar antes de juzgarlo por un solo día perfecto o un roce incómodo.',
    'La experiencia cotidiana confirma o matiza la lectura — más que cualquier idea fija.',
    'Observa si lo que sientes hoy sigue vivo dentro de un mes — sin presión.'
  ];

  function narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, minTotal) {
    if (!narrativeContext) return sections;
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var targets = ['favorece', 'aprovecha', 'desafia', 'observar', 'integracion'];
    var idx = 0;
    var guard = 0;
    while (sectionsWordTotal(copy) < minTotal && guard < 36) {
      var tpl = HUMAN_EDITORIAL_PADS[(idx + hash32(ctx.seed + ':pad:' + guard)) % HUMAN_EDITORIAL_PADS.length];
      idx += 1;
      guard += 1;
      var text = applyTextPolish(tpl, ctx, true);
      var sec = copy.find(function (s) { return s.id === targets[guard % targets.length]; });
      if (!sec) break;
      var needFill = sectionsWordTotal(copy) < minTotal;
      if (!text || (!needFill && !claimMetaphor(text, ctx)) || !claimText(text, ctx.cityName, globalSeen)) continue;
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
    }
    return copy;
  }

  var HUMAN_TOPUP_VARIANTS = [
    '{ciudad} se afina cuando el cuerpo también opina.',
    'Los ritmos honestos suelen guiar mejor que los planes demasiado pulidos.',
    'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó.',
    'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva cuando el ruido baja.',
    'A veces hay que caminar una escena cotidiana para entender el mapa.',
    'La coherencia no tiene que ser total: basta un hilo que te sostenga.',
    'Hay lecturas que maduran despacio — como una habitación que se ordena poco a poco.',
    'El lugar habla en detalles: una mirada, un cansancio, un silencio que pesa distinto.',
    'Afloja la prisa de concluir; deja que la experiencia te devuelva su propio ritmo.',
    'Un hilo vivo basta para seguir caminando {ciudad} con verdad.'
  ];

  function humanEditorialTopUp(sections, ctx, globalSeen, stats, minTotal) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var targets = ['observar', 'integracion', 'favorece', 'aprovecha', 'desafia'];
    var guard = 0;
    while (sectionsWordTotal(copy) < minTotal && guard < 48) {
      var tpl = HUMAN_TOPUP_VARIANTS[(guard + hash32(ctx.seed + ':top:' + guard)) % HUMAN_TOPUP_VARIANTS.length];
      guard += 1;
      var text = applyTextPolish(tpl, ctx, true);
      var sec = copy.find(function (s) { return s.id === targets[guard % targets.length]; });
      var needFill = sectionsWordTotal(copy) < minTotal;
      if (!sec || !text || (!needFill && !claimMetaphor(text, ctx)) ||
          !claimText(text, ctx.cityName, globalSeen)) continue;
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
    }
    return copy;
  }

  function applySectionFillers(sections, ctx, globalSeen, stats, minTotal, narrativeContext) {
    var total = sectionsWordTotal(sections);
    if (!narrativeContext && total >= minTotal) return sections;
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    if (narrativeContext && total < minTotal) {
      var observar = copy.find(function (s) { return s.id === 'observar'; });
      if (observar && observar.words < 50) {
        var obsText = narrativeContext.humanObserve ||
          ('Si permaneces en ' + ctx.cityName +
            ', mira cada pocas semanas si lo vivido aquí sigue teniendo latido en tu experiencia.');
        if (claimText(obsText, ctx.cityName, globalSeen)) {
          observar.body = observar.body ? observar.body + '\n\n' + obsText : obsText;
          observar.words = wordCount(observar.body);
        }
      }
    }
    return copy;
  }

  function injectUnusedKnowledgeBlocks(sections, blocks, ctx, globalSeen, stats, usedBlockIds) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    blocks.slice().sort(function (a, b) {
      return slotOrder(a) - slotOrder(b);
    }).forEach(function (block) {
      if (isMethodologyBlock(block)) return;
      if (usedBlockIds[block.id]) return;
      var sid = sectionIdForBlock(block);
      var sec = copy.find(function (s) { return s.id === sid; });
      if (!sec) return;
      var text = applyTextPolish(block.text, ctx, true);
      if (!text || !claimMetaphor(text, ctx) || !claimText(text, ctx.cityName, globalSeen)) return;
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
      patterns: detectPatterns(influences),
      _atmosphereLinesUsed: 0,
      _usedTransitions: {},
      _usedMetaphors: {},
      _softenedBlocks: 0,
      _methodologyHits: 0,
      _clinicalTerms: {
        conviene: 0,
        moderarExpectativas: 0,
        observarSi: 0,
        enLaPractica: 0
      }
    };

    var narrativeWrap = resolveNarrativeContext(input, ctx);
    var narrativeContext = narrativeWrap.narrativeContext;
    ctx._atmosphereLinesUsed = countEmbeddedAtmosphere(narrativeContext);

    var knowledgeWrap = resolveKnowledgeBlocks(input, ctx, narrativeContext);
    var knowledgeBlocks = knowledgeWrap.blocks || [];
    if (narrativeContext) {
      knowledgeBlocks = knowledgeBlocks.filter(function (b) {
        return !isMethodologyBlock(b) && !isMethodologyPhrase(b.text);
      });
    }
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
    var methodologyBudget = narrativeContext ? 0 : 2;

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
        usedBlockIds,
        narrativeContext,
        methodologyBudget
      );
      sections.push({
        id: def.id,
        title: def.title,
        body: built.text,
        words: built.words
      });
    });

    sections = injectUnusedKnowledgeBlocks(sections, knowledgeBlocks, ctx, globalSeen, stats, usedBlockIds);
    sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS, narrativeContext);

    var interpretations = window.INTERPRETATIONS;
    syncSectionWords(sections);
    var preTrimWords = sectionsWordTotal(sections);
    var premiumUnits = Object.keys(usedBlockIds).length;
    var fallbackCap = MAX_FALLBACK_SENTENCES;
    if (preTrimWords < MIN_WORDS) {
      var needWords = MIN_WORDS - preTrimWords;
      var estSentences = Math.ceil(needWords / 22);
      fallbackCap = Math.min(8, Math.max(estSentences, 3));
    }
    if (premiumUnits > 0 && preTrimWords >= MIN_WORDS) {
      fallbackCap = Math.min(fallbackCap, Math.max(1, premiumUnits - 1));
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

    sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS, narrativeContext);

    if (interpretations) {
      syncSectionWords(sections);
      var postWords = sectionsWordTotal(sections);
      if (postWords < MIN_WORDS) {
        sections = narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, MIN_WORDS);
        syncSectionWords(sections);
        postWords = sectionsWordTotal(sections);
        if (postWords < MIN_WORDS) {
          var extraCap = Math.min(8, Math.ceil((MIN_WORDS - postWords) / 18));
          if (extraCap > 0) {
            var fbPool2 = buildFallbackPool(influences, aspect, interpretations, cityName);
            sections = ensureMinWordCount(sections, fbPool2, ctx, globalSeen, stats, MIN_WORDS, extraCap);
          }
        }
        sections = applySectionFillers(sections, ctx, globalSeen, stats, MIN_WORDS, narrativeContext);
      }
    }

    syncSectionWords(sections);
    if (narrativeContext && sectionsWordTotal(sections) < MIN_WORDS) {
      sections = narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, MIN_WORDS);
    }
    syncSectionWords(sections);
    if (interpretations && sectionsWordTotal(sections) < MIN_WORDS) {
      var fbFinal = buildFallbackPool(influences, aspect, interpretations, cityName);
      var needCap = Math.min(8, Math.ceil((MIN_WORDS - sectionsWordTotal(sections)) / 20));
      sections = ensureMinWordCount(sections, fbFinal, ctx, globalSeen, stats, MIN_WORDS, needCap);
    }
    var preTrimTotal = sectionsWordTotal(sections);
    if (preTrimTotal < MIN_WORDS) {
      sections = humanEditorialTopUp(sections, ctx, globalSeen, stats, MIN_WORDS);
      syncSectionWords(sections);
      preTrimTotal = sectionsWordTotal(sections);
    }
    if (preTrimTotal < MIN_WORDS && narrativeContext) {
      sections = narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, MIN_WORDS);
      syncSectionWords(sections);
      preTrimTotal = sectionsWordTotal(sections);
    }
    if (preTrimTotal < MIN_WORDS) {
      var integracionSec = sections.find(function (s) { return s.id === 'integracion'; });
      if (integracionSec && narrativeContext) {
        if (narrativeContext.humanClosing) {
          var closeText = narrativeContext.humanClosing;
          var hasClose = integracionSec.body &&
            integracionSec.body.indexOf(closeText.slice(0, 24)) !== -1;
          if (!hasClose && claimText(closeText, cityName, globalSeen)) {
            integracionSec.body = integracionSec.body
              ? integracionSec.body + '\n\n' + closeText
              : closeText;
            integracionSec.words = wordCount(integracionSec.body);
          }
        }
      }
    }

    sections = trimToMaxWords(sections, MAX_WORDS);

    var fullText = sections.map(function (s) { return s.body; }).join('\n\n');
    var totalWords = wordCount(fullText);
    var forbidden = containsForbidden(fullText);
    var englishTheme = containsEnglishThemeKeys(fullText);
    var sourceBreakdown = finalizeSourceBreakdown(stats, totalWords, Object.keys(usedBlockIds).length);
    var methodologyRepeats = narrativeContext ? countMethodologyRepeats(fullText.toLowerCase()) : 0;
    var methodologyHitsFinal = countMethodologyHitsInText(fullText);
    var repeatedTransitions = collectRepeatedTransitions(fullText, ctx);

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
        knowledgeMeta: knowledgeWrap.knowledgeMeta || null,
        narrativeContext: narrativeContext,
        narrativeAutoResolved: narrativeWrap.autoResolved,
        narrativeMeta: narrativeWrap.narrativeMeta || null,
        methodologyPhraseRepeats: methodologyRepeats,
        spineLabel: narrativeContext ? narrativeContext.dominantTheme.label : null,
        atmosphereLinesUsed: ctx._atmosphereLinesUsed || 0,
        citySlug: narrativeContext && narrativeContext.cityAtmosphere
          ? narrativeContext.cityAtmosphere.citySlug
          : null,
        repeatedTransitions: repeatedTransitions,
        methodologyHits: methodologyHitsFinal,
        softenedBlocks: ctx._softenedBlocks || 0,
        clinicalTermsCount: ctx._clinicalTerms || {
          conviene: 0,
          moderarExpectativas: 0,
          observarSi: 0,
          enLaPractica: 0
        }
      }
    };
  }

  function countMethodologyRepeats(fullText) {
    var count = 0;
    METHODOLOGY_PHRASE_MARKERS.forEach(function (marker) {
      var idx = fullText.toLowerCase().indexOf(marker);
      if (idx !== -1) {
        var rest = fullText.toLowerCase().slice(idx + marker.length);
        if (rest.indexOf(marker) !== -1) count += 1;
      }
    });
    return count;
  }

  window.KairosCityPremiumComposition = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MIN_WORDS: MIN_WORDS,
    MAX_WORDS: MAX_WORDS,
    MAX_ATMOSPHERE_LINES: MAX_ATMOSPHERE_LINES,
    THEME_ES: THEME_ES,
    EN_THEME_KEYS: EN_THEME_KEYS,
    FORBIDDEN: FORBIDDEN,
    composeCityReading: composeCityReading,
    METHODOLOGY_BLOCK_IDS: METHODOLOGY_BLOCK_IDS,
    METHODOLOGY_PHRASE_MARKERS: METHODOLOGY_PHRASE_MARKERS,
    METHODOLOGY_SUPPRESS_MARKERS: METHODOLOGY_SUPPRESS_MARKERS,
    PROHIBITED_TRANSITIONS: PROHIBITED_TRANSITIONS,
    VOICE_TRANSITION_POOL: VOICE_TRANSITION_POOL,
    _dev: {
      classifyBlockSource: classifyBlockSource,
      sectionIdForBlock: sectionIdForBlock,
      buildSpineLead: buildSpineLead,
      countMethodologyRepeats: countMethodologyRepeats,
      softenMethodologyText: softenMethodologyText,
      pickVoiceTransition: pickVoiceTransition
    }
  };
})();
