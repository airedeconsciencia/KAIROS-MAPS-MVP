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
    amor:     "{ciudad} baja tus defensas. Te sentirás más permeable, más sensible. El amor aquí es vulnerable y real.",
    trabajo:  "Tu trabajo tiene dimensión emocional. Conectas con las personas a un nivel más íntimo que técnico.",
    descanso: "Permite que la ciudad te afecte. No racionalices demasiado lo que sientes aquí."
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
    amor:     "En {ciudad} la conversación es la puerta. Te enamoran las ideas tanto como los cuerpos; aquí encuentras a quien sepa hablarte.",
    trabajo:  "La mente se acelera. Excelente lugar para escribir, vender, enseñar, conectar. Tu palabra circula con facilidad.",
    descanso: "Descansar aquí no es callar — es dejar que las ideas pasen sin agarrarlas."
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
    amor:     "Aquí es más fácil disfrutar sin culpa. Si buscas amor, el lugar pone las condiciones — pero solo si ya te tratas bien a ti mismo.",
    trabajo:  "Tu trabajo tiene componente estético. Lo que haces es atractivo para los demás.",
    descanso: "{ciudad} tiene una estética que te entra bien. Haz algo puramente placentero sin propósito productivo."
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
    amor:     "En {ciudad} aparece la versión seria de ti. El amor aquí es menos espontáneo pero más duradero — si llega.",
    trabajo:  "Disciplina, oficio, paciencia. Lo que construyes aquí pesa. Lo que improvises se cae.",
    descanso: "No es lugar de descanso fácil. Te pide estructura, rutina, asumir tu edad. A veces eso es lo que descansa de verdad."
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
