# KAIROS MAPS — Current Checkpoint

**Documento:** snapshot de estado del proyecto  
**Fecha:** 26 mayo 2026  
**Rama:** `main`  
**Último commit cerrado:** `025a620c` — `3.8f3 country archetype narrative integration dev`

---

## I. Resumen ejecutivo

KAIROS MAPS MVP es una app de cartografía astrológica (Leaflet + motor `astro.js`) con lecturas premium en desarrollo paralelo bajo `src/`. El producto visible (`src/ui/app.js`, `src/index.html`) permanece en Fase 1.x estable. Las fases 3.8e–3.8f avanzan **capas DEV** (narrative intelligence, atmósfera urbana, catálogo de ciudades, arquetipo país) sin cablearlas aún en la UI de producción.

El trabajo activo vive en **`src/`**. La carpeta **`dist/`** es artefacto de deploy (copia/espejo hacia Firebase Hosting) y **no refleja el estado DEV actual** del repositorio.

---

## II. Último commit cerrado

| Campo | Valor |
|-------|--------|
| **Hash** | `025a620cbf123579be73d1e52c073224e33b34cb` |
| **Mensaje** | `3.8f3 country archetype narrative integration dev` |
| **Alcance** | Integración Country Archetype × Narrative Intelligence (solo DEV) |

**Archivos incluidos en 3.8f.3:**

- `src/services/narrative-intelligence-service.js` — schema `3.8f.3-dev-0.1`, `countryContext`, tejido editorial (máx. 2 líneas país, máx. 1 por sección)
- `src/dev/narrative-intelligence-preview.html` — preview con 5 casos piloto + panel country
- `scripts/dev-narrative-intelligence-smoke.sh` — asserts country layer
- `scripts/dev-country-archetype-integration-smoke.sh` — smoke dedicado integración

**Comportamiento clave:** `deriveNarrativeContext()` llama a `KairosCountryArchetype.resolveCountryArchetype()` con fail-soft. El país matiza (≈15% editorial), no manda. Prioridad: carta/línea/goal → ciudad → país.

---

## III. Historial reciente (commits cerrados)

| Commit | Fase | Qué cerró |
|--------|------|-----------|
| `025a620` | **3.8f.3** | Country archetype en Narrative Intelligence (DEV) |
| `aab946d` | 3.8f.2 | Piloto arquetipo país — 10 países curados, service + preview + smoke |
| `9c0f3fb` | 3.8f.0 | Extracción `cities-catalog.js`, scorer consume catálogo |
| `e84dd55` | 3.8f.1 | Diseño arquitectónico Country Archetype Layer (doc) |
| `888bb80` | Firebase | `firebase.json`, `.firebaserc`, `deploy-staging.sh`, `deploy-prod.sh` |
| `2652b64` | 3.8e.9d | Human presence premium voice en spine + composición DEV |
| `e48a512` | 3.8e.9a | City atmosphere (Lisboa, Toronto, Ciudad del Cabo) |

---

## IV. Qué está cerrado

### Producto base (Fase 1.x)

- Mapa Leaflet, 27 ciudades oro, scorer, interpretaciones, onboarding perfil
- Motor `astro.js` (40 líneas, astronomy-engine)
- Firebase Hosting configurado (prod + staging targets)

### Capas premium DEV (Fase 3.8e)

- **Narrative Intelligence** — hilo narrativo determinista antes de composición
- **City atmosphere** — 3 ciudades lab (Lisboa, Toronto, Ciudad del Cabo)
- **Human presence** — voz experiencial en spine y lectura compuesta
- **City Premium Composition** — lecturas 500–900 palabras con knowledge layer
- **Premium Knowledge Service** — resolución de bloques premium
- Previews DEV en `src/dev/` + smokes en `scripts/dev-*-smoke.sh`

### Country Archetype (Fase 3.8f — parcial)

| Entregable | Estado |
|------------|--------|
| Diseño (`COUNTRY_ARCHETYPE_LAYER.md`) | ✅ Cerrado (3.8f.1) |
| `src/content/country-archetypes.js` — 10 países piloto | ✅ Cerrado (3.8f.2) |
| `src/services/country-archetype-service.js` | ✅ Cerrado (3.8f.2) |
| Preview + smoke piloto | ✅ Cerrado (3.8f.2) |
| `src/content/cities-catalog.js` — 27 ciudades / 26 países | ✅ Cerrado (3.8f.0) |
| Integración en **Narrative Intelligence** | ✅ Cerrado (3.8f.3) |
| Integración en **City Premium Composition** | ❌ Pendiente (3.8f.4) |
| Integración en **app.js / producto visible** | ❌ Pendiente |
| Ampliación 51 / 195 países | ❌ Fuera de alcance actual |

**Países piloto curados (10):** Portugal, España, Francia, Reino Unido, Italia, Japón, Brasil, Argentina, Sudáfrica, Canadá.

---

## V. Qué está pendiente

### Inmediato — Fase 3.8f.4 (recomendada)

Integrar `countryContext` (ya generado por Narrative Intelligence) en `city-premium-composition-service.js`:

- Mismo presupuesto editorial: máx. 2 líneas país, máx. 1 por sección
- Secciones permitidas: síntesis, observar, integración final
- Fail-soft si país no curado
- Preview DEV de composición + smoke de regresión
- **Sin tocar** `app.js`, `index.html`, Firebase, motores

### Medio plazo

- Cablear capas DEV al producto visible (`app.js`, `index.html`) — solo con aprobación explícita
- Sincronizar `dist/` desde `src/` antes de cualquier deploy staging
- Actualizar `VERSION.md` (desactualizado respecto a commits 3.8x)
- Ampliar arquetipos país más allá del piloto 10
- Ampliar atmósfera urbana más allá de 3 ciudades lab

### Explícitamente NO iniciado

- Ampliación a 51 o 195 países
- Cambios en motores WASM / `astro.js` / scorer de producto
- Firestore / Auth
- Deploy automático

---

## VI. Qué NO tocar (salvo instrucción explícita)

| Área | Motivo |
|------|--------|
| **`src/ui/app.js`** | Producto visible estable; capas DEV aún no cableadas |
| **`src/index.html`** (producto) | Idem; previews DEV viven en `src/dev/` |
| **`dist/`** | Artefacto de deploy, no fuente de verdad; working tree sucio |
| **`.DS_Store`** | Basura de sistema; nunca commitear |
| **`src/engines/astro.js`** | Motor estable; fuera de alcance capas editoriales |
| **`src/content/city-scorer.js`** | Scorer producto; no mezclar con experimentos narrativos |
| **Firebase / `.firebaserc`** | Sin deploy sin aprobación |
| **`country-archetypes.js`** | Piloto cerrado; solo correcciones menores si smoke lo exige |
| **Motores / WASM** | Fuera de alcance fases 3.8e–3.8f |

---

## VII. Staging / producción

| Entorno | Target Firebase | URL | Estado respecto a DEV |
|---------|-----------------|-----|------------------------|
| **Producción** | `hosting:prod` → `kairos-maps-mvp` | https://kairos-maps-mvp.web.app | **No actualizada** con capas 3.8e/3.8f |
| **Staging** | `hosting:staging` → `kairos-maps-dev` | https://kairos-maps-dev.web.app | Puede estar desfasada; `dist/` local no sincronizado con `src/` |

**Scripts de deploy (requieren aprobación explícita):**

- `./scripts/deploy-staging.sh` → solo `hosting:staging`
- `./scripts/deploy-prod.sh` → solo `hosting:prod`

**Flujo canónico de deploy:** `src/` → copia/rsync → `dist/` → `firebase deploy`. Hoy **`dist/` no está al día** con Narrative Intelligence 3.8f.3 ni Country Archetype.

**Firebase:** solo Hosting estático. Sin Auth ni Firestore activos.

---

## VIII. Arquitectura DEV activa (referencia rápida)

```
src/content/
  cities-catalog.js          ← 27 ciudades, resolveCountryId
  country-archetypes.js      ← 10 países piloto
  premium-blocks.js          ← catálogo bloques premium
  city-scorer.js             ← rankInfluences (producto)

src/services/
  narrative-intelligence-service.js   ← 3.8f.3 · countryContext
  country-archetype-service.js          ← resolveCountryArchetype
  city-premium-composition-service.js   ← lectura premium (sin país aún)
  premium-knowledge-service.js
  natal-composition-service.js
  natal-map-bridge-service.js

src/dev/
  narrative-intelligence-preview.html
  country-archetype-preview.html
  city-premium-preview.html
  …

scripts/
  dev-narrative-intelligence-smoke.sh
  dev-country-archetype-smoke.sh
  dev-country-archetype-integration-smoke.sh
  dev-city-premium-composition-smoke.sh
  deploy-staging.sh / deploy-prod.sh
```

**Peso editorial recomendado (3.8f):** carta + línea + goal 60% · ciudad 25% · país 15%.

---

## IX. Smokes — estado esperado

Con `025a620` en `main`, estos scripts deben pasar:

```bash
./scripts/dev-country-archetype-smoke.sh
./scripts/dev-country-archetype-integration-smoke.sh
./scripts/dev-narrative-intelligence-smoke.sh
./scripts/dev-city-premium-composition-smoke.sh
```

---

## X. Git status actual (26 mayo 2026)

```
 M .DS_Store
 M dist/content/interpretations.js
 M dist/index.html
 M dist/services/natal-composition-service.js
 M dist/ui/app.js
 M dist/ui/profile.js
 M dist/ui/styles.css
?? dist/content/city-scorer.js
?? dist/content/city-summary-templates.js
?? dist/content/goal-signal.js
?? dist/content/premium-blocks.js
?? dist/content/reloc-lite.js
?? dist/services/city-premium-composition-service.js
?? dist/services/narrative-intelligence-service.js
?? dist/services/natal-map-bridge-service.js
?? dist/services/premium-knowledge-service.js
?? dist/services/reloc-chart-adapter.js
?? dist/services/reloc-composition-service.js
?? dist/services/relocation-profile-service.js
?? docs/architecture/KAIROS_CURRENT_CHECKPOINT.md   ← este documento (sin commit)
```

**Rama:** `main` @ `025a620`  
**Working tree limpio en `src/`** para lo commiteado en 3.8f.3.  
**Ruido activo:** `dist/` (modificados + untracked) y `.DS_Store`.

---

## XI. Advertencia — `dist/` y `.DS_Store`

> **`dist/` y `.DS_Store` no forman parte del desarrollo activo.**

- **`src/`** es la fuente de verdad del código en evolución.
- **`dist/`** es salida de build/copia para Firebase Hosting. Los cambios locales en `dist/` **no implican** que el producto DEV esté integrado ni que staging/prod estén actualizados.
- **No commitear** `dist/` salvo flujo de release explícito acordado.
- **No commitear** `.DS_Store` — añadir/verificar en `.gitignore` si reaparece con frecuencia.

Antes de cualquier deploy, regenerar `dist/` desde `src/` de forma consciente, ejecutar smokes, y obtener aprobación explícita.

---

## XII. Siguiente fase recomendada

### **FASE 3.8f.4 — Country Archetype × City Premium Composition (DEV)**

**Objetivo:** que la lectura premium compuesta (500–900 palabras) reciba el matiz país ya resuelto en `narrativeContext.countryContext`, con el mismo presupuesto editorial (máx. 2 líneas, no en todas las secciones).

**Alcance esperado:**

1. Modificar `city-premium-composition-service.js` para consumir `countryContext.lines`
2. Actualizar `src/dev/city-premium-preview.html` + smoke de composición
3. Verificar que smokes 3.8e + 3.8f siguen pasando
4. **No** cablear en `app.js` todavía
5. **No** deploy staging sin aprobación

**Después de 3.8f.4 (opcional):** deploy staging manual con sync `src/` → `dist/` para validar previews en https://kairos-maps-dev.web.app.

---

## XIII. Documentos relacionados

| Documento | Contenido |
|-----------|-----------|
| `docs/architecture/COUNTRY_ARCHETYPE_LAYER.md` | Diseño capa país (3.8f.1) |
| `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | Arquitectura producto |
| `docs/architecture/KAIROS_DOC_INDEX.md` | Índice documentación |
| `VERSION.md` | Versiones Fase 1.x (**desactualizado** vs. 3.8x) |

---

*Checkpoint generado manualmente. No implica commit, push ni deploy.*
