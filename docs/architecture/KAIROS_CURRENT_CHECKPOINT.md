# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`** (pre-push F3.6)  
**HEAD local:** F3.6d doc checkpoint (post F3.6 runtime)  
**Checkpoint F3.6:** `docs/architecture/F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md`  
**Checkpoint F3.4:** `docs/architecture/F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.4b-0.1`** · **34 ciudades / 33 países** · editorial EFR **`3.8h.2-f3.3c-0.1`** · **40 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado**, dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, catálogo local **`38 ciudades / 37 países`**, y resolver local **`44 países / 11 familias`** con **SEA+ Wave A** (F3.6b + F3.6c).

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA cerrado** · **F3.6 SEA+ resolver + catálogo cerrado en `src/`**.

**Producción** (https://kairos-maps-mvp.web.app) — editorial **`3.8h.2-f3.3c-0.1`** · catálogo prod **34/33** (sin deploy F3.6 aún).

**Smokes gate F3.6:** **5/5 PASS** (catalog · resolver · SEA integration · fallback SSOT · global neutral).

**Riesgos vivos:** homogeneización SEA · Ho Chi Minh naming · Manila words mínimo · cache browser · `dist/` sucio · prod desincronizado.

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

## IV. Serie F3 — F3.6 SEA+ cerrado

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a–F3.3g** | ✅ Cerrado | Editorial WA prod @ `479693a` |
| **F3.4a–F3.4b1** | ✅ Cerrado | Catálogo WA Wave A · 34/33 |
| **F3.4d–F3.4f** | ✅ Cerrado | Staging + prod catálogo 34/33 |
| **F3.5a–F3.5b** | ✅ Audit | Coverage gap · SEA+ first |
| **F3.6a** | ✅ Audit | SEA+ resolver readiness |
| **F3.6b** | ✅ **Resolver** | 44 países · schema `3.8h.2-f3.6b-0.1` |
| **F3.6c** | ✅ **Catálogo** | 38/37 · schema `3.8f.1-f3.6c-0.1` |
| **F3.6d** | ✅ Doc | `F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` |
| **F3.6e** | ⏳ Siguiente | **Staging deploy + browser QA** |

---

## V. F3.6 — qué cambió en `src/` / qué no

### Cambió (local `src/` @ F3.6)

- **Schema resolver:** `3.8h.2-f3.3c-0.1` → **`3.8h.2-f3.6b-0.1`**
- **Países resolver:** 40 → **44** (+ vietnam · malaysia · indonesia · philippines → SOUTHEAST_ASIAN)
- **Schema catálogo:** `3.8f.1-f3.4b-0.1` → **`3.8f.1-f3.6c-0.1`**
- **Ciudades catálogo:** 34 → **38** (+ Ho Chi Minh City · Kuala Lumpur · Jakarta · Manila)
- **Países visibles:** 33 → **37** (+ Vietnam · Malasia · Indonesia · Filipinas)
- **Países SEA con ancla catálogo:** 2/6 → **6/6**
- **Smokes:** conteos 44/38/37 · 12 lecturas SEA+ · regresiones 7/7

### No cambió

- **Familias** — **11** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`
- **Producción** — sigue **40 resolver / 34 catálogo** hasta deploy F3.6e

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Local `src/` (F3.6) |
|---------|-----------|---------------------|
| Familias editoriales | **11** | **11** |
| Países resolver | **40** | **44** |
| Ciudades catálogo | **34** | **38** |
| Países catálogo visibles | **33** | **37** |
| Schema resolver | `3.8h.2-f3.3c-0.1` | **`3.8h.2-f3.6b-0.1`** |
| Schema catálogo | `3.8f.1-f3.4b-0.1` | **`3.8f.1-f3.6c-0.1`** |
| Ciudades SEA en catálogo | **2** | **6** |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
```

**Estado F3.6:** **5/5 PASS** (gate SEA+ Wave A).

---

## VIII. QA F3.6 (smokes — resolver + catálogo SSOT)

| Bloque | Resultado |
|--------|-----------|
| Ho Chi Minh City × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Kuala Lumpur × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Jakarta × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Manila × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Nairobi / amor | **PASS** → AFRICAN_COASTAL |
| CDMX / amor | **PASS** → LATAM |
| Delhi / amor | **PASS** → SOUTH_ASIAN |
| Bangkok / amor | **PASS** → SOUTHEAST_ASIAN |
| París / amor | **PASS** → WESTERN_EUROPE |
| Lisboa / amor | **PASS** → IBERIAN |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |

**Browser QA prod:** pendiente F3.6e (staging primero).

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **34** @ `3.8f.1-f3.4b-0.1` | **`3.8h.2-f3.3c-0.1`** · 40 países |
| **Staging** | https://kairos-maps-dev.web.app | **34** | **`3.8h.2-f3.3c-0.1`** |
| **Local `src/`** | — | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.6-1** | **Homogeneización SEA** — spine/packs compartidos |
| **R-F3.6-2** | **Indonesia/Jakarta como ancla** |
| **R-F3.6-3** | **Ho Chi Minh City naming** — EN vs búsqueda ES |
| **R-F3.6-4** | **Manila words cerca del mínimo** (502) |
| **R-F3.6-5** | **Prod desincronizado** — 40/34 vs 44/38 local |
| **R-F3.4b-1** | **7 países WA sin ancla catálogo** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XI. Git status (post F3.6d)

```
HEAD local: F3.6d — f3.6 sea plus resolver catalog checkpoint
Runtime: F3.6 — f3.6 sea plus resolver and catalog wave a
origin/main: 77615ae (pre-push F3.6)

Rama: main
src/: limpio post F3.6
docs/: limpio post F3.6d
scripts/: limpio post F3.6
dist/: modificado / untracked (NO commiteado)
Producción: 40 resolver / 34 catálogo hasta F3.6e
```

---

## XII. Siguiente fase

### **F3.6e — Staging deploy + browser QA SEA+ Wave A**

Build `dist/` · deploy staging · QA 4 ciudades × 3 goals · regresiones · **38 markers** UI.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.6 resolver + catálogo |
| `F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md` | Catálogo WA Wave A |
| `F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md` | Editorial WA prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.6d · Resolver 44 @ 3.8h.2-f3.6b-0.1 · Catálogo 38/37 @ 3.8f.1-f3.6c-0.1 · Prod sin deploy F3.6 · Siguiente F3.6e staging QA*
