(function () {
  'use strict';

  function startApp(profile) {
  const { DateTime } = luxon;
  const { PLANETS, ANGLES, computeAllLines } = window.KairosAstro;
  const INTERPRETATIONS = window.INTERPRETATIONS;

  const activeAspect = profile && profile.mainGoal
    ? window.KairosProfile.mapGoalToAspect(profile.mainGoal)
    : 'amor';

  // -------- Cities (predefined gold markers) --------
  const CITIES = [
    // Europa
    { name:'Madrid',          country:'España',         lat:40.4168, lon:-3.7038 },
    { name:'Lisboa',          country:'Portugal',       lat:38.7223, lon:-9.1393 },
    { name:'París',           country:'Francia',        lat:48.8566, lon: 2.3522 },
    { name:'Londres',         country:'Reino Unido',    lat:51.5074, lon:-0.1278 },
    { name:'Roma',            country:'Italia',         lat:41.9028, lon:12.4964 },
    { name:'Berlín',          country:'Alemania',       lat:52.5200, lon:13.4050 },
    { name:'Ámsterdam',       country:'Países Bajos',   lat:52.3676, lon: 4.9041 },
    { name:'Atenas',          country:'Grecia',         lat:37.9838, lon:23.7275 },
    { name:'Estocolmo',       country:'Suecia',         lat:59.3293, lon:18.0686 },
    { name:'Estambul',        country:'Turquía',        lat:41.0082, lon:28.9784 },
    // América
    { name:'Nueva York',      country:'EE. UU.',        lat:40.7128, lon:-74.0060 },
    { name:'Los Ángeles',     country:'EE. UU.',        lat:34.0522, lon:-118.2437 },
    { name:'Toronto',         country:'Canadá',         lat:43.6532, lon:-79.3832 },
    { name:'Ciudad de México',country:'México',         lat:19.4326, lon:-99.1332 },
    { name:'Buenos Aires',    country:'Argentina',      lat:-34.6037,lon:-58.3816 },
    { name:'Río de Janeiro',  country:'Brasil',         lat:-22.9068,lon:-43.1729 },
    { name:'Lima',            country:'Perú',           lat:-12.0464,lon:-77.0428 },
    // Asia
    { name:'Tokio',           country:'Japón',          lat:35.6762, lon:139.6503 },
    { name:'Seúl',            country:'Corea del Sur',  lat:37.5665, lon:126.9780 },
    { name:'Bangkok',         country:'Tailandia',      lat:13.7563, lon:100.5018 },
    { name:'Singapur',        country:'Singapur',       lat: 1.3521, lon:103.8198 },
    { name:'Delhi',           country:'India',          lat:28.6139, lon: 77.2090 },
    // África
    { name:'Ciudad del Cabo', country:'Sudáfrica',      lat:-33.9249,lon: 18.4241 },
    { name:'El Cairo',        country:'Egipto',         lat:30.0444, lon: 31.2357 },
    { name:'Nairobi',         country:'Kenia',          lat:-1.2921, lon: 36.8219 },
    // Oceanía
    { name:'Sídney',          country:'Australia',      lat:-33.8688,lon:151.2093 },
    { name:'Auckland',        country:'Nueva Zelanda',  lat:-36.8485,lon:174.7633 }
  ];

  // -------- App state --------
  const state = {
    lines: [],
    enabledPlanets: new Set(PLANETS.map(p => p.id)),
    enabledAngles:  new Set(ANGLES),
    activeAspect: activeAspect,
    currentCity: null,
    searchedMarker: null,
    showMapGlyphs: false,
    chart: {
      natal: null,
      status: 'idle',
      error: null,
      lastComputedAt: null,
      birthKey: null
    },
    bridge: {
      status: 'idle',
      result: null,
      priorityLineIds: []
    },
    goalContext: null,
    cityInfluenceRanking: [],
    citySuggestions: null,
    workspace: 'map'
  };

  const BRIDGE_HIGHLIGHT_MAX = 3;

  const WORKSPACE_TEASERS = {
    reloc: {
      title: 'Relocación',
      desc: 'Cómo cambia tu carta según la ciudad donde vives.'
    },
    relationship: {
      title: 'Pareja',
      desc: 'Sinastría, carta compuesta y vínculos geográficos.'
    },
    destiny: {
      title: 'Destino',
      desc: 'Las mejores ciudades para amor, trabajo y propósito.'
    }
  };

  const LOCKED_WORKSPACES = new Set(['reloc', 'relationship', 'destiny']);

  // -------- Map setup --------
  const map = L.map('map', {
    worldCopyJump: true,
    zoomControl: true,
    minZoom: 3, maxZoom: 8,
    attributionControl: true
  }).setView([22, 8], 3);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap · © CARTO · Kairos Maps',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', opacity: 0.35, maxZoom: 19
  }).addTo(map);

  // -------- Layer groups for lines --------
  const linesLayer = L.layerGroup().addTo(map);
  const glyphsLayer = L.layerGroup().addTo(map);
  const lineGroups = {}; // id -> { group, line }

  const MOBILE_CITY_TAP_PX = 36;

  function cityMarkerIcon(searched) {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const px = mobile ? 44 : 10;
    const half = px / 2;
    const cls = searched ? 'city-marker searched' : 'city-marker';
    return L.divIcon({
      className: '',
      html: `<div class="${cls}"></div>`,
      iconSize: [px, px],
      iconAnchor: [half, half]
    });
  }

  function cityNearMapPoint(latlng, maxPx) {
    const clickPt = map.latLngToContainerPoint(latlng);
    let best = null;
    let bestDist = maxPx;
    cityMarkers.forEach(m => {
      const pt = map.latLngToContainerPoint(m.getLatLng());
      const d = Math.hypot(pt.x - clickPt.x, pt.y - clickPt.y);
      if (d <= bestDist) {
        bestDist = d;
        best = m.kairosCity;
      }
    });
    return best;
  }

  // -------- City markers --------
  const cityMarkers = [];
  CITIES.forEach(city => {
    const icon = cityMarkerIcon(false);
    const m = L.marker([city.lat, city.lon], { icon, zIndexOffset: 1000 }).addTo(map);
    m.kairosCity = city;
    m.bindTooltip(city.name, {
      className: 'city-label',
      direction: 'bottom', offset: [0, 4],
      permanent: false, opacity: 1
    });
    m.on('click', () => openInterpretation(city));
    cityMarkers.push(m);
  });

  function raiseCityMarkers() {
    cityMarkers.forEach((marker) => {
      if (marker && typeof marker.bringToFront === 'function') marker.bringToFront();
    });
    if (state.searchedMarker && typeof state.searchedMarker.bringToFront === 'function') {
      state.searchedMarker.bringToFront();
    }
  }

  map.on('click', (e) => {
    if (!isMobileLayout()) return;
    const city = cityNearMapPoint(e.latlng, MOBILE_CITY_TAP_PX);
    if (city) openInterpretation(city);
  });

  // -------- DOM refs --------
  const $ = (id) => document.getElementById(id);
  const calcBtn       = $('calc-btn');
  const statusDot     = $('status-dot');
  const statusText    = $('status-text');
  const emptyHint     = $('empty-hint');
  const legendEmpty   = $('legend-empty');
  const planetListEl  = $('planet-list');
  const citySuggestionsEl = $('city-suggestions');
  const citySuggestionsList = $('city-suggestions-list');
  const angleFilterEl = $('angle-filter');
  const mapGlyphsToggle = $('map-glyphs-toggle');
  const panel         = $('interp-panel');
  const interpCity    = $('interp-city');
  const interpCoords  = $('interp-coords');
  const interpBody    = $('interp-body');
  const interpTabs    = $('interp-tabs');
  const interpFooter  = $('interp-footer-meta');
  const searchInput   = $('search-input');
  const searchResults = $('search-results');
  const searchSpinner = $('search-spinner');
  const toastEl       = $('toast');
  const userGreeting  = $('user-greeting');
  const profileReset  = $('profile-reset');
  const sidebar       = $('sidebar');
  const sidebarBackdrop = $('sidebar-backdrop');
  const natalPanelEl  = $('natal-panel');
  const natalPanelStatusEl = $('natal-panel-status');
  const natalPanelRootEl = $('natal-panel-root');
  const workspaceRail   = $('workspace-rail');
  const workspaceMapEl  = $('workspace-map');
  const workspaceNatalEl = $('workspace-natal');
  const workspaceTeaserEl = $('workspace-teaser');
  const workspaceTeaserTitle = $('workspace-teaser-title');
  const workspaceTeaserDesc = $('workspace-teaser-desc');
  const mobileMapBtn    = $('mobile-map-btn');
  const mobileControlsBtn = $('mobile-controls-btn');
  const mobileGreeting  = $('mobile-greeting');
  const mobileGoalLine  = $('mobile-goal-line');
  const goalChip        = $('goal-orientation-chip');
  const goalChipText    = $('goal-orientation-text');
  const mobileLecturaBtn = $('mobile-lectura-btn');
  const MOBILE_MQ     = window.matchMedia('(max-width: 768px)');
  let mobileMode = 'map';

  function isMobileLayout() {
    return MOBILE_MQ.matches;
  }

  function isLockedWorkspace(ws) {
    return LOCKED_WORKSPACES.has(ws);
  }

  function setWorkspace(ws) {
    if (ws !== 'map' && ws !== 'natal' && !isLockedWorkspace(ws)) return;
    state.workspace = ws;
    renderWorkspace();
  }

  function renderWorkspace() {
    if (!workspaceMapEl) return;

    if (isMobileLayout()) {
      workspaceMapEl.hidden = false;
      if (workspaceNatalEl) workspaceNatalEl.hidden = true;
      if (workspaceTeaserEl) workspaceTeaserEl.hidden = true;
      return;
    }

    const ws = state.workspace || 'map';
    const showMap = ws === 'map';
    const showNatal = ws === 'natal';
    const showTeaser = isLockedWorkspace(ws);

    workspaceMapEl.hidden = !showMap;
    if (workspaceNatalEl) workspaceNatalEl.hidden = !showNatal;
    if (workspaceTeaserEl) workspaceTeaserEl.hidden = !showTeaser;

    if (workspaceRail) {
      workspaceRail.querySelectorAll('[data-workspace]').forEach((btn) => {
        const id = btn.getAttribute('data-workspace');
        const active = id === ws;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    if (showTeaser && workspaceTeaserTitle && workspaceTeaserDesc) {
      const teaser = WORKSPACE_TEASERS[ws];
      if (teaser) {
        workspaceTeaserTitle.textContent = teaser.title;
        workspaceTeaserDesc.textContent = teaser.desc;
      }
    }
  }

  function initWorkspaceRail() {
    if (!workspaceRail) return;
    workspaceRail.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-workspace]');
      if (!btn || !workspaceRail.contains(btn)) return;
      setWorkspace(btn.getAttribute('data-workspace'));
    });
    MOBILE_MQ.addEventListener('change', renderWorkspace);
    renderWorkspace();
  }

  function refreshMapSize(delayMs) {
    const run = () => {
      if (map) map.invalidateSize();
    };
    if (delayMs) setTimeout(run, delayMs);
    else run();
  }

  function syncMobileBackdrop() {
    if (!sidebarBackdrop) return;
    if (!isMobileLayout()) {
      sidebarBackdrop.classList.remove('visible');
      document.body.classList.remove('mobile-sheet-open', 'sidebar-sheet-open', 'interp-sheet-open');
      return;
    }
    const sheetOpen = mobileMode === 'controls' || mobileMode === 'lectura';
    sidebarBackdrop.classList.toggle('visible', sheetOpen);
    document.body.classList.toggle('mobile-sheet-open', sheetOpen);
    document.body.classList.remove('sidebar-sheet-open', 'interp-sheet-open');
  }

  function syncMobileBarState() {
    if (!isMobileLayout()) return;
    [mobileMapBtn, mobileControlsBtn, mobileLecturaBtn].forEach((btn) => {
      if (btn) btn.classList.remove('mobile-top-btn--active');
    });
    if (mobileMode === 'map' && mobileMapBtn) {
      mobileMapBtn.classList.add('mobile-top-btn--active');
      mobileMapBtn.setAttribute('aria-pressed', 'true');
    } else if (mobileMapBtn) {
      mobileMapBtn.setAttribute('aria-pressed', 'false');
    }
    if (mobileControlsBtn) {
      mobileControlsBtn.classList.toggle('mobile-top-btn--active', mobileMode === 'controls');
      mobileControlsBtn.setAttribute('aria-expanded', mobileMode === 'controls' ? 'true' : 'false');
    }
    if (mobileLecturaBtn) {
      mobileLecturaBtn.classList.toggle('mobile-top-btn--active', mobileMode === 'lectura');
    }
  }

  function setMobileMode(mode) {
    if (!isMobileLayout()) return;
    if (mode === 'lectura' && !state.currentCity) mode = 'map';
    mobileMode = mode;

    if (sidebar) sidebar.classList.toggle('sheet-open', mode === 'controls');
    if (panel) panel.classList.toggle('open', mode === 'lectura');

    syncMobileBackdrop();
    syncMobileBarState();
    refreshMapSize(320);
  }

  function closeSidebarSheet() {
    if (isMobileLayout()) setMobileMode('map');
  }

  function closeInterpPanel() {
    if (isMobileLayout()) {
      setMobileMode('map');
      return;
    }
    panel.classList.remove('open');
    refreshMapSize(320);
  }

  function syncMobileGreeting(displayName) {
    const name = displayName || (profile && profile.displayName);
    if (userGreeting) {
      userGreeting.textContent = name ? 'Hola, ' + name : '';
    }
    if (mobileGreeting) {
      mobileGreeting.textContent = name ? 'Hola, ' + name : 'Hola';
    }
  }

  function updateMobileLecturaBtn() {
    if (!mobileLecturaBtn) return;
    const show = !!state.currentCity;
    mobileLecturaBtn.classList.toggle('mobile-top-btn--hidden', !show);
    mobileLecturaBtn.setAttribute('aria-hidden', show ? 'false' : 'true');
    mobileLecturaBtn.tabIndex = show ? 0 : -1;
    if (!show && mobileMode === 'lectura') setMobileMode('map');
  }

  function updateEmptyHintText(displayName) {
    if (!emptyHint || emptyHint.classList.contains('hidden') || isMobileLayout()) return;
    if (displayName) {
      emptyHint.innerHTML = '<span class="arrow">←</span>' +
        'Hola, ' + displayName + '<br>preparando tu mapa';
    }
  }

  function syncDesktopDevHints() {
    if (isMobileLayout()) return;
    if (profile && profile.birthData) {
      if (emptyHint) emptyHint.classList.add('hidden');
      if (legendEmpty) legendEmpty.style.display = 'none';
    }
  }

  if (mobileMapBtn) {
    mobileMapBtn.addEventListener('click', () => setMobileMode('map'));
  }

  if (mobileControlsBtn) {
    mobileControlsBtn.addEventListener('click', () => {
      setMobileMode(mobileMode === 'controls' ? 'map' : 'controls');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => setMobileMode('map'));
  }

  if (mobileLecturaBtn) {
    mobileLecturaBtn.addEventListener('click', () => {
      if (!state.currentCity) return;
      if (mobileMode === 'lectura') setMobileMode('map');
      else {
        renderInterpretation(state.currentCity);
        setMobileMode('lectura');
      }
    });
  }

  MOBILE_MQ.addEventListener('change', () => {
    if (!isMobileLayout()) {
      if (sidebar) sidebar.classList.remove('sheet-open');
      if (panel) panel.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('visible');
      document.body.classList.remove('mobile-sheet-open', 'sidebar-sheet-open', 'interp-sheet-open');
      mobileMode = 'map';
    } else {
      setMobileMode('map');
      syncMobileGreeting(profile && profile.displayName);
    }
    refreshMapSize(350);
  });

  window.addEventListener('resize', () => refreshMapSize(320));
  window.addEventListener('orientationchange', () => refreshMapSize(450));

  if (isMobileLayout()) setMobileMode('map');
  refreshMapSize(150);

  function syncGoalContextFromProfile() {
    const GS = window.KairosGoalSignal;
    state.goalContext = (GS && typeof GS.buildContext === 'function' && profile)
      ? GS.buildContext(profile)
      : null;
    syncGoalUI();
    if (kairosDebugEnabled()) {
      console.info('[Kairos Goals UI] goal', state.goalContext);
    }
  }

  function goalHumanLabel() {
    return state.goalContext && state.goalContext.primary
      ? state.goalContext.primary.humanLabel
      : null;
  }

  function syncGoalUI() {
    const label = goalHumanLabel();
    if (goalChip && goalChipText) {
      if (label) {
        goalChipText.textContent = 'Mapa orientado a ' + label;
        goalChip.hidden = false;
      } else {
        goalChip.hidden = true;
        goalChipText.textContent = '';
      }
    }
    if (mobileGoalLine) {
      if (label) {
        mobileGoalLine.textContent = 'Explorando lugares para ' + label;
        mobileGoalLine.hidden = false;
      } else {
        mobileGoalLine.hidden = true;
        mobileGoalLine.textContent = '';
      }
    }
    updateStatus();
    syncCitySuggestions();
  }

  function buildCityScorerInput() {
    return {
      lines: state.lines,
      cities: CITIES,
      goalContext: state.goalContext,
      bridgeResult: state.bridge.result,
      options: {
        proxKm: window.KairosCityScorer ? window.KairosCityScorer.PROX_KM : 500,
        maxSuggestions: 3,
        minScore: 0.28,
        enabledPlanets: state.enabledPlanets,
        enabledAngles: state.enabledAngles
      }
    };
  }

  function cityRefFromSuggestion(suggestion) {
    return CITIES.find(function (c) {
      return c.name === suggestion.cityName &&
        c.country === suggestion.country &&
        Math.abs(c.lat - suggestion.lat) < 0.01 &&
        Math.abs(c.lon - suggestion.lon) < 0.01;
    }) || {
      name: suggestion.cityName,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon
    };
  }

  function syncCitySuggestions() {
    if (!citySuggestionsEl || !citySuggestionsList) return;

    const Scorer = window.KairosCityScorer;
    if (!Scorer || !state.goalContext || state.bridge.status !== 'ready' ||
        !state.bridge.result || !state.bridge.result.ok || !state.lines.length) {
      citySuggestionsEl.hidden = true;
      citySuggestionsList.innerHTML = '';
      state.citySuggestions = null;
      return;
    }

    let result;
    try {
      result = Scorer.scoreCities(buildCityScorerInput());
    } catch (e) {
      citySuggestionsEl.hidden = true;
      citySuggestionsList.innerHTML = '';
      state.citySuggestions = null;
      if (kairosDebugEnabled()) console.warn('[Kairos Cities] scorer error', e);
      return;
    }

    if (!result.ok || !result.suggestions || !result.suggestions.length) {
      citySuggestionsEl.hidden = true;
      citySuggestionsList.innerHTML = '';
      state.citySuggestions = null;
      return;
    }

    state.citySuggestions = result;
    citySuggestionsEl.hidden = false;
    citySuggestionsList.innerHTML = result.suggestions.map(function (s) {
      return `
        <button type="button" class="city-suggestion-item" data-city-id="${s.cityId}">
          <span class="city-suggestion-head">
            <span class="city-suggestion-name">${s.cityName}</span>
            <span class="city-suggestion-country">${s.country}</span>
          </span>
          <p class="city-suggestion-summary">${s.humanSummary}</p>
        </button>`;
    }).join('');

    citySuggestionsList.querySelectorAll('.city-suggestion-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cityId = btn.getAttribute('data-city-id');
        const suggestion = result.suggestions.find(function (s) { return s.cityId === cityId; });
        if (!suggestion) return;
        const city = cityRefFromSuggestion(suggestion);
        map.flyTo([city.lat, city.lon], 5, { duration: 1.2 });
        openInterpretation(city);
      });
    });

    if (kairosDebugEnabled()) {
      console.info('[Kairos Cities] suggestions', result);
    }
  }

  function applyProfile(p) {
    if (!p) return;
    syncMobileGreeting(p.displayName);
    if (p.birthData) {
      const b = p.birthData;
      if (b.date) $('natal-date').value = b.date;
      if (b.time) $('natal-time').value = b.time;
      if (b.timezone) $('natal-tz').value = b.timezone;
      if (b.placeFull) $('natal-place').value = b.placeFull;
      else if (b.place) $('natal-place').value = b.place;
      if (b.lat != null) $('natal-lat').value = b.lat;
      if (b.lon != null) $('natal-lon').value = b.lon;
    }
    if (emptyHint && p.displayName && isMobileLayout()) {
      updateEmptyHintText(p.displayName);
    }
    syncDesktopDevHints();
    const aspect = window.KairosProfile.mapGoalToAspect(p.mainGoal || 'amor');
    state.activeAspect = aspect;
    interpTabs.querySelectorAll('.interp-tab').forEach((tab) => {
      tab.classList.toggle('on', tab.dataset.aspect === aspect);
    });
    syncGoalContextFromProfile();
  }

  applyProfile(profile);
  updateMobileLecturaBtn();

  if (profileReset) {
    profileReset.addEventListener('click', () => {
      if (confirm('¿Borrar tu perfil y volver al inicio?')) {
        window.KairosProfile.clearProfile();
        location.reload();
      }
    });
  }

  // -------- Toast --------
  let toastTimer = null;
  function toast(msg, kind = '') {
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + kind;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = 'toast'; }, 3200);
  }

  // -------- Compute & draw lines --------
  function resetBridgeHighlight() {
    state.bridge.status = 'idle';
    state.bridge.result = null;
    state.bridge.priorityLineIds = [];
    const mapEl = document.getElementById('map');
    if (mapEl) mapEl.classList.remove('kairos-bridge-active');
  }

  function isBridgePriorityLine(lineId) {
    return state.bridge.status === 'ready' &&
      state.bridge.priorityLineIds.indexOf(lineId) !== -1;
  }

  function mapLinesForBridge() {
    return state.lines.map((l) => ({
      id: l.id,
      planet: l.planet,
      angle: l.angle
    }));
  }

  function computeBridgeHighlight() {
    resetBridgeHighlight();
    syncCitySuggestions();
    if (!state.lines.length) return false;
    if (state.chart.status !== 'ready' || !state.chart.natal) return false;

    const Bridge = window.KairosNatalMapBridge;
    if (!Bridge || typeof Bridge.buildBridge !== 'function') {
      state.bridge.status = 'skipped';
      syncCitySuggestions();
      return false;
    }

    const Panel = window.KairosNatalPanel;
    let composition = null;
    if (Panel && typeof Panel.composeLiteReading === 'function') {
      composition = Panel.composeLiteReading(state.chart.natal);
    }
    const signalProfile = composition && composition.meta && composition.meta.bridgeProfile;
    if (!signalProfile) {
      syncCitySuggestions();
      return false;
    }

    let goalContext = null;
    const GS = window.KairosGoalSignal;
    if (GS && typeof GS.buildContext === 'function') {
      goalContext = GS.buildContext(profile);
      state.goalContext = goalContext;
      syncGoalUI();
      if (kairosDebugEnabled()) {
        console.info('[Kairos GoalSignal] context', goalContext);
        console.info('[Kairos Goals UI] goal', goalContext);
      }
    }

    let result;
    try {
      result = Bridge.buildBridge({
        tags: signalProfile.tags,
        themes: signalProfile.themes,
        tensionMode: signalProfile.tensionMode === true,
        mapLines: mapLinesForBridge(),
        goalContext: goalContext
      });
    } catch (e) {
      kairosDebugLog('bridge error', e.message || String(e));
      state.bridge.status = 'skipped';
      syncCitySuggestions();
      return false;
    }

    if (!result || !result.ok || !result.priorityLines || !result.priorityLines.length) {
      state.bridge.status = 'skipped';
      state.bridge.result = result || null;
      if (kairosDebugEnabled()) {
        console.info('[Kairos Bridge] result', result);
        console.info('[Kairos Bridge] priorityLineIds', []);
      }
      syncCitySuggestions();
      return false;
    }

    state.bridge.status = 'ready';
    state.bridge.result = result;
    state.bridge.priorityLineIds = result.priorityLines.slice(0, BRIDGE_HIGHLIGHT_MAX);

    const mapEl = document.getElementById('map');
    if (mapEl && state.bridge.priorityLineIds.length) {
      mapEl.classList.add('kairos-bridge-active');
    }

    if (kairosDebugEnabled()) {
      console.info('[Kairos Bridge] result', result);
      console.info('[Kairos Bridge] priorityLineIds', state.bridge.priorityLineIds);
    }
    syncCitySuggestions();
    return true;
  }

  function rebuildLineGroups() {
    for (const id in lineGroups) {
      if (!Object.prototype.hasOwnProperty.call(lineGroups, id)) continue;
      const entry = lineGroups[id];
      entry.group = drawLine(entry.line);
    }
    refreshLineVisibility();
  }

  function maybeApplyBridgeHighlight() {
    if (!state.lines.length) return;
    computeBridgeHighlight();
    rebuildLineGroups();
  }

  function clearLines() {
    linesLayer.clearLayers();
    glyphsLayer.clearLayers();
    for (const k in lineGroups) delete lineGroups[k];
    state.lines = [];
    resetBridgeHighlight();
    syncCitySuggestions();
  }

  const PRIORITY_PLANETS = ['sol', 'luna', 'venus', 'marte', 'jupiter', 'saturno'];
  const GLYPH_LOW_ZOOM_CAP = 24;
  const VISUAL_DENSIFY_MAX_STEP_KM = 90;

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function segmentLengthKm(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += haversineKm(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
    }
    return total;
  }

  function densifySegment(seg, maxStepKm) {
    if (!seg || seg.length < 2 || maxStepKm <= 0) return seg;
    const out = [seg[0]];
    for (let i = 1; i < seg.length; i++) {
      const a = seg[i - 1];
      const b = seg[i];
      const dist = haversineKm(a[0], a[1], b[0], b[1]);
      if (dist <= maxStepKm) {
        out.push(b);
        continue;
      }
      const steps = Math.ceil(dist / maxStepKm);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        out.push([
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t
        ]);
      }
      out.push(b);
    }
    return out;
  }

  function pointAtFraction(points, t) {
    const total = segmentLengthKm(points);
    if (total === 0) return points[0];
    const target = total * t;
    let acc = 0;
    for (let i = 1; i < points.length; i++) {
      const seg = haversineKm(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
      if (acc + seg >= target) {
        const ratio = (target - acc) / seg;
        return [
          points[i - 1][0] + (points[i][0] - points[i - 1][0]) * ratio,
          points[i - 1][1] + (points[i][1] - points[i - 1][1]) * ratio
        ];
      }
      acc += seg;
    }
    return points[points.length - 1];
  }

  function inViewport(lat, lon, bounds, padDeg) {
    const pad = padDeg == null ? 3 : padDeg;
    return lat >= bounds.getSouth() - pad && lat <= bounds.getNorth() + pad &&
      lon >= bounds.getWest() - pad && lon <= bounds.getEast() + pad;
  }

  function visibleSubsegment(seg, bounds, padDeg) {
    const pad = padDeg == null ? 2 : padDeg;
    let best = null;
    let bestLen = 0;
    let run = [];

    for (let i = 0; i < seg.length; i++) {
      const p = seg[i];
      if (inViewport(p[0], p[1], bounds, pad)) {
        run.push(p);
      } else {
        if (run.length >= 2) {
          const len = segmentLengthKm(run);
          if (len > bestLen) {
            bestLen = len;
            best = run.slice();
          }
        }
        run = [];
      }
    }
    if (run.length >= 2) {
      const len = segmentLengthKm(run);
      if (len > bestLen) {
        best = run.slice();
      }
    }
    if (best) return best;

    const visibleIdx = [];
    for (let i = 0; i < seg.length; i++) {
      if (inViewport(seg[i][0], seg[i][1], bounds, pad)) visibleIdx.push(i);
    }
    if (!visibleIdx.length) return null;

    const first = visibleIdx[0];
    const last = visibleIdx[visibleIdx.length - 1];
    if (last > first) return seg.slice(first, last + 1);

    const i = first;
    const from = Math.max(0, i - 1);
    const to = Math.min(seg.length - 1, i + 1);
    return seg.slice(from, to + 1);
  }

  function overlayAnchorSegment(seg, bounds, padDeg) {
    return visibleSubsegment(seg, bounds, padDeg);
  }

  function labelAnchorOnSegment(seg, bounds, padDeg) {
    const anchor = overlayAnchorSegment(seg, bounds, padDeg);
    if (!anchor || anchor.length < 2) return null;

    const pad = padDeg == null ? 2 : padDeg;
    const visiblePts = anchor.filter((p) => inViewport(p[0], p[1], bounds, pad));
    if (visiblePts.length) {
      const pick = visiblePts[Math.floor(visiblePts.length / 2)];
      return { pt: pick, seg: anchor, t: fractionAtPoint(anchor, pick) };
    }

    const t = 0.22;
    return { pt: pointAtFraction(anchor, t), seg: anchor, t };
  }

  function fractionAtPoint(points, target) {
    let idx = -1;
    for (let i = 0; i < points.length; i++) {
      if (Math.abs(points[i][0] - target[0]) < 1e-6 &&
          Math.abs(points[i][1] - target[1]) < 1e-6) {
        idx = i;
        break;
      }
    }
    if (idx <= 0) return 0.22;
    const total = segmentLengthKm(points);
    if (total === 0) return 0.5;
    let acc = 0;
    for (let i = 1; i <= idx; i++) {
      acc += haversineKm(
        points[i - 1][0], points[i - 1][1],
        points[i][0], points[i][1]
      );
    }
    return Math.min(0.95, Math.max(0.05, acc / total));
  }

  function longestSegmentInViewport(line, bounds, padDeg) {
    const pad = padDeg == null ? 2 : padDeg;
    let best = null;
    let bestScore = -1;
    line.segments.forEach((seg) => {
      if (seg.length < 2) return;
      const visCount = seg.filter((p) => inViewport(p[0], p[1], bounds, pad)).length;
      if (!visCount) return;
      const score = visCount * 10000 + segmentLengthKm(seg);
      if (score > bestScore) {
        bestScore = score;
        best = seg;
      }
    });
    if (best) return best;
    let bestLen = 0;
    line.segments.forEach((seg) => {
      if (seg.length < 2) return;
      const len = segmentLengthKm(seg);
      if (len > bestLen) {
        bestLen = len;
        best = seg;
      }
    });
    return best;
  }

  function glyphsPerLine(zoom) {
    if (zoom >= 6) return 3;
    if (zoom >= 4) return 2;
    return 1;
  }

  function glyphFractions(count) {
    if (count === 3) return [0.25, 0.5, 0.75];
    if (count === 2) return [0.35, 0.65];
    return [0.5];
  }

  function glyphSizeForZoom(zoom) {
    return Math.round(Math.max(16, Math.min(20, 10 + zoom * 1.25)));
  }

  function tangentAtFraction(points, t) {
    const total = segmentLengthKm(points);
    if (total === 0) return [0, 1];
    const target = total * t;
    let acc = 0;
    for (let i = 1; i < points.length; i++) {
      const segLen = haversineKm(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
      if (acc + segLen >= target) {
        const a = points[Math.max(0, i - 1)];
        const b = points[Math.min(points.length - 1, i + 1)];
        return [b[0] - a[0], b[1] - a[1]];
      }
      acc += segLen;
    }
    const a = points[0];
    const b = points[points.length - 1];
    return [b[0] - a[0], b[1] - a[1]];
  }

  function offsetPointPerpendicular(lat, lon, seg, t, px, side) {
    const tan = tangentAtFraction(seg, t);
    const mult = side == null ? 1 : side;
    const p0 = map.latLngToContainerPoint([lat, lon]);
    const p1 = map.latLngToContainerPoint([lat + tan[0] * 0.01, lon + tan[1] * 0.01]);
    let sx = p1.x - p0.x;
    let sy = p1.y - p0.y;
    const len = Math.hypot(sx, sy) || 1;
    sx /= len;
    sy /= len;
    const off = L.point(p0.x - sy * px * mult, p0.y + sx * px * mult);
    const ll = map.containerPointToLatLng(off);
    return [ll.lat, ll.lng];
  }

  function visibleLinesForGlyphs() {
    let lines = state.lines.filter((l) =>
      state.enabledPlanets.has(l.planet) && state.enabledAngles.has(l.angle)
    );
    const z = map.getZoom();
    if (z <= 3 && lines.length > GLYPH_LOW_ZOOM_CAP) {
      lines = lines.filter((l) => PRIORITY_PLANETS.includes(l.planet));
    }
    return lines;
  }

  function refreshMapGlyphs() {
    glyphsLayer.clearLayers();
    if (!state.showMapGlyphs || !state.lines.length) return;

    const z = map.getZoom();
    const count = glyphsPerLine(z);
    const fractions = glyphFractions(count);
    const size = glyphSizeForZoom(z);
    const medallionSize = Math.max(30, size + 14);
    const offsetPx = 8;
    const angleOffsetPx = 10;
    const labelW = 24;
    const labelH = 14;
    const bounds = map.getBounds();
    const overlayPad = 3;

    visibleLinesForGlyphs().forEach((line) => {
      const seg = longestSegmentInViewport(line, bounds, overlayPad);
      if (!seg) return;

      const visSeg = overlayAnchorSegment(seg, bounds, overlayPad);
      if (!visSeg) return;

      const labelAnchor = labelAnchorOnSegment(seg, bounds, overlayPad);
      if (labelAnchor) {
        const labelPt = offsetPointPerpendicular(
          labelAnchor.pt[0], labelAnchor.pt[1], labelAnchor.seg, labelAnchor.t, angleOffsetPx, -1
        );
        const labelIcon = L.divIcon({
          className: 'line-angle-icon',
          html: `<div class="line-angle-label">${line.angle}</div>`,
          iconSize: [labelW, labelH],
          iconAnchor: [labelW / 2, labelH / 2]
        });
        L.marker(labelPt, { icon: labelIcon, interactive: false, keyboard: false }).addTo(glyphsLayer);
      }

      fractions.forEach((t) => {
        const pt = pointAtFraction(visSeg, t);
        if (!inViewport(pt[0], pt[1], bounds, overlayPad)) return;

        const markerPt = offsetPointPerpendicular(pt[0], pt[1], visSeg, t, offsetPx, 1);
        const glyphInner = Math.round(medallionSize * 0.5);
        const bridgeLine = isBridgePriorityLine(line.id);
        const medallionStyle = [
          'width:100%',
          'height:100%',
          'box-sizing:border-box',
          'border-radius:50%',
          'display:flex',
          'align-items:center',
          'justify-content:center',
          'background:rgba(244,241,234,' + (bridgeLine ? '0.84' : '0.76') + ')',
          'border:2px solid #d7c188',
          'box-shadow:' + (bridgeLine
            ? '0 2px 10px rgba(215,193,136,0.35),0 0 0 1px rgba(215,193,136,0.55)'
            : '0 2px 8px rgba(0,0,0,0.45),0 0 0 1px rgba(215,193,136,0.4)')
        ].join(';');
        const html = `<div class="line-glyph-marker" style="width:100%;height:100%;"><div class="line-glyph-medallion" style="${medallionStyle}"><span class="map-line-glyph-wrap" style="width:${glyphInner}px;height:${glyphInner}px;display:flex;align-items:center;justify-content:center;">${
          window.KairosPlanetGlyphs.html(line.planet, { color: line.color, className: 'map-line-glyph' })
        }</span></div></div>`;
        const icon = L.divIcon({
          className: 'line-glyph-icon',
          html,
          iconSize: [medallionSize, medallionSize],
          iconAnchor: [medallionSize / 2, medallionSize / 2]
        });
        L.marker(markerPt, { icon, interactive: false, keyboard: false }).addTo(glyphsLayer);
      });
    });
    raiseCityMarkers();
  }

  function drawLine(line) {
    const group = L.layerGroup();
    const highlighted = isBridgePriorityLine(line.id);
    const densify = line.angle === 'AC' || line.angle === 'DC';
    line.segments.forEach(seg => {
      const pts = densify ? densifySegment(seg, VISUAL_DENSIFY_MAX_STEP_KM) : seg;
      if (highlighted) {
        L.polyline(pts, {
          color: '#d7c188', weight: 10, opacity: 0.07, interactive: false
        }).addTo(group);
      }
      L.polyline(pts, {
        color: line.color,
        weight: highlighted ? 8 : 7,
        opacity: highlighted ? 0.17 : 0.13,
        interactive: false
      }).addTo(group);
      L.polyline(pts, {
        color: line.color,
        weight: highlighted ? 3.5 : 3,
        opacity: highlighted ? 0.4 : 0.32,
        interactive: false
      }).addTo(group);
      L.polyline(pts, {
        color: line.color,
        weight: highlighted ? 1.7 : 1.4,
        opacity: highlighted ? 0.97 : 0.92,
        lineCap: 'round',
        interactive: false
      }).addTo(group);
    });
    return group;
  }

  function refreshLineVisibility() {
    linesLayer.clearLayers();
    state.lines.forEach(line => {
      const visible = state.enabledPlanets.has(line.planet) && state.enabledAngles.has(line.angle);
      if (visible && lineGroups[line.id]) {
        linesLayer.addLayer(lineGroups[line.id].group);
      }
    });
    updateStatus();
    refreshMapGlyphs();
    raiseCityMarkers();
    syncCitySuggestions();
  }

  function updateStatus() {
    const label = goalHumanLabel();
    if (!state.lines.length) {
      statusDot.classList.remove('active');
      statusText.textContent = 'Mapa pendiente';
    } else {
      statusDot.classList.add('active');
      if (label) {
        statusText.textContent = 'Explorando lugares para ' + label;
      } else {
        statusText.textContent = `Mapa activo · ${CITIES.length} lugares`;
      }
    }
  }

  // -------- Form parsing --------
  function readForm() {
    const dateStr = $('natal-date').value;       // YYYY-MM-DD
    const timeStr = $('natal-time').value;       // HH:MM
    const tz      = $('natal-tz').value;
    const lat     = parseFloat($('natal-lat').value);
    const lon     = parseFloat($('natal-lon').value);
    const place   = $('natal-place').value.trim();

    if (!dateStr || !timeStr) throw new Error('Falta fecha u hora.');
    if (Number.isNaN(lat) || Number.isNaN(lon)) throw new Error('Coordenadas inválidas.');

    const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone: tz });
    if (!dt.isValid) throw new Error(`Zona horaria inválida: ${tz}`);
    const utc = dt.toUTC().toJSDate();
    return { utc, lat, lon, tz, dateStr, timeStr, place };
  }

  function kairosDebugEnabled() {
    try {
      return localStorage.getItem('kairosDebug') === '1'
        || new URLSearchParams(location.search).has('debug');
    } catch (e) {
      return false;
    }
  }

  function kairosDebugLog(label, data) {
    if (!kairosDebugEnabled()) return;
    console.info('[KAIROS debug]', label, data);
  }

  function cfgToBirthData(cfg) {
    return {
      date: cfg.dateStr,
      time: cfg.timeStr,
      timezone: cfg.tz,
      lat: cfg.lat,
      lon: cfg.lon
    };
  }

  function renderNatalPanel() {
    const P = window.KairosNatalPanel;
    if (!natalPanelEl || !natalPanelStatusEl || !natalPanelRootEl || !P) return;

    const chartState = state.chart;
    let status = chartState.status || 'idle';
    if (isMobileLayout()) status = 'skipped';

    natalPanelEl.setAttribute('data-state', status);

    if (status === 'skipped') return;

    const statusHtml = P.renderStateHTML(chartState);
    natalPanelStatusEl.innerHTML = statusHtml;
    natalPanelStatusEl.style.display = statusHtml ? '' : 'none';

    natalPanelRootEl.innerHTML = P.renderBodyHTML(chartState.natal, chartState);
  }

  async function maybeCalculateNatalSilently(cfg) {
    if (isMobileLayout()) {
      state.chart.status = 'skipped';
      renderNatalPanel();
      return;
    }
    if (typeof window.KairosChartService === 'undefined') {
      state.chart.status = 'skipped';
      renderNatalPanel();
      return;
    }

    const birthData = cfgToBirthData(cfg);
    const key = [
      birthData.date,
      birthData.time,
      birthData.timezone,
      birthData.lat,
      birthData.lon
    ].join('|');

    if (state.chart.status === 'ready' && state.chart.birthKey === key && state.chart.natal) {
      renderNatalPanel();
      maybeApplyBridgeHighlight();
      return;
    }

    state.chart.status = 'loading';
    state.chart.error = null;
    renderNatalPanel();

    try {
      await window.KairosChartService.initNatalEngine();
      const chart = await window.KairosChartService.generateNatalChart(birthData);
      state.chart.natal = chart;
      state.chart.status = 'ready';
      state.chart.birthKey = key;
      state.chart.lastComputedAt = new Date().toISOString();
      kairosDebugLog('natal ready', {
        utc: chart.input && chart.input.utc,
        asc: chart.angles && chart.angles.ASC,
        sun: chart.planets && chart.planets.SUN,
        elapsedMs: chart.elapsedMs
      });
    } catch (err) {
      state.chart.natal = null;
      state.chart.status = 'error';
      state.chart.error = {
        code: err.code || 'NATAL_FAILED',
        message: err.message || String(err)
      };
      kairosDebugLog('natal error', state.chart.error);
    }

    renderNatalPanel();
    maybeApplyBridgeHighlight();
  }

  // -------- Calculate map --------
  function maybeAutoCalculateDesktop() {
    if (isMobileLayout()) return;
    if (state.lines.length) return;
    if (!profile || !profile.birthData) return;
    calculateMap();
  }

  async function calculateMap() {
    let cfg;
    try { cfg = readForm(); }
    catch (e) {
      toast(isMobileLayout() ? e.message : 'Revisa tus datos de nacimiento.', 'err');
      return;
    }

    calcBtn.disabled = true;
    const origBtnHtml = calcBtn.innerHTML;
    calcBtn.textContent = 'Calculando…';

    // Defer so the UI updates first
    await new Promise(r => setTimeout(r, 30));

    try {
      const lines = computeAllLines(cfg.utc);
      clearLines();
      state.lines = lines;
      lines.forEach(line => {
        lineGroups[line.id] = { group: drawLine(line), line };
      });
      refreshLineVisibility();
      renderLegend();
      emptyHint.classList.add('hidden');
      legendEmpty.style.display = 'none';

      toast(`Mapa listo · ${lines.length} líneas`, 'ok');
      if (isMobileLayout()) setMobileMode('map');
      await maybeCalculateNatalSilently(cfg);
      maybeApplyBridgeHighlight();
    } catch (e) {
      console.error(e);
      toast(
        isMobileLayout()
          ? 'Error en el cálculo: ' + e.message
          : 'No pudimos calcular tu mapa. Revisa tus datos.',
        'err'
      );
    } finally {
      calcBtn.disabled = false;
      calcBtn.innerHTML = origBtnHtml;
    }
  }

  calcBtn.addEventListener('click', calculateMap);

  if (mapGlyphsToggle) {
    mapGlyphsToggle.addEventListener('change', () => {
      state.showMapGlyphs = mapGlyphsToggle.checked;
      refreshMapGlyphs();
    });
  }

  map.on('zoomend moveend', () => {
    if (state.showMapGlyphs) refreshMapGlyphs();
  });

  // -------- Legend rendering --------
  function renderLegend() {
    planetListEl.innerHTML = '';
    PLANETS.forEach(p => {
      const linesForPlanet = state.lines.filter(l => l.planet === p.id);
      if (!linesForPlanet.length) return;
      const visibleForPlanet = linesForPlanet.filter(l => state.enabledAngles.has(l.angle)).length;

      const el = document.createElement('div');
      el.className = 'planet-item' + (state.enabledPlanets.has(p.id) ? '' : ' off');
      el.innerHTML = `
        <span class="planet-swatch" style="background:${p.color}; color:${p.color}"></span>
        ${window.KairosPlanetGlyphs.html(p.id, {
          color: p.color,
          className: 'planet-glyph' + (p.id === 'luna' ? ' planet-glyph--luna' : '')
        })}
        <span class="planet-name">${p.name}</span>
        <span class="planet-count">${visibleForPlanet}/4</span>
      `;
      el.addEventListener('click', () => {
        if (state.enabledPlanets.has(p.id)) state.enabledPlanets.delete(p.id);
        else state.enabledPlanets.add(p.id);
        el.classList.toggle('off');
        refreshLineVisibility();
      });
      planetListEl.appendChild(el);
    });
  }

  // -------- Angle filter --------
  angleFilterEl.querySelectorAll('.angle-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const angle = pill.dataset.angle;
      if (state.enabledAngles.has(angle)) state.enabledAngles.delete(angle);
      else state.enabledAngles.add(angle);
      pill.classList.toggle('on');
      refreshLineVisibility();
      renderLegend();
    });
  });

  // -------- Interpretation panel --------
  $('interp-close').addEventListener('click', closeInterpPanel);

  interpTabs.querySelectorAll('.interp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      interpTabs.querySelectorAll('.interp-tab').forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      state.activeAspect = tab.dataset.aspect;
      if (state.currentCity) renderInterpretation(state.currentCity);
    });
  });

  const PROX_KM = window.KairosCityScorer ? window.KairosCityScorer.PROX_KM : 500;

  function relevantInfluences(city) {
    if (!state.lines.length) return [];
    const Scorer = window.KairosCityScorer;
    if (!Scorer) return [];
    return Scorer.rankInfluences(city, buildCityScorerInput()).map(function (item) {
      return { line: item.line, dist: item.distKm };
    });
  }

  function strengthFromDist(distKm) {
    const Scorer = window.KairosCityScorer;
    if (Scorer && typeof Scorer.strengthFromDist === 'function') {
      return Scorer.strengthFromDist(distKm, PROX_KM);
    }
    return Math.max(1, Math.min(5, Math.round(5 - (distKm / PROX_KM) * 5)));
  }

  function formatCityReadingHtml(raw, cityName) {
    if (!raw) return '<div class="influence-text"></div>';
    const replaceCity = function (text) {
      return String(text).replace(/\{ciudad\}/g, cityName);
    };
    if (typeof raw === 'string') {
      return `<div class="influence-text">${replaceCity(raw)}</div>`;
    }
    if (raw.expanded && Array.isArray(raw.sections)) {
      return raw.sections.map(function (section) {
        const title = section.title
          ? `<h4 class="reading-section-title">${section.title}</h4>`
          : '';
        const cls = section.title
          ? 'reading-section'
          : 'reading-section reading-section-close';
        return `<div class="${cls}">${title}<p class="reading-section-body">${replaceCity(section.body)}</p></div>`;
      }).join('');
    }
    return '<div class="influence-text"></div>';
  }

  function renderInterpretation(city) {
    interpCity.textContent = city.name;
    const latStr = `${Math.abs(city.lat).toFixed(4)}° ${city.lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(city.lon).toFixed(4)}° ${city.lon >= 0 ? 'E' : 'W'}`;
    interpCoords.textContent = `${latStr}  ·  ${lonStr}${city.country ? '  ·  ' + city.country : ''}`;

    interpBody.innerHTML = '';

    if (!state.lines.length) {
      interpBody.innerHTML = `
        <div class="no-influences">
          Para leer un lugar necesito tu carta natal primero.<br/><br/>
          <span class="tag">CALCULA TU MAPA</span>
        </div>`;
      interpFooter.textContent = 'Aún sin cálculo';
      return;
    }

    const influences = relevantInfluences(city);
    const Scorer = window.KairosCityScorer;
    const ranked = Scorer ? Scorer.rankInfluences(city, buildCityScorerInput()) : [];
    state.cityInfluenceRanking = ranked.map(function (item) {
      return {
        lineId: item.lineId,
        dist: item.distKm,
        bridgeScore: item.bridgeScore,
        goalBoost: item.goalBoost,
        composite: item.composite
      };
    });
    if (kairosDebugEnabled()) {
      console.info('[Kairos Goals UI] city ranking', {
        city: city.name,
        goal: state.goalContext && state.goalContext.primary
          ? state.goalContext.primary.id
          : null,
        ranking: state.cityInfluenceRanking.slice(0, 6)
      });
    }
    if (!influences.length) {
      interpBody.innerHTML = `
        <div class="no-influences">
          Ninguna línea planetaria pasa a menos de ${PROX_KM} km de ${city.name}.<br/><br/>
          Aquí tu carta natal mantiene sus equilibrios de origen — sin amplificaciones particulares.
          <br/><br/><span class="tag">ZONA NEUTRA</span>
        </div>`;
      interpFooter.textContent = '0 influencias';
      return;
    }

    influences.forEach(({ line, dist }) => {
      const key = `${line.planetKey}_${line.angle}`;
      const interp = INTERPRETATIONS[key];
      if (!interp) return;

      const strength = strengthFromDist(dist);
      const dots = Array.from({ length: 5 }, (_, i) =>
        `<span class="strength-dot ${i < strength ? 'on' : ''}"></span>`
      ).join('');

      const readingHtml = formatCityReadingHtml(interp[state.activeAspect], city.name);
      const angleName = { AC: 'Ascendente', MC: 'Medio Cielo', IC: 'Fondo Cielo', DC: 'Descendente' }[line.angle];

      const el = document.createElement('div');
      el.className = 'influence';
      el.style.borderLeftColor = line.color;
      el.style.color = line.color;
      el.innerHTML = `
        <div class="influence-head">
          ${window.KairosPlanetGlyphs.html(line.planet, { color: line.color, className: 'influence-glyph' })}
          <span class="influence-name" style="color: var(--text);">
            ${line.planetName} · ${angleName}
          </span>
          <span class="influence-type">${line.angle} · ${Math.round(dist)} km</span>
        </div>
        <div class="influence-strength">${dots}</div>
        ${readingHtml}
      `;
      interpBody.appendChild(el);
    });

    interpFooter.textContent = `${influences.length} influencia${influences.length === 1 ? '' : 's'} activas`;
  }

  function openInterpretation(city) {
    state.currentCity = city;
    renderInterpretation(city);
    updateMobileLecturaBtn();
    if (isMobileLayout()) {
      setMobileMode('lectura');
      return;
    }
    panel.classList.add('open');
    refreshMapSize(350);
  }

  // -------- Search (predefined + Nominatim) --------
  let searchDebounce = null;
  let searchSeq = 0;

  function localMatches(q) {
    const lo = q.toLowerCase();
    return CITIES.filter(c =>
      c.name.toLowerCase().includes(lo) || c.country.toLowerCase().includes(lo)
    ).slice(0, 5);
  }

  function renderSearchResults(localMatches, remoteMatches) {
    if (!localMatches.length && !remoteMatches.length) {
      searchResults.classList.remove('open');
      return;
    }
    let html = '';
    if (localMatches.length) {
      html += `<div class="search-result-section">Ciudades destacadas</div>`;
      html += localMatches.map((c, i) => `
        <div class="search-result" data-source="local" data-idx="${i}">
          <div class="name">${c.name}</div>
          <div class="meta">${c.country} · ${c.lat.toFixed(2)}°, ${c.lon.toFixed(2)}°</div>
        </div>`).join('');
    }
    if (remoteMatches.length) {
      html += `<div class="search-result-section">OpenStreetMap</div>`;
      html += remoteMatches.map((r, i) => `
        <div class="search-result" data-source="remote" data-idx="${i}">
          <div class="name">${r.name}</div>
          <div class="meta">${r.fullName.length > 70 ? r.fullName.slice(0, 70) + '…' : r.fullName}</div>
        </div>`).join('');
    }
    searchResults.innerHTML = html;
    searchResults.classList.add('open');

    searchResults.querySelectorAll('.search-result').forEach(el => {
      el.addEventListener('click', () => {
        const list = el.dataset.source === 'local' ? localMatches : remoteMatches;
        const city = list[parseInt(el.dataset.idx, 10)];
        gotoCity(city);
      });
    });
  }

  function gotoCity(city) {
    // Drop a temporary marker for non-predefined locations
    if (state.searchedMarker) {
      map.removeLayer(state.searchedMarker);
      state.searchedMarker = null;
    }
    const isPredefined = CITIES.some(c => c.name === city.name && Math.abs(c.lat - city.lat) < 0.01);
    if (!isPredefined) {
      const icon = cityMarkerIcon(true);
      const m = L.marker([city.lat, city.lon], { icon, zIndexOffset: 1000 }).addTo(map);
      m.kairosCity = city;
      m.bindTooltip(city.name, {
        className: 'city-label', direction: 'bottom',
        offset: [0, 4], permanent: false, opacity: 1
      });
      state.searchedMarker = m;
      raiseCityMarkers();
    }

    map.flyTo([city.lat, city.lon], 5, { duration: 1.2 });
    searchResults.classList.remove('open');
    searchInput.value = city.name;
    setTimeout(() => openInterpretation(city), 1100);
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearTimeout(searchDebounce);
    if (!q) {
      searchResults.classList.remove('open');
      searchSpinner.classList.remove('on');
      return;
    }
    const local = localMatches(q);
    // Show local matches instantly
    renderSearchResults(local, []);

    if (q.length < 3) return;

    searchSpinner.classList.add('on');
    const mySeq = ++searchSeq;
    searchDebounce = setTimeout(async () => {
      try {
        const remote = await window.KairosPlaces.nominatimSearch(q);
        if (mySeq !== searchSeq) return; // stale
        renderSearchResults(local, remote);
      } catch (e) {
        console.warn('Nominatim falló:', e);
      } finally {
        if (mySeq === searchSeq) searchSpinner.classList.remove('on');
      }
    }, 450);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) searchResults.classList.remove('open');
  });

  // -------- Init --------
  // Wait until astronomy-engine + luxon are present before allowing calc
  function checkDeps() {
    if (typeof Astronomy === 'undefined') {
      toast(isMobileLayout() ? 'Cargando motor astronómico…' : 'Preparando tu mapa…');
      setTimeout(checkDeps, 400);
      return;
    }
    if (typeof luxon === 'undefined') {
      toast(isMobileLayout() ? 'Cargando zonas horarias…' : 'Preparando tu mapa…');
      setTimeout(checkDeps, 400);
      return;
    }
    updateStatus();
    maybeAutoCalculateDesktop();
  }

  window.KairosPlanetGlyphs.whenReady(() => {
    if (state.lines.length) renderLegend();
    if (state.currentCity) renderInterpretation(state.currentCity);
    if (state.showMapGlyphs) refreshMapGlyphs();
    if (state.chart.status === 'ready') renderNatalPanel();
  });

  if (kairosDebugEnabled()) {
    window.__kairosDebug = {
      get chart() { return state.chart; },
      get bridge() { return state.bridge; },
      get goalContext() { return state.goalContext; },
      get cityInfluenceRanking() { return state.cityInfluenceRanking; },
      get citySuggestions() { return state.citySuggestions; },
      get serviceStatus() {
        return window.KairosChartService && window.KairosChartService.getStatus
          ? window.KairosChartService.getStatus()
          : null;
      },
      get lines() { return state.lines.length; },
      get workspace() { return state.workspace; }
    };
  }

  initWorkspaceRail();
  renderNatalPanel();
  checkDeps();
  } // startApp

  initOnboarding({
    onComplete: function (profile) {
      startApp(profile);
    }
  });
})();