# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `a963f5d` — F4.6 SEA residual  
**Checkpoint prod:** `docs/architecture/F4.6_SEA_RESIDUAL_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.6-0.1`** · **83 ciudades / 80 países** · EFR **`3.8h.2-f4.6-0.1`** · **80 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.2 Europa residual:** cerrada (`f4.2` · IE/HR/HU)
- **Wave F4.3 África Este+:** cerrada (`f4.3`)
- **Wave F4.4 África Austral:** cerrada (`f4.4` · AO/MZ)
- **Wave F4.5 LATAM residual:** cerrada (`f4.5` · PY/BO)
- **Wave F4.6 SEA residual:** cerrada (`f4.6` · KH/LA)
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
| Ciudades | **83** |
| Países visibles / resolver | **80** |
| SOUTHEAST_ASIAN países resolver | **8** |
| LATAM países resolver | **12** (⚠️ vigilancia umbral) |
| AFRICAN_COASTAL países resolver | **9** (⚠️ vigilancia) |
| WESTERN_EUROPE países resolver | **14** (⚠️ saturación) |
| MEDITERRANEAN países resolver | **12** (⚠️ vigilancia) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.6 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- WESTERN_EUROPE + MEDITERRANEAN saturación editorial
- LATAM en umbral 12 países
- AFRICAN_COASTAL heterogeneidad sur/este/norte
- F4.7 bloqueada sin `EDITORIAL-OK` (Myanmar · Venezuela)

---

## Siguiente

**F5.0 Editorial Family Saturation Audit** — READ-ONLY; no wave territorial hasta decisión post-auditoría.

---

*Checkpoint F4.6 · Prod 83/80 @ f4.6 · F4.6 COMPLETADA*
