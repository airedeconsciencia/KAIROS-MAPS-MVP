// ============================================================
// ⚠️ MÓDULO CONGELADO — planetary_engine.js v1.7.1
// NO MODIFICAR sin aprobación expresa de Roberto
// Última validación: Fase 6.18 — Abril 2026
// ============================================================
/*
KAIROS LABORATORY - PLANETARY ENGINE (Fase 2)
STATUS: LABORATORY ONLY
VERSION: 0.4.6

Motor Planetario con Precarga en VFS (Virtual File System).
Solución definitiva para el acceso a efemérides en entornos WASM.

REGLA DE ORO: No interactúa con ascendant_engine.js.
*/

let swephReady = false;
let swe = null;

const KAIROS_BODIES = {
    SUN: 0,
    MOON: 1,
    MERCURY: 2,
    VENUS: 3,
    MARS: 4,
    JUPITER: 5,
    SATURN: 6,
    URANUS: 7,
    NEPTUNE: 8,
    PLUTO: 9,
    MEAN_NODE: 10,
    MEAN_APOG: 12, // Lilith Media
    CHIRON: 15
};

const ZODIAC_NAMES = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

async function preloadEphemeris(sweInstance) {
    console.log("📂 KAIROS LAB: Iniciando precarga en VFS...");
    
    // Buscamos el FS en varios lugares posibles según la build
    const FS = sweInstance.SweModule?.FS || sweInstance.FS || window.FS || window.Module?.FS;
    
    if (!FS) {
        console.error("❌ KAIROS LAB: Emscripten FS no detectado. No se puede escribir en el VFS.");
        console.log("Estructura de sweInstance:", Object.keys(sweInstance));
        if (sweInstance.SweModule) console.log("Estructura de SweModule:", Object.keys(sweInstance.SweModule));
        return;
    }

    console.log("📂 KAIROS LAB: FS detectado correctamente.");

    const path = '/ephe';
    try { 
        FS.mkdir(path); 
        console.log(`📁 KAIROS LAB: Directorio ${path} creado/verificado.`);
    } catch (e) {
        // Ya existe, ignorable
    }

    const files = ['sepl_18.se1', 'semo_18.se1', 'seas_18.se1'];
    const origin = window.location.origin;

    for (const file of files) {
        try {
            const url = `${origin}/ephe/${file}`;
            console.log(`📡 KAIROS LAB: Fetching ${file} desde ${url}...`);
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            
            const buffer = await resp.arrayBuffer();
            const data = new Uint8Array(buffer);
            
            const vfsPath = `${path}/${file}`;
            FS.writeFile(vfsPath, data);
            
            // Verificación
            const stats = FS.stat(vfsPath);
            if (stats && stats.size > 0) {
                console.log(`✔️ KAIROS LAB: ${file} escrito en VFS (${stats.size} bytes).`);
            } else {
                throw new Error("Archivo escrito pero con tamaño 0.");
            }
        } catch (err) {
            console.error(`❌ KAIROS LAB: Error en precarga de ${file}:`, err);
        }
    }
}

/**
 * Vincula el motor a la instancia nativa y asegura su inicialización.
 */
async function initPlanetaryEngine() {
    if (swephReady) return;

    // Si no existe el objeto nativo, intentamos importación dinámica (Web standard para ES Modules en scripts tradicionales)
    if (!window.swisseph_native) {
        console.log("📍 KAIROS: swisseph_native no detectado, intentando importación dinámica...");
        try {
            const { default: SwissEph } = await import('./kairos-core/wasm/swisseph_wrapper.js');
            window.swisseph_native = new SwissEph();
            console.log("%c[KAIROS] Swiss Ephemeris Wrapper loaded successfully", "color: #00ff00; font-weight: bold;");
        } catch (e) {
            console.error("❌ KAIROS: Error en importación dinámica de SwissEph:", e);
        }
    }

    swe = window.swisseph_native;
    
    if (!swe) {
        console.error("❌ STEP 3 FAILURE: swisseph_native no encontrado.");
        throw new Error("Instancia nativa swisseph_native no detectada en window.");
    }

    try {
        console.log("⚙️ KAIROS LAB: Iniciando inicialización del motor...");
        
        // --- STEP 3: initSwissEph ---
        console.log("STEP 3: before initSwissEph");
        if (typeof swe.initSwissEph === 'function') {
            try {
                await swe.initSwissEph();
                console.log("%c[KAIROS] Swiss Ephemeris WASM loaded successfully", "color: #00ff00; font-weight: bold;");
                console.log("STEP 4: after initSwissEph (SUCCESS)");
            } catch (err) {
                console.error("❌ STEP 4 FAILURE: Error en initSwissEph:", err);
                throw err;
            }
        } else {
            console.warn("⚠️ initSwissEph no es una función, continuando...");
        }

        // --- STEP 5: preload ephemeris ---
        console.log("STEP 5: before preload ephemeris");
        try {
            await preloadEphemeris(swe);
            console.log("STEP 6: after preload ephemeris (SUCCESS)");
        } catch (err) {
            console.error("❌ STEP 6 FAILURE: Error en preloadEphemeris:", err);
            throw err;
        }

        // --- PATH CONFIG ---
        if (typeof swe.set_ephe_path === 'function') {
            console.log("📂 KAIROS LAB: Configurando path de efemérides a /ephe");
            swe.set_ephe_path('/ephe');
        }

        swephReady = true;
        console.log("🔭 KAIROS LAB: Motor Planetario Validado y Listo.");
    } catch (e) {
        console.error("❌ KAIROS LAB BUG: Fallo en initPlanetaryEngine:", e);
        throw e;
    }
}

/**
 * Función central de cálculo para el laboratorio.
 * Arquitectura: Motor Canónico Mundial (IANA/Luxon + SwissEph).
 * 
 * @param {string} birthDate - Formato 'YYYY-MM-DD'
 * @param {string} birthTime - Formato 'HH:mm'
 * @param {number} latitude - Latitud decimal
 * @param {number} longitude - Longitud decimal
 * @param {string} timezone - IANA Timezone (ej: 'Europe/Madrid'). Si es null, usa 'UTC'.
 * @param {number} manualUtcOffset - OPCIONAL. Solo para auditoría legacy.
 */
async function getPlanetaryPositions(birthDate, birthTime, latitude, longitude, timezone = 'UTC', manualUtcOffset = null) {
    if (!swephReady) await initPlanetaryEngine();

    const modeLabel = manualUtcOffset !== null ? `AUDIT-LEGACY (Offset: ${manualUtcOffset}h)` : `CANONICAL (IANA)`;
    if (!window._kairos_planetary_logged) {
        console.log(`\n--- 🔭 MOTOR PLANETARIO KAIROS: Modo ${modeLabel} ---`);
        window._kairos_planetary_logged = true;
    }

    try {
        const [y, m, d] = birthDate.split('-').map(Number);
        const [h, min] = birthTime.split(':').map(Number);
        
        // TZ: Priorizamos el argumento, fallback a UTC para evitar heurísticas locales.
        const tzArg = timezone || 'UTC';
        const luxonDt = window.luxon.DateTime.fromObject(
            { year: y, month: m, day: d, hour: h, minute: min, second: 0 },
            { zone: tzArg }
        );

        if (!luxonDt.isValid) throw new Error(`Invalid date or timezone: ${tzArg}`);

        let utc;
        if (manualUtcOffset !== null) {
            // Modo Auditoría Legacy: Forzamos un offset manual para comparar con tablas antiguas.
            utc = luxonDt.setZone('UTC', { keepLocalTime: true }).minus({ hours: manualUtcOffset });
        } else {
            // Modo Canónico Global: Conversión estándar basada en la base de datos de IANA.
            utc = luxonDt.toUTC();
        }

        const jdResult = swe.utc_to_jd(utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second, 1);
        const jdUt = jdResult.julianDayUT;
        const deltaT = swe.deltat(jdUt);

        // FLAGS: SEFLG_SWIEPH (2) | SEFLG_SPEED (256)
        const GEO_FLAGS = 2 | 256;
        const TOPO_FLAGS = 2 | 256 | 32768; // SEFLG_TOPOCTR

        // Configuración de ubicación para cálculos topocéntricos (Auditoría)
        const lat = latitude || 0;
        const lon = longitude || 0;
        const alt = 0;
        if (typeof swe.set_topo === 'function') {
            swe.set_topo(lon, lat, alt);
        }

        const bodies = { ...KAIROS_BODIES, TRUE_NODE: 11, OSCU_APOG: 13 };
        const results = {};

        for (const [name, id] of Object.entries(bodies)) {
            // Cálculo Geocéntrico (Estándar de la aplicación)
            const resGeo = swe.calc_ut(jdUt, id, GEO_FLAGS);
            
            // Cálculo Topocéntrico (Solo para comparación técnica en logs)
            const resTopo = swe.calc_ut(jdUt, id, TOPO_FLAGS);

            const lonGeo = resGeo[0];
            const speedGeo = resGeo[3];

            const signIndex = Math.floor(lonGeo / 30);
            const degAll = lonGeo % 30;
            
            results[name] = {
                id: id,
                longitude: lonGeo,
                longitudeTopo: resTopo[0],
                sign: ZODIAC_NAMES[signIndex],
                deg: Math.floor(degAll),
                min: Math.floor((degAll % 1) * 60),
                sec: Math.floor(((degAll % 1) * 60 % 1) * 60),
                isRetro: speedGeo < 0,
                speed: speedGeo,
                audit: {
                    raw_geo: lonGeo,
                    raw_topo: resTopo[0]
                }
            };
        }

        return {
            metadata: {
                version: "0.5.0-canonical",
                mode: modeLabel,
                utc: utc.toString(),
                jdUt: jdUt,
                deltaT: deltaT * 86400,
                location: { lat, lon }
            },
            positions: results
        };

    } catch (e) {
        console.error("❌ KAIROS MOTOR Error:", e);
        throw e;
    }
}

/**
 * Cálculo de Casas y Ángulos usando Swiss Ephemeris.
 * Sigue la misma lógica temporal canónica que el motor planetario.
 */
async function getHousesAndAngles(birthDate, birthTime, latitude, longitude, timezone = 'UTC', houseSystem = 'P') {
    if (!swephReady) await initPlanetaryEngine();

    try {
        const [y, m, d] = birthDate.split('-').map(Number);
        const [h, min] = birthTime.split(':').map(Number);
        const tzArg = timezone || 'UTC';

        const luxonDt = window.luxon.DateTime.fromObject(
            { year: y, month: m, day: d, hour: h, minute: min, second: 0 },
            { zone: tzArg }
        );

        if (!luxonDt.isValid) throw new Error(`Invalid date/timezone: ${tzArg}`);

        const utc = luxonDt.toUTC();
        const jdResult = swe.utc_to_jd(utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second, 1);
        const jdUt = jdResult.julianDayUT;

        // Cálculo de casas
        // houseSystem: 'P' para Placidus, 'K' para Koch, 'C' para Campanus, etc.
        const res = swe.houses(jdUt, latitude, longitude, houseSystem);

        const ascLon = res.ascmc[0]; // Ascendente es el índice 0 de ascmc
        const mcLon = res.ascmc[1];  // MC es el índice 1

        const formatPos = (lon) => {
            const signIndex = Math.floor(lon / 30);
            const degAll = lon % 30;
            return {
                longitude: lon,
                sign: ZODIAC_NAMES[signIndex],
                deg: Math.floor(degAll),
                min: Math.floor((degAll % 1) * 60),
                sec: Math.floor(((degAll % 1) * 60 % 1) * 60)
            };
        };

        // [v650.5.16 FIX] Float64Array.map() devuelve otra Float64Array (no un Array de objetos).
        // Array.from() convierte primero a Array regular para que .map() devuelva objetos planos.
        const houseCusps = Array.from(res.cusps).slice(1).map(c => formatPos(c));

        return {
            metadata: {
                version: "0.5.0-houses",
                utc: utc.toString(),
                jdUt: jdUt,
                system: houseSystem,
                location: { lat: latitude, lon: longitude }
            },
            ascendant: formatPos(ascLon),
            mc: formatPos(mcLon),
            houses: houseCusps,
            ascmc_raw: res.ascmc // Para auditoría completa
        };

    } catch (e) {
        console.error("❌ KAIROS HOUSES Error:", e);
        throw e;
    }
}

window.getPlanetaryPositions = getPlanetaryPositions;
window.getHousesAndAngles = getHousesAndAngles;
window.initPlanetaryEngine = initPlanetaryEngine;
