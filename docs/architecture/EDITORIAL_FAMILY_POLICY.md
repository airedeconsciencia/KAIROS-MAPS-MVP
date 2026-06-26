# EDITORIAL FAMILY POLICY

**Fase:** F4.0 — Global Expansion Framework (actualizado F6.2)  
**Ámbito:** decisiones de familia editorial en expansión territorial  
**Runtime afectado:** `editorial-family-resolver.js` + servicios narrativa/premium/knowledge  
**Última revisión:** 26 mayo 2026

> Las **12 familias registradas** son el set actual.  
> Esta política define **cuándo reutilizar**, **cuándo crear** y **cuándo una familia está saturada**.

---

## I. Familias registradas (estado actual @ f6.2)

`IBERIAN` · `MEDITERRANEAN` · `ANGLO` · `EAST_ASIAN` · `AFRICAN_COASTAL` · `LATAM` · `WESTERN_EUROPE` · `SOUTHEAST_ASIAN` · `SOUTH_ASIAN` · `WEST_AFRICAN` · **`MENA`** · `GLOBAL_NEUTRAL`

**DEFAULT:** `GLOBAL_NEUTRAL` — países no mapeados (canario: Reykjavik / `iceland`).

**MENA live (8):** `united_arab_emirates` · `qatar` · `saudi_arabia` · `israel` · `jordan` · `lebanon` · `kuwait` · `oman`

---

## II. Reutilizar familia existente

**Criterio: cumplir ≥4 de 5**

| # | Criterio objetivo | Umbral |
|---|-------------------|--------|
| 1 | **Precedente resolver** | ≥1 país del mismo macro-corredor ya mapeado a esa familia |
| 2 | **Packs editoriales** | Familia tiene tablas completas en narrative + premium + knowledge |
| 3 | **Smoke split-brain** | País nuevo no genera slug/display mismatch en suite smokes |
| 4 | **Anti-leak** | Lecturas de ciudad ancla no activan `REGIONAL_FALLBACK_BAN_MARKERS` de otra familia |
| 5 | **Riesgo editorial** | Sin conflicto geopolítico/cultural que requiera copy dedicado |

### Precedentes validados

| Decisión | Familia elegida | Motivo |
|----------|-----------------|--------|
| Marruecos · Túnez | MEDITERRANEAN (no AFRICAN_COASTAL) | Corredor mediterráneo; decisión estratégica explícita |
| UAE · QA · SA · IL · JO | **MENA** (F6.1) | Migrados desde MED; packs MENA F6.0 |
| LB · KW · OM | **MENA** (F6.2) | Expansión territorial; packs F6.0 reutilizados |
| China · Taiwán | EAST_ASIAN | Japón/Corea ya anclan |
| Etiopía · Tanzania | AFRICAN_COASTAL (no EAST_AFRICAN) | Kenia ya ancla; packs AC completos |

### Asignaciones por defecto (nuevos países)

| Macro-región | Familia default |
|--------------|-----------------|
| Europa occidental/central/nórdica | WESTERN_EUROPE |
| Europa meridional / Magreb | MEDITERRANEAN |
| Golfo / Levante | **MENA** |
| Iberia | IBERIAN (solo PT; ES → MED por país) |
| Anglo / Oceanía | ANGLO |
| Asia oriental | EAST_ASIAN |
| Sudeste asiático | SOUTHEAST_ASIAN |
| Asia meridional | SOUTH_ASIAN |
| África occidental (ECOWAS) | WEST_AFRICAN |
| África oriental / austral / nororiental | AFRICAN_COASTAL |
| América Latina | LATAM |

---

## III. Crear familia nueva

**Solo si cumplir ≥3 de 4**

| # | Criterio | Umbral |
|---|----------|--------|
| 1 | **Densidad regional** | ≥8 países homogéneos sin voz editorial distinta en familia existente |
| 2 | **Fallo de reutilización** | Smokes anti-leak FAIL sistemático con familia candidata en ≥3 ciudades ancla |
| 3 | **Copy surface** | Requiere ≥14 packs nuevos (patrón WEST_AFRICAN F3.3) en 3 servicios |
| 4 | **Aprobación** | `EDITORIAL-OK` + checkpoint de arquitectura antes de implementación |

### Proceso obligatorio

1. Auditoría ≤1 pantalla con tabla de países candidatos.
2. Propuesta de slug familia + lista `REGISTERED_FAMILIES`.
3. Implementación packs en `narrative-intelligence-service.js`, `city-premium-composition-service.js`, `premium-knowledge-service.js`.
4. Ampliar `REGIONAL_FALLBACK_BAN_MARKERS`.
5. Smoke dedicado + actualización suite smokes.
6. **No crear familia nueva en wave territorial** sin completar pasos 3–5.

### Familias creadas / rechazadas

| Propuesta | Decisión | Motivo |
|-----------|----------|--------|
| `EAST_AFRICAN` | Rechazada F3.17 | Kenia en AFRICAN_COASTAL; sin fallo de leak |
| Familia Golfo (F3) | Rechazada F3.16 | Absorbida temporalmente en MED |
| **`MENA`** | **Creada F6.0** | Sprint arquitectura; migración F6.1 |

---

## IV. Familia saturada

Una familia se considera **saturada** cuando cumple **≥2** de:

| Señal | Umbral medible |
|-------|----------------|
| **Heterogeneidad geográfica** | >12 países en familia con ≥3 sub-regiones sin precedente |
| **Colisión narrativa** | ≥2 pares ciudad-ancla misma familia con conflict text duplicado en smokes dedup |
| **Leak rate** | >0 hits anti-leak en integración regional tras 2 waves consecutivas en misma familia |
| **Override ciudad** | >3 entradas en `CITY_EDITORIAL_FAMILY` para corregir país |
| **Nombre semántico** | Nombre de familia induce error sistemático **y** leak rate >0 |

### Estado saturación actual (@ f6.2 prod)

| Familia | Países | Saturada | Nota |
|---------|--------|----------|------|
| WESTERN_EUROPE | 14 | 🔒 congelada | — |
| WEST_AFRICAN | 13 | 🔒 congelada | — |
| AFRICAN_COASTAL | 12 | 🔒 congelada | — |
| LATAM | 12 | 🔒 congelada | — |
| MEDITERRANEAN | **7** | ✅ OK | Reducida post-F6.1 (era 12) |
| **MENA** | **8** | ✅ OK | Activa; margen expansión F6.3+ |
| SOUTHEAST_ASIAN | 11 | ✅ OK | ASEAN completo |
| ANGLO | 11 | ⚠️ vigilancia | 1 slot Surinam @ 12 |
| EAST_ASIAN | 5 | ✅ OK | — |
| SOUTH_ASIAN | 8 | ✅ OK | — |

---

## V. Overrides de ciudad

`CITY_EDITORIAL_FAMILY` solo para excepciones documentadas:

| Ciudad | Override | Motivo |
|--------|----------|--------|
| Lisboa | IBERIAN | PT país + override ciudad lab |
| Barcelona | MEDITERRANEAN | ES país MED; diferenciación densificación |
| Toronto | ANGLO | Lab city |
| Tokio | EAST_ASIAN | Refuerzo ancla |
| Ciudad del Cabo | AFRICAN_COASTAL | Lab city |

**Regla:** no añadir override sin entrada en backlog + justificación en checkpoint wave.

---

*Política F6.2 · 12 familias @ f6.2 prod*
