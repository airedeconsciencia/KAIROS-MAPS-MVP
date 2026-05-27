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

  var SCHEMA_VERSION = '0.1.0-scaffold';

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
   *   tags: [],
   *   source: 'voice_tone'
   * }
   */
  var FRAGMENTS = {
    /* Ejemplo mínimo de forma — NO usar en UI hasta revisión editorial:
    SUN_GEMINI: {
      id: 'SUN_GEMINI',
      planet: 'SUN',
      sign: 'Géminis',
      tier: 'free',
      version: '0.0.0-example',
      headline: '[scaffold]',
      body: '[scaffold]',
      bridge: null,
      tags: ['comunicación'],
      source: 'scaffold'
    }
    */
  };

  /**
   * Índice lógico por módulo — se poblará en fases editoriales.
   * Claves internas: slug de signo (gemini) o nombre ES según convención final.
   */
  var NATAL_LITE = {
    SUN: {},
    MOON: {},
    MERCURY: {},
    VENUS: {},
    MARS: {},
    JUPITER: {},
    SATURN: {},
    ASC: {},
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

  function getSchemaVersion() {
    return SCHEMA_VERSION;
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
    getSchemaVersion: getSchemaVersion
  };
})();
