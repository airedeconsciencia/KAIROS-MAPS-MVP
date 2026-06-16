# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`** (pre-push F3.4b)  
**HEAD local:** F3.4b1 doc checkpoint (post F3.4b catálogo)  
**Checkpoint F3.4:** `docs/architecture/F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f2.9c-0.1`** · **31 ciudades / 30 países** · editorial EFR **`3.8h.2-f3.3c-0.1`** · **11 familias** (incl. WEST_AFRICAN)

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**40 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y desde **F3.4b** catálogo local **`34 ciudades / 33 países`** con **Lagos · Accra · Dakar** (Wave A WEST_AFRICAN).

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** (editorial WA prod) · **F3.4b catálogo Wave A cerrado en `src/`**.

**Producción** (https://kairos-maps-mvp.web.app) — editorial **`3.8h.2-f3.3c-0.1`** · WEST_AFRICAN live · catálogo prod **31/30** (sin deploy F3.4b aún).

**Smokes gate F3.4b:** **4/4 PASS** (catalog · resolver · WA integration · premium composition).

**Riesgos vivos:** cache browser · 7 países WA sin ancla · spine compartido WA · `dist/` sucio · prod catálogo desincronizado.

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

## IV. Serie F3 — F3.4b catálogo cerrado

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a–F3.3g** | ✅ Cerrado | Editorial WA prod @ `479693a` |
| **F3.4a** | ✅ Audit | Opción C — Lagos + Accra + Dakar |
| **F3.4b** | ✅ **Catálogo** | `src/` 34/33 · schema `3.8f.1-f3.4b-0.1` |
| **F3.4b1** | ✅ Doc | `F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md` |
| **F3.4d** | ⏳ Siguiente | **Staging deploy + browser QA** |

---

## V. F3.4b — qué cambió en `src/` / qué no

### Cambió (local `src/` @ F3.4b)

- **Schema catálogo:** `3.8f.1-f2.9c-0.1` → **`3.8f.1-f3.4b-0.1`**
- **Ciudades catálogo:** 31 → **34** (+ Lagos · Accra · Dakar)
- **Países visibles:** 30 → **33** (+ Nigeria · Ghana · Senegal)
- **Países WA con ancla catálogo:** 0/10 → **3/10**
- **Smokes:** conteos 34/33 · +4 casos split-brain resolver · asserts SSOT WA

### No cambió

- **Editorial EFR** — `3.8h.2-f3.3c-0.1` (prod live desde F3.3f)
- **Familias** — **11** (sin cambio)
- **Países resolver** — **40** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`
- **Producción catálogo** — sigue **31/30** hasta deploy F3.4d

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Local `src/` (F3.4b) |
|---------|-----------|----------------------|
| Familias editoriales | **11** | **11** |
| Países resolver | **40** | **40** |
| Ciudades catálogo | **31** | **34** |
| Países catálogo visibles | **30** | **33** |
| Schema resolver | `3.8h.2-f3.3c-0.1` | sin cambio |
| Schema catálogo | `3.8f.1-f2.9c-0.1` | **`3.8f.1-f3.4b-0.1`** |
| Ciudades WA en catálogo | **0** | **3** (Lagos · Accra · Dakar) |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-west-african-editorial-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.4b:** **4/4 PASS** (gate catálogo Wave A).

---

## VIII. QA F3.4b (smokes — catálogo SSOT)

| Bloque | Resultado |
|--------|-----------|
| Lagos × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Accra × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Dakar × amor · trabajo · descanso | **PASS** → WEST_AFRICAN |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| CDMX / amor | **PASS** → LATAM |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |

**Browser QA prod:** pendiente F3.4d (staging primero).

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **31** @ `3.8f.1-f2.9c-0.1` | **`3.8h.2-f3.3c-0.1`** · 11 familias |
| **Staging** | https://kairos-maps-dev.web.app | **31** | **`3.8h.2-f3.3c-0.1`** |
| **Local `src/`** | — | **34** @ `3.8f.1-f3.4b-0.1` | **`3.8h.2-f3.3c-0.1`** |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.4b-1** | **7 países WA sin ancla catálogo** |
| **R-F3.4b-2** | **Diferenciación Lagos/Accra/Dakar** — spine compartido |
| **R-F3.4b-3** | **Metonimia Lagos/Nigeria** |
| **R-F3.4b-4** | **Prod catálogo desincronizado** — 31 vs 34 local |
| **R-F3.3f-1** | **Cache browser** — bundle legacy si no hard refresh |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |
| **R-F2.7-3** | **PK / BD / LK / NP** → **`GLOBAL_NEUTRAL`** |

---

## XI. Git status (post F3.4b1)

```
HEAD local: F3.4b1 — f3.4b west african catalog wave a checkpoint
Runtime catálogo: F3.4b — f3.4b west african catalog wave a
origin/main: 479693a (pre-push F3.4b)

Rama: main
src/: limpio post F3.4b
docs/: limpio post F3.4b1
scripts/: limpio post F3.4b
dist/: modificado / untracked (NO commiteado)
Producción: editorial WA live · catálogo 31/30 hasta F3.4d
```

---

## XII. Siguiente fase

### **F3.4d — Staging deploy + browser QA Wave A**

Build `dist/` · deploy staging · QA Lagos/Accra/Dakar × 3 goals · regresiones · **34 markers** UI.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md` | Cierre F3.4b catálogo |
| `F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md` | Editorial WA prod |
| `F2.9C_LATAM_CATALOG_WAVE_A_CHECKPOINT.md` | Patrón Wave A catálogo |
| `F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md` | Catálogo prod LATAM |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.4b1 · Catálogo local 34/33 @ 3.8f.1-f3.4b-0.1 · Prod catálogo 31/30 hasta deploy · Editorial WA live @ 3.8h.2-f3.3c-0.1*
