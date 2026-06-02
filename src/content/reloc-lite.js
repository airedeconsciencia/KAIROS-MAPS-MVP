/**
 * KAIROS MAPS — Reloc Lite content layer (Fase 3.7b.2 scaffold)
 *
 * Fragmentos editoriales para cambios de ángulo al vivir en otro lugar.
 * NO render producto. NO IA. NO motores.
 *
 * Voz: docs/voice_tone.txt
 * Editorial: docs/product/RELOCATION_EDITORIAL_BRIEF.md
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.1.0-pilot';

  var ELEMENTS = ['fire', 'earth', 'air', 'water'];
  var ROLES = ['ASC', 'MC', 'IC', 'DC'];

  var ELEMENT_LABELS = {
    fire: 'fuego',
    earth: 'tierra',
    air: 'aire',
    water: 'agua'
  };

  var FRAGMENTS = {
    RELOC_ASC_TO_FIRE: {
      id: 'RELOC_ASC_TO_FIRE',
      role: 'ASC',
      condition: { angle: 'ASC', element: 'fire' },
      headline: 'Aquí tu forma de entrar al mundo puede volverse más directa y visible.',
      body: 'El Ascendente relocado en un signo de fuego tiende a acelerar la primera impresión: puede activarse más iniciativa, más impulso por actuar antes de pensarlo todo. Conviene observar si el ritmo del lugar te pide salir antes o mostrarte con más franqueza.',
      bridge: 'En el mapa, líneas que intensifican iniciativa o visibilidad pueden resonar distinto con esta entrada al entorno.',
      semanticTags: ['initiative', 'movement', 'visibility', 'stimulation'],
      bridgeTags: ['initiative', 'movement', 'visibility'],
      cautionTags: ['reserve', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_TO_AIR: {
      id: 'RELOC_ASC_TO_AIR',
      role: 'ASC',
      condition: { angle: 'ASC', element: 'air' },
      headline: 'Aquí podría abrirse una forma más ligera de relacionarte y moverte.',
      body: 'Un Ascendente relocado en aire suele favorecer la circulación social y mental: más intercambio, más curiosidad por el entorno, más necesidad de dialogar para ubicarte. No es superficialidad automática; puede ser una puerta distinta hacia lo que te representa.',
      bridge: 'Lugares del mapa ligados a comunicación o movimiento pueden amplificar esta sensación de apertura relacional.',
      semanticTags: ['communication', 'harmony', 'movement', 'stimulation'],
      bridgeTags: ['communication', 'harmony', 'movement'],
      cautionTags: ['control', 'reserve'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_TO_WATER: {
      id: 'RELOC_ASC_TO_WATER',
      role: 'ASC',
      condition: { angle: 'ASC', element: 'water' },
      headline: 'Aquí tu presencia puede volverse más receptiva y emocionalmente permeable.',
      body: 'El Ascendente relocado en agua tiende a suavizar la armadura: puede activarse más intuición, más lectura del clima emocional del lugar. Conviene observar qué límites necesitas para no absorberte del entorno.',
      bridge: 'En el mapa, temas de intimidad o seguridad emocional pueden sentirse más presentes al explorar ciudades.',
      semanticTags: ['emotional_safety', 'intimacy', 'permeability', 'belonging'],
      bridgeTags: ['emotional_safety', 'intimacy', 'belonging'],
      cautionTags: ['visibility', 'initiative'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_TO_EARTH: {
      id: 'RELOC_ASC_TO_EARTH',
      role: 'ASC',
      condition: { angle: 'ASC', element: 'earth' },
      headline: 'Aquí podrías mostrarte con más calma, concreción y sentido de continuidad.',
      body: 'Un Ascendente relocado en tierra suele pedir ritmo más pausado: estabilizar, comprobar, anclar la experiencia antes de cambiar de registro. Puede ayudarte a construir presencia sólida, no necesariamente cerrada.',
      bridge: 'Entornos del mapa que piden pertenencia o regulación pueden dialogar con esta forma de habitar el lugar.',
      semanticTags: ['belonging', 'regulation', 'protection', 'precision'],
      bridgeTags: ['belonging', 'regulation', 'protection'],
      cautionTags: ['movement', 'stimulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_TO_FIRE: {
      id: 'RELOC_MC_TO_FIRE',
      role: 'MC',
      condition: { angle: 'MC', element: 'fire' },
      headline: 'Aquí tu dirección pública puede orientarse hacia más visibilidad y acción.',
      body: 'El Medio Cielo relocado en fuego tiende a activar metas más visibles: puede impulsarte a ocupar espacio profesional o social con más audacia. Conviene observar si el lugar premia el impulso o exige contención.',
      bridge: 'Líneas de MC o visibilidad en el mapa pueden reforzar esta sensación de exposición o propósito activo.',
      semanticTags: ['visibility', 'initiative', 'expansion', 'recognition'],
      bridgeTags: ['visibility', 'initiative', 'expansion'],
      cautionTags: ['reflection', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_TO_EARTH: {
      id: 'RELOC_MC_TO_EARTH',
      role: 'MC',
      condition: { angle: 'MC', element: 'earth' },
      headline: 'Aquí la dirección vital puede volverse más práctica, estructurada y orientada a resultados.',
      body: 'Un Medio Cielo relocado en tierra suele acercar metas al terreno concreto: construir reputación, sostener proyectos, demostrar con hechos. Puede favorecer una ambición más paciente que espectacular.',
      bridge: 'Temas de reconocimiento o regulación en el mapa pueden alinearse con esta búsqueda de solidez profesional.',
      semanticTags: ['visibility', 'regulation', 'recognition', 'precision'],
      bridgeTags: ['visibility', 'regulation', 'recognition'],
      cautionTags: ['expansion', 'permeability'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_TO_WATER: {
      id: 'RELOC_IC_TO_WATER',
      role: 'IC',
      condition: { angle: 'IC', element: 'water' },
      headline: 'Aquí el descanso y la vida privada pueden volverse más profundos y emocionales.',
      body: 'El Fondo del Cielo relocado en agua tiende a intensificar la capa íntima: hogar, memoria, necesidad de refugio emocional. Puede activarse más sensibilidad al clima doméstico del lugar.',
      bridge: 'Líneas IC o temas de raíz en el mapa pueden resonar con esta búsqueda de refugio interno.',
      semanticTags: ['emotional_safety', 'belonging', 'protection', 'intimacy'],
      bridgeTags: ['emotional_safety', 'belonging', 'protection'],
      cautionTags: ['visibility', 'initiative'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_TO_AIR: {
      id: 'RELOC_DC_TO_AIR',
      role: 'DC',
      condition: { angle: 'DC', element: 'air' },
      headline: 'Aquí los vínculos pueden activarse a través del diálogo y la movilidad social.',
      body: 'El Descendente relocado en aire suele abrir relaciones desde el intercambio: conversación, acuerdos, encuentros que circulan. Puede favorecer vínculos más ligeros o intelectualmente estimulantes, no necesariamente menos profundos.',
      bridge: 'Líneas DC o de comunicación en el mapa pueden amplificar esta forma de encontrar al otro en el lugar.',
      semanticTags: ['communication', 'harmony', 'intimacy', 'movement'],
      bridgeTags: ['communication', 'harmony', 'intimacy'],
      cautionTags: ['control', 'intensity'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    }
  };

  var INDEX = {
    ASC: {
      fire: 'RELOC_ASC_TO_FIRE',
      air: 'RELOC_ASC_TO_AIR',
      water: 'RELOC_ASC_TO_WATER',
      earth: 'RELOC_ASC_TO_EARTH'
    },
    MC: {
      fire: 'RELOC_MC_TO_FIRE',
      earth: 'RELOC_MC_TO_EARTH'
    },
    IC: {
      water: 'RELOC_IC_TO_WATER'
    },
    DC: {
      air: 'RELOC_DC_TO_AIR'
    }
  };

  var PILOT_IDS = [
    'RELOC_ASC_TO_FIRE',
    'RELOC_ASC_TO_AIR',
    'RELOC_ASC_TO_WATER',
    'RELOC_ASC_TO_EARTH',
    'RELOC_MC_TO_FIRE',
    'RELOC_MC_TO_EARTH',
    'RELOC_IC_TO_WATER',
    'RELOC_DC_TO_AIR'
  ];

  function normalizeAngle(raw) {
    if (raw == null) return null;
    var key = String(raw).trim().toUpperCase();
    if (key === 'AC') return 'ASC';
    return key;
  }

  function normalizeElement(raw) {
    if (raw == null) return null;
    return String(raw).trim().toLowerCase();
  }

  function getFragment(id) {
    if (!id || !FRAGMENTS[id]) return null;
    return FRAGMENTS[id];
  }

  function findFragment(query) {
    if (!query || typeof query !== 'object') return null;
    if (query.id) return getFragment(query.id);

    var angle = normalizeAngle(query.angle || query.role);
    var element = normalizeElement(query.element);
    if (!angle || !element) return null;
    if (ROLES.indexOf(angle) === -1) return null;
    if (ELEMENTS.indexOf(element) === -1) return null;

    var id = INDEX[angle] && INDEX[angle][element];
    return id ? getFragment(id) : null;
  }

  function listFragments() {
    return Object.keys(FRAGMENTS).map(function (id) {
      var f = FRAGMENTS[id];
      return {
        id: f.id,
        role: f.role,
        element: f.condition && f.condition.element,
        headline: f.headline
      };
    }).sort(function (a, b) {
      return a.id.localeCompare(b.id);
    });
  }

  function inspectCoverage() {
    var missingPilot = PILOT_IDS.filter(function (id) {
      return !FRAGMENTS[id];
    });
    var byRole = {};
    ROLES.forEach(function (role) {
      var entries = INDEX[role] || {};
      byRole[role] = {
        elements: Object.keys(entries).sort(),
        fragmentIds: Object.keys(entries).map(function (el) { return entries[el]; }).sort()
      };
    });

    return {
      ok: missingPilot.length === 0 && Object.keys(FRAGMENTS).length >= 8,
      totalFragments: Object.keys(FRAGMENTS).length,
      pilotExpected: PILOT_IDS.length,
      pilotPresent: PILOT_IDS.length - missingPilot.length,
      missingPilot: missingPilot,
      pilotIds: PILOT_IDS.slice(),
      byRole: byRole,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        elements: ELEMENTS.slice(),
        roles: ROLES.slice()
      }
    };
  }

  window.KairosRelocLite = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ELEMENTS: ELEMENTS,
    ROLES: ROLES,
    FRAGMENTS: FRAGMENTS,
    INDEX: INDEX,
    getFragment: getFragment,
    findFragment: findFragment,
    listFragments: listFragments,
    inspectCoverage: inspectCoverage,
    normalizeAngle: normalizeAngle,
    normalizeElement: normalizeElement
  };
})();
