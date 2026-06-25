# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `555748e` — F4.3 África Este+  
**Checkpoint prod:** `docs/architecture/F4.3_AFRICA_EAST_PLUS_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.3-0.1`** · **74 ciudades / 71 países** · EFR **`3.8h.2-f4.3-0.1`** · **71 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.3 África Este+:** cerrada (`f4.3` · UG · RW → AFRICAN_COASTAL)
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
| Ciudades | **74** |
| Países visibles / resolver | **71** |
| AFRICAN_COASTAL países resolver | **7** (vigilancia saturación) |
| MEDITERRANEAN países resolver | **11** (vigilancia saturación) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.3 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- AFRICAN_COASTAL + MEDITERRANEAN saturación vigilancia

---

## Siguiente

**F4.2 Europa residual** (Irlanda · Croacia · Hungría) — backlog P2; alternancia post-África.

---

*Checkpoint F4.3 · Prod 74/71 @ f4.3 · F4.3 COMPLETADA*
