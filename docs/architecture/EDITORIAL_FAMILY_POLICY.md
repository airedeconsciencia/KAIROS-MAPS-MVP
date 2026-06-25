# EDITORIAL FAMILY POLICY

**Fase:** F4.0 — Global Expansion Framework  
**Ámbito:** decisiones de familia editorial en expansión territorial  
**Runtime afectado (futuro):** `editorial-family-resolver.js` + servicios narrativa/premium/knowledge  
**Última revisión:** 26 mayo 2026

> Las **11 familias registradas** son el set cerrado hasta nueva decisión explícita.  
> Esta política define **cuándo reutilizar**, **cuándo crear** y **cuándo una familia está saturada**.

---

## I. Familias registradas (estado actual)

`IBERIAN` · `MEDITERRANEAN` · `ANGLO` · `EAST_ASIAN` · `AFRICAN_COASTAL` · `LATAM` · `WESTERN_EUROPE` · `SOUTHEAST_ASIAN` · `SOUTH_ASIAN` · `WEST_AFRICAN` · `GLOBAL_NEUTRAL`

**DEFAULT:** `GLOBAL_NEUTRAL` — países no mapeados (canario: Reykjavik / `iceland`).

---

## II. Reutilizar familia existente

**Criterio: cumplir ≥4 de 5**

| # | Criterio objetivo | Umbral |
|---|-------------------|--------|
| 1 | **Precedente resolver** | ≥1 país del mismo macro-corredor ya mapeado a esa familia |
| 2 | **Packs editoriales** | Familia tiene tablas completas en narrative + premium + knowledge |
| 3 | **Smoke split-brain** | País nuevo no genera slug/display mismatch en suite 9 smokes |
| 4 | **Anti-leak** | Lecturas de ciudad ancla no activan `REGIONAL_FALLBACK_BAN_MARKERS` de otra familia |
| 5 | **Riesgo editorial** | Sin conflicto geopolítico/cultural que requiera copy dedicado |

### Precedentes F3 validados

| Decisión | Familia elegida | Motivo |
|----------|-----------------|--------|
| Marruecos · Túnez | MEDITERRANEAN (no AFRICAN_COASTAL) | Corredor mediterráneo; decisión estratégica explícita |
| UAE · QA · SA | MEDITERRANEAN | Precedente Turquía; sin familia Golfo |
| China · Taiwán | EAST_ASIAN | Japón/Corea ya anclan |
| Etiopía · Tanzania | AFRICAN_COASTAL (no EAST_AFRICAN) | Kenia ya ancla; packs AC completos |

### Asignaciones por defecto (nuevos países)

| Macro-región | Familia default |
|--------------|-----------------|
| Europa occidental/central/nórdica | WESTERN_EUROPE |
| Europa meridional / Levante / Golfo / Magreb | MEDITERRANEAN |
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
5. Smoke dedicado + actualización suite 9.
6. **No crear familia nueva en wave territorial** sin completar pasos 3–5.

### Familias rechazadas (F3)

| Propuesta | Decisión | Motivo |
|-----------|----------|--------|
| `EAST_AFRICAN` | Rechazada F3.17 | Kenia en AFRICAN_COASTAL; sin fallo de leak |
| Familia Golfo | Rechazada F3.16 | MEDITERRANEAN absorbió con precedente TR |

---

## IV. Familia saturada

Una familia se considera **saturada** cuando cumple **≥2** de:

| Señal | Umbral medible |
|-------|----------------|
| **Heterogeneidad geográfica** | >12 países en familia con ≥3 sub-regiones sin precedente |
| **Colisión narrativa** | ≥2 pares ciudad-ancla misma familia con conflict text duplicado en smokes dedup |
| **Leak rate** | >0 hits anti-leak en integración regional tras 2 waves consecutivas en misma familia |
| **Override ciudad** | >3 entradas en `CITY_EDITORIAL_FAMILY` para corregir país |
| **Nombre semántico** | Nombre de familia induce error sistemático (ej. COASTAL + país sin costa) **y** leak rate >0 |

### Acciones al detectar saturación

1. **No** añadir más países a la familia en la wave actual.
2. Auditar si el próximo batch requiere **familia nueva** o **override ciudad**.
3. Documentar en checkpoint wave + actualizar esta política.

### Estado saturación actual (F3.17)

| Familia | Países | Saturada | Nota |
|---------|--------|----------|------|
| MEDITERRANEAN | 9 | ⚠️ vigilancia | Golfo + Magreb + sur Europa; monitorizar leak |
| WESTERN_EUROPE | 12 | ⚠️ vigilancia | Cerca umbral heterogeneidad |
| AFRICAN_COASTAL | 5 | ✅ OK | Corredor Este coherente post-F3.17 |
| WEST_AFRICAN | 10 | ✅ OK | Familia dedicada con packs propios |
| Resto | ≤6 | ✅ OK | — |

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

*Política F4.0 · 11 familias @ f3.17*
