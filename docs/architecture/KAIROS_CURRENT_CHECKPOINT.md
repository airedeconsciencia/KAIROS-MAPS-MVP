# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Último commit cerrado:** `33f3ec8` — `3.8h6 editorial p2 polish`  
**Producción live:** `33f3ec8` (deploy 3.8h.7b · 26 mayo 2026)

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`) con **resolver editorial unificado** (26 países, 5 familias), **deduplicación editorial P0+P1+P2** y **sparse fallback** para zonas neutra (NY sin influencias ranked).

**Producción** (https://kairos-maps-mvp.web.app) desplegada con HEAD **`33f3ec8`** tras smokes 5/5 PASS y QA post-deploy 7/7 PASS. Premium beta **live** con `?premium=1`; producto **free sin beta visible** (toggle oculto).

**Staging** (https://kairos-maps-dev.web.app) alineado con el mismo bloque editorial desde 3.8h.6a.

**Métricas editoriales verificadas:** P03/P06/P10 **0** · IBERIAN **0** · split-brain **0** · NY sparse footer **«zona neutra (lectura orientativa)»** live en prod.

**Riesgos vivos:** bundle premium cargado para usuarios free · `localStorage kairosPremiumBeta=1` activa beta · `dist/` modificado por deploy · commits **sin push** remoto.

---

## II. Serie 3.8h — cerrada hasta 3.8h.7b

| Fase | Estado | Commit / evidencia | Qué cerró |
|------|--------|-------------------|-----------|
| **3.8h.2** — Unified Editorial Family Resolver | ✅ Cerrado | `67d9b83` | `editorial-family-resolver.js` · 26 países · split-brain 0 |
| **3.8h.2a** — Smoke gates variación | ✅ Cerrado | `8005358` | microtransition + premium-block variation smokes |
| **3.8h.2b** — Premium UI beta | ✅ Cerrado | (en prod post-7b) | `app.js` + `index.html` · `?premium=1` · badge beta |
| **3.8h.3** — Staging post-resolver | ✅ Cerrado | deploy 3.8h.3c | 12/12 smokes pre-deploy PASS |
| **3.8h.5** — Editorial dedup P0 | ✅ Cerrado | `db04480` | P03/P06/P10 eliminados · pools regionales |
| **3.8h.5b** — Editorial dedup P1 hotfix | ✅ Cerrado | `cbcd1f0` | N01 cola amor · N02 bloque reservado · N03 anti-eco |
| **3.8h.5c** — Staging deploy post-dedup | ✅ Cerrado | deploy local | `hosting:staging` · 5/5 smokes PASS |
| **3.8h.5d** — Manual QA staging | ✅ Cerrado | auditoría browser | Score 8.0 · PASS 10 / WATCH 5 / FAIL 0 |
| **3.8h.5e** — Checkpoint dedup | ✅ Cerrado | `fdf2e55` | Doc cierre serie dedup |
| **3.8h.6** — Editorial P2 polish | ✅ Cerrado | `33f3ec8` | P2-1 sparse fallback · P2-2 cierres · P2-3 Cairo/Nairobi · P2-4 anti-eco |
| **3.8h.6a** — Staging sparse QA | ✅ Cerrado | deploy staging | NY sparse validado · QA 15 lect avg 8.48 |
| **3.8h.7** — RC audit pre-prod | ✅ Cerrado | auditoría | READY FOR PROD · smokes 5/5 · QA 7/7 |
| **3.8h.7b** — Controlled prod deploy | ✅ Cerrado | deploy prod | `./scripts/deploy-prod.sh` · QA post-deploy 7/7 PASS |
| **3.8h.7c** — Checkpoint post-prod | ✅ Este doc | — | Cierre operativo deploy producción |

---

## III. Métricas registradas (producción @ `33f3ec8`)

### Smokes pre-deploy (3.8h.7b)

| Smoke | Resultado |
|-------|-----------|
| `dev-editorial-dedup-smoke.sh` | **PASS** (P0 + P1 + P2) |
| `dev-editorial-family-resolver-smoke.sh` | **PASS** |
| `dev-city-premium-composition-smoke.sh` | **PASS** |
| `dev-narrative-intelligence-smoke.sh` | **PASS** |
| `dev-premium-ui-beta-smoke.sh` | **PASS** |

**Total:** **5/5 PASS** antes de `./scripts/deploy-prod.sh`.

### QA post-deploy producción (3.8h.7b)

| Caso | Resultado |
|------|-----------|
| Nueva York amor / trabajo / descanso (sparse) | **PASS** (3/3) |
| Londres trabajo | **PASS** |
| Seúl amor | **PASS** |
| El Cairo descanso | **PASS** |
| Nairobi trabajo | **PASS** |

**Total:** **7/7 PASS** · FAIL **0**

### Editorial / arquitectura (prod verificado)

| Métrica | Valor |
|---------|-------|
| **Producción base** | https://kairos-maps-mvp.web.app — **OK** · sin beta visible |
| **Producción premium** | https://kairos-maps-mvp.web.app/?premium=1 — **OK** · toggle + lectura profunda |
| **Staging** | https://kairos-maps-dev.web.app/?premium=1 — **OK** (mismo bloque) |
| **split-brain** | **0** |
| **IBERIAN leak** | **0** |
| **P03 / P06 / P10** | **0** |
| **NY sparse fallback** | **Live** — footer «zona neutra (lectura orientativa)» |
| **`KairosEditorialFamily`** | Presente tras carga scripts · **UI beta gated** por `?premium=1` |

### Comparación scores (referencia)

| Momento | Score / veredicto | Notas |
|---------|-------------------|-------|
| 3.8h.5d manual staging | 8.0 · PASS 10 / WATCH 5 | Pre-P2 |
| 3.8h.6 Node QA 15 lect | avg 8.46 · PASS 15 / WATCH 0 | Post-P2 |
| 3.8h.6a staging sparse | avg 8.48 · PASS 15 / WATCH 0 | NY sparse validado |
| 3.8h.7b prod QA mínima | **7/7 PASS** | Compositor @ HEAD |

---

## IV. Deuda P2 — cerrada en 3.8h.6

| ID | Estado | Resolución |
|----|--------|------------|
| **P2-1** | ✅ Cerrado | `sparseInfluencesFallback` · premium antes de panel ZONA NEUTRA |
| **P2-2** | ✅ Cerrado | Cierres descanso rotados · sin «coherencia no tiene que ser total» |
| **P2-3** | ✅ Cerrado | `AFRICAN_CITY_MICRO` + favorece Cairo/Nairobi diferenciados |
| **P2-4** | ✅ Cerrado | Anti-eco «tu sentido» · frame ANGLO/trabajo ajustado |

**Deuda operativa viva (no código):**

| ID | Descripción |
|----|-------------|
| **OP-1** | Bundle premium cargado para usuarios free (scripts en `index.html`, UI oculta) |
| **OP-2** | `localStorage kairosPremiumBeta=1` activa beta sin URL |
| **OP-3** | **`dist/`** modificado por deploy prod — **no commitear** salvo política release |
| **OP-4** | Commits locales **sin push** remoto |

---

## V. Qué está cerrado (runtime `src/` @ `33f3ec8`)

### Resolver + regionalización (3.8h.2 + 3.8f.7)

- `editorial-family-resolver.js` — SSOT familias (IBERIAN · MEDITERRANEAN · ANGLO · EAST_ASIAN · AFRICAN_COASTAL)
- Regionalización knowledge · narrative spine · goal pads · micro-transitions

### Editorial deduplication (3.8h.5 + 3.8h.5b + 3.8h.6)

- `SPINE_FAVORECE_OPEN_BY_REGION` · `HUMAN_THEME_PATTERNS_BY_REGION`
- `SUMMARY_FRAME_POOL_BY_REGION` · `applyPhraseEchoControl()` · ban `bloque reservado`
- P2: sparse fallback · cierres rotados · `AFRICAN_CITY_MICRO` · anti-eco `tu sentido`
- Smoke: `dev-editorial-dedup-smoke.sh` (P0 + P1 + P2 gates)

### Premium beta UI (3.8h.2b + 3.8h.6 P2-1)

- `isPremiumBetaEnabled()` · `renderPremiumReading()` · toggle profundo/clásico
- Sparse NY: footer «zona neutra (lectura orientativa)»
- `index.html` — pipeline premium + resolver · cache-bust `3.8h2`

---

## VI. Qué NO tocar (salvo instrucción explícita)

| Área | Motivo |
|------|--------|
| **`src/engines/astro.js`** | Motor congelado |
| **`dist/`** | Artefacto deploy; no SSOT; no commitear salvo release explícito |
| **`.DS_Store`** | Nunca commitear |
| **Deploy adicional** | Prod ya en `33f3ec8`; cambios nuevos requieren ciclo smoke → staging → prod |
| **Ampliación ciudades/países** | Fuera scope 3.8h editorial |

---

## VII. Staging / producción

| Entorno | URL | Estado |
|---------|-----|--------|
| **Producción** | https://kairos-maps-mvp.web.app | **LIVE @ `33f3ec8`** · free sin beta visible |
| **Producción premium** | https://kairos-maps-mvp.web.app/?premium=1 | Beta badge · sparse NY · resolver activo |
| **Staging** | https://kairos-maps-dev.web.app | **OK** — paridad editorial con prod |
| **Staging premium** | https://kairos-maps-dev.web.app/?premium=1 | Beta · validado 3.8h.6a |

**Deploy producción (3.8h.7b):** `./scripts/deploy-prod.sh` (confirmación `DEPLOY-PROD`) — sync `src/` → `dist/` · `hosting:prod` only.

---

## VIII. Smokes gate actuales

```bash
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado verificado 3.8h.7b pre-deploy:** **5/5 PASS**.

---

## IX. Git status (26 mayo 2026, post-3.8h.7b deploy)

```
HEAD: 33f3ec8 — 3.8h6 editorial p2 polish
      fdf2e55 — 3.8h5e checkpoint post editorial dedup staging
      cbcd1f0 — 3.8h5b editorial dedup p1 hotfix
      db04480 — 3.8h5 editorial deduplication p0
      67d9b83 — 3.8h2 unified editorial family resolver

Rama: main
src/: limpio @ 33f3ec8
dist/: modificado por deploy 3.8h.7b prod (NO commiteado)
.DS_Store: modificado (NO commitear)
Commits: sin push remoto
```

---

## X. Siguiente fase recomendada

### **Push remoto + backup** (recomendado inmediato)

Sincronizar `main` local con remoto para preservar la cadena `67d9b83` → `33f3ec8` + doc 3.8h.7c. **No urgente para prod** (ya live), **sí urgente para continuidad del repo**.

### Alternativas posteriores (requieren aprobación explícita)

| Fase | Cuándo |
|------|--------|
| **3.8h.8** | Copy hardening sparse NY («amplifica» en knowledge blocks) |
| **3.8i** | Ampliación territorial / ciudades |
| **3.8j** | Premium beta visible sin query param (decisión producto) |

**Recomendación operativa:** **push remoto** → monitor prod 48h → opcional 3.8h.8 copy.

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `TERRITORIAL_ARCHETYPE_LAYER.md` | Diseño capa territorial (3.8h.0) |
| `CITY_ATMOSPHERE_LIBRARY.md` | Biblioteca editorial 5 ciudades |
| `KAIROS_MASTER_AUDIT.md` | Auditoría total |
| `MAPS_AGENT_LIBRARY.md` | Inventario agentes GPT |

---

*Checkpoint actualizado Fase 3.8h.7c · Commit doc-only · Sin push · Sin deploy*
