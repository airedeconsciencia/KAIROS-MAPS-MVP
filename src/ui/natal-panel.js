/**
 * Fase 2.2b — Natal Panel render (lite FREE)
 * Helpers puros / HTML strings. Sin DOM mounting (2.2c).
 */
(function () {
  'use strict';

  var ASSETS_PLANETS = 'assets/kairos_symbols/planets/';
  var ASSETS_SIGNS = 'assets/kairos_symbols/signs/';

  var FREE_PLANETS = [
    'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'
  ];

  var CARD_KEYS = [
    { key: 'SUN', label: 'Sol', source: 'planets', glyphId: 'sol' },
    { key: 'MOON', label: 'Luna', source: 'planets', glyphId: 'luna' },
    { key: 'ASC', label: 'Ascendente', source: 'angles' },
    { key: 'MC', label: 'Medio Cielo', source: 'angles' }
  ];

  var PLANET_LABELS = {
    SUN: 'Sol',
    MOON: 'Luna',
    MERCURY: 'Mercurio',
    VENUS: 'Venus',
    MARS: 'Marte',
    JUPITER: 'Júpiter',
    SATURN: 'Saturno'
  };

  var PLANET_GLYPH_ID = {
    SUN: 'sol',
    MOON: 'luna',
    MERCURY: 'mercurio',
    VENUS: 'venus',
    MARS: 'marte',
    JUPITER: 'jupiter',
    SATURN: 'saturno'
  };

  var PLANET_FILE_BY_GLYPH_ID = {
    sol: 'sun.svg',
    luna: 'moon.svg',
    mercurio: 'mercury.svg',
    venus: 'venus.svg',
    marte: 'mars.svg',
    jupiter: 'jupiter.svg',
    saturno: 'saturn.svg'
  };

  var SIGN_SLUG_BY_NAME = {
    Aries: 'aries',
    Tauro: 'taurus',
    'Géminis': 'gemini',
    'Cáncer': 'cancer',
    Leo: 'leo',
    Virgo: 'virgo',
    Libra: 'libra',
    Escorpio: 'scorpio',
    Sagitario: 'sagittarius',
    Capricornio: 'capricorn',
    Acuario: 'aquarius',
    Piscis: 'pisces'
  };

  var SIGN_SLUGS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  var SIGN_FILE_BY_SLUG = {
    aries: 'aries.svg',
    taurus: 'taurus.svg',
    gemini: 'gemini.svg',
    cancer: 'cancer.svg',
    leo: 'leo.svg',
    virgo: 'virgo.svg',
    libra: 'libra.svg',
    scorpio: 'scorpio.svg',
    sagittarius: 'sagittarius.svg',
    capricorn: 'capricorn.svg',
    aquarius: 'aquarius.svg',
    pisces: 'pisces.svg'
  };

  var signCache = {};
  var signGlyphsLoaded = false;
  var signReadyCallbacks = [];

  var STATE_MESSAGES = {
    idle: 'Pulsa Calcular mi mapa para ver tu carta.',
    loading: 'Calculando Sol, Luna y ángulos…',
    ready: '',
    error: 'No pudimos calcular tu carta natal. El mapa sigue activo. Vuelve a pulsar Calcular mi mapa.',
    skipped: ''
  };

  function renderIdleHTML() {
    return (
      '<div class="natal-panel-empty">' +
        '<div class="natal-panel-empty-mark" aria-hidden="true">◆</div>' +
        '<p class="natal-panel-empty-title">Tu carta natal aparecerá aquí</p>' +
        '<p class="natal-panel-empty-sub">Sol, Luna, Ascendente y planetas esenciales — incluido en tu mapa.</p>' +
      '</div>'
    );
  }

  function esc(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtPos(pos) {
    if (!pos) return '—';
    var degPart = pos.deg + '° ' + pos.min + "'";
    var lon = pos.longitude != null ? pos.longitude.toFixed(2) + '°' : '—';
    return degPart + ' · ' + lon;
  }

  function fmtSignDegree(pos) {
    if (!pos) return '—° —′';
    return pos.deg + '° ' + pos.min + "'";
  }

  function signSlug(signName) {
    if (!signName) return null;
    var slug = SIGN_SLUG_BY_NAME[signName];
    if (slug) return slug;
    var normalized = String(signName).normalize('NFC');
    slug = SIGN_SLUG_BY_NAME[normalized];
    if (slug) return slug;
    var trimmed = String(signName).trim();
    return SIGN_SLUG_BY_NAME[trimmed] || SIGN_SLUG_BY_NAME[trimmed.normalize('NFC')] || null;
  }

  function signAssetPath(slug) {
    var file = SIGN_FILE_BY_SLUG[slug];
    if (!file) return '';
    return ASSETS_SIGNS + file;
  }

  function sanitizeSignSvg(svgText) {
    if (!svgText) return '';
    return String(svgText).replace(/<\?xml[^?]*\?>/i, '').trim();
  }

  function whenSignGlyphsReady(fn) {
    if (signGlyphsLoaded) fn();
    else signReadyCallbacks.push(fn);
  }

  function refreshMountedSignGlyphs() {
    var root = document.getElementById('natal-panel-root');
    if (!root) return;

    root.querySelectorAll('.natal-glyph-slot--sign[data-glyph-id]').forEach(function (slot) {
      if (slot.querySelector('svg')) return;
      var slug = slot.getAttribute('data-glyph-id');
      var svg = signCache[slug];
      if (!svg) return;
      slot.innerHTML =
        '<span class="kairos-glyph natal-glyph-inline" aria-hidden="true">' + svg + '</span>';
    });
  }

  function watchNatalPanelRoot() {
    var root = document.getElementById('natal-panel-root');
    if (!root || root.__kairosSignWatch) return;
    root.__kairosSignWatch = true;
    var observer = new MutationObserver(function () {
      if (signGlyphsLoaded) refreshMountedSignGlyphs();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function notifySignGlyphsReady() {
    signGlyphsLoaded = true;
    while (signReadyCallbacks.length) {
      signReadyCallbacks.shift()();
    }
    refreshMountedSignGlyphs();
  }

  function preloadSignGlyphs() {
    Promise.all(
      SIGN_SLUGS.map(function (slug) {
        return fetch(signAssetPath(slug))
          .then(function (res) {
            if (!res.ok) throw new Error('SVG ' + slug);
            return res.text();
          })
          .then(function (svg) {
            signCache[slug] = sanitizeSignSvg(svg);
          });
      })
    )
      .then(notifySignGlyphsReady)
      .catch(function (err) {
        console.warn('[KairosNatalPanel] Error cargando signos SVG:', err);
        notifySignGlyphsReady();
      });
  }

  function glyphPlanetHTML(glyphId, sizePx) {
    if (!glyphId) return '';
    var px = sizePx || 16;

    var slotOpen =
      '<span class="natal-glyph-slot natal-glyph-slot--planet" data-glyph-kind="planet" data-glyph-id="' +
      esc(glyphId) + '">';
    var slotClose = '</span>';

    var G = window.KairosPlanetGlyphs;
    if (G && typeof G.html === 'function') {
      var inline = G.html(glyphId, { className: 'natal-glyph-inline' });
      if (inline) return slotOpen + inline + slotClose;
    }

    var file = PLANET_FILE_BY_GLYPH_ID[glyphId];
    if (file) {
      return (
        slotOpen +
        '<img class="natal-glyph-img" width="' + px + '" height="' + px + '" src="' +
        ASSETS_PLANETS + file + '" alt="">' +
        slotClose
      );
    }

    return '';
  }

  function glyphSignHTML(signName, sizePx) {
    var slug = signSlug(signName);
    if (!slug) return '';
    var px = sizePx || 16;
    var assetPath = signAssetPath(slug);

    var slotOpen =
      '<span class="natal-glyph-slot natal-glyph-slot--sign" data-glyph-kind="sign" data-glyph-id="' +
      esc(slug) + '" data-kairos-sign-src="' + esc(assetPath) + '">';
    var slotClose = '</span>';

    var svg = signCache[slug];
    if (svg) {
      return (
        slotOpen +
        '<span class="kairos-glyph natal-glyph-inline" aria-hidden="true">' + svg + '</span>' +
        slotClose
      );
    }

    return (
      slotOpen +
      '<img class="natal-glyph-img natal-glyph-img--sign" width="' + px + '" height="' + px + '" src="' +
      esc(assetPath) + '" alt="">' +
      slotClose
    );
  }

  function glyphPlanetRow(label, glyphId, sizePx) {
    return (
      '<span class="natal-glyph-row natal-glyph-row--planet">' +
        glyphPlanetHTML(glyphId, sizePx) +
        '<span class="natal-glyph-fallback-text">' + esc(label) + '</span>' +
      '</span>'
    );
  }

  function glyphSignRow(signName, textClass, sizePx) {
    var text = signName || '—';
    var cls = textClass || 'natal-panel-sign-text';
    return (
      '<span class="natal-glyph-row natal-glyph-row--sign">' +
        glyphSignHTML(signName, sizePx) +
        '<span class="' + cls + '">' + esc(text) + '</span>' +
      '</span>'
    );
  }

  function getBodyPos(chart, def) {
    if (!chart) return null;
    if (def.source === 'planets') return chart.planets && chart.planets[def.key];
    return chart.angles && chart.angles[def.key];
  }

  function renderCardsHTML(chart) {
    if (!chart) return '';

    return CARD_KEYS.map(function (def) {
      var pos = getBodyPos(chart, def);
      var labelHtml = def.glyphId
        ? '<div class="natal-panel-card-label">' + glyphPlanetRow(def.label, def.glyphId, 18) + '</div>'
        : '<div class="natal-panel-card-label"><span class="natal-glyph-fallback-text">' + esc(def.label) + '</span></div>';

      return (
        '<div class="natal-panel-card">' +
          labelHtml +
          '<div class="natal-panel-card-sign">' +
            glyphSignRow(pos && pos.sign, 'natal-panel-card-sign-text', 18) +
          '</div>' +
          '<div class="natal-panel-card-detail">' + esc(fmtSignDegree(pos)) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderPlanetsTableHTML(chart) {
    if (!chart || !chart.planets) return '';

    var rows = FREE_PLANETS.map(function (key) {
      var p = chart.planets[key];
      var label = PLANET_LABELS[key] || key;
      var glyphId = PLANET_GLYPH_ID[key];
      var retro = p && p.isRetro ? 'R' : '';

      return (
        '<tr>' +
          '<td><span class="natal-glyph-row natal-glyph-row--planet">' +
            glyphPlanetHTML(glyphId, 15) +
            '<span class="natal-glyph-fallback-text">' + esc(label) + '</span>' +
          '</span></td>' +
          '<td>' + glyphSignRow(p && p.sign, 'natal-panel-table-sign-text', 15) + '</td>' +
          '<td>' + esc(p ? fmtSignDegree(p) : '—') + '</td>' +
          '<td>' + esc(retro) + '</td>' +
        '</tr>'
      );
    }).join('');

    return (
      '<table class="natal-panel-table">' +
        '<thead><tr>' +
          '<th>Planeta</th><th>Signo</th><th>Grado</th><th>R</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>'
    );
  }

  function renderFootnoteHTML(chart) {
    if (!chart || !chart.input) return '';
    var utc = chart.input.utc || '—';
    return (
      '<p class="natal-panel-footnote">' +
        'UTC ' + esc(utc) + ' · Vista esencial gratuita. Casas, aspectos y carta completa — Kairos Premium.' +
      '</p>'
    );
  }

  function renderStateHTML(chartState) {
    var state = (chartState && chartState.status) || 'idle';
    if (state === 'skipped') return '';

    var message = STATE_MESSAGES[state] || STATE_MESSAGES.idle;
    if (state === 'error' && chartState && chartState.error && chartState.error.message) {
      message = chartState.error.message;
    }
    if (state === 'ready' && !message) return '';

    return (
      '<span class="natal-panel-status-dot" aria-hidden="true"></span>' +
      esc(message)
    );
  }

  function renderBodyHTML(chart, chartState) {
    var status = chartState && chartState.status;
    if (status === 'ready' && chart) {
      return (
        '<div class="natal-panel-cards">' + renderCardsHTML(chart) + '</div>' +
        '<div class="natal-panel-table-wrap">' + renderPlanetsTableHTML(chart) + '</div>' +
        renderFootnoteHTML(chart)
      );
    }
    if (status === 'idle') return renderIdleHTML();
    return '';
  }

  window.KairosNatalPanel = {
    FREE_PLANETS: FREE_PLANETS,
    CARD_KEYS: CARD_KEYS,
    PLANET_LABELS: PLANET_LABELS,
    PLANET_GLYPH_ID: PLANET_GLYPH_ID,
    SIGN_SLUG_BY_NAME: SIGN_SLUG_BY_NAME,
    fmtPos: fmtPos,
    signSlug: signSlug,
    signAssetPath: signAssetPath,
    glyphPlanetHTML: glyphPlanetHTML,
    glyphSignHTML: glyphSignHTML,
    whenSignGlyphsReady: whenSignGlyphsReady,
    refreshMountedSignGlyphs: refreshMountedSignGlyphs,
    renderCardsHTML: renderCardsHTML,
    renderPlanetsTableHTML: renderPlanetsTableHTML,
    renderFootnoteHTML: renderFootnoteHTML,
    renderStateHTML: renderStateHTML,
    renderBodyHTML: renderBodyHTML,
    renderIdleHTML: renderIdleHTML
  };

  preloadSignGlyphs();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchNatalPanelRoot);
  } else {
    watchNatalPanelRoot();
  }
})();
