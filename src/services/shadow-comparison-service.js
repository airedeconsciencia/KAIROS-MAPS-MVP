/**
 * KAIROS MAPS — Shadow Comparison (Fase 7.9c)
 *
 * Compara baseline runtime (neutro) vs shadow effective profile.
 * Solo datos · sin generación de texto · sin impacto en producto.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.9c-0.1';
  var CHANNELS = ['narrative', 'premium', 'knowledge', 'atmosphere'];

  var Mod = window.KairosIdentityModulation;
  var Shadow = window.KairosIdentityShadowRuntime;

  function round(value, decimals) {
    var factor = Math.pow(10, decimals != null ? decimals : 4);
    return Math.round(value * factor) / factor;
  }

  function buildBaselineDimensions() {
    if (Mod && typeof Mod.getNeutralProfile === 'function') {
      return Object.assign({}, Mod.getNeutralProfile({ reason: 'baseline_runtime' }).dimensions);
    }
    if (window.KairosIdentityModulationProfile &&
        typeof window.KairosIdentityModulationProfile.buildNeutralProfileDimensions === 'function') {
      return window.KairosIdentityModulationProfile.buildNeutralProfileDimensions();
    }
    return {};
  }

  function buildBaselineCoefficients() {
    if (Mod && typeof Mod.buildModulationCoefficients === 'function') {
      var coeffs = Mod.buildModulationCoefficients(null);
      return Object.assign({}, coeffs, { enabled: false });
    }
    return { enabled: false, channels: {}, meta: { neutralFallback: true } };
  }

  function dimensionDelta(baseline, shadow) {
    var delta = {};
    var keys = {};
    Object.keys(baseline || {}).forEach(function (key) { keys[key] = true; });
    Object.keys(shadow || {}).forEach(function (key) { keys[key] = true; });
    Object.keys(keys).forEach(function (key) {
      var baseVal = baseline && baseline[key] != null ? Number(baseline[key]) : 3;
      var shadowVal = shadow && shadow[key] != null ? Number(shadow[key]) : 3;
      delta[key] = round(shadowVal - baseVal, 2);
    });
    return delta;
  }

  function collectChannelScalars(channel) {
    var values = [];
    if (!channel) return values;
    values.push(channel.rhythmBias, channel.densityBias, channel.toneBias);
    Object.keys(channel.weightBoosts || {}).forEach(function (key) {
      values.push(channel.weightBoosts[key]);
    });
    Object.keys(channel.sectionBias || {}).forEach(function (key) {
      values.push(channel.sectionBias[key]);
    });
    return values;
  }

  function channelScalarSum(channel) {
    return collectChannelScalars(channel).reduce(function (sum, value) {
      return sum + Math.abs(Number(value) || 0);
    }, 0);
  }

  function coefficientDelta(baselineCoeffs, shadowCoeffs) {
    var delta = {};
    CHANNELS.forEach(function (channel) {
      var baseChannel = baselineCoeffs.channels && baselineCoeffs.channels[channel];
      var shadowChannel = shadowCoeffs.channels && shadowCoeffs.channels[channel];
      delta[channel] = {
        rhythmBias: round((shadowChannel && shadowChannel.rhythmBias || 0) - (baseChannel && baseChannel.rhythmBias || 0)),
        densityBias: round((shadowChannel && shadowChannel.densityBias || 0) - (baseChannel && baseChannel.densityBias || 0)),
        toneBias: round((shadowChannel && shadowChannel.toneBias || 0) - (baseChannel && baseChannel.toneBias || 0)),
        scalarMagnitude: round(channelScalarSum(shadowChannel) - channelScalarSum(baseChannel))
      };
    });
    return delta;
  }

  function buildDeltaSummary(baselineDims, shadowDims, dimDelta, coeffDelta, shadowResult) {
    var changedDims = Object.keys(dimDelta).filter(function (key) {
      return dimDelta[key] !== 0;
    });
    var maxDimDelta = 0;
    changedDims.forEach(function (key) {
      var abs = Math.abs(dimDelta[key]);
      if (abs > maxDimDelta) maxDimDelta = abs;
    });

    var totalCoeffDelta = 0;
    var dominantChannel = null;
    var dominantMagnitude = -1;
    CHANNELS.forEach(function (channel) {
      var magnitude = Math.abs(coeffDelta[channel].scalarMagnitude);
      totalCoeffDelta += magnitude;
      if (magnitude > dominantMagnitude) {
        dominantMagnitude = magnitude;
        dominantChannel = channel;
      }
    });

    var metadata = shadowResult && shadowResult.shadowMetadata ? shadowResult.shadowMetadata : {};

    return {
      neutralFallback: metadata.neutralFallback === true,
      identityResolved: !!(shadowResult && shadowResult.identityArchetype),
      identityChanged: !!(shadowResult && shadowResult.identityArchetype),
      dimensionsChanged: changedDims.length,
      dimensionKeysChanged: changedDims,
      maxDimensionDelta: maxDimDelta,
      totalCoefficientDelta: round(totalCoeffDelta),
      dominantChannel: dominantChannel,
      modulationWouldApply: false,
      runtimeImpact: 'none',
      editorialFamilyUnchanged: true
    };
  }

  function computeComparison(citySlug) {
    var shadowResult = Shadow && typeof Shadow.computeShadowIdentity === 'function'
      ? Shadow.computeShadowIdentity(citySlug)
      : null;

    var baselineDimensions = buildBaselineDimensions();
    var baselineCoefficients = buildBaselineCoefficients();
    var shadowDimensions = shadowResult && shadowResult.effectiveProfile
      ? shadowResult.effectiveProfile
      : (shadowResult && shadowResult.dimensionProfile
        ? shadowResult.dimensionProfile
        : baselineDimensions);
    var shadowCoefficients = shadowResult && shadowResult.modulationCoefficients
      ? shadowResult.modulationCoefficients
      : baselineCoefficients;
    var dimDelta = dimensionDelta(baselineDimensions, shadowDimensions);
    var coeffDelta = coefficientDelta(baselineCoefficients, shadowCoefficients);
    var editorialFamily = shadowResult && shadowResult.shadowMetadata
      ? shadowResult.shadowMetadata.editorialFamily
      : null;

    return {
      schemaVersion: SCHEMA_VERSION,
      citySlug: shadowResult && shadowResult.citySlug != null ? shadowResult.citySlug : citySlug,
      editorialFamily: editorialFamily,
      identityArchetype: {
        baseline: null,
        shadow: shadowResult && shadowResult.identityArchetype,
        changed: !!(shadowResult && shadowResult.identityArchetype)
      },
      profiles: shadowResult
        ? {
          baseProfile: shadowResult.baseProfile,
          citySignature: shadowResult.citySignature,
          effectiveProfile: shadowResult.effectiveProfile,
          signatureApplied: shadowResult.trace && shadowResult.trace.signatureApplied === true
        }
        : null,
      dimensions: {
        baseline: baselineDimensions,
        shadow: shadowDimensions,
        delta: dimDelta
      },
      coefficients: {
        baseline: baselineCoefficients,
        shadow: shadowCoefficients,
        delta: coeffDelta
      },
      deltaSummary: buildDeltaSummary(
        baselineDimensions,
        shadowDimensions,
        dimDelta,
        coeffDelta,
        shadowResult
      )
    };
  }

  window.KairosShadowComparison = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CHANNELS: CHANNELS.slice(),
    computeComparison: computeComparison
  };
})();
