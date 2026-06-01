# KAIROS MAPS — Arquitectura de Experiencia de Producto

**Fase 3.6f** · Documento estratégico (sin implementación)  
**Estado:** referencia pre-UI visible  
**Alcance:** definir qué ve y siente el usuario antes de seguir desarrollando mapa, highlights o módulos premium

---

## Resumen ejecutivo

KAIROS no vende técnicas astrológicas. Vende **respuestas humanas sobre lugares y decisiones vitales**.

El usuario no debe encontrarse con sinastría, carta compuesta, Davison, astrocartografía ni carta relocalizada en la interfaz. Esos términos viven en **motores, compositores y documentación interna** — nunca como etiquetas de navegación.

La propuesta de experiencia visible se organiza en **cuatro módulos**:

| Módulo visible | Pregunta que responde |
|----------------|----------------------|
| **Yo** | ¿Quién soy en el mapa del mundo? |
| **Mi relación** | ¿Cómo nos encontramos dos personas en distintos lugares? |
| **Mis lugares** | ¿Dónde me conviene vivir, trabajar, descansar, crecer…? |
| **Mis decisiones** | ¿Qué opción comparo, guardo o exporto? |

Internamente, cada módulo puede invocar perfiles técnicos (`NATAL`, `RELOCATION`, `SYNASTRY`, `COMPOSITE`, `DAVISON`, Bridge, Cities Layer) definidos en `KAIROS_MULTI_PROFILE_ARCHITECTURE.md`. **La UI traduce; no expone.**

Este documento es el puente entre arquitectura técnica (3.6d–3.6e) y cualquier trabajo de UI posterior (3.7a+). Sin él, el riesgo es reconstruir sidebars técnicos que contradigan onboarding y voz.

---

## 1. Principio rector — Lenguaje externo vs interno

### Regla de oro

> **Si un usuario no astrólogo no lo diría en una conversación, no va en la UI.**

### Tabla de traducción (canónica)

| Usuario ve | Usuario NO ve | Motor / capa interna |
|------------|---------------|----------------------|
| Mi carta | Carta natal, radix | `chart-service` + natal lite |
| Mi mapa | Astrocartografía, líneas AC/DC/MC/IC | `astro.js` + Bridge |
| Mi reubicación | Relocación, carta relocalizada | `getRelocatedAngles` + reloc adapter |
| Nuestra relación | Sinastría | `SYNASTRY` + relationship content |
| Cómo nos encontramos | Carta compuesta | `COMPOSITE` |
| Nuestro punto en común | Davison, carta Davison | `DAVISON` |
| Nuestro mapa | Mapa compuesto / overlay pareja | Bridge × 2 + COUPLE_GEO |
| Nuestra reubicación | Reloc compuesta / Davison | `COMPOSITE_RELOCATION`, `DAVISON_RELOCATION` |
| Dónde vivir / trabajar / descansar… | Objetivo, mainGoal, ángulo MC | `mainGoal` + Cities Layer |
| Lugares que te convienen | Scoring, priorityLines | Bridge output |
| Lugares a considerar con calma | Baja confianza, tensionMode | Bridge meta |
| Mi lectura | Fragmento, compositor | `natal-composition-service` |
| Explorar en profundidad | Premium, paywall técnico | entitlements |

### Vocabulario permitido en UI (alineado con onboarding)

Frases del tipo:
- *“Cada lugar despierta una parte diferente de ti.”* (`onboarding.txt`)
- *“Este lugar puede favorecer…”* (`voice_tone.txt` — nunca verdad absoluta)
- *“Qué te gustaría encontrar o mejorar ahora mismo”* (objetivos vitales, no ángulos)

### Vocabulario prohibido en UI visible

Sinastría · compuesta · Davison · relocación · astrocartografía · casas Placidus · aspectos · orbe · tránsitos · nodos · IC/MC/AC/DC como etiquetas de menú · Bridge · perfil · fragmento · WASM · Swiss Ephemeris

**Excepción controlada:** glifos planetarios y signos en **Mi carta** (ya operativo) — son identidad visual Kairos, no jerga de menú.

---

## 2. Estructura FREE — qué ve una persona sin pagar

Objetivo FREE: **utilidad real + curiosidad premium**, sin bloqueo agresivo ni vacío interpretativo.

### Onboarding (ya definido — `onboarding.txt`)

- Vínculo emocional en < 3 minutos
- Nombre + objetivos vitales (máx. 3) + datos natales
- **Sin enseñar astrología** en pantallas 1–3

### Módulo **Yo** (FREE)

| Pantalla / zona | Contenido FREE | Límite |
|-----------------|----------------|--------|
| **Mi carta** | Sol, Luna, Asc, MC + 7 clásicos; lectura lite (headline + 2–3 frases) | Sin casas, aspectos, cuerpos menores |
| **Mi mapa** | Mapa interactivo; toggles planeta; popup ciudad×contexto básico | Sin ranking ciudades; sin reloc recalculada |
| **Mi reubicación** | Teaser: *“Explora cómo cambia tu experiencia en otra ciudad”* + CTA premium | No recalcular ángulos en FREE |

### Módulo **Mi relación** (FREE)

| Estado | Contenido |
|--------|-----------|
| Sin segundo perfil | Ilustración + copy humano: *“Añade a alguien importante para explorar lugares juntos”* |
| Teaser | No sinastría operativa; no compuesta/Davison |

### Módulo **Mis lugares** (FREE)

| Función | Contenido |
|---------|-----------|
| Explorar mapa | Click ciudad → lectura contextual según objetivo onboarding |
| Objetivos | Derivados de `mainGoal`: amor, trabajo, descanso, viajes, cambio, raíces, creatividad, crecimiento |
| Bridge (post-3.7a) | Resaltado sutil 2–3 líneas — **sin explicar por qué técnicamente**; copy humano opcional en panel Carta |

### Módulo **Mis decisiones** (FREE)

| Función | Contenido |
|---------|-----------|
| Guardar | Solo local / perfil básico (futuro) |
| Comparar | No side-by-side en FREE |
| Exportar | No PDF |

### Qué NO incluye FREE (límites explícitos — coherente con `KAIROS_PRODUCT_ARCHITECTURE.md`)

- Segundo participante operativo
- Reubicación con carta recalculada
- Ranking “mejores ciudades para…”
- Lectura IA profunda
- Casas, aspectos, Quirón, nodos en panel
- Informes PDF

---

## 3. Estructura PREMIUM — qué se desbloquea

Premium = **profundidad, comparación y pareja** — no un producto distinto. Mismos motores; más capas interpretativas y permisos.

### Módulo **Yo** (PREMIUM)

| Desbloqueo | Lenguaje usuario | Interno |
|------------|------------------|---------|
| Carta completa | *“Ver tu carta en profundidad”* | Casas, aspectos, cuerpos extendidos |
| Mi reubicación | *“Cómo te sentirías viviendo en [ciudad]”* | `RELOCATION` + reloc-lite |
| Mapa enriquecido | Más capas visuales, heatmaps (futuro) | Overlays, timing geo |

### Módulo **Mi relación** (PREMIUM)

| Desbloqueo | Lenguaje usuario | Interno |
|------------|------------------|---------|
| Segundo perfil | *“Añadir a tu persona”* | `participantKeys[2]` |
| Nuestra relación | *“Cómo se cruzan ustedes”* | `SYNASTRY` |
| Cómo nos encontramos | *“El mapa de la relación”* (sin decir compuesta) | `COMPOSITE` — UI elige una narrativa principal |
| Nuestro mapa | *“Lugares donde pueden florecer juntos”* | COUPLE_GEO + Bridge merge |
| Nuestra reubicación | *“Si se mudaran juntos a [ciudad]”* | COMPOSITE/DAVISON reloc |

**Nota producto:** compuesta y Davison son **dos lentes internas**. La UI premium puede mostrar una lectura unificada *“Nuestra relación en el mapa”* y reservar el detalle técnico para informes PDF (Fase 5).

### Módulo **Mis lugares** (PREMIUM)

| Desbloqueo | Lenguaje usuario |
|------------|------------------|
| Dónde vivir | Ranking + explicación humana |
| Dónde trabajar | idem |
| Dónde descansar | idem |
| Dónde crecer | idem |
| Dónde emprender | idem (objetivo derivado de trabajo/crecimiento) |
| Dónde puede florecer una relación | Requiere módulo relación activo |
| Ciudades a considerar con calma | Lugares de baja afinidad — tono `voice_tone` (sin miedo) |

### Módulo **Mis decisiones** (PREMIUM)

| Desbloqueo | Lenguaje usuario |
|------------|------------------|
| Comparar ciudades | *“París o Lisboa — qué encaja más contigo ahora”* |
| Guardar escenarios | *“Mis lugares guardados”* |
| Informe | *“Tu informe Kairos”* (PDF) |
| Preguntar en profundidad | *“Explorar con Kairos”* (IA Fase 5 — selección fragmentos, no alucinación) |

---

## 4. Navegación propuesta (usuario no astrólogo)

### Arquitectura de información — 4 pilares

```
┌─────────────────────────────────────────────────────────────┐
│  KAIROS MAPS                                                │
├──────────────┬──────────────┬──────────────┬────────────────┤
│     YO       │ MI RELACIÓN  │ MIS LUGARES  │ MIS DECISIONES │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ Mi carta     │ Nuestra      │ Dónde vivir  │ Comparar       │
│ Mi mapa      │  relación    │ Dónde        │ Guardar        │
│ Mi           │ Nuestro      │  trabajar    │ Informe        │
│  reubicación │  mapa        │ Dónde        │ (Premium)      │
│  (Premium)   │ Nuestra      │  descansar   │                │
│              │  reubicación │ …            │                │
│              │  (Premium)   │              │                │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Jerarquía dentro de **YO**

1. **Mi carta** — identidad y lectura lite (panel lateral actual, workspace `natal`)
2. **Mi mapa** — exploración geográfica (vista principal actual)
3. **Mi reubicación** — premium; entrada desde mapa al seleccionar ciudad o desde Mis lugares

### Jerarquía dentro de **MI RELACIÓN**

1. Invitación a añadir segunda persona (onboarding pareja simplificado)
2. **Nuestra relación** — lectura cruzada (sinastría interna)
3. **Nuestro mapa** — intersección geo (COUPLE_GEO)
4. **Nuestra reubicación** — escenario mudanza conjunta

### Jerarquía dentro de **MIS LUGARES**

Objetivos como **preguntas**, no filtros técnicos:

| Pregunta visible | mainGoal interno | Bridge / mapa |
|------------------|------------------|---------------|
| ¿Dónde me conviene vivir? | `raices` / `cambio` | IC, Luna, Venus |
| ¿Dónde puedo trabajar mejor? | `trabajo` | MC, Mercurio, Júpiter |
| ¿Dónde descansa mi sistema? | `descanso` | IC, Luna, Neptuno |
| ¿Dónde crecer? | `crecimiento` | MC, Júpiter, Sol |
| ¿Dónde emprender? | `trabajo` + creatividad | MC, Marte, Urano |
| ¿Dónde puede florecer mi relación? | `amor` + COUPLE_GEO | DC, Venus + merge pareja |

### Jerarquía dentro de **MIS DECISIONES**

- Transversal: accesible desde Mis lugares (*“Guardar esta ciudad”*) y Mi relación (*“Comparar escenarios juntos”*)
- No duplica mapa; **orquesta** resultados ya calculados

### Relación con sidebar actual (transición)

| Sidebar hoy | Migración propuesta |
|-------------|---------------------|
| Carta | **Yo → Mi carta** |
| Mapa | **Yo → Mi mapa** (vista default) |
| Reloc | **Yo → Mi reubicación** (premium) |
| Pareja | **Mi relación** |
| Destino | **Mis lugares** + **Mis decisiones** |

Migración **no urgente** en 3.7a; documentar ahora para no acoplar highlight mapa a nombres técnicos.

---

## 5. Motores internos ocultos — ejemplos

### Ejemplo A — Usuario FREE explora mapa

```
Usuario: abre "Mi mapa", hace click en Barcelona
UI: popup humano con lectura ciudad (interpretations.js)
Interno: planeta_angulo + mainGoal + distancia línea
Bridge (3.7a): priorityLines resaltadas — sin tooltip "Mercurio-IC"
```

### Ejemplo B — Usuario PREMIUM pregunta reubicación

```
Usuario: "¿Cómo me sentiría viviendo en Lisboa?"
UI: Mi reubicación → narrativa + mapa con énfasis actualizado
Interno: RELOCATION → reloc-composition → BridgeSignalProfile → buildBridge
Copy: delta vital, no "tu ASC pasa a Escorpio"
```

### Ejemplo C — Pareja PREMIUM

```
Usuario: "¿Dónde puede florecer nuestra relación?"
UI: Mi relación → Nuestro mapa → Mis lugares → Dónde puede florecer…
Interno:
  profileA (NATAL) → buildBridge
  profileB (NATAL) → buildBridge
  SYNASTRY → BridgeSignalProfile (affinityHints)
  COUPLE_GEO → sharedPriorityLines
  Cities Layer → ranking con mainGoal amor
Usuario nunca ve: sinastría, compuesta, Davison, Bridge
```

### Ejemplo D — IA Fase 5

```
Usuario: "Explorar en profundidad" sobre Madrid + objetivo trabajo
Interno: snapshot carta + bridge + fragment IDs candidatos
IA: selecciona y ensambla copy curado — voice_tone gate
Usuario recibe: párrafo humano, no dump técnico
```

---

## 6. Preguntas humanas que responde KAIROS

KAIROS debe poder responder estas preguntas **en lenguaje llano**. La profundidad depende del tier.

| # | Pregunta humana | Módulo | FREE | PREMIUM |
|---|-----------------|--------|------|---------|
| 1 | ¿Dónde me conviene vivir? | Mis lugares | Exploración + popup | Ranking + reubicación |
| 2 | ¿Dónde puedo trabajar mejor? | Mis lugares | Popup contextual | Ranking + comparador |
| 3 | ¿Dónde descansa mi sistema? | Mis lugares | Popup | Ranking + informe |
| 4 | ¿Dónde puede florecer mi relación? | Mi relación + Mis lugares | Teaser | COUPLE_GEO + ranking |
| 5 | ¿Dónde emprender? | Mis lugares | Popup (trabajo/crecimiento) | Ranking dedicado |
| 6 | ¿Qué lugar activa más mi propósito? | Yo + Mis lugares | Lectura lite + mapa | Carta profunda + ciudades |
| 7 | ¿Qué ciudad no me conviene tanto? | Mis lugares | No ranking negativo explícito | "Considerar con calma" — tono voice_tone |
| 8 | ¿Cómo me sentiría en otra ciudad? | Yo → Mi reubicación | Teaser | Reloc completa |
| 9 | ¿Cómo nos encontramos en el mundo? | Mi relación | — | Nuestro mapa |
| 10 | ¿París o Berlín para mí ahora? | Mis decisiones | — | Comparador |

**Reglas de respuesta** (de `voice_tone.txt`):

- Probabilidad, no predicción
- Observación, no prescripción
- Sin miedo, sin dependencia de la app

---

## 7. Documentos canónicos y gaps

### En repo — fuente de verdad experiencia + interpretación

| Doc | Rol en experiencia |
|-----|-------------------|
| `docs/voice_tone.txt` | **Gate #1** — tono, prohibiciones, intensidad |
| `docs/onboarding.txt` | Flujo emocional, objetivos vitales, qué NO mostrar |
| `docs/visual_identity.txt` | Identidad visual — no copy interpretativo |
| `docs/interpretations.txt` | Biblioteca mapa ciudad×línea×objetivo |
| `src/content/interpretations.js` | Runtime mapa (40 combos) |
| `src/content/natal-lite.js` | Copy Mi carta FREE |
| `docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md` | Capas lite vs premium |
| `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | FREE/PREMIUM técnico-producto |
| `docs/architecture/KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | Perfiles internos ocultos |
| `docs/architecture/NATAL_MAP_BRIDGE_*` | Bridge — invisible al usuario |
| `docs/architecture/NATAL_LITE_STATUS.md` | Checklist pre-deploy natal |
| `docs/roadmap.txt` | Visión histórica — alinear, no contradecir |

### Fuera del repo — referencia editorial controlada (futuro)

| Doc | Por qué importa | Acción recomendada |
|-----|-----------------|-------------------|
| Manual Maestro Astrocartografía | Objetivos vitales × geografía | Importar sección “lenguaje usuario” a `docs/product/` |
| Relocación Astrológica | Copy Mi reubicación | Adaptar a voice_tone antes de `reloc-lite.js` |
| Arquitectura Interpretativa Avanzada | Scoring profundo, IA | Solo criterios selección — no UI |
| Bases terapéuticas externas | Riesgo tono clínico | **No** importar verbatim; matriz de reuso |

### Documentos que **faltan** en repo (crear en fases posteriores)

| Documento propuesto | Fase | Contenido |
|---------------------|------|-----------|
| `docs/product/KAIROS_UI_COPY_GLOSSARY.md` | Pre-3.7a | Tabla externo↔interno + strings aprobados |
| `docs/product/KAIROS_NAVIGATION_SPEC.md` | Pre-4.0 | Wireframes IA 4 módulos |
| `docs/product/KAIROS_PREMIUM_MESSAGING.md` | Pre-4.0 | CTAs, teasers, límites FREE |
| `docs/content/reloc-lite-editorial-brief.md` | Pre-3.8 | Brief Mi reubicación |
| `docs/content/relationship-editorial-brief.md` | Pre-4.x | Brief Mi relación |
| `docs/product/KAIROS_GOAL_TAXONOMY.md` | Pre-3.9 | Objetivos visibles ↔ mainGoal ↔ Bridge |

**Este documento (3.6f)** es el primero de la carpeta lógica `docs/product/`; puede moverse allí en commit futuro si se formaliza la carpeta.

---

## 8. Roadmap producto (experiencia visible)

Alineado con arquitectura técnica; numeración **producto** explícita para el equipo.

| Fase | Entrega experiencia | Entrega técnica (referencia) | Usuario percibe |
|------|---------------------|------------------------------|-----------------|
| **3.7** | Bridge visible en mapa | `bridgeProfile` → highlight 2–3 líneas | *“Estos lugares conectan contigo”* — sin jerga |
| **3.8** | Mi reubicación (premium DEV) | Relocation Layer + reloc-lite | *“Cómo te sentirías en [ciudad]”* |
| **3.9** | Mis lugares — objetivos | Cities Layer + goal taxonomy | Preguntas: vivir, trabajar, descansar… |
| **4.0** | Renombre navegación (opcional) | Sidebar → 4 módulos | Yo / Mi relación / Mis lugares / Mis decisiones |
| **4.1–4.3** | Mi relación operativa | Sinastría + segundo perfil | *“Nuestra relación”*, *“Nuestro mapa”* |
| **4.4–4.6** | Comparador + guardados | Mis decisiones | Side-by-side ciudades |
| **5.0** | Explorar en profundidad (IA) | Pipeline fragment IDs | Conversación humana, no chatbot |
| **5.x** | Informe Kairos (PDF) | Snapshot multi-perfil | Entregable premium exportable |

### Secuencia recomendada post-3.6f

1. **3.7a** — highlight mapa (sin renombrar sidebar)
2. **3.7b** — copy glossary mínimo en DEV (strings highlight)
3. **3.8** — Mi reubicación premium teaser + DEV
4. **3.9** — Mis lugares con objetivos como preguntas
5. **4.x** — Mi relación + navegación 4 pilares

---

## 9. Riesgos

| Riesgo | Síntoma | Mitigación |
|--------|---------|------------|
| **Exceso jerga astrológica** | Sidebar “Sinastría”, tooltips “MC” | Glosario 3.6f; review voice_tone en cada string |
| **Demasiadas opciones visibles** | 8 objetivos + 3 tipos carta pareja | Una narrativa principal; detalle en premium/profundo |
| **Confundir al usuario** | “¿El mapa se mueve si me mudo?” | Copy: mapa = tu base; reubicación = cómo **vives** el lugar |
| **Duplicar módulos** | Carta + Reloc + Pareja repiten lecturas | Un compositor por perfil; UI consume lectura unificada |
| **Prometer demasiado** | “Te diremos la ciudad perfecta” | Probabilidad + “puede favorecer” (voice_tone) |
| **App técnica vs experiencia humana** | Panel casas antes que preguntas vitales | Objetivos onboarding antes que detalle carta |
| **Contradicción FREE/PREMIUM docs** | PRODUCT_ARCHITECTURE vs este doc | PRODUCT = capacidades; EXPERIENCE = lenguaje — cross-ref |
| **Compuesta vs Davison expuestos** | Usuario elige técnica que no entiende | Una entrada “Nuestra relación”; técnicas internas |
| **IA rompe voz** | Chatbot genérico en 5.0 | Solo ensambla fragment IDs curados |
| **Docs terapéuticos externos** | Tono clínico en pareja | Brief editorial antes de relationship content |

---

## 10. Decisiones de producto (ADRs)

1. **AD-XP-01:** Cuatro módulos visibles máximo en navegación principal (Yo, Mi relación, Mis lugares, Mis decisiones).
2. **AD-XP-02:** Términos astrológicos técnicos **nunca** en labels de navegación ni CTAs primarios.
3. **AD-XP-03:** Objetivos vitales del onboarding son la **primera** capa de personalización — no casas ni aspectos.
4. **AD-XP-04:** Bridge y priorityLines son **invisibles**; el usuario ve consecuencias (“lugares que conectan contigo”), no mecanismo.
5. **AD-XP-05:** Mi relación premium presenta **una** experiencia unificada; compuesta/Davison no compiten en UI.
6. **AD-XP-06:** Preguntas negativas (“¿Qué ciudad no me conviene?”) usan framing *“considerar con calma”* — nunca alarmista.
7. **AD-XP-07:** Todo copy nuevo pasa por `voice_tone.txt` antes de merge a content o UI.

---

## 11. Qué NO hace este documento

- No implementa UI, sidebar, highlights ni renombrados
- No modifica motores, Bridge, compositor ni Firebase
- No sustituye `voice_tone.txt` ni inventa tono
- No autoriza deploy ni commit

---

## 12. Recomendación — siguiente fase

**Inmediato:** **3.7a** — conectar Bridge al mapa con highlight sutil, usando copy del futuro glosario:

- Evitar tooltip “Mercurio-IC”
- Preferir nada visible extra en mapa, o micro-copy en panel Carta: *“Algunos lugares del mapa resuenan especialmente contigo ahora”*

**Paralelo documental (sin código):** borrador `KAIROS_UI_COPY_GLOSSARY.md` con 20–30 strings del highlight y teasers premium — acelera 3.7–3.9 sin reescrituras.

**Después de 3.7a validado:** 3.8 Mi reubicación — primera feature premium con lenguaje humano ya definido aquí.

---

*Fase 3.6f · post multi-perfil 3.6e · pre highlight mapa 3.7a · referencias: voice_tone, onboarding, PRODUCT_ARCHITECTURE, MULTI_PROFILE_ARCHITECTURE*
