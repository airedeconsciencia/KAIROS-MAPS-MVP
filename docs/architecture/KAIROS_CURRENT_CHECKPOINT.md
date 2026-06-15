# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD:** `23c52a4` — `f2.9c1 latam catalog wave a checkpoint`  
**Checkpoint F2.9:** `docs/architecture/F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f2.9c-0.1`** · **31 ciudades / 30 países** · editorial EFR **`3.8h.2-f2.7c-0.1`**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **10 familias**), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, familias regionales live (LATAM · WE · SEA · SA · …), y desde **F2.9f** **catálogo 31 ciudades / 30 países visibles en producción**.

**PRE-F1 cerrado** · **F2.2–F2.7 cerrados** · **F2.8–F2.9b auditorías cerradas** · **F2.9 serie cerrada** (catálogo + staging + prod).

**Producción** (https://kairos-maps-mvp.web.app) — catálogo Wave A live: Bogotá · Santiago · Montevideo · Quito. Gap resolver↔catálogo = **0**. Editorial sin cambio F2.9.

**Smokes gate F2.9f (pre-deploy prod):** **5/5 PASS** · post-deploy catalog smoke **PASS**.

**Riesgos vivos:** cache browser · `dist/` sucio · QA prod parcial SCL/MVD/UIO · PK/BD/LK/NP → GN · 8 ciudades LATAM misma voz.

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
| **F2.0–F2.7g** | ✅ Cerrado | SA prod editorial @ `4ca9675` · doc `70a255b` |
| **F2.8a** | ✅ Audit | Global Coverage Review v2 |
| **F2.9a–F2.9b** | ✅ Audit | Catalog coverage + expansion ROI |
| **F2.9c** | ✅ Catálogo | `fe629f3` · 31/30 · gap = 0 |
| **F2.9c1–F2.9c2** | ✅ Doc + push | `23c52a4` |
| **F2.9d** | ✅ Staging | QA 12/12 Wave A + reg 7/7 |
| **F2.9f** | ✅ **Prod** | Catálogo 31 live · Bogotá ×3 + reg 6/6 |
| **F2.9g** | ✅ Doc | `F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md` |
| **F3.0** | ⏳ Siguiente | **Roadmap decision / next expansion audit** |

---

## IV. F2.9 — qué cambió / qué no

### Cambió (prod live @ F2.9f)

- **Catálogo:** 27 → **31 ciudades** · 26 → **30 países visibles**
- **+4 ciudades:** Bogotá · Santiago · Montevideo · Quito → **LATAM**
- **Schema catálogo prod:** `3.8f.1-f2.9c-0.1`
- **Gap resolver↔catálogo:** **0** (30/30 países mapeados con ciudad catálogo)
- **Mapa / búsqueda local / scorer:** 31 lugares

### No cambió

- **`COUNTRY_EDITORIAL_FAMILY`** · **`REGISTERED_FAMILIAS`** — 30 países · 10 familias
- **Resolver schema** — `3.8h.2-f2.7c-0.1`
- **Copy / packs / country-archetypes / premium compositor**
- **Familias editoriales live** (SA · SEA · WE · …)

---

## V. Catálogo SSOT (prod live)

| Métrica | Valor |
|---------|-------|
| Ciudades | **31** |
| Países visibles | **30** |
| Países resolver sin ciudad | **0** |
| Ciudades LATAM | **8** |
| Schema | `3.8f.1-f2.9c-0.1` |

---

## VI. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F2.9f:** **ALL PASS** (gate pre-deploy prod).

---

## VII. QA producción (F2.9f)

| Bloque | Resultado |
|--------|-----------|
| Bogotá × amor · trabajo · descanso | **PASS** → LATAM |
| CDMX / amor | **PASS** → LATAM |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| UI catálogo | **31 ciudades · 31 markers** |

**Staging baseline F2.9d:** Santiago · Montevideo · Quito × 3 goals — **12/12 PASS** (no re-leídos en prod F2.9f).

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **31** @ `3.8f.1-f2.9c-0.1` | `3.8h.2-f2.7c-0.1` |
| **Staging** | https://kairos-maps-dev.web.app | **31** (paridad F2.9d) | Sin cambio F2.9 |
| **Local `src/`** | — | **31** @ `23c52a4` | Sin cambio resolver |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.9f-1** | **Cache browser** — catálogo legacy 27 si bundle cacheado |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |
| **R-F2.9f-3** | **QA prod parcial** SCL/MVD/UIO — baseline F2.9d |
| **R-F2.7-3** | **PK / BD / LK / NP** → **`GLOBAL_NEUTRAL`** |
| **R-F2.9c-3** | **8 ciudades LATAM / misma voz** |

---

## X. Git status (post F2.9g doc)

```
HEAD / origin/main: 23c52a4 — f2.9c1 latam catalog wave a checkpoint
Runtime catálogo: fe629f3 — f2.9c latam catalog expansion wave a
Doc checkpoint: F2.9G (+ F2.9g commit pending)
src/ · scripts/: limpios @ 23c52a4
dist/: modificado / untracked (NO commiteado — rsync deploy-prod)
Producción catálogo: 31/30 live @ 3.8f.1-f2.9c-0.1
```

---

## XI. Siguiente fase

### **F3.0 — Roadmap decision / next expansion audit**

Decisión Wave B catálogo · priorización territorial · alineación F2.8/F2.9 audits.

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md` | Cierre F2.9 prod catálogo |
| `F2.9C_LATAM_CATALOG_WAVE_A_CHECKPOINT.md` | Trazabilidad F2.9c catálogo |
| `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.7 prod editorial |
| `F2.6G_SOUTHEAST_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.6 prod SEA |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.9g · Doc-only · Catálogo live prod 31/30 @ 23c52a4 · Schema 3.8f.1-f2.9c-0.1*
