/**
 * KAIROS MAPS — Identity Micro Modulation (Fase 8.5A–8.5B)
 *
 * DEV visible: toneBias V1 + rhythmBias V1 (T1) · canario Lisboa.
 * Post-composición sobre lectura premium · no cableado en prod.
 * No modifica narrative / premium / knowledge / bridge / goal / scorer.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '8.5b-0.1';
  var TONE_THRESHOLD_DIRECT = 0.08;
  var TONE_THRESHOLD_PLURAL = 0.15;
  var RHYTHM_THRESHOLD = 0.05;
  var CONTRACT_SCHEMA_VERSION = '1.0.0';
  var COEFF_MIN = -0.3;
  var COEFF_MAX = 0.3;
  var CANARY_CITY_SLUG = 'lisboa-pt';
  var MAX_MODULATION_STRENGTH = 0.5;
  var RHYTHM_V1_SECTION_ID = 'sintesis';
  var SECTION_IDS = ['favorece', 'desafia', 'observar', 'aprovecha', 'integracion'];
  var PREMIUM_SECTION_MAP = {
    sintesis: 'narrative',
    favorece: 'premium',
    desafia: 'premium',
    aprovecha: 'premium',
    observar: 'premium',
    integracion: 'premium'
  };

  var READING_MODES = {
    city_reading: true,
    relocation: true,
    couple: true,
    ai_assistant: true
  };

  var LEXICAL_GUARD_TOKEN_PREFIX = '\uE000LG';
  var LEXICAL_GUARD_TOKEN_SUFFIX = '\uE001';
  var LEXICAL_GUARD_PROTECTED = [
    { id: 'puede_que', pattern: /\bpuede que\b/gi },
    { id: 'pueden_que', pattern: /\bpueden que\b/gi }
  ];

  var STRUCTURE_GUARD_TOKEN_PREFIX = '\uE000SG';
  var STRUCTURE_GUARD_TOKEN_SUFFIX = '\uE001';

  function maskProtectedExpressions(text, prefix, suffix, patterns, slots) {
    var out = String(text || '');
    slots = slots || [];
    (patterns || []).forEach(function (entry) {
      out = out.replace(entry.pattern, function (match) {
        var token = prefix + slots.length + suffix;
        slots.push({ id: entry.id, token: token, value: match });
        return token;
      });
    });
    return { masked: out, slots: slots };
  }

  function unmaskProtectedExpressions(text, slots) {
    var out = String(text || '');
    (slots || []).forEach(function (slot) {
      out = out.split(slot.token).join(slot.value);
    });
    return out;
  }

  function applyLexicalGuard(text) {
    return maskProtectedExpressions(
      text,
      LEXICAL_GUARD_TOKEN_PREFIX,
      LEXICAL_GUARD_TOKEN_SUFFIX,
      LEXICAL_GUARD_PROTECTED
    );
  }

  function restoreLexicalGuard(maskedText, guardResult) {
    return unmaskProtectedExpressions(maskedText, guardResult && guardResult.slots);
  }

  function maskEmDashSpans(text) {
    var slots = [];
    var out = String(text || '');
    out = out.replace(/—[^.!?\n]+(?:[.!?])?/g, function (match) {
      var token = STRUCTURE_GUARD_TOKEN_PREFIX + slots.length + STRUCTURE_GUARD_TOKEN_SUFFIX;
      slots.push({ id: 'em_dash_span', token: token, value: match });
      return token;
    });
    return { masked: out, slots: slots };
  }

  function restoreEmDashGuard(maskedText, guardResult) {
    return unmaskProtectedExpressions(maskedText, guardResult && guardResult.slots);
  }

  function splitSentences(text) {
    return String(text || '').split(/(?<=[.!?…])\s+/).filter(function (s) {
      return s.trim();
    });
  }

  function compositionAuthorityAllowsRhythm(sectionId, body) {
    if (sectionId !== RHYTHM_V1_SECTION_ID) {
      return { allowed: false, reason: 'section_not_rhythm_v1' };
    }
    var text = String(body || '');
    if (text.indexOf('\n') !== -1) {
      return { allowed: false, reason: 'premium_line_break_present' };
    }
    if (splitSentences(text).length < 2) {
      return { allowed: false, reason: 'insufficient_sentences' };
    }
    return { allowed: true, reason: null };
  }

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
      mode: READING_MODES[mode] ? mode : 'city_reading',
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
    var Mod = window.KairosIdentityModulation;
    var coeffs = Mod && typeof Mod.buildModulationCoefficients === 'function' &&
      identityContext && identityContext.identityArchetype
      ? Mod.buildModulationCoefficients(identityContext.identityArchetype, { enabled: false })
      : (Mod && typeof Mod.buildModulationCoefficients === 'function'
        ? Mod.buildModulationCoefficients(null)
        : { enabled: false, channels: {}, meta: { neutralFallback: true } });
    var channels = coeffs.channels || {};
    var strength = options.modulationStrength != null
      ? clamp(Number(options.modulationStrength), 0, MAX_MODULATION_STRENGTH)
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
        microModulationDevOnly: true,
        variablesActive: ['toneBias', 'rhythmBias']
      }
    };
  }

  function effectiveScalar(bias, strength) {
    return round((Number(bias) || 0) * (Number(strength) || 0), 4);
  }

  function scaledToneThreshold(base, strength) {
    var strengthUse = clamp(Number(strength) || 0, 0, MAX_MODULATION_STRENGTH);
    if (!strengthUse) return base;
    return round(base * strengthUse, 4);
  }

  function scaledRhythmThreshold(base, strength) {
    return scaledToneThreshold(base, strength);
  }

  function toneThresholdsForStrength(strength) {
    return {
      direct: scaledToneThreshold(TONE_THRESHOLD_DIRECT, strength),
      plural: scaledToneThreshold(TONE_THRESHOLD_PLURAL, strength)
    };
  }

  function rhythmThresholdForStrength(strength) {
    return scaledRhythmThreshold(RHYTHM_THRESHOLD, strength);
  }

  function applyToneTransformRaw(text, effectiveTone, strength) {
    if (!text || Math.abs(effectiveTone) < 0.0001) return text;
    var thresholds = toneThresholdsForStrength(strength);
    var out = String(text);
    if (effectiveTone > 0) {
      if (effectiveTone > thresholds.direct) out = out.replace(/\bpodría\b/g, 'puede');
      if (effectiveTone > thresholds.plural) out = out.replace(/\bpodrían\b/g, 'pueden');
    } else {
      if (effectiveTone < -thresholds.direct) out = out.replace(/\bpuede\b/g, 'podría');
      if (effectiveTone < -thresholds.plural) out = out.replace(/\bpueden\b/g, 'podrían');
    }
    return out;
  }

  function applyToneTransform(text, effectiveTone, strength) {
    if (!text || Math.abs(effectiveTone) < 0.0001) return text;
    var guarded = applyLexicalGuard(text);
    var transformed = applyToneTransformRaw(guarded.masked, effectiveTone, strength);
    return restoreLexicalGuard(transformed, guarded);
  }

  function applySentenceParagraphBreakT1(text, effectiveRhythm, strength) {
    if (!text || Math.abs(effectiveRhythm) < 0.0001) return text;
    var threshold = rhythmThresholdForStrength(strength);
    if (effectiveRhythm >= -threshold) return text;

    var dashGuard = maskEmDashSpans(text);
    var lexicalGuard = applyLexicalGuard(dashGuard.masked);
    var out = lexicalGuard.masked;
    out = out.replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/g, function (match, punct, offset, whole) {
      var windowText = whole.slice(Math.max(0, offset - 8), offset + match.length + 8);
      if (windowText.indexOf('—') !== -1 ||
        windowText.indexOf(STRUCTURE_GUARD_TOKEN_PREFIX) !== -1) {
        return match;
      }
      return punct + '\n\n';
    });
    out = restoreLexicalGuard(out, lexicalGuard);
    out = restoreEmDashGuard(out, dashGuard);
    return out;
  }

  function applyRhythmTransformT1(text, effectiveRhythm, strength, sectionId) {
    if (!text || sectionId !== RHYTHM_V1_SECTION_ID) return text;
    var authority = compositionAuthorityAllowsRhythm(sectionId, text);
    if (!authority.allowed) return text;
    return applySentenceParagraphBreakT1(text, effectiveRhythm, strength);
  }

  function channelForSection(sectionId) {
    return PREMIUM_SECTION_MAP[sectionId] || 'premium';
  }

  function resolveCitySlug(input) {
    var IdentityCtx = window.KairosIdentityContext;
    var Catalog = window.KairosCitiesCatalog;
    if (input && input.citySlug) {
      return IdentityCtx && typeof IdentityCtx.resolveCanonicalCitySlug === 'function'
        ? IdentityCtx.resolveCanonicalCitySlug(input.citySlug)
        : String(input.citySlug).trim();
    }
    if (input && input.city && Catalog && typeof Catalog.cityIdFromRef === 'function') {
      return IdentityCtx && typeof IdentityCtx.resolveCanonicalCitySlug === 'function'
        ? IdentityCtx.resolveCanonicalCitySlug(Catalog.cityIdFromRef(input.city))
        : Catalog.cityIdFromRef(input.city);
    }
    return null;
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

  function compareSectionBodies(baseSections, modSections) {
    var affected = 0;
    (baseSections || []).forEach(function (baseSec, idx) {
      var modSec = modSections[idx] || {};
      if ((baseSec.body || '') !== (modSec.body || '')) affected += 1;
    });
    return affected;
  }

  function applyMicroModulationToSections(sections, contract, strength, applyPolicy, citySlug) {
    var clone = deepClone(sections || []);
    var warnings = [];
    var gate = 'blocked';
    var strengthUse = 0;

    if (citySlug !== CANARY_CITY_SLUG) {
      return {
        sections: clone,
        applied: null,
        warnings: warnings.concat(['canary_city_mismatch']),
        gate: 'not_canary',
        strengthUse: 0,
        byteIdentical: true
      };
    }

    if (!applyPolicy || applyPolicy.allowed !== true) {
      return {
        sections: clone,
        applied: null,
        warnings: warnings.concat(['apply_policy_blocked']),
        gate: 'apply_policy_blocked',
        strengthUse: 0,
        byteIdentical: true
      };
    }

    strengthUse = clamp(Number(strength) || 0, 0, MAX_MODULATION_STRENGTH);
    if (!strengthUse || strengthUse <= 0) {
      return {
        sections: clone,
        applied: null,
        warnings: warnings,
        gate: 'strength_zero',
        strengthUse: 0,
        byteIdentical: true
      };
    }

    gate = 'canary_applied';
    var narrative = contract.channels.narrative;
    var premium = contract.channels.premium;
    var toneThresholds = toneThresholdsForStrength(strengthUse);
    var rhythmThreshold = rhythmThresholdForStrength(strengthUse);
    var effectiveRhythmNarrative = effectiveScalar(narrative.rhythmBias, strengthUse);
    var applied = {
      variables: ['toneBias', 'rhythmBias'],
      modulationStrength: strengthUse,
      canaryCitySlug: CANARY_CITY_SLUG,
      thresholds: toneThresholds,
      toneBias: {
        narrative: effectiveScalar(narrative.toneBias, strengthUse),
        premium: effectiveScalar(premium.toneBias, strengthUse)
      },
      rhythmBias: {
        narrative: effectiveRhythmNarrative,
        threshold: rhythmThreshold,
        t1Section: RHYTHM_V1_SECTION_ID
      }
    };

    clone.forEach(function (section) {
      var id = section.id;
      var channelKey = channelForSection(id);
      var channel = channelKey === 'narrative' ? narrative : premium;
      var tone = effectiveScalar(channel.toneBias, strengthUse);
      var before = section.body;
      var after = applyToneTransform(before, tone, strengthUse);

      if (id === RHYTHM_V1_SECTION_ID) {
        var rhythmBefore = after;
        after = applyRhythmTransformT1(after, effectiveRhythmNarrative, strengthUse, id);
        if (rhythmBefore !== after) {
          warnings.push('rhythm_changed:' + id);
        }
      }

      section.body = after;
      if (before !== after) {
        warnings.push('section_changed:' + id);
      }
    });

    return {
      sections: clone,
      applied: applied,
      warnings: warnings,
      gate: gate,
      strengthUse: strengthUse,
      byteIdentical: compareSectionBodies(sections, clone) === 0
    };
  }

  function applyToneBiasToSections(sections, contract, strength, applyPolicy, citySlug) {
    return applyMicroModulationToSections(sections, contract, strength, applyPolicy, citySlug);
  }

  function applyMicroModulation(reading, input) {
    input = input || {};
    var warnings = [];

    if (!reading || !reading.sections) {
      return {
        ok: false,
        warnings: ['missing_reading'],
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }

    var IdentityCtx = window.KairosIdentityContext;
    var identityContext = input.identityContext;
    if (!identityContext && IdentityCtx && typeof IdentityCtx.buildIdentityContextFromCity === 'function') {
      identityContext = IdentityCtx.buildIdentityContextFromCity(input.city);
    } else if (!identityContext && IdentityCtx && typeof IdentityCtx.buildIdentityContext === 'function') {
      identityContext = IdentityCtx.buildIdentityContext(resolveCitySlug(input));
    }

    var citySlug = resolveCitySlug(input) ||
      (identityContext && identityContext.citySlug) ||
      null;
    var readingContext = buildDefaultReadingContext(input.readingContext);
    var applyPolicy = buildApplyPolicy(identityContext);
    var modulationStrength = input.modulationStrength != null
      ? clamp(Number(input.modulationStrength), 0, MAX_MODULATION_STRENGTH)
      : 0;

    if (!applyPolicy.allowed) {
      modulationStrength = 0;
    }

    var contract = buildModulationContractV1(identityContext, { modulationStrength: modulationStrength });
    contract.modulationStrength = modulationStrength;

    var baseAstro = extractAstroInvariants(reading);
    var modulation = applyMicroModulationToSections(
      reading.sections,
      contract,
      modulationStrength,
      applyPolicy,
      citySlug
    );

    warnings = warnings.concat(modulation.warnings);
    if (modulation.gate === 'not_canary') {
      warnings.push('non_canary_no_op');
    }

    var modReading = deepClone(reading);
    modReading.sections = modulation.sections;
    modReading.meta = deepClone(reading.meta || {});
    modReading.meta.microModulation = {
      schemaVersion: SCHEMA_VERSION,
      gate: modulation.gate,
      canaryCitySlug: CANARY_CITY_SLUG,
      variables: ['toneBias', 'rhythmBias'],
      modulationStrength: modulation.strengthUse
    };

    var astroStable = stableSerialize(extractAstroInvariants(modReading)) === stableSerialize(baseAstro);
    if (!astroStable) warnings.push('astro_invariant_violation');

    var byteIdentical = stableSerialize(reading.sections) === stableSerialize(modulation.sections);

    return {
      ok: true,
      reading: modReading,
      envelope: {
        readingContext: readingContext,
        applyPolicy: applyPolicy,
        identityModulationContract: contract
      },
      applied: modulation.applied,
      comparison: {
        byteIdentical: byteIdentical,
        meaningStable: astroStable,
        sectionsAffected: compareSectionBodies(reading.sections, modulation.sections),
        identical: {
          astroInvariants: astroStable,
          sections: byteIdentical,
          goalId: baseAstro.goalId,
          dominantThemeLabel: baseAstro.dominantTheme && baseAstro.dominantTheme.label
        }
      },
      metrics: {
        modulationStrength: modulation.strengthUse,
        meaningStability: astroStable ? 1 : 0,
        sectionsAffected: compareSectionBodies(reading.sections, modulation.sections),
        gate: modulation.gate
      },
      warnings: warnings,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        contractSchemaVersion: CONTRACT_SCHEMA_VERSION,
        citySlug: citySlug,
        canaryCitySlug: CANARY_CITY_SLUG,
        canaryApplied: modulation.gate === 'canary_applied',
        identityArchetype: identityContext && identityContext.identityArchetype,
        editorialFamily: identityContext && identityContext.editorialFamily,
        devOnly: true
      }
    };
  }

  function composeWithMicroModulation(premiumInput, options) {
    options = options || {};
    var Premium = window.KairosCityPremiumComposition;
    if (!Premium || typeof Premium.composeCityReading !== 'function') {
      return {
        ok: false,
        warnings: ['missing_premium_composition'],
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }
    var baseReading = Premium.composeCityReading(premiumInput);
    if (!baseReading || !baseReading.sections) {
      return {
        ok: false,
        warnings: ['base_reading_failed'],
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }
    var result = applyMicroModulation(baseReading, Object.assign({}, premiumInput, options));
    if (!result.ok) return result;
    return Object.assign({}, result, { baseReading: baseReading });
  }

  window.KairosIdentityMicroModulation = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CONTRACT_SCHEMA_VERSION: CONTRACT_SCHEMA_VERSION,
    CANARY_CITY_SLUG: CANARY_CITY_SLUG,
    MAX_MODULATION_STRENGTH: MAX_MODULATION_STRENGTH,
    TONE_THRESHOLD_DIRECT: TONE_THRESHOLD_DIRECT,
    TONE_THRESHOLD_PLURAL: TONE_THRESHOLD_PLURAL,
    RHYTHM_THRESHOLD: RHYTHM_THRESHOLD,
    RHYTHM_V1_SECTION_ID: RHYTHM_V1_SECTION_ID,
    SECTION_IDS: SECTION_IDS.slice(),
    buildDefaultReadingContext: buildDefaultReadingContext,
    buildApplyPolicy: buildApplyPolicy,
    buildModulationContractV1: buildModulationContractV1,
    applyToneTransform: applyToneTransform,
    applyRhythmTransformT1: applyRhythmTransformT1,
    applySentenceParagraphBreakT1: applySentenceParagraphBreakT1,
    compositionAuthorityAllowsRhythm: compositionAuthorityAllowsRhythm,
    applyLexicalGuard: applyLexicalGuard,
    restoreLexicalGuard: restoreLexicalGuard,
    maskEmDashSpans: maskEmDashSpans,
    restoreEmDashGuard: restoreEmDashGuard,
    LEXICAL_GUARD_PROTECTED: LEXICAL_GUARD_PROTECTED.map(function (entry) {
      return { id: entry.id, pattern: entry.pattern.source, flags: entry.pattern.flags };
    }),
    scaledToneThreshold: scaledToneThreshold,
    scaledRhythmThreshold: scaledRhythmThreshold,
    toneThresholdsForStrength: toneThresholdsForStrength,
    rhythmThresholdForStrength: rhythmThresholdForStrength,
    applyMicroModulation: applyMicroModulation,
    composeWithMicroModulation: composeWithMicroModulation,
    extractAstroInvariants: extractAstroInvariants,
    _dev: {
      effectiveScalar: effectiveScalar,
      applyToneBiasToSections: applyToneBiasToSections,
      applyMicroModulationToSections: applyMicroModulationToSections,
      compareSectionBodies: compareSectionBodies,
      scaledToneThreshold: scaledToneThreshold,
      scaledRhythmThreshold: scaledRhythmThreshold,
      applyToneTransformRaw: applyToneTransformRaw,
      applySentenceParagraphBreakT1: applySentenceParagraphBreakT1,
      maskProtectedExpressions: maskProtectedExpressions,
      unmaskProtectedExpressions: unmaskProtectedExpressions,
      splitSentences: splitSentences
    }
  };
})();
