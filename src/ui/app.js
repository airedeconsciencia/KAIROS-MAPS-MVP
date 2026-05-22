(function () {
  'use strict';

  const { DateTime } = luxon;
  const { PLANETS, ANGLES, computeAllLines, distanceKmToLine } = window.KairosAstro;
  const INTERPRETATIONS = window.INTERPRETATIONS;

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
    activeAspect: 'amor',
    currentCity: null,
    searchedMarker: null
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
    for (const k in lineGroups) delete lineGroups[k];
    state.lines = [];
  }

  function drawLine(line) {
    const group = L.layerGroup();
    line.segments.forEach(seg => {
      // glow underlay
      L.polyline(seg, { color: line.color, weight: 7, opacity: 0.13, interactive: false }).addTo(group);
      // soft middle
      L.polyline(seg, { color: line.color, weight: 3, opacity: 0.32, interactive: false }).addTo(group);
      // crisp core
      L.polyline(seg, { color: line.color, weight: 1.4, opacity: 0.92, lineCap: 'round' }).addTo(group);
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
        <span class="planet-glyph" style="color:${p.color}">${p.glyph}</span>
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
          <span class="influence-glyph">${line.glyph}</span>
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

  async function nominatimSearch(q) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=es`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Nominatim error');
    const data = await res.json();
    return data.map(r => ({
      name: (r.display_name || '').split(',')[0].trim() || r.display_name,
      fullName: r.display_name,
      country: ((r.display_name || '').split(',').pop() || '').trim(),
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon)
    }));
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
        const remote = await nominatimSearch(q);
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
  checkDeps();
})();