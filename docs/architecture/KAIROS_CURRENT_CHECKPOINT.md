# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `3c6019a` — F6.3 ANGLO Closure  
**Checkpoint prod:** `docs/architecture/F6.3_ANGLO_CLOSURE_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** catálogo **`3.8f.1-f6.3-0.1`** · resolver **`3.8h.2-f6.3-0.1`** · **106 ciudades / 103 países** · **12 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1–F4.11:** cerradas
- **Wave F5.1 ANGLO Caribbean II:** cerrada (`f5.1`)
- **Wave F5.2 East Asia + SEA Closure:** cerrada (`f5.2`)
- **F6.0 MENA Architecture Sprint:** cerrada (`f6.0` · packs · 0 países)
- **Wave F6.1 MENA Migration:** cerrada (`f6.1` · AE/QA/SA/IL/JO)
- **Wave F6.2 MENA Expansion:** cerrada (`f6.2` · LB/KW/OM)
- **Wave F6.3 ANGLO Closure:** cerrada (`f6.3` · Surinam/Paramaribo)
- **F5.0 Family Architecture Audit:** entregada (READ-ONLY)
- **WA 13/13** · São Paulo NO catálogo · Maó/Menorca aparcado

---

## F4/F5/F6/F7 — Documentación SSOT

| Documento | Rol |
|-----------|-----|
| `GLOBAL_EXPANSION_BACKLOG.md` | Países pendientes · waves · dependencias |
| `EDITORIAL_FAMILY_POLICY.md` | Reutilizar / crear / saturación familia |
| `WAVE_PLANNER.md` | Reglas batch · gates · pipeline · STOP |

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **106** |
| Países visibles / resolver | **103** |
| **ANGLO** países resolver | **12** (⚠️ umbral editorial) |
| **MENA** países resolver | **8** |
| **MEDITERRANEAN** países resolver | **7** |
| EAST_ASIAN países resolver | **5** |
| SOUTHEAST_ASIAN países resolver | **11** (ASEAN completo) |
| SOUTH_ASIAN países resolver | **8** |
| WEST_AFRICAN países resolver | **13** (🔒 congelada) |
| AFRICAN_COASTAL países resolver | **12** (🔒 congelada) |
| LATAM países resolver | **12** (🔒 congelada) |
| WESTERN_EUROPE países resolver | **14** (🔒 congelada) |
| GN canario | Reykjavik / `iceland` |

---

## Smokes

Suite **10/10 PASS** (@ F6.3 prod): 9 estándar + `dev-mena-architecture-smoke.sh` · split-brain **97 = 0**

---

## Riesgos vivos

- Cache browser `cities-catalog.js` / `editorial-family-resolver.js`
- `dist/` sucio local (rsync deploy-prod; no commitear)
- **ANGLO @ 12** — umbral editorial alcanzado; no añadir países sin F7.0 audit
- Lecturas MENA live — monitorizar anti-leak (Dubái · Tel Aviv · Beirut)
- Israel · Líbano — países sensibles; vigilancia editorial continua
- Familias congeladas: WE · LATAM · WA · AC

---

## Siguiente

**F7.0 GLOBAL EDITORIAL AUDIT READY** — pausa expansión territorial; auditoría READ-ONLY de saturación, gaps y ROI antes de F6.4+ / F7.1.

---

*Checkpoint F6.3 · Prod 106/103 @ f6.3 · F6.3 COMPLETADA · STOP @ F7.0*
