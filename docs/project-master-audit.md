KAIROS MAPS — AUDITORÍA MAESTRA DEL PROYECTO
Documento de continuidad para GPT y futuras fases
Versión 1.0 | Mayo 2026
Último commit auditado: `773ecec` (Fase 2.1a-0)


════════════════════════════════════════════════════════
0. CÓMO USAR ESTE DOCUMENTO
════════════════════════════════════════════════════════


Este archivo es la fuente de verdad operativa del estado del repo.
Leer al inicio de cualquier conversación nueva sobre Kairos Maps.

Entrada de la app:     src/index.html
Deploy producción:     dist/ → Firebase Hosting (kairos-maps-mvp)
Prioridad activa:      Desktop / Tablet (>768px)
Prioridad congelada:   Móvil (≤768px) — beta, no invertir salvo bug crítico


Documentos complementarios:

  docs/phase-2.1a-integration.md   → plan integración motor natal
  docs/astro_engine.txt            → spec futura líneas eclípticas
  docs/architecture.txt            → arquitectura datos (ideal largo plazo)
  docs/roadmap.txt                 → MVP vs V2 vs V3
  VERSION.md                       → seguimiento versiones (parcialmente desactualizado)
  PROJECT_CONTEXT.md               → contexto producto (Fase 0; parcialmente desactualizado)


════════════════════════════════════════════════════════
1. ESTADO GENERAL DEL PROYECTO
════════════════════════════════════════════════════════


QUÉ FUNCIONA (producción / demo desktop)
────────────────────────────────────────

  ✅ Mapa Leaflet interactivo (tiles oscuros, zoom, pan)
  ✅ Formulario natal + conversión TZ (Luxon) + autocompletado lugar (Nominatim)
  ✅ Onboarding 5 pasos + perfil en localStorage (KairosProfile)
  ✅ 40 líneas astrocartográficas (10 planetas × AC/MC/IC/DC)
  ✅ Filtros planeta / ángulo + toggle símbolos en mapa
  ✅ Overlays regionales / medallones planetarios en líneas (Fase 1.4)
  ✅ Click ciudad → panel interpretación (amor / trabajo / descanso)
  ✅ Búsqueda ciudades preset + Nominatim
  ✅ Auto-cálculo desktop al cargar si perfil completo (Fase 2.0A)
  ✅ Firebase Hosting estático (sin Auth ni Firestore)
  ✅ Núcleo astronómico KAIROS copiado en repo (Fase 2.1a-0) — sin conectar


QUÉ ESTÁ CONGELADO (no tocar sin aprobación explícita)
──────────────────────────────────────────────────────

  🔒 src/engines/astro.js              — motor líneas astrocartográficas
  🔒 src/content/interpretations.js    — 40 textos planeta × ángulo
  🔒 Overlays / refreshMapGlyphs / medallones (Fase 1.4)
  🔒 Motores congelados en kairos-core:
       planetary_engine.js, aspects_engine.js (desde KAIROS)
  🔒 KAIROS-ASTRONOMY-CORE/            — copia portable fuente; no editar
  🔒 Móvil                             — congelado en beta (ver sección 4)
  🔒 Firebase config                    — solo deploy cuando Roberto lo pida


QUÉ ESTÁ EN BETA
────────────────

  ⚠️ Experiencia móvil (≤768px)
     — Código presente (Fase 1.7–1.8 + hotfixes) pero no validada en dispositivo real
     — Bugs abiertos de tap ciudad, zoom a zonas negras, overlays vs touch

  ⚠️ dist/ vs src/
     — dist/ desincronizado respecto a src/ (2.0A/2.0B en src no desplegados)
     — Firebase producción puede estar en versión anterior

  ⚠️ kairos-core/
     — Copiado en repo; bootstrap.js preparado pero NO cargado en index.html
     — generateFullChart() no probado en contexto Maps aún


QUÉ ESTÁ PENDIENTE
──────────────────

  ⏳ Fase 2.0B restante: lat/lon colapsable, cache-bust assets, tipografía sidebar
  ⏳ Fase 2.0C: highlight ciudad seleccionada; alinear objetivo onboarding ↔ pestaña lectura
  ⏳ Fase 2.1a-1: golden tests generateFullChart()
  ⏳ Fase 2.1a-2: chart-service.js
  ⏳ Fase 2.1a-3: hook opt-in en app.js (sin UI producción)
  ⏳ Sync dist/ + redeploy Firebase con versión desktop actual
  ⏳ Actualizar VERSION.md al estado real de commits
  ⏳ Eliminar [KAIROS-DEBUG] restantes en astro.js (2.0B limpió app.js, no astro.js)
  ⏳ Auth, Firestore, premium, IA generativa, relocación UI — fuera MVP


════════════════════════════════════════════════════════
2. ARQUITECTURA ACTUAL
════════════════════════════════════════════════════════


ESTRUCTURA DE CARPETAS
──────────────────────

  KAIROS-MAPS-MVP/
  ├── src/                          ← fuente de verdad de la app
  │   ├── index.html                ← entrada única
  │   ├── engines/
  │   │   ├── astro.js              ← motor mapa (astronomy-engine)
  │   │   └── kairos-core/          ← motor natal SE (paralelo, no conectado)
  │   ├── content/
  │   │   └── interpretations.js    ← textos interpretación
  │   ├── ui/
  │   │   ├── app.js                ← orquestador principal
  │   │   ├── styles.css            ← desktop + @media móvil
  │   │   ├── onboarding.js
  │   │   ├── profile.js
  │   │   ├── places.js
  │   │   └── planet-glyphs.js
  │   └── assets/kairos_symbols/    ← SVG planetas y signos
  ├── dist/                         ← mirror para Firebase (puede estar desactualizado)
  ├── docs/                         ← documentación
  ├── legacy/                       ← HTML standalone original
  ├── KAIROS-ASTRONOMY-CORE/        ← copia portable fuente (untracked en git)
  ├── firebase.json                 ← public: dist
  ├── VERSION.md
  └── PROJECT_CONTEXT.md


ENGINES
───────

  Pipeline A — MAPA (activo, conectado a UI):

    index.html
      → astronomy-engine@2.1.19 (CDN)
      → luxon@3 (CDN)
      → engines/astro.js
      → ui/app.js → computeAllLines(utcDate)

    Input real al motor: solo instante UTC del nacimiento.
    Lat/lon del formulario NO afectan las líneas.


  Pipeline B — CARTA NATAL (copiado, NO conectado):

    src/engines/kairos-core/
      bootstrap.js          (ES module — no en index.html)
      planetary_engine.js   (Swiss Ephemeris WASM)
      chart_engine.js       (generateFullChart)
      aspects_engine.js
      constants.js
      wasm/                 (~12.6 MB total)


UI
──

  Desktop (>768px):
    Sidebar fijo 360px (datos natal, filtros, leyenda)
    Mapa Leaflet fullscreen
    Panel interpretación drawer derecho

  Móvil (≤768px):
    Barra superior: Mapa / Controles / Lectura
    Modos: map | controls | lectura
    Sidebar y panel lectura como bottom sheets


FIREBASE
────────

  Proyecto:     kairos-maps-mvp
  URLs:         https://kairos-maps-mvp.web.app
                https://kairos-maps-mvp.firebaseapp.com
  Publica:      dist/ (rsync manual desde src/)
  Auth/DB:      NO activos — solo Hosting estático


OVERLAYS
────────

  Implementados en app.js (refreshMapGlyphs):
    - Medallones planetarios sobre segmentos de línea visibles
    - Labels AC/MC/IC/DC en viewport
    - pointer-events: none en overlays (desktop OK; móvil aún problemático)
  Congelados desde Fase 1.4 — no refactorizar sin acuerdo.


FLUJO PRINCIPAL (desktop)
─────────────────────────

  1. Usuario abre app → checkDeps() valida Leaflet, Astronomy, Luxon
  2. Si sin perfil → onboarding 5 pasos → localStorage
  3. Si perfil completo → maybeAutoCalculateDesktop() (2.0A)
  4. readForm() → fecha, hora, TZ, lat, lon → utc Date
  5. computeAllLines(cfg.utc) → 40 polilíneas
  6. drawLine() + refreshMapGlyphs() → mapa
  7. Click ciudad → relevantInfluences(city, umbral 500 km)
  8. interpretations.js → texto amor/trabajo/descanso según mainGoal


════════════════════════════════════════════════════════
3. ESTADO DESKTOP
════════════════════════════════════════════════════════


UX
──

  ✅ Layout estable sidebar + mapa
  ✅ Brand: "Tu geografía personal" (2.0B)
  ✅ Status: "Mapa pendiente" / "Mapa activo · N lugares"
  ✅ Toasts humanizados en desktop (2.0B)
  ✅ syncDesktopDevHints() oculta hints dev si hay perfil
  ⏳ Lat/lon avanzado colapsable — pendiente 2.0B
  ⏳ Cache-bust en assets — pendiente


ONBOARDING
──────────

  ✅ 5 pasos: nombre, fecha/hora/lugar, objetivo vital, confirmación
  ✅ Autocompletado Nominatim para lugar de nacimiento
  ✅ Perfil guardado: birthData { date, time, timezone, lat, lon, place }
  ✅ Tras completar → datos en formulario sidebar


AUTO-CALC (2.0A)
────────────────

  ✅ maybeAutoCalculateDesktop() en checkDeps() tras deps OK
  ✅ Gate: !isMobileLayout() && !state.lines.length && profile.birthData
  ✅ Toast: "Mapa listo · N líneas"


LECTURA
───────

  ✅ Panel drawer derecho (desktop)
  ✅ Pestañas amor / trabajo / descanso (mapeo desde mainGoal onboarding)
  ✅ Influencias por proximidad <500 km a líneas
  ✅ 40 textos estáticos en interpretations.js


OVERLAYS
────────

  ✅ Medallones + labels en viewport
  ✅ Toggle mostrar/ocultar símbolos en mapa
  🔒 No tocar lógica overlay sin auditoría dedicada


MAPA
────

  ✅ 40 líneas color por planeta
  ✅ Filtros planeta y ángulo (AC/MC/IC/DC)
  ✅ Ciudades preset + búsqueda Nominatim
  ✅ Antimeridiano partido (splitAtAntimeridian en astro.js)
  ⏳ Highlight ciudad seleccionada — pendiente 2.0C


════════════════════════════════════════════════════════
4. ESTADO MÓVIL
════════════════════════════════════════════════════════


ESTADO: ⏸ CONGELADO EN BETA

Decisión (22 mayo 2026): pausar inversión móvil. Desktop es demo principal.
No seguir salvo bug crítico (app inutilizable, crash, pérdida de datos).


QUÉ FUNCIONA (en código, no validado en producción móvil)
──────────────────────────────────────────────────────────

  ✅ Barra Mapa / Controles / Lectura
  ✅ Modos map · controls · lectura (un panel a la vez)
  ✅ Sheet Controles (sidebar como bottom sheet)
  ✅ Panel Lectura como bottom sheet
  ✅ Chrome Leaflet reducido (zoom oculto, atribución minimizada)
  ✅ Targets táctiles ampliados (44px)


BUGS ABIERTOS
─────────────

  1. Tap ciudad no siempre abre lectura en Firebase móvil real
  2. Mapa permite pan/zoom hasta zonas negras (límites insuficientes)
  3. Capas/overlays (medallones, líneas, labels) interfieren con taps


INTENTOS NO CERRADOS
────────────────────

  f4dd743 — Restaurar openInterpretation(city) al tocar ciudad
  17462b3 — zIndexOffset, raiseCityMarkers, polylines no interactivas,
            minZoom: 3, fallback tap por proximidad


POR QUÉ QUEDÓ CONGELADO
───────────────────────

  - Hotfixes locales no reproducen fix en dispositivo real vía Firebase
  - Leaflet + touch + múltiples capas SVG/DivIcon requiere auditoría dedicada
  - ROI bajo vs desktop demo para MVP
  - Riesgo de regresión desktop si se sigue parcheando móvil


════════════════════════════════════════════════════════
5. MOTOR ASTRONÓMICO ACTUAL (astro.js)
════════════════════════════════════════════════════════


LIBRERÍA: astronomy-engine@2.1.19 (CDN, astronomy.browser.min.js)


QUÉ CALCULA
───────────

  - 10 planetas clásicos
  - Posiciones geocéntricas en coordenadas ecuatoriales (RA/Dec)
  - GMST vía Astronomy.SiderealTime()
  - Líneas MC/IC: meridianos verticales (RA − GMST)
  - Líneas AC/DC: curvas horizonte (cos H = −tan φ · tan δ)
  - Muestreo latitud cada 1–2°
  - splitAtAntimeridian() para Leaflet


QUÉ NO CALCULA
──────────────

  - Carta natal completa (signos, casas, aspectos)
  - ASC/MC en lugar de nacimiento
  - Relocación por ciudad
  - Longitudes eclípticas
  - Nodo Norte, Quirón, Lilith
  - Swiss Ephemeris


LIMITACIONES vs SISTEMA “REAL”
──────────────────────────────

  | Aspecto              | astro.js actual        | Estándar astrología     |
  |----------------------|------------------------|-------------------------|
  | Coordenadas          | RA/Dec ecuatorial      | Longitud eclíptica      |
  | Tiempo sidéreo       | GMST                   | GAST (Δ pequeño)        |
  | Input lat/lon natal  | Ignorado en líneas     | Relevante en carta natal|
  | AC eclíptico         | Curva declinación      | Fórmula ascendente SE   |
  | Precisión vs Astro.com | Puede desviar 1–5°   | Referencia SE           |

  Logs [KAIROS-DEBUG] aún activos en astro.js (2 líneas).


PROXIMIDAD CIUDAD
─────────────────

  distanceKmToLine() — haversine al vértice más cercano del segmento
  Umbral interpretación: PROX_KM = 500 en app.js


════════════════════════════════════════════════════════
6. NÚCLEO ASTRONÓMICO NUEVO (kairos-core)
════════════════════════════════════════════════════════


UBICACIÓN: src/engines/kairos-core/  (commit 773ecec)
TAMAÑO:    ~12.6 MB (~12 MB = swisseph.data)


CONTENIDO
─────────

  bootstrap.js              ← init WASM (NO conectado a index.html)
  chart_engine.js           ← generateFullChart()
  planetary_engine.js       ← getPlanetaryPositions, getHousesAndAngles
  aspects_engine.js         ← calculateAspects
  constants.js
  wasm/
    swisseph_wrapper.js     ← ES module, clase SwissEph
    swisseph.js             ← loader Emscripten
    swisseph.wasm           ← ~531 KB
    swisseph.data           ← ~12 MB, efemérides embebidas en /sweph/


SWISS EPHEMERIS
───────────────

  - Precisión profesional (tropical, geocéntrico)
  - Casas Placidus vía swe.houses()
  - 14+ cuerpos (Sol–Plutón, nodos, Lilith, Quirón)
  - Licencia dual GPL / comercial Astrodienst — revisar antes producto comercial


chart_engine / generateFullChart()
────────────────────────────────────

  Input: birthDate, birthTime, latitude, longitude, timezone (IANA)
  Output: metadata, planets, angles (ASC/MC/DC/IC), houses, aspects

  Quirk: metadata dice Placidus pero planet.house usa Whole Sign internamente.


ESTADO DE INTEGRACIÓN
─────────────────────

  ✅ Archivos copiados en repo (2.1a-0)
  ✅ bootstrap.js creado (path reset 'sweph' post-init)
  ❌ NO cargado en index.html
  ❌ chart-service.js no creado
  ❌ Golden tests no ejecutados
  ❌ app.js no consume carta natal
  ❌ Pipeline mapa (astro.js) independiente — sin cambios


FUENTE PORTABLE (referencia, no en git):

  KAIROS-ASTRONOMY-CORE/  — copia aislada; no modificar


Ver plan detallado: docs/phase-2.1a-integration.md


════════════════════════════════════════════════════════
7. HISTORIAL RESUMIDO DE FASES
════════════════════════════════════════════════════════


Fase 0 — Baseline estable (`c2559b7`)
  Mapa, motor 40 líneas, búsqueda, panel interpretación operativos.


Fase 1.1 — Onboarding (`f6116b7`)
  5 pasos, perfil localStorage, autocompletado Nominatim.


Fase 1.2 — Overlays KAIROS (`97440d2`)
  Símbolos planetarios y overlays en mapa.


Fase 1.3 — Líneas astrocartográficas (`67651a8`)
  Densificado visual AC/DC; fix antimeridiano en motor.


Fase 1.4 — Overlays regionales (`9153754`)
  Medallones y labels mejorados — congelado.


Fase 1.6 — Deploy Firebase (`be56c91`)
  firebase.json, dist/, hosting estático kairos-maps-mvp.


Fase 1.7–1.8 — UX móvil (`15bade8`)
  Barra Mapa/Controles/Lectura, modos, sheets, chrome Leaflet reducido.


Hotfixes móvil (`f4dd743`, `17462b3`)
  Lectura al tocar ciudad; taps y zoom — sin cerrar en dispositivo real.


Fase 2.0A — Auto-cálculo desktop (`20fcc4f`)
  maybeAutoCalculateDesktop() tras deps OK si perfil completo.
  Fix colateral: raiseCityMarkers() tras crear marcadores.


Fase 2.0B — Limpieza copy desktop (`32610c9`)
  Eliminados [KAIROS-DEBUG] de app.js; brand y status humanizados;
  toasts desktop; syncDesktopDevHints().
  Pendiente: colapsables lat/lon, cache-bust, tipografía.


Fase 2.1 — Documentación integración natal (`8b8283b`)
  docs/phase-2.1a-integration.md


Fase 2.1a-0 — Copia núcleo astronómico (`773ecec`)
  src/engines/kairos-core/ + bootstrap.js (sin conectar).


════════════════════════════════════════════════════════
8. COMMITS IMPORTANTES Y SIGNIFICADO
════════════════════════════════════════════════════════


| Hash      | Mensaje                              | Significado |
|-----------|--------------------------------------|-------------|
| c2559b7   | Fase 0 estable funcionando           | Baseline verificada |
| f6116b7   | Fase 1 onboarding local              | Perfil + Nominatim |
| 97440d2   | Fase 1.2 overlays KAIROS             | Símbolos en mapa |
| 67651a8   | Fase 1.3 líneas astrocartográficas   | Motor visual + antimeridiano |
| 9153754   | Fase 1.4 overlays regionales         | Medallones — congelado |
| be56c91   | Fase 1.6 deploy Firebase             | Hosting dist/ |
| 15bade8   | Fase 1.8 refinamiento UX móvil       | Sheets móvil — beta |
| f4dd743   | Hotfix lectura móvil                 | openInterpretation restore |
| 17462b3   | Fix taps ciudades móvil              | zIndex, minZoom — sin cerrar |
| 20fcc4f   | Fase 2.0A auto-calculo desktop       | Auto-calc al entrar |
| 32610c9   | Fase 2.0B limpieza copy desktop      | Copy + quitar debug app.js |
| 8b8283b   | Docs Fase 2.1a integración motor natal | Plan SE |
| 773ecec   | Fase 2.1a-0 copia nucleo kairos-core | WASM en repo, no conectado |


HEAD actual: 773ecec


Working tree sin commit (al momento de esta auditoría):

  - VERSION.md modificado (desactualizado vs HEAD)
  - dist/ desincronizado vs src/ (2.0A/2.0B no desplegados)
  - KAIROS-ASTRONOMY-CORE/ untracked (fuente portable)
  - .DS_Store, .firebase/ — no commitear


════════════════════════════════════════════════════════
9. RIESGOS TÉCNICOS ACTUALES
════════════════════════════════════════════════════════


| # | Riesgo | Sev. | Notas |
|---|--------|------|-------|
| 1 | dist/ desincronizado vs src/ | Alta | Firebase puede servir versión antigua |
| 2 | Dos motores astronómicos paralelos | Alta | astro.js (mapa) vs kairos-core (natal) — no mezclar |
| 3 | Lat/lon natal ignorado por líneas | Media | Usuario puede creer que lugar afecta mapa |
| 4 | Móvil roto en producción | Media | Congelado; no prometer UX móvil |
| 5 | kairos-core +12 MB sin lazy load | Media | Impacto primera carga cuando se conecte |
| 6 | Path /ephe vs /sweph en planetary_engine | Alta | bootstrap debe reset path (documentado) |
| 7 | ES module bootstrap vs scripts clásicos | Media | Solo bootstrap como type=module |
| 8 | Regresión desktop al tocar móvil | Alta | Gate isMobileLayout() en cambios |
| 9 | Licencia Swiss Ephemeris | Legal | GPL/comercial según uso |
| 10 | VERSION.md / PROJECT_CONTEXT desactualizados | Baja | Confusión en conversaciones futuras |
| 11 | [KAIROS-DEBUG] en astro.js | Baja | Ruido consola |
| 12 | Equatorial vs eclíptico en líneas | Media | Delta vs Astro.com; no “arreglar” sin tests |


════════════════════════════════════════════════════════
10. REGLAS DE DESARROLLO DEL PROYECTO
════════════════════════════════════════════════════════


PRIORIDAD
─────────

  1. Desktop demo sólida > móvil
  2. No romper flujo mapa existente
  3. Cambios quirúrgicos: máximo 1 módulo, 3 cambios, 2 archivos por sprint
  4. Solo commit cuando Roberto lo pida explícitamente


CONGELACIÓN
───────────

  - astro.js, interpretations.js, overlays 1.4: no tocar sin acuerdo
  - Motores kairos-core congelados: copiar intactos; adaptar solo bootstrap/chart-service
  - Móvil: no tocar salvo bug crítico


PIPELINES SEPARADOS
───────────────────

  Mapa:       astro.js + computeAllLines(utc)
  Carta natal: kairos-core + generateFullChart(birthData)
  No sustituir uno por otro en 2.1a


NAMING
──────

  state.activeAspect = amor/trabajo/descanso (producto)
  chart.aspects      = conjunción/trígono/etc. (astrología)
  No confundir en código ni copy


DEPLOY
──────

  src/ → rsync/copia → dist/ → firebase deploy
  Nunca deploy sin sync dist/
  Nunca force push main


DOCUMENTACIÓN
─────────────

  Actualizar VERSION.md tras fases cerradas
  Usar docs/project-master-audit.md como continuidad GPT


KAIROS PRINCIPAL (skill operativa)
──────────────────────────────────

  Motores congelados en ecosistema KAIROS: planetary_engine, ascendant_engine,
  projection_engine, chart_650_v1, weekly_engine — respetar misma regla aquí
  para copias en kairos-core.


════════════════════════════════════════════════════════
11. ROADMAP FUTURO RESUMIDO
════════════════════════════════════════════════════════


INMEDIATO (activo)
──────────────────

  2.0B restante   — colapsables, cache-bust, tipografía sidebar
  2.0C            — highlight ciudad, alinear objetivo ↔ pestaña lectura
  2.1a-1          — golden tests generateFullChart()
  2.1a-2          — chart-service.js
  2.1a-3          — hook opt-in app.js (consola/dev)
  Deploy          — sync dist/ + Firebase con desktop actual


CORTO PLAZO
───────────

  2.1b — Panel natal UI / aspectos en producto
  2.1c — Relocación por ciudad (getHousesAndAngles en lat/lon destino)
  2.2  — Alinear líneas astrocartográficas a eclíptica (con tests regresión)


MEDIO PLAZO (fuera MVP)
───────────────────────

  Auth + Firestore (architecture.txt Fase 2)
  Interpretación IA (Anthropic)
  Premium, comunidad, tránsitos
  Backend para cálculos pesados


PAUSADO
───────

  Fase 1.9 móvil refinamiento P1
  Fase 2.0 móvil Controles nativo
  Búsqueda móvil bajo demanda
  Auditoría Leaflet touch dedicada (antes de reabrir móvil)


════════════════════════════════════════════════════════
12. QUÉ NO DEBE TOCARSE TODAVÍA
════════════════════════════════════════════════════════


  ❌ src/engines/astro.js
  ❌ src/content/interpretations.js
  ❌ Overlays / refreshMapGlyphs / medallones (Fase 1.4)
  ❌ Flujo móvil (styles @media ≤768px) salvo bug crítico
  ❌ Motores congelados dentro de kairos-core/ (planetary, aspects)
  ❌ KAIROS-ASTRONOMY-CORE/ (fuente portable)
  ❌ Conectar kairos-core a index.html hasta 2.1a-1 validado
  ❌ Sustituir computeAllLines por Swiss Ephemeris sin tests
  ❌ Firebase / Auth / Firestore
  ❌ Deploy dist/ sin aprobación explícita de Roberto
  ❌ .DS_Store, .firebase/ en commits


════════════════════════════════════════════════════════
13. PRIORIDADES REALES ACTUALES
════════════════════════════════════════════════════════


  1. Cerrar demo desktop (2.0B restante + 2.0C)
  2. Validar motor natal en aislamiento (2.1a-1 golden tests)
  3. chart-service.js sin UI (2.1a-2)
  4. Sync + deploy Firebase desktop actual
  5. Integración opt-in app.js (2.1a-3)

  NO prioritario ahora:
    - Móvil
    - Relocación UI
    - Cambiar fórmula líneas astrocartográficas
    - IA / premium / auth


════════════════════════════════════════════════════════
14. CHECKLIST ANTES DE FUTUROS DEPLOYS
════════════════════════════════════════════════════════


PRE-DEPLOY
──────────

  [ ] src/ probado en local (python3 -m http.server en src/)
  [ ] Desktop: onboarding → auto-calc → mapa 40 líneas → click ciudad → lectura
  [ ] Sin errores consola críticos en desktop
  [ ] Copiar src/ → dist/ completo (no solo archivos sueltos)
  [ ] Verificar dist/index.html incluye cambios recientes (scripts, copy)
  [ ] Si kairos-core conectado: verificar +12 MB en dist/engines/kairos-core/wasm/
  [ ] firebase.json apunta a dist/
  [ ] No commitear .DS_Store ni .firebase/


COMANDO TÍPICO SYNC
───────────────────

  rsync -av --delete src/ dist/
  (excluir .DS_Store si procede)


POST-DEPLOY
───────────

  [ ] Probar https://kairos-maps-mvp.web.app en desktop
  [ ] Verificar auto-calc con perfil existente
  [ ] Verificar interpretación al click ciudad
  [ ] NO prometer UX móvil hasta reabrir fase móvil
  [ ] Actualizar VERSION.md con commit desplegado y fecha


ROLLBACK
────────

  git checkout <commit-anterior> -- dist/
  firebase deploy --only hosting
  (solo si Roberto lo autoriza)


════════════════════════════════════════════════════════
15. REFERENCIA RÁPIDA PARA GPT
════════════════════════════════════════════════════════


Pregunta: "¿Qué motor usa el mapa?"
  → astro.js + astronomy-engine. Solo UTC. No Swiss Ephemeris.

Pregunta: "¿Hay carta natal?"
  → Copiada en kairos-core/ pero NO conectada a la app.

Pregunta: "¿Puedo tocar móvil?"
  → No, congelado beta. Solo bug crítico.

Pregunta: "¿Qué desplegar?"
  → dist/ sincronizado desde src/. HEAD: 773ecec. dist puede ir retrasado.

Pregunta: "¿Próximo paso?"
  → 2.0B/2.0C desktop O 2.1a-1 golden tests natal.


════════════════════════════════════════════════════════
FIN DEL DOCUMENTO
════════════════════════════════════════════════════════

*Documento de continuidad. No modifica comportamiento de la app.*
*Actualizar tras cada fase cerrada o deploy significativo.*
