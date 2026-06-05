---
title: "Premium Reading — Source Grounding (Fase 3.8e.2)"
status: canonical-dev
phase: "3.8e.2"
governs: "Compositor premium DEV · expansión editorial futura · 3.8e.3+"
does_not_govern: "Motores · WASM · producto · paywall · IA en producción"
last_updated: "2026-05"
---

# Premium Reading — Source Grounding

## Propósito

Este documento define **de dónde puede salir profundidad** para lecturas premium integradas por ciudad (prototipo DEV `KairosCityPremiumComposition`), sin inventar datos astrológicos ni copiar párrafos del Master.

**Problema que resuelve:** `interpretations.js` (81/120 lecturas expandidas) es material **ya destilado** para la UI por línea. El compositor 3.8e.1 solo **recompone** ese pool → techo narrativo bajo. La profundidad nueva debe entrar por **extracción editorial controlada** desde los documentos canónicos del proyecto.

**Alcance:** arquitectura editorial y reglas. **No** implementa servicios, compositor ni IA.

---

## 1. Documentos auditados

| ID | Archivo producto | Master (secundario) | Estado | Rol en premium |
|----|------------------|---------------------|--------|----------------|
| **DOC-17** | [`docs/product/INTERPRETATION_LIBRARY.md`](../product/INTERPRETATION_LIBRARY.md) | `docs/Master/17 Biblioteca de Interpretaciones Modulares — Kairos Maps.docx` | Canónico MD | **Fuente primaria de micro-copy por línea** (T1–T4 × integración) |
| **DOC-6** | [`docs/product/ADVANCED_INTERPRETATION_ARCHITECTURE.md`](../product/ADVANCED_INTERPRETATION_ARCHITECTURE.md) | `docs/Master/6 Arquitectura Interpretativa Avanzada…docx` | Canónico MD | **Reglas de síntesis** (jerarquía, contradicciones, intensidad, objetivos, conclusiones) |
| **DOC-5** | [`docs/product/ASTROCARTOGRAPHY_MASTER_BRIEF.md`](../product/ASTROCARTOGRAPHY_MASTER_BRIEF.md) | `docs/Master/5 Tutotia Maestro de Astrocartografía Aplicada.docx` | Canónico MD | **Metodología mapa / líneas / múltiples influencias / estancia** |
| **DOC-7** | [`docs/product/RELOCATION_EDITORIAL_BRIEF.md`](../product/RELOCATION_EDITORIAL_BRIEF.md) | `docs/Master/7 Relocación Astrológica…docx` | Canónico MD | **Capa relocación** (ángulos, casas, visitar vs vivir, cuerpo/vínculos/profesión) |
| **Voz** | [`docs/voice_tone.txt`](../voice_tone.txt) | `docs/Master/10 Libro de Voz y Tono…docx` | TXT canónico | **Filtro obligatorio** de salida |
| **Runtime** | `src/content/interpretations.js` | Derivado de DOC-17 (piloto 3.8d) | Implementado | **Cache editorial actual** — no ampliar en 3.8e.2; alimentar vía extracción → nuevas entradas en fases posteriores |
| **Bridge** | `docs/architecture/NATAL_MAP_BRIDGE_ARCHITECTURE.md` + servicios existentes | Doc 6 alineado | Operativo DEV | **Filtro natal** (tags/themes/tension) — ya conectado al compositor; themes deben salir en español |

### Secundarios revisados (no gobiernan premium aún)

| Fuente | Uso en esta fase |
|--------|------------------|
| `docs/Master/*.docx` (1–4, 8–16) | Solo verificación de alineación; **no** leer como pipeline automático si existe MD producto |
| `docs/architecture/KAIROS_DOC_INDEX.md` | Índice de gobernanza y fases |
| `docs/product/GOALS_AND_ONBOARDING.md` | Objetivos humanos (labels) — ya en GoalSignal; no profundidad narrativa |
| `docs/product/BUSINESS_MODEL.md` | Monetización — **no** grounding editorial |
| `docs/product/ALERTS_LAYER_BRIEF.md` | Ventanas temporales — **reservado** |
| `docs/product/ASTRO_ENGINE_SPEC.md` | Motor líneas — **prohibido tocar**; distancia sí viene del scorer |

---

## 2. Mapa de conocimiento (auditoría)

### 2.1 ¿Qué documento aporta profundidad a lecturas **por línea**?

| Prioridad | Documento | Qué aporta |
|-----------|-----------|------------|
| 1 | **DOC-17** | Templates planeta × ángulo × objetivo × [I/P/S]: T1 sensorial, T2 patrón, T3 oportunidad condicionada, T4 acción |
| 2 | **DOC-6** (cap. intensidad + objetivo) | Peso según distancia, ángulo MC/IC/AC/DC según `mainGoal`, planeta integrado vs sombra |
| 3 | **DOC-5** (cap. líneas planetarias) | Experiencia por planeta/ángulo, errores a evitar, promesa natal como filtro conceptual |
| 4 | **voice_tone.txt** | Formulación final: probabilidad, no fatalismo, no jerga |

**`interpretations.js`** = material ya transformado para MVP; es **salida**, no fuente para copiar más profundidad sin pasar por DOC-17.

### 2.2 ¿Qué documento aporta profundidad a **lectura integrada de ciudad**?

| Prioridad | Documento | Qué aporta |
|-----------|-----------|------------|
| 1 | **DOC-6** | Jerarquía con múltiples líneas; contradicciones como fricción evolutiva; conclusiones responsables; cambio de prioridad por objetivo humano |
| 2 | **DOC-17** §13 | Reglas de combinación: máx. 2 planetas en profundidad/sesión, tensión sin callejón sin salida, distancia >200 km |
| 3 | **DOC-5** | Lugares complejos; metodología paso a paso; no “bueno/malo”; visita vs mudanza (tono) |
| 4 | **Bridge + DOC-6** | Carta natal > línea aislada; themes/tags como brújula (sin inglés técnico en prosa) |

El compositor premium **no** debe inventar capas nuevas: debe **ordenar** señales ya computadas (ranking, distKm, goal, bridge) con reglas de DOC-6 y DOC-17 §13.

### 2.3 ¿Qué documento aporta profundidad a **Relocation**?

| Prioridad | Documento | Qué aporta |
|-----------|-----------|------------|
| 1 | **DOC-7** | Mapa relocado vs línea aislada; cambio AC/MC/IC/DC; casas; integración astrocartografía + relocación; hábitos, cuerpo, vínculos, profesión |
| 2 | **DOC-5** | Relación mapa mundi ↔ carta relocada; astrocartografía como “índice”, relocación como “capítulo” |
| 3 | **DOC-6** | Mapa relocado en jerarquía (natal > línea; reloc contexto de 12 áreas) |

**MVP actual:** reloc real existe en DEV lab (`relocation-preview`, adapter) — **no** integrar en compositor premium hasta 3.8e.3+ con contrato de datos explícito.

### 2.4 ¿Qué documento aporta **reglas de voz y tono**?

| Prioridad | Documento |
|-----------|-----------|
| 1 | **`docs/voice_tone.txt`** — frases prohibidas, rango emocional, “qué puede estar viviendo” vs “quién eres” |
| 2 | **DOC-17** §13 — tono segunda persona, acción cotidiana, anti-fatalismo |
| 3 | **DOC-6 / DOC-5** — conclusiones humanas, no predictivas |

### 2.5 ¿Qué documento **NO** debe usarse todavía?

| Documento / tema | Motivo |
|------------------|--------|
| **DOC-16 / `ASTRO_ENGINE_SPEC`** | Motor y geometría — fuera de alcance editorial |
| **Tránsitos, ciclocartografía, parans, midpoints** (DOC-5, DOC-6, DOC-7) | No hay datos fiables en MVP; mencionar en prosa = invención |
| **Estados [I/P/S] automáticos** desde carta | DOC-17 los define; inferencia natal completa **no** está en compositor ciudad |
| **`BUSINESS_MODEL.md`** | Paywall y packaging — no texto de lectura |
| **`ALERTS_LAYER_BRIEF.md`** | Temporalidad producto — fase 5.x+ |
| **Master 1–4** sin MD producto | No abrir pipeline paralelo no auditado |
| **IA generativa libre** (DOC-17 §13 “sistema de IA”) | Principios sí; generación sin plantillas validadas **no** en 3.8e.x DEV |
| **Copia literal** de párrafos Master/MD | Riesgo legal, tono homogéneo, duplicación |

---

## 3. Modelo de extracción editorial (sin copiar literal)

### 3.1 Principio

```
Fuente Master/Producto  →  Extracción semántica  →  Plantilla KAIROS  →  Cache (interpretations / premium blocks)
                              ↑                           ↑
                         checklist humano            voice_tone + smoke
```

Cada ítem extraído debe poder citar: **documento + sección + tipo de slot** (no párrafo fuente).

### 3.2 DOC-17 — Biblioteca modular

| Slot | Contenido extraíble | Uso en premium ciudad |
|------|---------------------|------------------------|
| **T1** | Experiencia corporal/sensorial en `{ciudad}` | Síntesis del lugar; apertura de favorece |
| **T2** | Patrón psicológico activado | Desafía; puente entre influencias |
| **T3** | Oportunidad con **condición** | Favorece; “cómo aprovecharlo” |
| **T4** | Acción práctica cotidiana | Aprovecha; cierre integrador (1 gesto) |
| **Variables** | `{nombre}`, `{ciudad}`, `{objetivo}`, `{duración}` | Sustitución determinista |
| **[I/P/S]** | Matiz de integración | **Reservado** hasta capa natal/bridge formalice estado por planeta |

**Regla de combinación (DOC-17 §13):** en lectura integrada, **máximo 2 influencias en profundidad** por sesión; el resto solo contexto en síntesis. El compositor ya usa top 5 rankeadas — en 3.8e.3 debe **alinear** con “2 en profundidad + resto eco”.

### 3.3 DOC-6 — Arquitectura interpretativa avanzada

| Bloque | Extraíble | Uso en premium |
|--------|-----------|----------------|
| **Jerarquía** | Natal > línea; integrado > sombra; cercana > exacta (sostenibilidad) | Síntesis; observar permanencia; nota distKm |
| **Contradicciones** | Fricción evolutiva (ej. Júpiter + Marte = crecimiento + exigencia) | Sección desafía; transiciones “no todo empuja…” |
| **Intensidad** | Exacto = PhD; cercano = sostenible; distancia atenúa | Meta + una frase en síntesis si `distKm` alto |
| **Objetivos humanos** | Pivot MC/IC/DC/DC-Venus según goal | Priorización scorer ya parcial; narrativa debe nombrar **área de vida**, no planeta |
| **Conclusiones** | Orientación clara, condicional, responsable | Cierre integrador; prohibido veredicto |

### 3.4 DOC-5 — Manual astrocartografía aplicada

| Bloque | Extraíble | Uso en premium |
|--------|-----------|----------------|
| **Metodología** | Promesa natal → línea → reloc (conceptual) | Síntesis “cómo leer este lugar” |
| **Múltiples influencias** | Ecosistema, no lista | Estructura 6 secciones 3.8e.1 |
| **Visitar / temporal / permanente** | Tono observación vs gestión | Sección “Qué observar si permaneces aquí” + variable `{duración}` |
| **Errores comunes** | No píldora mágica, no línea exacta obligatoria | Anti-invención en meta y cierre |

### 3.5 DOC-7 — Relocation editorial

| Bloque | Extraíble | Uso en premium |
|--------|-----------|----------------|
| **AC/MC/IC/DC relocados** | Identidad, carrera, hogar, pareja | Capa 3.8e.3 cuando exista `relocProfile` por ciudad |
| **Astrocartografía vs relocación** | Impulso (línea) vs contexto (12 casas) | Párrafo síntesis premium reloc-aware |
| **Cuerpo / SN / hábitos** | Somatización, ritmo | Descanso y observar permanencia |
| **Combinación** | Macro líneas + micro reloc | Orden: ranked lines → reloc deltas → bridge |

### 3.6 voice_tone.txt

Aplicar en **toda** salida: lista prohibidos, intensidad contenida, segunda persona, condicionales (“puede”, “conviene”), personalización natural del nombre.

---

## 4. Fuentes permitidas y no permitidas

### 4.1 Permitidas (orden de prioridad)

1. `docs/voice_tone.txt`
2. `docs/product/INTERPRETATION_LIBRARY.md` (DOC-17)
3. `docs/product/ADVANCED_INTERPRETATION_ARCHITECTURE.md` (DOC-6)
4. `docs/product/ASTROCARTOGRAPHY_MASTER_BRIEF.md` (DOC-5)
5. `docs/product/RELOCATION_EDITORIAL_BRIEF.md` (DOC-7) — capa reloc desde 3.8e.3
6. Datos **ya calculados** en DEV: `rankInfluences`, `scoreCity`, `bridgeProfile`, (futuro) reloc angles/fragments
7. `interpretations.js` — solo como **texto ya validado** en smoke editorial 3.8d

### 4.2 No permitidas (extracción o mención en prosa)

- Motores, WASM, `astro.js`, Firebase, dist, paywall specs
- Tránsitos, retrogradaciones, eclipses, parans, ciclocartografía (sin motor)
- “El universo”, alma gemela, garantías, “debes mudarte”
- Párrafos íntegros de Master/MD (> ~25 palabras contiguas iguales)
- Tags bridge en inglés visibles al usuario (`belonging`, `emotional_safety`, …)
- Inventar líneas, distancias, scores o ángulos relocados no presentes en input

---

## 5. Reglas anti-invención

1. **Solo componer** textos cuyo slot exista en DOC-17 o bloque equivalente ya curado en `interpretations.js`.
2. **Condición obligatoria** en toda oportunidad (T3): “si…”, “cuando…”, “la condición es…”.
3. **Distancia:** si `distKm` > 200, incluir matiz de intensidad (DOC-17 §13); no afirmar “línea exacta”.
4. **Contradicciones:** nombrar fricción, nunca “bueno y malo” sin dinámica (DOC-6 §2).
5. **Natal/bridge:** solo themes/tags **traducidos** y tensionMode ya calculado — no diagnosticar sombra planetaria sin contrato [I/P/S].
6. **Relocation:** solo fragmentos con `sourceIds` / adapter OK en DEV — no inferir signos relocados.
7. **Duración:** si el usuario no declaró estancia, usar tono neutro “si permaneces / si visitas” (DOC-5 §7, DOC-17 `{duración}`).

---

## 6. Ejemplos de transformación

### 6.1 Línea / planeta (DOC-5 → voz KAIROS)

| Tipo | Texto |
|------|--------|
| **Fuente (idea DOC-5)** | En línea de Marte puede haber hiperactividad, fricción, necesidad de descarga física. |
| **Permitido** | «Este lugar puede acelerar tu ritmo interno. Si no canalizas esa energía con movimiento o límites claros, la experiencia puede sentirse impaciente o irritante.» |
| **No permitido** | Copiar el párrafo del manual; prometer éxito deportivo; “Marte en AC te domina”. |

### 6.2 Contradicción (DOC-6 → sección desafía)

| Tipo | Texto |
|------|--------|
| **Fuente (idea DOC-6)** | Marte + Júpiter = crecimiento con precio de exigencia física. |
| **Permitido** | «No todo empuja en la misma dirección: puede haber expansión y, a la vez, prisa por sostenerla. El lugar pide canalizar el impulso, no solo ampliar el calendario.» |
| **No permitido** | «Será increíble y terrible»; listar planetas en inglés. |

### 6.3 Relocation (DOC-7 → síntesis, 3.8e.3+)

| Tipo | Texto |
|------|--------|
| **Fuente (idea DOC-7)** | Línea promete tema MC; reloc puede tensar casa 8. |
| **Permitido** | «La visibilidad profesional puede activarse aquí; conviene mirar también qué pasa en lo íntimo y lo compartido, no solo en el escenario público.» |
| **No permitido** | Inventar “Venus en casa 8 en Toronto” sin cálculo reloc. |

### 6.4 Bridge (DOC-6 + voice_tone)

| Tipo | Texto |
|------|--------|
| **Fuente (tags)** | `belonging`, `communication` |
| **Permitido** | «Desde tu perfil, conviene leer el lugar con pertenencia y comunicación como brújula…» |
| **No permitido** | «ejes como belonging y communication» |

---

## 7. Propuesta 3.8e.3 — Evolución del compositor premium

### 7.1 Qué datos debe leer (capas)

```
┌─────────────────────────────────────────────────────────┐
│ L0  voice_tone + PREMIUM_READING_SOURCE_GROUNDING (este) │
├─────────────────────────────────────────────────────────┤
│ L1  GoalSignal (aspect, labels) — ya existe             │
│ L2  rankInfluences + scoreCity + distKm — ya existe     │
│ L3  interpretations.js OR premium_blocks.js (nuevo)     │
│     → slots T1–T4 por interpKey × aspect, curados DOC-17│
├─────────────────────────────────────────────────────────┤
│ L4  bridgeProfile (themes ES, tensionMode, tags)        │
├─────────────────────────────────────────────────────────┤
│ L5  relocCityProfile (opcional) — angles, fragmentIds   │
│     DOC-7 + RELOCATION_SCAFFOLD — solo si ok:true       │
├─────────────────────────────────────────────────────────┤
│ L6  synthesisRules — JSON/YAML derivado de DOC-6 §1–5     │
│     (contradicción, intensidad, maxDeepInfluences: 2)   │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Qué capas combinar (orden narrativo)

1. **Síntesis** — DOC-5 metodología + DOC-6 jerarquía + DOC-7 si reloc + DOC-17 `{duración}`.
2. **Favorece** — T1+T3 de ≤2 influencias dominantes (goal-aware angle boost).
3. **Desafía** — T2 + reglas contradicción DOC-6 entre pares rankeados.
4. **Aprovecha** — T4 por influencia + DOC-5 acción cotidiana.
5. **Observar** — DOC-5 §7 / DOC-17 estancia; **texto propio**, no reutilizar desafía.
6. **Cierre** — DOC-6 conclusiones responsables + una pregunta (voice_tone).

### 7.3 Cómo evitar repetición

- Registro global de frases (3.8e.1) **mantener**.
- Slots **exclusivos por sección** (T1/T3 → favorece; T2 → desafía; T4 → aprovecha).
- **premium_blocks** separados de `interpretations.js` para párrafos solo-integrados (síntesis, transiciones DOC-6).
- Smoke: overlap entre secciones + longitud 500–1500.

### 7.4 Cómo integrar relocation (sin inventar)

- Entrada: `relocProfile` desde adapter+chart (mismo contrato que `relocation-preview`).
- Usar solo **fragmentIds** aprobados (delta/presence) → frases DOC-7 pre-curadas por ángulo/signo.
- Si reloc falla o `ok:false` → lectura solo astrocartografía (degradación explícita en meta).

### 7.5 Lectura premium sin inventar (pipeline DEV)

1. Humano/editor extrae de DOC-17/6/5/7 → **premium_blocks** (revision smoke).
2. Compositor ensambla blocks + interpretations slots + bridge ES + reloc fragments.
3. IA futura (fase 5.x): **reformulación supervisada** dentro de slots, nunca facts nuevos.

### 7.6 Qué queda para IA futura

- Inferir [I/P/S] por planeta con carta natal completa.
- Redacción variante manteniendo T1–T4 y checklist voice_tone.
- Comparativa entre ciudades y resúmenes largos (>1500) bajo supervisión.
- Tránsitos cuando exista capa temporal producto.

**NO en 3.8e.3:** generación libre, RAG sobre Master sin chunking editorial, ampliación masiva de `interpretations.js` sin smoke por combo.

---

## 8. Qué usar ya vs reservar

| Usar ya (3.8e.3 prep) | Reservar después |
|----------------------|------------------|
| DOC-17 extracción T1–T4 a `premium_blocks` piloto (10–15 combos) | [I/P/S] automático por planeta |
| DOC-6 reglas en `synthesisRules` (contradicción, 2 profundas, intensidad distKm) | Tránsitos / ciclocartografía |
| DOC-5 visita vs permanencia (`duration` en lab) | Parans / midpoints |
| voice_tone en smoke ampliado | ALERTS temporal |
| Bridge themes ES (ya 3.8e.1) | BUSINESS_MODEL copy premium |
| DOC-7 fragments reloc Roberto×Lisboa/Toronto en síntesis DEV | Relocation en producto / paywall |

---

## 9. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Drift Master ↔ MD producto | Editar solo MD producto; Master como referencia |
| “Profundidad” = copiar más párrafos | Checklist transformación + smoke anti-overlap |
| Dos pipelines (interpretations vs premium_blocks) | Índice por `interpKey` + `blockId`; una fuente DOC-17 |
| Reloc inventada en prosa | Gate `relocProfile.ok`; sin ángulo → silencio |
| IA prematura | Slots cerrados antes de LLM |
| Scope creep en compositor | 3.8e.3 solo DEV; sin `app.js` hasta validación lab |

---

## 10. Referencias cruzadas

| Documento | Ruta |
|-----------|------|
| Compositor actual | `src/services/city-premium-composition-service.js` (3.8e.1) |
| Lab | `src/dev/city-premium-preview.html` |
| Smoke premium | `scripts/dev-city-premium-composition-smoke.sh` |
| Reloc scaffold | `docs/architecture/RELOCATION_SCAFFOLD_ARCHITECTURE.md` |
| Bridge | `docs/architecture/NATAL_MAP_BRIDGE_ARCHITECTURE.md` |
| Índice docs | `docs/architecture/KAIROS_DOC_INDEX.md` |

---

*KAIROS MAPS · Fase 3.8e.2 · Source Grounding — documentación only, sin implementación*
