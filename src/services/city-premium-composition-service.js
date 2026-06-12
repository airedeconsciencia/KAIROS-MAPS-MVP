/**
 * KAIROS MAPS — City Premium Reading composition (Fase 3.8f.4 DEV)
 *
 * Lectura integrada: voz premium cálida + premium-blocks + fallback + matiz país.
 * Sin IA, sin inventar datos astrológicos.
 *
 * Depende de: KairosNarrativeIntelligence, KairosPremiumKnowledge, KairosPremiumBlocks
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8f.4-dev-0.1';
  var MAX_ATMOSPHERE_LINES = 3;
  var MAX_COUNTRY_LINES = 2;
  var COUNTRY_ALLOWED_SECTIONS = { sintesis: true, observar: true, integracion: true };
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

  var SPINE_FAVORECE_OPEN_BY_REGION = {
    IBERIAN: [
      'En la plaza, conviene leer la oportunidad así: ',
      'Desde la sobremesa, la oportunidad se presenta en voz baja: ',
      'En la conversación larga, puede abrirse esto: ',
      'En el barrio, la oportunidad aparece sin escena: ',
      'Con la compañía cotidiana, conviene mirar esto: ',
      'En voz baja, la oportunidad se deja leer así: '
    ],
    MEDITERRANEAN: [
      'En el paseo, conviene leer la oportunidad así: ',
      'Desde la acera, la oportunidad se presenta en proximidad: ',
      'En la calle viva, puede abrirse esto: ',
      'Al doblar la esquina, la oportunidad aparece sin vitrina: ',
      'Con el tránsito urbano, conviene mirar esto: ',
      'En el cruce tranquilo, la oportunidad se deja leer así: '
    ],
    ANGLO: [
      'En el calendario, la oportunidad toma forma así: ',
      'Con tiempo aparte, conviene leer la oportunidad: ',
      'En el trayecto, puede abrirse esto: ',
      'En privado, la oportunidad aparece con claridad: ',
      'Con claridad privada, conviene mirar esto: ',
      'En el plan silencioso, la oportunidad se deja leer así: '
    ],
    EAST_ASIAN: [
      'En la secuencia, la oportunidad toma forma así: ',
      'Con el detalle observado, conviene leer la oportunidad: ',
      'En el tramo lento, puede abrirse esto: ',
      'En la rutina, la oportunidad aparece sin prisa: ',
      'Desde el gesto mínimo, conviene mirar esto: ',
      'En el proceso callado, la oportunidad se deja leer así: '
    ],
    AFRICAN_COASTAL: [
      'Ante el horizonte, la oportunidad toma forma así: ',
      'Con la amplitud del lugar, conviene leer la oportunidad: ',
      'En el contraste del paisaje, puede abrirse esto: ',
      'Con el viento, la oportunidad aparece sin prisa: ',
      'Desde la respiración abierta, conviene mirar esto: ',
      'En la escena amplia, la oportunidad se deja leer así: '
    ]
  };

  var LEGACY_FAVORECE_OPEN_MARKERS = [
    'puede que descubras una puerta',
    'quizá notes que se abre algo con suavidad',
    'tal vez se insinúe un gesto posible'
  ];

  var PHRASE_ECHO_RULES = [
    {
      phrase: 'dirección interna',
      alternates: ['tu sentido', 'claridad interna', 'lo que sostienes por dentro', 'propósito en privado']
    },
    {
      phrase: 'bloque reservado',
      alternates: ['tiempo aparte', 'espacio reservado', 'un rato en privado', 'la pausa elegida'],
      ban: true
    }
  ];

  var SPINE_APROVECHA_OPEN = [
    'En {ciudad}, un gesto pequeño puede sostener lo anterior: ',
    'Quizá en {ciudad} pruebes esto: ',
    'Un paso concreto que puede sostenerte en {ciudad}: '
  ];

  var DESCRIPTIVE_PHRASE_MARKERS = [
    'el lugar favorece',
    'el entorno activa',
    'la ciudad ofrece',
    'la energía impulsa',
    'lo que activa el lugar'
  ];

  var NATURAL_CONNECTORS = [
    'Quizá por eso ',
    'Y ahí suele aparecer algo interesante: ',
    'A veces ocurre que ',
    'Con el tiempo, ',
    'Curiosamente, ',
    'Sin darte cuenta, '
  ];

  var HUMAN_SCENE_POOL = {
    amor: [
      'Puede que una conversación dure más de lo previsto y no quieras que termine.',
      'Tal vez te encuentres volviendo caminando pensando en alguien con más calma de la habitual.',
      'A veces ocurre que te sientas sin necesidad de impresionar a nadie.'
    ],
    trabajo: [
      'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso.',
      'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
      'Tal vez te sorprenda sentarte sin necesidad de producir nada durante un rato.'
    ],
    descanso: [
      'Puede que te sorprenda sentarte sin necesidad de rendir nada.',
      'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice.',
      'Quizá descubras que un silencio largo deja de incomodarte.'
    ]
  };

  var HUMAN_SCENE_BY_REGION = {
    IBERIAN: {
      amor: [
        'Puede que una conversación en la plaza dure más de lo previsto y no quieras que termine.',
        'Tal vez te encuentres volviendo caminando pensando en alguien con más calma de la habitual.',
        'A veces ocurre que te sientas sin necesidad de impresionar en la sobremesa.'
      ],
      trabajo: [
        'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso en voz baja.',
        'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
        'Tal vez te sorprenda sentarte sin necesidad de producir nada durante un rato.'
      ],
      descanso: [
        'Puede que te sorprenda quedarte en silencio sin disculparte ante la mesa.',
        'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice en la plaza.',
        'Quizá descubras que un silencio largo deja de incomodarte en compañía.'
      ]
    },
    MEDITERRANEAN: {
      amor: [
        'Puede que una conversación en la acera dure más de lo previsto y no quieras que termine.',
        'Tal vez te encuentres volviendo caminando pensando en alguien con más calma que en casa.',
        'A veces ocurre que te sientas sin necesidad de impresionar en el paseo.'
      ],
      trabajo: [
        'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso al doblar la esquina.',
        'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
        'Tal vez te sorprenda sentarte sin necesidad de producir nada en un cruce tranquilo.'
      ],
      descanso: [
        'Puede que te sorprenda bajar el paso sin sentir que pierdes el día.',
        'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice en la calle.',
        'Quizá descubras que un silencio largo deja de incomodarte en el tránsito.'
      ]
    },
    ANGLO: {
      amor: [
        'Puede que una conversación en el trayecto dure más de lo previsto y no quieras que termine.',
        'Tal vez te encuentres volviendo caminando pensando en alguien con más calma que de costumbre.',
        'A veces ocurre que te sientas sin necesidad de impresionar cuando nadie te evalúa.'
      ],
      trabajo: [
        'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso en el calendario.',
        'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
        'Tal vez te sorprenda sentarte sin necesidad de producir nada durante un bloque libre.'
      ],
      descanso: [
        'Puede que te sorprenda reservar pausa sin sentir que debes justificarla.',
        'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice en el día.',
        'Quizá descubras que un silencio largo deja de incomodarte en privado.'
      ]
    },
    EAST_ASIAN: {
      amor: [
        'Puede que una conversación en el tramo dure más de lo previsto y no quieras que termine.',
        'Tal vez te encuentres volviendo caminando pensando en alguien con más calma en la rutina.',
        'A veces ocurre que te sientas sin necesidad de impresionar en el gesto mínimo.'
      ],
      trabajo: [
        'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso en la secuencia.',
        'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
        'Tal vez te sorprenda sentarte sin necesidad de producir nada en un tramo lento.'
      ],
      descanso: [
        'Puede que te sorprenda observar el cuerpo antes de acelerar la rutina.',
        'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice en el detalle.',
        'Quizá descubras que un silencio largo deja de incomodarte en la secuencia.'
      ]
    },
    AFRICAN_COASTAL: {
      amor: [
        'Puede que una conversación ante el horizonte dure más de lo previsto y no quieras que termine.',
        'Tal vez te encuentres volviendo caminando pensando en alguien con más calma que el impulso del entorno.',
        'A veces ocurre que te sientas sin necesidad de impresionar ante la amplitud.'
      ],
      trabajo: [
        'Quizá notes una decisión que llevas semanas evitando y que aquí pide paso con el viento.',
        'Puede que vuelvas caminando repasando una idea que por fin ordena cosas.',
        'Tal vez te sorprenda sentarte sin necesidad de producir nada ante el contraste.'
      ],
      descanso: [
        'Puede que te sorprenda habitar la pausa sin competir con el paisaje.',
        'A veces ocurre que el cuerpo pide pausa antes que la mente lo autorice ante el horizonte.',
        'Quizá descubras que un silencio largo deja de incomodarte en la amplitud.'
      ]
    }
  };

  var OBSERVE_ENTERO_TAIL_BY_REGION = {
    IBERIAN: {
      amor: [
        'Mira si te sientes más entero o más expuesto en la conversación; ambas respuestas informan.',
        'Fíjate si la cercanía te sostiene o te desnuda; las dos lecturas valen.'
      ],
      trabajo: [
        'Mira si te sientes más entero o más expuesto en el trabajo; ambas respuestas informan.',
        'Fíjate si la dirección te sostiene o te desnuda; las dos lecturas valen.'
      ],
      descanso: [
        'Mira si te sientes más entero o más expuesto en la pausa; ambas respuestas informan.',
        'Fíjate si el cuerpo te sostiene o te desnuda; las dos lecturas valen.'
      ]
    },
    MEDITERRANEAN: {
      amor: [
        'Mira si te sientes más entero o más expuesto en el paseo; ambas respuestas informan.',
        'Fíjate si la proximidad te sostiene o te desnuda; las dos lecturas valen.'
      ],
      trabajo: [
        'Mira si te sientes más entero o más expuesto en la calle; ambas respuestas informan.',
        'Fíjate si el tránsito te sostiene o te desnuda; las dos lecturas valen.'
      ],
      descanso: [
        'Mira si te sientes más entero o más expuesto en el ritmo urbano; ambas respuestas informan.',
        'Fíjate si la calma te sostiene o te desnuda; las dos lecturas valen.'
      ]
    },
    ANGLO: {
      amor: [
        'Mira si te sientes más entero o más expuesto en el vínculo; ambas respuestas informan.',
        'Fíjate si el acuerdo te sostiene o te desnuda; las dos lecturas valen.'
      ],
      trabajo: [
        'Mira si te sientes más entero o más expuesto en el plan; ambas respuestas informan.',
        'Fíjate si la dirección te sostiene o te desnuda; las dos lecturas valen.'
      ],
      descanso: [
        'Mira si te sientes más entero o más expuesto en la pausa reservada; ambas respuestas informan.',
        'Fíjate si el bloque de calma te sostiene o te desnuda; las dos lecturas valen.'
      ]
    },
    EAST_ASIAN: {
      amor: [
        'Mira si te sientes más entero o más expuesto en el detalle; ambas respuestas informan.',
        'Fíjate si la secuencia te sostiene o te desnuda; las dos lecturas valen.'
      ],
      trabajo: [
        'Mira si te sientes más entero o más expuesto en el tramo; ambas respuestas informan.',
        'Fíjate si el proceso te sostiene o te desnuda; las dos lecturas valen.'
      ],
      descanso: [
        'Mira si te sientes más entero o más expuesto en la rutina; ambas respuestas informan.',
        'Fíjate si el tramo lento te sostiene o te desnuda; las dos lecturas valen.'
      ]
    },
    AFRICAN_COASTAL: {
      amor: [
        'Mira si te sientes más entero o más expuesto ante el horizonte; ambas respuestas informan.',
        'Fíjate si la amplitud te sostiene o te desnuda; las dos lecturas valen.'
      ],
      trabajo: [
        'Mira si te sientes más entero o más expuesto en el contraste; ambas respuestas informan.',
        'Fíjate si la dirección te sostiene o te desnuda; las dos lecturas valen.'
      ],
      descanso: [
        'Mira si te sientes más entero o más expuesto con el viento; ambas respuestas informan.',
        'Fíjate si la respiración te sostiene o te desnuda; las dos lecturas valen.'
      ]
    }
  };

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
    'pequeña expedición'
  ];

  var VOICE_TRANSITION_BY_REGION = {
    IBERIAN: {
      matiz: [
        'Detrás de la conversación hay otra textura, más silenciosa.',
        'Con el tiempo, la compañía aclara lo que la escena no decía.',
        'Lo que sigue completa la sobremesa interior.',
        'Hay un matiz en la plaza que no es oposición: es compañía.'
      ],
      contradiccion: [
        'La segunda mirada en el barrio suele ser más honesta que la primera.',
        'Entre lo vivido y lo esperado hay un pasillo estrecho — no contradicción, tensión.',
        'Quizá notes dos ritmos en la conversación conviviendo sin pedir permiso.',
        'A veces la cercanía choca con la prisa de concluir — ahí está la fricción.'
      ],
      capa: [
        'Hay una capa que solo aparece cuando aflojas la urgencia de concluir.',
        'Lo que sigue no es anexo: es otra cara de la compañía cotidiana.',
        'Detrás del impulso hay una pregunta más lenta — casi de sobremesa.',
        'Hay un hilo que conecta lo visible con lo no dicho en voz baja.'
      ],
      advertencia: [
        'Si te quedas un poco más en la plaza, el tono cambia.',
        'Algo se mueve cuando dejas de exigirte respuesta inmediata en la conversación.',
        'Detrás de la urgencia hay algo que pide compañía, no conclusión.',
        'La escena del barrio cambia cuando dejas de medirla con prisa.'
      ],
      cierre: [
        'Entre una señal y otra hay espacio para elegir cómo habitar la compañía.',
        'La conversación cotidiana confirma o matiza lo que intuías.',
        'Hay un giro pequeño en la plaza que altera el sentido de todo.'
      ],
      cuerpo: [
        'La lectura se afina cuando el cuerpo también opina en la mesa.',
        'Algo se revela cuando sueltas la necesidad de ganar la escena.',
        'No todo lo que se activa en el vínculo apunta al mismo norte.'
      ],
      ciudad: [
        'Hay momentos en que el barrio habla por contraste, no por confirmación.',
        'Puede que lo que despierta la plaza no despierte lo mismo en ti.',
        'Hay señales que se entienden mejor en la conversación repetida.'
      ]
    },
    MEDITERRANEAN: {
      matiz: [
        'Detrás del paseo hay otra textura, más silenciosa.',
        'Con el tiempo, la calle aclara lo que la primera vuelta no decía.',
        'En el paseo, lo vivido completa la proximidad urbana.',
        'Hay un matiz en el cruce que no es oposición: es densidad humana.'
      ],
      contradiccion: [
        'La segunda mirada en la acera suele ser más honesta que la primera.',
        'Entre lo vivido y lo esperado hay un pasillo estrecho — no contradicción, tránsito.',
        'Quizá notes dos ritmos en la calle conviviendo sin pedir permiso.',
        'A veces la proximidad choca con la prisa de concluir — ahí está la fricción.'
      ],
      capa: [
        'Hay una capa que solo aparece cuando bajas el paso en el paseo.',
        'Lo que sigue no es anexo: es otra cara del ritmo urbano.',
        'Detrás del impulso hay una pregunta más lenta — casi de calle.',
        'Hay un hilo que conecta lo visible con lo no dicho al doblar la esquina.'
      ],
      advertencia: [
        'Si te quedas un poco más en el tránsito, el tono cambia.',
        'Algo se mueve cuando dejas de exigirte respuesta inmediata en la calle.',
        'Detrás de la urgencia hay algo que pide presencia, no conclusión.',
        'La escena urbana cambia cuando dejas de medirla con prisa.'
      ],
      cierre: [
        'Entre una señal y otra hay espacio para elegir cómo habitar la calle.',
        'El paseo cotidiano confirma o matiza lo que intuías.',
        'Hay un giro pequeño en la esquina que altera el sentido de todo.'
      ],
      cuerpo: [
        'La lectura se afina cuando el cuerpo también opina al caminar.',
        'Algo se revela cuando sueltas la necesidad de impresionar en público.',
        'No todo lo que se activa en el tránsito apunta al mismo norte.'
      ],
      ciudad: [
        'Hay momentos en que la calle habla por contraste, no por confirmación.',
        'Puede que lo que despierta el paseo no despierte lo mismo en ti.',
        'Hay señales que se entienden mejor en la proximidad repetida.'
      ]
    },
    ANGLO: {
      matiz: [
        'Detrás del calendario hay otra textura, más silenciosa.',
        'Con el tiempo, el proceso aclara lo que la primera lectura no decía.',
        'Lo siguiente completa lo que el plan aún guarda en reserva.',
        'Hay un matiz en el trayecto que no es oposición: es claridad.'
      ],
      contradiccion: [
        'La segunda mirada en el calendario suele ser más honesta que la primera.',
        'Entre lo vivido y lo esperado hay un pasillo estrecho — no contradicción, elección.',
        'Quizá notes dos ritmos en el calendario conviviendo sin pedir permiso.',
        'A veces la claridad choca con lo urgente — ahí está la fricción.'
      ],
      capa: [
        'Hay una capa que solo aparece cuando reservas espacio para pensar.',
        'Lo que sigue no es anexo: es otra cara del bloque que habitas.',
        'Detrás del impulso hay una pregunta más lenta — casi de agenda.',
        'Hay un hilo que conecta lo visible con lo no dicho en privado.'
      ],
      advertencia: [
        'Si te quedas un poco más en el proceso, el tono cambia.',
        'Algo se mueve cuando dejas de exigirte respuesta inmediata en el plan.',
        'Detrás de la urgencia hay algo que pide límite, no conclusión.',
        'El plan cambia cuando dejas de medirlo con prisa.'
      ],
      cierre: [
        'Entre una señal y otra hay espacio para elegir cómo habitas el día.',
        'El trayecto cotidiano confirma o matiza lo que intuías.',
        'Hay un giro pequeño en el calendario que altera el sentido de todo.'
      ],
      cuerpo: [
        'La lectura se afina cuando el cuerpo también opina en la pausa reservada.',
        'Algo se revela cuando sueltas la necesidad de aprobación constante.',
        'No todo lo que se activa en el plan apunta al mismo norte.'
      ],
      ciudad: [
        'Hay momentos en que el trayecto habla por contraste, no por confirmación.',
        'Puede que lo que despierta el bloque no despierte lo mismo en ti.',
        'Hay señales que se entienden mejor en la repetición del calendario.'
      ]
    },
    EAST_ASIAN: {
      matiz: [
        'Detrás del detalle hay otra textura, más silenciosa.',
        'Con el tiempo, la secuencia aclara lo que la primera pasada no decía.',
        'En la secuencia, lo observado completa el proceso.',
        'Hay un matiz en el tramo que no es oposición: es precisión.'
      ],
      contradiccion: [
        'La segunda mirada en la rutina suele ser más honesta que la primera.',
        'Entre lo vivido y lo esperado hay un pasillo estrecho — no contradicción, secuencia.',
        'Quizá notes dos ritmos en la secuencia conviviendo sin pedir permiso.',
        'A veces el detalle choca con la prisa de concluir — ahí está la fricción.'
      ],
      capa: [
        'Hay una capa que solo aparece cuando observas antes de responder.',
        'Lo que sigue no es anexo: es otra cara del tramo que transitas.',
        'Detrás del impulso hay una pregunta más lenta — casi de ritual cotidiano.',
        'Hay un hilo que conecta lo visible con lo no dicho en el gesto mínimo.'
      ],
      advertencia: [
        'Si te quedas un poco más en la secuencia, el tono cambia.',
        'Algo se mueve cuando dejas de exigirte respuesta inmediata en el detalle.',
        'Detrás de la urgencia hay algo que pide observación, no conclusión.',
        'El tramo cambia cuando dejas de medirlo con prisa.'
      ],
      cierre: [
        'Entre una señal y otra hay espacio para elegir cómo habitas la secuencia.',
        'El detalle cotidiano confirma o matiza lo que intuías.',
        'Hay un giro pequeño en la rutina que altera el sentido de todo.'
      ],
      cuerpo: [
        'La lectura se afina cuando el cuerpo también opina en el tramo lento.',
        'Algo se revela cuando sueltas la necesidad de concluir de inmediato.',
        'No todo lo que se activa en la secuencia apunta al mismo norte.'
      ],
      ciudad: [
        'Hay momentos en que la rutina habla por contraste, no por confirmación.',
        'Puede que lo que despierta el detalle no despierte lo mismo en ti.',
        'Hay señales que se entienden mejor en la repetición precisa.'
      ]
    },
    AFRICAN_COASTAL: {
      matiz: [
        'Detrás del horizonte hay otra textura, más silenciosa.',
        'Con el tiempo, la amplitud aclara lo que la primera mirada no decía.',
        'Ante el horizonte, lo vivido completa el contraste del lugar.',
        'Hay un matiz en el viento que no es oposición: es respiración.'
      ],
      contradiccion: [
        'La segunda mirada ante el horizonte suele ser más honesta que la primera.',
        'Entre lo vivido y lo esperado hay un pasillo estrecho — no contradicción, amplitud.',
        'Quizá notes dos ritmos ante el horizonte conviviendo sin pedir permiso.',
        'A veces la calma choca con el impulso del entorno — ahí está la fricción.'
      ],
      capa: [
        'Hay una capa que solo aparece cuando aflojas la prisa interna.',
        'Lo que sigue no es anexo: es otra cara del paisaje que abres.',
        'Detrás del impulso hay una pregunta más lenta — casi de horizonte.',
        'Hay un hilo que conecta lo visible con lo no dicho en la amplitud.'
      ],
      advertencia: [
        'Si te quedas un poco más ante el contraste, el tono cambia.',
        'Algo se mueve cuando dejas de exigirte respuesta inmediata al viento.',
        'Detrás de la urgencia hay algo que pide espacio, no conclusión.',
        'La escena amplia cambia cuando dejas de medirla con prisa.'
      ],
      cierre: [
        'Entre una señal y otra hay espacio para elegir cómo habitas la amplitud.',
        'El contraste cotidiano confirma o matiza lo que intuías.',
        'Hay un giro pequeño en el horizonte que altera el sentido de todo.'
      ],
      cuerpo: [
        'La lectura se afina cuando el cuerpo también opina ante el viento.',
        'Algo se revela cuando sueltas la necesidad de competir con el paisaje.',
        'No todo lo que se activa en el entorno apunta al mismo norte.'
      ],
      ciudad: [
        'Hay momentos en que el horizonte habla por contraste, no por confirmación.',
        'Puede que lo que despierta la amplitud no despierte lo mismo en ti.',
        'Hay señales que se entienden mejor en la respiración repetida.'
      ]
    }
  };

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
      'Quizá por eso notes dos ritmos distintos conviviendo.',
      'A veces ocurre que dos ritmos chocan sin pedir permiso.',
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
      'Puede que lo que despierta la ciudad no despierte lo mismo en ti.',
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

  function regionalizeInterpretationTail(text, ctx) {
    if (!text) return '';
    var marker = /observa si te sientes m[aá]s entero o m[aá]s expuesto[^.!?]*[.!?]?/gi;
    if (!marker.test(text)) return text;
    var region = ctx.regionFamily || 'IBERIAN';
    var goal = ctx.goalId || 'amor';
    var pack = OBSERVE_ENTERO_TAIL_BY_REGION[region] || OBSERVE_ENTERO_TAIL_BY_REGION.IBERIAN;
    var pool = pack[goal] || pack.amor;
    var variant = pool[hash32(String(ctx.seed) + ':entero-tail') % pool.length];
    return text.replace(marker, variant);
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

    out = regionalizeInterpretationTail(out, ctx);
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

  function lcfirstText(text) {
    if (!text) return '';
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function pickExperiential(ctx, key, variants) {
    return variants[hash32(String(ctx.seed) + ':' + key) % variants.length];
  }

  function humanizePresenceText(text, ctx) {
    if (!text) return '';
    initVoiceContext(ctx);
    var t = String(text);
    var before = t;
    var k = String(ctx._humanPresenceTransforms || 0);

    t = t.replace(/\bPara descanso o amor,\s*/gi, '');
    t = t.replace(/\bel lugar favorece\b/gi, function () {
      return pickExperiential(ctx, 'fav:' + k, [
        'quizá notes que se abre', 'tal vez descubras que se abre', 'puede que notes que se abre'
      ]);
    });
    t = t.replace(/\bel entorno activa\b/gi, function () {
      return pickExperiential(ctx, 'entA:' + k, [
        'quizá notes que se activa', 'tal vez sientas que se activa', 'puede que notes que se activa'
      ]);
    });
    t = t.replace(/\bel entorno premia\b/gi, 'tal vez notes que el entorno premia');
    t = t.replace(/\bel entorno suele\b/gi, 'a veces el entorno suele');
    t = t.replace(/\bla ciudad ofrece\b/gi, 'quizá te encuentres con');
    t = t.replace(/\bla energía impulsa\b/gi, 'tal vez notes un impulso');
    t = t.replace(/\bla energía está disponible\b/gi, 'quizá sientas la energía disponible');
    t = t.replace(/\blo que activa el lugar no siempre activa lo mismo en ti\b/gi,
      'quizá lo que despierta la ciudad no despierte lo mismo en ti');
    t = t.replace(/\bel lugar habla\b/gi, 'tal vez notes que el lugar habla');
    t = t.replace(/\bel lugar pide\b/gi, 'quizá sientas que pide');
    t = t.replace(/\bla señal es notable\b/gi, 'tal vez la señal te resulte notable');
    t = t.replace(/\bpuede activarse\b/gi, 'quizá se active');
    t = t.replace(/\binvierte primero\b/gi, 'quizá empieces por invertir');
    t = t.replace(/\bdefine qué\b/gi, 'quizá te ayude definir qué');
    t = t.replace(/\bel amor en ([^ ]+) no es\b/gi, 'quizá notes que el amor en $1 no es');
    t = t.replace(/\bel amor en ([^ ]+) no promete\b/gi, 'tal vez el amor en $1 no prometa');
    t = t.replace(/\ben ([^ ]+) el trabajo avanza\b/gi, 'en $1 quizá notes que tu trabajo avanza');
    t = t.replace(/\{ciudad\} enseña despacio/gi, 'quizá notes que {ciudad} te enseña despacio');

    if (t !== before) {
      ctx._humanPresenceTransforms = (ctx._humanPresenceTransforms || 0) + 1;
    }
    return t;
  }

  function filterGoalMismatchBlock(text, goalId) {
    if (!text) return '';
    var lower = text.toLowerCase();
    if (goalId === 'trabajo' && lower.indexOf('para descanso o amor') !== -1) return '';
    if (goalId === 'amor' && lower.indexOf('favorece trabajo de fondo') !== -1) return '';
    if (goalId === 'descanso' && lower.indexOf('lanzar, vender, competir') !== -1) return '';
    return text;
  }

  function hasNaturalConnector(text) {
    var lower = String(text || '').toLowerCase();
    for (var i = 0; i < NATURAL_CONNECTORS.length; i++) {
      if (lower.indexOf(NATURAL_CONNECTORS[i].toLowerCase().trim()) === 0) return true;
    }
    return /^(puede que|quizá|tal vez|a veces ocurre|con el tiempo|curiosamente|sin darte cuenta)/i
      .test(String(text || '').trim());
  }

  function paragraphNeedsConnector(paragraph) {
    var lower = String(paragraph || '').toLowerCase();
    return lower.indexOf('la señal') === 0 ||
      lower.indexOf('si lo que buscas') === 0 ||
      lower.indexOf('si tienes algo') === 0 ||
      lower.indexOf('energía para') === 0 ||
      lower.indexOf('favorece ') !== -1 ||
      lower.indexOf('puede activarse') !== -1 ||
      lower.indexOf('puede que se active') !== -1;
  }

  function maybePrependConnector(paragraph, ctx, key) {
    initVoiceContext(ctx);
    if (!paragraphNeedsConnector(paragraph)) return paragraph;
    if (hasNaturalConnector(paragraph)) return paragraph;
    if ((ctx._connectorsUsed || 0) >= 3) return paragraph;
    ctx._connectorKeys = ctx._connectorKeys || {};
    if (ctx._connectorKeys[key]) return paragraph;
    var idx = hash32(ctx.seed + ':conn:' + key) % NATURAL_CONNECTORS.length;
    var conn = NATURAL_CONNECTORS[idx];
    ctx._connectorKeys[key] = true;
    ctx._connectorsUsed = (ctx._connectorsUsed || 0) + 1;
    if (conn.indexOf(':') !== -1 || conn.slice(-1) === ' ') {
      return conn + lcfirstText(paragraph);
    }
    return conn + paragraph;
  }

  function experienceFirstParagraph(text, ctx, paraIndex) {
    if (!text || paraIndex > 0) return text;
    if (hasNaturalConnector(text)) return text;
    var lower = text.toLowerCase();
    if (lower.indexOf('la señal') === 0) {
      return 'Sin darte cuenta, ' + lcfirstText(text);
    }
    if (lower.indexOf('si lo que buscas') === 0 || lower.indexOf('si tienes algo') === 0) {
      return 'Quizá por eso ' + lcfirstText(text);
    }
    if (lower.indexOf('energía para empezar') === 0) {
      return 'Tal vez notes ' + lcfirstText(text);
    }
    return text;
  }

  function pickHumanScene(ctx, sectionId) {
    var region = ctx.regionFamily || 'IBERIAN';
    var regionalPack = HUMAN_SCENE_BY_REGION[region] || HUMAN_SCENE_BY_REGION.IBERIAN;
    var pool = regionalPack[ctx.goalId] || regionalPack.amor;
    if (!pool || !pool.length) {
      pool = HUMAN_SCENE_POOL[ctx.goalId] || HUMAN_SCENE_POOL.amor;
    }
    initVoiceContext(ctx);
    ctx._sceneKeys = ctx._sceneKeys || {};
    var attempts = 0;
    while (attempts < pool.length) {
      var idx = hash32(ctx.seed + ':scene:' + sectionId + ':' + attempts) % pool.length;
      var scene = pool[idx];
      if (!ctx._sceneKeys[scene]) {
        ctx._sceneKeys[scene] = true;
        return scene;
      }
      attempts += 1;
    }
    return '';
  }

  function applyHumanPresenceToSections(sections, ctx, narrativeContext) {
    if (!narrativeContext) return sections;
    var scenesUsed = 0;
    return sections.map(function (sec) {
      var paragraphs = String(sec.body || '').split(/\n\n+/).filter(Boolean);
      var out = [];
      paragraphs.forEach(function (para, pi) {
        var t = humanizePresenceText(para, ctx);
        t = filterGoalMismatchBlock(t, ctx.goalId);
        if (!t) return;
        t = experienceFirstParagraph(t, ctx, out.length);
        if (out.length > 0) {
          t = maybePrependConnector(t, ctx, sec.id + ':' + pi);
        }
        out.push(t);
      });
      if (sec.id === 'observar' && scenesUsed < 1) {
        var scene = pickHumanScene(ctx, sec.id);
        if (scene) {
          var blob = out.join(' ').toLowerCase();
          if (blob.indexOf(scene.toLowerCase().slice(0, 22)) === -1) {
            out.splice(Math.min(1, out.length), 0, scene);
            scenesUsed += 1;
            ctx._humanScenesUsed = (ctx._humanScenesUsed || 0) + 1;
          }
        }
      }
      var body = out.join('\n\n');
      return { id: sec.id, title: sec.title, body: body, words: wordCount(body) };
    });
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
    polished = filterGoalMismatchBlock(polished, ctx.goalId);
    return polished;
  }

function metaphorFingerprint(text) {
    var lower = String(text || '').toLowerCase();
    if (lower.indexOf('brújula') !== -1) return 'brújula';
    if (lower.indexOf('hilo') !== -1) return 'hilo';
    if (lower.indexOf('puerta') !== -1) return 'puerta';
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

  function transitionPoolFor(ctx, cat) {
    var region = ctx.regionFamily || 'IBERIAN';
    var regional = VOICE_TRANSITION_BY_REGION[region];
    if (regional && regional[cat] && regional[cat].length) {
      return regional[cat];
    }
    return VOICE_TRANSITION_POOL[cat] || VOICE_TRANSITION_POOL.matiz;
  }

  function pickVoiceTransition(ctx, sectionId, blockKey, rank) {
    initVoiceContext(ctx);
    var cats = SECTION_TRANSITION_CATS[sectionId] || ['matiz', 'contradiccion'];
    var attempts = 0;
    var maxAttempts = 24;

    while (attempts < maxAttempts) {
      var cat = cats[(rank + attempts) % cats.length];
      var pool = transitionPoolFor(ctx, cat);
      var idx = hash32(
        ctx.seed + ':' + sectionId + ':' + blockKey + ':' + (ctx.regionFamily || '') + ':' + attempts
      ) % pool.length;
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

  function countryLineFingerprint(line) {
    var s = String(line || '').toLowerCase().trim();
    var m = s.match(/^quizá en [^,]+,\s*(.+)/);
    if (m) s = m[1];
    m = s.match(/^en [^,]+,\s*(.+)/);
    if (m) s = m[1];
    return s.slice(0, 40);
  }

  function countryLinePresentIn(text, lineText) {
    if (!text || !lineText) return false;
    if (fragmentAlreadyIn(text, lineText)) return true;
    var fp = countryLineFingerprint(lineText);
    return fp.length >= 16 && text.toLowerCase().indexOf(fp) !== -1;
  }

  function applyCountryContextToSections(sections, narrativeContext, ctx, globalSeen) {
    ctx._countryLinesUsed = 0;
    ctx._countrySectionsUsed = ctx._countrySectionsUsed || [];

    if (!narrativeContext || !narrativeContext.countryContext) {
      return sections;
    }

    var cc = narrativeContext.countryContext;
    if (!cc.ok || !cc.lines || !cc.lines.length) {
      return sections;
    }

    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });

    cc.lines.slice(0, MAX_COUNTRY_LINES).forEach(function (item) {
      var sid = item.section;
      if (!COUNTRY_ALLOWED_SECTIONS[sid]) return;

      var sec = copy.find(function (s) { return s.id === sid; });
      if (!sec || !item.text) return;

      var text = String(item.text).trim();
      if (countryLinePresentIn(sec.body, text)) {
        ctx._countryLinesUsed += 1;
        if (ctx._countrySectionsUsed.indexOf(sid) === -1) {
          ctx._countrySectionsUsed.push(sid);
        }
        return;
      }

      if (ctx._countryLinesUsed >= MAX_COUNTRY_LINES) return;
      if (!claimMetaphor(text, ctx) || !claimText(text, ctx.cityName, globalSeen)) return;

      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      ctx._countryLinesUsed += 1;
      if (ctx._countrySectionsUsed.indexOf(sid) === -1) {
        ctx._countrySectionsUsed.push(sid);
      }
    });

    return copy;
  }

  function mergeAtmosphereLead(ctx, base, extra) {
    if (!extra || fragmentAlreadyIn(base, extra)) return base || '';
    var line = takeAtmosphereLine(ctx, extra);
    if (!line) return base || '';
    return base ? base + '\n\n' + line : line;
  }

  function applyPhraseEchoControl(sections) {
    var globalCounts = {};
    return sections.map(function (sec) {
      var body = sec.body || '';
      PHRASE_ECHO_RULES.forEach(function (rule) {
        var key = rule.phrase.toLowerCase();
        globalCounts[key] = globalCounts[key] || 0;
        var escaped = rule.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var re = new RegExp(escaped, 'gi');
        var altIdx = 0;
        body = body.replace(re, function (match) {
          if (rule.ban) {
            var bannedAlt = rule.alternates[altIdx % rule.alternates.length];
            altIdx += 1;
            if (match.charAt(0) === match.charAt(0).toUpperCase()) {
              return bannedAlt.charAt(0).toUpperCase() + bannedAlt.slice(1);
            }
            return bannedAlt;
          }
          globalCounts[key] += 1;
          if (globalCounts[key] === 1) return match;
          var alt = rule.alternates[altIdx % rule.alternates.length];
          altIdx += 1;
          if (match.charAt(0) === match.charAt(0).toUpperCase()) {
            return alt.charAt(0).toUpperCase() + alt.slice(1);
          }
          return alt;
        });
      });
      return {
        id: sec.id,
        title: sec.title,
        body: body,
        words: wordCount(body)
      };
    });
  }

  function pickFavoreceOpen(ctx) {
    var region = ctx.regionFamily || 'IBERIAN';
    var pack = SPINE_FAVORECE_OPEN_BY_REGION[region] || SPINE_FAVORECE_OPEN_BY_REGION.IBERIAN;
    var seed = ctx.seed || '';
    var start = hash32(seed + ':fav:' + (ctx.cityName || '')) % pack.length;
    ctx._usedFavoreceOpen = ctx._usedFavoreceOpen || {};
    var i;
    for (i = 0; i < pack.length; i++) {
      var open = pack[(start + i) % pack.length];
      var legacy = LEGACY_FAVORECE_OPEN_MARKERS.some(function (m) {
        return open.toLowerCase().indexOf(m) !== -1;
      });
      if (legacy || ctx._usedFavoreceOpen[open]) continue;
      ctx._usedFavoreceOpen[open] = true;
      return open;
    }
    return pack[start];
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
        return pickFavoreceOpen(ctx) +
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
    var paragraphs = String(lead).split(/\n\n+/).filter(Boolean);
    var words = 0;
    paragraphs.forEach(function (para) {
      var text = replaceCity(para, ctx.cityName, ctx.name);
      // Spine narrativo: siempre entra; claimMetaphor solo aplica a pads/topups/blocks.
      if (!claimText(text, ctx.cityName, globalSeen)) return;
      parts.push(text);
      stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
      words += wordCount(text);
    });
    return words;
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
      var sent = applyTextPolish(candidates[i].text, ctx, true);
      if (!sent || !claimText(sent, ctx.cityName, globalSeen)) continue;
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

  var GOAL_PADS_BY_REGION = {
    IBERIAN: {
      amor: [
        'En {ciudad}, el vínculo se afina en la conversación larga — una mirada que no pide conclusión.',
        'Anota una escena de compañía y vuelve a ella en la sobremesa tranquila.',
        'El amor aquí no pide teatro: pide verdad sostenida un poco más de lo cómodo.',
        'Si algo incomoda en el vínculo, obsérvalo en la plaza — no como fallo personal.',
        'La compañía cotidiana suele guiar mejor que los planes demasiado pulidos.',
        'Una verdad pequeña vale más que una noche perfecta para contar.',
        'Mira si la cercanía aguanta cuando baja la necesidad de impresionar.',
        'Lo que hoy tensa el vínculo puede aclararse si alargas la conversación sin resolverla.'
      ],
      trabajo: [
        'En {ciudad}, el sentido del trabajo se prueba en la sobremesa — no en la vitrina.',
        'Escribe en privado qué parte de tu obra sigue viva cuando nadie te evalúa.',
        'Una tarea pequeña en el barrio puede sostener más que una exposición brillante.',
        'Si algo incomoda en la trayectoria, obsérvalo en lo cotidiano — no como fracaso.',
        'La compañía honesta del proceso suele guiar mejor que los planes demasiado pulidos.',
        'Contrasta impulso y sentido antes de volver a la plaza profesional.',
        'Mira si el cansancio es de obra o de postureo — la diferencia importa en el barrio.',
        'Lo que hoy confunde la trayectoria puede aclararse si aflojas la prisa de demostrar.'
      ],
      descanso: [
        'En {ciudad}, el cuerpo recupera en la mesa: un paso lento, una tarde sin prisa.',
        'Anota un momento de calma en la sobremesa — no el que suena bien contarlo.',
        'El descanso aquí no pide disculpa: pide permiso sostenido un poco más de lo cómodo.',
        'Si algo incomoda en la pausa, obsérvalo en el gesto cotidiano — no como pereza.',
        'El ritmo del cuerpo en compañía suele guiar mejor que los planes demasiado pulidos.',
        'Un rato breve y real vale más que una semana de descanso performativo.',
        'Mira si la calma aguanta cuando vuelves a la plaza — ahí está la prueba.',
        'Lo que hoy acelera el cuerpo puede aflojarse si te quedas un poco más sin rendir.'
      ]
    },
    MEDITERRANEAN: {
      amor: [
        'En {ciudad}, el vínculo se prueba en la calle — proximidad antes que declaración.',
        'Anota un encuentro en el paseo y vuelve a él al caminar.',
        'El amor aquí no pide escena: pide presencia en la densidad del día.',
        'Si algo incomoda en el vínculo, obsérvalo en el tránsito — no como fallo personal.',
        'El ritmo urbano del encuentro suele orientar mejor que los planes demasiado cerrados.',
        'Un cruce breve y real vale más que una noche perfecta para contar.',
        'Mira si la cercanía aguanta cuando baja el impulso de impresionar en público.',
        'Lo que hoy acelera el vínculo puede aclararse si bajas el paso en la calle.'
      ],
      trabajo: [
        'En {ciudad}, el sentido del trabajo se prueba en la acera — no en la vitrina.',
        'Guarda en privado qué dirección sostienes antes de volver a la calle viva.',
        'Una tarea de fondo en la ciudad puede sostener más que una exposición brillante.',
        'Si algo incomoda en la trayectoria, obsérvalo en el bullicio — no como fracaso.',
        'El ritmo honesto de la calle suele orientar mejor que los planes demasiado cerrados.',
        'Contrasta impulso y propósito antes de exponer la trayectoria en público.',
        'Mira si el cansancio es de obra o de postureo — la diferencia importa al doblar la esquina.',
        'Lo que hoy confunde la trayectoria puede aclararse si aflojas la prisa de la vitrina.'
      ],
      descanso: [
        'En {ciudad}, el cuerpo recupera en el paseo: un paso lento, una tarde sin prisa.',
        'Anota un momento de calma en la calle — no el que suena bien contarlo.',
        'El descanso aquí no pide disculpa: pide permiso en medio del tránsito.',
        'Si algo incomoda en la pausa, obsérvalo en el ritmo urbano — no como pereza.',
        'El paso lento entre calles suele orientar mejor que los planes demasiado cerrados.',
        'Un tramo breve y real vale más que una semana de descanso performativo.',
        'Mira si la calma aguanta cuando vuelves a acelerar — ahí está la prueba en la calle.',
        'Lo que hoy acelera el cuerpo puede aflojarse si bajas el paso sin desaparecer.'
      ]
    },
    ANGLO: {
      amor: [
        'En {ciudad}, el vínculo se prueba en acuerdos pequeños — claridad antes que escena.',
        'Anota una conversación directa y vuelve a ella con honestidad más tarde.',
        'El amor aquí no pide performance: pide presencia con límites claros.',
        'Si algo incomoda en el vínculo, nómbralo en privado — no como fallo personal.',
        'Los acuerdos honestos suelen orientar mejor que los planes demasiado rígidos.',
        'Una verdad breve vale más que una noche perfecta para contar.',
        'Mira si la cercanía aguanta cuando baja la necesidad de aprobación.',
        'Lo que hoy tensa el vínculo puede aclararse si eliges verdad antes que impresionar.'
      ],
      trabajo: [
        'En {ciudad}, el sentido del trabajo se prueba en el calendario — no en la vitrina.',
        'Registra en privado qué dirección sostienes antes de volver a medir resultados.',
        'Una tarea de fondo en el bloque del día puede sostener más que una exposición brillante.',
        'Si algo incomoda en la trayectoria, revísalo en el plan — no como fracaso.',
        'Los bloques honestos del día suelen orientar mejor que los planes demasiado rígidos.',
        'Elige tu sentido antes de aceptar lo urgente del calendario.',
        'Mira si el cansancio es de obra o de postureo — la diferencia importa en la agenda.',
        'Lo que hoy confunde la trayectoria puede aclararse si aflojas la prisa de demostrar.'
      ],
      descanso: [
        'En {ciudad}, el cuerpo recupera en bloques: un tramo lento, una tarde reservada.',
        'Anota un momento de calma reservado — no el que suena bien contarlo.',
        'El descanso aquí no pide disculpa: pide permiso explícito en el calendario.',
        'Si algo incomoda en la pausa, revísalo como señal — no como pereza.',
        'Los bloques de calma suelen orientar mejor que los planes demasiado rígidos.',
        'Un bloque breve y real vale más que una semana de descanso teatral.',
        'Mira si la calma aguanta cuando vuelves a la agenda — ahí está la prueba.',
        'Lo que hoy acelera el cuerpo puede aflojarse si reservas pausa con la misma seriedad.'
      ]
    },
    EAST_ASIAN: {
      amor: [
        'En {ciudad}, el vínculo se afina en gestos repetidos — detalle antes que declaración.',
        'Anota un gesto mínimo del encuentro y vuelve a él con calma más tarde.',
        'El amor aquí no pide escena: pide cuidado sostenido en lo pequeño.',
        'Si algo incomoda en el vínculo, obsérvalo en la secuencia — no como fallo personal.',
        'Los gestos cotidianos suelen orientar mejor que los planes demasiado apresurados.',
        'Un detalle breve y real vale más que una noche perfecta para contar.',
        'Mira si la cercanía aguanta cuando baja la prisa de concluir.',
        'Lo que hoy tensa el vínculo puede aclararse si observas antes de responder.'
      ],
      trabajo: [
        'En {ciudad}, el sentido del trabajo madura en pasos — no en la vitrina.',
        'Anota en privado qué paso del proceso sigue vivo cuando nadie te evalúa.',
        'Una tarea mínima de fondo puede sostener más que una exposición brillante.',
        'Si algo incomoda en la trayectoria, obsérvalo en la secuencia — no como fracaso.',
        'El proceso honesto suele orientar mejor que los planes demasiado apresurados.',
        'Sostén un paso interno antes de exponer la trayectoria.',
        'Mira si el cansancio es de obra o de postureo — la diferencia importa en el detalle.',
        'Lo que hoy confunde la trayectoria puede aclararse si dejas madurar en silencio.'
      ],
      descanso: [
        'En {ciudad}, el cuerpo recupera en tramos: un paso lento, una pausa observada.',
        'Anota un momento de calma en la secuencia — no el que suena bien contarlo.',
        'El descanso aquí no pide disculpa: pide permiso en la secuencia del día.',
        'Si algo incomoda en la pausa, obsérvalo en el ritmo — no como pereza.',
        'El tramo lento del cuerpo suele orientar mejor que los planes demasiado apresurados.',
        'Un tramo breve y real vale más que una semana de descanso teatral.',
        'Mira si la calma aguanta cuando vuelves a acelerar — ahí está la prueba en el detalle.',
        'Lo que hoy acelera el cuerpo puede aflojarse si dejas que marque el ritmo.'
      ]
    },
    AFRICAN_COASTAL: {
      amor: [
        'En {ciudad}, el vínculo respira con amplitud — cercanía antes que escena cerrada.',
        'Anota un encuentro con horizonte abierto y vuelve a él con calma más tarde.',
        'El amor aquí no pide prisa: pide presencia que no tema la distancia.',
        'Si algo incomoda en el vínculo, obsérvalo en el contraste — no como fallo personal.',
        'La calma del horizonte suele orientar mejor que los planes demasiado estrechos.',
        'Un gesto amplio y real vale más que una noche perfecta para contar.',
        'Mira si la cercanía aguanta cuando abre el viento y el día cambia.',
        'Lo que hoy tensa el vínculo puede aclararse si dejas respirar la escena.'
      ],
      trabajo: [
        'En {ciudad}, el sentido del trabajo se prueba ante el paisaje — no en la vitrina.',
        'Escribe en privado qué dirección es tuya antes de seguir el impulso del entorno.',
        'Una tarea de fondo con horizonte puede sostener más que una exposición brillante.',
        'Si algo incomoda en la trayectoria, obsérvalo en el contraste — no como fracaso.',
        'El contraste del entorno suele orientar mejor que los planes demasiado estrechos.',
        'Contrasta impulso del paisaje y propósito interno antes del siguiente paso.',
        'Mira si el cansancio es de obra o de postureo — la diferencia importa con el horizonte.',
        'Lo que hoy confunde la trayectoria puede aclararse si aflojas la prisa del entorno.'
      ],
      descanso: [
        'En {ciudad}, el cuerpo recupera con amplitud: un paso lento, una tarde al viento.',
        'Anota un momento de calma con horizonte — no el que suena bien contarlo.',
        'El descanso aquí no pide disculpa: pide permiso ante el horizonte abierto.',
        'Si algo incomoda en la pausa, obsérvalo en el cuerpo — no como pereza.',
        'La respiración del paisaje suele orientar mejor que los planes demasiado estrechos.',
        'Un respiro breve y real vale más que una semana de descanso teatral.',
        'Mira si la calma aguanta cuando vuelves a acelerar — ahí está la prueba en la amplitud.',
        'Lo que hoy acelera el cuerpo puede aflojarse si habitas la pausa con el viento.'
      ]
    }
  };

  /** Fallback global (regiones no mapeadas). */
  var HUMAN_EDITORIAL_PADS_BY_GOAL = {
    amor: [
      'En {ciudad}, el vínculo se afina en gestos pequeños — una mirada, un silencio cómodo.',
      'Anota una escena concreta del encuentro y vuelve a ella con calma más tarde.',
      'El amor aquí no pide escena: pide presencia sostenida un poco más de lo cómodo.',
      'Si algo incomoda en el vínculo, escúchalo como brújula — no como fallo personal.',
      'Los ritmos honestos del encuentro suelen guiar mejor que los planes demasiado pulidos.',
      'Una conversación breve y real vale más que una noche perfecta para contar.',
      'Mira si la cercanía aguanta cuando baja el impulso de impresionar.',
      'Lo contradictorio de hoy puede volverse legible si aflojas la urgencia de resolver el vínculo.'
    ],
    trabajo: [
      'En {ciudad}, el sentido del trabajo se prueba en lo cotidiano — no en la vitrina.',
      'Escribe en privado qué parte de tu obra sigue viva cuando nadie te evalúa.',
      'Una tarea pequeña de fondo puede sostener más que una exposición brillante.',
      'Si algo incomoda en la trayectoria, escúchalo como brújula — no como fracaso.',
      'Los ritmos honestos del trabajo suelen guiar mejor que los planes demasiado pulidos.',
      'Contrastar impulso y propósito antes de decir que sí a lo urgente.',
      'Mira si el cansancio es de obra o de postureo — la diferencia importa.',
      'Lo contradictorio de hoy puede volverse legible si aflojas la urgencia de demostrar.'
    ],
    descanso: [
      'En {ciudad}, el cuerpo recupera en detalles: un paso lento, una tarde sin prisa.',
      'Anota un momento de calma real — no el que suena bien contarlo.',
      'El descanso aquí no pide disculpa: pide permiso sostenido un poco más de lo cómodo.',
      'Si algo incomoda en la pausa, escúchalo como brújula — no como pereza.',
      'Los ritmos honestos del cuerpo suelen guiar mejor que los planes demasiado pulidos.',
      'Un bloque breve y real vale más que una semana de descanso performativo.',
      'Mira si la calma aguanta cuando vuelves a acelerar — ahí está la prueba.',
      'Lo contradictorio de hoy puede volverse legible si aflojas la urgencia de rendir incluso en la pausa.'
    ],
  };

  var REGIONAL_EDITORIAL_MICRO_BY_GOAL = {
    IBERIAN: {
      amor: [
        'En la conversación de {ciudad}, a veces basta alargar la escena sin concluirla.',
        'La compañía cotidiana puede sostener lo anterior un poco más.'
      ],
      trabajo: [
        'En la sobremesa de {ciudad}, a veces basta guardar silencio antes de volver a la plaza.',
        'La obra silenciosa puede sostener lo anterior un poco más.'
      ],
      descanso: [
        'En la mesa de {ciudad}, a veces basta quedarte sin explicarte.',
        'El cuerpo en compañía puede sostener lo anterior un poco más.'
      ]
    },
    MEDITERRANEAN: {
      amor: [
        'En el paseo de {ciudad}, a veces basta bajar el paso sin concluir la escena.',
        'La proximidad en la calle puede sostener lo anterior un poco más.'
      ],
      trabajo: [
        'En la acera de {ciudad}, a veces basta respirar antes de volver a la vitrina.',
        'El paso urbano puede sostener lo anterior un poco más.'
      ],
      descanso: [
        'En el tránsito de {ciudad}, a veces basta parar sin desaparecer.',
        'El cuerpo en movimiento lento puede sostener lo anterior un poco más.'
      ]
    },
    ANGLO: {
      amor: [
        'En el acuerdo de {ciudad}, a veces basta nombrar un límite antes de abrir la escena.',
        'La claridad del vínculo puede sostener lo anterior un poco más.'
      ],
      trabajo: [
        'En el calendario de {ciudad}, a veces basta elegir dirección antes de lo urgente.',
        'El bloque de sentido puede sostener lo anterior un poco más.'
      ],
      descanso: [
        'En la pausa reservada de {ciudad}, a veces basta bajar exigencia sin rendir.',
        'El bloque de calma puede sostener lo anterior un poco más.'
      ]
    },
    EAST_ASIAN: {
      amor: [
        'En el detalle de {ciudad}, a veces basta repetir un gesto sin forzar la escena.',
        'La secuencia del encuentro puede sostener lo anterior un poco más.'
      ],
      trabajo: [
        'En el paso de {ciudad}, a veces basta sostener el proceso antes de la vitrina.',
        'El tramo silencioso puede sostener lo anterior un poco más.'
      ],
      descanso: [
        'En la rutina de {ciudad}, a veces basta observar el cuerpo antes de acelerar.',
        'El tramo lento puede sostener lo anterior un poco más.'
      ]
    },
    AFRICAN_COASTAL: {
      amor: [
        'Ante el horizonte de {ciudad}, a veces basta dejar respirar la escena.',
        'La amplitud del vínculo puede sostener lo anterior un poco más.'
      ],
      trabajo: [
        'Con el contraste de {ciudad}, a veces basta elegir dirección antes del impulso.',
        'El sentido habitado puede sostener lo anterior un poco más.'
      ],
      descanso: [
        'Con el viento de {ciudad}, a veces basta habitar la pausa sin competir.',
        'La respiración abierta puede sostener lo anterior un poco más.'
      ]
    }
  };

  var REGIONAL_EDITORIAL_PADS = {
    IBERIAN: [
      'A veces lo esencial aparece en la plaza — una conversación larga que no pide conclusión.',
      '{ciudad} enseña en el barrio, sin pedirte prisa de entenderlo todo.',
      'La compañía cotidiana puede bastarte para seguir habitando {ciudad} con verdad.',
      'Lo hermoso vive en la sobremesa tranquila, no solo en el gran gesto.',
      'No necesitas resolver la escena: basta cercanía sostenida un poco más.',
      'Cuando algo incomoda, obsérvalo en gestos pequeños — no en el juicio rápido.',
      'Deja que la escena del barrio te devuelva su ritmo — sin prisa de concluir.',
      'Un gesto de compañía puede bastarte para seguir caminando {ciudad} con calma.'
    ],
    MEDITERRANEAN: [
      'A veces lo esencial aparece en el paseo — una calle viva que no pide prisa.',
      '{ciudad} enseña en la proximidad urbana, sin pedirte conclusión inmediata.',
      'La densidad humana puede bastarte para seguir habitando {ciudad} con verdad.',
      'Lo hermoso vive en el ritmo urbano tranquilo, no solo en la epifanía.',
      'No hace falta resolver la escena: basta presencia en la calle que caminas.',
      'Cuando algo incomoda, obsérvalo en el tránsito cotidiano — no como fallo.',
      'Deja que el paseo te devuelva su propio ritmo — sin prisa de concluir.',
      'Un gesto de proximidad puede bastarte para seguir caminando {ciudad} con calma.'
    ],
    ANGLO: [
      'A veces lo esencial aparece en el trayecto — un bloque del día que no pide prisa.',
      '{ciudad} enseña en el proceso, sin pedirte conclusión inmediata.',
      'La planificación honesta puede bastarte para seguir habitando {ciudad} con verdad.',
      'Lo hermoso vive en la repetición del calendario, no solo en la epifanía.',
      'No hace falta resolver la escena: basta presencia en el bloque que estás viviendo.',
      'Cuando algo incomoda, obsérvalo en el proceso — no como fallo del plan.',
      'Deja que el trayecto te devuelva su propio ritmo — sin prisa de concluir.',
      'Un acuerdo pequeño puede bastarte para seguir caminando {ciudad} con calma.'
    ],
    EAST_ASIAN: [
      'A veces lo esencial aparece en la secuencia — un detalle que no pide prisa.',
      '{ciudad} enseña en la rutina precisa, sin pedirte conclusión inmediata.',
      'La precisión cotidiana puede bastarte para seguir habitando {ciudad} con verdad.',
      'Lo hermoso vive en el tránsito tranquilo, no solo en la epifanía.',
      'No hace falta apresurar el gesto: basta presencia en el detalle que estás viviendo.',
      'Cuando algo incomoda, obsérvalo en la secuencia — no como fallo.',
      'Deja que la rutina te devuelva su propio ritmo — sin prisa de concluir.',
      'Un tramo bien transitado puede bastarte para seguir caminando {ciudad} con calma.'
    ],
    AFRICAN_COASTAL: [
      'A veces lo esencial aparece en el horizonte — una amplitud que no pide prisa.',
      '{ciudad} enseña con el viento, sin pedirte conclusión inmediata.',
      'El contraste del paisaje vivo puede bastarte para seguir habitando {ciudad} con verdad.',
      'Lo hermoso vive en la amplitud tranquila, no solo en la epifanía.',
      'No hace falta apresurar la mirada: basta presencia ante el horizonte que abres.',
      'Cuando algo incomoda, obsérvalo en el contraste — no como fallo.',
      'Deja que el paisaje te devuelva su propio ritmo — sin prisa de concluir.',
      'Un gesto de amplitud puede bastarte para seguir caminando {ciudad} con calma.'
    ]
  };

  var REGIONAL_TOPUP_VARIANTS = {
    IBERIAN: [
      'Puede que notes que {ciudad} se afina cuando la compañía también opina.',
      'Los gestos del barrio suelen guiar mejor que los planes demasiado pulidos.',
      'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó en tu día a día.',
      'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva en la plaza.',
      'A veces hay que caminar una escena de barrio para entender el mapa.',
      'La coherencia no tiene que ser total: basta una conversación que te sostenga.',
      'Tal vez descubras que algunas lecturas maduran despacio, como una sobremesa.',
      'Puede que notes el lugar en detalles: una mirada en la plaza, un silencio cómodo.',
      'Deja que la cercanía cotidiana te devuelva su ritmo — sin prisa de concluir.',
      'Un gesto de compañía puede bastarte para seguir explorando {ciudad} con verdad.'
    ],
    MEDITERRANEAN: [
      'Puede que notes que {ciudad} se afina cuando el paseo también opina.',
      'Los ritmos de la calle viva suelen guiar mejor que los planes demasiado pulidos.',
      'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó al caminar.',
      'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva en la proximidad.',
      'A veces hay que recorrer una calle cotidiana para entender el mapa.',
      'La coherencia no tiene que ser total: basta un paseo que te sostenga.',
      'Tal vez descubras que algunas lecturas maduran despacio, como un giro urbano.',
      'Puede que notes el lugar en detalles: un cruce, un murmullo, una densidad distinta.',
      'Deja que el ritmo urbano te devuelva su calma — sin prisa de concluir.',
      'Un gesto de proximidad puede bastarte para seguir explorando {ciudad} con verdad.'
    ],
    ANGLO: [
      'Puede que notes que {ciudad} se afina cuando el calendario también opina.',
      'Los bloques honestos del día suelen guiar mejor que los planes demasiado pulidos.',
      'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó en tu proceso.',
      'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva en el trayecto.',
      'A veces hay que transitar una escena cotidiana para entender el mapa.',
      'La coherencia no tiene que ser total: basta un bloque que te sostenga.',
      'Tal vez descubras que algunas lecturas maduran despacio, como un plan revisado.',
      'Puede que notes el lugar en detalles: un retraso, un cansancio, un silencio útil.',
      'Deja que la planificación te devuelva su ritmo — sin prisa de concluir.',
      'Un trayecto bien habitado puede bastarte para seguir explorando {ciudad} con verdad.'
    ],
    EAST_ASIAN: [
      'Puede que notes que {ciudad} se afina cuando la rutina también opina.',
      'Las secuencias honestas suelen guiar mejor que los planes demasiado pulidos.',
      'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó en el detalle.',
      'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva en la precisión cotidiana.',
      'A veces hay que transitar una escena precisa para entender el mapa.',
      'La coherencia no tiene que ser total: basta una secuencia que te sostenga.',
      'Tal vez descubras que algunas lecturas maduran despacio, como un tramo repetido.',
      'Puede que notes el lugar en detalles: un gesto mínimo, un cansancio, un orden distinto.',
      'Deja que el tránsito te devuelva su ritmo — sin prisa de concluir.',
      'Un detalle bien transitado puede bastarte para seguir explorando {ciudad} con verdad.'
    ],
    AFRICAN_COASTAL: [
      'Puede que notes que {ciudad} se afina cuando el horizonte también opina.',
      'Los contrastes del paisaje vivo suelen guiar mejor que los planes demasiado pulidos.',
      'Vuelve a esta lectura en unas semanas — no para validarla, sino para notar qué mudó en la amplitud.',
      'Quizá la clave no sea hacer más, sino escuchar cuál señal sigue viva con el viento.',
      'A veces hay que mirar una escena amplia para entender el mapa.',
      'La coherencia no tiene que ser total: basta una amplitud que te sostenga.',
      'Tal vez descubras que algunas lecturas maduran despacio, como un contraste leve.',
      'Puede que notes el lugar en detalles: una brisa, un cansancio, un silencio distinto.',
      'Deja que el paisaje te devuelva su ritmo — sin prisa de concluir.',
      'Un gesto de amplitud puede bastarte para seguir explorando {ciudad} con verdad.'
    ]
  };

  function topupSlotTwist(base, goal, slot) {
    if (goal === 'amor') return base;
    if (goal === 'trabajo') {
      switch (slot) {
        case 0: return base.replace('también opina', 'también orienta el sentido del trabajo');
        case 1: return base.replace(/suelen guiar/i, 'del proceso suelen guiar');
        case 2: return base.replace('esta lectura', 'esta trayectoria').replace(/notar qué mudó [^.]+\./, 'notar qué mudó en el sentido del trabajo.');
        case 3: return base.replace('hacer más', 'producir más').replace('señal', 'dirección');
        case 4: return base.replace('entender el mapa', 'entender el mapa en el trabajo');
        case 5: return base.replace(/basta [^.]+\./, 'basta un paso de sentido que te sostenga.');
        case 6: return base.replace('lecturas', 'decisiones');
        case 7: return base.replace(/detalles: .+/, 'detalles: una entrega, un límite, un cansancio útil.');
        case 8: return base.replace(/Deja que [^—]+—/, 'Deja que el proceso te devuelva su ritmo —');
        case 9: return base.replace(/Un [^ ]+ [^ ]+/, 'Un paso bien habitado').replace('explorando', 'habitando');
        default: return base;
      }
    }
    switch (slot) {
      case 0: return base.replace('también opina', 'también habla en el cuerpo');
      case 1: return base.replace(/suelen guiar/i, 'del descanso suelen guiar');
      case 2: return base.replace('esta lectura', 'esta pausa');
      case 3: return base.replace('hacer más', 'llenar más').replace('señal', 'calma');
      case 4: return base.replace('entender el mapa', 'entender el mapa en la pausa');
      case 5: return base.replace(/basta [^.]+\./, 'basta una pausa real que te sostenga.');
      case 6: return base.replace('lecturas', 'pausas');
      case 7: return base.replace(/detalles: .+/, 'detalles: un silencio, un respiro, un cansancio distinto.');
      case 8: return base.replace(/Deja que [^—]+—/, 'Deja que el cuerpo te devuelva su ritmo —');
      case 9: return base.replace(/Un [^ ]+ [^ ]+/, 'Un respiro bien habitado').replace('explorando', 'descansando en');
      default: return base;
    }
  }

  var REGIONAL_TOPUP_BY_GOAL = {};
  Object.keys(REGIONAL_TOPUP_VARIANTS).forEach(function (region) {
    var base = REGIONAL_TOPUP_VARIANTS[region];
    REGIONAL_TOPUP_BY_GOAL[region] = {
      amor: base.slice(),
      trabajo: base.map(function (line, i) { return topupSlotTwist(line, 'trabajo', i); }),
      descanso: base.map(function (line, i) { return topupSlotTwist(line, 'descanso', i); })
    };
  });

  function resolveRegionFamily(cityId, countryId) {
    var EFR = window.KairosEditorialFamily;
    if (EFR && typeof EFR.resolveEditorialFamily === 'function') {
      return EFR.resolveEditorialFamily({ cityName: cityId, countryId: countryId });
    }
    return 'IBERIAN';
  }

  function goalPadPool(ctx) {
    var region = ctx.regionFamily || 'IBERIAN';
    var pack = GOAL_PADS_BY_REGION[region] || GOAL_PADS_BY_REGION.IBERIAN;
    return pack[ctx.goalId] || pack.amor;
  }

  function regionalPadsForGoal(ctx) {
    var region = ctx.regionFamily || 'IBERIAN';
    var regional = REGIONAL_EDITORIAL_PADS[region] || REGIONAL_EDITORIAL_PADS.IBERIAN;
    var goalIdx = ctx.goalId === 'trabajo' ? 1 : (ctx.goalId === 'descanso' ? 2 : 0);
    var out = [];
    for (var i = 0; i < regional.length; i += 1) {
      if (i % 3 === goalIdx) out.push(regional[i]);
    }
    return out;
  }

  function editorialPadPool(ctx) {
    var goalPool = goalPadPool(ctx);
    var region = ctx.regionFamily || 'IBERIAN';
    var microPack = REGIONAL_EDITORIAL_MICRO_BY_GOAL[region] || REGIONAL_EDITORIAL_MICRO_BY_GOAL.IBERIAN;
    var micro = microPack[ctx.goalId] || microPack.amor || [];
    return goalPool.concat(micro).concat(regionalPadsForGoal(ctx));
  }

  function metaphorWouldClaim(text, ctx) {
    var fp = metaphorFingerprint(text);
    if (!fp) return true;
    initVoiceContext(ctx);
    return !ctx._usedMetaphors[fp];
  }

  function pickEditorialPad(ctx, guard, idx) {
    var pool = editorialPadPool(ctx);
    var key = ctx.seed + ':pad:' + guard + ':' + (ctx.regionFamily || '') + ':' + ctx.goalId;
    var start = (idx + hash32(key)) % pool.length;
    for (var attempt = 0; attempt < pool.length; attempt += 1) {
      var candidate = pool[(start + attempt) % pool.length];
      if (metaphorWouldClaim(candidate, ctx)) return candidate;
    }
    return pool[start];
  }

  function regionalTopupPool(ctx) {
    var region = ctx.regionFamily || 'IBERIAN';
    var pack = REGIONAL_TOPUP_BY_GOAL[region] || REGIONAL_TOPUP_BY_GOAL.IBERIAN;
    return pack[ctx.goalId] || pack.amor;
  }

  function pickTopupVariant(ctx, guard, salt) {
    var pool = regionalTopupPool(ctx);
    var key = ctx.seed + ':top:' + guard + ':' + salt + ':' + (ctx.regionFamily || '') + ':' + ctx.goalId;
    var start = (guard + hash32(key)) % pool.length;
    for (var attempt = 0; attempt < pool.length; attempt += 1) {
      var candidate = pool[(start + attempt) % pool.length];
      if (metaphorWouldClaim(candidate, ctx)) return candidate;
    }
    return pool[start];
  }

  function narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, minTotal) {
    if (!narrativeContext) return sections;
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var targets = ['favorece', 'aprovecha', 'desafia', 'observar', 'integracion'];
    var idx = 0;
    var guard = 0;
    while (sectionsWordTotal(copy) < minTotal && guard < 36) {
      var tpl = pickEditorialPad(ctx, guard, idx);
      idx += 1;
      guard += 1;
      var text = applyTextPolish(tpl, ctx, true);
      var sec = copy.find(function (s) { return s.id === targets[guard % targets.length]; });
      if (!sec) break;
      if (!text || !claimMetaphor(text, ctx) || !claimText(text, ctx.cityName, globalSeen)) continue;
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      stats.synthesisBlocks = (stats.synthesisBlocks || 0) + 1;
      stats._wordsByKind = stats._wordsByKind || {};
      stats._wordsByKind.synthesisBlocks = (stats._wordsByKind.synthesisBlocks || 0) + wordCount(text);
    }
    return copy;
  }

  function humanEditorialTopUp(sections, ctx, globalSeen, stats, minTotal) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var targets = ['observar', 'integracion', 'favorece', 'aprovecha', 'desafia'];
    var guard = 0;
    while (sectionsWordTotal(copy) < minTotal && guard < 48) {
      var tpl = pickTopupVariant(ctx, guard, 'main');
      guard += 1;
      var text = applyTextPolish(tpl, ctx, true);
      var sec = copy.find(function (s) { return s.id === targets[guard % targets.length]; });
      if (!sec || !text || !claimMetaphor(text, ctx) ||
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
        if (claimMetaphor(obsText, ctx) && claimText(obsText, ctx.cityName, globalSeen)) {
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
      var sent = applyTextPolish(candidates[i].text, ctx, true);
      if (!sent || !claimText(sent, ctx.cityName, globalSeen)) continue;
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

  function ensureMinWordsAfterCountry(sections, ctx, minTotal) {
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    var guard = 0;
    var poolLen = regionalTopupPool(ctx).length;
    while (sectionsWordTotal(copy) < minTotal && guard < poolLen) {
      var tpl = pickTopupVariant(ctx, guard, 'postcountry');
      var text = replaceCity(tpl, ctx.cityName, ctx.name);
      var sec = copy.find(function (s) { return s.id === 'integracion'; }) ||
        copy.find(function (s) { return s.id === 'observar'; });
      if (!sec || !text || !claimMetaphor(text, ctx)) break;
      sec.body = sec.body ? sec.body + '\n\n' + text : text;
      sec.words = wordCount(sec.body);
      guard += 1;
    }
    return copy;
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
      },
      _humanPresenceTransforms: 0,
      _connectorsUsed: 0,
      _humanScenesUsed: 0,
      _countryLinesUsed: 0,
      _countrySectionsUsed: []
    };

    var narrativeWrap = resolveNarrativeContext(input, ctx);
    var narrativeContext = narrativeWrap.narrativeContext;
    var EFR = window.KairosEditorialFamily;
    var countryId = narrativeContext && narrativeContext.countryContext
      ? narrativeContext.countryContext.countryId
      : (EFR && typeof EFR.coerceCountryId === 'function'
        ? EFR.coerceCountryId(city.country)
        : (window.KairosCitiesCatalog && typeof window.KairosCitiesCatalog.resolveCountryId === 'function'
          ? window.KairosCitiesCatalog.resolveCountryId(city.country)
          : null));
    ctx.regionFamily = narrativeContext && narrativeContext.regionFamily
      ? narrativeContext.regionFamily
      : resolveRegionFamily(cityName, countryId);
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
          if (!hasClose && claimMetaphor(closeText, ctx) && claimText(closeText, cityName, globalSeen)) {
            integracionSec.body = integracionSec.body
              ? integracionSec.body + '\n\n' + closeText
              : closeText;
            integracionSec.words = wordCount(integracionSec.body);
          }
        }
      }
    }

    if (narrativeContext) {
      sections = applyHumanPresenceToSections(sections, ctx, narrativeContext);
      syncSectionWords(sections);
      sections = applyCountryContextToSections(sections, narrativeContext, ctx, globalSeen);
      syncSectionWords(sections);
      if (sectionsWordTotal(sections) < MIN_WORDS) {
        sections = narrativeWordPadding(sections, narrativeContext, ctx, globalSeen, stats, MIN_WORDS);
        syncSectionWords(sections);
      }
      if (sectionsWordTotal(sections) < MIN_WORDS) {
        sections = humanEditorialTopUp(sections, ctx, globalSeen, stats, MIN_WORDS);
        syncSectionWords(sections);
      }
      if (sectionsWordTotal(sections) < MIN_WORDS) {
        sections = ensureMinWordsAfterCountry(sections, ctx, MIN_WORDS);
        syncSectionWords(sections);
      }
    }

    sections = applyPhraseEchoControl(sections);
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
        },
        humanPresenceTransforms: ctx._humanPresenceTransforms || 0,
        connectorsUsed: ctx._connectorsUsed || 0,
        humanScenesUsed: ctx._humanScenesUsed || 0,
        countryContext: narrativeContext && narrativeContext.countryContext
          ? {
            ok: narrativeContext.countryContext.ok,
            countryId: narrativeContext.countryContext.countryId,
            countryName: narrativeContext.countryContext.countryName,
            warnings: narrativeContext.countryContext.warnings || [],
            lines: narrativeContext.countryContext.lines || [],
            meta: narrativeContext.countryContext.meta || null
          }
          : null,
        countryLinesUsed: ctx._countryLinesUsed || 0,
        countrySectionsUsed: ctx._countrySectionsUsed || []
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
    MAX_COUNTRY_LINES: MAX_COUNTRY_LINES,
    COUNTRY_ALLOWED_SECTIONS: COUNTRY_ALLOWED_SECTIONS,
    THEME_ES: THEME_ES,
    EN_THEME_KEYS: EN_THEME_KEYS,
    FORBIDDEN: FORBIDDEN,
    composeCityReading: composeCityReading,
    resolveRegionFamily: resolveRegionFamily,
    SPINE_FAVORECE_OPEN_BY_REGION: SPINE_FAVORECE_OPEN_BY_REGION,
    GOAL_PADS_BY_REGION: GOAL_PADS_BY_REGION,
    REGIONAL_EDITORIAL_MICRO_BY_GOAL: REGIONAL_EDITORIAL_MICRO_BY_GOAL,
    VOICE_TRANSITION_BY_REGION: VOICE_TRANSITION_BY_REGION,
    REGIONAL_EDITORIAL_PADS: REGIONAL_EDITORIAL_PADS,
    REGIONAL_TOPUP_VARIANTS: REGIONAL_TOPUP_VARIANTS,
    METHODOLOGY_BLOCK_IDS: METHODOLOGY_BLOCK_IDS,
    METHODOLOGY_PHRASE_MARKERS: METHODOLOGY_PHRASE_MARKERS,
    METHODOLOGY_SUPPRESS_MARKERS: METHODOLOGY_SUPPRESS_MARKERS,
    PROHIBITED_TRANSITIONS: PROHIBITED_TRANSITIONS,
    DESCRIPTIVE_PHRASE_MARKERS: DESCRIPTIVE_PHRASE_MARKERS,
    VOICE_TRANSITION_POOL: VOICE_TRANSITION_POOL,
    _dev: {
      classifyBlockSource: classifyBlockSource,
      sectionIdForBlock: sectionIdForBlock,
      buildSpineLead: buildSpineLead,
      countMethodologyRepeats: countMethodologyRepeats,
      softenMethodologyText: softenMethodologyText,
      pickVoiceTransition: pickVoiceTransition,
      humanizePresenceText: humanizePresenceText,
      applyCountryContextToSections: applyCountryContextToSections,
      countryLinePresentIn: countryLinePresentIn
    }
  };
})();
