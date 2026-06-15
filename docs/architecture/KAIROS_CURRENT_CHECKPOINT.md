# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main`**  
**HEAD:** `adf2caa` — `f2.7c south asian runtime integration`  
**Checkpoint F2.7:** `docs/architecture/F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md`  
**Producción live:** **SOUTHEAST_ASIAN desplegada** · schema `3.8h.2-f2.6c-0.1` · **sin SOUTH_ASIAN**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **10 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, **`WESTERN_EUROPE`** integrada (F2.5c), **`SOUTHEAST_ASIAN`** live en producción (F2.6f), y desde **F2.7c** familia **`SOUTH_ASIAN`** **integrada en runtime local**.

**PRE-F1 cerrado** · prod LATAM legacy. **F2.2c–F2.2d3 cerrados** · DEFAULT neutral. **F2.3b cerrado** · wave 1 LATAM. **F2.5c cerrado** · WE runtime. **F2.6 cerrado** · SEA runtime + prod deploy. **F2.7c cerrado** · SA runtime local.

**Producción** (https://kairos-maps-mvp.web.app) — **`SOUTHEAST_ASIAN` live**. Bangkok · Singapur con voz SEA. Schema **`3.8h.2-f2.6c-0.1`**. **Delhi sigue IBERIAN en prod** hasta F2.7d+.

**Local `src/`** — **`adf2caa`**: SA registrada · `india` → `SOUTH_ASIAN` · Delhi activa voz SA · schema **`3.8h.2-f2.7c-0.1`**.

**Smokes gate F2.7c:** **8/8 PASS**.

**Riesgos vivos:** producción sin SOUTH_ASIAN · `dist/` sucio · expansión subcontinente PK/BD/LK/NP pendiente · TH/SG comparten familia SEA.

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
| **F2.6g** | ✅ Doc | `286bcac` · `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` |
| **F2.7a** | ✅ Diseño | Constitución SA · alcance `india` |
| **F2.7b** | ✅ Copy | 14 packs SA · 202 strings |
| **F2.7c** | ✅ Runtime | `adf2caa` · SA registrada · `india` migrado |
| **F2.7c1** | ✅ Doc | `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` |
| **F2.7d** | ⏳ Siguiente | **Staging deploy + browser QA SOUTH_ASIAN** |

---

## IV. F2.7 — qué cambió / qué no

### Cambió (runtime local @ `adf2caa`)

- **`SOUTH_ASIAN`** en `REGISTERED_FAMILIES` (**10 familias**)
- Migración runtime: **`india`** → **`SOUTH_ASIAN`**
- Schema EFR local: **`3.8h.2-f2.7c-0.1`**
- Delhi lectura premium con voz SA (n/k/e = SOUTH_ASIAN · split-brain 0)

### No cambió

- **`DEFAULT_FAMILY`** sigue `GLOBAL_NEUTRAL`
- **PK / BD / LK / NP** — sin slug canónico → **`GLOBAL_NEUTRAL`**
- **Producción** — sigue F2.6c SEA · Delhi IBERIAN en live
- Catálogo · astro · WASM sin tocar
- **`dist/`** no commiteado en repo

---

## V. Smokes gate actuales

```bash
./scripts/dev-south-asian-editorial-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
```

**Estado F2.7c:** **8/8 PASS** (gate SA + regresiones transversales).

---

## VI. QA runtime local (F2.7c)

| Bloque | Resultado |
|--------|-----------|
| Delhi × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Tokio / amor | **PASS** → EAST_ASIAN |
| Seúl / amor | **PASS** → EAST_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| Singapur / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| CDMX / amor | **PASS** → LATAM |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |

**Diferenciación:** Delhi amor ≠ Bangkok · París · Oslo (texto · conflicto · región) — **PASS**.

---

## VII. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **F2.6c** · SOUTHEAST_ASIAN live · schema `3.8h.2-f2.6c-0.1` · **sin SA** |
| **Staging** | https://kairos-maps-dev.web.app | Paridad F2.6c (sin SA hasta F2.7d) |
| **Local `src/`** | — | **`adf2caa`** · SA integrada · schema `3.8h.2-f2.7c-0.1` |

---

## VIII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.7-1** | **Producción sin SOUTH_ASIAN** — live no refleja `adf2caa` |
| **R-F2.7-2** | **`dist/` desincronizado** vs `src/` F2.7c |
| **R-F2.7-3** | **Expansión subcontinente pendiente** — PK/BD/LK/NP → GLOBAL_NEUTRAL |
| **R-F2.6-4** | TH/SG comparten familia SEA — WATCH QA manual |
| **R-F2.6-5** | Vocabulario global en rutas no filtradas |

---

## IX. Git status (post F2.7c1 doc)

```
Runtime HEAD: adf2caa — f2.7c south asian runtime integration
Doc checkpoint: F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md
origin/main: 286bcac — f2.6g southeast asian production checkpoint
src/ · scripts/: limpios @ adf2caa (+ doc commit pending)
dist/: modificado / untracked (NO commiteado — rsync deploy-prod)
Producción: SOUTHEAST_ASIAN live @ 3.8h.2-f2.6c-0.1 · Delhi IBERIAN en prod
```

---

## X. Siguiente fase

### **F2.7d — Staging deploy + browser QA SOUTH_ASIAN**

1. Build `dist/` desde `src/` @ `adf2caa`
2. Deploy staging
3. Browser QA Delhi × 3 goals + regresiones completas
4. Gate explícito antes de prod (F2.7f)

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` | Cierre F2.7c SA runtime |
| `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.6 prod SEA |
| `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.6c SEA runtime |
| `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.5c WE runtime |
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | DEFAULT GLOBAL_NEUTRAL |
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | SSOT fallback |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.7c1 · Doc-only · SOUTHEAST_ASIAN live prod · SA runtime local @ adf2caa*
