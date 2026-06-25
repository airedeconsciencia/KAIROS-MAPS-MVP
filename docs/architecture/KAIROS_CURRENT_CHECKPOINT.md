# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `0025dda` — F4.5 LATAM residual  
**Checkpoint prod:** `docs/architecture/F4.5_LATAM_RESIDUAL_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.5-0.1`** · **81 ciudades / 78 países** · EFR **`3.8h.2-f4.5-0.1`** · **78 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.2 Europa residual:** cerrada (`f4.2` · IE/HR/HU)
- **Wave F4.3 África Este+:** cerrada (`f4.3`)
- **Wave F4.4 África Austral:** cerrada (`f4.4` · AO/MZ)
- **Wave F4.5 LATAM residual:** cerrada (`f4.5` · PY/BO)
- **WA 10/10** · São Paulo NO catálogo · Maó/Menorca aparcado

---

## F4 — Documentación SSOT

| Documento | Rol |
|-----------|-----|
| `GLOBAL_EXPANSION_BACKLOG.md` | Países pendientes · waves · dependencias |
| `EDITORIAL_FAMILY_POLICY.md` | Reutilizar / crear / saturación familia |
| `WAVE_PLANNER.md` | Reglas batch · gates · pipeline · STOP |

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **81** |
| Países visibles / resolver | **78** |
| LATAM países resolver | **12** (⚠️ vigilancia umbral) |
| AFRICAN_COASTAL países resolver | **9** (⚠️ vigilancia) |
| WESTERN_EUROPE países resolver | **14** (⚠️ saturación) |
| MEDITERRANEAN países resolver | **12** (⚠️ vigilancia) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.5 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- WESTERN_EUROPE + MEDITERRANEAN saturación editorial
- LATAM en umbral 12 países (vigilancia post-F4.5)
- AFRICAN_COASTAL heterogeneidad sur/este/norte

---

## Siguiente

**F4.6 SEA residual** (Camboya · Laos) — alternancia regional; Levante+/Golfo pospuesto hasta plan MENA.

---

*Checkpoint F4.5 · Prod 81/78 @ f4.5 · F4.5 COMPLETADA*
