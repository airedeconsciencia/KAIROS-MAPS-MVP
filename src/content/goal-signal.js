/**
 * KAIROS MAPS — GoalSignal registry (Fase 3.7c.1)
 *
 * Política determinista mainGoal → scoring geo reutilizable (Bridge, Cities, …).
 * Sin DOM, sin motores, sin copy interpretativo.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '1.0.0';

  var GOALS = {
    amor: {
      schemaVersion: SCHEMA_VERSION,
      id: 'amor',
      aliases: [],
      humanLabel: 'Amor y relaciones',
      humanQuestion: '¿Dónde puede florecer mi vínculo?',
      aspectKey: 'amor',
      aspectFallback: 'amor',
      scoring: {
        planetBoosts: { venus: 1, luna: 0.85, neptuno: 0.35 },
        angleBoosts: { DC: 1, AC: 0.5, IC: 0.35 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'amor',
        toneHint: 'intimate'
      }
    },
    trabajo: {
      schemaVersion: SCHEMA_VERSION,
      id: 'trabajo',
      aliases: ['profesion'],
      humanLabel: 'Trabajo y propósito',
      humanQuestion: '¿Dónde puedo trabajar mejor?',
      aspectKey: 'trabajo',
      aspectFallback: 'trabajo',
      scoring: {
        planetBoosts: { jupiter: 1, mercurio: 0.85, sol: 0.7, saturno: 0.45 },
        angleBoosts: { MC: 1, AC: 0.45 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'trabajo',
        toneHint: 'professional'
      }
    },
    descanso: {
      schemaVersion: SCHEMA_VERSION,
      id: 'descanso',
      aliases: [],
      humanLabel: 'Descanso y bienestar',
      humanQuestion: '¿Dónde descansa mi sistema?',
      aspectKey: 'descanso',
      aspectFallback: 'descanso',
      scoring: {
        planetBoosts: { luna: 1, venus: 0.7, sol: 0.55, neptuno: 0.45 },
        angleBoosts: { IC: 1, DC: 0.4 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'descanso',
        toneHint: 'restorative'
      }
    },
    viajes: {
      schemaVersion: SCHEMA_VERSION,
      id: 'viajes',
      aliases: ['viaje'],
      humanLabel: 'Viajes y exploración',
      humanQuestion: '¿Dónde conviene explorar ahora?',
      aspectKey: 'descanso',
      aspectFallback: 'descanso',
      scoring: {
        planetBoosts: { jupiter: 0.85, mercurio: 0.75, urano: 0.55 },
        angleBoosts: { AC: 0.9, MC: 0.55 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'viajes',
        toneHint: 'exploratory'
      }
    },
    cambio: {
      schemaVersion: SCHEMA_VERSION,
      id: 'cambio',
      aliases: [],
      humanLabel: 'Cambio de vida',
      humanQuestion: '¿Dónde me conviene reinventarme?',
      aspectKey: 'descanso',
      aspectFallback: 'descanso',
      scoring: {
        planetBoosts: { urano: 1, pluton: 0.75, marte: 0.55 },
        angleBoosts: { AC: 0.85, MC: 0.65 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'cambio',
        toneHint: 'transitional'
      }
    },
    raices: {
      schemaVersion: SCHEMA_VERSION,
      id: 'raices',
      aliases: [],
      humanLabel: 'Sentirme en casa',
      humanQuestion: '¿Dónde me conviene vivir?',
      aspectKey: 'descanso',
      aspectFallback: 'descanso',
      scoring: {
        planetBoosts: { luna: 0.95, venus: 0.8, saturno: 0.4 },
        angleBoosts: { IC: 1, DC: 0.45 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'raices',
        toneHint: 'grounded'
      }
    },
    creatividad: {
      schemaVersion: SCHEMA_VERSION,
      id: 'creatividad',
      aliases: [],
      humanLabel: 'Creatividad e inspiración',
      humanQuestion: '¿Dónde conviene crear e inspirarme?',
      aspectKey: 'trabajo',
      aspectFallback: 'trabajo',
      scoring: {
        planetBoosts: { venus: 0.85, urano: 0.75, neptuno: 0.65, mercurio: 0.55 },
        angleBoosts: { MC: 0.85, AC: 0.6 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'creatividad',
        toneHint: 'creative'
      }
    },
    crecimiento: {
      schemaVersion: SCHEMA_VERSION,
      id: 'crecimiento',
      aliases: [],
      humanLabel: 'Crecer personalmente',
      humanQuestion: '¿Dónde conviene crecer ahora?',
      aspectKey: 'trabajo',
      aspectFallback: 'trabajo',
      scoring: {
        planetBoosts: { jupiter: 1, sol: 0.75, marte: 0.45 },
        angleBoosts: { MC: 0.95, AC: 0.55 },
        bridgeBlend: 0.3
      },
      presentation: {
        templateObjective: 'crecimiento',
        toneHint: 'expansive'
      }
    }
  };

  function cloneSignal(entry) {
    return JSON.parse(JSON.stringify(entry));
  }

  function resolve(rawId) {
    if (rawId == null || rawId === '') return null;
    var key = String(rawId).trim().toLowerCase();
    if (GOALS[key]) return cloneSignal(GOALS[key]);

    var ids = Object.keys(GOALS);
    for (var i = 0; i < ids.length; i++) {
      var goal = GOALS[ids[i]];
      if (goal.aliases && goal.aliases.indexOf(key) !== -1) {
        return cloneSignal(goal);
      }
    }
    return null;
  }

  function resolvePrimary(profile) {
    if (!profile || typeof profile !== 'object') return null;
    if (profile.mainGoal) return resolve(profile.mainGoal);
    if (Array.isArray(profile.mainGoals) && profile.mainGoals.length) {
      return resolve(profile.mainGoals[0]);
    }
    return null;
  }

  function buildEffectiveScoring(primary) {
    if (!primary || !primary.scoring) return null;
    return {
      planetBoosts: primary.scoring.planetBoosts || {},
      angleBoosts: primary.scoring.angleBoosts || {},
      bridgeBlend: primary.scoring.bridgeBlend != null ? primary.scoring.bridgeBlend : 0.3
    };
  }

  function buildContext(profile) {
    var primary = resolvePrimary(profile);
    if (!primary) return null;
    return {
      schemaVersion: SCHEMA_VERSION,
      primary: primary,
      secondary: [],
      scope: 'individual',
      effectiveScoring: buildEffectiveScoring(primary)
    };
  }

  function resolveAspectKey(rawId) {
    var signal = resolve(rawId);
    if (!signal) return null;
    return signal.aspectKey || signal.aspectFallback || null;
  }

  window.KairosGoalSignal = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    GOALS: GOALS,
    resolve: resolve,
    resolvePrimary: resolvePrimary,
    buildContext: buildContext,
    resolveAspectKey: resolveAspectKey
  };
})();
