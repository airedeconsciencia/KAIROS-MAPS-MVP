# KAIROS MAPS — Arquitectura Bridge Natal → Mapa

**Fase 3.6a** · Diseño y scaffold documental (sin implementación)  
**Estado:** propuesta arquitectónica  
**Alcance:** conectar significado natal con astrocartografía — **sin UI visible, sin motores, sin deploy**

---

## Resumen ejecutivo

Hoy KAIROS tiene **dos sistemas interpretativos paralelos** que funcionan bien por separado:

| Sistema | Qué hace | Dónde vive |
|---------|----------|------------|
| **Mapa** | 40 líneas AC/DC/MC/IC × 10 planetas; lectura ciudad×línea por objetivo | `astro.js` + `interpretations.js` + `app.js` |
| **Carta Natal Lite** | Composición Sol/Luna/Asc; preview en panel Carta | `natal-lite.js` + `natal-composition-service.js` + `natal-panel.js` |

El **Bridge Natal → Mapa** es la capa que traduce el **patrón vital detectado en la carta** en **prioridades sobre el mapa**, sin recalcular efemérides ni generar texto nuevo en runtime.

**No es** un horóscopo ampliado. **Es** un contrato de relación:

```
SIGNIFICADO NATAL (tags + themes curados)
        ↓
PATRÓN INTERPRETATIVO (compositor ya existente)
        ↓
LÍNEAS DEL MAPA (40 líneas ya calculadas)
        ↓
EXPERIENCIA GEOGRÁFICA (ciudad × línea × objetivo)
```

Ejemplo conceptual (no copy de producto):

- Sol en Géminis → tags: `communication`, `stimulation`, `reflection`
- Línea Mercurio MC → planeta afín semánticamente + ángulo de visibilidad
- Ciudad concreta → plantilla `interpretations.js` + `{ciudad}` + objetivo del perfil

**Entrega 3.6a:** este documento + contrato de datos + roadmap 3.6→3.8.  
**Sin código en runtime.** Sin cambios en producción.

---

## 1. Propósito

### Qué resuelve

1. **Coherencia narrativa** — la carta y el mapa dejan de sentirse como dos apps pegadas.
2. **Priorización inteligente** — qué líneas destacar según el perfil natal lite (FREE) o profundo (PREMIUM).
3. **Puente editorial controlado** — una frase en Carta puede apuntar a líneas concretas sin repetir 40 plantillas.
4. **Base para capas futuras** — relocación, ciudades objetivo, compatibilidad — sin reescribir arquitectura.

### Qué NO resuelve (límites explícitos)

| Fuera de alcance Bridge | Motivo |
|-------------------------|--------|
| Recalcular carta o líneas | Motores congelados; golden 75/75 |
| Generar textos en runtime | Sin IA; sin LLM; sin inventar copy |
| Ranking mágico “mejor ciudad” | Producto premium futuro; requiere Cities Layer |
| Sinastría / pareja | Compatibility Layer (3.8+) |
| UI visible en 3.6a | Solo diseño; implementación incremental |
| Modificar Firebase / hosting | Fase separada |

---

## 2. Responsabilidades por capa

Separación obligatoria — extiende `NATAL_INTERPRETATION_ARCHITECTURE.md` §5:

```
┌─────────────────────────────────────────────────────────────────┐
│  UI (futuro 3.7+)                                               │
│  Resalta líneas · hints · acordeones — NO calcula ni compone    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ BridgeViewModel
┌───────────────────────────────▼─────────────────────────────────┐
│  BRIDGE LAYER (nuevo — Fase 3.6b+)                              │
│  services/natal-map-bridge-service.js (propuesto)               │
│  Input: chart + lines + composition meta                        │
│  Output: NatalMapBridgeContract (JSON puro)                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Composición   │     │ Contenido mapa  │     │ Contenido natal │
│ natal-        │     │ interpretations │     │ natal-lite.js   │
│ composition   │     │ .js             │     │                 │
└───────┬───────┘     └────────┬────────┘     └────────┬────────┘
        │                      │                       │
        └──────────────────────┼───────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  MOTORES (intocables)                                           │
│  chart-service + kairos-core · astro.js computeAllLines         │
└─────────────────────────────────────────────────────────────────┘
```

### Matriz de responsabilidades

| Componente | Responsabilidad | Prohibido |
|------------|-----------------|-----------|
| **Motores** | Números, signos, geometría de líneas | Texto interpretativo |
| **natal-lite.js** | Fragmentos curados + `semanticTags` | Conocer líneas del mapa |
| **interpretations.js** | Copy ciudad×línea×objetivo | Conocer carta natal |
| **natal-composition-service** | Ensamblar lectura lite + meta (tags, bridge) | DOM; lookup de líneas |
| **Bridge service (futuro)** | Mapear tags/themes → line IDs + priority | Escribir prosa; recalcular |
| **UI** | Renderizar prioridades y enlaces | Lógica de afinidad tag↔planeta |

---

## 3. Flujo de datos

### Flujo actual (sin bridge)

```
Usuario → Calcular mapa
              ├─→ astro.js → state.lines[40]
              └─→ chart-service → state.chart.natal
                        └─→ composeNatalLiteReading → preview Carta

Mapa popup: INTERPRETATIONS[planeta_angulo][objetivo]  ← sin carta
Carta:      natal-lite fragments                        ← sin mapa
```

### Flujo objetivo (con bridge)

```
1. chart ready + lines ready
2. compositionResult = composeNatalLiteReading({ sun, moon, asc })
   → meta.fragmentIds, meta.sharedTags, sections[].semanticTags
3. bridgeInput = {
     natalKey,
     tags,
     themes,
     mapLines: state.lines,
     mainGoal: profile.mainGoal
   }
4. bridgeOutput = buildNatalMapBridge(bridgeInput)   // puro, determinista
5. UI (futuro):
   · resaltar lineIds con priority ≥ threshold
   · opcional: 1 hint bajo preview Carta ("Mercurio MC puede resonar con…")
   · popup mapa: sin cambiar plantilla base; opcional badge "afín a tu carta"
```

### Secuencia fail-soft

| Condición | Comportamiento |
|-----------|----------------|
| Carta no ready | Bridge no se invoca; mapa sigue igual |
| Composición `ok: false` | Bridge no se invoca; idle/status actual |
| Líneas vacías | Bridge devuelve `{ ok: false, reason: 'NO_LINES' }` |
| Sin tags en fragmentos | Bridge devuelve líneas por reglas mínimas (planeta regente signo Sol) o vacío |
| Fragmento mapa ausente | Omitir línea en output; no inventar texto |

---

## 4. Contrato de datos inicial (propuesta)

### 4.1 Identidad del perfil natal (`natalKey`)

Clave estable para cache y debug — **no** expuesta al usuario.

```javascript
{
  natalKey: '1973-05-29|07:30|Europe/Madrid|39.8885|4.2658',
  schemaVersion: '0.1.0-bridge-scaffold'
}
```

Derivada de `birthKey` existente en `app.js` / `state.chart.birthKey`.

### 4.2 Entrada Bridge (`NatalMapBridgeInput`)

```javascript
{
  natalKey: string,
  tags: string[],           // unión deduplicada de semanticTags (Sol, Luna, Asc, bridge)
  themes: string[],         // roles editoriales: 'communication' | 'visibility' | …
  mapLines: MapLineRef[],   // subset de state.lines — solo id, planet, angle
  mainGoal: string | null,  // 'amor' | 'trabajo' | 'descanso' | … (perfil)
  compositionMeta: {
    ok: boolean,
    fragmentIds: string[],
    bridgeFrom: 'SUN' | 'MOON' | 'ASC' | null,
    tensionMode: boolean
  }
}
```

```javascript
// MapLineRef — referencia mínima, sin geometría
{
  id: 'MERCURY-mc',      // formato actual astro.js
  planet: 'MERCURY',
  planetKey: 'MERCURIO',
  angle: 'MC'
}
```

### 4.3 Salida Bridge (`NatalMapBridgeOutput`)

```javascript
{
  ok: true,
  natalKey: string,
  schemaVersion: '0.1.0-bridge-scaffold',
  tags: string[],
  themes: string[],
  mapLines: BridgeLineMatch[],
  priority: BridgePrioritySummary,
  meta: {
    rulesApplied: string[],    // trazabilidad editorial
    unmatchedTags: string[],
    generatedAt: string        // ISO — no "predicción"
  }
}
```

```javascript
// BridgeLineMatch — una línea del mapa priorizada
{
  lineId: 'MERCURY-mc',
  planet: 'MERCURY',
  angle: 'MC',
  score: 0.82,                 // 0–1, determinista
  priority: 'high' | 'medium' | 'low',
  matchReasons: [
    { type: 'tag_planet_affinity', tag: 'communication', weight: 0.4 },
    { type: 'bridge_role', role: 'ASC', weight: 0.2 }
  ],
  interpretationKey: 'MERCURIO_MC'  // clave en interpretations.js — NO el texto
}
```

```javascript
// BridgePrioritySummary
{
  topLineIds: ['MERCURY-mc', 'SUN-ac'],
  highCount: 2,
  mediumCount: 5,
  lowCount: 33
}
```

### 4.4 Reglas de mapeo tag → planeta (v0.1 — tabla editorial, no runtime aún)

Propuesta inicial para implementación futura en `content/bridge-rules.js`:

| Tag semántico (natal-lite) | Planetas afines (mapa) | Notas |
|----------------------------|------------------------|-------|
| `communication`, `stimulation`, `reflection` | MERCURY, SUN | Sol Géminis → Mercurio como regente tradicional opcional |
| `emotional_safety`, `intimacy`, `protection` | MOON, VENUS | |
| `movement`, `initiative`, `regulation` | MARS, MOON | |
| `visibility`, `recognition` | SUN, JUPITER | MC boost en scoring |
| `structure`, `discipline` | SATURN | |

**Regla:** la tabla vive en **contenido**, no hardcodeada en UI. Versionada con `schemaVersion`.

---

## 5. Capas futuras (stack 3.6 → 3.8)

```
                    ┌─────────────────────────┐
                    │  Compatibility Layer    │  3.8+
                    │  sinastría · pareja     │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Cities Layer           │  3.7c+
                    │  ciudad × bridge × goal │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Relocation Layer       │  3.7b+
                    │  carta en ciudad X      │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │  Bridge Layer           │  3.6b–3.7a  ← ESTE DOC
                    │  natal tags → line IDs  │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
     Natal Lite (operativo)              Mapa 40 líneas (operativo)
```

### Bridge Layer (3.6b–3.7a)

- **Archivo propuesto:** `src/services/natal-map-bridge-service.js`
- **Contenido propuesto:** `src/content/bridge-rules.js` (tablas tag↔planeta↔ángulo)
- **Dev smoke propuesto:** `scripts/dev-natal-map-bridge-smoke.sh`
- **Entrega UI mínima:** resaltado sutil de 2–3 líneas en mapa; sin popup nuevo

### Relocation Layer (3.7b)

- Recalcular ASC/MC (o carta reloc) para ciudad seleccionada
- **Input:** ciudad + birthData
- **Output:** delta angular + fragmentos reloc (futuro `reloc-lite.js`)
- **Depende de Bridge:** mismos tags, distinto contexto geográfico
- **No mezclar** con bridge v0.1 — paralelo, consume mismo contrato de tags

### Cities Layer (3.7c)

- Cruce: `BridgeLineMatch` × distancia línea–ciudad × `mainGoal`
- Output: lista ordenada de ciudades **sugeridas para explorar** (no “destino garantizado”)
- Copy sigue viniendo de `interpretations.js`; Cities solo **selecciona** combos

### Compatibility Layer (3.8)

- Dos `natalKey` + bridge cruzado
- Sin tocar motores de líneas; capa relacional sobre tags compartidos / tensión

---

## 6. Cómo evitar los cuatro anti-patrones

### 6.1 Horóscopo genérico

| Riesgo | Mitigación Bridge |
|--------|-------------------|
| "Como Géminis, viaja a…" | Bridge **no escribe prosa**; solo IDs y scores |
| Frases aplicables a cualquiera | Tags vienen de **fragmentos concretos** del usuario (Sol/Luna/Asc reales) |
| Exceso de certeza | `matchReasons` trazables; copy sigue en Voz y Tono |
| Predicción geográfica | Cities Layer usa "explorar", "puede resonar" — plantillas ya validadas |

### 6.2 Duplicación de textos

| Riesgo | Mitigación |
|--------|------------|
| Repetir `interpretations.js` en Carta | Bridge devuelve `interpretationKey`, no string |
| Repetir natal-lite en popup mapa | Popup no importa fragmentos natal; solo badge opcional |
| Puente compositor + bridge redundante | Compositor: lectura humana. Bridge: **estructura** para mapa. Roles distintos |
| 40 líneas × 3 objetivos × 3 cuerpos | Una tabla de prioridad; UI muestra top-N |

### 6.3 Contradicciones carta ↔ mapa

| Riesgo | Mitigación |
|--------|------------|
| Carta dice introspección; mapa empuja MC visible | `tensionMode` del compositor eleva peso Luna/IC en bridge |
| Tags Sol vs tags bridge ASC en conflicto | `contradictionPairs` ya calculados en compositor → input bridge |
| Línea alta prioridad incompatible con objetivo | Filtrar por `mainGoal` antes de score final |
| Usuario ve línea destacada sin contexto | Fail-soft: si `compositionMeta.ok !== true`, no destacar |

### 6.4 Dependencia de IA

| Principio | Implementación |
|-----------|----------------|
| Determinismo | Mismos inputs → mismo `BridgeLineMatch[]` |
| Auditabilidad | `matchReasons` + `rulesApplied` en JSON |
| IA solo Fase 5+ | IA **selecciona** entre line IDs ya priorizados; no crea tags |
| Offline-first | Bridge puro JS; sin fetch |
| Golden intacto | Bridge no importa kairos-core ni astro internals |

---

## 7. Scaffold propuesto (archivos — no crear en 3.6a)

Solo referencia para fases siguientes. **Ninguno se implementa en 3.6a.**

| Archivo | Fase | Rol |
|---------|------|-----|
| `docs/architecture/NATAL_MAP_BRIDGE_ARCHITECTURE.md` | 3.6a ✅ | Este documento |
| `src/content/bridge-rules.js` | 3.6b | Tablas tag↔planeta↔ángulo; semver |
| `src/services/natal-map-bridge-service.js` | 3.6b | `buildNatalMapBridge(input)` |
| `scripts/dev-natal-map-bridge-smoke.sh` | 3.6b | Casos Roberto + G1 + tension |
| `src/dev/bridge-preview.html` | 3.6c | Lab DEV: JSON bridge sin UI producto |
| `src/ui/app.js` (hook mínimo) | 3.7a | `state.bridge` + highlight líneas |
| `src/content/city-bridge.js` | 3.7c | Metadatos ciudad×goal (premium-ready) |

### API pública propuesta (stub)

```javascript
window.KairosNatalMapBridge = {
  SCHEMA_VERSION: '0.1.0-bridge-scaffold',
  build(input) { /* NatalMapBridgeOutput */ },
  explain(output) { /* debug: matchReasons legibles */ }
};
```

### Debug propuesto (paridad con Natal Lite)

```javascript
window.KairosNatalMapBridgeDebug = {
  inspect(input) { /* tags, themes, top lines */ },
  stats() { /* cobertura bridge-rules */ }
};
```

---

## 8. Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Bridge empuja mapa a segundo plano | Carta domina UX | Máx. 3 líneas destacadas; mapa sigue protagonista |
| Scoring opaco para usuario | Desconfianza | DEV: `explain()`; PROD: sin scores visibles en v1 |
| Reglas tag↔planeta simplistas | Sensación "horóscopo" | Iterar tabla editorial; piloto Roberto/G1/G2 |
| Acoplar bridge a compositor | Refactors en cascada | Contrato JSON estable; compositor solo aporta meta |
| Tocar motores por atajo | Romper golden | Lint/review: bridge service no importa engines |
| Duplicar 40× interpretaciones | Deuda editorial | Reusar keys `MERCURIO_MC`; cero copy nuevo en bridge |
| Relocación prematura | Scope creep | Relocation Layer explícitamente posterior (3.7b) |
| IA antes de reglas deterministas | No auditable | Bridge v1 completo sin Anthropic |

---

## 9. Roadmap Bridge 3.6 → 3.8

| Fase | Entrega | Visible usuario | Dependencias |
|------|---------|-----------------|--------------|
| **3.6a** ✅ | Este doc + contrato JSON | No | Natal Lite deploy OK |
| **3.6b** | `bridge-rules.js` + `natal-map-bridge-service.js` + smoke Node | No | 3.6a aprobado |
| **3.6c** | `bridge-preview.html` DEV; validar Roberto/G1/G2/G3 tags | No (solo DEV) | 3.6b |
| **3.7a** | Highlight 2–3 líneas en mapa post-cálculo | Sí (sutil) | 3.6c PASS |
| **3.7b** | Relocation Layer scaffold + delta angular | Premium-ready | chart-service |
| **3.7c** | Cities Layer: top ciudades × goal | Premium FREE-teaser | Bridge + Places |
| **3.8** | Compatibility Layer scaffold | Premium | dos perfiles |
| **5.x** | IA elige entre top-N líneas + fragment IDs | Premium | Auth |

### Criterios de done por fase

**3.6b (servicio):**
- [ ] Smoke ≥ 5 perfiles (Roberto, G1, G2, tension, missing tags)
- [ ] Output JSON estable; snapshot en dev
- [ ] Cero imports de `engines/` y `astro.js` internals

**3.7a (UI mínima):**
- [ ] Highlight no bloquea interacción mapa
- [ ] Sin texto nuevo en popup — solo visual
- [ ] Fail-soft si bridge `ok: false`
- [ ] Golden gate 75/75 intacto

---

## 10. Relación con documentos existentes

| Documento | Relación |
|-----------|----------|
| `NATAL_INTERPRETATION_ARCHITECTURE.md` | Capas 0–1; bridge es capa 1.5 |
| `NATAL_LITE_STATUS.md` | Compositor operativo; `semanticTags` alimentan bridge |
| `KAIROS_PRODUCT_ARCHITECTURE.md` | FREE vs PREMIUM; bridge FREE = priorización lite |
| `interpretations.js` | Consumidor downstream vía `interpretationKey` |
| `voice_tone.txt` | Gate para cualquier copy futuro que cite bridge |

---

## 11. Qué gana KAIROS cuando exista el Bridge (lenguaje humano)

Hoy el usuario puede **ver su mapa** y **leer su carta**, pero KAIROS no le dice cómo una cosa ilumina la otra. Es como tener un pasaporte y un mapa del mundo en mesas distintas.

Con el Bridge:

1. **La carta deja de ser un panel aparte** — se convierte en la brújula que orienta qué buscar en el mapa.
2. **El mapa deja de ser 40 líneas equivalentes** — algunas ganan relevancia porque conectan con lo que la carta ya nombró (comunicación, intimidad, visibilidad…).
3. **La experiencia se siente personal sin ser predictiva** — no dice "mudate a Lisboa"; dice "esta línea puede dialogar con un hilo que ya está en tu carta".
4. **KAIROS diferencia su producto** de apps que sueltan textos sueltos o un chatbot genérico: todo pasa por reglas curadas, trazables y revisables.
5. **Se abre la puerta a ciudades, relocación y pareja** sin rehacer la base — el mismo idioma de tags y prioridades conecta módulos futuros.

En una frase: **KAIROS pasa de mostrar astrología en silos a contar una geografía personal coherente** — con los pies en el suelo editorial y sin depender de IA para funcionar.

---

*Fase 3.6a · post-deploy 3.5c2 · Natal Lite free pilot en producción · sin implementación runtime*
