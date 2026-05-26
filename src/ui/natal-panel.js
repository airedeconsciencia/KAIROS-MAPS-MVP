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

  var STATE_MESSAGES = {
    idle: 'Tu carta aparecerá aquí cuando calcules el mapa.',
    loading: 'Calculando Sol, Luna y ángulos…',
    ready: '',
    error: 'No pudimos calcular tu carta natal. El mapa sigue activo. Vuelve a pulsar Calcular mi mapa.',
    skipped: ''
  };

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

  function glyphPlanetHTML(glyphId) {
    if (!glyphId) return '';

    var slotOpen =
      '<span class="natal-glyph-slot" data-glyph-kind="planet" data-glyph-id="' +
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
        '<img class="natal-glyph-img" src="' + ASSETS_PLANETS + file + '" alt="">' +
        slotClose
      );
    }

    return '';
  }

  function glyphSignHTML(signName) {
    if (!signName) return '';
    var slug = SIGN_SLUG_BY_NAME[signName];
    if (!slug) return '';

    return (
      '<span class="natal-glyph-slot natal-glyph-slot--sign" data-glyph-kind="sign" data-glyph-id="' +
      esc(slug) + '">' +
      '<img class="natal-glyph-img" src="' + ASSETS_SIGNS + slug + '.svg" alt="">' +
      '</span>'
    );
  }

  function glyphPlanetRow(label, glyphId) {
    return (
      '<span class="natal-glyph-row">' +
        glyphPlanetHTML(glyphId) +
        '<span class="natal-glyph-fallback-text">' + esc(label) + '</span>' +
      '</span>'
    );
  }

  function glyphSignRow(signName) {
    var text = signName || '—';
    return (
      '<span class="natal-glyph-row">' +
        glyphSignHTML(signName) +
        '<span class="natal-panel-card-sign-text">' + esc(text) + '</span>' +
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
        ? '<div class="natal-panel-card-label">' + glyphPlanetRow(def.label, def.glyphId) + '</div>'
        : '<div class="natal-panel-card-label"><span class="natal-glyph-fallback-text">' + esc(def.label) + '</span></div>';

      return (
        '<div class="natal-panel-card">' +
          labelHtml +
          '<div class="natal-panel-card-sign">' + glyphSignRow(pos && pos.sign) + '</div>' +
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
          '<td><span class="natal-glyph-row">' +
            glyphPlanetHTML(glyphId) +
            '<span class="natal-glyph-fallback-text">' + esc(label) + '</span>' +
          '</span></td>' +
          '<td><span class="natal-glyph-row">' +
            glyphSignHTML(p && p.sign) +
            '<span>' + esc((p && p.sign) || '—') + '</span>' +
          '</span></td>' +
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
    if (status !== 'ready' || !chart) return '';

    return (
      '<div class="natal-panel-cards">' + renderCardsHTML(chart) + '</div>' +
      '<div class="natal-panel-table-wrap">' + renderPlanetsTableHTML(chart) + '</div>' +
      renderFootnoteHTML(chart)
    );
  }

  window.KairosNatalPanel = {
    FREE_PLANETS: FREE_PLANETS,
    CARD_KEYS: CARD_KEYS,
    PLANET_LABELS: PLANET_LABELS,
    PLANET_GLYPH_ID: PLANET_GLYPH_ID,
    SIGN_SLUG_BY_NAME: SIGN_SLUG_BY_NAME,
    fmtPos: fmtPos,
    glyphPlanetHTML: glyphPlanetHTML,
    glyphSignHTML: glyphSignHTML,
    renderCardsHTML: renderCardsHTML,
    renderPlanetsTableHTML: renderPlanetsTableHTML,
    renderFootnoteHTML: renderFootnoteHTML,
    renderStateHTML: renderStateHTML,
    renderBodyHTML: renderBodyHTML
  };
})();
