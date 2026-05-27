/**
 * KAIROS MAPS — Natal Lite content layer (Fase 3.3 scaffold)
 *
 * Capa de contenido interpretativo FREE para carta natal.
 * NO textos de producción. NO render. NO IA.
 *
 * Contrato: docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md
 * Voz: docs/voice_tone.txt
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.3.0-pilot';

  /** Signos en español — alineados con kairos-core / natal-panel.js */
  var SIGNS_ES = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  var SIGN_SLUG_BY_NAME = {
    Aries: 'aries',
    Tauro: 'taurus',
    'Géminis': 'gemini',
    'Cáncer': 'cancer',
    Leo: 'leo',
    Virgo: 'virgo',
    Libra: 'libra',
    Escorpio: 'scorpio',
    Sagitario: 'sagittarius',
    Capricornio: 'capricorn',
    Acuario: 'aquarius',
    Piscis: 'pisces'
  };

  var FREE_PLANETS = [
    'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'
  ];

  var ANGLES = ['ASC', 'MC'];

  /** Slugs zodiacales canónicos (12 signos) — alineados con natal-panel / compositor */
  var ZODIAC_SLUGS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  var LITE_READING_ROLES = [
    { role: 'SUN', inputKey: 'sun' },
    { role: 'MOON', inputKey: 'moon' },
    { role: 'ASC', inputKey: 'asc' }
  ];

  /**
   * Registro plano de fragmentos por id.
   * Forma objetivo (v0.1):
   *
   * {
   *   id: 'SUN_GEMINI',
   *   planet: 'SUN',
   *   sign: 'Géminis',
   *   tier: 'free',
   *   version: '1.0.0',
   *   headline: '...',
   *   body: '...',
   *   bridge: null,
   *   semanticTags: [],
   *   bridgeTags: [],
   *   source: 'voice_tone'
   * }
   */
  var FRAGMENTS = {
    SUN_ARIES: {
      id: 'SUN_ARIES',
      planet: 'SUN',
      sign: 'Aries',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Una vitalidad que prefiere empezar antes que esperar el momento perfecto.',
      body: 'Esta posición puede activar una forma directa de iniciar procesos, con más urgencia por moverte que por planificar. No siempre es impaciencia: a veces es comprobar por ti mismo qué encaja. Cuando algo te importa, la energía tiende a salir al momento.',
      bridge: 'En el mapa, ciertas líneas pueden intensificar esa sensación de arrancar o de tomar la iniciativa en un lugar concreto.',
      semanticTags: ['initiative', 'movement', 'visibility'],
      bridgeTags: ['initiative', 'movement', 'visibility'],
      source: 'voice_tone'
    },
    SUN_GEMINI: {
      id: 'SUN_GEMINI',
      planet: 'SUN',
      sign: 'Géminis',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Identidad que se aclara hablando, preguntando y probando ideas.',
      body: 'La expresión vital puede pasar por la curiosidad y el intercambio: nombrar lo que piensas a veces ordena lo que te mueve. Puede costarte quedarte en un solo rol cuando hay varias preguntas abiertas. La flexibilidad aquí no es superficialidad; es una forma de encontrar dirección.',
      bridge: 'Al explorar ciudades en el mapa, observa si el entorno te pide más conversación, estudio o circulación de ideas.',
      semanticTags: ['communication', 'stimulation', 'reflection'],
      bridgeTags: ['communication', 'stimulation', 'movement'],
      source: 'voice_tone'
    },
    SUN_CANCER: {
      id: 'SUN_CANCER',
      planet: 'SUN',
      sign: 'Cáncer',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Vitalidad ligada al cuidado, la pertenencia y lo que proteges.',
      body: 'Esta configuración puede acercar tu sentido de propósito a lo íntimo: vínculos, espacios donde te sientes seguro, lo que eliges sostener. A veces la dirección aparece cuidando algo, no solo persiguiendo metas visibles. Reconocer qué necesitas para sentirte en casa puede orientar decisiones grandes.',
      bridge: 'En el mapa, los lugares que activan temas de raíz o hogar pueden resonar distinto con esta energía.',
      semanticTags: ['belonging', 'intimacy', 'emotional_safety'],
      bridgeTags: ['belonging', 'intimacy', 'emotional_safety'],
      source: 'voice_tone'
    },
    MOON_ARIES: {
      id: 'MOON_ARIES',
      planet: 'MOON',
      sign: 'Aries',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Emociones que llegan rápido y piden respuesta inmediata.',
      body: 'La sensibilidad puede activarse con poca demora: lo que sientes aparece antes de que lo racionalices. Eso no invalida la emoción; señala, muchas veces, lo que te importa ahora. Lo inmediato no siempre indica prioridad: conviene observar qué permanece.',
      bridge: 'Al comparar ciudades, fíjate dónde la vida cotidiana exige más reacción rápida o más espacio para desahogarte.',
      semanticTags: ['regulation', 'movement', 'initiative'],
      bridgeTags: ['movement', 'regulation', 'initiative'],
      tensionTags: ['initiative', 'regulation'],
      source: 'voice_tone'
    },
    MOON_GEMINI: {
      id: 'MOON_GEMINI',
      planet: 'MOON',
      sign: 'Géminis',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Necesidad emocional de variedad, conversación y movimiento interno.',
      body: 'Puede aparecer inquietud cuando la rutina afectiva se repite demasiado; mente y emoción suelen ir juntos. Nombrar lo que sientes — incluso por escrito — a veces alivia más que esperar a tenerlo claro. La intimidad aquí no siempre es silencio; puede ser complicidad compartida.',
      bridge: 'Ciudades con ritmo mental alto en el mapa pueden amplificar esa búsqueda de estímulo y conexión ligera.',
      semanticTags: ['communication', 'stimulation', 'intimacy'],
      bridgeTags: ['stimulation', 'communication', 'movement'],
      source: 'voice_tone'
    },
    MOON_CANCER: {
      id: 'MOON_CANCER',
      planet: 'MOON',
      sign: 'Cáncer',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Sensibilidad orientada al refugio, la memoria y los vínculos cercanos.',
      body: 'Puedes notar mayor necesidad de seguridad emocional cuando el entorno se siente frío o impersona. Lo familiar — lugares, personas, rutinas — a menudo regula más de lo que parece. Cuidar tus límites no es exigencia: es condición para sostener sin vaciarte.',
      bridge: 'En el mapa, los entornos que activan temas de hogar o intimidad pueden sentirse más acogedores o más exigentes según el momento vital.',
      semanticTags: ['emotional_safety', 'belonging', 'intimacy'],
      bridgeTags: ['emotional_safety', 'belonging', 'intimacy'],
      source: 'voice_tone'
    },
    ASC_LIBRA: {
      id: 'ASC_LIBRA',
      planet: 'ASC',
      sign: 'Libra',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Manera de entrar al mundo buscando equilibrio y reciprocidad.',
      body: 'Puede notarse una tendencia a leer el ambiente antes de mostrarte del todo. La primera impresión suele cuidar el tono y la distancia justa. Cuando hay fairness, la apertura fluye con menos fricción.',
      bridge: 'Ciudades donde la vida social circula con fluidez pueden resultarte más naturales al explorar el mapa.',
      semanticTags: ['harmony', 'communication', 'reflection'],
      bridgeTags: ['harmony', 'communication', 'reflection'],
      source: 'voice_tone'
    },
    ASC_CANCER: {
      id: 'ASC_CANCER',
      planet: 'ASC',
      sign: 'Cáncer',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Presencia que protege antes de exponerse.',
      body: 'El contacto con lo nuevo puede pasar por comprobar si hay seguridad. Cuando el entorno se siente acogedor, la apertura llega con más facilidad. Sin contención, la retracción no es frialdad: es lectura del entorno.',
      bridge: 'Lugares con ritmo pausado y vínculos cercanos pueden encajar mejor con esta forma de relacionarte en el mapa.',
      semanticTags: ['emotional_safety', 'protection', 'intimacy'],
      bridgeTags: ['emotional_safety', 'belonging', 'intimacy'],
      source: 'voice_tone'
    },
    ASC_GEMINI: {
      id: 'ASC_GEMINI',
      planet: 'ASC',
      sign: 'Géminis',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Entrada al mundo curiosa, conversacional, alerta.',
      body: 'Quedarte en silencio cuando el entorno pide intercambio no siempre encaja contigo. La primera impresión suele ser ligera, móvil, interesada. El aburrimiento aquí se nota pronto: necesitas estímulo para sentirte presente.',
      bridge: 'Entornos con estímulo mental y variedad pueden sentirse más habitables al revisar ciudades en el mapa.',
      semanticTags: ['communication', 'stimulation', 'movement'],
      bridgeTags: ['stimulation', 'communication', 'movement'],
      source: 'voice_tone'
    },
    ASC_ARIES: {
      id: 'ASC_ARIES',
      planet: 'ASC',
      sign: 'Aries',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Manera de entrar al mundo directa, rápida, sin rodeos.',
      body: 'La primera impresión suele ser clara: apareces, te posicionas, respondes al momento. Esperar demasiado para mostrarte puede generar incomodidad. Cuando el entorno responde con la misma franqueza, la apertura llega sin filtros innecesarios.',
      bridge: 'En el mapa, lugares donde el ritmo pide iniciativa pueden sentirse más naturales — o más exigentes — según el momento.',
      semanticTags: ['initiative', 'movement', 'visibility'],
      bridgeTags: ['initiative', 'movement', 'visibility'],
      source: 'voice_tone'
    },
    ASC_LEO: {
      id: 'ASC_LEO',
      planet: 'ASC',
      sign: 'Leo',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Presencia cálida que busca ser recibida con atención genuina.',
      body: 'Entrar en un espacio puede implicar comprobar si hay reconocimiento, no solo cortesía. Sin calidez real, la reserva puede confundirse con orgullo. Cuando te sientes vista, la generosidad aparece con más facilidad.',
      bridge: 'Ciudades visibles o creativas en el mapa pueden amplificar tu necesidad de brillo compartido — también de competir por espacio.',
      semanticTags: ['visibility', 'initiative', 'intimacy'],
      bridgeTags: ['visibility', 'initiative', 'intimacy'],
      tensionTags: ['visibility', 'initiative'],
      source: 'voice_tone'
    },
    ASC_AQUARIUS: {
      id: 'ASC_AQUARIUS',
      planet: 'ASC',
      sign: 'Acuario',
      tier: 'free',
      version: '1.0.0-pilot-placeholder',
      headline: 'Manera de entrar al mundo observando, a tu manera, un paso aparte.',
      body: 'Antes de integrarte, sueles leer el grupo: qué se espera, qué conviene, qué no encaja contigo. La primera impresión puede ser cordial pero no complaciente. Preferir autenticidad a encaje inmediato no siempre se lee como frialdad.',
      bridge: 'Entornos abiertos o poco convencionales en el mapa pueden resultarte más habitables que los que piden uniformidad.',
      semanticTags: ['reflection', 'movement', 'regulation'],
      bridgeTags: ['reflection', 'movement', 'stimulation'],
      source: 'voice_tone'
    },
    SUN_CAPRICORN: {
      id: 'SUN_CAPRICORN',
      planet: 'SUN',
      sign: 'Capricornio',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Vitalidad que construye con paciencia, límite y sentido de responsabilidad.',
      body: 'El propósito aquí se orienta hacia lo que se sostiene en el tiempo: estructura, mérito, deber asumido. La frialdad no siempre está ahí; muchas veces hay prudencia antes de exponerse. Surge fricción cuando lo emocional pide respuesta ya y tú prefieres medir antes de moverte.',
      bridge: 'En el mapa, entornos exigentes o de ritmo lento pueden confirmar o tensionar tu necesidad de solidez.',
      semanticTags: ['control', 'regulation', 'visibility'],
      bridgeTags: ['control', 'regulation', 'reflection'],
      tensionTags: ['control', 'regulation'],
      source: 'voice_tone'
    },
    SUN_VIRGO: {
      id: 'SUN_VIRGO',
      planet: 'SUN',
      sign: 'Virgo',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Vitalidad que busca utilidad, coherencia y mejora concreta.',
      body: 'El propósito pasa por ordenar, depurar, hacer bien lo que importa. Aparece autocrítica cuando el resultado no alcanza el estándar interno. La dirección aquí no es espectacular; es confiable.',
      bridge: 'Ciudades ordenadas o funcionales en el mapa pueden activar esa necesidad de claridad y servicio.',
      semanticTags: ['precision', 'regulation', 'reflection'],
      bridgeTags: ['precision', 'regulation', 'reflection'],
      tensionTags: ['precision', 'regulation'],
      source: 'voice_tone'
    },
    SUN_LEO: {
      id: 'SUN_LEO',
      planet: 'SUN',
      sign: 'Leo',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Vitalidad que necesita ser vista y reconocida sin disculparse.',
      body: 'El impulso vital busca escenario: presencia, calidez, algo que deje huella. Sin reconocimiento, el desajuste pesa más de lo que admites. No es vanidad vacía; es necesidad de significado compartido.',
      bridge: 'En el mapa, ciudades visibles o creativas pueden amplificar tu necesidad de brillo — o de competir por espacio.',
      semanticTags: ['visibility', 'initiative', 'intimacy'],
      bridgeTags: ['visibility', 'initiative', 'intimacy'],
      tensionTags: ['visibility', 'initiative'],
      source: 'voice_tone'
    },
    MOON_SAGITTARIUS: {
      id: 'MOON_SAGITTARIUS',
      planet: 'MOON',
      sign: 'Sagitario',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Necesidad emocional de amplitud, sentido y escape de lo estrecho.',
      body: 'La rutina cerrada puede agotarte: buscas horizonte, verdad, algo que trascienda lo inmediato. Puede haber incompatibilidad entre lo que sientes y lo que el día a día permite. Nombrar esa fricción a veces alivia más que forzar adaptación.',
      bridge: 'En el mapa, destinos abiertos o lejos de lo conocido pueden despertar esa sed de expansión — también de desborde.',
      semanticTags: ['expansion', 'movement', 'stimulation'],
      bridgeTags: ['expansion', 'movement', 'stimulation'],
      tensionTags: ['expansion', 'movement'],
      source: 'voice_tone'
    },
    MOON_CAPRICORN: {
      id: 'MOON_CAPRICORN',
      planet: 'MOON',
      sign: 'Capricornio',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Emociones que piden contención, estructura y prueba de tiempo.',
      body: 'Fiarse del primer impulso afectivo no suele ser lo primero que haces; prefieres ver si algo se sostiene. La seguridad emocional pasa por confianza ganada, no por intensidad inmediata. Hay tensión posible entre lo que sientes y lo que autorizas sentir.',
      bridge: 'Entornos estables o exigentes en el mapa pueden confirmar — o poner a prueba — esa necesidad de control emocional.',
      semanticTags: ['control', 'regulation', 'belonging'],
      bridgeTags: ['control', 'regulation', 'emotional_safety'],
      tensionTags: ['control', 'regulation'],
      source: 'voice_tone'
    },
    MOON_AQUARIUS: {
      id: 'MOON_AQUARIUS',
      planet: 'MOON',
      sign: 'Acuario',
      tier: 'free',
      version: '1.0.0-pilot',
      headline: 'Necesidad emocional de aire, perspectiva y vínculos elegidos con libertad.',
      body: 'Puede costarte quedarte en dinámicas afectivas muy cerradas o predecibles; buscas espacio para pensar lo que sientes antes de fusionarte. La amistad o la causa compartida a veces regulan más que la intimidad tradicional. No siempre es distancia: puede ser una forma de cuidar tu autonomía emocional.',
      bridge: 'Al explorar ciudades en el mapa, observa dónde la vida social deja respirar sin exigirte encajar del todo.',
      semanticTags: ['reflection', 'movement', 'regulation'],
      bridgeTags: ['movement', 'reflection', 'stimulation'],
      tensionTags: ['regulation', 'movement'],
      source: 'voice_tone'
    },
    ASC_PISCES: {
      id: 'ASC_PISCES',
      planet: 'ASC',
      sign: 'Piscis',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Presencia permeable que absorbe el ambiente antes de definirse.',
      body: 'El contacto con lo nuevo puede ser difuso al principio: sensibilidad alta, límites poco claros. No es debilidad; es una forma de leer lo que no se dice. Ser directo cuando el entorno pide certezas rápidas no siempre resulta fácil.',
      bridge: 'Lugares con ritmo blando o atmósferas liminales en el mapa pueden amplificar esa permeabilidad — para bien o para saturación.',
      semanticTags: ['permeability', 'reflection', 'emotional_safety'],
      bridgeTags: ['permeability', 'reflection', 'emotional_safety'],
      tensionTags: ['permeability', 'reflection'],
      source: 'voice_tone'
    },
    ASC_SCORPIO: {
      id: 'ASC_SCORPIO',
      planet: 'ASC',
      sign: 'Escorpio',
      tier: 'free',
      version: '1.0.0-tension-pilot',
      headline: 'Presencia intensa que observa antes de confiar.',
      body: 'Entrar en un lugar puede sentirse como pasar una prueba: percibes subtextos, lealtades, riesgos. No es desconfianza gratuita; es profundidad. La apertura tarda cuando no hay autenticidad.',
      bridge: 'Lugares con carga emocional o transformación en el mapa pueden resonar fuerte — intensificando o agotando.',
      semanticTags: ['intensity', 'protection', 'intimacy'],
      bridgeTags: ['intensity', 'protection', 'intimacy'],
      tensionTags: ['intensity', 'protection'],
      source: 'voice_tone'
    }
  };

  /**
   * Índice lógico por módulo — se poblará en fases editoriales.
   * Claves internas: slug de signo (gemini) o nombre ES según convención final.
   */
  var NATAL_LITE = {
    SUN: {
      aries: 'SUN_ARIES',
      gemini: 'SUN_GEMINI',
      cancer: 'SUN_CANCER',
      capricorn: 'SUN_CAPRICORN',
      virgo: 'SUN_VIRGO',
      leo: 'SUN_LEO'
    },
    MOON: {
      aries: 'MOON_ARIES',
      gemini: 'MOON_GEMINI',
      cancer: 'MOON_CANCER',
      sagittarius: 'MOON_SAGITTARIUS',
      capricorn: 'MOON_CAPRICORN',
      aquarius: 'MOON_AQUARIUS'
    },
    MERCURY: {},
    VENUS: {},
    MARS: {},
    JUPITER: {},
    SATURN: {},
    ASC: {
      libra: 'ASC_LIBRA',
      cancer: 'ASC_CANCER',
      gemini: 'ASC_GEMINI',
      aries: 'ASC_ARIES',
      leo: 'ASC_LEO',
      aquarius: 'ASC_AQUARIUS',
      pisces: 'ASC_PISCES',
      scorpio: 'ASC_SCORPIO'
    },
    MC: {}
  };

  function signSlug(signName) {
    if (!signName) return null;
    return SIGN_SLUG_BY_NAME[signName] ||
      SIGN_SLUG_BY_NAME[String(signName).trim()] ||
      null;
  }

  function fragmentId(planetOrAngle, signName) {
    var slug = signSlug(signName);
    if (!slug || !planetOrAngle) return null;
    return String(planetOrAngle).toUpperCase() + '_' + slug.toUpperCase();
  }

  function hasFragment(id) {
    return !!(id && FRAGMENTS[id]);
  }

  function lookupById(id) {
    if (!hasFragment(id)) return null;
    return FRAGMENTS[id];
  }

  function lookupPlanetSign(planetKey, signName) {
    if (!planetKey || !signName) return null;
    var id = fragmentId(planetKey, signName);
    return lookupById(id);
  }

  function lookupAngle(angleKey, signName) {
    if (!angleKey || !signName) return null;
    var key = String(angleKey).toUpperCase();
    if (ANGLES.indexOf(key) === -1) return null;
    return lookupPlanetSign(key, signName);
  }

  function lookupBySlug(planetOrAngleKey, slug) {
    if (!planetOrAngleKey || !slug) return null;
    var key = String(planetOrAngleKey).toUpperCase();
    var normalized = String(slug).toLowerCase().trim();
    var modules = NATAL_LITE[key];
    if (!modules || !modules[normalized]) return null;
    return lookupById(modules[normalized]);
  }

  function getSchemaVersion() {
    return SCHEMA_VERSION;
  }

  function normalizeInspectSlug(slug) {
    if (slug == null || slug === '') return null;
    return String(slug).toLowerCase().trim();
  }

  function fragmentIdForRoleSlug(role, slug) {
    var normalized = normalizeInspectSlug(slug);
    if (!normalized || !role) return null;
    return String(role).toUpperCase() + '_' + normalized.toUpperCase();
  }

  function slugFromFragmentId(id) {
    if (!id || id.indexOf('_') === -1) return null;
    return id.split('_').slice(1).join('_').toLowerCase();
  }

  function roleFragmentIds(role) {
    var prefix = String(role).toUpperCase() + '_';
    return Object.keys(FRAGMENTS).filter(function (id) {
      return id.indexOf(prefix) === 0;
    }).sort();
  }

  function roleCoverage(role) {
    var ids = roleFragmentIds(role);
    var slugSet = {};
    ids.forEach(function (id) {
      var slug = slugFromFragmentId(id);
      if (slug) slugSet[slug] = id;
    });
    var slugs = Object.keys(slugSet).sort();
    var gaps = ZODIAC_SLUGS.filter(function (slug) {
      return !slugSet[slug];
    });
    return {
      role: role,
      covered: slugs.length,
      total: ZODIAC_SLUGS.length,
      slugs: slugs,
      gaps: gaps,
      fragmentIds: slugs.map(function (slug) { return slugSet[slug]; })
    };
  }

  function natalLiteDebugEnabled() {
    try {
      return localStorage.getItem('kairosDebug') === '1'
        || new URLSearchParams(location.search).has('debug');
    } catch (e) {
      return false;
    }
  }

  function inspect(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('inspect requiere un objeto { sun, moon, asc }');
    }

    var missing = [];
    var available = [];
    var slugs = {};
    var invalidSlugs = [];

    LITE_READING_ROLES.forEach(function (def) {
      var slug = normalizeInspectSlug(input[def.inputKey]);
      slugs[def.inputKey] = slug;

      if (!slug) {
        missing.push(def.role + ':<missing-slug>');
        return;
      }

      if (ZODIAC_SLUGS.indexOf(slug) === -1) {
        invalidSlugs.push(def.inputKey + ':' + slug);
        missing.push(def.role + ':' + slug);
        return;
      }

      var id = fragmentIdForRoleSlug(def.role, slug);
      if (hasFragment(id)) {
        available.push(id);
      } else {
        missing.push(id);
      }
    });

    var coveragePercent = Math.round((available.length / LITE_READING_ROLES.length) * 100);

    var result = {
      ok: missing.length === 0,
      missing: missing,
      available: available,
      coveragePercent: coveragePercent,
      slugs: slugs,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        invalidSlugs: invalidSlugs
      }
    };

    if (natalLiteDebugEnabled()) {
      console.info('[Natal Lite Debug] inspect', result);
    }

    return result;
  }

  function stats() {
    var byRole = {};
    LITE_READING_ROLES.forEach(function (def) {
      byRole[def.role] = roleCoverage(def.role);
    });

    var result = {
      schemaVersion: SCHEMA_VERSION,
      totalFragments: Object.keys(FRAGMENTS).length,
      liteRoles: LITE_READING_ROLES.map(function (def) { return def.role; }),
      zodiacSlugs: ZODIAC_SLUGS.slice(),
      byRole: byRole,
      gaps: {
        SUN: byRole.SUN.gaps,
        MOON: byRole.MOON.gaps,
        ASC: byRole.ASC.gaps
      }
    };

    if (natalLiteDebugEnabled()) {
      console.info('[Natal Lite Debug] stats', result);
    }

    return result;
  }

  window.KairosNatalLite = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    SIGNS_ES: SIGNS_ES,
    SIGN_SLUG_BY_NAME: SIGN_SLUG_BY_NAME,
    FREE_PLANETS: FREE_PLANETS,
    ANGLES: ANGLES,
    FRAGMENTS: FRAGMENTS,
    MODULES: NATAL_LITE,
    signSlug: signSlug,
    fragmentId: fragmentId,
    hasFragment: hasFragment,
    lookupById: lookupById,
    lookupPlanetSign: lookupPlanetSign,
    lookupAngle: lookupAngle,
    lookupBySlug: lookupBySlug,
    getSchemaVersion: getSchemaVersion
  };

  window.KairosNatalLiteDebug = {
    ZODIAC_SLUGS: ZODIAC_SLUGS,
    LITE_READING_ROLES: LITE_READING_ROLES,
    inspect: inspect,
    stats: stats,
    roleCoverage: roleCoverage,
    fragmentIdForRoleSlug: fragmentIdForRoleSlug
  };
})();
