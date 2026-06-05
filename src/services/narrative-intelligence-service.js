/**
 * KAIROS MAPS — Narrative Intelligence Layer (Fase 3.8e.6a DEV)
 *
 * Deriva hilo narrativo determinista antes de knowledge + composición.
 * Sin IA. Voz premium: humanTheme, humanConflict, humanOpportunity, humanClosing.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.6a-dev-0.1';
  var MAX_DEEP = 2;

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
    protection: 'protección'
  };

  var GOAL_OBJECTIVE_IDS = {
    amor: 'doc6_objetivo_amor_dc_venus',
    trabajo: 'doc6_objetivo_trabajo_mc',
    descanso: 'doc6_objetivo_descanso_ic'
  };

  var GOAL_DOMINANT_FALLBACK = {
    amor: 'Coherencia emocional y encuentro con acuerdo',
    trabajo: 'Trayectoria con sentido antes que vitrina pública',
    descanso: 'Raíz y ritmo corporal sin convertir la pausa en rendimiento'
  };

  var ANGLE_NARRATIVE = {
    AC: 'presencia e identidad al llegar',
    IC: 'raíz íntima y trabajo de fondo',
    MC: 'trayectoria y visibilidad pública',
    DC: 'encuentro y acuerdo con el otro'
  };

  var PLANET_NARRATIVE = {
    sol: 'identidad',
    luna: 'ritmo emocional',
    mercurio: 'comunicación',
    venus: 'vínculo y disfrute',
    marte: 'impulso y exigencia',
    jupiter: 'expansión',
    saturno: 'límite y estructura',
    neptuno: 'idealización y sensibilidad',
    urano: 'ruptura',
    pluton: 'intensidad'
  };

  var TENSION_BRIDGE = {
    poleA: 'Integración consciente',
    poleB: 'Sombra proyectada en el entorno',
    label: 'Integración consciente frente a sombra proyectada en el entorno'
  };

  var TENSION_BY_GOAL = {
    amor: { poleA: 'Aprobación', poleB: 'Autenticidad', label: 'Aprobación frente a autenticidad' },
    trabajo: { poleA: 'Visibilidad deseada', poleB: 'Claridad interna', label: 'Visibilidad deseada frente a claridad interna' },
    descanso: { poleA: 'Impulso de seguir', poleB: 'Permiso de bajar', label: 'Impulso de seguir frente a permiso de bajar' }
  };

  var OPPORTUNITY_BY_GOAL = {
    amor: { label: 'Vínculos más honestos', condition: 'coherencia antes que impacto performativo' },
    trabajo: { label: 'Alinear motivación antes de volver a escena', condition: 'sentido trabajado en privado' },
    descanso: { label: 'Descanso que ocupa espacio sin disculparse', condition: 'bajar exigencia sin desaparecer' }
  };

  var HUMAN_CONFLICT_BY_LABEL = {
    'autenticidad frente a brillo':
      'La pregunta no es cómo destacar en {ciudad}. Es cuánto de ti muestras cuando nadie te obliga — como dejar de llamar puerta a cualquier espejo.',
    'aprobación frente a autenticidad':
      'Tal vez el roce no sea el otro, sino la distancia entre la versión que encaja y la que respira en silencio.',
    'visibilidad deseada frente a claridad interna':
      '{ciudad} puede activar una prisa muy humana: querer que el mundo vea algo que todavía estás terminando de entender por dentro.',
    'impulso de seguir frente a permiso de bajar':
      'El cuerpo pide pausa; la mente sigue midiendo terreno. En {ciudad}, a veces descansar se siente como volver al cuerpo después de mucho ruido.',
    'integración consciente frente a sombra proyectada en el entorno':
      'Quizá lo que te incomoda en {ciudad} no nació aquí: llegó contigo, como una sombra que esperaba escenario.'
  };

  var HUMAN_CONFLICT_BY_GOAL = {
    amor: HUMAN_CONFLICT_BY_LABEL['autenticidad frente a brillo'],
    trabajo: HUMAN_CONFLICT_BY_LABEL['visibilidad deseada frente a claridad interna'],
    descanso: HUMAN_CONFLICT_BY_LABEL['impulso de seguir frente a permiso de bajar']
  };

  var HUMAN_OPPORTUNITY_BY_GOAL = {
    amor: 'dirigir tu energía hacia el vínculo que no te pide personaje — como dejar de llamar puerta a cualquier espejo.',
    trabajo: 'recuperar claridad interna antes de volver a medirte por escenario o por aplauso.',
    descanso: 'bajar el ritmo sin convertir la pausa en otra forma de rendimiento — como volver al cuerpo después de mucho ruido.'
  };

  var HUMAN_OPPORTUNITY_PATTERNS = [
    { match: 'favorece lograr el foco',
      text: 'dejar de gastar energía intentando encajar y empezar a dirigirla hacia aquello que realmente importa.' },
    { match: 'siendo coherente',
      text: 'sostener coherencia antes que impacto performativo — y ver qué abre eso en el encuentro.' },
    { match: 'alinear motivación',
      text: 'trabajar el sentido en privado antes de volver a exponer la trayectoria.' },
    { match: 'descanso que ocupa',
      text: 'ocupar espacio con descanso sin disculparte — como una habitación que por fin se ordena.' }
  ];

  var HUMAN_THEME_PATTERNS = [
    { match: 'activa necesidad de ser reconocido',
      text: 'En {ciudad}, el encuentro puede pedirte presencia antes que personaje — como quitarte un disfraz que ya cansó.' },
    { match: 'con foco en trabajo',
      text: '{ciudad} mezcla con delicadeza lo que quieres mostrar y lo que aún guardas en silencio.' },
    { match: 'con foco en descanso',
      text: 'En {ciudad}, el ritmo del cuerpo vuelve a importar — como bajar el volumen de una música demasiado alta.' },
    { match: 'con foco en amor',
      text: 'Hay algo en {ciudad} que invita al encuentro honesto, sin prisa de brillar.' },
    { match: 'coherencia emocional',
      text: 'El vínculo en {ciudad} parece pedir coherencia antes que prueba constante.' },
    { match: 'trayectoria',
      text: 'La trayectoria y la visibilidad en {ciudad} se entrelazan con lo que aún no has dicho en voz alta.' }
  ];

  var HUMAN_THEME_BY_GOAL = {
    amor: 'Hay algo en {ciudad} que toca el encuentro — no el personaje, sino la persona.',
    trabajo: '{ciudad} pone a prueba tu sentido antes que tu vitrina.',
    descanso: 'En {ciudad}, el cuerpo puede volver a hablar — si le devuelves el micrófono.'
  };

  var HUMAN_OBSERVE_BY_GOAL = {
    amor: 'Con el tiempo, {ciudad} puede mostrarte algo sencillo: si un vínculo necesita demasiado personaje para sostenerse, quizá no era descanso, sino actuación.',
    trabajo: 'Con el tiempo, {ciudad} revela si tu trabajo pide escenario o sustancia — y cuál de las dos estás alimentando sin darte cuenta.',
    descanso: 'Con el tiempo, {ciudad} enseña a volver al cuerpo después de mucho ruido — como una habitación que se ordena poco a poco.'
  };

  var HUMAN_CLOSING_BY_GOAL = {
    amor: 'Si algo queda contigo de {ciudad}, que sea esto: atreverte a ser más verdadero antes que más visible.',
    trabajo: 'Quizá la clave no sea hacer más. Quizá sea dejar de perseguir todas las señales y escuchar cuál sigue viva cuando el ruido baja.',
    descanso: 'Si algo queda contigo, que sea esto: permiso para bajar el ritmo sin sentir que desapareces.'
  };

  var GUIDING_QUESTIONS = {
    amor: {
      AC: '¿Quién eres en {ciudad} cuando no intentas gustar?',
      DC: '¿Qué acuerdo contigo necesitas antes de pedirle al otro algo en {ciudad}?',
      MC: '¿Qué parte de tu historia quieres que {ciudad} ponga en primer plano en el vínculo?',
      default: '¿Qué te pide {ciudad} en amor si sueltas la máscara?'
    },
    trabajo: {
      IC: '¿Qué quieres que {ciudad} haga visible de tu trabajo — y qué prefieres mantener en reserva?',
      MC: '¿Tu impulso en {ciudad} busca sentido o escaparate?',
      AC: '¿Cómo te presentarías en {ciudad} si tu trabajo no necesitara prueba constante?',
      default: '¿Qué propósito sostendrías en {ciudad} antes de medir el éxito?'
    },
    descanso: {
      AC: '¿Puedes soltar en {ciudad} sin sentir que pierdes terreno?',
      MC: '¿Tu descanso en {ciudad} es pausa o otra forma de competir?',
      IC: '¿Qué ritmo de hogar te pide {ciudad} para recuperar de verdad?',
      default: '¿Qué ritmo corporal te pide {ciudad} si dejas de rendir?'
    }
  };

  function hash32(str) {
    var h = 2166136261;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function resolveGoalId(goal) {
    if (!goal) return 'amor';
    if (typeof goal === 'string') return goal;
    return goal.id || goal.aspectKey || 'amor';
  }

  function interpKey(line) {
    if (!line) return '';
    var pk = line.planetKey || String(line.planet || '').toUpperCase();
    return pk ? pk + '_' + line.angle : '';
  }

  function normalizeInfluences(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item, rank) {
      var line = item.line || item;
      return {
        rank: rank,
        line: line,
        interpKey: interpKey(line),
        planet: line && String(line.planet || '').toLowerCase(),
        angle: line && line.angle,
        composite: item.composite || 0,
        distKm: item.distKm != null ? item.distKm : item.dist
      };
    }).sort(function (a, b) {
      if (b.composite !== a.composite) return b.composite - a.composite;
      return a.rank - b.rank;
    });
  }

  function doc17BlockId(interpKeyStr, slot, integration) {
    return 'doc17_' + interpKeyStr.toLowerCase() + '_' + slot + '_' + integration;
  }

  function getDoc17Slot(catalog, key, slot, goalId, preferShadow) {
    if (!catalog || !key) return null;
    var block = null;
    if (preferShadow) {
      block = catalog.INDEX.byId[doc17BlockId(key, slot, 'shadow')];
    }
    if (!block) {
      block = catalog.INDEX.byId[doc17BlockId(key, slot, 'integrated')];
    }
    if (!block) return null;
    if (block.goals && block.goals.indexOf('any') === -1 &&
        block.goals.indexOf(goalId) === -1) {
      if (slot === 't1' || slot === 't2') {
        var alt = catalog.INDEX.byId[doc17BlockId(key, slot, 'shadow')];
        if (alt && (alt.goals.indexOf(goalId) !== -1 || alt.goals.indexOf('any') !== -1)) {
          block = alt;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    return block;
  }

  function themesLabel(themes) {
    if (!themes || !themes.length) return '';
    return themes.slice(0, 3).join(', ');
  }

  function excerptForLabel(text, maxLen) {
    var t = String(text || '').replace(/\{ciudad\}/g, '').trim();
    if (t.length <= maxLen) return t;
    var cut = t.slice(0, maxLen);
    var last = cut.lastIndexOf(' ');
    if (last > 40) cut = cut.slice(0, last);
    return cut + '…';
  }

  function extractCondition(t3Text) {
    var t = String(t3Text || '');
    var idx = t.toLowerCase().indexOf('condición');
    if (idx === -1) return '';
    return t.slice(idx).replace(/^[^:]*:\s*/i, '').replace(/\.$/, '').trim();
  }

  function pickGuidingQuestion(goalId, angle, cityName) {
    var map = GUIDING_QUESTIONS[goalId] || GUIDING_QUESTIONS.amor;
    var q = (angle && map[angle]) ? map[angle] : map.default;
    return q.replace(/\{ciudad\}/g, cityName);
  }

  function deriveDominantTheme(catalog, goalId, deepKey, deepInf, bridgeProfile) {
    var t1 = getDoc17Slot(catalog, deepKey, 't1', goalId, false);
    var t2 = getDoc17Slot(catalog, deepKey, 't2', goalId, false);
    var objId = GOAL_OBJECTIVE_IDS[goalId];
    var objBlock = objId && catalog ? catalog.INDEX.byId[objId] : null;

    var themes = [];
    var label = GOAL_DOMINANT_FALLBACK[goalId] || GOAL_DOMINANT_FALLBACK.amor;
    var sourceDoc = 'DOC-6';
    var sourceBlockId = objId || null;

    if (t2 && t2.themes && t2.themes.length) {
      themes = t2.themes.slice();
      label = excerptForLabel(t2.text, 72);
      sourceDoc = 'DOC-17';
      sourceBlockId = t2.id;
    } else if (t1 && t1.themes && t1.themes.length) {
      themes = t1.themes.slice();
      label = excerptForLabel(t1.text, 72);
      sourceDoc = 'DOC-17';
      sourceBlockId = t1.id;
    } else if (objBlock) {
      themes = (objBlock.themes || []).slice();
      label = excerptForLabel(objBlock.text, 72);
    } else if (deepInf) {
      var angle = deepInf.angle || 'AC';
      var planet = deepInf.planet || 'sol';
      themes = [ANGLE_NARRATIVE[angle] || angle, PLANET_NARRATIVE[planet] || planet].filter(Boolean);
      label = 'Trabajar ' + (ANGLE_NARRATIVE[angle] || 'el eje vital') +
        ' con matiz de ' + (PLANET_NARRATIVE[planet] || planet);
      sourceDoc = 'DOC-6';
    }

    if (bridgeProfile && bridgeProfile.themes && bridgeProfile.themes.length) {
      bridgeProfile.themes.slice(0, 2).forEach(function (bt) {
        var es = THEME_ES[bt] || bt;
        if (themes.indexOf(es) === -1) themes.push(es);
      });
    }

    return {
      label: label,
      themes: themes,
      sourceDoc: sourceDoc,
      sourceBlockId: sourceBlockId,
      deepInfluenceKey: deepKey
    };
  }

  function deriveCentralTension(catalog, goalId, deepKey, bridgeProfile) {
    var useShadow = bridgeProfile && bridgeProfile.tensionMode === true;
    if (useShadow) {
      return {
        poleA: TENSION_BRIDGE.poleA,
        poleB: TENSION_BRIDGE.poleB,
        label: TENSION_BRIDGE.label,
        sourceDoc: 'DOC-6',
        sourceBlockId: 'doc6_integrado_sobre_sombra'
      };
    }

    var t2 = getDoc17Slot(catalog, deepKey, 't2', goalId, false);
    if (t2 && t2.themes && t2.themes.length >= 2) {
      return {
        poleA: t2.themes[0],
        poleB: t2.themes[1],
        label: t2.themes[0] + ' frente a ' + t2.themes[1],
        sourceDoc: 'DOC-17',
        sourceBlockId: t2.id
      };
    }
    if (t2 && t2.themes && t2.themes.length === 1) {
      var fb = TENSION_BY_GOAL[goalId] || TENSION_BY_GOAL.amor;
      return {
        poleA: t2.themes[0],
        poleB: fb.poleB,
        label: t2.themes[0] + ' frente a ' + fb.poleB,
        sourceDoc: 'DOC-17',
        sourceBlockId: t2.id
      };
    }

    var fb2 = TENSION_BY_GOAL[goalId] || TENSION_BY_GOAL.amor;
    return {
      poleA: fb2.poleA,
      poleB: fb2.poleB,
      label: fb2.label,
      sourceDoc: 'DOC-6',
      sourceBlockId: null
    };
  }

  function deriveMainOpportunity(catalog, goalId, deepKey, bridgeProfile) {
    var t3 = getDoc17Slot(catalog, deepKey, 't3', goalId, false);
    var fb = OPPORTUNITY_BY_GOAL[goalId] || OPPORTUNITY_BY_GOAL.amor;

    if (t3) {
      return {
        label: excerptForLabel(t3.text, 64),
        condition: extractCondition(t3.text) || fb.condition,
        themes: (t3.themes || []).slice(),
        sourceDoc: 'DOC-17',
        sourceBlockId: t3.id
      };
    }

    return {
      label: fb.label,
      condition: fb.condition,
      themes: [],
      sourceDoc: 'DOC-6',
      sourceBlockId: GOAL_OBJECTIVE_IDS[goalId] || null
    };
  }

  function normalizeLookupKey(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function matchPattern(patterns, label) {
    var lower = normalizeLookupKey(label);
    for (var i = 0; i < patterns.length; i++) {
      if (lower.indexOf(patterns[i].match) !== -1) return patterns[i].text;
    }
    return null;
  }

  function withCity(text, cityName) {
    return String(text || '').replace(/\{ciudad\}/g, cityName);
  }

  function humanizeTheme(dominantTheme, goalId, cityName) {
    var hit = matchPattern(HUMAN_THEME_PATTERNS, dominantTheme.label);
    if (hit) return withCity(hit, cityName);
    return withCity(HUMAN_THEME_BY_GOAL[goalId] || HUMAN_THEME_BY_GOAL.amor, cityName);
  }

  function humanizeConflict(centralTension, goalId, cityName) {
    var key = normalizeLookupKey(centralTension.label);
    if (HUMAN_CONFLICT_BY_LABEL[key]) return withCity(HUMAN_CONFLICT_BY_LABEL[key], cityName);
    return withCity(HUMAN_CONFLICT_BY_GOAL[goalId] || HUMAN_CONFLICT_BY_GOAL.amor, cityName);
  }

  function humanizeOpportunity(mainOpportunity, goalId) {
    var hit = matchPattern(HUMAN_OPPORTUNITY_PATTERNS, mainOpportunity.label);
    if (hit) return hit;
    if (mainOpportunity.condition) {
      var cond = String(mainOpportunity.condition).toLowerCase();
      if (cond.indexOf('coherencia') !== -1) {
        return 'sostener coherencia antes que impacto performativo — y ver qué abre eso en el encuentro.';
      }
      if (cond.indexOf('privado') !== -1 || cond.indexOf('sentido') !== -1) {
        return 'trabajar el sentido en privado antes de volver a medirte por visibilidad.';
      }
      if (cond.indexOf('bajar') !== -1 || cond.indexOf('exigencia') !== -1) {
        return 'bajar exigencia sin desaparecer del mapa.';
      }
    }
    return HUMAN_OPPORTUNITY_BY_GOAL[goalId] || HUMAN_OPPORTUNITY_BY_GOAL.amor;
  }

  var HUMAN_ACTION_BY_GOAL = {
    amor: 'esta semana, atrévete a un encuentro sin disfraz — una conversación donde no tengas que causar buena impresión.',
    trabajo: 'esta semana, escribe en privado qué sentido tiene tu trabajo antes de volver a exponerlo al mundo.',
    descanso: 'esta semana, guarda un bloque de descanso como quien guarda un refugio — sin disculparte por entrar.'
  };

  function humanizeOpportunityAction(mainOpportunity, goalId) {
    return HUMAN_ACTION_BY_GOAL[goalId] || HUMAN_ACTION_BY_GOAL.amor;
  }

  function humanizeObserve(goalId, cityName) {
    return withCity(HUMAN_OBSERVE_BY_GOAL[goalId] || HUMAN_OBSERVE_BY_GOAL.amor, cityName);
  }

  function humanizeClosing(goalId, cityName) {
    return withCity(HUMAN_CLOSING_BY_GOAL[goalId] || HUMAN_CLOSING_BY_GOAL.amor, cityName);
  }

  function buildNarrativeSummary(cityName, goalId, humanTheme) {
    var goalPhrase = {
      amor: 'el amor y el vínculo',
      trabajo: 'el trabajo y el propósito',
      descanso: 'el descanso y el cuerpo'
    }[goalId] || goalId;

    return 'Hay algo en ' + cityName + ' que habla desde ' + goalPhrase + '. ' + humanTheme;
  }

  function deriveNarrativeContext(input) {
    var empty = {
      ok: false,
      narrativeContext: null,
      meta: { schemaVersion: SCHEMA_VERSION, error: 'invalid_input' }
    };

    if (!input) return empty;

    var catalog = window.KairosPremiumBlocks;
    if (!catalog || !catalog.INDEX) {
      empty.meta.error = 'missing_premium_blocks';
      return empty;
    }

    var goalId = resolveGoalId(input.goal);
    var influences = normalizeInfluences(input.relevantInfluences);
    if (!influences.length) {
      empty.meta.error = 'no_influences';
      return empty;
    }

    var cityName = input.city && input.city.name ? input.city.name : '';
    var bridgeProfile = input.bridgeProfile || null;
    var deepInfs = influences.slice(0, MAX_DEEP);
    var deepKeys = deepInfs.map(function (i) { return i.interpKey; });
    var echoKeys = influences.slice(MAX_DEEP, 5).map(function (i) { return i.interpKey; });

    var primary = deepInfs[0];
    var primaryKey = primary ? primary.interpKey : '';

    var dominantTheme = deriveDominantTheme(catalog, goalId, primaryKey, primary, bridgeProfile);
    var centralTension = deriveCentralTension(catalog, goalId, primaryKey, bridgeProfile);
    var mainOpportunity = deriveMainOpportunity(catalog, goalId, primaryKey, bridgeProfile);
    var guidingQuestion = pickGuidingQuestion(goalId, primary && primary.angle, cityName);

    var humanTheme = humanizeTheme(dominantTheme, goalId, cityName);
    var humanConflict = humanizeConflict(centralTension, goalId, cityName);
    var humanOpportunity = humanizeOpportunity(mainOpportunity, goalId);
    var humanOpportunityAction = humanizeOpportunityAction(mainOpportunity, goalId);
    var humanObserve = humanizeObserve(goalId, cityName);
    var humanClosing = humanizeClosing(goalId, cityName);
    var narrativeSummary = buildNarrativeSummary(cityName, goalId, humanTheme);

    var seed = hash32(
      cityName + '|' + goalId + '|' + deepKeys.join(',') + '|' + echoKeys.join(',')
    );

    var narrativeContext = {
      dominantTheme: dominantTheme,
      centralTension: centralTension,
      mainOpportunity: mainOpportunity,
      humanTheme: humanTheme,
      humanConflict: humanConflict,
      humanOpportunity: humanOpportunity,
      humanOpportunityAction: humanOpportunityAction,
      humanObserve: humanObserve,
      humanClosing: humanClosing,
      guidingQuestion: guidingQuestion,
      deepInfluenceKeys: deepKeys,
      echoInfluenceKeys: echoKeys,
      narrativeSummary: narrativeSummary
    };

    return {
      ok: true,
      narrativeContext: narrativeContext,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        goalId: goalId,
        cityName: cityName,
        deterministicSeed: seed,
        primaryInfluenceKey: primaryKey,
        rulesFired: [
          'deep_influences_' + deepKeys.length,
          'editorial_humanization',
          'voice_beauty_polish',
          dominantTheme.sourceDoc,
          centralTension.sourceDoc,
          mainOpportunity.sourceDoc
        ]
      }
    };
  }

  window.KairosNarrativeIntelligence = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MAX_DEEP: MAX_DEEP,
    THEME_ES: THEME_ES,
    deriveNarrativeContext: deriveNarrativeContext,
    _dev: {
      GOAL_OBJECTIVE_IDS: GOAL_OBJECTIVE_IDS,
      GUIDING_QUESTIONS: GUIDING_QUESTIONS
    }
  };
})();
