/**
 * KAIROS MAPS — Country Archetype Service (Fase 3.8f.2 pilot)
 *
 * Resuelve matiz nacional prudente. Fail-soft. Sin motores. Sin DOM.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8f.2-0.1';
  var VALID_GOALS = { amor: true, trabajo: true, descanso: true };
  var VALID_LINES = { moon: true, venus: true, saturn: true };

  var Archetypes = window.KairosCountryArchetypes;
  var Catalog = window.KairosCitiesCatalog;

  function hash32(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function normalizeGoal(goal) {
    var g = String(goal || '').toLowerCase().trim();
    return VALID_GOALS[g] ? g : null;
  }

  function normalizeLinePlanet(linePlanet) {
    var p = String(linePlanet || '').toLowerCase().trim();
    if (p === 'luna') p = 'moon';
    if (p === 'saturno') p = 'saturn';
    return VALID_LINES[p] ? p : null;
  }

  function resolveCountryId(input) {
    if (!input) return null;
    if (input.countryId) return String(input.countryId).trim() || null;
    if (input.city && input.city.country && Catalog) {
      return Catalog.resolveCountryId(input.city.country);
    }
    return null;
  }

  function pickLines(lines, seed, maxPick) {
    if (!lines || !lines.length) return [];
    var max = maxPick != null ? maxPick : 2;
    if (lines.length <= max) return lines.slice();
    var out = [];
    var used = {};
    var i = 0;
    while (out.length < max && i < lines.length * 2) {
      var idx = (seed + i * 9973) % lines.length;
      if (!used[idx]) {
        used[idx] = true;
        out.push(lines[idx]);
      }
      i += 1;
    }
    return out;
  }

  function scanProhibited(text) {
    var warnings = [];
    var patterns = [
      /\bes\s+(piscis|capricornio|sagitario|aries|tauro|géminis|geminis|cáncer|cancer|leo|virgo|libra|escorpio|acuario)\b/i,
      /\b(portugal|españa|francia|japón|japon|italia|brasil|argentina|canadá|canada)\s+es\s+/i
    ];
    patterns.forEach(function (re) {
      if (re.test(text)) warnings.push('deterministic_zodiac_phrase');
    });
    return warnings;
  }

  function buildExampleSnippet(archetype, goal, linePlanet, cityName) {
    if (!archetype) return '';
    var goalLine = archetype.goalModifiers && goal && archetype.goalModifiers[goal]
      ? archetype.goalModifiers[goal][0] : '';
    var lineKey = normalizeLinePlanet(linePlanet);
    var lineLine = lineKey && archetype.lineModifiers && archetype.lineModifiers[lineKey]
      ? archetype.lineModifiers[lineKey][0] : '';
    var place = cityName ? 'En ' + cityName + ', ' : 'En este territorio, ';
    var parts = [];
    if (lineLine) parts.push(lineLine);
    if (goalLine) parts.push(goalLine);
    if (!parts.length && archetype.emotionalClimate) parts.push(archetype.emotionalClimate);
    return place + parts.join(' ');
  }

  function resolveCountryArchetype(input) {
    input = input || {};
    var countryId = resolveCountryId(input);
    var goal = normalizeGoal(input.goal);
    var linePlanet = normalizeLinePlanet(input.linePlanet);
    var city = input.city || null;
    var warnings = [];

    if (!countryId) {
      return {
        ok: false,
        reason: 'missing_country',
        countryId: null,
        archetype: null,
        selectedModifiers: null,
        warnings: warnings,
        meta: { schemaVersion: SCHEMA_VERSION, rulesFired: ['fail_missing_country'] }
      };
    }

    var archetype = Archetypes && Archetypes.getArchetype
      ? Archetypes.getArchetype(countryId)
      : null;

    if (!archetype || archetype.curated !== true) {
      return {
        ok: false,
        reason: 'country_not_curated',
        countryId: countryId,
        archetype: null,
        selectedModifiers: null,
        warnings: warnings,
        meta: { schemaVersion: SCHEMA_VERSION, rulesFired: ['fail_not_curated'] }
      };
    }

    var seedBase = countryId + ':' + (goal || 'none') + ':' + (linePlanet || 'none') + ':' +
      (city && city.name ? city.name : 'city');
    var seed = hash32(seedBase);

    var selectedModifiers = {
      goal: goal,
      linePlanet: linePlanet,
      goalLines: goal ? pickLines(archetype.goalModifiers[goal], seed, 2) : [],
      lineLines: linePlanet ? pickLines(archetype.lineModifiers[linePlanet], seed + 17, 2) : [],
      emotionalClimate: archetype.emotionalClimate || '',
      relationshipTone: archetype.relationshipTone || '',
      workTone: archetype.workTone || '',
      restTone: archetype.restTone || '',
      narrativeImages: pickLines(archetype.narrativeImages, seed + 31, 1),
      opportunities: pickLines(archetype.opportunities, seed + 43, 1),
      cautions: pickLines(archetype.cautions, seed + 59, 1)
    };

    var toneByGoal = {
      amor: archetype.relationshipTone,
      trabajo: archetype.workTone,
      descanso: archetype.restTone
    };
    if (goal && toneByGoal[goal]) {
      selectedModifiers.goalTone = toneByGoal[goal];
    }

    var editorial = Object.assign({}, archetype);
    delete editorial.avoidCliches;
    var blob = JSON.stringify(editorial) + JSON.stringify(selectedModifiers);
    warnings = warnings.concat(scanProhibited(blob));

    return {
      ok: true,
      countryId: countryId,
      archetype: archetype,
      selectedModifiers: selectedModifiers,
      exampleSnippet: buildExampleSnippet(
        archetype,
        goal,
        linePlanet,
        city && city.name ? city.name : archetype.name
      ),
      warnings: warnings,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        seed: seed,
        rulesFired: [
          'country_archetype_resolved',
          goal ? 'goal_' + goal : 'goal_none',
          linePlanet ? 'line_' + linePlanet : 'line_none'
        ]
      }
    };
  }

  window.KairosCountryArchetype = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    PILOT_COUNTRY_IDS: Archetypes ? Archetypes.PILOT_COUNTRY_IDS : [],
    resolveCountryArchetype: resolveCountryArchetype,
    buildExampleSnippet: buildExampleSnippet,
    normalizeGoal: normalizeGoal,
    normalizeLinePlanet: normalizeLinePlanet
  };
})();
