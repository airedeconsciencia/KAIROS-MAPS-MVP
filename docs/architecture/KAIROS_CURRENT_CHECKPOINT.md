# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `6c4abc9` — F4.2 Europa residual  
**Checkpoint prod:** `docs/architecture/F4.2_EUROPE_RESIDUAL_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.2-0.1`** · **77 ciudades / 74 países** · EFR **`3.8h.2-f4.2-0.1`** · **74 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.2 Europa residual:** cerrada (`f4.2` · IE/HR/HU)
- **Wave F4.3 África Este+:** cerrada (`f4.3`)
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
| Ciudades | **77** |
| Países visibles / resolver | **74** |
| WESTERN_EUROPE países resolver | **14** (⚠️ saturación) |
| MEDITERRANEAN países resolver | **12** (⚠️ vigilancia) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.2 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- WESTERN_EUROPE + MEDITERRANEAN saturación editorial

---

## Siguiente

**F4.4 Levante+/Golfo** (Líbano · Kuwait) — backlog P2; `EDITORIAL-OK` para Líbano.

---

*Checkpoint F4.2 · Prod 77/74 @ f4.2 · F4.2 COMPLETADA*
