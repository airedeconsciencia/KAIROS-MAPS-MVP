# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `f1bde2b` — F3.14 E2 Maghreb  
**Checkpoint:** `docs/architecture/F3.14_E2_MAGHREB_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f3.14-0.1`** · **63 ciudades / 60 países** · EFR **`3.8h.2-f3.14-0.1`** · **60 países resolver** · **11 familias**

---

## Estado

- **Wave E1:** cerrada (`f3.13c` · 8 países WE)
- **Wave E2 Maghreb:** cerrada (`f3.14` · Marruecos · Túnez → MEDITERRANEAN)
- **WA 10/10** · São Paulo NO catálogo
- **Maó/Menorca:** aparcado — futura fase ciudades secundarias (no prioridad)

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **63** |
| Países visibles / resolver | **60** |
| MED países resolver | **6** (ES/IT/GR/TR + MA/TN) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS**.

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local

---

## Siguiente wave sugerida

**F3.15 — E3 Europa Central/Occidental residual:** Irlanda · Croacia · Hungría (ROI territorial · familia existente probable).

---

*Checkpoint F3.14 · Prod 63/60 @ f3.14*
