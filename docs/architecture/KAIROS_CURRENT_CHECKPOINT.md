# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `33dd53b` — F4.4 África Austral  
**Checkpoint prod:** `docs/architecture/F4.4_AFRICA_SOUTHERN_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.4-0.1`** · **79 ciudades / 76 países** · EFR **`3.8h.2-f4.4-0.1`** · **76 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.2 Europa residual:** cerrada (`f4.2` · IE/HR/HU)
- **Wave F4.3 África Este+:** cerrada (`f4.3`)
- **Wave F4.4 África Austral:** cerrada (`f4.4` · AO/MZ)
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
| Ciudades | **79** |
| Países visibles / resolver | **76** |
| AFRICAN_COASTAL países resolver | **9** (⚠️ vigilancia) |
| WESTERN_EUROPE países resolver | **14** (⚠️ saturación) |
| MEDITERRANEAN países resolver | **12** (⚠️ vigilancia) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.4 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- WESTERN_EUROPE + MEDITERRANEAN saturación editorial
- AFRICAN_COASTAL heterogeneidad sur/este/norte (vigilancia post-F4.4)

---

## Siguiente

**F4.5 LATAM residual** (Paraguay · Bolivia) — alternancia regional; Levante+/Golfo pospuesto hasta plan MENA.

---

*Checkpoint F4.4 · Prod 79/76 @ f4.4 · F4.4 COMPLETADA*
