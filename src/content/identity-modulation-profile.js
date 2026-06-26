/**
 * KAIROS MAPS — Identity Modulation Profile (Fase 7.5c dimension profiles)
 *
 * IDENTITY_PROFILES · 28 arquetipos · solo datos.
 * Sin ciudades · sin coeficientes · sin modulación activa.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.5c-0.1';

  var PROFILE_DIMENSION_SLUGS = [
    'activation',
    'tempo',
    'visibility',
    'rooting',
    'reflection',
    'complexity',
    'novelty',
    'social_density',
    'structure',
    'horizon'
  ];

  var SCALE_MIN = 1;
  var SCALE_MAX = 5;
  var NEUTRAL_VALUE = 3;

  var Dimensions = window.KairosIdentityDimensions;

  function profileMeta(confidence) {
    return {
      confidence: confidence || 'A',
      revision: '7.5c-0.1',
      status: 'approved'
    };
  }

  function buildDimensions(
    activation, tempo, visibility, rooting, reflection,
    complexity, novelty, social_density, structure, horizon
  ) {
    return {
      activation: activation,
      tempo: tempo,
      visibility: visibility,
      rooting: rooting,
      reflection: reflection,
      complexity: complexity,
      novelty: novelty,
      social_density: social_density,
      structure: structure,
      horizon: horizon
    };
  }

  var IDENTITY_PROFILES = {
    creative_expansion: {
      dimensions: buildDimensions(4, 4, 4, 2, 2, 3, 4, 4, 2, 3),
      metadata: profileMeta('A')
    },
    projection: {
      dimensions: buildDimensions(4, 4, 5, 2, 2, 3, 3, 3, 3, 3),
      metadata: profileMeta('A')
    },
    quiet_integration: {
      dimensions: buildDimensions(2, 2, 1, 5, 3, 2, 2, 2, 3, 3),
      metadata: profileMeta('A')
    },
    disciplined_precision: {
      dimensions: buildDimensions(3, 3, 2, 3, 3, 3, 2, 2, 5, 2),
      metadata: profileMeta('A')
    },
    spontaneous_exchange: {
      dimensions: buildDimensions(4, 4, 2, 3, 2, 2, 3, 5, 2, 3),
      metadata: profileMeta('A')
    },
    contemplative_depth: {
      dimensions: buildDimensions(2, 2, 1, 3, 5, 3, 3, 2, 3, 4),
      metadata: profileMeta('A')
    },
    strategic_expansion: {
      dimensions: buildDimensions(4, 3, 4, 2, 2, 4, 4, 3, 4, 3),
      metadata: profileMeta('A')
    },
    expressive_intensity: {
      dimensions: buildDimensions(5, 4, 3, 2, 3, 2, 3, 4, 2, 3),
      metadata: profileMeta('A')
    },
    structural_ambition: {
      dimensions: buildDimensions(4, 4, 4, 2, 2, 4, 3, 3, 5, 2),
      metadata: profileMeta('A')
    },
    adaptive_reinvention: {
      dimensions: buildDimensions(4, 3, 3, 2, 2, 3, 5, 3, 2, 3),
      metadata: profileMeta('A')
    },
    coastal_balance: {
      dimensions: buildDimensions(2, 3, 2, 4, 3, 2, 2, 3, 3, 4),
      metadata: profileMeta('A')
    },
    institutional_visibility: {
      dimensions: buildDimensions(3, 3, 5, 3, 2, 4, 2, 3, 5, 2),
      metadata: profileMeta('A')
    },
    island_retreat: {
      dimensions: buildDimensions(1, 2, 1, 4, 4, 2, 2, 1, 3, 4),
      metadata: profileMeta('A')
    },
    cultural_memory: {
      dimensions: buildDimensions(2, 2, 2, 4, 5, 4, 3, 2, 3, 3),
      metadata: profileMeta('A')
    },
    technological_acceleration: {
      dimensions: buildDimensions(5, 5, 3, 1, 1, 4, 5, 3, 4, 2),
      metadata: profileMeta('A')
    },
    trade_crossroads: {
      dimensions: buildDimensions(4, 4, 3, 1, 2, 4, 3, 4, 2, 3),
      metadata: profileMeta('A')
    },
    resilient_ordinariness: {
      dimensions: buildDimensions(2, 2, 1, 4, 3, 2, 2, 2, 3, 2),
      metadata: profileMeta('A')
    },
    expansive_horizon: {
      dimensions: buildDimensions(2, 2, 2, 3, 4, 2, 2, 2, 2, 5),
      metadata: profileMeta('A')
    },
    networked_momentum: {
      dimensions: buildDimensions(4, 4, 3, 2, 2, 4, 3, 5, 3, 3),
      metadata: profileMeta('A')
    },
    ceremonial_hospitality: {
      dimensions: buildDimensions(3, 3, 2, 4, 2, 3, 2, 4, 4, 3),
      metadata: profileMeta('M')
    },
    frontier_emergence: {
      dimensions: buildDimensions(3, 3, 2, 1, 2, 3, 5, 2, 1, 4),
      metadata: profileMeta('M')
    },
    meditative_withdrawal: {
      dimensions: buildDimensions(1, 1, 1, 3, 5, 2, 2, 1, 3, 3),
      metadata: profileMeta('A')
    },
    cosmopolitan_collage: {
      dimensions: buildDimensions(3, 3, 3, 1, 2, 5, 3, 4, 2, 3),
      metadata: profileMeta('A')
    },
    sovereign_calm: {
      dimensions: buildDimensions(2, 2, 2, 3, 3, 3, 2, 2, 4, 3),
      metadata: profileMeta('A')
    },
    regenerative_slow_burn: {
      dimensions: buildDimensions(2, 2, 2, 4, 3, 3, 4, 2, 3, 3),
      metadata: profileMeta('A')
    },
    border_threshold: {
      dimensions: buildDimensions(3, 3, 2, 1, 3, 5, 4, 3, 1, 3),
      metadata: profileMeta('A')
    },
    layered_capital: {
      dimensions: buildDimensions(4, 4, 4, 2, 2, 5, 3, 4, 4, 2),
      metadata: profileMeta('A')
    },
    contained_intensity: {
      dimensions: buildDimensions(3, 3, 2, 3, 4, 3, 3, 2, 2, 1),
      metadata: profileMeta('M')
    }
  };

  function buildNeutralProfileDimensions() {
    var vector = {};
    PROFILE_DIMENSION_SLUGS.forEach(function (slug) {
      vector[slug] = NEUTRAL_VALUE;
    });
    return vector;
  }

  function buildNeutralIdentity() {
    return {
      macroIdentity: null,
      identityArchetype: null,
      identityAxis: null,
      status: 'neutral'
    };
  }

  function buildNeutralModulation() {
    return {
      enabled: false,
      coefficients: null,
      channelCoefficients: null,
      conflictRulesApplied: []
    };
  }

  function buildNeutralProfile(overrides) {
    overrides = overrides || {};
    var legacyDims = Dimensions ? Dimensions.buildNeutralDimensionVector() : {};
    return {
      schemaVersion: SCHEMA_VERSION,
      neutralFallback: true,
      identity: buildNeutralIdentity(),
      dimensions: legacyDims,
      profileDimensions: buildNeutralProfileDimensions(),
      modulation: buildNeutralModulation(),
      meta: {
        reason: overrides.reason || 'neutral_default',
        citySlug: overrides.citySlug != null ? overrides.citySlug : null,
        modulationEnabled: false
      }
    };
  }

  function getProfile(slug) {
    if (!slug) return null;
    var key = String(slug).trim();
    var entry = IDENTITY_PROFILES[key];
    if (!entry) return null;
    return {
      identityArchetype: key,
      dimensions: Object.assign({}, entry.dimensions),
      metadata: Object.assign({}, entry.metadata)
    };
  }

  function hasProfile(slug) {
    if (!slug) return false;
    return Object.prototype.hasOwnProperty.call(IDENTITY_PROFILES, String(slug).trim());
  }

  function listProfiles() {
    return Object.keys(IDENTITY_PROFILES).map(function (slug) {
      return getProfile(slug);
    });
  }

  window.KairosIdentityModulationProfile = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    PROFILE_DIMENSION_SLUGS: PROFILE_DIMENSION_SLUGS,
    SCALE_MIN: SCALE_MIN,
    SCALE_MAX: SCALE_MAX,
    NEUTRAL_VALUE: NEUTRAL_VALUE,
    IDENTITY_PROFILES: IDENTITY_PROFILES,
    buildNeutralIdentity: buildNeutralIdentity,
    buildNeutralModulation: buildNeutralModulation,
    buildNeutralProfile: buildNeutralProfile,
    buildNeutralProfileDimensions: buildNeutralProfileDimensions,
    getProfile: getProfile,
    hasProfile: hasProfile,
    listProfiles: listProfiles
  };
})();
