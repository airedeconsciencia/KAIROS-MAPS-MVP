# KAIROS MAPS — Current Checkpoint

**Fecha:** 26 mayo 2026  
**HEAD runtime:** `a83a371` — F5.1 ANGLO Caribbean II  
**Checkpoint prod:** `docs/architecture/F5.1_ANGLO_CARIBBEAN_II_PRODUCTION_CHECKPOINT.md`  
**Producción / Staging:** **`3.8f.1-f5.1-0.1`** · **100 ciudades / 97 países** · EFR **`3.8h.2-f5.1-0.1`** · **97 países resolver** · **11 familias**

---

## Estado

- **F4.0 Global Expansion Framework:** activo (SSOT docs)
- **Wave F4.1 Levante:** cerrada (`f4.1`)
- **Wave F4.2 Europa residual:** cerrada (`f4.2` · IE/HR/HU)
- **Wave F4.3 África Este+:** cerrada (`f4.3`)
- **Wave F4.4 África Austral:** cerrada (`f4.4` · AO/MZ)
- **Wave F4.5 LATAM residual:** cerrada (`f4.5` · PY/BO)
- **Wave F4.6 SEA residual:** cerrada (`f4.6` · KH/LA)
- **Wave F4.7 SEA residual final:** cerrada (`f4.7` · MM/BN)
- **Wave F4.8 ANGLO Caribe:** cerrada (`f4.8` · JM/TT/BB)
- **Wave F4.9 SOUTH_ASIAN residual:** cerrada (`f4.9` · BT/MV/AF)
- **Wave F4.10 WEST_AFRICAN Sahel:** cerrada (`f4.10` · ML/BF/NE)
- **Wave F4.11 AFRICAN_COASTAL Southern:** cerrada (`f4.11` · MG/MU/NA)
- **Wave F5.1 ANGLO Caribbean II:** cerrada (`f5.1` · BS/BZ/GY)
- **F5.0 Family Architecture Audit:** entregada (READ-ONLY)
- **WA 13/13** · São Paulo NO catálogo · Maó/Menorca aparcado

---

## F4/F5 — Documentación SSOT

| Documento | Rol |
|-----------|-----|
| `GLOBAL_EXPANSION_BACKLOG.md` | Países pendientes · waves · dependencias |
| `EDITORIAL_FAMILY_POLICY.md` | Reutilizar / crear / saturación familia |
| `WAVE_PLANNER.md` | Reglas batch · gates · pipeline · STOP |

---

## SSOT prod

| Métrica | Valor |
|---------|-------|
| Ciudades | **100** |
| Países visibles / resolver | **97** |
| ANGLO países resolver | **11** (⚠️ vigilancia umbral 12) |
| SOUTHEAST_ASIAN países resolver | **10** |
| SOUTH_ASIAN países resolver | **8** |
| WEST_AFRICAN países resolver | **13** (🔒 congelada) |
| AFRICAN_COASTAL países resolver | **12** (🔒 congelada) |
| LATAM países resolver | **12** (🔒 congelada) |
| WESTERN_EUROPE países resolver | **14** (🔒 congelada) |
| MEDITERRANEAN países resolver | **12** (🔒 congelada) |
| GN canary | Reykjavik / `iceland` |

---

## Smokes

Suite estándar **9/9 PASS** (@ F5.1 prod).

---

## Riesgos vivos

- Cache browser `cities-catalog.js`
- `dist/` sucio local (rsync deploy-prod; no commitear)
- ANGLO @ 11 países — congelar tras Surinam o F5.2
- Familias congeladas: WE · MED · LATAM · WA · AC
- MENA sprint (F6.0) pendiente antes de Líbano/Kuwait/Omán
- Corea del Norte requiere `EDITORIAL-OK` si wave EAST_ASIAN

---

## Siguiente

**F5.2** — EAST_ASIAN residual (Mongolia) + SEA cierre (Timor-Leste) o Surinam ANGLO (último slot umbral 12).  
**F6.0** — sprint arquitectura MENA @ plateau ~100 países.

---

*Checkpoint F5.1 · Prod 100/97 @ f5.1 · F5.1 COMPLETADA*
