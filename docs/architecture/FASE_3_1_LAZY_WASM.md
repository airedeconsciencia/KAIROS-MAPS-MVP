# Fase 3.1 — Lazy WASM y golden gate pre-deploy

**Documento interno DEV** · Mayo 2026  
**Estado:** cerrada (3.1a–3.1e)  
**Alcance:** rendimiento cold start + guard manual antes de deploy

---

## 1. Qué cambió en Fase 3.1

| Commit | Cambio |
|--------|--------|
| **3.1a** | `bootstrap.js` ya no auto-inicializa WASM al cargar la página |
| **3.1b** | `natal-engine-loader.js` + carga lazy en `chart-service.js` |
| **3.1c** | `index.html` sin scripts kairos-core en cold start |
| **3.1d** | Harness DEV (golden, natal-view, natal-test) usa el mismo pipeline |
| **3.1e** | `scripts/golden-gate.sh` + esta documentación |

**Motores congelados (`planetary_engine`, `chart_engine`, etc.):** no modificados.  
**Mapa (`astro.js`):** pipeline independiente, intacto.

---

## 2. Lazy WASM — arquitectura

```
Cold start (index.html, DEV pages)
  luxon
  natal-engine-loader.js   ← solo JS (~2 KB), sin WASM
  chart-service.js
  astro.js + UI…

Bajo demanda (primer initNatalEngine / generateNatalChart)
  natal-engine-loader.load()
    → aspects_engine.js
    → planetary_engine.js
    → chart_engine.js
    → bootstrap.js (module)
         → swisseph.js + swisseph.wasm + swisseph.data (~12.5 MB)
  initKairosCore() → initPlanetaryEngine() → carta natal
```

### Cold start — qué NO se carga

- `swisseph.data` (~12 MB)
- `swisseph.wasm` (~530 KB)
- `swisseph.js` (~72 KB) hasta el loader
- Scripts clásicos kairos-core (`aspects`, `planetary`, `chart`)
- `window.swisseph_native` / `generateFullChart`

### Bajo demanda — qué SÍ se carga

- Los cuatro módulos anteriores + binarios WASM
- Primera init típica: ~30–60 ms en local (varía por red/cache)
- Cálculos posteriores: cache en `chart-service` por birthKey

---

## 3. Medición de referencia (local)

| Métrica | Antes (pre-3.1) | Después (3.1c+) |
|---------|-----------------|-----------------|
| `swisseph.data` en cold start | ~12 MB | **0** |
| `swisseph.wasm` en cold start | ~530 KB | **0** |
| WASM al abrir app | Sí (auto-init) | **No** |
| Golden G1–G3 | 75/75 PASS | **75/75 PASS** |

---

## 4. Cómo probar manualmente

Servir siempre desde `src/`:

```bash
cd src
python3 -m http.server 8099
```

O usar el gate:

```bash
./scripts/golden-gate.sh
```

### 4.1 Golden tests (obligatorio pre-deploy)

**URL:** `http://localhost:8099/dev/golden/golden-test.html`

1. Pulsar «Ejecutar golden tests».
2. Confirmar **PASS**, **0 FAIL**, **75/75**.
3. Consola: `window.__goldenTestResult.allPass === true`

Casos: **G1** Maó, **G2** Madrid DST, **G3** Buenos Aires.

### 4.2 App principal — index.html

**URL:** `http://localhost:8099/index.html` (ventana **>768px**)

1. DevTools → Network: **no** debe aparecer `swisseph.data` al cargar.
2. Completar onboarding / perfil.
3. «Calcular mi mapa» → mapa con líneas OK.
4. Panel «Tu carta natal» → datos reales (Sol, Luna, ASC, MC, tabla 7 planetas).
5. Consola (`?debug=1`): `window.__kairosDebug.chart.status === "ready"`.

### 4.3 Natal Lab DEV

**URL:** `http://localhost:8099/dev/natal-view.html`

- Preset **G1 Maó** → Calcular → UTC `1990-06-12T12:35:00.000Z`, ASC Libra.

### 4.4 Natal test harness

**URL:** `http://localhost:8099/dev/natal-test.html`

- Debe mostrar **`TEST PASSED`** al final del log.
- Consola: `window.__natalTestResult.ok === true`

---

## 5. Checklist pre-deploy

Ejecutar **antes** de `rsync src/ → dist/` o `firebase deploy`:

- [ ] `./scripts/golden-gate.sh` (o equivalente manual)
- [ ] Golden **75/75 PASS**, `allPass: true`, **0 FAIL**
- [ ] `index.html` — mapa + panel natal tras calcular (desktop)
- [ ] Cold start sin `swisseph.data` / `swisseph.wasm` en Network
- [ ] `dev/natal-test.html` — TEST PASSED (recomendado)
- [ ] No hay cambios pendientes no revisados en motores congelados
- [ ] **No deploy** si cualquier ítem falla

### Regla dura

> **No deploy si golden ≠ 75/75 PASS.**

---

## 6. Mobile freeze

- Panel natal desktop-only (`@media max-width: 768px` → `skipped`).
- Estrategia móvil **no definida** — no levantar freeze sin doc Fase 3.5.
- Golden gate **no sustituye** prueba visual móvil del mapa base cuando se modifique `astro.js` o overlays.

---

## 7. Limitaciones actuales

| Limitación | Nota |
|------------|------|
| Gate **manual** | Sin CI ni headless browser (Puppeteer/Playwright pendiente de decisión) |
| Cache bust `?v=3.1c` en index | Tras cambios en services, incrementar versión en script tags |
| `dist/` desincronizado | Deploy requiere sync explícito `src/` → `dist/` |
| Golden no cubre mapa astrocartográfico | Solo motor natal Swiss Ephemeris |
| `/ephe/*.se1` opcional | Motor usa data embebida; golden no depende de `/ephe/` |

---

## 8. Commits Fase 3.1 (referencia)

```
961beb2 Fase 3.1a bootstrap natal init bajo demanda
6cd1a9c Fase 3.1b loader lazy WASM en chart-service
f3a7bdc Fase 3.1c index cold start sin kairos-core WASM
664e611 Fase 3.1d dev harness unificado con natal-engine-loader lazy
(pendiente) Fase 3.1e golden gate local + documentación
```

---

## 9. Siguiente paso recomendado

**Fase 3.2 — Polish UX desktop (sin premium)**

1. Estados loading/error más claros en panel natal (copy, no layout).
2. Métricas debug opcionales (`loadMs`, `wasmMs`) visibles con `?debug=1`.
3. Documento **`MOBILE_STRATEGY.md`** antes de tocar responsive natal.

Alternativa paralela: **sync `dist/` + deploy desktop** solo tras golden gate PASS y aprobación explícita de Roberto.

---

## Referencias

- [KAIROS_PRODUCT_ARCHITECTURE.md](./KAIROS_PRODUCT_ARCHITECTURE.md)
- Golden: `src/dev/golden/golden-test.html`
- Loader: `src/services/natal-engine-loader.js`
- Gate: `scripts/golden-gate.sh`
