# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main`** (sin push)  
**HEAD runtime:** `227a00b` — `f2.5c western europe runtime integration`  
**Checkpoint F2.5:** `docs/architecture/F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md`  
**Producción live:** **sin WESTERN_EUROPE desplegado** · runtime local @ `227a00b`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **8 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y desde **F2.5c** familia **`WESTERN_EUROPE`** integrada en runtime local.

**PRE-F1 cerrado** · prod LATAM legacy. **F2.2c–F2.2d3 cerrados** · DEFAULT neutral. **F2.3b cerrado** · wave 1 LATAM (CO/CL/UY/EC). **F2.5c cerrado localmente** · WE runtime + 14 packs + smokes.

**Producción** (https://kairos-maps-mvp.web.app) — **sin F2.5c / WESTERN_EUROPE**. París · Berlín · Ámsterdam · Estocolmo siguen voz legacy en live hasta F2.5d.

**Local `src/`** — **`227a00b`**: WE registrada · FR/DE/NL/SE migrados · filtro fallback cross-family.

**Smokes gate F2.5c:** **10/10 PASS**.

**Riesgos vivos:** prod sin WE · `dist/` desincronizado · TH/SG/IN siguen IBERIAN · vocabulario global en rutas no filtradas.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit |
|------|--------|--------|
| PRE-F1.3 → PRE-F1.9d | ✅ Cerrado | `a8d4a60` → `a25e2c7` |

Prod LATAM deploy histórico: PRE-F1.9b @ `ce69f09`. Ver `KAIROS_MASTER_HANDOFF_F1.8.md`.

---

## III. Serie F2 — en curso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F2.0–F2.2d3** | ✅ Runtime + doc | DEFAULT GLOBAL_NEUTRAL · `fcf61d7` |
| **F2.2d3c** | ✅ Doc | `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` |
| **F2.3b** | ✅ Runtime | `c4629bd` · CO/CL/UY/EC → LATAM |
| **F2.5a** | ✅ Diseño | Arquitectura WE (read-only) |
| **F2.5b** | ✅ Copy | 14 packs WE (contenido, incluido en F2.5c) |
| **F2.5c** | ✅ Runtime | `227a00b` · WE registrada · mis-maps FR/DE/NL/SE |
| **F2.5c1** | ✅ Doc | `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` |
| **F2.5d** | ⏳ Pendiente | Staging deploy + browser QA WESTERN_EUROPE |

---

## IV. F2.5c — qué cambió / qué no

### Cambió (`227a00b`)

- **`WESTERN_EUROPE`** en `REGISTERED_FAMILIES` (**8 familias**)
- Migración: **`france` · `germany` · `netherlands` · `sweden`** → `WESTERN_EUROPE`
- **14 packs editoriales** WE integrados (narrative · composition · knowledge)
- Schema EFR: **`3.8h.2-f2.5c-0.1`**
- Filtro fallback cross-family en composición (leak `paseo` genérico)
- Smokes: 2 nuevos WE + actualización **7 → 8 familias**

### No cambió

- **`DEFAULT_FAMILY`** sigue `GLOBAL_NEUTRAL`
- **TH / SG / IN** siguen `IBERIAN`
- Sin deploy post-F2.5c
- Prod **sin WESTERN_EUROPE**
- Catálogo · astro · WASM sin tocar

---

## V. Smokes gate actuales

```bash
./scripts/dev-western-europe-editorial-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F2.5c:** **10/10 PASS**.

---

## VI. QA piloto WE (local)

| Bloque | Resultado |
|--------|-----------|
| París × amor · trabajo · descanso | **PASS** → WESTERN_EUROPE |
| Berlín × amor · trabajo · descanso | **PASS** → WESTERN_EUROPE |
| Ámsterdam × amor · trabajo · descanso | **PASS** → WESTERN_EUROPE |
| Estocolmo × amor · trabajo · descanso | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| CDMX / amor | **PASS** → LATAM |

---

## VII. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **Sin F2.5c** · sin WESTERN_EUROPE |
| **Staging** | https://kairos-maps-dev.web.app | Paridad prod (pre-F2.5d) |
| **Local `src/`** | — | **`227a00b`** · WE integrada |

---

## VIII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.5-1** | Producción sin WESTERN_EUROPE |
| **R-F2.5-2** | `thailand` · `singapore` · `india` → IBERIAN |
| **R-F2.5-3** | `dist/` desincronizado vs `src/` F2.5c |
| **R-F2.5-4** | Vocabulario global en rutas no filtradas (premium-blocks · country-archetypes · etc.) |
| **R-F2.5-5** | Commits F2.3b/F2.5c sin push |
| **OP-3** | `dist/` dirty · no commiteado |

---

## IX. Git status (post F2.5c1 doc)

```
HEAD runtime: 227a00b — f2.5c western europe runtime integration
HEAD doc:     (pending) — f2.5c western europe runtime checkpoint

Rama: main · ahead of origin/main
src/: limpio @ 227a00b
dist/: modificado / untracked (NO commiteado)
Producción: sin WESTERN_EUROPE desplegado
```

---

## X. Siguiente fase

### **F2.5d — Staging deploy + browser QA WESTERN_EUROPE**

1. Build `dist/` desde `src/` @ `227a00b`
2. Deploy staging
3. Browser QA París · Berlín · Ámsterdam · Estocolmo (+ regresiones Lisboa · Oslo · CDMX)
4. Gate explícito antes de prod

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.5c WE runtime |
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | DEFAULT GLOBAL_NEUTRAL |
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | SSOT fallback |
| `PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` | Patrón LATAM |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.5c1 · Doc-only · Sin deploy · Prod sin WE · Local runtime @ 227a00b*
