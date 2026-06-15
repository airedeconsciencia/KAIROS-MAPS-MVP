# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main` · **ahead of `origin/main`** (sin push)  
**HEAD runtime:** `e66bcc7` — `f2.6c southeast asian runtime integration`  
**Checkpoint F2.6:** `docs/architecture/F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md`  
**Producción live:** **sin SOUTHEAST_ASIAN desplegado** · runtime local @ `e66bcc7`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP incluye **lectura premium beta** (`?premium=1`), **resolver editorial unificado** (30 países · **9 familias**), dedup P0–P2, **LATAM live en producción**, **SSOT de fallback** (`resolveRegionalPack`), **`DEFAULT_FAMILY = GLOBAL_NEUTRAL`**, **`WESTERN_EUROPE`** integrada (F2.5c), y desde **F2.6c** familia **`SOUTHEAST_ASIAN`** integrada en runtime local.

**PRE-F1 cerrado** · prod LATAM legacy. **F2.2c–F2.2d3 cerrados** · DEFAULT neutral. **F2.3b cerrado** · wave 1 LATAM (CO/CL/UY/EC). **F2.5c cerrado** · WE runtime. **F2.6c cerrado localmente** · SEA runtime + 14 packs + smokes.

**Producción** (https://kairos-maps-mvp.web.app) — **sin F2.6c / SOUTHEAST_ASIAN**. Bangkok · Singapur siguen voz legacy en live hasta F2.6d.

**Local `src/`** — **`e66bcc7`**: SEA registrada · TH/SG migrados · India sigue IBERIAN.

**Smokes gate F2.6c:** **6/6 PASS** (SEA + regresiones).

**Riesgos vivos:** prod sin SEA · `dist/` desincronizado · India sigue IBERIAN · TH/SG comparten familia · vocabulario global en rutas no filtradas.

---

## II. Serie PRE-F1 — cerrada

| Fase | Estado | Commit |
|------|--------|--------|
| PRE-F1.3 → PRE-F1.9d | ✅ Cerrado | `a8d4a60` → `a25e2c7` |

Prod LATAM deploy histórico: PRE-F1.9b @ `ce69f09`. Ver `KAIROS_MASTER_HANDOFF_F1.8.md`.

---

## III. Serie F2 — en curso

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **F2.0–F2.2d3** | ✅ Runtime + doc | DEFAULT GLOBAL_NEUTRAL · `fcf61d7` |
| **F2.2d3c** | ✅ Doc | `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` |
| **F2.3b** | ✅ Runtime | `c4629bd` · CO/CL/UY/EC → LATAM |
| **F2.5a–F2.5c** | ✅ Runtime | `227a00b` · WE registrada · FR/DE/NL/SE |
| **F2.5c1** | ✅ Doc | `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` |
| **F2.6a** | ✅ Diseño | Arquitectura SEA (read-only) |
| **F2.6b** | ✅ Copy | 14 packs SEA (incluido en F2.6c) |
| **F2.6c** | ✅ Runtime | `e66bcc7` · SEA registrada · TH/SG migrados |
| **F2.6c1** | ✅ Doc | `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` |
| **F2.6d** | ⏳ Pendiente | Staging deploy + browser QA SOUTHEAST_ASIAN |

---

## IV. F2.6c — qué cambió / qué no

### Cambió (`e66bcc7`)

- **`SOUTHEAST_ASIAN`** en `REGISTERED_FAMILIES` (**9 familias**)
- Migración: **`thailand` · `singapore`** → `SOUTHEAST_ASIAN`
- **14 packs editoriales** SEA integrados (narrative · composition · knowledge)
- Schema EFR: **`3.8h.2-f2.6c-0.1`**
- Smokes: 2 nuevos SEA + actualización **8 → 9 familias**

### No cambió

- **`DEFAULT_FAMILY`** sigue `GLOBAL_NEUTRAL`
- **`india`** sigue `IBERIAN` (F2.7 SOUTH_ASIAN)
- Sin deploy post-F2.6c
- Prod **sin SOUTHEAST_ASIAN**
- Catálogo · astro · WASM sin tocar

---

## V. Smokes gate actuales

```bash
./scripts/dev-southeast-asian-editorial-smoke.sh
./scripts/dev-southeast-asian-editorial-integration-smoke.sh
./scripts/dev-fallback-ssot-smoke.sh
./scripts/dev-western-europe-editorial-integration-smoke.sh
./scripts/dev-latam-editorial-integration-smoke.sh
./scripts/dev-editorial-dedup-smoke.sh
```

**Estado F2.6c:** **6/6 PASS**.

---

## VI. QA piloto SEA (local)

| Bloque | Resultado |
|--------|-----------|
| Bangkok × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Singapur × amor · trabajo · descanso | **PASS** → SOUTHEAST_ASIAN |
| Tokio / amor | **PASS** → EAST_ASIAN |
| Seúl / amor | **PASS** → EAST_ASIAN |
| Lisboa / amor | **PASS** → IBERIAN |
| CDMX / amor | **PASS** → LATAM |
| Oslo / amor | **PASS** → GLOBAL_NEUTRAL |
| Nairobi / trabajo | **PASS** → AFRICAN_COASTAL |
| Delhi / amor | **PASS** → IBERIAN |

---

## VII. Staging / producción

| Entorno | URL | Runtime efectivo |
|---------|-----|------------------|
| **Producción** | https://kairos-maps-mvp.web.app | **Sin F2.6c** · sin SOUTHEAST_ASIAN |
| **Staging** | https://kairos-maps-dev.web.app | Paridad prod (pre-F2.6d) |
| **Local `src/`** | — | **`e66bcc7`** · SEA integrada |

---

## VIII. Deuda / riesgos abiertos

| ID | Descripción |
|----|-------------|
| **R-F2.6-1** | Producción sin SOUTHEAST_ASIAN |
| **R-F2.6-2** | `india` → IBERIAN (F2.7 SOUTH_ASIAN) |
| **R-F2.6-3** | `dist/` desincronizado vs `src/` F2.6c |
| **R-F2.6-4** | TH/SG comparten familia — WATCH QA manual |
| **R-F2.6-5** | Vocabulario global en rutas no filtradas |
| **R-F2.6-6** | Commits sin push |
| **OP-3** | `dist/` dirty · no commiteado |

---

## IX. Git status (post F2.6c1 doc)

```
HEAD runtime: e66bcc7 — f2.6c southeast asian runtime integration
HEAD doc:     (pending) — f2.6c southeast asian runtime checkpoint

Rama: main · ahead of origin/main
src/: limpio @ e66bcc7
dist/: modificado / untracked (NO commiteado)
Producción: sin SOUTHEAST_ASIAN desplegado
```

---

## X. Siguiente fase

### **F2.6d — Staging deploy + browser QA SOUTHEAST_ASIAN**

1. Build `dist/` desde `src/` @ `e66bcc7`
2. Deploy staging
3. Browser QA Bangkok · Singapur (+ regresiones Tokio · Seúl · Lisboa · CDMX · Oslo · Nairobi · Delhi)
4. Gate explícito antes de prod

---

## XI. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `F2.6C_SOUTHEAST_ASIAN_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.6c SEA runtime |
| `F2.5C_WESTERN_EUROPE_RUNTIME_CHECKPOINT.md` | Trazabilidad F2.5c WE runtime |
| `F2.2D3_GLOBAL_NEUTRAL_DEFAULT_CHECKPOINT.md` | DEFAULT GLOBAL_NEUTRAL |
| `F2.2C_SSOT_FALLBACK_REFACTOR_CHECKPOINT.md` | SSOT fallback |
| `KAIROS_MASTER_HANDOFF_F1.8.md` | Handoff PRE-F1 |

---

*Checkpoint actualizado F2.6c1 · Doc-only · Sin deploy · Prod sin SEA · Local runtime @ e66bcc7*
