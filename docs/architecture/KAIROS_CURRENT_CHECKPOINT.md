# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main`**  
**HEAD runtime:** `9f244eb` — `f3.3c west african runtime integration`  
**Checkpoint F3.3:** `docs/architecture/F3.3C_WEST_AFRICAN_RUNTIME_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f2.9c-0.1`** · **31 ciudades / 30 países** · editorial EFR prod **`3.8h.2-f2.7c-0.1`** (sin WEST_AFRICAN)

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**40 países** · **11 familias** en `src/` local), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, familias regionales live en prod (LATAM · WE · SEA · SA · …), catálogo **31 ciudades / 30 países** en producción, y desde **F3.3c** familia **`WEST_AFRICAN`** integrada en runtime local (**no desplegada**).

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3c runtime WA cerrado local** · **F3.3d pendiente** (push + staging).

**Producción** (https://kairos-maps-mvp.web.app) — catálogo Wave A live. Editorial prod **sin WEST_AFRICAN** hasta deploy F3.3d.

**Smokes gate F3.3c (pre-staging):** **8/8 PASS** WA + regresiones LATAM/resolver/dedup/compositor.

**Riesgos vivos:** producción sin WA · ciudades WA fuera de catálogo · `dist/` sucio · cache browser · Lagos futura ancla (no metonimia).

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
| **F2.0–F2.7g** | ✅ Cerrado | SA prod editorial @ `4ca9675` |
| **F2.8a–F2.9b** | ✅ Audit | Coverage + expansion ROI |
| **F2.9c–F2.9g** | ✅ Catálogo prod | 31/30 live · doc `F2.9G` |

---

## IV. Serie F3 — en curso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a** | ✅ Audit | Constitution WA — CONSTELACIÓN GOLFO |
| **F3.3b** | ✅ Copy | 14 packs · 202 strings · parity SA |
| **F3.3c** | ✅ Runtime | `9f244eb` · familia #11 · 10 países v1 |
| **F3.3c1** | ✅ Bleed fix | `REGIONAL_FALLBACK_BAN_MARKERS` ampliado (incl. `9f244eb`) |
| **F3.3c3** | ✅ Doc | `F3.3C_WEST_AFRICAN_RUNTIME_CHECKPOINT.md` |
| **F3.3d** | ⏳ Siguiente | **Push + staging deploy / browser QA** |

---

## V. F3.3c — qué cambió / qué no

### Cambió (runtime local @ `9f244eb`)

- **Resolver:** **`WEST_AFRICAN`** familia **#11** · schema **`3.8h.2-f3.3c-0.1`**
- **Países resolver:** 30 → **40 explícitos** (+10 WA v1)
- **14 packs editoriales** WA en narrative · compositor · knowledge
- **Fix fallback regional:** filtro AC/LATAM/SA/SEA/GN en `interpretations.js` bleed
- **Smokes:** 2 nuevos WA + 9 actualizados (10→11 familias)

**10 países v1 → WEST_AFRICAN:** nigeria · ghana · senegal · ivory_coast · sierra_leone · liberia · benin · togo · guinea · gambia

### No cambió

- **`DEFAULT_FAMILY`** — sigue **`GLOBAL_NEUTRAL`**
- **Catálogo SSOT** — **31 ciudades / 30 países** (sin Lagos/Accra/Dakar)
- **Deploy staging / producción** — sin WEST_AFRICAN live
- **`dist/`** — desincronizado · no commiteado
- **Familias existentes** — sin remapeo de países previos

---

## VI. Resolver + catálogo SSOT

| Métrica | `src/` local | Prod live |
|---------|--------------|-----------|
| Familias editoriales | **11** | **10** (sin WA) |
| Países resolver | **40** | **30** |
| Ciudades catálogo | **31** | **31** |
| Países catálogo visibles | **30** | **30** |
| Schema resolver | `3.8h.2-f3.3c-0.1` | `3.8h.2-f2.7c-0.1` |
| Schema catálogo | `3.8f.1-f2.9c-0.1` | `3.8f.1-f2.9c-0.1` |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-west-african-editorial-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.3c:** **ALL PASS** (gate pre-staging).

---

## VIII. QA runtime local (F3.3c)

| Bloque | Resultado |
|--------|-----------|
| Lagos × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Accra × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Dakar × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| CDMX / amor | **PASS** → LATAM |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |

**Nota:** Lagos/Accra/Dakar vía objetos sintéticos — no en catálogo.

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **31** @ `3.8f.1-f2.9c-0.1` | `3.8h.2-f2.7c-0.1` (sin WA) |
| **Staging** | https://kairos-maps-dev.web.app | **31** | Sin WA hasta F3.3d |
| **Local `src/`** | — | **31** @ `9f244eb` | **`3.8h.2-f3.3c-0.1`** · 11 familias |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.3-1** | **Producción sin WEST_AFRICAN** hasta F3.3d deploy |
| **R-F3.3-2** | **`dist/` sucio** post-deploy previo · no commiteado |
| **R-F3.3-3** | **Ciudades WA fuera de catálogo** — smoke sintético only |
| **R-F3.3-4** | **Marker `compañía` amplio** en ban LATAM fallback |
| **R-F3.3-5** | **Lagos futura ancla, no metonimia** — Nigeria ≠ solo Lagos |
| **R-F2.9f-1** | **Cache browser** — catálogo legacy si bundle cacheado |
| **R-F2.7-3** | **PK / BD / LK / NP** → **`GLOBAL_NEUTRAL`** |

---

## XI. Git status (post F3.3c3 doc)

```
HEAD runtime: 9f244eb — f3.3c west african runtime integration
HEAD doc:     (pending) — f3.3c west african runtime checkpoint

Rama: main · ahead of origin/main
src/: limpio @ 9f244eb
dist/: modificado / untracked (NO commiteado)
Producción: catálogo 31/30 live · editorial sin WEST_AFRICAN
```

---

## XII. Siguiente fase

### **F3.3d — Push + staging deploy / browser QA**

Push `main` · build `dist/` · deploy staging · browser QA Lagos/Accra/Dakar × 3 goals + regresiones.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.3C_WEST_AFRICAN_RUNTIME_CHECKPOINT.md` | Cierre F3.3c runtime WA |
| `F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md` | Cierre F2.9 prod catálogo |
| `F2.7C_SOUTH_ASIAN_RUNTIME_CHECKPOINT.md` | Patrón integración SA |
| `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` | Cierre F2.7 prod editorial |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.3c3 · Doc-only · Runtime local @ 9f244eb · Schema resolver 3.8h.2-f3.3c-0.1 · Catálogo 31/30 sin cambio · Prod sin WEST_AFRICAN*
