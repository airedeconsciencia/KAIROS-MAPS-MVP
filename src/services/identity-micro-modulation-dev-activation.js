/**
 * KAIROS MAPS — Identity Micro Modulation Controlled Activation (Fase 8.7)
 *
 * DEV-only gate para activar Baseline V1 en preview/staging.
 * Feature flag default OFF · sin cableado prod · sin deploy.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '8.7-0.1';
  var DEFAULT_ENABLED = false;
  var ALLOWED_VARIABLES = ['toneBias', 'rhythmBias'];

  function getMicro() {
    return window.KairosIdentityMicroModulation;
  }

  function getPremium() {
    return window.KairosCityPremiumComposition;
  }

  function resolveCanarySlug() {
    var Micro = getMicro();
    return Micro && Micro.CANARY_CITY_SLUG ? Micro.CANARY_CITY_SLUG : 'lisboa-pt';
  }

  function resolveMaxStrength() {
    var Micro = getMicro();
    return Micro && Micro.MAX_MODULATION_STRENGTH != null
      ? Micro.MAX_MODULATION_STRENGTH
      : 0.5;
  }

  function clampStrength(value) {
    var max = resolveMaxStrength();
    var n = Number(value);
    if (isNaN(n) || n < 0) return 0;
    if (n > max) return max;
    return n;
  }

  function isExplicitlyEnabled(options) {
    options = options || {};
    if (options.controlledActivationEnabled === true) return true;
    if (options.controlledActivation && options.controlledActivation.enabled === true) return true;
    return false;
  }

  function buildActivationState(options) {
    options = options || {};
    var Micro = getMicro();
    var enabled = isExplicitlyEnabled(options);
    return {
      schemaVersion: SCHEMA_VERSION,
      devOnly: true,
      defaultEnabled: DEFAULT_ENABLED,
      controlledActivationEnabled: enabled,
      canaryCitySlug: resolveCanarySlug(),
      maxModulationStrength: resolveMaxStrength(),
      contractSchemaVersion: Micro && Micro.CONTRACT_SCHEMA_VERSION,
      variablesActive: ALLOWED_VARIABLES.slice(),
      prodWiring: false
    };
  }

  function validateBaselineScope(options) {
    options = options || {};
    var Micro = getMicro();
    var warnings = [];
    var ok = true;

    if (!Micro) {
      return { ok: false, warnings: ['missing_micro_modulation_service'] };
    }

    if (options.variablesActive) {
      (options.variablesActive || []).forEach(function (variable) {
        if (ALLOWED_VARIABLES.indexOf(variable) === -1) {
          ok = false;
          warnings.push('variable_not_allowed:' + variable);
        }
      });
    }

    var strength = clampStrength(options.modulationStrength);
    if (options.modulationStrength != null && strength !== Number(options.modulationStrength)) {
      warnings.push('strength_capped:' + resolveMaxStrength());
    }

    if (options.citySlug && options.citySlug !== resolveCanarySlug()) {
      warnings.push('non_canary_city:' + options.citySlug);
    }

    return {
      ok: ok,
      warnings: warnings,
      modulationStrength: strength,
      canaryCitySlug: resolveCanarySlug(),
      variablesActive: ALLOWED_VARIABLES.slice()
    };
  }

  function composeBaseReading(premiumInput) {
    var Premium = getPremium();
    if (!Premium || typeof Premium.composeCityReading !== 'function') {
      return {
        ok: false,
        warnings: ['missing_premium_composition'],
        meta: { schemaVersion: SCHEMA_VERSION, devOnly: true }
      };
    }
    var baseReading = Premium.composeCityReading(premiumInput);
    if (!baseReading || !baseReading.sections) {
      return {
        ok: false,
        warnings: ['base_reading_failed'],
        meta: { schemaVersion: SCHEMA_VERSION, devOnly: true }
      };
    }
    return { ok: true, baseReading: baseReading };
  }

  function buildSkippedResult(baseReading, premiumInput, options, activationState) {
    var Micro = getMicro();
    var identityContext = premiumInput && premiumInput.identityContext;
    var IdentityCtx = window.KairosIdentityContext;
    if (!identityContext && IdentityCtx && typeof IdentityCtx.buildIdentityContextFromCity === 'function') {
      identityContext = IdentityCtx.buildIdentityContextFromCity(premiumInput.city);
    }
    var applyPolicy = Micro && typeof Micro.buildApplyPolicy === 'function'
      ? Micro.buildApplyPolicy(identityContext)
      : { allowed: false, reasons: ['activation_disabled'] };
    var contract = Micro && typeof Micro.buildModulationContractV1 === 'function'
      ? Micro.buildModulationContractV1(identityContext, { modulationStrength: 0 })
      : { enabled: false, contractSchemaVersion: '1.0.0' };

    return {
      ok: true,
      reading: baseReading,
      baseReading: baseReading,
      envelope: {
        identityModulationContract: contract,
        applyPolicy: applyPolicy,
        readingContext: Micro && typeof Micro.buildDefaultReadingContext === 'function'
          ? Micro.buildDefaultReadingContext(premiumInput.readingContext)
          : (premiumInput.readingContext || { mode: 'city_reading', locale: 'es', subjectScope: 'individual' })
      },
      comparison: {
        byteIdentical: true,
        meaningStable: true,
        sectionsAffected: 0,
        identical: { sections: true, astroInvariants: true }
      },
      metrics: {
        modulationStrength: 0,
        meaningStability: 1,
        sectionsAffected: 0,
        gate: 'activation_disabled'
      },
      applied: null,
      warnings: ['controlled_activation_disabled'],
      activation: activationState,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        devOnly: true,
        controlledActivationEnabled: false,
        canaryApplied: false
      }
    };
  }

  function composeReadingWithControlledActivation(premiumInput, options) {
    options = options || {};
    var activationState = buildActivationState(options);
    var scope = validateBaselineScope(options);
    var base = composeBaseReading(premiumInput);

    if (!base.ok) return Object.assign({}, base, { activation: activationState });

    if (!isExplicitlyEnabled(options)) {
      return buildSkippedResult(base.baseReading, premiumInput, options, activationState);
    }

    var Micro = getMicro();
    if (!Micro || typeof Micro.composeWithMicroModulation !== 'function') {
      return {
        ok: false,
        warnings: ['missing_micro_modulation_service'],
        activation: activationState,
        meta: { schemaVersion: SCHEMA_VERSION, devOnly: true }
      };
    }

    var strength = clampStrength(options.modulationStrength);
    var result = Micro.composeWithMicroModulation(
      premiumInput,
      Object.assign({}, options, { modulationStrength: strength })
    );

    return Object.assign({}, result, {
      activation: Object.assign({}, activationState, {
        controlledActivationEnabled: true,
        scope: scope
      }),
      meta: Object.assign({}, result.meta || {}, {
        controlledActivationSchemaVersion: SCHEMA_VERSION,
        controlledActivationEnabled: true,
        devOnly: true
      })
    });
  }

  window.KairosIdentityMicroModulationDevActivation = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    DEFAULT_ENABLED: DEFAULT_ENABLED,
    ALLOWED_VARIABLES: ALLOWED_VARIABLES.slice(),
    buildActivationState: buildActivationState,
    isControlledActivationEnabled: isExplicitlyEnabled,
    validateBaselineScope: validateBaselineScope,
    composeReadingWithControlledActivation: composeReadingWithControlledActivation
  };
})();
