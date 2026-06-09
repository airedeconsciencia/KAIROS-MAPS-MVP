/**
 * KAIROS MAPS — Narrative Intelligence Layer (Fase 3.8f.6 DEV)
 *
 * Deriva hilo narrativo determinista antes de knowledge + composición.
 * Sin IA. Voz premium + atmósfera de ciudad (5 piloto) + matiz país (fail-soft).
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8f.6-dev-0.1';
  var MAX_DEEP = 2;
  var MAX_COUNTRY_LINES = 2;
  var COUNTRY_SECTIONS = ['sintesis', 'observar', 'integracion'];

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
    amor: [
      'Si te quedas en {ciudad}, mira si el vínculo se sostiene en gestos pequeños — no en la escena que contarías después.',
      'Habitar {ciudad} es ver si la cercanía aguanta cuando baja el impulso de impresionar.',
      'Los días en {ciudad} suelen mostrar si el encuentro pide presencia o performance — y cuál alimentas sin nombrarlo.',
      'En {ciudad}, anota una escena concreta del vínculo: una conversación, un silencio — y vuelve a ella con calma.',
      'Quedarte en {ciudad} afina lo que la primera impresión prometió sobre el amor.',
      'Si repites el mismo encuentro en {ciudad}, verás si la ternura es hábito o excepción.',
      'Lo cotidiano en {ciudad} enseña si el vínculo respira o solo brilla cuando hay público.',
      'Después de unas semanas en {ciudad}, la pregunta útil es simple: ¿te sientes más tú o más escena?'
    ],
    trabajo: [
      'Si te quedas en {ciudad}, mira si tu trabajo pide sustancia o escenario — y cuál alimentas sin darte cuenta.',
      'Habitar {ciudad} es contrastar el sentido que traías con el ritmo que el lugar impone.',
      'Los días en {ciudad} suelen revelar si la trayectoria se mide por obra o por vitrina.',
      'En {ciudad}, anota qué parte de tu trabajo sigue viva cuando nadie te evalúa.',
      'Quedarte en {ciudad} afina la diferencia entre impulso y propósito.',
      'Si repites la misma semana laboral en {ciudad}, verás si el cansancio es de fondo o de postureo.',
      'Lo cotidiano en {ciudad} enseña si el trabajo te sostiene o solo te acelera.',
      'Después de unas semanas en {ciudad}, la pregunta útil es: ¿para quién trabajas cuando el ruido baja?'
    ],
    descanso: [
      'Si te quedas en {ciudad}, mira si el cuerpo recupera o solo cambia de exigencia.',
      'Habitar {ciudad} es ver si la pausa es refugio o otra forma de competir.',
      'Los días en {ciudad} suelen enseñar qué ritmo corporal vuelve cuando aflojas la prisa.',
      'En {ciudad}, anota un momento de calma real — no el que suena bien contarlo.',
      'Quedarte en {ciudad} afina la diferencia entre descanso y simple cambio de escena.',
      'Si repites la misma semana lenta en {ciudad}, verás si el alivio es profundo o cosmético.',
      'Lo cotidiano en {ciudad} devuelve al cuerpo lo que la cabeza había acelerado.',
      'Después de unas semanas en {ciudad}, la pregunta útil es: ¿dónde se queda la calma cuando vuelves a acelerar?'
    ]
  };

  var HUMAN_ATMO_OBSERVE_TAIL = [
    ' {ciudad} irá confirmando lo que ya llevabas encima — no como prueba, sino como contraste.',
    ' Los días en {ciudad} suelen afinar lo que intuías antes de nombrarlo.',
    ' {ciudad} devuelve en lo cotidiano lo que la cabeza aún debate.',
    ' Habitar {ciudad} es ver si la primera impresión aguanta cuando el cuerpo se queda.',
    ' Lo que {ciudad} abre hoy se lee distinto cuando dejas de tener prisa por decidir.',
    ' {ciudad} no responde de golpe: va matizando lo que sentías al llegar.',
    ' Con semanas de presencia, {ciudad} enseña matices que la primera lectura no alcanzaba.',
    ' Lo vivido en {ciudad} tenderá a confirmar o rebajar lo que ya traías — sin juicio.',
    ' Si te quedas un poco, {ciudad} dibuja contornos que la intuición apenas insinuaba.'
  ];

  var HUMAN_CLOSING_BY_GOAL = {
    amor: [
      'Si algo queda contigo de {ciudad}, que sea esto: atreverte a ser más verdadero antes que más visible.',
      'Llévate de {ciudad} una pregunta simple: ¿qué cambia cuando dejas de actuar el vínculo?',
      'Si {ciudad} te deja una huella, que no sea la escena perfecta — sino el momento en que te mostraste sin coreografías.',
      'Lo que importa no es lo que impresionó en {ciudad}, sino lo que sigue preguntándote cuando nadie mira.',
      'De {ciudad} quédate con una escena concreta: una conversación donde no tuviste que ganar nada.',
      'Si algo permanece, que sea la certeza de que el vínculo puede ser pequeño y aún así ser real.'
    ],
    trabajo: [
      'Quizá la clave no sea hacer más. Quizá sea dejar de perseguir todas las señales y escuchar cuál sigue viva cuando el ruido baja.',
      'De {ciudad} llévate esto: el sentido no tiene que demostrarse cada mañana.',
      'Si algo queda, que sea la diferencia entre hacer ruido y hacer obra.',
      'Una sola pregunta puede bastarte: ¿para quién trabajas cuando nadie te evalúa?',
      'No necesitas más señales — solo escuchar cuál sigue viva cuando el ruido baja.',
      'Si {ciudad} te enseña algo, que sea a medir el trabajo por lo que sostiene, no por lo que brilla.'
    ],
    descanso: [
      'Si algo queda contigo, que sea esto: permiso para bajar el ritmo sin sentir que desapareces.',
      'De {ciudad} quédate con el cuerpo que volvió a sentirse habitado.',
      'Llévate una escena lenta: un momento donde no tuviste que justificar la pausa.',
      'Si algo permanece, que sea la certeza de que descansar no te quita lugar — te lo devuelve.',
      'Una sola frase puede bastarte: aquí también puedo aflojar sin desaparecer.',
      'Lo que importa no es la productividad del descanso, sino la calma que se quedó contigo.'
    ]
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
        'Hay encuentros que se sostienen en gestos pequeños: un silencio cómodo, una esquina conocida.',
        'Puede costar menos performar y más mostrarse.',
        'A veces el amor aquí pide honestidad antes que espectáculo.'
      ],
      work: [
        'El trabajo puede mezclarse con la vida sin pedirte que desaparezcas en el rol.',
        'Hay espacio para lo artesanal, lo bien hecho, lo que toma tiempo.',
        'La visibilidad no siempre es el premio: a veces importa más la coherencia interna.',
        'Puede favorecer proyectos con alma más que carreras de vitrina.',
        'Oficios que importan por cómo se hacen, no por cuánto brillan afuera.'
      ],
      rest: [
        'Descansar puede ser dejar de justificar cada pausa.',
        'Hay permiso implícito para bajar el rendimiento sin desaparecer.',
        'El descanso se parece más a recuperar gusto que a apagar el motor.',
        'A veces la pausa llega en forma de conversación larga o de caminar sin destino.',
        'Permiso para caminar sin prisa y que eso cuente como descanso real.'
      ],
      success: [
        'El reconocimiento puede llegar por quien te conoce de verdad, no por escaparate.',
        'La influencia a veces es discreta: red pequeña, obra bien hecha, reputación lenta.',
        'Puede pesar más ser recordado por coherencia que por visibilidad momentánea.',
        'El éxito aquí a veces se mide en años, no en titulares.',
        'Proyectos con alma pueden sostenerse sin convertirte en personaje público.'
      ],
      images: [
        'Pendientes que te hacen llegar un poco más lento a cada encuentro.',
        'Luz oblicua que cambia el tono de la tarde sin avisar.',
        'Barrios donde lo antiguo y lo nuevo conviven sin pelear.',
        'Miradores desde los que la ciudad se lee en capas, no en postal.',
        'Silencios entre amigos que no se sienten incómodos.'
      ],
      metaphors: [
        'Como una conversación que empieza antes que la confianza.',
        'Como quitarte un disfraz que ya cansó.',
        'Como dejar de llamar puerta a cualquier espejo.',
        'Como recuperar aire en una habitación después de muchas visitas.',
        'Como un encuentro que no pide personaje.'
      ],
      zodiacSignature: [
        { sign: 'Pisces', weight: 0.4, reason: 'líquido, memoria, melancolía suave' },
        { sign: 'Taurus', weight: 0.35, reason: 'cuerpo, ritmo lento, arraigo sensorial' },
        { sign: 'Cancer', weight: 0.25, reason: 'cuidado, pertenencia, hogar emocional' }
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
        'Proceso creíble y ordenado que reduce ruido interno cuando la mente acelera.'
      ],
      rest: [
        'Descansar puede competir con la sensación de que siempre hay algo pendiente.',
        'Hay que negociar la pausa: no siempre llega sola.',
        'El descanso útil a veces pasa por movimiento físico — caminar fuerte, soltar tensión.',
        'A veces recuperar es ordenar lo heredado, lo pendiente, lo no dicho.',
        'El cuerpo pide descarga cuando la mente no para de calcular.'
      ],
      success: [
        'La trayectoria visible puede abrir puertas si es creíble y medible.',
        'Puede pesar «llegar» profesionalmente sin perder el hilo de quién eres.',
        'El mérito sostenido a veces vale más que el arranque ruidoso.',
        'El éxito puede sentirse como escenario que amplifica lo que ya llevas dentro.',
        'Definir qué quieres que se vea antes de exponerte puede ser parte del crecimiento.'
      ],
      images: [
        'Trayectos largos entre barrios que reorganizan el día en bloques.',
        'Inviernos que enseñan a guardar energía para cuando el calor vuelve.',
        'Barrios donde cada comunidad trae su propio ritmo al conjunto.',
        'Mañanas que empiezan con propósito antes que con contemplación.',
        'Tarde corta de sol que compensa meses de contención bajo cero.'
      ],
      metaphors: [
        'Como querer que el mundo vea algo que todavía estás terminando de entender por dentro.',
        'Como un escenario que amplifica lo que llevas.',
        'Como escribir en privado antes de volver a exponer la página.',
        'Como caminar con más filo cuando el frío aprieta.',
        'Como escuchar cuál señal sigue viva cuando el ruido baja.'
      ],
      zodiacSignature: [
        { sign: 'Capricorn', weight: 0.4, reason: 'mérito, trayectoria, deber cotidiano' },
        { sign: 'Virgo', weight: 0.35, reason: 'proceso, documentación, orden interno' },
        { sign: 'Aquarius', weight: 0.25, reason: 'diversidad urbana, redes, futuro práctico' }
      ],
      avoid: ['cn tower', 'hockey', 'sueño americano', 'oportunidad infinita', 'multicultural', 'postal', 'rascacielos']
    },
    ciudad_del_cabo: {
      rhythm: [
        'Aquí el ritmo puede ser doble: expansión afuera, recogimiento adentro.',
        'Hay sensación de borde costero — ciudad que mira al océano y vuelve adentro.',
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
        'La ciudad puede mezclar ambición local con necesidad de sentido personal.',
        'Puede activar ganas de hacer junto con necesidad de recuperar raíz.',
        'El sentido del trabajo a menudo pasa por coherencia personal, no solo por escaparate.'
      ],
      rest: [
        'La pausa puede empezar cuando el viento te obliga a cerrar un poco el paso.',
        'Hay permiso para bajar exigencia sin convertir la pausa en rendimiento.',
        'El descanso puede ser reentrenarse en recibir — sol, aire, silencio, agua.',
        'A veces recuperar es soltar la prisa interna sin huir del contraste.',
        'El cuerpo pide ritmo propio frente a impulso de seguir.'
      ],
      success: [
        'El impacto puede pesar más que la visibilidad vacía.',
        'Puede importar coherencia entre lo que valoras y lo que construyes.',
        'El éxito a veces se prueba en lo real, no en el escenario idealizado.',
        'Proyectos con sentido pueden sostenerse sin performar optimismo.',
        'La escala del lugar puede reordenar qué consideras «haber llegado».'
      ],
      images: [
        'Viento que te obliga a ajustar el paso en la acera.',
        'Luz que cambia el color de la tarde de forma casi física.',
        'Calles donde la pendiente cambia la velocidad del paso.',
        'Colinas que mezclan barrio, ciudad y cielo abierto en pocos minutos.',
        'Sensación de borde urbano donde el océano recuerda la escala.'
      ],
      metaphors: [
        'Como bajar el volumen de una música demasiado alta.',
        'Como guardar un refugio sin disculparte por entrar.',
        'Como soltar la prisa interna sin negar el contraste.',
        'Como caminar con el viento en lugar de contra él.',
        'Como dejar que la escala te devuelva proporción, no consuelo.'
      ],
      zodiacSignature: [
        { sign: 'Taurus', weight: 0.35, reason: 'cuerpo, tierra, ritmo pausado' },
        { sign: 'Scorpio', weight: 0.35, reason: 'contraste, intensidad, verdad incómoda' },
        { sign: 'Cancer', weight: 0.3, reason: 'refugio, pertenencia, cuidado del entorno' }
      ],
      avoid: ['table mountain', 'playa', 'paraíso', 'destino exótico', 'exótico', 'colonial', 'postal', 'turística']
    },
    barcelona: {
      rhythm: [
        'Aquí el ritmo puede ser de calle y estación: oleadas de estímulo y pausas en terraza.',
        'Hay sensación de densidad mediterránea — manzanas cortas, vida cerca.',
        'Las tardes pueden alargarse sin siesta cliché: conversación que gana terreno.',
        'No es solo velocidad: es alternancia entre exposición y recogimiento.',
        'Lo cotidiano a veces pasa por el paseo, no por la agenda.'
      ],
      emotional: [
        'Sensación de franqueza con calor — ironía que no siempre es distancia.',
        'Hay energía visible que no exige encogerse para encajar.',
        'La emoción puede ser directa, social, sin pedir demasiada explicación.',
        'A veces la intensidad aparece en lo pequeño, no en el gesto grande.',
        'Hay capas identitarias que piden sutileza, no discurso.'
      ],
      bond: [
        'El vínculo puede ser de amigos y proyecto compartido, no solo de pareja idealizada.',
        'Hay cercanía que a veces llega antes que la formalidad.',
        'Puede pedir presencia más que discurso elaborado.',
        'La química a veces aparece en lo cotidiano: barrio, terraza, camino compartido.',
        'A veces el amor se prueba en cómo sostienes tu verdad sin teatro.'
      ],
      work: [
        'El trabajo puede mezclar creatividad con presión por mostrarse.',
        'Hay red profesional densa: diseño, oficio, proyecto propio.',
        'Puede activar necesidad de coherencia entre imagen y obra.',
        'La visibilidad a veces pesa: define qué quieres que se vea de tu trabajo.',
        'Proyectos con alma pueden competir con carreras de vitrina rápida.'
      ],
      rest: [
        'Descansar puede ser bajar el volumen social sin culpa.',
        'Hay permiso para recuperar ritmo propio entre oleadas de estímulo.',
        'El descanso a veces pasa por brisa, piedra y sombra breve.',
        'Puede ser soltar la obligación de estar disponible todo el día.',
        'La pausa puede ser caminar sin destino en barrio conocido.'
      ],
      success: [
        'La obra puede reconocerse en red creativa más que en status vacío.',
        'Puede pesar el proyecto propio frente a la carrera de escaparate.',
        'El éxito a veces se mide en influencia por diseño, no por ruido.',
        'La coherencia entre lo que muestras y lo que haces puede ser el premio.',
        'Reputación que crece en comunidad, no solo en titular.'
      ],
      images: [
        'Manzanas donde la vida parece ocurrir a la altura del balcón.',
        'Brisa que entra sin pedir permiso entre bloques de piedra.',
        'Barrios donde el paseo es forma de pensar, no de turismo.',
        'Luces de tarde que cambian el tono de la calle sin espectáculo.',
        'Esquinas donde el encuentro empieza sin plan.'
      ],
      metaphors: [
        'Como un proyecto que respira en público y se afina en privado.',
        'Como alternar escena y refugio sin culpa.',
        'Como diseñar tu ritmo entre oleadas de estímulo.',
        'Como encontrar tu barrio antes que tu personaje.',
        'Como dejar que la calle te devuelva presencia, no performance.'
      ],
      zodiacSignature: [
        { sign: 'Aquarius', weight: 0.4, reason: 'innovación, cosmopolitismo, redes y futuro' },
        { sign: 'Gemini', weight: 0.35, reason: 'movilidad, comunicación, intercambio' },
        { sign: 'Libra', weight: 0.25, reason: 'arte, diseño, sociabilidad' }
      ],
      avoid: ['sagrada familia', 'gaudí', 'gaudi', 'paella', 'fiesta eterna', 'flamenco', 'playa', 'postal']
    },
    tokio: {
      rhythm: [
        'Aquí el ritmo puede ser de capas: puntualidad del trayecto, quietud del hogar.',
        'Hay sensación de megaciudad que respira en ciclos — estación, hora, barrio.',
        'El día puede moverse como secuencia de tramos, no como flujo continuo.',
        'No es solo velocidad: es precisión en cada tramo del recorrido.',
        'Lo pequeño puede ordenar lo grande: ritual breve, paso medido.'
      ],
      emotional: [
        'Sensación de reserva cortés con profundidad bajo la forma.',
        'Hay estímulo sensorial contenido — mucho alrededor, poco ruido innecesario.',
        'La emoción puede ir por dentro mientras afuera todo sigue funcionando.',
        'A veces la soledad aparece en densidad: mucha gente, poco contacto.',
        'Hay honestidad práctica más que dramatismo expresivo.'
      ],
      bond: [
        'El vínculo puede construirse con respeto, tiempo y gestos sostenidos.',
        'Hay cercanía que a veces no se verbaliza: cuidado en lo repetido.',
        'Puede pedir paciencia antes que declaración rápida.',
        'La confianza a menudo se gana en lo cotidiano, no en el gesto teatral.',
        'A veces el amor se nota en lo cuidado, no en lo ruidoso.'
      ],
      work: [
        'El trabajo puede pedir precisión, constancia y sentido del deber sin espectáculo.',
        'Hay oficio invisible que sostiene lo visible: servicio, detalle, fiabilidad.',
        'Puede activar horas largas con sentido de mejora continua.',
        'La visibilidad a veces pesa menos que la excelencia silenciosa.',
        'Proyectos que exigen constancia antes que aplauso inmediato.'
      ],
      rest: [
        'Descansar puede ser ordenar el interior antes que exhibir pausa.',
        'Hay permiso para silencio que no se siente vacío.',
        'El descanso a veces pasa por ritual breve: transición, no escape.',
        'Puede ser soltar la urgencia sin abandonar la forma.',
        'La pausa puede ser hogar quieto después del tramo público.'
      ],
      success: [
        'La maestría y la fiabilidad pueden abrir puertas en sistema grande.',
        'Puede pesar ser reconocido por constancia, no por espectáculo.',
        'El éxito a veces se mide en excelencia silenciosa, no en titular.',
        'Mejora continua puede ser forma de sentido, no solo exigencia.',
        'Reputación que crece en oficio, no solo en exposición.'
      ],
      images: [
        'Estaciones donde el flujo humano tiene reglas no escritas.',
        'Barrios residenciales quietos a pocos minutos de cruces densos.',
        'Pasillos estrechos que enseñan a medir el paso y el gesto.',
        'Luz de tarde sobre asfalto húmedo que cambia el tono del día.',
        'Hogar pequeño que ordena el exceso de la calle.'
      ],
      metaphors: [
        'Como moverte en tramos precisos y soltar en casa.',
        'Como afilar el detalle antes que buscar aplauso.',
        'Como encontrar quietud dentro de la densidad.',
        'Como repetir un gesto hasta que se vuelve refugio.',
        'Como dejar que la forma sostenga lo que la prisa quiere romper.'
      ],
      zodiacSignature: [
        { sign: 'Capricorn', weight: 0.4, reason: 'estructura, exigencia, forma' },
        { sign: 'Virgo', weight: 0.35, reason: 'precisión, detalle, oficio' },
        { sign: 'Aquarius', weight: 0.25, reason: 'tecnología, densidad, futuro urbano' }
      ],
      avoid: ['sushi', 'samurái', 'samurai', 'anime', 'cerezo', 'neón postal', 'postal']
    }
  };

  var GLOBAL_TOURISM_TOKENS = [
    'tranvía', 'tranvia', 'fado', 'azulejo', 'cn tower', 'hockey', 'table mountain',
    'rascacielos', 'playa', 'postal turística', 'guía de viaje', 'destino exótico',
    'sagrada familia', 'gaudí', 'gaudi', 'sushi', 'samurái', 'samurai', 'anime'
  ];

  var CITY_COUNTRY_OVERLAP_FRAGMENTS = [
    'mesa que se alarga',
    'mesas que se alargan',
    'planificar el día como pequeña expedición',
    'luchar contra el reloj',
    'volver al cuerpo después de mucho ruido',
    'habitación que se ordena',
    'esfuerzo sostenido valga más que el arranque',
    'horizonte abierto que pone tu historia',
    'horizontes amplios que ponen tu historia',
    'silencios que pesan distinto según el barrio'
  ];

  var ZODIAC_DOGMA_PATTERNS = [
    /\bes acuario\b/i,
    /\bes capricornio\b/i,
    /\bes géminis\b/i,
    /\bes geminis\b/i,
    /\bes libra\b/i,
    /\bes virgo\b/i,
    /\bes tauro\b/i,
    /\bes cáncer\b/i,
    /\bes cancer\b/i,
    /\bes escorpio\b/i,
    /\bes piscis\b/i
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
    if (n === 'barcelona') return 'barcelona';
    if (n === 'tokio' || n === 'tokyo') return 'tokio';
    return null;
  }

  function normalizeOverlapText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/^en [^,]+,\s*/, '')
      .replace(/^(quizá|puede que|tal vez)\s+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function linesOverlapCityCountry(cityLine, countryLine) {
    var a = normalizeOverlapText(cityLine);
    var b = normalizeOverlapText(countryLine);
    if (!a || !b) return false;
    if (a.length >= 20 && b.indexOf(a.slice(0, 24)) !== -1) return true;
    if (b.length >= 20 && a.indexOf(b.slice(0, 24)) !== -1) return true;
    for (var i = 0; i < CITY_COUNTRY_OVERLAP_FRAGMENTS.length; i++) {
      var frag = CITY_COUNTRY_OVERLAP_FRAGMENTS[i];
      if (a.indexOf(frag) !== -1 && b.indexOf(frag) !== -1) return true;
    }
    return false;
  }

  function collectCityAtmosphereBundle(cityAtm) {
    if (!cityAtm) return [];
    return (cityAtm.selectedLines || []).concat([
      cityAtm.rhythm,
      cityAtm.emotionalTexture,
      cityAtm.goalTone,
      cityAtm.images,
      cityAtm.successTone
    ]).filter(Boolean);
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
    var successTone = pickAtmosphere({
      citySlug: slug, goal: goalId, slot: 'success', seed: seed + 4, cityName: cityName
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
      successTone: successTone,
      zodiacSignature: index.zodiacSignature ? index.zodiacSignature.slice() : [],
      warnings: index.avoid.slice(),
      selectedLines: selectedLines
    };
  }

  function pickHumanVariant(pool, seed, slot) {
    if (!pool) return '';
    if (typeof pool === 'string') return pool;
    if (!pool.length) return '';
    return pool[hash32(String(seed) + ':' + slot) % pool.length];
  }

  function weaveAtmosphereObserve(humanObserve, cityAtm, goalId, cityName, seed) {
    if (!cityAtm) return humanObserve;
    if (cityAtm.images) {
      var img = cityAtm.images;
      var imgFp = img.toLowerCase().replace(/^en [^,]+,\s*/, '').slice(0, 24);
      if (humanObserve && imgFp.length >= 12 &&
          humanObserve.toLowerCase().indexOf(imgFp) !== -1) {
        return humanObserve;
      }
      var tail = withCity(
        pickHumanVariant(HUMAN_ATMO_OBSERVE_TAIL, seed, 'atmo-observe-tail'),
        cityName
      );
      return img.charAt(0).toUpperCase() + img.slice(1) + tail;
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
    amor: [
      'esta semana, elige una conversación donde puedas hablar despacio, sin necesidad de brillar.',
      'esta semana, queda con alguien en un sitio sencillo — sin escena, solo presencia.',
      'esta semana, di una verdad pequeña antes de intentar ser interesante.',
      'esta semana, prueba a escuchar más de lo que expones.',
      'esta semana, escribe un mensaje honesto antes de enviar el que suena impecable.',
      'esta semana, guarda un rato para el vínculo sin teléfono ni narrativa perfecta.',
      'esta semana, nota si te relajas cuando no tienes que ganar la atención del otro.',
      'esta semana, invita a alguien a caminar sin agenda — solo compañía.',
      'esta semana, elige un encuentro corto donde importe más la escucha que la respuesta brillante.'
    ],
    trabajo: [
      'esta semana, escribe en privado qué sentido tiene tu trabajo antes de volver a exponerlo al mundo.',
      'esta semana, guarda una hora sin pantallas para pensar el propósito — no la vitrina.',
      'esta semana, elige una tarea pequeña que sostenga sentido aunque nadie la vea.',
      'esta semana, anota qué parte de tu trabajo sigue viva cuando nadie te evalúa.',
      'esta semana, di no a una exposición innecesaria y sí a una obra de fondo.',
      'esta semana, contrasta impulso y propósito antes de decir que sí a lo urgente.'
    ],
    descanso: [
      'esta semana, guarda un bloque de descanso como quien guarda un refugio — sin disculparte por entrar.',
      'esta semana, elige una pausa breve y real — no la que suena bien contarla.',
      'esta semana, camina despacio un tramo sin objetivo — solo cuerpo presente.',
      'esta semana, apaga una hora de ruido y mira qué ritmo pide el cuerpo.',
      'esta semana, duerme una noche sin convertir el descanso en tarea cumplida.',
      'esta semana, deja una tarde sin rendir — solo habitar el lugar con calma.'
    ]
  };

  function humanizeOpportunityAction(mainOpportunity, goalId, seed) {
    return pickHumanVariant(
      HUMAN_ACTION_BY_GOAL[goalId] || HUMAN_ACTION_BY_GOAL.amor,
      seed,
      'human-action:' + goalId
    );
  }

  function humanizeObserve(goalId, cityName, seed) {
    return withCity(
      pickHumanVariant(HUMAN_OBSERVE_BY_GOAL[goalId] || HUMAN_OBSERVE_BY_GOAL.amor, seed, 'human-observe:' + goalId),
      cityName
    );
  }

  function humanizeClosing(goalId, cityName, seed) {
    return withCity(
      pickHumanVariant(HUMAN_CLOSING_BY_GOAL[goalId] || HUMAN_CLOSING_BY_GOAL.amor, seed, 'human-closing:' + goalId),
      cityName
    );
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

  function mapLinePlanetToCountryKey(planet) {
    var p = String(planet || '').toLowerCase();
    if (p === 'luna' || p === 'moon') return 'moon';
    if (p === 'venus') return 'venus';
    if (p === 'saturno' || p === 'saturn') return 'saturn';
    return null;
  }

  function resolveCountryIdFromCity(city) {
    if (!city) return null;
    if (city.countryId) return String(city.countryId).trim() || null;
    var Catalog = window.KairosCitiesCatalog;
    if (city.country && Catalog && Catalog.resolveCountryId) {
      return Catalog.resolveCountryId(city.country);
    }
    if (city.name && Catalog && Catalog.findCityByName) {
      var found = Catalog.findCityByName(city.name);
      if (found && found.country && Catalog.resolveCountryId) {
        return Catalog.resolveCountryId(found.country);
      }
    }
    return null;
  }

  function planetEs(linePlanet) {
    if (linePlanet === 'moon') return 'la Luna';
    if (linePlanet === 'venus') return 'Venus';
    if (linePlanet === 'saturn') return 'Saturno';
    return '';
  }

  function isLineModifierRaw(raw) {
    return /\b(La Luna|Tu Luna|Venus|Saturno)\b/i.test(String(raw || ''));
  }

  function extractCountryModal(raw) {
    var source = String(raw || '').trim();
    var match = source.match(/^(Quizá|Puede que|Tal vez)\s+/i);
    if (!match) return { modal: '', body: source };
    return { modal: match[1].toLowerCase(), body: source.slice(match[0].length).trim() };
  }

  function buildCountryEditorialLine(raw, countryName, linePlanet, section) {
    var parsed = extractCountryModal(raw);
    var text = parsed.body;
    if (!text || !countryName) return '';

    text = text.replace(/aquí/gi, '').replace(/\s{2,}/g, ' ').trim();
    text = text.replace(/\bTu Luna\b/g, 'La Luna');

    var semi = text.indexOf(';');
    if (semi !== -1) {
      text = text.slice(semi + 1).trim();
    }

    var pEs = planetEs(linePlanet);
    if (pEs && isLineModifierRaw(raw)) {
      if (/^(La Luna|Venus|Saturno)\s+puede/i.test(text)) {
        return 'En ' + countryName + ', ' + lcfirst(text);
      }
      return 'En ' + countryName + ', ' + pEs + ' puede ' + lcfirst(text);
    }

    if (section === 'sintesis') {
      return 'Quizá en ' + countryName + ', ' + lcfirst(text);
    }

    var modal = parsed.modal || 'quizá';
    return 'En ' + countryName + ', ' + modal + ' ' + lcfirst(text);
  }

  function pickCountryEditorialLines(resolved, countryName, linePlanet, goalId, seed, cityAtm) {
    var mod = resolved.selectedModifiers || {};
    var pool = [];
    var cityBundle = collectCityAtmosphereBundle(cityAtm);

    if (mod.lineLines && mod.lineLines.length) {
      mod.lineLines.forEach(function (line) {
        pool.push(line);
      });
    }
    if (mod.goalLines && mod.goalLines.length) {
      mod.goalLines.forEach(function (line) {
        pool.push(line);
      });
    }
    if (!pool.length && mod.goalTone) {
      pool.push(mod.goalTone);
    }
    if (!pool.length) return [];

    var count = Math.min(MAX_COUNTRY_LINES, pool.length);
    var sectionStart = hash32(String(seed) + ':country:sections') % COUNTRY_SECTIONS.length;
    var out = [];
    var usedSections = {};

    for (var attempt = 0; attempt < pool.length * 3 && out.length < count; attempt += 1) {
      var sectionIdx = (sectionStart + out.length + attempt) % COUNTRY_SECTIONS.length;
      var section = COUNTRY_SECTIONS[sectionIdx];
      if (usedSections[section]) continue;

      var lineIdx = hash32(String(seed) + ':country:line:' + attempt) % pool.length;
      var candidate = buildCountryEditorialLine(pool[lineIdx], countryName, linePlanet, section);
      if (!candidate) continue;

      var overlaps = false;
      for (var ci = 0; ci < cityBundle.length; ci++) {
        if (linesOverlapCityCountry(cityBundle[ci], candidate)) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      out.push({ section: section, text: candidate });
      usedSections[section] = true;
    }

    return out.slice(0, MAX_COUNTRY_LINES);
  }

  function buildCountryContext(input, goalId, primary, seed, cityAtm) {
    var baseMeta = { weightHint: 'country:15%' };
    var Svc = window.KairosCountryArchetype;

    if (!Svc || !Svc.resolveCountryArchetype) {
      return {
        ok: false,
        countryId: null,
        countryName: null,
        selectedModifiers: null,
        warnings: ['missing_country_service'],
        lines: [],
        meta: baseMeta
      };
    }

    var linePlanet = primary ? mapLinePlanetToCountryKey(primary.planet) : null;
    var resolved = Svc.resolveCountryArchetype({
      countryId: resolveCountryIdFromCity(input.city),
      city: input.city,
      goal: goalId,
      linePlanet: linePlanet
    });

    if (!resolved.ok) {
      return {
        ok: false,
        countryId: resolved.countryId,
        countryName: resolved.archetype && resolved.archetype.name ? resolved.archetype.name : null,
        selectedModifiers: null,
        warnings: resolved.warnings || [],
        lines: [],
        meta: Object.assign({}, baseMeta, resolved.meta || {}, { reason: resolved.reason })
      };
    }

    var countryName = resolved.archetype.name;
    var lines = pickCountryEditorialLines(resolved, countryName, linePlanet, goalId, seed, cityAtm);
    var dedupWarnings = [];
    if (resolved.selectedModifiers && lines.length < MAX_COUNTRY_LINES) {
      dedupWarnings.push('country_lines_deduped_against_city');
    }

    return {
      ok: true,
      countryId: resolved.countryId,
      countryName: countryName,
      selectedModifiers: resolved.selectedModifiers,
      warnings: (resolved.warnings || []).concat(dedupWarnings),
      lines: lines,
      meta: Object.assign({}, baseMeta, resolved.meta || {}, {
        linePlanet: linePlanet,
        sectionsUsed: lines.map(function (item) { return item.section; })
      })
    };
  }

  function weaveCountryIntoSpine(narrativeContext, countryContext) {
    if (!countryContext || !countryContext.ok || !countryContext.lines || !countryContext.lines.length) {
      return;
    }

    countryContext.lines.forEach(function (item) {
      var line = humanizePresenceSpine(item.text);
      if (item.section === 'sintesis' && narrativeContext.narrativeSummary) {
        narrativeContext.narrativeSummary = narrativeContext.narrativeSummary + '\n\n' + line;
      } else if (item.section === 'observar' && narrativeContext.humanObserve) {
        narrativeContext.humanObserve = narrativeContext.humanObserve + '\n\n' + line;
      } else if (item.section === 'integracion' && narrativeContext.humanClosing) {
        narrativeContext.humanClosing = narrativeContext.humanClosing + '\n\n' + line;
      }
    });
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
    var humanOpportunityAction = humanizeOpportunityAction(mainOpportunity, goalId, seed);
    var humanObserve = weaveAtmosphereObserve(
      humanizeObserve(goalId, cityName, seed), cityAtm, goalId, cityName, seed
    );
    var humanClosing = humanizeClosing(goalId, cityName, seed);
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
      narrativeContext.citySuccessTone = cityAtm.successTone;
      narrativeContext.atmosphereWarnings = cityAtm.warnings;
    }

    var countryContext = buildCountryContext(input, goalId, primary, seed, cityAtm);
    weaveCountryIntoSpine(narrativeContext, countryContext);
    narrativeContext.countryContext = countryContext;

    var rulesFired = [
      'deep_influences_' + deepKeys.length,
      'editorial_humanization',
      'voice_beauty_polish',
      'human_presence_spine'
    ];
    if (cityAtm) rulesFired.push('city_atmosphere_' + cityAtm.citySlug);
    if (cityAtm && cityAtm.zodiacSignature && cityAtm.zodiacSignature.length) {
      rulesFired.push('zodiac_signature_metadata');
    }
    if (countryContext.ok) {
      rulesFired.push('country_archetype_' + countryContext.countryId);
      if (countryContext.lines.length) rulesFired.push('country_lines_' + countryContext.lines.length);
    } else if (countryContext.meta && countryContext.meta.reason) {
      rulesFired.push('country_fail_' + countryContext.meta.reason);
    }
    rulesFired.push(dominantTheme.sourceDoc, centralTension.sourceDoc, mainOpportunity.sourceDoc);

    return {
      ok: true,
      narrativeContext: narrativeContext,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        goalId: goalId,
        cityName: cityName,
        citySlug: cityAtm ? cityAtm.citySlug : null,
        countryId: countryContext.countryId,
        countryLinesUsed: countryContext.lines ? countryContext.lines.length : 0,
        deterministicSeed: seed,
        primaryInfluenceKey: primaryKey,
        rulesFired: rulesFired
      }
    };
  }

  window.KairosNarrativeIntelligence = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MAX_DEEP: MAX_DEEP,
    MAX_COUNTRY_LINES: MAX_COUNTRY_LINES,
    THEME_ES: THEME_ES,
    deriveNarrativeContext: deriveNarrativeContext,
    GLOBAL_TOURISM_TOKENS: GLOBAL_TOURISM_TOKENS,
    CITY_COUNTRY_OVERLAP_FRAGMENTS: CITY_COUNTRY_OVERLAP_FRAGMENTS,
    ZODIAC_DOGMA_PATTERNS: ZODIAC_DOGMA_PATTERNS,
    _dev: {
      GOAL_OBJECTIVE_IDS: GOAL_OBJECTIVE_IDS,
      GUIDING_QUESTIONS: GUIDING_QUESTIONS,
      CITY_ATMOSPHERE_INDEX: CITY_ATMOSPHERE_INDEX,
      COUNTRY_SECTIONS: COUNTRY_SECTIONS,
      resolveCitySlug: resolveCitySlug,
      pickAtmosphere: pickAtmosphere,
      buildCityAtmosphere: buildCityAtmosphere,
      buildCountryContext: buildCountryContext,
      weaveCountryIntoSpine: weaveCountryIntoSpine,
      linesOverlapCityCountry: linesOverlapCityCountry,
      collectCityAtmosphereBundle: collectCityAtmosphereBundle
    }
  };
})();
