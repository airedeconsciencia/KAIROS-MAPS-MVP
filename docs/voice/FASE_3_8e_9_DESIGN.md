# FASE 3.8e.9 — Diseño técnico (DEV)

**Objetivo:** integrar `CITY_ATMOSPHERE_LIBRARY` + `VOICE_LIBRARY` V2 en el pipeline existente sin nuevos datos astrológicos, sin turismo, sin inventar información.

**Prerrequisito:** 3.8e.8 editorial completo (bibliotecas + auditoría).

---

## 1. Archivos a tocar

| Archivo | Cambio |
|---------|--------|
| `src/services/narrative-intelligence-service.js` | Tablas `CITY_ATMOSPHERE` por ciudad+goal; reescritura `humanTheme`, `humanConflict`, `humanObserve`, `humanClosing` con anclaje atmosférico |
| `src/services/city-premium-composition-service.js` | Sustituir `INFLUENCE_TRANSITIONS`; rotar pads; filtrar/reescribir bloques metodológicos; inyectar 1 frase atmosférica por sección |
| `docs/voice/CITY_ATMOSPHERE_LIBRARY.md` | Fuente editorial (ya creada) — no se carga en runtime en 3.8e.9a |
| `docs/voice/VOICE_LIBRARY.md` | Fuente editorial V2 — idem |
| `scripts/dev-narrative-intelligence-smoke.sh` | Aserciones: nombre ciudad en síntesis; sin transiciones prohibidas; atmósfera presente |
| `scripts/dev-city-premium-composition-smoke.sh` | Aserciones: frases intercambiables ≤ umbral; `humanClosing` + atmósfera; lab 3 casos |
| `src/dev/narrative-intelligence-preview.html` | Mostrar `atmosphereKey` / fragmento usado (debug) |
| `src/dev/city-premium-preview.html` | Idem meta editorial |

**NO tocar:** `astro.js`, scorer, Firebase, `app.js`, `premium-blocks.js` (salvo fase posterior de reescritura DOC), motores, `dist`, producto.

---

## 2. Tablas nuevas (deterministas, en narrative-intelligence-service.js)

### 2.1 `CITY_ATMOSPHERE_INDEX`

Clave: `citySlug` (`lisboa` | `toronto` | `ciudad-del-cabo`).

```javascript
{
  lisboa: {
    rhythm: ['...', '...'],           // 3–5 frases de CITY_ATMOSPHERE §1
    emotional: ['...'],               // §2
    bond: ['...'],                    // §3 — amor
    work: ['...'],                    // §4 — trabajo
    rest: ['...'],                    // §5 — descanso
    images: ['...'],                  // §6
    metaphors: ['...'],               // §7
    avoid: ['tranvía', 'fado', ...]   // §8 — lista de tokens prohibidos
  },
  toronto: { ... },
  'ciudad-del-cabo': { ... }
}
```

Selección determinista: `hash32(seed + citySlug + goalId + slot) % array.length`.

### 2.2 `VOICE_TRANSITION_POOL`

Reemplazo de `INFLUENCE_TRANSITIONS` en compositor — 30 frases de VOICE_LIBRARY V2.2, sin *Ahí aparece…*, *Junto a esto…*, *La segunda capa…*.

### 2.3 `VOICE_PAD_POOL` / `VOICE_CLOSE_POOL`

Pools por categoría V2 (apertura, matiz, observación, cierre) — sustituyen `HUMAN_EDITORIAL_PADS` y `HUMAN_TOPUP_VARIANTS`.

### 2.4 `ATMOSPHERE_BY_GOAL_SLOT`

Mapeo goal → campo atmosférico:

| goal | Campo |
|------|-------|
| amor | `bond` |
| trabajo | `work` |
| descanso | `rest` |

Slots de composición:

| Sección | Fuente atmosférica |
|---------|-------------------|
| sintesis | `rhythm` + `emotional` + goal field |
| favorece | goal field + `metaphors[0]` |
| desafia | `emotional` + matiz V2 |
| observar | `images[0]` + V2 observación |
| integracion | `humanClosing` + V2 cierre (ya existe) |

### 2.5 `METHODOLOGY_BLOCK_SUPPRESS`

IDs y frases a filtrar o reescribir con atmósfera (no eliminar datos, solo voz):

- `doc6_objetivo_*` → prefijo atmosférico + extracto sin *Con foco en… conviene…*
- `doc6_integrado_sobre_sombra` / *energía poco integrada* → reescritura V2 contradicción
- Bloques con *conviene moderar expectativas* → V2 matiz

---

## 3. Integración CITY_ATMOSPHERE_LIBRARY

### Flujo

```
deriveNarrativeContext()
  → resolveCitySlug(cityName)
  → pickAtmosphere(citySlug, goalId, slot, seed)
  → weave(humanTheme, atmosphere.rhythm, atmosphere[goalField])
  → narrativeContext.atmosphereFragment (meta debug)
  → narrativeContext.humanTheme / humanObserve / humanClosing (reescritos)
```

### Regla de mezcla (no turismo)

1. **Nunca** insertar landmark, clima turístico ni postal.
2. Solo usar frases de §1–§7 ya curadas en `CITY_ATMOSPHERE_INDEX`.
3. Máximo **1 fragmento atmosférico explícito por sección** — evitar saturación.
4. Nombre de ciudad en prosa natural (ya existe) + 1 imagen atmosférica compatible.
5. Validar contra `avoid[]` — si fragmento contiene token prohibido, saltar al siguiente índice.

### Ejemplo Lisboa · amor

**Antes (genérico):**
> Hay algo en Lisboa que toca el encuentro — no el personaje, sino la persona.

**Después (3.8e.9):**
> En Lisboa, las conversaciones pueden empezar antes que la confianza formal — y el encuentro pide presencia, no personaje.

---

## 4. Cómo evitar turismo

| Guardrail | Implementación |
|-----------|----------------|
| Lista `avoid` por ciudad | Smoke: ningún token de `avoid[]` en lectura |
| Sin sustantivos de postal | Linter editorial en smoke: `tranvía`, `CN Tower`, `Table Mountain`, etc. |
| Atmósfera ≠ geografía | Solo pools §1–§5 y §7; §6 solo imágenes abstractas (luz, pendiente, viento) |
| Una imagen por lectura | Contador `atmosphereImageCount ≤ 3` por lectura completa |
| Revisión humana lab 3 | Lisboa/Toronto/Cabo antes de merge |

---

## 5. Cómo evitar inventar información

| Principio | Implementación |
|-----------|----------------|
| Sin datos nuevos | Atmósfera viene de MD curado → JS estático; no LLM, no generación |
| Sin líneas nuevas | `relevantInfluences`, `premium-blocks`, DOC-17 intactos |
| Sin hechos sobre el usuario | Solo segunda persona genérica + nombre `{nombre}` |
| Bloques existentes | Se **prefijan** o **sustituyen voz**, no contenido astrológico |
| Trazabilidad | `meta.atmosphereFragments[]` + `meta.voiceFragments[]` en composición |
| Determinismo | `hash32(seed + city + goal + slot)` — mismas entradas → misma salida |

---

## 6. Fases internas sugeridas

| Subfase | Alcance |
|---------|---------|
| **3.8e.9a** | `CITY_ATMOSPHERE_INDEX` en narrative + reescritura human* con atmósfera |
| **3.8e.9b** | Sustituir `INFLUENCE_TRANSITIONS` + pads por VOICE V2 pools |
| **3.8e.9c** | Filtro/reescritura voz de bloques metodológicos DOC-5/6 |
| **3.8e.9d** | Smokes + preview meta + revisión lab 3 móvil |

---

## 7. Smokes nuevos (3.8e.9)

- Lab 3: ≥2 frases de `CITY_ATMOSPHERE_INDEX[goalField]` detectables (slice 20 chars)
- Cero ocurrencias: `Ahí aparece una tensión`, `Junto a esto`, `La segunda capa`, `Con foco en`
- Cero tokens de `avoid[]` por ciudad
- Test intercambiabilidad: sustituir `Lisboa`→`Toronto` en humanTheme no debe seguir siendo gramaticalmente idéntico (diferencia mínima de contenido atmosférico)
- 500–900 palabras, determinismo ×2

---

## 8. Riesgos

1. **Duplicación atmósfera + human*** — mitigar con slots exclusivos por sección.
2. **Cities no indexadas** — fallback a `goal` genérico sin atmósfera (comportamiento actual).
3. **Mantenimiento MD → JS** — script de sync opcional `scripts/dev-sync-voice-index.js` (futuro).
4. **Bloques DOC sin reescribir** — 3.8e.9c necesario para eliminar *Con foco en… conviene*.
5. **Longitud** — atmósfera añade palabras; compensar recortando pads redundantes.

---

*Diseño 3.8e.9 — Fase 3.8e.8 DEV · sin implementación de código en 3.8e.8*
