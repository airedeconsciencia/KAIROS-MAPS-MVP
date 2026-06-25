# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `36f9906` — F4.1 Levante  
**Checkpoint prod:** `docs/architecture/F4.1_LEVANTE_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f4.1-0.1`** · **72 ciudades / 69 países** · EFR **`3.8h.2-f4.1-0.1`** · **69 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1` · IL · JO → MEDITERRANEAN · `EDITORIAL-OK`)
- **Fase 3 territorial:** cerrada
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
| Ciudades | **72** |
| Países visibles / resolver | **69** |
| MEDITERRANEAN países resolver | **11** (vigilancia saturación) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F4.1 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- MEDITERRANEAN saturación vigilancia (11 países)

---

## Siguiente

**F4.3 África Este+** (Uganda · Ruanda) — prioridad backlog; alternancia regional post-Levante.

---

*Checkpoint F4.1 · Prod 72/69 @ f4.1*
