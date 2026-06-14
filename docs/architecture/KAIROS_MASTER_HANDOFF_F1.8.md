# KAIROS MAPS — Master Handoff F1.8

**Documento:** handoff operativo y editorial · fin de ciclo PRE-F1  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **HEAD local:** `ce69f09`  
**Handoff milestone:** post PRE-F1.8 staging re-deploy (hotfix sparse premium)

> Documento de continuidad para el siguiente agente, sesión o revisor humano.  
> Máximo scope: estado exacto al cierre F1.8 · no sustituye `KAIROS_DOC_INDEX.md`.

---

## 1. Estado actual exacto

| Dimensión | Valor |
|-----------|-------|
| **Repo local HEAD** | `ce69f09` — `pref1 latam sparse premium hotfix` |
| **`src/`** | Limpio · LATAM + hotfix cognate `control` integrados |
| **`docs/`** | PRE-F1.4 checkpoint · este handoff · `KAIROS_CURRENT_CHECKPOINT` parcialmente desactualizado (staging) |
| **`dist/`** | Sincronizado con `src/` tras deploy staging · **no commiteado** (política release) |
| **Git remoto** | `main` **ahead of origin/main by 3 commits** · **sin push** |
| **Familias editoriales** | 6: IBERIAN · MEDITERRANEAN · ANGLO · EAST_ASIAN · AFRICAN_COASTAL · **LATAM** |
| **Países LATAM** | `mexico` · `argentina` · `brazil` · `peru` → resolver `LATAM` |
| **Premium beta** | `?premium=1` o `localStorage kairosPremiumBeta=1` |
| **Gates LATAM verificados** | split-brain 0 · IBERIAN leak 0 · P03/P06/P10 0 · 500–900 palabras · 33/33 QA piloto |

**Ciudades piloto LATAM (catálogo sin cambios):** Ciudad de México · Buenos Aires · Río de Janeiro · Lima.

---

## 2. Commits relevantes

| Hash | Mensaje | Qué cierra |
|------|---------|------------|
| `33f3ec8` | `3.8h6 editorial p2 polish` | **Producción live** · 5 familias · dedup P0–P2 |
| `a8d4a60` | `pref1 latam editorial runtime integration` | LATAM runtime · 14 tablas · 10 smokes · MX/AR/BR/PE |
| `41bad5a` | `pref1 latam integration checkpoint` | Doc PRE-F1.4 · trazabilidad · frozen runtime v1 |
| `ce69f09` | `pref1 latam sparse premium hotfix` | Fix `englishThemeHit: "control"` falso positivo (cognate ES) |

**Cadena local no pusheada:** `7247f1e` → … → `a8d4a60` → `41bad5a` → `ce69f09`.

---

## 3. Producción

| Campo | Valor |
|-------|-------|
| **URL** | https://kairos-maps-mvp.web.app |
| **Premium** | https://kairos-maps-mvp.web.app/?premium=1 |
| **HEAD desplegado** | `33f3ec8` (3.8h.7b) |
| **LATAM** | **NO** — `mexico`/`argentina` siguen `IBERIAN` en resolver |
| **Familias** | 5 (pre-LATAM) |
| **Estado** | Estable · no tocar salvo ciclo smoke → staging → prod explícito |

---

## 4. Staging

| Campo | Valor |
|-------|-------|
| **URL** | https://kairos-maps-dev.web.app |
| **Premium QA** | https://kairos-maps-dev.web.app/?premium=1 |
| **Bundle efectivo** | `src/` @ `ce69f09` (rsync + `hosting:staging`) |
| **LATAM** | **SÍ** — resolver + 14 tablas + hotfix sparse |
| **Último deploy** | PRE-F1.8 · `./scripts/deploy-staging.sh` · 5/5 smokes pre-deploy PASS |
| **Gate crítico cerrado** | BA / trabajo / sparse → `ok:true` · premium renderiza · `englishThemeHit:null` |

**Nota cache:** scripts cargan con `?v=3.8h2`. Si QA manual falla, hard refresh o query cache-bust.

---

## 5. Fases completadas (PRE-F1 + 3.8h base)

### Serie 3.8h (producción)

Resolver unificado · dedup P0/P1/P2 · premium UI beta · sparse NY · deploy prod `33f3ec8`.

### Serie PRE-F1 (LATAM)

| Fase | Estado | Evidencia |
|------|--------|-----------|
| PRE-F1.1–1.2c | ✅ Diseño congelado | Strings LATAM aprobados (transcript) |
| **PRE-F1.3** | ✅ Runtime | `a8d4a60` · 4 países · 14 tablas · amends · 10 smokes |
| **PRE-F1.4** | ✅ Checkpoint doc | `PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` |
| PRE-F1.5 | ✅ Staging deploy LATAM | Primera subida staging |
| PRE-F1.6 | ✅ Manual browser QA | 11 PASS · 1 WATCH (BA/trabajo sparse pre-hotfix) |
| **PRE-F1.7** | ✅ Hotfix | `ce69f09` · cognate `control` en `containsEnglishThemeKeys` |
| **PRE-F1.8** | ✅ Staging re-deploy | Hotfix live · BA/trabajo sparse PASS |

---

## 6. Fases pendientes

| Fase | Descripción | Bloqueante |
|------|-------------|------------|
| **PRE-F1.8b** | Checkpoint doc formal post hotfix + actualizar `KAIROS_CURRENT_CHECKPOINT.md` | Opcional · trazabilidad |
| **PRE-F1.9** | Decisión + deploy **producción** LATAM | Aprobación explícita Roberto |
| **Push remoto** | Backup cadena `a8d4a60`→`ce69f09` | Continuidad repo |
| **PRE-F1.6b** | QA manual humano extendido (12 lecturas UI completas) | Recomendado pre-prod |
| **Export smoke** | Decidir si `SUMMARY_FRAME_POOL_BY_REGION` permanece en API pública | Deuda menor |

**PRE-F1.8 ops:** cerrado. **PRE-F1.8 doc/checkpoint en master corpus:** pendiente de sincronizar refs en índice doc.

---

## 7. Riesgos abiertos

| ID | Riesgo | Severidad |
|----|--------|-----------|
| R-1 | Prod desincronizado vs staging (sin LATAM) | Alta hasta F1.9 |
| R-2 | 3 commits sin push | Media |
| R-3 | `dist/` local sucio · no SSOT git | Baja (esperado) |
| R-4 | Cache browser en staging QA | Baja |
| R-5 | Eco editorial descanso («compañía» sin calificador IBERIAN) | WATCH editorial |
| R-6 | Country archetype «Quizá en Argentina/Brasil» homogeneiza ciudades | WATCH editorial |
| R-7 | Bundle premium cargado en free (scripts en `index.html`) | OP deuda 3.8h |
| R-8 | Cognates futuros `THEME_ES[key]===key` — solo `control` hoy | Monitorear |

---

## 8. Arquitectura congelada

**NO tocar salvo instrucción explícita y fase dedicada:**

| Área | Archivos / sistema |
|------|-------------------|
| Motores astrológicos | `src/engines/astro.js` · WASM · efemérides |
| Catálogo ciudades | `src/content/cities-catalog.js` |
| Firebase / hosting prod | Sin deploy hasta F1.9 |
| `dist/` en git | No commitear salvo release |
| Motores legacy congelados | `planetary_engine.js` · `weekly_engine.js` · etc. (ver skill KAIROS) |

**SSOT editorial runtime LATAM:** `src/services/editorial-family-resolver.js` · `narrative-intelligence-service.js` · `city-premium-composition-service.js` · `premium-knowledge-service.js`.

**Smokes gate LATAM (10):** incluye `dev-latam-editorial-integration-smoke.sh` · familias **6**.

---

## 9. Decisiones editoriales congeladas

### Amends PRE-F1.3 (runtime)

- `SUMMARY_FRAME_POOL.LATAM.amor[0]`: **cercanía habitada**
- `OBSERVE_TAIL.LATAM.amor[1]`: **lo cotidiano cercano**
- `GOAL_PADS` pad[4]: amor **planes demasiado cuidados** · trabajo **urgencias demasiado armadas** · descanso **planes demasiado cerrados**
- `PREMIUM_BLOCK doc17.t3.amor`: **verdad, no personaje**

### LATAM frozen runtime v1 (desviación documentada PRE-F1.4)

`NARRATIVE_SPINE.LATAM.closingByGoal.amor[2]`:

> *Si el vínculo sigue, que sea en lo cercano de cada día — no en la historia que contarías.*

(Reemplaza diseño PRE-F1.1a con `compañía cotidiana` para gate anti-IBERIAN.)

### Gates anti-leak (no debilitar)

Marcadores IBERIAN prohibidos en lecturas LATAM: `plaza` · `sobremesa` · `barrio` · `compañía cotidiana`.

Clichés turísticos monitorizados: `samba` · `tango` · `carnaval` · `fútbol` · `turismo`.

### PRE-F1.7 — regla técnica congelada

`containsEnglishThemeKeys`: omitir claves donde `THEME_ES[key] === key` (cognate ES válido, p. ej. **control**). Mantener detección de leaks reales (`belonging`, etc.).

---

## 10. Roadmap inmediato (próximas 2–4 semanas)

1. **Push remoto** cadena PRE-F1 (`a8d4a60` → `ce69f09`) — backup.
2. **PRE-F1.9 — Prod deploy LATAM** (solo tras aprobación):
   - Re-run 10 smokes + 5 smokes gate deploy
   - `./scripts/deploy-prod.sh` · QA post-deploy 4 ciudades × 3 goals
   - Monitor 48h
3. Actualizar `KAIROS_CURRENT_CHECKPOINT.md` (staging @ `ce69f09`, prod split).
4. Opcional: script `scripts/pref1-staging-gate.sh` (smokes + node QA) para ops rápidas.

---

## 11. Roadmap futuro

| Horizonte | Iniciativa |
|-----------|------------|
| **PRE-F2** | Ampliación LATAM (más países/ciudades) · sin tocar catálogo hasta fase explícita |
| **3.8i** | Ampliación territorial general |
| **3.8j** | Premium beta visible sin query param |
| **Geographic Zodiac Archetypes** | Capa arquetipos zodiacales territoriales · ver §12 |
| **Couple / Reloc visible** | Tras Cities loop completo (constitución KAIROS) |
| **IA interpretativa** | Selección fragment IDs curados · post-premium estable |

---

## 12. Ideas aparcadas

| Idea | Motivo aparcado | Revisitar cuando |
|------|-----------------|------------------|
| **Geographic Zodiac Archetypes** | Diseño en `TERRITORIAL_ARCHETYPE_LAYER.md` · no runtime | Post-LATAM prod · capa 3.8+ territorial |
| Re-freeze closing amor[2] con `compañía cotidiana` | Conflicto gate IBERIAN | Solo con nuevo marcador leak o rewrite pool |
| Mover `SUMMARY_FRAME_POOL_BY_REGION` fuera de export público | Conveniencia smoke | Refactor harness PRE-F2 |
| Rotación pads descanso «medio de la compañía» | WATCH F1.6 · no bloqueante | Editorial polish LATAM v2 |
| Prod deploy automático post-staging | Política manual Roberto | No automatizar |
| São Paulo en catálogo | Fuera scope PRE-F1 | Ampliación catálogo dedicada |
| `dev-knowledge-regionalization-smoke` en gate deploy | No en lista F1.8 | Unificar gates F2 |

### Geographic Zodiac Archetypes (future) — nota

Capa conceptual: **firma zodiacal territorial** como metadata editorial ponderada (no identidad fija del lugar). Documentada en `docs/architecture/TERRITORIAL_ARCHETYPE_LAYER.md` y `docs/voice/CITY_ATMOSPHERE_LIBRARY.md`. **No implementada en runtime.** Encaja después de LATAM prod estable y antes de ampliación masiva de ciudades. Requiere fase diseño + smoke editorial propio · no mezclar con resolver familias actuales.

---

## Referencias rápidas

| Documento | Uso |
|-----------|-----|
| `docs/architecture/PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` | Trazabilidad LATAM · amends · frozen v1 |
| `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` | Snapshot global (actualizar post-F1.9) |
| `docs/architecture/KAIROS_DOC_INDEX.md` | Constitución viva |
| `scripts/deploy-staging.sh` | Solo staging |
| `scripts/deploy-prod.sh` | Solo prod · requiere `DEPLOY-PROD` |

---

*Handoff F1.8 · Doc-only · Sin push · Prod @ `33f3ec8` · Staging @ `ce69f09`*
