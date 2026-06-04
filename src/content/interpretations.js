/* ============================================================
   KAIROS MAPS — Plantillas de interpretación
   10 planetas × 4 ángulos = 40 combinaciones
   Tono: evocador, breve, directo. Sin jerga astrológica.
   Marcador {ciudad} se sustituye al renderizar.
   ============================================================ */

window.INTERPRETATIONS = {

  /* ─────────────── SOL ─────────────── */
  SOL_AC: {
    planeta: 'Sol', angulo: 'AC', color: '#B45309',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'En {ciudad} puede notarse que tu presencia pesa un poco más: te ven antes de explicarte, y eso abre vínculos donde la autenticidad cuenta. Si buscas amor, el lugar favorece encuentros en los que no necesitas performar — conversación directa, química tranquila, gente que responde a quien eres cuando no te encoges.' },
        { title: 'Qué puede desafiar', body: 'También puede activar incomodidad con la visibilidad: ganas de pasar desapercibido, compararte, o exponerte antes de sentirte listo. Si sueles esconderte para protegerte, {ciudad} puede sentirse como demasiada luz. No es rechazo del lugar; es tu relación con ocupar espacio.' },
        { title: 'Cómo aprovecharlo', body: 'Haz una cosa al día que normalmente pospondrías por miedo al juicio: presentarte, invitar, decir qué quieres. En amor, prioriza coherencia sobre impacto — mejor un gesto honesto que un gran gesto vacío. Deja que el otro te conozca por capas.' },
        { title: null, body: 'El amor en {ciudad} no te pide brillo constante. Pide presencia suficiente para que alguien pueda encontrarte donde ya estabas.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu trabajo puede ganar visibilidad natural: lo que haces llega a quien lo necesita ver, sin tener que gritar. {ciudad} favorece proyectos donde importa tu criterio, tu voz, tu liderazgo silencioso — enseñar, crear, dirigir, emprender con nombre propio.' },
        { title: 'Qué puede desafiar', body: 'La misma exposición puede activar presión por destacar o parálisis ante el reconocimiento. Si crees que no mereces ser visto, el lugar lo pondrá encima de la mesa antes de abrir puertas. También puede tentarte la imagen sin sustancia.' },
        { title: 'Cómo aprovecharlo', body: 'Define un objetivo concreto para tu estancia: un entregable, una charla, un acuerdo. Trabaja en público con moderación — muestra proceso, no solo pose. El reconocimiento aquí responde mejor a la intención clara que al ruido.' },
        { title: null, body: 'En {ciudad} el trabajo puede amplificarse si ya traes algo real. No inventa talento; da escenario para que lo que haces deje de ser secreto.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Este lugar puede permitirte descansar ocupando espacio sin disculparte: caminar erguido, comer sin prisa, dormir con menos vigilancia interna. {ciudad} a veces se siente como permiso para no encogerte — útil si tu cansancio viene de esconderte demasiado.' },
        { title: 'Qué puede desafiar', body: 'También puede costar no hacer nada si tu descanso depende de pasar invisible. Puede aparecer culpa por no producir, o sensación de estar en escena incluso en vacaciones. El descanso no siempre es suave al principio.' },
        { title: 'Cómo aprovecharlo', body: 'Programa pausas sin rendimiento: paseo largo, siesta, cuerpo al sol o al frío según toque. Un límite diario de pantalla. Practica estar en un café sin justificar tu existencia. El descanso solar es presencia, no espectáculo.' },
        { title: null, body: 'Descansar en {ciudad} puede ser recuperar permiso para existir sin pedir disculpas. Cuando lo practicas, el cuerpo suele responder antes que la cabeza.' }
      ]
    }
  },
  SOL_MC: {
    planeta: 'Sol', angulo: 'MC', color: '#B45309',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu vida pública puede volverse más visible y eso atrae vínculos que respetan tu trayectoria. En {ciudad} puede aparecer amor ligado a proyectos, eventos, círculos donde tu trabajo cuenta — personas que admiran tu criterio, no solo tu disponibilidad.' },
        { title: 'Qué puede desafiar', body: 'La carrera puede eclipsar lo íntimo: agendas llenas, conversaciones que derivan en trabajo, confundir admiración con cariño. También puede activar miedo a mostrarte vulnerable si tu imagen es fuerte.' },
        { title: 'Cómo aprovecharlo', body: 'Separa bloques sin agenda profesional. Di qué buscas en pareja con la misma claridad que en un proyecto. Si hay interés, construye tiempo privado desde el inicio — no lo dejes para cuando termine la temporada.' },
        { title: null, body: 'El amor en {ciudad} puede convivir con la ambición si no le pides que compita con tu calendario. La intimidad también es una forma de éxito.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu trabajo se ve con claridad: reputación, invitaciones, posibilidad de legado. {ciudad} favorece roles visibles — dirección, creación pública, docencia, emprendimiento con nombre. Las oportunidades suelen ser reales si llegas con oferta concreta.' },
        { title: 'Qué puede desafiar', body: 'Presión por destacar, comparación con figuras grandes, o parálisis si temes no estar a la altura. También puede tentarte la imagen sin entregables. El lugar amplifica lo que traes, no inventa competencia.' },
        { title: 'Cómo aprovecharlo', body: 'Define qué quieres lograr aquí en una frase medible. Prioriza un proyecto terminado sobre tres anunciados. Pide feedback de alguien que no te halague. La visibilidad sostiene cuando hay sustancia detrás.' },
        { title: null, body: 'En {ciudad} el trabajo puede pesar más en tu historia si actúas con intención. La fama ligera pasa; la obra hecha permanece en tu narrativa.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El descanso puede venir cuando sueltas la necesidad de demostrar: un día sin agenda pública, sensación de haber hecho suficiente. {ciudad} a veces permite pausa después de un hito — celebrar sin convertir todo en contenido.' },
        { title: 'Qué puede desafiar', body: 'Cuesta no hacer: el lugar empuja a producir algo que importe. Puede aparecer culpa si no avanzas, o sueño corto por mente en modo logro. No es el escenario más fácil para vacío total.' },
        { title: 'Cómo aprovecharlo', body: 'Reserva descanso como cita: sin reuniones, sin publicar. Camina sin objetivo profesional. Si descansas mejor tras entregar, planifica un cierre pequeño antes de parar. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser aprender que tu valor no desaparece cuando no estás en escena. Eso, para muchos, es el verdadero descanso.' }
      ]
    }
  },
  SOL_IC: {
    planeta: 'Sol', angulo: 'IC', color: '#B45309',
    amor:     "El amor aquí es privado, profundo, lejos del escaparate. Conexiones que se construyen en lo íntimo.",
    trabajo:  "No es el mejor lugar para lograr grandes cosas visibles, pero sí para saber por qué quieres lograrlas.",
    descanso: "{ciudad} da permiso de no hacer nada y que eso esté completamente bien. Tu sistema nervioso lo siente de inmediato."
  },
  SOL_DC: {
    planeta: 'Sol', angulo: 'DC', color: '#B45309',
    amor:     "El otro te ve de verdad. Hay algo en el entorno que hace que tus vínculos tengan más definición, más presencia mutua.",
    trabajo:  "Las colaboraciones aquí son potentes. El trabajo en equipo florece más que el individual.",
    descanso: "Descansas mejor acompañado que solo en {ciudad}."
  },

  /* ─────────────── LUNA ─────────────── */
  LUNA_AC: {
    planeta: 'Luna', angulo: 'AC', color: '#7C3AED',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'En {ciudad} puede abrirse una sensibilidad que en otros lugares mantienes más contenida. El vínculo tiende a construirse por cercanía real: gestos pequeños, presencia, escucha. Si buscas amor, aquí es más fácil sentir que importas sin tener que demostrarlo todo de golpe — la intimidad llega por capas, no por escenario.' },
        { title: 'Qué puede desafiar', body: 'Esa permeabilidad también puede dejarte más expuesto: reaccionar antes de pensar, confundir cariño con urgencia, o herirte con detalles que antes pasaban desapercibidos. Puede costarte poner límites si temes perder la conexión. No es debilidad; es señal de que algo emocional pide atención.' },
        { title: 'Cómo aprovecharlo', body: 'Elige calidad sobre intensidad: conversaciones largas, silencios compartidos, decir con calma lo que necesitas. Si hay interés mutuo, deja que la confianza crezca sin forzar definiciones inmediatas. Un cuaderno breve por las noches ayuda a ordenar lo que sientes sin apagarlo.' },
        { title: null, body: 'El amor en {ciudad}, si aparece, suele sentirse menos performativo y más habitacional. No promete cuentos de hadas; ofrece espacio para ser visto con más honestidad emocional.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu trabajo en {ciudad} puede ganar dimensión humana: la gente recuerda cómo les hiciste sentir, no solo el entregable. Conectas en reuniones, equipos y clientes con empatía práctica — útil si tu oficio depende de confianza, cuidado o lectura fina del contexto.' },
        { title: 'Qué puede desafiar', body: 'La línea entre profesional y personal se afloja: puedes absorber tensiones ajenas, tomarte críticas muy a pecho o postergar decisiones por no querer incomodar. Si necesitas distancia fría para decidir, tendrás que construirla a propósito.' },
        { title: 'Cómo aprovecharlo', body: 'Usa la sensibilidad como dato, no como veredicto: nombra lo que observas, pide claridad por escrito cuando haga falta, protege bloques sin reuniones. Los proyectos que cuidan personas — equipos, usuarios, pacientes — suelen rendir mejor aquí.' },
        { title: null, body: '{ciudad} no te vuelve más blando en lo laboral; te vuelve más legible. Si alineas tarea y cuidado, tu reputación puede crecer por fiabilidad emocional, no solo por velocidad.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Este lugar puede permitirte bajar el ritmo interior: dormir mejor, comer con más presencia, dejarte llevar por rutinas sencillas que restauran. {ciudad} a veces se siente como un entorno que te acoge sin exigirte explicación constante — útil si llegas cansado de sostenerlo todo.' },
        { title: 'Qué puede desafiar', body: 'También puede remecer lo no digerido: nostalgia, llanto fácil, cambios de humor según el barrio o la hora. Si sueles controlar lo que sientes, el descanso aquí no siempre es sueño profundo al primer día; puede ser proceso.' },
        { title: 'Cómo aprovecharlo', body: 'Planifica poco y siente mucho: paseos lentos, agua, comida reconfortante sin culpa, siesta corta sin teléfono. Escribe tres líneas al atardecer. Si algo duele, no lo conviertas en tarea; dale un nombre y un límite de tiempo.' },
        { title: null, body: 'Descansar en {ciudad} no es desconectar del todo — es permitir que el cuerpo y el ánimo se reencuentren. A veces eso es la forma más honesta de recuperarte.' }
      ]
    }
  },
  LUNA_MC: {
    planeta: 'Luna', angulo: 'MC', color: '#7C3AED',
    amor:     "Tu sensibilidad emocional es visible profesionalmente. Puede sentirse expuesto o poderoso, según tu integración.",
    trabajo:  "Profesiones de cuidado, educación, psicología — todas florecen aquí. El trabajo viene desde un lugar genuino.",
    descanso: "El trabajo aquí nutre en lugar de agotar, si lo eliges bien."
  },
  LUNA_IC: {
    planeta: 'Luna', angulo: 'IC', color: '#7C3AED',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El amor puede tender a raíces: vínculos que se construyen lento, con costumbres compartidas, sensación de hogar emocional. En {ciudad} puede aparecer intimidad que no necesita escenario — cuidado cotidiano, presencia, pertenencia.' },
        { title: 'Qué puede desafiar', body: 'También puede activar dependencia, nostalgia o mezclar familia de origen con pareja. Puede costar salir de la burbuja doméstica. Si evitas la vulnerabilidad, el lugar la saca por otros medios.' },
        { title: 'Cómo aprovecharlo', body: 'Cocina junto, comparte ritual simple, habla de lo doméstico con honestidad. Si hay interés, construye acuerdos sobre tiempo en casa y tiempo fuera. La profundidad lunar pide ritmo, no prisa. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede sentirse habitacional. No siempre es espectacular; a veces es la forma más honesta de quedarse.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Trabajar desde casa o en entornos íntimos puede fluir: terapia, cuidado, educación en pequeño, oficios desde el hogar. {ciudad} favorece lo que se hace con puerta cerrada y atención sostenida — menos exposición, más sustancia privada.' },
        { title: 'Qué puede desafiar', body: 'Puede costar separar vida laboral y personal si todo ocurre en el mismo espacio. También aparece procrastinación emocional o reuniones que se sienten invasivas. La productividad pública puede resentirse.' },
        { title: 'Cómo aprovecharlo', body: 'Define horario y lugar de trabajo aunque sea pequeño. Sal a caminar entre bloques. Si tu oficio es cuidado, protege tu propio descanso con la misma diligencia que das a otros. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo puede nutrirse en privado si respetas límites. La intimidad es recurso, no excusa para mezclarlo todo.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'De muchos lugares, {ciudad} puede sentirse como hogar sin serlo: calidez, comida local, sueño más profundo, sensación de ser cuidado por el entorno. Ideal para reponer energía y recordar quién eres debajo del rendimiento.' },
        { title: 'Qué puede desafiar', body: 'Puede remecer memoria familiar o soledad que no esperabas. También aparece quedarte demasiado dentro si evitas el mundo. El descanso lunar a veces trae lágrimas antes que alivio.' },
        { title: 'Cómo aprovecharlo', body: 'Come local, duerme sin despertador un día, camina sin destino. Escribe tres líneas nocturnas. Si algo duele, nómbralo con suavidad — no lo conviertas en tarea infinita. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser dejarte cuidar un tiempo. Cuando el cuerpo baja la guardia, lo demás se ordena mejor.' }
      ]
    }
  },
  LUNA_DC: {
    planeta: 'Luna', angulo: 'DC', color: '#7C3AED',
    amor:     "Atraes a personas que necesitan ser cuidadas — o que pueden cuidarte. La dinámica emocional aquí es profunda.",
    trabajo:  "Las relaciones profesionales son más emocionales que estratégicas en {ciudad}.",
    descanso: "Come comida local, duerme bien, camina sin destino. Deja que la ciudad te cuide."
  },

  /* ─────────────── MERCURIO ─────────────── */
  MERCURIO_AC: {
    planeta: 'Mercurio', angulo: 'AC', color: '#0369A1',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Este lugar favorece el intercambio, la conversación y la curiosidad. Puede resultarte más fácil conocer personas, abrir conversaciones o sentir que tu mente se activa cuando algo te interesa de verdad. En vínculo, {ciudad} suele poner el diálogo antes que el drama: te atraen quienes piensan, preguntan y escuchan.' },
        { title: 'Qué puede desafiar', body: 'No todo será liviano. La misma agilidad puede volverse dispersión si buscas certezas demasiado rápido. También puede aparecer mucha charla y poca profundidad, o nerviosismo social si esperas que una sola conversación lo resuelva todo. La mente acelerada no siempre descansa en el otro.' },
        { title: 'Cómo aprovecharlo', body: 'Practica presencia sin agenda: una charla al día sin objetivo oculto, un mensaje honesto, escribir lo que piensas aunque no lo publiques. Si hay interés mutuo, deja que la conexión crezca por capas. Pregunta más de lo que declaras; escucha antes de concluir.' },
        { title: null, body: 'No significa que todo vaya a ser fácil. Pero sí que ciertas capacidades tuyas — curiosidad, humor, claridad — encuentran en {ciudad} más espacio para expresarse. Ahí el amor, si llega, suele empezar hablando.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'En {ciudad} tu mente puede funcionar con más velocidad y conexión: saltar entre ideas sin perder el hilo, explicar con claridad, vender un concepto, enseñar, escribir, aprender un idioma. La palabra circula; las reuniones avanzan si traes estructura ligera.' },
        { title: 'Qué puede desafiar', body: 'El exceso de estímulo puede fragmentarte: demasiados hilos abiertos, correos que nunca cierran, prometer más de lo que entregas. También puede aparecer la sensación de tener que demostrar inteligencia todo el tiempo. Si no canalizas la energía mental, se parece a ansiedad de fondo.' },
        { title: 'Cómo aprovecharlo', body: 'Elige un proyecto ancla y dos canales máximo (escrito + voz, por ejemplo). Bloques cortos de foco, resúmenes al cierre del día. Ideal para redactar, negociar, formar, hacer networking con sustancia — no solo tarjetas de visita.' },
        { title: null, body: '{ciudad} amplifica tu voz cuando tienes algo real que decir. No inventa talento; te da corriente para que el que ya traes se note antes.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descansar aquí no siempre es callar la cabeza — a veces es dejar que las ideas pasen sin atraparlas todas. Puede favorecer paseos con estímulo suave: librerías, cafés tranquilos, museos pequeños, rutas donde la mente divaga sin exigencia.' },
        { title: 'Qué puede desafiar', body: 'Si no pones límites, el lugar te mantiene en modo consumo: podcasts, notificaciones, planes encadenados. El cansancio puede ser mental más que físico. Dormir mal por darle vueltas a lo que leíste o escuchaste es habitual si no sueltas el día.' },
        { title: 'Cómo aprovecharlo', body: 'Alterna estímulo y silencio: una hora de curiosidad, luego pantalla en gris. Camina sin podcast. Escribe tres líneas y cierra el cuaderno. El descanso mercurial es ritmo, no vacío absoluto.' },
        { title: null, body: 'En {ciudad} puedes recuperarte si tratas la mente como invitada, no como jefe. Cuando dejas de perseguir cada pensamiento, el lugar se vuelve más liviano.' }
      ]
    }
  },
  MERCURIO_MC: {
    planeta: 'Mercurio', angulo: 'MC', color: '#0369A1',
    amor:     "El amor llega por vías profesionales: una colaboración, un mensaje, una idea compartida. Aquí lo que dices te define.",
    trabajo:  "Comunicación, medios, escritura, comercio. {ciudad} reconoce y paga a quien sabe articular.",
    descanso: "El descanso aquí pasa por leer, aprender, perder horas en una conversación."
  },
  MERCURIO_IC: {
    planeta: 'Mercurio', angulo: 'IC', color: '#0369A1',
    amor:     "El amor aquí se construye con cartas, mensajes largos, complicidad mental. Vínculos que conversan hasta tarde.",
    trabajo:  "Lugar ideal para estudiar, traducir, ordenar archivos, pensar en silencio. El trabajo invisible que sostiene todo lo demás.",
    descanso: "Lee mucho. Escribe un diario. {ciudad} te devuelve la voz interior."
  },
  MERCURIO_DC: {
    planeta: 'Mercurio', angulo: 'DC', color: '#0369A1',
    amor:     "Atraes a comunicadores, a personas curiosas. La relación funciona mientras la conversación esté viva.",
    trabajo:  "Negociaciones, acuerdos, contratos: todo lo que se firma o se intercambia fluye en {ciudad}.",
    descanso: "Descansa hablando. Una cena larga aquí vale más que un fin de semana solo."
  },

  /* ─────────────── VENUS ─────────────── */
  VENUS_AC: {
    planeta: 'Venus', angulo: 'AC', color: '#BE185D',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: '{ciudad} puede activar disfrute, presencia y un cierto magnetismo tranquilo. La estética del lugar — luz, ritmo, detalle — a veces te resulta familiar, no forzada. En amor, favorece encuentros donde hay química sin teatro: conversación pausada, placer compartido, cuidado mutuo visible.' },
        { title: 'Qué puede desafiar', body: 'También puede activar comparación: parejas felices en la calle mientras tú sientes distancia, o confundir atracción con validación. Si buscas amor desde el vacío, el lugar no lo rellena; amplifica lo que ya traes contigo. El exceso de comodidad puede volverse evasión.' },
        { title: 'Cómo aprovecharlo', body: 'Invierte primero en trato propio: tres gestos pequeños que te darías con cariño real. Luego abre espacio social sin urgencia — una cena bien hecha, un museo, un paseo sin meta. Inicia tú la conversación si hay interés; el entorno suele respaldar más de lo que crees.' },
        { title: null, body: 'El amor en {ciudad} no es premio por estar perfecto. Es más probable cuando disfrutas tu vida y dejas que el otro se acerque a algo que ya tiene coherencia.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu trabajo aquí puede verse más claro y más atractivo: cómo presentas, cómo negocias, cómo cuidas la experiencia del otro. {ciudad} favorece oficios donde la forma importa — diseño, imagen, hospitalidad, cultura, venta consultiva — siempre que el fondo sea sólido.' },
        { title: 'Qué puede desafiar', body: 'Puede tentarte el empaquetado sin sustancia o la complacencia: decir que sí para mantener armonía, postergar conversaciones difíciles, medir tu valor solo por aplausos. También aparece el gasto invisible en apariencia sin retorno.' },
        { title: 'Cómo aprovecharlo', body: 'Refina presentación y precio con honestidad: un portfolio cuidado, un servicio que se siente humano, alianzas donde hay respeto mutuo. Pide feedback concreto, no solo halagos. Invierte en detalle visible solo donde multiplica confianza.' },
        { title: null, body: 'En {ciudad} el reconocimiento puede llegar con más fluidez si lo que ofreces ya tiene valor real. La belleza del entorno te empuja a subir el listón, no a esconderte detrás de él.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Este lugar puede invitarte a disfrutar sin culpa: comida lenta, cuerpo cuidado, paisaje que calma la vista. {ciudad} a veces se siente generosa con el bienestar sensorial — un escenario donde recuperar ritmo y gusto por lo simple.' },
        { title: 'Qué puede desafiar', body: 'El placer fácil puede convertirse en anestesia: compras, exceso dulce, evitar lo que duele maquillándolo de autocuidado. También puede aparecer la sensación de no merecer pausa si tu narrativa interna es muy exigente.' },
        { title: 'Cómo aprovecharlo', body: 'Elige un placer deliberado al día sin rendimiento: paseo estético, baño largo, música en vivo, cocina con tiempo. Alterna con silencio para que el cuerpo registre el alivio. El descanso venusino es sensación, no solo fotos.' },
        { title: null, body: 'Descansar en {ciudad} puede ser reentrenarte en recibir. No es lujo vacío; es mantenimiento de quien eres cuando vuelves a la vida diaria.' }
      ]
    }
  },
  VENUS_MC: {
    planeta: 'Venus', angulo: 'MC', color: '#BE185D',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El amor puede llegar por círculos donde ya brillas: eventos, oficios creativos, ambientes donde tu estilo y tu trabajo se ven. En {ciudad} atraes quien valora lo que haces y cómo lo presentas — vínculos con química y respeto mutuo visible.' },
        { title: 'Qué puede desafiar', body: 'Puede mezclarse seducción profesional con interés real, o compararte con parejas más fotogénicas. También aparece la tentación de elegir quien admira tu imagen, no quien te conoce cansado.' },
        { title: 'Cómo aprovecharlo', body: 'Observa cómo te tratan fuera del escenario público. Comparte un plan simple sin networking. Si hay interés, cuida la vida privada desde el inicio — no todo tiene que ser contenido.' },
        { title: null, body: 'El amor en {ciudad} puede ser elegante y real a la vez si eliges presencia sobre pose. La estética abre la puerta; la honestidad la sostiene.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Tu trabajo puede ganar atractivo y valor percibido: diseño, imagen, hospitalidad, cultura, venta consultiva, gastronomía. {ciudad} favorece cuando la forma y el fondo van juntos — persuadir, conectar, embellecer lo que ya es bueno. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Riesgo de empaquetar sin sustancia, gastar en apariencia, o postergar conversaciones difíciles por mantener armonía. También puede activar dependencia de aplausos para sentir que vales.' },
        { title: 'Cómo aprovecharlo', body: 'Invierte en presentación con criterio: portfolio, servicio, detalle que multiplique confianza. Pide feedback concreto. Negocia precio con elegancia — no con disculpa. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo puede fluir cuando te tratas con el mismo cuidado que ofreces al cliente. Eso se nota antes que cualquier logo.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El descanso puede ser placer bien hecho: buena mesa, cuerpo cuidado, espacios bellos que bajan el ritmo. {ciudad} a veces permite disfrutar el oficio sin culpa — un día de belleza sin productividad.' },
        { title: 'Qué puede desafiar', body: 'Puede convertirse en consumo estético vacío o en trabajar incluso en vacaciones porque el placer y el rendimiento se mezclan. También aparece la sensación de no merecer pausa si no te ves bien.' },
        { title: 'Cómo aprovecharlo', body: 'Un placer al día sin foto obligatoria. Silencio después del estímulo. Si tu descanso es creativo, pon límite de horas. El cuerpo necesita registrar alivio, no solo estímulo. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser recordar que el gusto también es mantenimiento. Cuando lo permites, vuelves con más mesura.' }
      ]
    }
  },
  VENUS_IC: {
    planeta: 'Venus', angulo: 'IC', color: '#BE185D',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El amor puede ser privado, estético, íntimo: belleza en lo pequeño, cocina, detalle, cuerpo en calma. En {ciudad} favorece vínculos que se construyen en la vida diaria — menos escaparate, más habitación compartida.' },
        { title: 'Qué puede desafiar', body: 'Puede activar idealización del hogar, celos del espacio, o evitar conversaciones difíciles maquillándolas de armonía. También aparece quedarte en lo cómodo cuando hace falta un paso valiente afuera.' },
        { title: 'Cómo aprovecharlo', body: 'Cuida el espacio y el tiempo a dos. Un ritual placentero sin rendimiento. Si hay tensión, nómbrala con voz baja antes de que crezca. La intimidad venusina necesita verdad suave. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede florecer en lo cotidiano. No siempre brilla en la calle; a veces brilla en la mesa.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Trabajar en algo que amas puede fluir mejor aquí: oficios desde casa, artesanía, diseño íntimo, cocina, cuidado estético del entorno. {ciudad} favorece cuando el trabajo se siente habitacional, no solo rentable.' },
        { title: 'Qué puede desafiar', body: 'El lugar tolera mal lo que aborreces — puede aparecer hastío rápido o procrastinación dulce. También mezclar placer y obligación sin límites. Si tu oficio es solo supervivencia, puede resentirse.' },
        { title: 'Cómo aprovecharlo', body: 'Alinea tarea y gusto donde puedas; donde no, pon límites claros de horario. Embellece tu espacio de trabajo mínimo. Un proyecto pequeño terminado vale más que un sueño decorado. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo puede sanar si lo vinculas con cuidado. Si lo fuerzas sin respeto, el cuerpo protesta antes que la cabeza.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El placer y el hogar pueden fundirse: baño largo, ropa cómoda, comida bella, silencio en un rincón. {ciudad} favorece descanso sensorial — cuerpo mimado sin necesidad de explicarlo. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Puede volverse aislamiento dulce o consumo para no sentir. También aparece culpa por disfrutar si tu narrativa es muy exigente. El descanso puede parecer “demasiado blando”.' },
        { title: 'Cómo aprovecharlo', body: 'Un placer doméstico al día sin productividad. Abre ventana, cambia sábanas, cocina lento. Alterna nido con un paseo corto para que el mundo no desaparezca del todo. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser reentrenarte en recibir en privado. Eso también es fortaleza.' }
      ]
    }
  },
  VENUS_DC: {
    planeta: 'Venus', angulo: 'DC', color: '#BE185D',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Puede activarse tu capacidad de vínculo equilibrado: química, reciprocidad, encuentros con presencia. Si buscas amor, {ciudad} suele ofrecer un escenario favorable — conversación fácil, placer compartido, gente que también busca conexión.' },
        { title: 'Qué puede desafiar', body: 'También puede activar comparación, dependencia de validación o elegir quien encanta pero no sostiene. Si llegas con hambre de llenar un vacío, el lugar lo nota y pospone. El exceso de complacencia evita verdades necesarias.' },
        { title: 'Cómo aprovecharlo', body: 'Llega nutrido contigo: tres gestos de autocuidado antes de buscar al otro. Inicia conversación con calma. Observa si hay reciprocidad en lo pequeño antes de idealizar. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede ser más accesible cuando no negocias tu dignidad por compañía. La armonía real incluye límites.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Colaboraciones armoniosas: socios, clientes, equipos donde el trato importa. {ciudad} favorece negociación elegante, diseño en pareja, alianzas creativas — trabajo que se siente humano y equilibrado. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Evitar conflicto necesario por mantener paz, o firmar acuerdos bonitos sin detalle. También puede aparecer dependencia del socio o distracción social que come horas.' },
        { title: 'Cómo aprovecharlo', body: 'Pon por escrito lo acordado aunque la química sea buena. Revisa reciprocidad de esfuerzo cada semana. Di no con suavidad cuando haga falta — la armonía sostiene con verdad. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo en equipo puede fluir si el respeto es mutuo. La belleza del trato no sustituye la claridad.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso compartido: cenas largas, paseos a dos, placer social sin exigencia. {ciudad} favorece recuperarte en compañía elegida — risa, mesa, conversación que baja el ritmo. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Puede costar estar solo si asocias descanso a compañía. También aparece agenda social que agota o comparación con la vida ajena. El placer ajeno no siempre es tu descanso.' },
        { title: 'Cómo aprovecharlo', body: 'Elige una o dos personas de confianza, no toda la ciudad. Un plan placentero sin foto obligatoria. Deja un día solo para integrar lo vivido. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser compartir el gusto con quien te deja más entero. La calidad del vínculo importa más que la cantidad.' }
      ]
    }
  },

  /* ─────────────── MARTE ─────────────── */
  MARTE_AC: {
    planeta: 'Marte', angulo: 'AC', color: '#B91C1C',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El deseo puede sentirse más directo: atracción física clara, iniciativa, conversaciones que no dan vueltas. En {ciudad} es más fácil saber si hay chispa y actuar en consecuencia. Si buscas amor, el lugar favorece honestidad corporal y franqueza, menos juegos prolongados.' },
        { title: 'Qué puede desafiar', body: 'La misma energía puede confundir intensidad con compatibilidad, o acelerar conflictos si no hay límites. También aparece impaciencia, celos rápidos, o cansancio si no canalizas el cuerpo. No todo lo que enciende conviene repetir.' },
        { title: 'Cómo aprovecharlo', body: 'Antes de dramatizar, mueve el cuerpo y luego decide. En citas, nombra qué quieres sin agresión. Si hay interés mutuo, construye ritmo: ver, hablar, probar — no todo el primer día. La claridad mata fantasías que solo calentaban.' },
        { title: null, body: 'El amor en {ciudad} puede ser vivo y breve, o vivo y profundo — la diferencia suele estar en si respiras entre impulso e historia.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Energía para empezar lo que pospones: lanzar, vender, competir, defender precio, cerrar. {ciudad} favorece oficios con acción — deporte, urgencias, ejecución, liderazgo táctico, emprendimiento en marcha. La fricción puede ser combustible si apuntas a una meta.' },
        { title: 'Qué puede desafiar', body: 'Riesgo de quemar puentes, responder de golpe, o confundir velocidad con estrategia. Puede haber irritación con la burocracia y poco tolerancia a la lentitud ajena. Sin diana, la energía se vuelve ruido interno.' },
        { title: 'Cómo aprovecharlo', body: 'Define una meta medible para la estancia. Haz deporte intenso como higiene, no como castigo. Negocia con firmeza pero cumple. Usa la urgencia para el primer paso; usa la disciplina para sostener.' },
        { title: null, body: 'En {ciudad} el trabajo avanza cuando dejas de esperar permiso. El límite inteligente es lo que evita que el impulso te cobre factura doble.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El descanso puede ser activo: caminar fuerte, nadar, entrenar, explorar barrios a pie hasta cansarte bien. {ciudad} a veces suelta tensión cuando el cuerpo gasta lo que la cabeza acumuló. Dormir profundo tras movimiento es habitual.' },
        { title: 'Qué puede desafiar', body: 'Cuesta estar quieto sin irritarte. Puede aparecer ansiedad de fondo, sueño ligero si no mueves suficiente, o tensión si no tienes válvula física. El no hacer nada puede sentirse como fallo.' },
        { title: 'Cómo aprovecharlo', body: 'Planifica movimiento diario antes que pantalla. Masaje, agua fría, estiramientos. Si viajas con alguien, acuerden descanso corporal compartido — caminar, cocinar, jugar — no solo sofá. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser agotarte bien para volver a ti. Cuando el cuerpo termina, la mente por fin baja el volumen.' }
      ]
    }
  },
  MARTE_MC: {
    planeta: 'Marte', angulo: 'MC', color: '#B91C1C',
    amor:     "Tu ambición es visible y atrae a quien la respeta — o a quien la rivaliza. Define qué quieres antes de implicarte.",
    trabajo:  "Aquí compites y a menudo ganas. Liderazgo, deporte, ejecutivo, emprendimiento. La fricción es parte del éxito.",
    descanso: "Difícil descansar — el lugar te pide actuar. Acepta que el descanso es la conquista, no el reposo."
  },
  MARTE_IC: {
    planeta: 'Marte', angulo: 'IC', color: '#B91C1C',
    amor:     "Tensión en lo íntimo. Las discusiones aquí escalan rápido; lo que callas en casa explota cuando menos lo esperas.",
    trabajo:  "Trabajar desde el hogar puede frustrar. Mejor separar espacios — ambiente cargado, productividad irregular.",
    descanso: "Cuidado con la irritabilidad doméstica. Necesitas válvulas físicas: ejercicio, jardinería, algo que canalice."
  },
  MARTE_DC: {
    planeta: 'Marte', angulo: 'DC', color: '#B91C1C',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Pasión clara y franqueza: atracción que no se esconde, conversaciones que van al punto. En {ciudad} los vínculos pueden ser intensos — a veces conflicto y deseo en la misma tarde — pero suelen ser honestos.' },
        { title: 'Qué puede desafiar', body: 'Discusiones que escalan, competencia entre parejas, o confundir adrenalina con amor. También aparece impaciencia con la tibieza ajena. Si evitas el conflicto en casa, el lugar lo trae aquí.' },
        { title: 'Cómo aprovecharlo', body: 'Mueve el cuerpo antes de hablar de lo importante. Usa frases cortas y concretas. Si hay tensión, pausa y vuelve — no ganes la pelea y pierdas el vínculo. La pasión necesita límites. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} rara vez es tibio. Puede ser transformador si eliges verdad sobre victoria.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Socios con carácter y negociaciones directas: acuerdos rápidos cuando hay respeto, energía para empujar proyectos compartidos. {ciudad} favorece equipos que ejecutan — menos diplomacia vacía, más acción. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Choques de ego, contratos firmados en caliente, rupturas impulsivas. La fricción puede quemar puentes si no hay reglas. También aparece competir con aliados en lugar de colaborar.' },
        { title: 'Cómo aprovecharlo', body: 'Define roles y plazos por escrito. Canaliza la energía hacia un enemigo común — el problema, no la persona. Reuniones cortas con decisión al final. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo en pareja puede avanzar rápido si el conflico tiene canal. Sin canal, solo deja cicatrices.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso después de decir lo no dicho: alivio cuando la verdad sale con cuidado. {ciudad} puede permitir conversaciones que limpian tensión acumulada — especialmente si viajas con alguien.' },
        { title: 'Qué puede desafiar', body: 'Difícil estar en calma si hay guerra fría o discusión pendiente. Puede aparecer insomnio, cuerpo tenso, necesidad de moverte para no explotar. El descanso no llega mientras la pelea sigue en la cabeza.' },
        { title: 'Cómo aprovecharlo', body: 'Agenda una conversación con inicio y fin. Camina junto, no frente a frente en mesa. Si no hay acuerdo, al menos hay claridad — eso también descansa. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser dejar de postergar la fricción con nombre. Cuando se nombra, el cuerpo a veces suelta antes que la mente.' }
      ]
    }
  },

  /* ─────────────── JÚPITER ─────────────── */
  JUPITER_AC: {
    planeta: 'Júpiter', angulo: 'AC', color: '#D97706',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Puede ampliarse tu sensación de lo posible en vínculo: más confianza para acercarte, más humor, más apertura a conocer gente distinta. {ciudad} favorece encuentros que ensanchan — viajeros, maestros, conversaciones que cambian el mapa. El amor, si llega, suele traer perspectiva.' },
        { title: 'Qué puede desafiar', body: 'También puede exagerar expectativas: prometer de más, idealizar el inicio, o confundir amplitud con compatibilidad real. Puede costar elegir — todo parece interesante. Cuidado con dispersarte en posibilidades.' },
        { title: 'Cómo aprovecharlo', body: 'Di sí a una experiencia social que normalmente rechazarías. Mantén un criterio simple: ¿me deja más entero o más disperso? Invierte en un vínculo a la vez. La generosidad funciona mejor con límites claros.' },
        { title: null, body: 'El amor en {ciudad} puede sentirse como puerta abierta. Lo que la sostiene no es la fe ciega, sino la coherencia entre lo que dices y lo que vives.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Las puertas pueden abrirse con más facilidad: contactos, invitaciones, proyectos que crecen. {ciudad} favorece enseñar, publicar, expandir, negociar con visión — si traes sustancia, el lugar ayuda a que se note antes.' },
        { title: 'Qué puede desafiar', body: 'Riesgo de decir que sí a todo, inflar presupuestos o reputación, o frustrarte si la grandeza no llega al instante. También aparece la tentación de parecer más grande de lo que estás listo para sostener.' },
        { title: 'Cómo aprovecharlo', body: 'Elige dos apuestas máximo y profundiza. Haz tres contactos útiles con seguimiento. Documenta promesas. La expansión aquí funciona cuando anclas cada oportunidad en un siguiente paso concreto. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo puede crecer si piensas en grande y actúas en pequeño. La amplitud sin ejecución se convierte en ruido.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso con amplitud: viajes cortos desde la ciudad, naturaleza, mesas largas, risa, sensación de suficiencia. {ciudad} puede devolverte ganas de explorar sin culpa — útil si llegas encogido por la escasez mental.' },
        { title: 'Qué puede desafiar', body: 'Puede costar parar: quieres un plan más, un viaje más, una fiesta más. El exceso también cansa. También aparece comparación con vidas más grandes que la tuya en la calle o en pantalla.' },
        { title: 'Cómo aprovecharlo', body: 'Reserva días sin meta turística. Come bien una vez al día sin prisa. Camina sin mapa una hora. El descanso jupiteriano es espacio, no solo consumo. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser recordar que la vida tiene margen. Cuando lo sientes en el cuerpo, vuelves con otro ritmo.' }
      ]
    }
  },
  JUPITER_MC: {
    planeta: 'Júpiter', angulo: 'MC', color: '#D97706',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El reconocimiento puede hacerte más visible y eso abre vínculos con quien admira tu trayectoria o tu generosidad. En {ciudad} puede haber amor ligado a crecimiento compartido — parejas que amplían horizonte, no que lo reducen.' },
        { title: 'Qué puede desafiar', body: 'Confundir admiración con amor es el riesgo clásico. También aparece elogio que no compromete, o relaciones donde tú das más visibilidad de la que recibes cuidado. Puede costar ver al otro detrás del aplauso.' },
        { title: 'Cómo aprovecharlo', body: 'Pregunta cómo es el otro cuando no brilla. Comparte tiempo sin audiencia. Si hay interés, negocia reciprocidad emocional con la misma claridad que un acuerdo laboral. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede crecer con tu carrera si no le pides que sea público para existir. La intimidad también merece expansión.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Expansión profesional con viento a favor: contactos, invitaciones a enseñar, publicar, liderar, escalar un proyecto. {ciudad} favorece pensar en grande con ejecución — la visión encuentra más eco aquí.' },
        { title: 'Qué puede desafiar', body: 'Prometer de más, inflar presupuestos, frustrarte si el salto no es inmediato. También puede activar soberbia o dispersión en demasiados frentes. El lugar amplifica; no sustituye preparación.' },
        { title: 'Cómo aprovecharlo', body: 'Haz al menos tres contactos con seguimiento escrito. Elige un salto realista y desglósalo. Celebra hitos pequeños para no vivir solo en la fantasía del gran golpe. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} la carrera puede abrirse si actúas en la dirección del crecimiento, no solo en su narrativa. La generosidad profesional funciona cuando tiene límites.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso como celebración contenida: cena larga tras un logro, viaje corto, sensación de suficiencia. {ciudad} puede permitirte disfrutar el éxito sin convertirlo inmediatamente en la siguiente meta. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Cuesta parar de producir o de planificar el siguiente nivel. Puede aparecer ansiedad si no creces, o consumo para compensar presión. El éxito aquí no descansa solo.' },
        { title: 'Cómo aprovecharlo', body: 'Agenda días sin producción antes de llegar. Comparte el logro con pocas personas de confianza. Camina sin objetivo de networking. El descanso es bajar el listón un tiempo. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser honrar lo logrado sin exigirte la versión siguiente al día siguiente. Eso también es madurez.' }
      ]
    }
  },
  JUPITER_IC: {
    planeta: 'Júpiter', angulo: 'IC', color: '#D97706',
    amor:     "El hogar se llena. Vínculos familiares generosos, casas grandes en sentido literal o emocional.",
    trabajo:  "El trabajo desde casa prospera. Las raíces aquí dan más frutos de los que esperabas.",
    descanso: "{ciudad} se siente abundante incluso sin gastar. Hay un sentido de suficiencia que cura."
  },
  JUPITER_DC: {
    planeta: 'Júpiter', angulo: 'DC', color: '#D97706',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Puedes atraer personas que abren mundo: viajeros, maestros, extranjeros, quien trae perspectiva. En {ciudad} el amor puede ampliar — menos posesión, más horizonte compartido, vínculos que enseñan algo. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Idealizar al otro como guru, prometer viajes sin cumplir, o confundir amplitud con falta de compromiso. También aparece relaciones donde tú das más espacio del que recibes cuidado.' },
        { title: 'Cómo aprovecharlo', body: 'Pregunta qué sostiene el vínculo más allá de la aventura. Comparte un plan realista, no solo un sueño. Si hay interés, construye acuerdos concretos — tiempo, dinero, presencia. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede ensanchar tu mapa. La pregunta útil es si también te da suelo, no solo cielo.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Socios generosos, contratos amplios, alianzas donde ambas partes ganan. {ciudad} favorece negociar con visión — mercados nuevos, mentoría, proyectos que crecen con otra cabeza pensante. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Prometer de más en acuerdos, confiar sin verificar, o dispersarte en demasiadas alianzas. También puede aparecer el socio encantador que no ejecuta.' },
        { title: 'Cómo aprovecharlo', body: 'Revisa términos con calma aunque la química sea buena. Define hitos compartidos. Celebra amplitud con documentación — la confianza se construye, no se asume. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo en alianza puede crecer si la generosidad tiene estructura. Sin estructura, solo deja buenas intenciones que conviene revisar con calma antes de seguir.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso social amplio: mesa larga, amigos nuevos, conversación que abre puertas. {ciudad} favorece recuperarte en compañía que inspira — risa, comida, historias que cambian el ánimo. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Agenda social que agota, planes demasiado grandes, dificultad para estar solo. También aparece comparación con vidas más expansivas. El descanso puede convertirse en otro rendimiento.' },
        { title: 'Cómo aprovecharlo', body: 'Elige pocas encuentros de calidad. Deja un día sin presentaciones nuevas. Camina solo después de compartir — integra lo vivido. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser dejarte alimentar por la compañía correcta. La amplitud descansa cuando no es obligación y cuando eliges con criterio, no por miedo a quedarte fuera.' }
      ]
    }
  },

  /* ─────────────── SATURNO ─────────────── */
  SATURNO_AC: {
    planeta: 'Saturno', angulo: 'AC', color: '#4B5563',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'En {ciudad} el vínculo tiende a pedir honestidad y tiempo. Puede favorecer relaciones sobrias, con compromiso explícito, menos fuegos artificiales y más construcción compartida. Si buscas amor maduro, aquí aparece la versión seria de ti — la que no negocia lo esencial.' },
        { title: 'Qué puede desafiar', body: 'También puede sentirse frío al inicio: lentitud, pruebas de constancia, sensación de que todo cuesta un poco más. Puede activar miedo al rechazo o rigidez — “si no está claro, no sirve”. No confundas prudencia con desinterés.' },
        { title: 'Cómo aprovecharlo', body: 'Define qué valores no negocias y comunica expectativas sin dramatizar. Pequeños gestos sostenidos valen más que grandes gestos únicos. Si hay interés mutuo, construye acuerdos simples: tiempo, límites, ritmo. La paciencia aquí es herramienta, no castigo.' },
        { title: null, body: 'El amor en {ciudad} no promete chispa instantánea. Ofrece algo más raro: vínculo que aguanta cuando deja de hacer gracia el escenario.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Este lugar puede favorecer oficio, disciplina y reputación ganada a golpe de constancia. Lo que construyes en {ciudad} suele pesar: contratos largos, maestría técnica, proyectos que requieren años. Ideal si tu objetivo tolera demora a cambio de solidez.' },
        { title: 'Qué puede desafiar', body: 'La improvisación se resiente: retrasos, burocracia, sensación de reglas invisibles. Puede activar dureza contigo o con otros, o la narrativa de “aún no soy suficiente”. Si esperas resultados inmediatos, la fricción te desgasta.' },
        { title: 'Cómo aprovecharlo', body: 'Llega con un plan mínimo viable: hitos trimestrales, mentor si existe, métricas claras. Cumple plazos aunque nadie los celebre. Saturno recompensa lo que sostienes; castiga lo que anuncias sin sostén.' },
        { title: null, body: 'En {ciudad} el trabajo puede sentirse más lento y más real. Si aceptas el ritmo, lo que dejas hecho tiende a quedarse.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'No es descanso ligero, pero puede ser reparador: rutina que calma, sueño regular, sensación de orden después del caos. {ciudad} a veces pide estructura — horarios, límites, cuerpo cuidado con método — y eso, para ciertas etapas, descansa más que el ocio disperso.' },
        { title: 'Qué puede desafiar', body: 'Puede sentirse opresivo si llegas exhausto y esperas milagro de fin de semana. También activa culpa por no producir o por sentirte mayor de lo que quisieras. El descanso aquí no siempre es placer inmediato; es asumir límites.' },
        { title: 'Cómo aprovecharlo', body: 'Planifica menos y sostén lo básico: dormir, caminar, comida simple, un solo placer permitido. Negocia expectativas con quien viaja contigo. El descanso saturnino es recuperar autoridad sobre tu ritmo, no desaparecer del mundo.' },
        { title: null, body: 'En {ciudad} a veces descansas cuando dejas de luchar contra el reloj. No es el lugar más blando; puede ser el más honesto con lo que tu cuerpo ya venía pidiendo.' }
      ]
    }
  },
  SATURNO_MC: {
    planeta: 'Saturno', angulo: 'MC', color: '#4B5563',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Puede favorecer vínculos sobrios y duraderos: parejas que respetan tu tiempo, tu trabajo, tu palabra. En {ciudad} el amor maduro suele llegar cuando la vida está ordenada — menos fuegos artificiales, más compromiso explícito.' },
        { title: 'Qué puede desafiar', body: 'El trabajo puede absorber el calendario amoroso. También aparece frialdad, miedo al rechazo, o sensación de que no hay espacio para ligereza. Si esperas romance de película, puede frustrarte.' },
        { title: 'Cómo aprovecharlo', body: 'Protege citas como reuniones importantes. Comunica ritmo y límites sin dramatizar. Si hay interés mutuo, construye acuerdos simples — tiempo, expectativas, silencios compartidos. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede ser lento y serio. Si sobrevive aquí, suele sobrevivir porque tiene estructura, no solo porque arde.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Carrera con peso: reputación que dura, ascensos lentos, autoridad ganada con años y entregables. {ciudad} favorece construir algo que aguante — instituciones, oficio, maestría, contratos largos. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Fricción, retrasos, sensación de que todo cuesta el doble. Puede activar dureza contigo o exigencia crónica. Si buscas golpe de efecto, el lugar puede desanimar antes de recompensar.' },
        { title: 'Cómo aprovecharlo', body: 'Trabaja como si quedara registro: plazos cumplidos, documentación clara, mentor si existe. Define hitos trimestrales, no diarios. La paciencia aquí es estrategia, no resignación. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo puede sentirse más lento y más real. Lo que dejas hecho tiende a quedarse en tu historial profesional.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Descanso entre temporadas: cuando cierras un ciclo, el cuerpo puede soltar. {ciudad} a veces enseña pausa estructurada — sueño regular, rutina, silencio después de cumplir. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Cuesta soltar si sientes que siempre falta algo. Puede aparecer culpa por no producir o descanso que se siente como debilidad. No es el lugar más blando para vacío total.' },
        { title: 'Cómo aprovecharlo', body: 'Negocia límites de trabajo antes de viajar. Un ritual de cierre — lista hecha, equipo avisado — y luego silencio. El descanso saturnino es orden, no abandono. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser la pausa entre capítulos. No siempre es ligero; a veces es exactamente lo que tu ritmo llevaba tiempo pidiendo.' }
      ]
    }
  },
  SATURNO_IC: {
    planeta: 'Saturno', angulo: 'IC', color: '#4B5563',
    amor: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'El amor puede pedir madurez doméstica: compromiso, límites claros, vínculos que sostienen la vida real. En {ciudad} puede aparecer pareja seria o profundizar un vínculo existente — menos teatro, más construcción.' },
        { title: 'Qué puede desafiar', body: 'El hogar pesa: resuena lo familiar antiguo, mandatos heredados, frialdad si evitas sentir. Puede activar distancia, miedo a necesitar, o sensación de que el amor es obligación. No confundas prudencia con desamor.' },
        { title: 'Cómo aprovecharlo', body: 'Habla de hogar y expectativas con calma. Si hay heridas familiares, ponles nombre sin dramatizar. En pareja, acuerdos sobre espacio, tiempo y dinero evitan resentimiento. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'El amor en {ciudad} puede ser trabajo interior compartido. Cuando se hace, el vínculo gana suelo; cuando se evita, el peso domina.' }
      ]
    },
    trabajo: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Reorganizar raíces puede fluir: herencias, archivo, vivienda, historia familiar, negocio desde casa con estructura. {ciudad} favorece lo que requiere paciencia y documentación — ordenar lo heredado para avanzar. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Burocracia lenta, tensiones con autoridad o familia, sensación de carga. Puede activar rigidez o miedo a empezar si temes equivocarte. No es escenario para improvisar lo serio.' },
        { title: 'Cómo aprovecharlo', body: 'Lista pequeña de pendientes reales. Un trámite a la vez. Pide ayuda profesional si hace falta. Cierra ciclos antes de abrir otros — Saturno premia el orden, no la acumulación. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'En {ciudad} el trabajo de raíz puede ser pesado y liberador. Lo que ordenas aquí suele aligerar años después.' }
      ]
    },
    descanso: {
      expanded: true,
      sections: [
        { title: 'Qué puede favorecer', body: 'Soledad útil: estar sin compañía y que eso sea exactamente lo necesario. {ciudad} puede permitir silencio, sueño largo, orden en casa, sensación de suelo bajo los pies. También conviene notar qué te activa y qué te agota, sin convertirlo en veredicto inmediato.' },
        { title: 'Qué puede desafiar', body: 'Puede sentirse opresivo, frío o demasiado adulto. También aparece culpa por descansar si tu modelo familiar fue esfuerzo constante. El descanso no siempre es tierno.' },
        { title: 'Cómo aprovecharlo', body: 'Ordena un rincón, no toda la vida. Camina solo una hora. Escribe lo que heredaste y qué quieres soltar. El descanso saturnino es estructura mínima que calma. Dale unos días para contrastar sensación y hechos antes de cerrar la experiencia.' },
        { title: null, body: 'Descansar en {ciudad} puede ser estar contigo sin rendir cuentas a nadie. A veces eso es la forma más seria de cuidarte.' }
      ]
    }
  },
  SATURNO_DC: {
    planeta: 'Saturno', angulo: 'DC', color: '#4B5563',
    amor:     "Vínculos de compromiso, parejas con peso, relaciones con diferencia de edad o de mundo. El amor aquí no es ligero.",
    trabajo:  "Socios serios, contratos largos. Aquí no se firma a la primera — y eso te protege.",
    descanso: "Compañía sobria. {ciudad} no es para amistades de superficie."
  },

  /* ─────────────── URANO ─────────────── */
  URANO_AC: {
    planeta: 'Urano', angulo: 'AC', color: '#0E7490',
    amor:     "Aquí el amor llega cuando no lo buscas y se va igual. Atraes a quien rompe esquemas — empezando por los tuyos.",
    trabajo:  "Ideas que no tenías. Cambios bruscos de dirección. {ciudad} no es para planes a cinco años.",
    descanso: "Descansa rompiendo la rutina. Cualquier intento de previsibilidad aquí te aburre antes de empezar."
  },
  URANO_MC: {
    planeta: 'Urano', angulo: 'MC', color: '#0E7490',
    amor:     "Tu trabajo no convencional atrae a personas también no convencionales. Los vínculos no siguen los formatos clásicos.",
    trabajo:  "Tecnología, innovación, lo que aún no tiene nombre. Profesión disruptiva o periodos breves intensos.",
    descanso: "El cambio es tu descanso. Aquí estancarte te cuesta más caro que moverte."
  },
  URANO_IC: {
    planeta: 'Urano', angulo: 'IC', color: '#0E7490',
    amor:     "El hogar es inestable o liberador, según lo veas. Aquí no echarás raíces clásicas — y puede ser justo lo que necesitabas.",
    trabajo:  "Trabaja desde donde quieras. La oficina fija no encaja en {ciudad}.",
    descanso: "Inquietud crónica posible. Convierte la inquietud en exploración antes de que se vuelva ansiedad."
  },
  URANO_DC: {
    planeta: 'Urano', angulo: 'DC', color: '#0E7490',
    amor:     "Relaciones poco convencionales: distancia, formato abierto, intermitencias. Lo que aquí funciona no se parece a un manual.",
    trabajo:  "Colaboraciones que aparecen y desaparecen. Redes amplias en lugar de socios fijos.",
    descanso: "Personas nuevas, conversaciones que abren puertas que no sabías que tenías."
  },

  /* ─────────────── NEPTUNO ─────────────── */
  NEPTUNO_AC: {
    planeta: 'Neptuno', angulo: 'AC', color: '#106191',
    amor:     "Los límites se disuelven. Es fácil enamorarse de una proyección. Comprueba dos veces antes de comprometerte.",
    trabajo:  "Imaginación, arte, espiritualidad. El trabajo lógico cuesta — el creativo fluye solo.",
    descanso: "Música, agua, sueño largo. {ciudad} te pide que dejes de definirte por un rato."
  },
  NEPTUNO_MC: {
    planeta: 'Neptuno', angulo: 'MC', color: '#106191',
    amor:     "Tu imagen pública es difusa, romántica, casi inalcanzable — atractivo y peligroso a partes iguales.",
    trabajo:  "Vocaciones artísticas, terapéuticas, espirituales. Cuidado con clientes confusos o promesas exageradas.",
    descanso: "El éxito aquí puede sentirse irreal. Aterriza con personas que te conozcan de antes."
  },
  NEPTUNO_IC: {
    planeta: 'Neptuno', angulo: 'IC', color: '#106191',
    amor:     "El hogar es mágico o confuso. Hay algo no dicho que flota — explóralo antes de instalarte largo aquí.",
    trabajo:  "Trabajo silencioso, contemplativo, espiritual. No para administrar empresas.",
    descanso: "Sueños vívidos. Intuiciones nítidas. {ciudad} es porosa: cuida lo que dejas entrar."
  },
  NEPTUNO_DC: {
    planeta: 'Neptuno', angulo: 'DC', color: '#106191',
    amor:     "Idealizas — y te idealizan. El amor aquí puede ser sublime o autoengaño. La diferencia se ve con tiempo.",
    trabajo:  "Socios artísticos, sanadores, idealistas. Pon los acuerdos por escrito, aunque parezca innecesario.",
    descanso: "Compañía que abre estados alterados de presencia. Música, ritual, conversación a medianoche."
  },

  /* ─────────────── PLUTÓN ─────────────── */
  PLUTON_AC: {
    planeta: 'Plutón', angulo: 'AC', color: '#6B21A8',
    amor:     "Llegas y algo se rompe — para bien. {ciudad} no permite la versión vieja de ti en el amor.",
    trabajo:  "Transformación profesional. Lo que aquí termina, termina de verdad. Lo que empieza tiene peso.",
    descanso: "No es descanso ligero. Es el descanso de quien sale de un proceso largo y respira por primera vez."
  },
  PLUTON_MC: {
    planeta: 'Plutón', angulo: 'MC', color: '#6B21A8',
    amor:     "El poder profesional atrae intensidades. Vínculos con dimensión de poder — manejarlos requiere claridad.",
    trabajo:  "Líneas de profunda autoridad. Política, finanzas, terapia, investigación. Lo que haces transforma a otros.",
    descanso: "El éxito aquí cambia quién eres. Acéptalo: no se vuelve atrás."
  },
  PLUTON_IC: {
    planeta: 'Plutón', angulo: 'IC', color: '#6B21A8',
    amor:     "El hogar saca lo más profundo: lo heredado, lo no resuelto. Sanación posible si te dejas mirar.",
    trabajo:  "Trabajo de raíz: terapia personal, herencias, ordenar lo familiar antiguo. No es viaje turístico.",
    descanso: "{ciudad} te enfrenta a ti mismo. El descanso llega después del trabajo interior, no antes."
  },
  PLUTON_DC: {
    planeta: 'Plutón', angulo: 'DC', color: '#6B21A8',
    amor:     "Relaciones transformadoras. Aquí los vínculos te cambian — y tú los cambias a ellos. No hay encuentros casuales.",
    trabajo:  "Socios poderosos, alianzas que reconfiguran tu mapa. Mucho cuidado con dinámicas de control.",
    descanso: "Compañía intensa. Una conversación de tres horas en {ciudad} puede valer un año de terapia."
  }
};

/* Fase 3.8d / 3.8d.2 — lecturas expandidas (piloto editorial) */
window.KairosCityReading = (function () {
  var PILOT_KEYS = [
    'MERCURIO_AC', 'VENUS_AC', 'LUNA_AC', 'SATURNO_AC',
    'SOL_AC', 'MARTE_AC', 'JUPITER_AC',
    'SOL_MC', 'VENUS_MC', 'JUPITER_MC', 'SATURNO_MC',
    'LUNA_IC', 'VENUS_IC', 'SATURNO_IC',
    'VENUS_DC', 'MARTE_DC', 'JUPITER_DC'
  ];
  var ASPECTS = ['amor', 'trabajo', 'descanso'];
  var MIN_WORDS = 120;
  var MAX_WORDS = 250;
  var FORBIDDEN = [
    'universo quiere', 'destino está escrito', 'energías cósmicas',
    'todo ocurre por una razón', 'vibra alto', 'alma gemela',
    'universo conspira', 'manifestar', 'frecuencia vibracional',
    'portal energético', 'llama gemela', 'abundancia infinita',
    'misión cósmica', 'garantizado', 'debes mudarte'
  ];
  var CLICHE = [
    'vibra', 'energía cósmica', 'el universo', 'tu destino',
    'signo perfecto', '100% seguro'
  ];

  function wordCount(text) {
    return String(text).trim().split(/\s+/).filter(Boolean).length;
  }

  function readingText(entry) {
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    if (entry.expanded && entry.sections) {
      return entry.sections.map(function (s) { return s.body; }).join(' ');
    }
    return '';
  }

  function inspectAspect(key, aspect, entry) {
    var text = readingText(entry);
    var words = wordCount(text);
    var issues = [];
    if (words < MIN_WORDS) issues.push('short');
    if (words > MAX_WORDS) issues.push('long');
    var lower = text.toLowerCase();
    FORBIDDEN.forEach(function (p) {
      if (lower.indexOf(p) !== -1) issues.push('forbidden:' + p);
    });
    CLICHE.forEach(function (p) {
      if (lower.indexOf(p) !== -1) issues.push('cliche:' + p);
    });
    return { key: key, aspect: aspect, words: words, issues: issues, text: text };
  }

  return {
    PILOT_KEYS: PILOT_KEYS,
    MIN_WORDS: MIN_WORDS,
    MAX_WORDS: MAX_WORDS,
    wordCount: wordCount,
    readingText: readingText,
    inspectAspect: inspectAspect,
    inspectAll: function (interpretations) {
      var rows = [];
      PILOT_KEYS.forEach(function (key) {
        var combo = interpretations[key];
        if (!combo) return;
        ASPECTS.forEach(function (aspect) {
          rows.push(inspectAspect(key, aspect, combo[aspect]));
        });
      });
      return rows;
    }
  };
})();
