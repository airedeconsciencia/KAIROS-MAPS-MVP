/**
 * KAIROS MAPS — Natal Lite composition service (Fase 3.3b5)
 *
 * Compone lecturas breves uniendo fragmentos curados de natal-lite.js.
 * Sin DOM, sin HTML, sin IA, sin texto generativo libre.
 *
 * Depende de: window.KairosNatalLite (cargar natal-lite.js antes)
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.4.0-style';
  var TENSION_MODE_THRESHOLD = 0.32;
  var MAX_PUEDE_IN_READING = 2;
  var MAX_MODAL_A_VECES = 1;
  var MAX_READING_CHARS = 700;
  var TARGET_READING_CHARS = 550;

  var ROLES = ['SUN', 'MOON', 'ASC'];

  var ROLE_META = {
    SUN: { label: 'vital', inputKey: 'sun' },
    MOON: { label: 'emocional', inputKey: 'moon' },
    ASC: { label: 'presencia', inputKey: 'asc' }
  };

  var STOP_WORDS = {
    esta: 1, este: 1, estos: 1, estas: 1, puede: 1, pueden: 1, cuando: 1,
    algo: 1, más: 1, menos: 1, aquí: 1, donde: 1, como: 1, para: 1, con: 1,
    por: 1, sin: 1, sobre: 1, entre: 1, desde: 1, hacia: 1, todo: 1, todos: 1,
    toda: 1, todas: 1, muy: 1, tan: 1, solo: 1, sólo: 1, bien: 1, ser: 1, estar: 1,
    tiene: 1, tienen: 1, notar: 1, aparecer: 1, sentir: 1, sentirse: 1, lugar: 1,
    lugares: 1, entorno: 1, mapa: 1
  };

  var TAG_COMPAT = {
    communication: ['stimulation', 'reflection', 'harmony', 'movement', 'intimacy'],
    belonging: ['intimacy', 'emotional_safety', 'protection', 'harmony'],
    movement: ['initiative', 'stimulation', 'regulation', 'visibility'],
    emotional_safety: ['belonging', 'intimacy', 'protection', 'regulation'],
    stimulation: ['communication', 'movement', 'reflection', 'initiative'],
    visibility: ['initiative', 'movement', 'harmony'],
    regulation: ['emotional_safety', 'initiative', 'movement', 'reflection'],
    intimacy: ['belonging', 'emotional_safety', 'communication', 'protection'],
    initiative: ['movement', 'visibility', 'regulation', 'stimulation'],
    reflection: ['communication', 'harmony', 'regulation', 'stimulation'],
    harmony: ['communication', 'belonging', 'reflection', 'intimacy'],
    protection: ['emotional_safety', 'belonging', 'intimacy'],
    control: ['regulation', 'reflection', 'protection'],
    expansion: ['movement', 'stimulation', 'initiative'],
    precision: ['regulation', 'reflection'],
    intensity: ['initiative', 'protection', 'intimacy'],
    permeability: ['reflection', 'intimacy', 'emotional_safety'],
    reserve: ['protection', 'regulation', 'control']
  };

  var TENSION_PAIRS = {
    control: ['initiative', 'movement', 'stimulation', 'expansion', 'permeability'],
    regulation: ['movement', 'stimulation', 'expansion'],
    reserve: ['visibility', 'initiative', 'expansion'],
    visibility: ['reflection', 'permeability', 'reserve', 'control'],
    precision: ['expansion', 'movement', 'permeability'],
    expansion: ['control', 'precision', 'regulation'],
    intensity: ['harmony', 'permeability'],
    initiative: ['control', 'reserve', 'regulation'],
    stimulation: ['control', 'reserve', 'regulation'],
    permeability: ['control', 'precision', 'visibility']
  };

  var BRIDGE_ROLE_WEIGHT = {
    ASC: 0.46,
    MOON: 0.34,
    SUN: 0.12
  };

  var BRIDGE_ROLE_WEIGHT_TENSION = {
    ASC: 0.22,
    MOON: 0.42,
    SUN: 0.18
  };

  var PILOT_COMPOSITIONS = [
    { id: 'pilot-1', sun: 'gemini', moon: 'cancer', asc: 'libra' },
    { id: 'pilot-2', sun: 'aries', moon: 'gemini', asc: 'cancer' },
    { id: 'pilot-3', sun: 'cancer', moon: 'aries', asc: 'gemini' }
  ];

  var TENSION_PILOTS = [
    { id: 'tension-a', sun: 'capricorn', moon: 'aries', asc: 'pisces' },
    { id: 'tension-b', sun: 'virgo', moon: 'sagittarius', asc: 'scorpio' },
    { id: 'tension-c', sun: 'leo', moon: 'capricorn', asc: 'gemini' }
  ];

  var TENSION_PILOTS = [
    { id: 'tension-a', sun: 'capricorn', moon: 'aries', asc: 'pisces' },
    { id: 'tension-b', sun: 'virgo', moon: 'sagittarius', asc: 'scorpio' },
    { id: 'tension-c', sun: 'leo', moon: 'capricorn', asc: 'gemini' }
  ];

  var VARIATION_BUCKETS = [
    { id: 'modal_puede', regex: /^puede\b/i },
    { id: 'modal_puede_costarte', regex: /^puede costarte\b/i },
    { id: 'modal_puede_aparecer', regex: /^puede aparecer\b/i },
    { id: 'temporal_a_veces', regex: /^a veces\b/i },
    { id: 'negation_no_siempre', regex: /^no siempre\b/i },
    { id: 'negation_no_es', regex: /^no es\b/i },
    { id: 'observational_hay', regex: /^hay\b/i },
    { id: 'observational_surge', regex: /^surge\b/i },
    { id: 'concrete_el', regex: /^el\b/i },
    { id: 'concrete_la', regex: /^la\b/i },
    { id: 'concrete_cuando', regex: /^cuando\b/i },
    { id: 'direct_lo', regex: /^lo\b/i },
    { id: 'direct_nombrar', regex: /^nombrar\b/i },
    { id: 'direct_ser', regex: /^ser\b/i },
    { id: 'direct_fiarse', regex: /^fiarse\b/i },
    { id: 'direct_entrar', regex: /^entrar\b/i },
    { id: 'direct_quedarte', regex: /^quedarte\b/i }
  ];

  var CLICHE_PATTERNS = [
    { id: 'coaching_pausar', regex: /pausar sin negar/i },
    { id: 'coaching_equilibrio', regex: /\bequilibrio\b/i },
    { id: 'coaching_sanar', regex: /\bsanar\b/i },
    { id: 'coaching_tu_verdad', regex: /tu verdad/i },
    { id: 'coaching_calmar_confrontar', regex: /calmar\s*—\s*o confrontar/i },
    { id: 'spiritual_universo', regex: /universo|alineaci[oó]n|vibraci[oó]n|manifestar/i },
    { id: 'spiritual_energia', regex: /\benerg[ií]a\b/i },
    { id: 'regulation_emocional', regex: /regulaci[oó]n emocional/i },
    { id: 'generic_escucha_corazon', regex: /escucha tu coraz[oó]n/i }
  ];

  var MODAL_PATTERNS = [
    { id: 'excess_puede', regex: /\bpuede\b/gi },
    { id: 'excess_a_veces', regex: /\ba veces\b/gi },
    { id: 'excess_no_siempre', regex: /\bno siempre\b/gi },
    { id: 'excess_tiende', regex: /\btiende a\b/gi }
  ];

  function createStyleState() {
    return {
      buckets: {},
      signatures: {},
      puedeCount: 0,
      aVecesCount: 0,
      noSiempreCount: 0,
      coachingHits: [],
      lastLength: 0,
      sentenceCount: 0
    };
  }

  function normalizeOpening(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getOpeningSignature(sentence) {
    var words = normalizeOpening(sentence).split(' ').filter(Boolean);
    return words.slice(0, 3).join(' ');
  }

  function getVariationBucket(sentence) {
    var text = String(sentence || '').trim();
    for (var i = 0; i < VARIATION_BUCKETS.length; i++) {
      if (VARIATION_BUCKETS[i].regex.test(text)) return VARIATION_BUCKETS[i].id;
    }
    return 'other';
  }

  function detectCliches(text) {
    var hits = [];
    CLICHE_PATTERNS.forEach(function (pattern) {
      if (pattern.regex.test(text)) hits.push(pattern.id);
    });
    return hits;
  }

  function countPatternMatches(text, regex) {
    var matches = String(text || '').match(regex);
    return matches ? matches.length : 0;
  }

  function scoreSentenceStyle(sentence, styleState) {
    var penalty = 0;
    var bucket = getVariationBucket(sentence);
    var signature = getOpeningSignature(sentence);

    if (styleState.buckets[bucket]) penalty += 0.2;
    if (styleState.signatures[signature]) penalty += 0.24;

    var puedeInSentence = countPatternMatches(sentence, /\bpuede\b/gi);
    if (styleState.puedeCount + puedeInSentence > MAX_PUEDE_IN_READING) {
      penalty += 0.14 * (styleState.puedeCount + puedeInSentence - MAX_PUEDE_IN_READING);
    }

    var aVecesInSentence = countPatternMatches(sentence, /\ba veces\b/gi);
    if (styleState.aVecesCount + aVecesInSentence > MAX_MODAL_A_VECES) {
      penalty += 0.1;
    }

    detectCliches(sentence).forEach(function () {
      penalty += 0.28;
    });

    if (styleState.lastLength > 0) {
      var len = sentence.length;
      var ratio = Math.min(len, styleState.lastLength) / Math.max(len, styleState.lastLength);
      if (ratio > 0.88) penalty += 0.05;
    }

    return penalty;
  }

  function registerSentenceStyle(sentence, styleState) {
    var bucket = getVariationBucket(sentence);
    var signature = getOpeningSignature(sentence);
    styleState.buckets[bucket] = (styleState.buckets[bucket] || 0) + 1;
    styleState.signatures[signature] = (styleState.signatures[signature] || 0) + 1;
    styleState.puedeCount += countPatternMatches(sentence, /\bpuede\b/gi);
    styleState.aVecesCount += countPatternMatches(sentence, /\ba veces\b/gi);
    styleState.noSiempreCount += countPatternMatches(sentence, /\bno siempre\b/gi);
    detectCliches(sentence).forEach(function (id) {
      if (styleState.coachingHits.indexOf(id) === -1) styleState.coachingHits.push(id);
    });
    styleState.lastLength = sentence.length;
    styleState.sentenceCount += 1;
  }

  function analyzeStyleWarnings(reading, sections, bridgeRole) {
    var warnings = [];
    var sentences = splitSentences(reading);
    var signatures = {};
    var buckets = {};

    sentences.forEach(function (sentence) {
      var sig = getOpeningSignature(sentence);
      var bucket = getVariationBucket(sentence);
      signatures[sig] = (signatures[sig] || 0) + 1;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });

    Object.keys(signatures).forEach(function (sig) {
      if (signatures[sig] > 1) warnings.push('repeated_opening');
    });

    Object.keys(buckets).forEach(function (bucket) {
      if (bucket.indexOf('modal_puede') === 0 && buckets[bucket] > 1) {
        warnings.push('repeated_modal_puede');
      }
    });

    if (countPatternMatches(reading, /\bpuede\b/gi) > MAX_PUEDE_IN_READING) {
      warnings.push('excess_puede');
    }
    if (countPatternMatches(reading, /\ba veces\b/gi) > MAX_MODAL_A_VECES) {
      warnings.push('excess_a_veces');
    }

    detectCliches(reading).forEach(function (id) {
      warnings.push('coaching_phrase:' + id);
    });

    if (bridgeRole === 'MOON' && sections.length >= 3) {
      var moonText = sections[1] ? sections[1].text : '';
      if (moonText && reading.indexOf(moonText) !== -1 && reading.lastIndexOf(moonText) > reading.length * 0.55) {
        warnings.push('moon_dominance');
      }
    }

    return warnings.filter(function (item, idx, arr) {
      return arr.indexOf(item) === idx;
    });
  }

  function requireNatalLite() {
    if (typeof window.KairosNatalLite === 'undefined') {
      throw new Error('KairosNatalLite no disponible — cargar src/content/natal-lite.js antes');
    }
    return window.KairosNatalLite;
  }

  function normalizeSlug(slug) {
    return String(slug || '').toLowerCase().trim();
  }

  function splitSentences(text) {
    if (!text) return [];
    return String(text)
      .replace(/\s+/g, ' ')
      .trim()
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);
  }

  function significantTokens(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(function (word) {
        return word.length > 3 && !STOP_WORDS[word];
      });
  }

  function tagsOf(entity) {
    if (!entity) return [];
    if (Array.isArray(entity)) return entity.slice();
    if (entity.semanticTags && entity.semanticTags.length) return entity.semanticTags.slice();
    if (entity.tags && entity.tags.length) return entity.tags.slice();
    return [];
  }

  function bridgeTagsOf(fragment) {
    if (!fragment) return [];
    if (fragment.bridgeTags && fragment.bridgeTags.length) return fragment.bridgeTags.slice();
    return tagsOf(fragment);
  }

  function sharedTags(a, b) {
    var ta = tagsOf(a);
    var tb = tagsOf(b);
    return ta.filter(function (tag) {
      return tb.indexOf(tag) !== -1;
    });
  }

  function tensionTagsOf(fragment) {
    if (!fragment) return [];
    if (fragment.tensionTags && fragment.tensionTags.length) return fragment.tensionTags.slice();
    return tagsOf(fragment);
  }

  function scoreTension(a, b) {
    var ta = tagsOf(a);
    var tb = tagsOf(b);
    if (!ta.length || !tb.length) return 0;

    var hits = 0;
    ta.forEach(function (tag) {
      var opponents = TENSION_PAIRS[tag] || [];
      tb.forEach(function (other) {
        if (opponents.indexOf(other) !== -1) hits += 1;
      });
    });

    var shared = sharedTags(ta, tb).length;
    var raw = hits / Math.max(ta.length + tb.length, 1);
    return Math.min(1, Math.max(0, raw * 1.35 - shared * 0.12));
  }

  function scoreReadingTension(fragments) {
    var pairs = [
      ['SUN', 'MOON'],
      ['MOON', 'ASC'],
      ['SUN', 'ASC']
    ];
    var total = 0;
    var contradictionPairs = [];

    pairs.forEach(function (pair) {
      var left = fragments[pair[0]];
      var right = fragments[pair[1]];
      var score = scoreTension(left, right);
      total += score;
      if (score >= 0.22) {
        contradictionPairs.push({
          between: pair[0] + '-' + pair[1],
          score: Number(score.toFixed(4)),
          tagsA: tagsOf(left),
          tagsB: tagsOf(right)
        });
      }
    });

    return {
      tensionScore: Number((total / pairs.length).toFixed(4)),
      contradictionPairs: contradictionPairs
    };
  }

  function tensionBridgeBonus(profile, contradictionPairs) {
    var bridgeTags = tagsOf(profile);
    if (!bridgeTags.length || !contradictionPairs.length) return 0;

    var bonus = 0;
    contradictionPairs.forEach(function (pair) {
      pair.tagsA.concat(pair.tagsB).forEach(function (tag) {
        if (bridgeTags.indexOf(tag) !== -1) bonus += 0.035;
      });
    });
    return Math.min(0.14, bonus);
  }

  function harmonyBridgePenalty(profile, tensionScore) {
    if (tensionScore < TENSION_MODE_THRESHOLD) return 0;
    return tagsOf(profile).indexOf('harmony') !== -1 ? 0.1 : 0;
  }

  function bridgeRoleWeights(tensionScore) {
    return tensionScore >= TENSION_MODE_THRESHOLD
      ? BRIDGE_ROLE_WEIGHT_TENSION
      : BRIDGE_ROLE_WEIGHT;
  }

  function scoreSemanticAffinity(a, b) {
    var ta = tagsOf(a);
    var tb = tagsOf(b);
    if (!ta.length || !tb.length) return 0;

    var union = {};
    ta.concat(tb).forEach(function (tag) { union[tag] = 1; });
    var unionSize = Object.keys(union).length;
    var direct = sharedTags(ta, tb).length;

    var compat = 0;
    ta.forEach(function (tag) {
      var related = TAG_COMPAT[tag] || [];
      tb.forEach(function (other) {
        if (tag === other) return;
        if (related.indexOf(other) !== -1) compat += 1;
      });
    });

    var directScore = direct / Math.max(ta.length, tb.length, 1);
    var compatScore = compat / Math.max(unionSize, 1);
    return Math.min(1, directScore * 0.72 + compatScore * 0.28);
  }

  function mergeFragmentTags(fragments) {
    var merged = [];
    ROLES.forEach(function (role) {
      tagsOf(fragments[role]).forEach(function (tag) {
        if (merged.indexOf(tag) === -1) merged.push(tag);
      });
    });
    return merged;
  }

  function bridgeProfile(fragment) {
    return { semanticTags: bridgeTagsOf(fragment) };
  }

  function semanticTagOverlap(fragment, contextFragments) {
    var ft = tagsOf(fragment);
    if (!ft.length) return 0;
    var max = 0;
    contextFragments.forEach(function (ctx) {
      var shared = sharedTags(ft, ctx).length;
      var score = shared / Math.max(ft.length, 1);
      if (score > max) max = score;
    });
    return max;
  }

  function overlapScore(a, b) {
    var ta = significantTokens(a);
    var tb = significantTokens(b);
    if (!ta.length || !tb.length) return 0;
    var shared = 0;
    ta.forEach(function (token) {
      if (tb.indexOf(token) !== -1) shared++;
    });
    return shared / Math.max(ta.length, tb.length);
  }

  function maxOverlapWithContext(sentence, contextParts) {
    var max = 0;
    contextParts.forEach(function (part) {
      var score = overlapScore(sentence, part);
      if (score > max) max = score;
    });
    return max;
  }

  function pickSentences(options) {
    var candidates = options.candidates || [];
    var context = options.context || [];
    var contextFragments = options.contextFragments || [];
    var styleState = options.styleState || createStyleState();
    var limit = options.limit || 1;
    var maxOverlap = options.maxOverlap != null ? options.maxOverlap : 0.45;
    var maxSemanticOverlap = options.maxSemanticOverlap != null ? options.maxSemanticOverlap : 0.55;
    var fragmentTags = options.fragmentTags || [];
    var tensionMode = !!options.tensionMode;
    var preferContrast = !!options.preferContrast;
    var picked = [];
    var pool = candidates.slice();

    while (picked.length < limit && pool.length) {
      var bestIdx = -1;
      var bestScore = Infinity;

      pool.forEach(function (sentence, idx) {
        var overlap = maxOverlapWithContext(sentence, context.concat(picked));
        var semantic = contextFragments.length
          ? semanticTagOverlap({ semanticTags: fragmentTags }, contextFragments)
          : 0;
        if (isDanglingReference(sentence) && !picked.length) return;
        var stylePenalty = scoreSentenceStyle(sentence, styleState);
        var composite = overlap + semantic * (preferContrast ? 0.12 : 0.35) + stylePenalty;
        if (tensionMode && preferContrast && /tensi[oó]n|incompatib|fricci[oó]n|contrad|fricci/i.test(sentence)) {
          composite -= 0.08;
        }
        var semanticLimit = tensionMode && preferContrast
          ? Math.max(maxSemanticOverlap, 0.78)
          : maxSemanticOverlap;
        if (overlap <= maxOverlap && semantic <= semanticLimit && composite < bestScore) {
          bestScore = composite;
          bestIdx = idx;
        }
      });

      if (bestIdx === -1) {
        pool.forEach(function (sentence, idx) {
          if (isDanglingReference(sentence) && !picked.length) return;
          var overlap = maxOverlapWithContext(sentence, context.concat(picked));
          var semantic = contextFragments.length
            ? semanticTagOverlap({ semanticTags: fragmentTags }, contextFragments)
            : 0;
          var composite = overlap + semantic * (preferContrast ? 0.12 : 0.35) +
            scoreSentenceStyle(sentence, styleState);
          if (composite < bestScore) {
            bestScore = composite;
            bestIdx = idx;
          }
        });
      }

      if (bestIdx === -1) break;
      picked.push(pool[bestIdx]);
      registerSentenceStyle(pool[bestIdx], styleState);
      pool.splice(bestIdx, 1);
    }

    return picked;
  }

  function resolveFragment(role, slug) {
    var lite = requireNatalLite();
    return lite.lookupBySlug(role, normalizeSlug(slug));
  }

  function buildTitle(fragments) {
    var parts = [];
    if (fragments.SUN) parts.push('Sol en ' + fragments.SUN.sign);
    if (fragments.MOON) parts.push('Luna en ' + fragments.MOON.sign);
    if (fragments.ASC) parts.push('Asc en ' + fragments.ASC.sign);
    return parts.join(' · ');
  }

  function selectBridge(fragments, contextText, tensionMeta) {
    var readingProfile = { semanticTags: mergeFragmentTags(fragments) };
    var ascFragment = fragments.ASC;
    var moonFragment = fragments.MOON;
    var tensionScore = tensionMeta ? tensionMeta.tensionScore : 0;
    var contradictionPairs = tensionMeta ? tensionMeta.contradictionPairs : [];
    var roleWeights = bridgeRoleWeights(tensionScore);
    var ascBridgeWeight = tensionScore >= TENSION_MODE_THRESHOLD ? 0.28 : 0.46;
    var moonBridgeWeight = tensionScore >= TENSION_MODE_THRESHOLD ? 0.4 : 0.34;
    var candidates = [];
    var rejectedCandidates = [];

    ROLES.forEach(function (role) {
      var fragment = fragments[role];
      if (!fragment || !fragment.bridge) return;

      var profile = bridgeProfile(fragment);
      var ascAffinity = scoreSemanticAffinity(profile, ascFragment);
      var moonAffinity = scoreSemanticAffinity(profile, moonFragment);
      var readingAffinity = scoreSemanticAffinity(profile, readingProfile);
      var roleBonus = roleWeights[role] || 0;
      var overlapPenalty = overlapScore(fragment.bridge, contextText) * 0.12;
      var tensionBonus = tensionBridgeBonus(profile, contradictionPairs);
      var harmonyPenalty = harmonyBridgePenalty(profile, tensionScore);
      var clichePenalty = detectCliches(fragment.bridge).length * 0.08;
      var rawScore = (
        ascAffinity * ascBridgeWeight +
        moonAffinity * moonBridgeWeight +
        readingAffinity * 0.14 +
        roleBonus +
        tensionBonus -
        overlapPenalty -
        harmonyPenalty -
        clichePenalty
      );
      var affinityScore = Math.min(1, Math.max(0, rawScore));

      candidates.push({
        role: role,
        fragmentId: fragment.id,
        text: fragment.bridge,
        affinityScore: Number(affinityScore.toFixed(4)),
        ascAffinity: Number(ascAffinity.toFixed(4)),
        moonAffinity: Number(moonAffinity.toFixed(4)),
        tensionBonus: Number(tensionBonus.toFixed(4)),
        harmonyPenalty: Number(harmonyPenalty.toFixed(4)),
        sharedTags: {
          asc: sharedTags(profile, ascFragment),
          moon: sharedTags(profile, moonFragment),
          reading: sharedTags(profile, readingProfile)
        },
        overlapPenalty: Number(overlapPenalty.toFixed(4))
      });
    });

    candidates.sort(function (a, b) {
      return b.affinityScore - a.affinityScore;
    });

    var selected = candidates.length ? candidates[0] : null;
    if (candidates.length > 1) {
      rejectedCandidates = candidates.slice(1);
    }

    return {
      selected: selected,
      rejectedCandidates: rejectedCandidates
    };
  }

  function isDanglingReference(sentence) {
    return /^(Eso|Esa|Este|Esta|Aquello|Aquella)\b/i.test(String(sentence || '').trim());
  }

  function expandReading(parts, fragments, limit, styleState) {
    if (parts.length < 2) return parts;
    var closing = parts[parts.length - 1];
    var segments = parts.slice(0, -1);
    var reading = parts.join(' ').replace(/\s+/g, ' ').trim();
    if (reading.length >= TARGET_READING_CHARS) return parts;

    ROLES.forEach(function (role, idx) {
      if (reading.length >= TARGET_READING_CHARS) return;
      if (idx >= segments.length) return;
      var fragment = fragments[role];
      if (!fragment) return;
      var extras = splitSentences(fragment.body).filter(function (sentence) {
        return segments[idx].indexOf(sentence) === -1 &&
          maxOverlapWithContext(sentence, [reading]) <= 0.42 &&
          !isDanglingReference(sentence);
      });
      if (!extras.length) return;

      var bestExtra = null;
      var bestScore = Infinity;
      extras.forEach(function (sentence) {
        var score = maxOverlapWithContext(sentence, [reading]) +
          scoreSentenceStyle(sentence, styleState);
        if (score < bestScore) {
          bestScore = score;
          bestExtra = sentence;
        }
      });
      if (!bestExtra) return;

      segments[idx] = (segments[idx] + ' ' + bestExtra).trim();
      registerSentenceStyle(bestExtra, styleState);
      reading = segments.concat(closing).join(' ').replace(/\s+/g, ' ').trim();
    });

    return segments.concat(closing);
  }

  function trimReadingParts(parts, limit) {
    var trimmed = parts.slice();
    while (trimmed.length > 2 && trimmed.join(' ').length > limit) {
      var removable = trimmed.length - 1;
      if (removable > 0) trimmed.splice(removable, 1);
      else break;
    }
    return trimmed;
  }

  function dedupeSentences(sentences, styleState) {
    var seen = {};
    return sentences.filter(function (sentence) {
      var sig = getOpeningSignature(sentence);
      if (seen[sig]) return false;
      seen[sig] = true;
      return true;
    });
  }

  function buildReadingFromSentences(sentences, limit) {
    var deduped = dedupeSentences(sentences);
    var reading = deduped.join(' ').replace(/\s+/g, ' ').trim();
    if (reading.length <= limit) return reading;

    var trimmed = deduped.slice();
    while (trimmed.length > 2 && trimmed.join(' ').length > limit) {
      trimmed.pop();
    }
    reading = trimmed.join(' ').replace(/\s+/g, ' ').trim();
    if (reading.length > limit) {
      reading = reading.slice(0, limit - 1).replace(/\s+\S*$/, '') + '…';
    }
    return reading;
  }

  function trimReadingToLimit(parts, limit, fragments, styleState) {
    var expanded = expandReading(parts.slice(), fragments || {}, limit, styleState || createStyleState());
    var sentences = [];
    expanded.slice(0, -1).forEach(function (segment) {
      splitSentences(segment).forEach(function (sentence) {
        sentences.push(sentence);
      });
    });
    if (expanded.length) sentences.push(expanded[expanded.length - 1]);
    return buildReadingFromSentences(sentences, limit);
  }

  function composeNatalLiteReading(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('composeNatalLiteReading requiere un objeto { sun, moon, asc }');
    }

    var fragments = {};
    var missing = [];

    ROLES.forEach(function (role) {
      var slug = input[ROLE_META[role].inputKey];
      if (!slug) {
        missing.push(role);
        return;
      }
      var fragment = resolveFragment(role, slug);
      if (!fragment) {
        missing.push(role + ':' + slug);
        return;
      }
      fragments[role] = fragment;
    });

    if (missing.length) {
      return {
        ok: false,
        error: 'FRAGMENT_MISSING',
        missing: missing,
        title: null,
        intro: null,
        sections: [],
        closing: null,
        reading: null,
        meta: { schemaVersion: SCHEMA_VERSION }
      };
    }

    var tensionMeta = scoreReadingTension(fragments);
    var tensionMode = tensionMeta.tensionScore >= TENSION_MODE_THRESHOLD;
    var styleState = createStyleState();
    var context = [];
    var contextFragments = [];
    var sections = [];

    ROLES.forEach(function (role) {
      var fragment = fragments[role];
      var headline = fragment.headline;
      var bodySentences = splitSentences(fragment.body);
      var selected = [];
      var pickOpts = {
        context: context,
        contextFragments: contextFragments,
        fragmentTags: tagsOf(fragment),
        styleState: styleState,
        limit: 1,
        tensionMode: tensionMode,
        preferContrast: tensionMode && (role === 'MOON' || role === 'ASC')
      };

      if (role === 'SUN') {
        selected.push(headline);
        registerSentenceStyle(headline, styleState);
        pickOpts.candidates = bodySentences;
        pickOpts.maxOverlap = 0.35;
        pickOpts.maxSemanticOverlap = 0.55;
        selected = selected.concat(pickSentences(pickOpts));
      } else {
        pickOpts.candidates = bodySentences;
        pickOpts.context = context.concat([fragments.SUN ? fragments.SUN.headline : '']);
        pickOpts.maxOverlap = 0.42;
        pickOpts.maxSemanticOverlap = role === 'ASC' ? 0.52 : 0.62;
        selected = pickSentences(pickOpts);
        if (!selected.length && headline) {
          var headlineOverlap = overlapScore(headline, context.join(' '));
          var headlineSemantic = semanticTagOverlap(fragment, contextFragments);
          var headlineStyle = scoreSentenceStyle(headline, styleState);
          var headlineLimit = tensionMode ? 0.62 : 0.5;
          if (headlineOverlap <= 0.52 && headlineSemantic <= headlineLimit && headlineStyle < 0.4) {
            selected = [headline];
            registerSentenceStyle(headline, styleState);
          }
        }
      }

      var text = selected.join(' ').trim();
      context.push(text);
      contextFragments.push(fragment);
      sections.push({
        role: role,
        label: ROLE_META[role].label,
        sign: fragment.sign,
        slug: normalizeSlug(input[ROLE_META[role].inputKey]),
        fragmentId: fragment.id,
        semanticTags: tagsOf(fragment),
        text: text
      });
    });

    var intro = sections.length ? sections[0].text : null;
    var bodySections = sections.slice(1);
    var bridgeResult = selectBridge(fragments, context.join(' '), tensionMeta);
    var bridge = bridgeResult.selected;
    var closing = bridge ? bridge.text : null;

    if (closing && scoreSentenceStyle(closing, styleState) < 0.45) {
      registerSentenceStyle(closing, styleState);
    } else if (closing && bridgeResult.rejectedCandidates.length) {
      var alt = null;
      for (var i = 0; i < bridgeResult.rejectedCandidates.length; i++) {
        var candidate = bridgeResult.rejectedCandidates[i];
        if (detectCliches(candidate.text).length === 0 &&
            scoreSentenceStyle(candidate.text, styleState) < 0.35) {
          alt = candidate;
          break;
        }
      }
      if (alt) {
        closing = alt.text;
        bridge = alt;
      }
    }

    var readingParts = [];
    if (intro) readingParts.push(intro);
    bodySections.forEach(function (section) {
      if (section.text) readingParts.push(section.text);
    });
    if (closing) readingParts.push(closing);

    var reading = trimReadingToLimit(readingParts, MAX_READING_CHARS, fragments, styleState);
    var styleWarnings = analyzeStyleWarnings(reading, sections, bridge ? bridge.role : null);

    return {
      ok: true,
      title: buildTitle(fragments),
      intro: intro,
      sections: sections,
      closing: closing,
      reading: reading,
      meta: {
        schemaVersion: SCHEMA_VERSION,
        charCount: reading.length,
        fragmentIds: sections.map(function (s) { return s.fragmentId; }),
        bridgeFrom: bridge ? bridge.role : null,
        selectedBridge: bridge ? {
          role: bridge.role,
          fragmentId: bridge.fragmentId,
          text: bridge.text
        } : null,
        affinityScore: bridge ? bridge.affinityScore : null,
        sharedTags: bridge ? bridge.sharedTags : null,
        rejectedCandidates: bridgeResult.rejectedCandidates,
        tensionScore: tensionMeta.tensionScore,
        tensionMode: tensionMode,
        contradictionPairs: tensionMeta.contradictionPairs,
        styleWarnings: styleWarnings,
        clichesDetected: detectCliches(reading),
        targetChars: TARGET_READING_CHARS,
        maxChars: MAX_READING_CHARS
      }
    };
  }

  function composePilotReadings(list) {
    var pilots = list || PILOT_COMPOSITIONS;
    return pilots.map(function (pilot) {
      var result = composeNatalLiteReading({
        sun: pilot.sun,
        moon: pilot.moon,
        asc: pilot.asc
      });
      return {
        id: pilot.id,
        input: { sun: pilot.sun, moon: pilot.moon, asc: pilot.asc },
        composition: result
      };
    });
  }

  function composeTensionPilots() {
    return composePilotReadings(TENSION_PILOTS);
  }

  window.KairosNatalComposition = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    MAX_READING_CHARS: MAX_READING_CHARS,
    TENSION_MODE_THRESHOLD: TENSION_MODE_THRESHOLD,
    PILOT_COMPOSITIONS: PILOT_COMPOSITIONS,
    TENSION_PILOTS: TENSION_PILOTS,
    scoreSemanticAffinity: scoreSemanticAffinity,
    scoreTension: scoreTension,
    scoreReadingTension: scoreReadingTension,
    analyzeStyleWarnings: analyzeStyleWarnings,
    detectCliches: detectCliches,
    getVariationBucket: getVariationBucket,
    sharedTags: sharedTags,
    composeNatalLiteReading: composeNatalLiteReading,
    composePilotReadings: composePilotReadings,
    composeTensionPilots: composeTensionPilots
  };
})();
