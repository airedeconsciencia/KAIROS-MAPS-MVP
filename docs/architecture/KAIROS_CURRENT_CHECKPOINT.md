# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main` by 1 commit** (`df1797a` sin push)  
**HEAD repo:** `df1797a` — `f2.2c fallback ssot refactor infrastructure`  
**Runtime LATAM base:** `ce69f09` + F2.2c SSOT overlay local  
**Producción live:** **LATAM @ `ce69f09`** — **sin F2.2c desplegado**  
**Checkpoint F2:** `docs/architecture/F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (26 países, **6 familias**), dedup P0–P2, **LATAM live en producción**, y desde **F2.2c** infraestructura **SSOT de fallback** (`resolveRegionalPack` · sin literales `IBERIAN` en lógica de compositor).

**PRE-F1 cerrado** · prod LATAM @ `ce69f09`. **F2.2c cerrado localmente** · behavior-preserving · `DEFAULT_FAMILY` sigue **IBERIAN**.

**Producción** (https://kairos-maps-mvp.web.app) — LATAM live · MX/AR/BR/PE → `LATAM`. Runtime desplegado **`ce69f09`** (no incluye F2.2c).

**Local `src/`** — **`df1797a`**: SSOT fallback refactor + fix sparse IF-C08 + smoke `dev-fallback-ssot-smoke.sh`.

**Smokes gate F2.2c:** **7/7 PASS** (6 gate + SSOT).

**Riesgos vivos:** `DEFAULT_FAMILY = IBERIAN` (~167 países) · mis-maps FR/DE/IN/TH/SG · prod desincronizado vs local F2.2c · `df1797a` sin push · `dist/` sucio.

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
| **F2.2c1** | ✅ Doc | Este checkpoint + `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` |
| **F2.2d** | ⏳ Pendiente | GLOBAL_NEUTRAL tablas + switch DEFAULT |
| **F2.3** | ⏳ Pendiente | Remapeo mis-maps explícitos |

---

## IV. F2.2c — qué cambió / qué no

### Cambió (`df1797a`)

- `REGISTERED_FAMILIES` · `isRegisteredFamily` · `resolveRegionalPack`
- `resolveRegionFamily` consolidado en EFR
- Eliminación fallbacks lógicos `IBERIAN` (11 coerciones + 8 pool fallbacks + 3 hard returns)
- Fix IF-C08 sparse → BA/trabajo/sparse `regionN=LATAM`
- Nuevo smoke `dev-fallback-ssot-smoke.sh`

### No cambió

- `DEFAULT_FAMILY = 'IBERIAN'`
- Sin `GLOBAL_NEUTRAL` · sin familias nuevas
- Sin deploy post-F2.2c
- Prod sigue @ `ce69f09`

---

## V. Smokes gate actuales

```bash
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
./scripts/dev-premium-ui-beta-smoke.sh
./scripts/dev-editorial-family-resolver-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
```

**Estado F2.2c:** **7/7 PASS**.

---

## VI. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **`ce69f09`** · LATAM · sin F2.2c |
| **Staging** | https://kairos-maps-dev.web.app | Paridad prod (pre-F2.2c deploy) |
| **Local `src/`** | — | **`df1797a`** · SSOT fallback |

---

## VII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2-1** | `DEFAULT_FAMILY = IBERIAN` — F2.2d |
| **R-F2-2** | Mis-maps FR/DE/NL/SE/IN/TH/SG — F2.3 |
| **R-F2-3** | Prod sin F2.2c |
| **R-F2-4** | `df1797a` sin push |
| **OP-3** | `dist/` dirty · no commiteado |

---

## VIII. Git status (post F2.2c1 doc)

```
HEAD: df1797a — f2.2c fallback ssot refactor infrastructure
      (+ doc commit F2.2c1 pending/at HEAD after commit)

Rama: main · ahead of origin/main by 1–2 commits
src/: limpio @ df1797a
dist/: modificado / untracked (NO commiteado)
Producción: ce69f09 (LATAM live · pre-F2.2c)
```

---

## IX. Siguiente fase

### **F2.2d — GLOBAL_NEUTRAL design / activation**

1. 14 tablas `GLOBAL_NEUTRAL`
2. `REGISTERED_FAMILIES` += GLOBAL_NEUTRAL
3. `DEFAULT_FAMILY = 'GLOBAL_NEUTRAL'` tras smokes
4. Staging QA → prod explícito

---

## X. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | Trazabilidad F2.2c |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |
| `PRE-F1.4_LATAM_INTEGRATION_CHECKPOINT.md` | LATAM integration |

---

*Checkpoint actualizado F2.2c1 · Doc-only · Sin deploy · Prod @ ce69f09 · Local SSOT @ df1797a*
