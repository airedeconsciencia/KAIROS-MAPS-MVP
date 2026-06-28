# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `3c6019a` — F6.3 ANGLO Closure  
**HEAD identity:** `8.5b-0.1` — F8.5B rhythmBias V1 T1 (local)  
**HEAD toneBias V1:** `eaf356c` + doc `1e67a24` — frozen (`8.5a4-0.1` Lexical Guard)  
**HEAD rhythmBias V1:** `8.5b-0.1` — frozen (F8.5C-rhythm doc)  
**Checkpoint prod:** `docs/architecture/F6.3_ANGLO_CLOSURE_PRODUCTION_CHECKPOINT.md`  
**Checkpoint identity:** `docs/architecture/CITY_IDENTITY_ARCHITECTURE.md`  
**Producción / Staging:** catálogo **`3.8f.1-f6.3-0.1`** · resolver **`3.8h.2-f6.3-0.1`** · **106 ciudades / 103 países** · **12 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1–F4.11:** cerradas
- **Wave F5.1 ANGLO Caribbean II:** cerrada (`f5.1`)
- **Wave F5.2 East Asia + SEA Closure:** cerrada (`f5.2`)
- **F6.0 MENA Architecture Sprint:** cerrada (`f6.0` · packs · 0 países)
- **Wave F6.1 MENA Migration:** cerrada (`f6.1` · AE/QA/SA/IL/JO)
- **Wave F6.2 MENA Expansion:** cerrada (`f6.2` · LB/KW/OM)
- **Wave F6.3 ANGLO Closure:** cerrada (`f6.3` · Surinam/Paramaribo)
- **F5.0 Family Architecture Audit:** entregada (READ-ONLY)
- **WA 13/13** · São Paulo NO catálogo · Maó/Menorca aparcado
- **F7.5–F7.9C City Identity Stack:** cerrado (`f7.10` checkpoint)
- **F7.11 Handover Pack:** cerrado — relevo System Architect
- **F8.0 Identity Context Pipeline:** cerrado — `identityContext` transportado · no consumido
- **F8.1 Identity Context Observer:** cerrado — observación read-only DEV · mutación 0 · warnings no bloqueantes
- **F8.1E Identity Contract v1.0:** aprobado — `contractSchemaVersion: 1.0.0` · documentado · sin implementación en servicios
- **F8.2 Identity Decision Lab:** cerrado — evidencia A/B virtual DEV · `fe506c1` · runtime productivo intacto
- **F8.5A Micro Modulation toneBias:** cerrado — `e21fff4` · canario Lisboa · post-composición DEV
- **F8.5A2 Threshold Calibration:** cerrado — umbral escalado · Lisboa @ 0.5 ≥3 secciones
- **F8.5A3 Decision Lab Smoke Stabilization:** cerrado — `37e14c4` · sin flake `computedAt`
- **F8.5A4 Lexical Guard:** cerrado · commit `eaf356c` · Lexical Guard integrado · `puede que` protegido
- **F8.6B Editorial QA toneBias:** **PASS** — toneBias V1 Approved
- **toneBias V1:** **Approved** · **Frozen** (F8.5C doc)
- **F8.5B rhythmBias V1 T1:** cerrado — `8.5b-0.1` · CompositionAuthorityGuard · EmDashSpanGuard · canario Lisboa · solo `sintesis`
- **F8.5B6 Editorial QA rhythmBias:** **PASS** — rhythmBias V1 Approved
- **rhythmBias V1:** **Approved** · **Frozen** (F8.5C-rhythm doc)
- **F8.5B cerrada** — segunda variable Identity congelada
- **F8.5A cerrada** — primera variable Identity congelada
- **Identity stack:** shadow-ready · `modulation.enabled=false` · runtime visual idéntico
- **Runtime productivo:** intacto (sin cambios F6.3 · sin deploy F8)

---

## F4/F5/F6/F7 — Documentación SSOT

| Documento | Rol |
|-----------|-----|
| `GLOBAL_EXPANSION_BACKLOG.md` | Países pendientes · waves · dependencias |
| `EDITORIAL_FAMILY_POLICY.md` | Reutilizar / crear / saturación familia |
| `WAVE_PLANNER.md` | Reglas batch · gates · pipeline · STOP |
| `CITY_IDENTITY_ARCHITECTURE.md` | SSOT Identity F7.5–F7.9C · shadow stack · roadmap F8 |
| `KAIROS_PROJECT_HANDOVER.md` | Handover pack F7.11 · visión · capas · ritual Cursor |
| `KAIROS_CURRENT_STATE_F7_10.md` | Snapshot exacto al cierre F7.10 |
| `KAIROS_ARCHITECTURAL_DECISIONS.md` | ADRs permanentes F7.11 |
| `KAIROS_NEXT_AGENT_BOOTSTRAP.md` | Bootstrap nuevo GPT Architect · formato respuesta |

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **106** |
| Países visibles / resolver | **103** |
| **ANGLO** países resolver | **12** (⚠️ umbral editorial) |
| **MENA** países resolver | **8** |
| **MEDITERRANEAN** países resolver | **7** |
| EAST_ASIAN países resolver | **5** |
| SOUTHEAST_ASIAN países resolver | **11** (ASEAN completo) |
| SOUTH_ASIAN países resolver | **8** |
| WEST_AFRICAN países resolver | **13** (🔒 congelada) |
| AFRICAN_COASTAL países resolver | **12** (🔒 congelada) |
| LATAM países resolver | **12** (🔒 congelada) |
| WESTERN_EUROPE países resolver | **14** (🔒 congelada) |
| GN canario | Reykjavik / `iceland` |

---

## Smokes

**Prod (@ F6.3):** suite **10/10 PASS** — 9 estándar + `dev-mena-architecture-smoke.sh` · split-brain **97 = 0**

**Identity (DEV @ F8.5C-rhythm):**

- `dev-identity-modulation-smoke.sh`
- `dev-identity-shadow-runtime-smoke.sh`
- `dev-shadow-analytics-smoke.sh`
- `dev-shadow-analytics-export-smoke.sh`
- `dev-identity-calibration-smoke.sh`
- `dev-identity-context-pipeline-smoke.sh` — F8.0 byte-identical · 106 ciudades · split-brain 0
- `dev-identity-context-observer-smoke.sh` — F8.1 · 106 ciudades · mutación 0 · narrative/premium byte-identical · app/index sin wiring
- `dev-identity-decision-lab-smoke.sh` — F8.2/F8.5A3 · 6 ciudades piloto · Contract v1.0 · strength=0 idéntico · bridge/goal/scorer intactos
- `dev-identity-micro-modulation-smoke.sh` — F8.5B · toneBias V1 + rhythmBias V1 · Lisboa canario · `sintesis` T1 · meaningStability=1 · no wiring prod

---

## Riesgos vivos

- Cache browser `cities-catalog.js` / `editorial-family-resolver.js`
- `dist/` sucio local (rsync deploy-prod; no commitear)
- **ANGLO @ 12** — umbral editorial alcanzado; no añadir países sin F7.0 audit
- Lecturas MENA live — monitorizar anti-leak (Dubái · Tel Aviv · Beirut)
- Israel · Líbano — países sensibles; vigilancia editorial continua
- Familias congeladas: WE · LATAM · WA · AC
- **Identity:** 7 ciudades `review_required` · signatures algorítmicas (no curadas) · riesgo activación sin QA editorial

---

## Siguiente

**F8.6 — Identity Micro Modulation Baseline Check** — verificación conjunta toneBias V1 + rhythmBias V1 bajo Contract v1.0.

**toneBias V1:** ✅ Approved · ✅ Frozen · canario Lisboa DEV · `modulationStrength ≤ 0.5` · sin activación prod.

**rhythmBias V1:** ✅ Approved · ✅ Frozen · canario Lisboa DEV · sección `sintesis` · T1 only · sin activación prod.

**Identity Contract v1.0:** ✅ documentado · ✅ toneBias V1 frozen · ✅ rhythmBias V1 frozen · ❌ `densityBias` / `sectionBias` sin implementar · ❌ no activado prod

**Activación Identity:** ❌ sin activación · `identityContext.enabled=false` · `modulation.enabled=false`

**Territorial (pausado):** F7.0 GLOBAL EDITORIAL AUDIT — expansión territorial en hold hasta auditoría READ-ONLY.

---

*Checkpoint F8.5C-rhythm · toneBias V1 + rhythmBias V1 frozen · Prod 106/103 @ f6.3 · smokes PASS · sin activación prod · STOP @ F8.6*
