/**
 * KAIROS MAPS — Reloc composition service (Fase 3.7b.3 DEV)
 *
 * Ensambla lectura breve de reubicación desde fragmentos reloc-lite.
 * Sin DOM, sin IA, sin motores.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.1.0-reloc-composition';
  var ROLE_ORDER = ['ASC', 'MC', 'IC', 'DC'];
  var MIN_CHARS = 500;
  var MAX_CHARS = 800;
  var TARGET_CHARS = 650;

  var FORBIDDEN_WORDS = [
    'destino', 'perfecto', 'garantizado', 'alma gemela', 'debes mudarte'
  ];

  var CLICHE_PATTERNS = [
    { id: 'cliche_cambiar_vida', regex: /cambiar[aá]\s+tu\s+vida/i },
    { id: 'cliche_lugar_ideal', regex: /lugar\s+ideal/i },
    { id: 'cliche_signo_destino', regex: /signo\s+del\s+destino/i }
  ];

  function fail(reason) {
    return {
      ok: false,
      reason: reason,
      title: null,
      reading: '',
      fragmentIds: [],
      meta: { schemaVersion: SCHEMA_VERSION }
    };
  }

  function getRelocLite() {
    if (typeof window !== 'undefined' && window.KairosRelocLite) {
      return window.KairosRelocLite;
    }
    return null;
  }

  function splitSentences(text) {
    if (!text) return [];
    return String(text)
      .replace(/\s+/g, ' ')
      .trim()
      .split(/(?<=[.!?…])\s+/)
      .filter(Boolean);
  }

  function roleRank(fragment) {
    var idx = ROLE_ORDER.indexOf(fragment.role);
    return idx === -1 ? 99 : idx;
  }

  function resolveFragmentIds(input) {
    var profile = input.relocationProfile;
    if (Array.isArray(input.fragments) && input.fragments.length) {
      return input.fragments.map(function (f) {
        return typeof f === 'string' ? f : f.id;
      }).filter(Boolean);
    }
    if (profile && profile.sourceIds && Array.isArray(profile.sourceIds.fragmentIds)) {
      return profile.sourceIds.fragmentIds.slice();
    }
    return [];
  }

  function loadFragments(ids) {
    var RelocLite = getRelocLite();
    if (!RelocLite) return [];
    return ids.map(function (id) {
      return RelocLite.getFragment(id);
    }).filter(Boolean).sort(function (a, b) {
      return roleRank(a) - roleRank(b);
    });
  }

  function detectCliches(text) {
    var hits = [];
    CLICHE_PATTERNS.forEach(function (pattern) {
      if (pattern.regex.test(text)) hits.push(pattern.id);
    });
    FORBIDDEN_WORDS.forEach(function (word) {
      if (String(text).toLowerCase().indexOf(word) !== -1) {
        hits.push('forbidden_' + word.replace(/\s+/g, '_'));
      }
    });
    return hits;
  }

  function analyzeStyleWarnings(reading, fragmentCount) {
    var warnings = [];
    var len = reading.length;
    if (len < MIN_CHARS) warnings.push('too_short');
    if (len > MAX_CHARS) warnings.push('too_long');
    if (fragmentCount < 1) warnings.push('no_fragments');

    var sentences = splitSentences(reading);
    var openings = {};
    sentences.forEach(function (sentence) {
      var opening = sentence.slice(0, 24).toLowerCase();
      openings[opening] = (openings[opening] || 0) + 1;
    });
    Object.keys(openings).forEach(function (key) {
      if (openings[key] > 1) warnings.push('repeated_opening');
    });

    var puedeCount = (reading.match(/\bpuede\b/gi) || []).length;
    if (puedeCount > 6) warnings.push('excessive_puede');

    return warnings;
  }

  function isCriticalWarning(warnings, cliches) {
    if (cliches.some(function (c) { return c.indexOf('forbidden_') === 0; })) return true;
    if (warnings.indexOf('too_short') !== -1) return true;
    if (cliches.length > 0) return true;
    return false;
  }

  function buildTitle(profile, goalContext) {
    var city = profile && profile.meta && profile.meta.cityName
      ? profile.meta.cityName
      : 'este lugar';
    var goalLabel = goalContext && goalContext.primary
      ? goalContext.primary.humanLabel
      : null;
    if (goalLabel) {
      return 'Si vivieras en ' + city + ' · explorando ' + goalLabel.toLowerCase();
    }
    return 'Si vivieras en ' + city;
  }

  function collectSentences(fragments) {
    var pool = [];
    fragments.forEach(function (frag, idx) {
      if (idx === 0 && frag.headline) pool.push(frag.headline);
      splitSentences(frag.body).forEach(function (sentence) {
        if (pool.indexOf(sentence) === -1) pool.push(sentence);
      });
    });
    var last = fragments[fragments.length - 1];
    if (last && last.bridge && pool.indexOf(last.bridge) === -1) {
      pool.push(last.bridge);
    }
    return pool;
  }

  function assembleReading(sentences) {
    var selected = [];
    var reading = '';
    sentences.forEach(function (sentence) {
      if (reading.length >= TARGET_CHARS && reading.length >= MIN_CHARS) return;
      var next = (reading ? reading + ' ' : '') + sentence;
      if (next.length <= MAX_CHARS) {
        selected.push(sentence);
        reading = next.replace(/\s+/g, ' ').trim();
      }
    });

    while (reading.length < MIN_CHARS && selected.length < sentences.length) {
      var added = false;
      for (var i = 0; i < sentences.length; i++) {
        if (selected.indexOf(sentences[i]) !== -1) continue;
        var attempt = (reading ? reading + ' ' : '') + sentences[i];
        if (attempt.length <= MAX_CHARS) {
          selected.push(sentences[i]);
          reading = attempt.replace(/\s+/g, ' ').trim();
          added = true;
          break;
        }
      }
      if (!added) break;
    }

    if (reading.length > MAX_CHARS) {
      reading = reading.slice(0, MAX_CHARS - 1).replace(/\s+\S*$/, '') + '…';
    }

    return { reading: reading, selectedCount: selected.length };
  }

  function composeRelocationReading(input) {
    try {
      if (!input || typeof input !== 'object') {
        return fail('invalid_input');
      }

      var profile = input.relocationProfile;
      if (!profile || !profile.ok) {
        return fail('invalid_relocation_profile');
      }

      var fragmentIds = resolveFragmentIds(input);
      if (!fragmentIds.length) {
        return fail('no_fragments');
      }

      var fragments = loadFragments(fragmentIds);
      if (!fragments.length) {
        return fail('fragments_not_found');
      }

      var sentences = collectSentences(fragments);
      var assembled = assembleReading(sentences);
      var reading = assembled.reading;
      if (!reading) {
        return fail('empty_reading');
      }

      var cliches = detectCliches(reading);
      var styleWarnings = analyzeStyleWarnings(reading, fragments.length);
      var goalContext = input.goalContext || null;
      var usedIds = fragments.map(function (f) { return f.id; });

      return {
        ok: true,
        title: buildTitle(profile, goalContext),
        reading: reading,
        fragmentIds: usedIds,
        meta: {
          schemaVersion: SCHEMA_VERSION,
          charCount: reading.length,
          minChars: MIN_CHARS,
          maxChars: MAX_CHARS,
          fragmentCount: fragments.length,
          styleWarnings: styleWarnings,
          clichesDetected: cliches,
          criticalWarnings: isCriticalWarning(styleWarnings, cliches),
          cityRef: profile.meta && profile.meta.cityRef,
          goal: profile.meta && profile.meta.goal
        }
      };
    } catch (e) {
      return fail('internal_error');
    }
  }

  window.KairosRelocComposition = {
    schemaVersion: SCHEMA_VERSION,
    MIN_CHARS: MIN_CHARS,
    MAX_CHARS: MAX_CHARS,
    composeRelocationReading: composeRelocationReading,
    detectCliches: detectCliches,
    analyzeStyleWarnings: analyzeStyleWarnings
  };
})();
