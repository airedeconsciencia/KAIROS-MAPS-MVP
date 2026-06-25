# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `e4a8b93` — F3.16 Golfo  
**Checkpoint:** `docs/architecture/F3.16_GOLFO_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f3.16-0.1`** · **68 ciudades / 65 países** · EFR **`3.8h.2-f3.16-0.1`** · **65 países resolver** · **11 familias**

---

## Estado

- **Wave E1:** cerrada (`f3.13c` · 8 países WE)
- **Wave E2 Maghreb:** cerrada (`f3.14` · Marruecos · Túnez → MEDITERRANEAN)
- **Wave F3.15 Asia Oriental:** cerrada (`f3.15` · China · Taiwán → EAST_ASIAN)
- **Wave F3.16 Golfo:** cerrada (`f3.16` · UAE · QA · SA → MEDITERRANEAN)
- **WA 10/10** · São Paulo NO catálogo
- **Maó/Menorca:** aparcado — futura fase ciudades secundarias (no prioridad)

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **68** |
| Países visibles / resolver | **65** |
| MEDITERRANEAN países resolver | **9** (ES/IT/GR/TR + MA/TN + AE/QA/SA) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS**.

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- Israel/Tel Aviv pendiente — requiere `EDITORIAL-OK`

---

## Siguiente wave sugerida

**F3.17 — África Este (Etiopía · Tanzania):** máximo ROI global no europeo; familia `AFRICAN_COASTAL` probable. Alternativa: Israel con `EDITORIAL-OK`. Europa residual depriorizada.

---

*Checkpoint F3.16 · Prod 68/65 @ f3.16*
