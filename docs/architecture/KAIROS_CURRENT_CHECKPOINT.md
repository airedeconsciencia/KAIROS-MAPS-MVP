# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main` by 1 commit** (`fcf61d7` sin push)  
**HEAD repo:** `fcf61d7` — `f2.2d3 global neutral default switch`  
**Runtime LATAM base:** `ce69f09` + F2.2c SSOT + F2.2d3 GLOBAL_NEUTRAL overlay local  
**Producción live:** **LATAM @ `ce69f09`** — **sin F2.2d3 desplegado**  
**Checkpoint F2:** `docs/architecture/F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (26 países, **7 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), y desde **F2.2d3** **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**.

**PRE-F1 cerrado** · prod LATAM @ `ce69f09`. **F2.2c cerrado** · SSOT infra. **F2.2d3 cerrado localmente** · switch DEFAULT · 14 tablas GLOBAL_NEUTRAL.

**Producción** (https://kairos-maps-mvp.web.app) — LATAM live · MX/AR/BR/PE → `LATAM`. Runtime desplegado **`ce69f09`** (no incluye F2.2c ni F2.2d3). Países no mapeados en prod siguen voz IBERIAN por DEFAULT legacy.

**Local `src/`** — **`fcf61d7`**: GLOBAL_NEUTRAL default · tablas editoriales · smokes gate ampliados.

**Smokes gate F2.2d3:** **9/9 PASS**.

**Riesgos vivos:** prod desincronizado vs local · `fcf61d7` sin push · `dist/` sucio · detector leak por subcadena `plaza`.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit |
|------|--------|--------|
| PRE-F1.3 → PRE-F1.9d | ✅ Cerrado | `a8d4a60` → `a25e2c7` pushed |

Prod LATAM deploy: PRE-F1.9b @ `ce69f09`. Ver `KAIROS_MASTER_HANDOFF_F1.8.md`.

---

## III. Serie F2 — en curso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F2.0** | ✅ Audit read-only | Country coverage · DEFAULT risk |
| **F2.1** | ✅ Diseño | DEFAULT neutral architecture |
| **F2.2a** | ✅ Audit | IBERIAN_FALLBACK_MAP · 24 líneas críticas |
| **F2.2b** | ✅ Diseño | Opción C · SSOT + helper |
| **F2.2c** | ✅ Runtime | `df1797a` · infra SSOT · behavior-preserving |
| **F2.2c1** | ✅ Doc | `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` |
| **F2.2d0–d2** | ✅ Copy | Brief · scaffolding · copy final GLOBAL_NEUTRAL |
| **F2.2d3** | ✅ Runtime | `fcf61d7` · `DEFAULT_FAMILY = GLOBAL_NEUTRAL` |
| **F2.2d3c** | ✅ Doc | Este checkpoint + `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` |
| **F2.2d4** | ⏳ Pendiente | Staging deploy + browser QA GLOBAL_NEUTRAL |
| **F2.3** | ⏳ Pendiente | Remapeo mis-maps explícitos |

---

## IV. F2.2d3 — qué cambió / qué no

### Cambió (`fcf61d7`)

- `DEFAULT_FAMILY`: **`IBERIAN` → `GLOBAL_NEUTRAL`**
- `REGISTERED_FAMILIES` += **`GLOBAL_NEUTRAL`** (7 familias)
- 14 tablas editoriales GLOBAL_NEUTRAL (narrative · composition · knowledge)
- Schema EFR: **`3.8h.2-f2.2d3-0.1`**
- Smokes: `dev-global-neutral-default-smoke.sh` · `dev-global-neutral-editorial-smoke.sh`
- `dev-fallback-ssot-smoke.sh` actualizado — Oslo → GLOBAL_NEUTRAL

### No cambió

- Países explícitos mantienen familia (Lisboa → IBERIAN · LATAM → LATAM · Kenia → AFRICAN_COASTAL)
- Sin nuevas familias regionales
- Sin deploy post-F2.2d3
- Prod sigue @ `ce69f09`
- Catálogo · astro · WASM sin tocar

---

## V. Smokes gate actuales

```bash
./scripts/dev-global-neutral-default-smoke.sh
./scripts/dev-global-neutral-editorial-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
```

**Estado F2.2d3:** **9/9 PASS**.

---

## VI. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **`ce69f09`** · LATAM · sin F2.2d3 |
| **Staging** | https://kairos-maps-dev.web.app | Paridad prod (pre-F2.2d3 deploy) |
| **Local `src/`** | — | **`fcf61d7`** · DEFAULT GLOBAL_NEUTRAL |

---

## VII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2-7** | `dist/` desincronizado vs `src/` F2.2d3 |
| **R-F2-8** | `fcf61d7` sin push |
| **R-F2-9** | Prod sin F2.2d3 — no mapeados siguen IBERIAN en live |
| **R-F2-10** | Detector IBERIAN leak por subcadena (`plaza` en `reemplaza`) |
| **R-F2-2** | Mis-maps FR/DE/NL/SE/IN/TH/SG — F2.3 |
| **OP-3** | `dist/` dirty · no commiteado |

**Cerrado F2.2d3:** R-F2-1 (`DEFAULT_FAMILY = IBERIAN`).

---

## VIII. Git status (post F2.2d3c doc)

```
HEAD runtime: fcf61d7 — f2.2d3 global neutral default switch
HEAD doc:     (pending) — f2.2d3 global neutral default checkpoint

Rama: main · ahead of origin/main by 1–2 commits
src/: limpio @ fcf61d7
dist/: modificado / untracked (NO commiteado)
Producción: ce69f09 (LATAM live · pre-F2.2d3)
```

---

## IX. Siguiente fase

### **F2.2d4 — Staging deploy + browser QA GLOBAL_NEUTRAL**

1. Build `dist/` desde `src/` @ `fcf61d7`
2. Deploy staging
3. Browser QA Oslo · Bogotá · Lisboa · CDMX · Nairobi
4. Gate explícito antes de prod

---

## X. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | Trazabilidad F2.2d3 DEFAULT switch |
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | Trazabilidad F2.2c SSOT |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |
| `PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` | LATAM integration |

---

*Checkpoint actualizado F2.2d3c · Doc-only · Sin deploy · Prod @ ce69f09 · Local DEFAULT @ fcf61d7*
