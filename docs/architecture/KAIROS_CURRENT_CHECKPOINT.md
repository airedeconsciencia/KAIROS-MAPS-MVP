# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.7d doc checkpoint (post F3.7b+c runtime)  
**Checkpoint F3.7:** `docs/architecture/F3.7_SOUTH_ASIAN_PLUS_RESOLVER_CATALOG_CHECKPOINT.md`  
**Checkpoint F3.6:** `docs/architecture/F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.6c-0.1`** · **38 ciudades / 37 países** · editorial EFR **`3.8h.2-f3.6b-0.1`** · **44 países** · **11 familias**  
**Local `src/`:** catálogo **`3.8f.1-f3.7c-0.1`** · **42/41** · resolver **`3.8h.2-f3.7b-0.1`** · **48 países**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**48 países local** · **11 familias**), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`42 ciudades / 41 países`** con **SA+ Wave A** (Karachi · Dhaka · Colombo · Kathmandu) además de **SEA+ Wave A** (Ho Chi Minh City · Kuala Lumpur · Jakarta · Manila).

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA cerrado** · **F3.6 SEA+ serie cerrada en producción** · **F3.7 SA+ Wave A cerrado en `src/` (sin deploy)**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.6b-0.1`** · catálogo **`3.8f.1-f3.6c-0.1`** · **38/37** live (pendiente F3.7e).

**Smokes gate F3.7d:** **6/6 PASS** (local pre-deploy).

**QA local F3.7:** SA+ **12/12 PASS** · regresiones **7/7 PASS**.

**Riesgos vivos:** homogeneización SA · Pakistán tono India · Nepal fit urbano · Manila 502 words · homogeneización SEA · cache browser · 7 países WA sin ancla · `dist/` sucio.

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
| **F3.7a** | ✅ Audit | SA+ expansion readiness |
| **F3.7b–F3.7c** | ✅ Runtime | Resolver 48 · catálogo 42/41 |
| **F3.7d** | ✅ Doc | `F3.7_SOUTH_ASIAN_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` |
| **F3.7e** | ⏳ Siguiente | **Staging deploy + browser QA** |

---

## V. F3.7 — qué cambió en local `src/`

### Cambió (local @ F3.7d)

- **Schema resolver:** `3.8h.2-f3.6b-0.1` → **`3.8h.2-f3.7b-0.1`**
- **Países resolver:** 44 → **48** (+ pakistan · bangladesh · sri_lanka · nepal → SOUTH_ASIAN)
- **Schema catálogo:** `3.8f.1-f3.6c-0.1` → **`3.8f.1-f3.7c-0.1`**
- **Ciudades catálogo:** 38 → **42** (+ Karachi · Dhaka · Colombo · Kathmandu)
- **Países visibles:** 37 → **41**
- **Países SA con ancla catálogo:** 1/5 → **5/5**

### No cambió

- **Familias** — **11** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`
- **Producción** — sigue F3.6 hasta deploy F3.7e

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Local `src/` |
|---------|-----------|--------------|
| Familias editoriales | **11** | **11** |
| Países resolver | **44** | **48** |
| Ciudades catálogo | **38** | **42** |
| Países catálogo visibles | **37** | **41** |
| Schema resolver | **`3.8h.2-f3.6b-0.1`** | **`3.8h.2-f3.7b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.6c-0.1`** | **`3.8f.1-f3.7c-0.1`** |
| Ciudades SEA en catálogo | **6** | **6** |
| Ciudades SA en catálogo | **1** (Delhi) | **5** |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
```

**Estado F3.7d local:** **6/6 PASS**.

---

## VIII. QA F3.7 local

| Bloque | Resultado |
|--------|-----------|
| Catálogo 42/41 · validateCatalog | **PASS** |
| Karachi × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Dhaka × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Colombo × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Kathmandu × amor · trabajo · descanso | **PASS** → SOUTH_ASIAN |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| CDMX / amor | **PASS** → LATAM |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |

**Spot-checks:** Karachi ≠ Delhi · Kathmandu sin megaciudad · Colombo no SEA/GN — **PASS**

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |
| **Staging** | https://kairos-maps-dev.web.app | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |
| **Local `src/`** | — | **42** @ `3.8f.1-f3.7c-0.1` | **`3.8h.2-f3.7b-0.1`** · 48 países |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.7-1** | **Homogeneización SA** — pack India compartido |
| **R-F3.7-2** | **Pakistán tono India** — sensibilidad cultural |
| **R-F3.7-3** | **Nepal fit urbano** — Kathmandu vs tono megaciudad |
| **R-F3.6g-1** | **Manila amor @ 502 words** — margen mínimo |
| **R-F3.6g-3** | **Homogeneización SEA** |
| **R-F3.4b-1** | **7 países WA sin ancla catálogo** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XI. Git status (post F3.7d)

```
HEAD local: F3.7d — f3.7 south asian plus resolver catalog checkpoint
Runtime prev: — f3.7 south asian plus resolver and catalog wave a
origin/main: F3.6g (prod 44/38/37; pendiente push F3.7)

Rama: main
src/: limpio post commit 1
docs/: limpio post commit 2
scripts/: limpio post commit 1
dist/: modificado / untracked (NO commiteado)
Producción: 44 resolver / 38 catálogo live @ F3.6f
Local src/: 48 resolver / 42 catálogo @ F3.7
```

---

## XII. Siguiente fase

### **F3.7e — Staging deploy + browser QA**

Deploy `src/` → staging · browser QA 12/12 SA+ · regresiones 7/7 · validar 4 ciudades SA+ en UI.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.7_SOUTH_ASIAN_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.7b+c runtime |
| `F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.6 prod |
| `F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.6b+c runtime |
| `F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md` | Catálogo WA Wave A |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.7d · Local 48/42/41 @ 3.8h.2-f3.7b-0.1 + 3.8f.1-f3.7c-0.1 · Prod F3.6 hasta F3.7e · Siguiente F3.7e staging deploy*
