# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Último commit cerrado:** `0673f46` — `3.8f4 country archetype premium composition dev`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP es una app de cartografía astrológica (Leaflet + motor `astro.js`) con **lecturas premium DEV completas** bajo `src/`. El **Country Archetype** (piloto 10 países) está integrado en **Narrative Intelligence** y **City Premium Composition** — solo en laboratorio DEV.

El **producto visible** (`src/ui/app.js`, `src/index.html`) **no usa** esta lectura premium. Sigue en Fase 1.x estable (mapa, popup, goals, suggestions). **`app.js` sin cableado premium.**

El trabajo activo vive en **`src/`**. **`dist/`** es artefacto de deploy y **no refleja** el estado DEV actual. **Staging desfasado** respecto a `src/`. **Producción intacta** (sin capas 3.8e/3.8f).

---

## II. Último commit cerrado

| Campo | Valor |
|-------|--------|
| **Hash** | `0673f460861a6d6c68730b35078613ebc2040f58` |
| **Mensaje** | `3.8f4 country archetype premium composition dev` |
| **Alcance** | Country Archetype × City Premium Composition (solo DEV) |

**Archivos incluidos en 3.8f.4:**

- `src/services/city-premium-composition-service.js` — schema `3.8f.4-dev-0.1`, consume `countryContext.lines`, meta `countryLinesUsed` / `countrySectionsUsed`
- `src/dev/city-premium-preview.html` — panel country + 5 ciudades piloto
- `scripts/dev-country-composition-smoke.sh` — smoke regresión composición × país
- `scripts/dev-city-premium-composition-smoke.sh` — carga country layer, schema 3.8f.4

**Comportamiento clave:** el compositor teje líneas país desde `narrativeContext.countryContext.lines` (generadas por Narrative Intelligence). Máx. 2 líneas, máx. 1 por sección, solo `sintesis` / `observar` / `integracion`. Dedup contra spine. Atmosphere + human presence + goal blocks preservados.

**Cadena Country Archetype DEV cerrada:**

| Fase | Estado |
|------|--------|
| **3.8f.2** — piloto 10 países + service | ✅ Cerrado |
| **3.8f.3** — Narrative Intelligence | ✅ Cerrado |
| **3.8f.4** — Premium Composition | ✅ Cerrado |

---

## III. Historial reciente (commits cerrados)

| Commit | Fase | Qué cerró |
|--------|------|-----------|
| `0673f46` | **3.8f.4** | Country archetype en City Premium Composition (DEV) |
| `bddd17a` | doc | MAPS Agent Library |
| `ae17672` | doc | Master Audit GPT |
| `8daf99f` | doc | Checkpoint post-3.8f.3 |
| `025a620` | **3.8f.3** | Country archetype en Narrative Intelligence (DEV) |
| `aab946d` | **3.8f.2** | Piloto arquetipo país — 10 países curados |
| `9c0f3fb` | 3.8f.0 | Extracción `cities-catalog.js` |
| `e84dd55` | 3.8f.1 | Diseño Country Archetype Layer (doc) |
| `888bb80` | Firebase | Staging + deploy scripts seguros |
| `2652b64` | 3.8e.9d | Human presence premium voice |

---

## IV. Qué está cerrado

### Producto base (Fase 1.x) — visible en app.js

- Mapa Leaflet, 27 ciudades oro, scorer, interpretaciones popup, onboarding perfil
- Goals Layer visible, Cities suggestions top-3
- Motor `astro.js` (40 líneas)
- **Sin lectura premium compuesta en UI**

### Capas premium DEV (Fase 3.8e)

- **Narrative Intelligence** — spine + atmosphere + countryContext
- **City atmosphere** — 3 ciudades lab (Lisboa, Toronto, Ciudad del Cabo)
- **Human presence** — voz experiencial
- **City Premium Composition** — lecturas 500–900 palabras + matiz país (3.8f.4)
- **Premium Knowledge Service** — bloques DOC-17
- Previews DEV + smokes

### Country Archetype (Fase 3.8f — DEV completo, producto NO)

| Entregable | Estado |
|------------|--------|
| Diseño (`COUNTRY_ARCHETYPE_LAYER.md`) | ✅ 3.8f.1 |
| `country-archetypes.js` + `country-archetype-service.js` | ✅ 3.8f.2 |
| Integración **Narrative Intelligence** | ✅ 3.8f.3 |
| Integración **City Premium Composition** | ✅ 3.8f.4 |
| Integración **`app.js` / producto visible** | ❌ Pendiente (→ 3.8g) |
| Ampliación 51 / 195 países | ❌ Fuera de alcance |

**Países piloto curados (10):** Portugal, España, Francia, Reino Unido, Italia, Japón, Brasil, Argentina, Sudáfrica, Canadá.

---

## V. Qué está pendiente

### Opciones de siguiente fase (elegir una con aprobación explícita)

| Fase | Objetivo | Toca |
|------|----------|------|
| **3.8f.5b** | Deploy staging de `src/` actual | `dist/` sync, smokes, `deploy-staging.sh` |
| **3.8f.6** | Revisión editorial 10 países piloto | `country-archetypes.js`, voice review, smokes |
| **3.8g** | Cableado producto premium en `app.js` | `app.js`, `index.html`, UX lectura al tocar ciudad |

### Medio plazo

- Actualizar `KAIROS_CURRENT_CHECKPOINT.md` tras cada cierre (doc-only commit)
- Actualizar `VERSION.md` (desactualizado vs 3.8x)
- Ampliar atmósfera urbana más allá de 3 ciudades lab
- Relocation premium UI (3.9) — congelado hasta aprobación

### Explícitamente NO iniciado

- Ampliación a 51 o 195 países
- Motores WASM / `astro.js` / scorer core
- Firestore / Auth
- Deploy producción con capas 3.8f
- Deploy automático

---

## VI. Qué NO tocar (salvo instrucción explícita)

| Área | Motivo |
|------|--------|
| **`src/ui/app.js`** | Producto visible; premium DEV no cableado (hasta 3.8g) |
| **`src/index.html`** (producto) | Idem; previews en `src/dev/` |
| **`dist/`** | Artefacto deploy; desincronizado; no es SSOT |
| **`.DS_Store`** | Nunca commitear |
| **`src/engines/astro.js`** | Motor congelado |
| **`src/content/city-scorer.js`** | Scorer producto |
| **Firebase / deploy** | Sin aprobación explícita |
| **Motores / WASM** | Golden gate obligatorio |

---

## VII. Staging / producción

| Entorno | URL | Estado |
|---------|-----|--------|
| **Producción** | https://kairos-maps-mvp.web.app | **Intacta** — Fase 1.x, sin 3.8e/3.8f |
| **Staging** | https://kairos-maps-dev.web.app | **Desfasada** respecto a `src/` actual (3.8f.4 no desplegada) |

**Flujo deploy:** `src/` → sync → `dist/` → `firebase deploy` (solo con aprobación).

**Firebase:** Hosting estático. Sin Auth/Firestore.

---

## VIII. Arquitectura DEV activa

```
Pipeline lectura premium DEV (completo):

  rankInfluences → deriveNarrativeContext()
                     ├─ cityAtmosphere (3 ciudades)
                     └─ countryContext (10 países)     ← 3.8f.3
                   → getBlocksForContext()
                   → composeCityReading()              ← 3.8f.4 teje countryContext.lines

src/services/
  narrative-intelligence-service.js   ← 3.8f.3-dev-0.1
  city-premium-composition-service.js   ← 3.8f.4-dev-0.1
  country-archetype-service.js
  premium-knowledge-service.js

src/dev/
  narrative-intelligence-preview.html
  city-premium-preview.html           ← country panel 3.8f.4
  country-archetype-preview.html

scripts/ (gate 3.8f)
  dev-country-archetype-smoke.sh
  dev-country-archetype-integration-smoke.sh
  dev-narrative-intelligence-smoke.sh
  dev-country-composition-smoke.sh      ← nuevo 3.8f.4
  dev-city-premium-composition-smoke.sh
```

**Peso editorial:** carta + línea + goal 60% · ciudad 25% · país 15%.

---

## IX. Smokes — estado esperado

Con `0673f46` en `main`, estos scripts deben pasar:

```bash
./scripts/dev-country-archetype-smoke.sh
./scripts/dev-country-archetype-integration-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-country-composition-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
```

---

## X. Git status actual (26 mayo 2026)

```
 M .DS_Store
 M dist/* (varios modificados + untracked)
 M docs/architecture/KAIROS_CURRENT_CHECKPOINT.md   ← actualizado 3.8f.5a (sin commit)
```

**Rama:** `main` @ `0673f46`  
**Working tree limpio en `src/`** y `scripts/` para 3.8f.4.  
**Ruido:** `dist/`, `.DS_Store`. **Doc checkpoint:** modificado, pendiente commit doc-only.

---

## XI. Advertencia — `dist/` y `.DS_Store`

> **`dist/` y `.DS_Store` no forman parte del desarrollo activo.**

- **`src/`** es la fuente de verdad.
- **`dist/`** no implica producto integrado ni staging actualizado.
- Antes de **3.8f.5b** (deploy staging): sync consciente `src/` → `dist/`, smokes PASS, aprobación explícita.

---

## XII. Siguiente fase recomendada

Country Archetype DEV **cerrado** en narrative + composition. Tres caminos posibles:

### **3.8f.5b — Deploy staging de `src/` actual** (validación externa)

- Sync `src/` → `dist/`
- Ejecutar smokes + golden si aplica
- `./scripts/deploy-staging.sh` con aprobación
- Validar previews DEV en https://kairos-maps-dev.web.app
- **No tocar producción**

### **3.8f.6 — Revisión editorial 10 países piloto** (contenido)

- Revisar `country-archetypes.js` con voice_tone
- Ajustes menores editorial + smokes
- Sin ampliar a 51 países

### **3.8g — Cableado producto premium en `app.js`** (producto visible)

- Invocar `composeCityReading()` al seleccionar ciudad
- Cargar scripts premium en producto (con aprobación)
- UX lectura 500–900 palabras en UI
- **Mayor impacto usuario** — requiere decisión producto explícita

**Recomendación operativa:** **3.8f.5b** (staging) antes de **3.8g** (producto), para validar pipeline completo fuera de localhost sin tocar prod.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `KAIROS_MASTER_AUDIT.md` | Auditoría total + agentes GPT |
| `MAPS_AGENT_LIBRARY.md` | Inventario lecturas GPT |
| `COUNTRY_ARCHETYPE_LAYER.md` | Diseño capa país |
| `KAIROS_DOC_INDEX.md` | Constitución Viva |

---

*Checkpoint actualizado Fase 3.8f.5a · Sin commit automático · Sin push · Sin deploy*
