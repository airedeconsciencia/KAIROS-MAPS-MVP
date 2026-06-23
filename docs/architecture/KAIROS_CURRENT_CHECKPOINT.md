# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.11j1 doc checkpoint (post Wave C Batch 2 `src/`)  
**Checkpoint F3.11:** `docs/architecture/F3.11J_WEST_AFRICAN_WAVE_C_BATCH_2_CHECKPOINT.md`  
**Checkpoint F3.11 prod:** `docs/architecture/F3.11G_WEST_AFRICAN_WAVE_C_BATCH_1_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.10j:** `docs/architecture/F3.10J_C_SAO_PAULO_GATE_DECISION.md`  
**Checkpoint F3.10:** `docs/architecture/F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.9:** `docs/architecture/F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.11c-0.1`** · **50 ciudades / 47 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo local **`53 ciudades / 50 países`** con **WA Wave C completa** (10/10 anclas) además de **Densification Wave A**, **WA Wave B/A**, **LATAM+**, **SA+** y **SEA+**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3–F3.11g series cerradas en producción** · **F3.10 São Paulo gate cerrado (NO catálogo)** · **F3.11a–F3.11j1 WA Wave C Batch 2 cerrado en `src/`** (sin deploy).

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.11c-0.1`** · **50/47** live.

**Local `src/` committed:** catálogo **`3.8f.1-f3.11j-0.1`** · **53/50** · WA anclas **10/10**.

**São Paulo:** **NO catálogo** · runtime j-a/b aparcado en rama `f3.10j-urban-layer` (sin merge a main).

**Riesgos vivos:** homogeneización WA (10/10) · proximidad Lagos/Accra/Dakar · Mumbai sin archetype · Madrid/Barcelona · Delhi/Mumbai · `dist/` sucio · prod desincronizado hasta F3.11k.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit |
|------|--------|--------|
| PRE-F1.3 → PRE-F1.9d | ✅ Cerrado | `a8d4a60` → `a25e2c7` |

Ver `KAIROS_MASTER_HANDOFF_F1.8.md`.

---

## III. Serie F2 — cerrada

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F2.0–F2.7g** | ✅ Cerrado | SA prod @ `4ca9675` |
| **F2.8a–F2.9b** | ✅ Audit | Coverage + expansion ROI |
| **F2.9c–F2.9g** | ✅ Catálogo prod | 31/30 live |

---

## IV. Serie F3 — progreso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a–F3.3g** | ✅ Cerrado | Editorial WA prod @ `479693a` |
| **F3.4a–F3.4f** | ✅ Cerrado | Catálogo WA Wave A prod 34/33 |
| **F3.5a–F3.5b** | ✅ Audit | Coverage gap · SEA+ first |
| **F3.6a–F3.6g** | ✅ Cerrado | SEA+ prod 38/37 |
| **F3.7a–F3.7g** | ✅ Cerrado | SA+ prod 48/42/41 |
| **F3.8a–F3.8g** | ✅ Cerrado | LATAM+ prod 50/44/43 |
| **F3.9a–F3.9g** | ✅ Cerrado | WA Wave B prod 45/44 |
| **F3.10a–F3.10j-c1** | ✅ Cerrado | Densification Wave A prod 47/44 · São Paulo NO catálogo |
| **F3.11a–F3.11g** | ✅ Cerrado | WA Wave C Batch 1 prod **50/47** |
| **F3.11h–F3.11j1** | ✅ Cerrado | WA Wave C Batch 2 · 53/50 `src/` · WA **10/10** |
| **F3.11k** | ⏳ Siguiente | **Staging deploy + browser QA Wave C Batch 2** |

---

## V. F3.11 — qué cambió en `src/` (sin deploy)

### Cambió (local @ F3.11j)

- **Schema catálogo:** `3.8f.1-f3.11c-0.1` → **`3.8f.1-f3.11j-0.1`**
- **Ciudades catálogo:** 50 → **53** (+ Cotonou · Lomé · Banjul)
- **Países visibles:** 47 → **50**
- **WA anclas catálogo:** 7/10 → **10/10**

### No cambió

- **Resolver** — **50 países** · `3.8h.2-f3.8b-0.1`
- **Familias** — **11**
- **Copy / packs / narrative** — sin cambio
- **São Paulo** — no añadido

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Local `src/` committed |
|---------|-----------|------------------------|
| Familias editoriales | **11** | **11** |
| Países resolver | **50** | **50** |
| Ciudades catálogo | **50** | **53** |
| Países catálogo visibles | **47** | **50** |
| WA anclas catálogo | **7/10** | **10/10** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.11c-0.1`** | **`3.8f.1-f3.11j-0.1`** |

**WA anclas (10/10):** Lagos · Accra · Dakar · Abidjan · Freetown · Monrovia · Conakry · Cotonou · Lomé · Banjul

---

## VII. Smokes gate actuales (`src/` post-F3.11j1)

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
```

**Gate F3.11j1:** **6/6 PASS** · Batch 2 QA **9/9 PASS** · regresiones **7/7 PASS**

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **50** @ `3.8f.1-f3.11c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **50** @ `3.8f.1-f3.11c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Local `src/`** | — | **53** @ `3.8f.1-f3.11j-0.1` | sin deploy |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.11j-1** | **Homogeneización WA** — 10/10 anclas comparten pack |
| **R-F3.11j-2** | **Proximidad Lagos/Accra/Dakar** — lecturas similares entre vecinos |
| **R-F3.11j-3** | **Sin country archetype** — benin · togo · gambia |
| **R-F3.11j-4** | **Prod desincronizado** — live 50/47 hasta F3.11k |
| **R-F3.10j-c-1** | **São Paulo NO catálogo** · j-a/b en rama experimental |
| **R-F3.10g-1** | **Madrid/Barcelona misma familia** |
| **R-F3.10g-2** | **Delhi/Mumbai misma familia** |
| **R-F3.10g-6** | **`dist/` sucio local** · no commiteado |

---

## X. Git status (post F3.11j1)

```
HEAD local: F3.11j1 — f3.11j west african wave c batch 2 checkpoint
Rama: main
src/: catálogo 53/50 committed
docs/: F3.11J + KAIROS_CURRENT actualizado
dist/: modificado / untracked (NO commiteado)
Producción runtime: 50/47 @ f3.11c
```

---

## XI. Siguiente fase

### **F3.11k — Staging deploy + browser QA Wave C Batch 2**

QA Cotonou · Lomé · Banjul × 3 goals · regresiones · **53 markers** UI.

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.11J_WEST_AFRICAN_WAVE_C_BATCH_2_CHECKPOINT.md` | Cierre F3.11j Wave C Batch 2 |
| `F3.11G_WEST_AFRICAN_WAVE_C_BATCH_1_PRODUCTION_CHECKPOINT.md` | Cierre F3.11 prod Batch 1 |
| `F3.11D_WEST_AFRICAN_WAVE_C_BATCH_1_CHECKPOINT.md` | Cierre F3.11 Batch 1 `src/` |
| `F3.10J_C_SAO_PAULO_GATE_DECISION.md` | Decisión gate São Paulo |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.11j1 · Local src 53/50 @ f3.11j · Prod 50/47 · WA 10/10 · Siguiente F3.11k staging deploy*
