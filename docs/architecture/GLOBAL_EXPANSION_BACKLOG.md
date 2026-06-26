# GLOBAL EXPANSION BACKLOG

**Fase:** F7.0 — Global Expansion Framework (pausa post-F6.3)  
**SSOT expansión territorial** · solo documentación  
**Baseline prod:** `f6.3` · **106 ciudades / 103 países** · **12 familias**  
**Última revisión:** 26 mayo 2026

> Este documento es la fuente de verdad para **qué falta**, **en qué wave** y **con qué dependencias**.  
> El runtime (`cities-catalog.js`, `editorial-family-resolver.js`) no se modifica aquí.

---

## Leyenda

| Campo | Valores |
|-------|---------|
| **status** | `live` · `planned` · `implementing` · `parked` |
| **prioridad** | P1 (alta) · P2 (media) · P3 (baja) |
| **dependencias** | `—` · `EDITORIAL-OK` · `familia nueva` · `densificación` · **F7.0 audit** |

---

## I. Registro live (103 países — referencia @ f6.3)

Todos con **status: `live`** · waves F2–F6.3 · catálogo + resolver sincronizados @ `f6.3`.

| Región | Países live (slug) | Familia |
|--------|-------------------|---------|
| Europa occidental/central/nórdica | `france` `germany` `netherlands` `belgium` `switzerland` `austria` `poland` `czech_republic` `denmark` `sweden` `norway` `finland` `ireland` `hungary` | WESTERN_EUROPE |
| Europa meridional / Magreb | `spain` `italy` `greece` `croatia` `turkey` `morocco` `tunisia` | MEDITERRANEAN |
| Golfo / Levante MENA | `united_arab_emirates` `qatar` `saudi_arabia` `israel` `jordan` `lebanon` `kuwait` `oman` | **MENA** |
| Iberia | `portugal` | IBERIAN |
| Anglo / Caribe / Oceanía | `united_kingdom` `united_states` `canada` `australia` `new_zealand` `jamaica` `trinidad_and_tobago` `barbados` `bahamas` `belize` `guyana` `suriname` | ANGLO |
| América Latina | `mexico` `argentina` `brazil` `peru` `colombia` `chile` `uruguay` `ecuador` `costa_rica` `panama` `paraguay` `bolivia` | LATAM |
| Asia oriental | `japan` `south_korea` `china` `taiwan` `mongolia` | EAST_ASIAN |
| Sudeste asiático | `thailand` `singapore` `vietnam` `malaysia` `indonesia` `philippines` `cambodia` `laos` `myanmar` `brunei` `timor_leste` | SOUTHEAST_ASIAN |
| Asia meridional | `india` `pakistan` `bangladesh` `sri_lanka` `nepal` `bhutan` `maldives` `afghanistan` | SOUTH_ASIAN |
| África no-WA | `south_africa` `egypt` `kenya` `ethiopia` `tanzania` `uganda` `rwanda` `angola` `mozambique` `madagascar` `mauritius` `namibia` | AFRICAN_COASTAL |
| África occidental | `nigeria` `ghana` `senegal` `ivory_coast` `sierra_leone` `liberia` `benin` `togo` `guinea` `gambia` `mali` `burkina_faso` `niger` | WEST_AFRICAN |

**Densificación live (mismo país, >1 ciudad):** `spain` (Madrid · Barcelona) · `united_states` (NYC · LA) · `india` (Delhi · Mumbai).

---

## II. Backlog territorial — países pendientes

Ordenado por **prioridad arquitectónica** post-F6.3.  
**Gate activo:** ninguna wave territorial sin **F7.0 GLOBAL EDITORIAL AUDIT**.

### Cerrados F6.3 — ANGLO closure (live @ f6.3)

| País | slug | Wave | status | Nota |
|------|------|------|--------|------|
| Surinam | `suriname` | F6.3 | `live` | Paramaribo · umbral ANGLO 12/12 |

### Cerrados F6.2 — expansión territorial MENA (live @ f6.2)

| País | slug | Wave | status | Nota |
|------|------|------|--------|------|
| Líbano | `lebanon` | F6.2 | `live` | Beirut · EDITORIAL-OK |
| Kuwait | `kuwait` | F6.2 | `live` | Ciudad de Kuwait |
| Omán | `oman` | F6.2 | `live` | Mascate |

### Cerrados F6.1 — migración resolver (live @ f6.1)

| País | slug | Wave | status | Nota |
|------|------|------|--------|------|
| Emiratos Árabes Unidos | `united_arab_emirates` | F6.1 | `live` | MED→MENA |
| Catar | `qatar` | F6.1 | `live` | MED→MENA |
| Arabia Saudí | `saudi_arabia` | F6.1 | `live` | MED→MENA |
| Israel | `israel` | F6.1 | `live` | MED→MENA |
| Jordania | `jordan` | F6.1 | `live` | MED→MENA |

### Cerrados F6.0 — arquitectura editorial (no territorial)

| Item | Wave | status |
|------|------|--------|
| Familia **MENA** + 14 packs | F6.0 | `live` |

### Cerrados F5.2 / F5.1

| País | slug | Wave | status |
|------|------|------|--------|
| Mongolia | `mongolia` | F5.2 | `live` |
| Timor-Leste | `timor_leste` | F5.2 | `live` |
| Bahamas | `bahamas` | F5.1 | `live` |
| Belice | `belize` | F5.1 | `live` |
| Guyana | `guyana` | F5.1 | `live` |

### P1 — Reutilizable (post F7.0 audit)

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Corea del Norte | `north_korea` | Asia oriental | EAST_ASIAN | Pyongyang | **F5.4** | P1 | **EDITORIAL-OK** · **F7.0** |

### P2 — Expansión MENA territorial (post F7.0 audit)

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Baréin | `bahrain` | Golfo | **MENA** | Manama | **F6.4** | P2 | **F7.0** |
| Irak | `iraq` | Golfo | **MENA** | Bagdad | **F6.4** | P2 | **F7.0** |
| Yemen | `yemen` | Golfo | **MENA** | Saná | **F6.4** | P2 | **F7.0** |
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

## III. Objetivos numéricos

| Hito | Ciudades | Países | Notas |
|------|----------|--------|-------|
| **Actual (F6.3)** | 106 | 103 | ✅ Baseline prod |
| **F6 MENA expansion II** | ~109 | ~106 | F6.4 BH/IQ/YE (+3) post-F7.0 |
| **F7 CENTRAL_ASIAN** | ~115 | ~112 | +5 tras sprint F7.0 |
| **Target 120** | ~123 | ~120 | requiere CENTRAL_ASIAN |

---

## IV. Reglas de mantenimiento

1. Al cerrar una wave en prod, cambiar `planned` → `live` y anotar wave real.
2. No añadir país sin fila en este backlog.
3. Familias congeladas (WE · LATAM · WA · AC): no wave territorial sin excepción documentada.
4. **ANGLO @ 12:** no expansión sin auditoría F7.0 + excepción documentada.
5. **Gate F7.0:** pausa expansión territorial hasta GLOBAL EDITORIAL AUDIT.

---

*Backlog F6.3 · baseline prod 106/103 @ f6.3 · STOP @ F7.0 GLOBAL EDITORIAL AUDIT READY*
