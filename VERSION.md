# Kairos Maps — Seguimiento de versiones

## Proyecto

**Nombre:** Kairos Maps MVP  
**Repositorio:** `KAIROS-MAPS-MVP`  
**Entrada app:** `src/index.html`  
**Última actualización doc:** 22 mayo 2026

---

## Versiones

| Componente | Versión | Notas |
|------------|---------|--------|
| **App (UI)** | **v0.2 · Fase 1.8** | Responsive móvil + refinamiento UX P0 (working tree) |
| **Motor (`astro.js`)** | **v0.2 · Fase 1.3–1.4** | `astronomy-engine@2.1.19`, 40 líneas, fix antimeridiano visual |
| **Interpretaciones** | **v0.2** | `interpretations.js` — 40 combinaciones planeta × ángulo |
| **Onboarding / perfil** | **Fase 1.1–1.2** | LocalStorage, autocompletado Nominatim |

---

## Último commit (git)

```
be56c91 — Fase 1.6 deploy Firebase Hosting
2026-05-22 22:42:24 +0200
```

**Pendiente de commit:** Fase 1.7 (UX móvil base) + Fase 1.8 (refinamiento UX móvil P0) en `src/`.

---

## Hosting Firebase

| Campo | Valor |
|-------|--------|
| **Proyecto** | `kairos-maps-mvp` |
| **URL principal** | https://kairos-maps-mvp.web.app |
| **URL alternativa** | https://kairos-maps-mvp.firebaseapp.com |
| **Carpeta publicada** | `dist/` (copia de `src/`) |
| **Auth / Firestore** | No activos (solo Hosting estático) |

---

## Estado desktop (>768px)

| Área | Estado |
|------|--------|
| Layout sidebar + mapa | ✅ Estable |
| Formulario natal + calcular | ✅ OK |
| Líneas astrocartográficas (40) | ✅ OK |
| Overlays regionales / medallones | ✅ Fase 1.4 |
| Panel interpretación lateral | ✅ OK |
| Búsqueda ciudades + Nominatim | ✅ OK |
| Onboarding 5 pasos | ✅ OK |

**Sin cambios intencionados en desktop desde Fase 1.6.**

---

## Estado móvil (≤768px)

| Área | Estado |
|------|--------|
| Mapa protagonista (modo `map`) | ✅ Fase 1.7–1.8 |
| Barra superior: Mapa / Controles / Lectura | ✅ Compacta, z-index sobre backdrop |
| Modos únicos: `map` · `controls` · `lectura` | ✅ Un panel a la vez |
| Sheet Controles (sidebar) | ✅ Funcional; secciones no esenciales ocultas (P0) |
| Panel Lectura cerrado por defecto | ✅ `display: none` |
| Lectura visible tras tocar ciudad | ✅ Sin salto de layout (P0) |
| Targets táctiles (ciudades, pills, barra) | ✅ P0 |
| Chrome Leaflet reducido | ✅ Zoom oculto; atribución minimizada |
| Búsqueda flotante en mapa | ⏸ Oculta en móvil (desktop intacto) |

---

## Últimas mejoras

### Fase 1.6 — Deploy Firebase Hosting (`be56c91`)
- Configuración `firebase.json` + `.firebaserc`
- Carpeta `dist/` para publicación
- Responsive móvil inicial (barra, sheets, `mobileMode`)

### Fase 1.7 — UX móvil base (local)
- Eliminado hint central en móvil
- Estado `map` / `controls` / `lectura`
- Overlays flotantes ocultos en móvil
- Panel lectura con `display: none` cerrado

### Fase 1.8 — Refinamiento UX móvil P0 (local)
- Barra superior por encima del backdrop (`z-index: 900`)
- Targets táctiles ampliados (ciudades, angle-pills, botones 44px)
- Ocultos en móvil: Sobre Kairos, Reiniciar perfil, legend-empty
- Leaflet: zoom oculto; atribución minimizada
- Lectura sin salto visual (espacio reservado)
- Padding reducido en sheets; `overscroll-behavior: contain`
- Eliminado flash blanco inicial del `<body>`

### Motor / mapa (commits previos)
- **1.3** — Densificado visual líneas AC/DC; antimeridiano en motor
- **1.4** — Overlays regionales mejorados

---

## Próximos pasos

1. **Commit** Fase 1.7 + 1.8 y redeploy Firebase (`dist/` ← `src/`)
2. **Fase 1.9** — Refinamiento P1 móvil: animación cierre sheets, tipografía menos técnica en Controles
3. **Fase 2.0** — Sheet Controles nativo móvil (no adaptación visual del sidebar desktop)
4. **Opcional** — Búsqueda bajo demanda en móvil (icono en barra, sin feature nueva de negocio)
5. **Limpieza** — Eliminar logs `[KAIROS-DEBUG]` cuando cierre depuración
6. **Fuera de alcance MVP** — Auth, Firestore, premium, motor KAIROS principal

---

## Historial de fases (referencia)

| Fase | Commit / estado | Descripción |
|------|----------------|-------------|
| 0 | `c2559b7` | Baseline estable |
| 1.1 | `f6116b7` | Onboarding + perfil local |
| 1.2 | `97440d2` | Overlays KAIROS en mapa |
| 1.3 | `67651a8` | Líneas astrocartográficas (visual + antimeridiano) |
| 1.4 | `9153754` | Overlays regionales |
| 1.6 | `be56c91` | Firebase Hosting |
| 1.7–1.8 | working tree | UX móvil + refinamiento P0 |

---

*Documento de seguimiento. No modifica comportamiento de la app.*
