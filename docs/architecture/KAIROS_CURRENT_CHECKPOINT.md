# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **up to date with `origin/main`**  
**HEAD repo:** `b3342ee` — `pref1 f1.8 master handoff`  
**Runtime LATAM (`src/`):** `ce69f09` — `pref1 latam sparse premium hotfix`  
**Producción live:** **LATAM desplegado** · runtime efectivo @ `ce69f09` (deploy PRE-F1.9b)  
**Checkpoint LATAM:** `docs/architecture/PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` · handoff `KAIROS_MASTER_HANDOFF_F1.8.md`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`) con **resolver editorial unificado** (26 países, **6 familias**), **deduplicación editorial P0+P1+P2**, **sparse fallback** y familia **LATAM live en producción**.

**PRE-F1 cerrado.** Cadena LATAM integrada (`a8d4a60` → `ce69f09`), pusheada a GitHub (PRE-F1.9a), desplegada a producción (PRE-F1.9b) y documentada (PRE-F1.9c).

**Producción** (https://kairos-maps-mvp.web.app) — **LATAM live** · `mexico` · `argentina` · `brazil` · `peru` → resolver **`LATAM`**. Premium beta con `?premium=1`; producto free sin beta visible.

**Staging** (https://kairos-maps-dev.web.app) — paridad editorial con prod @ runtime `ce69f09`.

**Smokes gate deploy (PRE-F1.9b pre-deploy):** **5/5 PASS**.  
**QA post-deploy producción LATAM:** BA/trabajo/sparse · CDMX/amor · Río/descanso · Lima/trabajo — **PASS**.

**Métricas editoriales verificadas (prod post-F1.9b):** P03/P06/P10 **0** · IBERIAN leak **0** · split-brain **0** en lecturas normales · palabras **500–900** · NY sparse footer live.

**Riesgos vivos:** BA sparse `regionN:null` (metadata only) · `DEFAULT_FAMILY = IBERIAN` para países no mapeados · `dist/` sucio post-deploy (no commiteado) · bundle premium cargado en free · `localStorage kairosPremiumBeta=1`.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit / evidencia | Qué cerró |
|------|--------|-------------------|-----------|
| **PRE-F1.3** — LATAM editorial runtime integration | ✅ Cerrado | `a8d4a60` | 6ª familia · 14 tablas · MX/AR/BR/PE · smokes 10/10 · QA 33/33 |
| **PRE-F1.4** — LATAM integration checkpoint | ✅ Cerrado | `41bad5a` | Doc trazabilidad · frozen runtime v1 |
| **PRE-F1.5** — Staging deploy LATAM | ✅ Cerrado | deploy staging | Primera subida LATAM staging |
| **PRE-F1.6** — Manual browser QA | ✅ Cerrado | auditoría | 11 PASS · 1 WATCH (pre-hotfix) |
| **PRE-F1.7** — Sparse premium hotfix | ✅ Cerrado | `ce69f09` | Fix cognate `control` · BA/trabajo/sparse `ok:true` |
| **PRE-F1.8** — Staging re-deploy post hotfix | ✅ Cerrado | deploy staging | Hotfix live staging |
| **PRE-F1.8b** — Master handoff doc | ✅ Cerrado | `b3342ee` | `KAIROS_MASTER_HANDOFF_F1.8.md` |
| **PRE-F1.9** — Production readiness audit | ✅ Cerrado | read-only | Verdict **READY FOR PROD** |
| **PRE-F1.9a** — Push LATAM stack | ✅ Cerrado | push | `7247f1e..b3342ee` → `origin/main` |
| **PRE-F1.9b** — Controlled prod deploy LATAM | ✅ Cerrado | deploy prod | `./scripts/deploy-prod.sh` · 5/5 smokes · QA prod PASS |
| **PRE-F1.9c** — Post-prod checkpoint doc | ✅ Cerrado | doc-only | Este documento |

### Serie 3.8h base (referencia)

Resolver unificado · dedup P0/P1/P2 · premium UI beta · sparse NY · prod histórico `33f3ec8` (pre-LATAM) · sustituido editorialmente por stack `ce69f09`.

---

## III. Métricas registradas (producción post PRE-F1.9b)

### Smokes pre-deploy (PRE-F1.9b)

| Smoke | Resultado |
|-------|-----------|
| `dev-latam-editorial-integration-smoke.sh` | **PASS** |
| `dev-city-premium-composition-smoke.sh` | **PASS** |
| `dev-narrative-intelligence-smoke.sh` | **PASS** |
| `dev-editorial-dedup-smoke.sh` | **PASS** |
| `dev-premium-ui-beta-smoke.sh` | **PASS** |

**Total:** **5/5 PASS** antes de `./scripts/deploy-prod.sh`.

### QA post-deploy producción LATAM (PRE-F1.9b)

| Caso | Resultado |
|------|-----------|
| Buenos Aires / trabajo / sparse | **PASS** — `ok:true` · `englishThemeHit:null` · premium renderiza |
| Ciudad de México / amor | **PASS** — `regionFamily LATAM` · IBERIAN leak 0 |
| Río de Janeiro / descanso | **PASS** — `regionFamily LATAM` · IBERIAN leak 0 |
| Lima / trabajo | **PASS** — `regionFamily LATAM` · IBERIAN leak 0 |

**Gates globales QA:** split-brain **0** (lecturas normales) · P03/P06/P10 **0** · palabras **500–900** · sin `plaza` · `sobremesa` · `barrio` · `compañía cotidiana`.

**WATCH (no bloqueante):** BA/trabajo/sparse — `narrativeContext.regionFamily` = `null` (metadata only; lectura OK).

### Editorial / arquitectura (prod verificado)

| Métrica | Valor |
|---------|-------|
| **Producción base** | https://kairos-maps-mvp.web.app — **OK** |
| **Producción premium** | https://kairos-maps-mvp.web.app/?premium=1 — **OK** · LATAM live |
| **Staging premium** | https://kairos-maps-dev.web.app/?premium=1 — **OK** · paridad `ce69f09` |
| **Países LATAM live** | `mexico` · `argentina` · `brazil` · `peru` → **LATAM** |
| **split-brain** | **0** (lecturas piloto normales) |
| **IBERIAN leak** | **0** |
| **P03 / P06 / P10** | **0** |
| **NY sparse fallback** | **Live** |
| **`KairosEditorialFamily`** | 6 familias · UI beta gated por `?premium=1` |

---

## IV. Deuda operativa viva

| ID | Descripción |
|----|-------------|
| **OP-1** | Bundle premium cargado para usuarios free (scripts en `index.html`, UI oculta) |
| **OP-2** | `localStorage kairosPremiumBeta=1` activa beta sin URL |
| **OP-3** | **`dist/`** modificado por deploy prod — **no commitear** salvo política release |
| **R-F1-1** | BA sparse `regionN:null` — metadata only · monitorear |
| **R-F1-2** | `DEFAULT_FAMILY = IBERIAN` — ~167 países sin mapeo explícito · riesgo leak editorial |

---

## V. Qué está cerrado (runtime `src/` @ `ce69f09`)

### Resolver + regionalización (6 familias)

- `editorial-family-resolver.js` — SSOT: IBERIAN · MEDITERRANEAN · ANGLO · EAST_ASIAN · AFRICAN_COASTAL · **LATAM**
- MX/AR/BR/PE → **LATAM** en prod y staging
- Regionalización knowledge · narrative spine · goal pads · micro-transitions (14 tablas LATAM)

### Editorial deduplication + premium beta

- Dedup P0/P1/P2 · sparse fallback · premium UI beta (`?premium=1`)
- Hotfix cognate `control` @ `ce69f09`

---

## VI. Qué NO tocar (salvo instrucción explícita)

| Área | Motivo |
|------|--------|
| **`src/engines/astro.js`** | Motor congelado |
| **`dist/`** | Artefacto deploy; no SSOT; no commitear salvo release explícito |
| **Deploy adicional** | Prod LATAM live; cambios requieren ciclo smoke → staging → prod |
| **Motores legacy congelados** | Ver skill KAIROS |

---

## VII. Staging / producción

| Entorno | URL | Estado |
|---------|-----|--------|
| **Producción** | https://kairos-maps-mvp.web.app | **LIVE LATAM** · runtime @ `ce69f09` |
| **Producción premium** | https://kairos-maps-mvp.web.app/?premium=1 | Beta · LATAM · sparse NY |
| **Staging** | https://kairos-maps-dev.web.app | **OK** — paridad prod |
| **Staging premium** | https://kairos-maps-dev.web.app/?premium=1 | Beta · LATAM |

**Deploy producción LATAM (PRE-F1.9b):** `./scripts/deploy-prod.sh` (confirmación `DEPLOY-PROD`) — sync `src/` → `dist/` · `hosting:prod` only · 26 mayo 2026.

---

## VIII. Smokes gate actuales

```bash
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado verificado PRE-F1.9b pre-deploy:** **5/5 PASS**.

---

## IX. Git status (26 mayo 2026, post PRE-F1.9c)

```
HEAD: b3342ee — pref1 f1.8 master handoff (doc)
      ce69f09 — pref1 latam sparse premium hotfix (runtime LATAM)
      a8d4a60 — pref1 latam editorial runtime integration

Rama: main · up to date with origin/main
src/: limpio @ ce69f09
dist/: modificado / untracked (NO commiteado · post-deploy rsync)
Producción: LATAM live @ ce69f09 runtime
```

---

## X. Siguiente fase recomendada

### **F2.1 — DEFAULT neutral / Regional Expansion Roadmap**

1. Auditoría cobertura global (~26/193 países mapeados explícitamente).
2. Diseño familias adicionales (WESTERN_EUROPE · NORDIC · SOUTHEAST_ASIAN · etc.).
3. **`DEFAULT_FAMILY` neutro** — prioridad para eliminar leak IBERIAN en países no curados.
4. Sin copy runtime hasta fase F2.2+ explícita.

Ver handoff: `docs/architecture/KAIROS_MASTER_HANDOFF_F1.8.md` §11–12.

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 · nota final producción LATAM |
| `PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` | Trazabilidad integración LATAM PRE-F1.3 |
| `TERRITORIAL_ARCHETYPE_LAYER.md` | Diseño capa territorial |
| `KAIROS_MASTER_AUDIT.md` | Auditoría total |
| `MAPS_AGENT_LIBRARY.md` | Inventario agentes GPT |

---

*Checkpoint actualizado PRE-F1.9c · Commit doc-only · Sin push · Sin deploy · Prod LATAM live @ ce69f09*
