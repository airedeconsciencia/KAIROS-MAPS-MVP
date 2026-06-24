# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**HEAD local:** F3.13j doc checkpoint (post E1b prod)  
**Checkpoint F3.13:** `docs/architecture/F3.13J_RESOLVER_EXPANSION_E1B_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.11:** `docs/architecture/F3.11N_WEST_AFRICAN_WAVE_C_BATCH_2_PRODUCTION_CHECKPOINT.md`  
**Checkpoint F3.10j:** `docs/architecture/F3.10J_C_SAO_PAULO_GATE_DECISION.md`  
**Producción live:** catálogo **`3.8f.1-f3.13b-0.1`** · **59 ciudades / 56 países** · editorial EFR **`3.8h.2-f3.13b-0.1`** · **56 países** · **11 familias** · **WA 10/10**

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (**56 países** · **11 familias** live en prod), dedup P0–P2, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, y catálogo **`59 ciudades / 56 países`** con **E1b WE expansion** (Bruselas · Varsovia · Praga) además de **E1a** (Oslo · Zúrich · Viena), **WA Wave C 10/10**, **Densification Wave A**, **LATAM+**, **SA+** y **SEA+**.

**PRE-F1 cerrado** · **F2.2–F2.9 serie cerrada** · **F3.3–F3.11 series cerradas** · **F3.13 E1a + E1b cerradas en prod** · **F3.10 São Paulo gate cerrado (NO catálogo)**.

**Producción** (https://kairos-maps-mvp.web.app) — resolver **`3.8h.2-f3.13b-0.1`** · catálogo **`3.8f.1-f3.13b-0.1`** · **59/56** live · **WA 10/10**.

**São Paulo:** **NO catálogo** · runtime j-a/b aparcado en rama `f3.10j-urban-layer` (sin merge a main).

**Riesgos vivos:** cache browser `cities-catalog.js` · homogeneización WA/WE · 5 smokes drift 6→11 · `dist/` sucio · Mumbai sin archetype · Madrid/Barcelona · Delhi/Mumbai.

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
| **F3.6a–F3.6g** | ✅ Cerrado | SEA+ prod 38/37 |
| **F3.7a–F3.7g** | ✅ Cerrado | SA+ prod 48/42/41 |
| **F3.8a–F3.8g** | ✅ Cerrado | LATAM+ prod 50/44/43 |
| **F3.9a–F3.9g** | ✅ Cerrado | WA Wave B prod 45/44 |
| **F3.10a–F3.10j-c1** | ✅ Cerrado | Densification Wave A prod 47/44 · São Paulo NO catálogo |
| **F3.11a–F3.11n** | ✅ Cerrado | WA Wave C prod **53/50** · **10/10** |
| **F3.12a** | ✅ Audit | Global Coverage Audit |
| **F3.13a–F3.13e** | ✅ Cerrado | **E1a prod 56/53** · resolver **+3** |
| **F3.13f–F3.13j** | ✅ Cerrado | **E1b prod 59/56** · resolver **+3** |
| **F3.13k** | ⏳ Siguiente | **Resolver Expansion E1c Audit** |

---

## V. F3.13 — qué cambió en prod (E1a + E1b)

### Resolver + catálogo E1a (F3.13d)

- **50→53 países resolver** · **53→56 ciudades** · **50→53 países visibles**
- Oslo · Zúrich · Viena → **`WESTERN_EUROPE`**
- **Schema resolver:** `3.8h.2-f3.8b-0.1` → **`3.8h.2-f3.13a-0.1`**
- **Schema catálogo:** `3.8f.1-f3.11j-0.1` → **`3.8f.1-f3.13a-0.1`**

### Resolver + catálogo E1b (F3.13i)

- **53→56 países resolver** · **56→59 ciudades** · **53→56 países visibles**
- Bruselas · Varsovia · Praga → **`WESTERN_EUROPE`**
- **Schema resolver:** `3.8h.2-f3.13a-0.1` → **`3.8h.2-f3.13b-0.1`**
- **Schema catálogo:** `3.8f.1-f3.13a-0.1` → **`3.8f.1-f3.13b-0.1`**

### Canario GLOBAL_NEUTRAL

- **Reykjavik / Iceland** → canario GN en smokes (sin cambio en E1b)
- E1a migró canario de Oslo → Reykjavik; E1b no alteró GN

### No cambió

- **Familias** — **11**
- **Copy / packs / narrative** — sin cambio editorial nuevo
- **WA 10/10** — sin cambio
- **São Paulo** — no añadido

---

## VI. Resolver + catálogo SSOT

| Métrica | Prod live |
|---------|-----------|
| Familias editoriales | **11** |
| Países resolver | **56** |
| Ciudades catálogo | **59** |
| Países catálogo visibles | **56** |
| WA anclas catálogo | **10/10** |
| Schema resolver | **`3.8h.2-f3.13b-0.1`** |
| Schema catálogo | **`3.8f.1-f3.13b-0.1`** |

**E1b anclas:** Bruselas · Varsovia · Praga

**E1a anclas:** Oslo · Zúrich · Viena

**WA anclas (10/10):** Lagos · Accra · Dakar · Abidjan · Freetown · Monrovia · Conakry · Cotonou · Lomé · Banjul

---

## VII. Smokes gate actuales

```bash
./scripts/dev-cities-catalog-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-west-african-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-south-asian-editorial-integration-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
```

**Gate F3.13i pre-deploy:** **9/9 PASS** · QA prod curl **f3.13b PASS**

---

## VIII. Staging / producción

| Entorno | URL | Catálogo | Editorial |
|---------|-----|----------|-----------|
| **Producción** | https://kairos-maps-mvp.web.app | **59** @ `3.8f.1-f3.13b-0.1` | **`3.8h.2-f3.13b-0.1`** · 56 países |
| **Staging** | https://kairos-maps-dev.web.app | **59** @ `3.8f.1-f3.13b-0.1` | **`3.8h.2-f3.13b-0.1`** · 56 países |

---

## IX. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F3.13j-1** | **Cache browser** — `cities-catalog.js` sin query version |
| **R-F3.13j-2** | **5 smokes globales drift 6→11 familias** — preexistentes |
| **R-F3.13j-3** | **`dist/` sucio local** — no commiteado |
| **R-F3.13j-4** | **Homogeneización WE** — 10 ciudades comparten pack |
| **R-F3.11n-1** | **Homogeneización WA 10/10** |
| **R-F3.10j-c-1** | **São Paulo NO catálogo** |

---

## X. Git status (post F3.13j)

```
HEAD runtime: be5aca5 — f3.13g resolver expansion e1b
HEAD doc: F3.13j — f3.13j resolver expansion e1b production checkpoint
Rama: main
src/: limpio (committed @ be5aca5)
docs/: F3.13J + KAIROS_CURRENT actualizado
dist/: modificado / untracked (NO commiteado)
Producción runtime: 59/56 @ 3.8f.1-f3.13b-0.1
```

---

## XI. Siguiente fase

### **F3.13k — Resolver Expansion E1c Audit**

Auditoría READ-ONLY: Dinamarca · Finlandia (siguiente batch WE europeo).

---

## XII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F3.13J_RESOLVER_EXPANSION_E1B_PRODUCTION_CHECKPOINT.md` | Cierre F3.13 E1b prod |
| `F3.13E_RESOLVER_EXPANSION_E1A_PRODUCTION_CHECKPOINT.md` | Checkpoint E1a prod 56/53 |
| `F3.11N_WEST_AFRICAN_WAVE_C_BATCH_2_PRODUCTION_CHECKPOINT.md` | Checkpoint previo 53/50 |
| `F3.10J_C_SAO_PAULO_GATE_DECISION.md` | Decisión gate São Paulo |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F3.13j · Prod 59/56 @ f3.13b · resolver 56 · WA 10/10 · Siguiente F3.13k E1c audit*
