# KAIROS MAPS — Constitución Viva e Índice Documental Canónico

**Fase 3.6h6** · Puerta de entrada única del proyecto  
**Última revisión:** junio 2026 · post-corpus Master + revisión estratégica 3.6h5  
**Commit referencia producto:** `ac3e454` (3.7a highlight bridge mapa)

> **Este documento es la Constitución Viva de KAIROS.**  
> Funciona como índice documental **y** como marco operativo permanente para decidir fases, prioridades y alcance.  
> **Cursor debe leerlo primero** en toda sesión de trabajo antes de tocar arquitectura, contenido o código.

---

## I. Misión de KAIROS

KAIROS Maps es una herramienta de **orientación espacial y humana**: ayuda a explorar cómo distintos lugares del mundo pueden resonar con la vida, los vínculos y las decisiones vitales de una persona.

**No vende astrología técnica.** Vende **respuestas humanas sobre lugares y decisiones** — con tono contenido, elegante y psicológicamente responsable.

El núcleo estratégico del producto es el **Bridge**: conectar el significado de la carta (natal lite) con la priorización del mapa astrocartográfico, de forma determinista y curada, antes de cualquier capa premium, pareja o IA.

---

## II. Problema humano que resuelve

KAIROS responde preguntas como:

- ¿Dónde me conviene vivir, trabajar o descansar?
- ¿Qué lugares del mapa conectan conmigo **ahora**, según lo que busco?
- ¿Cómo me sentiría en otra ciudad? *(premium — reubicación)*
- ¿Dónde puede florecer mi relación? *(premium — pareja + geo)*
- ¿Qué opción comparo, guardo o exporto?

El usuario **no** debería necesitar saber qué es sinastría, carta compuesta, Davison, astrocartografía ni carta relocalizada. Esos conceptos son **motores internos**; la UI habla de *Yo · Mi relación · Mis lugares · Mis decisiones*.

---

## III. Principios operativos permanentes

Estos principios **no se renegocian** sin ADR explícito registrado en esta constitución.

| # | Principio |
|---|-----------|
| P1 | **Valor percibido > arquitectura nueva** — no abrir fases solo documentales si el usuario no gana claridad |
| P2 | **FREE antes que PREMIUM** — demostrar utilidad estable antes de paywall |
| P3 | **Goals antes que Relocation visible** — `mainGoal` debe gobernar experiencia antes de UI reloc |
| P4 | **Cities antes que Couple** — loop individual completo antes de pareja |
| P5 | **Relocation antes que Couple** — reubicación individual antes de sinastría/geo pareja |
| P6 | **Couple antes que IA** — contenido curado pareja antes de generación |
| P7 | **Voice & Tone manda siempre** — `docs/voice_tone.txt` es gate #1 de todo copy |
| P8 | **`KAIROS_DOC_INDEX.md` es la puerta de entrada única** |
| P9 | **Bridge es núcleo estratégico** — carta → bridgeProfile → Bridge → mapa |
| P10 | **No exponer jerga astrológica** en UI visible |
| P11 | **Experiencia humana > complejidad técnica** |
| P12 | **Determinismo antes que IA** — IA solo selecciona fragment IDs curados (futuro) |
| P13 | **Fail-soft** — mapa y carta nunca se rompen por capas superiores |
| P14 | **Motores congelados** — no recalcular efemérides por tier de producto |

---

## IV. Orden oficial de construcción

Secuencia **obligatoria** para nuevas capacidades de producto (salvo excepción aprobada en § VIII).

```
1. Voz y Tono          → gate editorial
2. Onboarding / Goals  → mainGoal, perfil
3. Natal Lite          → carta + compositor + bridgeProfile
4. Bridge              → scoring → priorityLines
5. Mapa astrocartográfico → 40 líneas + highlight
6. Cities Layer        → preguntas humanas + lugares
7. Relocation          → adapter RELOCATION + reloc-lite (DEV → premium)
8. Couple              → perfiles + relationship content
9. Premium / Negocio   → entitlements, Stripe
10. IA interpretativa  → selección fragmentos
11. Reports / PDF      → export
12. Alertas            → notificaciones
```

**Regla:** no saltar niveles. Ejemplo: no abrir Couple UI antes de Cities lite operativo.

---

## V. Capas congeladas

No modificar sin aprobación explícita + golden gate PASS.

| Capa / artefacto | Motivo |
|------------------|--------|
| `src/engines/kairos-core/*` (motores WASM) | Golden 75/75 |
| `src/engines/astro.js` | Mapa producción; pipeline independiente |
| `src/content/interpretations.js` | 40 textos mapa congelados salvo ampliación curada |
| Golden gate natal | Pre-deploy obligatorio |
| UX móvil ≤768px | Congelada salvo bug crítico |
| `dist/` | Solo sync deliberado pre-deploy; no editar directo |

**No congelado pero estable:** Bridge service, compositor, natal-lite content — cambios quirúrgicos con smoke PASS.

---

## VI. Roadmap ejecutivo (actualizado post-3.6h5)

Sustituye numeración dispersa en `roadmap.txt` para **ejecución activa**. Visión V2/V3 histórica = archivo, no plan operativo.

| Fase | Entrega | Tipo |
|------|---------|------|
| **HECHO** | Natal Lite · Bridge · bridgeProfile · highlight 3.7a · corpus Master · `docs/product/` | ✅ |
| **3.7a+** | Bridge perceptible + copy humano mínimo | Valor usuario |
| **3.7c** | **Goals Layer** — mainGoal → Bridge → UI coherente | Valor usuario |
| **3.8** | **Cities Layer lite** — preguntas + top lugares determinista | Valor usuario |
| **3.7b** | Relocation scaffold DEV (adapter + reloc-lite lab) | Paralelo bajo visibilidad |
| **3.9** | Relocation premium teaser UI | Premium |
| **4.0** | Navegación 4 módulos (EXPERIENCE) | UX |
| **4.x** | Couple Layer | Premium |
| **5.x** | Premium monetization · IA selección · Reports · Alertas | Premium / IA |

**Decisión 3.6h5:** la siguiente prioridad de **producto visible** es **Goals + Cities**, no Relocation UI.

---

## VII. Reglas para decidir futuras fases

Antes de proponer una fase nueva, responder **sí** a todas:

1. ¿Está en el orden de construcción (§ IV)?
2. ¿Aumenta valor percibido FREE o premium justificado?
3. ¿Los documentos gobernantes existen en `docs/product/` o `docs/architecture/`?
4. ¿Pasa gate Voice & Tone?
5. ¿Reutiliza Bridge / bridgeProfile sin reescribir scoring?
6. ¿Tiene smoke o golden definido?
7. ¿No contradice EXPERIENCE (sin jerga, 4 módulos)?
8. ¿No duplica capa existente?

Si falla ≥2 respuestas → **rechazar o reordenar**, no implementar.

---

## VIII. Prioridades actuales (Top 10)

1. **Goals Layer visible** — mainGoal gobierna mapa y copy  
2. **Bridge perceptible** — usuario siente personalización (3.7a+)  
3. **Cities lite determinista** — Manual Maestro → preguntas humanas  
4. **Cerrar loop FREE** — onboarding → mapa → ciudad → lectura coherente  
5. **Sync dist + deploy piloto** — producción = valor real  
6. **Fragmentos curados city-goal** — pocos, buenos, voice_tone  
7. **Relocation scaffold DEV** — adapter sin UI prod (3.7b paralelo)  
8. **Commit corpus 3.6h** — Master + product + constitución  
9. **Congelar scope** Couple / IA / Alertas hasta loop individual cerrado  
10. **Alinear legacy txt** — `visual_identity.txt` / `astro_engine.txt` vs MD v2  

---

## IX. Documentos que gobiernan cada capa

### Constitución y estrategia (repo)

| Capa | Documento(s) que manda(n) |
|------|---------------------------|
| **Constitución** | **Este documento** (`KAIROS_DOC_INDEX.md`) |
| Voz y tono | `docs/voice_tone.txt` · Master Doc 10 |
| Experiencia UX | `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` |
| Multi-perfil | `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` |
| Interpretación natal | `NATAL_INTERPRETATION_ARCHITECTURE.md` |
| Bridge operativo | `NATAL_MAP_BRIDGE_SERVICE.md` · `NATAL_MAP_BRIDGE_ARCHITECTURE.md` |
| Producto FREE/PREMIUM | `KAIROS_PRODUCT_ARCHITECTURE.md` |
| Deploy natal | `NATAL_LITE_STATUS.md` · `FASE_3_1_LAZY_WASM.md` |
| Auditoría corpus | `KAIROS_MASTER_CORPUS_AUDIT.md` · `KAIROS_DOCUMENT_AUDIT.md` |

### Corpus Master → Markdown (`docs/product/`)

| Capa | Markdown canónico | Master origen |
|------|-------------------|---------------|
| Onboarding / Goals | `GOALS_AND_ONBOARDING.md` | Doc 09 v2 |
| Relocation | `RELOCATION_EDITORIAL_BRIEF.md` | Doc 7 |
| Astrocartografía / Cities | `ASTROCARTOGRAPHY_MASTER_BRIEF.md` | Doc 5 |
| Bridge / IA / Scoring | `ADVANCED_INTERPRETATION_ARCHITECTURE.md` | Doc 6 |
| Biblioteca interpretativa | `INTERPRETATION_LIBRARY.md` | Doc 17 |
| Premium / Negocio | `BUSINESS_MODEL.md` | Doc 15 |
| Alertas | `ALERTS_LAYER_BRIEF.md` | Doc 12 |
| Diseño visual | `VISUAL_SYSTEM.md` | Doc 13 v2 |
| Motor spec (futuro) | `ASTRO_ENGINE_SPEC.md` | Doc 16 v2 |

### Runtime (referencia — no editar en fases doc-only)

| Capa | Implementación |
|------|----------------|
| Mapa popup | `src/content/interpretations.js` |
| Natal lite | `src/content/natal-lite.js` |
| Compositor | `src/services/natal-composition-service.js` |
| Bridge | `src/services/natal-map-bridge-service.js` |

---

## X. Criterios para aceptar o rechazar nuevas funcionalidades

### Aceptar si:

- Resuelve pregunta humana de § II en lenguaje EXPERIENCE  
- Encaja en orden § IV y prioridades § VIII  
- Tiene fuente en Master/`docs/product/` o arquitectura 3.x  
- Copy pasa `voice_tone.txt`  
- Bridge-first: usa `bridgeProfile` / `BridgeSignalProfile`  
- Scope acotado: 1 capa, 1 entrega, smokes definidos  
- Fail-soft demostrable  

### Rechazar o posponer si:

- Expone jerga astrológica en UI  
- Requiere IA generativa sin biblioteca curada  
- Duplica sidebar técnico (Carta/Reloc/Pareja/Destino) sin traducción EXPERIENCE  
- Anticipa Couple, Alertas, Wearables, PDF antes de loop FREE  
- Solo añade documentación sin criterio de valor percibido  
- Toca motores congelados (§ V) sin golden  
- Promete “ciudad perfecta” o verdad absoluta (viola voice_tone)  
- Fork del Bridge por tipo de carta  

---

## ESTADO ACTUAL DEL PROYECTO

*Registro para no reabrir decisiones ya tomadas. Actualizar al cerrar cada fase.*

### HECHO

| Área | Estado |
|------|--------|
| Mapa 40 líneas + popup ciudad×objetivo | ✅ Operativo |
| Onboarding 5 pasos + mainGoal + perfil local | ✅ Operativo |
| Motor natal WASM lazy + golden 75/75 | ✅ Operativo |
| Natal Lite + compositor + bridgeProfile | ✅ Operativo |
| Bridge service + smokes 6/6 | ✅ Operativo |
| Highlight mapa sutil 3.7a | ✅ Operativo DEV |
| **3.7c.1 GoalSignal + Bridge goal-aware** | ✅ Commit `a561a1f` |
| **3.7c.2 Goals Layer visible** | ✅ Commit `7aeb27c` — chip, status, ranking popup |
| **3.8b Cities Layer Lite suggestions** | ✅ Commit `d738235` — top 3 sidebar, scorer compartido |
| Arquitectura 3.6 (multi-perfil, experience, bridge) | ✅ Documentada |
| Corpus Master 20 docs en `docs/Master/` | ✅ Importado |
| Conversión 9 docs → `docs/product/` | ✅ 3.6h4 |
| Constitución viva | ✅ 3.6h6 (este doc) |

### EN CURSO

| Área | Notas |
|------|-------|
| **3.7b Relocation scaffold DEV** | Adapter `relocation-profile-service.js` + lab `relocation-preview.html` + smoke — sin UI producto |
| `dist/` vs `src/` | Posible desincronización producción — sync solo con golden gate + aprobación |
| UX móvil ≤768px | Beta; desktop-first |

### PRÓXIMO

1. **Relocation scaffold DEV** — adapter + reloc-lite lab, baja visibilidad, sin motor nuevo

### CONGELADO *(hasta cerrar Relocation DEV)*

| Decisión | Motivo |
|----------|--------|
| Motores kairos-core / astro.js | Golden + producción |
| UX móvil ≤768px | Beta; desktop-first |
| **Couple** UI / sinastría operativa | Después Relocation DEV |
| **IA** generativa conectada | Después Relocation DEV |
| **Reports** | Después Relocation DEV |
| **Alertas** / Wearables / PDF | Después Relocation DEV |
| **Premium visible** (Stripe / paywall / teasers activos) | Después Relocation DEV |
| Sidebar → 4 módulos UI | Fase 4.0; EXPERIENCE ya define |
| OneDrive como fuente | Sustituido por `docs/Master/` interno |

### FUTURO

- Relocation premium UI (3.9)  
- Couple Layer (4.x)  
- Navegación Yo / Mi relación / Mis lugares / Mis decisiones (4.0)  
- IA interpretativa + Reports (5.x)  
- Firebase / entitlements / PDF cloud  
- Convergencia opcional `astro.js` ↔ DOC-16 v2  

---

## ÍNDICE DOCUMENTAL — Orden de consulta Cursor

1. **Este documento** — Constitución Viva  
2. `docs/product/*.md` — Markdown canónico Master  
3. `docs/Master/*.docx` — fuente Word inmutable (v2 manda sobre v1)  
4. `docs/architecture/KAIROS_*` · `NATAL_*` — arquitectura técnica Fase 3.x  
5. `docs/voice_tone.txt` — gate copy  
6. `docs/*.txt` legacy — solo si alineado con `docs/product/`  
7. Git log + `NATAL_LITE_STATUS.md` — estado operativo  

**No usar como fuente activa:** `VERSION.md`, `PROJECT_CONTEXT.md`, `roadmap.txt` (visión histórica), Master v1 (8, 9, 13, 16).

---

## Clasificación corpus Master (20 documentos)

### A) Convertidos — `docs/product/`

| Master | Markdown |
|--------|----------|
| Doc 7 | `RELOCATION_EDITORIAL_BRIEF.md` |
| Doc 5 | `ASTROCARTOGRAPHY_MASTER_BRIEF.md` |
| Doc 6 | `ADVANCED_INTERPRETATION_ARCHITECTURE.md` |
| Doc 17 | `INTERPRETATION_LIBRARY.md` |
| Doc 15 | `BUSINESS_MODEL.md` |
| Doc 12 | `ALERTS_LAYER_BRIEF.md` |
| Doc 09 v2 | `GOALS_AND_ONBOARDING.md` |
| Doc 13 v2 | `VISUAL_SYSTEM.md` |
| Doc 16 v2 | `ASTRO_ENGINE_SPEC.md` |

### B) Convertir más adelante

Doc 10 (txt OK) · Doc 08 v2 (`architecture.txt` OK) · Doc 14 (`roadmap.txt` OK) · Doc 1–4 temáticos

### C) Históricos (Master v1)

Doc 8 · Doc 9 · Doc 13 · Doc 16 — sustituidos por v2 / MD

---

## Tabla gobernanza — implementación vs fase

| Capa | MD / doc | Implementación | Fase |
|------|----------|----------------|------|
| Goals | `GOALS_AND_ONBOARDING.md` | 🟡 parcial | **3.7c** |
| Bridge | `NATAL_MAP_BRIDGE_SERVICE.md` + Doc 6 | ✅ 3.7a | operativo |
| Cities | `ASTROCARTOGRAPHY_MASTER_BRIEF.md` | 🟡 popup | **3.8** |
| Relocation | `RELOCATION_EDITORIAL_BRIEF.md` | ❌ | 3.7b DEV |
| Couple | `KAIROS_MULTI_PROFILE` | ❌ | 4.x |
| IA | Doc 6 + Doc 17 | ❌ | 5.x |
| Premium | `BUSINESS_MODEL.md` | ❌ | 5.x |
| Alertas | `ALERTS_LAYER_BRIEF.md` | ❌ | 5.x+ |

---

## ¿Listo para Relocation scaffold DEV?

**Documental:** SÍ — ver `RELOCATION_EDITORIAL_BRIEF.md` + `KAIROS_MULTI_PROFILE_ARCHITECTURE.md`.

**Producto visible:** SÍ como **próximo hito** — Goals (3.7c) y Cities Lite (3.8b) cerrados (§ ESTADO ACTUAL).

---

## Referencias cruzadas

| Documento | Ruta |
|-----------|------|
| Experiencia producto | `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` |
| Multi-perfil | `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` |
| Auditoría Master | `KAIROS_MASTER_CORPUS_AUDIT.md` |
| Auditoría pre-Master | `KAIROS_DOCUMENT_AUDIT.md` |
| Inventario Master | `KAIROS_MASTER_CORPUS_INDEX.md` |
| Carpeta producto | `docs/product/` |
| Master Word | `docs/Master/` |

---

*Constitución Viva KAIROS · Actualizado post-3.8b · Una puerta · Un orden · Valor percibido primero*
