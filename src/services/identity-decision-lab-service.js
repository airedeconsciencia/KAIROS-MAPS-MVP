/**
 * KAIROS MAPS — Identity Decision Lab (Fase 8.2)
 *
 * Laboratorio DEV: comparación lectura base vs simulación virtual Nivel A (Contract v1.0).
 * No modifica narrative / premium / knowledge · no escribe en runtime productivo.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '8.2-0.1';
  var CONTRACT_SCHEMA_VERSION = '1.0.0';
  var COEFF_MIN = -0.3;
  var COEFF_MAX = 0.3;
  var SECTION_IDS = ['favorece', 'desafia', 'observar', 'aprovecha', 'integracion'];
  var PREMIUM_SECTION_MAP = {
    sintesis: 'narrative',
    favorece: 'premium',
    desafia: 'premium',
    aprovecha: 'premium',
    observar: 'premium',
    integracion: 'premium'
  };

  var LAB_READING_MODES = {
    city_reading: true,
    relocation: true,
    couple: true,
    ai_assistant: true
  };

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals != null ? decimals : 4);
    return Math.round(value * factor) / factor;
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function stableSerialize(value) {
    return JSON.stringify(value);
  }

  function zeroSectionBias() {
    var bias = {};
    SECTION_IDS.forEach(function (id) {
      bias[id] = 0;
    });
    return bias;
  }

  function buildDefaultReadingContext(options) {
    options = options || {};
    var mode = options.mode || 'city_reading';
    return {
      mode: LAB_READING_MODES[mode] ? mode : 'city_reading',
      locale: options.locale || 'es',
      subjectScope: options.subjectScope === 'dyad' ? 'dyad' : 'individual'
    };
  }

  function buildApplyPolicy(identityContext) {
    var meta = identityContext && identityContext.shadowMetadata;
    var status = meta && meta.status;
    var neutral = !!(meta && meta.neutralFallback) ||
      !identityContext ||
      !identityContext.identityArchetype;
    var review = status === 'review_required';
    return {
      allowed: !neutral && !review,
      reasons: []
        .concat(neutral ? ['neutral_fallback'] : [])
        .concat(review ? ['review_required'] : [])
    };
  }

  function coeffsFromEffectiveProfile(effectiveProfile, archetypeSlug) {
    var Mod = window.KairosIdentityModulation;
    if (Mod && typeof Mod.buildModulationCoefficients === 'function' && archetypeSlug) {
      return Mod.buildModulationCoefficients(archetypeSlug, { enabled: false });
    }
    return Mod && typeof Mod.buildModulationCoefficients === 'function'
      ? Mod.buildModulationCoefficients(null)
      : { enabled: false, channels: {}, meta: { neutralFallback: true } };
  }

  function mapChannelScalars(channelCoeffs) {
    if (!channelCoeffs) {
      return {
        toneBias: 0,
        rhythmBias: 0,
        densityBias: 0,
        sectionBias: zeroSectionBias()
      };
    }
    var sectionBias = zeroSectionBias();
    SECTION_IDS.forEach(function (id) {
      sectionBias[id] = channelCoeffs.sectionBias && channelCoeffs.sectionBias[id] != null
        ? channelCoeffs.sectionBias[id]
        : 0;
    });
    return {
      toneBias: channelCoeffs.toneBias != null ? channelCoeffs.toneBias : 0,
      rhythmBias: channelCoeffs.rhythmBias != null ? channelCoeffs.rhythmBias : 0,
      densityBias: channelCoeffs.densityBias != null ? channelCoeffs.densityBias : 0,
      sectionBias: sectionBias
    };
  }

  function buildModulationContractV1(identityContext, options) {
    options = options || {};
    var coeffs = coeffsFromEffectiveProfile(
      identityContext && identityContext.effectiveProfile,
      identityContext && identityContext.identityArchetype
    );
    var channels = coeffs.channels || {};
    var strength = options.modulationStrength != null
      ? clamp(Number(options.modulationStrength), 0, 1)
      : 0;

    return {
      contractSchemaVersion: CONTRACT_SCHEMA_VERSION,
      enabled: false,
      modulationStrength: strength,
      channels: {
        narrative: mapChannelScalars(channels.narrative),
        atmosphere: mapChannelScalars(channels.atmosphere),
        knowledge: mapChannelScalars(channels.knowledge),
        premium: mapChannelScalars(channels.premium)
      },
      meta: {
        schemaVersion: SCHEMA_VERSION,
        archetypeSlug: identityContext && identityContext.identityArchetype,
        neutralFallback: !!(coeffs.meta && coeffs.meta.neutralFallback),
        labVirtualOnly: true
      }
    };
  }

  function deriveAtmosphereWeight(rhythmBias, sectionBiasObservar) {
    var rhythm = Number(rhythmBias) || 0;
    var observar = Number(sectionBiasObservar) || 0;
    return round(clamp((rhythm * 0.55 + observar * 0.45 + COEFF_MAX) / (COEFF_MAX * 2), 0, 1), 4);
  }

  function effectiveScalar(bias, strength) {
    return round((Number(bias) || 0) * (Number(strength) || 0), 4);
  }

  function applyToneVirtual(text, effectiveTone) {
    if (!text || Math.abs(effectiveTone) < 0.0001) return text;
    var out = String(text);
    if (effectiveTone > 0) {
      if (effectiveTone > 0.08) out = out.replace(/\bpodría\b/g, 'puede');
      if (effectiveTone > 0.15) out = out.replace(/\bpodrían\b/g, 'pueden');
    } else {
      if (effectiveTone < -0.08) out = out.replace(/\bpuede\b/g, 'podría');
      if (effectiveTone < -0.15) out = out.replace(/\bpueden\b/g, 'podrían');
    }
    return out;
  }

  function applyRhythmVirtual(text, effectiveRhythm) {
    if (!text || Math.abs(effectiveRhythm) < 0.0001) return text;
    var out = String(text);
    if (effectiveRhythm > 0.05) {
      out = out.replace(/([^,.\n]{72,}?),(\s+)/, '$1,\n$2');
    }
    if (effectiveRhythm < -0.05 && out.indexOf('\n') === -1) {
      out = out.replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/,'$1\n\n');
    }
    return out;
  }

  function applyDensityVirtual(text, effectiveDensity) {
    if (!text || Math.abs(effectiveDensity) < 0.0001) return text;
    var parts = String(text).split(/(?<=[.!?])\s+/).filter(Boolean);
    if (effectiveDensity < -0.05 && parts.length > 2) {
      return parts.slice(0, parts.length - 1).join(' ');
    }
    return text;
  }

  function channelForSection(sectionId) {
    return PREMIUM_SECTION_MAP[sectionId] || 'premium';
  }

  function simulateReadingSections(sections, contract, strength, applyPolicy) {
    var clone = deepClone(sections || []);
    var warnings = [];
    var applied = [];
    var strengthUse = applyPolicy && applyPolicy.allowed === false ? 0 : strength;

    if (!strengthUse || strengthUse <= 0) {
      return {
        sections: clone,
        applied: applied,
        warnings: warnings.concat(applyPolicy && !applyPolicy.allowed ? ['apply_policy_blocked'] : [])
      };
    }

    var premium = contract.channels.premium;
    var narrative = contract.channels.narrative;
    var atmosphere = contract.channels.atmosphere;
    var atmosphereWeight = deriveAtmosphereWeight(
      atmosphere.rhythmBias,
      premium.sectionBias.observar
    );

    applied.push({
      modulationStrength: strengthUse,
      atmosphereWeight: atmosphereWeight,
      toneBias: effectiveScalar(premium.toneBias, strengthUse),
      rhythmBias: effectiveScalar(narrative.rhythmBias, strengthUse),
      densityBias: effectiveScalar(premium.densityBias, strengthUse),
      sectionBias: SECTION_IDS.reduce(function (acc, id) {
        acc[id] = effectiveScalar(premium.sectionBias[id], strengthUse);
        return acc;
      }, {})
    });

    clone.forEach(function (section) {
      var id = section.id;
      var channelKey = channelForSection(id);
      var channel = channelKey === 'narrative' ? narrative : premium;
      var tone = effectiveScalar(channel.toneBias, strengthUse);
      var rhythm = effectiveScalar(
        id === 'observar'
          ? narrative.rhythmBias + atmosphere.rhythmBias * atmosphereWeight
          : channel.rhythmBias,
        strengthUse
      );
      var density = effectiveScalar(premium.densityBias, strengthUse);
      var sectionBoost = premium.sectionBias[id] != null ? premium.sectionBias[id] : 0;
      tone += effectiveScalar(sectionBoost, strengthUse) * 0.35;
      rhythm += effectiveScalar(sectionBoost, strengthUse) * 0.25;

      var before = section.body;
      var after = before;
      after = applyToneVirtual(after, tone);
      after = applyRhythmVirtual(after, rhythm);
      after = applyDensityVirtual(after, density);
      section.body = after;
      if (before !== after) {
        warnings.push('section_changed:' + id);
      }
    });

    return { sections: clone, applied: applied, warnings: warnings };
  }

  function extractAstroInvariants(reading) {
    var meta = reading && reading.meta ? reading.meta : {};
    var nc = meta.narrativeContext || {};
    return {
      influencesUsed: deepClone(meta.influencesUsed || []),
      deepInfluenceKeys: (nc.deepInfluenceKeys || []).slice(),
      dominantTheme: nc.dominantTheme ? {
        label: nc.dominantTheme.label,
        themes: (nc.dominantTheme.themes || []).slice()
      } : null,
      centralTension: nc.centralTension ? nc.centralTension.label : null,
      goalId: meta.goalId || null,
      aspect: meta.aspect || null
    };
  }

  function compareSectionBodies(baseSections, simSections) {
    var diffs = [];
    var affected = 0;
    var baseChars = 0;
    var changedChars = 0;

    (baseSections || []).forEach(function (baseSec, idx) {
      var simSec = simSections[idx] || {};
      var before = baseSec.body || '';
      var after = simSec.body || '';
      baseChars += before.length;
      if (before !== after) {
        affected += 1;
        changedChars += Math.abs(after.length - before.length);
        diffs.push({
          sectionId: baseSec.id,
          changed: true,
          beforeLength: before.length,
          afterLength: after.length,
          beforePreview: before.slice(0, 120),
          afterPreview: after.slice(0, 120)
        });
      } else {
        diffs.push({ sectionId: baseSec.id, changed: false });
      }
    });

    var changePercent = baseChars > 0 ? round((changedChars / baseChars) * 100, 2) : 0;
    return {
      diffs: diffs,
      sectionsAffected: affected,
      changePercent: changePercent
    };
  }

  function meanIntensity(applied) {
    if (!applied || !applied.length) return 0;
    var entry = applied[0];
    var values = [
      Math.abs(entry.toneBias || 0),
      Math.abs(entry.rhythmBias || 0),
      Math.abs(entry.densityBias || 0)
    ];
    SECTION_IDS.forEach(function (id) {
      values.push(Math.abs((entry.sectionBias && entry.sectionBias[id]) || 0));
    });
    var sum = values.reduce(function (a, b) { return a + b; }, 0);
    return round(sum / values.length, 4);
  }

  function buildPremiumInput(input) {
    var city = input.city;
    var goalId = input.goal || 'amor';
    return Object.assign({}, input, {
      city: city,
      goal: goalId,
      profile: input.profile || { name: 'Lab' }
    });
  }

  function runComparison(input) {
    input = input || {};
    var warnings = [];
    var Premium = window.KairosCityPremiumComposition;
    var IdentityCtx = window.KairosIdentityContext;

    if (!Premium || typeof Premium.composeCityReading !== 'function') {
      return {
        ok: false,
        warnings: ['missing_premium_composition'],
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }

    var premiumInput = buildPremiumInput(input);
    var baseReading = Premium.composeCityReading(premiumInput);
    if (!baseReading || !baseReading.sections) {
      return {
        ok: false,
        warnings: ['base_reading_failed'],
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }

    var identityContext = IdentityCtx && typeof IdentityCtx.buildIdentityContextFromCity === 'function'
      ? IdentityCtx.buildIdentityContextFromCity(input.city)
      : null;

    var readingContext = buildDefaultReadingContext(input.readingContext);
    var applyPolicy = buildApplyPolicy(identityContext);
    var modulationStrength = input.modulationStrength != null
      ? clamp(Number(input.modulationStrength), 0, 1)
      : (applyPolicy.allowed ? 1 : 0);

    var contract = buildModulationContractV1(identityContext, { modulationStrength: modulationStrength });

    if (!applyPolicy.allowed) {
      warnings.push('apply_policy_denied');
      modulationStrength = 0;
      contract.modulationStrength = 0;
    }

    var simulation = simulateReadingSections(
      baseReading.sections,
      contract,
      modulationStrength,
      applyPolicy
    );

    var sectionCompare = compareSectionBodies(baseReading.sections, simulation.sections);
    var baseAstro = extractAstroInvariants(baseReading);
    var simReading = deepClone(baseReading);
    simReading.sections = simulation.sections;
    simReading.meta = deepClone(baseReading.meta);
    simReading.meta.labSimulated = true;

    var astroStable = stableSerialize(extractAstroInvariants(simReading)) === stableSerialize(baseAstro);
    var byteIdentical = stableSerialize(baseReading.sections) === stableSerialize(simulation.sections);

    if (!astroStable) warnings.push('astro_invariant_violation');
    warnings = warnings.concat(simulation.warnings);

    var identical = {
      astroInvariants: astroStable,
      sections: byteIdentical,
      influencesUsed: stableSerialize(baseAstro.influencesUsed),
      deepInfluenceKeys: (baseAstro.deepInfluenceKeys || []).join(','),
      goalId: baseAstro.goalId,
      dominantThemeLabel: baseAstro.dominantTheme && baseAstro.dominantTheme.label
    };

    return {
      ok: true,
      blocking: false,
      envelope: {
        readingContext: readingContext,
        applyPolicy: applyPolicy,
        identityModulationContract: contract
      },
      base: {
        sections: deepClone(baseReading.sections),
        meta: {
          wordCount: baseReading.meta && baseReading.meta.wordCount,
          influencesUsed: baseAstro.influencesUsed,
          goalId: baseAstro.goalId
        }
      },
      simulated: {
        sections: simulation.sections,
        variablesApplied: simulation.applied,
        meta: { labVirtual: true }
      },
      comparison: {
        diffs: sectionCompare.diffs,
        identical: identical,
        byteIdentical: byteIdentical,
        meaningStable: astroStable
      },
      metrics: {
        changePercent: sectionCompare.changePercent,
        sectionsAffected: sectionCompare.sectionsAffected,
        meanIntensity: meanIntensity(simulation.applied),
        meaningStability: astroStable ? 1 : 0,
        modulationStrength: modulationStrength
      },
      warnings: warnings,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        contractSchemaVersion: CONTRACT_SCHEMA_VERSION,
        citySlug: identityContext && identityContext.citySlug,
        identityArchetype: identityContext && identityContext.identityArchetype,
        editorialFamily: identityContext && identityContext.editorialFamily
      }
    };
  }

  function runCitySample(cityNameOrSlug, options) {
    options = options || {};
    var Catalog = window.KairosCitiesCatalog;
    if (!Catalog) return { ok: false, warnings: ['missing_catalog'] };

    var city = null;
    var slug = null;
    if (typeof cityNameOrSlug === 'string' && cityNameOrSlug.indexOf('-') !== -1) {
      slug = cityNameOrSlug;
      city = Catalog.CITIES.find(function (c) {
        return Catalog.cityIdFromRef(c) === slug;
      }) || null;
    } else {
      city = Catalog.findCityByName(cityNameOrSlug);
      slug = city ? Catalog.cityIdFromRef(city) : cityNameOrSlug;
    }

    if (!city && slug !== 'reykjavik-is') {
      return { ok: false, warnings: ['city_not_found'], citySlug: slug };
    }

    if (!city) {
      city = { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 };
    }

    return runComparison(Object.assign({}, options, { city: city }));
  }

  window.KairosIdentityDecisionLab = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CONTRACT_SCHEMA_VERSION: CONTRACT_SCHEMA_VERSION,
    SECTION_IDS: SECTION_IDS.slice(),
    buildDefaultReadingContext: buildDefaultReadingContext,
    buildApplyPolicy: buildApplyPolicy,
    buildModulationContractV1: buildModulationContractV1,
    deriveAtmosphereWeight: deriveAtmosphereWeight,
    simulateReadingSections: simulateReadingSections,
    runComparison: runComparison,
    runCitySample: runCitySample,
    extractAstroInvariants: extractAstroInvariants,
    _dev: {
      effectiveScalar: effectiveScalar,
      compareSectionBodies: compareSectionBodies
    }
  };
})();
