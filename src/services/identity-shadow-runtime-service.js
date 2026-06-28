/**
 * KAIROS MAPS — Identity Shadow Runtime (Fase 7.9c)
 *
 * Shadow identity con City Signature layer.
 * Effective Profile = Archetype Profile + City Signature.
 * modulation.enabled siempre false · runtimeImpact: none · no cableado en producto.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.9c-0.1';
  var SHADOW_MODE = 'shadow';
  var SCALE_MIN = 1;
  var SCALE_MAX = 5;

  var Mod = window.KairosIdentityModulation;
  var Index = window.KairosCityIdentityIndex;
  var Profile = window.KairosIdentityModulationProfile;
  var Signatures = window.KairosCitySignatures;
  var EditorialFamily = window.KairosEditorialFamily;

  var CHANNELS = Mod && Mod.CHANNELS ? Mod.CHANNELS.slice() : ['narrative', 'premium', 'knowledge', 'atmosphere'];
  var SECTIONS = Mod && Mod.SECTIONS ? Mod.SECTIONS.slice() : ['favorece', 'desafia', 'observar', 'aprovecha', 'integracion'];
  var COEFF_MIN = Mod && Mod.COEFF_MIN != null ? Mod.COEFF_MIN : -0.3;
  var COEFF_MAX = Mod && Mod.COEFF_MAX != null ? Mod.COEFF_MAX : 0.3;
  var NEUTRAL_DIMENSION = 3;

  function round(value, decimals) {
    if (value == null || isNaN(value) || !isFinite(value)) return 0;
    var factor = Math.pow(10, decimals != null ? decimals : 4);
    return Math.round(value * factor) / factor;
  }

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function normalizeCitySlug(citySlug) {
    if (citySlug == null) return null;
    var slug = String(citySlug).trim();
    return slug || null;
  }

  function dimensionSlugs() {
    if (Signatures && Signatures.DIMENSION_SLUGS) return Signatures.DIMENSION_SLUGS.slice();
    if (Profile && Profile.PROFILE_DIMENSION_SLUGS) return Profile.PROFILE_DIMENSION_SLUGS.slice();
    return [
      'activation', 'tempo', 'visibility', 'rooting', 'reflection',
      'complexity', 'novelty', 'social_density', 'structure', 'horizon'
    ];
  }

  function neutralDimensions() {
    if (Profile && typeof Profile.buildNeutralProfileDimensions === 'function') {
      return Object.assign({}, Profile.buildNeutralProfileDimensions());
    }
    var dims = {};
    dimensionSlugs().forEach(function (slug) { dims[slug] = NEUTRAL_DIMENSION; });
    return dims;
  }

  function zeroAdjustments() {
    if (Signatures && typeof Signatures.zeroAdjustments === 'function') {
      return Signatures.zeroAdjustments();
    }
    var adj = {};
    dimensionSlugs().forEach(function (slug) { adj[slug] = 0; });
    return adj;
  }

  function resolveEditorialFamily(cityIdentity) {
    var EditorialFamily = window.KairosEditorialFamily;
    if (!EditorialFamily || typeof EditorialFamily.resolveEditorialFamily !== 'function') {
      return null;
    }
    if (!cityIdentity) return EditorialFamily.resolveEditorialFamily({});
    return EditorialFamily.resolveEditorialFamily({
      cityName: cityIdentity.catalogName,
      countryId: cityIdentity.countryId
    });
  }

  function getArchetypeSlug(citySlug) {
    if (!Index || !Index.getCityIdentity) return null;
    var entry = Index.getCityIdentity(citySlug);
    return entry && entry.identityArchetype ? entry.identityArchetype : null;
  }

  function getBaseProfileDimensions(archetypeSlug) {
    if (!archetypeSlug || !Profile || typeof Profile.getProfile !== 'function') {
      return neutralDimensions();
    }
    var profile = Profile.getProfile(archetypeSlug);
    if (!profile || !profile.dimensions) return neutralDimensions();
    return Object.assign({}, profile.dimensions);
  }

  function getCitySignaturePayload(citySlug) {
    if (!citySlug || !Signatures || typeof Signatures.getCitySignature !== 'function') {
      return {
        found: false,
        adjustments: zeroAdjustments(),
        confidence: null,
        revision: null
      };
    }
    var signature = Signatures.getCitySignature(citySlug);
    if (!signature) {
      return {
        found: false,
        adjustments: zeroAdjustments(),
        confidence: null,
        revision: null
      };
    }
    return {
      found: true,
      adjustments: Object.assign({}, signature.adjustments),
      confidence: signature.confidence,
      revision: signature.revision
    };
  }

  function computeEffectiveProfile(citySlug, archetypeSlug) {
    var slugs = dimensionSlugs();
    var baseProfile = getBaseProfileDimensions(archetypeSlug);
    var citySignature = getCitySignaturePayload(citySlug);
    var effectiveProfile = {};

    slugs.forEach(function (dim) {
      var baseValue = Number(baseProfile[dim]) || NEUTRAL_DIMENSION;
      var adjustment = Number(citySignature.adjustments[dim]) || 0;
      effectiveProfile[dim] = round(
        clamp(baseValue + adjustment, SCALE_MIN, SCALE_MAX),
        4
      );
    });

    return {
      baseProfile: baseProfile,
      citySignature: citySignature,
      effectiveProfile: effectiveProfile,
      signatureApplied: citySignature.found === true
    };
  }

  function dimDelta(value) {
    if (value == null || isNaN(value)) return 0;
    return clamp((Number(value) - NEUTRAL_DIMENSION) * 0.075, COEFF_MIN, COEFF_MAX);
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
    dimensionSlugs().forEach(function (slug) {
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

  function buildChannelCoefficients(dimensions, channel, archetypeSlug, signatureApplied) {
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
        source: signatureApplied ? 'effective_profile' : 'identity_profile',
        archetypeSlug: archetypeSlug,
        dimensionsUsed: dimensionSlugs().slice(),
        channel: channel,
        signatureApplied: signatureApplied === true
      }
    };
  }

  function buildCoefficientsFromDimensions(dimensions, archetypeSlug, signatureApplied, reason) {
    if (!dimensions) {
      return Mod && typeof Mod.buildModulationCoefficients === 'function'
        ? Mod.buildModulationCoefficients(null)
        : { enabled: false, channels: {}, meta: { neutralFallback: true } };
    }
    var channels = {};
    CHANNELS.forEach(function (channel) {
      channels[channel] = buildChannelCoefficients(dimensions, channel, archetypeSlug, signatureApplied);
    });
    return {
      enabled: false,
      channels: channels,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        neutralFallback: false,
        archetypeSlug: archetypeSlug,
        reason: reason || 'coefficients_built',
        signatureApplied: signatureApplied === true
      }
    };
  }

  function buildShadowTrace(resolved, archetypeSlug, effectiveBundle, coefficients) {
    var cityIdentity = resolved.profile && resolved.profile.cityIdentity
      ? resolved.profile.cityIdentity
      : null;
    var traces = {};
    CHANNELS.forEach(function (channel) {
      traces[channel] = coefficients.channels[channel].trace;
    });

    return {
      schemaVersion: SCHEMA_VERSION,
      shadowMode: true,
      signatureApplied: effectiveBundle.signatureApplied === true,
      resolution: {
        found: resolved.found === true,
        reason: resolved.reason,
        neutralFallback: resolved.neutralFallback === true,
        citySlug: resolved.citySlug || null
      },
      identity: cityIdentity
        ? {
          confidence: cityIdentity.confidence,
          status: cityIdentity.status,
          densityTier: cityIdentity.densityTier,
          source: cityIdentity.source
        }
        : null,
      profiles: {
        baseProfile: effectiveBundle.baseProfile,
        citySignature: effectiveBundle.citySignature,
        effectiveProfile: effectiveBundle.effectiveProfile
      },
      modulation: {
        schemaVersion: SCHEMA_VERSION,
        enabled: false,
        neutralFallback: coefficients.meta && coefficients.meta.neutralFallback === true,
        archetypeSlug: archetypeSlug,
        reason: coefficients.meta && coefficients.meta.reason,
        signatureApplied: effectiveBundle.signatureApplied === true,
        channels: traces
      },
      runtime: {
        modulationApplied: false,
        runtimeImpact: 'none'
      }
    };
  }

  function buildShadowMetadata(citySlug, resolved, editorialFamily, effectiveBundle) {
    var cityIdentity = resolved.profile && resolved.profile.cityIdentity
      ? resolved.profile.cityIdentity
      : null;

    return {
      schemaVersion: SCHEMA_VERSION,
      mode: SHADOW_MODE,
      computedAt: new Date().toISOString(),
      citySlug: citySlug,
      found: resolved.found === true,
      neutralFallback: resolved.neutralFallback === true,
      reason: resolved.reason,
      editorialFamily: editorialFamily,
      confidence: cityIdentity && cityIdentity.confidence,
      status: cityIdentity && cityIdentity.status,
      densityTier: cityIdentity && cityIdentity.densityTier,
      signatureApplied: effectiveBundle.signatureApplied === true,
      modulationApplied: false,
      runtimeImpact: 'none',
      modulationEnabled: false
    };
  }

  function buildNeutralShadowResult(slug, reason) {
    var neutralDims = neutralDimensions();
    var neutralCoeffs = Mod && typeof Mod.buildModulationCoefficients === 'function'
      ? Mod.buildModulationCoefficients(null)
      : buildCoefficientsFromDimensions(neutralDims, null, false, reason);
    if (neutralCoeffs) neutralCoeffs = Object.assign({}, neutralCoeffs, { enabled: false });

    var effectiveBundle = {
      baseProfile: neutralDims,
      citySignature: {
        found: false,
        adjustments: zeroAdjustments(),
        confidence: null,
        revision: null
      },
      effectiveProfile: neutralDims,
      signatureApplied: false
    };

    var resolved = {
      found: false,
      reason: reason,
      neutralFallback: true,
      citySlug: slug,
      profile: { cityIdentity: null }
    };

    return {
      ok: false,
      reason: reason,
      citySlug: slug,
      identityArchetype: null,
      baseProfile: effectiveBundle.baseProfile,
      citySignature: effectiveBundle.citySignature,
      effectiveProfile: effectiveBundle.effectiveProfile,
      dimensionProfile: effectiveBundle.effectiveProfile,
      modulationCoefficients: neutralCoeffs,
      trace: buildShadowTrace(resolved, null, effectiveBundle, neutralCoeffs),
      shadowMetadata: buildShadowMetadata(slug, resolved, null, effectiveBundle)
    };
  }

  function computeShadowIdentity(citySlug) {
    var slug = normalizeCitySlug(citySlug);
    if (!slug) {
      return buildNeutralShadowResult(null, 'missing_city_slug');
    }

    if (!Mod || typeof Mod.resolveIdentity !== 'function') {
      return buildNeutralShadowResult(slug, 'identity_modulation_unavailable');
    }

    var resolved = Mod.resolveIdentity({ citySlug: slug });
    var profile = resolved.profile || Mod.getNeutralProfile({ reason: resolved.reason, citySlug: slug });
    var cityIdentity = profile.cityIdentity || (Index && Index.hasCityIdentity(slug) ? Index.getCityIdentity(slug) : null);
    var editorialFamily = resolveEditorialFamily(cityIdentity);
    var archetypeSlug = resolved.identityArchetype || getArchetypeSlug(slug);

    if (!resolved.found || resolved.neutralFallback || !archetypeSlug) {
      return buildNeutralShadowResult(slug, resolved.reason || 'identity_not_curated');
    }

    var effectiveBundle = computeEffectiveProfile(slug, archetypeSlug);
    var coefficients = buildCoefficientsFromDimensions(
      effectiveBundle.effectiveProfile,
      archetypeSlug,
      effectiveBundle.signatureApplied,
      'effective_profile_coefficients'
    );

    return {
      ok: true,
      reason: resolved.reason,
      citySlug: slug,
      identityArchetype: archetypeSlug,
      baseProfile: effectiveBundle.baseProfile,
      citySignature: effectiveBundle.citySignature,
      effectiveProfile: effectiveBundle.effectiveProfile,
      dimensionProfile: effectiveBundle.effectiveProfile,
      modulationCoefficients: coefficients,
      trace: buildShadowTrace(resolved, archetypeSlug, effectiveBundle, coefficients),
      shadowMetadata: buildShadowMetadata(slug, resolved, editorialFamily, effectiveBundle)
    };
  }

  window.KairosIdentityShadowRuntime = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    SHADOW_MODE: SHADOW_MODE,
    computeShadowIdentity: computeShadowIdentity,
    computeEffectiveProfile: computeEffectiveProfile
  };
})();
