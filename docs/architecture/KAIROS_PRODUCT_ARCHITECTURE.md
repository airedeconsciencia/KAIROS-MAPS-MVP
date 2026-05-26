# KAIROS MAPS — Arquitectura de producto y roadmap técnico

**Documento interno DEV** · Mayo 2026  
**Estado:** referencia viva post-Fase 2.2c  
**Alcance:** planificación estratégica — no modifica producción ni código

---

## 1. Estado actual del proyecto

### Qué existe y funciona hoy

| Área | Estado | Notas |
|------|--------|-------|
| **Mapa astrocartográfico** | Operativo | Leaflet, líneas planetarias sobre geografía, desktop-first |
| **Líneas AC / DC / MC / IC** | Operativo | Motor `astro.js` — cálculo simplificado en cliente, independiente del motor natal |
| **Motor natal Swiss Ephemeris** | Integrado | `src/engines/kairos-core/` + WASM (`swisseph.wasm`, `swisseph.data`) |
| **KairosChartService** | Operativo | `src/services/chart-service.js` — API única para carta natal |
| **state.chart.natal** | Operativo | Hook silencioso en `app.js` (2.1a-3b), fail-soft |
| **Panel natal lite FREE** | Operativo | Fase 2.2a–2.2c: shell, render, wire + glifos Kairos inline |
| **Golden tests natal** | PASS 75/75 | `src/dev/golden/` — G1, G2, G3 vs referencia Astro.com |
| **Iconografía Kairos** | Operativa | `assets/kairos_symbols/planets/` + `signs/` — SVG propios, no Unicode |
| **Perfil / onboarding** | Operativo | Datos natales, foco de lectura, persistencia local |
| **Líneas activas + toggles** | Operativo | Filtro planetas/ángulos, símbolos opcionales en mapa |
| **Natal Lab DEV** | Operativo | `src/dev/natal-view.*` — laboratorio aislado de carta completa |

### Qué está calculado pero no expuesto en UI FREE

El motor natal **ya produce** casas Placidus, aspectos y cuerpos extendidos. El panel lite FREE **no los muestra** por diseño de producto, no por limitación técnica del motor.

### Qué no existe aún

- Relocación avanzada por ciudad en producción
- Capas premium / paywall
- Cuentas, backend de cartas, pagos
- Interpretación IA conectada al mapa
- Rueda zodiacal interactiva
- Estrategia móvil definida (UX congelada en `@media max-width: 768px`)

---

## 2. Arquitectura por capas

Separación obligatoria entre responsabilidades. Cada capa tiene un contrato; no se saltan niveles.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA 5 — MONETIZACIÓN / CUENTAS (futuro)                       │
│  Stripe · Firebase Auth · entitlements · feature flags          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  CAPA 4 — INTERPRETACIÓN IA (futuro)                            │
│  Prompts · contexto carta+mapa · Anthropic API · cache respuesta│
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  CAPA 3 — RENDER UI                                           │
│  app.js · natal-panel.js · overlays · estilos · onboarding      │
│  Solo consume servicios; nunca calcula efemérides               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  CAPA 2 — SERVICIOS                                           │
│  chart-service.js (natal) · astro.js wrapper (líneas mapa)      │
│  Normalización input · cache · fail-soft · state.chart          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  CAPA 1 — MOTOR MATEMÁTICO (congelado salvo golden)             │
│  kairos-core: planetary · chart · aspects · WASM                │
│  astro.js: proyección astrocartográfica (pipeline paralelo)     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  CAPA 0 — SYNC BACKEND FUTURO                                 │
│  Firestore perfil · cache cartas · histórico · PDF cloud        │
└─────────────────────────────────────────────────────────────────┘
```

### Contratos entre capas

| De → A | Contrato |
|--------|----------|
| UI → Servicios | `KairosChartService.generateNatalChart(input)` → `state.chart.natal` |
| UI → Servicios | `calculateMap()` → `state.lines` (astro.js) |
| Servicios → Motor natal | `generateFullChart()` vía chart-service; input Luxon UTC |
| Servicios → Motor mapa | `computeAllLines(utc, lat, lon)` — sin importar kairos-core |
| IA → Servicios | Lee snapshot serializado de carta + líneas activas; no recalcula |
| Backend futuro | Replica o cachea output de servicios; no reemplaza motores en Fase 3–4 |

---

## 3. Modelo FREE

Lo que el usuario obtiene sin pago. Debe ser útil, estable y demostrable.

### Carta y panel

- **Sol, Luna, ASC, MC** — cards con signo, grado, glifo Kairos
- **7 planetas clásicos** — Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno (tabla)
- **Panel natal lite** — vista esencial; sin casas, sin aspectos, sin cuerpos menores
- **Nota UTC + teaser Premium** — transparencia de cálculo, sin bloqueo agresivo

### Mapa astrocartográfico

- **Líneas básicas** AC, DC, MC, IC por planeta seleccionable
- **10 planetas en mapa** (según toggles actuales)
- **Relocación simple** — lectura del mapa desde carta natal fija (sin recalcular ángulos por ciudad en FREE avanzado)
- **Lectura básica de ciudades** — popup / hint contextual (sin scoring IA profundo)

### Límites explícitos FREE

- No casas completas en UI
- No aspectos
- No Quirón, Lilith, nodos, generacionales avanzados en panel
- No sinastría, compuesta, Davidson
- No PDF, no “mejor ciudad para X” con ranking IA
- No overlays compuestos ni timing geográfico

---

## 4. Modelo PREMIUM

Capa de valor diferencial. Reutiliza motor ya existente; el trabajo es **UI, permisos y narrativa**, no reescribir efemérides.

### Carta natal completa

- Rueda zodiacal (visual)
- **Casas Placidus** — 12 cúspides, planetas en casa
- **Aspectos** — lista + orbes configurables
- **Cuerpos extendidos:** Quirón, Lilith, Nodos (mean/true), Urano, Neptuno, Plutón con profundidad interpretativa

### Astrocartografía avanzada

- **Relocación avanzada** — recalcular ASC/MC y casas para coordenadas de destino
- **Overlays compuestos** — múltiples capas, comparación visual
- **Timing geográfico** — tránsitos / progresiones sobre mapa (futuro)
- **Heatmaps planetarios** — densidad de influencia por región

### Relaciones y destinos

- **Compatibilidad ciudades** — score carta × lugar
- **Sinastría** — dos perfiles
- **Carta compuesta** y **Davidson**
- **“Mejor ciudad para…”** — amor, dinero, salud, hogar (ranking + explicación)

### Entrega y IA

- **Interpretación IA** — lectura profunda carta + mapa + objetivo usuario
- **PDF premium** — export carta + mapa + informe
- **Historial y comparador** — guardar escenarios de relocación

### Implementación técnica Premium (cuando llegue)

- Feature flags / `entitlements.premium` en capa 5
- UI condicional en render modules (`natal-panel-premium.js`, etc.)
- Mismo `KairosChartService`; filtrar output en UI según tier
- No duplicar motores por tier

---

## 5. Roadmap recomendado

Orden realista basado en dependencias técnicas y riesgo.

### FASE 3 — Estabilidad y polish (próximo bloque)

| ID | Entrega | Prioridad |
|----|---------|-----------|
| 3.1 | Golden tests en CI / pre-deploy gate | Alta |
| 3.2 | Lazy load WASM — cargar Swiss Ephemeris solo cuando hace falta natal | Alta |
| 3.3 | Panel expandible — acordeón casas/aspectos (Premium-ready, gated) | Media |
| 3.4 | UX polish desktop — estados loading/error, accesibilidad glifos | Media |
| 3.5 | Estrategia móvil — documento + prototipo; levantar freeze con criterios | Alta |
| 3.6 | Performance audit — sidebar, mapa, doble pipeline natal+mapa | Media |

**Criterio de salida Fase 3:** golden PASS, WASM bajo demanda, panel estable, decisión móvil escrita.

### FASE 4 — Relocación y capas premium

| ID | Entrega | Prioridad |
|----|---------|-----------|
| 4.1 | Relocación avanzada — API servicio + UI ciudad destino | Alta |
| 4.2 | Casas + aspectos en UI (Premium gate) | Alta |
| 4.3 | Overlays compuestos en mapa | Media |
| 4.4 | Comparador ciudades (2+ destinos) | Media |
| 4.5 | Cuerpos menores y generacionales en panel completo | Baja |

**Criterio de salida Fase 4:** relocación validada con golden extendido; premium UI demostrable en DEV.

### FASE 5 — IA, cuentas y backend

| ID | Entrega | Prioridad |
|----|---------|-----------|
| 5.1 | Firebase Auth + perfil cloud | Alta |
| 5.2 | Entitlements + Stripe | Alta |
| 5.3 | Interpretación IA — pipeline contexto carta+mapa | Media |
| 5.4 | Cache Firestore cartas calculadas | Media |
| 5.5 | PDF premium | Baja |
| 5.6 | Sinastría / compuesta / Davidson | Baja |

**Criterio de salida Fase 5:** usuario paga → desbloquea features; IA fail-soft; datos mínimos en cloud.

---

## 6. Reglas arquitectónicas

Reglas no negociables para cualquier sprint futuro.

1. **No mezclar `astro.js` con `kairos-core`.** Pipelines paralelos. Astrocartografía simplificada ≠ carta natal Swiss Ephemeris.
2. **`KairosChartService` es la API única natal.** UI y IA nunca llaman motores congelados directamente.
3. **Fail-soft siempre.** Error natal no bloquea mapa. Error mapa no bloquea perfil.
4. **Mobile freeze** hasta estrategia Fase 3.5 aprobada. No parches móviles ad hoc.
5. **UI desacoplada del motor.** Render = HTML/modules puros; mounting en `app.js` o equivalente.
6. **No tocar producción sin golden PASS.** 75/75 mínimo antes de deploy `dist/`.
7. **Motores congelados** (`planetary_engine`, `chart_engine`, etc.) — cambios solo con casos golden nuevos y aprobación explícita.
8. **Iconografía Kairos obligatoria** — SVG en `assets/kairos_symbols/`; no Unicode zodiacal en UI.
9. **Commits quirúrgicos** — una fase, archivos acotados, mensaje en español descriptivo.
10. **Documentación DEV en `docs/`** — no mezclar con assets de producción ni `dist/`.

---

## 7. Ideas futuras (backlog exploratorio)

Sin compromiso de fecha. Evaluar tras Fase 5.

| Idea | Valor | Complejidad | Dependencia |
|------|-------|-------------|-------------|
| Rueda zodiacal interactiva | Alto visual | Media | Panel premium |
| Timeline tránsitos | Alto analítico | Alta | Motor + UI temporal |
| Revolución solar / lunar | Medio | Alta | Extensión chart-service |
| Comparador ciudades side-by-side | Alto producto | Media | Relocación 4.1 |
| Heatmaps planetarios | Alto diferencial | Alta | Mapa + agregación |
| Destinos favorables automáticos | Alto conversión | Alta | IA + scoring |
| Notificaciones “ventana astrológica” | Medio | Alta | Backend + push |
| Modo offline carta cacheada | Medio | Media | Service worker |
| API pública B2B astrocartografía | Bajo corto plazo | Muy alta | Backend dedicado |

---

## Referencias internas

| Documento | Ubicación |
|-----------|-----------|
| Integración motor natal 2.1a | `docs/phase-2.1a-integration.md` |
| Arquitectura datos usuario | `docs/architecture.txt` |
| Roadmap histórico MVP/V2 | `docs/roadmap.txt` |
| Golden tests | `src/dev/golden/golden-test.html` |
| Natal Lab DEV | `src/dev/natal-view.html` |

---

*Última revisión: post-commit Fase 2.2c · Panel natal lite FREE aprobado visualmente*
