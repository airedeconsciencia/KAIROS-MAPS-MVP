# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Último commit cerrado:** `89028b3` — `3.8f6 city atmosphere expansion p0`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP es una app de cartografía astrológica (Leaflet + motor `astro.js`) con **lecturas premium DEV completas** bajo `src/`. El **Country Archetype** (piloto 10 países) está integrado en **Narrative Intelligence** y **City Premium Composition**. La **City Atmosphere** cubre ahora **5 ciudades piloto** con personalidad urbana propia — solo en laboratorio DEV.

El **producto visible** (`src/ui/app.js`, `src/index.html`) **no usa** esta lectura premium. Sigue en Fase 1.x estable (mapa, popup, goals, suggestions). **`app.js` sin cableado premium.**

El trabajo activo vive en **`src/`**. **`dist/`** es artefacto de deploy y **no refleja** el estado DEV actual. **Staging desfasado** respecto a `src/`. **Producción intacta** (sin capas 3.8e/3.8f).

---

## II. Último commit cerrado

| Campo | Valor |
|-------|--------|
| **Hash** | `89028b389ec4ab6edd14c26e91a9db457292aed5` |
| **Mensaje** | `3.8f6 city atmosphere expansion p0` |
| **Alcance** | City Atmosphere Expansion P0 — 5 ciudades, successTone, dedup ciudad↔país |

**Archivos incluidos en 3.8f.6:**

- `docs/voice/CITY_ATMOSPHERE_LIBRARY.md` — biblioteca editorial 5 ciudades + éxito + firma zodiacal
- `src/services/narrative-intelligence-service.js` — schema `3.8f.6-dev-0.1`, `CITY_ATMOSPHERE_INDEX` ampliado, dedup runtime
- `src/dev/narrative-intelligence-preview.html` — panel `successTone` + `zodiacSignature`
- `scripts/dev-narrative-intelligence-smoke.sh` — gate 5 ciudades + anti-dogma
- `scripts/dev-city-premium-composition-smoke.sh` — Barcelona/Tokio atmosphere
- `scripts/dev-country-composition-smoke.sh` — atmosphere 5 ciudades
- `scripts/dev-country-archetype-integration-smoke.sh` — schema 3.8f.6+

**Comportamiento clave:**

- **Barcelona** y **Tokio** tienen `cityAtmosphere` propia (antes solo país + genéricos).
- **Lisboa**, **Toronto**, **Ciudad del Cabo** mejoradas: dimensión **successTone**, frases deduplicadas respecto a capa país.
- **`zodiacSignature`** existe como **metadata** en `cityAtmosphere` — **no** se expresa como dogma interpretativo en lectura.
- **`linesOverlapCityCountry()`** filtra líneas país que repiten fragmentos ciudad activos.

**Cadena 3.8f DEV:**

| Fase | Estado |
|------|--------|
| **3.8f.2** — piloto 10 países + service | ✅ Cerrado |
| **3.8f.3** — Narrative Intelligence | ✅ Cerrado |
| **3.8f.4** — Premium Composition | ✅ Cerrado |
| **3.8f.6** — City Atmosphere Expansion P0 | ✅ Cerrado |

---

## III. Historial reciente (commits cerrados)

| Commit | Fase | Qué cerró |
|--------|------|-----------|
| `89028b3` | **3.8f.6** | City atmosphere 5 ciudades · successTone · dedup · zodiac metadata |
| `8f1f489` | doc | Territorial Archetype Layer + City Distinctiveness Audit |
| `8d6b2a9` | doc | Checkpoint post-3.8f.4 |
| `0673f46` | **3.8f.4** | Country archetype en City Premium Composition (DEV) |
| `bddd17a` | doc | MAPS Agent Library |
| `ae17672` | doc | Master Audit GPT |
| `025a620` | **3.8f.3** | Country archetype en Narrative Intelligence (DEV) |
| `aab946d` | **3.8f.2** | Piloto arquetipo país — 10 países curados |

---

## IV. Qué está cerrado

### Producto base (Fase 1.x) — visible en app.js

- Mapa Leaflet, 27 ciudades oro, scorer, interpretaciones popup, onboarding perfil
- Goals Layer visible, Cities suggestions top-3
- Motor `astro.js` (40 líneas)
- **Sin lectura premium compuesta en UI**

### Capas premium DEV (Fase 3.8e + 3.8f)

- **Narrative Intelligence** — schema `3.8f.6-dev-0.1` · spine + atmosphere + countryContext
- **City atmosphere** — **5 ciudades piloto** (Lisboa, Toronto, Ciudad del Cabo, Barcelona, Tokio)
- **successTone** — dimensión éxito por ciudad (metadata editorial)
- **zodiacSignature** — firma zodiacal territorial ponderada (metadata, no dogma)
- **Human presence** — voz experiencial
- **City Premium Composition** — lecturas 500–900 palabras + matiz país (3.8f.4)
- **Country Archetype** — 10 países curados integrados
- **Premium Knowledge Service** — bloques DOC-17
- Previews DEV + smokes

### City Atmosphere (Fase 3.8f.6 — cerrada)

| Ciudad | citySlug | Notas |
|--------|----------|-------|
| Lisboa | `lisboa` | Mejorada · dedup Portugal · successTone |
| Toronto | `toronto` | Mejorada · dedup Canadá · successTone |
| Ciudad del Cabo | `ciudad_del_cabo` | Mejorada · dedup Sudáfrica · successTone |
| Barcelona | `barcelona` | **Nueva** — atmósfera urbana propia (no solo España) |
| Tokio | `tokio` | **Nueva** — megaciudad urbana (no solo Japón) |

**Auditoría previa:** `CITY_DISTINCTIVENESS_AUDIT.md` (3.8f.5b doc) · diseño territorial: `TERRITORIAL_ARCHETYPE_LAYER.md` (3.8h.0 doc).

### Country Archetype (producto NO)

| Entregable | Estado |
|------------|--------|
| Integración **`app.js` / producto visible** | ❌ Pendiente (→ 3.8g) |
| Ampliación 51 / 195 países | ❌ Fuera de alcance |

---

## V. Qué está pendiente

### Siguiente fase recomendada

| Fase | Objetivo | Toca |
|------|----------|------|
| **3.8g.1** | **Premium UI Integration Audit** — inventario cableado, gaps UX, riesgos antes de tocar `app.js` | `docs/` + análisis producto |

### Otras opciones (requieren aprobación explícita)

| Fase | Objetivo | Toca |
|------|----------|------|
| **3.8f.5b** | Deploy staging de `src/` actual | `dist/` sync, smokes, `deploy-staging.sh` |
| **3.8g** | Cableado producto premium en `app.js` | `app.js`, `index.html`, UX lectura al tocar ciudad |
| **3.8h.1** | Piloto Territorial Archetype (5 territorios) | contenido + service (post-audit UI) |

### Medio plazo

- Actualizar `KAIROS_CURRENT_CHECKPOINT.md` tras cada cierre (doc-only commit)
- Tejer `successTone` en composición (opcional, post-3.8g)
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
| **Staging** | https://kairos-maps-dev.web.app | **Desfasada** respecto a `src/` actual (3.8f.6 no desplegada) |

**Flujo deploy:** `src/` → sync → `dist/` → `firebase deploy` (solo con aprobación).

**Firebase:** Hosting estático. Sin Auth/Firestore.

---

## VIII. Arquitectura DEV activa

```
Pipeline lectura premium DEV (completo):

  rankInfluences → deriveNarrativeContext()
                     ├─ cityAtmosphere (5 ciudades)      ← 3.8f.6
                     │    ├─ successTone (metadata)
                     │    └─ zodiacSignature (metadata, no dogma)
                     └─ countryContext (10 países)       ← 3.8f.3 + dedup 3.8f.6
                   → getBlocksForContext()
                   → composeCityReading()                ← 3.8f.4

src/services/
  narrative-intelligence-service.js   ← 3.8f.6-dev-0.1
  city-premium-composition-service.js   ← 3.8f.4-dev-0.1
  country-archetype-service.js
  premium-knowledge-service.js

src/dev/
  narrative-intelligence-preview.html ← successTone + zodiacSignature panel
  city-premium-preview.html
  country-archetype-preview.html

docs/voice/
  CITY_ATMOSPHERE_LIBRARY.md          ← SSOT editorial 5 ciudades
```

**Peso editorial:** carta + línea + goal 60% · ciudad 25% · país 15%.

---

## IX. Smokes — estado esperado

Con `89028b3` en `main`, estos **4 smokes gate 3.8f.6** deben pasar:

```bash
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
./scripts/dev-country-composition-smoke.sh
./scripts/dev-country-archetype-integration-smoke.sh
```

**Gate ampliado (5 smokes 3.8f):**

```bash
./scripts/dev-country-archetype-smoke.sh
```

**Estado verificado post-3.8f.6:** los 4 smokes gate + country-archetype-smoke → **ALL PASS**.

---

## X. Git status actual (26 mayo 2026)

```
 M .DS_Store
 M dist/* (varios modificados + untracked)
 M docs/architecture/KAIROS_CURRENT_CHECKPOINT.md   ← actualizado 3.8f.6a (sin commit)
```

**Rama:** `main` @ `89028b3`  
**Working tree limpio en `src/`** y `scripts/` para 3.8f.6.  
**Ruido:** `dist/`, `.DS_Store`. **Doc checkpoint:** modificado, pendiente commit doc-only.

---

## XI. Advertencia — `dist/` y `.DS_Store`

> **`dist/` y `.DS_Store` no forman parte del desarrollo activo.**

- **`src/`** es la fuente de verdad.
- **`dist/`** no implica producto integrado ni staging actualizado.
- Antes de **3.8f.5b** (deploy staging): sync consciente `src/` → `dist/`, smokes PASS, aprobación explícita.

---

## XII. Siguiente fase recomendada

City Atmosphere DEV **cerrada** (5 ciudades). Country Archetype DEV **cerrado** en narrative + composition.

### **3.8g.1 — Premium UI Integration Audit** (recomendada)

- Inventario de qué scripts/servicios debe cargar el producto visible
- Gaps UX: popup vs lectura 500–900 palabras, goals, loading, fail-soft
- Riesgos antes de tocar `app.js` / `index.html`
- Entregable doc-only — **sin cableado** hasta aprobación 3.8g

### Alternativas

| Fase | Cuándo |
|------|--------|
| **3.8f.5b** | Validar pipeline en staging antes de producto |
| **3.8g** | Cableado premium en UI (post-audit 3.8g.1) |
| **3.8h.1** | Piloto Territorial Archetype (doc 3.8h.0 ya existe) |

**Recomendación operativa:** **3.8g.1** (audit UI) → **3.8f.5b** (staging opcional) → **3.8g** (producto).

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `CITY_DISTINCTIVENESS_AUDIT.md` | Auditoría diferenciación urbana (3.8f.5b) |
| `TERRITORIAL_ARCHETYPE_LAYER.md` | Diseño capa territorial (3.8h.0) |
| `COUNTRY_ARCHETYPE_LAYER.md` | Diseño capa país |
| `CITY_ATMOSPHERE_LIBRARY.md` | Biblioteca editorial 5 ciudades |
| `KAIROS_MASTER_AUDIT.md` | Auditoría total + agentes GPT |
| `MAPS_AGENT_LIBRARY.md` | Inventario lecturas GPT |

---

*Checkpoint actualizado Fase 3.8f.6a · Sin commit automático · Sin push · Sin deploy*
