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

  var SCHEMA_VERSION = '0.3.0-delta-presence';

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
    },
    RELOC_ASC_PRESENT_FIRE: {
      id: 'RELOC_ASC_PRESENT_FIRE',
      role: 'ASC',
      fragmentType: 'presence',
      condition: { angle: 'ASC', element: 'fire', mode: 'presence' },
      headline: 'Aquí tu forma de entrar al mundo en este lugar se expresa desde el fuego.',
      body: 'El Ascendente relocado en fuego sigue activando iniciativa y visibilidad aunque no cambie de signo respecto a tu carta natal. Puede notarse más impulso por mostrarte con franqueza en el entorno.',
      bridge: 'Líneas de iniciativa o movimiento en el mapa pueden resonar con esta entrada al lugar.',
      semanticTags: ['initiative', 'movement', 'visibility', 'stimulation'],
      bridgeTags: ['initiative', 'movement', 'visibility'],
      cautionTags: ['reserve', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_PRESENT_AIR: {
      id: 'RELOC_ASC_PRESENT_AIR',
      role: 'ASC',
      fragmentType: 'presence',
      condition: { angle: 'ASC', element: 'air', mode: 'presence' },
      headline: 'Aquí tu forma de entrar al mundo en este lugar se expresa desde el aire.',
      body: 'El Ascendente relocado en aire sigue favoreciendo circulación social y mental aunque el signo no varíe respecto al natal. Puede activarse más necesidad de dialogar para ubicarte.',
      bridge: 'Temas de comunicación o movimiento en el mapa pueden amplificar esta apertura relacional.',
      semanticTags: ['communication', 'harmony', 'movement', 'stimulation'],
      bridgeTags: ['communication', 'harmony', 'movement'],
      cautionTags: ['control', 'reserve'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_PRESENT_WATER: {
      id: 'RELOC_ASC_PRESENT_WATER',
      role: 'ASC',
      fragmentType: 'presence',
      condition: { angle: 'ASC', element: 'water', mode: 'presence' },
      headline: 'Aquí tu forma de entrar al mundo en este lugar se expresa desde el agua.',
      body: 'El Ascendente relocado en agua mantiene una presencia receptiva y emocionalmente permeable en este territorio. Puede activarse más lectura del clima afectivo del entorno.',
      bridge: 'Líneas de intimidad o seguridad emocional en el mapa pueden dialogar con esta entrada.',
      semanticTags: ['emotional_safety', 'intimacy', 'permeability', 'belonging'],
      bridgeTags: ['emotional_safety', 'intimacy', 'belonging'],
      cautionTags: ['visibility', 'initiative'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_ASC_PRESENT_EARTH: {
      id: 'RELOC_ASC_PRESENT_EARTH',
      role: 'ASC',
      fragmentType: 'presence',
      condition: { angle: 'ASC', element: 'earth', mode: 'presence' },
      headline: 'Aquí tu forma de entrar al mundo en este lugar se expresa desde la tierra.',
      body: 'El Ascendente relocado en tierra sigue pidiendo ritmo pausado y presencia concreta aunque el signo se mantenga. Puede favorecer anclaje y continuidad en la forma de habitar el lugar.',
      bridge: 'Temas de pertenencia o regulación en el mapa pueden alinearse con esta entrada estable.',
      semanticTags: ['belonging', 'regulation', 'protection', 'precision'],
      bridgeTags: ['belonging', 'regulation', 'protection'],
      cautionTags: ['movement', 'stimulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_PRESENT_FIRE: {
      id: 'RELOC_MC_PRESENT_FIRE',
      role: 'MC',
      fragmentType: 'presence',
      condition: { angle: 'MC', element: 'fire', mode: 'presence' },
      headline: 'Aquí la dirección vital en este lugar se articula desde el fuego.',
      body: 'El Medio Cielo relocado en fuego sigue orientando metas hacia visibilidad e impulso aunque no haya cambio de signo frente al natal. Puede activarse más iniciativa en lo público.',
      bridge: 'Líneas de MC o iniciativa en el mapa pueden intensificar esta vocación.',
      semanticTags: ['visibility', 'initiative', 'recognition', 'movement'],
      bridgeTags: ['visibility', 'initiative', 'recognition'],
      cautionTags: ['regulation', 'reserve'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_PRESENT_AIR: {
      id: 'RELOC_MC_PRESENT_AIR',
      role: 'MC',
      fragmentType: 'presence',
      condition: { angle: 'MC', element: 'air', mode: 'presence' },
      headline: 'Aquí la dirección vital en este lugar se articula desde el aire.',
      body: 'El Medio Cielo relocado en aire mantiene metas ligadas al intercambio y la visibilidad intelectual en este territorio. Puede activarse más necesidad de ser leído o escuchado.',
      bridge: 'Líneas de comunicación o MC en el mapa pueden resonar con esta dirección móvil.',
      semanticTags: ['communication', 'visibility', 'recognition', 'stimulation'],
      bridgeTags: ['communication', 'visibility', 'recognition'],
      cautionTags: ['regulation', 'protection'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_PRESENT_WATER: {
      id: 'RELOC_MC_PRESENT_WATER',
      role: 'MC',
      fragmentType: 'presence',
      condition: { angle: 'MC', element: 'water', mode: 'presence' },
      headline: 'Aquí la dirección vital en este lugar se articula desde el agua.',
      body: 'El Medio Cielo relocado en agua sigue acercando metas a lo significativo y emocionalmente útil, aunque el signo no cambie respecto a tu origen. Puede activarse más empatía profesional o imagen receptiva.',
      bridge: 'Temas de intimidad o seguridad emocional en el mapa pueden dialogar con esta vocación permeable.',
      semanticTags: ['emotional_safety', 'intimacy', 'recognition', 'permeability'],
      bridgeTags: ['emotional_safety', 'intimacy', 'recognition'],
      cautionTags: ['visibility', 'initiative'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_MC_PRESENT_EARTH: {
      id: 'RELOC_MC_PRESENT_EARTH',
      role: 'MC',
      fragmentType: 'presence',
      condition: { angle: 'MC', element: 'earth', mode: 'presence' },
      headline: 'Aquí la dirección vital en este lugar se articula desde la tierra.',
      body: 'El Medio Cielo relocado en tierra mantiene metas orientadas a resultados concretos y continuidad en este lugar. Puede favorecer ambición paciente y reputación sólida.',
      bridge: 'Temas de reconocimiento o regulación en el mapa pueden alinearse con esta búsqueda de solidez.',
      semanticTags: ['visibility', 'regulation', 'recognition', 'precision'],
      bridgeTags: ['visibility', 'regulation', 'recognition'],
      cautionTags: ['expansion', 'permeability'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_PRESENT_FIRE: {
      id: 'RELOC_IC_PRESENT_FIRE',
      role: 'IC',
      fragmentType: 'presence',
      condition: { angle: 'IC', element: 'fire', mode: 'presence' },
      headline: 'Aquí la vida privada en este lugar se sostiene desde el fuego.',
      body: 'El Fondo del Cielo relocado en fuego sigue calentando la esfera íntima aunque el signo permanezca igual que en el natal. Puede haber más movimiento o alerta en lo doméstico.',
      bridge: 'Temas de iniciativa o movimiento en el mapa pueden cruzarse con esta capa personal.',
      semanticTags: ['initiative', 'movement', 'protection', 'stimulation'],
      bridgeTags: ['initiative', 'movement', 'protection'],
      cautionTags: ['emotional_safety', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_PRESENT_AIR: {
      id: 'RELOC_IC_PRESENT_AIR',
      role: 'IC',
      fragmentType: 'presence',
      condition: { angle: 'IC', element: 'air', mode: 'presence' },
      headline: 'Aquí la vida privada en este lugar se sostiene desde el aire.',
      body: 'El Fondo del Cielo relocado en aire mantiene la intimidad ligada al intercambio y la circulación en casa. Puede favorecer un refugio menos cerrado en este territorio.',
      bridge: 'Líneas IC o de comunicación en el mapa pueden amplificar esta vida privada permeable.',
      semanticTags: ['communication', 'belonging', 'movement', 'stimulation'],
      bridgeTags: ['communication', 'belonging', 'movement'],
      cautionTags: ['protection', 'reserve'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_PRESENT_WATER: {
      id: 'RELOC_IC_PRESENT_WATER',
      role: 'IC',
      fragmentType: 'presence',
      condition: { angle: 'IC', element: 'water', mode: 'presence' },
      headline: 'Aquí la vida privada en este lugar se sostiene desde el agua.',
      body: 'El Fondo del Cielo relocado en agua sigue intensificando hogar, memoria y refugio emocional aunque no cambie el signo natal. Puede activarse más sensibilidad al clima doméstico.',
      bridge: 'Líneas IC o temas de raíz en el mapa pueden resonar con esta capa íntima.',
      semanticTags: ['emotional_safety', 'belonging', 'protection', 'intimacy'],
      bridgeTags: ['emotional_safety', 'belonging', 'protection'],
      cautionTags: ['visibility', 'initiative'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_IC_PRESENT_EARTH: {
      id: 'RELOC_IC_PRESENT_EARTH',
      role: 'IC',
      fragmentType: 'presence',
      condition: { angle: 'IC', element: 'earth', mode: 'presence' },
      headline: 'Aquí la vida privada en este lugar se sostiene desde la tierra.',
      body: 'El Fondo del Cielo relocado en tierra mantiene la base íntima orientada a estabilidad, rutina y arraigo concreto en este lugar. Puede activarse más necesidad de construir hogar paso a paso.',
      bridge: 'Temas de pertenencia o regulación en el mapa pueden reforzar esta estabilidad interna.',
      semanticTags: ['belonging', 'regulation', 'protection', 'precision'],
      bridgeTags: ['belonging', 'regulation', 'protection'],
      cautionTags: ['movement', 'stimulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_PRESENT_FIRE: {
      id: 'RELOC_DC_PRESENT_FIRE',
      role: 'DC',
      fragmentType: 'presence',
      condition: { angle: 'DC', element: 'fire', mode: 'presence' },
      headline: 'Aquí los vínculos en este lugar se mueven desde el fuego.',
      body: 'El Descendente relocado en fuego sigue acelerando el encuentro con franqueza e intensidad aunque el signo no varíe. Puede activarse más impulso por definir vínculos con claridad.',
      bridge: 'Líneas DC o de iniciativa en el mapa pueden intensificar esta forma relacional.',
      semanticTags: ['initiative', 'intimacy', 'movement', 'intensity'],
      bridgeTags: ['initiative', 'intimacy', 'movement'],
      cautionTags: ['harmony', 'regulation'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_PRESENT_AIR: {
      id: 'RELOC_DC_PRESENT_AIR',
      role: 'DC',
      fragmentType: 'presence',
      condition: { angle: 'DC', element: 'air', mode: 'presence' },
      headline: 'Aquí los vínculos en este lugar se mueven desde el aire.',
      body: 'El Descendente relocado en aire mantiene relaciones abiertas al diálogo y la movilidad social en este territorio. Puede favorecer vínculos estimulantes sin perder profundidad.',
      bridge: 'Líneas DC o de comunicación en el mapa pueden amplificar esta forma de encontrar al otro.',
      semanticTags: ['communication', 'harmony', 'intimacy', 'movement'],
      bridgeTags: ['communication', 'harmony', 'intimacy'],
      cautionTags: ['control', 'intensity'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_PRESENT_WATER: {
      id: 'RELOC_DC_PRESENT_WATER',
      role: 'DC',
      fragmentType: 'presence',
      condition: { angle: 'DC', element: 'water', mode: 'presence' },
      headline: 'Aquí los vínculos en este lugar se mueven desde el agua.',
      body: 'El Descendente relocado en agua sigue abriendo relaciones desde la empatía y la permeabilidad aunque el signo se mantenga. Puede activarse más necesidad de cuidar límites.',
      bridge: 'Temas de intimidad o seguridad emocional en el mapa pueden resonar con esta capa relacional.',
      semanticTags: ['intimacy', 'emotional_safety', 'harmony', 'permeability'],
      bridgeTags: ['intimacy', 'emotional_safety', 'harmony'],
      cautionTags: ['control', 'visibility'],
      sourceRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'voice_tone.txt']
    },
    RELOC_DC_PRESENT_EARTH: {
      id: 'RELOC_DC_PRESENT_EARTH',
      role: 'DC',
      fragmentType: 'presence',
      condition: { angle: 'DC', element: 'earth', mode: 'presence' },
      headline: 'Aquí los vínculos en este lugar se mueven desde la tierra.',
      body: 'El Descendente relocado en tierra mantiene vínculos orientados a lealtad, acuerdos claros y continuidad en este lugar. Puede activarse más necesidad de demostrar con hechos.',
      bridge: 'Líneas DC o de pertenencia en el mapa pueden alinearse con esta solidez relacional.',
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

  var PRESENCE_INDEX = {
    ASC: {
      fire: 'RELOC_ASC_PRESENT_FIRE',
      air: 'RELOC_ASC_PRESENT_AIR',
      water: 'RELOC_ASC_PRESENT_WATER',
      earth: 'RELOC_ASC_PRESENT_EARTH'
    },
    MC: {
      fire: 'RELOC_MC_PRESENT_FIRE',
      air: 'RELOC_MC_PRESENT_AIR',
      water: 'RELOC_MC_PRESENT_WATER',
      earth: 'RELOC_MC_PRESENT_EARTH'
    },
    IC: {
      fire: 'RELOC_IC_PRESENT_FIRE',
      air: 'RELOC_IC_PRESENT_AIR',
      water: 'RELOC_IC_PRESENT_WATER',
      earth: 'RELOC_IC_PRESENT_EARTH'
    },
    DC: {
      fire: 'RELOC_DC_PRESENT_FIRE',
      air: 'RELOC_DC_PRESENT_AIR',
      water: 'RELOC_DC_PRESENT_WATER',
      earth: 'RELOC_DC_PRESENT_EARTH'
    }
  };

  var MATRIX_IDS = [];
  var PRESENCE_MATRIX_IDS = [];
  ROLES.forEach(function (role) {
    ELEMENTS.forEach(function (element) {
      MATRIX_IDS.push('RELOC_' + role + '_TO_' + element.toUpperCase());
      PRESENCE_MATRIX_IDS.push('RELOC_' + role + '_PRESENT_' + element.toUpperCase());
    });
  });

  function fragmentTypeOf(frag) {
    if (!frag) return null;
    if (frag.fragmentType) return frag.fragmentType;
    if (frag.id && frag.id.indexOf('_PRESENT_') !== -1) return 'presence';
    return 'delta';
  }

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
    if (query.id) {
      var byId = getFragment(query.id);
      if (byId && fragmentTypeOf(byId) === 'delta') return byId;
      if (query.id.indexOf('_PRESENT_') === -1) return byId;
      return null;
    }

    var angle = normalizeAngle(query.angle || query.role);
    var element = normalizeElement(query.element);
    if (!angle || !element) return null;
    if (ROLES.indexOf(angle) === -1) return null;
    if (ELEMENTS.indexOf(element) === -1) return null;

    var id = INDEX[angle] && INDEX[angle][element];
    return id ? getFragment(id) : null;
  }

  function findPresenceFragment(query) {
    if (!query || typeof query !== 'object') return null;
    if (query.id) {
      var byId = getFragment(query.id);
      if (byId && fragmentTypeOf(byId) === 'presence') return byId;
      return null;
    }

    var angle = normalizeAngle(query.angle || query.role);
    var element = normalizeElement(query.element);
    if (!angle || !element) return null;

    var id = PRESENCE_INDEX[angle] && PRESENCE_INDEX[angle][element];
    return id ? getFragment(id) : null;
  }

  function resolveFragmentForRole(opts) {
    if (!opts || typeof opts !== 'object') return null;
    var angle = normalizeAngle(opts.angle || opts.role);
    var element = normalizeElement(opts.element);
    var usePresence = opts.usePresence === true;

    if (!usePresence) {
      var deltaFrag = findFragment({ angle: angle, element: element });
      if (deltaFrag) {
        return { fragment: deltaFrag, fragmentType: 'delta', role: deltaFrag.role };
      }
    }

    var presenceFrag = findPresenceFragment({ angle: angle, element: element });
    if (presenceFrag) {
      return { fragment: presenceFrag, fragmentType: 'presence', role: presenceFrag.role };
    }

    return null;
  }

  function listFragments() {
    return Object.keys(FRAGMENTS).map(function (id) {
      var f = FRAGMENTS[id];
      return {
        id: f.id,
        role: f.role,
        fragmentType: fragmentTypeOf(f),
        element: f.condition && f.condition.element,
        headline: f.headline
      };
    }).sort(function (a, b) {
      return a.id.localeCompare(b.id);
    });
  }

  function inspectCoverage() {
    var missingDelta = MATRIX_IDS.filter(function (id) {
      return !FRAGMENTS[id];
    });
    var missingPresence = PRESENCE_MATRIX_IDS.filter(function (id) {
      return !FRAGMENTS[id];
    });
    var byRole = {};
    ROLES.forEach(function (role) {
      byRole[role] = {
        delta: Object.keys(INDEX[role] || {}).map(function (el) { return INDEX[role][el]; }).sort(),
        presence: Object.keys(PRESENCE_INDEX[role] || {}).map(function (el) {
          return PRESENCE_INDEX[role][el];
        }).sort()
      };
    });

    var deltaPresent = MATRIX_IDS.length - missingDelta.length;
    var presencePresent = PRESENCE_MATRIX_IDS.length - missingPresence.length;

    return {
      ok: missingDelta.length === 0 && missingPresence.length === 0,
      totalFragments: Object.keys(FRAGMENTS).length,
      deltaExpected: MATRIX_IDS.length,
      deltaPresent: deltaPresent,
      deltaPercent: Math.round((deltaPresent / MATRIX_IDS.length) * 100),
      presenceExpected: PRESENCE_MATRIX_IDS.length,
      presencePresent: presencePresent,
      presencePercent: Math.round((presencePresent / PRESENCE_MATRIX_IDS.length) * 100),
      missingDelta: missingDelta,
      missingPresence: missingPresence,
      matrixIds: MATRIX_IDS.slice(),
      presenceMatrixIds: PRESENCE_MATRIX_IDS.slice(),
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
    PRESENCE_INDEX: PRESENCE_INDEX,
    MATRIX_IDS: MATRIX_IDS,
    PRESENCE_MATRIX_IDS: PRESENCE_MATRIX_IDS,
    getFragment: getFragment,
    findFragment: findFragment,
    findPresenceFragment: findPresenceFragment,
    resolveFragmentForRole: resolveFragmentForRole,
    fragmentTypeOf: fragmentTypeOf,
    listFragments: listFragments,
    inspectCoverage: inspectCoverage,
    normalizeAngle: normalizeAngle,
    normalizeElement: normalizeElement
  };
})();
