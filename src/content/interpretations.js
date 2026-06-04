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
    amor:     "En {ciudad} algo en ti se ilumina desde el primer momento. Tu presencia tiene más peso del habitual. Si buscas amor, este es un lugar donde puedes conseguirlo siendo tú mismo sin disculparte.",
    trabajo:  "Aquí tu trabajo se ve. Lo que haces llega a las personas que necesitan verlo. El lugar amplifica lo que traes — no inventa lo que no tienes.",
    descanso: "Este lugar te pide que no te escondas. Descansar aquí significa ocupar espacio sin pedir permiso."
  },
  SOL_MC: {
    planeta: 'Sol', angulo: 'MC', color: '#B45309',
    amor:     "Tu visibilidad profesional puede eclipsar lo íntimo. El amor aquí viene de quien valora tu ambición, no de quien la compite.",
    trabajo:  "Tu trabajo se ve. Las oportunidades profesionales son reales, pero solo para quien llega con algo concreto que ofrecer.",
    descanso: "No es el mejor lugar para descansar — aquí querrás hacer algo que importe."
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
    amor:     "El amor aquí tiene raíces. Vínculos que se construyen lento y duran.",
    trabajo:  "Trabaja desde casa si puedes. El lugar pide intimidad, no exposición.",
    descanso: "De todos los lugares que podrías visitar, {ciudad} es el que más se siente como hogar sin serlo."
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
    amor:     "El amor puede llegar a través de círculos profesionales. Las personas que conoces aquí valoran lo que haces.",
    trabajo:  "Diseño, creatividad, moda, gastronomía — todo lo que implique persuadir o conectar florece aquí.",
    descanso: "El placer profesional es tu forma de descanso en {ciudad}."
  },
  VENUS_IC: {
    planeta: 'Venus', angulo: 'IC', color: '#BE185D',
    amor:     "El amor aquí es privado, estético, íntimo. Construyes belleza en lo pequeño.",
    trabajo:  "Trabaja en algo que ames. El lugar no tolera el trabajo que no disfrutes.",
    descanso: "{ciudad} es donde el placer y el hogar se funden."
  },
  VENUS_DC: {
    planeta: 'Venus', angulo: 'DC', color: '#BE185D',
    amor:     "El lugar activa tu capacidad de establecer vínculos equilibrados. Si buscas amor, {ciudad} ofrece el escenario más favorable. La condición: llegar sin desesperación.",
    trabajo:  "Las colaboraciones aquí son armoniosas. El trabajo en equipo fluye.",
    descanso: "Descansa con otros, no solo. {ciudad} pide compartir el placer."
  },

  /* ─────────────── MARTE ─────────────── */
  MARTE_AC: {
    planeta: 'Marte', angulo: 'AC', color: '#B91C1C',
    amor:     "El deseo se afila. En {ciudad} las atracciones son rápidas y físicas. Cuidado con confundir intensidad con compatibilidad.",
    trabajo:  "Energía para empezar lo que llevas tiempo posponiendo. Aquí no se espera permiso — se actúa.",
    descanso: "Mueve el cuerpo. {ciudad} no descansa quieto: descansas haciendo deporte, caminando largo, agotándote bien."
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
    amor:     "Pasión intensa o conflicto abierto: a veces los dos a la vez. {ciudad} no acepta vínculos tibios.",
    trabajo:  "Socios con carácter. Las negociaciones son directas; la diplomacia funciona poco aquí.",
    descanso: "Si vienes con alguien, hablad lo no hablado. {ciudad} saca a la superficie lo que llevabais postergando."
  },

  /* ─────────────── JÚPITER ─────────────── */
  JUPITER_AC: {
    planeta: 'Júpiter', angulo: 'AC', color: '#D97706',
    amor:     "Llegas con una confianza que no tenías. La gente responde a esa amplitud. Es buen sitio para empezar de nuevo.",
    trabajo:  "Aquí las puertas se abren. No por suerte ciega — por tu disposición a creer que pueden abrirse.",
    descanso: "Viaja, explora, sal del barrio. {ciudad} recompensa al que se mueve con apetito."
  },
  JUPITER_MC: {
    planeta: 'Júpiter', angulo: 'MC', color: '#D97706',
    amor:     "El reconocimiento profesional te hace más atractivo. Cuidado con confundir admiración con amor — son cosas distintas.",
    trabajo:  "Línea clásica de expansión profesional. Publicar, enseñar, liderar, hacer crecer un proyecto. {ciudad} responde a la generosidad.",
    descanso: "El éxito aquí no se descansa: se celebra. Reserva tiempo deliberado para no producir."
  },
  JUPITER_IC: {
    planeta: 'Júpiter', angulo: 'IC', color: '#D97706',
    amor:     "El hogar se llena. Vínculos familiares generosos, casas grandes en sentido literal o emocional.",
    trabajo:  "El trabajo desde casa prospera. Las raíces aquí dan más frutos de los que esperabas.",
    descanso: "{ciudad} se siente abundante incluso sin gastar. Hay un sentido de suficiencia que cura."
  },
  JUPITER_DC: {
    planeta: 'Júpiter', angulo: 'DC', color: '#D97706',
    amor:     "Atraes a personas que abren mundos: maestros, extranjeros, viajeros. El amor aquí amplía, no encierra.",
    trabajo:  "Socios generosos, contratos amplios. {ciudad} favorece los acuerdos que dejan ganar a las dos partes.",
    descanso: "Compartir mesa larga. Conocer a gente que te lleve a sitios donde no entrarías solo."
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
    amor:     "El trabajo absorbe el tiempo del amor. Si la relación sobrevive aquí, sobrevive a casi todo.",
    trabajo:  "Carrera larga, ascensos lentos pero sólidos. La autoridad se gana con años, no con golpes de efecto.",
    descanso: "Aquí el descanso llega en la pausa entre temporadas. Acéptalo: no todos los lugares son para soltar."
  },
  SATURNO_IC: {
    planeta: 'Saturno', angulo: 'IC', color: '#4B5563',
    amor:     "El hogar pesa. Resuena algo de lo familiar antiguo — para bien si haces trabajo interior, para mal si lo evitas.",
    trabajo:  "Las raíces se ponen a prueba. Aquí se reorganiza lo heredado: bienes, historia, mandatos.",
    descanso: "Soledad útil. {ciudad} permite estar sin compañía y que eso sea exactamente lo que necesitabas."
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

/* Fase 3.8d — lecturas expandidas (piloto AC: Mercurio, Venus, Luna, Saturno) */
window.KairosCityReading = (function () {
  var PILOT_KEYS = ['MERCURIO_AC', 'VENUS_AC', 'LUNA_AC', 'SATURNO_AC'];
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
