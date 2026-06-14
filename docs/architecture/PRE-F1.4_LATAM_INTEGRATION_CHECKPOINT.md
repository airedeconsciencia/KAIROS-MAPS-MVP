# PRE-F1.4 — LATAM Integration Checkpoint

**Documento:** trazabilidad editorial post-integración runtime  
**Fase:** PRE-F1.4 (doc-only · sin staging · sin deploy)  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Runtime integrado:** `a8d4a60` — `pref1 latam editorial runtime integration`  
**Producción live (sin cambio):** `33f3ec8` / deploy 3.8h.7b — **LATAM no desplegado**

> **Alcance de este checkpoint:** documentar y cerrar trazabilidad de PRE-F1.3.  
> **No modifica runtime.** No deploy · no push · no `dist/`.

---

## I. Resumen ejecutivo

PRE-F1.3 integró la familia editorial **LATAM** en runtime `src/` de forma atómica: cuatro países migrados desde `IBERIAN`, 14 tablas regionales pobladas, amends editoriales aplicados, smokes **10/10 PASS**, QA piloto **33/33 PASS** (4 ciudades × 3 goals).

**Estado operativo:** integración **cerrada en repo local** (`a8d4a60`). Staging y producción **sin LATAM** hasta PRE-F1.5.

---

## II. Commit de integración

| Campo | Valor |
|-------|-------|
| **Hash** | `a8d4a60` |
| **Mensaje** | `pref1 latam editorial runtime integration` |
| **Fecha** | 2026-06-13 17:43:54 +0200 |
| **Archivos** | 12 (4 `src/services/*` + 8 `scripts/dev-*-smoke.sh`) |
| **Diff** | +664 / −76 líneas |

**Archivos runtime tocados:**

- `src/services/editorial-family-resolver.js`
- `src/services/narrative-intelligence-service.js`
- `src/services/city-premium-composition-service.js`
- `src/services/premium-knowledge-service.js`

---

## III. Países migrados → familia LATAM

| Slug resolver | País | Antes | Después |
|---------------|------|-------|---------|
| `mexico` | México | IBERIAN | **LATAM** |
| `argentina` | Argentina | IBERIAN | **LATAM** |
| `brazil` | Brasil | IBERIAN | **LATAM** |
| `peru` | Perú | IBERIAN | **LATAM** |

**Ciudades piloto QA (catálogo sin cambios):** Ciudad de México · Buenos Aires · Río de Janeiro · Lima.

**Familia nueva:** **`LATAM`** — sexta familia editorial (26 países · **6 familias**).

Familias activas tras PRE-F1.3: `IBERIAN` · `MEDITERRANEAN` · `ANGLO` · `EAST_ASIAN` · `AFRICAN_COASTAL` · **`LATAM`**.

---

## IV. Tablas integradas

### `narrative-intelligence-service.js` — 4 tablas

| Tabla | Clave constante |
|-------|-----------------|
| Human theme patterns | `HUMAN_THEME_PATTERNS_BY_REGION.LATAM` |
| Summary frame pool | `SUMMARY_FRAME_POOL_BY_REGION.LATAM` |
| Observe tail | `OBSERVE_TAIL_BY_REGION.LATAM` |
| Narrative spine | `NARRATIVE_SPINE_BY_REGION.LATAM` |

### `city-premium-composition-service.js` — 9 tablas (+ derivado runtime)

| Tabla | Clave constante |
|-------|-----------------|
| Goal pads | `GOAL_PADS_BY_REGION.LATAM` |
| Spine favorece open | `SPINE_FAVORECE_OPEN_BY_REGION.LATAM` |
| Human scene | `HUMAN_SCENE_BY_REGION.LATAM` |
| Observe entero tail | `OBSERVE_ENTERO_TAIL_BY_REGION.LATAM` |
| Voice transition | `VOICE_TRANSITION_BY_REGION.LATAM` |
| Regional topup | `REGIONAL_TOPUP_VARIANTS.LATAM` |
| Regional editorial micro | `REGIONAL_EDITORIAL_MICRO_BY_GOAL.LATAM` |
| Regional editorial pads | `REGIONAL_EDITORIAL_PADS.LATAM` |
| Derivado runtime | `REGIONAL_TOPUP_BY_GOAL.LATAM` (auto-build desde `REGIONAL_TOPUP_VARIANTS`) |

### `premium-knowledge-service.js` — 1 tabla

| Tabla | Clave constante |
|-------|-----------------|
| Premium block variations | `PREMIUM_BLOCK_VARIATIONS_BY_REGION.LATAM` |

**Total:** 14 bloques regionales LATAM en runtime.

---

## V. Smokes — 10/10 PASS

Gate verificado post-integración (`a8d4a60`):

| # | Script | Resultado |
|---|--------|-----------|
| 1 | `dev-editorial-family-resolver-smoke.sh` | **PASS** |
| 2 | `dev-narrative-spine-regionalization-smoke.sh` | **PASS** |
| 3 | `dev-goal-pad-regionalization-smoke.sh` | **PASS** |
| 4 | `dev-microtransition-variation-smoke.sh` | **PASS** |
| 5 | `dev-premium-block-variation-smoke.sh` | **PASS** |
| 6 | `dev-editorial-dedup-smoke.sh` | **PASS** |
| 7 | `dev-premium-editorial-variation-smoke.sh` | **PASS** |
| 8 | `dev-city-premium-composition-smoke.sh` | **PASS** |
| 9 | `dev-narrative-intelligence-smoke.sh` | **PASS** |
| 10 | `dev-latam-editorial-integration-smoke.sh` | **PASS** *(nuevo PRE-F1.3)* |

**Ajustes smoke:** familias **5 → 6**, lecturas piloto **15 → 18** donde aplica.

---

## VI. QA piloto — 33/33 PASS

**Matriz:** 4 ciudades × 3 goals = 12 lecturas + gates globales.

| Ciudad | amor | trabajo | descanso | regionFamily | words |
|--------|------|---------|----------|--------------|-------|
| Ciudad de México | PASS | PASS | PASS | LATAM | 530 / 523 / 522 |
| Buenos Aires | PASS | PASS | PASS | LATAM | 517 / 518 / 527 |
| Río de Janeiro | PASS | PASS | PASS | LATAM | 524 / 526 / 513 |
| Lima | PASS | PASS | PASS | LATAM | 520 / 530 / 527 |

**Gates globales (todos PASS):**

| Check | Resultado |
|-------|-----------|
| `regionFamily = LATAM` | 12/12 |
| split-brain | **0** |
| IBERIAN leak (`plaza`, `sobremesa`, `barrio`, `compañía cotidiana`) | **0** |
| Longitud lectura | 12/12 en 500–900 palabras |
| P03 / P06 / P10 | **0** |

**Desglose 33 checks:** 4 resolver + 6 amends + 12 regionFamily + 12 word count + split-brain + IBERIAN bundle + P03/P06/P10 = **33/33 PASS**.

---

## VII. Amends editoriales aplicados (PRE-F1.3)

Índices **0-based** (notación usuario 1-based entre paréntesis).

| Target | Índice | String congelado runtime |
|--------|--------|--------------------------|
| `SUMMARY_FRAME_POOL.LATAM.amor` | `[0]` *(amor[1] user)* | `En la **cercanía habitada** de {ciudad}, con {goalPhrase}, el vínculo deja ver:` |
| `OBSERVE_TAIL.LATAM.amor` | `[1]` *(amor[2] user)* | ` En **lo cotidiano cercano**, {ciudad} devuelve matices que la primera escena no mostró.` |
| `GOAL_PADS.LATAM.amor` | `[4]` *(pad[4])* | `…**planes demasiado cuidados**.` |
| `GOAL_PADS.LATAM.trabajo` | `[4]` | `…**urgencias demasiado armadas**.` |
| `GOAL_PADS.LATAM.descanso` | `[4]` | `…**planes demasiado cerrados**.` |
| `PREMIUM_BLOCK doc17.t3.amor` | — | `…la condición es verdad, **no personaje**.` |

---

## VIII. Desviación editorial — LATAM frozen runtime v1

### Contexto

Durante PRE-F1.3, el string congelado PRE-F1.1a para `NARRATIVE_SPINE.LATAM.closingByGoal.amor[2]` incluía **`compañía cotidiana`**, marcador del gate anti-IBERIAN leak. Para pasar QA sin fuga IBERIAN en lecturas LATAM, se sustituyó en runtime.

### String PRE-F1.1a (diseño · no runtime)

> `Si el vínculo sigue, que sea en la compañía cotidiana — no en la historia que contarías.`

### **LATAM frozen runtime v1** (vigente @ `a8d4a60`)

**Clave:** `NARRATIVE_SPINE_BY_REGION.LATAM.closingByGoal.amor[2]`

**Texto:**

> `Si el vínculo sigue, que sea en lo cercano de cada día — no en la historia que contarías.`

**Estado:** congelado como **LATAM frozen runtime v1**. Cualquier revisión editorial futura requiere fase explícita (p. ej. PRE-F1.4b) y re-ejecución de smokes + QA leak.

---

## IX. Riesgos pendientes

| ID | Riesgo | Estado | Mitigación recomendada |
|----|--------|--------|------------------------|
| **R-1** | `dist/` desincronizado respecto a `src/` @ `a8d4a60` | **Vivo** | Sync en PRE-F1.5 staging deploy · no commitear `dist/` salvo release |
| **R-2** | LATAM **no desplegado** (prod @ `33f3ec8`) | **Vivo** | PRE-F1.5 staging → smoke → QA manual |
| **R-3** | Commit `a8d4a60` **sin push** remoto | **Vivo** | Push tras aprobación · backup cadena PRE-F1 |
| **R-4** | `SUMMARY_FRAME_POOL_BY_REGION` exportado en API pública (`KairosNarrativeIntelligence`) para smokes | **Revisar** | Decidir si permanece en export o mover a harness smoke-only |
| **R-5** | Smokes asumen **6 familias** — scripts legacy con `5` fallarán | **Mitigado** | Scripts PRE-F1.3 actualizados; vigilar scripts nuevos |
| **R-6** | Desviación closing amor[2] vs PRE-F1.1a diseño | **Documentado** | § VIII · frozen runtime v1 |

---

## X. Qué NO tocar (hasta PRE-F1.5)

| Área | Motivo |
|------|--------|
| **`src/services/*`** (salvo doc inline mínima) | Runtime cerrado @ `a8d4a60` |
| **`dist/`** | Artefacto deploy; sync en staging |
| **Firebase / deploy** | PRE-F1.5 |
| **Motores astrológicos / WASM / `astro.js`** | Congelados |
| **Catálogo ciudades** | Fuera scope PRE-F1 |

---

## XI. Siguiente fase recomendada

### **PRE-F1.5 — Staging deploy LATAM**

1. `./scripts` smokes **10/10 PASS** (re-run pre-deploy)
2. Sync `src/` → `dist/` (política deploy existente)
3. `./scripts/deploy-staging.sh` (o equivalente proyecto)
4. QA manual browser: CDMX · BA · Río · Lima × amor/trabajo/descanso
5. Validar anti-IBERIAN leak en staging
6. Decisión prod (fuera PRE-F1.5 salvo instrucción explícita)

---

## XII. Git status (post PRE-F1.4 doc)

```
HEAD: a8d4a60 — pref1 latam editorial runtime integration
      7247f1e — 3.8h8 repository hygiene post github push

Rama: main (ahead of origin/main by 1 commit — a8d4a60 sin push)
src/: limpio @ a8d4a60
dist/: modificado / untracked (NO commiteado · NO sync LATAM)
Producción: 33f3ec8 (sin LATAM)
```

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `KAIROS_CURRENT_CHECKPOINT.md` | Snapshot global proyecto · referencia PRE-F1 |
| `KNOWLEDGE_REGIONALIZATION_AUDIT.md` | Auditoría regionalización knowledge |
| `PREMIUM_KNOWLEDGE_BLOCK_VARIATION_PLAN.md` | Plan variación bloques premium |
| `dev-latam-editorial-integration-smoke.sh` | Smoke QA LATAM integrado |

---

*Checkpoint PRE-F1.4 · Commit doc-only · Sin push · Sin deploy · Sin modificación runtime*
