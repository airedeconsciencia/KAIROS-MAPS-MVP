# KAIROS MAPS — City Identity Architecture (SSOT)

**Fase:** F7.5–F8.2A · checkpoint F8.2A  
**Fecha:** 26 mayo 2026  
**HEAD identity code:** F8.2 Identity Decision Lab · Contract v1.0 (doc)  
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
| `scripts/dev-identity-decision-lab-smoke.sh` | F8.2 | Decision Lab · Contract v1.0 · A/B virtual · bridge/goal/scorer intactos |

**DEV previews (no prod):**

- `src/dev/identity-modulation-preview.html`
- `src/dev/identity-shadow-preview.html`
- `src/dev/shadow-analytics-preview.html`
- `src/dev/identity-calibration-preview.html`
- `src/dev/identity-context-observer-preview.html`
- `src/dev/identity-decision-lab-preview.html`

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
F8.2  Identity Decision Lab
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
| **F8.2** | Identity Decision Lab — evidencia A/B virtual Contract v1.0 Nivel A | DEV · astro estable · strength=0 idéntico | ✅ |
| **F8.3** | Identity Impact Analysis — medir efecto potencial en narrative/premium | Solo DEV | ✅ análisis |
| **F8.4** | Editorial Decision Layer — criterios humanos antes de modulación | QA editorial | ✅ decisión |
| **F8.5** | Micro Modulation — primera variable en DEV (`toneBias` V1) | `modulation.enabled` sigue false en prod | ✅ toneBias V1 frozen |
| **F8.5B** | Micro Modulation — `rhythmBias` (siguiente variable) | tras freeze toneBias V1 | pendiente |
| **F8.6** | Editorial QA — validación humana por variable | QA editorial PASS requerido | ✅ toneBias V1 (F8.6B) |
| **F8.7** | Controlled Activation (DEV) — activación gradual en staging DEV | smokes + checklist | pendiente |
| **F8.8** | Production Activation — cableado productivo post-gates | deploy explícito · sin sorpresas | pendiente |

**STOP actual:** F8.5C doc cerrado · **toneBias V1 frozen** · canario Lisboa DEV · sin activación prod · sin deploy. Siguiente: **F8.5B rhythmBias**.

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
| **Identity decision lab** | `src/services/identity-decision-lab-service.js` | **`8.2-0.1`** |

---

## 11. Identity Contract v1.0

**Fase:** F8.1E · documentación arquitectónica  
**Estado:** aprobado · **sin implementación** · **sin activación** · **sin cambios de runtime**  
**contractSchemaVersion:** `1.0.0`

Primera versión estable del **lenguaje interno de modulación** Identity. Define qué variables podrán modular el pipeline editorial en el futuro. No implementa código. No activa `modulation.enabled`. Complementa F8.1B (especificación), F8.1C (freeze review) y F8.1D (decisiones).

### 11.1 Propósito

Establecer un contrato permanente, mínimo y auditable entre:

- la capa Identity (perfil dimensional → coeficientes derivados), y
- los consumidores editoriales autorizados (narrative, knowledge, composition, atmosphere).

El contrato responde: *cómo puede una ciudad modular intensidad, ritmo, densidad y énfasis seccional* sin alterar astro, territorio, corpus literal ni scoring geo.

### 11.2 Filosofía

- **Identity modula intensidad y énfasis, no hechos ni territorio.**
- **Micro modulación:** efectos perceptibles pero acotados; reversible en DEV.
- **Derivación única:** solo Identity Modulation Service traduce `effectiveProfile` → contrato; consumidores **nunca** leen `effectiveProfile` directamente.
- **Fail-soft:** contrato neutro (todos los biases = 0) si `neutralFallback`, política denegada o `modulationStrength = 0`.
- **Determinismo:** mismo `citySlug` + mismo `ReadingContext` + misma versión de contrato → mismos coeficientes derivados.

### 11.3 Principios permanentes

| # | Principio |
|---|-----------|
| P1 | Consumidores leen **solo** `IdentityModulationContract` (y sobres obligatorios), nunca dimensiones fuente |
| P2 | **Gate doble:** aplicación requiere `enabled === true` **y** `applyPolicy.allowed === true` |
| P3 | Efecto efectivo = `bias × modulationStrength`, con `modulationStrength ∈ [0, 1]` |
| P4 | Rango canónico de biases: **`−0.3` … `+0.3`** · neutral = **`0`** |
| P5 | Corpus literal (`premium-blocks`), astro, bridge, goal, scorer, resolver y country archetype: **zona roja** — fuera del contrato |
| P6 | Cada consumidor declara **un canal** autorizado; no mezcla canales en una misma pasada |
| P7 | Evolución del contrato solo vía **ADR** + bump de `contractSchemaVersion` |

### 11.4 Envelope (estructura permanente)

El contrato se entrega siempre dentro de un **envelope** de tres capas. Solo la tercera contiene biases de efecto.

```
IdentityEnvelope
├── ReadingContext          (sobre producto — no bias)
├── applyPolicy             (sobre editorial — no bias)
└── IdentityModulationContract
    ├── contractSchemaVersion
    ├── enabled
    ├── modulationStrength
    └── channels.{narrative|atmosphere|knowledge|premium}
```

#### 11.4.1 ReadingContext (permanente · no bias)

Declara **qué producto** y **qué sujeto** interpretan el contrato. No modula intensidad.

| Campo | Valores iniciales | Responsabilidad |
|-------|-------------------|-----------------|
| `mode` | `city_reading` · `relocation` · `couple` · `ai_assistant` | Producto que consume la lectura |
| `locale` | `es` (extensible) | Idioma de aplicación de pools editoriales |
| `subjectScope` | `individual` · `dyad` | Sujeto de la lectura (Couple = dyad) |

Ampliación de `mode` solo vía ADR. Nuevo producto → nuevo `mode`, no nuevo bias.

#### 11.4.2 applyPolicy (permanente · no bias)

Política editorial separada del mapa de biases. Decide si los coeficientes calculados **pueden aplicarse**.

| Campo | Default | Regla |
|-------|---------|-------|
| `allowed` | `false` si `status === review_required'` o `neutralFallback` | Gate humano/editorial |

`enabled` = gate técnico. `applyPolicy.allowed` = gate editorial. Ambos deben ser `true` para efecto en producto.

#### 11.4.3 IdentityModulationContract

Contenedor de biases y controles de aplicación. `contractSchemaVersion: "1.0.0"`.

### 11.5 Nivel A — variables permanentes (congeladas v1.0.0)

Variables de **efecto** y **control** incluidas en el freeze definitivo. Suficientes para la primera modulación editorial (voz, ritmo, densidad, énfasis seccional) sin tocar selección de bloques.

| Variable | Tipo | Rango | Default | Canales |
|----------|------|-------|---------|---------|
| `enabled` | bool | `false` \| `true` | `false` | global |
| `modulationStrength` | scalar | `0.0` … `1.0` | `0.0` | global |
| `toneBias` | scalar | `−0.3` … `+0.3` | `0` | `narrative`, `premium` |
| `rhythmBias` | scalar | `−0.3` … `+0.3` | `0` | `narrative`, `atmosphere` |
| `densityBias` | scalar | `−0.3` … `+0.3` | `0` | `premium` |
| `sectionBias` | mapa (5 claves) | cada clave `−0.3` … `+0.3` | todas `0` | `knowledge`, `premium` |

Claves `sectionBias`: `favorece`, `desafia`, `observar`, `aprovecha`, `integracion`.

**Semántica resumida:**

- `toneBias` — intensidad emocional / franqueza vs intimidad del lenguaje
- `rhythmBias` — cadencia y ritmo narrativo
- `densityBias` — extensión y densidad informativa de la lectura
- `sectionBias` — énfasis relativo entre secciones premium

### 11.6 Nivel B — variables experimentales (fuera del freeze v1.0.0)

| Variable | Canal | Estado | Promoción |
|----------|-------|--------|-----------|
| `selectionBias` | `knowledge` | experimental | Solo tras F8.6 Editorial QA + smokes de selección estables |

Mapa de 10 claves alineadas con dimensiones de perfil (`activation` … `horizon`). **Solo** Premium Knowledge puede leerla. Modula **selección** de bloques, no texto literal. Ausente del schema congelado `1.0.0` hasta promoción explícita vía ADR.

### 11.7 Valores derivados (no serializables como input)

| Derivado | Fórmula conceptual | Consumidores |
|----------|-------------------|--------------|
| `atmosphereWeight` | función canónica de `rhythmBias` + `sectionBias.observar` + canal `atmosphere` | Narrative, Composition, Atmosphere |

`atmospherePresence` **no es variable del contrato**. Fue eliminada como miembro independiente (decisión F8.1D). Una sola fórmula canónica; consumidores no reinterpretan.

### 11.8 Consumidores autorizados

| Servicio | Canal | Variables Nivel A |
|----------|-------|-------------------|
| Narrative Intelligence | `narrative`, `atmosphere` | `toneBias`, `rhythmBias`, `atmosphereWeight` (derivado) |
| Premium Knowledge | `knowledge` | `sectionBias` |
| Premium Composition | `premium` | `toneBias`, `densityBias`, `sectionBias`, `atmosphereWeight` (derivado) |
| City Atmosphere (subcapa narrative) | `atmosphere` | `rhythmBias`, `atmosphereWeight` (derivado) |
| Identity Observer | todos | lectura / trazabilidad (sin aplicación) |
| Identity Simulation Lab (F8.2+) | todos | lectura comparativa A/B (DEV) |

Nivel A no se activa sin `ReadingContext` y `applyPolicy` presentes en el envelope.

### 11.9 Consumidores prohibidos (zona roja permanente)

| Servicio | Motivo |
|----------|--------|
| Editorial Family Resolver | SSOT territorial; Identity no redefine familia |
| Bridge | Natal del usuario ≠ identidad urbana |
| Goal Signal | Objetivo humano = elección del usuario |
| City Scorer | Ranking geo/astro sagrado |
| Country Archetype Service | Capa macro nacional aislada |
| `premium-blocks.js` (corpus) | Texto literal congelado |
| Motores astro / WASM | Hechos astrológicos invariantes |

### 11.10 Reglas de evolución mediante ADR

1. **Bump menor** (`1.0.x`): clarificaciones documentales sin cambio semántico.
2. **Bump mayor** (`1.x.0` o `2.0.0`): nueva variable permanente, nuevo `mode` en `ReadingContext`, o cambio de rango → **ADR obligatorio** en `KAIROS_ARCHITECTURAL_DECISIONS.md`.
3. **Promoción experimental → permanente** (`selectionBias`): ADR + bump de schema + smokes de regresión editorial.
4. **Prohibido** añadir bias por producto nuevo; nuevo producto = nuevo `ReadingContext.mode`.
5. **Implementación** de v1.0.0 en servicios productivos requiere F8.3 Impact Analysis tras F8.2 Decision Lab PASS (evidencia A/B virtual Nivel A).

### 11.11 Estado v1.0.0

| Dimensión | Valor |
|-----------|-------|
| Contrato documentado | ✅ F8.1E |
| Validación empírica DEV (Decision Lab) | ✅ F8.2 |
| Implementado en runtime productivo | ❌ |
| `modulation.enabled` en prod | ❌ `false` |
| `identityContext.enabled` | ❌ `false` |
| Nivel B activo | ❌ |
| Cambio UX visible | ❌ ninguno |

---

## 12. F8.2 — Identity Decision Lab

**Fase:** F8.2 · documentación F8.2A  
**Estado:** cerrado en `main` · **DEV only** · **sin activación** · **sin cambios de runtime productivo**  
**Servicio:** `src/services/identity-decision-lab-service.js` (`KairosIdentityDecisionLab`, schema `8.2-0.1`)  
**Preview:** `src/dev/identity-decision-lab-preview.html`  
**Smoke:** `scripts/dev-identity-decision-lab-smoke.sh`

### 12.1 Objetivo

Validar **empíricamente** el Identity Contract v1.0 (Nivel A) comparando:

- **A — Lectura base:** `composeCityReading` real, sin modulación aplicada.
- **B — Lectura simulada:** clone virtual con transforms DEV derivados de biases Nivel A × `modulationStrength`.

El lab produce **evidencia A/B** para decidir si el contrato es seguro antes de F8.3 Impact Analysis o cableado en servicios (F8.5+).

### 12.2 Alcance DEV only

- No modifica `narrative-intelligence-service.js`, `premium-knowledge-service.js` ni `city-premium-composition-service.js`.
- No escribe resultados en runtime productivo.
- No cableado en `app.js` ni `index.html`.
- `identityModulationContract.enabled` permanece **`false`** siempre en pipeline real.

### 12.3 Relación con Identity Contract v1.0

El lab construye el **envelope completo** por ciudad:

```
ReadingContext
applyPolicy
IdentityModulationContract (contractSchemaVersion: 1.0.0)
```

**Nivel A simulado** (virtual, no consumido por servicios):

| Variable | Uso en lab |
|----------|------------|
| `modulationStrength` | Escala global de efecto virtual (`0` … `1`) |
| `toneBias` | Transform modal determinista (`puede` ↔ `podría`) |
| `rhythmBias` | Cadencia (saltos de línea) |
| `densityBias` | Recorte de frase final |
| `sectionBias` | Énfasis por sección premium |

**Derivado:** `atmosphereWeight` — función de `rhythmBias` + `sectionBias.observar` + canal `atmosphere` (no variable de input).

**Nivel B (`selectionBias`):** fuera de scope F8.2 — no simulado.

### 12.4 ReadingContext

Envelope obligatorio en cada comparación:

| Campo | Default lab |
|-------|-------------|
| `mode` | `city_reading` |
| `locale` | `es` |
| `subjectScope` | `individual` |

### 12.5 applyPolicy

Gate editorial separado de biases. Si `allowed === false` (p. ej. `review_required`, `neutralFallback`), el lab fuerza `modulationStrength = 0` y B = A.

Ciudades verificadas con policy bloqueada: Beirut, Kabul, Reykjavik (GN).

### 12.6 Ciudades piloto

| Ciudad | slug | Notas lab |
|--------|------|-----------|
| Lisboa | `lisboa-pt` | Modulación virtual activa · ~6 secciones afectadas |
| Toronto | `toronto-ca` | Policy OK · biases bajo umbral textual posible |
| Cape Town | `ciudad-del-cabo-za` | Modulación virtual activa |
| Beirut | `beirut-lb` | `applyPolicy` bloquea · B = A |
| Kabul | `kabul-af` | `applyPolicy` bloquea · B = A |
| Reykjavik (GN) | `reykjavik-is` | Fallback neutral · B = A |

### 12.7 Métricas A/B

| Métrica | Descripción |
|---------|-------------|
| `changePercent` | % cambio aproximado de caracteres entre A y B |
| `sectionsAffected` | Número de secciones con diff textual |
| `meanIntensity` | Intensidad media de biases efectivos aplicados |
| `meaningStability` | `1` si invariantes astro idénticos; `0` si no |
| `warnings` | `apply_policy_denied`, `section_changed:*`, etc. |

API principal: `runComparison(input)` · `runCitySample(citySlug, options)`.

### 12.8 Invariantes verificadas (smoke F8.2)

| Invariante | Estado |
|------------|--------|
| `modulationStrength = 0` → secciones byte-identical | ✅ |
| `influencesUsed` / `deepInfluenceKeys` / tema dominante sin cambio | ✅ |
| Narrative / Premium idénticos antes y después del lab | ✅ |
| Bridge / Goal / Scorer sin mutación | ✅ |
| Lab aislado (no import en narrative/knowledge/premium) | ✅ |
| `contract.enabled = false` en runtime | ✅ |

### 12.9 Qué NO modifica

- Narrative Intelligence (spine, copy, selección)
- Premium Knowledge (bloques, IDs)
- Premium Composition (pipeline de composición)
- Bridge, Goal Signal, City Scorer, Editorial Family Resolver
- Country Archetype
- Producto visible / `dist/` / producción

### 12.10 Limitación explícita

**Simulación virtual ≠ implementación real.**

El lab aplica transforms post-composición en memoria. F8.5 Micro Modulation aplica la primera variable congelada (`toneBias` V1) en capa DEV post-composición (`identity-micro-modulation-service.js`). El lab no predice el texto final de implementación; provee **evidencia de dirección y magnitud** bajo Contract v1.0 Nivel A.

---

## 13. toneBias V1 Freeze

**Fase:** F8.5A–F8.5C · documentación F8.5C  
**Estado:** **frozen** · **DEV only** · **sin activación prod** · **sin deploy**  
**Servicio:** `src/services/identity-micro-modulation-service.js` (`KairosIdentityMicroModulation`, schema `8.5a4-0.1`)  
**Smoke:** `scripts/dev-identity-micro-modulation-smoke.sh`  
**Preview:** `src/dev/identity-micro-modulation-preview.html` (DEV local, no wiring prod)

### 13.1 Declaración de freeze

**toneBias V1** es la **primera modulación editorial aprobada y congelada** del stack Identity. Cualquier cambio semántico, de umbral, de léxico guardado o de alcance canario requiere **ADR + bump de versión** (`toneBias V1.x` o promoción de variable distinta).

**Editorial QA:** PASS definitivo F8.6B (26 mayo 2026).

### 13.2 Alcance aprobado

| Dimensión | Valor congelado |
|-----------|-----------------|
| Variable | **`toneBias` únicamente** |
| Transform | Modal determinista `puede` ↔ `podría` (y plural `pueden` ↔ `podrían`) |
| Canal efectivo | Post-composición sobre secciones premium (`narrative` → síntesis; `premium` → resto) |
| Pipeline | Texto → **Lexical Guard** → Tone Transform → resultado |
| Variables excluidas | `rhythmBias`, `densityBias`, `sectionBias`, `selectionBias` |
| Servicios intactos | Narrative, Premium, Knowledge, Bridge, Goal, Scorer, Resolver, Country, astro |

### 13.3 Canario

| Campo | Valor |
|-------|-------|
| Ciudad | **Lisboa** (`lisboa-pt`) |
| Arquetipo | `quiet_integration` |
| Goal validado QA | `amor` |
| `modulationStrength` máx. | **≤ 0.5** |
| `applyPolicy.allowed` | `true` obligatorio |

Ninguna otra ciudad recibe micro-modulación toneBias V1 en DEV canario.

### 13.4 Threshold Calibration (F8.5A2)

Umbral de activación **escalado por strength**:

```
threshold_direct  = 0.08 × modulationStrength
threshold_plural  = 0.15 × modulationStrength
```

Con `strength = 0.5` y `toneBias ≈ −0.105` (Lisboa): `effectiveTone = −0.0525` activa transform (`threshold_direct = 0.04`).

**Congelado:** no relajar ni endurecer umbrales sin ADR.

### 13.5 Lexical Guard (F8.5A4)

Capa de protección **previa** al Tone Transform. **No reescribe** — solo enmascara locuciones protegidas para evitar sustituciones parciales inválidas.

**Expresiones protegidas v1:**

| ID | Patrón |
|----|--------|
| `puede_que` | `puede que` |
| `pueden_que` | `pueden que` |

**Motivo editorial:** evitar `puede que` → `podría que` (agramatical). Verificado F8.6B en sección `observar`.

Ampliar la lista = ADR + bump `toneBias V1.x`.

### 13.6 Editorial QA (F8.6B) — PASS

| Gate | Resultado |
|------|-----------|
| `meaningStability` | **1** |
| Sin tono oracular | ✅ |
| Sin agramaticalidad | ✅ (post-guard) |
| Naturalidad / voz Kairos | ✅ |
| Secciones moduladas | 4 (`favorece`, `desafia`, `aprovecha`, `integracion`) |
| `observar` | Sin cambio · sin `podría que` · `puede que` preservado |
| `sintesis` | Sin cambio (sin modal objetivo en V1) |

**Veredicto oficial:** **toneBias V1 Approved.**

### 13.7 Ciudades bloqueadas

Micro-modulación toneBias V1 **no aplica** cuando:

| Condición | Ciudades ejemplo |
|-----------|------------------|
| No canario | Todas excepto `lisboa-pt` → byte-identical |
| `applyPolicy.allowed = false` | Beirut, Kabul (`review_required`) |
| `neutralFallback` | Reykjavik (GN) y ciudades sin identidad curada |
| `modulationStrength = 0` | Cualquier ciudad → byte-identical |

### 13.8 Restricciones permanentes (hasta F8.7+)

1. `contract.enabled = false` en prod · `identityContext.enabled = false`.
2. Sin cableado en `app.js` / `index.html` / `dist/`.
3. Sin modificación de spine narrative, bloques knowledge ni corpus literal.
4. Sin ampliación de canario sin nuevo ciclo Lab → QA → Freeze.
5. Decision Lab permanece virtual (umbrales fijos) — divergencia documentada vs micro-modulación calibrada.

### 13.9 Mantenimiento futuro

| Acción | Requisito |
|--------|-----------|
| Cambiar umbral o guard | ADR + bump `8.5a*.x` + re-QA editorial |
| Añadir ciudad canario | F8.4 decisión + Lab + Impact + QA + freeze parcial |
| Activar `rhythmBias` | **F8.5B** — ciclo completo Micro Modulation Lifecycle (ADR-015) |
| Cableado productivo | F8.7 Controlled Activation → F8.8 Production Activation |
| Promover `selectionBias` | ADR + F8.6+ por variable |

### 13.10 Commits de referencia

| Fase | Commit | Contenido |
|------|--------|-----------|
| F8.5A2 | `e21fff4` | Micro-modulación toneBias + threshold calibration |
| F8.5A3 | `37e14c4` | Decision Lab smoke stabilization |
| F8.5A4 | `eaf356c` | F8.5A4 cerrado · Lexical Guard integrado (`8.5a4-0.1`) |
| F8.5C | este freeze | Documentación toneBias V1 |

---

*SSOT City Identity · F8.5C · toneBias V1 frozen · canario Lisboa DEV · sin runtime prod · next F8.5B rhythmBias*
