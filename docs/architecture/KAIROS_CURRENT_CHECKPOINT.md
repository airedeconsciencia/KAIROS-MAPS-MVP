# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD local:** F3.6g doc checkpoint (post F3.6f prod deploy)  
**Checkpoint F3.6:** `docs/architecture/F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.4:** `docs/architecture/F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.6c-0.1`** · **38 ciudades / 37 países** · editorial EFR **`3.8h.2-f3.6b-0.1`** · **44 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**44 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`38 ciudades / 37 países`** con **SEA+ Wave A** (Ho Chi Minh City · Kuala Lumpur · Jakarta · Manila).

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA cerrado** · **F3.6 SEA+ serie cerrada en producción**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.6b-0.1`** · catálogo **`3.8f.1-f3.6c-0.1`** · **38/37** live.

**Smokes gate F3.6:** **6/6 PASS** (pre-deploy F3.6f).

**QA prod F3.6f:** catálogo **38/37 PASS** · premium **12/12 PASS** · regresiones **7/7 PASS**.

**Riesgos vivos:** Manila 502 words · Ho Chi Minh naming · homogeneización SEA · cache browser · 7 países WA sin ancla · `dist/` sucio.

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

## IV. Serie F3 — F3.6 SEA+ cerrada en prod

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F3.3a–F3.3g** | ✅ Cerrado | Editorial WA prod @ `479693a` |
| **F3.4a–F3.4f** | ✅ Cerrado | Catálogo WA Wave A prod 34/33 |
| **F3.5a–F3.5b** | ✅ Audit | Coverage gap · SEA+ first |
| **F3.6a** | ✅ Audit | SEA+ resolver readiness |
| **F3.6b–F3.6c** | ✅ Runtime | Resolver 44 · catálogo 38/37 |
| **F3.6d** | ✅ Doc | `F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` |
| **F3.6e** | ✅ Staging | Browser QA 12/12 · 7/7 |
| **F3.6f** | ✅ **Prod** | Push `bbcd7f4` · deploy prod |
| **F3.6g** | ✅ Doc | `F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md` |
| **F3.7a** | ⏳ Siguiente | **South Asian Expansion Audit** |

---

## V. F3.6 — qué cambió en producción

### Cambió (prod live @ F3.6f)

- **Schema resolver:** `3.8h.2-f3.3c-0.1` → **`3.8h.2-f3.6b-0.1`**
- **Países resolver:** 40 → **44** (+ vietnam · malaysia · indonesia · philippines → SOUTHEAST_ASIAN)
- **Schema catálogo:** `3.8f.1-f3.4b-0.1` → **`3.8f.1-f3.6c-0.1`**
- **Ciudades catálogo:** 34 → **38** (+ Ho Chi Minh City · Kuala Lumpur · Jakarta · Manila)
- **Países visibles:** 33 → **37**
- **Países SEA con ancla catálogo:** 2/6 → **6/6**
- **Push:** `77615ae` → **`bbcd7f4`** en `origin/main`

### No cambió

- **Familias** — **11** (sin cambio)
- **Copy / packs / country-archetypes** — intactos
- **`DEFAULT_FAMILY`** — `GLOBAL_NEUTRAL`

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live | Staging | Local `src/` |
|---------|-----------|---------|--------------|
| Familias editoriales | **11** | **11** | **11** |
| Países resolver | **44** | **44** | **44** |
| Ciudades catálogo | **38** | **38** | **38** |
| Países catálogo visibles | **37** | **37** | **37** |
| Schema resolver | **`3.8h.2-f3.6b-0.1`** | **`3.8h.2-f3.6b-0.1`** | **`3.8h.2-f3.6b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.6c-0.1`** | **`3.8f.1-f3.6c-0.1`** | **`3.8f.1-f3.6c-0.1`** |
| Ciudades SEA en catálogo | **6** | **6** | **6** |

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F3.6f pre-deploy:** **6/6 PASS**.

---

## VIII. QA F3.6f producción

| Bloque | Resultado |
|--------|-----------|
| Catálogo 38/37 · validateCatalog | **PASS** |
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

**Browser QA prod:** **19/19 PASS** @ https://kairos-maps-mvp.web.app/?premium=1&debug=1

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |
| **Staging** | https://kairos-maps-dev.web.app | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |
| **Local `src/`** | — | **38** @ `3.8f.1-f3.6c-0.1` | **`3.8h.2-f3.6b-0.1`** · 44 países |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.6g-1** | **Manila amor @ 502 words** — margen mínimo |
| **R-F3.6g-2** | **Ho Chi Minh City naming EN** |
| **R-F3.6g-3** | **Homogeneización SEA** — spine/packs compartidos |
| **R-F3.6g-4** | **Cache browser** post-deploy |
| **R-F3.4b-1** | **7 países WA sin ancla catálogo** |
| **OP-3** | **`dist/` sucio post-deploy** · no commiteado |

---

## XI. Git status (post F3.6g)

```
HEAD local: F3.6g — f3.6g sea plus production checkpoint
Runtime + doc prev: bbcd7f4 — f3.6 sea plus resolver catalog checkpoint
origin/main: bbcd7f4 (post F3.6f push; +1 doc commit local post-F3.6g)

Rama: main
src/: limpio
docs/: limpio post F3.6g
scripts/: limpio
dist/: modificado / untracked (NO commiteado)
Producción: 44 resolver / 38 catálogo live @ F3.6f
```

---

## XII. Siguiente fase

### **F3.7a — South Asian Expansion Audit**

Auditoría READ-ONLY: gap South Asian (PK · BD · LK · NP · etc.) · resolver vs catálogo vs packs · roadmap Wave siguiente.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.6G_SEA_PLUS_PRODUCTION_CHECKPOINT.md` | Cierre F3.6 prod |
| `F3.6_SEA_PLUS_RESOLVER_CATALOG_CHECKPOINT.md` | Cierre F3.6b+c runtime |
| `F3.4B_WEST_AFRICAN_CATALOG_WAVE_A_CHECKPOINT.md` | Catálogo WA Wave A |
| `F3.3G_WEST_AFRICAN_PRODUCTION_CHECKPOINT.md` | Editorial WA prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.6g · Prod 44/38/37 @ 3.8h.2-f3.6b-0.1 + 3.8f.1-f3.6c-0.1 · origin/main bbcd7f4 · Siguiente F3.7a SA audit*
