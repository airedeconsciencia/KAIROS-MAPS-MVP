# KAIROS MAPS — Territorial Archetype Layer

**Fase 3.8h.0** · Diseño arquitectónico estratégico (sin implementación)  
**Última revisión:** mayo 2026  
**Estado:** propuesta · no desplegada · no cableada en producto

> La carta natal sigue mandando. La astrocartografía sigue mandando. El territorio **no diagnostica**: aporta **textura** — país, región, isla y ciudad pueden matizar la misma línea de formas distintas.

---

## I. Resumen ejecutivo

El **Country Archetype Layer** (Fase 3.8f) resolvió la necesidad de matizar lecturas con un clima cultural **macro** a escala nacional. Eso es válido y sigue operativo en DEV.

Sin embargo, **un país no agota el territorio**. España no es Baleares; Baleares no es Menorca; Menorca no es Maó. Cada nivel territorial puede tener una **textura energética** distinta sin convertirse en verdad astrológica ni en estereotipo.

La **Territorial Archetype Layer** propone un modelo unificado de cuatro niveles — `city`, `island`, `region`, `country` — con **firma zodiacal territorial** como resonancia ponderada (nunca signo fijo), reglas anti-invención heredadas de 3.8f, y **Country Archetype como subtipo** dentro del sistema más amplio.

**Este documento no implementa código.** Amplía la arquitectura documental para fases 3.8h.x.

---

## II. Diferencia entre país, región, isla y ciudad

| Nivel | Escala | Qué matiza | Ejemplo | Qué NO es |
|-------|--------|------------|---------|-----------|
| **Ciudad** | Micro · urbano | Ritmo, densidad, barrio, movilidad, escena local | Lisboa, Barcelona, Tokio, Maó | Sinónimo del país |
| **Isla** | Meso · geográfico-cultural | Aislamiento, escala humana, ritmo insular, relación con mar/tierra | Menorca, Bali, Sicilia | País independiente |
| **Región** | Meso · administrativo-cultural | Identidad regional, dialecto, clima, historia compartida | Baleares, Cataluña, Ontario, Kyushu | Sustituto de la carta natal |
| **País** | Macro · nacional | Clima cultural-emocional amplio, marco legal/social, tono colectivo prudente | España, Japón, Canadá | Esencia zodiacal única |

### 2.1 Ciudad

- Resuelve **coordenadas**, **atmósfera urbana** (`CITY_ATMOSPHERE` en 3.8e) y ancla de lectura.
- Habla de **cómo se vive el día a día** en un lugar concreto: calles, horarios, densidad, escena.
- Ya existe parcialmente en DEV como capa separada de país.

### 2.2 Isla

- Entidad territorial **acotada por geografía** (mar, canal, archipiélago) con identidad propia reconocible.
- Puede pertenecer a un país y a una región; **no se modela como país**.
- Matiza **escala, ritmo, contención, pertenencia local** — no bandera ni soberanía.

### 2.3 Región

- Agrupación **intermedia** entre país e isla/ciudad: comunidad autónoma, provincia estratégica, estado federado, prefectura.
- Captura tensiones reales (centro/periferia, costa/interior) sin política partidista.
- Evita duplicar lo que ya dice la ciudad o el país.

### 2.4 País

- Marco **macro** ya cubierto por Country Archetype (3.8f).
- Aporta clima cultural-emocional, modificadores por goal y línea.
- Peso editorial bajo (~15% en piloto 3.8f); no decide el destino.

### 2.5 Ejemplo ilustrativo — España → Baleares → Menorca → Maó

| Territorio | Textura distinta (conceptual) |
|------------|-------------------------------|
| **España** (país) | Amplitud peninsular, diversidad interna, ritmos múltiples, historia compartida sin reducir a una sola voz |
| **Baleares** (región) | Archipiélago, turismo y residencia, mar como horizonte, estacionalidad, doble vida local/visitante |
| **Menorca** (isla) | Ritmo lento, cuerpo, sencillez, memoria, silencio, naturaleza, contención, pertenencia íntima |
| **Maó** (ciudad) | Puerto, administración insular, vida urbana mínima, encuentro entre isla y mundo |

**Conclusión de diseño:** una lectura que solo use «España» pierde la textura de Menorca; una que trate Menorca como «país» falsea el modelo geopolítico y editorial.

---

## III. Por qué Country Archetype no debe limitarse a países

### 3.1 Límite del modelo actual

Country Archetype (3.8f) asume:

```
ciudad → countryId → arquetipo nacional
```

Eso funciona para **Portugal + Lisboa** o **Japón + Tokio** cuando la ciudad representa bien el clima nacional en la lectura.

Falla cuando:

- La **ciudad ancla** no representa la experiencia del usuario (relocation a Menorca, no a Madrid).
- La **región o isla** tiene identidad más fuerte que el promedio nacional (Baleares ≠ Castilla).
- **Nominatim** devuelve un pueblo, isla o barrio sin entrada en catálogo país.

### 3.2 Principio de granularidad territorial

> **El arquetipo debe resolverse al nivel territorial más específico curado disponible**, sin inventar niveles superiores ni inferiores.

Jerarquía de resolución (fail-soft hacia arriba):

```
city (si curada) → island → region → country → (ninguno)
```

Si existe arquetipo de **Menorca**, no sustituir por **España** solo porque el país esté curado. Si no existe isla, caer a región; si no, a país; si no, lectura sin matiz territorial extra.

### 3.3 Coherencia con astrocartografía

Las líneas astrocartográficas cruzan **coordenadas**, no fronteras administrativas. Un usuario puede tener Luna AC cerca de Menorca pero leer «España» en el popup. La capa territorial **alinea la prosa con el lugar vivido**, no reemplaza el cálculo de líneas.

---

## IV. Modelo de capas territoriales

### 4.1 Tipos canónicos

```javascript
const TERRITORIAL_TYPES = ['city', 'island', 'region', 'country'];
```

Cada entrada territorial es un **nodo** en un grafo jerárquico, no una lista plana duplicada.

### 4.2 Relaciones padre/hijo

```javascript
{
  id: 'menorca',
  type: 'island',
  name: 'Menorca',
  parentRegion: 'balearic_islands',
  parentCountry: 'spain',
  // sin parentIsland — es isla, no ciudad
}

{
  id: 'balearic_islands',
  type: 'region',
  name: 'Islas Baleares',
  parentCountry: 'spain',
  childIslands: ['menorca', 'mallorca', 'ibiza', 'formentera']
}

{
  id: 'mao',
  type: 'city',
  name: 'Maó',
  parentIsland: 'menorca',
  parentRegion: 'balearic_islands',
  parentCountry: 'spain',
  lat: 39.8885,
  lon: 4.2614
}
```

### 4.3 Qué capa aporta qué

| Capa | Campo en lectura | Presupuesto editorial sugerido (piloto) |
|------|------------------|----------------------------------------|
| **Ciudad** | `cityAtmosphere` | ~20–25% textura territorial total |
| **Isla** | `islandContext` | ~5–10% (si aplica) |
| **Región** | `regionContext` | ~5–10% (si aplica) |
| **País** | `countryContext` | ~10–15% |
| **Firma zodiacal** | `territorialZodiacSignature` | Matiz meta · nunca párrafo dogmático |

**Regla:** presupuesto total de líneas territoriales en composición ≤ **3 líneas** (vs 2 solo país hoy), con máximo **1 línea por nivel** y sin repetir la misma imagen en ciudad + isla + región + país.

### 4.4 Separación de responsabilidades

| Capa existente | Territorial Layer |
|----------------|-------------------|
| City Atmosphere (3.8e) | Ciudad = micro · puede fusionarse en `type: city` del catálogo territorial |
| Country Archetype (3.8f) | País = macro · subtipo `type: country` |
| **Nuevo** | Isla y región = meso · evitan el agujero entre ciudad y país |

---

## V. Pipeline de combinación

Orden de **autoridad** (qué manda) vs orden de **matiz** (qué textura):

### 5.1 Jerarquía de autoridad (no negociable)

```
1. Carta natal (Bridge)
2. Relocación (si aplica)
3. Líneas astrocartográficas (planeta × ángulo · score)
4. Goal (amor | trabajo | descanso)
───────────────────────────────────────
5. Matiz territorial (ciudad → isla → región → país)
6. Firma zodiacal territorial (resonancia simbólica · peso bajo)
```

**La astrocartografía manda por encima del arquetipo territorial.**  
**La carta natal y la relocación mandan por encima de todo matiz cultural.**

### 5.2 Flujo de composición propuesto

```
                    ┌─────────────────────┐
                    │  Natal Map Bridge   │
                    │  (carta natal)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Relocation Profile │
                    │  (carta en destino) │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  City Scorer        │
                    │  líneas dominantes  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Goal Signal        │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌────────▼────────┐  ┌─────────▼─────────┐  ┌───────▼────────┐
│ City atmosphere │  │ Territorial       │  │ Zodiac         │
│ (micro)         │  │ resolve chain:    │  │ signature      │
│                 │  │ city→island→      │  │ (ponderada)    │
│                 │  │ region→country    │  │                │
└────────┬────────┘  └─────────┬─────────┘  └───────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Narrative           │
                    │ Intelligence        │
                    │ territorialContext  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Premium             │
                    │ Composition         │
                    └─────────────────────┘
```

### 5.3 Fórmula conceptual ampliada

```
Lectura = f(
  carta natal,
  relocación,
  línea dominante,
  goal,
  ciudad,
  isla | región,   // el más específico disponible
  país,
  firma zodiacal territorial  // matiz, no verdad
)
```

**Peso editorial sugerido (piloto 3.8h — orientativo, no rígido):**

| Componente | Peso |
|------------|------|
| Carta + línea + goal | **55–60%** |
| Ciudad | **20–25%** |
| Isla o región (si curada) | **5–10%** |
| País | **10–15%** |
| Firma zodiacal | **≤5%** · solo modula tono de 0–1 frase condicional |

---

## VI. Firma zodiacal territorial

### 6.1 Principio

La firma zodiacal territorial **no asigna un signo fijo** a un lugar.

| Prohibido | Permitido |
|-----------|-----------|
| «Barcelona es Acuario» | «Barcelona puede resonar con tonos acuarinos, geminianos y librianos» |
| «Japón es Capricornio» | «Tokio puede llevar resonancia capricornia, virginiana y acuariana» |
| Signo como identidad del territorio | Array ponderado con `reason` editorial |

### 6.2 Schema — `zodiacSignature`

```javascript
zodiacSignature: [
  {
    sign: 'Aquarius',
    weight: 0.4,
    reason: 'innovación, cosmopolitismo, redes sociales'
  },
  {
    sign: 'Gemini',
    weight: 0.35,
    reason: 'movilidad, comunicación, intercambio'
  },
  {
    sign: 'Libra',
    weight: 0.25,
    reason: 'arte, diseño, sociabilidad'
  }
]
```

**Reglas:**

- Suma de `weight` = **1.0** (normalizado).
- Mínimo **2**, máximo **4** signos por territorio.
- Ningún signo con `weight` > **0.5** (evitar dominancia dogmática).
- `reason` en prosa humana · no epíteto turístico.
- En composición: usar como **lente de vocabulario**, no como etiqueta («tu Luna en un territorio con tono acuariano puede…»), nunca «porque Barcelona es Acuario».

### 6.3 Ejemplos conceptuales (no dogma)

**Barcelona** (`type: city`)

```javascript
zodiacSignature: [
  { sign: 'Aquarius', weight: 0.4, reason: 'innovación, cosmopolitismo, redes sociales' },
  { sign: 'Gemini', weight: 0.35, reason: 'movilidad, comunicación, intercambio' },
  { sign: 'Libra', weight: 0.25, reason: 'arte, diseño, sociabilidad' }
]
```

**Tokio** (`type: city`)

```javascript
zodiacSignature: [
  { sign: 'Capricorn', weight: 0.4, reason: 'disciplina, precisión, deber cotidiano' },
  { sign: 'Virgo', weight: 0.35, reason: 'detalle, servicio, cuidado del entorno' },
  { sign: 'Aquarius', weight: 0.25, reason: 'modernidad técnica, urbanismo futuro' }
]
```

**Lisboa** (`type: city`)

```javascript
zodiacSignature: [
  { sign: 'Pisces', weight: 0.4, reason: 'líquido, memoria, melancolía suave' },
  { sign: 'Taurus', weight: 0.35, reason: 'cuerpo, ritmo lento, arraigo sensorial' },
  { sign: 'Cancer', weight: 0.25, reason: 'cuidado, pertenencia, hogar emocional' }
]
```

**Menorca** (`type: island`) — ver § VII

### 6.4 Uso en servicios (futuro)

- **Narrative Intelligence:** `territorialZodiacLens` — elige adjetivos/modales compatibles con signos dominantes; no nombra signos salvo en preview DEV.
- **Premium Composition:** máximo **0 frases** con nombre de signo en producto; en lab, panel opcional.
- **Country Archetype actual:** migrar `symbolicResonance.zodiacHints` → `zodiacSignature` unificado.

---

## VII. Menorca — caso especial de diseño

Menorca ilustra **por qué existe la capa isla** y **cómo evitar sentimentalismo no replicable**.

### 7.1 Identidad territorial (no país)

```javascript
{
  schemaVersion: '3.8h.0-0.1',
  id: 'menorca',
  type: 'island',
  name: 'Menorca',
  nameEn: 'Menorca',
  parentRegion: 'balearic_islands',
  parentCountry: 'spain',

  // NO: type: 'country'
  // NO: tratar como nación independiente
}
```

### 7.2 Textura editorial (conceptual)

Territorio insular de:

- **Ritmo lento** — el tiempo se mide en caminos, mar, estaciones.
- **Cuerpo** — viento, piedra, calor, agua; presencia física antes que espectáculo.
- **Sencillez** — vida reducida, menos capas que la metrópoli.
- **Memoria** — estratos históricos visibles sin museificar el alma.
- **Silencio** — pausa como valor, no como vacío.
- **Naturaleza** — reserva, límite, cuidado del entorno como identidad.
- **Contención** — intimidad geográfica; el horizonte tiene borde.
- **Pertenencia** — comunidad pequeña; ser de la isla vs pasar por ella.

### 7.3 Firma zodiacal insular (hipótesis, no verdad)

```javascript
zodiacSignature: [
  { sign: 'Taurus', weight: 0.35, reason: 'cuerpo, tierra, ritmo pausado, arraigo sensorial' },
  { sign: 'Cancer', weight: 0.35, reason: 'contención, pertenencia, cuidado del entorno íntimo' },
  { sign: 'Pisces', weight: 0.3, reason: 'mar, memoria, silencio, capas invisibles' }
]
```

### 7.4 Criterios replicables (anti-excepción sentimental)

Menorca entra en piloto **no por favoritismo**, sino porque cumple criterios objetivos:

| Criterio | Menorca |
|----------|---------|
| Geografía acotada | Isla definida |
| Identidad distinta del país medio | Sí vs España peninsular |
| Caso de uso reloc real | Residencia / retiro / remoto |
| Riesgo de cliché controlable | Reglas R1–R12 + `avoidCliches` |
| Jerarquía clara | isla → región → país |

**Maó** (`type: city`, `parentIsland: menorca`) aporta capa urbana mínima (puerto, capital insular) **sin** duplicar toda la prosa insular.

### 7.5 Lectura ejemplo (NO dogmática)

**Entrada:** Luna · AC · Menorca · goal descanso

**NO:**

> «Menorca es Tauro. Tu Luna encontrará paz absoluta en esta isla perfecta.»

**SÍ:**

> «Tu Luna busca descanso que no sea solo ausencia de tareas. En Menorca ese descanso puede tomar la forma de ritmo lento, cuerpo al aire y una pertenencia que no exige prisa ni espectáculo — como si el horizonte tuviera un borde que permite soltar.»

---

## VIII. Reglas anti-invención

Heredadas y ampliadas desde `COUNTRY_ARCHETYPE_LAYER.md` § IV.

| # | Regla |
|---|-------|
| R1 | **No convertir territorios en clichés** — evitar postal turística a cualquier escala |
| R2 | **No usar signos como verdades absolutas** — solo `zodiacSignature` ponderada + lenguaje condicional |
| R3 | **No usar estereotipos nacionales ni regionales** — diversidad interna implícita |
| R4 | **No convertir una ciudad en postal** — Barcelona ≠ sólo Sagrada Familia; Tokio ≠ sólo neón |
| R5 | **La firma zodiacal matiza, no decide** — peso ≤5% en composición producto |
| R6 | **La carta natal y la relocación siguen mandando** — Bridge + línea + goal primero |
| R7 | **La astrocartografía manda por encima del arquetipo territorial** — coordenadas > fronteras |
| R8 | **El territorio aporta textura, no diagnóstico** — no «aquí sanarás» ni «aquí fracasarás» |
| R9 | **No duplicar capas** — si isla y región dicen lo mismo, fusionar o suprimir una |
| R10 | **No inventar niveles** — si no hay curación de región, fail-soft; no generar IA sin revisión |
| R11 | **Isla ≠ país** — soberanía y modelo de datos separados |
| R12 | **Voice & Tone gate** — `docs/voice_tone.txt` prevalece |

### Tokens prohibidos (ampliación)

- «destino territorial», «alma de la isla», «energía de la región», «ciudad perfecta para tu signo»
- Signo como identidad («Menorca es Tauro», «Cataluña es…»)
- Estereotipo nacional/regional explícito
- Lenguaje médico o terapéutico sobre el territorio

---

## IX. Relación con Fase 3.8f (Country Archetype)

### 9.1 Qué sigue siendo válido

| Entregable 3.8f | Estado | Relación |
|-----------------|--------|----------|
| `country-archetypes.js` (10 países piloto) | ✅ DEV | Se convierte en subconjunto `type: country` |
| `country-archetype-service.js` | ✅ DEV | Evoluciona a `territorial-archetype-service.js` o wrapper |
| Integración Narrative Intelligence (3.8f.3) | ✅ DEV | `countryContext` → `territorialContext.country` |
| Integración Premium Composition (3.8f.4) | ✅ DEV | Presupuesto líneas ampliable con isla/región |
| `COUNTRY_ARCHETYPE_LAYER.md` | ✅ Doc | Documento padre · no obsoleto |

### 9.2 Qué cambia conceptualmente

- **Country Archetype** pasa a ser **subtipo** de Territorial Archetype (`type: 'country'`).
- Resolución **unificada** por cadena geográfica, no solo `countryId`.
- `zodiacHints` legacy → **`zodiacSignature`** normalizado.
- City Atmosphere puede **integrarse** como `type: 'city'` en catálogo territorial (migración gradual).

### 9.3 Qué no se reescribe de golpe

- Smokes 3.8f siguen válidos mientras país sea el único nivel meso/macro curado.
- 3.8h.x añade niveles **aditivamente**; fail-soft garantiza compatibilidad.

### 9.4 Diagrama de evolución

```
Country Archetype Layer (3.8f)          Territorial Archetype Layer (3.8h)
─────────────────────────────          ───────────────────────────────────
country-archetypes.js          ──────►  territorial-archetypes.js
  └─ type: country (10)                  ├─ type: country (51+)
                                           ├─ type: region
                                           ├─ type: island
                                           └─ type: city (atmosphere merge)

country-archetype-service.js   ──────►  territorial-archetype-service.js
                                           resolveTerritorialChain({ lat, lon, names })
```

---

## X. Modelo de datos propuesto

### 10.1 Entrada territorial unificada

```javascript
{
  schemaVersion: '3.8h.0-0.1',
  id: 'menorca',
  type: 'island',                    // 'city' | 'island' | 'region' | 'country'
  name: 'Menorca',
  nameEn: 'Menorca',

  // Jerarquía (según type)
  parentIsland: null,
  parentRegion: 'balearic_islands',
  parentCountry: 'spain',
  childCities: ['mao', 'ciutadella'],   // opcional

  // Geo (city / island / region centroid)
  lat: 39.9496,
  lon: 4.1106,
  bounds: null,                      // opcional · polígono simplificado futuro

  // Firma zodiacal territorial (§ VI)
  zodiacSignature: [
    { sign: 'Taurus', weight: 0.35, reason: 'cuerpo, tierra, ritmo pausado' },
    { sign: 'Cancer', weight: 0.35, reason: 'contención, pertenencia' },
    { sign: 'Pisces', weight: 0.3, reason: 'mar, memoria, silencio' }
  ],

  // Clima emocional (hereda campos country)
  emotionalClimate: '',
  relationshipTone: '',
  workTone: '',
  restTone: '',

  culturalArchetypes: [],
  shadowPatterns: [],
  opportunities: [],
  cautions: [],
  narrativeImages: [],
  avoidCliches: [],

  goalModifiers: {
    amor: { lens: '', images: [], avoid: [] },
    trabajo: { lens: '', images: [], avoid: [] },
    descanso: { lens: '', images: [], avoid: [] }
  },

  lineModifiers: { /* planeta → tone, questions */ },

  sourceNotes: '',
  curated: true,
  priority: 1                        // 1 = piloto completo · 2 = stub
}
```

### 10.2 Resolución — `resolveTerritorialChain`

```javascript
resolveTerritorialChain({
  lat: 39.8885,
  lon: 4.2614,
  cityName: 'Maó',
  regionName: 'Illes Balears',
  countryName: 'España',
  goal: 'descanso',
  dominantPlanet: 'moon',
  dominantAngle: 'AC'
})
// → {
//   found: true,
//   chain: [
//     { type: 'city', id: 'mao', pickedLines: [...] },
//     { type: 'island', id: 'menorca', pickedLines: [...] },
//     { type: 'region', id: 'balearic_islands', pickedLines: [] },  // skip si vacío
//     { type: 'country', id: 'spain', pickedLines: [...] }
//   ],
//   zodiacSignatureMerged: [...],   // ponderación por nivel · peso decreciente
//   rulesFired: [...]
// }
```

### 10.3 Contexto en Narrative Intelligence (futuro)

```javascript
territorialContext: {
  city: { id, lines, atmosphere },
  island: { id, lines } | null,
  region: { id, lines } | null,
  country: { id, lines },
  zodiacLens: { dominantSigns: [...], weight: 0.05 },
  editorialBudget: { maxLines: 3, maxPerLevel: 1 }
}
```

### 10.4 Archivos futuros (referencia — no implementar en 3.8h.0)

| Archivo | Rol |
|---------|-----|
| `src/content/territorial-archetypes.js` | SSOT multi-nivel |
| `src/content/territorial-index.js` | Alias Nominatim + jerarquía |
| `src/services/territorial-archetype-service.js` | Resolve chain, fail-soft |
| `src/services/country-archetype-service.js` | Deprecar → wrapper fino sobre territorial |

---

## XI. Roadmap sugerido

| Fase | Entrega | Toca código |
|------|---------|-------------|
| **3.8f.5** / **3.8f.6** | Revisión editorial país/ciudad actual | `country-archetypes.js`, voice |
| **3.8g** | Integración UI premium en producto | `app.js`, `index.html` |
| **3.8h.0** | **Este documento** — diseño Territorial Layer | Solo `docs/` |
| **3.8h.1** | Piloto territorial **5 territorios** | `content/`, `dev/` |
| | — Lisboa (`city`) | |
| | — Barcelona (`city`) | |
| | — Tokio (`city`) | |
| | — Toronto (`city`) | |
| | — Menorca (`island`) | |
| **3.8h.2** | `territorial-archetype-service.js` + smoke | `services/`, `scripts/` |
| **3.8h.3** | Integración Narrative Intelligence + Composition | presupuesto 3 líneas · dedup |
| **3.8h.4** | Expansión 51 países + regiones/islas clave | curación progresiva · stubs |

**Orden recomendado:** cerrar 3.8f.5/3.8g según producto · **3.8h.0 doc** (ahora) · 3.8h.1 piloto antes de ampliar a 51.

---

## XII. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| **Sobrecomplicar el sistema** | Alta | Presupuesto líneas, fail-soft, piloto 5 territorios antes de escalar |
| **Repetir capas país/ciudad/isla** | Alta | R9 dedup · jerarquía explícita · smoke «misma metáfora» |
| **Astrología territorial como dogma** | Alta | `zodiacSignature` ponderada · R2 · prohibir «X es Signo» |
| **Menorca como excepción sentimental** | Media | Criterios § VII.4 · replicar con Bali, Sicilia, etc. |
| **Mezclar cultura, geografía y astrología sin pesos** | Alta | Pesos editoriales § V.3 · autoridad clara § V.1 |
| Duplicación catálogos | Media | SSOT `territorial-archetypes.js` |
| Regresión smokes 3.8f | Media | Wrapper compat · tests aditivos |
| Nominatim ambiguo (isla vs ciudad) | Media | Alias table · bounds futuros · fail-soft |
| Sobrecarga narrativa | Media | max 3 líneas territoriales · 1 por nivel |
| Política regional sensible | Alta | R3 · evitar independentismo/como marketing |

---

## XIII. Criterios de éxito (cuando se implemente)

- [ ] Modelo unificado `city | island | region | country` documentado y en SSOT
- [ ] Piloto 5 territorios curados con `zodiacSignature` normalizada
- [ ] Menorca como `type: island` · **no** como país
- [ ] Lectura Luna + Menorca ≠ Luna + España genérico ≠ Luna + Maó (matices distintos)
- [ ] Fail-soft: lugar sin isla/región curada → cae a país o sin matiz
- [ ] Smoke: sin clichés, sin determinismo zodiacal, sin duplicación de capas
- [ ] Country Archetype 3.8f sigue PASS en smokes existentes
- [ ] Composición respeta autoridad: carta + líneas > territorial

---

## XIV. Referencias

| Documento | Relación |
|-----------|----------|
| `COUNTRY_ARCHETYPE_LAYER.md` | Documento padre · 3.8f.1 |
| `KAIROS_CURRENT_CHECKPOINT.md` | Estado actual post-3.8f.4 |
| `docs/voice_tone.txt` | Gate editorial |
| `narrative-intelligence-service.js` | `countryContext` → evolución territorial |
| `city-premium-composition-service.js` | Presupuesto líneas país → territorial |

---

*Documento de diseño · Fase 3.8h.0 · Sin implementación · Sin commit automático*
