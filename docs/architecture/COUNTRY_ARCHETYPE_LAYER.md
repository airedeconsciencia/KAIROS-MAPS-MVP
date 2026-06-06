# KAIROS MAPS — Country Archetype Layer

**Fase 3.8f.1** · Diseño arquitectónico (sin implementación)  
**Última revisión:** junio 2026  
**Estado:** propuesta · no desplegada · no cableada en producto

> La Luna sigue siendo la Luna. El país no cambia el planeta: **matiza cómo se vive** cuando una línea se expresa en un territorio concreto.

---

## I. Diagnóstico actual

### 1.1 ¿Cuántos países hay ahora?

| Métrica | Valor |
|---------|-------|
| **Ciudades predefinidas (marcadores oro)** | **27** |
| **Países únicos en catálogo curado** | **26** |
| **Países con atmósfera urbana DEV** | **3** (Lisboa, Toronto, Ciudad del Cabo — vía slug de ciudad, no país) |
| **Países con arquetipo nacional** | **0** |
| **Lista formal de 47 / 50 / 51 países** | **No existe en el repo** |

**Nota sobre 47 / 50 / 51:** en `KAIROS-MAPS-MVP` no hay referencia implementada a esas cifras. Aparecen como **objetivo de diseño** de esta fase (catálogo estratégico ampliado), no como estado actual del código.

EE. UU. cuenta como **un país** con **dos ciudades** (Nueva York, Los Ángeles).

### 1.2 ¿Dónde se define la lista actual?

| Artefacto | Qué contiene | Rol |
|-----------|--------------|-----|
| `src/ui/app.js` → `CITIES[]` | 27 ciudades `{ name, country, lat, lon }` | **Fuente canónica de producto** — marcadores oro, sugerencias, scorer input, UI |
| `src/content/city-scorer.js` → `COUNTRY_CODES` | 26 entradas `country → slug` | IDs de ciudad (`lisboa-pt`), fail-soft si país desconocido |
| `scripts/dev-city-scorer-smoke.sh` | Copia espejo de `CITIES` | Tests DEV |
| `scripts/dev-city-premium-composition-smoke.sh` | Subconjunto lab (3 ciudades) | Tests DEV |
| `src/ui/places.js` → Nominatim | Cualquier ciudad del mundo | Búsqueda libre; `country` = último segmento de `display_name` (sin catálogo) |
| `src/services/narrative-intelligence-service.js` → `CITY_ATMOSPHERE_INDEX` | 3 ciudades (lisboa, toronto, ciudad_del_cabo) | Atmósfera urbana DEV — **no es capa país** |
| `src/services/relocation-profile-service.js` | `country` en `targetLocation` | Metadata reloc; sin arquetipo |
| `src/services/reloc-chart-adapter.js` | `country` opcional | Metadata técnica |

**No existe hoy:**

- `countries-catalog.js` / `country-metadata.json`
- Índice ISO unificado (hay slugs ad hoc: `uk`, `us`, `kr`)
- Base geográfica propia más allá del array inline
- Relación país → múltiples ciudades ancla
- Capa editorial por territorio nacional

### 1.3 ¿Qué ciudades dependen de esa lista?

| Consumidor | Dependencia |
|------------|-------------|
| Mapa Leaflet | Marcadores oro desde `CITIES` |
| City scorer | `rankInfluences({ cities: CITIES, ... })` |
| Sugerencias por Goal | Top-N desde scorer sobre `CITIES` |
| Lectura al tocar ciudad | `country` en objeto ciudad → composición / reloc |
| Búsqueda Nominatim | **Independiente** — cualquier lugar válido |
| Smokes DEV | Arrays duplicados en scripts |

Las lecturas premium DEV (3.8e) usan ciudades **pasadas como input**; no leen un catálogo país central.

### 1.4 ¿Se puede ampliar sin romper el mapa?

**Sí**, con disciplina:

1. **Ampliar `CITIES`** es mecánicamente seguro: más marcadores, mismo motor, mismo scorer.
2. **Ampliar países** requiere actualizar `COUNTRY_CODES` en paralelo (o extraer catálogo compartido).
3. **Nominatim** seguirá funcionando para ciudades fuera del catálogo; la capa país debe **fail-soft** (sin arquetipo → lectura sin matiz nacional).
4. **Riesgo principal:** duplicación de listas (`app.js`, smokes, futuro catálogo) → desincronización.
5. **Riesgo editorial:** ampliar países sin arquetipos curados no rompe técnica, pero tampoco aporta valor.

**Recomendación futura:** extraer `src/content/cities-catalog.js` como single source of truth antes de implementar Country Archetype.

### 1.5 Archivos que habría que tocar más adelante

Ver § VII (implementación futura).

---

## II. Lista propuesta — 51 países estratégicos

Criterios aplicados:

- Destinos de **vivir, viajar, emigrar, reubicar**
- Equilibrio regional (no solo turismo)
- Potencial **simbólico y astrocartográfico**
- Coherencia con los **26 países ya presentes** + **25 nuevos**

Cada entrada incluye: `id` (slug), nombre ES, región, ciudad ancla sugerida (para futuro catálogo).

### Europa (21)

| id | País | Región | Ciudad ancla |
|----|------|--------|--------------|
| `spain` | España | Europa occidental | Madrid |
| `portugal` | Portugal | Europa occidental | Lisboa |
| `france` | Francia | Europa occidental | París |
| `united_kingdom` | Reino Unido | Europa occidental | Londres |
| `italy` | Italia | Europa meridional | Roma |
| `germany` | Alemania | Europa central | Berlín |
| `netherlands` | Países Bajos | Europa occidental | Ámsterdam |
| `belgium` | Bélgica | Europa occidental | Bruselas |
| `switzerland` | Suiza | Europa central | Zúrich |
| `austria` | Austria | Europa central | Viena |
| `ireland` | Irlanda | Europa occidental | Dublín |
| `denmark` | Dinamarca | Europa nórdica | Copenhague |
| `sweden` | Suecia | Europa nórdica | Estocolmo |
| `norway` | Noruega | Europa nórdica | Oslo |
| `finland` | Finlandia | Europa nórdica | Helsinki |
| `greece` | Grecia | Europa meridional | Atenas |
| `turkey` | Turquía | Europa / Oriente Medio | Estambul |
| `poland` | Polonia | Europa central-oriental | Varsovia |
| `czech_republic` | República Checa | Europa central | Praga |
| `croatia` | Croacia | Europa meridional | Zagreb |
| `hungary` | Hungría | Europa central | Budapest |

### América (12)

| id | País | Región | Ciudad ancla |
|----|------|--------|--------------|
| `united_states` | EE. UU. | América del Norte | Nueva York |
| `canada` | Canadá | América del Norte | Toronto |
| `mexico` | México | América del Norte | Ciudad de México |
| `argentina` | Argentina | América del Sur | Buenos Aires |
| `brazil` | Brasil | América del Sur | Río de Janeiro |
| `chile` | Chile | América del Sur | Santiago |
| `colombia` | Colombia | América del Sur | Bogotá |
| `peru` | Perú | América del Sur | Lima |
| `uruguay` | Uruguay | América del Sur | Montevideo |
| `costa_rica` | Costa Rica | América central | San José |
| `panama` | Panamá | América central | Ciudad de Panamá |
| `ecuador` | Ecuador | América del Sur | Quito |

### Asia y Pacífico (11)

| id | País | Región | Ciudad ancla |
|----|------|--------|--------------|
| `japan` | Japón | Asia oriental | Tokio |
| `south_korea` | Corea del Sur | Asia oriental | Seúl |
| `taiwan` | Taiwán | Asia oriental | Taipéi |
| `china` | China | Asia oriental | Shanghái |
| `thailand` | Tailandia | Sudeste asiático | Bangkok |
| `vietnam` | Vietnam | Sudeste asiático | Ciudad Ho Chi Minh |
| `singapore` | Singapur | Sudeste asiático | Singapur |
| `malaysia` | Malasia | Sudeste asiático | Kuala Lumpur |
| `indonesia` | Indonesia | Sudeste asiático | Bali / Denpasar |
| `philippines` | Filipinas | Sudeste asiático | Manila |
| `india` | India | Asia meridional | Delhi |

### África y Oriente Medio (5)

| id | País | Región | Ciudad ancla |
|----|------|--------|--------------|
| `south_africa` | Sudáfrica | África austral | Ciudad del Cabo |
| `morocco` | Marruecos | África noroccidental | Casablanca |
| `egypt` | Egipto | África nororiental | El Cairo |
| `kenya` | Kenia | África oriental | Nairobi |
| `united_arab_emirates` | Emiratos Árabes Unidos | Oriente Medio | Dubái |

### Oceanía (2)

| id | País | Región | Ciudad ancla |
|----|------|--------|--------------|
| `australia` | Australia | Oceanía | Sídney |
| `new_zealand` | Nueva Zelanda | Oceanía | Auckland |

**Total: 51 países**

### Países nuevos respecto al catálogo actual (25)

Bélgica, Suiza, Austria, Irlanda, Dinamarca, Noruega, Finlandia, Polonia, República Checa, Croacia, Hungría, Chile, Colombia, Uruguay, Costa Rica, Panamá, Ecuador, Taiwán, China, Vietnam, Malasia, Indonesia, Filipinas, Marruecos, Emiratos Árabes Unidos.

---

## III. Modelo de datos — Country Archetype

### 3.1 Schema propuesto

```javascript
{
  schemaVersion: '3.8f.1-0.1',
  id: 'portugal',                    // slug estable
  isoHint: 'pt',                     // alineado con COUNTRY_CODES (no ISO estricto)
  name: 'Portugal',
  nameEn: 'Portugal',                // opcional · resolución Nominatim
  region: 'Europa occidental',
  subregion: 'Península ibérica',

  // Resonancias — SIEMPRE como hipótesis, nunca verdad astrológica
  symbolicResonance: {
    zodiacHints: [],                 // ej. [{ sign: 'pisces', weight: 0.3, note: 'tono líquido, no determinismo' }]
    planetaryAffinities: [],         // ej. [{ planet: 'moon', tone: 'arraigo lento', weight: 0.4 }]
    elementalTone: []                // ej. ['agua', 'tierra'] — atmósfera, no elemento natal del país
  },

  // Clima cultural-emocional (prosa curada, no estereotipo)
  emotionalClimate: '',              // 1–2 frases · atmósfera colectiva
  relationshipTone: '',              // cómo puede vivirse el vínculo
  workTone: '',                      // ritmo / visibilidad / sentido laboral
  restTone: '',                      // pausa, cuerpo, permiso

  culturalArchetypes: [],            // 3–6 imágenes prudentes · no caricatura
  shadowPatterns: [],                // 2–4 tensiones posibles (sin juicio)
  opportunities: [],                 // 2–4 aperturas simbólicas
  cautions: [],                      // 2–4 cautelas (sin alarmismo)

  narrativeImages: [],               // escenas humanas · estilo VOICE_LIBRARY
  avoidCliches: [],                  // tokens prohibidos (como CITY_ATMOSPHERE avoid)

  goalModifiers: {
    amor: { lens: '', images: [], avoid: [] },
    trabajo: { lens: '', images: [], avoid: [] },
    descanso: { lens: '', images: [], avoid: [] }
  },

  lineModifiers: {
    moon: { tone: '', questions: [] },
    venus: { tone: '', questions: [] },
    saturn: { tone: '', questions: [] },
    sun: { tone: '', questions: [] },
    mars: { tone: '', questions: [] },
    mercury: { tone: '', questions: [] },
    jupiter: { tone: '', questions: [] },
    neptune: { tone: '', questions: [] },
    pluto: { tone: '', questions: [] },
    uranus: { tone: '', questions: [] }
  },

  sourceNotes: '',                   // grounding editorial · sin afirmaciones dogmáticas
  curated: true,                     // false = fail-soft placeholder
  priority: 1                        // 1 = piloto completo · 2 = stub prudente
}
```

### 3.2 Principios del modelo

| Principio | Regla |
|-----------|-------|
| **Matiz, no sustitución** | El arquetipo país modula; la carta natal y la línea siguen siendo primarias |
| **Hipótesis simbólica** | Toda resonancia zodiacal/planetaria lleva `weight` bajo y lenguaje condicional |
| **Goal-aware** | Modificadores por `amor` / `trabajo` / `descanso` |
| **Line-aware** | Modificadores por planeta dominante (Luna, Venus, Saturno prioritarios en piloto) |
| **Fail-soft** | País sin entrada → composición actual sin cambio |
| **Separación ciudad / país** | `CITY_ATMOSPHERE` = micro (barrio, ritmo urbano) · `COUNTRY_ARCHETYPE` = macro (clima cultural) |

### 3.3 Ejemplo conceptual (no dogmático)

**Entrada:** Luna · AC · Portugal · Lisboa · goal amor · carta natal del usuario

**NO:**

> «La Luna en Portugal es hogar y familia.»

**SÍ:**

> «Tu Luna busca pertenencia. En Portugal esa búsqueda puede expresarse con calma, vínculos que maduran en lo cotidiano y una forma de presencia que no siempre pide prisa ni demostración. Lisboa añade su propio ritmo: conversaciones que empiezan antes que la confianza formal.»

---

## IV. Reglas anti-invención

Estas reglas son **obligatorias** en curación, composición y smoke.

| # | Regla |
|---|-------|
| R1 | **No convertir países en estereotipos** — evitar «los X son así» |
| R2 | **No usar clichés turísticos** — prohibido reducir un país a postal (fado, samba, sushi, etc.) |
| R3 | **No hacer determinismo nacional** — el país no decide el destino |
| R4 | **No usar juicios políticos** — ni glorificación ni condena de sistemas, conflictos o gobiernos |
| R5 | **No convertir cultura en caricatura** — diversidad interna implícita; hablar de tendencias, no de esencia |
| R6 | **No afirmar correspondencias zodiacales como verdades** — solo «resonancia simbólica», «tono arquetípico», «afinidad energética» |
| R7 | **Toda correspondencia es hipótesis** — modales: «puede», «quizá», «a veces», «en este contexto» |
| R8 | **El país matiza, no sustituye la carta natal** — Bridge + línea + goal > arquetipo país |
| R9 | **Ciudad y país no compiten** — atmósfera urbana + arquetipo nacional se combinan con presupuesto de líneas |
| R10 | **Sin datos astrológicos inventados** — el arquetipo no altera efemérides, ángulos ni scores |
| R11 | **Voice & Tone gate** — `docs/voice_tone.txt` prevalece sobre creatividad del arquetipo |
| R12 | **Curación humana antes que generación** — piloto manual; IA solo selección de fragmentos ID (futuro) |

### Tokens prohibidos (ampliar por país en `avoidCliches`)

- «destino», «alma del país», «energía nacional», «país perfecto»
- Signo zodiacal como identidad nacional («Portugal es Piscis»)
- Rankings («el mejor país para…»)
- Lenguaje migratorio sensacionalista («paraíso fiscal del alma»)

---

## V. Integración futura

### 5.1 Pipeline propuesto

```
                    ┌─────────────────────┐
                    │  cities-catalog     │
                    │  (ciudad + país)    │
                    └──────────┬──────────┘
                               │
┌──────────────┐    ┌──────────▼──────────┐    ┌─────────────────────┐
│ Goal Signal  │───►│ Country Archetype   │◄───│ country-archetypes  │
│ amor/trabajo │    │ Service (resolve)   │    │ .js (curado)        │
└──────────────┘    └──────────┬──────────┘    └─────────────────────┘
                               │
┌──────────────┐    ┌──────────▼──────────┐    ┌─────────────────────┐
│ City Scorer  │───►│ Narrative           │───►│ Premium Composition │
│ (opcional    │    │ Intelligence        │    │ (human presence)    │
│  modifier)   │    │ + countryContext    │    │                     │
└──────────────┘    └──────────┬──────────┘    └─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Relocation Profile  │
                    │ (country lens)      │
                    └─────────────────────┘
```

### 5.2 Por capa existente

| Capa | Integración | Prioridad |
|------|-------------|-----------|
| **City scorer** | Modifier opcional ±5–10% en `relevanceScore` si línea-planeta alinea con `lineModifiers[planet]` del país — **nunca decisivo solo** | Fase 3.8f.3 |
| **Narrative Intelligence** | `deriveCountryContext(countryId, goal, dominantPlanet)` → `countryTheme`, `countryObserve`, `countryCaution` | Fase 3.8f.2 |
| **Premium Composition** | Presupuesto: máx. **2 líneas** país por lectura; después de atmósfera ciudad | Fase 3.8f.3 |
| **Relocation Profile** | `countryArchetype` en metadata; párrafo «cómo el territorio matiza la carta relocada» | Fase 3.8f.4 |
| **City Atmosphere** | Complementario: ciudad = micro, país = macro; no duplicar imágenes | Fase 3.8f.3 |
| **Luna / Venus / Saturno** | Piloto editorial en 10 países × 3 planetas × 3 goals | Fase 3.8f.2 piloto |

### 5.3 Fórmula conceptual de lectura

```
Lectura = f(
  carta natal (Bridge),
  línea dominante (planeta × ángulo),
  goal (amor | trabajo | descanso),
  país (arquetipo macro),
  ciudad (atmósfera micro),
  reloc (si aplica)
)
```

**Peso editorial sugerido (no numérico rígido en piloto):**

1. Carta + línea + goal — **60%**
2. Ciudad (atmósfera) — **25%**
3. País (arquetipo) — **15%**

### 5.4 Resolución de país

```javascript
resolveCountryArchetype({
  country: 'Portugal',           // desde ciudad o Nominatim
  countryId: 'portugal',         // opcional si ya resuelto
  goal: 'amor',
  dominantPlanet: 'moon',
  dominantAngle: 'AC'
})
// → { found: true, archetype, pickedLines: [...], rulesFired: [...] }
```

**Alias de resolución:** mapear strings ES/EN de `COUNTRY_CODES` + normalización Nominatim → `id` canónico.

---

## VI. Riesgos

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Estereotipo nacional | **Alta** | Reglas R1–R5, `avoidCliches`, revisión manual, smoke editorial |
| Determinismo zodiacal país | **Alta** | R6–R7, prohibir frases «X es Signo» |
| Duplicación de catálogos | Media | `cities-catalog.js` + `country-archetypes.js` como SSOT |
| Desincronización `app.js` / scorer / smokes | Media | Unificar en Fase 3.8f.0 (catalog extract) |
| Sobrecarga narrativa | Media | Presupuesto 2 líneas país; no apilar con ciudad |
| Nominatim país ambiguo | Media | Fail-soft; alias table; no forzar arquetipo |
| Confusión ciudad vs país | Media | Naming claro en meta: `cityAtmosphere` vs `countryArchetype` |
| Ampliar a 51 sin curar | Media | `priority: 2` stubs; solo 10–15 países piloto completos |
| Tensión política/cultural | Alta | R4, evitar países en conflicto como «buenos/malos» |
| Romper mapa al ampliar ciudades | Baja | Cambio aditivo; golden gate |

---

## VII. Fases recomendadas

| Fase | Entrega | Toca código |
|------|---------|-------------|
| **3.8f.1** | Este documento | Solo `docs/` |
| **3.8f.0** | Extraer `cities-catalog.js` desde `CITIES` + unificar `COUNTRY_CODES` | `content/`, `app.js` import mínimo |
| **3.8f.2** | `country-archetypes.js` piloto (10 países) + `country-archetype-service.js` + smoke | `content/`, `services/`, `scripts/`, `dev/` |
| **3.8f.3** | Integración Narrative Intelligence + Composition (presupuesto líneas) | `narrative-intelligence-service.js`, `city-premium-composition-service.js` |
| **3.8f.4** | Relocation country lens + ampliación a 51 (stubs + curación progresiva) | `relocation-profile-service.js`, contenido |
| **3.8f.5** | City scorer modifier opcional + UI producto (si aprobado) | `city-scorer.js`, `app.js` |

---

## VIII. Archivos — implementación futura

### Tocar

| Archivo | Motivo |
|---------|--------|
| `src/content/country-archetypes.js` | **Nuevo** — índice curado 51 países |
| `src/content/cities-catalog.js` | **Nuevo** — SSOT ciudades + país |
| `src/services/country-archetype-service.js` | **Nuevo** — resolve, pick lines, fail-soft |
| `src/services/narrative-intelligence-service.js` | `countryContext` en spine |
| `src/services/city-premium-composition-service.js` | Presupuesto y mezcla país |
| `src/content/city-scorer.js` | Unificar `COUNTRY_CODES`; modifier opcional |
| `src/services/relocation-profile-service.js` | Lens país en reloc |
| `scripts/dev-country-archetype-smoke.sh` | **Nuevo** |
| `src/dev/country-archetype-preview.html` | **Nuevo** lab |
| `scripts/dev-*-smoke.sh` | Importar catálogo unificado |
| `src/index.html` | Solo `<script>` si nuevo servicio en producto (fase posterior) |

### NO tocar (salvo aprobación explícita)

| Archivo / capa | Motivo |
|----------------|--------|
| `src/engines/astro.js` | Motor congelado |
| `src/engines/kairos-core/*` | WASM congelado |
| `src/content/interpretations.js` | 40 textos mapa congelados |
| `firebase.json`, `.firebaserc`, `dist/` | Deploy / staging |
| `src/ui/app.js` | **Fase 3.8f.1** — solo extracción catálogo en 3.8f.0 con cambio mínimo |
| Paywall / Firebase / scorer core math | Fuera de alcance arquetipo |

---

## IX. Relación con capas existentes

| Capa actual | Relación con Country Archetype |
|-------------|-------------------------------|
| Goals Layer | Goal elige qué `goalModifiers` aplicar |
| Cities Layer | Ciudad aporta coordenadas + país id |
| City Atmosphere (3.8e.9a) | Hermana micro; no reemplazar |
| Human Presence (3.8e.9d) | País usa misma voz experiencial (tú, no informe) |
| Premium Knowledge | Nuevos slots T-country opcionales en piloto |
| Narrative Intelligence | `countryContext` paralelo a `cityAtmosphere` |
| Relocation DEV | Territorio como modificador de presencia, no nueva carta |

---

## X. Criterios de éxito (cuando se implemente)

- [ ] 51 países en índice (`id` + metadata mínima)
- [ ] ≥10 países con arquetipo **curado completo** (piloto)
- [ ] Fail-soft verificado (país desconocido, ciudad Nominatim rara)
- [ ] Smoke: sin clichés, sin determinismo, sin «El tema» / «Nota X»
- [ ] Lectura lab: Luna + Portugal + Lisboa + amor suena distinta a Luna + Japón + Tokio + amor
- [ ] Mapa y scorer sin regresión (golden gate PASS)
- [ ] Staging deploy opcional tras integración producto

---

*Documento de diseño · Fase 3.8f.1 · Sin implementación · Sin commit automático*
