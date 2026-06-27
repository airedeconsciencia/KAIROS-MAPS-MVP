# KAIROS MAPS — Project Handover

**Fase:** F7.11 · handover pack para nuevo System Architect  
**Fecha:** 26 mayo 2026  
**Repo:** `KAIROS-MAPS-MVP` · rama `main`  
**Checkpoint:** F7.10 cerrado · F8.0 pendiente

> Documento de relevo para un agente MAPS KAIROS System Architect que empieza desde cero.  
> Complementa — no sustituye — `KAIROS_DOC_INDEX.md` (Constitución Viva).

---

## 1. Qué es Kairos Maps

KAIROS Maps es una herramienta de **orientación espacial y humana**: ayuda a explorar cómo distintos lugares del mundo pueden resonar con la vida, los vínculos y las decisiones vitales de una persona.

**URL producción:** https://kairos-maps-mvp.web.app  
**URL staging:** https://kairos-maps-dev.web.app

**No vende astrología técnica.** Vende respuestas humanas sobre lugares y decisiones — con tono contenido, elegante y psicológicamente responsable.

El núcleo estratégico es el **Bridge**: conectar el significado de la carta natal lite con la priorización del mapa astrocartográfico, de forma determinista y curada, antes de capas premium, pareja o IA.

**Baseline territorial (F6.3):** **106 ciudades · 103 países · 12 familias editoriales**.

---

## 2. Filosofía no determinista

KAIROS opera con una tensión deliberada:

| Interno (motor) | Externo (producto) |
|-----------------|-------------------|
| Motores **deterministas** — WASM, scorer, Bridge, compositor | Experiencia **no determinista** en sentido humano |
| Misma entrada → misma salida técnica | No promete destino, predicción ni certeza |
| Fragmentos curados, IDs fijos | El usuario siente espacio para decidir |
| Fail-soft — capas superiores no rompen mapa/carta | Orientación, no oráculo |

**Principio P12 (Constitución):** determinismo antes que IA — la IA futura solo seleccionará fragment IDs curados, no generará copy libre.

**Implicación arquitectónica:** toda capa nueva (narrative, premium, country archetype, city identity) **modula** la lectura; no la reemplaza ni anula el mapa astrocartográfico.

---

## 3. Arquitectura por capas

```
┌─────────────────────────────────────────────────────────┐
│  UI (app.js) — onboarding · mapa · cities · premium β   │
├─────────────────────────────────────────────────────────┤
│  Servicios composición                                  │
│  narrative-intelligence · city-premium-composition      │
│  country-archetype · premium-knowledge                  │
├─────────────────────────────────────────────────────────┤
│  Editorial Family Resolver — 12 familias · 103 países     │
├─────────────────────────────────────────────────────────┤
│  Cities Layer — catálogo · scorer · templates · goals   │
├─────────────────────────────────────────────────────────┤
│  Bridge + GoalSignal — carta → priorización mapa        │
├─────────────────────────────────────────────────────────┤
│  Natal Lite + Compositor — bridgeProfile                │
├─────────────────────────────────────────────────────────┤
│  Motores WASM (kairos-core) + astro.js — mapa 40 líneas │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  City Identity Stack (F7.5–F7.9C) — SHADOW / DEV ONLY   │
│  NO cableado en producto · modulation.enabled = false   │
└─────────────────────────────────────────────────────────┘
```

| Capa | SSOT principal | Estado |
|------|----------------|--------|
| Motores astro | `src/engines/` · golden 75/75 | 🔒 Congelado |
| Bridge | `natal-map-bridge-service.js` | ✅ Prod |
| Cities / catálogo | `cities-catalog.js` · `city-scorer.js` | ✅ Prod @ f6.3 |
| Editorial families | `editorial-family-resolver.js` | ✅ Prod · 12 familias |
| Narrative / Premium / Knowledge | servicios 3.8e–3.8f | ✅ Prod |
| City Identity | `CITY_IDENTITY_ARCHITECTURE.md` | ✅ Shadow-ready · DEV |

---

## 4. Qué se ha construido hasta F7.10

### Wave territorial F4–F6 (producción)

- **F4.0** Global Expansion Framework — SSOT docs (backlog, family policy, wave planner)
- **F4.1–F4.11** — waves de expansión territorial cerradas
- **F5.1** ANGLO Caribbean II · **F5.2** East Asia + SEA Closure
- **F6.0** MENA Architecture Sprint (packs, 0 países)
- **F6.1** MENA Migration (AE/QA/SA/IL/JO)
- **F6.2** MENA Expansion (LB/KW/OM)
- **F6.3** ANGLO Closure — Surinam/Paramaribo → **106/103** live

### Wave Identity F7 (DEV shadow)

- **F7.5A–E** — archetypes, dimensions, profiles, modulation engine, city index (106 mappings)
- **F7.7** — shadow runtime + comparison
- **F7.8** — shadow analytics + JSON export
- **F7.9B** — city signatures (106 firmas algorítmicas)
- **F7.9C** — shadow signature sync (effective profile unificado)
- **F7.10** — `CITY_IDENTITY_ARCHITECTURE.md` SSOT checkpoint

### Producto base (pre-F4, operativo)

- Natal Lite · Bridge · Goals Layer · Cities Layer lite
- Relocation scaffold DEV (sin UI producto)
- Premium beta (`?premium=1`)

---

## 5. Cómo trabajamos con Cursor

### Roles

| Rol | Quién | Hace |
|-----|-------|------|
| **MAPS System Architect** (GPT) | Tú | Fases, scope, ADRs, prompts, checkpoint, STOP gates |
| **Cursor Agent** | IDE | Implementación, smokes, commits bajo instrucción explícita |
| **MAPS Engine / Product GPTs** | Especializados | Motores o copy — no orquestan Cursor |

**Solo el Architect emite prompts de implementación para Cursor.**

### Ritual de fase

1. **Leer** `KAIROS_DOC_INDEX.md` + `KAIROS_CURRENT_CHECKPOINT.md`
2. **Definir** scope acotado (una fase, un deliverable)
3. **Especificar** MODE explícito: `READ ONLY` · `DEV only` · `deploy` · `documentation only`
4. **Cursor implementa** → smokes PASS → commit con mensaje fase (`f7.9c shadow signature sync`)
5. **Checkpoint doc** actualizado → STOP hasta siguiente fase aprobada

### Formato de prompt Architect → Cursor

Ver `KAIROS_NEXT_AGENT_BOOTSTRAP.md` — secciones obligatorias: ANÁLISIS / RIESGOS / VEREDICTO / SIGUIENTE PASO / PROMPT PARA CURSOR.

### Commits y deploy

- Commits atómicos por fase
- `dist/` **nunca** se commitea — rsync pre-deploy
- Deploy prod requiere gate explícito + smokes + aprobación humana

---

## 6. Qué NO tocar

| Artefacto / acción | Motivo |
|--------------------|--------|
| `dist/` | Artefacto deploy; no SSOT |
| `src/engines/kairos-core/*` · `astro.js` | Golden 75/75 · motores congelados |
| `src/content/interpretations.js` | 40 textos mapa congelados |
| Activar City Identity en producto | Sin F8.0 flag + QA editorial |
| Imports identity en narrative/premium/knowledge/`app.js` | Invariante F7.10 |
| Expansión territorial sin F7.0 audit | Gate activo en backlog |
| Familias congeladas (WE · LATAM · WA · AC) | Saturación editorial |
| Crear familia editorial sin packs | ADR permanente |
| Deploy sin ciclo smoke → staging → prod explícito | Gate producción |
| Couple · IA generativa · Alertas · Stripe | Congelado hasta loop individual cerrado |

---

## 7. Qué viene después

| Fase | Objetivo | Gate |
|------|----------|------|
| **F8.0** | Feature flag DEV identity | Default off · solo DEV |
| **F8.1** | Narrative shadow comparison | Sin escritura prod |
| **F8.2** | Premium modulation preview | Sin escritura prod |
| **F8.3** | Controlled activation | review_required=0 · signatures curadas |

**Territorial (pausado):** F7.0 GLOBAL EDITORIAL AUDIT — expansión en hold.

---

## 8. Pack de relevo F7.11

| Documento | Rol |
|-----------|-----|
| `KAIROS_PROJECT_HANDOVER.md` | Este documento — visión general |
| `KAIROS_CURRENT_STATE_F7_10.md` | Snapshot exacto al cierre F7.10 |
| `KAIROS_ARCHITECTURAL_DECISIONS.md` | ADRs permanentes |
| `KAIROS_NEXT_AGENT_BOOTSTRAP.md` | Bootstrap operativo para nuevo GPT |
| `KAIROS_CURRENT_CHECKPOINT.md` | Checkpoint vivo — actualizar cada fase |
| `CITY_IDENTITY_ARCHITECTURE.md` | SSOT Identity F7.5–F7.9C |

**Orden de lectura para nuevo agente:**

1. `KAIROS_NEXT_AGENT_BOOTSTRAP.md`
2. `KAIROS_CURRENT_STATE_F7_10.md`
3. `KAIROS_DOC_INDEX.md`
4. `KAIROS_ARCHITECTURAL_DECISIONS.md`

---

*Handover F7.11 · Prod 106/103 @ f6.3 · Identity shadow-ready @ f7.10 · STOP @ F8.0*
