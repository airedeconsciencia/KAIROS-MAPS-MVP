/* ============================================================
   KAIROS MAPS — Motor de astrocartografía
   Depende de: astronomy-engine (window.Astronomy)
   ============================================================ */
(function () {
  'use strict';

  const PLANETS = [
    { id: 'sol',      name: 'Sol',      body: 'Sun',     glyph: '☉', color: '#B45309', key: 'SOL' },
    { id: 'luna',     name: 'Luna',     body: 'Moon',    glyph: '☽', color: '#7C3AED', key: 'LUNA' },
    { id: 'mercurio', name: 'Mercurio', body: 'Mercury', glyph: '☿', color: '#0369A1', key: 'MERCURIO' },
    { id: 'venus',    name: 'Venus',    body: 'Venus',   glyph: '♀', color: '#BE185D', key: 'VENUS' },
    { id: 'marte',    name: 'Marte',    body: 'Mars',    glyph: '♂', color: '#B91C1C', key: 'MARTE' },
    { id: 'jupiter',  name: 'Júpiter',  body: 'Jupiter', glyph: '♃', color: '#D97706', key: 'JUPITER' },
    { id: 'saturno',  name: 'Saturno',  body: 'Saturn',  glyph: '♄', color: '#4B5563', key: 'SATURNO' },
    { id: 'urano',    name: 'Urano',    body: 'Uranus',  glyph: '♅', color: '#0E7490', key: 'URANO' },
    { id: 'neptuno',  name: 'Neptuno',  body: 'Neptune', glyph: '♆', color: '#106191', key: 'NEPTUNO' },
    { id: 'pluton',   name: 'Plutón',   body: 'Pluto',   glyph: '♇', color: '#6B21A8', key: 'PLUTON' }
  ];

  const ANGLES = ['MC', 'IC', 'AC', 'DC'];

  const DEG = 180 / Math.PI;
  const RAD = Math.PI / 180;

  function normLon(lon) {
    while (lon > 180)  lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  }

  /**
   * Compute geocentric apparent RA/Dec (of date) for a body at a given AstroTime.
   * Returns { ra_deg, dec_deg } where ra_deg is right ascension in degrees [0,360),
   * dec_deg is declination in degrees [-90, 90].
   */
  function planetEquatorial(bodyName, time) {
    const observer = new Astronomy.Observer(0, 0, 0); // geocenter approx
    // ofdate=true → mean equator/equinox of date; aberration=true
    const equ = Astronomy.Equator(Astronomy.Body[bodyName], time, observer, true, true);
    return {
      ra_deg: equ.ra * 15,           // equ.ra is in hours
      dec_deg: equ.dec
    };
  }

  /**
   * Compute the MC and IC line longitudes for a given RA, GMST (in degrees).
   * MC: where local sidereal time equals RA → longitude = RA - GMST
   * IC: opposite meridian → longitude = MC + 180°
   */
  function meridianLines(ra_deg, gmst_deg) {
    const mc = normLon(ra_deg - gmst_deg);
    const ic = normLon(mc + 180);
    // Each is a vertical line — sample from -85 to 85
    const mcPts = [];
    const icPts = [];
    for (let lat = -85; lat <= 85; lat += 2) {
      mcPts.push([lat, mc]);
      icPts.push([lat, ic]);
    }
    return { MC: mcPts, IC: icPts };
  }

  /**
   * Compute the AC and DC horizon curves.
   * Condition: planet on horizon → cos(H) = -tan(φ) * tan(δ)
   * AC: H negative (rising, east of meridian) → LST = RA + H → λ = RA - H_abs - GMST
   * DC: H positive (setting, west)             → LST = RA + H → λ = RA + H_abs - GMST
   *
   * Lines exist only for latitudes where |tan(φ)*tan(δ)| <= 1.
   */
  function horizonLines(ra_deg, dec_deg, gmst_deg) {
    const ac = [];
    const dc = [];
    const dec_rad = dec_deg * RAD;
    const tan_dec = Math.tan(dec_rad);

    for (let lat = -85; lat <= 85; lat += 1) {
      const lat_rad = lat * RAD;
      const x = -Math.tan(lat_rad) * tan_dec;
      if (x < -1 || x > 1) continue;
      const H_deg = Math.acos(x) * DEG; // 0..180
      const lonAC = normLon(ra_deg - H_deg - gmst_deg);
      const lonDC = normLon(ra_deg + H_deg - gmst_deg);
      ac.push([lat, lonAC]);
      dc.push([lat, lonDC]);
    }
    return { AC: ac, DC: dc };
  }

  /**
   * Interpolate latitude/longitude where a segment crosses the antimeridian (±180°).
   * Returns boundary points for closing the previous segment and opening the next one.
   */
  function antimeridianCrossing(a, b) {
    const latA = a[0];
    const lonA = a[1];
    const latB = b[0];
    const lonB = b[1];
    let dLon = lonB - lonA;
    if (dLon > 180)  dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dLat = latB - latA;

    let t = null;
    let exitLon = 180;
    let enterLon = -180;

    if (Math.abs(dLon) > 1e-10) {
      if (dLon > 0) {
        t = (180 - lonA) / dLon;
        exitLon = 180;
        enterLon = -180;
      } else {
        t = (-180 - lonA) / dLon;
        exitLon = -180;
        enterLon = 180;
      }
    }

    if (t == null || t <= 0 || t >= 1) {
      const latCross = latA + (latB - latA) * 0.5;
      if (lonA >= 0 || lonB >= 0) {
        return { latCross, exitLon: 180, enterLon: -180 };
      }
      return { latCross, exitLon: -180, enterLon: 180 };
    }

    return {
      latCross: latA + t * dLat,
      exitLon,
      enterLon
    };
  }

  /**
   * Split a polyline into segments wherever the longitude jumps > 180° (antimeridian crossing).
   * Inserts interpolated boundary points at ±180° so each segment closes on the map edge.
   */
  function splitAtAntimeridian(points) {
    if (points.length < 2) return [points];
    const segments = [];
    let cur = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const prev = cur[cur.length - 1];
      const next = points[i];

      if (Math.abs(next[1] - prev[1]) > 180) {
        const { latCross, exitLon, enterLon } = antimeridianCrossing(prev, next);
        const exitPt = [latCross, exitLon];
        const enterPt = [latCross, enterLon];

        const prevOnExitEdge = Math.abs(Math.abs(prev[1]) - 180) < 1e-9 &&
          Math.abs(prev[0] - latCross) < 1e-9;
        if (!prevOnExitEdge) cur.push(exitPt);

        if (cur.length > 1) segments.push(cur);

        const nextOnEnterEdge = Math.abs(Math.abs(next[1]) - 180) < 1e-9 &&
          Math.abs(next[0] - latCross) < 1e-9;
        cur = nextOnEnterEdge ? [next] : [enterPt, next];
      } else {
        cur.push(next);
      }
    }

    if (cur.length > 1) segments.push(cur);
    return segments;
  }

  /**
   * Compute all 40 astrocartographic lines for a given JavaScript Date (in UTC).
   * Returns an array of line objects:
   *   { id, planet, planetName, glyph, angle, color, segments: [ [[lat,lon],...], ... ] }
   */
  function computeAllLines(utcDate) {
    console.log('[KAIROS-DEBUG] KairosAstro.computeAllLines()', { utcDate, Astronomy: typeof Astronomy });
    if (typeof Astronomy === 'undefined') {
      throw new Error('astronomy-engine no está cargado.');
    }
    const time = Astronomy.MakeTime(utcDate);
    // SiderealTime returns GMST in hours
    const gmst_hours = Astronomy.SiderealTime(time);
    const gmst_deg = gmst_hours * 15;

    const lines = [];
    for (const p of PLANETS) {
      const { ra_deg, dec_deg } = planetEquatorial(p.body, time);
      const merid = meridianLines(ra_deg, gmst_deg);
      const horiz = horizonLines(ra_deg, dec_deg, gmst_deg);
      const raw = { MC: merid.MC, IC: merid.IC, AC: horiz.AC, DC: horiz.DC };

      for (const angle of ANGLES) {
        const segs = splitAtAntimeridian(raw[angle] || []);
        if (!segs.length) continue;
        lines.push({
          id: `${p.id}-${angle.toLowerCase()}`,
          planet: p.id,
          planetName: p.name,
          planetKey: p.key,
          glyph: p.glyph,
          angle: angle,
          color: p.color,
          segments: segs
        });
      }
    }
    console.log('[KAIROS-DEBUG] KairosAstro.computeAllLines OK', { lineCount: lines.length });
    return lines;
  }

  /**
   * Approximate great-circle distance in km from a point to the nearest point on
   * a set of polyline segments. Uses haversine on each sampled vertex (lines are
   * already densely sampled, so this is fine for our purposes).
   */
  function distanceKmToLine(cityLat, cityLon, segments) {
    const R = 6371; // km
    const φ1 = cityLat * RAD;
    let min = Infinity;
    for (const seg of segments) {
      for (const [lat, lon] of seg) {
        const φ2 = lat * RAD;
        let dLon = (lon - cityLon) * RAD;
        if (dLon > Math.PI)  dLon -= 2 * Math.PI;
        if (dLon < -Math.PI) dLon += 2 * Math.PI;
        const dφ = φ2 - φ1;
        const a = Math.sin(dφ / 2) ** 2 +
                  Math.cos(φ1) * Math.cos(φ2) * Math.sin(dLon / 2) ** 2;
        const d = 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
        if (d < min) min = d;
      }
    }
    return min;
  }

  window.KairosAstro = {
    PLANETS, ANGLES,
    computeAllLines,
    distanceKmToLine,
    splitAtAntimeridian
  };
})();
