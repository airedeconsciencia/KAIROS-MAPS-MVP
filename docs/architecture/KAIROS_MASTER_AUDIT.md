# KAIROS MAPS — Master Audit

**Documento:** auditoría total del proyecto para configuración de GPTs especializados  
**Fecha:** 26 mayo 2026  
**Rama:** `main` @ `8daf99f`  
**Último commit funcional:** `025a620c` — `3.8f3 country archetype narrative integration dev`  
**Checkpoint operativo:** `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` (@ `8daf99f`)

> **Propósito:** onboarding de agentes MAPS, orquestación entre GPTs y Cursor, y toma de decisiones sin reabrir arquitectura cerrada.  
> **No sustituye** la Constitución Viva (`KAIROS_DOC_INDEX.md`); la complementa con estado runtime y mapa de agentes.

---

## 1. Visión del producto

### Qué es KAIROS Maps

KAIROS Maps es una herramienta de **orientación espacial y humana**: ayuda a explorar cómo distintos lugares del mundo pueden resonar con la vida, los vínculos y las decisiones vitales de una persona.

**No vende astrología técnica.** Vende **respuestas humanas sobre lugares y decisiones** — tono contenido, elegante, psicológicamente responsable.

### Problema humano

- ¿Dónde me conviene vivir, trabajar o descansar?
- ¿Qué lugares del mapa conectan conmigo **ahora**, según lo que busco?
- ¿Cómo me sentiría en otra ciudad?
- ¿Qué opción comparo, guardo o exporto?

### Núcleo estratégico: el Bridge

El **Bridge** conecta carta natal lite (`bridgeProfile`) con la priorización del mapa astrocartográfico (40 líneas, scorer, `mainGoal`). Es determinista y curado **antes** de capas premium, pareja o IA.

### Experiencia objetivo (EXPERIENCE)

La UI habla de *Yo · Mi relación · Mis lugares · Mis decisiones* — no de sinastría, Davison, astrocartografía ni carta relocalizada en copy visible.

### Modelo FREE → PREMIUM

| Tier | Hoy |
|------|-----|
| **FREE** | Mapa 40 líneas, popup ciudad×objetivo, onboarding, natal lite, Bridge, Goals chip, Cities suggestions top-3 |
| **PREMIUM (DEV)** | Lecturas integradas por ciudad 500–900 palabras, narrative spine, atmosphere, country matiz — **sin paywall ni UI producto** |
| **PREMIUM (futuro)** | Relocation UI 3.9, Couple 4.x, Stripe/entitlements 5.x |

---

## 2. Arquitectura actual

### 2.1 Capas (de abajo arriba)

```
CAPA 0 — Datos / hosting futuro
  Firebase Hosting (estático) · Firestore/Auth NO activos

CAPA 1 — Motores (congelados)
  kairos-core WASM (natal Swiss Ephemeris) · astro.js (40 líneas mapa)

CAPA 2 — Contenido curado
  interpretations.js · natal-lite.js · goal-signal.js · cities-catalog.js
  country-archetypes.js · premium-blocks.js · reloc-lite.js · city-scorer.js

CAPA 3 — Servicios
  chart-service · natal-composition · natal-map-bridge · goal-signal
  city-scorer (rankInfluences) · narrative-intelligence · country-archetype
  premium-knowledge · city-premium-composition · relocation-* (DEV lab)

CAPA 4 — UI producto
  src/index.html · src/ui/app.js · natal-panel · places (Nominatim)

CAPA 5 — DEV labs
  src/dev/*.html — previews aisladas del producto

CAPA 6 — Deploy artefacto
  dist/ ← copia de src/ para Firebase (NO fuente de verdad activa)
```

### 2.2 Single sources of truth

| Dominio | SSOT |
|---------|------|
| Constitución / fases | `docs/architecture/KAIROS_DOC_INDEX.md` |
| Copy / voz | `docs/voice_tone.txt` + `docs/voice/*` |
| Producto editorial Master | `docs/product/*.md` ← `docs/Master/*.docx` |
| Ciudades oro (27) | `src/content/cities-catalog.js` (+ mirror en `app.js` CITIES) |
| Países piloto arquetipo (10) | `src/content/country-archetypes.js` |
| Popup mapa (40 combos) | `src/content/interpretations.js` |
| Bloques premium DEV | `src/content/premium-blocks.js` |
| Código activo | **`src/`** |

### 2.3 Pipeline lectura premium DEV (orden de ejecución)

```
birthUtc + profile
  → KairosAstro.computeAllLines()
  → KairosGoalSignal.buildContext({ mainGoal })
  → KairosNatalComposition.composeNatalLiteReading() → bridgeProfile
  → KairosNatalMapBridge.buildBridge()
  → KairosCityScorer.rankInfluences(city, input)
  → KairosNarrativeIntelligence.deriveNarrativeContext()
       ├─ cityAtmosphere (3 ciudades lab)
       └─ countryContext (10 países piloto) ← 3.8f.3
  → KairosPremiumKnowledge.getBlocksForContext()
  → KairosCityPremiumComposition.composeCityReading()
```

**Peso editorial recomendado (3.8f):** carta + línea + goal **60%** · ciudad **25%** · país **15%**.

### 2.4 Previews DEV

| Preview | Propósito |
|---------|-----------|
| `narrative-intelligence-preview.html` | Spine + countryContext + lectura compuesta |
| `city-premium-preview.html` | Lectura premium completa |
| `country-archetype-preview.html` | Piloto arquetipo país |
| `bridge-preview.html` | Bridge + goal signal |
| `relocation-preview.html` | Reloc E2E lab |
| `premium-knowledge-preview.html` | Selección bloques DOC-17 |

---

## 3. Motores astrológicos

### 3.1 Mapa astrocartográfico — `src/engines/astro.js`

| Atributo | Valor |
|----------|-------|
| Dependencia | `astronomy-engine@2.1.19` (CDN browser) |
| Salida | 40 líneas (10 planetas × 4 ángulos AC/DC/MC/IC) |
| Uso | Mapa Leaflet, scorer proximidad, popups |
| Estado | **Congelado** — no modificar en fases editoriales |

### 3.2 Motor natal — `src/engines/kairos-core/`

| Atributo | Valor |
|----------|-------|
| Backend | Swiss Ephemeris WASM (`swisseph.wasm`, `swisseph.data`) |
| Loader | `src/services/natal-engine-loader.js` |
| API | `src/services/chart-service.js` → `generateNatalChart()` |
| Golden | `scripts/golden-gate.sh` — **75/75 PASS** obligatorio pre-deploy |
| Estado | **Congelado** |

### 3.3 Motores paralelos (no convergidos)

- `astro.js` = astrocartografía cliente (producción mapa)
- `kairos-core` = carta natal completa (lazy WASM)
- `ASTRO_ENGINE_SPEC.md` (Doc 16 v2) = spec futura — **no pipeline automático hoy**

### 3.4 Regla P14 (Constitución)

**Determinismo antes que IA.** No recalcular efemérides por tier de producto. IA futura = selección de fragment IDs curados, no generación libre.

---

## 4. Pipeline Premium

### 4.1 Fases cerradas (3.8d → 3.8f.3)

| Fase | Entrega | Schema / artefacto |
|------|---------|-------------------|
| 3.8d | Expansión lecturas humanas popup | `interpretations.js` |
| 3.8e.2 | Source grounding doc | `PREMIUM_READING_SOURCE_GROUNDING.md` |
| 3.8e.3 | Premium knowledge selection | `premium-knowledge-service.js` `3.8e.5-0.1` |
| 3.8e.6a | Humanization narrative | `narrative-intelligence-service.js` |
| 3.8e.8 | Voice + City Atmosphere libraries | `docs/voice/*` |
| 3.8e.9a | City atmosphere en narrative | 3 ciudades: Lisboa, Toronto, Ciudad del Cabo |
| 3.8e.9b | Transition cleanup compositor | `city-premium-composition-service.js` |
| 3.8e.9d | Human presence spine | voz experiencial (quizá, puede que) |
| 3.8f.0 | Cities catalog extract | `cities-catalog.js` |
| 3.8f.1 | Country archetype design | `COUNTRY_ARCHETYPE_LAYER.md` |
| 3.8f.2 | Country pilot 10 países | `country-archetypes.js`, `country-archetype-service.js` |
| 3.8f.3 | Country × Narrative Intelligence | `countryContext` en spine DEV |

### 4.2 Servicios premium (runtime)

| Servicio | Rol | Integrado producto |
|----------|-----|-------------------|
| `narrative-intelligence-service.js` | Hilo narrativo determinista, atmosphere, country | ❌ DEV |
| `premium-knowledge-service.js` | Selección bloques DOC-17 / síntesis | ❌ DEV |
| `city-premium-composition-service.js` | Lectura 500–900 palabras, 6 secciones | ❌ DEV |
| `country-archetype-service.js` | Resolve arquetipo país fail-soft | ❌ DEV (vía narrative) |

### 4.3 Secciones lectura premium

`sintesis` · `favorece` · `desafia` · `aprovecha` · `observar` · `integracion`

**Country lines (3.8f.3):** máx. 2 por lectura, máx. 1 por sección, solo `sintesis` / `observar` / `integracion` — tejidas en spine, **aún no** en compositor completo (→ 3.8f.4).

### 4.4 Fuentes editoriales (grounding)

Ver `PREMIUM_READING_SOURCE_GROUNDING.md`:

| Prioridad | Documento | Uso |
|-----------|-----------|-----|
| 1 | DOC-17 `INTERPRETATION_LIBRARY.md` | Micro-copy por línea T1–T4 |
| 2 | DOC-6 `ADVANCED_INTERPRETATION_ARCHITECTURE.md` | Jerarquía, contradicciones, objetivos |
| 3 | DOC-5 `ASTROCARTOGRAPHY_MASTER_BRIEF.md` | Metodología mapa / estancia |
| 4 | DOC-7 `RELOCATION_EDITORIAL_BRIEF.md` | Reloc (reservado compositor premium) |
| Gate | `docs/voice_tone.txt` | Filtro obligatorio copy |

---

## 5. Sistema documental

### 5.1 Jerarquía de lectura

1. **`KAIROS_DOC_INDEX.md`** — Constitución Viva (puerta única)
2. **`KAIROS_CURRENT_CHECKPOINT.md`** — snapshot operativo post-fase
3. **`KAIROS_MASTER_AUDIT.md`** — este documento (meta-audit agentes)
4. **`docs/product/*.md`** — Markdown canónico Master (9 docs)
5. **`docs/architecture/KAIROS_*` · `NATAL_*`** — arquitectura técnica 3.x
6. **`docs/voice_tone.txt`** + **`docs/voice/*.md`** — voz y atmósfera
7. **`docs/Master/*.docx`** — fuente Word inmutable (v2 > v1)
8. Git log + smokes — verdad operativa runtime

### 5.2 Documentos obsoletos / no usar como fuente activa

- `VERSION.md` (Fase 1.x, desactualizado)
- `PROJECT_CONTEXT.md`, `roadmap.txt` (visión histórica)
- Master v1 (Docs 8, 9, 13, 16) — sustituidos por v2 / MD

### 5.3 Corpus Master (20 docs Word)

Importado en `docs/Master/`. **9 convertidos** a `docs/product/`. Resto: convertir bajo demanda o consultar Word.

### 5.4 Principios documentales permanentes (extracto Constitución)

| # | Principio |
|---|-----------|
| P7 | Voice & Tone manda siempre |
| P12 | Determinismo antes que IA |
| P13 | Fail-soft — mapa y carta nunca se rompen |
| P14 | Motores congelados |
| P8 | `KAIROS_DOC_INDEX.md` es puerta de entrada |

---

## 6. Roadmap histórico

### 6.1 Línea temporal ejecutiva

```
Fase 1.x   Mapa + onboarding + perfil + Firebase prod inicial
Fase 2.x   Motor natal WASM + golden 75/75 + natal lite UI
Fase 3.6   Corpus Master + docs/product + Constitución Viva
Fase 3.7a  Bridge highlight mapa
Fase 3.7c  Goals Layer visible (GoalSignal + UI chip)
Fase 3.8b  Cities Layer Lite (top-3 sidebar)
Fase 3.7b  Relocation scaffold DEV (3.7b → 3.7b.8 E2E cerrado)
Fase 3.8d  Expansión editorial popup
Fase 3.8e  Premium pipeline DEV (knowledge → narrative → composition → voice)
Fase 3.8f  Country archetype (design → pilot → narrative → composition pendiente)
888bb80    Firebase staging + deploy scripts seguros
```

### 6.2 Orden oficial de construcción (Constitución § IV)

```
Voz → Onboarding/Goals → Natal Lite → Bridge → Mapa → Cities → Relocation → Couple → Premium/Negocio → IA → Reports → Alertas
```

**Regla:** no saltar niveles. Ejemplo: Couple UI congelado hasta loop individual cerrado.

### 6.3 Desalineación doc vs código

`KAIROS_DOC_INDEX.md` § ESTADO ACTUAL lista 3.8b como próximo Cities — **superado** por 3.8e/3.8f DEV. Usar **`KAIROS_CURRENT_CHECKPOINT.md`** + git log para estado runtime; actualizar Constitución en próxima revisión documental.

---

## 7. Estado actual

### 7.1 HEAD

| Campo | Valor |
|-------|--------|
| Rama | `main` |
| HEAD | `8daf99f` — `kairos current checkpoint after 3.8f3` |
| Último código | `025a620` — `3.8f3 country archetype narrative integration dev` |

### 7.2 Cerrado y operativo (producto visible)

- Mapa 40 líneas + popup
- Onboarding 5 pasos + `mainGoal`
- Natal lite + compositor + bridgeProfile
- Bridge service + highlight 3.7a
- Goals Layer 3.7c (chip, ranking popup)
- Cities suggestions 3.8b (top-3 scorer)
- Relocation DEV lab completo (sin UI producto)

### 7.3 Cerrado DEV (no en producto)

- Premium pipeline completo hasta narrative + country spine
- 3 ciudades atmosphere + 10 países arquetipo
- 8 previews DEV + 16 smokes

### 7.4 Pendiente inmediato

**FASE 3.8f.4** — Country Archetype × `city-premium-composition-service.js`

### 7.5 Working tree (26 mayo 2026)

```
 M .DS_Store
 M dist/* (varios)
?? dist/* (servicios premium untracked)
```

**`src/` limpio** respecto a commits 3.8f.3 + checkpoint. **`dist/` desincronizado** — no es desarrollo activo.

---

## 8. Commits importantes

| Hash | Mensaje | Significado |
|------|---------|-------------|
| `8daf99f` | kairos current checkpoint after 3.8f3 | Doc checkpoint operativo |
| `025a620` | 3.8f3 country archetype narrative integration dev | Country en narrative spine |
| `aab946d` | 3.8f2 country archetype pilot dev | 10 países + service |
| `9c0f3fb` | 3.8f0 cities catalog extract dev | SSOT ciudades |
| `e84dd55` | 3.8f1 country archetype layer design | Diseño arquetipo |
| `888bb80` | firebase staging setup and safe deploy scripts | Staging/prod targets |
| `2652b64` | 3.8e9d human presence premium voice dev | Voz experiencial spine |
| `e48a512` | 3.8e9a city atmosphere integration dev | Atmosphere 3 ciudades |
| `37993c6` | 3.8e3 premium knowledge driven composition | Knowledge layer |
| `ba126dc` | 3.8e2 premium reading source grounding | Grounding doc |
| `d738235` | 3.8b cities layer lite | Top-3 sidebar (buscar en log) |
| `7aeb27c` | 3.7c.2 goals layer visible | Goals UI |
| `2ae8771` | 3.7b8 relocation e2e dev validation | Reloc lab cerrado |

---

## 9. Smokes

### 9.1 Inventario (`scripts/`)

| Script | Capa |
|--------|------|
| `golden-gate.sh` | Motor natal WASM **75/75** — pre-deploy obligatorio |
| `dev-bridge-smoke.sh` | Bridge + goal-aware |
| `dev-goal-signal-smoke.sh` | GoalSignal |
| `dev-natal-composition-smoke.sh` | Compositor natal lite |
| `dev-city-scorer-smoke.sh` | Scorer 27 ciudades |
| `dev-cities-catalog-smoke.sh` | Catálogo SSOT |
| `dev-narrative-intelligence-smoke.sh` | Narrative + country 3.8f.3 |
| `dev-country-archetype-smoke.sh` | Piloto 10 países |
| `dev-country-archetype-integration-smoke.sh` | Country × narrative |
| `dev-premium-knowledge-smoke.sh` | Knowledge selection |
| `dev-city-premium-composition-smoke.sh` | Lectura premium 500–900 pal |
| `dev-city-reading-editorial-smoke.sh` | Editorial popup |
| `dev-reloc-*-smoke.sh` (4) | Relocation DEV stack |
| `dev-natal-lite-debug-smoke.sh` | Natal lite debug |

### 9.2 Gate mínimo fase 3.8f (post-3.8f.3)

```bash
./scripts/dev-country-archetype-smoke.sh
./scripts/dev-country-archetype-integration-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
```

### 9.3 Gate pre-deploy producción

```bash
./scripts/golden-gate.sh
# + sync src/ → dist/ consciente
# + aprobación explícita usuario
./scripts/deploy-staging.sh   # staging primero
./scripts/deploy-prod.sh      # prod solo con aprobación
```

---

## 10. Staging y producción

| Entorno | Firebase target | URL | Estado vs `src/` |
|---------|-----------------|-----|------------------|
| **Producción** | `hosting:prod` → `kairos-maps-mvp` | https://kairos-maps-mvp.web.app | **Desfasada** — Fase 1.x visible |
| **Staging** | `hosting:staging` → `kairos-maps-dev` | https://kairos-maps-dev.web.app | **Desfasada** — `dist/` local sucio |

**Flujo deploy:** `src/` → copia/rsync → `dist/` → `firebase deploy`

**Firebase:** solo Hosting estático. Sin Auth, Firestore, Stripe activos.

**Política agentes:** **nunca** deploy, push ni sync `dist/` sin aprobación explícita del usuario.

---

## 11. Country Archetype

### 11.1 Diseño (`COUNTRY_ARCHETYPE_LAYER.md`)

Capa editorial que **matiza** cómo se vive una línea/goal en un territorio nacional — sin estereotipo, sin determinismo zodiacal («Portugal es Piscis»), sin clichés turísticos.

### 11.2 Implementación actual

| Artefacto | Estado |
|-----------|--------|
| `country-archetypes.js` | 10 países `curated: true` |
| `country-archetype-service.js` | `resolveCountryArchetype()` fail-soft |
| Narrative Intelligence | ✅ `countryContext` + tejido spine (3.8f.3) |
| City Premium Composition | ❌ Pendiente 3.8f.4 |
| `app.js` / producto | ❌ No cableado |

**Países piloto:** Portugal, España, Francia, Reino Unido, Italia, Japón, Brasil, Argentina, Sudáfrica, Canadá.

### 11.3 API resumen

```javascript
KairosCountryArchetype.resolveCountryArchetype({
  countryId,   // o vía city.country / KairosCitiesCatalog
  city,
  goal,        // amor | trabajo | descanso
  linePlanet   // moon | venus | saturn (desde influencia primaria)
})
// → { ok, countryId, archetype, selectedModifiers, warnings, meta }
```

### 11.4 Presupuesto editorial país

- Máx. **2 líneas** por lectura
- Máx. **1 línea** por sección
- Nunca en **todas** las secciones
- Secciones: `sintesis`, `observar`, `integracion`
- Modales naturales: «En Portugal, quizá notes…», «En Canadá, puede que tu trabajo avance…»

### 11.5 Relación con City Atmosphere

| Capa | Granularidad | Ciudades/países |
|------|--------------|-----------------|
| **City Atmosphere** | Ciudad (micro) | 3 lab |
| **Country Archetype** | País (macro matiz) | 10 piloto |

Coexisten; no se sustituyen. Prioridad: carta/goal > **ciudad** > **país**.

---

## 12. Principios que no deben romperse

### 12.1 Técnicos

1. **Fail-soft** — capa superior ausente o rota → lectura/mapa siguen funcionando
2. **Motores congelados** — `astro.js`, `kairos-core/*`, golden 75/75 antes de tocar WASM
3. **`src/` es SSOT** — no editar `dist/` como desarrollo
4. **Determinismo** — mismo input → mismo output (smokes verifican)
5. **Sin IA generativa libre** en pipeline premium DEV

### 12.2 Editoriales

1. **`voice_tone.txt` gate #1** — probabilidad, no fatalismo, no jerga en UI
2. **No estereotipo nacional** — smoke prohibiciones + `avoidCliches`
3. **No determinismo zodiacal país** — nunca «X es Signo»
4. **Human presence** — voz experiencial (tú, quizá, puede que), no informe clínico
5. **No prometer ciudad perfecta** — orientación, no verdad absoluta

### 12.3 Operativos (agentes)

1. **No commit** salvo instrucción explícita
2. **No push / deploy** salvo instrucción explícita
3. **No tocar `app.js`** en fases DEV premium/country sin aprobación
4. **Scope mínimo** — una capa, una fase, smokes definidos
5. **Excluir `dist/`, `.DS_Store`** de commits de feature DEV

### 12.4 Orden producto (Constitución)

FREE antes que PREMIUM · Goals antes que Relocation UI · Cities antes que Couple · Couple antes que IA

---

## 13. Próximas fases

| Fase | Entrega | Toca |
|------|---------|------|
| **3.8f.4** ⭐ | Country × City Premium Composition | `city-premium-composition-service.js`, preview, smoke |
| 3.8f.5+ | Cableado producto / scorer modifier / ampliación países | `app.js` con aprobación |
| **3.9** | Relocation premium teaser UI | UI producto — congelado hasta aprobación |
| **4.0** | Navegación 4 módulos EXPERIENCE | UX |
| **4.x** | Couple Layer | Premium |
| **5.x** | Monetización · IA selección · Reports · Alertas | Premium |

**Después 3.8f.4:** sync `dist/` + deploy staging **opcional** con aprobación explícita.

---

## 14. Resumen ejecutivo para nuevo GPT

> **KAIROS Maps** = mapa astrocartográfico humano + Bridge natal + lecturas premium DEV en construcción.  
> **Trabajo activo:** `src/` servicios narrative/composition/country — **no** producto visible.  
> **Última entrega código:** 3.8f.3 — país matiza narrative spine (10 países, fail-soft).  
> **Siguiente:** 3.8f.4 — mismo matiz en lectura compuesta 500–900 palabras.  
> **Congelado:** motores, `app.js`, deploy, 51 países, IA, Couple.  
> **Siempre leer primero:** `KAIROS_DOC_INDEX.md` → `KAIROS_CURRENT_CHECKPOINT.md` → este audit.  
> **Siempre validar:** smokes de la fase antes de declarar cerrado.  
> **Nunca:** push, deploy, commit, ni tocar `dist/` sin orden explícita.

---

## 15. Cómo deben trabajar los futuros agentes MAPS entre sí

### 15.1 Roles recomendados

| Agente GPT | Rol | Output principal |
|------------|-----|------------------|
| **MAPS Architect** | Constitución, fases, scope, ADRs | Decisiones + prompts para Cursor |
| **MAPS Cursor Dev** | Implementación en repo (Cursor) | Código + smokes PASS |
| **MAPS Voice** | Copy, voice_tone, libraries | Texto curado + reglas smoke editorial |
| **MAPS Content** | Country/City archetypes, premium blocks | `src/content/*` curado |
| **MAPS QA** | Smokes, golden, regresión | Reporte PASS/FAIL |
| **MAPS Deploy** | dist sync, Firebase | Solo tras aprobación usuario |

### 15.2 Flujo de trabajo estándar

```
1. Usuario define fase (ej. 3.8f.4)
2. MAPS Architect valida contra Constitución + Checkpoint
3. Architect genera prompt Cursor acotado (archivos, NO tocar, smokes, entregables)
4. MAPS Cursor Dev implementa en Cursor + ejecuta smokes
5. MAPS Voice revisa copy si hay texto nuevo (opcional paralelo)
6. MAPS QA confirma smokes + git status limpio en src/
7. Usuario aprueba commit (Cursor Dev o usuario)
8. Architect actualiza Checkpoint (doc-only commit separado)
```

### 15.3 Handoffs obligatorios

| De | A | Qué pasar |
|----|---|-----------|
| Architect | Cursor Dev | Prompt con scope, exclusiones, smokes, ejemplos antes/después |
| Cursor Dev | QA | Lista archivos tocados + comandos smoke |
| Voice | Cursor Dev | Frases aprobadas + tokens prohibidos |
| Content | Cursor Dev | JSON/JS curado + país id canónico |
| QA | Architect | PASS/FAIL + riesgos |
| Deploy | Usuario | Confirmación explícita escrita |

### 15.4 Conflictos entre agentes

- **Architect manda** en scope y fase
- **Voice manda** en copy visible y premium
- **QA manda** en declarar fase cerrada (smokes PASS)
- **Ningún agente** override motores congelados sin golden PASS + ADR

---

## 16. Qué agente debe generar prompts para Cursor

### Agente responsable: **MAPS Architect** (Orquestador)

Es el **único** que debe emitir prompts de implementación para Cursor, porque:

1. Conoce Constitución § IV orden de construcción
2. Cruza Checkpoint + Master Audit + fase solicitada
3. Define exclusiones (`app.js`, motores, dist, Firebase)
4. Especifica smokes gate y entregables
5. Evita scope creep entre fases

### Plantilla mínima prompt Cursor

```markdown
FASE X.Y — [nombre]
Contexto: [1 párrafo + commit base]
Objetivo: [mensurable]
Modificar: [lista explícita]
Usar: [APIs/servicios existentes]
NO tocar: [lista explícita]
Tareas: [numeradas]
Smokes: [comandos]
Entregable: [archivos + ejemplos + git status]
Sin commit automático / Sin push / Sin deploy
```

**MAPS Cursor Dev** (en Cursor) ejecuta — no reescribe la fase sin escalar a Architect.

---

## 17. Qué documentos debe leer cada agente

### 17.1 Todos los agentes (mínimo)

| Orden | Documento |
|-------|-----------|
| 1 | `docs/architecture/KAIROS_DOC_INDEX.md` |
| 2 | `docs/architecture/KAIROS_CURRENT_CHECKPOINT.md` |
| 3 | `docs/voice_tone.txt` |

### 17.2 MAPS Architect

| Documento | Por qué |
|-----------|-----------|
| Este audit (`KAIROS_MASTER_AUDIT.md`) | Mapa total + agentes |
| `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` | EXPERIENCE 4 módulos |
| `KAIROS_PRODUCT_ARCHITECTURE.md` | Capas FREE/PREMIUM |
| `COUNTRY_ARCHETYPE_LAYER.md` | Fases 3.8f |
| `PREMIUM_READING_SOURCE_GROUNDING.md` | Fuentes premium |
| `docs/product/*.md` | Master canónico |
| Git log últimos 20 commits | Verdad operativa |

### 17.3 MAPS Cursor Dev

| Documento | Por qué |
|-----------|-----------|
| Prompt de Architect (mandatorio) | Scope acotado |
| `KAIROS_CURRENT_CHECKPOINT.md` | Qué NO tocar |
| Headers + `_dev` exports de servicios tocados | APIs runtime |
| `FASE_3_8e_9_DESIGN.md` | Si narrative/composition |
| Smokes de la fase | Criterios PASS |

### 17.4 MAPS Voice

| Documento | Por qué |
|-----------|-----------|
| `docs/voice_tone.txt` | Gate legal/editorial |
| `docs/voice/VOICE_LIBRARY.md` | Pools voz V2 |
| `docs/voice/CITY_ATMOSPHERE_LIBRARY.md` | Atmosphere 3 ciudades |
| `docs/product/INTERPRETATION_LIBRARY.md` | DOC-17 tono |
| Smokes editorial (`GLOBAL_TOURISM_TOKENS`, etc.) | Prohibiciones runtime |

### 17.5 MAPS Content (Country / City)

| Documento | Por qué |
|-----------|-----------|
| `COUNTRY_ARCHETYPE_LAYER.md` | Reglas R1–R7, presupuesto líneas |
| `country-archetypes.js` | Formato piloto |
| `cities-catalog.js` | IDs país/ciudad |
| `CITY_ATMOSPHERE_LIBRARY.md` | Hermana ciudad (no duplicar) |
| `dev-country-archetype-smoke.sh` | Criterios curación |

### 17.6 MAPS QA

| Documento | Por qué |
|-----------|-----------|
| `KAIROS_CURRENT_CHECKPOINT.md` | Smokes gate por fase |
| `scripts/golden-gate.sh` | Pre-deploy |
| Salida smokes de la fase | PASS/FAIL |
| `.gitignore` / política dist | Verificar commits limpios |

### 17.7 MAPS Deploy

| Documento | Por qué |
|-----------|-----------|
| `KAIROS_CURRENT_CHECKPOINT.md` § staging |
| `scripts/deploy-staging.sh` · `deploy-prod.sh` |
| `firebase.json` · `.firebaserc` |
| `FASE_3_1_LAZY_WASM.md` | Pre-deploy WASM |
| **`VERSION.md`** — solo referencia URLs, no versiones DEV |

---

## Apéndice A — Inventario `src/content/`

| Archivo | Rol |
|---------|-----|
| `interpretations.js` | 40 textos popup mapa (congelado salvo curación) |
| `natal-lite.js` | Composición carta lite + bridgeProfile tags |
| `goal-signal.js` | Contexto mainGoal amor/trabajo/descanso |
| `cities-catalog.js` | 27 ciudades, 26 países, `resolveCountryId` |
| `city-scorer.js` | rankInfluences, proxKm, composite |
| `country-archetypes.js` | 10 países piloto curados |
| `premium-blocks.js` | Catálogo bloques DOC-17/síntesis (~74 blocks) |
| `reloc-lite.js` | Fragmentos reloc DEV 16×elemento |
| `city-summary-templates.js` | Templates resumen ciudad |

## Apéndice B — Inventario `src/services/`

| Archivo | Rol |
|---------|-----|
| `chart-service.js` | API carta natal WASM |
| `natal-engine-loader.js` | Lazy load WASM |
| `natal-composition-service.js` | Natal lite reading + bridgeProfile |
| `natal-map-bridge-service.js` | Bridge scoring → priorityLines |
| `narrative-intelligence-service.js` | Spine + atmosphere + countryContext |
| `country-archetype-service.js` | Resolve arquetipo país |
| `premium-knowledge-service.js` | Selección bloques premium |
| `city-premium-composition-service.js` | Lectura integrada ciudad |
| `relocation-profile-service.js` | Perfil reloc DEV |
| `reloc-chart-adapter.js` | Adapter carta reloc real |
| `reloc-composition-service.js` | Compositor reloc DEV |

## Apéndice C — Riesgos detectados (meta-audit)

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| **`dist/` desincronizado** vs `src/` | Alta operativa | No usar dist como referencia; sync consciente pre-deploy |
| **Constitución § ESTADO desactualizado** vs 3.8e/3.8f | Media | Priorizar Checkpoint + git log; revisar DOC_INDEX |
| **`VERSION.md` obsoleto** | Media | No usar para fases DEV; actualizar en release |
| **Duplicación CITIES** app.js vs catalog | Media | 3.8f.0 extrajo catalog; app.js aún mirror |
| **Premium DEV no en producto** | Media | Usuarios prod no ven valor 3.8e/3.8f hasta cableado |
| **Country solo en narrative** | Baja (conocida) | 3.8f.4 pendiente |
| **Estereotipo nacional** | Alta editorial | Smokes + avoidCliches + revisión Voice |
| **`.DS_Store` en working tree** | Baja | Excluir commits; verificar gitignore |
| **Agentes sin scope** tocan app.js/motores | Alta | Architect emite exclusiones; QA verifica diff |

---

*Meta-audit KAIROS MAPS · Generado 26 mayo 2026 · Sin commit · Sin push · Sin deploy*
