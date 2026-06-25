# WAVE PLANNER

**Fase:** F4.0 — Global Expansion Framework  
**Modo operativo:** AUTOPILOT v4  
**Última revisión:** 26 mayo 2026

> Reglas permanentes para planificar, ejecutar y cerrar waves de expansión.  
> SSOT de países pendientes: `GLOBAL_EXPANSION_BACKLOG.md`  
> SSOT de familias: `EDITORIAL_FAMILY_POLICY.md`

---

## I. Tipos de wave

| Tipo | Incrementa países | Incrementa ciudades | Ejemplo |
|------|-------------------|---------------------|---------|
| **Territorial** | Sí (+2–3) | Sí (+2–3) | F3.17 Etiopía · Tanzania |
| **Densificación** | No | Sí (+1–2) | F3.10 Barcelona |
| **Runtime editorial** | No | No | F3.3 WEST_AFRICAN packs |

F4 prioriza **territorial** salvo entrada explícita en backlog §III (densificación).

---

## II. Reglas de batch

| Regla | Valor |
|-------|-------|
| Tamaño mínimo | **2 países** |
| Tamaño óptimo | **2–3 países** |
| Tamaño máximo | **3 países** (salvo `EDITORIAL-OK` para 1 país sensible + 2 ancla) |
| Prohibido | Wave de **1 solo país** |
| Familia nueva | Máximo **1 familia nueva por fase** (no por wave) |

---

## III. Alternancia regional

Evitar **dos waves consecutivas** con >50% países en la misma macro-región.

| Macro-región | Waves recientes |
|--------------|-----------------|
| Asia oriental | F3.15 |
| Golfo / OM | F3.16 |
| África oriental | F3.17 |
| **Siguiente preferente** | Levante · Europa residual · LATAM+ · SEA+ |

**Penalización:** Europa residual depriorizada vs global hasta completar F4.1–F4.3.

---

## IV. Prioridad por ROI

Orden de desempate (1 = más importante):

1. **Impacto usuario / mapa** — destinos de reubicación con alto volumen de búsqueda
2. **Cobertura geográfica global** — cerrar huecos en mapa mundial
3. **Valor estratégico país** — hubs migratorios / diaspora
4. **Riesgo arquitectónico** — preferir familia existente
5. **Facilidad técnica** — resolver+catálogo sin packs nuevos

Score rápido: **P1** = fuerte en 1–3 · **P2** = fuerte en 2–4 · **P3** = resto o riesgo editorial.

---

## V. Gates (máquina de estados)

```
AUDIT → IMPLEMENT → SMOKES 9/9 → COMMIT → PUSH → STAGING → QA
    → READY FOR PROD → [humano: DEPLOY-PROD] → PROD QA → CHECKPOINT DOC → PUSH DOC
    → WAVE COMPLETADA
```

| Gate | Quién | Condición |
|------|-------|-----------|
| `EDITORIAL-OK` | Humano | País sensible (Israel, Líbano, Venezuela, Myanmar, China-level) |
| `READY FOR PROD` | Autopilot | 9/9 smokes + staging QA curl |
| `DEPLOY-PROD` | Humano | Única puerta a producción |
| `WAVE COMPLETADA` | Autopilot | prod + staging + GitHub + checkpoint sincronizados |

**No deploy prod** sin `DEPLOY-PROD` explícito.

---

## VI. Pipeline por fase

### Fase A — Auditoría (≤1 pantalla)

- Países del batch + familia propuesta
- Métricas antes/después (ciudades / países)
- Riesgos + dependencias
- Decisión: ejecutar / STOP

### Fase B — Implementación

- `editorial-family-resolver.js` — slug + aliases + `SCHEMA_VERSION`
- `cities-catalog.js` — ciudad ancla + `COUNTRY_*` + `EXPECTED_*`
- **Sin** narrative / premium / astro salvo wave runtime editorial dedicada

### Fase C — Validación

- Suite **9 smokes** (obligatoria)
- Split-brain cases += N nuevas ciudades
- Baselines `EXPECTED_*` en smokes regionales

### Fase D — Deploy

- `commit` → `push` → `deploy-staging.sh` → curl QA
- STOP en `READY FOR PROD`
- `deploy-prod.sh` solo con `DEPLOY-PROD`

### Fase E — Cierre

- `F3.xx` / `F4.xx` production checkpoint
- `KAIROS_CURRENT_CHECKPOINT.md`
- `GLOBAL_EXPANSION_BACKLOG.md` — status → `live`

---

## VII. STOP conditions (inmediato)

Detener autopilot y escalar a humano si:

| # | Condición |
|---|-----------|
| 1 | Smoke **FAIL** sin fix obvio en mismo turno |
| 2 | Regresión familia en país live |
| 3 | Propuesta de **familia nueva** no aprobada en política |
| 4 | Conflicto resolver ↔ catálogo (split-brain >0) |
| 5 | Riesgo editorial fuerte emergente en QA (país sensible) |
| 6 | `EDITORIAL-OK` requerido y no recibido |
| 7 | Cambio arquitectónico fuera de resolver+catálogo+smokes |
| 8 | Inconsistencia datos (coords, slug, display name) |

**No STOP** por: sub-fases mecánicas dentro de la misma wave · checkpoint doc · push docs.

---

## VIII. Naming y schemas

| Artefacto | Patrón |
|-----------|--------|
| Wave ID | `F4.N` territorial · `F4.Dn` densificación |
| Schema catálogo | `3.8f.1-f4.N-0.1` |
| Schema resolver | `3.8h.2-f4.N-0.1` |
| Commit runtime | `f4.N resolver expansion <region> (<countries>)` |
| Checkpoint | `F4.N_<REGION>_PRODUCTION_CHECKPOINT.md` |

---

## IX. Checklist pre-wave

- [ ] Filas en `GLOBAL_EXPANSION_BACKLOG.md` con status `planned`
- [ ] Familia validada contra `EDITORIAL_FAMILY_POLICY.md`
- [ ] Dependencias resueltas (`EDITORIAL-OK` si aplica)
- [ ] Macro-región alterna con wave anterior
- [ ] Batch 2–3 países confirmado

---

*Wave Planner F4.0 · AUTOPILOT v4*
