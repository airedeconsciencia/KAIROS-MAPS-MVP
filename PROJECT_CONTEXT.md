# Kairos Maps — Contexto del proyecto

## Qué es

Kairos Maps es una herramienta de **orientación espacial y humana** basada en **astrocartografía y relocación**. No es una app de horóscopos genéricos: ayuda a explorar cómo distintos lugares del mundo pueden activar dimensiones vitales (amor, trabajo, descanso, vínculos, etc.) con un tono contenido, elegante y terapéutico.

## Versión estable — Fase 0 (antes de Fase 1)

**Etiqueta:** `fase-0-stable` · **Fecha:** 22 mayo 2026

> **Fase 0 completada:** mapa funcionando, motor cargando 40 líneas, búsqueda y panel operativos.

Estado verificado de esta baseline (no tocar la app al iniciar Fase 1 salvo bugfix explícito):

| Componente | Estado |
|------------|--------|
| Mapa Leaflet (tiles oscuros, zoom) | OK |
| UI / sidebar / formulario natal | OK |
| Motor astronómico (`astro.js` + `astronomy.browser.min.js`) | OK — 40 líneas al calcular |
| Búsqueda (ciudades preset + Nominatim) | OK |
| Panel interpretación (amor / trabajo / descanso) | OK |
| Cuenta / Firebase / onboarding / IA | Fuera de alcance (Fase 1+) |

**Entrada de la app:** `src/index.html`  
**Archivos congelados para esta versión:** `src/ui/app.js`, `src/ui/styles.css`, `src/engines/astro.js`, `src/content/interpretations.js`  
**Referencia empaquetada original:** `legacy/Kairos Maps _standalone_ (1).html`

Nota técnica de esta baseline: el CDN debe usar `astronomy.browser.min.js` (no `astronomy.min.js`). Hay logs temporales `[KAIROS-DEBUG]` en `app.js` y `astro.js` — eliminar cuando cierre la depuración.

---

## Estado actual (Fase 0)

- **App principal:** `src/index.html` (desempaquetada desde `legacy/Kairos Maps _standalone_ (1).html`)
- **Motores:** `src/engines/astro.js` (cálculo de líneas, astronomy-engine)
- **Textos:** `src/content/interpretations.js` (40 combinaciones planeta × ángulo)
- **UI:** `src/ui/styles.css`, `src/ui/app.js`
- **Documentación:** `docs/`
- **Versiones anteriores:** `legacy/`

## MVP — prioridad real

Validar si la gente encuentra valor en **explorar lugares** con astrología contextual. El núcleo:

1. Datos natales → calcular líneas
2. Mapa interactivo → explorar
3. Ciudad → interpretación útil (amor / trabajo / descanso)

Fuera del MVP inicial: Firebase, IA generativa, onboarding de 9 pantallas, relocación avanzada, premium, comunidad.

## Principios de producto

- Humano antes que técnico
- Lenguaje condicional (“puede favorecer…”), sin promesas absolutas
- Mapa contemplativo, diseño oscuro premium (`#0F1115`, acento `#d7c188`)
- Privacidad por diseño (datos de nacimiento sensibles)

## Cómo abrir la app

Desde la raíz del proyecto, servir `src/` con un servidor local (necesario por búsqueda de ciudades y CDN):

```bash
cd src && python3 -m http.server 8080
```

Abrir: http://localhost:8080/

## Relación con KAIROS principal

Kairos Maps es un **spin-off** del ecosistema KAIROS. Los motores congelados del proyecto grande (`planetary_engine.js`, etc.) no están integrados aún; el motor actual (`astro.js`) usa **astronomy-engine** en cliente.

## Roadmap documentado

Ver `docs/roadmap.txt`, `docs/architecture.txt`, `docs/onboarding.txt`, `docs/interpretations.txt`, `docs/voice_tone.txt`, `docs/visual_identity.txt`, `docs/astro_engine.txt`.
