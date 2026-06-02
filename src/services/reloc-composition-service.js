/**
 * KAIROS MAPS — Reloc composition service (Fase 3.7b.4 DEV)
 *
 * Ensambla lectura breve de reubicación desde fragmentos reloc-lite.
 * Cuatro ángulos equilibrados cuando existen fragmentos ASC/MC/IC/DC.
 * Sin DOM, sin IA, sin motores.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '0.2.0-role-balance';
  var ROLE_ORDER = ['ASC', 'MC', 'IC', 'DC'];
  var MIN_CHARS = 500;
  var MAX_CHARS = 850;
  var INITIAL_SUPPORT_LIMIT = 140;

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

  function analyzeStyleWarnings(reading, fragmentCount, includedRoles) {
    var warnings = [];
    var len = reading.length;
    if (len < MIN_CHARS) warnings.push('too_short');
    if (len > MAX_CHARS) warnings.push('too_long');
    if (fragmentCount < 1) warnings.push('no_fragments');
    if (includedRoles && includedRoles.length < fragmentCount) {
      warnings.push('incomplete_role_coverage');
    }

    var sentences = splitSentences(reading);
    var openings = {};
    sentences.forEach(function (sentence) {
      var opening = sentence.slice(0, 24).toLowerCase();
      openings[opening] = (openings[opening] || 0) + 1;
    });
    Object.keys(openings).forEach(function (key) {
      if (openings[key] > 1) warnings.push('repeated_opening');
    });

    var aquiCount = (reading.match(/\bAquí\b/g) || []).length;
    if (aquiCount > 2) warnings.push('excessive_aqui');

    var puedeCount = (reading.match(/\bpuede\b/gi) || []).length;
    if (puedeCount > 8) warnings.push('excessive_puede');

    return warnings;
  }

  function isCriticalWarning(warnings, cliches) {
    if (cliches.some(function (c) { return c.indexOf('forbidden_') === 0; })) return true;
    if (warnings.indexOf('too_short') !== -1) return true;
    if (warnings.indexOf('incomplete_role_coverage') !== -1) return true;
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

  function softenHeadline(headline, index) {
    if (!headline) return '';
    var h = String(headline).trim();
    if (index === 0) return h;
    if (/^Aquí\s+/i.test(h)) {
      h = h.replace(/^Aquí\s+/i, '');
      if (h.length) h = h.charAt(0).toUpperCase() + h.slice(1);
    }
    return h;
  }

  function pickSupportSentence(frag, lead) {
    var bodySents = splitSentences(frag.body);
    var bridgeSents = splitSentences(frag.bridge);
    var leadNorm = lead.trim().toLowerCase();
    var i;

    for (i = 0; i < bodySents.length; i++) {
      if (bodySents[i].trim().toLowerCase() !== leadNorm) {
        return bodySents[i];
      }
    }
    if (bodySents.length) return bodySents[0];
    if (bridgeSents.length) return bridgeSents[0];
    return '';
  }

  function truncateAtWord(text, maxLen) {
    if (!text || text.length <= maxLen) return text || '';
    var cut = text.slice(0, maxLen - 1).replace(/\s+\S*$/, '').trim();
    return cut ? cut + '…' : text.slice(0, maxLen - 1) + '…';
  }

  function buildRoleBlocks(fragments) {
    return fragments.map(function (frag, index) {
      var lead = softenHeadline(frag.headline, index);
      var support = pickSupportSentence(frag, lead);
      return {
        role: frag.role,
        fragmentId: frag.id,
        lead: lead,
        support: support
      };
    });
  }

  function renderBlocks(blocks, supportLimit) {
    return blocks.map(function (block) {
      var support = truncateAtWord(block.support, supportLimit);
      var text = support
        ? (block.lead + ' ' + support).replace(/\s+/g, ' ').trim()
        : block.lead;
      return { role: block.role, text: text };
    });
  }

  function joinParts(parts) {
    return parts.map(function (part) { return part.text; }).join(' ').replace(/\s+/g, ' ').trim();
  }

  function assembleBalancedReading(blocks) {
    var supportLimit = INITIAL_SUPPORT_LIMIT;
    var parts = renderBlocks(blocks, supportLimit);
    var reading = joinParts(parts);

    while (reading.length > MAX_CHARS && supportLimit > 45) {
      supportLimit -= 12;
      parts = renderBlocks(blocks, supportLimit);
      reading = joinParts(parts);
    }

    if (reading.length > MAX_CHARS) {
      var budget = Math.floor(MAX_CHARS / parts.length);
      parts = parts.map(function (part) {
        return { role: part.role, text: truncateAtWord(part.text, budget) };
      });
      reading = joinParts(parts);
    }

    while (reading.length < MIN_CHARS && supportLimit < 220) {
      supportLimit += 15;
      parts = renderBlocks(blocks, supportLimit);
      reading = joinParts(parts);
    }

    if (reading.length > MAX_CHARS) {
      reading = truncateAtWord(reading, MAX_CHARS);
      parts = renderBlocks(blocks, supportLimit);
    }

    var includedRoles = parts
      .filter(function (part) { return part.text && part.text.length > 0; })
      .map(function (part) { return part.role; });

    return { reading: reading, includedRoles: includedRoles };
  }

  function buildRoleMeta(fragments, includedRoles) {
    var expectedRoles = fragments
      .map(function (frag) { return frag.role; })
      .filter(function (role, idx, arr) { return arr.indexOf(role) === idx; })
      .sort(function (a, b) { return roleRank({ role: a }) - roleRank({ role: b }); });

    var omittedRoles = expectedRoles.filter(function (role) {
      return includedRoles.indexOf(role) === -1;
    });

    var roleCoveragePercent = expectedRoles.length
      ? Math.round((includedRoles.length / expectedRoles.length) * 100)
      : 0;

    return {
      includedRoles: includedRoles,
      omittedRoles: omittedRoles,
      roleCoveragePercent: roleCoveragePercent,
      expectedRoles: expectedRoles
    };
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

      var blocks = buildRoleBlocks(fragments);
      var assembled = assembleBalancedReading(blocks);
      var reading = assembled.reading;
      if (!reading) {
        return fail('empty_reading');
      }

      var roleMeta = buildRoleMeta(fragments, assembled.includedRoles);
      var cliches = detectCliches(reading);
      var styleWarnings = analyzeStyleWarnings(reading, fragments.length, assembled.includedRoles);
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
          includedRoles: roleMeta.includedRoles,
          omittedRoles: roleMeta.omittedRoles,
          roleCoveragePercent: roleMeta.roleCoveragePercent,
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
    ROLE_ORDER: ROLE_ORDER,
    MIN_CHARS: MIN_CHARS,
    MAX_CHARS: MAX_CHARS,
    composeRelocationReading: composeRelocationReading,
    detectCliches: detectCliches,
    analyzeStyleWarnings: analyzeStyleWarnings
  };
})();
