# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD:** `edcf116` — `f2.6d smoke schema drift hotfix`  
**Checkpoint F2.6:** `docs/architecture/F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md`  
**Producción live:** **SOUTHEAST_ASIAN desplegada** · schema `3.8h.2-f2.6c-0.1`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **9 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, **`WESTERN_EUROPE`** integrada (F2.5c), y desde **F2.6f** familia **`SOUTHEAST_ASIAN`** **live en producción**.

**PRE-F1 cerrado** · prod LATAM legacy. **F2.2c–F2.2d3 cerrados** · DEFAULT neutral. **F2.3b cerrado** · wave 1 LATAM (CO/CL/UY/EC). **F2.5c cerrado** · WE runtime. **F2.6 cerrado** · SEA runtime + prod deploy.

**Producción** (https://kairos-maps-mvp.web.app) — **`SOUTHEAST_ASIAN` live**. Bangkok · Singapur con voz SEA. Schema **`3.8h.2-f2.6c-0.1`**.

**Local `src/`** — **`edcf116`**: SEA registrada · TH/SG migrados · India sigue IBERIAN.

**Smokes gate F2.6f (pre-deploy):** **10/10 PASS**.

**Riesgos vivos:** India/Delhi mis-map pendiente · `dist/` sucio post-deploy · QA UI Singapur opcional · TH/SG comparten familia · vocabulario global en rutas no filtradas.

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
| **F2.5a–F2.5c** | ✅ Runtime | `227a00b` · WE registrada · FR/DE/NL/SE |
| **F2.5c1** | ✅ Doc | `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` |
| **F2.6a–F2.6b** | ✅ Diseño + copy | 14 packs SEA |
| **F2.6c** | ✅ Runtime | `e66bcc7` · SEA registrada · TH/SG migrados |
| **F2.6c1** | ✅ Doc | `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` |
| **F2.6d–F2.6d2** | ✅ Staging + push | `edcf116` en `origin/main` |
| **F2.6f** | ✅ **Prod** | SEA live · gate 10/10 · QA 6/6 + reg 7/7 |
| **F2.6g** | ✅ Doc | `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` |
| **F2.7** | ⏳ Siguiente | **F2.7a — SOUTH_ASIAN Design Audit** |

---

## IV. F2.6 — qué cambió / qué no

### Cambió (prod live)

- **`SOUTHEAST_ASIAN`** en `REGISTERED_FAMILIES` (**9 familias**)
- Migración prod: **`thailand` · `singapore`** → `SOUTHEAST_ASIAN`
- Schema EFR prod: **`3.8h.2-f2.6c-0.1`**
- Bangkok · Singapur lectura premium con voz SEA

### No cambió

- **`DEFAULT_FAMILY`** sigue `GLOBAL_NEUTRAL`
- **`india`** sigue `IBERIAN` (F2.7 SOUTH_ASIAN)
- Catálogo · astro · WASM sin tocar
- **`dist/`** no commiteado en repo

---

## V. Smokes gate actuales

```bash
./scripts/dev-southeast-asian-editorial-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F2.6f (pre-deploy prod):** **10/10 PASS**.

---

## VI. QA producción (F2.6f)

| Bloque | Resultado |
|--------|-----------|
| Bangkok × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Singapur × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Tokio / amor | **PASS** → EAST_ASIAN |
| Seúl / amor | **PASS** → EAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| CDMX / amor | **PASS** → LATAM |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| Delhi / amor | **PASS** → IBERIAN |

---

## VII. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **F2.6c** · SOUTHEAST_ASIAN live · schema `3.8h.2-f2.6c-0.1` |
| **Staging** | https://kairos-maps-dev.web.app | Paridad F2.6c (validado pre-prod) |
| **Local `src/`** | — | **`edcf116`** · SEA integrada |

---

## VIII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.6-2** | **India / Delhi mis-map pendiente** — F2.7 `SOUTH_ASIAN` |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |
| **R-F2.6-UI** | **QA UI completa Singapur opcional** |
| **R-F2.6-4** | TH/SG comparten familia — WATCH QA manual |
| **R-F2.6-5** | Vocabulario global en rutas no filtradas |

---

## IX. Git status (post F2.6g doc)

```
Runtime HEAD / origin/main: edcf116 — f2.6d smoke schema drift hotfix
Doc checkpoint: F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md
src/ · scripts/: limpios
dist/: modificado / untracked (NO commiteado — rsync deploy-prod)
Producción: SOUTHEAST_ASIAN live @ 3.8h.2-f2.6c-0.1
```

---

## X. Siguiente fase

### **F2.7a — SOUTH_ASIAN Design Audit**

Read-only: constitución editorial · ejes · anti-overlap · alcance `india`. Cadena prevista: F2.7b copy · F2.7c runtime · F2.7d staging · F2.7f prod.

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.6 prod SEA |
| `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.6c SEA runtime |
| `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.5c WE runtime |
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | DEFAULT GLOBAL_NEUTRAL |
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | SSOT fallback |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.6g · Doc-only · SOUTHEAST_ASIAN live prod · HEAD @ edcf116*
