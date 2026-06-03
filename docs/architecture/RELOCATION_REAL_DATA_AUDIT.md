# KAIROS MAPS — Relocation Real Data Audit (Fase 3.7b.5)

**Estado:** auditoría técnica · **sin implementación**  
**Fecha:** 2026-05-26  
**Alcance:** determinar vía fiable para AC/DC/MC/IC relocados reales · sin motores nuevos · sin UI producto

---

## Resumen ejecutivo

**Sí existe una vía fiable en el proyecto** para calcular los cuatro ángulos relocados (y casas Placidus) para cualquier ciudad, **sin crear motor paralelo**:

> Reutilizar `KairosChartService.generateNatalChart()` / `generateFullChart()` con **la misma fecha, hora y zona horaria de nacimiento**, sustituyendo solo **`lat` / `lon` por las coordenadas de la ciudad destino**.

Eso es exactamente el modelo editorial de relocación (mismo instante UTC, nuevo lugar geográfico) descrito en `RELOCATION_EDITORIAL_BRIEF.md` y coherente con `getHousesAndAngles()` en `planetary_engine.js` (Swiss Ephemeris `swe_houses`).

**No está implementado** en el pipeline Relocation DEV actual:

- `relocation-profile-service.js` sigue recibiendo `relocatedAngles` **mock** desde el lab.
- `getRelocatedAngles()` del `ASTRO_ENGINE_SPEC.md` **no existe** en `src/` (spec legacy; dependía de `ascendant_engine.js`, ausente del repo Maps).

**Recomendación MVP:** una capa fina de adaptación (p. ej. `reloc-chart-adapter.js` o extensión mínima de `chart-service`) que:

1. Calcule carta relocada vía motor existente.
2. Mapee `chart.angles` → shape `relocatedAngles` (`AC`/`MC`/`IC`/`DC` + slugs inglés).
3. Alimente `buildRelocationProfile()` sin tocar Bridge ni compositor.

---

## 1. Funciones existentes (inventario)

### 1.1 Pipeline natal real (operativo en Maps)

| Función / API | Ubicación | Qué calcula | ¿Sirve para reloc? |
|---------------|-----------|-------------|-------------------|
| `KairosChartService.generateNatalChart(birthData)` | `src/services/chart-service.js` | Carta completa vía WASM | **Sí** — pasar `lat/lon` de ciudad destino |
| `generateFullChart(date, time, lat, lon, timezone)` | `src/engines/kairos-core/chart_engine.js` | Planetas + casas + ángulos AC/MC/DC/IC | **Sí** — núcleo reloc |
| `getPlanetaryPositions(...)` | `src/engines/kairos-core/planetary_engine.js` | Longitudes eclípticas (jdUt) | **Parcial** — posiciones no dependen de lat/lon (geocéntrico) |
| `getHousesAndAngles(...)` | `id. | ASC + MC + 12 cúspides Placidus | **Sí** — **motor de ángulos relocados** |
| `swe.houses(jdUt, lat, lon, 'P')` | `swisseph_wrapper.js` | Casas Swiss Ephemeris | **Sí** — bajo capa anterior |
| `initPlanetaryEngine` / `initKairosCore` | bootstrap + loader | Carga WASM lazy | **Sí** — prerequisito |
| `KairosNatalLite.signSlug(signName)` | `src/content/natal-lite.js` | `Géminis` → `gemini` | **Sí** — adaptador signos ES→slug |

### 1.2 Astrocartografía (mapa — no es reloc de carta)

| Función / API | Ubicación | Qué calcula | ¿Sirve para reloc? |
|---------------|-----------|-------------|-------------------|
| `getAstroLines()` / líneas en `astro.js` | `src/engines/astro.js` | Curvas MC/IC/AC/DC planetarias sobre el globo (Astronomy-engine) | **No** — geometría de **líneas**, no ángulos de carta en una ciudad |
| `getLinesNearCity` (si existe) | `astro.js` | Proximidad ciudad↔línea | **No** — scoring mapa, no AC/MC relocado |

### 1.3 Documentado pero NO presente en `src/`

| Función | Fuente | Estado en repo |
|---------|--------|----------------|
| `getRelocatedAngles(birthData, cityLat, cityLng, cityTimezone?)` | `docs/product/ASTRO_ENGINE_SPEC.md` § astrocarto_engine | **No implementado** en `src/engines/astro.js` |
| `window.getAscendant(...)` | Spec → `ascendant_engine.js` | **Archivo no copiado** a Maps MVP (`docs/phase-2.1a-integration.md` §5: reservado, no en 2.1a) |
| `astrocarto_engine.js` | Spec v1 | **No existe** en `src/` |

### 1.4 Relocation DEV (adapter editorial — sin cálculo)

| Función | Ubicación | Rol |
|---------|-----------|-----|
| `KairosRelocationProfile.buildRelocationProfile(input)` | `relocation-profile-service.js` | Consume `relocatedAngles` ya resueltos; deriva tags/themes/fragmentIds |
| `KairosRelocLite.getFragment` / `findFragment` | `reloc-lite.js` | Matriz 16/16 por elemento de ángulo |
| `KairosRelocComposition.composeRelocationReading` | `reloc-composition-service.js` | Lectura breve desde fragmentos |
| `KairosNatalMapBridge.buildBridge` | `natal-map-bridge-service.js` | Prioriza líneas del mapa (independiente del origen de tags) |

---

## 2. Qué sirve para relocación · qué falta

### 2.1 Sirve hoy (reutilizable)

1. **`generateFullChart` con coordenadas de ciudad**  
   - Misma `date`, `time`, `timezone` (natal).  
   - `latitude` / `longitude` = ciudad destino.  
   - Salida: `angles.ASC`, `angles.MC`, `angles.DC`, `angles.IC` + `houses[]`.

2. **`chart-service`** como fachada (init WASM, cache, validación Luxon).

3. **`relocation-profile-service`** como adapter editorial (sin cambios de contrato Bridge).

4. **`signSlug`** de `natal-lite.js` (o extracción compartida) para convertir signos españoles del motor a slugs `gemini`, `capricorn`, etc.

### 2.2 Falta (gap real)

| Gap | Descripción | Severidad |
|-----|-------------|-----------|
| **G1 — Adapter reloc → profile** | Ningún módulo llama al motor con lat/lon destino y rellena `relocatedAngles` | Bloqueante implementación |
| **G2 — Mapeo ASC↔AC** | Motor expone `angles.ASC`; profile espera `relocatedAngles.AC` | Bajo (mapeo 4 líneas) |
| **G3 — Signos ES → slug EN** | Motor devuelve `sign: "Géminis"`; `ELEMENT_BY_SLUG` usa `gemini` | Medio (reutilizar `signSlug`) |
| **G4 — Natal base para delta** | Profile necesita ángulos natal reales o slugs `sun/moon/asc` para `relocDelta` | Medio (segunda llamada chart con lat/lon nacimiento, o perfil persistido) |
| **G5 — API explícita reloc** | No hay `generateRelocatedChart(birth, city)` en chart-service | Bajo (conveniencia, no motor) |
| **G6 — `getRelocatedAngles` spec** | Atajo documentado con GAST + getAscendant no portado | **No necesario** si se usa G1 |
| **G7 — Golden reloc** | Golden 75/75 es natal en lugar de nacimiento; sin casos Lisboa/Toronto | Medio (validación post-impl.) |
| **G8 — Casas relocadas opcionales** | `relocatedHouses` aceptado pero vacío en mocks | Opcional fase posterior |

### 2.3 Qué NO hace falta inventar

- Motor Swiss Ephemeris nuevo.  
- `ascendant_engine.js` / `astrocarto_engine.js` duplicados.  
- Cambios en `astro.js` (mapa global intacto).  
- Cambios en `planetary_engine.js` / `chart_engine.js` (congelados salvo bugfix acordado).

---

## 3. Precisión y riesgos al reutilizar

### 3.1 Precisión esperada

| Componente | Motor | Precisión |
|------------|-------|-----------|
| Instantáneo UTC | Luxon IANA → `swe.utc_to_jd` | Misma que natal golden (DST incluido en casos golden) |
| ASC / MC | `swe.houses` Placidus | Estándar profesional Swiss Ephemeris |
| DC / IC | `(ASC+180)`, `(MC+180)` en `chart_engine.js` | Convención estándar |
| Planetas en reloc | Mismas longitudes que natal (mismo jdUt) | Correcto para reloc clásica |
| Casas 2–12 | Cúspides Placidus en lat/lon ciudad | Coherentes con ángulos |

**Tolerancia de referencia:** reutilizar umbrales golden existentes (`anglesDeg` típ. ±0.1°–0.5° según `golden-compare.js`) para casos Roberto×Lisboa una vez definidos en referencia.

### 3.2 Riesgos de reutilización

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Confundir TZ ciudad con TZ nacimiento** | Ángulos incorrectos | Siempre `timezone` = IANA **lugar de nacimiento**; ciudad solo aporta lat/lon |
| **Usar hora local de ciudad** | Rompe modelo UTC natal | Prohibido en adapter; documentar en contrato |
| **Cache chart-service** | Clave `date\|time\|tz\|lat\|lon` mezcla natal y reloc si misma fecha distinta coords | OK: claves distintas; o `skipCache` en reloc |
| **Cold start WASM** | Primera reloc lenta en lab | Mismo patrón que panel natal; acceptable DEV |
| **Signos españoles sin slug** | `fragmentIds` vacíos, fail-soft reloc-lite | Obligatorio `signSlug` antes de profile |
| **Claves AC vs ASC** | Perfil no encuentra ángulo | Mapper explícito en adapter |
| **Natal mock incompleto** | `relocDelta` débil si solo `sun/moon/asc` sin ángulos natal | Segunda `generateNatalChart` con coords nacimiento |
| **Tocar motores congelados** | Regresión golden 75/75 | Adapter fuera de `kairos-core/` |
| **Spec `getRelocatedAngles` obsoleto** | Implementar vía astronomy paralela | **No implementar**; usar chart-service |

---

## 4. Relocation MVP Path (ruta técnica mínima)

```
┌─────────────────────────────────────────────────────────────────┐
│ Perfil usuario (local / onboarding)                            │
│   birthData: { date, time, timezone, lat, lon }  ← lugar nac.   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Ciudad destino (Cities / Places / manual)                        │
│   targetLocation: { name, country, lat, lon, cityId }          │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│ [A] Natal reference │               │ [B] Relocated chart │
│ chart-service       │               │ chart-service       │
│ lat/lon NACIMIENTO  │               │ lat/lon CIUDAD      │
│ (misma date/time/tz)│               │ (misma date/time/tz)│
└──────────┬──────────┘               └──────────┬──────────┘
           │                                     │
           │ angles + planets                    │ angles + houses
           └──────────────┬──────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ reloc-chart-adapter (NUEVO — capa fina, sin motor)              │
│   • signSlug(angles.*.sign)                                     │
│   • map ASC→AC, MC, DC, IC                                      │
│   • opcional: natalChart slugs desde planets/angles [A]         │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ relocation-profile-service.js (EXISTENTE)                      │
│   buildRelocationProfile({ natalChart, targetLocation,          │
│     relocatedAngles, relocatedHouses?, goalContext })            │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ reloc-lite.js → fragmentIds (EXISTENTE)                        │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ reloc-composition-service.js (EXISTENTE)                       │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ natal-map-bridge-service.js (EXISTENTE — sin cambios)            │
│   buildBridge({ tags, themes, tensionMode, mapLines, goal })   │
└─────────────────────────────────────────────────────────────────┘
```

### Módulos que participan (implementación futura)

| Orden | Módulo | Rol | ¿Tocar motor? |
|-------|--------|-----|---------------|
| 1 | `chart-service.js` | Orquestación WASM + cache | No (solo API opcional) |
| 2 | `chart_engine.js` / `planetary_engine.js` | Cálculo real | **No** |
| 3 | **`reloc-chart-adapter`** (propuesto) | birth+city → `relocatedAngles` | No |
| 4 | `relocation-profile-service.js` | Profile + bridgeProfile | Mínimo (entrada real) |
| 5 | `reloc-lite.js` | Fragmentos | No |
| 6 | `reloc-composition-service.js` | Lectura | No |
| 7 | `natal-map-bridge-service.js` | Priorización mapa | No |
| 8 | `astro.js` | Líneas mapa (paralelo) | **No** |

**Fuera de scope MVP:** UI producto, Premium, casas en UI, planetas relocados en panel, `getRelocatedAngles` legacy.

---

## 5. Compatibilidad Bridge

### Veredicto: **Sí** — sin cambios en `natal-map-bridge-service.js`

**Justificación:**

1. `buildBridge()` solo exige:
   - `tags: string[]`
   - `themes: string[]`
   - `tensionMode: boolean`
   - `mapLines[]`
   - `goalContext?` (opcional, goal-aware desde 3.7c)

2. `relocation-profile-service` ya emite `bridgeProfile` con exactamente ese shape:

```javascript
bridgeProfile: {
  schemaVersion, tags, themes, tensionMode,
  contradictionPairs, dominantRoles, sourceFragmentIds
}
```

3. El lab `relocation-preview.html` ya demuestra `Bridge.buildBridge(bridgeProfile reloc)` → `ok: true` con mocks.

4. Sustituir mocks por ángulos reales **no altera** el contrato si:
   - Los slugs de signo siguen siendo válidos (`ELEMENT_BY_SLUG`, `SIGN_TAGS`).
   - `tags`/`themes` siguen derivándose de la misma lógica (solo cambian valores, no estructura).

**Condición:** el adapter debe producir `relocatedAngles` con `slug` inglés coherente. Si el cálculo falla, el profile ya hace fail-soft (`ok: false`) y Bridge no se invoca — comportamiento deseado.

**No requiere** `profileType` en Bridge (Bridge es agnóstico; documentado en `RELOCATION_SCAFFOLD_ARCHITECTURE.md` §8).

---

## 6. Smokes — ampliación futura (solo documentación)

No crear ni modificar smokes en 3.7b.5. Cuando existan datos reales:

| Smoke | Ampliación propuesta |
|-------|---------------------|
| `dev-relocation-profile-smoke.sh` | Caso con ángulos desde adapter+chart (no mock); comparar `profileKey` y `fragmentIds` deterministas para Lisboa |
| `dev-reloc-composition-smoke.sh` | Lectura con fragmentos derivados de ángulos **reales**; mantener 4 roles + rango chars |
| `dev-reloc-lite-smoke.sh` | Sin cambio (content-only) |
| **Nuevo** `dev-relocation-real-data-smoke.sh` | Roberto×Lisboa: ASC/MC/IC/DC vs referencia ±0.5°; integración profile ok:true |
| `dev-relocation-profile-smoke.sh` | Fail si chart-service no inicializado (entorno Node con WASM mock o skip CI) |
| Golden harness | Añadir `reference-cases-reloc.json` (2–3 ciudades) en `src/dev/golden/` |

**Nota CI:** smokes Node actuales no cargan WASM; la implementación real necesitará o bien harness browser (como golden-test.html) o fixture precalculada firmada para Node.

---

## 7. Decisión: implementar vs documentar

| Pregunta | Respuesta |
|----------|-----------|
| ¿Vía fiable para AC/DC/MC/IC en cualquier ciudad? | **Sí** — `generateFullChart` / `getHousesAndAngles` con lat/lon destino |
| ¿Reutilizar o inventar? | **Reutilizar** chart-service + adapter |
| ¿`getRelocatedAngles` del spec? | **No portar**; duplicaría lógica inferior a Swiss Ephemeris |
| ¿Bridge reescritura? | **No** |
| ¿Siguiente paso? | ~~3.7b.6~~ → **implementado** (ver §10) |

---

## 10. Implementación 3.7b.6 — Reloc Chart Adapter

**Estado:** implementado DEV · sin UI producto · sin cambios en motores

### Qué reutiliza

| Pieza | Ruta |
|-------|------|
| WASM + Swiss Ephemeris | `natal-engine-loader` → `kairos-core` |
| Fachada | `src/services/chart-service.js` → `generateNatalChart` |
| Orquestador | `generateFullChart` → `getHousesAndAngles` / `swe.houses` |
| Adapter | `src/services/reloc-chart-adapter.js` |
| Pipeline editorial | `relocation-profile-service` → `reloc-lite` → `reloc-composition` → Bridge |

### Qué NO toca

- `planetary_engine.js`, `chart_engine.js`, `astro.js`, WASM blobs  
- `src/index.html`, `src/ui/*`, `dist/`  
- Premium, Couple, IA, Reports, Firebase  

### Política de timezone

- **Siempre** `birthData.timezone` (IANA lugar de nacimiento, p. ej. `Europe/Madrid`).  
- La ciudad destino aporta **solo** `lat` / `lon`.  
- **No** sustituir timezone por la de la ciudad (evita desplazar el instante UTC natal).  
- Meta: `timezonePolicy: "birth_timezone"`.

### Ruta real de datos

```
birthData (1973-05-29 07:30 Europe/Madrid, lat/lon Maó)
+ targetLocation (Lisboa lat/lon)
    → generateNatalChart(reloc payload)  // misma date/time/tz, coords ciudad
    → generateNatalChart(natal payload)  // coords nacimiento (delta + slugs)
    → KairosRelocChartAdapter.buildRelocationInputFromChart()
    → buildRelocationProfile() → RelocLite → RelocComposition → Bridge
```

Lab: `src/dev/relocation-preview.html` — toggle **Mock** / **Real chart-service**.

### Limitaciones

| Limitación | Nota |
|------------|------|
| Smokes Node sin WASM | Casos 1–5 en Node; datos reales vía fixture JSON capturada en browser |
| Fixture no auto-generada en CI | `src/dev/fixtures/relocation-roberto-lisboa-real.json` — generar con `?capture=1` |
| Toronto real | Preset real solo Roberto + birth constant en lab |
| Signos motor en español | Adapter mapea a slug EN antes del profile |
| Claves ASC→AC | Solo en capa adapter; motor sigue usando `ASC` |

### Smokes 3.7b.6

- `scripts/dev-reloc-chart-adapter-smoke.sh` — estructura + fixture opcional  
- Browser: `dev/relocation-preview.html?dataSource=real&capture=1`  
- Encadenados: profile / composition / reloc-lite smokes sin cambio de contrato  

---

## 8. Referencias cruzadas

| Documento | Uso en auditoría |
|-----------|------------------|
| `KAIROS_DOC_INDEX.md` | 3.7b cerrado; motores congelados |
| `RELOCATION_SCAFFOLD_ARCHITECTURE.md` | Contrato profile + mocks actuales |
| `RELOCATION_EDITORIAL_BRIEF.md` | Modelo UTC fijo + ángulos que cambian |
| `ASTRO_ENGINE_SPEC.md` | `getRelocatedAngles` — **aspiracional**, no runtime Maps |
| `FASE_3_1_LAZY_WASM.md` | Carga lazy chart-service |
| `phase-2.1a-integration.md` | ascendant_engine excluido de 2.1a |
| `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | RELOCATION → chart-service ext. |

---

## 9. Criterios PASS de esta auditoría (3.7b.5)

- [x] Inventario funciones existentes / faltantes  
- [x] Ruta MVP Path definida  
- [x] Veredicto Bridge documentado  
- [x] Riesgos y precisión  
- [x] Smokes futuros listados  
- [x] Sin código productivo · sin motores tocados · sin UI  

---

*Relocation Real Data Audit · 3.7b.5 auditoría · 3.7b.6 adapter DEV*
