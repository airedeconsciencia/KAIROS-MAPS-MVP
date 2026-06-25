# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `070bd7a` — F3.15 Asia Oriental  
**Checkpoint:** `docs/architecture/F3.15_ASIA_ORIENTAL_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f3.15-0.1`** · **65 ciudades / 62 países** · EFR **`3.8h.2-f3.15-0.1`** · **62 países resolver** · **11 familias**

---

## Estado

- **Wave E1:** cerrada (`f3.13c` · 8 países WE)
- **Wave E2 Maghreb:** cerrada (`f3.14` · Marruecos · Túnez → MEDITERRANEAN)
- **Wave F3.15 Asia Oriental:** cerrada (`f3.15` · China · Taiwán → EAST_ASIAN)
- **WA 10/10** · São Paulo NO catálogo
- **Maó/Menorca:** aparcado — futura fase ciudades secundarias (no prioridad)

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **65** |
| Países visibles / resolver | **62** |
| EAST_ASIAN países resolver | **4** (JP · KR · CN · TW) |
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

**F3.16 — Oriente Medio (UAE · Dubái):** máximo ROI global; familia `MEDITERRANEAN` probable. Alternativa: **F3.17 África Este** (Etiopía · Tanzania). Europa residual depriorizada.

---

*Checkpoint F3.15 · Prod 65/62 @ f3.15*
