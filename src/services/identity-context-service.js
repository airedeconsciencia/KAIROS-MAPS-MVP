/**
 * KAIROS MAPS — Identity Context Service (Fase 8.0)
 *
 * Transporta identityContext en el pipeline editorial sin modulación activa.
 * enabled siempre false · sin impacto en copy · fail-soft.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '8.0-0.1';

  var PILOT_ALIASES = {
    lisboa: 'lisboa-pt',
    toronto: 'toronto-ca',
    ciudad_del_cabo: 'ciudad-del-cabo-za',
    barcelona: 'barcelona-es',
    tokio: 'tokio-jp'
  };

  function getShadow() {
    return window.KairosIdentityShadowRuntime;
  }

  function getIndex() {
    return window.KairosCityIdentityIndex;
  }

  function getCatalog() {
    return window.KairosCitiesCatalog;
  }

  function normalizeCitySlug(citySlug) {
    if (citySlug == null) return null;
    var slug = String(citySlug).trim();
    return slug || null;
  }

  function resolveCanonicalCitySlug(citySlug) {
    var slug = normalizeCitySlug(citySlug);
    var Index = getIndex();
    var Catalog = getCatalog();
    if (!slug) return null;

    if (Index && typeof Index.hasCityIdentity === 'function' && Index.hasCityIdentity(slug)) {
      return slug;
    }

    if (PILOT_ALIASES[slug] && Index && Index.hasCityIdentity(PILOT_ALIASES[slug])) {
      return PILOT_ALIASES[slug];
    }

    if (Catalog && typeof Catalog.cityIdFromRef === 'function' && Catalog.CITIES) {
      var i;
      for (i = 0; i < Catalog.CITIES.length; i += 1) {
        var city = Catalog.CITIES[i];
        if (Catalog.cityIdFromRef(city) === slug) return slug;
        if (Catalog.slugify && Catalog.slugify(city.name) === slug.replace(/-/g, '')) {
          return Catalog.cityIdFromRef(city);
        }
      }
    }

    if (Index && typeof Index.listCityIdentities === 'function') {
      var matches = Index.listCityIdentities().filter(function (entry) {
        return entry.citySlug === slug || entry.citySlug.indexOf(slug + '-') === 0;
      });
      if (matches.length === 1) return matches[0].citySlug;
    }

    return slug;
  }

  function resolveIdentitySlugFromCity(city) {
    var Catalog = getCatalog();
    if (!city) return null;
    if (Catalog && typeof Catalog.cityIdFromRef === 'function') {
      return Catalog.cityIdFromRef(city);
    }
    return null;
  }

  function buildNeutralSignature() {
    return {
      found: false,
      adjustments: {},
      confidence: null,
      revision: null
    };
  }

  function buildNeutralEffectiveProfile() {
    var Profile = window.KairosIdentityModulationProfile;
    var dims = Profile && typeof Profile.buildNeutralProfileDimensions === 'function'
      ? Profile.buildNeutralProfileDimensions()
      : {};
    var signature = buildNeutralSignature();
    if (window.KairosCitySignatures && typeof window.KairosCitySignatures.zeroAdjustments === 'function') {
      signature.adjustments = window.KairosCitySignatures.zeroAdjustments();
    }
    return {
      baseProfile: Object.assign({}, dims),
      citySignature: signature,
      effectiveProfile: Object.assign({}, dims),
      signatureApplied: false
    };
  }

  function buildNeutralContext(citySlug, reason) {
    var slug = normalizeCitySlug(citySlug);
    var bundle = buildNeutralEffectiveProfile();
    return {
      enabled: false,
      citySlug: slug,
      editorialFamily: null,
      identityArchetype: null,
      citySignature: bundle.citySignature,
      effectiveProfile: bundle.effectiveProfile,
      confidence: null,
      shadowMetadata: {
        schemaVersion: SCHEMA_VERSION,
        mode: 'shadow',
        citySlug: slug,
        found: false,
        neutralFallback: true,
        reason: reason || 'neutral_fallback',
        editorialFamily: null,
        confidence: null,
        status: null,
        signatureApplied: false,
        modulationApplied: false,
        runtimeImpact: 'none',
        modulationEnabled: false
      },
      trace: {
        schemaVersion: SCHEMA_VERSION,
        enabled: false,
        source: 'identity_context',
        reason: reason || 'neutral_fallback',
        canonicalCitySlug: slug,
        pipelineAttached: true
      }
    };
  }

  function buildIdentityContext(citySlug) {
    var canonicalSlug = resolveCanonicalCitySlug(citySlug);
    if (!canonicalSlug) {
      return buildNeutralContext(null, 'missing_city_slug');
    }

    var Shadow = getShadow();
    var Index = getIndex();
    if (Shadow && typeof Shadow.computeShadowIdentity === 'function') {
      var shadow = Shadow.computeShadowIdentity(canonicalSlug);
      var meta = shadow.shadowMetadata || {};
      var cityIdentity = Index && Index.getCityIdentity
        ? Index.getCityIdentity(canonicalSlug)
        : null;

      return {
        enabled: false,
        citySlug: canonicalSlug,
        editorialFamily: meta.editorialFamily || null,
        identityArchetype: shadow.identityArchetype || null,
        citySignature: shadow.citySignature || buildNeutralSignature(),
        effectiveProfile: shadow.effectiveProfile || {},
        confidence: (cityIdentity && cityIdentity.confidence) || meta.confidence || null,
        shadowMetadata: meta,
        trace: Object.assign({}, shadow.trace || {}, {
          schemaVersion: SCHEMA_VERSION,
          enabled: false,
          source: 'identity_context',
          canonicalCitySlug: canonicalSlug,
          pipelineAttached: true,
          shadowSchema: shadow.trace && shadow.trace.schemaVersion
        })
      };
    }

    return buildNeutralContext(canonicalSlug, 'shadow_runtime_unavailable');
  }

  function buildIdentityContextFromCity(city) {
    return buildIdentityContext(resolveIdentitySlugFromCity(city));
  }

  window.KairosIdentityContext = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    buildIdentityContext: buildIdentityContext,
    buildIdentityContextFromCity: buildIdentityContextFromCity,
    resolveCanonicalCitySlug: resolveCanonicalCitySlug,
    _dev: {
      PILOT_ALIASES: PILOT_ALIASES,
      resolveIdentitySlugFromCity: resolveIdentitySlugFromCity
    }
  };
})();
