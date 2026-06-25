# GLOBAL EXPANSION BACKLOG

**Fase:** F4.0 — Global Expansion Framework  
**SSOT expansión territorial** · solo documentación  
**Baseline prod:** `f4.1` · **72 ciudades / 69 países** · **11 familias**  
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

## I. Registro live (67 países — referencia)

Todos con **status: `live`** · wave histórica F2–F3 · catálogo + resolver sincronizados @ `f3.17`.

| Región | Países live (slug) | Familia |
|--------|-------------------|---------|
| Europa occidental/central/nórdica | `spain` `portugal` `france` `united_kingdom` `italy` `germany` `netherlands` `belgium` `switzerland` `austria` `poland` `czech_republic` `denmark` `sweden` `norway` `finland` `greece` | MED / WE / IBERIAN / ANGLO |
| Europa / OM / Levante | `turkey` `morocco` `tunisia` `united_arab_emirates` `qatar` `saudi_arabia` `israel` `jordan` | MEDITERRANEAN |
| América | `united_states` `canada` `mexico` `argentina` `brazil` `peru` `colombia` `chile` `uruguay` `ecuador` `costa_rica` `panama` | LATAM / ANGLO |
| Asia oriental | `japan` `south_korea` `china` `taiwan` | EAST_ASIAN |
| Sudeste asiático | `thailand` `singapore` `vietnam` `malaysia` `indonesia` `philippines` | SOUTHEAST_ASIAN |
| Asia meridional | `india` `pakistan` `bangladesh` `sri_lanka` `nepal` | SOUTH_ASIAN |
| África no-WA | `south_africa` `egypt` `kenya` `ethiopia` `tanzania` | AFRICAN_COASTAL |
| África occidental | `nigeria` `ghana` `senegal` `ivory_coast` `sierra_leone` `liberia` `benin` `togo` `guinea` `gambia` | WEST_AFRICAN |
| Oceanía | `australia` `new_zealand` | ANGLO |

**Densificación live (mismo país, >1 ciudad):** `spain` (Madrid · Barcelona) · `united_states` (NYC · LA) · `india` (Delhi · Mumbai).

---

## II. Backlog territorial — países pendientes

Ordenado por **prioridad global** (ROI × cobertura × riesgo arquitectónico).

### Cerrados F4.1 (live @ f4.1)

| País | slug | Wave | status |
|------|------|------|--------|
| Israel | `israel` | F4.1 | `live` |
| Jordania | `jordan` | F4.1 | `live` |

### P2 — Media prioridad

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Irlanda | `ireland` | Europa occidental | WESTERN_EUROPE | Dublín | **F4.2** | P2 | — |
| Croacia | `croatia` | Europa meridional | MEDITERRANEAN | Zagreb | **F4.2** | P2 | — |
| Hungría | `hungary` | Europa central | WESTERN_EUROPE | Budapest | **F4.2** | P2 | — |
| Uganda | `uganda` | África oriental | AFRICAN_COASTAL | Kampala | **F4.3** | P2 | — |
| Ruanda | `rwanda` | África oriental | AFRICAN_COASTAL | Kigali | **F4.3** | P2 | — |
| Líbano | `lebanon` | Levante | MEDITERRANEAN | Beirut | **F4.4** | P2 | **EDITORIAL-OK** |
| Kuwait | `kuwait` | Golfo | MEDITERRANEAN | Ciudad de Kuwait | **F4.4** | P2 | — |

### P3 — Baja prioridad / riesgo editorial

| País | slug | Región | Familia propuesta | Ciudad ancla | Wave | Prioridad | Dependencias |
|------|------|--------|-------------------|--------------|------|-----------|--------------|
| Paraguay | `paraguay` | América del Sur | LATAM | Asunción | **F4.5** | P3 | — |
| Bolivia | `bolivia` | América del Sur | LATAM | La Paz | **F4.5** | P3 | — |
| Camboya | `cambodia` | Sudeste asiático | SOUTHEAST_ASIAN | Phnom Penh | **F4.6** | P3 | — |
| Laos | `laos` | Sudeste asiático | SOUTHEAST_ASIAN | Vientián | **F4.6** | P3 | — |
| Venezuela | `venezuela` | América del Sur | LATAM | Caracas | **F4.7** | P3 | **EDITORIAL-OK** |
| Myanmar | `myanmar` | Sudeste asiático | SOUTHEAST_ASIAN | Yangón | **F4.7** | P3 | **EDITORIAL-OK** |

### Parked — fuera de expansión territorial F4

| Item | Motivo | status |
|------|--------|--------|
| Maó / Menorca | Ciudades secundarias / lugares personales — no expansión país | `parked` |
| São Paulo | Explícitamente fuera de catálogo SSOT | `parked` |
| Islandia (`iceland`) | Canario GN — no país catálogo | `parked` |

---

## III. Backlog densificación (mismo país, nueva ciudad)

Modo **densificación** — no incrementa países resolver; solo ciudades.

| País live | Ciudad propuesta | Familia | Wave | Prioridad | Dependencias |
|-----------|------------------|---------|------|-----------|--------------|
| `indonesia` | Denpasar (Bali) | SOUTHEAST_ASIAN | F4.D1 | P2 | — |
| `brazil` | São Paulo | LATAM | — | `parked` | decisión producto |
| `mexico` | Guadalajara | LATAM | F4.D2 | P3 | — |
| `australia` | Melbourne | ANGLO | F4.D2 | P3 | — |
| `united_kingdom` | Manchester | ANGLO | F4.D3 | P3 | — |

---

## IV. Objetivos numéricos F4

| Hito | Ciudades | Países | Notas |
|------|----------|--------|-------|
| **Actual (F4.1)** | 72 | 69 | Baseline |
| **F4 Q1 target** | ~78 | ~75 | F4.2 + F4.3 + F4.4 |
| **F4 Q2 target** | ~82 | ~78 | F4.4–F4.6 + densificación selecta |
| **Arquetipo layer (ref.)** | — | 51 | Objetivo diseño original; superado en prod |

---

## V. Reglas de mantenimiento

1. Al cerrar una wave en prod, cambiar `planned` → `live` y anotar wave real.
2. No añadir país sin fila en este backlog (evita drift resolver↔catálogo).
3. Cambios de familia requieren entrada en `EDITORIAL_FAMILY_POLICY.md`.
4. Waves sensibles no arrancan sin gate `EDITORIAL-OK` registrado.

---

*Backlog F4.1 · baseline prod 72/69 @ f4.1*
