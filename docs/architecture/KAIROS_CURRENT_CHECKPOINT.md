# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `e7ca4a7` — F6.1 MENA Migration  
**Checkpoint prod:** `docs/architecture/F6.1_MENA_MIGRATION_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** catálogo **`3.8f.1-f5.2-0.1`** · resolver **`3.8h.2-f6.1-0.1`** · **102 ciudades / 99 países** · **12 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1–F4.11:** cerradas
- **Wave F5.1 ANGLO Caribbean II:** cerrada (`f5.1`)
- **Wave F5.2 East Asia + SEA Closure:** cerrada (`f5.2`)
- **F6.0 MENA Architecture Sprint:** cerrada (`f6.0` · packs · 0 países)
- **Wave F6.1 MENA Migration:** cerrada (`f6.1` · AE/QA/SA/IL/JO)
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
| Ciudades | **102** |
| Países visibles / resolver | **99** |
| **MENA** países resolver | **5** |
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

Suite **10/10 PASS** (@ F6.1 prod): 9 estándar + `dev-mena-architecture-smoke.sh`

---

## Riesgos vivos

- Cache browser `cities-catalog.js` / `editorial-family-resolver.js`
- `dist/` sucio local (rsync deploy-prod; no commitear)
- Lecturas MENA live en Dubái/Tel Aviv — monitorizar anti-leak post-migración
- Israel — país sensible; vigilancia editorial continua
- ANGLO @ 11 — 1 slot Surinam antes de umbral 12
- Familias congeladas: WE · LATAM · WA · AC
- Líbano requiere `EDITORIAL-OK` antes de F6.2 territorial

---

## Siguiente

**F6.2** — expansión territorial MENA (LB/KW/OM).  
**F5.3** — Surinam ANGLO (último slot umbral 12).

---

*Checkpoint F6.1 · Prod 102/99 @ f6.1 · F6.1 COMPLETADA*
