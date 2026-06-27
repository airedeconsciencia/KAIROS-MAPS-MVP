# KAIROS MAPS — Agent Document Library

**Documento:** inventario definitivo de lecturas para GPTs MAPS  
**Fecha:** 26 mayo 2026  
**Repo:** `KAIROS-MAPS-MVP`  
**HEAD referencia:** `5df8488` — F7.10 identity checkpoint + handover pack F7.11  

> **Uso:** cada sesión GPT debe cargar primero el **mínimo** de su rol, luego ampliar con **recomendados** según la tarea.  
> **Regla:** si existe Markdown canónico en `docs/product/`, **no cargar** el `.docx` Master paralelo ni el `.txt` legacy duplicado.

---

## Agentes MAPS (roles)

| Agente | Mandato | NO hace |
|--------|---------|---------|
| **MAPS Architect** | Fases, scope, Constitución, handoffs a Cursor, ADRs, checkpoint | Implementar código · copy premium · tocar motores |
| **MAPS Astrocartography Engine** | Motores, Bridge, scorer, catálogos técnicos, golden gate, astro.js/WASM | Copy premium · fases producto · deploy |
| **MAPS Product & Premium Experience** | Voz, lecturas premium, atmosphere, country archetype, UX EXPERIENCE | Modificar motores · WASM · deploy sin aprobación |

**Orquestación:** solo **MAPS Architect** emite prompts de implementación para Cursor.

---

## Tabla completa de documentos

### Leyenda prioridad

| Prioridad | Significado |
|-----------|-------------|
| **Crítica** | Cargar siempre al iniciar sesión del rol |
| **Importante** | Cargar en tareas del dominio; consulta frecuente |
| **Opcional** | Contexto histórico, auditoría, o fase futura |

### Leyenda agentes

| Símbolo | Agente |
|---------|--------|
| **A** | MAPS Architect |
| **E** | MAPS Astrocartography Engine |
| **P** | MAPS Product & Premium Experience |

---

### Constitución, meta-audit y estado operativo

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Constitución Viva | `docs/architecture/KAIROS_DOC_INDEX.md` | Puerta única: misión, principios P1–P14, orden construcción, capas congeladas, roadmap ejecutivo | Crítica | ● | ○ | ● |
| Checkpoint operativo | `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` | Snapshot post-fase: cerrado/pendiente, git posture, staging, qué NO tocar | Crítica | ● | ○ | ● |
| Next Agent Bootstrap | `docs/architecture/KAIROS_NEXT_AGENT_BOOTSTRAP.md` | Onboarding Architect: rol, formato respuesta, F8.0 prompt | Crítica | ● | ○ | ○ |
| Project Handover F7.11 | `docs/architecture/KAIROS_PROJECT_HANDOVER.md` | Qué es KAIROS, capas, ritual Cursor, qué NO tocar | Crítica | ● | ○ | ○ |
| Current State F7.10 | `docs/architecture/KAIROS_CURRENT_STATE_F7_10.md` | Snapshot exacto métricas, F6/F7, smokes, git, riesgos | Crítica | ● | ○ | ○ |
| Architectural Decisions | `docs/architecture/KAIROS_ARCHITECTURAL_DECISIONS.md` | ADRs permanentes — familia, identity, dist, deploy | Crítica | ● | ○ | ○ |
| City Identity SSOT | `docs/architecture/CITY_IDENTITY_ARCHITECTURE.md` | Stack identity F7.5–F7.9C shadow-ready | Importante | ● | ○ | ○ |
| Master Audit | `docs/architecture/KAIROS_MASTER_AUDIT.md` | Auditoría total, smokes, agentes, inventario runtime, riesgos | Crítica | ● | ○ | ○ |
| Agent Library | `docs/architecture/MAPS_AGENT_LIBRARY.md` | Este inventario — qué leer cada GPT | Importante | ● | ○ | ○ |

---

### Arquitectura producto y experiencia

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Arquitectura producto | `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | Capas FREE/PREMIUM, roadmap técnico, qué existe en UI | Importante | ● | ○ | ● |
| Experiencia EXPERIENCE | `docs/architecture/KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` | 4 módulos Yo/Relación/Lugares/Decisiones; sin jerga UI | Importante | ● | ○ | ● |
| Multi-perfil | `docs/architecture/KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | Pareja, perfiles múltiples — Fase 4.x congelada | Opcional | ● | ○ | ○ |
| Document audit (pre-Master) | `docs/architecture/KAIROS_DOCUMENT_AUDIT.md` | Auditoría documental histórica pre-3.6 | Opcional | ● | ○ | ○ |
| Project master audit (legacy) | `docs/project-master-audit.md` | Auditoría proyecto anterior — superseded parcialmente | Opcional | ○ | ○ | ○ |

---

### Bridge, natal lite y motores

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Bridge Service (contrato) | `docs/architecture/NATAL_MAP_BRIDGE_SERVICE.md` | API `KairosNatalMapBridge`, input/output, smoke | Crítica | ○ | ● | ○ |
| Bridge Architecture | `docs/architecture/NATAL_MAP_BRIDGE_ARCHITECTURE.md` | Diseño Bridge, bridgeProfile, scoring conceptual | Importante | ● | ● | ○ |
| Natal Interpretation Architecture | `docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md` | Pipeline interpretación natal lite | Importante | ● | ● | ○ |
| Natal Lite Status | `docs/architecture/NATAL_LITE_STATUS.md` | Estado deploy natal, golden, checklist | Importante | ● | ● | ○ |
| Lazy WASM Fase 3.1 | `docs/architecture/FASE_3_1_LAZY_WASM.md` | Carga WASM, pre-deploy, kairos-core | Crítica | ○ | ● | ○ |
| Astro Engine Spec (Doc 16 v2) | `docs/product/ASTRO_ENGINE_SPEC.md` | Spec motor futuro — referencia, no runtime actual | Importante | ● | ● | ○ |
| Phase 2.1a integration | `docs/phase-2.1a-integration.md` | Integración chart-service histórica | Opcional | ○ | ● | ○ |

---

### Astrocartografía, cities, scorer

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Astrocartography Master Brief (Doc 5) | `docs/product/ASTROCARTOGRAPHY_MASTER_BRIEF.md` | Metodología mapa, líneas, estancia — gobierna Cities Layer | Crítica | ● | ● | ● |
| Advanced Interpretation (Doc 6) | `docs/product/ADVANCED_INTERPRETATION_ARCHITECTURE.md` | Jerarquía influencias, contradicciones, objetivos, síntesis | Crítica | ○ | ● | ● |
| Interpretation Library (Doc 17) | `docs/product/INTERPRETATION_LIBRARY.md` | Templates T1–T4 planeta×ángulo×goal — biblioteca modular | Crítica | ○ | ○ | ● |
| Premium Source Grounding | `docs/architecture/PREMIUM_READING_SOURCE_GROUNDING.md` | De dónde sale profundidad premium; qué docs usar/evitar | Crítica | ● | ○ | ● |
| Country Archetype Layer | `docs/architecture/COUNTRY_ARCHETYPE_LAYER.md` | Diseño capa país 3.8f: reglas, presupuesto, fases, riesgos | Crítica | ● | ○ | ● |
| Goals & Onboarding (Doc 9 v2) | `docs/product/GOALS_AND_ONBOARDING.md` | mainGoal, onboarding, objetivos humanos | Importante | ● | ● | ● |

---

### Relocation DEV

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Relocation Scaffold Architecture | `docs/architecture/RELOCATION_SCAFFOLD_ARCHITECTURE.md` | Contrato reloc DEV, adapter, lab — sin UI producto | Importante | ● | ● | ○ |
| Relocation Editorial Brief (Doc 7) | `docs/product/RELOCATION_EDITORIAL_BRIEF.md` | Copy y metodología relocación — futuro premium | Importante | ● | ○ | ● |
| Relocation Real Data Audit | `docs/architecture/RELOCATION_REAL_DATA_AUDIT.md` | Auditoría datos reales adapter 3.7b.6 | Opcional | ○ | ● | ○ |

---

### Premium, voz y atmósfera (3.8e–3.8f)

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Voice & Tone (gate #1) | `docs/voice_tone.txt` | Frases prohibidas, tono modal, gate copy obligatorio | Crítica | ● | ○ | ● |
| Voice Library V2 | `docs/voice/VOICE_LIBRARY.md` | Aperturas, transiciones, cierres, pads human presence | Crítica | ○ | ○ | ● |
| City Atmosphere Library | `docs/voice/CITY_ATMOSPHERE_LIBRARY.md` | Atmósfera Lisboa/Toronto/Cabo — fuente editorial | Crítica | ○ | ○ | ● |
| Fase 3.8e.9 Design | `docs/voice/FASE_3_8e_9_DESIGN.md` | Integración atmosphere+voice en narrative/composition | Importante | ● | ○ | ● |
| Business Model (Doc 15) | `docs/product/BUSINESS_MODEL.md` | Monetización, packaging — no texto lectura | Opcional | ● | ○ | ○ |
| Alerts Layer Brief (Doc 12) | `docs/product/ALERTS_LAYER_BRIEF.md` | Alertas Fase 5.x+ — congelado | Opcional | ● | ○ | ○ |

---

### Visual, corpus Master y auditorías

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Visual System (Doc 13 v2) | `docs/product/VISUAL_SYSTEM.md` | Identidad visual, UI tokens | Importante | ● | ○ | ● |
| Master Corpus Index | `docs/architecture/KAIROS_MASTER_CORPUS_INDEX.md` | Inventario 20 docs Word | Opcional | ● | ○ | ○ |
| Master Corpus Audit | `docs/architecture/KAIROS_MASTER_CORPUS_AUDIT.md` | Auditoría conversión Master → MD | Opcional | ● | ○ | ○ |

---

### Legacy TXT (`docs/*.txt`)

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| voice_tone.txt | `docs/voice_tone.txt` | **Duplicado canónico** — usar esta ruta (idéntico gate) | Crítica | ● | ○ | ● |
| architecture.txt | `docs/architecture.txt` | Legacy Doc 08 — usar MD arquitectura si existe | Opcional | ○ | ○ | ○ |
| onboarding.txt | `docs/onboarding.txt` | Legacy onboarding — preferir `GOALS_AND_ONBOARDING.md` | Opcional | ○ | ○ | ○ |
| astro_engine.txt | `docs/astro_engine.txt` | Legacy motor — preferir `ASTRO_ENGINE_SPEC.md` | Opcional | ○ | ● | ○ |
| visual_identity.txt | `docs/visual_identity.txt` | Legacy visual — preferir `VISUAL_SYSTEM.md` | Opcional | ○ | ○ | ○ |
| roadmap.txt | `docs/roadmap.txt` | Visión histórica V2/V3 — **no plan operativo** | Opcional | ● | ○ | ○ |
| interpretations.txt | `docs/interpretations.txt` | Legacy interpretaciones — preferir DOC-17 MD | Opcional | ○ | ○ | ○ |

---

### Raíz repo (meta — generalmente NO cargar)

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| VERSION.md | `VERSION.md` | Seguimiento Fase 1.x — **desactualizado** vs 3.8x | Opcional | ○ | ○ | ○ |
| PROJECT_CONTEXT.md | `PROJECT_CONTEXT.md` | Contexto Fase 0 — **superseded** por DOC_INDEX | Opcional | ○ | ○ | ○ |

---

### Corpus Master Word (`docs/Master/*.docx`)

> **Regla:** cargar Word **solo** si no existe MD en `docs/product/` o si se necesita verificar redacción fuente. v2 manda sobre v1.

| Nombre | Ruta | Función | Prioridad | A | E | P |
|--------|------|---------|-----------|---|---|---|
| Doc 5 Astrocartografía | `docs/Master/5 Tutotia Maestro de Astrocartografía Aplicada.docx` | Fuente Word Doc 5 — MD canónico existe | Opcional | ○ | ○ | ○ |
| Doc 6 Interpretación avanzada | `docs/Master/6 Arquitectura Interpretativa Avanzada…docx` | Fuente Word Doc 6 | Opcional | ○ | ○ | ○ |
| Doc 7 Relocación | `docs/Master/7 Relocación Astrológica…docx` | Fuente Word Doc 7 | Opcional | ○ | ○ | ○ |
| Doc 9 v2 Onboarding | `docs/Master/09 REVISADO v2 — Flujo Completo de Onboarding…docx` | Fuente Word Doc 9 v2 | Opcional | ○ | ○ | ○ |
| Doc 10 Voz y Tono | `docs/Master/10 Libro de Voz y Tono…docx` | Fuente Word — `voice_tone.txt` es gate runtime | Opcional | ○ | ○ | ○ |
| Doc 13 v2 Visual | `docs/Master/13 REVISADO v2 — Diseño Visual…docx` | Fuente Word Doc 13 v2 | Opcional | ○ | ○ | ○ |
| Doc 15 Negocio | `docs/Master/15 Modelo de Negocio Detallado…docx` | Fuente Word Doc 15 | Opcional | ● | ○ | ○ |
| Doc 16 v2 Motor | `docs/Master/16 REVISADO v2 — Motor Astrocartográfico…docx` | Fuente Word Doc 16 v2 | Opcional | ○ | ● | ○ |
| Doc 17 Biblioteca | `docs/Master/17 Biblioteca de Interpretaciones Modulares…docx` | Fuente Word Doc 17 | Opcional | ○ | ○ | ○ |
| Doc 12 Alertas | `docs/Master/12 Sistema de Alertas…docx` | Fuente Word Doc 12 | Opcional | ● | ○ | ○ |
| Doc 14 Roadmap | `docs/Master/14 Roadmap de Desarrollo…docx` | Visión histórica | Opcional | ● | ○ | ○ |
| Doc 08 v2 Datos | `docs/Master/08 REVISADO v2 — Arquitectura de Datos…docx` | Datos usuario futuro | Opcional | ● | ○ | ○ |
| Docs 1–4 temáticos | `docs/Master/1…docx` … `4…docx` | Ensayos temáticos astrocartografía | Opcional | ○ | ○ | ○ |
| Master v1 obsoletos | `docs/Master/9…docx`, `13…docx`, `16…docx` (sin REVISADO) | **Sustituidos por v2/MD — NO cargar** | — | — | — | — |

**Leyenda columnas agente:** ● = debe cargar según prioridad · ○ = no requerido por defecto

---

## Documentos mínimos por agente

Cargar **en este orden** al iniciar cualquier sesión.

### MAPS Architect (mínimo — 6 docs)

| # | Documento |
|---|-----------|
| 1 | `docs/architecture/KAIROS_NEXT_AGENT_BOOTSTRAP.md` |
| 2 | `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` |
| 3 | `docs/architecture/KAIROS_PROJECT_HANDOVER.md` |
| 4 | `docs/architecture/KAIROS_ARCHITECTURAL_DECISIONS.md` |
| 5 | `docs/architecture/KAIROS_DOC_INDEX.md` |
| 6 | `docs/voice_tone.txt` |

### MAPS Astrocartography Engine (mínimo — 5 docs)

| # | Documento |
|---|-----------|
| 1 | `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` |
| 2 | `docs/architecture/NATAL_MAP_BRIDGE_SERVICE.md` |
| 3 | `docs/architecture/FASE_3_1_LAZY_WASM.md` |
| 4 | `docs/product/ASTRO_ENGINE_SPEC.md` |
| 5 | `docs/product/ASTROCARTOGRAPHY_MASTER_BRIEF.md` |

### MAPS Product & Premium Experience (mínimo — 6 docs)

| # | Documento |
|---|-----------|
| 1 | `docs/architecture/KAIROS_DOC_INDEX.md` |
| 2 | `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` |
| 3 | `docs/voice_tone.txt` |
| 4 | `docs/architecture/PREMIUM_READING_SOURCE_GROUNDING.md` |
| 5 | `docs/product/INTERPRETATION_LIBRARY.md` |
| 6 | `docs/product/ADVANCED_INTERPRETATION_ARCHITECTURE.md` |

---

## Documentos recomendados por agente

Ampliar según tarea concreta (no cargar todos a la vez).

### MAPS Architect — recomendados

| Tarea | Añadir |
|-------|--------|
| Definir fase premium/country | `COUNTRY_ARCHETYPE_LAYER.md`, `PREMIUM_READING_SOURCE_GROUNDING.md`, `FASE_3_8e_9_DESIGN.md` |
| Decidir scope producto | `KAIROS_PRODUCT_ARCHITECTURE.md`, `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` |
| Handoff Cursor | `KAIROS_NEXT_AGENT_BOOTSTRAP.md`, `KAIROS_PROJECT_HANDOVER.md`, `MAPS_AGENT_LIBRARY.md` |
| Identity F8.x | `CITY_IDENTITY_ARCHITECTURE.md`, `KAIROS_CURRENT_STATE_F7_10.md` |
| Relocation / 3.9 | `RELOCATION_SCAFFOLD_ARCHITECTURE.md`, `RELOCATION_EDITORIAL_BRIEF.md` |
| Corpus / conversión | `KAIROS_MASTER_CORPUS_INDEX.md`, `KAIROS_MASTER_CORPUS_AUDIT.md` |
| Goals / Cities visible | `GOALS_AND_ONBOARDING.md`, `ASTROCARTOGRAPHY_MASTER_BRIEF.md` |

### MAPS Astrocartography Engine — recomendados

| Tarea | Añadir |
|-------|--------|
| Bridge / goal-aware | `NATAL_MAP_BRIDGE_ARCHITECTURE.md`, `GOALS_AND_ONBOARDING.md` |
| Scorer / catálogo | `KAIROS_MASTER_AUDIT.md` Apéndice A–B, git: `cities-catalog.js`, `city-scorer.js` |
| Natal lite | `NATAL_INTERPRETATION_ARCHITECTURE.md`, `NATAL_LITE_STATUS.md` |
| Reloc adapter | `RELOCATION_SCAFFOLD_ARCHITECTURE.md`, `RELOCATION_REAL_DATA_AUDIT.md` |
| Interpretación mapa | `ADVANCED_INTERPRETATION_ARCHITECTURE.md` |
| Pre-deploy | `KAIROS_DOC_INDEX.md` § V capas congeladas, `scripts/golden-gate.sh` |

### MAPS Product & Premium Experience — recomendados

| Tarea | Añadir |
|-------|--------|
| Narrative / atmosphere | `VOICE_LIBRARY.md`, `CITY_ATMOSPHERE_LIBRARY.md`, `FASE_3_8e_9_DESIGN.md` |
| Country archetype | `COUNTRY_ARCHETYPE_LAYER.md` |
| Relocation copy | `RELOCATION_EDITORIAL_BRIEF.md` |
| UX / módulos | `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md`, `VISUAL_SYSTEM.md` |
| Goals en lectura | `GOALS_AND_ONBOARDING.md`, `ASTROCARTOGRAPHY_MASTER_BRIEF.md` |
| Scope fase | `KAIROS_MASTER_AUDIT.md` §4 Pipeline Premium |

---

## Documentos que NO deben cargarse

### Prohibido / inútil para GPTs MAPS

| Categoría | Rutas | Motivo |
|-----------|-------|--------|
| **Artefacto deploy** | `dist/**` | No es SSOT; desincronizado de `src/` |
| **Basura sistema** | `.DS_Store`, `.firebase/**` | Sin valor documental |
| **Código runtime como “doc”** | Sustituir por arquitectura + smokes salvo tarea de implementación Cursor | Evitar alucinar APIs — usar contratos MD |
| **Master v1 obsoletos** | `docs/Master/9 Flujo…docx`, `13 Diseño…docx` (sin REVISADO), `16 Motor…docx` (sin REVISADO) | Sustituidos por v2 / MD |
| **Legacy superseded** | `PROJECT_CONTEXT.md`, `VERSION.md` (como verdad de fase), `roadmap.txt` (como plan activo) | Desactualizados vs 3.8x |
| **Duplicados cuando existe MD** | `interpretations.txt`, `onboarding.txt`, `visual_identity.txt`, `architecture.txt` | Preferir `docs/product/` o `docs/architecture/` |
| **Word si existe MD** | Cualquier `.docx` con par en `docs/product/` | MD es canónico; Word solo verificación puntual |
| **Negocio en copy lectura** | `BUSINESS_MODEL.md` durante redacción premium | No grounding editorial |
| **Alertas / IA futura** | `ALERTS_LAYER_BRIEF.md` en fases 3.8x | Capas congeladas |
| **Deploy scripts como doc** | `firebase.json`, `.firebaserc` | Solo agente deploy humano con aprobación |

### Cargar con precaución (contexto limitado)

| Documento | Precaución |
|-----------|------------|
| `KAIROS_DOC_INDEX.md` § ESTADO ACTUAL | Parcialmente desactualizado vs 3.8e/3.8f — cruzar con `KAIROS_CURRENT_CHECKPOINT.md` |
| `docs/Master/*.docx` | Corpus grande; extraer solo sección necesaria |
| `docs/project-master-audit.md` | Histórico; no contradice checkpoint |

---

## Matriz rápida: fase → documentos críticos

| Fase activa | Architect | Engine | Product |
|-------------|-----------|--------|---------|
| **3.8f.4** (country × composition) | Checkpoint, Country Layer, Master Audit | Checkpoint | Source Grounding, Country Layer, Voice Library, FASE_3_8e_9 |
| **3.8f.x country** | Country Layer, Checkpoint | Checkpoint, Goals MD | Country Layer, Voice tone, Atmosphere |
| **Bridge / scorer** | DOC_INDEX, Bridge arch | Bridge Service, ASTRO brief, Doc 6 | Goals MD |
| **Deploy staging** | Checkpoint § staging, Master Audit §10 | FASE_3_1_LAZY_WASM, NATAL_LITE_STATUS | — |
| **Relocation 3.9 UI** | Reloc Scaffold, Reloc Brief, EXPERIENCE | Reloc Scaffold, Real Data Audit | Reloc Brief, voice_tone |

---

## Runtime complementario (no es documento — referencia Cursor)

Cuando el GPT emite prompt de **implementación**, indicar al agente Cursor que lea headers de:

| Artefacto | Cuándo |
|-----------|--------|
| `src/services/narrative-intelligence-service.js` | Fases 3.8e / 3.8f narrative |
| `src/services/city-premium-composition-service.js` | Fases 3.8e composition / 3.8f.4 |
| `src/services/country-archetype-service.js` | Fases 3.8f country |
| `src/content/cities-catalog.js` | Catálogo ciudades/país |
| `src/content/country-archetypes.js` | Curación país |
| `scripts/dev-*-smoke.sh` | Gate cierre fase |

Estos archivos **no se cargan** en sesiones GPT de arquitectura/producto salvo auditoría explícita.

---

## Actualización de esta biblioteca

| Evento | Acción |
|--------|--------|
| Cierre fase X.Y | Architect propone fila nueva o repriorización |
| Nuevo MD canónico en `docs/product/` | Añadir fila; marcar Word/txt legacy como NO cargar |
| Nuevo agente MAPS | Extender columnas A/E/P o crear rol + mínimo |
| Commit checkpoint | Verificar rutas y HEAD en encabezado |

---

*MAPS Agent Library · Actualizado F7.11 handover pack · 26 mayo 2026*
