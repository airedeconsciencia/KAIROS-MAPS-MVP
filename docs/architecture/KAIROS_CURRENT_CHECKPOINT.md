# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Último commit cerrado:** `cbcd1f0` — `3.8h5b editorial dedup p1 hotfix`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** cableada en producto (`?premium=1`) con **resolver editorial unificado** (26 países, 5 familias) y **deduplicación editorial P0+P1** cerrada en `src/` y **desplegada en staging**.

**Staging** (https://kairos-maps-dev.web.app) refleja `db04480` + `cbcd1f0` tras deploy 3.8h.5c. **Producción** (https://kairos-maps-mvp.web.app) **intacta** — sin resolver, sin dedup, sin premium beta.

**QA manual staging (3.8h.5d):** score **8.0/10** · PASS **10** · WATCH **5** · FAIL **0**. Staging **OK** para beta editorial con `?premium=1`.

**Deuda P2** documentada (no bloqueante para staging beta). **`dist/`** modificado localmente por deploy — **no commitear** fuera de release explícito.

---

## II. Serie 3.8h — cerrada hasta 3.8h.5d

| Fase | Estado | Commit / evidencia | Qué cerró |
|------|--------|-------------------|-----------|
| **3.8h.2** — Unified Editorial Family Resolver | ✅ Cerrado | `67d9b83` | `editorial-family-resolver.js` · 26 países · split-brain 0 · delegación 3 servicios |
| **3.8h.2a** — Smoke gates variación | ✅ Cerrado | `8005358` | `dev-microtransition-variation-smoke.sh` · `dev-premium-block-variation-smoke.sh` |
| **3.8h.2b** — Premium UI beta | ✅ Cerrado | (staging previo) | `app.js` + `index.html` · `?premium=1` · badge beta |
| **3.8h.3** — Staging post-resolver | ✅ Cerrado | deploy 3.8h.3c | 12/12 smokes pre-deploy PASS · browser 15/15 familyOk · avg ~8.37/10 |
| **3.8h.5** — Editorial dedup P0 | ✅ Cerrado | `db04480` | P03/P06/P10 eliminados · pools regionales · `dev-editorial-dedup-smoke.sh` |
| **3.8h.5b** — Editorial dedup P1 hotfix | ✅ Cerrado | `cbcd1f0` | N01 cola amor · N02 bloque reservado · N03 anti-eco dirección interna |
| **3.8h.5c** — Staging deploy post-dedup | ✅ Cerrado | deploy local (sin commit dist) | `src/` → `dist/` → `hosting:staging` · 5/5 smokes PASS |
| **3.8h.5d** — Manual QA staging | ✅ Cerrado | auditoría browser | Score 8.0 · PASS 10 / WATCH 5 / FAIL 0 · producción intacta |
| **3.8h.5e** — Checkpoint | ✅ Este doc | — | Cierre operativo serie dedup |

**Auditorías doc-only (sin commit código):** 3.8h.3a/3.8h.3b (técnica + editorial) · 3.8h.4 (dedup design) · 3.8h.5a (post-dedup Node QA).

---

## III. Métricas registradas (3.8h.5 staging)

### Smokes

| Gate | Resultado |
|------|-----------|
| **12/12 smokes pre-resolver staging** (3.8h.3c) | **PASS** |
| **5/5 smokes post-dedup staging** (3.8h.5c) | **PASS** — dedup · resolver · composition · narrative · premium-ui-beta |

### Editorial / arquitectura

| Métrica | Valor |
|---------|-------|
| **Staging** | **OK** — https://kairos-maps-dev.web.app/?premium=1 |
| **Producción** | **Intacta** — sin `editorial-family-resolver.js` (404) |
| **split-brain** | **0** |
| **IBERIAN leak** (sobremesa/plaza en no-IBERIAN) | **0** |
| **P03** («puede que descubras una puerta») | **0** |
| **P06** («el ritmo del cuerpo vuelve a importar») | **0** |
| **P10** («lo que sigue no corrige») | **0** |
| **«bloque reservado»** (QA piloto) | **0** |
| **Cola amor universal** (5/5 amor) | **0** |
| **Score QA manual staging** (3.8h.5d) | **8.0/10** |
| **Veredictos QA manual** | **PASS 10 · WATCH 5 · FAIL 0** |

### Comparación scores

| Momento | Score | Notas |
|---------|-------|-------|
| 3.8h.3c browser (pre-dedup) | ~8.37/10 | Con P03/P06/P10 presentes |
| 3.8h.5a Node (post-P0) | 7.63/10 | Artefactos N01–N03 |
| 3.8h.5b Node (post-P1) | 8.07/10 | P1 corregido |
| 3.8h.5d manual staging | **8.0/10** | Paridad producto staging |

---

## IV. Deuda pendiente P2 (no bloqueante staging beta)

| ID | Descripción | Origen |
|----|-------------|--------|
| **P2-1** | **Nueva York sin influencias ranked** puede no renderizar panel premium UI (fallback clásico) | 3.8h.5d manual QA |
| **P2-2** | Cierre compartido «La coherencia no tiene que ser total: basta una pausa real que te sostenga.» (descanso ANGLO/EAST_ASIAN) | 3.8h.5d |
| **P2-3** | Duplicidad editorial **Cairo/Nairobi** amor (favorece) y trabajo (conflicto) | 3.8h.5d |
| **P2-4** | Eco semántico «tu sentido» en **Londres/trabajo** (síntesis) | 3.8h.5b residual |
| **P2-5** | **`dist/`** modificado por deploy 3.8h.5c — **no commitear** fuera de release explícito | Operativo |

---

## V. Qué está cerrado (runtime `src/` @ `cbcd1f0`)

### Resolver + regionalización (3.8h.2 + 3.8f.7)

- `editorial-family-resolver.js` — SSOT familias (IBERIAN · MEDITERRANEAN · ANGLO · EAST_ASIAN · AFRICAN_COASTAL)
- Regionalización knowledge · narrative spine · goal pads · micro-transitions (smokes 7c–7e PASS)

### Editorial deduplication (3.8h.5 + 3.8h.5b)

- `SPINE_FAVORECE_OPEN_BY_REGION` · `HUMAN_THEME_PATTERNS_BY_REGION` (amor/trabajo/descanso)
- `SUMMARY_FRAME_POOL_BY_REGION` · `applyPhraseEchoControl()` · ban `bloque reservado`
- Smoke: `dev-editorial-dedup-smoke.sh` (P0 + P1 gates)

### Premium beta UI (3.8h.2b)

- `app.js` — `isPremiumBetaEnabled()` · `renderPremiumReading()` · toggle profundo/clásico
- `index.html` — carga resolver + servicios premium · cache-bust `3.8h2`

---

## VI. Qué NO tocar (salvo instrucción explícita)

| Área | Motivo |
|------|--------|
| **`src/engines/astro.js`** | Motor congelado |
| **`dist/`** | Artefacto deploy; no SSOT; no commitear salvo release |
| **`.DS_Store`** | Nunca commitear |
| **Deploy producción** | Sin aprobación explícita post-QA |
| **Firebase prod** | Staging OK ≠ prod release |
| **Ampliación ciudades/países** | Fuera de scope 3.8h |

---

## VII. Staging / producción

| Entorno | URL | Estado |
|---------|-----|--------|
| **Staging** | https://kairos-maps-dev.web.app | **OK** — resolver + dedup P0/P1 · `?premium=1` |
| **Staging premium** | https://kairos-maps-dev.web.app/?premium=1 | Beta badge · `KairosEditorialFamily` presente |
| **Producción** | https://kairos-maps-mvp.web.app | **Intacta** — Fase 1.x · sin 3.8h |

**Deploy staging (3.8h.5c):** `./scripts/deploy-staging.sh` — sync `src/` → `dist/` · `hosting:staging` only.

---

## VIII. Smokes gate actuales (post-dedup)

```bash
# Gate editorial dedup (P0 + P1)
./scripts/dev-editorial-dedup-smoke.sh

# Gate resolver + composición
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado verificado 3.8h.5c/5d:** **5/5 PASS** (post-dedup staging).

---

## IX. Git status (26 mayo 2026, post-3.8h.5e doc)

```
HEAD: cbcd1f0 — 3.8h5b editorial dedup p1 hotfix
      db04480 — 3.8h5 editorial deduplication p0
      8005358 — 3.8h2a commit pending premium variation smoke gates
      67d9b83 — 3.8h2 unified editorial family resolver

Rama: main
src/: limpio @ cbcd1f0
dist/: modificado por deploy 3.8h.5c (NO commiteado)
.DS_Store: modificado (NO commitear)
docs/architecture/KAIROS_CURRENT_CHECKPOINT.md: actualizado 3.8h.5e
```

---

## X. Siguiente fase recomendada

### **3.8h.6 — Editorial P2 polish** (recomendada)

Quirúrgica sobre deuda P2-1…P2-4 sin reabrir resolver ni familias:

1. Path NY sin influencias → premium fail-soft o mínimo viable
2. Rotar cierre descanso compartido
3. Diferenciar favorece/conflicto Cairo vs Nairobi
4. Anti-eco fino «tu sentido» Londres/trabajo

**Gate:** smokes 3.8h.5 + QA manual 15 lecturas · score ≥ 8.0 · WATCH ≤ 3.

### Alternativas (requieren aprobación explícita)

| Fase | Cuándo |
|------|--------|
| **3.8h.7** | Deploy producción premium beta (post-P2 o aceptando WATCH) |
| **3.8i** | Ampliación territorial / ciudades (fuera dedup) |

**Recomendación operativa:** **3.8h.6 P2** → re-QA staging → decisión prod **3.8h.7**.

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `TERRITORIAL_ARCHETYPE_LAYER.md` | Diseño capa territorial (3.8h.0) |
| `CITY_ATMOSPHERE_LIBRARY.md` | Biblioteca editorial 5 ciudades |
| `KAIROS_MASTER_AUDIT.md` | Auditoría total |
| `MAPS_AGENT_LIBRARY.md` | Inventario agentes GPT |

---

*Checkpoint actualizado Fase 3.8h.5e · Commit doc-only · Sin push · Sin deploy*
