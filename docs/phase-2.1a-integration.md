KAIROS MAPS — FASE 2.1a
INTEGRACIÓN DEL MOTOR NATAL KAIROS (Swiss Ephemeris)
Versión 1.0 | Mayo 2026
Estado: PLANIFICACIÓN — SIN IMPLEMENTAR


════════════════════════════════════════════════════════
0. PROPÓSITO DE ESTE DOCUMENTO
════════════════════════════════════════════════════════


Este documento define cómo integrar el motor astronómico real de KAIROS
(copia portable en KAIROS-ASTRONOMY-CORE/) en Kairos Maps para calcular
carta natal completa en cliente, sin modificar el motor de líneas actual.

Alcance de Fase 2.1a:
  - Carta natal: planetas, ASC, MC, casas Placidus, aspectos
  - Pipeline paralelo a astro.js (astrocartografía simplificada)
  - Validación con casos golden vs referencia externa

Fuera de alcance de Fase 2.1a:
  - Relocación por ciudad (Fase 2.1c)
  - UI de carta natal en producción
  - Cambios en líneas del mapa, overlays, interpretaciones
  - Firebase, deploy, móvil


════════════════════════════════════════════════════════
1. OBJETIVO DE FASE 2.1a
════════════════════════════════════════════════════════


Objetivo principal:
  Integrar Swiss Ephemeris WASM + motores congelados de KAIROS en
  src/engines/kairos-core/ y exponer carta natal vía chart-service.js,
  sin romper el flujo actual del mapa astrocartográfico.


Objetivos específicos:

  1. Cargar correctamente swisseph.wasm + swisseph.data en navegador
  2. Inicializar window.swisseph_native de forma estable
  3. Ejecutar generateFullChart() con datos del perfil Maps
  4. Validar precisión con ≥3 casos golden documentados
  5. Dejar listo chart-service.js como contrato estable para app.js (fase posterior)


Criterio de éxito (2.1a):

  - generateFullChart() devuelve planetas, ángulos, casas y aspectos
  - Init sin error swisseph_native no detectada
  - Casos golden dentro de tolerancia definida (sección 8)
  - astro.js, calculateMap(), overlays e interpretaciones sin cambios


════════════════════════════════════════════════════════
2. FUENTE PORTABLE (NO MODIFICAR)
════════════════════════════════════════════════════════


Carpeta de referencia (copia aislada, intacta):

  KAIROS-ASTRONOMY-CORE/

Contenido auditado:

  chart_engine.js          → generateFullChart()
  planetary_engine.js      → initPlanetaryEngine, getPlanetaryPositions, getHousesAndAngles
  aspects_engine.js        → calculateAspects
  ascendant_engine.js      → getAscendant (Astronomy-engine; NO usado por chart_engine)
  constants.js             → ZODIAC_LIST, RULERS (auxiliar)
  kairos-core/wasm/        → swisseph_wrapper.js, swisseph.js, swisseph.wasm, swisseph.data
  wasm/                    → duplicado idéntico de binarios (NO copiar a Maps)


Regla: no editar archivos dentro de KAIROS-ASTRONOMY-CORE/.
Los adaptadores viven solo en archivos nuevos de Kairos Maps.


════════════════════════════════════════════════════════
3. ESTRUCTURA FINAL PROPUESTA
════════════════════════════════════════════════════════


Destino en Kairos Maps (cuando se implemente):

  src/engines/kairos-core/
  ├── bootstrap.js              ← NUEVO (Maps): init WASM, path fix, readiness
  ├── chart-service.js          ← NUEVO (Maps): API estable para app.js
  ├── wasm/                     ← COPIAR desde KAIROS-ASTRONOMY-CORE/kairos-core/wasm/
  │   ├── swisseph_wrapper.js   ← INTACTO (congelado)
  │   ├── swisseph.js           ← INTACTO
  │   ├── swisseph.wasm         ← INTACTO (~531 KB)
  │   └── swisseph.data         ← INTACTO (~12 MB, efemérides embebidas)
  ├── planetary_engine.js       ← COPIAR INTACTO
  ├── aspects_engine.js         ← COPIAR INTACTO
  ├── chart_engine.js           ← COPIAR INTACTO
  └── constants.js              ← COPIAR INTACTO (opcional en 2.1a)


Motores existentes (sin mover):

  src/engines/astro.js          ← astrocartografía actual (congelado)


Diagrama de capas:

  ┌─────────────────────────────────────────────┐
  │ app.js (futuro: opt-in vía chart-service)   │
  ├─────────────────────────────────────────────┤
  │ chart-service.js          ← contrato Maps     │
  ├─────────────────────────────────────────────┤
  │ chart_engine.js           ← generateFullChart│
  │ planetary_engine.js       ← Swiss Ephemeris  │
  │ aspects_engine.js         ← aspectos         │
  │ bootstrap.js              ← init + path fix  │
  ├─────────────────────────────────────────────┤
  │ wasm/ (Swiss Ephemeris)                       │
  └─────────────────────────────────────────────┘

  Paralelo (sin cruce en 2.1a):

  ┌─────────────────────────────────────────────┐
  │ app.js → computeAllLines() → astro.js       │
  │          (astronomy-engine, solo UTC)       │
  └─────────────────────────────────────────────┘


════════════════════════════════════════════════════════
4. ARCHIVOS QUE SE COPIARÁN
════════════════════════════════════════════════════════


Desde KAIROS-ASTRONOMY-CORE/ → src/engines/kairos-core/


  OBLIGATORIOS (2.1a):

    kairos-core/wasm/swisseph_wrapper.js
    kairos-core/wasm/swisseph.js
    kairos-core/wasm/swisseph.wasm
    kairos-core/wasm/swisseph.data
    planetary_engine.js
    aspects_engine.js
    chart_engine.js


  OPCIONALES (2.1a):

    constants.js
      → Solo si UI o chart-service necesitan ZODIAC_LIST / RULERS


  NUEVOS (solo Maps, no existen en KAIROS-ASTRONOMY-CORE):

    bootstrap.js
    chart-service.js


  DEV OPCIONAL (implementación futura):

    src/dev/natal-lab.html
      → Página aislada para golden tests sin Leaflet ni app.js


════════════════════════════════════════════════════════
5. ARCHIVOS QUE NO SE COPIARÁN
════════════════════════════════════════════════════════


  KAIROS-ASTRONOMY-CORE/wasm/
    → Duplicado idéntico de kairos-core/wasm/ sin wrapper; redundante

  KAIROS-ASTRONOMY-CORE/ascendant_engine.js
    → No entra en generateFullChart(); usa Astronomy-engine en paralelo
    → Reservar para 2.1c (validación cruzada o relocación), no para 2.1a

  Cualquier archivo /ephe/*.se1 suelto en HTTP
    → No incluidos en la copia portable
    → swisseph.data ya embebe sepl_18.se1, semo_18.se1, seas_18.se1 en /sweph/


  NO tocar / NO copiar desde Maps existente:

    src/engines/astro.js
    src/content/interpretations.js
    src/ui/app.js (en 2.1a)
    src/ui/styles.css (salvo panel natal en fase UI posterior)
    firebase.json
    dist/ (hasta fase deploy explícita)


════════════════════════════════════════════════════════
6. DEPENDENCIAS Y ORDEN DE CARGA (index.html)
════════════════════════════════════════════════════════


Dependencias externas ya presentes en Maps:

  window.luxon          ← planetary_engine.js (obligatorio)
  window.Astronomy      ← astro.js (NO requerido por generateFullChart)


Orden propuesto cuando se implemente (sin quitar scripts actuales):

  <!-- Existentes — mantener -->
  <script src="https://cdn.jsdelivr.net/npm/luxon@3/build/global/luxon.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js"></script>
  <script src="engines/astro.js"></script>

  <!-- Fase 2.1a — natal (añadir) -->
  <script type="module" src="engines/kairos-core/bootstrap.js"></script>
  <script src="engines/kairos-core/aspects_engine.js"></script>
  <script src="engines/kairos-core/planetary_engine.js"></script>
  <script src="engines/kairos-core/chart_engine.js"></script>
  <!-- chart-service.js: cargar cuando app.js lo consuma -->


Notas críticas:

  1. swisseph_wrapper.js es ES module (import). Requiere type="module" en bootstrap.
  2. planetary_engine.js usa import('./kairos-core/wasm/...') solo si
     window.swisseph_native no existe. Bootstrap debe precargarlo.
  3. Tras initPlanetaryEngine(), restaurar set_ephe_path('sweph') — ver sección 7.


════════════════════════════════════════════════════════
7. bootstrap.js PROPUESTO
════════════════════════════════════════════════════════


Archivo nuevo: src/engines/kairos-core/bootstrap.js
Tipo: ES module (type="module")
Responsabilidad: init WASM, exponer readiness, corregir path de efemérides


Problema que resuelve:

  - Import dinámico en planetary_engine apunta a ./kairos-core/wasm/...
    (path válido solo si planetary_engine vive un nivel arriba de kairos-core).
    En Maps la estructura será engines/kairos-core/wasm/ → import roto.
  - preloadEphemeris() intenta fetch /ephe/*.se1 (404 en Maps).
  - initPlanetaryEngine() sobrescribe set_ephe_path('/ephe') aunque falle el fetch.
  - swisseph.data ya contiene efemérides en VFS bajo /sweph/.


Código propuesto (referencia — implementar en fase de código):


  import SwissEph from './wasm/swisseph_wrapper.js';

  async function initKairosCore() {
    if (window.swisseph_native?._kairosReady) {
      return window.swisseph_native;
    }

    const swe = new SwissEph();
    await swe.initSwissEph();
    swe.set_ephe_path('sweph');
    swe._kairosReady = true;

    window.swisseph_native = swe;

    window.__kairosCoreReady = (async () => {
      if (typeof initPlanetaryEngine === 'function') {
        await initPlanetaryEngine();
        window.swisseph_native.set_ephe_path('sweph');
      }
    })();

    return swe;
  }

  window.initKairosCore = initKairosCore;
  initKairosCore();


Exports globales esperados tras bootstrap:

  window.swisseph_native     → instancia SwissEph lista
  window.__kairosCoreReady   → Promise (resuelve cuando initPlanetaryEngine termina)
  window.initKairosCore      → re-invocable (idempotente)


Comportamiento aceptable en consola durante init:

  - Warnings 404 en fetch /ephe/*.se1 → esperados si no se publica /ephe/
  - Deben desaparecer errores de cálculo tras reset a path 'sweph'


════════════════════════════════════════════════════════
8. CONTRATO DE chart-service.js
════════════════════════════════════════════════════════


Archivo nuevo: src/engines/kairos-core/chart-service.js
Responsabilidad: API estable entre perfil Maps y generateFullChart()
No modifica state.lines ni llama a computeAllLines()


Namespace global propuesto:

  window.KairosChartService


──────────────────────────────────────────────────────
8.1 Tipos de entrada (BirthInput)
──────────────────────────────────────────────────────


Compatible con profile.birthData de onboarding/profile.js:

  {
    date: string,       // 'YYYY-MM-DD'
    time: string,       // 'HH:mm'
    timezone: string,   // IANA, ej. 'Europe/Madrid'
    lat: number,
    lon: number,
    place?: string,
    placeFull?: string
  }


──────────────────────────────────────────────────────
8.2 API pública
──────────────────────────────────────────────────────


  /**
   * Asegura que Swiss Ephemeris está listo.
   * @returns {Promise<void>}
   */
  KairosChartService.ensureReady()


  /**
   * Calcula carta natal completa.
   * @param {BirthInput} birthInput
   * @param {Object} [options]
   * @param {string} [options.houseSystem='P']  // Placidus
   * @returns {Promise<NatalChartResult>}
   */
  KairosChartService.getNatalChart(birthInput, options)


  /**
   * Atajo: lee perfil de localStorage y calcula si hay birthData.
   * @returns {Promise<NatalChartResult|null>}
   */
  KairosChartService.getNatalChartFromProfile()


  /**
   * Invalida cache en memoria (si se implementa cache).
   */
  KairosChartService.clearCache()


──────────────────────────────────────────────────────
8.3 NatalChartResult (salida normalizada)
──────────────────────────────────────────────────────


Wrapper sobre el JSON de generateFullChart(), sin alterar núcleo congelado:

  {
    ok: true,
    chart: {
      metadata: { ... },      // tal cual chart_engine
      input: { ... },
      planets: { ... },
      angles: {
        ASC: PositionObject,
        MC: PositionObject,
        DC: PositionObject,
        IC: PositionObject
      },
      houses: PositionObject[],  // 12 cúspides Placidus
      aspects: AspectObject[]
    },
    computedAt: string,         // ISO timestamp
    cacheKey: string            // hash birthInput para cache futuro
  }


  PositionObject:
    { longitude, sign, deg, min, sec }


  AspectObject:
    { p1, p2, aspect, targetAngle, actualDistance, orb, isApplying, formattedOrb }


En error:

  {
    ok: false,
    error: {
      code: 'MISSING_BIRTH_DATA' | 'INVALID_TIMEZONE' | 'ENGINE_NOT_READY' | 'CALC_ERROR',
      message: string
    }
  }


──────────────────────────────────────────────────────
8.4 Validación de entrada (chart-service)
──────────────────────────────────────────────────────


  - date: regex /^\d{4}-\d{2}-\d{2}$/
  - time: regex /^\d{2}:\d{2}$/
  - timezone: string no vacío; validar con luxon DateTime.isValid
  - lat: [-90, 90], lon: [-180, 180]


──────────────────────────────────────────────────────
8.5 Implementación interna (pseudocódigo)
──────────────────────────────────────────────────────


  async getNatalChart(input, options) {
    await ensureReady();  // await window.__kairosCoreReady

    const chart = await generateFullChart(
      input.date,
      input.time,
      input.lat,
      input.lon,
      input.timezone
    );

    return { ok: true, chart, computedAt: new Date().toISOString(), cacheKey: ... };
  }


──────────────────────────────────────────────────────
8.6 Quirk documentado (no corregir en 2.1a)
──────────────────────────────────────────────────────


  chart_engine declara house_system: "Placidus" en metadata pero asigna
  planet.house con regla Whole Sign (signo planeta vs signo ASC).

  - chart.houses → cúspides Placidus (correctas)
  - chart.planets[*].house → Whole Sign (inconsistente con metadata)

  chart-service debe documentar esto; no parchear chart_engine.js congelado.


──────────────────────────────────────────────────────
8.7 Estado en app.js (futuro, no en 2.1a)
──────────────────────────────────────────────────────


  state.chart = {
    natal: null,        // NatalChartResult.chart
    loading: false,
    error: null,
    lastComputedAt: null
  }


  app.js NO debe mutar state.lines ni llamar chart-service desde calculateMap()
  hasta fase UI explícita.


════════════════════════════════════════════════════════
9. CÓMO PROBAR generateFullChart()
════════════════════════════════════════════════════════


Prerequisitos:

  1. Servir src/ localmente (ej. npx serve src)
  2. Scripts kairos-core cargados según sección 6
  3. Consola del navegador abierta


──────────────────────────────────────────────────────
9.1 Test manual en consola
──────────────────────────────────────────────────────


  await window.__kairosCoreReady;

  const chart = await generateFullChart(
    '1990-06-12',
    '14:35',
    39.8885,
    4.2658,
    'Europe/Madrid'
  );

  console.log('ASC', chart.angles.ASC);
  console.log('MC', chart.angles.MC);
  console.log('Sol', chart.planets.SUN);
  console.log('Aspectos', chart.aspects.length);


Checks mínimos:

  | Check              | Esperado                              |
  |--------------------|---------------------------------------|
  | Init               | Sin throw swisseph_native no detectada|
  | chart.planets      | SUN, MOON, … CHIRON, MEAN_NODE, etc.  |
  | chart.angles.ASC   | sign + deg + min + longitude          |
  | chart.angles.MC    | idem                                  |
  | chart.houses       | length === 12                         |
  | chart.aspects      | array no vacío (típico)               |
  | metadata.engine    | "KAIROS CORE"                         |


──────────────────────────────────────────────────────
9.2 Test desde perfil Maps
──────────────────────────────────────────────────────


  const p = KairosProfile.getProfile()?.birthData;
  if (!p) throw new Error('Sin perfil');

  await window.__kairosCoreReady;
  const chart = await generateFullChart(p.date, p.time, p.lat, p.lon, p.timezone);


──────────────────────────────────────────────────────
9.3 Test vía chart-service (cuando exista)
──────────────────────────────────────────────────────


  const result = await KairosChartService.getNatalChartFromProfile();
  console.log(result.ok, result.chart?.angles?.ASC);


──────────────────────────────────────────────────────
9.4 Página de laboratorio (opcional)
──────────────────────────────────────────────────────


  src/dev/natal-lab.html

  - Solo Luxon + kairos-core + formulario
  - Sin Leaflet, app.js, overlays
  - Botón "Calcular" → generateFullChart → tabla ASC/MC/planetas
  - No desplegar a producción en 2.1a


════════════════════════════════════════════════════════
10. CASOS GOLDEN MÍNIMOS
════════════════════════════════════════════════════════


Referencia externa sugerida: Astro.com Extended Chart Selection
(https://www.astro.com/cgi/chart.cgi)
Configuración: Tropical, Geocentric, Placidus, Swiss Ephemeris


Tolerancias aceptables (2.1a):

  Planetas (longitud eclíptica):  ±0.10°
  ASC / MC:                       ±0.50°
  Cúspides casas:                 ±0.50°
  Aspectos:                       mismo aspecto detectado; orbe ±0.30°


──────────────────────────────────────────────────────
10.1 Golden #1 — Maó, Menorca (perfil demo Maps)
──────────────────────────────────────────────────────


  date:      1990-06-12
  time:      14:35
  timezone:  Europe/Madrid
  lat:       39.8885
  lon:       4.2658

  Verificar:
    - ASC signo coherente con referencia
    - MC signo coherente
    - Sol longitud ~102° (Géminis ~12°) — confirmar con Astro.com


──────────────────────────────────────────────────────
10.2 Golden #2 — Madrid (latitud media, DST histórico)
──────────────────────────────────────────────────────


  date:      1985-03-31
  time:      08:15
  timezone:  Europe/Madrid
  lat:       40.4168
  lon:       -3.7038

  Verificar:
    - Conversión DST primavera 1985 correcta (Luxon + SE)
    - Luna y nodos dentro de tolerancia


──────────────────────────────────────────────────────
10.3 Golden #3 — Buenos Aires (hemisferio sur, oeste)
──────────────────────────────────────────────────────


  date:      2000-01-01
  time:      00:30
  timezone:  America/Argentina/Buenos_Aires
  lat:       -34.6037
  lon:       -58.3816

  Verificar:
    - Casas Placidus en latitud sur
    - ASC/MC estables vs referencia


──────────────────────────────────────────────────────
10.4 Registro de resultados (plantilla)
──────────────────────────────────────────────────────


  | Caso | Campo   | Referencia (Astro.com) | Maps (generateFullChart) | Δ    | OK |
  |------|---------|------------------------|--------------------------|------|----|
  | G1   | ASC lon |                        |                          |      |    |
  | G1   | MC lon  |                        |                          |      |    |
  | G1   | SUN lon |                        |                          |      |    |
  | G2   | ...     |                        |                          |      |    |
  | G3   | ...     |                        |                          |      |    |


Completar esta tabla antes de cerrar 2.1a e integrar chart-service en app.js.


════════════════════════════════════════════════════════
11. RIESGOS TÉCNICOS
════════════════════════════════════════════════════════


  | # | Riesgo | Sev. | Mitigación |
  |---|--------|------|------------|
  | 1 | Path /ephe post-init rompe SE embebido | Alta | bootstrap reset set_ephe_path('sweph') |
  | 2 | Import dinámico path incorrecto | Alta | Precargar window.swisseph_native en bootstrap |
  | 3 | ES module vs scripts clásicos | Media | Solo bootstrap como type="module" |
  | 4 | +12 MB en deploy (swisseph.data) | Media | Lazy init; cargar natal solo bajo demanda |
  | 5 | Dos motores (Astronomy vs SE) | Media | No cargar ascendant_engine en 2.1a |
  | 6 | planet.house Whole Sign vs metadata Placidus | Baja | Documentar en chart-service; no parchear |
  | 7 | houses() duplicado en swisseph_wrapper | Baja | Monitor; no editar wrapper congelado |
  | 8 | Licencia Swiss Ephemeris GPL/comercial | Legal | Revisar antes de producto comercial |
  | 9 | Placidus en latitudes extremas (>66°) | Media | Fuera de golden 2.1a; fallback en 2.1b+ |
  | 10 | Regresión mapa si se toca astro.js | Alta | Mantener pipelines separados |


════════════════════════════════════════════════════════
12. QUÉ NO TOCAR (REGLAS FASE 2.1a)
════════════════════════════════════════════════════════


  CONGELADO — NO MODIFICAR:

    KAIROS-ASTRONOMY-CORE/* (fuente portable)
    src/engines/astro.js
    src/content/interpretations.js
    src/ui/app.js                    (hasta fase posterior explícita)
    Overlays / refreshMapGlyphs / drawLine
    Flujo móvil (@media max-width 768px)
    firebase.json
    Deploy / dist/ sync


  NO MEZCLAR CONCEPTOS:

    state.activeAspect (amor/trabajo/descanso) ≠ aspectos astrológicos
    Líneas astrocartográficas (astro.js) ≠ carta natal (kairos-core)
    Relocación por ciudad ≠ proximidad a líneas (Fase 2.1c aparte)


  NO IMPLEMENTAR EN 2.1a:

    Cambios en interpretaciones.js por carta natal
    UI de carta en sidebar producción
    Firebase / Firestore para cartas
    Sustitución de computeAllLines por Swiss Ephemeris


════════════════════════════════════════════════════════
13. ORDEN DE IMPLEMENTACIÓN FUTURO
════════════════════════════════════════════════════════


  Fase 2.1a-0 — Copia y bootstrap (sin app.js)
  ─────────────────────────────────────────────
    [ ] Copiar archivos sección 4 a src/engines/kairos-core/
    [ ] Crear bootstrap.js según sección 7
    [ ] Añadir scripts en index.html (sección 6)
    [ ] Probar generateFullChart() en consola (sección 9.1)
    [ ] NO tocar app.js, astro.js, Firebase


  Fase 2.1a-1 — Golden tests
  ─────────────────────────────────────────────
    [ ] Ejecutar casos G1, G2, G3 (sección 10)
    [ ] Completar tabla de registro
    [ ] Documentar deltas; aprobar tolerancias con Roberto
    [ ] Opcional: src/dev/natal-lab.html


  Fase 2.1a-2 — chart-service.js
  ─────────────────────────────────────────────
    [ ] Implementar KairosChartService (sección 8)
    [ ] Probar getNatalChartFromProfile() en consola
    [ ] Cache en memoria opcional (sin localStorage en 2.1a)
    [ ] Aún sin cambios en app.js producción


  Fase 2.1a-3 — Hook opt-in app.js (cuando se apruebe)
  ─────────────────────────────────────────────
    [ ] state.chart en app.js
    [ ] Llamada async paralela a calculateMap (no bloqueante)
    [ ] Sin UI visible; solo dev flag o consola
    [ ] Sync dist/ + deploy solo cuando Roberto lo pida


  Fase 2.1b — Aspectos / panel natal UI
  Fase 2.1c — Relocación por ciudad (getHousesAndAngles en city lat/lon)
  Fase 2.2  — Alinear líneas astrocartográficas a eclíptica (astro.js o v2)


════════════════════════════════════════════════════════
14. CHECKLIST PRE-IMPLEMENTACIÓN
════════════════════════════════════════════════════════


  Antes de copiar archivos, confirmar:

    [ ] Roberto aprueba estructura src/engines/kairos-core/
    [ ] Roberto aprueba bootstrap con reset path 'sweph'
    [ ] Roberto aprueba casos golden G1–G3
    [ ] Roberto confirma que ascendant_engine.js queda fuera de 2.1a
    [ ] Impacto +12 MB en deploy aceptado para fase deploy posterior


════════════════════════════════════════════════════════
FIN DEL DOCUMENTO
════════════════════════════════════════════════════════
