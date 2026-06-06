/**
 * KAIROS MAPS — Narrative Intelligence Layer (Fase 3.8e.9d DEV)
 *
 * Deriva hilo narrativo determinista antes de knowledge + composición.
 * Sin IA. Voz premium + atmósfera de ciudad (Lisboa, Toronto, Ciudad del Cabo).
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.9d-dev-0.1';
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
    amor: 'Quizá en {ciudad} notes que el encuentro te pide presencia — no personaje, sino persona.',
    trabajo: 'Puede que en {ciudad} sientas que tu sentido pesa más que tu vitrina.',
    descanso: 'Tal vez en {ciudad} notes que el cuerpo vuelve a hablar — si le devuelves el micrófono.'
  };

  var HUMAN_OBSERVE_BY_GOAL = {
    amor: 'Con el tiempo, puede que {ciudad} te muestre algo sencillo: si un vínculo necesita demasiado personaje para sostenerse, quizá no era descanso, sino actuación.',
    trabajo: 'Con el tiempo, quizá {ciudad} te revele si tu trabajo pide escenario o sustancia — y cuál de las dos alimentas sin darte cuenta.',
    descanso: 'Con el tiempo, puede que {ciudad} te enseñe a volver al cuerpo después de mucho ruido.'
  };

  var HUMAN_CLOSING_BY_GOAL = {
    amor: 'Si algo queda contigo de {ciudad}, que sea esto: atreverte a ser más verdadero antes que más visible.',
    trabajo: 'Quizá la clave no sea hacer más. Quizá sea dejar de perseguir todas las señales y escuchar cuál sigue viva cuando el ruido baja.',
    descanso: 'Si algo queda contigo, que sea esto: permiso para bajar el ritmo sin sentir que desapareces.'
  };

  var GOAL_ATMOSPHERE_FIELD = {
    amor: 'bond',
    trabajo: 'work',
    descanso: 'rest'
  };

  var CITY_ATMOSPHERE_INDEX = {
    lisboa: {
      rhythm: [
        'Aquí el tiempo se dobla: lo urgente pierde volumen y lo cotidiano gana textura.',
        'Hay un ritmo que no acelera para impresionar; te invita a quedarte un poco más.',
        'Las horas parecen tener margen para conversar antes de decidir.',
        'No es lentitud vacía: es un paso que te devuelve al cuerpo.',
        'Lo que no pasa hoy puede esperar sin sentirse como fracaso.'
      ],
      emotional: [
        'Sensación de luz suave sobre lo íntimo: lo personal no se esconde del todo.',
        'Hay melancolía sin dramatismo — como quien recuerda sin castigarse.',
        'El afecto puede ser directo sin ser ruidoso.',
        'A veces la ternura aparece disfrazada de ironía o de distancia elegante.',
        'Hay lugares donde las emociones no se exhiben, pero tampoco se esconden del todo.'
      ],
      bond: [
        'Las conversaciones pueden empezar antes que la confianza formal.',
        'El vínculo a menudo pasa por presencia, no por demostración.',
        'Hay encuentros que se sostienen en gestos pequeños: una mesa compartida, un silencio cómodo.',
        'Puede costar menos performar y más mostrarse.',
        'A veces el amor aquí pide honestidad antes que espectáculo.'
      ],
      work: [
        'El trabajo puede mezclarse con la vida sin pedirte que desaparezcas en el rol.',
        'Hay espacio para lo artesanal, lo bien hecho, lo que toma tiempo.',
        'La visibilidad no siempre es el premio: a veces importa más la coherencia interna.',
        'Puede favorecer proyectos con alma más que carreras de vitrina.',
        'El esfuerzo sostenido vale más que el arranque ruidoso.'
      ],
      rest: [
        'Descansar puede ser dejar de justificar cada pausa.',
        'Hay permiso implícito para bajar el rendimiento sin desaparecer.',
        'El descanso se parece más a recuperar gusto que a apagar el motor.',
        'A veces la pausa llega en forma de conversación larga o de mirar el horizonte sin prisa.',
        'El cuerpo puede volver cuando la agenda deja de mandar.'
      ],
      images: [
        'Pendientes que te hacen llegar un poco más lento a cada encuentro.',
        'Luz oblicua que cambia el tono de la tarde sin avisar.',
        'Barrios donde lo antiguo y lo nuevo conviven sin pelear.',
        'Mesas que se alargan porque nadie tiene prisa por levantarse.',
        'Silencios entre amigos que no se sienten incómodos.'
      ],
      metaphors: [
        'Como una conversación que empieza antes que la confianza.',
        'Como quitarte un disfraz que ya cansó.',
        'Como dejar de llamar puerta a cualquier espejo.',
        'Como una habitación que recupera aire después de muchas visitas.',
        'Como un encuentro que no pide personaje.'
      ],
      avoid: ['tranvía', 'tranvia', 'fado', 'azulejo', 'magia portuguesa', 'destino romántico', 'postal']
    },
    toronto: {
      rhythm: [
        'Aquí el ritmo puede acelerarse sin pedir permiso: el día empieza con filo.',
        'Hay sensación de movimiento constante — no siempre caótico, pero sí orientado.',
        'Las decisiones pueden tomarse rápido; el cuerpo lo registra como urgencia.',
        'No es solo velocidad: es claridad de paso cuando sabes hacia dónde vas.',
        'El invierno largo deja huella: a veces el impulso compensa meses de contención.'
      ],
      emotional: [
        'Sensación de espacio amplio: lo personal puede sentirse pequeño frente a la escala.',
        'Hay reserva cordial — amabilidad sin invasión.',
        'La emoción puede ir por dentro mientras afuera todo sigue funcionando.',
        'A veces la soledad no es carencia: es intervalo entre bloques de actividad.',
        'Hay honestidad práctica más que dramatismo expresivo.'
      ],
      bond: [
        'Los vínculos pueden construirse por acuerdos claros más que por intuición difusa.',
        'Hay encuentros que empiezan en lo funcional y se abren despacio.',
        'La confianza a menudo se gana con consistencia, no con fuegos artificiales.',
        'Puede costar menos seducir y más sostener presencia a largo plazo.',
        'A veces el vínculo pide definición antes que fusión.'
      ],
      work: [
        'El trabajo puede sentirse como escenario público: lo que haces tiende a ser visible.',
        'Hay cultura de mérito, proceso, documentación — sentido antes que aplauso.',
        'La trayectoria pesa: definir qué quieres que se vea antes de exponerte.',
        'Puede activar prisa por mostrar algo que aún estás terminando de entender por dentro.',
        'El esfuerzo sostenido y el orden reducen ruido interno.'
      ],
      rest: [
        'Descansar puede competir con la sensación de que siempre hay algo pendiente.',
        'Hay que negociar la pausa: no siempre llega sola.',
        'El descanso útil a veces pasa por movimiento físico — caminar fuerte, soltar tensión.',
        'A veces recuperar es ordenar lo heredado, lo pendiente, lo no dicho.',
        'El cuerpo pide descarga cuando la mente no para de calcular.'
      ],
      images: [
        'Distancias que te hacen planificar el día como pequeña expedición.',
        'Inviernos que enseñan a guardar energía para cuando el calor vuelve.',
        'Barrios donde cada comunidad trae su propio ritmo al conjunto.',
        'Mañanas que empiezan con propósito antes que con contemplación.',
        'Horizontes amplios que ponen tu historia en perspectiva.'
      ],
      metaphors: [
        'Como querer que el mundo vea algo que todavía estás terminando de entender por dentro.',
        'Como un escenario que amplifica lo que llevas.',
        'Como escribir en privado antes de volver a exponer la página.',
        'Como caminar con más filo cuando el frío aprieta.',
        'Como escuchar cuál señal sigue viva cuando el ruido baja.'
      ],
      avoid: ['cn tower', 'hockey', 'sueño americano', 'oportunidad infinita', 'multicultural', 'postal', 'rascacielos']
    },
    ciudad_del_cabo: {
      rhythm: [
        'Aquí el ritmo puede ser doble: expansión afuera, recogimiento adentro.',
        'Hay sensación de borde — tierra que mira al horizonte amplio.',
        'El cuerpo registra el lugar antes que la cabeza lo explique.',
        'A veces el día pide intensidad y la tarde pide bajar el volumen.',
        'Lo geográfico se siente en el pulso: abrir y cerrar, subir y soltar.'
      ],
      emotional: [
        'Sensación de contraste vivido: luz fuerte, sombra profunda, aire que despeja.',
        'Hay resiliencia sin discurso — como quien sigue después de mucho.',
        'La emoción puede ser directa, corporal, sin muchos intermediarios.',
        'A veces la belleza del entorno no consuela: te devuelve a ti.',
        'Hay honestidad cruda mezclada con capacidad de disfrute.'
      ],
      bond: [
        'Los vínculos pueden ser cálidos sin ser livianos.',
        'Hay encuentros que mezclan franqueza y cuidado.',
        'La confianza a veces se construye compartiendo espacio, no solo palabras.',
        'Puede pedir menos teatro y más presencia encarnada.',
        'A veces el vínculo se prueba en cómo sostienes la verdad sin dureza.'
      ],
      work: [
        'El trabajo puede alternar impulso y pausa — no siempre lineal.',
        'Hay espacio para iniciativa, pero también para procesos que maduran despacio.',
        'La visibilidad puede mezclarse con sensación de exponerse en un escenario amplio.',
        'Puede activar ganas de hacer junto con necesidad de recuperar raíz.',
        'El sentido del trabajo a menudo pasa por coherencia personal, no solo por escaparate.'
      ],
      rest: [
        'Descansar aquí puede ser volver al cuerpo después de mucho ruido.',
        'Hay permiso para bajar exigencia sin convertir la pausa en rendimiento.',
        'El descanso puede ser reentrenarse en recibir — sol, aire, silencio, agua.',
        'A veces la pausa llega cuando dejas de luchar contra el reloj.',
        'El cuerpo pide ritmo propio frente a impulso de seguir.'
      ],
      images: [
        'Viento que te obliga a ajustar el paso.',
        'Luz que cambia el color de la tarde de forma casi física.',
        'Distancias que mezclan ciudad, colina y horizonte abierto.',
        'Silencios que pesan distinto según el barrio y la hora.',
        'Sensación de estar en un borde donde lo grande te pone en proporción.'
      ],
      metaphors: [
        'Como volver al cuerpo después de mucho ruido.',
        'Como bajar el volumen de una música demasiado alta.',
        'Como una habitación que se ordena poco a poco.',
        'Como guardar un refugio sin disculparte por entrar.',
        'Como dejar de luchar contra el reloj.'
      ],
      avoid: ['table mountain', 'playa', 'paraíso', 'destino exótico', 'exótico', 'colonial', 'postal', 'turística']
    }
  };

  var GLOBAL_TOURISM_TOKENS = [
    'tranvía', 'tranvia', 'fado', 'azulejo', 'cn tower', 'hockey', 'table mountain',
    'rascacielos', 'playa', 'postal turística', 'guía de viaje', 'destino exótico'
  ];

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

  function lcfirst(text) {
    if (!text) return '';
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function resolveCitySlug(cityName) {
    var n = normalizeLookupKey(cityName);
    if (n === 'lisboa') return 'lisboa';
    if (n === 'toronto') return 'toronto';
    if (n.indexOf('ciudad del cabo') !== -1 || n === 'cape town') return 'ciudad_del_cabo';
    return null;
  }

  function containsAvoidToken(text, avoidList) {
    var lower = String(text || '').toLowerCase();
    var combined = (avoidList || []).concat(GLOBAL_TOURISM_TOKENS);
    for (var i = 0; i < combined.length; i++) {
      if (lower.indexOf(combined[i]) !== -1) return true;
    }
    return false;
  }

  function localizeAtmosphereLine(line, cityName) {
    if (!line) return '';
    if (cityName && line.indexOf(cityName) !== -1) return line;
    if (line.indexOf('Aquí ') === 0 && cityName) {
      return 'En ' + cityName + ', ' + lcfirst(line.slice(5));
    }
    if (cityName) return 'En ' + cityName + ', ' + lcfirst(line);
    return line;
  }

  function pickAtmosphere(opts) {
    var slug = opts.citySlug;
    var index = slug ? CITY_ATMOSPHERE_INDEX[slug] : null;
    if (!index) return '';

    var poolKey = opts.slot;
    if (poolKey === 'goalTone') {
      poolKey = GOAL_ATMOSPHERE_FIELD[opts.goal] || 'bond';
    }
    var pool = index[poolKey];
    if (!pool || !pool.length) return '';

    var guard = 0;
    while (guard < pool.length) {
      var idx = hash32(
        String(opts.seed) + ':' + slug + ':' + opts.goal + ':' + opts.slot + ':' + guard
      ) % pool.length;
      var line = pool[idx];
      if (!containsAvoidToken(line, index.avoid)) {
        return localizeAtmosphereLine(line, opts.cityName || '');
      }
      guard += 1;
    }
    return '';
  }

  function buildCityAtmosphere(cityName, goalId, seed) {
    var slug = resolveCitySlug(cityName);
    if (!slug) return null;

    var index = CITY_ATMOSPHERE_INDEX[slug];
    var rhythm = pickAtmosphere({ citySlug: slug, goal: goalId, slot: 'rhythm', seed: seed, cityName: cityName });
    var emotional = pickAtmosphere({
      citySlug: slug, goal: goalId, slot: 'emotional', seed: seed + 1, cityName: cityName
    });
    var goalTone = pickAtmosphere({
      citySlug: slug, goal: goalId, slot: 'goalTone', seed: seed + 2, cityName: cityName
    });
    var images = pickAtmosphere({
      citySlug: slug, goal: goalId, slot: 'images', seed: seed + 3, cityName: cityName
    });

    var selectedLines = [];
    [rhythm, emotional, goalTone, images].forEach(function (line) {
      if (!line) return;
      var norm = line.toLowerCase().slice(0, 40);
      var dup = false;
      for (var i = 0; i < selectedLines.length; i++) {
        if (selectedLines[i].toLowerCase().slice(0, 40) === norm) dup = true;
      }
      if (!dup) selectedLines.push(line);
    });

    return {
      citySlug: slug,
      rhythm: rhythm,
      emotionalTexture: emotional,
      goalTone: goalTone,
      images: images,
      warnings: index.avoid.slice(),
      selectedLines: selectedLines
    };
  }

  function weaveAtmosphereObserve(humanObserve, cityAtm, goalId, cityName) {
    if (!cityAtm) return humanObserve;
    if (cityAtm.images) {
      var img = cityAtm.images;
      var imgFp = img.toLowerCase().replace(/^en [^,]+,\s*/, '').slice(0, 24);
      if (humanObserve && imgFp.length >= 12 &&
          humanObserve.toLowerCase().indexOf(imgFp) !== -1) {
        return humanObserve;
      }
      return img.charAt(0).toUpperCase() + img.slice(1) +
        ' Con el tiempo, puede que ' + cityName + ' confirme o matice lo que el cuerpo ya intuía.';
    }
    return humanObserve;
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

  function humanizePresenceSpine(text) {
    if (!text) return '';
    var t = String(text);
    t = t.replace(/\bHay algo en ([^,]+) que toca/gi, 'Quizá en $1 notes algo que toca');
    t = t.replace(/\bHay algo en ([^,]+) que habla/gi, 'Quizá en $1 notes algo que habla');
    t = t.replace(/\bel lugar favorece\b/gi, 'puede que notes que se abre');
    t = t.replace(/\bel entorno activa\b/gi, 'puede que notes que se activa');
    t = t.replace(/\bla ciudad ofrece\b/gi, 'quizá te encuentres con');
    t = t.replace(/\bla energía impulsa\b/gi, 'puede que notes un impulso');
    return t;
  }

  function buildNarrativeSummary(cityName, goalId, humanTheme, rhythmLine) {
    var goalPhrase = {
      amor: 'el amor y el vínculo',
      trabajo: 'el trabajo y el propósito',
      descanso: 'el descanso y el cuerpo'
    }[goalId] || goalId;

    var themeCore = humanTheme
      .replace(/^En [^,]+, /, '')
      .replace(/^Quizá en [^,]+ notes /, '')
      .replace(/^Puede que en [^,]+ sientas /, '')
      .replace(/^Tal vez en [^,]+ notes /, '');

    if (rhythmLine) {
      return rhythmLine + ' Quizá, leyendo ' + cityName + ' desde ' + goalPhrase + ', notes esto: ' +
        lcfirst(themeCore);
    }
    return 'Quizá en ' + cityName + ', leyendo desde ' + goalPhrase + ', notes esto: ' + lcfirst(themeCore);
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

    var seed = hash32(
      cityName + '|' + goalId + '|' + deepKeys.join(',') + '|' + echoKeys.join(',')
    );

    var cityAtm = buildCityAtmosphere(cityName, goalId, seed);

    var humanTheme = humanizeTheme(dominantTheme, goalId, cityName);
    if (cityAtm && cityAtm.goalTone) {
      humanTheme = cityAtm.goalTone;
    }
    var humanConflict = humanizeConflict(centralTension, goalId, cityName);
    var humanOpportunity = humanizeOpportunity(mainOpportunity, goalId);
    var humanOpportunityAction = humanizeOpportunityAction(mainOpportunity, goalId);
    var humanObserve = weaveAtmosphereObserve(humanizeObserve(goalId, cityName), cityAtm, goalId, cityName);
    var humanClosing = humanizeClosing(goalId, cityName);
    var narrativeSummary = buildNarrativeSummary(
      cityName, goalId, humanTheme, cityAtm ? cityAtm.rhythm : ''
    );

    var narrativeContext = {
      dominantTheme: dominantTheme,
      centralTension: centralTension,
      mainOpportunity: mainOpportunity,
      humanTheme: humanizePresenceSpine(humanTheme),
      humanConflict: humanizePresenceSpine(humanConflict),
      humanOpportunity: humanizePresenceSpine(humanOpportunity),
      humanOpportunityAction: humanizePresenceSpine(humanOpportunityAction),
      humanObserve: humanizePresenceSpine(humanObserve),
      humanClosing: humanizePresenceSpine(humanClosing),
      guidingQuestion: guidingQuestion,
      deepInfluenceKeys: deepKeys,
      echoInfluenceKeys: echoKeys,
      narrativeSummary: humanizePresenceSpine(narrativeSummary)
    };

    if (cityAtm) {
      narrativeContext.cityAtmosphere = cityAtm;
      narrativeContext.cityRhythm = cityAtm.rhythm;
      narrativeContext.cityEmotionalTexture = cityAtm.emotionalTexture;
      narrativeContext.cityGoalTone = cityAtm.goalTone;
      narrativeContext.cityImages = cityAtm.images;
      narrativeContext.atmosphereWarnings = cityAtm.warnings;
    }

    var rulesFired = [
      'deep_influences_' + deepKeys.length,
      'editorial_humanization',
      'voice_beauty_polish',
      'human_presence_spine'
    ];
    if (cityAtm) rulesFired.push('city_atmosphere_' + cityAtm.citySlug);
    rulesFired.push(dominantTheme.sourceDoc, centralTension.sourceDoc, mainOpportunity.sourceDoc);

    return {
      ok: true,
      narrativeContext: narrativeContext,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        goalId: goalId,
        cityName: cityName,
        citySlug: cityAtm ? cityAtm.citySlug : null,
        deterministicSeed: seed,
        primaryInfluenceKey: primaryKey,
        rulesFired: rulesFired
      }
    };
  }

  window.KairosNarrativeIntelligence = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MAX_DEEP: MAX_DEEP,
    THEME_ES: THEME_ES,
    deriveNarrativeContext: deriveNarrativeContext,
    GLOBAL_TOURISM_TOKENS: GLOBAL_TOURISM_TOKENS,
    _dev: {
      GOAL_OBJECTIVE_IDS: GOAL_OBJECTIVE_IDS,
      GUIDING_QUESTIONS: GUIDING_QUESTIONS,
      CITY_ATMOSPHERE_INDEX: CITY_ATMOSPHERE_INDEX,
      resolveCitySlug: resolveCitySlug,
      pickAtmosphere: pickAtmosphere,
      buildCityAtmosphere: buildCityAtmosphere
    }
  };
})();
