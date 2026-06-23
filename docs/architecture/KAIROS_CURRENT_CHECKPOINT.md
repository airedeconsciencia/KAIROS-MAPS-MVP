# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.11n doc checkpoint (post Wave C Batch 2 prod)  
**Checkpoint F3.11:** `docs/architecture/F3.11N_WEST_AFRICAN_WAVE_C_BATCH_2_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.11 Batch 1:** `docs/architecture/F3.11G_WEST_AFRICAN_WAVE_C_BATCH_1_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.10j:** `docs/architecture/F3.10J_C_SAO_PAULO_GATE_DECISION.md`  
**Checkpoint F3.10:** `docs/architecture/F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.9:** `docs/architecture/F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.11j-0.1`** · **53 ciudades / 50 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias** · **WA 10/10**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`53 ciudades / 50 países`** con **WA Wave C completa** (**10/10 anclas**) además de **Densification Wave A**, **WA Wave B/A**, **LATAM+**, **SA+** y **SEA+**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3–F3.11 series cerradas en producción** · **F3.10 São Paulo gate cerrado (NO catálogo)** · **F3.11 Wave C completa en prod** (Batch 1 + Batch 2).

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.11j-0.1`** · **53/50** live · **WA 10/10**.

**São Paulo:** **NO catálogo** · runtime j-a/b aparcado en rama `f3.10j-urban-layer` (sin merge a main).

**Riesgos vivos:** homogeneización WA 10/10 · proximidad Lagos/Accra/Dakar · Mumbai sin archetype · Madrid/Barcelona · Delhi/Mumbai · `dist/` sucio · cache browser post-deploy.

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
| **F3.11a–F3.11n** | ✅ Cerrado | WA Wave C completa prod **53/50** · **10/10** |
| **F3.12a** | ⏳ Siguiente | **Global Coverage Audit** |

---

## V. F3.11 — qué cambió en prod

### Wave C Batch 1 (F3.11f)

- **47→50 ciudades** · **44→47 países** · WA **4/10→7/10**
- Freetown · Monrovia · Conakry

### Wave C Batch 2 (F3.11m)

- **50→53 ciudades** · **47→50 países** · WA **7/10→10/10**
- Cotonou · Lomé · Banjul
- **Schema:** `3.8f.1-f3.11c-0.1` → **`3.8f.1-f3.11j-0.1`**

### No cambió

- **Resolver** — **50 países** · `3.8h.2-f3.8b-0.1`
- **Familias** — **11**
- **Copy / packs / narrative** — sin cambio
- **São Paulo** — no añadido

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live |
|---------|-----------|
| Familias editoriales | **11** |
| Países resolver | **50** |
| Ciudades catálogo | **53** |
| Países catálogo visibles | **50** |
| WA anclas catálogo | **10/10** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.11j-0.1`** |

**WA anclas (10/10):** Lagos · Accra · Dakar · Abidjan · Freetown · Monrovia · Conakry · Cotonou · Lomé · Banjul

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
```

**Gate F3.11m pre-deploy:** **6/6 PASS** · QA prod **19/19 PASS**

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **53** @ `3.8f.1-f3.11j-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **53** @ `3.8f.1-f3.11j-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.11n-1** | **Homogeneización WA 10/10** — pack compartido |
| **R-F3.11n-2** | **Proximidad Lagos/Accra/Dakar** — lecturas vecinas similares |
| **R-F3.11n-3** | **Cache browser** — hard refresh post-deploy |
| **R-F3.11n-4** | **`dist/` sucio local** — no commiteado |
| **R-F3.10j-c-1** | **São Paulo NO catálogo** · j-a/b en rama experimental |
| **R-F3.10g-1** | **Madrid/Barcelona misma familia** |
| **R-F3.10g-2** | **Delhi/Mumbai misma familia** |

---

## X. Git status (post F3.11n)

```
HEAD local: F3.11n — f3.11n west african wave c batch 2 production checkpoint
Rama: main
src/: limpio (committed @ 1e39508)
docs/: F3.11N + KAIROS_CURRENT actualizado
dist/: modificado / untracked (NO commiteado)
Producción runtime: 53/50 @ 3.8f.1-f3.11j-0.1
```

---

## XI. Siguiente fase

### **F3.12a — Global Coverage Audit**

Auditoría READ-ONLY post-WA 10/10: gaps globales · densificación · ROI próximas waves.

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.11N_WEST_AFRICAN_WAVE_C_BATCH_2_PRODUCTION_CHECKPOINT.md` | Cierre F3.11 prod Batch 2 |
| `F3.11J_WEST_AFRICAN_WAVE_C_BATCH_2_CHECKPOINT.md` | Cierre F3.11j `src/` |
| `F3.11G_WEST_AFRICAN_WAVE_C_BATCH_1_PRODUCTION_CHECKPOINT.md` | Batch 1 prod |
| `F3.10J_C_SAO_PAULO_GATE_DECISION.md` | Decisión gate São Paulo |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.11n · Prod 53/50 @ f3.11j · WA 10/10 · Siguiente F3.12a global coverage audit*
