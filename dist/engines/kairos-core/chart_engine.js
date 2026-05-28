/*
KAIROS | CHART ENGINE (v0.1.0)
The High-Level Orchestrator.
Assembles the full natal chart using KAIROS CORE and derived modules.

Components:
- Planetary Positions (Core)
- Houses and Angles (Core - Placidus)
- Aspects (Aspects Engine)
*/

/**
 * Generates a complete natal chart from birth parameters.
 * @param {string} birthDate - 'YYYY-MM-DD'
 * @param {string} birthTime - 'HH:mm'
 * @param {number} latitude - Decimal
 * @param {number} longitude - Decimal
 * @param {string} timezone - IANA Timezone
 * @returns {Object} Full Chart JSON
 */
async function generateFullChart(birthDate, birthTime, latitude, longitude, timezone = 'UTC') {
    
    // 1. Ensure the core is ready
    if (typeof initPlanetaryEngine === 'function') {
        await initPlanetaryEngine();
    }

    // 2. Get Planetary Positions (Canonical)
    const planetaryData = await getPlanetaryPositions(birthDate, birthTime, latitude, longitude, timezone);

    // 3. Get Houses and Angles (Default: Placidus 'P')
    const houseData = await getHousesAndAngles(birthDate, birthTime, latitude, longitude, timezone, 'P');

    // 4. Calculate Aspects
    let aspects = [];
    if (typeof calculateAspects === 'function') {
        aspects = calculateAspects(planetaryData.positions);
    }

    // 5. Utility: Get House from Longitude
    const getHouseFromLongitude = (lon, cuspsData) => {
        // cuspsData is an array of objects { longitude, ... } for houses 1-12
        const cusps = cuspsData.map(c => c.longitude);
        for (let i = 0; i < 11; i++) {
            let start = cusps[i];
            let end = cusps[i + 1];
            if (start < end) {
                if (lon >= start && lon < end) return i + 1;
            } else {
                // House spans over 0° Aries
                if (lon >= start || lon < end) return i + 1;
            }
        }
        // Check house 12 (Cusp 12 to Cusp 1)
        let h12Start = cusps[11];
        let h12End = cusps[0];
        if (h12Start < h12End) {
            if (lon >= h12Start && lon < h12End) return 12;
        } else {
            if (lon >= h12Start || lon < h12End) return 12;
        }
        return 1; // Fallback
    };

    // 6. Refine Planetary Data (Add house and long_raw)
    const refinedPlanets = {};
    const ascSignIndex = Math.floor(houseData.ascendant.longitude / 30);

    for (const [name, data] of Object.entries(planetaryData.positions)) {
        const planetSignIndex = Math.floor(data.longitude / 30);
        const wholeSignHouse = ((planetSignIndex - ascSignIndex + 12) % 12) + 1;

        refinedPlanets[name] = {
            ...data,
            longitude_raw: data.longitude,
            house: wholeSignHouse
        };
    }

    // 7. Calculate Additional Angles (DC, IC)
    const ZODIAC_NAMES = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    
    const formatPos = (lon) => {
        const normLon = (lon + 360) % 360;
        const signIndex = Math.floor(normLon / 30);
        const degAll = normLon % 30;
        return {
            longitude: normLon,
            sign: ZODIAC_NAMES[signIndex],
            deg: Math.floor(degAll),
            min: Math.floor((degAll % 1) * 60),
            sec: Math.floor(((degAll % 1) * 60 % 1) * 60)
        };
    };

    const dcLon = (houseData.ascendant.longitude + 180) % 360;
    const icLon = (houseData.mc.longitude + 180) % 360;

    // 8. Build the Final Assembly (Clean Structure)
    return {
        metadata: {
            title: "KAIROS Master Natal Chart",
            version: "0.5.0-master",
            engine: "KAIROS CORE",
            motor: "Swiss Ephemeris (WASM)",
            zodiac: "Tropical",
            center: "Geocentric",
            house_system: "Placidus",
            timestamp: new Date().toISOString()
        },
        input: {
            date: birthDate,
            time: birthTime,
            utc: planetaryData.metadata.utc,
            latitude: latitude,
            longitude: longitude,
            timezone: timezone
        },
        planets: refinedPlanets,
        angles: {
            ASC: houseData.ascendant,
            MC: houseData.mc,
            DC: formatPos(dcLon),
            IC: formatPos(icLon)
        },
        houses: houseData.houses,
        aspects: aspects
    };
}

// Global Export
window.generateFullChart = generateFullChart;
