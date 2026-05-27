# KAIROS — Arquitectura interpretativa natal y geográfica

**Fase 3.3** · Documento de arquitectura (sin implementación UI)  
**Estado:** scaffold + contrato de capas  
**Alcance:** separación contenido / render / cálculo — **sin IA, sin LLM, sin APIs**

---

## 0. Propósito

Definir cómo KAIROS incorporará interpretación humana **curada y controlada** antes de conectar motores generativos o bases terapéuticas externas.

Este documento **no autoriza** generación automática de textos. Solo fija:

- qué es cada capa interpretativa,
- dónde vive el contenido,
- cómo se consume desde UI futura,
- qué límites éticos y de voz son obligatorios.

---

## 1. Fuentes canónicas (jerarquía editorial)

| Prioridad | Fuente | Ubicación | Rol |
|-----------|--------|-----------|-----|
| 1 | **Libro de Voz y Tono** | `docs/voice_tone.txt` | Tono, prohibiciones, intensidad emocional |
| 2 | **Plantillas mapa ciudad×línea** | `src/content/interpretations.js` | Patrón técnico existente (40 combos) |
| 3 | **Biblioteca extendida mapa** | `docs/interpretations.txt` | Variantes T1–T4, enriquecimiento editorial |
| 4 | **Arquitectura de producto** | `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | FREE vs PREMIUM, módulos |
| 5 | **Arquitectura Interpretativa Avanzada** | OneDrive / doc Kairos *(externo)* | Capas profundas, scoring, IA futura |
| 6 | **Manual Maestro Astrocartografía** | OneDrive / doc Kairos *(externo)* | Ciudad, líneas, objetivos vitales |
| 7 | **Relocación Astrológica** | OneDrive / doc Kairos *(externo)* | Delta natal↔reloc, reorientación vital |

**Regla:** ningún fragmento entra en producción sin pasar por Voz y Tono. Los documentos OneDrive son **fuente editorial**, no runtime.

---

## 2. Qué es interpretación “lite” (FREE — Fase 3.3+)

Interpretación **lite** = micro-insights estáticos, no generativos.

### Es

- Micro insights (1 headline + 2–3 frases máximo por fragmento)
- Tono humano, psicológico, contenido
- Contextual al signo/planeta/ángulo mostrado — **no** a grados exactos
- Puente opcional al mapa (“esta energía también aparece en tus líneas…”)
- Curado, versionado, auditable

### No es

- Predicción (“te pasará X”)
- Fatalismo (“nunca encontrarás…”)
- Diagnóstico clínico o terapéutico
- Horóscopo genérico
- Texto largo tipo informe
- IA / LLM en tiempo real

### Principio (Voz y Tono)

> KAIROS no dice *quién eres*. Ayuda a comprender *qué puede estar vivo* en ti.

---

## 3. Capas interpretativas futuras

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA 6 — IA conversacional (Fase 5+, Anthropic)            │
│  Selecciona/combina fragmentos + contexto; NO recalcula     │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 5 — Ciclos / tránsitos (premium, futuro)             │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 4 — Vínculos: sinastría · compuesta · Davidson       │
│  content/synastry-*.js (futuro)                             │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 3 — Relocación + ciudades objetivo                   │
│  content/reloc-lite.js · content/city-goal.js (futuro)      │
│  Manual Astrocartografía + Relocación Astrológica           │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 2 — Natal profunda (premium)                         │
│  content/natal-premium.js — casas, aspectos, cuerpos       │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 1 — Natal lite (FREE)          ← Fase 3.3 scaffold   │
│  content/natal-lite.js                                      │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│  CAPA 0 — Mapa ciudad×línea (FREE, operativo)              │
│  content/interpretations.js                                 │
└─────────────────────────────────────────────────────────────┘
```

| Capa | Módulo producto | Tier | Estado |
|------|-----------------|------|--------|
| Mapa ciudad×línea | `interpretations.js` | FREE | ✅ Operativo |
| Natal lite | `natal-lite.js` | FREE | 🟡 Scaffold 3.3 |
| Natal profunda | `natal-premium.js` | PREMIUM | ⬜ Futuro |
| Relocación | `reloc-lite.js` | PREMIUM | ⬜ Futuro |
| Ciudades objetivo | `city-goal.js` | PREMIUM | ⬜ Futuro |
| Sinastría / compuesta / Davidson | `relationship-*.js` | PREMIUM | ⬜ Futuro |
| Tránsitos / ciclos | `cycles-*.js` | PREMIUM | ⬜ Futuro |
| IA interpretativa | pipeline Anthropic | PREMIUM | ⬜ Fase 5 |

---

## 4. Qué NO debe hacer KAIROS (obligatorio)

Derivado de `docs/voice_tone.txt` y arquitectura de producto:

| Prohibido | Ejemplo incorrecto |
|-----------|-------------------|
| Sonar místico / mesiánico | “El universo te envía un mensaje…” |
| Prometer destinos | “Este lugar cambiará tu vida” |
| Afirmaciones absolutas | “Eres una persona X” |
| Crear dependencia | “Sin esta app no entenderás tu camino” |
| Lenguaje genérico IA | “Como signo X, siempre…” |
| Dramatismo / miedo | “Cuidado, Saturno te castiga…” |
| Exceso espiritual | “Tu alma elegió este karma…” |
| Copy comercial agresivo | “Desbloquea tu verdadero yo ahora” |

**Intensidad correcta:** orientación, reflexión, posibilidad.  
**Intensidad incorrecta:** certeza, destino, urgencia emocional.

---

## 5. Separación de capas (contrato técnico)

```
Motor (kairos-core / astro.js)
        │  solo números + signos
        ▼
Servicios (chart-service.js)
        │  chart normalizado, cache
        ▼
Contenido (src/content/*.js)
        │  lookup puro, sin DOM, sin fetch
        ▼
Render (natal-panel.js, app.js)
        │  HTML, acordeones, estados
        ▼
Usuario
```

### Reglas no negociables

1. **Contenido nunca importa motores** ni llama `generateFullChart`.
2. **Render nunca contiene strings interpretativos** largos inline (salvo estados UX vacíos).
3. **IA futura** lee snapshot `{ chart, lines, goal, fragments[] }` — no recalcula efemérides.
4. **Fail-soft:** fragmento ausente → omitir o fallback neutro; nunca inventar en runtime.
5. **Glifos Kairos** en UI; contenido en prosa sin Unicode zodiacal.

---

## 6. Estructura de `natal-lite.js`

### Keying

```
{PLANET}_{SIGN_SLUG}

Ejemplos:
  SUN_GEMINI      → Sol en Géminis
  MOON_AQUARIUS   → Luna en Acuario
  ASC_CANCER      → Ascendente en Cáncer
```

Signos en **español** como en motor (`Géminis`, `Cáncer`, …).  
Slug interno opcional para archivos (`gemini`, `cancer`) — ver scaffold.

### Schema de fragmento (v0.1)

```javascript
{
  id: 'SUN_GEMINI',           // único, estable
  planet: 'SUN',              // SUN | MOON | MERCURY | … | ASC | MC
  sign: 'Géminis',            // nombre motor
  tier: 'free',               // free | premium
  version: '1.0.0',           // semver editorial
  headline: string,           // 1 frase, ≤ 90 caracteres
  body: string,               // 2–3 frases, ≤ 280 caracteres
  bridge: string | null,      // puente al mapa (opcional)
  tags: string[],             // para IA/selección futura
  source: string              // ref doc editorial (ej. 'voice_tone')
}
```

### Módulos lógicos (scaffold)

```javascript
NATAL_LITE = {
  SUN: {},      // claves: sign slug o sign name → fragment id
  MOON: {},
  MERCURY: {},
  VENUS: {},
  MARS: {},
  JUPITER: {},
  SATURN: {},
  ASC: {},
  MC: {}        // premium-ready; no UI FREE inicial
}
```

### API pública (scaffold)

| Método | Entrada | Salida |
|--------|---------|--------|
| `lookupPlanetSign(planet, sign)` | `'SUN'`, `'Géminis'` | fragment \| null |
| `lookupAngle(angle, sign)` | `'ASC'`, `'Libra'` | fragment \| null |
| `hasFragment(id)` | `'SUN_GEMINI'` | boolean |
| `getSchemaVersion()` | — | string |

**Sin render. Sin acordeones. Sin wiring en `index.html` en Fase 3.3.**

---

## 7. FREE vs PREMIUM (interpretación)

| Elemento | FREE (natal lite) | PREMIUM |
|----------|-------------------|---------|
| Planetas clásicos × signo | headline + body corto | + casa, aspectos, matices |
| ASC / MC | headline en resumen; expandible premium | texto completo + casas |
| Aspectos | ❌ | ✅ |
| Casas Placidus | ❌ | ✅ |
| Puente mapa | 1 frase genérica | por línea activa / ciudad |
| IA | ❌ | selección + síntesis |
| PDF / informe | ❌ | ✅ |

---

## 8. Objetivo UX (cuando se implemente — Fase 3.3b+)

La interpretación debe sentirse:

- **Íntima** — habla al proceso vital, no al ego performativo
- **Elegante** — Cormorant / copy sobrio; sin badges ni emojis
- **Psicológica** — comprensión, no etiqueta
- **Humana** — Voz Kairos, no chatbot
- **Contenida** — breve; el mapa sigue protagonista
- **Útil** — orienta exploración, no cierra verdad

**No implementado en 3.3:** acordeones, tooltips, modales, nuevas ventanas.

---

## 9. Relación con contenido existente

| Asset actual | Relación con natal-lite |
|--------------|-------------------------|
| `interpretations.js` | Hermano paralelo (mapa). Mismo patrón IIFE + lookup. |
| `natal-panel.js` | Consumidor futuro. Hoy: resumen humano sin lookup. |
| `voice_tone.txt` | Gate editorial obligatorio |
| `interpretations.txt` | Modelo de profundidad T1–T4 para premium/IA |

**No duplicar** copy mapa en natal-lite. Puente (`bridge`) puede referenciar el mapa sin repetir plantillas ciudad.

---

## 10. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| 84+ fragmentos bloquean editorial | Rollout por planeta (Sol → Luna → …) |
| Mezclar contenido y lógica en `app.js` | Solo `src/content/` tiene copy interpretativo |
| Carta natal eclipsa mapa | Lite breve; mapa siempre visible; puente no sermón |
| Textos OneDrive divergen del repo | `source` + `version` en cada fragmento |
| IA inventa en Fase 5 | IA solo selecciona/combina IDs curados |
| Horóscopo genérico | Validación contra checklist Voz y Tono |
| Golden / motores | Contenido no toca cálculo — golden intacto |

---

## 11. Siguientes pasos recomendados

| Fase | Entrega | Dependencia |
|------|---------|-------------|
| **3.3** ✅ | Este doc + `natal-lite.js` scaffold | — |
| **3.3b** | Pilot editorial: Sol + Luna × 12 signos | Doc OneDrive + voice_tone |
| **3.3c** | Acordeón UI en `natal-panel.js` | 3.3b content |
| **3.3d** | Puente mapa 1 línea | interpretations.js tags |
| **3.4** | `reloc-lite.js` scaffold | Relocación Astrológica doc |
| **4.x** | `natal-premium.js` | Casas/aspectos UI gated |
| **5.x** | Pipeline IA con fragment IDs | Auth + entitlements |

---

## 12. Checklist pre-publicación de fragmento

Antes de mergear cualquier texto a `natal-lite.js`:

- [ ] ¿Evita “quién eres” absoluto?
- [ ] ¿Usa posibilidad, no predicción?
- [ ] ¿≤ 280 caracteres en body?
- [ ] ¿Sin jerga Swiss/Placidus/UTC visible?
- [ ] ¿Revisado contra `voice_tone.txt`?
- [ ] ¿`id`, `tier`, `version`, `source` presentes?
- [ ] ¿Fallback definido si falta traducción/signo?

---

*Última revisión: Fase 3.3 inicio · post-cierre bloque 3.2a First Run Polish*
