# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.10j-c1 doc checkpoint (post gate São Paulo)  
**Checkpoint F3.10j:** `docs/architecture/F3.10J_C_SAO_PAULO_GATE_DECISION.md`  
**Checkpoint F3.10:** `docs/architecture/F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.9:** `docs/architecture/F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.8:** `docs/architecture/F3.8G_LATAM_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción live:** catálogo **`3.8f.1-f3.10b-0.1`** · **47 ciudades / 44 países** · editorial EFR **`3.8h.2-f3.8b-0.1`** · **50 países** · **11 familias**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**50 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`47 ciudades / 44 países`** con **Densification Wave A** (Barcelona · Mumbai) además de **WA Wave B** (Abidjan), **WA Wave A**, **LATAM+ Wave A**, **SA+ Wave A** y **SEA+ Wave A**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3 serie cerrada** · **F3.4b catálogo WA Wave A cerrado** · **F3.6 SEA+ serie cerrada en producción** · **F3.7 SA+ serie cerrada en producción** · **F3.8 LATAM+ serie cerrada en producción** · **F3.9 WA Wave B serie cerrada en producción** · **F3.10 Densification Wave A serie cerrada en producción** · **F3.10 São Paulo gate cerrado (NO catálogo)**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.8b-0.1`** · catálogo **`3.8f.1-f3.10b-0.1`** · **47/44** live.

**São Paulo:** **NO catálogo** · **Wave B diferida** · gate numérico FAIL tras j-a/b local.

**Trabajo local aparcado (sin commit runtime):** `LATAM_CITY_MICRO` + `CITY_ATMOSPHERE` Rio/SP en `narrative-intelligence-service.js` · smoke `dev-latam-city-micro-smoke.sh`.

**Riesgos vivos:** homogeneización intra-Brasil · Madrid/Barcelona misma familia · Delhi/Mumbai misma familia · Mumbai sin country archetype · commit accidental runtime parcial · cache browser · **6 países WA sin ancla** · `dist/` sucio.

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
| **F3.10h–F3.10j-c1** | ✅ Cerrado | Gate São Paulo · NO catálogo · doc F3.10j-c |
| **F3.11a** | ⏳ Siguiente | **Territorial Densification Audit** |

---

## V. F3.10 — qué cambió en producción

### Cambió (prod live @ F3.10f)

- **Schema catálogo:** `3.8f.1-f3.9b-0.1` → **`3.8f.1-f3.10b-0.1`**
- **Ciudades catálogo:** 45 → **47** (+ Barcelona · Mumbai)
- **Países visibles:** **44** (sin cambio)

### No cambió

- **Resolver** — **50 países** · `3.8h.2-f3.8b-0.1`
- **Familias** — **11**
- **São Paulo** — **no añadido** (gate FAIL · Wave B diferida)

---

## VI. F3.10j — gate São Paulo (decisión)

| Criterio | Resultado |
|----------|-----------|
| Conflict distinct 3/3 | **PASS** (local j-a/b) |
| Opportunity distinct 3/3 | **PASS** |
| Atmosphere active | **PASS** |
| Hygiene / split-brain | **PASS** |
| Token full < 45% | **FAIL** (56.5%) |
| Char-bigram full < 75% | **FAIL** (84.6%) |

**Decisión:** São Paulo **NO entra al catálogo** · Wave B **diferida** · gate **no relajado** · runtime j-a/b **aparcado** (sin commit).

Ver `F3.10J_C_SAO_PAULO_GATE_DECISION.md`.

---

## VII. Resolver + catálogo SSOT

| Métrica | Prod live | Local `src/` committed |
|---------|-----------|------------------------|
| Familias editoriales | **11** | **11** |
| Países resolver | **50** | **50** |
| Ciudades catálogo | **47** | **47** |
| Países catálogo visibles | **44** | **44** |
| Schema resolver | **`3.8h.2-f3.8b-0.1`** | **`3.8h.2-f3.8b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.10b-0.1`** | **`3.8f.1-f3.10b-0.1`** |

*Local working tree puede tener cambios j-a/b no commiteados en `narrative-intelligence-service.js`.*

---

## VIII. Smokes gate actuales (prod)

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

**Smoke urbano local (no en prod):** `scripts/dev-latam-city-micro-smoke.sh` — untracked · gates numéricos FAIL.

---

## IX. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Staging** | https://kairos-maps-dev.web.app | **47** @ `3.8f.1-f3.10b-0.1` | **`3.8h.2-f3.8b-0.1`** · 50 países |
| **Runtime prod** | — | @ **`1ebae93`** | sin j-a/b |

---

## X. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.10j-c-1** | **Homogeneización intra-Brasil** · gate numérico FAIL |
| **R-F3.10j-c-2** | **Runtime j-a/b aparcado** · no promovido a main |
| **R-F3.10j-c-3** | **Commit accidental** runtime parcial |
| **R-F3.10g-1** | **Madrid/Barcelona misma familia** (MEDITERRANEAN) |
| **R-F3.10g-2** | **Delhi/Mumbai misma familia** (SOUTH_ASIAN) |
| **R-F3.10g-3** | **Mumbai sin country archetype** |
| **R-F3.10g-5** | **Cache browser** post-deploy |
| **R-F3.10g-6** | **`dist/` sucio local** · no commiteado |
| **R-F3.9g-1** | **6 países WA sin ancla catálogo** |

---

## XI. Git status (post F3.10j-c1)

```
HEAD local: F3.10j-c1 — f3.10j sao paulo gate decision checkpoint
origin/main: 1ebae93 (+ doc commit local)

Rama: main
src/: MODIFICADO (j-a/b aparcado — NO en este commit)
scripts/: +dev-latam-city-micro-smoke.sh untracked (NO en este commit)
docs/: +F3.10J_C + KAIROS_CURRENT actualizado
dist/: modificado / untracked (NO commiteado)
Producción runtime: 1ebae93 · 47/44 live
```

---

## XII. Siguiente fase

### **F3.11a — Territorial Densification Audit**

Candidatas tier-1 **sin par intra-país duplicado**. São Paulo fuera de scope Wave B hasta gate PASS.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.10J_C_SAO_PAULO_GATE_DECISION.md` | Decisión gate São Paulo |
| `F3.10G_DENSIFICATION_WAVE_A_PRODUCTION_CHECKPOINT.md` | Cierre F3.10 prod |
| `F3.9G_WEST_AFRICAN_WAVE_B_PRODUCTION_CHECKPOINT.md` | Cierre F3.9 prod |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.10j-c1 · Prod 50/47/44 @ 1ebae93 · São Paulo NO catálogo · Siguiente F3.11a Territorial Densification Audit*
