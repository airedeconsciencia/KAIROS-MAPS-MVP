/**
 * KAIROS MAPS — Premium Knowledge selection (Fase 3.8e.3 DEV)
 *
 * Selecciona bloques editoriales filtrados por contexto.
 * NO genera texto, NO compone lectura.
 *
 * Depende de: window.KairosPremiumBlocks
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e.3-0.1';
  var STAGE_ORDER = ['integrar', 'favorece', 'desafia', 'aprovechar', 'observar'];

  var THEME_ES = {
    belonging: 'pertenencia',
    communication: 'comunicación',
    movement: 'movimiento',
    harmony: 'armonía',
    visibility: 'visibilidad',
    emotional_safety: 'seguridad emocional',
    intimacy: 'intimidad',
    initiative: 'iniciativa',
    reflection: 'reflexión',
    regulation: 'regulación',
    stimulation: 'estimulación',
    protection: 'protección'
  };

  function hash32(str) {
    var h = 2166136261;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function resolveGoalId(goal) {
    if (!goal) return 'amor';
    if (typeof goal === 'string') return goal;
    return goal.id || goal.aspectKey || 'amor';
  }

  function goalMatches(blockGoals, goalId) {
    if (!blockGoals || !blockGoals.length) return true;
    if (blockGoals.indexOf('any') !== -1) return true;
    return blockGoals.indexOf(goalId) !== -1;
  }

  function normalizeInfluences(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (item, rank) {
      var line = item.line || item;
      return {
        rank: rank,
        line: line,
        lineId: item.lineId || (line && line.id),
        planet: line && (line.planet || line.planetKey),
        angle: line && line.angle,
        distKm: item.distKm != null ? item.distKm : item.dist,
        composite: item.composite || 0
      };
    }).sort(function (a, b) {
      if (b.composite !== a.composite) return b.composite - a.composite;
      return a.rank - b.rank;
    });
  }

  function interpKey(line) {
    if (!line) return '';
    var pk = line.planetKey || String(line.planet || '').toUpperCase();
    return pk ? pk + '_' + line.angle : '';
  }

  function matchSpec(block, ctx) {
    var m = block.match;
    if (!m) return true;
    if (m.minInfluences && ctx.influences.length < m.minInfluences) return false;
    if (m.maxDistKm != null) {
      var best = ctx.influences[0];
      if (!best || best.distKm == null || best.distKm > m.maxDistKm) return false;
    }
    if (m.minDistKm != null) {
      var b0 = ctx.influences[0];
      if (!b0 || b0.distKm == null || b0.distKm < m.minDistKm) return false;
    }
    if (m.duration && ctx.duration !== m.duration) return false;
    if (m.requiresRelocation) {
      if (!ctx.relocationProfile || ctx.relocationProfile.ok !== true) return false;
    }
    if (m.relocAngles && m.relocAngles.length) {
      var angles = (ctx.relocationProfile && ctx.relocationProfile.angles) || [];
      var hit = m.relocAngles.some(function (a) { return angles.indexOf(a) !== -1; });
      if (!hit) return false;
    }
    if (m.planetPairs && m.planetPairs.length) {
      var planets = ctx.influences.slice(0, 3).map(function (i) {
        return String(i.planet || '').toLowerCase();
      });
      var pairOk = m.planetPairs.some(function (pair) {
        return planets.indexOf(pair[0]) !== -1 && planets.indexOf(pair[1]) !== -1;
      });
      if (!pairOk) return false;
    }
    return true;
  }

  function selectDoc17Blocks(ctx, catalog, selectedIds) {
    var maxDeep = catalog.TAXONOMY.maxDeepInfluences || 2;
    var deep = ctx.influences.slice(0, maxDeep);
    var useShadow = ctx.bridgeProfile && ctx.bridgeProfile.tensionMode === true;

    deep.forEach(function (inf) {
      var key = interpKey(inf.line);
      var ids = catalog.INDEX.byInterpKey[key] || [];
      ids.forEach(function (id) {
        if (selectedIds[id]) return;
        var block = catalog.INDEX.byId[id];
        if (!block || block.slot === 'synthesis' || block.slot === 'context' || block.slot === 'reloc') return;
        if (!goalMatches(block.goals, ctx.goalId)) return;
        if (useShadow && block.integration === 'shadow') {
          selectedIds[id] = true;
        } else if (block.integration === 'integrated') {
          selectedIds[id] = true;
        } else if (block.integration === 'shadow' && !useShadow) {
          /* skip shadow unless tension */
        }
      });
    });
  }

  function selectSynthesisBlocks(ctx, catalog, selectedIds) {
    catalog.BLOCKS.forEach(function (block) {
      if (block.interpKey) return;
      if (!goalMatches(block.goals, ctx.goalId)) return;
      if (!matchSpec(block, ctx)) return;
      selectedIds[block.id] = true;
    });
  }

  function blocksFromIds(catalog, selectedIds, seed) {
    var ids = Object.keys(selectedIds);
    ids.sort(function (a, b) {
      var ba = catalog.INDEX.byId[a];
      var bb = catalog.INDEX.byId[b];
      var sa = ba ? STAGE_ORDER.indexOf(ba.stage) : 99;
      var sb = bb ? STAGE_ORDER.indexOf(bb.stage) : 99;
      if (sa !== sb) return sa - sb;
      return hash32(seed + a) - hash32(seed + b);
    });
    return ids.map(function (id) {
      var b = catalog.INDEX.byId[id];
      return b ? {
        id: b.id,
        slot: b.slot,
        stage: b.stage,
        goals: b.goals,
        themes: b.themes,
        factors: b.factors,
        sources: b.sources,
        interpKey: b.interpKey || null,
        planet: b.planet || null,
        angle: b.angle || null,
        integration: b.integration || null,
        text: b.text
      } : null;
    }).filter(Boolean);
  }

  function coverageStats(blocks) {
    var byStage = {};
    var byDoc = {};
    blocks.forEach(function (b) {
      byStage[b.stage] = (byStage[b.stage] || 0) + 1;
      (b.sources || []).forEach(function (s) {
        byDoc[s.doc] = (byDoc[s.doc] || 0) + 1;
      });
    });
    return { byStage: byStage, byDoc: byDoc };
  }

  function getBlocksForContext(input) {
    var empty = {
      ok: false,
      blocks: [],
      meta: { schemaVersion: SCHEMA_VERSION, error: 'invalid_input' }
    };

    var catalog = window.KairosPremiumBlocks;
    if (!catalog || !catalog.BLOCKS) {
      empty.meta.error = 'missing_premium_blocks';
      return empty;
    }

    var goalId = resolveGoalId(input && input.goal);
    var influences = normalizeInfluences(input && input.relevantInfluences);
    if (!influences.length && !(input && input.includeSynthesisOnly)) {
      empty.meta.error = 'no_influences';
      return empty;
    }

    var ctx = {
      goalId: goalId,
      influences: influences,
      bridgeProfile: input.bridgeProfile || null,
      relocationProfile: input.relocationProfile || null,
      duration: input.duration || null,
      cityName: input.city && input.city.name ? input.city.name : ''
    };

    if (ctx.relocationProfile && ctx.relocationProfile.angles == null && ctx.relocationProfile.relocAngles) {
      ctx.relocationProfile.angles = ctx.relocationProfile.relocAngles;
    }

    var seed = hash32(
      ctx.cityName + '|' + goalId + '|' + influences.map(function (i) {
        return interpKey(i.line);
      }).join(',')
    );

    var selectedIds = {};
    selectSynthesisBlocks(ctx, catalog, selectedIds);
    selectDoc17Blocks(ctx, catalog, selectedIds);

    var blocks = blocksFromIds(catalog, selectedIds, seed);

    return {
      ok: blocks.length > 0,
      blocks: blocks,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        goalId: goalId,
        deterministicSeed: seed,
        influenceCount: influences.length,
        deepInfluenceKeys: influences.slice(0, catalog.TAXONOMY.maxDeepInfluences).map(function (i) {
          return interpKey(i.line);
        }),
        selectedCount: blocks.length,
        selectedIds: blocks.map(function (b) { return b.id; }),
        coverage: coverageStats(blocks),
        bridgeThemesEs: (ctx.bridgeProfile && ctx.bridgeProfile.themes)
          ? ctx.bridgeProfile.themes.map(function (t) { return THEME_ES[t] || t; })
          : []
      }
    };
  }

  window.KairosPremiumKnowledge = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    STAGE_ORDER: STAGE_ORDER,
    THEME_ES: THEME_ES,
    getBlocksForContext: getBlocksForContext,
    catalog: function () {
      return window.KairosPremiumBlocks
        ? window.KairosPremiumBlocks.catalog()
        : null;
    }
  };
})();
