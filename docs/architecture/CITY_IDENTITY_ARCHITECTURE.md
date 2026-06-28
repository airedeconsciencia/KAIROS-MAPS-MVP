# KAIROS MAPS — City Identity Architecture (SSOT)

**Fase:** F7.5–F8.1 · checkpoint F8.1A  
**Fecha:** 26 mayo 2026  
**HEAD identity code:** F8.1 Identity Context Observer (local) · F8.0 context pipeline  
**Baseline prod:** **106 ciudades / 103 países / 12 familias** — sin cambios visuales

---

## 1. Objetivo del sistema

City Identity es una capa **estructural y dimensional** que modela la identidad urbana de cada ciudad del catálogo sin alterar el runtime productivo.

**Propósito:**

- Asignar a cada `citySlug` un **arquetipo de identidad** editorialmente definido.
- Derivar un **perfil dimensional** (10 ejes, escala 1–5) que describe cómo esa ciudad modula narrativa, premium, knowledge y atmosphere — **en teoría**, no en producto.
- Matizar el perfil base con **firmas por ciudad** (City Signatures) para distinguir ciudades del mismo arquetipo.
- Calcular **coeficientes de modulación** derivados del perfil efectivo, siempre con `modulation.enabled = false`.
- Ejecutar todo el stack en **modo shadow** (DEV): comparación, analytics y calibration lab — sin cablear en `app.js`, narrative, premium ni knowledge.

**No es:**

- Un motor de copy ni generación de texto.
- Una feature visible para el usuario final.
- Un sustituto del resolver editorial ni del catálogo territorial.

---

## 2. Capas

### 2.1 City Identity Archetypes

| Campo | Valor |
|-------|-------|
| Archivo | `src/content/city-identity-archetypes.js` |
| Global | `window.KairosCityIdentityArchetypes` |
| Schema | `7.5b-0.1` |
| Entidades | **28 arquetipos** (catálogo semántico L2) |

Catálogo de tipos de identidad urbana: slug, displayName, summary, macroIdentity, identityAxis, editorialCluster. Sin ciudades, sin dimensiones numéricas, sin pesos.

### 2.2 Identity Dimension Profiles

| Campo | Valor |
|-------|-------|
| Archivo | `src/content/identity-modulation-profile.js` |
| Global | `window.KairosIdentityModulationProfile` |
| Schema | `7.5c-0.1` |
| Perfiles | **28** (uno por arquetipo) |

10 dimensiones por arquetipo (`activation`, `tempo`, `visibility`, `rooting`, `reflection`, `complexity`, `novelty`, `social_density`, `structure`, `horizon`), escala 1–5, neutral = 3.

**Nota:** existe un catálogo legacy de dimensiones en `src/content/identity-dimensions.js` (`7.5a-0.1`). El engine y shadow usan los slugs de `identity-modulation-profile.js`.

### 2.3 City Identity Index

| Campo | Valor |
|-------|-------|
| Archivo | `src/content/city-identity-index.js` |
| Global | `window.KairosCityIdentityIndex` |
| Schema | `7.5e-0.1` |
| Entradas | **106 ciudades** |

Mapeo `citySlug` → `identityArchetype`, `confidence` (A/B), `status`. Fuente provisional de mappings: `f7.3a_provisional`.

### 2.4 City Signatures

| Campo | Valor |
|-------|-------|
| Archivo | `src/content/city-signatures.js` |
| Global | `window.KairosCitySignatures` |
| Schema | `7.9b-0.1` |
| Firmas | **106** (una por ciudad) |

Ajustes dimensionales por ciudad sobre el perfil del arquetipo:

- `adjustments ∈ [-0.25, +0.25]` por dimensión
- `Σ|adj| ≤ 1.2`
- Preserva orden dominante del arquetipo
- Generadas algorítmicamente (F7.9B) — **no curadas editorialmente**

### 2.5 Identity Modulation Service

| Campo | Valor |
|-------|-------|
| Archivo | `src/services/identity-modulation-service.js` |
| Global | `window.KairosIdentityModulation` |
| Schema | `7.5e-0.1` |

Motor de coeficientes: convierte perfil dimensional → `modulationCoefficients` por canal (`narrative`, `premium`, `knowledge`, `atmosphere`) y sección (`favorece`, `desafia`, `observar`, `aprovecha`, `integracion`).

- `modulation.enabled = false` (invariante)
- `runtimeImpact: none`
- API principal: `resolveCityModulation(citySlug)` → trace + coefficients

### 2.6 Shadow Runtime

| Campo | Valor |
|-------|-------|
| Archivo | `src/services/identity-shadow-runtime-service.js` |
| Global | `window.KairosIdentityShadowRuntime` |
| Schema | `7.9c-0.1` |
| Preview | `src/dev/identity-shadow-preview.html` |

Runtime shadow unificado post-F7.9C. Expone por ciudad:

- `baseProfile` — perfil del arquetipo
- `citySignature` — ajustes de firma
- `effectiveProfile` — base + signature (clamp 1–5)
- `modulationCoefficients` — derivados del **effective profile**
- `trace.signatureApplied: true`

`SHADOW_MODE = 'shadow'` · sin efecto en producto.

### 2.7 Shadow Analytics

| Campo | Valor |
|-------|-------|
| Archivo | `src/services/shadow-analytics-service.js` |
| Global | `window.KairosShadowAnalytics` |
| Schema | `7.9c-0.1` |
| Preview | `src/dev/shadow-analytics-preview.html` |
| Export | `scripts/export-shadow-analytics-json.sh` → `tmp/shadow-analytics-f7.8b.json` |

Métricas agregadas sobre perfiles **efectivos**: distribución dimensional, distancias intra/inter-arquetipo, `signatureAppliedCount`, clusters de riesgo.

### 2.8 Calibration Lab

| Campo | Valor |
|-------|-------|
| Archivo | `src/services/identity-calibration-service.js` |
| Global | `window.KairosIdentityCalibration` |
| Schema | `7.9b-0.1` |
| Preview | `src/dev/identity-calibration-preview.html` |

Herramienta DEV de comparación euclidiana sobre effective profiles:

- `compareCities`, `explainIdentity`, `findNearestCities`, `findMostDifferentCities`
- `distance`, `rankCitiesByArchetype`

Sin IA · sin texto editorial · sin impacto en producto.

**Servicio auxiliar:** `src/services/shadow-comparison-service.js` (`KairosShadowComparison`, `7.9c-0.1`) — comparación A/B shadow vs baseline.

---

## 3. Flujo completo

```
citySlug
  │
  ▼
City Identity Index (7.5e)
  │  getCityIdentity(citySlug)
  ▼
identityArchetype
  │
  ▼
Identity Modulation Profile (7.5c)
  │  getProfile(archetypeSlug)
  ▼
baseProfile  (10 dims · 1–5)
  │
  ▼
City Signatures (7.9b)
  │  getCitySignature(citySlug).adjustments
  ▼
citySignature
  │
  ▼
effectiveProfile = clamp(baseProfile + citySignature, 1, 5)
  │
  ▼
Identity Modulation Service (7.5e)
  │  dimDelta(effectiveProfile) → weightBoosts, biases
  ▼
modulationCoefficients  (enabled: false)
  │
  ├─► Shadow Runtime (7.9c)     — trace + preview DEV
  ├─► Shadow Comparison (7.9c)  — A/B shadow vs neutral
  ├─► Shadow Analytics (7.9c)   — agregados + export JSON
  └─► Calibration Lab (7.9b)    — distancias + nearest/different
```

**Ejemplo verificado (smoke):** Lisboa y Asunción comparten arquetipo `quiet_integration` pero distancia euclidiana ≈ 0.55 tras aplicar firmas — confirma que signatures rompen colapso intra-arquetipo.

---

## 4. Invariantes (F7.10)

| Invariante | Estado |
|------------|--------|
| Sin runtime visible en producto | ✅ |
| `modulation.enabled = false` en todo el stack | ✅ |
| `runtimeImpact: none` · `modulationApplied: false` | ✅ |
| Sin imports en narrative / premium / knowledge | ✅ |
| Sin cableado en `src/ui/app.js` | ✅ |
| Sin deploy de identity a prod | ✅ |
| Shadow/analytics/calibration solo vía DEV previews + smokes | ✅ |

Cualquier integración futura que **consuma** identity **debe** pasar por QA editorial y gates F8.6+ antes de activación controlada (F8.7/F8.8).

| Invariante F8.0 | Estado |
|-----------------|--------|
| `identityContext` transportado en pipeline | ✅ |
| `identityContext` no leído por selección/copy | ✅ |
| Narrative / premium / knowledge text byte-identical | ✅ smoke |
| `identityContext.enabled = false` | ✅ |
| `modulation.enabled = false` | ✅ |

---

## 5. Smokes actuales

| Script | Fase | Qué valida |
|--------|------|------------|
| `scripts/dev-identity-modulation-smoke.sh` | F7.5E | Engine coefficients · enabled=false · 106 ciudades |
| `scripts/dev-identity-shadow-runtime-smoke.sh` | F7.9C | Shadow runtime · effectiveProfile · signatureApplied |
| `scripts/dev-shadow-analytics-smoke.sh` | F7.9C | Analytics agregados · métricas effective |
| `scripts/dev-shadow-analytics-export-smoke.sh` | F7.8B | Export JSON a `tmp/` |
| `scripts/dev-identity-calibration-smoke.sh` | F7.9B | Calibration · distancias · nearest/different |
| `scripts/dev-identity-context-pipeline-smoke.sh` | F8.0 | Context pipeline · 106 ciudades · byte-identical outputs |
| `scripts/dev-identity-context-observer-smoke.sh` | F8.1 | Observer · 106 ciudades · mutación 0 · narrative/premium byte-identical |

**DEV previews (no prod):**

- `src/dev/identity-modulation-preview.html`
- `src/dev/identity-shadow-preview.html`
- `src/dev/shadow-analytics-preview.html`
- `src/dev/identity-calibration-preview.html`
- `src/dev/identity-context-observer-preview.html`

---

## 6. Riesgos vivos

### 6.1 Siete ciudades `review_required` (confidence B)

| citySlug | Ciudad | Arquetipo |
|----------|--------|-----------|
| `belmopan-bz` | Belmopán | `frontier_emergence` |
| `kabul-af` | Kabul | `contained_intensity` |
| `beirut-lb` | Beirut | `border_threshold` |
| `addis-abeba-et` | Addis Abeba | `frontier_emergence` |
| `lome-tg` | Lomé | `resilient_ordinariness` |
| `banjul-gm` | Banjul | `quiet_integration` |
| `niamey-ne` | Niamey | `frontier_emergence` |

Requieren revisión editorial antes de confiar en modulación futura.

### 6.2 Signatures generadas, no curadas

Las 106 firmas en `city-signatures.js` son **algorítmicas** (F7.9B). No han pasado QA editorial ciudad a ciudad. Riesgo de ajustes incoherentes con la identidad percibida.

### 6.3 Cluster `resilient_ordinariness` (West Africa)

Sobre-asignación detectada en auditoría F7.6. Riesgo de homogeneización regional si se activa modulación sin recalibrar mappings.

### 6.4 Observer aislado del producto (F8.1)

El Observer es DEV-only y no está cableado en `app.js` ni `index.html`. Riesgo residual: importar el servicio en narrative/premium sin gate — smoke F8.1 lo detecta. Activación accidental en staging/prod sigue requiriendo gates F8.7/F8.8.

### 6.5 Activación sin QA editorial

Activar `modulation.enabled` o cablear coefficients en narrative/premium **sin** cerrar review_required, curar signatures y validar smokes de regresión editorial es el riesgo principal de F8.x.

### 6.6 Otros

- Dos sistemas de naming de dimensiones coexisten (`identity-dimensions.js` legacy vs profile slugs activos).
- Osaka / Valencia no están en catálogo (106); smokes usan proxies (Seúl, Madrid).

---

## 7. Roadmap F8.x

```
F8.0  Identity Context Pipeline
  ↓
F8.1  Identity Context Observer
  ↓
F8.2  Identity Simulation Lab
  ↓
F8.3  Identity Impact Analysis
  ↓
F8.4  Editorial Decision Layer
  ↓
F8.5  Micro Modulation
  ↓
F8.6  Editorial QA
  ↓
F8.7  Controlled Activation (DEV)
  ↓
F8.8  Production Activation
```

| Fase | Objetivo | Gate | Estado |
|------|----------|------|--------|
| **F8.0** | Identity Context Pipeline — transportar `identityContext` sin consumo | DEV · copy byte-identical | ✅ |
| **F8.1** | Identity Context Observer — inspección read-only del payload | DEV · mutación 0 · warnings no bloqueantes | ✅ |
| **F8.2** | Identity Simulation Lab — preview A/B sin escritura en prod | Solo DEV | pendiente |
| **F8.3** | Identity Impact Analysis — medir efecto potencial en narrative/premium | Solo DEV | pendiente |
| **F8.4** | Editorial Decision Layer — criterios humanos antes de modulación | QA editorial | pendiente |
| **F8.5** | Micro Modulation — coeficientes mínimos en laboratorio | `modulation.enabled` sigue false en prod | pendiente |
| **F8.6** | Editorial QA — cerrar `review_required` · curar signatures | review_required = 0 | pendiente |
| **F8.7** | Controlled Activation (DEV) — activación gradual en staging DEV | smokes + checklist | pendiente |
| **F8.8** | Production Activation — cableado productivo post-gates | deploy explícito · sin sorpresas | pendiente |

**STOP actual:** F8.1A doc cerrado. Observer operativo · identity transportado · no consumido · no activar modulación. No deploy.

---

## 8. Identity Context Pipeline

Integración editorial F8.0: el pipeline de generación **conoce** Identity, pero **no la aplica** todavía.

### 8.1 Origen del contexto

```
citySlug (canónico vía cities-catalog.cityIdFromRef)
  → City Identity Index → identityArchetype · confidence · status
  → Identity Modulation Profile → baseProfile
  → City Signatures → citySignature
  → effectiveProfile (clamp 1–5)
  → Editorial Family Resolver → editorialFamily
  → Shadow Runtime metadata → shadowMetadata · trace
  → Identity Context Service → identityContext
```

**Servicio:** `src/services/identity-context-service.js` (`KairosIdentityContext`, schema `8.0-0.1`)

**API:** `buildIdentityContext(citySlug)` · `buildIdentityContextFromCity(city)`

Delega resolución dimensional a `KairosIdentityShadowRuntime.computeShadowIdentity` con resolución lazy de dependencias (fail-soft si shadow no cargado).

### 8.2 Estructura del objeto

```javascript
{
  enabled: false,              // siempre false en F8.0
  citySlug: "lisboa-pt",       // slug canónico catálogo
  editorialFamily: "IBERIAN",  // vía resolver + city identity
  identityArchetype: "quiet_integration",
  citySignature: { found, adjustments, confidence, revision },
  effectiveProfile: { activation, tempo, … horizon },
  confidence: "A",             // del city index o shadow metadata
  shadowMetadata: { … },       // schema 7.9c · mode shadow · runtimeImpact none
  trace: { … }                 // trazabilidad pipeline · source identity_context
}
```

Fallback neutral si slug ausente, desconocido o shadow unavailable: `identityArchetype: null`, perfiles neutrales, `enabled: false`.

### 8.3 Invariantes F8.0

| Regla | Detalle |
|-------|---------|
| Transport only | Adjuntar `identityContext`; prohibido leerlo para copy o selección |
| `enabled: false` | Campo explícito; no confundir con modulación activa |
| `modulation.enabled = false` | Sin cambio respecto F7.10 |
| Fail-soft | Servicio ausente → pipeline sigue sin `identityContext` |
| Byte-identical | Narrative spine · knowledge blocks · premium sections sin cambio |
| Split-brain 0 | `editorialFamily` en context ≡ resolver para la ciudad |

### 8.4 Lifecycle

1. **Build** — `deriveNarrativeContext` construye spine + country; luego attach `identityContext`.
2. **Propagate** — `narrativeContext.identityContext` pasa a `getBlocksForContext` como `ctx.identityContext`.
3. **Serialize** — premium `meta.narrativeContext` incluye el objeto (payload más grande; sin efecto UX).
4. **Observe** — F8.1: `KairosIdentityContextObserver` inspecciona el objeto sin mutarlo (DEV).
5. **Consume** — **ninguno** en F8.0/F8.1. Modulación futura requerirá F8.5+ con gates F8.6–F8.8.

### 8.5 Modo read-only

F8.0 es **read-only respecto al producto**:

- No altera strings, templates, packs ni pesos de bloques.
- No activa coeficientes de modulación en narrative/premium/knowledge.
- No expone UI ni flags al usuario.
- Scripts identity **no** cargados en `src/index.html` prod (pipeline activo solo cuando el stack DEV está presente).

### 8.6 Servicios consumidores (transportadores)

| Servicio | Propiedad | Momento attach | Lee contexto |
|----------|-----------|----------------|--------------|
| `narrative-intelligence-service.js` | `narrativeContext.identityContext` | Post-spine / post-country | ❌ |
| `premium-knowledge-service.js` | `ctx.identityContext` | Pre-selección bloques | ❌ |
| `city-premium-composition-service.js` | vía `meta.narrativeContext` | Hereda de narrative | ❌ |

**Nota:** premium composition no importa `KairosIdentityContext` directamente; recibe el objeto por propagación.

### 8.7 Estado actual F8.0

| Dimensión | Valor |
|-----------|-------|
| Transportado | ✅ 106 ciudades (smoke) |
| Consumido | ❌ ningún servicio lee campos para copy |
| Modulación activa | ❌ `modulation.enabled = false` |
| Runtime visual | ✅ idéntico — smoke byte-identical Lisboa/Toronto/Cabo |
| Prod deploy | ❌ sin deploy · sin wiring `index.html` |
| Activación Identity | ❌ STOP |

---

## 9. F8.1 — Identity Context Observer

Capa DEV **read-only** para inspeccionar cómo viaja `identityContext` por el pipeline. Registra oficialmente la capacidad de observación sin añadir funcionalidad de producto.

### 9.1 Propósito

Responder, en laboratorio y sin tocar copy ni runtime visible:

- ¿El `identityContext` llega completo al pipeline?
- ¿Tiene la forma esperada (campos, `enabled: false`, metadata shadow)?
- ¿Cuánto pesa el payload?
- ¿Alguien lo mutó al pasarlo?

### 9.2 Filosofía read-only

El Observer **solo lee**. No escribe en el objeto observado, no decide selección de bloques, no genera texto, no activa modulación, no expone UI al usuario final.

| Hace | No hace |
|------|---------|
| Observa | Consumir Identity para copy |
| Valida integridad | Modificar Narrative |
| Resume payload | Modificar Premium |
| Mide tamaño aproximado (`payloadBytes`) | Modificar runtime productivo |
| Expone trazabilidad (`trace`, `shadowMetadata`) | Modificar producto |
| Detecta mutaciones o pérdida de campos | Activar `modulation.enabled` |
| Genera warnings **no bloqueantes** (`blocking: false`) | Cablearse en `app.js` / `index.html` |

### 9.3 Responsabilidades

1. **Recibir** `identityContext` (directo, construido o desde pipeline).
2. **Validar** campos requeridos y flags de seguridad (`enabled === false`, `runtimeImpact: none`, etc.).
3. **Resumir** `citySlug`, `editorialFamily`, `identityArchetype`, `confidence`, dimensiones efectivas.
4. **Medir** `payloadBytes` y `snapshotHash` (fingerprint estable del serializado).
5. **Exponer** `trace`, `shadowMetadata`, `effectiveProfile` en el reporte (copia de lectura).
6. **Detectar mutaciones** comparando antes/después de la observación.
7. **Emitir warnings** (`review_required_city`, `neutral_fallback:*`, `missing_field_*`, etc.) sin abortar el pipeline.

### 9.4 Servicio y artefactos

| Campo | Valor |
|-------|-------|
| Archivo | `src/services/identity-context-observer-service.js` |
| Global | `window.KairosIdentityContextObserver` |
| Schema | `8.1-0.1` |
| Preview | `src/dev/identity-context-observer-preview.html` |
| Smoke | `scripts/dev-identity-context-observer-smoke.sh` |

Ciudades representativas en preview: Lisboa, Toronto, Cape Town, Beirut, Kabul, Reykjavik (GN — fallback neutral).

### 9.5 APIs públicas

| API | Uso |
|-----|-----|
| `observeIdentityContext(identityContext, options?)` | Observación directa de un objeto ya construido |
| `observeBuiltContext(citySlug, options?)` | Construye vía `KairosIdentityContext.buildIdentityContext` y observa |
| `observePipelineIdentityContext(identityContext, options?)` | Observa el objeto adjunto en `narrativeContext` post-F8.0 |
| `observeAllCatalogCities()` | Barrido 106 ciudades — agregados `mutationCount`, `enabledViolations` |
| `verifyIdentityContextUnchanged(before, after)` | Comparación byte-serializada sin mutación |

Constantes expuestas: `SCHEMA_VERSION`, `REQUIRED_FIELDS`.

### 9.6 Invariantes F8.1

| Invariante | Estado |
|------------|--------|
| Observer no muta `identityContext` | ✅ smoke · `mutationCount: 0` |
| Warnings siempre no bloqueantes | ✅ `blocking: false` |
| `enabled: false` en 106 ciudades | ✅ smoke |
| Narrative / premium byte-identical tras observar | ✅ smoke |
| Sin import en narrative / premium / knowledge | ✅ smoke |
| Sin wiring en `app.js` / `index.html` | ✅ smoke |
| Sin deploy · sin UI productiva | ✅ |

### 9.7 Relación con F8.0 (Identity Context)

F8.0 **transporta** `identityContext` en el pipeline. F8.1 **observa** ese transporte sin participar en él:

```
F8.0 buildIdentityContext(citySlug)
  → attach en narrativeContext / ctx (transport only)
  → F8.1 observePipelineIdentityContext(...)   [DEV · paralelo · no side effects]
```

El Observer puede llamar a `buildIdentityContext` para laboratorio (`observeBuiltContext`) pero **no** es requerido en el path productivo.

### 9.8 Relación con Shadow Runtime

`identityContext` delega dimensionalmente en `KairosIdentityShadowRuntime` (F8.0). El Observer **lee** los campos derivados (`effectiveProfile`, `shadowMetadata`, `trace`) que Shadow ya calculó; **no** recalcula perfiles ni coefficients.

```
Shadow Runtime → effectiveProfile + shadowMetadata + trace
       ↓ (vía Identity Context Service)
identityContext
       ↓ (read-only)
Identity Context Observer → reporte DEV
```

### 9.9 Limitaciones

- Solo útil cuando el stack identity DEV está cargado (previews / smokes / laboratorio).
- `snapshotHash` es fingerprint de conveniencia (FNV-32 sobre JSON), no criptografía.
- Warnings documentan riesgo editorial; no bloquean ni corrigen datos.
- No sustituye F8.2+ (simulación, impacto, decisión editorial).
- No valida calidad editorial de arquetipos o signatures — solo forma e integridad estructural.

### 9.10 Qué NO hace (explícito)

- **NO consume Identity** para selección, scoring ni copy.
- **NO modifica Narrative** ni su spine.
- **NO modifica Premium** ni knowledge blocks.
- **NO modifica runtime** visible ni `modulation.enabled`.
- **NO modifica producto** — cero impacto UX en prod.

---

## 10. Mapa de archivos

| Capa | Archivo | Schema |
|------|---------|--------|
| Archetypes | `src/content/city-identity-archetypes.js` | `7.5b-0.1` |
| Dimensions (legacy) | `src/content/identity-dimensions.js` | `7.5a-0.1` |
| Dimension profiles | `src/content/identity-modulation-profile.js` | `7.5c-0.1` |
| City index | `src/content/city-identity-index.js` | `7.5e-0.1` |
| City signatures | `src/content/city-signatures.js` | `7.9b-0.1` |
| Modulation engine | `src/services/identity-modulation-service.js` | `7.5e-0.1` |
| Shadow runtime | `src/services/identity-shadow-runtime-service.js` | `7.9c-0.1` |
| Shadow comparison | `src/services/shadow-comparison-service.js` | `7.9c-0.1` |
| Shadow analytics | `src/services/shadow-analytics-service.js` | `7.9c-0.1` |
| Calibration lab | `src/services/identity-calibration-service.js` | `7.9b-0.1` |
| **Identity context** | `src/services/identity-context-service.js` | **`8.0-0.1`** |
| **Identity observer** | `src/services/identity-context-observer-service.js` | **`8.1-0.1`** |

---

*SSOT City Identity · F8.1A · observer read-only · context transportado · runtime visual intacto · next F8.2*
