---
title: "Motor Astrocartográfico — astrocarto_engine.js (DOC-16 v2)"
source_master: "docs/Master/16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx"
converted_phase: "3.6h4"
status: canonical-md
governs: "Astrocartografía (spec)"
priority: "ALTA"
---

# Motor Astrocartográfico — astrocarto_engine.js (DOC-16 v2)

> **Origen canónico:** [`docs/Master/16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx`](../Master/16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx)  
> **Conversión:** Fase 3.6h4 · Contenido extraído del Master — preservar alineación con fuente Word  
> **Regla:** Este Markdown gobierna editorialmente su capa. No sustituye contratos técnicos en `docs/architecture/`.

---

## KAIROS MAPS — DOC-16 REVISADO v2

MOTOR ASTROCARTOGRÁFICO — astrocarto_engine.js

Colores corregidos con paleta oficial KAIROS (chart_650_v1.js)

### Mayo 2026

════════════════════════════════════════════════════════

### CORRECCIÓN v2 — COLORES OFICIALES KAIROS

════════════════════════════════════════════════════════

La v1 usaba colores genéricos asignados por defecto.

### Esta versión usa los colores extraídos directamente de

chart_650_v1.js (PLANET_DEFS), el motor visual oficial de KAIROS.

### Esto garantiza coherencia visual total entre:

- La carta natal de KAIROS

- Las líneas astrocartográficas de Kairos Maps

════════════════════════════════════════════════════════

CÓDIGO COMPLETO — astrocarto_engine.js v1.1

════════════════════════════════════════════════════════

// ============================================================

// astrocarto_engine.js v1.1

// KAIROS MAPS — Motor de Líneas Astrocartográficas

// Depende de: ascendant_engine.js, planetary_engine.js, astronomy.js

// Colores: alineados con chart_650_v1.js (PLANET_DEFS oficial)

// NO MODIFICAR sin aprobación de Roberto

// ============================================================

const ASTROCARTO_PLANETS = {

### SUN: { id: 0, name: 'Sol', color: '#B45309', symbol: 'Sol' },

### MOON: { id: 1, name: 'Luna', color: '#7C3AED', symbol: 'Luna' },

MERCURY: { id: 2, name: 'Mercurio', color: '#0369A1', symbol: 'Mercurio'},

### VENUS: { id: 3, name: 'Venus', color: '#BE185D', symbol: 'Venus' },

### MARS: { id: 4, name: 'Marte', color: '#B91C1C', symbol: 'Marte' },

JUPITER: { id: 5, name: 'Júpiter', color: '#D97706', symbol: 'Júpiter' },

SATURN: { id: 6, name: 'Saturno', color: '#4B5563', symbol: 'Saturno' },

### URANUS: { id: 7, name: 'Urano', color: '#0E7490', symbol: 'Urano' },

NEPTUNE: { id: 8, name: 'Neptuno', color: '#106191', symbol: 'Neptuno' },

### PLUTO: { id: 9, name: 'Plutón', color: '#6B21A8', symbol: 'Plutón' },

MEAN_NODE: { id: 10, name: 'Nodo Norte', color: '#047857', symbol: 'Nodo' },

### CHIRON: { id: 15, name: 'Quirón', color: '#9CA3AF', symbol: 'Quirón' }

};

// NOTA: Los glifos SVG se obtienen desde window.getKairosSymbol()

// que expone chart_650_v1.js — NO redefinir aquí los símbolos.

// Ejemplo: const glifo = window.getKairosSymbol('planets', 'Venus');

const ANGLES = ['AC', 'DC', 'MC', 'IC'];

const LON_STEP = 1; // grados. Para más precisión usar 0.5

/**

## * Función Principal

* Calcula todas las líneas astrocartográficas para una persona.

*

* @param {Object} birthData - { date, time, lat, lng, timezone }

* @returns {Object} - { lines, metadata }

*/

async function getAstroLines(birthData) {

console.log('%c[KAIROS MAPS] Calculando líneas astrocartográficas...', 'color: #C9A96E');

const { date, time, lat, lng, timezone } = birthData;

const planetaryData = await getPlanetaryPositions(date, time, lat, lng, timezone);

const planets = planetaryData.positions;

const gastDeg = _getGAST(date, time, lat, lng, timezone);

const allLines = [];

for (const [planetKey, planetInfo] of Object.entries(ASTROCARTO_PLANETS)) {

if (!planets[planetKey]) continue;

const planetLon = planets[planetKey].longitude;

const mcLine = _calculateMCLine(planetLon, gastDeg, planetInfo, planetKey);

const icLine = _calculateICLine(mcLine, planetInfo, planetKey);

const acLine = _calculateACLine(planetLon, gastDeg, planetInfo, planetKey);

const dcLine = _calculateDCLine(acLine, planetInfo, planetKey);

allLines.push(mcLine, icLine, acLine, dcLine);

}

console.log(`%c[KAIROS MAPS] ${allLines.length} líneas calculadas.`, 'color: #B45309');

return {

lines: allLines,

metadata: {

birthData,

calculatedAt: new Date().toISOString(),

totalLines: allLines.length,

engine: 'astrocarto_engine_v1.1',

colorSource: 'chart_650_v1.js PLANET_DEFS'

}

};

}

function _getGAST(date, time, lat, lng, timezone) {

try {

const [y, m, d] = date.split('-').map(Number);

const [h, min] = time.split(':').map(Number);

const tzArg = timezone || 'UTC';

const luxonDt = window.luxon.DateTime.fromObject(

{ year: y, month: m, day: d, hour: h, minute: min },

{ zone: tzArg }

);

const astroTime = window.Astronomy.MakeTime(luxonDt.toJSDate());

return (window.Astronomy.SiderealTime(astroTime) * 15) % 360;

} catch (e) {

console.error('[astrocarto_engine] Error GAST:', e);

return 0;

}

}

function _calculateMCLine(planetLon, gastDeg, planetInfo, planetKey) {

let geoLon = ((planetLon - gastDeg + 180) % 360) - 180;

if (geoLon < -180) geoLon += 360;

const points = [];

for (let lat = -85; lat <= 85; lat += 2) points.push([lat, geoLon]);

return { planet: planetInfo.name, planetKey, angle: 'MC',

color: planetInfo.color, points, geoLon, type: 'vertical' };

}

function _calculateICLine(mcLine, planetInfo, planetKey) {

let icLon = mcLine.geoLon + 180;

if (icLon > 180) icLon -= 360;

const points = [];

for (let lat = -85; lat <= 85; lat += 2) points.push([lat, icLon]);

return { planet: planetInfo.name, planetKey, angle: 'IC',

color: planetInfo.color, points, geoLon: icLon, type: 'vertical' };

}

function _calculateACLine(planetLon, gastDeg, planetInfo, planetKey) {

const eps = _getMeanObliquity();

const points = [];

for (let geoLon = -180; geoLon <= 180; geoLon += LON_STEP) {

const lat = _findACLatitude(planetLon, gastDeg, geoLon, eps);

if (lat !== null) points.push([lat, geoLon]);

}

return { planet: planetInfo.name, planetKey, angle: 'AC',

color: planetInfo.color, points, type: 'curve' };

}

function _calculateDCLine(acLine, planetInfo, planetKey) {

const points = acLine.points.map(([lat, lon]) => {

let dcLon = lon + 180;

if (dcLon > 180) dcLon -= 360;

return [lat, dcLon];

});

return { planet: planetInfo.name, planetKey, angle: 'DC',

color: planetInfo.color, points, type: 'curve' };

}

function _findACLatitude(targetPlanetLon, gastDeg, geoLon, eps) {

const RAMC = ((gastDeg + geoLon + 360) % 360) * Math.PI / 180;

const epsRad = eps * Math.PI / 180;

let latMin = -85, latMax = 85;

for (let i = 0; i < 30; i++) {

const latMid = (latMin + latMax) / 2;

const ascDeg = _computeAscendant(RAMC, epsRad, latMid);

if (ascDeg === null) return null;

const diff = _angularDiff(ascDeg, targetPlanetLon);

if (Math.abs(diff) < 0.5) return latMid;

const diffLow = _angularDiff(_computeAscendant(RAMC, epsRad, latMin) || 0, targetPlanetLon);

if (Math.sign(diff) === Math.sign(diffLow)) latMin = latMid;

else latMax = latMid;

}

return null;

}

function _computeAscendant(RAMC, epsRad, latDeg) {

try {

const phiRad = latDeg * Math.PI / 180;

const num = Math.cos(RAMC);

const den = -((Math.sin(RAMC) * Math.cos(epsRad)) + (Math.tan(phiRad) * Math.sin(epsRad)));

if (Math.abs(den) < 1e-10) return null;

return ((Math.atan2(num, den) * 180 / Math.PI) + 360) % 360;

} catch { return null; }

}

function _angularDiff(a, b) {

let d = ((a - b) + 180) % 360 - 180;

if (d < -180) d += 360;

return d;

}

function _getMeanObliquity() {

try {

return window.Astronomy.e_tilt(window.Astronomy.MakeTime(new Date())).tobl;

} catch { return 23.4397; }

}

/**

* Líneas cercanas a una ciudad.

* @param {Object} birthData

* @param {number} cityLat

* @param {number} cityLng

* @param {number} radiusKm - defecto 300km

*/

async function getLinesNearCity(birthData, cityLat, cityLng, radiusKm = 300) {

const { lines } = await getAstroLines(birthData);

return lines

.map(line => {

const minDist = Math.min(...line.points.map(([lat, lon]) =>

_haversineDistance(cityLat, cityLng, lat, lon)));

return { ...line, distanceKm: Math.round(minDist),

influence: Math.max(0, 1 - minDist / radiusKm) };

})

.filter(l => l.distanceKm <= radiusKm)

.sort((a, b) => a.distanceKm - b.distanceKm);

}

function _haversineDistance(lat1, lon1, lat2, lon2) {

const R = 6371;

const dLat = (lat2 - lat1) * Math.PI / 180;

const dLon = (lon2 - lon1) * Math.PI / 180;

const a = Math.sin(dLat/2)**2 +

Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;

return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

}

/**

* Ángulos relocados para una ciudad concreta.

* Reutiliza window.getAscendant() de ascendant_engine.js.

*/

async function getRelocatedAngles(birthData, cityLat, cityLng, cityTimezone = null) {

const { date, time, timezone } = birthData;

const tz = cityTimezone || timezone;

const ascResult = window.getAscendant(date, time, cityLat, cityLng, tz);

const gastDeg = _getGAST(date, time, cityLat, cityLng, tz);

const mcLon = (gastDeg + cityLng + 360) % 360;

const ZODIAC = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo',

'Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];

const fmt = lon => ({

longitude: lon,

sign: ZODIAC[Math.floor(lon / 30)],

deg: Math.floor(lon % 30),

min: Math.floor((lon % 1) * 60)

});

const ascLon = ascResult.totalDeg || 0;

return {

ascendant: { ...fmt(ascLon), raw: ascResult },

mc: fmt(mcLon),

descendant: fmt((ascLon + 180) % 360),

ic: fmt((mcLon + 180) % 360),

city: { lat: cityLat, lng: cityLng }

};

}

## // ── Exportación ─────────────────────────────────────────────

window.getAstroLines = getAstroLines;

window.getLinesNearCity = getLinesNearCity;

window.getRelocatedAngles = getRelocatedAngles;

window.ASTROCARTO_PLANETS = ASTROCARTO_PLANETS; // exportar para el renderer

console.log('%c[KAIROS MAPS] astrocarto_engine.js v1.1 — colores KAIROS oficiales', 'color: #C9A96E; font-weight: bold;');

════════════════════════════════════════════════════════

ORDEN DE CARGA EN index.html

════════════════════════════════════════════════════════

<script src="luxon.min.js"></script>

<script src="astronomy.min.js"></script>

<script src="leaflet.js"></script>

<script src="swisseph_wrapper.js"></script> <!-- WASM -->

<script src="astronomy.js"></script> <!-- librería KAIROS -->

<script src="ascendant_engine.js"></script> <!-- motor AC -->

<script src="planetary_engine.js"></script> <!-- posiciones -->

<script src="aspects_engine.js"></script> <!-- aspectos -->

<script src="chart_650_v1.js"></script> <!-- glifos y colores -->

<script src="astrocarto_engine.js"></script> <!-- ESTE ARCHIVO -->

<script src="map_renderer.js"></script> <!-- mapa Leaflet -->

<script src="app.js"></script> <!-- app principal -->

IMPORTANTE: chart_650_v1.js debe cargarse ANTES que astrocarto_engine.js

para que window.KAIROS_GLYPHS y window.getKairosSymbol estén disponibles.

════════════════════════════════════════════════════════

## Ejemplo De Uso De Glifos Oficiales En El Mapa

════════════════════════════════════════════════════════

// En map_renderer.js, para dibujar el icono de una línea:

function getPlanetIcon(planetName) {

const svgPath = window.getKairosSymbol('planets', planetName);

const color = ASTROCARTO_PLANETS[planetKey]?.color || '#C9A96E';

return L.divIcon({

html: `<svg width="18" height="18" viewBox="0 0 100 100">

<g fill="none" stroke="${color}" stroke-width="3.5"

stroke-linecap="round" stroke-linejoin="round">

${svgPath}

</g>

</svg>`,

className: 'kairos-planet-icon',

iconSize: [18, 18],

iconAnchor: [9, 9]

});

}

════════════════════════════════════════════════════════

### FIN DEL DOCUMENTO — DOC-16 v2 REVISADO

### Kairos Maps | Mayo 2026

════════════════════════════════════════════════════════

