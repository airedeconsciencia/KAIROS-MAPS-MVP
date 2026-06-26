# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `05d77c7` — F6.2 MENA Expansion  
**Checkpoint prod:** `docs/architecture/F6.2_MENA_EXPANSION_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** catálogo **`3.8f.1-f6.2-0.1`** · resolver **`3.8h.2-f6.2-0.1`** · **105 ciudades / 102 países** · **12 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1–F4.11:** cerradas
- **Wave F5.1 ANGLO Caribbean II:** cerrada (`f5.1`)
- **Wave F5.2 East Asia + SEA Closure:** cerrada (`f5.2`)
- **F6.0 MENA Architecture Sprint:** cerrada (`f6.0` · packs · 0 países)
- **Wave F6.1 MENA Migration:** cerrada (`f6.1` · AE/QA/SA/IL/JO)
- **Wave F6.2 MENA Expansion:** cerrada (`f6.2` · LB/KW/OM)
- **F5.0 Family Architecture Audit:** entregada (READ-ONLY)
- **WA 13/13** · São Paulo NO catálogo · Maó/Menorca aparcado

---

## F4/F5/F6 — Documentación SSOT

| Documento | Rol |
|-----------|-----|
| `GLOBAL_EXPANSION_BACKLOG.md` | Países pendientes · waves · dependencias |
| `EDITORIAL_FAMILY_POLICY.md` | Reutilizar / crear / saturación familia |
| `WAVE_PLANNER.md` | Reglas batch · gates · pipeline · STOP |

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **105** |
| Países visibles / resolver | **102** |
| **MENA** países resolver | **8** |
| **MEDITERRANEAN** países resolver | **7** |
| EAST_ASIAN países resolver | **5** |
| SOUTHEAST_ASIAN países resolver | **11** (ASEAN completo) |
| ANGLO países resolver | **11** (⚠️ vigilancia umbral 12) |
| SOUTH_ASIAN países resolver | **8** |
| WEST_AFRICAN países resolver | **13** (🔒 congelada) |
| AFRICAN_COASTAL países resolver | **12** (🔒 congelada) |
| LATAM países resolver | **12** (🔒 congelada) |
| WESTERN_EUROPE países resolver | **14** (🔒 congelada) |
| GN canario | Reykjavik / `iceland` |

---

## Smokes

Suite **10/10 PASS** (@ F6.2 prod): 9 estándar + `dev-mena-architecture-smoke.sh` · split-brain **96 = 0**

---

## Riesgos vivos

- Cache browser `cities-catalog.js` / `editorial-family-resolver.js`
- `dist/` sucio local (rsync deploy-prod; no commitear)
- Lecturas MENA live — monitorizar anti-leak (Dubái · Tel Aviv · **Beirut**)
- Israel · Líbano — países sensibles; vigilancia editorial continua
- ANGLO @ 11 — 1 slot Surinam antes de umbral 12
- Familias congeladas: WE · LATAM · WA · AC

---

## Siguiente

**F6.3** — expansión MENA Golfo II (BH/IQ/YE).  
**F5.3** — Surinam ANGLO (último slot umbral 12).

---

*Checkpoint F6.2 · Prod 105/102 @ f6.2 · F6.2 COMPLETADA*
