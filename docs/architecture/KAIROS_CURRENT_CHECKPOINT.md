# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.11d doc checkpoint (post Wave C Batch 1)  
**Checkpoint F3.11:** `docs/architecture/F3.11D_WEST_AFRICAN_WAVE_C_BATCH_1_CHECKPOINT.md`  
**Checkpoint F3.10j:** `docs/architecture/F3.10J_C_SAO_PAULO_GATE_DECISION.md`  
**Checkpoint F3.10:** `docs/architecture/F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.9:** `docs/architecture/F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.10b-0.1`** · **47 ciudades / 44 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo local **`50 ciudades / 47 países`** con **WA Wave C Batch 1** (Freetown · Monrovia · Conakry) además de **Densification Wave A** (Barcelona · Mumbai), **WA Wave B** (Abidjan), **WA Wave A**, **LATAM+ Wave A**, **SA+ Wave A** y **SEA+ Wave A**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3–F3.10 series cerradas en producción** · **F3.10 São Paulo gate cerrado (NO catálogo)** · **F3.11a–F3.11d WA Wave C Batch 1 cerrado en `src/`** (sin deploy).

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.10b-0.1`** · **47/44** live.

**Local `src/` committed:** catálogo **`3.8f.1-f3.11c-0.1`** · **50/47** · WA anclas **7/10**.

**São Paulo:** **NO catálogo** · runtime j-a/b aparcado en rama `f3.10j-urban-layer` (sin merge a main).

**Riesgos vivos:** homogeneización WA · 3 países WA sin ancla · Mumbai sin archetype · Madrid/Barcelona · Delhi/Mumbai · `dist/` sucio · prod desincronizado hasta F3.11e.

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
| **F3.11a–F3.11d** | ✅ Cerrado | WA Wave C Batch 1 · 50/47 `src/` |
| **F3.11e** | ⏳ Siguiente | **Staging deploy + browser QA Wave C Batch 1** |

---

## V. F3.11 — qué cambió en `src/` (sin deploy)

### Cambió (local @ F3.11c)

- **Schema catálogo:** `3.8f.1-f3.10b-0.1` → **`3.8f.1-f3.11c-0.1`**
- **Ciudades catálogo:** 47 → **50** (+ Freetown · Monrovia · Conakry)
- **Países visibles:** 44 → **47**
- **WA anclas catálogo:** 4/10 → **7/10**

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
| Ciudades catálogo | **47** | **50** |
| Países catálogo visibles | **44** | **47** |
| WA anclas catálogo | **4/10** | **7/10** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.10b-0.1`** | **`3.8f.1-f3.11c-0.1`** |

---

## VII. Smokes gate actuales (`src/` post-F3.11d)

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
```

**Gate F3.11d:** **6/6 PASS** · Batch 1 QA **9/9 PASS** · regresiones **7/7 PASS**

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Local `src/`** | — | **50** @ `3.8f.1-f3.11c-0.1` | sin deploy |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.11d-1** | **3 países WA sin ancla** — benin · togo · gambia |
| **R-F3.11d-2** | **Homogeneización WA** — 7 anclas comparten pack |
| **R-F3.11d-3** | **Sin country archetype** — sierra_leone · liberia · guinea |
| **R-F3.11d-4** | **Prod desincronizado** — live 47/44 hasta F3.11e |
| **R-F3.10j-c-1** | **São Paulo NO catálogo** · j-a/b en rama experimental |
| **R-F3.10g-1** | **Madrid/Barcelona misma familia** |
| **R-F3.10g-2** | **Delhi/Mumbai misma familia** |
| **R-F3.10g-6** | **`dist/` sucio local** · no commiteado |

---

## X. Git status (post F3.11d)

```
HEAD local: F3.11d — f3.11d west african wave c batch 1 checkpoint
Rama: main
src/: catálogo 50/47 committed
docs/: F3.11D + KAIROS_CURRENT actualizado
dist/: modificado / untracked (NO commiteado)
Producción runtime: 47/44 @ e817e66 doc baseline
```

---

## XI. Siguiente fase

### **F3.11e — Staging deploy + browser QA Wave C Batch 1**

QA Freetown · Monrovia · Conakry × 3 goals · regresiones · **50 markers** UI.

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.11D_WEST_AFRICAN_WAVE_C_BATCH_1_CHECKPOINT.md` | Cierre F3.11 Wave C Batch 1 |
| `F3.10J_C_SAO_PAULO_GATE_DECISION.md` | Decisión gate São Paulo |
| `F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md` | Cierre F3.10 prod |
| `F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md` | Cierre F3.9 prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.11d · Local src 50/47 @ f3.11c · Prod 47/44 · Siguiente F3.11e staging deploy*
