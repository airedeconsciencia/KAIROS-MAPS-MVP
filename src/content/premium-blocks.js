/**
 * KAIROS MAPS — Premium editorial blocks (Fase 3.8e.3)
 *
 * Conocimiento estructurado extraído y transformado desde DOC-17, DOC-6, DOC-5, DOC-7.
 * Sin IA, sin copia literal de párrafos Master, sin datos astrológicos inventados.
 *
 * Depende de: docs/architecture/PREMIUM_READING_SOURCE_GROUNDING.md
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.3-0.1';

  var TAXONOMY = {
    schemaVersion: SCHEMA_VERSION,
    slots: {
      t1: { label: 'Experiencia', doc: 'DOC-17', mapsToStage: 'favorece' },
      t2: { label: 'Patrón psicológico', doc: 'DOC-17', mapsToStage: 'desafia' },
      t3: { label: 'Oportunidad condicionada', doc: 'DOC-17', mapsToStage: 'favorece' },
      t4: { label: 'Acción práctica', doc: 'DOC-17', mapsToStage: 'aprovechar' },
      synthesis: { label: 'Regla de síntesis', doc: 'DOC-6', mapsToStage: 'integrar' },
      context: { label: 'Contexto espacial', doc: 'DOC-5', mapsToStage: 'observar' },
      reloc: { label: 'Capa relocación', doc: 'DOC-7', mapsToStage: 'integrar' }
    },
    stages: ['favorece', 'desafia', 'aprovechar', 'observar', 'integrar'],
    factors: {
      intensidad: { docs: ['DOC-6', 'DOC-5'], label: 'Fuerza según distancia y angularidad' },
      contradiccion: { docs: ['DOC-6', 'DOC-17'], label: 'Fricción entre líneas simultáneas' },
      duracion: { docs: ['DOC-5', 'DOC-17'], label: 'Visita corta vs estancia prolongada' },
      adaptacion: { docs: ['DOC-6', 'DOC-5'], label: 'Integración natal y madurez psicológica' },
      permanencia: { docs: ['DOC-5', 'DOC-7'], label: 'Observación al permanecer en el lugar' }
    },
    goals: ['amor', 'trabajo', 'descanso', 'any'],
    integrationStates: ['integrated', 'projected', 'shadow', 'na'],
    maxDeepInfluences: 2
  };

  function src(doc, section) {
    return { doc: doc, section: section };
  }

  /** Bloques de síntesis — DOC-6, DOC-5, DOC-7, DOC-17 §13 */
  var SYNTHESIS_BLOCKS = [
    {
      id: 'doc6_jerarquia_natal_linea',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['any'],
      themes: ['jerarquía', 'natal', 'promesa'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.2 Carta Natal > Línea Planetaria')],
      text: 'La promesa de tu carta natal sigue mandando: el lugar amplifica lo que ya traes, no sustituye tu trabajo interior.'
    },
    {
      id: 'doc6_integrado_sobre_sombra',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['any'],
      themes: ['integración', 'sombra'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.2 Planeta Integrado > En Sombra')],
      text: 'Cuando una energía está poco integrada, el entorno puede sentirse como espejo exigente antes que como premio — el lugar pone el tema encima de la mesa.'
    },
    {
      id: 'doc6_contradiccion_friccion_evolutiva',
      slot: 'synthesis',
      stage: 'desafia',
      goals: ['any'],
      themes: ['contradicción', 'fricción'],
      factors: ['contradiccion'],
      match: { minInfluences: 2 },
      sources: [src('DOC-6', '§1.3 Evitar contradicciones simplistas')],
      text: 'Varias señales cercanas no se anulan: crean un clima mixto. Conviene leer la fricción como dinámica evolutiva, no como “bueno y malo” sin salida.'
    },
    {
      id: 'doc6_marte_jupiter_friccion',
      slot: 'synthesis',
      stage: 'desafia',
      goals: ['trabajo', 'any'],
      themes: ['crecimiento', 'impulso'],
      factors: ['contradiccion'],
      match: { planetPairs: [['marte', 'jupiter'], ['jupiter', 'marte']] },
      sources: [src('DOC-6', '§1.3 Marte + Júpiter')],
      text: 'Puede haber expansión real con un precio de ritmo acelerado: crecimiento y exigencia física o competitiva conviven en el mismo escenario.'
    },
    {
      id: 'doc6_intensidad_linea_exacta',
      slot: 'synthesis',
      stage: 'observar',
      goals: ['any'],
      themes: ['intensidad'],
      factors: ['intensidad'],
      match: { maxDistKm: 80 },
      sources: [src('DOC-6', '§1.5 Línea exacta / Fase 3 escala')],
      text: 'Muy cerca del trazo la experiencia puede ser intensa y poco filtrada — útil si ya sabes canalizar esa energía; si no, conviene moderar expectativas y ritmo.'
    },
    {
      id: 'doc6_intensidad_linea_cercana',
      slot: 'synthesis',
      stage: 'observar',
      goals: ['any'],
      themes: ['intensidad', 'sostenibilidad'],
      factors: ['intensidad'],
      match: { minDistKm: 200 },
      sources: [src('DOC-6', '§1.2 Línea cercana sostenible')],
      text: 'La señal es notable pero no máxima: el lugar habla claro sin exigir dominar la energía al primer día — más sostenible para una estancia media.'
    },
    {
      id: 'doc6_objetivo_amor_dc_venus',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['amor'],
      themes: ['vínculo', 'prioridad'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.4 Amor y Relaciones')],
      text: 'Con foco en amor, conviene priorizar el encuentro y el acuerdo (eje de pareja) y la coherencia emocional previa — el lugar no rellena vacío desde fuera.'
    },
    {
      id: 'doc6_objetivo_trabajo_mc',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['trabajo'],
      themes: ['trayectoria', 'visibilidad'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.4 Trabajo y Crecimiento')],
      text: 'Con foco en trabajo, la trayectoria y la visibilidad pública pesan más: define qué quieres que se vea de tu esfuerzo antes de medir el lugar solo por sensación.'
    },
    {
      id: 'doc6_objetivo_descanso_ic',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['descanso'],
      themes: ['hogar', 'ritmo'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.4 Descanso y Estabilidad')],
      text: 'Con foco en descanso, importan la raíz y el ritmo corporal: permiso para bajar exigencia sin convertir la pausa en otro tipo de rendimiento.'
    },
    {
      id: 'doc6_conclusion_alineacion',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['any'],
      themes: ['cierre', 'responsabilidad'],
      factors: ['adaptacion'],
      sources: [src('DOC-6', '§1.6 Conclusión del sistema')],
      text: '{ciudad} no clasifica como destino “bueno” o “malo”: se lee como más o menos alineado con lo que necesitas aprender ahora — el entorno ofrece escenario, tú eliges gestos.'
    },
    {
      id: 'doc17_max_dos_profundas',
      slot: 'synthesis',
      stage: 'integrar',
      goals: ['any'],
      themes: ['combinación', 'límite'],
      factors: ['contradiccion'],
      match: { minInfluences: 2 },
      sources: [src('DOC-17', '§13 Reglas de combinación')],
      text: 'En profundidad conviene sostener como mucho dos capas a la vez; el resto aporta matiz sin abrir demasiados frentes en una sola lectura.'
    },
    {
      id: 'doc5_metodologia_promesa_natal',
      slot: 'context',
      stage: 'integrar',
      goals: ['any'],
      themes: ['metodología'],
      factors: ['adaptacion'],
      sources: [src('DOC-5', 'Metodología — Promesa Natal')],
      text: 'Una lectura madura mira primero qué traes desde casa y después cómo el mapa del lugar reorganiza esas mismas energías — nunca la línea aislada.'
    },
    {
      id: 'doc5_multiples_influencias',
      slot: 'context',
      stage: 'integrar',
      goals: ['any'],
      themes: ['ecosistema', 'lugar complejo'],
      factors: ['contradiccion'],
      match: { minInfluences: 2 },
      sources: [src('DOC-5', '§6 Lugares complejos')],
      text: 'Cuando varias señales convergen, el lugar funciona como ecosistema: no es una sola nota, es un clima que pide lectura integrada.'
    },
    {
      id: 'doc5_visita_corta',
      slot: 'context',
      stage: 'observar',
      goals: ['any'],
      themes: ['duración', 'visita'],
      factors: ['duracion'],
      match: { duration: 'short' },
      sources: [src('DOC-5', '§7 Viajes — visita')],
      text: 'En una visita breve conviene observar impresiones corporales y primeras reacciones: qué sube de volumen en ti en las primeras 48–72 horas.'
    },
    {
      id: 'doc5_permanencia_gestion',
      slot: 'context',
      stage: 'observar',
      goals: ['any'],
      themes: ['permanencia', 'gestión'],
      factors: ['permanencia', 'duracion'],
      match: { duration: 'long' },
      sources: [src('DOC-5', '§7 Mudanza / permanente')],
      text: 'Si permaneces, el lugar deja de ser escaparate y pasa a hábito: observa si los mismos patrones se sostienen o si aparece cansancio de sostener el ritmo.'
    },
    {
      id: 'doc5_no_pildora_magica',
      slot: 'context',
      stage: 'desafia',
      goals: ['any'],
      themes: ['expectativa'],
      factors: ['adaptacion'],
      sources: [src('DOC-5', 'Errores — píldora mágica')],
      text: 'El lugar no sustituye entregables ni vínculo trabajado: amplifica tendencias — si no hay sustancia o cuidado propio, la ampliación también puede doler.'
    },
    {
      id: 'doc7_linea_vs_reloc',
      slot: 'reloc',
      stage: 'integrar',
      goals: ['any'],
      themes: ['relocación', 'astrocartografía'],
      factors: ['adaptacion'],
      match: { requiresRelocation: true },
      sources: [src('DOC-7', '§2 Diferencias AC — índice vs capítulo')],
      text: 'La línea señala el impulso principal del territorio; la carta relocada describe cómo se reparte ese impulso en el resto de áreas vitales — conviene leer ambos planos.'
    },
    {
      id: 'doc7_angulo_ac_identidad',
      slot: 'reloc',
      stage: 'favorece',
      goals: ['any'],
      themes: ['identidad', 'presencia'],
      match: { requiresRelocation: true, relocAngles: ['AC'] },
      sources: [src('DOC-7', '§1.3 Ascendente')],
      text: 'Con el ascendente relocado activo, la experiencia puede girar en torno a cómo te muestras y cómo te perciben al llegar — identidad en primer plano.'
    },
    {
      id: 'doc7_angulo_mc_trayectoria',
      slot: 'reloc',
      stage: 'favorece',
      goals: ['trabajo'],
      themes: ['trayectoria', 'reputación'],
      match: { requiresRelocation: true, relocAngles: ['MC'] },
      sources: [src('DOC-7', '§1.3 Medio Cielo')],
      text: 'Con el medio cielo relocado en juego, la trayectoria y la imagen pública pueden volverse más legibles — útil si tu foco es trabajo con sentido visible.'
    },
    {
      id: 'doc7_angulo_ic_hogar',
      slot: 'reloc',
      stage: 'favorece',
      goals: ['descanso'],
      themes: ['hogar', 'raíz'],
      match: { requiresRelocation: true, relocAngles: ['IC'] },
      sources: [src('DOC-7', '§1.3 Fondo del Cielo')],
      text: 'Con el fondo del cielo relocado activo, la vida privada y el ritmo de hogar pesan más: descanso real suele pasar por cómo habitas el espacio íntimo.'
    },
    {
      id: 'doc7_angulo_dc_vinculo',
      slot: 'reloc',
      stage: 'favorece',
      goals: ['amor'],
      themes: ['vínculo', 'encuentro'],
      match: { requiresRelocation: true, relocAngles: ['DC'] },
      sources: [src('DOC-7', '§1.3 Descendente')],
      text: 'Con el descendente relocado activo, el encuentro y el acuerdo con el otro pueden marcar la experiencia — el vínculo se vuelve espejo más nítido.'
    },
    {
      id: 'doc7_combinar_macro_micro',
      slot: 'reloc',
      stage: 'integrar',
      goals: ['any'],
      themes: ['integración', 'relocación'],
      match: { requiresRelocation: true },
      sources: [src('DOC-7', '§8 Cómo combinarlas')],
      text: 'Primero el mapa de líneas (qué tema domina) y después el mapa relocado (cómo vives ese tema en lo cotidiano) — así se evita idealizar solo la “fachada” del lugar.'
    }
  ];

  /**
   * Piloto DOC-17 — texto transformado (no copia literal).
   * goals: array de ids GoalSignal | 'any'
   */
  var DOC17_PILOT = {
    VENUS_AC: {
      planet: 'venus',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['amor', 'descanso'],
          themes: ['estética', 'disfrute', 'presencia'],
          sources: [src('DOC-17', 'VENUS AC [I] T1')],
          text: 'En {ciudad} la estética del entorno puede resultarte familiar: luz, ritmo y detalle sin esfuerzo de adaptación — el cuerpo registra placer antes que explicación.'
        },
        t2: {
          goals: ['amor', 'descanso'],
          themes: ['valor propio', 'placer'],
          sources: [src('DOC-17', 'VENUS AC [I] T2')],
          text: 'Puede activarse el disfrute sin culpa y un magnetismo tranquilo: invertir en ti mismo aquí se siente más natural que performar.'
        },
        t3: {
          goals: ['amor', 'descanso'],
          themes: ['vínculo', 'bienestar'],
          sources: [src('DOC-17', 'VENUS AC [I] T3')],
          text: 'Para descanso o amor, el lugar favorece encuentros con química sin teatro — la condición es trato propio coherente antes de buscar validación afuera.'
        },
        t4: {
          goals: ['amor', 'descanso'],
          themes: ['acción', 'placer'],
          sources: [src('DOC-17', 'VENUS AC [I] T4')],
          text: 'Prueba un gesto puramente placentero sin rendimiento: comida lenta, paseo estético, cuidado visible de ti mismo.'
        }
      },
      shadow: {
        t1: {
          goals: ['amor'],
          themes: ['contraste', 'soledad'],
          sources: [src('DOC-17', 'VENUS AC [S] T1')],
          text: 'Puede aparecer contraste doloroso: parejas ajenas felices mientras tú sientes distancia — el entorno muestra hueco, no lo inventa.'
        },
        t2: {
          goals: ['amor'],
          themes: ['amor propio', 'vacío'],
          sources: [src('DOC-17', 'VENUS AC [S] T2')],
          text: 'La distancia con lo que buscas puede estar más en cómo te relacionas contigo que en la geografía — el lugar acentúa ese espejo.'
        },
        t3: {
          goals: ['amor'],
          themes: ['condición', 'llenado'],
          sources: [src('DOC-17', 'VENUS AC [S] T3')],
          text: 'No suele regalar amor desde el vacío; sí puede dar espacio para empezar a llenarte desde dentro — la condición es honestidad emocional.'
        },
        t4: {
          goals: ['amor'],
          themes: ['acción', 'autocuidado'],
          sources: [src('DOC-17', 'VENUS AC [S] T4')],
          text: 'Escribe tres gestos que te darías con cariño real y cumple uno esta semana en {ciudad}.'
        }
      }
    },
    SATURNO_AC: {
      planet: 'saturno',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['trabajo', 'descanso'],
          themes: ['peso', 'estructura'],
          sources: [src('DOC-17', 'SATURNO AC [I] T1')],
          text: 'En {ciudad} las cosas pueden costar un poco más de lo esperado: retrasos, trámites, sensación de que la vida pide orden.'
        },
        t2: {
          goals: ['trabajo'],
          themes: ['compromiso', 'madurez'],
          sources: [src('DOC-17', 'SATURNO AC [I] T2')],
          text: 'El lugar favorece construir a largo plazo lo que vale la pena — no es escenario de placer fácil, sí de cimiento.'
        },
        t3: {
          goals: ['trabajo', 'amor'],
          themes: ['paciencia', 'condición'],
          sources: [src('DOC-17', 'SATURNO AC [I] T3')],
          text: 'Si lo que buscas requiere tiempo y disciplina, aquí puede encajar — la condición es llegar sin exigir resultados inmediatos.'
        },
        t4: {
          goals: ['trabajo', 'amor'],
          themes: ['acción', 'compromiso'],
          sources: [src('DOC-17', 'SATURNO AC [I] T4')],
          text: 'Antes de llegar, define qué estás dispuesto a construir con paciencia — un acuerdo claro o un trámite concreto.'
        }
      },
      shadow: {
        t2: {
          goals: ['trabajo', 'amor'],
          themes: ['autoridad', 'control'],
          sources: [src('DOC-17', 'SATURNO AC [S] T2')],
          text: 'Puede activarse la relación con la responsabilidad y la autoridad: si delegas demasiado el control, el entorno exige que asumas más liderazgo propio.'
        },
        t3: {
          goals: ['amor', 'trabajo'],
          themes: ['fricción', 'decisión'],
          sources: [src('DOC-17', 'SATURNO AC [S] T3')],
          text: 'La fricción no es personal: es invitación a tomar una decisión que postergas — en vínculo o en trabajo.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción'],
          sources: [src('DOC-17', 'SATURNO AC [S] T4')],
          text: 'Identifica una decisión pendiente y tómala con calendario real mientras estés en {ciudad}.'
        }
      }
    },
    MARTE_AC: {
      planet: 'marte',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['trabajo', 'descanso'],
          themes: ['cuerpo', 'ritmo', 'impulso'],
          sources: [src('DOC-17', 'MARTE AC [I] T1')],
          text: 'En {ciudad} el cuerpo puede acelerarse: más urgencia, menos tolerancia a la lentitud — caminas y decides con más filo.'
        },
        t2: {
          goals: ['trabajo'],
          themes: ['asertividad', 'competencia'],
          sources: [src('DOC-17', 'MARTE AC [I] T2')],
          text: 'Puede inyectarse coraje para decir lo que piensas y también más reactividad — el entorno premia el movimiento directo.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['inicio', 'canalización'],
          sources: [src('DOC-17', 'MARTE AC [I] T3')],
          text: 'Si tienes algo que iniciar, la energía está disponible — la condición es darle diana; sin objetivo, puede volverse irritación.'
        },
        t4: {
          goals: ['trabajo', 'descanso'],
          themes: ['acción', 'cuerpo'],
          sources: [src('DOC-17', 'MARTE AC [I] T4')],
          text: 'Incluye descarga física diaria (caminata fuerte, deporte breve) como higiene, no como castigo.'
        }
      }
    },
    LUNA_AC: {
      planet: 'luna',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['amor', 'descanso'],
          themes: ['permeabilidad', 'sensorial'],
          sources: [src('DOC-17', 'LUNA AC [I] T1')],
          text: 'En {ciudad} las defensas pueden bajar pronto: olores, ritmo y temperatura del aire llegan con más nitidez emocional.'
        },
        t2: {
          goals: ['amor', 'descanso'],
          themes: ['pertenencia', 'cuidado'],
          sources: [src('DOC-17', 'LUNA AC [I] T2')],
          text: 'Puede activarse el instinto de pertenencia — sensación de encajar sin ganarte el espacio a fuerza.'
        },
        t3: {
          goals: ['amor', 'descanso'],
          themes: ['apertura', 'sanación'],
          sources: [src('DOC-17', 'LUNA AC [I] T3')],
          text: 'La apertura emocional es el activo principal: conectar, descansar o sanar lo que en casa no tiene hueco — si lo permites.'
        },
        t4: {
          goals: ['descanso'],
          themes: ['acción', 'presencia'],
          sources: [src('DOC-17', 'LUNA AC [I] T4')],
          text: 'Permite que la ciudad te afecte sin sobre-explicar cada sensación — presencia antes que análisis.'
        }
      }
    },
    MERCURIO_AC: {
      planet: 'mercurio',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['trabajo', 'descanso'],
          themes: ['mente', 'curiosidad'],
          sources: [src('DOC-17', 'MERCURIO AC [I] T1')],
          text: 'En {ciudad} la mente puede sentirse más ágil: saltos entre ideas, conversación fluida, curiosidad activa.'
        },
        t2: {
          goals: ['trabajo'],
          themes: ['comunicación', 'análisis'],
          sources: [src('DOC-17', 'MERCURIO AC [I] T2')],
          text: 'El lugar favorece escuchar perspectivas nuevas y expresar con más soltura — útil para aprender o crear.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['estudio', 'condición'],
          sources: [src('DOC-17', 'MERCURIO AC [I] T3')],
          text: 'Ideal para escribir, estudiar o proyectos de claridad mental — la condición es dar salida al movimiento mental; si no, puede ansiedad.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción', 'escritura'],
          sources: [src('DOC-17', 'MERCURIO AC [I] T4')],
          text: 'Escribe o registra una idea al día — el exceso mental necesita canal.'
        }
      }
    },
    MARTE_MC: {
      planet: 'marte',
      angle: 'MC',
      integrated: {
        t1: {
          goals: ['trabajo'],
          themes: ['urgencia', 'ejecución'],
          sources: [src('DOC-17', 'MARTE MC [I] T1')],
          text: 'En {ciudad} el trabajo puede ganar urgencia: sensación de que las cosas deben moverse ya, no solo planificarse.'
        },
        t2: {
          goals: ['trabajo'],
          themes: ['liderazgo', 'decisión'],
          sources: [src('DOC-17', 'MARTE MC [I] T2')],
          text: 'Puede activarse liderazgo activo y decisiones rápidas — menos parálisis, más ejecución visible.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['oficio', 'condición'],
          sources: [src('DOC-17', 'MARTE MC [I] T3')],
          text: 'Favorece oficios de acción directa — la condición es no quemar puentes mientras aceleras.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción', 'meta'],
          sources: [src('DOC-17', 'MARTE MC [I] T4')],
          text: 'Define una meta medible para la estancia; el impulso necesita diana.'
        }
      }
    },
    LUNA_IC: {
      planet: 'luna',
      angle: 'IC',
      integrated: {
        t1: {
          goals: ['descanso'],
          themes: ['hogar', 'calidez'],
          sources: [src('DOC-17', 'LUNA IC [I] T1')],
          text: 'En {ciudad} puede aparecer calidez de hogar sin ser tu casa: sensación de refugio que no pide explicación.'
        },
        t2: {
          goals: ['descanso', 'amor'],
          themes: ['raíz', 'seguridad'],
          sources: [src('DOC-17', 'LUNA IC [I] T2')],
          text: 'Activa raíz y pertenencia profunda — nutrición emocional más que escaparate social.'
        },
        t3: {
          goals: ['descanso'],
          themes: ['reposo', 'condición'],
          sources: [src('DOC-17', 'LUNA IC [I] T3')],
          text: 'Si necesitas reponer energía o recordar quién eres debajo del rol, el lugar puede sostener — si aceptas ser cuidado.'
        },
        t4: {
          goals: ['descanso'],
          themes: ['acción', 'cuidado'],
          sources: [src('DOC-17', 'LUNA IC [I] T4')],
          text: 'Come local, duerme bien, camina sin destino fijo — deja que el lugar te cuide unos días.'
        }
      }
    },
    VENUS_DC: {
      planet: 'venus',
      angle: 'DC',
      integrated: {
        t1: {
          goals: ['amor'],
          themes: ['encuentro', 'pareja'],
          sources: [src('DOC-17', 'VENUS DC [I] T1')],
          text: 'En {ciudad} el vínculo puede volverse más visible: encuentros, acuerdos y química en el plano del otro.'
        },
        t2: {
          goals: ['amor'],
          themes: ['reciprocidad', 'armonía'],
          sources: [src('DOC-17', 'VENUS DC [I] T2')],
          text: 'El lugar favorece negociar gusto y cuidado mutuo — menos máscara, más acuerdo explícito.'
        },
        t3: {
          goals: ['amor'],
          themes: ['relación', 'condición'],
          sources: [src('DOC-17', 'VENUS DC [I] T3')],
          text: 'Puede profundizar relaciones existentes o abrir nuevas — la condición es claridad sobre qué ofreces y qué pides.'
        },
        t4: {
          goals: ['amor'],
          themes: ['acción', 'vínculo'],
          sources: [src('DOC-17', 'VENUS DC [I] T4')],
          text: 'Si hay interés, propón tiempo y espacio concreto — el vínculo aquí crece con gestos repetidos.'
        }
      }
    },
    SOL_AC: {
      planet: 'sol',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['trabajo', 'amor'],
          themes: ['presencia', 'visibilidad'],
          sources: [src('DOC-17', 'SOL AC [I] T1')],
          text: 'En {ciudad} tu presencia puede pesar más: te ven antes de explicarte — la autenticidad abre puertas si no te encoges.'
        },
        t2: {
          goals: ['trabajo', 'amor'],
          themes: ['autenticidad', 'brillo'],
          sources: [src('DOC-17', 'SOL AC [I] T2')],
          text: 'Activa necesidad de ser reconocido por quien eres, no solo por tu rol — el permiso para ocupar espacio es el tema.'
        },
        t3: {
          goals: ['amor', 'trabajo'],
          themes: ['coherencia', 'condición'],
          sources: [src('DOC-17', 'SOL AC [I] T3')],
          text: 'Favorece lograr el foco siendo coherente, no performando — la condición es no esconderte por miedo al juicio.'
        },
        t4: {
          goals: ['amor', 'trabajo'],
          themes: ['acción', 'presencia'],
          sources: [src('DOC-17', 'SOL AC [I] T4')],
          text: 'Haz una cosa al día que pospondrías por vergüenza de ser visto — pequeña y real.'
        }
      }
    },
    JUPITER_AC: {
      planet: 'jupiter',
      angle: 'AC',
      integrated: {
        t1: {
          goals: ['trabajo', 'descanso'],
          themes: ['expansión', 'optimismo'],
          sources: [src('DOC-17', 'JÚPITER AC [I] T1')],
          text: 'En {ciudad} lo posible puede sentirse más amplio: metas que en casa parecían lejanas aquí parecen alcanzables con pasos.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['oportunidad', 'condición'],
          sources: [src('DOC-17', 'JÚPITER AC [I] T3')],
          text: 'Puede facilitar que lo que pides llegue con menos fricción — la condición es pedir cosas reales y actuar en esa dirección.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción', 'ambición'],
          sources: [src('DOC-17', 'JÚPITER AC [I] T4')],
          text: 'Da un paso que normalmente te parecería demasiado ambicioso — medido, con fecha.'
        }
      }
    },
    MERCURIO_MC: {
      planet: 'mercurio',
      angle: 'MC',
      integrated: {
        t1: {
          goals: ['trabajo'],
          themes: ['voz', 'inteligencia'],
          sources: [src('DOC-17', 'MERCURIO MC [I] T1')],
          text: 'En {ciudad} tu forma de pensar y comunicar puede tener más peso profesional — claridad que abre puertas.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['oficio', 'condición'],
          sources: [src('DOC-17', 'MERCURIO MC [I] T3')],
          text: 'Favorece trabajos donde las palabras son el producto — la condición es tener algo real que decir.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción', 'contenido'],
          sources: [src('DOC-17', 'MERCURIO MC [I] T4')],
          text: 'Publica o comparte un entregable pequeño mientras estés aquí — el lugar amplifica la voz.'
        }
      }
    },
    SATURNO_IC: {
      planet: 'saturno',
      angle: 'IC',
      integrated: {
        t2: {
          goals: ['trabajo', 'descanso'],
          themes: ['raíz', 'peso'],
          sources: [src('DOC-17', 'SATURNO IC — DOC-5/6 raíz')],
          text: 'En lo íntimo y familiar puede aparecer peso o deber: ordenar lo heredado, trámites de raíz, sensación de carga.'
        },
        t3: {
          goals: ['trabajo'],
          themes: ['estructura', 'condición'],
          sources: [src('DOC-17', 'SATURNO — estructura IC')],
          text: 'Favorece trabajo de fondo con documentación — la condición es paciencia con procesos lentos.'
        },
        t4: {
          goals: ['trabajo'],
          themes: ['acción', 'orden'],
          sources: [src('DOC-5', 'Saturno — orden raíz')],
          text: 'Un trámite hoy, otro mañana: el orden reduce ansiedad de raíz.'
        }
      }
    }
  };

  function slotToStage(slot) {
    var map = TAXONOMY.slots;
    return map[slot] ? map[slot].mapsToStage : 'integrar';
  }

  function buildDoc17Blocks() {
    var out = [];
    Object.keys(DOC17_PILOT).forEach(function (interpKey) {
      var combo = DOC17_PILOT[interpKey];
      ['integrated', 'shadow'].forEach(function (state) {
        var pack = combo[state];
        if (!pack) return;
        Object.keys(pack).forEach(function (slot) {
          var item = pack[slot];
          var id = 'doc17_' + interpKey.toLowerCase() + '_' + slot + '_' + state;
          out.push({
            id: id,
            slot: slot,
            stage: slotToStage(slot),
            goals: item.goals,
            integration: state === 'integrated' ? 'integrated' : 'shadow',
            planet: combo.planet,
            angle: combo.angle,
            interpKey: interpKey,
            themes: item.themes,
            factors: [],
            sources: item.sources,
            text: item.text
          });
        });
      });
    });
    return out;
  }

  var BLOCKS = SYNTHESIS_BLOCKS.concat(buildDoc17Blocks());

  function buildIndexes(blocks) {
    var byId = {};
    var byInterpKey = {};
    var byGoal = { amor: [], trabajo: [], descanso: [], any: [] };
    var byStage = {};
    var byDoc = { 'DOC-17': 0, 'DOC-6': 0, 'DOC-5': 0, 'DOC-7': 0 };

    TAXONOMY.stages.forEach(function (s) { byStage[s] = []; });

    blocks.forEach(function (b) {
      byId[b.id] = b;
      (b.goals || ['any']).forEach(function (g) {
        if (byGoal[g]) byGoal[g].push(b.id);
        if (g !== 'any') byGoal.any.push(b.id);
      });
      if (byStage[b.stage]) byStage[b.stage].push(b.id);
      if (b.interpKey) {
        if (!byInterpKey[b.interpKey]) byInterpKey[b.interpKey] = [];
        byInterpKey[b.interpKey].push(b.id);
      }
      (b.sources || []).forEach(function (s) {
        if (byDoc[s.doc] != null) byDoc[s.doc] += 1;
      });
    });

    return { byId: byId, byInterpKey: byInterpKey, byGoal: byGoal, byStage: byStage, byDoc: byDoc };
  }

  var INDEX = buildIndexes(BLOCKS);

  window.KairosPremiumBlocks = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    TAXONOMY: TAXONOMY,
    BLOCKS: BLOCKS,
    INDEX: INDEX,
    DOC17_PILOT_KEYS: Object.keys(DOC17_PILOT),
    catalog: function () {
      return {
        schemaVersion: SCHEMA_VERSION,
        totalBlocks: BLOCKS.length,
        byDoc: INDEX.byDoc,
        byStage: Object.keys(INDEX.byStage).reduce(function (acc, k) {
          acc[k] = INDEX.byStage[k].length;
          return acc;
        }, {}),
        byGoal: Object.keys(INDEX.byGoal).reduce(function (acc, k) {
          acc[k] = INDEX.byGoal[k].length;
          return acc;
        }, {}),
        pilotCombos: Object.keys(DOC17_PILOT).length
      };
    }
  };
})();
