// ============================================================
// ⚠️ MÓDULO CONGELADO — aspects_engine.js v1.7.1
// NO MODIFICAR sin aprobación expresa de Roberto
// Última validación: Fase 6.18 — Abril 2026
// ============================================================
/*
KAIROS | ASPECTS ENGINE (v0.1.0)
Calculates astrological aspects between celestial bodies.
Built on top of KAIROS CORE.

Supported Aspects: Conjunction, Opposition, Trine, Square, Sextile.
Includes: Exact orb, Applying/Separating status.
*/

const KAIROS_ASPECTS_DEF = [
    { name: 'Conjunción', angle: 0, orb: 10 },
    { name: 'Oposición', angle: 180, orb: 10 },
    { name: 'Trígono', angle: 120, orb: 8 },
    { name: 'Cuadratura', angle: 90, orb: 8 },
    { name: 'Sextil', angle: 60, orb: 6 }
];

/**
 * Detects aspects between planetary positions.
 * @param {Object} positions - The 'positions' object from getPlanetaryPositions.
 * @param {Object} customOrbs - Optional object to override default orbs.
 * @returns {Array} Array of aspect objects.
 */
function getAspects(positions, customOrbs = {}) {
    const bodies = Object.keys(positions);
    const results = [];

    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const p1 = bodies[i];
            const p2 = bodies[j];
            const pos1 = positions[p1];
            const pos2 = positions[p2];

            // 1. Angular distance calculation
            const diff = Math.abs(pos1.longitude - pos2.longitude);
            const angularDistance = diff > 180 ? 360 - diff : diff;

            // 2. Check against each defined aspect
            for (const def of KAIROS_ASPECTS_DEF) {
                const maxOrb = customOrbs[def.name] || def.orb;
                const currentOrb = Math.abs(angularDistance - def.angle);

                if (currentOrb <= maxOrb) {
                    // 3. Determine Applying vs Separating
                    const applying = isAspectApplying(pos1, pos2, def.angle, angularDistance);

                    results.push({
                        p1: p1,
                        p2: p2,
                        aspect: def.name,
                        targetAngle: def.angle,
                        actualDistance: angularDistance,
                        orb: currentOrb,
                        isApplying: applying,
                        formattedOrb: formatOrb(currentOrb)
                    });
                }
            }
        }
    }

    // Sort by orb (most exact first)
    return results.sort((a, b) => a.orb - b.orb);
}

/**
 * Internal logic to determine if an aspect is becoming more exact.
 * Uses speeds provided by the engine.
 */
function isAspectApplying(pos1, pos2, aspectAngle, currentDistance) {
    const lon1 = pos1.longitude;
    const lon2 = pos2.longitude;
    const speed1 = pos1.speed;
    const speed2 = pos2.speed;

    // Small time delta (e.g., 0.001 day ~ 1.4 minutes)
    const dt = 0.001;
    
    const nextLon1 = (lon1 + speed1 * dt + 360) % 360;
    const nextLon2 = (lon2 + speed2 * dt + 360) % 360;
    
    const nextDiff = Math.abs(nextLon1 - nextLon2);
    const nextDistance = nextDiff > 180 ? 360 - nextDiff : nextDiff;

    const currentOrb = Math.abs(currentDistance - aspectAngle);
    const nextOrb = Math.abs(nextDistance - aspectAngle);

    return nextOrb < currentOrb;
}

function formatOrb(orb) {
    const deg = Math.floor(orb);
    const min = Math.floor((orb % 1) * 60);
    const sec = Math.floor(((orb % 1) * 60 % 1) * 60);
    return `${deg}º ${min}' ${sec}"`;
}

// Global Export
window.calculateAspects = getAspects;
