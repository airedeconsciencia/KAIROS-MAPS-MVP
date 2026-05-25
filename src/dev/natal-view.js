(function () {
  'use strict';

  var PRESETS = {
    G1: {
      label: 'Maó, Menorca',
      date: '1990-06-12',
      time: '14:35',
      timezone: 'Europe/Madrid',
      lat: 39.8885,
      lon: 4.2658
    },
    G2: {
      label: 'Madrid (DST 1985)',
      date: '1985-03-31',
      time: '08:15',
      timezone: 'Europe/Madrid',
      lat: 40.4168,
      lon: -3.7038
    },
    G3: {
      label: 'Buenos Aires',
      date: '2000-01-01',
      time: '00:30',
      timezone: 'America/Argentina/Buenos_Aires',
      lat: -34.6037,
      lon: -58.3816
    }
  };

  var PLANET_ORDER = [
    'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS',
    'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO',
    'MEAN_NODE', 'TRUE_NODE', 'MEAN_APOG', 'CHIRON', 'OSCU_APOG'
  ];

  var PLANET_LABELS = {
    SUN: 'Sol',
    MOON: 'Luna',
    MERCURY: 'Mercurio',
    VENUS: 'Venus',
    MARS: 'Marte',
    JUPITER: 'Júpiter',
    SATURN: 'Saturno',
    URANUS: 'Urano',
    NEPTUNE: 'Neptuno',
    PLUTO: 'Plutón',
    MEAN_NODE: 'Nodo Norte',
    TRUE_NODE: 'Nodo Verdadero',
    MEAN_APOG: 'Lilith',
    CHIRON: 'Quirón',
    OSCU_APOG: 'Lilith osc.'
  };

  var CARD_KEYS = [
    { key: 'SUN', label: 'Sol', source: 'planets' },
    { key: 'MOON', label: 'Luna', source: 'planets' },
    { key: 'ASC', label: 'Ascendente', source: 'angles' },
    { key: 'MC', label: 'Medio Cielo', source: 'angles' }
  ];

  var els = {
    form: document.getElementById('birth-form'),
    date: document.getElementById('field-date'),
    time: document.getElementById('field-time'),
    tz: document.getElementById('field-tz'),
    lat: document.getElementById('field-lat'),
    lon: document.getElementById('field-lon'),
    btnCalc: document.getElementById('btn-calc'),
    statusBadge: document.getElementById('status-badge'),
    statusMeta: document.getElementById('status-meta'),
    errorBox: document.getElementById('error-box'),
    resultsPanel: document.getElementById('results-panel'),
    metaPanel: document.getElementById('meta-panel'),
    planetsPanel: document.getElementById('planets-panel'),
    housesPanel: document.getElementById('houses-panel'),
    aspectsPanel: document.getElementById('aspects-panel'),
    angleCards: document.getElementById('angle-cards'),
    metaGrid: document.getElementById('meta-grid'),
    planetsBody: document.getElementById('planets-body'),
    housesBody: document.getElementById('houses-body'),
    aspectsBody: document.getElementById('aspects-body')
  };

  function fmtPos(pos) {
    if (!pos) return '—';
    var lon = pos.longitude != null ? pos.longitude.toFixed(2) + '°' : '—';
    return pos.sign + ' ' + pos.deg + '° ' + pos.min + "' · " + lon;
  }

  function readForm() {
    return {
      date: els.date.value,
      time: els.time.value,
      timezone: els.tz.value.trim(),
      lat: parseFloat(els.lat.value),
      lon: parseFloat(els.lon.value)
    };
  }

  function applyPreset(id) {
    var p = PRESETS[id];
    if (!p) return;
    els.date.value = p.date;
    els.time.value = p.time;
    els.tz.value = p.timezone;
    els.lat.value = p.lat;
    els.lon.value = p.lon;
    document.querySelectorAll('.preset-btn').forEach(function (btn) {
      btn.classList.toggle('on', btn.dataset.preset === id);
    });
  }

  function setStatus(state, metaText) {
    els.statusBadge.className = 'status-badge ' + state;
    els.statusBadge.textContent =
      state === 'loading' ? 'Cargando' :
      state === 'ready' ? 'Listo' :
      state === 'error' ? 'Error' : 'Esperando';
    els.statusMeta.textContent = metaText || '';
  }

  function showError(message) {
    els.errorBox.textContent = message;
    els.errorBox.classList.add('visible');
  }

  function hideError() {
    els.errorBox.classList.remove('visible');
    els.errorBox.textContent = '';
  }

  function showPanels(show) {
    ['resultsPanel', 'metaPanel', 'planetsPanel', 'housesPanel', 'aspectsPanel'].forEach(function (id) {
      els[id].classList.toggle('hidden', !show);
    });
  }

  function renderCards(chart) {
    els.angleCards.innerHTML = CARD_KEYS.map(function (def) {
      var pos = def.source === 'planets'
        ? chart.planets[def.key]
        : chart.angles[def.key];
      return (
        '<div class="card">' +
          '<div class="card-label">' + def.label + '</div>' +
          '<div class="card-sign">' + (pos ? pos.sign : '—') + '</div>' +
          '<div class="card-detail">' + fmtPos(pos) + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderMeta(chart, birthData, initMs, chartMs) {
    var status = window.KairosChartService.getStatus();
    var items = [
      { label: 'UTC', value: chart.input.utc || '—' },
      { label: 'Zona horaria', value: birthData.timezone },
      { label: 'Coordenadas', value: birthData.lat + ', ' + birthData.lon },
      { label: 'Motor', value: chart.metadata.motor || chart.metadata.engine },
      { label: 'Sistema casas', value: chart.metadata.house_system },
      { label: 'Init motor', value: initMs != null ? initMs + ' ms' : '—' },
      { label: 'Cálculo carta', value: chartMs + ' ms' },
      { label: 'Cache', value: chart.fromCache ? 'Sí (hit)' : 'No (fresh)' },
      { label: 'Servicio ready', value: status.ready ? 'Sí' : 'No' },
      { label: 'Cache size', value: String(status.cacheSize) }
    ];
    els.metaGrid.innerHTML = items.map(function (item) {
      return (
        '<div class="meta-item"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>'
      );
    }).join('');
  }

  function renderPlanets(chart) {
    var rows = [];
    PLANET_ORDER.forEach(function (key) {
      var p = chart.planets[key];
      if (!p) return;
      rows.push(
        '<tr>' +
          '<td>' + (PLANET_LABELS[key] || key) + '</td>' +
          '<td>' + p.sign + '</td>' +
          '<td class="num">' + p.deg + '° ' + p.min + "'</td>" +
          '<td class="num">' + p.longitude.toFixed(4) + '°</td>' +
          '<td class="num">' + (p.house != null ? p.house : '—') + '</td>' +
          '<td>' + (p.isRetro ? 'R' : '') + '</td>' +
        '</tr>'
      );
    });
    els.planetsBody.innerHTML = rows.join('') || '<tr><td colspan="6" class="empty-hint">Sin datos</td></tr>';
  }

  function renderHouses(chart) {
    var rows = (chart.houses || []).map(function (h, i) {
      return (
        '<tr>' +
          '<td>Casa ' + (i + 1) + '</td>' +
          '<td>' + h.sign + '</td>' +
          '<td class="num">' + h.deg + '° ' + h.min + "'</td>" +
          '<td class="num">' + h.longitude.toFixed(4) + '°</td>' +
        '</tr>'
      );
    });
    els.housesBody.innerHTML = rows.join('') || '<tr><td colspan="4" class="empty-hint">Sin datos</td></tr>';
  }

  function renderAspects(chart) {
    var aspects = (chart.aspects || []).slice().sort(function (a, b) { return a.orb - b.orb; }).slice(0, 12);
    var rows = aspects.map(function (a) {
      return (
        '<tr>' +
          '<td>' + (PLANET_LABELS[a.p1] || a.p1) + '</td>' +
          '<td>' + a.aspect + '</td>' +
          '<td>' + (PLANET_LABELS[a.p2] || a.p2) + '</td>' +
          '<td class="num">' + a.formattedOrb + '</td>' +
          '<td>' + (a.isApplying ? 'Aplicativo' : 'Separativo') + '</td>' +
        '</tr>'
      );
    });
    els.aspectsBody.innerHTML = rows.join('') || '<tr><td colspan="5" class="empty-hint">Sin aspectos</td></tr>';
  }

  function renderChart(chart, birthData, initMs, chartMs) {
    renderCards(chart);
    renderMeta(chart, birthData, initMs, chartMs);
    renderPlanets(chart);
    renderHouses(chart);
    renderAspects(chart);
    showPanels(true);
    window.__natalViewLastChart = chart;
  }

  async function onCalculate(e) {
    if (e) e.preventDefault();
    hideError();
    showPanels(false);

    var S = window.KairosChartService;
    if (!S) {
      setStatus('error', 'KairosChartService no cargado.');
      showError('Falta chart-service.js o el orden de scripts es incorrecto.');
      return;
    }

    var birthData = readForm();
    els.btnCalc.disabled = true;
    setStatus('loading', 'Inicializando Swiss Ephemeris y calculando carta…');

    var initMs = null;
    var chartMs = null;

    try {
      var tInit = performance.now();
      await S.initNatalEngine();
      initMs = Math.round(performance.now() - tInit);

      var tChart = performance.now();
      var chart = await S.generateNatalChart(birthData);
      chartMs = chart.elapsedMs != null ? chart.elapsedMs : Math.round(performance.now() - tChart);

      renderChart(chart, birthData, initMs, chartMs);
      setStatus('ready',
        'Carta calculada · init ' + initMs + ' ms · chart ' + chartMs + ' ms' +
        (chart.fromCache ? ' · cache' : '')
      );
    } catch (err) {
      var code = err.code ? ' [' + err.code + ']' : '';
      setStatus('error', 'Fallo al calcular la carta.');
      showError((err.message || String(err)) + code);
    } finally {
      els.btnCalc.disabled = false;
    }
  }

  els.form.addEventListener('submit', onCalculate);
  document.querySelectorAll('.preset-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyPreset(btn.dataset.preset);
    });
  });

  applyPreset('G1');
})();
