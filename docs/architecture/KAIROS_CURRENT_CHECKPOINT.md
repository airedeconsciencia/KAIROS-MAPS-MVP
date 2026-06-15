# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD:** `4ca9675` — `f2.7d1 south asian placeholder hotfix`  
**Checkpoint F2.7:** `docs/architecture/F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md`  
**Producción live:** **SOUTH_ASIAN desplegada** · schema `3.8h.2-f2.7c-0.1`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **10 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, **`WESTERN_EUROPE`** (F2.5c), **`SOUTHEAST_ASIAN`** (F2.6f), y desde **F2.7f** familia **`SOUTH_ASIAN`** **live en producción**.

**PRE-F1 cerrado** · **F2.2c–F2.2d3 cerrados** · **F2.3b cerrado** · **F2.5c cerrado** · **F2.6 cerrado** · **F2.7 cerrado** (runtime + staging + hotfix + prod).

**Producción** (https://kairos-maps-mvp.web.app) — **`SOUTH_ASIAN` live**. Delhi con voz SA. Schema **`3.8h.2-f2.7c-0.1`**. Bangkok · Singapur siguen **`SOUTHEAST_ASIAN`**.

**Smokes gate F2.7f (pre-deploy prod):** **11/11 PASS**.

**Riesgos vivos:** PK/BD/LK/NP → GLOBAL_NEUTRAL · `dist/` sucio post-deploy · cache browser posible · TH/SG comparten familia SEA.

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
| **F2.6d–F2.6d2** | ✅ Staging + push | `edcf116` |
| **F2.6f** | ✅ **Prod** | SEA live · gate 10/10 |
| **F2.6g** | ✅ Doc | `286bcac` · `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` |
| **F2.7a–F2.7b** | ✅ Diseño + copy | Constitución SA · 202 strings |
| **F2.7c** | ✅ Runtime | `adf2caa` · `india` → SOUTH_ASIAN |
| **F2.7c1** | ✅ Doc | `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` |
| **F2.7d–F2.7d2** | ✅ Staging + hotfix | `4ca9675` · placeholder fix · staging validado |
| **F2.7f** | ✅ **Prod** | SA live · gate 11/11 · Delhi 3/3 + reg 8/8 |
| **F2.7g** | ✅ Doc | `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` |
| **F2.8** | ⏳ Siguiente | **Global Coverage Review / Territorial Audit v2** |

---

## IV. F2.7 — qué cambió / qué no

### Cambió (prod live @ F2.7f)

- **`SOUTH_ASIAN`** en `REGISTERED_FAMILIES` (**10 familias**)
- Migración prod: **`india`** → **`SOUTH_ASIAN`**
- Schema EFR prod: **`3.8h.2-f2.7c-0.1`**
- Delhi lectura premium con voz SA (n/k/e = SOUTH_ASIAN · split-brain 0)
- Hotfix F2.7d1: sin placeholder `{ciudad}` visible en transiciones SA

### No cambió

- **`DEFAULT_FAMILY`** sigue `GLOBAL_NEUTRAL`
- **PK / BD / LK / NP** — sin slug canónico → **`GLOBAL_NEUTRAL`**
- **TH / SG** — siguen **`SOUTHEAST_ASIAN`**
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

**Estado F2.7f (pre-deploy prod):** **11/11 PASS**.

---

## VI. QA producción (F2.7f)

| Bloque | Resultado |
|--------|-----------|
| Delhi × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| Singapur / amor | **PASS** → SOUTHEAST_ASIAN |
| Tokio / amor | **PASS** → EAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| CDMX / amor | **PASS** → LATAM |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| UI Delhi / amor | **PASS** — premium · eyebrow · sin clásica |

---

## VII. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **F2.7c** · SOUTH_ASIAN live · schema `3.8h.2-f2.7c-0.1` |
| **Staging** | https://kairos-maps-dev.web.app | Paridad F2.7c + hotfix F2.7d1 |
| **Local `src/`** | — | **`4ca9675`** · SA integrada |

---

## VIII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.7-3** | **PK / BD / LK / NP** — sin slug canónico → **`GLOBAL_NEUTRAL`** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |
| **R-F2.7f-2** | **Cache browser** — hard refresh en QA manual |
| **R-F2.6-4** | TH/SG comparten familia SEA — WATCH QA manual |
| **R-F2.6-5** | Vocabulario global en rutas no filtradas |

---

## IX. Git status (post F2.7g doc)

```
HEAD / origin/main: 4ca9675 — f2.7d1 south asian placeholder hotfix
Doc checkpoint: F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md (+ F2.7g commit pending)
src/ · scripts/: limpios @ 4ca9675
dist/: modificado / untracked (NO commiteado — rsync deploy-prod)
Producción: SOUTH_ASIAN live @ 3.8h.2-f2.7c-0.1 · Delhi SOUTH_ASIAN
```

---

## X. Siguiente fase

### **F2.8 — Global Coverage Review / Territorial Audit v2**

Auditoría read-only de cobertura territorial · gaps subcontinente · priorización editorial · alineación catálogo vs mapa canónico.

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.7 prod SA |
| `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.7c SA runtime |
| `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.6 prod SEA |
| `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.6c SEA runtime |
| `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.5c WE runtime |
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | DEFAULT GLOBAL_NEUTRAL |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.7g · Doc-only · SOUTH_ASIAN live prod @ 4ca9675 · Schema 3.8h.2-f2.7c-0.1*
