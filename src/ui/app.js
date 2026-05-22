(function () {
  'use strict';

  function startApp(profile) {
  const { DateTime } = luxon;
  const { PLANETS, ANGLES, computeAllLines, distanceKmToLine } = window.KairosAstro;
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
    showMapGlyphs: false
  };

  // -------- Map setup --------
  const map = L.map('map', {
    worldCopyJump: true,
    zoomControl: true,
    minZoom: 2, maxZoom: 8,
    attributionControl: true
  }).setView([22, 8], 2.5);

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

  // -------- City markers --------
  const cityMarkers = [];
  CITIES.forEach(city => {
    const icon = L.divIcon({
      className: '', html: '<div class="city-marker"></div>',
      iconSize: [10, 10], iconAnchor: [5, 5]
    });
    const m = L.marker([city.lat, city.lon], { icon }).addTo(map);
    m.bindTooltip(city.name, {
      className: 'city-label',
      direction: 'bottom', offset: [0, 4],
      permanent: false, opacity: 1
    });
    m.on('click', () => openInterpretation(city));
    cityMarkers.push(m);
  });

  // -------- DOM refs --------
  const $ = (id) => document.getElementById(id);
  const calcBtn       = $('calc-btn');
  const statusDot     = $('status-dot');
  const statusText    = $('status-text');
  const emptyHint     = $('empty-hint');
  const legendEmpty   = $('legend-empty');
  const planetListEl  = $('planet-list');
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

  function applyProfile(p) {
    if (!p) return;
    if (p.displayName && userGreeting) {
      userGreeting.textContent = 'Hola, ' + p.displayName;
    }
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
    if (emptyHint && p.displayName) {
      emptyHint.innerHTML = '<span class="arrow">←</span>' +
        p.displayName + ', pulsa<br><em>Calcular mi mapa</em>';
    }
    const aspect = window.KairosProfile.mapGoalToAspect(p.mainGoal || 'amor');
    state.activeAspect = aspect;
    interpTabs.querySelectorAll('.interp-tab').forEach((tab) => {
      tab.classList.toggle('on', tab.dataset.aspect === aspect);
    });
  }

  applyProfile(profile);

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
  function clearLines() {
    linesLayer.clearLayers();
    glyphsLayer.clearLayers();
    for (const k in lineGroups) delete lineGroups[k];
    state.lines = [];
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
    return best;
  }

  function longestSegmentInViewport(line, bounds) {
    let best = null;
    let bestLen = 0;
    line.segments.forEach((seg) => {
      if (seg.length < 2) return;
      const hasView = seg.some((p) => inViewport(p[0], p[1], bounds));
      if (!hasView) return;
      const len = segmentLengthKm(seg);
      if (len > bestLen) {
        bestLen = len;
        best = seg;
      }
    });
    if (best) return best;
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

    visibleLinesForGlyphs().forEach((line) => {
      const seg = longestSegmentInViewport(line, bounds);
      if (!seg) return;

      const visSeg = visibleSubsegment(seg, bounds, 2);
      if (!visSeg) return;

      const angleT = 0.22;
      const anglePt = pointAtFraction(visSeg, angleT);
      if (inViewport(anglePt[0], anglePt[1], bounds, 2)) {
        const labelPt = offsetPointPerpendicular(anglePt[0], anglePt[1], visSeg, angleT, angleOffsetPx, -1);
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
        if (!inViewport(pt[0], pt[1], bounds, 2)) return;

        const markerPt = offsetPointPerpendicular(pt[0], pt[1], visSeg, t, offsetPx, 1);
        const glyphInner = Math.round(medallionSize * 0.5);
        const medallionStyle = [
          'width:100%',
          'height:100%',
          'box-sizing:border-box',
          'border-radius:50%',
          'display:flex',
          'align-items:center',
          'justify-content:center',
          'background:rgba(244,241,234,0.76)',
          'border:2px solid #d7c188',
          'box-shadow:0 2px 8px rgba(0,0,0,0.45),0 0 0 1px rgba(215,193,136,0.4)'
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
  }

  function drawLine(line) {
    const group = L.layerGroup();
    const densify = line.angle === 'AC' || line.angle === 'DC';
    line.segments.forEach(seg => {
      const pts = densify ? densifySegment(seg, VISUAL_DENSIFY_MAX_STEP_KM) : seg;
      // glow underlay
      L.polyline(pts, { color: line.color, weight: 7, opacity: 0.13, interactive: false }).addTo(group);
      // soft middle
      L.polyline(pts, { color: line.color, weight: 3, opacity: 0.32, interactive: false }).addTo(group);
      // crisp core
      L.polyline(pts, { color: line.color, weight: 1.4, opacity: 0.92, lineCap: 'round' }).addTo(group);
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
  }

  function updateStatus() {
    const visibleCount = state.lines.filter(l =>
      state.enabledPlanets.has(l.planet) && state.enabledAngles.has(l.angle)
    ).length;
    if (!state.lines.length) {
      statusDot.classList.remove('active');
      statusText.textContent = 'Sin carta calculada';
    } else {
      statusDot.classList.add('active');
      statusText.textContent = `${visibleCount} líneas · ${CITIES.length} ciudades`;
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

  // -------- Calculate map --------
  async function calculateMap() {
    console.log('[KAIROS-DEBUG] calculateMap() llamado', {
      Astronomy: typeof Astronomy,
      luxon: typeof luxon
    });
    let cfg;
    try { cfg = readForm(); }
    catch (e) { toast(e.message, 'err'); return; }

    calcBtn.disabled = true;
    const orig = calcBtn.textContent;
    calcBtn.textContent = 'Calculando…';

    // Defer so the UI updates first
    await new Promise(r => setTimeout(r, 30));

    try {
      console.log('[KAIROS-DEBUG] computeAllLines inicio', cfg.utc);
      const t0 = performance.now();
      const lines = computeAllLines(cfg.utc);
      console.log('[KAIROS-DEBUG] computeAllLines fin', {
        ms: Math.round(performance.now() - t0),
        count: lines.length,
        sample: lines[0] && { id: lines[0].id, segments: lines[0].segments.length }
      });
      clearLines();
      state.lines = lines;
      lines.forEach(line => {
        lineGroups[line.id] = { group: drawLine(line), line };
      });
      refreshLineVisibility();
      renderLegend();
      emptyHint.classList.add('hidden');
      legendEmpty.style.display = 'none';

      toast(`Carta calculada · ${lines.length} líneas trazadas`, 'ok');
    } catch (e) {
      console.error(e);
      toast('Error en el cálculo: ' + e.message, 'err');
    } finally {
      calcBtn.disabled = false;
      calcBtn.textContent = orig;
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
  $('interp-close').addEventListener('click', () => panel.classList.remove('open'));

  interpTabs.querySelectorAll('.interp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      interpTabs.querySelectorAll('.interp-tab').forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      state.activeAspect = tab.dataset.aspect;
      if (state.currentCity) renderInterpretation(state.currentCity);
    });
  });

  const PROX_KM = 500;

  function relevantInfluences(city) {
    if (!state.lines.length) return [];
    return state.lines
      .filter(l => state.enabledPlanets.has(l.planet) && state.enabledAngles.has(l.angle))
      .map(l => ({ line: l, dist: distanceKmToLine(city.lat, city.lon, l.segments) }))
      .filter(x => x.dist < PROX_KM)
      .sort((a, b) => a.dist - b.dist);
  }

  function strengthFromDist(distKm) {
    return Math.max(1, Math.min(5, Math.round(5 - (distKm / PROX_KM) * 5)));
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

      const rawText = interp[state.activeAspect] || '';
      const text = rawText.replace(/\{ciudad\}/g, city.name);
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
        <div class="influence-text">${text}</div>
      `;
      interpBody.appendChild(el);
    });

    interpFooter.textContent = `${influences.length} influencia${influences.length === 1 ? '' : 's'} activas`;
  }

  function openInterpretation(city) {
    state.currentCity = city;
    renderInterpretation(city);
    panel.classList.add('open');
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
      const icon = L.divIcon({
        className: '', html: '<div class="city-marker searched"></div>',
        iconSize: [10, 10], iconAnchor: [5, 5]
      });
      const m = L.marker([city.lat, city.lon], { icon }).addTo(map);
      m.bindTooltip(city.name, {
        className: 'city-label', direction: 'bottom',
        offset: [0, 4], permanent: false, opacity: 1
      });
      state.searchedMarker = m;
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
  let checkDepsCount = 0;
  function checkDeps() {
    checkDepsCount++;
    const deps = {
      Astronomy: typeof Astronomy,
      luxon: typeof luxon,
      KairosAstro: typeof window.KairosAstro,
      computeAllLines: typeof (window.KairosAstro && window.KairosAstro.computeAllLines)
    };
    console.log('[KAIROS-DEBUG] checkDeps #' + checkDepsCount, deps);
    if (typeof Astronomy === 'undefined') {
      if (checkDepsCount === 1 || checkDepsCount % 10 === 0) {
        console.warn('[KAIROS-DEBUG] Astronomy no definido — ¿script astronomy.browser.min.js cargado?');
      }
      toast('Cargando motor astronómico…');
      setTimeout(checkDeps, 400);
      return;
    }
    if (typeof luxon === 'undefined') {
      toast('Cargando zonas horarias…');
      setTimeout(checkDeps, 400);
      return;
    }
    console.log('[KAIROS-DEBUG] Dependencias OK — motor listo');
    updateStatus();
  }

  window.KairosPlanetGlyphs.whenReady(() => {
    if (state.lines.length) renderLegend();
    if (state.currentCity) renderInterpretation(state.currentCity);
    if (state.showMapGlyphs) refreshMapGlyphs();
  });

  checkDeps();
  } // startApp

  initOnboarding({
    onComplete: function (profile) {
      startApp(profile);
    }
  });
})();