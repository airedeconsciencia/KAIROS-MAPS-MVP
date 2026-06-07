/**
 * KAIROS MAPS — Country Archetypes (Fase 3.8f.2 pilot)
 *
 * Matiz cultural prudente · sin determinismo nacional · sin zodiac dogma.
 * Piloto: 10 países. Fail-soft fuera del índice.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8f.2-0.1';

  var PILOT_COUNTRY_IDS = [
    'portugal',
    'spain',
    'france',
    'united_kingdom',
    'italy',
    'japan',
    'brazil',
    'argentina',
    'south_africa',
    'canada'
  ];

  var INDEX = {
    portugal: {
      id: 'portugal',
      name: 'Portugal',
      region: 'Europa occidental',
      curated: true,
      symbolicResonance: [
        'Puede resonar con un tono de arraigo lento y presencia cotidiana.',
        'Se puede leer simbólicamente como vínculo que madura en lo pequeño.'
      ],
      planetaryResonance: [
        { planet: 'moon', note: 'Hipótesis: la Luna puede encontrar aquí permiso para pertenecer sin prisa.' },
        { planet: 'venus', note: 'Hipótesis: Venus puede expresarse con ternura directa, sin espectáculo.' }
      ],
      elementalTone: ['agua suave', 'tierra habitada', 'luz oblicua'],
      emotionalClimate: 'Un clima emocional que puede invitar a la melancolía sin dramatismo y a la ternura sin ruido.',
      relationshipTone: 'El vínculo puede empezar en conversación y gesto pequeño antes que en demostración.',
      workTone: 'El trabajo puede mezclarse con la vida sin pedirte que desaparezcas en el rol.',
      restTone: 'La pausa puede sentirse como recuperar gusto, no como apagar el motor.',
      goalModifiers: {
        amor: [
          'Quizá notes que el amor aquí pide honestidad antes que personaje.',
          'Puede que el encuentro se sostenga en presencia tranquila, no en performance.'
        ],
        trabajo: [
          'Puede que tu sentido pese más que tu vitrina.',
          'Quizá el esfuerzo sostenido valga más que el arranque ruidoso.'
        ],
        descanso: [
          'Tal vez descubras permiso para bajar el ritmo sin desaparecer.',
          'Puede que el cuerpo vuelva cuando la agenda deja de mandar.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna busca pertenencia; aquí puede expresarse en vínculos que maduran en lo cotidiano.',
          'Puede que notes un arraigo que no exige prisa ni prueba constante.'
        ],
        venus: [
          'Venus puede abrirse en afecto directo, sin necesidad de impresionar.',
          'Quizá el magnetismo pase por autenticidad antes que por escenario.'
        ],
        saturn: [
          'Saturno puede pedir estructura suave: límites que sostienen, no muros.',
          'Puede que la responsabilidad se sienta más cercana que punitiva.'
        ]
      },
      opportunities: [
        'Espacio para vínculos que no exigen personaje.',
        'Ritmo que devuelve margen al cuerpo y a la conversación.'
      ],
      cautions: [
        'Evitar idealizar la lentitud como cura automática.',
        'No confundir reserva con falta de interés.'
      ],
      narrativeImages: [
        'Una mesa que se alarga porque nadie tiene prisa por levantarse.',
        'Luz de tarde que cambia el tono sin avisar.'
      ],
      avoidCliches: ['fado', 'azulejo', 'destino romántico', 'magia portuguesa', 'tranvía'],
      sourceNotes: 'Piloto 3.8f.2 · tono ibérico atlántico · sin postal turística.'
    },

    spain: {
      id: 'spain',
      name: 'España',
      region: 'Europa occidental',
      curated: true,
      symbolicResonance: [
        'Puede resonar con intensidad vital y encuentro en la calle.',
        'Se puede leer simbólicamente como calor humano que no siempre pide explicación.'
      ],
      planetaryResonance: [
        { planet: 'sun', note: 'Hipótesis: el Sol puede encontrar aquí escenario de presencia visible.' },
        { planet: 'mars', note: 'Hipótesis: Marte puede activarse en impulso y franqueza.' }
      ],
      elementalTone: ['fuego contenido', 'tierra compartida', 'aire social'],
      emotionalClimate: 'Un clima que puede mezclar franqueza, ironía y calor sin pedirte que te encojas.',
      relationshipTone: 'El vínculo puede ser directo; a veces la cercanía llega antes que la formalidad.',
      workTone: 'El trabajo puede vivirse con energía visible, pero también con presión por mostrarse.',
      restTone: 'Descansar puede ser recuperar ritmo propio entre oleadas de estímulo.',
      goalModifiers: {
        amor: [
          'Puede que el encuentro te pida presencia más que discurso.',
          'Quizá notes que la química aparece en lo cotidiano, no solo en el gesto grande.'
        ],
        trabajo: [
          'Puede que tu trabajo busque coherencia entre lo que muestras y lo que sientes.',
          'Quizá la visibilidad pese: define qué quieres que se vea.'
        ],
        descanso: [
          'Tal vez la pausa llegue cuando sueltas la obligación de estar disponible.',
          'Puede que el descanso sea bajar el volumen social sin culpa.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar hogar emocional; aquí el hogar a veces es la mesa compartida.',
          'Puede que la pertenencia pase por presencia en el grupo, no por aislamiento.'
        ],
        venus: [
          'Venus puede expresarse con calor y franqueza en el vínculo.',
          'Quizá el afecto se note en gestos visibles, no solo en palabras.'
        ],
        saturn: [
          'Saturno puede marcar límites entre lo público y lo íntimo.',
          'Puede que la disciplina se sienta como compromiso, no como castigo.'
        ]
      },
      opportunities: [
        'Apertura social que facilita el encuentro.',
        'Energía vital que puede reactivar lo que estaba dormido.'
      ],
      cautions: [
        'No confundir intensidad con compatibilidad.',
        'Evitar performar para encajar en el ritmo colectivo.'
      ],
      narrativeImages: [
        'Una conversación que empieza en la acera y sigue sin plan.',
        'Tarde larga en la que el tiempo parece ceder.'
      ],
      avoidCliches: ['flamenco', 'siesta', 'fiesta eterna', 'paella', 'toros', 'esencia sagitaria'],
      sourceNotes: 'Piloto 3.8f.2 · diversidad interna implícita · sin esencia nacional única.'
    },

    france: {
      id: 'france',
      name: 'Francia',
      region: 'Europa occidental',
      curated: true,
      symbolicResonance: [
        'Puede resonar con cultura, forma y sentido estético en lo cotidiano.',
        'Se puede leer simbólicamente como búsqueda de coherencia entre vida y criterio.'
      ],
      planetaryResonance: [
        { planet: 'venus', note: 'Hipótesis: Venus puede encontrar aquí gusto, forma y vínculo cultivado.' },
        { planet: 'mercury', note: 'Hipótesis: Mercurio puede afilar la palabra y el criterio.' }
      ],
      elementalTone: ['aire refinado', 'tierra cultivada', 'agua reflexiva'],
      emotionalClimate: 'Un clima que puede combinar reserva elegante con profundidad cuando hay confianza.',
      relationshipTone: 'El vínculo puede pedir sutileza: presencia con criterio, no solo intensidad.',
      workTone: 'El trabajo puede valorar sentido, oficio y una identidad bien definida.',
      restTone: 'La pausa puede ser ritual cotidiano: recuperar gusto y forma sin rendimiento.',
      goalModifiers: {
        amor: [
          'Quizá notes que el vínculo madura cuando hay espacio para la sutileza.',
          'Puede que el afecto se exprese en detalle, no en demostración.'
        ],
        trabajo: [
          'Puede que tu trabajo pida oficio y coherencia antes que velocidad.',
          'Quizá la trayectoria se construya con criterio, no solo con exposición.'
        ],
        descanso: [
          'Tal vez descubras que descansar es cultivar lo esencial.',
          'Puede que la pausa tenga dignidad, no culpa.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar intimidad con criterio; aquí la intimidad no siempre es ruidosa.',
          'Puede que la pertenencia se construya en confianza lenta.'
        ],
        venus: [
          'Venus puede resonar con belleza cotidiana y vínculo cultivado.',
          'Quizá el afecto pase por detalle y presencia elegante.'
        ],
        saturn: [
          'Saturno puede pedir estructura y compromiso con lo que eliges.',
          'Puede que los límites protejan la profundidad, no la distancia.'
        ]
      },
      opportunities: [
        'Espacio para identidad con oficio y criterio.',
        'Vínculo que puede profundizar con tiempo y confianza.'
      ],
      cautions: [
        'No confundir reserva con rechazo.',
        'Evitar la fantasía de una vida que solo se mira desde fuera.'
      ],
      narrativeImages: [
        'Un café largo en el que la conversación encuentra su ritmo.',
        'Un gesto pequeño que ordena el día.'
      ],
      avoidCliches: ['torre eiffel', 'paris romántico', 'baguette', 'joie de vivre postal'],
      sourceNotes: 'Piloto 3.8f.2 · matiz cultural sin París como único rostro.'
    },

    united_kingdom: {
      id: 'united_kingdom',
      name: 'Reino Unido',
      region: 'Europa occidental',
      curated: true,
      symbolicResonance: [
        'Puede resonar con reserva cordial y sentido de tradición viva.',
        'Se puede leer simbólicamente como vínculo que se gana con consistencia.'
      ],
      planetaryResonance: [
        { planet: 'saturn', note: 'Hipótesis: Saturno puede encontrar aquí estructura y continuidad.' },
        { planet: 'moon', note: 'Hipótesis: la Luna puede buscar refugio y pertenencia discreta.' }
      ],
      elementalTone: ['tierra húmeda', 'aire medido', 'agua contenida'],
      emotionalClimate: 'Un clima que puede mezclar cordialidad contenida, ironía y profundidad bajo la superficie.',
      relationshipTone: 'El vínculo puede construirse con acuerdos claros y presencia sostenida.',
      workTone: 'El trabajo puede valorar proceso, continuidad y una trayectoria legible.',
      restTone: 'Descansar puede ser retirarse sin desaparecer: pausa con límites claros.',
      goalModifiers: {
        amor: [
          'Puede que la confianza se gane con consistencia, no con fuegos artificiales.',
          'Quizá notes que el vínculo pide definición antes que fusión.'
        ],
        trabajo: [
          'Puede que tu trabajo avance cuando el proceso es creíble.',
          'Quizá la trayectoria pese más que el arranque visible.'
        ],
        descanso: [
          'Tal vez la pausa sea un refugio medido, no un abandono.',
          'Puede que el descanso pida límites claros con el mundo exterior.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar refugio; aquí el refugio a veces es discreto, no exhibido.',
          'Puede que la pertenencia se sienta en lo sostenido, no en lo efusivo.'
        ],
        venus: [
          'Venus puede expresarse con ternura contenida y lealtad práctica.',
          'Quizá el afecto se note en gestos constantes más que en declaraciones.'
        ],
        saturn: [
          'Saturno puede marcar deber, continuidad y límites que protegen.',
          'Puede que la responsabilidad sea el esqueleto del vínculo o del proyecto.'
        ]
      },
      opportunities: [
        'Estabilidad que puede sostener proyectos largos.',
        'Vínculo que puede crecer con confianza gradual.'
      ],
      cautions: [
        'No confundir reserva con frialdad.',
        'Evitar quedarte en la superficie cordial sin profundizar.'
      ],
      narrativeImages: [
        'Un silencio cómodo entre personas que ya no necesitan rellenarlo.',
        'Caminar bajo lluvia ligera pensando en algo con calma.'
      ],
      avoidCliches: ['tea time', 'royal family', 'londres neblina postal', 'británico frío'],
      sourceNotes: 'Piloto 3.8f.2 · islas y diversidad interna · sin caricatura posh.'
    },

    italy: {
      id: 'italy',
      name: 'Italia',
      region: 'Europa meridional',
      curated: true,
      symbolicResonance: [
        'Puede resonar con belleza cotidiana, cuerpo y sentido en lo vivido.',
        'Se puede leer simbólicamente como pasión que busca forma y disfrute.'
      ],
      planetaryResonance: [
        { planet: 'venus', note: 'Hipótesis: Venus puede encontrar aquí gusto, cuerpo y vínculo sensorial.' },
        { planet: 'sun', note: 'Hipótesis: el Sol puede buscar expresión visible y calor vital.' }
      ],
      elementalTone: ['fuego cálido', 'tierra generosa', 'agua sensorial'],
      emotionalClimate: 'Un clima que puede mezclar expresividad, gusto y dramatismo contenido en lo cotidiano.',
      relationshipTone: 'El vínculo puede ser cálido y expresivo; a veces la emoción se muestra antes que se explica.',
      workTone: 'El trabajo puede mezclar oficio, identidad y una necesidad de sentido en lo hecho.',
      restTone: 'Descansar puede ser disfrute deliberado: cuerpo, mesa, ritmo propio.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo pida calor y presencia, no solo plan.',
          'Quizá notes que el afecto se vive en lo sensorial y lo cotidiano.'
        ],
        trabajo: [
          'Puede que tu trabajo busque belleza en lo hecho, no solo resultado.',
          'Quizá la identidad profesional se mezcle con la vital.'
        ],
        descanso: [
          'Tal vez descubras que la pausa es disfrute sin rendimiento.',
          'Puede que el cuerpo pida mesa, paseo y ritmo lento.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar calor hogareño; aquí el hogar a veces es la mesa y la familia elegida.',
          'Puede que la pertenencia se sienta en lo compartido y lo sensorial.'
        ],
        venus: [
          'Venus puede abrirse en gusto, afecto y disfrute compartido.',
          'Quizá el vínculo pida belleza cotidiana, no espectáculo.'
        ],
        saturn: [
          'Saturno puede recordar que el disfrute también necesita límites.',
          'Puede que la estructura proteja de dispersar la energía vital.'
        ]
      },
      opportunities: [
        'Reconexión con el cuerpo y el disfrute sin culpa.',
        'Vínculo que puede calentarse con presencia expresiva.'
      ],
      cautions: [
        'No confundir intensidad emocional con compatibilidad.',
        'Evitar idealizar el estilo de vida como solución.'
      ],
      narrativeImages: [
        'Una comida que dura más de lo previsto y nadie lo lamenta.',
        'Luz dorada sobre una calle que ya conoces de memoria.'
      ],
      avoidCliches: ['pizza', 'mamma mia', 'dolce vita postal', 'esencia leonina'],
      sourceNotes: 'Piloto 3.8f.2 · norte y sur como matices, no esencia única.'
    },

    japan: {
      id: 'japan',
      name: 'Japón',
      region: 'Asia oriental',
      curated: true,
      symbolicResonance: [
        'Puede resonar con orden, cuidado del detalle y ritmo que pide atención.',
        'Se puede leer simbólicamente como refinamiento y contención en lo cotidiano.'
      ],
      planetaryResonance: [
        { planet: 'saturn', note: 'Hipótesis: Saturno puede encontrar aquí disciplina, forma y límite.' },
        { planet: 'mercury', note: 'Hipótesis: Mercurio puede afilarse en precisión y observación.' }
      ],
      elementalTone: ['agua quieta', 'metal pulido', 'tierra cuidada'],
      emotionalClimate: 'Un clima que puede combinar reserva, cuidado y profundidad bajo la cortesía.',
      relationshipTone: 'El vínculo puede construirse con respeto, tiempo y gestos que no siempre se verbalizan.',
      workTone: 'El trabajo puede pedir precisión, constancia y sentido del deber sin ruido.',
      restTone: 'La pausa puede ser ritual silencioso: orden interior antes que exhibición.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo madure en gestos sostenidos, no en declaraciones rápidas.',
          'Quizá notes que la cercanía pide tiempo y cuidado mutuo.'
        ],
        trabajo: [
          'Puede que tu trabajo exija precisión y constancia antes que visibilidad.',
          'Quizá el sentido se construya en oficio, no en aplauso.'
        ],
        descanso: [
          'Tal vez descubras que descansar es ordenar el interior.',
          'Puede que la pausa sea silencio que no se siente vacío.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar refugio íntimo; aquí la intimidad a veces es silenciosa.',
          'Puede que la pertenencia se sienta en el cuidado, no en la exposición.'
        ],
        venus: [
          'Venus puede expresarse con delicadeza y atención al detalle en el vínculo.',
          'Quizá el afecto se note en lo cuidado, no en lo ruidoso.'
        ],
        saturn: [
          'Saturno puede marcar deber, forma y límites que sostienen la vida cotidiana.',
          'Puede que la disciplina sea el marco que permite profundidad.'
        ]
      },
      opportunities: [
        'Orden interior que puede aliviar ruido mental.',
        'Vínculo que puede profundizar con respeto y tiempo.'
      ],
      cautions: [
        'No confundir reserva con distancia emocional.',
        'Evitar exotizar la cultura como misterio inalcanzable.'
      ],
      narrativeImages: [
        'Un ritual pequeño que ordena el inicio del día.',
        'Silencio compartido que no pide ser llenado.'
      ],
      avoidCliches: ['sushi', 'samurái', 'anime', 'esencia capricorniana', 'cerezo postal'],
      sourceNotes: 'Piloto 3.8f.2 · sin orientalismo · hipótesis simbólica únicamente.'
    },

    brazil: {
      id: 'brazil',
      name: 'Brasil',
      region: 'América del Sur',
      curated: true,
      symbolicResonance: [
        'Puede resonar con vitalidad mezclada, cuerpo y encuentro en la calle.',
        'Se puede leer simbólicamente como mezcla que no pide una sola identidad.'
      ],
      planetaryResonance: [
        { planet: 'jupiter', note: 'Hipótesis: Júpiter puede encontrar aquí expansión y encuentro.' },
        { planet: 'venus', note: 'Hipótesis: Venus puede abrirse en calor social y disfrute.' }
      ],
      elementalTone: ['fuego tropical', 'agua abundante', 'aire festivo'],
      emotionalClimate: 'Un clima que puede mezclar calor humano, contraste y una vitalidad que no siempre es simple.',
      relationshipTone: 'El vínculo puede ser expresivo y social; a veces la cercanía se muestra con naturalidad.',
      workTone: 'El trabajo puede mezclar creatividad, improvisación y necesidad de sentido en medio del ritmo.',
      restTone: 'Descansar puede ser soltar la exigencia y volver al cuerpo y al encuentro.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo se abra en calor y presencia, no en protocolo.',
          'Quizá notes que el afecto se vive con expresividad cotidiana.'
        ],
        trabajo: [
          'Puede que tu trabajo busque sentido en medio de la energía colectiva.',
          'Quizá la creatividad pida canal, no dispersión.'
        ],
        descanso: [
          'Tal vez descubras que la pausa es cuerpo y encuentro sin rendimiento.',
          'Puede que el descanso sea soltar la prisa interna.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar pertenencia cálida; aquí la pertenencia a veces es la mesa abierta.',
          'Puede que el hogar emocional sea el grupo que te recibe.'
        ],
        venus: [
          'Venus puede expresarse en calor, disfrute y vínculo expresivo.',
          'Quizá el afecto se note en gesto y presencia, no en discurso.'
        ],
        saturn: [
          'Saturno puede recordar límites en medio de la expansión.',
          'Puede que la estructura sea necesaria para no dispersar la vitalidad.'
        ]
      },
      opportunities: [
        'Apertura social que puede facilitar el encuentro.',
        'Vitalidad que puede reactivar lo dormido en la carta.'
      ],
      cautions: [
        'No romantizar la contrastes como si fueran armonía automática.',
        'Evitar reducir el país a fiesta o cliché tropical.'
      ],
      narrativeImages: [
        'Un encuentro que empieza sin plan y termina con más claridad.',
        'Cuerpo que vuelve al ritmo cuando sueltas la culpa.'
      ],
      avoidCliches: ['samba', 'carnaval', 'favela turística', 'fútbol', 'caipiriña'],
      sourceNotes: 'Piloto 3.8f.2 · diversidad continental · sin caricatura festiva.'
    },

    argentina: {
      id: 'argentina',
      name: 'Argentina',
      region: 'América del Sur',
      curated: true,
      symbolicResonance: [
        'Puede resonar con melancolía elegante, debate y búsqueda de sentido.',
        'Se puede leer simbólicamente como profundidad emocional con ironía.'
      ],
      planetaryResonance: [
        { planet: 'moon', note: 'Hipótesis: la Luna puede encontrar aquí nostalgia y pertenencia compleja.' },
        { planet: 'pluto', note: 'Hipótesis: Plutón puede tocar transformación y intensidad emocional.' }
      ],
      elementalTone: ['agua profunda', 'aire dialéctico', 'tierra abierta'],
      emotionalClimate: 'Un clima que puede mezclar pasión, melancolía y una búsqueda de verdad en lo vivido.',
      relationshipTone: 'El vínculo puede ser intenso y conversado; a veces la emoción se explora antes que se simplifica.',
      workTone: 'El trabajo puede mezclar ambición, crisis creativa y necesidad de sentido propio.',
      restTone: 'Descansar puede ser aflojar la lucha interna y volver a algo más simple.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo pida honestidad emocional, no solo química.',
          'Quizá notes que el encuentro se explora en conversación larga.'
        ],
        trabajo: [
          'Puede que tu trabajo busque sentido en medio de la comparación.',
          'Quizá la trayectoria pida coherencia interna antes que escenario.'
        ],
        descanso: [
          'Tal vez la pausa sea soltar la exigencia de tenerlo todo resuelto.',
          'Puede que el descanso sea melancolía que no castiga.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar raíz emocional; aquí la raíz a veces es nostalgia y pertenencia compleja.',
          'Puede que la intimidad pase por la conversación honesta.'
        ],
        venus: [
          'Venus puede abrirse en ternura con filo, no solo en dulzura.',
          'Quizá el vínculo mezcle pasión y reflexión.'
        ],
        saturn: [
          'Saturno puede marcar deber y límites en medio de la intensidad.',
          'Puede que la estructura sea lo que evita que la emoción se dispersa.'
        ]
      },
      opportunities: [
        'Profundidad emocional que puede dar verdad al vínculo.',
        'Espacio para redefinir identidad en una etapa vital.'
      ],
      cautions: [
        'No confundir intensidad con destino.',
        'Evitar el mito del país como refugio emocional automático.'
      ],
      narrativeImages: [
        'Una conversación que vuelve una y otra vez al mismo punto con más calma.',
        'Tarde larga en la que la melancolía no pesa, acompaña.'
      ],
      avoidCliches: ['tango', 'mate', 'asado', 'evita', 'esencia escorpiana'],
      sourceNotes: 'Piloto 3.8f.2 · matiz rioplatense sin determinismo.'
    },

    south_africa: {
      id: 'south_africa',
      name: 'Sudáfrica',
      region: 'África austral',
      curated: true,
      symbolicResonance: [
        'Puede resonar con contraste, escala y honestidad cruda mezclada con capacidad de disfrute.',
        'Se puede leer simbólicamente como territorio que devuelve al cuerpo y a la pregunta.'
      ],
      planetaryResonance: [
        { planet: 'pluto', note: 'Hipótesis: Plutón puede tocar transformación y verdad incómoda.' },
        { planet: 'moon', note: 'Hipótesis: la Luna puede buscar refugio en paisaje que amplía la perspectiva.' }
      ],
      elementalTone: ['tierra abierta', 'fuego solar', 'agua de horizonte'],
      emotionalClimate: 'Un clima que puede mezclar belleza, contraste y una honestidad que no siempre consuela.',
      relationshipTone: 'El vínculo puede pedir presencia real; a veces la cercanía nace del contraste vivido.',
      workTone: 'El trabajo puede mezclar ambición, servicio y necesidad de sentido en un contexto complejo.',
      restTone: 'Descansar puede ser bajar exigencia y volver al cuerpo frente a una escala que pone en perspectiva.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo pida verdad antes que fantasía.',
          'Quizá notes que el encuentro se prueba en lo real, no en el escenario.'
        ],
        trabajo: [
          'Puede que tu trabajo busque impacto con sentido, no solo visibilidad.',
          'Quizá la trayectoria pida coherencia con lo que valoras.'
        ],
        descanso: [
          'Tal vez la pausa llegue cuando sueltas la lucha contra el reloj.',
          'Puede que el descanso sea permiso para bajar exigencia sin desaparecer.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna puede buscar refugio; aquí el paisaje a veces devuelve al cuerpo más que consuela.',
          'Puede que la pertenencia pase por honestidad, no por idealización.'
        ],
        venus: [
          'Venus puede abrirse en disfrute consciente y vínculo que no evita la verdad.',
          'Quizá el afecto se sienta más vivo cuando no performas.'
        ],
        saturn: [
          'Saturno puede marcar deber, límites y la necesidad de estructura en contexto complejo.',
          'Puede que la responsabilidad sea parte del crecimiento, no del castigo.'
        ]
      },
      opportunities: [
        'Perspectiva que puede reordenar prioridades.',
        'Honestidad que puede limpiar vínculos o proyectos.'
      ],
      cautions: [
        'No idealizar el paisaje como cura.',
        'Evitar reducir el país a postal natural o turismo de vida salvaje.'
      ],
      narrativeImages: [
        'Horizonte abierto que pone tu historia en otra escala.',
        'Silencio que pesa distinto según el barrio y la hora.'
      ],
      avoidCliches: ['safari', 'mandela postal', 'rainbow nation cliché', 'wildlife tourism'],
      sourceNotes: 'Piloto 3.8f.2 · complejidad social implícita · sin juicio político.'
    },

    canada: {
      id: 'canada',
      name: 'Canadá',
      region: 'América del Norte',
      curated: true,
      symbolicResonance: [
        'Puede resonar con espacio, cordialidad práctica y ritmo que pide claridad.',
        'Se puede leer simbólicamente como vínculo construido con acuerdos y constancia.'
      ],
      planetaryResonance: [
        { planet: 'saturn', note: 'Hipótesis: Saturno puede encontrar aquí estructura y deber cotidiano.' },
        { planet: 'moon', note: 'Hipótesis: la Luna puede buscar refugio y pertenencia en comunidad medida.' }
      ],
      elementalTone: ['aire amplio', 'agua fría', 'tierra paciente'],
      emotionalClimate: 'Un clima que puede mezclar cordialidad, reserva y una escala que hace sentir lo personal más pequeño.',
      relationshipTone: 'El vínculo puede construirse con respeto, claridad y presencia sostenida.',
      workTone: 'El trabajo puede valorar proceso, mérito y una trayectoria que se documenta con constancia.',
      restTone: 'La pausa puede ser refugio medido: bajar el ritmo sin perder el hilo de quién eres.',
      goalModifiers: {
        amor: [
          'Puede que el vínculo pida consistencia más que fuego instantáneo.',
          'Quizá notes que la confianza se gana con tiempo y acuerdos claros.'
        ],
        trabajo: [
          'Puede que tu trabajo avance cuando el proceso es creíble y medible.',
          'Quizá la trayectoria pida claridad antes que exposición.'
        ],
        descanso: [
          'Tal vez descubras que descansar es recuperar margen interior.',
          'Puede que la pausa sea refugio sin culpa, no rendimiento invertido.'
        ]
      },
      lineModifiers: {
        moon: [
          'Tu Luna busca pertenencia; aquí puede expresarse en comunidad medida y refugio sin ruido.',
          'Puede que el hogar emocional sea el espacio que no te exige performar.'
        ],
        venus: [
          'Venus puede abrirse en ternura práctica y vínculo que se sostiene en lo cotidiano.',
          'Quizá el afecto se note en gestos constantes y respeto mutuo.'
        ],
        saturn: [
          'Saturno puede marcar deber, invierno interior y estructura que sostiene la vida.',
          'Puede que la disciplina sea el marco que permite avanzar sin prisa.'
        ]
      },
      opportunities: [
        'Espacio para ordenar trayectoria con claridad.',
        'Vínculo que puede crecer con confianza gradual.'
      ],
      cautions: [
        'No confundir amabilidad con intimidad automática.',
        'Evitar idealizar el país como refugio perfecto del clima.'
      ],
      narrativeImages: [
        'Distancias que te hacen planificar el día como pequeña expedición.',
        'Cordialidad que deja espacio sin invadir.'
      ],
      avoidCliches: ['maple syrup', 'moose', 'canadá perfecto', 'nieve postal'],
      sourceNotes: 'Piloto 3.8f.2 · escala norteamericana sin fantasía de refugio.'
    }
  };

  function getArchetype(countryId) {
    if (!countryId) return null;
    return INDEX[countryId] || null;
  }

  function isPilotCountry(countryId) {
    return PILOT_COUNTRY_IDS.indexOf(countryId) !== -1;
  }

  window.KairosCountryArchetypes = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    PILOT_COUNTRY_IDS: PILOT_COUNTRY_IDS,
    INDEX: INDEX,
    getArchetype: getArchetype,
    isPilotCountry: isPilotCountry
  };
})();
