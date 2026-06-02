/**
 * KAIROS MAPS — Relocation Profile service (Fase 3.7b scaffold)
 *
 * Adapter DEV: relocated angles mock → BridgeSignalProfile shape.
 * Sin DOM, sin motores, sin WASM, sin cálculo de casas/ángulos.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.1.0-relocation-scaffold';
  var BRIDGE_PROFILE_VERSION = '0.1.0';
  var MAX_THEMES = 6;

  var ELEMENT_BY_SLUG = {
    aries: 'fire', taurus: 'earth', gemini: 'air', cancer: 'water',
    leo: 'fire', virgo: 'earth', libra: 'air', scorpio: 'water',
    sagittarius: 'fire', capricorn: 'earth', aquarius: 'air', pisces: 'water'
  };

  var MODALITY_BY_SLUG = {
    aries: 'cardinal', taurus: 'fixed', gemini: 'mutable', cancer: 'cardinal',
    leo: 'fixed', virgo: 'mutable', libra: 'cardinal', scorpio: 'fixed',
    sagittarius: 'mutable', capricorn: 'cardinal', aquarius: 'fixed', pisces: 'mutable'
  };

  var SIGN_TAGS = {
    aries: ['initiative', 'movement', 'stimulation'],
    taurus: ['belonging', 'regulation', 'protection'],
    gemini: ['communication', 'stimulation', 'reflection'],
    cancer: ['emotional_safety', 'belonging', 'protection'],
    leo: ['visibility', 'initiative', 'expansion'],
    virgo: ['precision', 'regulation', 'reflection'],
    libra: ['harmony', 'communication', 'belonging'],
    scorpio: ['intensity', 'intimacy', 'control'],
    sagittarius: ['expansion', 'movement', 'stimulation'],
    capricorn: ['regulation', 'visibility', 'control'],
    aquarius: ['stimulation', 'reflection', 'movement'],
    pisces: ['permeability', 'emotional_safety', 'reflection']
  };

  var ANGLE_THEME_WEIGHTS = {
    AC: ['belonging', 'harmony', 'communication', 'movement', 'initiative'],
    MC: ['visibility', 'recognition', 'expansion', 'initiative'],
    IC: ['emotional_safety', 'belonging', 'protection', 'regulation'],
    DC: ['intimacy', 'harmony', 'communication']
  };

  var GOAL_THEME_BOOST = {
    amor: ['intimacy', 'harmony', 'communication'],
    trabajo: ['visibility', 'recognition', 'expansion'],
    descanso: ['emotional_safety', 'regulation', 'belonging'],
    viajes: ['movement', 'expansion', 'stimulation'],
    cambio: ['movement', 'initiative', 'stimulation'],
    creatividad: ['stimulation', 'expansion', 'visibility'],
    raices: ['belonging', 'protection', 'emotional_safety'],
    crecimiento: ['expansion', 'initiative', 'movement']
  };

  function fail(reason) {
    return {
      ok: false,
      reason: reason,
      profileType: 'RELOCATION',
      tags: [],
      themes: [],
      tensionMode: false,
      dominantPatterns: { roles: [], contradictionPairs: [], relocDelta: {} },
      sourceIds: { fragmentIds: [], chartRefs: [], documentRefs: [] },
      bridgeProfile: null,
      meta: { schemaVersion: SCHEMA_VERSION }
    };
  }

  function slugifySign(raw) {
    if (raw == null) return null;
    return String(raw).trim().toLowerCase();
  }

  function normalizeAngleRef(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var slug = slugifySign(raw.slug || raw.sign);
    if (!slug) return null;
    return {
      sign: raw.sign || slug,
      slug: slug,
      degree: raw.degree != null ? raw.degree : null
    };
  }

  function normalizeTargetLocation(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var lat = Number(raw.lat);
    var lon = Number(raw.lon);
    var name = raw.name != null ? String(raw.name).trim() : '';
    if (!name || Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      name: name,
      country: raw.country != null ? String(raw.country).trim() : null,
      lat: lat,
      lon: lon,
      cityId: raw.cityId || slugifyCity(raw.name, raw.country)
    };
  }

  function slugifyCity(name, country) {
    var base = String(name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    var cc = country
      ? String(country).toLowerCase().slice(0, 2)
      : 'xx';
    return base + '-' + cc;
  }

  function natalAnglesFromChart(natalChart) {
    if (!natalChart || typeof natalChart !== 'object') return null;
    if (natalChart.angles && typeof natalChart.angles === 'object') {
      var out = {};
      ['AC', 'MC', 'IC', 'DC'].forEach(function (key) {
        var norm = normalizeAngleRef(natalChart.angles[key]);
        if (norm) out[key] = norm;
      });
      if (Object.keys(out).length) return out;
    }
    if (natalChart.asc) {
      var ascSlug = slugifySign(natalChart.asc);
      if (ascSlug) {
        return { AC: { sign: ascSlug, slug: ascSlug } };
      }
    }
    return null;
  }

  function sortUnique(list) {
    var seen = {};
    var out = [];
    (list || []).forEach(function (item) {
      if (!item || seen[item]) return;
      seen[item] = true;
      out.push(item);
    });
    return out.sort();
  }

  function profileKey(natalChart, targetLocation) {
    var natalKey = [
      natalChart.sun || '',
      natalChart.moon || '',
      natalChart.asc || ''
    ].join('|');
    return 'reloc|' + natalKey + '|' + targetLocation.cityId;
  }

  function elementModalityTension(fromSlug, toSlug) {
    if (!fromSlug || !toSlug || fromSlug === toSlug) return false;
    var fromEl = ELEMENT_BY_SLUG[fromSlug];
    var toEl = ELEMENT_BY_SLUG[toSlug];
    var fromMod = MODALITY_BY_SLUG[fromSlug];
    var toMod = MODALITY_BY_SLUG[toSlug];
    if (fromEl && toEl && fromEl !== toEl && fromMod === toMod) return true;
    if (fromMod === 'cardinal' && toMod === 'fixed') return true;
    return false;
  }

  function buildRelocDelta(natalAngles, relocatedAngles) {
    var delta = {};
    var roles = [];
    var pairs = [];
    ['AC', 'MC', 'IC', 'DC'].forEach(function (angle) {
      var from = natalAngles[angle];
      var to = relocatedAngles[angle];
      if (!to) return;
      var fromSlug = from ? from.slug : null;
      var toSlug = to.slug;
      if (!fromSlug || fromSlug !== toSlug) {
        roles.push(angle);
        delta[angle] = {
          from: fromSlug,
          to: toSlug,
          elementShift: fromSlug && ELEMENT_BY_SLUG[fromSlug] !== ELEMENT_BY_SLUG[toSlug]
        };
        if (elementModalityTension(fromSlug, toSlug)) {
          pairs.push({ angle: angle, from: fromSlug, to: toSlug, type: 'element_modality' });
        }
      }
    });
    if (!roles.length) roles.push('MC');
    return { delta: delta, roles: roles, pairs: pairs };
  }

  function tagsFromRelocated(relocatedAngles, roles) {
    var tags = [];
    roles.forEach(function (angle) {
      var ref = relocatedAngles[angle];
      if (!ref) return;
      var signTags = SIGN_TAGS[ref.slug] || [];
      signTags.forEach(function (tag) { tags.push(tag); });
    });
    return sortUnique(tags);
  }

  function themesFromTags(tags, roles, goalContext) {
    var tagSet = {};
    tags.forEach(function (t) { tagSet[t] = true; });

    var merged = [];
    function addTheme(theme) {
      if (!theme || merged.indexOf(theme) !== -1) return;
      merged.push(theme);
    }

    var goalId = goalContext && goalContext.primary && goalContext.primary.id;
    if (goalId && GOAL_THEME_BOOST[goalId]) {
      GOAL_THEME_BOOST[goalId].forEach(addTheme);
    }

    roles.forEach(function (angle) {
      (ANGLE_THEME_WEIGHTS[angle] || []).forEach(function (theme) {
        if (tagSet[theme]) addTheme(theme);
      });
    });

    tags.forEach(function (tag) {
      if (merged.length >= MAX_THEMES) return;
      var pool = ANGLE_THEME_WEIGHTS.AC.concat(
        ANGLE_THEME_WEIGHTS.MC,
        ANGLE_THEME_WEIGHTS.IC,
        ANGLE_THEME_WEIGHTS.DC
      );
      if (pool.indexOf(tag) !== -1) addTheme(tag);
    });

    return merged.slice(0, MAX_THEMES).sort();
  }

  function chartRefsFromRelocated(relocatedAngles, roles) {
    return roles.map(function (angle) {
      var ref = relocatedAngles[angle];
      if (!ref) return null;
      return 'RELOC_' + angle + '_' + ref.slug.toUpperCase();
    }).filter(Boolean).sort();
  }

  function buildBridgeProfile(tags, themes, tensionMode, roles, chartRefs, pairs) {
    return {
      schemaVersion: BRIDGE_PROFILE_VERSION,
      tags: tags.slice(),
      themes: themes.slice(),
      tensionMode: tensionMode === true,
      contradictionPairs: pairs.slice(),
      dominantRoles: roles.slice(),
      sourceFragmentIds: chartRefs.slice()
    };
  }

  function buildRelocationProfile(input) {
    try {
      if (!input || typeof input !== 'object') {
        return fail('invalid_input');
      }

      var natalChart = input.natalChart;
      if (!natalChart || typeof natalChart !== 'object') {
        return fail('missing_natal_chart');
      }

      var targetLocation = normalizeTargetLocation(input.targetLocation);
      if (!targetLocation) {
        return fail('missing_target_location');
      }

      if (!input.relocatedAngles || typeof input.relocatedAngles !== 'object') {
        return fail('missing_relocated_angles');
      }

      var relocatedAngles = {};
      ['AC', 'MC', 'IC', 'DC'].forEach(function (key) {
        var norm = normalizeAngleRef(input.relocatedAngles[key]);
        if (norm) relocatedAngles[key] = norm;
      });

      if (!relocatedAngles.AC || !relocatedAngles.MC) {
        return fail('missing_relocated_angles');
      }

      var natalAngles = natalAnglesFromChart(natalChart);
      if (!natalAngles) {
        return fail('missing_natal_chart');
      }

      var relocMeta = buildRelocDelta(natalAngles, relocatedAngles);
      var roles = relocMeta.roles;
      var tags = tagsFromRelocated(relocatedAngles, roles);
      var themes = themesFromTags(tags, roles, input.goalContext);
      var tensionMode = relocMeta.pairs.length > 0;
      var chartRefs = chartRefsFromRelocated(relocatedAngles, roles);
      var houses = Array.isArray(input.relocatedHouses) ? input.relocatedHouses : [];

      var bridgeProfile = buildBridgeProfile(
        tags,
        themes,
        tensionMode,
        roles,
        chartRefs,
        relocMeta.pairs
      );

      var goalId = input.goalContext && input.goalContext.primary
        ? input.goalContext.primary.id
        : null;

      return {
        ok: true,
        profileType: 'RELOCATION',
        profileKey: profileKey(natalChart, targetLocation),
        tags: tags,
        themes: themes,
        tensionMode: tensionMode,
        dominantPatterns: {
          roles: roles,
          contradictionPairs: relocMeta.pairs,
          relocDelta: relocMeta.delta
        },
        sourceIds: {
          fragmentIds: [],
          chartRefs: chartRefs,
          documentRefs: ['RELOCATION_EDITORIAL_BRIEF.md', 'RELOCATION_SCAFFOLD_ARCHITECTURE.md']
        },
        bridgeProfile: bridgeProfile,
        meta: {
          schemaVersion: SCHEMA_VERSION,
          goal: goalId,
          cityRef: targetLocation.cityId,
          cityName: targetLocation.name,
          derivedFrom: 'NATAL',
          housesProvided: houses.length > 0,
          housesCount: houses.length,
          targetLocation: {
            name: targetLocation.name,
            country: targetLocation.country,
            lat: targetLocation.lat,
            lon: targetLocation.lon
          }
        }
      };
    } catch (e) {
      return fail('internal_error');
    }
  }

  window.KairosRelocationProfile = {
    schemaVersion: SCHEMA_VERSION,
    buildRelocationProfile: buildRelocationProfile
  };
})();
