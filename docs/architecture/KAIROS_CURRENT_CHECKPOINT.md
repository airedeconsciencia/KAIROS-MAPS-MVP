# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.8g doc checkpoint (post F3.8f prod deploy)  
**Checkpoint F3.8:** `docs/architecture/F3.8G_LATAM_PLUS_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.7:** `docs/architecture/F3.7G_SOUTH_ASIAN_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.8c-0.1`** · **44 ciudades / 43 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`44 ciudades / 43 países`** con **LATAM+ Wave A** (San José · Ciudad de Panamá) además de **SA+ Wave A** y **SEA+ Wave A**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA cerrado** · **F3.6 SEA+ serie cerrada en producción** · **F3.7 SA+ serie cerrada en producción** · **F3.8 LATAM+ serie cerrada en producción**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.8c-0.1`** · **44/43** live.

**Smokes gate F3.8f:** **8/8 PASS** (pre-deploy prod).

**QA prod F3.8f:** catálogo **44/43 PASS** · premium **6/6 PASS** · regresiones **7/7 PASS**.

**Riesgos vivos:** homogeneización LATAM · Centroamérica sin micro-diferenciación · homogeneización SA · homogeneización SEA · cache browser · 6 países WA sin ancla · `dist/` sucio.

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
| **F3.9a** | ⏳ Siguiente | **WEST_AFRICAN Wave B / Abidjan Catalog** |

---

## V. F3.8 — qué cambió en producción

### Cambió (prod live @ F3.8f)

- **Schema resolver:** `3.8h.2-f3.7b-0.1` → **`3.8h.2-f3.8b-0.1`**
- **Países resolver:** 48 → **50** (+ costa_rica · panama → LATAM)
- **Schema catálogo:** `3.8f.1-f3.7c-0.1` → **`3.8f.1-f3.8c-0.1`**
- **Ciudades catálogo:** 42 → **44** (+ San José · Ciudad de Panamá)
- **Países visibles:** 41 → **43**
- **Países LATAM con ancla catálogo:** 8/10 → **10/10**
- **Push:** `428d5ab` → **`11874e5`** en `origin/main`

### No cambió

- **Familias** — **11** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Staging | Local `src/` |
|---------|-----------|---------|--------------|
| Familias editoriales | **11** | **11** | **11** |
| Países resolver | **50** | **50** | **50** |
| Ciudades catálogo | **44** | **44** | **44** |
| Países catálogo visibles | **43** | **43** | **43** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.8c-0.1`** | **`3.8f.1-f3.8c-0.1`** | **`3.8f.1-f3.8c-0.1`** |
| Ciudades LATAM en catálogo | **10** | **10** | **10** |
| Ciudades SEA en catálogo | **6** | **6** | **6** |
| Ciudades SA en catálogo | **5** | **5** | **5** |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.8f pre-deploy:** **8/8 PASS**.

---

## VIII. QA F3.8f producción

| Bloque | Resultado |
|--------|-----------|
| Catálogo 44/43 · validateCatalog | **PASS** |
| San José × amor · trabajo · descanso | **PASS** → LATAM |
| Ciudad de Panamá × amor · trabajo · descanso | **PASS** → LATAM |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| CDMX / amor | **PASS** → LATAM |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |

**Browser QA prod:** **17/17 PASS** @ https://kairos-maps-mvp.web.app/?premium=1&debug=1

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **44** @ `3.8f.1-f3.8c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **44** @ `3.8f.1-f3.8c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Local `src/`** | — | **44** @ `3.8f.1-f3.8c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.8g-1** | **Homogeneización LATAM** — pack compartido 10 países |
| **R-F3.8g-2** | **Centroamérica sin micro-diferenciación** |
| **R-F3.8g-3** | **Cache browser** post-deploy |
| **R-F3.7g-1** | **Homogeneización SA** — pack India compartido |
| **R-F3.6g-3** | **Homogeneización SEA** |
| **R-F3.4b-1** | **6 países WA sin ancla catálogo** (ivory_coast ya en resolver) |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XI. Git status (post F3.8g)

```
HEAD local: F3.8g — f3.8g latam plus production checkpoint
Runtime + doc prev: 11874e5 — f3.8 latam plus resolver catalog checkpoint
origin/main: 11874e5 (post F3.8d1 push; +1 doc commit local post-F3.8g)

Rama: main
src/: limpio
docs/: limpio post F3.8g
scripts/: limpio
dist/: modificado / untracked (NO commiteado)
Producción: 50 resolver / 44 catálogo live @ F3.8f
```

---

## XII. Siguiente fase

### **F3.9a — WEST_AFRICAN Wave B / Abidjan Catalog**

Catálogo Wave B: Abidjan (Côte d'Ivoire · `ivory_coast` ya mapeado en resolver) · auditoría READ-ONLY · cierre gap WA sin ancla.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.8G_LATAM_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.8 prod |
| `F3.8_LATAM_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.8b+c runtime |
| `F3.7G_SOUTH_ASIAN_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.7 prod |
| `F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.6 prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.8g · Prod 50/44/43 @ 3.8h.2-f3.8b-0.1 + 3.8f.1-f3.8c-0.1 · origin/main 11874e5 · Siguiente F3.9a WA Wave B*
