# KAIROS MAPS — Estado Natal Lite (Fase 3.4)

**Documento de cierre técnico y checklist pre-deploy**  
**Fecha de referencia:** 2026-05-27  
**Rama:** `main`  
**Último commit interpretativo:** `1911c3b` — 3.3d3 fragmentos pilot gaps taurus pisces

---

## 1. Estado actual

| Aspecto | Estado |
|---------|--------|
| Preview en panel **Carta** | ✅ Visible bajo micro-resumen humano cuando `chart.status === 'ready'` |
| Compositor activo | ✅ `KairosNatalComposition.composeNatalLiteReading()` |
| Capa de contenido | ✅ 23 fragmentos pilot en `natal-lite.js` |
| Cobertura lite (Sol / Luna / Asc) | **7/12 · 7/12 · 9/12** |
| Debug editorial | ✅ `KairosNatalLiteDebug.inspect()` / `.stats()` |
| Fail-soft UI | ✅ Bloque oculto si falta fragmento o `ok !== true` |
| Smoke automatizado | ✅ 2 scripts Node (composición + debug) |
| Golden gate motor | ✅ Script manual (`golden-gate.sh`) — independiente de interpretación |

### Commits de la fase 3.3 (interpretativa natal lite)

| Commit | Descripción |
|--------|-------------|
| `fb9a409` | 3.3a — scaffold arquitectura + fragmentos pilot iniciales |
| `c07e3d6` | 3.3b5 — compositor, estilo, anti-cliché |
| `f563ef4` | 3.3c1 — smoke composición permanente |
| `b0be6e4` | 3.3c2 — preview lectura en panel Carta |
| `8db446b` | 3.3d1 — cobertura mínima demo (G1, ASC/MOON extra) |
| `af6c799` | 3.3d2 — debug `inspect` / `stats` |
| `1911c3b` | 3.3d3 — gaps taurus / pisces |

---

## 2. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  UI — panel Carta (natal-panel.js)                          │
│  syncLiteReading() · fail-soft · logs [Natal Lite] debug    │
└───────────────────────────────┬─────────────────────────────┘
                                │ slugs sun/moon/asc
┌───────────────────────────────▼─────────────────────────────┐
│  COMPOSICIÓN — services/natal-composition-service.js        │
│  composeNatalLiteReading() · tensión · anti-cliché · bridge   │
└───────────────────────────────┬─────────────────────────────┘
                                │ lookupBySlug
┌───────────────────────────────▼─────────────────────────────┐
│  CONTENIDO — content/natal-lite.js                          │
│  FRAGMENTS · MODULES · KairosNatalLiteDebug                 │
└───────────────────────────────┬─────────────────────────────┘
                                │ chart.planets / angles.sign
┌───────────────────────────────▼─────────────────────────────┐
│  CÁLCULO — chart-service + kairos-core (NO interpretación)  │
└─────────────────────────────────────────────────────────────┘
```

### Archivos clave

| Archivo | Rol |
|---------|-----|
| `src/content/natal-lite.js` | Fragmentos curados, índice `NATAL_LITE`, API `KairosNatalLite`, debug `KairosNatalLiteDebug` |
| `src/services/natal-composition-service.js` | Composición JSON/string sin DOM ni HTML |
| `src/ui/natal-panel.js` | Montaje preview, conversión signo ES → slug, fail-soft |
| `src/index.html` | Carga scripts + `#natal-lite-reading-root` (commit 3.3c2) |
| `scripts/dev-natal-composition-smoke.sh` | Smoke compositor (5 casos) |
| `scripts/dev-natal-lite-debug-smoke.sh` | Smoke cobertura / inspect / stats |
| `scripts/golden-gate.sh` | Gate motor natal (75 comparaciones) |
| `docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md` | Contrato arquitectónico Fase 3.3 |

### Fail-soft

Si falta **cualquiera** de los tres fragmentos (Sol, Luna, Asc):

1. `composeNatalLiteReading` → `{ ok: false, error: 'FRAGMENT_MISSING', missing: [...] }`
2. `syncLiteReading` oculta `#natal-lite-reading-root` sin mensaje al usuario
3. Con `?debug=1` → logs `[Natal Lite]` y `[Natal Lite Debug]` en consola

---

## 3. Qué funciona

### Perfiles y demos verificados

| Caso | Slugs | inspect | composición |
|------|-------|---------|-------------|
| **Roberto** (1973-05-29 Maó) | gemini / aries / cancer | ✅ 100% | ✅ ok:true |
| **Golden G1** (1990-06-12 Maó) | gemini / aquarius / libra | ✅ 100% | ✅ ok:true |
| **G2 Madrid** (1985-03-31 DST) | aries / cancer / aries | ✅ 100% | ✅ ok:true |
| **Gaps 3.3d3-A** | taurus / pisces / leo | ✅ 100% | ✅ ok:true |
| **Gaps 3.3d3-B** | taurus / aries / taurus | ✅ 100% | ✅ ok:true |

### Comportamiento UI

- Preview aparece en pestaña **Carta** (workspace `natal`), no en Mapa
- Micro-resumen humano (Sol · Luna · Asc) independiente del bloque de lectura
- Carta calculada + fragmentos completos → lectura compuesta visible
- Carta calculada + fragmento faltante → panel carta normal, **sin** bloque lectura

---

## 4. Qué NO está hecho

| Ámbito | Estado |
|--------|--------|
| Zodiaco completo (12×3 fragmentos lite) | ❌ ~58% roles cubiertos en media |
| UI avanzada (acordeones, capas, tabs interpretativos) | ❌ |
| IA / LLM | ❌ explícitamente fuera de alcance |
| Relocación interpretativa | ❌ teaser only |
| Sinastría / pareja interpretativa | ❌ teaser only |
| Destino / premium interpretativo | ❌ |
| Corpus editorial OneDrive integrado en runtime | ❌ fuente externa, no cargada |
| Mensaje fail-soft visible al usuario (“contenido próximamente”) | ❌ por diseño |
| `dist/` sincronizado con src interpretativo | ⚠️ verificar antes de deploy estático |

---

## 5. Riesgos actuales

### Cobertura parcial

Gaps restantes (`stats().gaps`):

- **SUN:** libra, scorpio, sagittarius, aquarius, pisces
- **MOON:** taurus, leo, virgo, libra, scorpio
- **ASC:** virgo, sagittarius, capricorn

Muchas cartas reales seguirán sin preview aunque el motor calcule bien.

### Repetición de estilo

- Patrones recurrentes en pilot: “puede…”, “a veces…”, “no siempre es…”
- Sol/Luna/Asc del mismo elemento (p. ej. tierra) pueden sonar cercanos en composición
- `ASC_TAURUS` / `SUN_TAURUS` comparten vocabulario de ritmo lento — vigilar en lecturas compuestas

### Warnings compositor

- Casos como G1 pueden emitir `styleWarnings: ["excess_puede","excess_a_veces"]` al unir 3 fragmentos
- No bloquean smoke; indican densidad modal acumulada

### Revisión editorial incompleta

- Fragmentos pilot redactados en-repo; **no** pasaron revisión contra corpus completo OneDrive
- Posible divergencia entre `docs/voice_tone.txt` / `NATAL_INTERPRETATION_ARCHITECTURE.md` y textos en `natal-lite.js`
- Algunos ASC usan versión `1.0.0-pilot-placeholder`

### Operativos

- Servir desde `dist/` en lugar de `src/` → preview ausente (scripts no cargados)
- Usuario en tab Mapa → no ve bloque (esperado, no bug)
- Mobile (≤768px) → panel carta `skipped`, sin preview

---

## 6. Cómo probar

### Smoke (Node, sin navegador)

```bash
./scripts/dev-natal-composition-smoke.sh    # 5 casos · OVERALL: PASS
./scripts/dev-natal-lite-debug-smoke.sh     # inspect + stats · OVERALL: PASS
```

### Golden gate (motor, manual)

```bash
./scripts/golden-gate.sh
# Abrir URL indicada · ejecutar suite · esperar 75/75 PASS
```

### Visual local (interpretación)

```bash
cd src && python3 -m http.server 8091
# http://localhost:8091/index.html?debug=1
# 1. Perfil con carta calculada
# 2. Pestaña Carta
# 3. Ver bloque bajo resumen humano
# 4. Consola: KairosNatalLiteDebug.stats()
# 5. KairosNatalLiteDebug.inspect({ sun, moon, asc })
```

### Debug rápido desde consola (carta ready)

```javascript
const c = window.__kairosDebug.chart.natal;
const P = window.KairosNatalPanel;
KairosNatalLiteDebug.inspect({
  sun: P.signSlug(c.planets.SUN.sign),
  moon: P.signSlug(c.planets.MOON.sign),
  asc: P.signSlug(c.angles.ASC.sign)
});
KairosNatalLiteDebug.stats();
```

---

## 7. Criterio para deploy

Checklist mínimo antes de publicar versión FREE pilot con Natal Lite:

| # | Criterio | Comando / acción |
|---|----------|------------------|
| 1 | Golden motor | `./scripts/golden-gate.sh` → **75/75 PASS** |
| 2 | Smoke composición | `./scripts/dev-natal-composition-smoke.sh` → **PASS** |
| 3 | Smoke debug | `./scripts/dev-natal-lite-debug-smoke.sh` → **PASS** |
| 4 | Preview visual | Carta tab · perfil Roberto o G1 · bloque visible |
| 5 | Working tree limpio | `git status` sin cambios sin commit |
| 6 | Build dist (si aplica) | Copiar/sincronizar `src/` → `dist/` incluyendo natal-lite scripts |
| 7 | Hard refresh | Verificar carga `natal-lite.js` + `natal-composition-service.js` |

**Estado smoke al cierre 3.4 (local):** composición PASS · debug PASS · golden no re-ejecutado en esta sesión (última referencia conversación: 75/75).

---

## 8. Próximas rutas posibles

### A) Seguir contenido por gaps reales

- Usar `KairosNatalLiteDebug.stats()` + `inspect()` con perfiles de usuario
- Añadir fragmentos **solo** cuando aparezcan en `missing` con frecuencia
- Candidatos probables (no prioritarios hasta evidencia): `SUN_LIBRA`, `MOON_LEO`, `ASC_VIRGO`
- Evitar completar 36/36 por ansiedad de cobertura

### B) Cerrar y desplegar versión FREE pilot

- Sincronizar `dist/`
- Deploy estático con preview Natal Lite para demos conocidas
- Aceptar fail-soft silencioso para cartas sin pilot
- Documentar cobertura en release notes

### C) Arquitectura reloc-lite

- Extender contrato interpretativo a delta natal↔ciudad
- Reutilizar compositor / tags / puente mapa
- Sin tocar motores de cálculo reloc en primera iteración

### D) Integrar documentos fuente Kairos (controlado)

- Pipeline editorial: OneDrive → revisión humana → fragmento versionado en `natal-lite.js`
- Sin carga runtime de docs externos
- Checklist voz/tono por fragmento antes de merge

---

## Referencias cruzadas

- Arquitectura: [`NATAL_INTERPRETATION_ARCHITECTURE.md`](./NATAL_INTERPRETATION_ARCHITECTURE.md)
- Voz: [`../voice_tone.txt`](../voice_tone.txt)
- Golden perfiles: [`../../src/dev/golden/golden-charts.json`](../../src/dev/golden/golden-charts.json)

---

*Documento generado en Fase 3.4. No modifica runtime. Actualizar tras cada batch editorial (3.3d*) o antes de deploy.*
