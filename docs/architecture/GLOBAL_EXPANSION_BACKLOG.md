# GLOBAL EXPANSION BACKLOG

**Fase:** F5.x — Global Expansion Framework  
**SSOT expansión territorial** · solo documentación  
**Baseline prod:** `f5.2` · **102 ciudades / 99 países** · **11 familias**  
**Última revisión:** 26 mayo 2026

> Este documento es la fuente de verdad para **qué falta**, **en qué wave** y **con qué dependencias**.  
> El runtime (`cities-catalog.js`, `editorial-family-resolver.js`) no se modifica aquí.

---

## Leyenda

| Campo | Valores |
|-------|---------|
| **status** | `live` · `planned` · `implementing` · `parked` |
| **prioridad** | P1 (alta) · P2 (media) · P3 (baja) |
| **dependencias** | `—` · `EDITORIAL-OK` · `familia nueva` · `densificación` |

---

## I. Registro live (99 países — referencia @ f5.2)

Todos con **status: `live`** · waves F2–F5.2 · catálogo + resolver sincronizados @ `f5.2`.

| Región | Países live (slug) | Familia |
|--------|-------------------|---------|
| Europa occidental/central/nórdica | `france` `germany` `netherlands` `belgium` `switzerland` `austria` `poland` `czech_republic` `denmark` `sweden` `norway` `finland` `ireland` `hungary` | WESTERN_EUROPE |
| Europa / OM / Levante / Magreb | `spain` `italy` `greece` `croatia` `turkey` `morocco` `tunisia` `united_arab_emirates` `qatar` `saudi_arabia` `israel` `jordan` | MEDITERRANEAN |
| Iberia | `portugal` | IBERIAN |
| Anglo / Caribe / Oceanía | `united_kingdom` `united_states` `canada` `australia` `new_zealand` `jamaica` `trinidad_and_tobago` `barbados` `bahamas` `belize` `guyana` | ANGLO |
| América Latina | `mexico` `argentina` `brazil` `peru` `colombia` `chile` `uruguay` `ecuador` `costa_rica` `panama` `paraguay` `bolivia` | LATAM |
| Asia oriental | `japan` `south_korea` `china` `taiwan` `mongolia` | EAST_ASIAN |
| Sudeste asiático | `thailand` `singapore` `vietnam` `malaysia` `indonesia` `philippines` `cambodia` `laos` `myanmar` `brunei` `timor_leste` | SOUTHEAST_ASIAN |
| Asia meridional | `india` `pakistan` `bangladesh` `sri_lanka` `nepal` `bhutan` `maldives` `afghanistan` | SOUTH_ASIAN |
| África no-WA | `south_africa` `egypt` `kenya` `ethiopia` `tanzania` `uganda` `rwanda` `angola` `mozambique` `madagascar` `mauritius` `namibia` | AFRICAN_COASTAL |
| África occidental | `nigeria` `ghana` `senegal` `ivory_coast` `sierra_leone` `liberia` `benin` `togo` `guinea` `gambia` `mali` `burkina_faso` `niger` | WEST_AFRICAN |

**Densificación live (mismo país, >1 ciudad):** `spain` (Madrid · Barcelona) · `united_states` (NYC · LA) · `india` (Delhi · Mumbai).

---

## II. Backlog territorial — países pendientes

Ordenado por **prioridad arquitectónica** post-auditoría F5.0.

### Cerrados F5.2 (live @ f5.2)

| País | slug | Wave | status |
|------|------|------|--------|
| Mongolia | `mongolia` | F5.2 | `live` |
| Timor-Leste | `timor_leste` | F5.2 | `live` |

### Cerrados F5.1 (live @ f5.2 prod bundle)

| País | slug | Wave | status |
|------|------|------|--------|
| Bahamas | `bahamas` | F5.1 | `live` |
| Belice | `belize` | F5.1 | `live` |
| Guyana | `guyana` | F5.1 | `live` |

### Cerrados F4.11 (live @ f5.2 prod bundle)

| País | slug | Wave | status |
|------|------|------|--------|
| Madagascar | `madagascar` | F4.11 | `live` |
| Mauricio | `mauritius` | F4.11 | `live` |
| Namibia | `namibia` | F4.11 | `live` |

### Cerrados F4.8–F4.10 (live @ f5.2 prod bundle)

| País | slug | Wave | status |
|------|------|------|--------|
| Jamaica | `jamaica` | F4.8 | `live` |
| Trinidad y Tobago | `trinidad_and_tobago` | F4.8 | `live` |
| Barbados | `barbados` | F4.8 | `live` |
| Bután | `bhutan` | F4.9 | `live` |
| Maldivas | `maldives` | F4.9 | `live` |
| Afganistán | `afghanistan` | F4.9 | `live` |
| Mali | `mali` | F4.10 | `live` |
| Burkina Faso | `burkina_faso` | F4.10 | `live` |
| Níger | `niger` | F4.10 | `live` |

### Cerrados F4.7 (live @ f5.2 prod bundle)

| País | slug | Wave | status |
|------|------|------|--------|
| Myanmar | `myanmar` | F4.7 | `live` |
| Brunéi | `brunei` | F4.7 | `live` |

### P1 — Reutilizable (familias con margen)

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Surinam | `suriname` | Caribe | ANGLO | Paramaribo | **F5.3** | P1 | último slot ANGLO @ 12 |
| Corea del Norte | `north_korea` | Asia oriental | EAST_ASIAN | Pyongyang | **F5.4** | P1 | **EDITORIAL-OK** |

### P2 — Requiere familia nueva (F6.0+)

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Líbano | `lebanon` | Levante | **MENA** | Beirut | **F6.1** | P2 | **F6.0** sprint + `EDITORIAL-OK` |
| Kuwait | `kuwait` | Golfo | **MENA** | Ciudad de Kuwait | **F6.1** | P2 | **F6.0** |
| Omán | `oman` | Golfo | **MENA** | Mascate | **F6.1** | P2 | **F6.0** |
| Baréin | `bahrain` | Golfo | **MENA** | Manama | **F6.2** | P2 | **F6.0** |
| Irak | `iraq` | Golfo | **MENA** | Bagdad | **F6.2** | P2 | **F6.0** |
| Yemen | `yemen` | Golfo | **MENA** | Saná | **F6.2** | P2 | **F6.0** |
| Kazajistán | `kazakhstan` | Asia Central | **CENTRAL_ASIAN** | Astaná | **F7.1** | P2 | **F7.0** sprint |

### P3 — Bloqueados (familias congeladas)

| País | slug | Familia forzada | Wave | Dependencias |
|------|------|-----------------|------|--------------|
| Venezuela | `venezuela` | LATAM @ 12 | — | excepción arquitectónica |
| Botsuana | `botswana` | AC @ 12 | — | familia congelada |
| Camerún | `cameroon` | WA/AC | — | decisión editorial |

### Parked

| Item | Motivo | status |
|------|--------|--------|
| Maó / Menorca | Ciudades secundarias — no expansión país | `parked` |
| São Paulo | Fuera de catálogo SSOT | `parked` |
| Islandia (`iceland`) | Canario GN | `parked` |

---

## III. Objetivos numéricos F5

| Hito | Ciudades | Países | Notas |
|------|----------|--------|-------|
| **Actual (F5.2)** | 102 | 99 | ✅ Baseline prod |
| **F5 plateau** | ~103 | ~100 | F5.3 Surinam |
| **F6 MENA** | ~109 | ~106 | +6 tras sprint F6.0 |
| **F7 CENTRAL_ASIAN** | ~115 | ~112 | +5 tras sprint F7.0 |
| **Target 120** | ~123 | ~120 | requiere 2 familias nuevas |

---

## IV. Reglas de mantenimiento

1. Al cerrar una wave en prod, cambiar `planned` → `live` y anotar wave real.
2. No añadir país sin fila en este backlog.
3. Familias congeladas (WE · MED · LATAM · WA · AC): no wave territorial sin excepción documentada.
4. MENA / CENTRAL_ASIAN: sprint arquitectura antes de wave territorial.

---

*Backlog F5.2 · baseline prod 102/99 @ f5.2*
