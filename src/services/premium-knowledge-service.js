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

  var SCHEMA_VERSION = '3.8f.7f-0.1';
  var STAGE_ORDER = ['integrar', 'favorece', 'desafia', 'aprovechar', 'observar'];

  var PREMIUM_BLOCK_VARIATIONS_BY_REGION = {
    IBERIAN: {
      doc17: {
        t1: {
          amor: 'En {ciudad}, la conversación puede abrir antes que la escena — te encuentran en la compañía, no en el personaje.',
          trabajo: 'En {ciudad}, la sobremesa puede hacer visible tu obra — te encuentran en el sentido, no solo en la vitrina.',
          descanso: 'En {ciudad}, la mesa puede devolver calma — el cuerpo se encuentra en la compañía, no en la prisa.'
        },
        t2: {
          amor: 'El vínculo puede pedir verdad incómoda en la plaza — no fracaso, sino conversación que aún no ha encontrado tono.',
          trabajo: 'El trabajo puede pedir sentido en privado antes de la plaza — no fracaso, sino obra que aún no ha encontrado voz.',
          descanso: 'El descanso puede chocar con la costumbre de no parar — no pereza, sino cuerpo que pide quedarse un poco más.'
        },
        t3: {
          amor: 'Puede abrirse un vínculo más honesto si sostienes conversación larga — la condición es compañía antes que escena.',
          trabajo: 'Puede abrirse sentido si trabajas la obra en privado — la condición es sustancia antes que aplauso.',
          descanso: 'Puede abrirse calma si te quedas en la pausa sin disculparte — la condición es permiso antes que rendimiento.'
        },
        t4: {
          amor: 'Esta semana, elige una conversación donde importe más escuchar que brillar — pequeña y real.',
          trabajo: 'Esta semana, escribe en privado qué parte de tu obra sigue viva — pequeña y real.',
          descanso: 'Esta semana, quédate un rato más en la calma sin explicarte — pequeño y real.'
        }
      },
      byBlockId: {
        doc6_intensidad_linea_cercana: {
          amor: 'La cercanía de esta línea puede sentirse en la conversación del vínculo — notable sin exigir dominar el encuentro al primer día.',
          trabajo: 'La cercanía de esta línea puede sentirse en la obra cotidiana — señal clara sin la exigencia de la vitrina, más sostenible para ordenar sentido.',
          descanso: 'La cercanía de esta línea puede sentirse en el cuerpo en compañía — habitar el lugar sin sobreexigencia, más sostenible para una estancia media.'
        },
        doc6_intensidad_linea_exacta: {
          amor: 'Muy cerca del trazo el vínculo puede sentirse sin filtro — conversación intensa; conviene ir despacio si la cercanía te desborda.',
          trabajo: 'Muy cerca del trazo la obra puede sentirse sin filtro — impulso y visibilidad al máximo; modera ritmo si la exposición te agota.',
          descanso: 'Muy cerca del trazo el cuerpo puede registrar la señal sin filtro — ritmo al máximo volumen; conviene moderar si la intensidad te agota.'
        }
      }
    },
    MEDITERRANEAN: {
      doc17: {
        t1: {
          amor: 'En {ciudad}, la proximidad urbana puede hacer visible el vínculo — te encuentran en la calle antes que en la declaración.',
          trabajo: 'En {ciudad}, la acera puede hacer visible tu trayectoria — te encuentran en el paso, no solo en la vitrina.',
          descanso: 'En {ciudad}, el paseo puede devolver calma — el cuerpo se encuentra en el tránsito, no en la prisa.'
        },
        t2: {
          amor: 'El encuentro puede acelerarse en la calle — no fallo, sino proximidad que aún no ha encontrado ritmo.',
          trabajo: 'La vitrina urbana puede confundir obra con exposición — no fracaso, sino impulso que aún no ha encontrado dirección.',
          descanso: 'La ciudad sigue andando mientras paras — no pereza, sino cuerpo que pide bajar el paso sin desaparecer.'
        },
        t3: {
          amor: 'Puede abrirse un vínculo más honesto si habitas la proximidad — la condición es presencia en la calle, no escena.',
          trabajo: 'Puede abrirse dirección si contrastas impulso y propósito en público — la condición es obra antes que escaparate.',
          descanso: 'Puede abrirse calma si bajas el paso en medio del bullicio — la condición es pausa sin desaparecer del mapa.'
        },
        t4: {
          amor: 'Esta semana, camina un tramo con alguien sin agenda — presencia en la calle, pequeña y real.',
          trabajo: 'Esta semana, guarda una hora en la calle para pensar la obra — pequeña y real.',
          descanso: 'Esta semana, baja el paso un tramo urbano sin objetivo — pequeño y real.'
        }
      },
      byBlockId: {
        doc6_intensidad_linea_cercana: {
          amor: 'La cercanía de esta línea puede sentirse en la proximidad del encuentro — notable sin exigir dominar la calle al primer día.',
          trabajo: 'La cercanía de esta línea puede sentirse como presión en la acera — señal clara sin la exigencia de la línea exacta, más sostenible para ordenar prioridades.',
          descanso: 'La cercanía de esta línea puede sentirse en el paso y el ritmo urbano — habitar el tránsito sin sobreexigencia, más sostenible para una estancia media.'
        },
        doc6_intensidad_linea_exacta: {
          amor: 'Muy cerca del trazo el encuentro puede sentirse sin filtro — proximidad intensa; conviene ir despacio si la calle te desborda.',
          trabajo: 'Muy cerca del trazo la trayectoria puede sentirse sin filtro — impulso y visibilidad al máximo; modera ritmo si la acera te agota.',
          descanso: 'Muy cerca del trazo el cuerpo puede registrar el tránsito sin filtro — ritmo al máximo; conviene moderar si la densidad te agota.'
        }
      }
    },
    ANGLO: {
      doc17: {
        t1: {
          amor: 'En {ciudad}, tu presencia puede pedir claridad antes que escena — te encuentran en lo que sostienes, no en lo que performas.',
          trabajo: 'En {ciudad}, tu dirección puede pesar más en el calendario — te evalúan en lo que decides, no solo en lo que muestras.',
          descanso: 'En {ciudad}, el bloque reservado puede devolver calma — el cuerpo se encuentra en la elección, no en la prisa.'
        },
        t2: {
          amor: 'El vínculo puede probarse en acuerdos pequeños — no fallo, sino claridad que aún no ha encontrado palabras.',
          trabajo: 'La agenda puede empujar lo urgente sobre lo importante — no fracaso, sino dirección que aún no ha encontrado límite.',
          descanso: 'Calendarizar la pausa puede volverla otra tarea — no pereza, sino cuerpo que pide permiso explícito.'
        },
        t3: {
          amor: 'Puede abrirse un vínculo más honesto si eliges verdad antes que performance — la condición es acuerdo, no escena.',
          trabajo: 'Puede abrirse dirección si eliges sentido antes que resultado visible — la condición es coherencia, no vitrina.',
          descanso: 'Puede abrirse calma si reservas bloques con la misma seriedad — la condición es permiso, no rendimiento.'
        },
        t4: {
          amor: 'Esta semana, marca un límite claro antes de abrir una escena — pequeño y real.',
          trabajo: 'Esta semana, elige la dirección interna antes de aceptar lo urgente — pequeña y real.',
          descanso: 'Esta semana, reserva un bloque de descanso en el calendario — pequeño y real.'
        }
      },
      byBlockId: {
        doc6_intensidad_linea_cercana: {
          amor: 'La cercanía de esta línea puede sentirse en acuerdos del vínculo — notable sin exigir dominar la escena al primer día.',
          trabajo: 'La cercanía de esta línea puede sentirse como presión profesional en el calendario — señal clara sin la exigencia de la línea exacta, más sostenible para ordenar prioridades.',
          descanso: 'La cercanía de esta línea puede sentirse en el ritmo reservado del cuerpo — habitar el bloque sin sobreexigencia, más sostenible para una estancia media.'
        },
        doc6_intensidad_linea_exacta: {
          amor: 'Muy cerca del trazo el vínculo puede sentirse sin filtro — claridad intensa; conviene ir despacio si la exposición te desborda.',
          trabajo: 'Muy cerca del trazo la trayectoria puede sentirse sin filtro — impulso y visibilidad al máximo; modera ritmo si el calendario te agota.',
          descanso: 'Muy cerca del trazo el cuerpo puede registrar la exigencia sin filtro — ritmo al máximo; conviene moderar si la intensidad te agota.'
        }
      }
    },
    EAST_ASIAN: {
      doc17: {
        t1: {
          amor: 'En {ciudad}, el detalle del encuentro puede pesar más que la declaración — te encuentran en lo que repites, no en lo que anuncias.',
          trabajo: 'En {ciudad}, el paso de la obra puede hacerse visible — te encuentran en el proceso, no solo en el resultado.',
          descanso: 'En {ciudad}, el tramo lento puede devolver calma — el cuerpo se encuentra en la secuencia, no en la prisa.'
        },
        t2: {
          amor: 'El vínculo puede pedir paciencia en gestos pequeños — no fallo, sino detalle que aún no ha madurado.',
          trabajo: 'La vitrina puede apresurar lo que aún madura en privado — no fracaso, sino proceso que aún no ha encontrado silencio.',
          descanso: 'La secuencia del día puede absorber la pausa — no pereza, sino cuerpo que pide observar antes de acelerar.'
        },
        t3: {
          amor: 'Puede abrirse un vínculo más honesto si cuidas gestos repetidos — la condición es detalle, no declaración amplia.',
          trabajo: 'Puede abrirse sentido si sostienes el proceso en privado — la condición es paso firme, no exposición.',
          descanso: 'Puede abrirse calma si dejas que el cuerpo marque el ritmo — la condición es observación, no otro tramo urgente.'
        },
        t4: {
          amor: 'Esta semana, repite un gesto pequeño de cuidado — sin forzar escena amplia.',
          trabajo: 'Esta semana, sostén un paso de la obra en privado — pequeño y real.',
          descanso: 'Esta semana, observa qué señal corporal pide calma — pequeña y real.'
        }
      },
      byBlockId: {
        doc6_intensidad_linea_cercana: {
          amor: 'La cercanía de esta línea puede sentirse en gestos mínimos del vínculo — notable sin exigir dominar el detalle al primer día.',
          trabajo: 'La cercanía de esta línea puede sentirse en el proceso de la trayectoria — señal clara sin la exigencia de la línea exacta, más sostenible para ordenar pasos.',
          descanso: 'La cercanía de esta línea puede sentirse en el tramo corporal del día — habitar la secuencia sin sobreexigencia, más sostenible para una estancia media.'
        },
        doc6_intensidad_linea_exacta: {
          amor: 'Muy cerca del trazo el vínculo puede sentirse sin filtro — detalle intenso; conviene ir despacio si la precisión te desborda.',
          trabajo: 'Muy cerca del trazo el proceso puede sentirse sin filtro — impulso al máximo; modera ritmo si la exposición te agota.',
          descanso: 'Muy cerca del trazo el cuerpo puede registrar la secuencia sin filtro — ritmo al máximo; conviene moderar si la intensidad te agota.'
        }
      }
    },
    AFRICAN_COASTAL: {
      doc17: {
        t1: {
          amor: 'En {ciudad}, la amplitud del día puede hacer visible el vínculo — te encuentran en la calma, no en el brillo momentáneo.',
          trabajo: 'En {ciudad}, el horizonte puede ampliar lo que parecía posible — te encuentran en la dirección, no solo en la vitrina.',
          descanso: 'En {ciudad}, el viento puede devolver respiración — el cuerpo se encuentra en la amplitud, no en la prisa.'
        },
        t2: {
          amor: 'El vínculo puede medirse en amplitud — no fallo, sino cercanía que aún no ha probado el horizonte.',
          trabajo: 'El paisaje puede empujar impulso antes que sentido — no fracaso, sino dirección que aún no ha encontrado raíz.',
          descanso: 'El contraste del entorno puede acelerar la mente — no pereza, sino cuerpo que pide respirar con espacio.'
        },
        t3: {
          amor: 'Puede abrirse un vínculo más honesto si dejas respirar la escena — la condición es amplitud, no cierre.',
          trabajo: 'Puede abrirse dirección si contrastas impulso del entorno y propósito interno — la condición es elección, no paisaje.',
          descanso: 'Puede abrirse calma si habitas la pausa con el cuerpo abierto — la condición es respiración, no rendimiento.'
        },
        t4: {
          amor: 'Esta semana, elige un encuentro donde importe más la calma que el brillo — pequeño y real.',
          trabajo: 'Esta semana, escribe qué dirección es tuya antes de seguir el impulso del entorno — pequeña y real.',
          descanso: 'Esta semana, deja una tarde sin competir con el horizonte — pequeña y real.'
        }
      },
      byBlockId: {
        doc6_intensidad_linea_cercana: {
          amor: 'La cercanía de esta línea puede sentirse en la amplitud del vínculo — notable sin exigir dominar el horizonte al primer día.',
          trabajo: 'La cercanía de esta línea puede sentirse en el contraste de la trayectoria — señal clara sin la exigencia de la línea exacta, más sostenible para ordenar pasos.',
          descanso: 'La cercanía de esta línea puede sentirse en la respiración del cuerpo — habitar el contraste sin sobreexigencia, más sostenible para una estancia media.'
        },
        doc6_intensidad_linea_exacta: {
          amor: 'Muy cerca del trazo el vínculo puede sentirse sin filtro — intensidad amplia; conviene ir despacio si el horizonte te desborda.',
          trabajo: 'Muy cerca del trazo la obra puede sentirse sin filtro — impulso del entorno al máximo; modera ritmo si el contraste te agota.',
          descanso: 'Muy cerca del trazo el cuerpo puede registrar la amplitud sin filtro — ritmo al máximo; conviene moderar si la intensidad te agota.'
        }
      }
    }
  };

  function resolveRegionFamily(cityId, countryId) {
    var EFR = window.KairosEditorialFamily;
    if (EFR && typeof EFR.resolveEditorialFamily === 'function') {
      return EFR.resolveEditorialFamily({ cityName: cityId, countryId: countryId });
    }
    return 'IBERIAN';
  }

  function applyRegionalBlockVariation(text, block, ctx) {
    if (!block || !ctx || !ctx.regionFamily) return text;
    var region = ctx.regionFamily;
    var pack = PREMIUM_BLOCK_VARIATIONS_BY_REGION[region];
    if (!pack) return text;
    var goalId = ctx.goalId || 'amor';
    var slot = block.slot;

    if (pack.byBlockId && pack.byBlockId[block.id]) {
      var byId = pack.byBlockId[block.id][goalId] || pack.byBlockId[block.id].any;
      if (typeof byId === 'string') return byId;
    }

    if (block.interpKey && pack.doc17 && pack.doc17[slot]) {
      var slotText = pack.doc17[slot][goalId] || pack.doc17[slot].any;
      if (typeof slotText === 'string') return slotText;
    }

    return text;
  }

  /** Bloques metodológicos — máximo uno por lectura con narrativeContext */
  var METHODOLOGY_BLOCK_IDS = {
    doc6_jerarquia_natal_linea: true,
    doc5_metodologia_promesa_natal: true,
    doc5_multiples_influencias: true,
    doc6_conclusion_alineacion: true,
    doc6_contradiccion_friccion_evolutiva: true,
    doc5_no_pildora_magica: true,
    doc17_max_dos_profundas: true
  };

  var GOAL_OBJECTIVE_IDS = {
    amor: 'doc6_objetivo_amor_dc_venus',
    trabajo: 'doc6_objetivo_trabajo_mc',
    descanso: 'doc6_objetivo_descanso_ic'
  };

  /** Con narrativeContext el compositor usa human spine — no reservar cupo */
  var NARRATIVE_GHOST_BLOCK_IDS = {
    doc6_integrado_sobre_sombra: true,
    doc6_objetivo_amor_dc_venus: true,
    doc6_objetivo_trabajo_mc: true,
    doc6_objetivo_descanso_ic: true
  };

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

  function themeScore(block, narrativeContext) {
    if (!narrativeContext || !narrativeContext.dominantTheme) return 0;
    var want = narrativeContext.dominantTheme.themes || [];
    var bt = block.themes || [];
    var score = 0;
    want.forEach(function (t) {
      if (bt.indexOf(t) !== -1) score += 2;
    });
    if (narrativeContext.mainOpportunity && narrativeContext.mainOpportunity.themes) {
      narrativeContext.mainOpportunity.themes.forEach(function (t) {
        if (bt.indexOf(t) !== -1) score += 1;
      });
    }
    return score;
  }

  function selectDoc17Blocks(ctx, catalog, selectedIds) {
    var maxDeep = catalog.TAXONOMY.maxDeepInfluences || 2;
    var deepKeys = ctx.narrativeContext && ctx.narrativeContext.deepInfluenceKeys;
    var deep = ctx.narrativeContext
      ? ctx.influences.filter(function (inf) {
        return deepKeys && deepKeys.indexOf(interpKey(inf.line)) !== -1;
      })
      : ctx.influences.slice(0, maxDeep);
    if (!deep.length) deep = ctx.influences.slice(0, maxDeep);
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

  function pickBlockVariant(blockOrPool, ctx, slotKey) {
    if (!blockOrPool) return '';
    if (typeof blockOrPool === 'string') return blockOrPool;

    var block = blockOrPool;
    var goalId = (ctx && ctx.goalId) || 'amor';
    var seed = (ctx && ctx.seed) != null ? ctx.seed : 0;
    var slot = slotKey || 'variant';

    if (block.variantsByGoal) {
      var goalPool = block.variantsByGoal[goalId];
      if (!goalPool && block.variantsByGoal.amor) goalPool = block.variantsByGoal.amor;
      if (typeof goalPool === 'string') return applyRegionalBlockVariation(goalPool, block, ctx);
      if (Array.isArray(goalPool) && goalPool.length) {
        return applyRegionalBlockVariation(
          goalPool[hash32(String(seed) + ':' + slot + ':' + (block.id || '')) % goalPool.length],
          block,
          ctx
        );
      }
    }

    if (Array.isArray(block.variants) && block.variants.length) {
      return applyRegionalBlockVariation(
        block.variants[hash32(String(seed) + ':' + slot + ':' + (block.id || '')) % block.variants.length],
        block,
        ctx
      );
    }

    return applyRegionalBlockVariation(block.text || '', block, ctx);
  }

  function selectSynthesisBlocks(ctx, catalog, selectedIds) {
    var narrative = ctx.narrativeContext;
    var methodologyUsed = 0;
    var maxMethodology = narrative ? 0 : 99;
    var maxSynthesis = narrative ? 3 : 99;
    var synthesisCount = 0;

    var priorityIds = [];
    if (narrative) {
      if (ctx.influences.length >= 2) {
        priorityIds.push('doc6_marte_jupiter_friccion');
      }
      var best = ctx.influences[0];
      if (best && best.distKm != null && best.distKm <= 80) {
        priorityIds.push('doc6_intensidad_linea_exacta');
      } else if (best && best.distKm != null && best.distKm >= 200) {
        priorityIds.push('doc6_intensidad_linea_cercana');
      }
      if (ctx.relocationProfile && ctx.relocationProfile.ok) {
        priorityIds.push('doc7_linea_vs_reloc');
      }
    } else {
      var objId = GOAL_OBJECTIVE_IDS[ctx.goalId];
      if (objId) priorityIds.push(objId);
      if (ctx.bridgeProfile && ctx.bridgeProfile.tensionMode) {
        priorityIds.push('doc6_integrado_sobre_sombra');
      }
      if (ctx.influences.length >= 2) {
        priorityIds.push('doc6_marte_jupiter_friccion');
      }
      var bestNoNarr = ctx.influences[0];
      if (bestNoNarr && bestNoNarr.distKm != null && bestNoNarr.distKm <= 80) {
        priorityIds.push('doc6_intensidad_linea_exacta');
      } else if (bestNoNarr && bestNoNarr.distKm != null && bestNoNarr.distKm >= 200) {
        priorityIds.push('doc6_intensidad_linea_cercana');
      }
      if (ctx.relocationProfile && ctx.relocationProfile.ok) {
        priorityIds.push('doc7_linea_vs_reloc');
      }
    }

    priorityIds.forEach(function (id) {
      if (synthesisCount >= maxSynthesis) return;
      var block = catalog.INDEX.byId[id];
      if (!block || !goalMatches(block.goals, ctx.goalId)) return;
      if (!matchSpec(block, ctx)) return;
      selectedIds[id] = true;
      synthesisCount += 1;
    });

    var candidates = catalog.BLOCKS.filter(function (block) {
      if (block.interpKey) return false;
      if (!goalMatches(block.goals, ctx.goalId)) return false;
      if (!matchSpec(block, ctx)) return false;
      if (selectedIds[block.id]) return false;
      if (narrative && METHODOLOGY_BLOCK_IDS[block.id]) return false;
      if (narrative && NARRATIVE_GHOST_BLOCK_IDS[block.id]) return false;
      return true;
    });

    if (narrative) {
      candidates.sort(function (a, b) {
        return themeScore(b, narrative) - themeScore(a, narrative);
      });
    }

    candidates.forEach(function (block) {
      if (synthesisCount >= maxSynthesis) return;
      if (METHODOLOGY_BLOCK_IDS[block.id] && methodologyUsed >= maxMethodology) return;
      selectedIds[block.id] = true;
      synthesisCount += 1;
      if (METHODOLOGY_BLOCK_IDS[block.id]) methodologyUsed += 1;
    });
  }

  function blocksFromIds(catalog, selectedIds, seed, goalId, regionFamily, cityName, countryId) {
    var pickCtx = {
      seed: seed,
      goalId: goalId || 'amor',
      regionFamily: regionFamily,
      cityName: cityName || '',
      countryId: countryId || ''
    };
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
      if (!b) return null;
      return {
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
        text: pickBlockVariant(b, pickCtx, 'block:' + id)
      };
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

    var cityName = input.city && input.city.name ? input.city.name : '';
    var countryDisplay = input.city && input.city.country ? input.city.country : '';
    var EFR = window.KairosEditorialFamily;
    var canonicalCountryId = EFR && typeof EFR.coerceCountryId === 'function'
      ? EFR.coerceCountryId(countryDisplay)
      : (window.KairosCitiesCatalog && typeof window.KairosCitiesCatalog.resolveCountryId === 'function'
        ? window.KairosCitiesCatalog.resolveCountryId(countryDisplay)
        : null);
    var regionFamily = input.narrativeContext && input.narrativeContext.regionFamily
      ? input.narrativeContext.regionFamily
      : resolveRegionFamily(cityName, canonicalCountryId);

    var ctx = {
      goalId: goalId,
      influences: influences,
      bridgeProfile: input.bridgeProfile || null,
      relocationProfile: input.relocationProfile || null,
      duration: input.duration || null,
      cityName: cityName,
      countryId: canonicalCountryId || '',
      regionFamily: regionFamily,
      narrativeContext: input.narrativeContext || null
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

    var blocks = blocksFromIds(catalog, selectedIds, seed, goalId, ctx.regionFamily, ctx.cityName, ctx.countryId);

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
          : [],
        regionFamily: ctx.regionFamily,
        narrativeContextUsed: !!(input && input.narrativeContext)
      }
    };
  }

  window.KairosPremiumKnowledge = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    STAGE_ORDER: STAGE_ORDER,
    THEME_ES: THEME_ES,
    PREMIUM_BLOCK_VARIATIONS_BY_REGION: PREMIUM_BLOCK_VARIATIONS_BY_REGION,
    resolveRegionFamily: resolveRegionFamily,
    getBlocksForContext: getBlocksForContext,
    pickBlockVariant: pickBlockVariant,
    catalog: function () {
      return window.KairosPremiumBlocks
        ? window.KairosPremiumBlocks.catalog()
        : null;
    }
  };
})();
