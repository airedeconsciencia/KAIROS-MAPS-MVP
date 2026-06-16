# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD / origin:** `4b2026e` — `f3.3c west african runtime checkpoint`  
**Checkpoint F3.3:** `docs/architecture/F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f2.9c-0.1`** · **31 ciudades / 30 países** · editorial EFR **`3.8h.2-f3.3c-0.1`** · **11 familias** (incl. WEST_AFRICAN)

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**40 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, catálogo **31 ciudades / 30 países**, y desde **F3.3f** familia **`WEST_AFRICAN`** **desplegada en producción**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** (runtime + staging + prod editorial WA).

**Producción** (https://kairos-maps-mvp.web.app) — editorial **`3.8h.2-f3.3c-0.1`** · WEST_AFRICAN live · catálogo 31/30 sin cambio F3.3.

**Smokes gate F3.3f (pre-prod):** **8/8 PASS** · QA prod **9/9 WA + 7/7 reg**.

**Riesgos vivos:** cache browser · ciudades WA fuera de catálogo · conflicto spine compartido WA · `dist/` sucio · Lagos P0 pendiente.

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

## IV. Serie F3 — F3.3 cerrada

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a** | ✅ Audit | Constitution WA — CONSTELACIÓN GOLFO |
| **F3.3b** | ✅ Copy | 14 packs · 202 strings |
| **F3.3c** | ✅ Runtime | `9f244eb` · familia #11 |
| **F3.3c1** | ✅ Bleed fix | `REGIONAL_FALLBACK_BAN_MARKERS` |
| **F3.3c3–c4** | ✅ Doc + push | `4b2026e` en origin |
| **F3.3d** | ✅ Staging | 9/9 WA · 7/7 reg |
| **F3.3f** | ✅ **Prod** | `kairos-maps-mvp.web.app` |
| **F3.3g** | ✅ Doc | `F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md` |
| **F3.4** | ⏳ Siguiente | **Catalog Anchor Audit / Lagos P0** |

---

## V. F3.3 — qué cambió en prod / qué no

### Cambió (prod live @ F3.3f)

- **Editorial EFR:** `3.8h.2-f2.7c-0.1` → **`3.8h.2-f3.3c-0.1`**
- **Familias:** 10 → **11** (+ `WEST_AFRICAN`)
- **Países resolver:** 30 → **40** (+10 WA v1)
- **14 packs WA** en narrative · compositor · knowledge
- **Fix fallback regional** F3.3c1 activo en prod

**10 países v1 → WEST_AFRICAN:** nigeria · ghana · senegal · ivory_coast · sierra_leone · liberia · benin · togo · guinea · gambia

### No cambió

- **Schema catálogo** — `3.8f.1-f2.9c-0.1`
- **Ciudades catálogo** — **31 / 30 países**
- **Lagos / Accra / Dakar** — fuera de catálogo SSOT
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`
- **Repo HEAD** — sigue `4b2026e` (deploy sin commit)

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live |
|---------|-----------|
| Familias editoriales | **11** |
| Países resolver | **40** |
| Ciudades catálogo | **31** |
| Países catálogo visibles | **30** |
| Schema resolver | `3.8h.2-f3.3c-0.1` |
| Schema catálogo | `3.8f.1-f2.9c-0.1` |
| Ciudades WA en catálogo | **0** (Lagos/Accra/Dakar pendientes) |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-west-african-editorial-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.3f:** **ALL PASS** (pre-deploy prod).

---

## VIII. QA producción (F3.3f)

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
| UI Lagos / amor | **PASS** — premium · eyebrow · 6 secciones |

**URL QA:** https://kairos-maps-mvp.web.app/?premium=1&debug=1

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **31** @ `3.8f.1-f2.9c-0.1` | **`3.8h.2-f3.3c-0.1`** · 11 familias |
| **Staging** | https://kairos-maps-dev.web.app | **31** | **`3.8h.2-f3.3c-0.1`** (paridad F3.3d) |
| **Local `src/`** | — | **31** @ `4b2026e` | **`3.8h.2-f3.3c-0.1`** |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.3f-1** | **Cache browser** — bundle legacy `f2.7c` si no hard refresh |
| **R-F3.3f-2** | **Lagos/Accra/Dakar fuera de catálogo** — Nominatim only |
| **R-F3.3f-3** | **Conflicto spine compartido WA** — sin micro ciudad |
| **R-F3.3f-4** | **Lagos ancla P0 pendiente** — Nigeria ≠ metonimia Lagos |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |
| **R-F2.7-3** | **PK / BD / LK / NP** → **`GLOBAL_NEUTRAL`** |

---

## XI. Git status (post F3.3g doc)

```
HEAD / origin/main: 4b2026e — f3.3c west african runtime checkpoint
Runtime: 9f244eb (F3.3c) + 4b2026e (F3.3c doc)
Deploy prod: F3.3f — sin commit
HEAD doc: (pending) — f3.3g west african production checkpoint

Rama: main · up to date with origin/main
src/: limpio @ 4b2026e
dist/: modificado / untracked (NO commiteado — rsync deploy-prod)
Producción: editorial WA live @ 3.8h.2-f3.3c-0.1
```

---

## XII. Siguiente fase

### **F3.4 — WEST_AFRICAN Catalog Anchor Audit / Lagos P0**

Auditoría ancla catálogo · Lagos P0 · gap 10 países WA vs ciudades · micro-diferenciación opcional.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md` | Cierre F3.3 prod WA |
| `F3.3C_WEST_AFRICAN_RUNTIME_CHECKPOINT.md` | Runtime pre-prod |
| `F2.7G_SOUTH_ASIAN_PRODUCTION_CHECKPOINT.md` | Patrón prod SA |
| `F2.9G_LATAM_CATALOG_WAVE_A_PRODUCTION_CHECKPOINT.md` | Catálogo 31/30 |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.3g · Doc-only · Prod editorial WA live @ 3.8h.2-f3.3c-0.1 · HEAD 4b2026e · Catálogo 31/30*
