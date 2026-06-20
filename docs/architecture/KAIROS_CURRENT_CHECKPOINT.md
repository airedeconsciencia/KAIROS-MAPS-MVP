# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.10g doc checkpoint (post F3.10f prod deploy)  
**Checkpoint F3.10:** `docs/architecture/F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.9:** `docs/architecture/F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.8:** `docs/architecture/F3.8G_LATAM_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.10b-0.1`** · **47 ciudades / 44 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`47 ciudades / 44 países`** con **Densification Wave A** (Barcelona · Mumbai) además de **WA Wave B** (Abidjan), **WA Wave A**, **LATAM+ Wave A**, **SA+ Wave A** y **SEA+ Wave A**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA Wave A cerrado** · **F3.6 SEA+ serie cerrada en producción** · **F3.7 SA+ serie cerrada en producción** · **F3.8 LATAM+ serie cerrada en producción** · **F3.9 WA Wave B serie cerrada en producción** · **F3.10 Densification Wave A serie cerrada en producción**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.10b-0.1`** · **47/44** live.

**Smokes gate F3.10f:** **7/7 PASS** (pre-deploy prod).

**QA prod F3.10f:** catálogo **47/44 PASS** · búsqueda Barcelona/Mumbai **2/2 PASS** · premium **6/6 PASS** · diferenciación **2/2 PASS** · regresiones **6/6 PASS** · browser QA **21/21 PASS**.

**Riesgos vivos:** homogeneización LATAM · homogeneización SA · homogeneización SEA · homogeneización WA · Madrid/Barcelona misma familia · Delhi/Mumbai misma familia · Mumbai sin country archetype · São Paulo pendiente · cache browser · **6 países WA sin ancla** · `dist/` sucio.

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
| **F3.10a–F3.10g** | ✅ Cerrado | Densification Wave A prod 47/44 |
| **F3.10h** | ⏳ Siguiente | **São Paulo Wave B Decision Gate** |

---

## V. F3.10 — qué cambió en producción

### Cambió (prod live @ F3.10f)

- **Schema catálogo:** `3.8f.1-f3.9b-0.1` → **`3.8f.1-f3.10b-0.1`**
- **Ciudades catálogo:** 45 → **47** (+ Barcelona · Mumbai)
- **Países visibles:** **44** (sin cambio)
- **Ciudades SA en catálogo:** 5 → **6** (+ Mumbai)
- **Split-brain casos smoke:** 36 → **38**

### No cambió

- **Resolver** — **50 países** · `3.8h.2-f3.8b-0.1`
- **Familias** — **11**
- **Copy / packs / country-archetypes / interpretations.js** — intactos
- **São Paulo** — no añadido (diferido F3.10h)

---

## VI. F3.9 — qué cambió en producción (histórico)

### Cambió (prod @ F3.9f)

- **Schema catálogo:** `3.8f.1-f3.8c-0.1` → **`3.8f.1-f3.9b-0.1`**
- **Ciudades catálogo:** 44 → **45** (+ Abidjan)
- **Países visibles:** 43 → **44** (+ Costa de Marfil / `ivory_coast`)
- **Países WA con ancla catálogo:** 3/10 → **4/10**
- **Detector SEA smokes WA:** fingerprints frase (F3.9b.2 · smoke-only)

---

## VII. Resolver + catálogo SSOT

| Métrica | Prod live | Staging | Local `src/` |
|---------|-----------|---------|--------------|
| Familias editoriales | **11** | **11** | **11** |
| Países resolver | **50** | **50** | **50** |
| Ciudades catálogo | **47** | **47** | **47** |
| Países catálogo visibles | **44** | **44** | **44** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.10b-0.1`** | **`3.8f.1-f3.10b-0.1`** | **`3.8f.1-f3.10b-0.1`** |
| Ciudades WA en catálogo | **4** | **4** | **4** |
| Ciudades LATAM en catálogo | **10** | **10** | **10** |
| Ciudades SEA en catálogo | **6** | **6** | **6** |
| Ciudades SA en catálogo | **6** | **6** | **6** |

---

## VIII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-west-african-editorial-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.10f pre-deploy:** **7/7 PASS**.

---

## IX. QA F3.10f producción

| Bloque | Resultado |
|--------|-----------|
| Catálogo 47/44 · validateCatalog | **PASS** |
| Búsqueda local Barcelona | **PASS** |
| Búsqueda local Mumbai | **PASS** |
| Mapa 47 markers | **PASS** |
| Barcelona × amor · trabajo · descanso | **PASS** → MEDITERRANEAN |
| Mumbai × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Madrid ≠ Barcelona (amor) | **PASS** |
| Delhi ≠ Mumbai (amor) | **PASS** |
| Regresiones 6/6 | **PASS** |

**Browser QA prod:** **21/21 PASS** @ https://kairos-maps-mvp.web.app/?premium=1&debug=1

---

## X. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Local `src/`** | — | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |

---

## XI. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.10g-1** | **Madrid/Barcelona misma familia** (MEDITERRANEAN) |
| **R-F3.10g-2** | **Delhi/Mumbai misma familia** (SOUTH_ASIAN) |
| **R-F3.10g-3** | **Mumbai sin country archetype** |
| **R-F3.10g-4** | **São Paulo pendiente Wave B** — gate Rio≠SP |
| **R-F3.10g-5** | **Cache browser** post-deploy |
| **R-F3.10g-6** | **`dist/` sucio local** post-deploy · no commiteado |
| **R-F3.9g-1** | **6 países WA sin ancla catálogo** |
| **R-F3.9g-2** | **Homogeneización WA** |
| **R-F3.8g-1** | **Homogeneización LATAM** |
| **R-F3.7g-1** | **Homogeneización SA** |
| **R-F3.6g-3** | **Homogeneización SEA** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XII. Git status (post F3.10g)

```
HEAD local: F3.10g — f3.10g densification wave a production checkpoint
Runtime: ec46b81 — f3.10b densification wave a checkpoint
origin/main: ec46b81 (+1 doc commit local post-F3.10g)

Rama: main
src/: limpio
docs/: +1 checkpoint F3.10g
scripts/: limpio
dist/: modificado / untracked (NO commiteado)
Producción: 50 resolver / 47 catálogo live @ F3.10f
```

---

## XIII. Siguiente fase

### **F3.10h — São Paulo Wave B Decision Gate**

Gate Rio≠São Paulo · evaluación homogeneización LATAM · decisión Wave B densificación Brasil post-Wave A.

---

## XIV. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md` | Cierre F3.10 prod |
| `F3.10B_DENSIFICATION_WAVE_A_CHECKPOINT.md` | Cierre F3.10b runtime |
| `F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md` | Cierre F3.9 prod |
| `F3.8G_LATAM_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.8 prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.10g · Prod 50/47/44 @ 3.8h.2-f3.8b-0.1 + 3.8f.1-f3.10b-0.1 · origin/main ec46b81 · Siguiente F3.10h São Paulo Wave B Decision Gate*
