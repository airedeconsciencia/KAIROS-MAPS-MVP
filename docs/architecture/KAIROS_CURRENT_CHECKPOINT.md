# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main`** (post F2.9c)  
**HEAD:** *(F2.9c commit)* — `f2.9c latam catalog expansion wave a`  
**Checkpoint catálogo:** `docs/architecture/F2.9C_LATAM_CATALOG_WAVE_A_CHECKPOINT.md`  
**Producción live:** **SOUTH_ASIAN** · schema EFR `3.8h.2-f2.7c-0.1` · **catálogo prod legacy 27 ciudades**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **10 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, familias regionales integradas (WE · SEA · SA), y desde **F2.9c** **catálogo SSOT ampliado** a **31 ciudades / 30 países visibles**.

**PRE-F1 cerrado** · **F2.2–F2.7 cerrados** (runtime + prod SA) · **F2.8 auditorías territoriales cerradas** (read-only) · **F2.9c cerrado** (catálogo Wave A LATAM).

**Local `src/`** — catálogo **`3.8f.1-f2.9c-0.1`**: Bogotá · Santiago · Montevideo · Quito → **LATAM**. Gap resolver↔catálogo = **0**.

**Producción** (https://kairos-maps-mvp.web.app) — editorial **F2.7c** live · catálogo mapa **aún 27 ciudades** hasta deploy F2.9d+.

**Smokes gate catálogo F2.9c:** `dev-cities-catalog-smoke.sh` + `dev-editorial-family-resolver-smoke.sh` — **ALL PASS**.

**Riesgos vivos:** prod/staging sin catálogo 31 · PK/BD/LK/NP → GN · `dist/` sucio · 8 ciudades LATAM misma voz.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit |
|------|--------|--------|
| PRE-F1.3 → PRE-F1.9d | ✅ Cerrado | `a8d4a60` → `a25e2c7` |

Ver `KAIROS_MASTER_HANDOFF_F1.8.md`.

---

## III. Serie F2 — en curso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F2.0–F2.7g** | ✅ Cerrado | SA prod @ `70a255b` doc · runtime @ `4ca9675` |
| **F2.8a** | ✅ Audit | Global Coverage Review v2 (read-only) |
| **F2.9a–F2.9b** | ✅ Audit | Catalog coverage + expansion ROI (read-only) |
| **F2.9c** | ✅ **Catálogo** | +4 ciudades LATAM · 31/30 · gap = 0 |
| **F2.9c1** | ✅ Doc | `F2.9C_LATAM_CATALOG_WAVE_A_CHECKPOINT.md` |
| **F2.9d** | ⏳ Siguiente | **Staging deploy + browser QA Wave A** |

---

## IV. F2.9c — qué cambió / qué no

### Cambió (catálogo local)

- **+4 ciudades:** Bogotá · Santiago · Montevideo · Quito
- **+4 países visibles:** Colombia · Chile · Uruguay · Ecuador
- **`EXPECTED_CITY_COUNT`:** 27 → **31**
- **`EXPECTED_COUNTRY_COUNT`:** 26 → **30**
- **`SCHEMA_VERSION` catálogo:** `3.8f.1-f2.9c-0.1`
- **Gap resolver↔catálogo:** 4 → **0**

### No cambió

- **`COUNTRY_EDITORIAL_FAMILY`** — 30 países · mismas familias
- **`REGISTERED_FAMILIES`** — 10 familias
- **Resolver schema** — `3.8h.2-f2.7c-0.1`
- **Copy / packs / country-archetypes / premium runtime**
- **Producción live** — sin deploy F2.9c

---

## V. Catálogo SSOT (post F2.9c)

| Métrica | Valor |
|---------|-------|
| Ciudades | **31** |
| Países visibles | **30** |
| Países resolver sin ciudad | **0** |
| Ciudades LATAM en catálogo | **8** (MX · AR · BR · PE · CO · CL · UY · EC) |
| Familia Wave A | **LATAM** (hereda packs F2.3) |

---

## VI. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F2.9c:** catalog + resolver smokes **ALL PASS**.

---

## VII. QA local F2.9c (familias)

| Ciudad | Familia | Resultado |
|--------|---------|-----------|
| Bogotá | LATAM | PASS |
| Santiago | LATAM | PASS |
| Montevideo | LATAM | PASS |
| Quito | LATAM | PASS |
| Ciudad de México | LATAM | PASS |
| Buenos Aires | LATAM | PASS |
| Lisboa | IBERIAN | PASS |
| Delhi | SOUTH_ASIAN | PASS |
| Bangkok | SOUTHEAST_ASIAN | PASS |
| París | WESTERN_EUROPE | PASS |
| Oslo | GLOBAL_NEUTRAL | PASS |

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **27 ciudades** (legacy) | F2.7c SA live |
| **Staging** | https://kairos-maps-dev.web.app | **27 ciudades** (legacy) | F2.7c + hotfix |
| **Local `src/`** | — | **31 ciudades** @ F2.9c | Sin cambio resolver |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.9c-1** | **Prod/staging sin catálogo 31** — requiere deploy F2.9d+ |
| **R-F2.7-3** | **PK / BD / LK / NP** → **`GLOBAL_NEUTRAL`** |
| **R-F2.9c-3** | **8 ciudades LATAM / misma voz editorial** |
| **OP-3** | **`dist/` sucio** · no commiteado |
| **R-F2.7f-2** | **Cache browser** en QA manual |

---

## X. Git status (post F2.9c1)

```
Runtime F2.9c: cities-catalog.js + smokes (commit pending → f2.9c)
Doc F2.9c1: F2.9C checkpoint + KAIROS_CURRENT (commit pending)
origin/main: 70a255b — f2.7g south asian production checkpoint
dist/: modificado / untracked (NO commiteado)
Producción editorial: SOUTH_ASIAN @ 3.8h.2-f2.7c-0.1
Producción catálogo: 27 ciudades hasta deploy
```

---

## XI. Siguiente fase

### **F2.9d — Staging deploy + browser QA Wave A**

Build · deploy staging · QA 4 capitales LATAM × 3 goals · regresiones · gate prod (F2.9f).

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.9C_LATAM_CATALOG_WAVE_A_CHECKPOINT.md` | Cierre F2.9c catálogo |
| `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.7 prod SA |
| `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad SA runtime |
| `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.6 prod SEA |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.9c1 · Catálogo 31/30 · gap resolver = 0 · prod catálogo legacy 27*
