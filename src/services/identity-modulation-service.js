/**
 * KAIROS MAPS — Identity Modulation Service (Fase 7.5d engine)
 *
 * Convierte perfiles dimensionales en coeficientes de modulación.
 * Sin aplicación editorial · modulation.enabled=false por defecto.
 * No cableado en narrative / premium / knowledge.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.5d-0.1';
  var COEFF_MIN = -0.3;
  var COEFF_MAX = 0.3;
  var NEUTRAL_DIMENSION = 3;
  var CHANNELS = ['narrative', 'premium', 'knowledge', 'atmosphere'];
  var SECTIONS = ['favorece', 'desafia', 'observar', 'aprovecha', 'integracion'];

  var Archetypes = window.KairosCityIdentityArchetypes;
  var Dimensions = window.KairosIdentityDimensions;
  var Profile = window.KairosIdentityModulationProfile;

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function dimDelta(value) {
    if (value == null || isNaN(value)) return 0;
    return clamp((Number(value) - NEUTRAL_DIMENSION) * 0.075, COEFF_MIN, COEFF_MAX);
  }

  function profileDimensionSlugs() {
    if (Profile && Profile.PROFILE_DIMENSION_SLUGS) return Profile.PROFILE_DIMENSION_SLUGS;
    return [
      'activation', 'tempo', 'visibility', 'rooting', 'reflection',
      'complexity', 'novelty', 'social_density', 'structure', 'horizon'
    ];
  }

  function buildZeroWeightBoosts() {
    var boosts = {};
    profileDimensionSlugs().forEach(function (slug) {
      boosts[slug] = 0;
    });
    return boosts;
  }

  function buildZeroSectionBias() {
    var bias = {};
    SECTIONS.forEach(function (section) {
      bias[section] = 0;
    });
    return bias;
  }

  function buildNeutralChannelTrace(source) {
    return {
      source: source || 'neutral',
      archetypeSlug: null,
      dimensionsUsed: [],
      channel: null
    };
  }

  function buildNeutralChannelCoefficients(channel) {
    return {
      weightBoosts: buildZeroWeightBoosts(),
      rhythmBias: 0,
      densityBias: 0,
      toneBias: 0,
      sectionBias: buildZeroSectionBias(),
      trace: buildNeutralChannelTrace('neutral')
    };
  }

  function buildNeutralCoefficients(reason) {
    var channels = {};
    CHANNELS.forEach(function (channel) {
      var coeff = buildNeutralChannelCoefficients(channel);
      coeff.trace.channel = channel;
      channels[channel] = coeff;
    });
    return {
      enabled: false,
      channels: channels,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: true,
        reason: reason || 'neutral_default'
      }
    };
  }

  function normalizeArchetypeSlug(input) {
    if (!input) return null;
    if (typeof input === 'string') return String(input).trim() || null;
    if (input.identityArchetype) return String(input.identityArchetype).trim() || null;
    if (input.archetypeSlug) return String(input.archetypeSlug).trim() || null;
    return null;
  }

  function normalizeCitySlug(input) {
    if (!input || typeof input !== 'object') return null;
    if (input.citySlug) return String(input.citySlug).trim() || null;
    if (input.city && input.city.slug) return String(input.city.slug).trim() || null;
    return null;
  }

  function resolveArchetypeContext(archetypeSlug) {
    if (!archetypeSlug) {
      return { ok: false, reason: 'missing_archetype_slug', slug: null, archetype: null, profile: null };
    }
    if (!Archetypes || typeof Archetypes.getArchetype !== 'function') {
      return { ok: false, reason: 'archetype_catalog_unavailable', slug: archetypeSlug, archetype: null, profile: null };
    }
    var archetype = Archetypes.getArchetype(archetypeSlug);
    if (!archetype) {
      return { ok: false, reason: 'unknown_archetype', slug: archetypeSlug, archetype: null, profile: null };
    }
    if (!Profile || typeof Profile.getProfile !== 'function' || !Profile.hasProfile(archetypeSlug)) {
      return { ok: false, reason: 'missing_dimension_profile', slug: archetypeSlug, archetype: archetype, profile: null };
    }
    var profile = Profile.getProfile(archetypeSlug);
    if (!profile || !profile.dimensions) {
      return { ok: false, reason: 'missing_dimension_profile', slug: archetypeSlug, archetype: archetype, profile: null };
    }
    return { ok: true, reason: 'resolved', slug: archetypeSlug, archetype: archetype, profile: profile };
  }

  function buildWeightBoosts(dimensions, channel) {
    var boosts = {};
    var weights = {
      narrative: {
        activation: 1.0, tempo: 1.0, visibility: 0.6, rooting: 0.5, reflection: 1.0,
        complexity: 0.5, novelty: 0.6, social_density: 0.5, structure: 0.4, horizon: 0.8
      },
      premium: {
        activation: 1.0, tempo: 0.7, visibility: 1.0, rooting: 0.5, reflection: 0.5,
        complexity: 1.0, novelty: 1.0, social_density: 0.8, structure: 0.9, horizon: 0.5
      },
      knowledge: {
        activation: 0.5, tempo: 0.6, visibility: 0.4, rooting: 0.9, reflection: 0.7,
        complexity: 0.8, novelty: 1.0, social_density: 0.9, structure: 1.0, horizon: 0.5
      },
      atmosphere: {
        activation: 0.6, tempo: 0.9, visibility: 0.5, rooting: 0.7, reflection: 0.8,
        complexity: 0.4, novelty: 0.4, social_density: 0.9, structure: 0.3, horizon: 1.0
      }
    };
    var channelWeights = weights[channel] || weights.narrative;
    profileDimensionSlugs().forEach(function (slug) {
      var multiplier = channelWeights[slug] != null ? channelWeights[slug] : 0.5;
      boosts[slug] = clamp(dimDelta(dimensions[slug]) * multiplier, COEFF_MIN, COEFF_MAX);
    });
    return boosts;
  }

  function buildSectionBias(dimensions, channel) {
    var d = dimensions;
    var base = {
      favorece: dimDelta(d.horizon) * 0.8 + dimDelta(d.activation) * 0.5 + dimDelta(d.novelty) * 0.4,
      desafia: dimDelta(d.complexity) * 0.8 + dimDelta(d.visibility) * 0.6 + dimDelta(d.novelty) * 0.5,
      observar: dimDelta(d.reflection) * 0.9 + dimDelta(d.tempo) * -0.4 + dimDelta(d.horizon) * 0.5,
      aprovecha: dimDelta(d.activation) * 0.9 + dimDelta(d.social_density) * 0.6 + dimDelta(d.structure) * 0.5,
      integracion: dimDelta(d.rooting) * 0.9 + dimDelta(d.reflection) * 0.6 - dimDelta(d.visibility) * 0.3
    };
    if (channel === 'premium') {
      base.aprovecha += dimDelta(d.visibility) * 0.3;
      base.desafia += dimDelta(d.structure) * 0.2;
    }
    if (channel === 'knowledge') {
      base.integracion += dimDelta(d.structure) * 0.3;
      base.aprovecha += dimDelta(d.novelty) * 0.2;
    }
    if (channel === 'atmosphere') {
      base.favorece += dimDelta(d.horizon) * 0.3;
      base.observar += dimDelta(d.reflection) * 0.2;
    }
    var bias = {};
    SECTIONS.forEach(function (section) {
      bias[section] = clamp(base[section] || 0, COEFF_MIN, COEFF_MAX);
    });
    return bias;
  }

  function buildChannelCoefficients(dimensions, channel, archetypeSlug) {
    var rhythmBias = clamp(
      dimDelta(dimensions.tempo) * 0.9 + dimDelta(dimensions.activation) * 0.4,
      COEFF_MIN, COEFF_MAX
    );
    var densityBias = clamp(
      dimDelta(dimensions.complexity) * 0.9 + dimDelta(dimensions.social_density) * 0.5,
      COEFF_MIN, COEFF_MAX
    );
    var toneBias = clamp(
      dimDelta(dimensions.visibility) * 0.7 - dimDelta(dimensions.reflection) * 0.7,
      COEFF_MIN, COEFF_MAX
    );
    return {
      weightBoosts: buildWeightBoosts(dimensions, channel),
      rhythmBias: rhythmBias,
      densityBias: densityBias,
      toneBias: toneBias,
      sectionBias: buildSectionBias(dimensions, channel),
      trace: {
        source: 'identity_profile',
        archetypeSlug: archetypeSlug,
        dimensionsUsed: profileDimensionSlugs().slice(),
        channel: channel
      }
    };
  }

  function buildModulationCoefficients(archetypeSlug, options) {
    options = options || {};
    var ctx = resolveArchetypeContext(archetypeSlug);
    if (!ctx.ok) {
      return buildNeutralCoefficients(ctx.reason);
    }
    var channels = {};
    CHANNELS.forEach(function (channel) {
      channels[channel] = buildChannelCoefficients(ctx.profile.dimensions, channel, ctx.slug);
    });
    return {
      enabled: options.enabled === true,
      channels: channels,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: false,
        archetypeSlug: ctx.slug,
        reason: 'coefficients_built',
        profileRevision: ctx.profile.metadata && ctx.profile.metadata.revision
      }
    };
  }

  function getModulationTrace(archetypeSlug) {
    var coeffs = buildModulationCoefficients(archetypeSlug);
    var traces = {};
    CHANNELS.forEach(function (channel) {
      traces[channel] = coeffs.channels[channel].trace;
    });
    return {
      schemaVersion: SCHEMA_VERSION,
      enabled: coeffs.enabled,
      neutralFallback: coeffs.meta.neutralFallback,
      archetypeSlug: coeffs.meta.archetypeSlug || null,
      reason: coeffs.meta.reason,
      channels: traces
    };
  }

  function getNeutralProfile(overrides) {
    overrides = overrides || {};
    var base = Profile && typeof Profile.buildNeutralProfile === 'function'
      ? Profile.buildNeutralProfile(overrides)
      : {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: true,
        identity: {
          macroIdentity: null,
          identityArchetype: null,
          identityAxis: null,
          status: 'neutral'
        },
        dimensions: {},
        modulation: { enabled: false, coefficients: null }
      };
    var profileDims = Profile && typeof Profile.buildNeutralProfileDimensions === 'function'
      ? Profile.buildNeutralProfileDimensions()
      : {};
    var coeffs = buildNeutralCoefficients(overrides.reason || 'neutral_default');
    return {
      schemaVersion: SCHEMA_VERSION,
      neutralFallback: true,
      identity: base.identity,
      dimensions: profileDims,
      legacyDimensions: base.dimensions || {},
      modulation: coeffs,
      meta: {
        reason: overrides.reason || 'neutral_default',
        citySlug: overrides.citySlug != null ? overrides.citySlug : null,
        modulationEnabled: false
      }
    };
  }

  function getIdentityProfile(archetypeSlug) {
    var ctx = resolveArchetypeContext(archetypeSlug);
    if (!ctx.ok) {
      return getNeutralProfile({ reason: ctx.reason }).identity;
    }
    return {
      macroIdentity: ctx.archetype.metadata.macroIdentity,
      identityArchetype: ctx.slug,
      identityAxis: ctx.archetype.metadata.identityAxis,
      status: 'resolved',
      displayName: ctx.archetype.displayName,
      archetypeId: ctx.archetype.id
    };
  }

  function getDimensionProfile(archetypeSlug) {
    var ctx = resolveArchetypeContext(archetypeSlug);
    if (!ctx.ok) {
      return Profile && typeof Profile.buildNeutralProfileDimensions === 'function'
        ? Profile.buildNeutralProfileDimensions()
        : {};
    }
    return Object.assign({}, ctx.profile.dimensions);
  }

  function resolveIdentity(input) {
    input = input || {};
    var citySlug = normalizeCitySlug(input);
    var archetypeSlug = normalizeArchetypeSlug(input);
    var ctx = resolveArchetypeContext(archetypeSlug);

    if (!ctx.ok) {
      var reason = archetypeSlug ? ctx.reason : 'missing_archetype_slug';
      return {
        ok: true,
        found: false,
        reason: reason,
        citySlug: citySlug,
        identityArchetype: archetypeSlug,
        neutralFallback: true,
        profile: getNeutralProfile({
          reason: reason,
          citySlug: citySlug
        }),
        meta: {
          schemaVersion: SCHEMA_VERSION,
          neutralFallback: true,
          modulationEnabled: false
        }
      };
    }

    var coefficients = buildModulationCoefficients(ctx.slug, { enabled: false });
    return {
      ok: true,
      found: true,
      reason: 'identity_resolved',
      citySlug: citySlug,
      identityArchetype: ctx.slug,
      neutralFallback: false,
      profile: {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: false,
        identity: getIdentityProfile(ctx.slug),
        dimensions: getDimensionProfile(ctx.slug),
        modulation: coefficients,
        meta: {
          reason: 'identity_resolved',
          citySlug: citySlug,
          modulationEnabled: false,
          profileConfidence: ctx.profile.metadata && ctx.profile.metadata.confidence
        }
      },
      meta: {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: false,
        modulationEnabled: false
      }
    };
  }

  function coefficientInRange(value) {
    return typeof value === 'number' && !isNaN(value) && value >= COEFF_MIN && value <= COEFF_MAX;
  }

  window.KairosIdentityModulation = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    COEFF_MIN: COEFF_MIN,
    COEFF_MAX: COEFF_MAX,
    CHANNELS: CHANNELS.slice(),
    SECTIONS: SECTIONS.slice(),
    getNeutralProfile: getNeutralProfile,
    getIdentityProfile: getIdentityProfile,
    getDimensionProfile: getDimensionProfile,
    buildModulationCoefficients: buildModulationCoefficients,
    getModulationTrace: getModulationTrace,
    resolveIdentity: resolveIdentity,
    coefficientInRange: coefficientInRange
  };
})();
