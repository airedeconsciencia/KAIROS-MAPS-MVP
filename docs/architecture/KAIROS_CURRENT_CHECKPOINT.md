# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `ce27836` — F3.17 África Este  
**Checkpoint:** `docs/architecture/F3.17_AFRICA_ESTE_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f3.17-0.1`** · **70 ciudades / 67 países** · EFR **`3.8h.2-f3.17-0.1`** · **67 países resolver** · **11 familias**

---

## Estado

- **Wave E1:** cerrada (`f3.13c` · 8 países WE)
- **Wave E2 Maghreb:** cerrada (`f3.14`)
- **Wave F3.15 Asia Oriental:** cerrada (`f3.15`)
- **Wave F3.16 Golfo:** cerrada (`f3.16`)
- **Wave F3.17 África Este:** cerrada (`f3.17` · ET · TZ → AFRICAN_COASTAL)
- **Fase 3 territorial:** cerrada — prod **70/67**
- **WA 10/10** · São Paulo NO catálogo
- **Maó/Menorca:** aparcado

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **70** |
| Países visibles / resolver | **67** |
| AFRICAN_COASTAL países resolver | **5** (ZA · EG · KE · ET · TZ) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS**.

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- 5 smokes drift 6→11 (pre-existente)
- `dist/` sucio local
- Israel/Levante pendiente — requiere `EDITORIAL-OK`

---

## Siguiente

**F4 — Global Expansion Framework.** Primera wave: **F4.1 Levante** (Israel · Jordania).

---

*Checkpoint F3.17 · Prod 70/67 @ f3.17*
