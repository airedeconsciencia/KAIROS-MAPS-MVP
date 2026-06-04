/**
 * KAIROS MAPS — City Premium Reading composition (Fase 3.8e DEV)
 *
 * Lectura integrada por ciudad: narrativa global desde influencias rankeadas.
 * Sin IA, sin DOM, sin inventar datos astrológicos — solo composición editorial.
 *
 * Depende de: INTERPRETATIONS, KairosCityReading (opcional), rankInfluences previo.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '3.8e-dev-0.1';
  var MIN_WORDS = 600;
  var MAX_WORDS = 1800;
  var TARGET_MIN = 800;
  var TARGET_MAX = 1500;
  var MAX_INFLUENCES = 5;

  var SECTION_DEFS = [
    { id: 'favorece', title: 'Qué puede favorecer', slot: 'favorece', budget: [200, 320] },
    { id: 'desafia', title: 'Qué puede desafiar', slot: 'desafia', budget: [200, 320] },
    { id: 'aprovecha', title: 'Cómo aprovecharlo', slot: 'aprovecha', budget: [180, 280] },
    { id: 'observar', title: 'Qué observar si permaneces aquí', slot: 'observar', budget: [140, 240] },
    { id: 'cierre', title: 'Cierre integrador', slot: 'cierre', budget: [120, 220] }
  ];

  var GOAL_LABELS = {
    amor: 'amor y vínculo',
    trabajo: 'trabajo y propósito',
    descanso: 'descanso y bienestar'
  };

  var GOAL_INTROS = {
    amor: 'Si tu foco ahora es el amor y el vínculo, {ciudad} puede leerse como un escenario donde varias corrientes del mapa se superponen. Lo que sigue no es una lista de influencias aisladas: es una lectura integrada para {nombre}.',
    trabajo: 'Si tu foco ahora es el trabajo y el propósito, {ciudad} puede sentirse como un lugar donde varias señales del mapa convergen en una sola experiencia. Lo que sigue está compuesto para {nombre} como narrativa global, no como suma de fragmentos.',
    descanso: 'Si tu foco ahora es el descanso y el bienestar, {ciudad} puede ofrecer un ritmo distinto al que llevas en casa. Lo que sigue integra varias señales cercanas en una sola lectura para {nombre}.'
  };

  var OBSERVAR_LEADS = {
    amor: 'Si permaneces aquí más de unos días, conviene observar cómo evolucionan los vínculos — no solo el primer encuentro, sino si la intimidad se sostiene o se vuelve intensa sin anclaje.',
    trabajo: 'Si permaneces aquí, observa si tu energía se orienta hacia proyectos con sentido o si el lugar solo activa prisa por visibilidad sin entregables.',
    descanso: 'Si permaneces aquí, observa si el cuerpo baja el ritmo de verdad o si el entorno sigue pidiendo rendimiento disfrazado de descanso.'
  };

  var FORBIDDEN = [
    'universo quiere', 'destino está escrito', 'energías cósmicas',
    'todo ocurre por una razón', 'vibra alto', 'alma gemela',
    'universo conspira', 'manifestar', 'frecuencia vibracional',
    'portal energético', 'llama gemela', 'abundancia infinita',
    'misión cósmica', 'garantizado', 'debes mudarte',
    'el universo', 'dimensión superior', 'despertar espiritual'
  ];

  var ANGLE_THEMES = {
    AC: 'presencia y primer contacto',
    MC: 'trayectoria y visibilidad pública',
    IC: 'raíz, hogar y vida privada',
    DC: 'encuentro, pareja y acuerdos'
  };

  var PLANET_THEMES = {
    sol: 'identidad y vitalidad',
    luna: 'ritmo emocional y seguridad',
    mercurio: 'pensamiento y comunicación',
    venus: 'vínculo y disfrute',
    marte: 'impulso y fronteras',
    jupiter: 'expansión y sentido',
    saturno: 'límite y madurez',
    urano: 'cambio y despertar',
    neptuno: 'permeabilidad y sueño',
    pluton: 'profundidad y transformación'
  };

  function wordCount(text) {
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function hash32(str) {
    var h = 2166136261;
    var s = String(str);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function replaceCity(text, cityName) {
    return String(text).replace(/\{ciudad\}/g, cityName);
  }

  function resolveGoalId(goal) {
    if (!goal) return 'amor';
    if (typeof goal === 'string') return goal;
    return goal.id || goal.aspectKey || 'amor';
  }

  function resolveAspect(goalId, goal) {
    if (goal && typeof goal === 'object' && goal.aspectKey) return goal.aspectKey;
    return goalId;
  }

  function resolveName(profile) {
    if (!profile) return 'ti';
    return profile.firstName || profile.displayName || profile.name || 'ti';
  }

  function interpKey(line) {
    if (!line) return '';
    var pk = line.planetKey || String(line.planet || '').toUpperCase();
    if (!pk) return '';
    return pk + '_' + line.angle;
  }

  function slotFromSections(sections, slot) {
    if (!sections || !sections.length) return '';
    var titleMap = {
      favorece: 'Qué puede favorecer',
      desafia: 'Qué puede desafiar',
      aprovecha: 'Cómo aprovecharlo'
    };
    var want = titleMap[slot];
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (want && sec.title === want) return sec.body || '';
      if (slot === 'cierre' && (!sec.title || sec.title === null)) return sec.body || '';
    }
    if (slot === 'cierre' && sections.length) {
      return sections[sections.length - 1].body || '';
    }
    return '';
  }

  function extractSlots(entry) {
    if (!entry) return { favorece: '', desafia: '', aprovecha: '', cierre: '' };
    if (typeof entry === 'string') {
      return { favorece: entry, desafia: '', aprovecha: '', cierre: '' };
    }
    if (entry.expanded && entry.sections) {
      return {
        favorece: slotFromSections(entry.sections, 'favorece'),
        desafia: slotFromSections(entry.sections, 'desafia'),
        aprovecha: slotFromSections(entry.sections, 'aprovecha'),
        cierre: slotFromSections(entry.sections, 'cierre')
      };
    }
    var Reader = window.KairosCityReading;
    var text = Reader && Reader.readingText ? Reader.readingText(entry) : '';
    return { favorece: text, desafia: '', aprovecha: '', cierre: '' };
  }

  function splitSentences(text) {
    return String(text)
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?…])\s+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 12; });
  }

  function normalizeSentence(s, cityName) {
    return s
      .toLowerCase()
      .replace(/\{ciudad\}/g, '')
      .replace(new RegExp(cityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function pickSentences(pool, maxWords, seed, cityName) {
    var seen = {};
    var out = [];
    var words = 0;
    var sorted = pool.slice().sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return hash32(seed + a.text) - hash32(seed + b.text);
    });
    for (var i = 0; i < sorted.length; i++) {
      var item = sorted[i];
      var norm = normalizeSentence(item.text, cityName);
      if (!norm || seen[norm]) continue;
      seen[norm] = true;
      var w = wordCount(item.text);
      if (words + w > maxWords && out.length) continue;
      out.push(item.text);
      words += w;
      if (words >= maxWords) break;
    }
    return { text: out.join(' '), words: words };
  }

  function buildSentencePool(influences, aspect, interpretations, cityName) {
    var pools = { favorece: [], desafia: [], aprovecha: [], cierre: [], observar: [] };
    influences.forEach(function (inf, rank) {
      var line = inf.line || inf;
      var key = interpKey(line);
      var combo = interpretations[key];
      if (!combo) return;
      var entry = combo[aspect];
      var slots = extractSlots(entry);
      var weight = 1 / (rank + 1);
      Object.keys(slots).forEach(function (slot) {
        var body = replaceCity(slots[slot], cityName);
        if (!body) return;
        splitSentences(body).forEach(function (sent) {
          pools[slot].push({ text: sent, weight: weight, key: key, rank: rank });
        });
      });
      if (slots.desafia) {
        splitSentences(replaceCity(slots.desafia, cityName)).forEach(function (sent) {
          pools.observar.push({ text: sent, weight: weight * 0.85, key: key, rank: rank });
        });
      }
    });
    return pools;
  }

  function detectPatterns(influences) {
    var angles = {};
    var planets = {};
    influences.forEach(function (inf) {
      var line = inf.line || inf;
      if (!line) return;
      angles[line.angle] = (angles[line.angle] || 0) + 1;
      var p = line.planet || line.planetKey;
      if (p) planets[p] = (planets[p] || 0) + 1;
    });
    function topKey(obj) {
      var best = null;
      var max = 0;
      Object.keys(obj).forEach(function (k) {
        if (obj[k] > max) { max = obj[k]; best = k; }
      });
      return best;
    }
    var topAngle = topKey(angles);
    var topPlanet = topKey(planets);
    return {
      dominantAngle: topAngle,
      dominantPlanet: topPlanet,
      angleTheme: topAngle ? ANGLE_THEMES[topAngle] : null,
      planetTheme: topPlanet ? PLANET_THEMES[String(topPlanet).toLowerCase()] : null,
      repeatedAngle: topAngle && angles[topAngle] >= 2,
      influenceCount: influences.length
    };
  }

  function bridgeWeave(bridgeProfile, goalId, cityName, name) {
    if (!bridgeProfile) return '';
    var parts = [];
    if (bridgeProfile.tensionMode === true) {
      parts.push(
        'En tu carta conviven tensiones que aquí pueden volverse más legibles: no como conflicto externo, sino como contraste interno que ' +
        cityName + ' amplifica con paciencia.'
      );
    }
    var themes = (bridgeProfile.themes || []).slice(0, 2);
    if (themes.length) {
      parts.push(
        'Desde tu perfil, ' + name + ', conviene sostener la lectura junto a ejes como ' +
        themes.join(' y ') + ' — no como etiqueta, sino como filtro para notar qué te nutre y qué te desgasta en este entorno.'
      );
    }
    if (!parts.length && bridgeProfile.tags && bridgeProfile.tags.length) {
      parts.push(
        'Tu mapa natal sugiere prestar atención a cómo ' + cityName + ' activa temas que ya conoces: ' +
        bridgeProfile.tags.slice(0, 3).join(', ') + '.'
      );
    }
    return parts.join(' ');
  }

  function composeSection(def, pools, ctx) {
    var slot = def.slot;
    var maxW = def.budget[1];
    var seed = ctx.seed + ':' + slot;
    var parts = [];

    if (slot === 'favorece' && GOAL_INTROS[ctx.goalId]) {
      parts.push(
        replaceCity(GOAL_INTROS[ctx.goalId], ctx.cityName)
          .replace(/\{nombre\}/g, ctx.name)
      );
    }

    if (slot === 'observar' && OBSERVAR_LEADS[ctx.goalId]) {
      parts.push(replaceCity(OBSERVAR_LEADS[ctx.goalId], ctx.cityName));
    }

    var pool = pools[slot] || [];
    if (slot === 'observar') {
      pool = pool.concat(pools.desafia || []);
    }

    var picked = pickSentences(pool, maxW, seed, ctx.cityName);
    if (picked.text) parts.push(picked.text);

    if (slot === 'favorece' && ctx.patterns.repeatedAngle && ctx.patterns.angleTheme) {
      parts.push(
        'Varias señales cercanas insisten en ' + ctx.patterns.angleTheme +
        '. Eso no multiplica el efecto de forma lineal: lo vuelve más coherente — como si el lugar hablara del mismo asunto por distintos tonos.'
      );
    }

    if (slot === 'desafia' && ctx.patterns.planetTheme) {
      parts.push(
        'Puede aparecer una tensión alrededor de ' + ctx.patterns.planetTheme +
        '. No es advertencia; es invitación a nombrar qué te activa antes de que el cuerpo lo traduzca en cansancio o irritación.'
      );
    }

    if (slot === 'cierre') {
      var bridge = bridgeWeave(ctx.bridgeProfile, ctx.goalId, ctx.cityName, ctx.name);
      if (bridge) parts.push(bridge);
      parts.push(
        ctx.name + ', ' + ctx.cityName + ' no define tu ' + (GOAL_LABELS[ctx.goalId] || 'proceso') +
        ' — lo encuadra. La lectura integrada sirve si la usas como espejo práctico: qué probar, qué evitar, qué observar si te quedas.'
      );
    }

    var body = parts.filter(Boolean).join('\n\n');
    return { id: def.id, title: def.title, body: body, words: wordCount(body) };
  }

  function trimToMaxWords(sections, maxTotal) {
    var total = sections.reduce(function (n, s) { return n + s.words; }, 0);
    if (total <= maxTotal) return sections;
    var excess = total - maxTotal;
    var copy = sections.map(function (s) {
      return { id: s.id, title: s.title, body: s.body, words: s.words };
    });
    for (var i = copy.length - 1; i >= 0 && excess > 0; i--) {
      var words = copy[i].body.trim().split(/\s+/);
      while (words.length > 40 && excess > 0) {
        words.pop();
        excess -= 1;
      }
      copy[i].body = words.join(' ');
      copy[i].words = wordCount(copy[i].body);
    }
    return copy;
  }

  function padToMinWords(sections, pools, ctx, minTotal) {
    var total = sections.reduce(function (n, s) { return n + s.words; }, 0);
    if (total >= minTotal) return sections;
    var copy = sections.slice();
    var need = minTotal - total;
    var slotOrder = ['favorece', 'desafia', 'aprovecha', 'observar', 'cierre'];
    var extraPool = [];
    slotOrder.forEach(function (slot) {
      (pools[slot] || []).forEach(function (item) {
        extraPool.push(item);
      });
    });
    extraPool.sort(function (a, b) { return b.weight - a.weight; });
    var idx = 0;
    var sectionIdx = 0;
    while (need > 0 && idx < extraPool.length) {
      var target = copy[sectionIdx % copy.length];
      sectionIdx += 1;
      var sent = extraPool[idx].text;
      idx += 1;
      var norm = normalizeSentence(sent, ctx.cityName);
      if (target.body.toLowerCase().indexOf(norm.slice(0, 40)) !== -1) continue;
      target.body = target.body + ' ' + sent;
      target.words = wordCount(target.body);
      need -= wordCount(sent);
    }
    return copy;
  }

  function containsForbidden(text) {
    var lower = String(text).toLowerCase();
    for (var i = 0; i < FORBIDDEN.length; i++) {
      if (lower.indexOf(FORBIDDEN[i]) !== -1) return FORBIDDEN[i];
    }
    return null;
  }

  function normalizeInfluences(relevantInfluences) {
    if (!Array.isArray(relevantInfluences)) return [];
    return relevantInfluences.slice(0, MAX_INFLUENCES).map(function (item) {
      if (item.line) return item;
      return { line: item, composite: item.composite || 0, distKm: item.distKm || item.dist || 0, lineId: item.lineId || item.id };
    });
  }

  function composeCityReading(input) {
    var empty = {
      ok: false,
      title: '',
      sections: [],
      meta: { schemaVersion: SCHEMA_VERSION, error: 'invalid_input' }
    };

    if (!input || !input.city || !input.city.name) return empty;

    var interpretations = window.INTERPRETATIONS;
    if (!interpretations) {
      empty.meta.error = 'missing_interpretations';
      return empty;
    }

    var city = input.city;
    var cityName = city.name;
    var goalId = resolveGoalId(input.goal);
    var aspect = resolveAspect(goalId, input.goal);
    var name = resolveName(input.profile);
    var influences = normalizeInfluences(input.relevantInfluences);

    if (!influences.length) {
      empty.meta.error = 'no_influences';
      return empty;
    }

    var seed = hash32(cityName + '|' + goalId + '|' + aspect + '|' + influences.length);
    var patterns = detectPatterns(influences);
    var pools = buildSentencePool(influences, aspect, interpretations, cityName);

    var ctx = {
      cityName: cityName,
      name: name,
      goalId: goalId,
      aspect: aspect,
      seed: seed,
      patterns: patterns,
      bridgeProfile: input.bridgeProfile || null
    };

    var sections = SECTION_DEFS.map(function (def) {
      return composeSection(def, pools, ctx);
    });

    var padTarget = TARGET_MIN;
    sections = padToMinWords(sections, pools, ctx, padTarget);
    if (sections.reduce(function (n, s) { return n + s.words; }, 0) < MIN_WORDS) {
      sections = padToMinWords(sections, pools, ctx, MIN_WORDS);
    }
    sections = trimToMaxWords(sections, MAX_WORDS);

    var fullText = sections.map(function (s) { return s.body; }).join('\n\n');
    var totalWords = wordCount(fullText);
    var forbidden = containsForbidden(fullText);

    var used = influences.map(function (inf, i) {
      var line = inf.line;
      return {
        rank: i + 1,
        lineId: inf.lineId || (line && line.id),
        planet: line && line.planet,
        angle: line && line.angle,
        planetKey: line && line.planetKey,
        distKm: Math.round((inf.distKm || 0) * 10) / 10,
        composite: Math.round((inf.composite || 0) * 10000) / 10000,
        interpKey: interpKey(line)
      };
    });

    var title = cityName + ' para ' + name;

    return {
      ok: totalWords >= MIN_WORDS && totalWords <= MAX_WORDS && !forbidden,
      title: title,
      sections: sections.map(function (s) {
        return { id: s.id, title: s.title, body: s.body };
      }),
      meta: {
        schemaVersion: SCHEMA_VERSION,
        cityName: cityName,
        country: city.country || null,
        goalId: goalId,
        aspect: aspect,
        wordCount: totalWords,
        targetBand: [TARGET_MIN, TARGET_MAX],
        influencesUsed: used,
        patterns: patterns,
        score: input.score != null ? input.score : null,
        forbiddenHit: forbidden,
        deterministicSeed: seed
      }
    };
  }

  window.KairosCityPremiumComposition = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MIN_WORDS: MIN_WORDS,
    MAX_WORDS: MAX_WORDS,
    TARGET_MIN: TARGET_MIN,
    TARGET_MAX: TARGET_MAX,
    FORBIDDEN: FORBIDDEN,
    composeCityReading: composeCityReading
  };
})();
