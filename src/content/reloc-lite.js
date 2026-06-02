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

  var SCHEMA_VERSION = '0.2.0-matrix';

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
    RELOC_MC_TO_AIR: {
      id: 'RELOC_MC_TO_AIR',
      role: 'MC',
      condition: { angle: 'MC', element: 'air' },
      headline: 'Aquí tu vocación pública puede orientarse hacia el intercambio y la visibilidad intelectual.',
      body: 'Un Medio Cielo relocado en aire tiende a abrir metas mediante contacto, red y comunicación: puede activarse más necesidad de ser leído, escuchado o reconocido por ideas. Conviene observar si el lugar premia la versatilidad sobre la continuidad.',
      bridge: 'Líneas de MC o comunicación en el mapa pueden resonar con esta dirección más móvil.',
      semanticTags: ['communication', 'visibility', 'recognition', 'stimulation'],
      bridgeTags: ['communication', 'visibility', 'recognition'],
      cautionTags: ['regulation', 'protection'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_TO_WATER: {
      id: 'RELOC_MC_TO_WATER',
      role: 'MC',
      condition: { angle: 'MC', element: 'water' },
      headline: 'Aquí la dirección vital puede volverse más intuitiva y sensible al clima emocional del entorno.',
      body: 'El Medio Cielo relocado en agua suele acercar metas a lo que se siente útil o significativo, no solo a lo que se impone. Puede activarse más empatía profesional o una imagen pública más receptiva.',
      bridge: 'Temas de intimidad o seguridad emocional en el mapa pueden dialogar con esta vocación más permeable.',
      semanticTags: ['emotional_safety', 'intimacy', 'recognition', 'permeability'],
      bridgeTags: ['emotional_safety', 'intimacy', 'recognition'],
      cautionTags: ['visibility', 'initiative'],
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
    RELOC_IC_TO_FIRE: {
      id: 'RELOC_IC_TO_FIRE',
      role: 'IC',
      condition: { angle: 'IC', element: 'fire' },
      headline: 'Aquí la vida privada puede volverse más activa y menos contenida.',
      body: 'Un Fondo del Cielo relocado en fuego tiende a calentar el espacio íntimo: puede haber más movimiento en casa, más necesidad de acción incluso en la esfera personal. Conviene observar si el lugar te permite descansar o te mantiene en alerta.',
      bridge: 'Temas de iniciativa o movimiento en el mapa pueden cruzarse con esta capa doméstica más dinámica.',
      semanticTags: ['initiative', 'movement', 'protection', 'stimulation'],
      bridgeTags: ['initiative', 'movement', 'protection'],
      cautionTags: ['emotional_safety', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_TO_AIR: {
      id: 'RELOC_IC_TO_AIR',
      role: 'IC',
      condition: { angle: 'IC', element: 'air' },
      headline: 'Aquí el hogar interior puede volverse más abierto, social y mentalmente activo.',
      body: 'El Fondo del Cielo relocado en aire suele ligar la intimidad al intercambio: visitas, conversación en casa, necesidad de aire fresco en la rutina. Puede favorecer un refugio menos cerrado que en otros lugares.',
      bridge: 'Líneas IC o de comunicación en el mapa pueden amplificar esta sensación de vida privada más permeable.',
      semanticTags: ['communication', 'belonging', 'movement', 'stimulation'],
      bridgeTags: ['communication', 'belonging', 'movement'],
      cautionTags: ['protection', 'reserve'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_TO_EARTH: {
      id: 'RELOC_IC_TO_EARTH',
      role: 'IC',
      condition: { angle: 'IC', element: 'earth' },
      headline: 'Aquí la base íntima puede orientarse hacia estabilidad, rutina y arraigo concreto.',
      body: 'Un Fondo del Cielo relocado en tierra tiende a pedir estructura doméstica: orden, continuidad, sensación de suelo bajo los pies. Puede activarse más necesidad de construir hogar paso a paso.',
      bridge: 'Temas de pertenencia o regulación en el mapa pueden reforzar esta búsqueda de estabilidad interna.',
      semanticTags: ['belonging', 'regulation', 'protection', 'precision'],
      bridgeTags: ['belonging', 'regulation', 'protection'],
      cautionTags: ['movement', 'stimulation'],
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
    },
    RELOC_DC_TO_FIRE: {
      id: 'RELOC_DC_TO_FIRE',
      role: 'DC',
      condition: { angle: 'DC', element: 'fire' },
      headline: 'Aquí las relaciones pueden volverse más directas, intensas y orientadas a la acción.',
      body: 'Un Descendente relocado en fuego tiende a acelerar el encuentro: puede activarse más franqueza, más chispa, más impulso por definir vínculos con claridad. Conviene observar si el ritmo relacional del lugar te conviene.',
      bridge: 'Líneas DC o de iniciativa en el mapa pueden intensificar esta forma de vincular.',
      semanticTags: ['initiative', 'intimacy', 'movement', 'intensity'],
      bridgeTags: ['initiative', 'intimacy', 'movement'],
      cautionTags: ['harmony', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_TO_WATER: {
      id: 'RELOC_DC_TO_WATER',
      role: 'DC',
      condition: { angle: 'DC', element: 'water' },
      headline: 'Aquí los vínculos pueden volverse más profundos, emocionales y permeables.',
      body: 'El Descendente relocado en agua suele abrir relaciones desde la empatía: puede activarse más necesidad de sentir al otro, de cuidar o ser cuidado. Conviene observar qué límites necesitas para no fusionarte.',
      bridge: 'Temas de intimidad o seguridad emocional en el mapa pueden resonar con esta capa relacional.',
      semanticTags: ['intimacy', 'emotional_safety', 'harmony', 'permeability'],
      bridgeTags: ['intimacy', 'emotional_safety', 'harmony'],
      cautionTags: ['control', 'visibility'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_TO_EARTH: {
      id: 'RELOC_DC_TO_EARTH',
      role: 'DC',
      condition: { angle: 'DC', element: 'earth' },
      headline: 'Aquí las relaciones pueden orientarse hacia la lealtad, la concreción y la continuidad.',
      body: 'Un Descendente relocado en tierra tiende a favorecer vínculos estables: acuerdos claros, presencia constante, construcción paciente. Puede activarse más necesidad de demostrar con hechos en la pareja o en alianzas.',
      bridge: 'Líneas DC o de pertenencia en el mapa pueden alinearse con esta búsqueda de solidez relacional.',
      semanticTags: ['belonging', 'harmony', 'protection', 'regulation'],
      bridgeTags: ['belonging', 'harmony', 'protection'],
      cautionTags: ['movement', 'stimulation'],
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
      air: 'RELOC_MC_TO_AIR',
      water: 'RELOC_MC_TO_WATER',
      earth: 'RELOC_MC_TO_EARTH'
    },
    IC: {
      fire: 'RELOC_IC_TO_FIRE',
      air: 'RELOC_IC_TO_AIR',
      water: 'RELOC_IC_TO_WATER',
      earth: 'RELOC_IC_TO_EARTH'
    },
    DC: {
      fire: 'RELOC_DC_TO_FIRE',
      air: 'RELOC_DC_TO_AIR',
      water: 'RELOC_DC_TO_WATER',
      earth: 'RELOC_DC_TO_EARTH'
    }
  };

  var MATRIX_IDS = [];
  ROLES.forEach(function (role) {
    ELEMENTS.forEach(function (element) {
      MATRIX_IDS.push('RELOC_' + role + '_TO_' + element.toUpperCase());
    });
  });

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
    var missingMatrix = MATRIX_IDS.filter(function (id) {
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

    var matrixPresent = MATRIX_IDS.length - missingMatrix.length;
    var matrixPercent = Math.round((matrixPresent / MATRIX_IDS.length) * 100);

    return {
      ok: missingMatrix.length === 0 && Object.keys(FRAGMENTS).length === 16,
      totalFragments: Object.keys(FRAGMENTS).length,
      matrixExpected: MATRIX_IDS.length,
      matrixPresent: matrixPresent,
      matrixPercent: matrixPercent,
      missingMatrix: missingMatrix,
      matrixIds: MATRIX_IDS.slice(),
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
    MATRIX_IDS: MATRIX_IDS,
    getFragment: getFragment,
    findFragment: findFragment,
    listFragments: listFragments,
    inspectCoverage: inspectCoverage,
    normalizeAngle: normalizeAngle,
    normalizeElement: normalizeElement
  };
})();
