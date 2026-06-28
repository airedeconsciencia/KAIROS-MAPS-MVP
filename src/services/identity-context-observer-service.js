/**
 * KAIROS MAPS — Identity Context Observer (Fase 8.1)
 *
 * Capa DEV read-only para inspeccionar identityContext en el pipeline.
 * No escribe · no decide · no genera copy · warnings no bloqueantes.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '8.1-0.1';

  var REQUIRED_FIELDS = [
    'enabled',
    'citySlug',
    'editorialFamily',
    'identityArchetype',
    'citySignature',
    'effectiveProfile',
    'confidence',
    'shadowMetadata',
    'trace'
  ];

  function hash32(text) {
    var h = 2166136261;
    var i;
    var str = String(text || '');
    for (i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function stableSerialize(value) {
    return JSON.stringify(value);
  }

  function profileDimensionCount() {
    var Profile = window.KairosIdentityModulationProfile;
    if (Profile && Profile.PROFILE_DIMENSION_SLUGS) {
      return Profile.PROFILE_DIMENSION_SLUGS.length;
    }
    return 10;
  }

  function pushWarning(warnings, code) {
    if (warnings.indexOf(code) === -1) warnings.push(code);
  }

  function observeIdentityContext(identityContext, options) {
    options = options || {};
    var warnings = [];
    var missingFields = [];
    var i;

    if (!identityContext || typeof identityContext !== 'object') {
      return {
        ok: false,
        blocking: false,
        schemaVersion: SCHEMA_VERSION,
        warnings: ['missing_identity_context'],
        missingFields: REQUIRED_FIELDS.slice(),
        summary: null,
        integrity: {
          requiredFieldsPresent: [],
          enabledFalse: false,
          runtimeImpactNone: false,
          modulationAppliedFalse: false
        },
        payloadBytes: 0,
        snapshotHash: null,
        trace: null,
        shadowMetadata: null,
        effectiveProfile: null
      };
    }

    for (i = 0; i < REQUIRED_FIELDS.length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(identityContext, REQUIRED_FIELDS[i])) {
        missingFields.push(REQUIRED_FIELDS[i]);
        pushWarning(warnings, 'missing_field_' + REQUIRED_FIELDS[i]);
      }
    }

    if (identityContext.enabled !== false) {
      pushWarning(warnings, 'enabled_not_false');
    }

    if (identityContext.shadowMetadata) {
      if (identityContext.shadowMetadata.modulationEnabled === true) {
        pushWarning(warnings, 'modulation_enabled_in_metadata');
      }
      if (identityContext.shadowMetadata.modulationApplied === true) {
        pushWarning(warnings, 'modulation_applied_in_metadata');
      }
      if (identityContext.shadowMetadata.runtimeImpact &&
          identityContext.shadowMetadata.runtimeImpact !== 'none') {
        pushWarning(warnings, 'runtime_impact_not_none');
      }
      if (identityContext.shadowMetadata.neutralFallback === true) {
        pushWarning(warnings, 'neutral_fallback:' + (identityContext.shadowMetadata.reason || 'unknown'));
      }
      if (identityContext.shadowMetadata.status === 'review_required') {
        pushWarning(warnings, 'review_required_city');
      }
    }

    var expectedDims = profileDimensionCount();
    var effectiveProfile = identityContext.effectiveProfile || {};
    var effectiveDimCount = Object.keys(effectiveProfile).length;
    if (identityContext.identityArchetype && effectiveDimCount < expectedDims) {
      pushWarning(warnings, 'incomplete_effective_profile');
    }

    if (identityContext.citySignature &&
        identityContext.citySignature.found === false &&
        identityContext.identityArchetype) {
      pushWarning(warnings, 'signature_not_found');
    }

    var payloadBytes = stableSerialize(identityContext).length;
    var snapshotHash = hash32(stableSerialize(identityContext));

    var summary = {
      citySlug: identityContext.citySlug,
      editorialFamily: identityContext.editorialFamily,
      identityArchetype: identityContext.identityArchetype,
      confidence: identityContext.confidence,
      enabled: identityContext.enabled,
      signatureApplied: !!(identityContext.shadowMetadata &&
        identityContext.shadowMetadata.signatureApplied),
      neutralFallback: !!(identityContext.shadowMetadata &&
        identityContext.shadowMetadata.neutralFallback),
      effectiveProfileDimCount: effectiveDimCount,
      payloadBytes: payloadBytes,
      warningCount: warnings.length
    };

    var presentFields = REQUIRED_FIELDS.filter(function (field) {
      return Object.prototype.hasOwnProperty.call(identityContext, field);
    });

    return {
      ok: missingFields.length === 0 && identityContext.enabled === false,
      blocking: false,
      schemaVersion: SCHEMA_VERSION,
      warnings: warnings,
      missingFields: missingFields,
      summary: summary,
      integrity: {
        requiredFieldsPresent: presentFields,
        enabledFalse: identityContext.enabled === false,
        runtimeImpactNone: !identityContext.shadowMetadata ||
          identityContext.shadowMetadata.runtimeImpact === 'none',
        modulationAppliedFalse: !identityContext.shadowMetadata ||
          identityContext.shadowMetadata.modulationApplied === false
      },
      payloadBytes: payloadBytes,
      snapshotHash: snapshotHash,
      trace: identityContext.trace || null,
      shadowMetadata: identityContext.shadowMetadata || null,
      effectiveProfile: identityContext.effectiveProfile || null,
      source: options.source || 'direct'
    };
  }

  function verifyIdentityContextUnchanged(before, after) {
    return stableSerialize(before) === stableSerialize(after);
  }

  function observeBuiltContext(citySlug, options) {
    options = options || {};
    var IdentityCtx = window.KairosIdentityContext;
    if (!IdentityCtx || typeof IdentityCtx.buildIdentityContext !== 'function') {
      return {
        ok: false,
        blocking: false,
        schemaVersion: SCHEMA_VERSION,
        warnings: ['identity_context_service_missing'],
        mutationDetected: false,
        citySlug: citySlug
      };
    }

    var built = IdentityCtx.buildIdentityContext(citySlug);
    var before = deepClone(built);
    var report = observeIdentityContext(before, {
      source: options.source || 'buildIdentityContext'
    });
    report.citySlug = citySlug;
    report.mutationDetected = !verifyIdentityContextUnchanged(before, built);
    if (report.mutationDetected) {
      pushWarning(report.warnings, 'observer_mutated_context');
    }
    report.identityContext = before;
    return report;
  }

  function observePipelineIdentityContext(identityContext, options) {
    options = options || {};
    var before = identityContext ? deepClone(identityContext) : null;
    var report = observeIdentityContext(before, {
      source: options.source || 'pipeline'
    });
    report.pipelineAttached = true;
    report.mutationDetected = identityContext
      ? !verifyIdentityContextUnchanged(before, identityContext)
      : false;
    if (report.mutationDetected) {
      pushWarning(report.warnings, 'pipeline_context_mutated');
    }
    report.identityContext = before;
    return report;
  }

  function observeAllCatalogCities() {
    var Catalog = window.KairosCitiesCatalog;
    if (!Catalog || !Catalog.CITIES || typeof Catalog.cityIdFromRef !== 'function') {
      return {
        ok: false,
        blocking: false,
        schemaVersion: SCHEMA_VERSION,
        warnings: ['missing_cities_catalog'],
        results: []
      };
    }

    var results = Catalog.CITIES.map(function (city) {
      var slug = Catalog.cityIdFromRef(city);
      return observeBuiltContext(slug, { source: 'catalog_scan' });
    });

    var enabledViolations = results.filter(function (r) {
      return r.identityContext && r.identityContext.enabled !== false;
    }).length;
    var mutations = results.filter(function (r) { return r.mutationDetected; }).length;
    var missingOk = results.filter(function (r) { return !r.ok; }).length;

    return {
      ok: enabledViolations === 0 && mutations === 0,
      blocking: false,
      schemaVersion: SCHEMA_VERSION,
      cityCount: results.length,
      enabledViolations: enabledViolations,
      mutationCount: mutations,
      notOkCount: missingOk,
      results: results
    };
  }

  window.KairosIdentityContextObserver = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    REQUIRED_FIELDS: REQUIRED_FIELDS.slice(),
    observeIdentityContext: observeIdentityContext,
    observeBuiltContext: observeBuiltContext,
    observePipelineIdentityContext: observePipelineIdentityContext,
    observeAllCatalogCities: observeAllCatalogCities,
    verifyIdentityContextUnchanged: verifyIdentityContextUnchanged,
    _dev: {
      hash32: hash32,
      stableSerialize: stableSerialize
    }
  };
})();
