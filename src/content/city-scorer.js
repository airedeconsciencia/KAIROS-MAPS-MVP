/**
 * KAIROS MAPS — City scorer (Fase 3.8b · Cities Layer Lite)
 * Scoring determinista: GoalContext + Bridge + proximidad a líneas.
 * Sin DOM, sin motores, sin IA.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '1.0.0';
  var DEFAULT_PROX_KM = 500;
  var DEFAULT_MAX_SUGGESTIONS = 3;
  var DEFAULT_MIN_SCORE = 0.28;

  var COUNTRY_CODES = {
    'España': 'es',
    'Portugal': 'pt',
    'Francia': 'fr',
    'Reino Unido': 'uk',
    'Italia': 'it',
    'Alemania': 'de',
    'Países Bajos': 'nl',
    'Grecia': 'gr',
    'Suecia': 'se',
    'Turquía': 'tr',
    'EE. UU.': 'us',
    'Canadá': 'ca',
    'México': 'mx',
    'Argentina': 'ar',
    'Brasil': 'br',
    'Perú': 'pe',
    'Japón': 'jp',
    'Corea del Sur': 'kr',
    'Tailandia': 'th',
    'Singapur': 'sg',
    'India': 'in',
    'Sudáfrica': 'za',
    'Egipto': 'eg',
    'Kenia': 'ke',
    'Australia': 'au',
    'Nueva Zelanda': 'nz'
  };

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function cityIdFromRef(city) {
    var cc = COUNTRY_CODES[city.country] || slugify(city.country).slice(0, 2) || 'xx';
    return slugify(city.name) + '-' + cc;
  }

  function normalizeOptions(input) {
    var opts = (input && input.options) || {};
    return {
      proxKm: opts.proxKm != null ? opts.proxKm : DEFAULT_PROX_KM,
      maxSuggestions: opts.maxSuggestions != null ? opts.maxSuggestions : DEFAULT_MAX_SUGGESTIONS,
      minScore: opts.minScore != null ? opts.minScore : DEFAULT_MIN_SCORE,
      enabledPlanets: opts.enabledPlanets || null,
      enabledAngles: opts.enabledAngles || null
    };
  }

  function isLineEnabled(line, options) {
    var planets = options.enabledPlanets;
    var angles = options.enabledAngles;
    if (planets) {
      var planetOk = planets.has
        ? planets.has(line.planet)
        : planets.indexOf(line.planet) !== -1;
      if (!planetOk) return false;
    }
    if (angles) {
      var angleOk = angles.has
        ? angles.has(line.angle)
        : angles.indexOf(line.angle) !== -1;
      if (!angleOk) return false;
    }
    return true;
  }

  function distanceFn(input) {
    if (input && typeof input.distanceKmToLine === 'function') {
      return input.distanceKmToLine;
    }
    if (window.KairosAstro && typeof window.KairosAstro.distanceKmToLine === 'function') {
      return window.KairosAstro.distanceKmToLine;
    }
    return null;
  }

  function bridgeMatchScore(lineId, bridgeResult) {
    if (!bridgeResult || !bridgeResult.ok) return 0;
    var matches = bridgeResult.matches || [];
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].lineId === lineId) return matches[i].score;
    }
    return 0;
  }

  function goalBoostForLine(line, goalContext) {
    var es = goalContext && goalContext.effectiveScoring;
    if (!es) return 0;
    var planetBoosts = es.planetBoosts || {};
    var angleBoosts = es.angleBoosts || {};
    var parts = [];
    if (planetBoosts[line.planet] != null) parts.push(planetBoosts[line.planet]);
    if (angleBoosts[line.angle] != null) parts.push(angleBoosts[line.angle]);
    if (!parts.length) return 0;
    var total = 0;
    parts.forEach(function (p) { total += p; });
    return total / parts.length;
  }

  function strengthFromDist(distKm, proxKm) {
    return Math.max(1, Math.min(5, Math.round(5 - (distKm / proxKm) * 5)));
  }

  function lineIntensity(distKm, proxKm) {
    return strengthFromDist(distKm, proxKm) / 5;
  }

  function lineScoreMeta(item, input, options) {
    var proxKm = options.proxKm;
    var bridgeScore = bridgeMatchScore(item.line.id, input.bridgeResult);
    var goalBoost = goalBoostForLine(item.line, input.goalContext);
    var distNorm = 1 - Math.min(item.distKm / proxKm, 1);
    var bridgeReady = input.bridgeResult && input.bridgeResult.ok === true;
    var composite;

    if (!input.goalContext) {
      composite = distNorm;
    } else if (bridgeReady) {
      composite = (bridgeScore * 0.40) + (goalBoost * 0.35) + (distNorm * 0.25);
    } else {
      composite = (goalBoost * 0.55) + (distNorm * 0.45);
    }

    return {
      line: item.line,
      distKm: item.distKm,
      lineId: item.line.id,
      bridgeScore: bridgeScore,
      goalBoost: goalBoost,
      composite: composite
    };
  }

  function rankInfluences(city, input) {
    if (!city || !input || !Array.isArray(input.lines) || !input.lines.length) return [];

    var options = normalizeOptions(input);
    var distToLine = distanceFn(input);
    if (!distToLine) return [];

    var items = input.lines
      .filter(function (line) { return isLineEnabled(line, options); })
      .map(function (line) {
        return {
          line: line,
          distKm: distToLine(city.lat, city.lon, line.segments)
        };
      })
      .filter(function (item) { return item.distKm < options.proxKm; });

    if (!input.goalContext) {
      return items
        .sort(function (a, b) { return a.distKm - b.distKm; })
        .map(function (item) { return lineScoreMeta(item, input, options); });
    }

    return items
      .map(function (item) { return lineScoreMeta(item, input, options); })
      .sort(function (a, b) {
        if (b.composite !== a.composite) return b.composite - a.composite;
        return a.distKm - b.distKm;
      });
  }

  function buildReasonKeys(goalId, topLines, bridgeResult) {
    var keys = ['goal_' + (goalId || 'amor')];
    if (topLines.length) {
      var bestDist = topLines[0].distKm;
      if (bestDist < 200) keys.push('line_proximity_high');
      else if (bestDist < 400) keys.push('line_proximity_medium');
      else keys.push('line_proximity_low');
    }
    var priority = (bridgeResult && bridgeResult.priorityLines) || [];
    var hasBridge = topLines.some(function (tl) {
      return priority.indexOf(tl.lineId) !== -1;
    });
    if (hasBridge) keys.push('bridge_signal_present');
    return keys;
  }

  function scoreCity(city, input) {
    if (!city || !input) return null;
    if (!input.goalContext) return null;
    if (!input.bridgeResult || !input.bridgeResult.ok) return null;

    var options = normalizeOptions(input);
    var ranked = rankInfluences(city, input);
    if (!ranked.length) return null;

    var best = ranked[0];
    var second = ranked[1] || null;
    var priority = input.bridgeResult.priorityLines || [];
    var bridgePriorityBonus = ranked.slice(0, 2).some(function (item) {
      return priority.indexOf(item.lineId) !== -1;
    }) ? 1.0 : 0.0;

    var cityScore =
      (best.composite * 0.55) +
      ((second ? second.composite : 0) * 0.25) +
      (lineIntensity(best.distKm, options.proxKm) * 0.10) +
      (bridgePriorityBonus * 0.10);

    if (cityScore < options.minScore) return null;

    var goalId = input.goalContext.primary && input.goalContext.primary.id
      ? input.goalContext.primary.id
      : 'amor';
    var aspectKey = input.goalContext.primary && input.goalContext.primary.aspectKey
      ? input.goalContext.primary.aspectKey
      : goalId;

    var topLines = ranked.slice(0, 2).map(function (item) {
      return {
        lineId: item.lineId,
        distKm: Math.round(item.distKm),
        bridgeScore: item.bridgeScore,
        goalBoost: item.goalBoost,
        lineScore: item.composite
      };
    });

    var reasonKeys = buildReasonKeys(goalId, topLines, input.bridgeResult);
    var Templates = window.KairosCitySummaryTemplates;
    var humanSummary = Templates && typeof Templates.buildHumanSummary === 'function'
      ? Templates.buildHumanSummary(goalId, reasonKeys)
      : '';

    return {
      schemaVersion: SCHEMA_VERSION,
      cityId: cityIdFromRef(city),
      cityName: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      score: cityScore,
      primaryGoal: goalId,
      aspectKey: aspectKey,
      topLines: topLines,
      reasonKeys: reasonKeys,
      humanSummary: humanSummary
    };
  }

  function scoreCities(input) {
    var emptyMeta = {
      goalId: null,
      citiesEvaluated: 0,
      citiesWithSignal: 0,
      proxKm: DEFAULT_PROX_KM,
      bridgeApplied: false
    };

    if (!input || !Array.isArray(input.cities) || !input.cities.length) {
      return { ok: false, suggestions: [], meta: emptyMeta };
    }
    if (!input.goalContext) {
      return { ok: false, suggestions: [], meta: emptyMeta };
    }
    if (!input.bridgeResult || !input.bridgeResult.ok) {
      return { ok: false, suggestions: [], meta: emptyMeta };
    }
    if (!Array.isArray(input.lines) || !input.lines.length) {
      return { ok: false, suggestions: [], meta: emptyMeta };
    }

    var options = normalizeOptions(input);
    var goalId = input.goalContext.primary && input.goalContext.primary.id
      ? input.goalContext.primary.id
      : null;

    var scored = [];
    var withSignal = 0;

    input.cities.forEach(function (city) {
      var suggestion = scoreCity(city, input);
      if (suggestion) {
        withSignal += 1;
        scored.push(suggestion);
      }
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.cityName.localeCompare(b.cityName, 'es');
    });

    var suggestions = scored.slice(0, options.maxSuggestions);

    return {
      ok: suggestions.length > 0,
      suggestions: suggestions,
      meta: {
        goalId: goalId,
        citiesEvaluated: input.cities.length,
        citiesWithSignal: withSignal,
        proxKm: options.proxKm,
        bridgeApplied: true
      }
    };
  }

  window.KairosCityScorer = {
    schemaVersion: SCHEMA_VERSION,
    PROX_KM: DEFAULT_PROX_KM,
    rankInfluences: rankInfluences,
    scoreCity: scoreCity,
    scoreCities: scoreCities,
    strengthFromDist: strengthFromDist
  };
})();
