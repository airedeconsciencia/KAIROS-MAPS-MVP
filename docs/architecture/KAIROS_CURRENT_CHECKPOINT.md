# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.8d doc checkpoint (post F3.8b+c runtime)  
**Checkpoint F3.8:** `docs/architecture/F3.8_LATAM_PLUS_RESOLVER_CATALOG_CHECKPOINT.md`  
**Checkpoint F3.7:** `docs/architecture/F3.7G_SOUTH_ASIAN_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.7c-0.1`** · **42 ciudades / 41 países** · editorial EFR **`3.8h.2-f3.7b-0.1`** · **48 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** en local `src/` · **11 familias**), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`44 ciudades / 43 países`** con **LATAM+ Wave A** (San José · Ciudad de Panamá) además de **SA+ Wave A** y **SEA+ Wave A**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA cerrado** · **F3.6 SEA+ serie cerrada en producción** · **F3.7 SA+ serie cerrada en producción** · **F3.8 LATAM+ Wave A cerrado en `src/`**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.7b-0.1`** · catálogo **`3.8f.1-f3.7c-0.1`** · **42/41** live (sin deploy F3.8 aún).

**Smokes gate F3.8d:** **7/7 PASS** (local pre-deploy).

**QA local F3.8c:** LATAM+ **6/6 PASS** · regresiones **7/7 PASS**.

**Riesgos vivos:** homogeneización LATAM · Centroamérica sin micro-diferenciación · homogeneización SA · homogeneización SEA · cache browser · 7 países WA sin ancla · `dist/` sucio.

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
| **F3.6a–F3.6g** | ✅ Cerrado | SEA+ prod 44/38/37 |
| **F3.7a–F3.7g** | ✅ Cerrado | SA+ prod 48/42/41 |
| **F3.8a** | ✅ Audit | LATAM+ / WA Wave B / Densification |
| **F3.8b–F3.8d** | ✅ Cerrado | LATAM+ resolver+catálogo Wave A |
| **F3.8e** | ⏳ Siguiente | **Staging deploy + browser QA** |

---

## V. F3.8 — qué cambió en local `src/`

### Cambió (F3.8b + F3.8c)

- **Schema resolver:** `3.8h.2-f3.7b-0.1` → **`3.8h.2-f3.8b-0.1`**
- **Países resolver:** 48 → **50** (+ costa_rica · panama → LATAM)
- **Schema catálogo:** `3.8f.1-f3.7c-0.1` → **`3.8f.1-f3.8c-0.1`**
- **Ciudades catálogo:** 42 → **44** (+ San José · Ciudad de Panamá)
- **Países visibles:** 41 → **43**
- **Países LATAM con ancla catálogo:** 8/10 → **10/10**

### No cambió

- **Familias** — **11** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Staging | Local `src/` |
|---------|-----------|---------|--------------|
| Familias editoriales | **11** | **11** | **11** |
| Países resolver | **48** | **48** | **50** |
| Ciudades catálogo | **42** | **42** | **44** |
| Países catálogo visibles | **41** | **41** | **43** |
| Schema resolver | **`3.8h.2-f3.7b-0.1`** | **`3.8h.2-f3.7b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.7c-0.1`** | **`3.8f.1-f3.7c-0.1`** | **`3.8f.1-f3.8c-0.1`** |
| Ciudades LATAM en catálogo | **8** | **8** | **10** |
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
```

**Estado F3.8d:** **7/7 PASS**.

---

## VIII. QA F3.8c local

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

**Browser QA prod:** pendiente F3.8e staging.

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **42** @ `3.8f.1-f3.7c-0.1` | **`3.8h.2-f3.7b-0.1`** · 48 países |
| **Staging** | https://kairos-maps-dev.web.app | **42** @ `3.8f.1-f3.7c-0.1` | **`3.8h.2-f3.7b-0.1`** · 48 países |
| **Local `src/`** | — | **44** @ `3.8f.1-f3.8c-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.8-1** | **Homogeneización LATAM** — pack compartido 10 países |
| **R-F3.8-2** | **Centroamérica sin micro-diferenciación** |
| **R-F3.7g-1** | **Homogeneización SA** — pack India compartido |
| **R-F3.6g-3** | **Homogeneización SEA** |
| **R-F3.4b-1** | **7 países WA sin ancla catálogo** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XI. Git status (post F3.8d)

```
HEAD local: F3.8d — f3.8 latam plus resolver catalog checkpoint
Runtime prev: — f3.8 latam plus resolver and catalog wave a
origin/main: 428d5ab (F3.7g; sin push F3.8)

Rama: main
src/: limpio post F3.8d
docs/: limpio post F3.8d
scripts/: limpio post F3.8d
dist/: modificado / untracked (NO commiteado)
Producción: 48 resolver / 42 catálogo live @ F3.7f
```

---

## XII. Siguiente fase

### **F3.8e — Staging deploy + browser QA**

Deploy `src/` → staging · browser QA 6/6 LATAM+ · regresiones 7/7 · validar San José / Ciudad de Panamá en UI.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.8_LATAM_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.8b+c runtime |
| `F3.7G_SOUTH_ASIAN_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.7 prod |
| `F3.7_SOUTH_ASIAN_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.7b+c runtime |
| `F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.6 prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.8d · Local 50/44/43 @ 3.8h.2-f3.8b-0.1 + 3.8f.1-f3.8c-0.1 · Prod sigue F3.7 · Siguiente F3.8e staging*
