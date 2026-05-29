/**
 * KAIROS MAPS — Natal → Map Bridge service (Fase 3.6b)
 *
 * Prioriza líneas astrocartográficas según tags/themes natal lite.
 * Sin DOM, sin HTML, sin IA, sin copy interpretativo, sin motores.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.1.0-bridge';

  var PRIORITY_HIGH = 0.55;
  var PRIORITY_MEDIUM = 0.35;
  var MAX_PRIORITY_LINES = 5;

  /** Peso tag → planetas (ids astro.js: sol, luna, mercurio, …) */
  var TAG_PLANET_WEIGHTS = {
    communication: { mercurio: 1, sol: 0.45 },
    stimulation: { mercurio: 0.85, marte: 0.55, sol: 0.35 },
    reflection: { mercurio: 0.7, saturno: 0.45, luna: 0.35 },
    emotional_safety: { luna: 1, venus: 0.55 },
    intimacy: { luna: 0.85, venus: 0.9 },
    protection: { luna: 0.7, saturno: 0.55, pluton: 0.35 },
    movement: { marte: 1, mercurio: 0.35 },
    initiative: { marte: 0.95, sol: 0.55, jupiter: 0.35 },
    regulation: { saturno: 0.85, luna: 0.45, marte: 0.3 },
    visibility: { sol: 1, jupiter: 0.65, marte: 0.35 },
    harmony: { venus: 0.9, luna: 0.45, jupiter: 0.35 },
    belonging: { luna: 0.75, venus: 0.7 },
    expansion: { jupiter: 1, sol: 0.4 },
    precision: { mercurio: 0.65, saturno: 0.75 },
    intensity: { pluton: 0.75, marte: 0.65, luna: 0.4 },
    permeability: { luna: 0.8, neptuno: 0.55 },
    reserve: { saturno: 0.8, pluton: 0.45 },
    control: { saturno: 0.85, pluton: 0.5 }
  };

  /** Peso theme → ángulos */
  var THEME_ANGLE_WEIGHTS = {
    visibility: { MC: 1, AC: 0.65 },
    recognition: { MC: 0.95, AC: 0.55 },
    communication: { AC: 0.85, MC: 0.55, DC: 0.45 },
    intimacy: { IC: 0.95, DC: 0.75 },
    emotional_safety: { IC: 1, DC: 0.5 },
    movement: { AC: 0.85, MC: 0.45 },
    belonging: { IC: 0.9, DC: 0.6 },
    initiative: { MC: 0.7, AC: 0.65 },
    reflection: { IC: 0.75, DC: 0.45 },
    regulation: { IC: 0.55, MC: 0.45 },
    harmony: { DC: 0.75, AC: 0.5 },
    protection: { IC: 0.8, DC: 0.45 },
    expansion: { MC: 0.75, AC: 0.55 },
    stimulation: { AC: 0.7, MC: 0.5 }
  };

  var PLANET_ALIASES = {
    sun: 'sol',
    sol: 'sol',
    moon: 'luna',
    luna: 'luna',
    mercury: 'mercurio',
    mercurio: 'mercurio',
    venus: 'venus',
    mars: 'marte',
    marte: 'marte',
    jupiter: 'jupiter',
    saturn: 'saturno',
    saturno: 'saturno',
    uranus: 'urano',
    urano: 'urano',
    neptune: 'neptuno',
    neptuno: 'neptuno',
    pluto: 'pluton',
    pluton: 'pluton'
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function round4(n) {
    return Math.round(n * 10000) / 10000;
  }

  function normalizeStringList(list) {
    if (!Array.isArray(list)) return [];
    var out = [];
    list.forEach(function (item) {
      if (typeof item !== 'string') return;
      var s = item.trim().toLowerCase();
      if (s && out.indexOf(s) === -1) out.push(s);
    });
    return out;
  }

  function normalizePlanet(raw) {
    if (raw == null) return null;
    var key = String(raw).trim().toLowerCase();
    return PLANET_ALIASES[key] || key;
  }

  function normalizeAngle(raw) {
    if (raw == null) return null;
    var a = String(raw).trim().toUpperCase();
    if (a === 'ASC') return 'AC';
    if (a === 'DESC' || a === 'DSC') return 'DC';
    return a;
  }

  function normalizeMapLine(raw) {
    if (!raw || typeof raw !== 'object') return null;

    var planet = normalizePlanet(raw.planet != null ? raw.planet : raw.planetId);
    var angle = normalizeAngle(raw.angle);
    if (!planet || !angle) return null;

    var lineId = raw.id || raw.lineId;
    if (!lineId) lineId = planet + '-' + angle.toLowerCase();

    return {
      lineId: String(lineId),
      planet: planet,
      angle: angle
    };
  }

  function normalizeMapLines(list) {
    if (!Array.isArray(list)) return [];
    var out = [];
    list.forEach(function (item) {
      var line = normalizeMapLine(item);
      if (!line) return;
      if (out.some(function (x) { return x.lineId === line.lineId; })) return;
      out.push(line);
    });
    return out;
  }

  function priorityBand(score) {
    if (score >= PRIORITY_HIGH) return 'high';
    if (score >= PRIORITY_MEDIUM) return 'medium';
    return 'low';
  }

  function tagPlanetScore(tags, planet) {
    var total = 0;
    var weightSum = 0;
    var reasons = [];

    tags.forEach(function (tag) {
      var map = TAG_PLANET_WEIGHTS[tag];
      if (!map || map[planet] == null) return;
      var w = map[planet];
      total += w;
      weightSum += 1;
      reasons.push({ type: 'tag_planet', key: tag, weight: round4(w) });
    });

    if (!weightSum) return { score: 0, reasons: reasons };
    return { score: total / weightSum, reasons: reasons };
  }

  function themeAngleScore(themes, angle) {
    var total = 0;
    var weightSum = 0;
    var reasons = [];

    themes.forEach(function (theme) {
      var map = THEME_ANGLE_WEIGHTS[theme];
      if (!map || map[angle] == null) return;
      var w = map[angle];
      total += w;
      weightSum += 1;
      reasons.push({ type: 'theme_angle', key: theme, weight: round4(w) });
    });

    if (!weightSum) return { score: 0, reasons: reasons };
    return { score: total / weightSum, reasons: reasons };
  }

  function tensionAdjustments(tensionMode, planet, angle) {
    var delta = 0;
    var reasons = [];
    if (!tensionMode) return { delta: delta, reasons: reasons };

    if (planet === 'luna') {
      delta += 0.12;
      reasons.push({ type: 'tension_mode', key: 'moon_boost', weight: 0.12 });
    }
    if (angle === 'IC') {
      delta += 0.08;
      reasons.push({ type: 'tension_mode', key: 'ic_boost', weight: 0.08 });
    }
    if (angle === 'MC' && planet === 'sol') {
      delta -= 0.05;
      reasons.push({ type: 'tension_mode', key: 'mc_sun_dampen', weight: -0.05 });
    }
    return { delta: delta, reasons: reasons };
  }

  function scoreLine(line, tags, themes, tensionMode) {
    var tagPart = tagPlanetScore(tags, line.planet);
    var themePart = themeAngleScore(themes, line.angle);
    var tensionPart = tensionAdjustments(tensionMode, line.planet, line.angle);

    var hasSignal = tagPart.score > 0 || themePart.score > 0;
    if (!hasSignal) {
      return {
        lineId: line.lineId,
        planet: line.planet,
        angle: line.angle,
        score: 0,
        priority: 'low',
        reasons: []
      };
    }

    var blended = (tagPart.score * 0.65) + (themePart.score * 0.35) + tensionPart.delta;
    var score = round4(clamp(blended, 0, 1));
    var reasons = tagPart.reasons.concat(themePart.reasons).concat(tensionPart.reasons);

    return {
      lineId: line.lineId,
      planet: line.planet,
      angle: line.angle,
      score: score,
      priority: priorityBand(score),
      reasons: reasons
    };
  }

  function computeConfidence(tags, themes, mapLines, matches) {
    var completeness = 0;
    if (tags.length) completeness += 0.35;
    if (themes.length) completeness += 0.25;
    if (mapLines.length) completeness += 0.2;

    var topScores = matches
      .map(function (m) { return m.score; })
      .sort(function (a, b) { return b - a; })
      .slice(0, 3);

    var signal = 0;
    if (topScores.length) {
      signal = topScores.reduce(function (a, b) { return a + b; }, 0) / topScores.length;
    }

    return round4(clamp(completeness + signal * 0.2, 0, 1));
  }

  function selectPriorityLines(matches) {
    return matches
      .filter(function (m) { return m.score >= PRIORITY_MEDIUM; })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.lineId.localeCompare(b.lineId);
      })
      .slice(0, MAX_PRIORITY_LINES)
      .map(function (m) { return m.lineId; });
  }

  function buildBridge(input) {
    var payload = input && typeof input === 'object' ? input : {};
    var tags = normalizeStringList(payload.tags);
    var themes = normalizeStringList(payload.themes);
    var tensionMode = payload.tensionMode === true;
    var mapLines = normalizeMapLines(payload.mapLines);

    if (!mapLines.length) {
      return {
        ok: false,
        error: 'NO_LINES',
        matches: [],
        priorityLines: [],
        confidence: 0,
        meta: {
          schemaVersion: SCHEMA_VERSION,
          tensionMode: tensionMode,
          tagCount: tags.length,
          themeCount: themes.length,
          lineCount: 0
        }
      };
    }

    if (!tags.length && !themes.length) {
      return {
        ok: false,
        error: 'NO_SIGNAL',
        matches: mapLines.map(function (line) {
          return {
            lineId: line.lineId,
            planet: line.planet,
            angle: line.angle,
            score: 0,
            priority: 'low',
            reasons: []
          };
        }),
        priorityLines: [],
        confidence: 0,
        meta: {
          schemaVersion: SCHEMA_VERSION,
          tensionMode: tensionMode,
          tagCount: 0,
          themeCount: 0,
          lineCount: mapLines.length
        }
      };
    }

    var matches = mapLines
      .map(function (line) { return scoreLine(line, tags, themes, tensionMode); })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.lineId.localeCompare(b.lineId);
      });

    var priorityLines = selectPriorityLines(matches);
    var confidence = computeConfidence(tags, themes, mapLines, matches);

    return {
      ok: true,
      matches: matches,
      priorityLines: priorityLines,
      confidence: confidence,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        tensionMode: tensionMode,
        tagCount: tags.length,
        themeCount: themes.length,
        lineCount: mapLines.length,
        highCount: matches.filter(function (m) { return m.priority === 'high'; }).length,
        mediumCount: matches.filter(function (m) { return m.priority === 'medium'; }).length,
        lowCount: matches.filter(function (m) { return m.priority === 'low'; }).length
      }
    };
  }

  window.KairosNatalMapBridge = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    PRIORITY_HIGH: PRIORITY_HIGH,
    PRIORITY_MEDIUM: PRIORITY_MEDIUM,
    buildBridge: buildBridge,
    normalizeMapLine: normalizeMapLine,
    normalizeStringList: normalizeStringList
  };
})();
