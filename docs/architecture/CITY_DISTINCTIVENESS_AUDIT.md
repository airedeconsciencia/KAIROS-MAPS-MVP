# KAIROS MAPS — City Distinctiveness Audit

**Fase 3.8f.5b** · Auditoría editorial (sin implementación)  
**Fecha:** 26 mayo 2026  
**Estado:** diagnóstico · no desplegado · no cableado en producto

> Objetivo: evaluar si las cinco ciudades piloto del lab premium tienen **personalidad propia** en lectura, o si convergen en voz genérica KAIROS + capa país.

---

## I. Alcance y fuentes analizadas

| Ciudad | País | Capa ciudad (`CITY_ATMOSPHERE`) | Capa país (`country-archetypes.js`) |
|--------|------|--------------------------------|-------------------------------------|
| **Lisboa** | Portugal | ✅ `lisboa` — 35 líneas curadas | ✅ `portugal` |
| **Toronto** | Canadá | ✅ `toronto` — 35 líneas | ✅ `canada` |
| **Ciudad del Cabo** | Sudáfrica | ✅ `ciudad_del_cabo` — 35 líneas | ✅ `south_africa` |
| **Barcelona** | España | ❌ sin entrada | ✅ `spain` |
| **Tokio** | Japón | ❌ sin entrada | ✅ `japan` |

**Artefactos revisados:**

- `src/services/narrative-intelligence-service.js` → `CITY_ATMOSPHERE_INDEX`
- `docs/voice/CITY_ATMOSPHERE_LIBRARY.md` (espejo editorial)
- `src/content/country-archetypes.js` (10 países piloto)
- `src/content/premium-blocks.js` (bloques genéricos `{ciudad}`)
- `src/services/city-premium-composition-service.js` (human presence, dedup país/ciudad)
- Previews lab: `city-premium-preview.html`, `narrative-intelligence-preview.html`

**Veredicto global:** 3 ciudades tienen capa urbana curada con personalidad reconocible; 2 ciudades (Barcelona, Tokio) **solo heredan país + bloques genéricos** y pierden distinción urbana. Además, las 3 curadas **duplican** frases con su capa país en lectura compuesta.

---

## II. Distinctiveness score (resumen)

| Ciudad | Score | Lectura inconfundible hoy | Bloqueador principal |
|--------|-------|---------------------------|----------------------|
| Lisboa | **8/10** | Sí — melancolía suave, conversación antes que confianza | Duplicación con Portugal |
| Toronto | **7/10** | Sí — urgencia nordamericana, mérito visible | Duplicación con Canadá |
| Ciudad del Cabo | **6/10** | Parcial — cuerpo y borde, pero suena a Sudáfrica | Ciudad ≈ país en 40% del material |
| Barcelona | **3/10** | No — suena a «España genérica» | Sin `CITY_ATMOSPHERE` |
| Tokio | **4/10** | Parcial — Japón sí; Tokio no | Sin capa urbana; país no es ciudad |

---

## III. Análisis por ciudad

### 3.1 Lisboa

#### 1. ¿Qué la hace única?

- **Ritmo decelerado con textura**, no vacío: «el tiempo se dobla», margen para conversar antes de decidir.
- **Melancolía sin dramatismo** — tono ibérico atlántico, no mediterráneo genérico.
- **Vínculo por presencia y gesto pequeño** (mesa, silencio cómodo) antes que demostración.
- **Trabajo artesanal / coherencia interna** vs carrera de vitrina.
- **Imágenes urbanas específicas:** pendientes, luz oblicua, barrios donde lo antiguo y lo nuevo conviven.
- **Metáforas propias:** «conversación que empieza antes que la confianza», «quitar un disfraz que ya cansó».

#### 2. Frases intercambiables

| Frase Lisboa | También aparece en |
|--------------|-------------------|
| «El esfuerzo sostenido vale más que el arranque ruidoso» | Portugal `goalModifiers.trabajo` (casi literal) |
| «Mesas que se alargan porque nadie tiene prisa por levantarse» | Portugal `narrativeImages` |
| «Luz oblicua / tarde que cambia el tono» | Portugal `narrativeImages` + `elementalTone` |
| «Puede costar menos performar y más mostrarse» | Cabo bond · España amor · human presence genérico |
| «El cuerpo puede volver cuando la agenda deja de mandar» | Patrón cuerpo-agenda en Toronto, Cabo, blocks |

#### 3–4. Temas repetidos y voz genérica

- **Performar vs autenticidad** — voz KAIROS transversal, no solo Lisboa.
- **Mesa / conversación / cotidiano** — bien para Lisboa, pero Portugal repite lo mismo en composición final.
- **Modales país** («Quizá notes…», «Puede que…») diluyen la voz urbana en la sección `integracion`.

#### 5. Elementos a añadir

- **Verticalidad concreta** — colinas, miradores, fatiga física que ralentiza encuentros (sin azulejos ni tranvía).
- **Río/tejo como borde** — horizonte acuático urbano, no «mar genérico».
- **Barrio vs centro** — contraste Alfama/Bairro Alto vs negocios; Lisboa no es una sola textura.
- **Expatriación / turismo lento** — sin postal: la ciudad como lugar donde muchos llegan «un tiempo».
- **Éxito** — reconocimiento discreto, reputación por oficio, no por escaparate (ausente hoy).

---

### 3.2 Toronto

#### 1. ¿Qué la hace única?

- **Ritmo con filo** — urgencia funcional, decisiones rápidas, invierno que condiciona el impulso.
- **Escala amplia** — lo personal pequeño frente a la ciudad; soledad como intervalo, no carencia.
- **Vínculo por acuerdos y consistencia**, no fusión instantánea.
- **Trabajo como escenario público** — mérito, proceso, documentación, trayectoria visible.
- **Descanso negociado** — pausa compite con pendientes; descarga física (caminar fuerte).
- **Imágenes:** distancias que obligan a planificar, mañanas con propósito, barrios multi-comunidad.

#### 2. Frases intercambiables

| Frase Toronto | También aparece en |
|---------------|-------------------|
| «Distancias que te hacen planificar el día como pequeña expedición» | Canadá `narrativeImages` (**duplicado exacto**) |
| «Definir qué quieres que se vea antes de exponerte» | España `goalModifiers.trabajo` |
| «El esfuerzo sostenido y el orden reducen ruido interno» | Lisboa work · Canadá `workTone` |
| «Horizontes amplios que ponen tu historia en perspectiva» | Cabo images · Sudáfrica `narrativeImages` |
| «Reserva cordial — amabilidad sin invasión» | Canadá `emotionalClimate` · `relationshipTone` |

#### 3–4. Temas repetidos y voz genérica

- **Visibilidad / escaparate vs coherencia** — compartido con España, Cabo, premium-blocks MC.
- **Invierno / estacionalidad** — distintivo de Toronto, pero Canadá lo absorbe en país.
- **Multiculturalismo** — evitado en `avoid` pero ausencia de sustituto concreto (barrios, idiomas, comida cotidiana sin cliché).

#### 5. Elementos a añadir

- **Distancia intra-urbana** — GTA, commute, ciudad fragmentada (sin CN Tower).
- **Primer invierno / adaptación climática** — cuerpo que aprende a guardar energía (más Toronto que Canadá abstracto).
- **Carrera migrante / re-credencial** — trabajo como revalidación, no solo mérito genérico.
- **Soledad en multitud** — anonimato en transporte, no «ciudad fría» cliché.
- **Éxito** — trayectoria medible, visibilidad profesional negociada, «llegar» vs «pertenecer».

---

### 3.3 Ciudad del Cabo

#### 1. ¿Qué la hace única?

- **Ritmo doble** — expansión afuera, recogimiento adentro; borde geográfico.
- **Cuerpo primero** — el lugar se registra antes que la cabeza lo explique.
- **Contraste vivido** — luz fuerte, sombra, aire; belleza que no consuela.
- **Vínculo cálido sin liviandad** — franqueza + cuidado, presencia encarnada.
- **Trabajo impulso/pausa no lineal** — iniciativa + maduración lenta.
- **Imágenes:** viento que ajusta el paso, colina + horizonte, silencios que pesan distinto.

#### 2. Frases intercambiables

| Frase Cabo | También aparece en |
|------------|-------------------|
| «Descansar… volver al cuerpo después de mucho ruido» | Metáfora Cabo + patrón Sudáfrica `restTone` |
| «Cuando dejas de luchar contra el reloj» | Sudáfrica `goalModifiers.descanso` · `interpretations.js` |
| «Horizonte abierto / pone en perspectiva» | Toronto images · Sudáfrica `narrativeImages` |
| «Silencios que pesan distinto según el barrio» | Sudáfrica `narrativeImages` (**casi literal**) |
| «Visibilidad… exponerse en un escenario amplio» | Toronto work · España trabajo |
| «Coherencia personal, no solo escaparate» | Lisboa work · España trabajo |

#### 3–4. Temas repetidos y voz genérica

- **40–50% solapamiento ciudad/país** — la lectura compuesta puede sonar a Sudáfrica dos veces.
- **Cuerpo / horizonte / reloj** — triada repetida en tres secciones de la misma ciudad.
- **Resiliencia / honestidad cruda** — bien curado, pero indistinguible de capa país en composición.

#### 5. Elementos a añadir

- **Ciudad costera concolidada** — viento, humedad, piel; no Table Mountain ni playa postal.
- **Barrios específicos sin mapa turístico** — ritmo distinto según colina vs plano (sin «dos ciudades» cliché).
- **Creatividad / tech / turismo** — economías reales que condicionan ritmo laboral.
- **Expatriado / remoto** — Cabo como lugar de pausa con coste de vida y contraste social implícito (sin juicio).
- **Éxito** — impacto con sentido, no solo visibilidad (alinear ciudad, no solo país).

---

### 3.4 Barcelona

#### 1. ¿Qué la hace única hoy?

**Casi nada a nivel urbano.** La lectura lab usa:

- Capa **España** (`spain`) — intensidad vital, calle, calor humano, presión por mostrarse.
- **Premium blocks** genéricos con `{ciudad}` sustituido por «Barcelona».
- **GUIDING_QUESTIONS** genéricas («¿Quién eres en Barcelona cuando no intentas gustar?»).

Barcelona **no** tiene: ritmo propio, imágenes urbanas, metáforas, `avoid` local.

#### 2. Frases intercambiables

| Lo que lee el usuario | Intercambiable con |
|-----------------------|-------------------|
| Toda la capa país España | Madrid, Valencia, Sevilla — cualquier ciudad española |
| «Conversación en la acera» (España `narrativeImages`) | Genérico ibérico |
| «Visibilidad pese: define qué quieres que se vea» | Toronto · España · blocks MC |
| Bloques `{ciudad}` | Cualquier ciudad del mundo |

#### 3–4. Temas repetidos y voz genérica

- **España ≠ Barcelona** — diseño TERRITORIAL (3.8h) ya señala: costa catalana, creatividad, bilingüismo, escala mediterránea distinta de Madrid.
- **Ausencia total de `CITY_ATMOSPHERE`** — Barcelona es el caso más débil del piloto de 5.
- **Riesgo de cliché futuro** — Sagrada Familia, Gaudí, playa, «capital del diseño» (todos en zona prohibida si se implementa mal).

#### 5. Elementos a añadir (prioridad alta)

- **Escala mediterránea densa** — manzanas, paseo, vida en calle sin fiesta eterna.
- **Creatividad / diseño / oficio** — trabajo visible pero no solo escaparate (distinto de Madrid institucional).
- **Bilingüismo y capas identitarias** — sutileza, no política partidista.
- **Mar y collserola** — borde urbano, brisa, verticalidad distinta de Lisboa.
- **Éxito** — proyecto propio, red creativa, reconocimiento por obra más que por status.

---

### 3.5 Tokio

#### 1. ¿Qué la hace única hoy?

**A nivel país sí; a nivel ciudad no.**

Japón aporta: orden, cuidado del detalle, reserva, deber, vínculo en gestos no verbales, pausa ritual.

**Tokio específicamente no aporta:**

- Densidad, anonimato en multitud, ritmo metro-estación-oficina.
- Contraste barrio residencial quieto vs cruce comercial.
- Estaciones como organismo, horarios, puntualidad urbana (no solo «disciplina japonesa»).
- Primavera/humedad/verano asfalto — cuerpo en megaciudad.

#### 2. Frases intercambiables

| Lo que lee el usuario | Intercambiable con |
|-----------------------|-------------------|
| Capa Japón completa | Osaka, Kyoto, Fukuoka — cualquier ciudad japonesa |
| «Precisión y constancia antes que visibilidad» | Patrón trabajo genérico KAIROS + Japón |
| «Silencio compartido que no pide ser llenado» | Japón `narrativeImages` — no es Tokio |
| Bloques `{ciudad}` | Cualquier ciudad |

#### 3–4. Temas repetidos y voz genérica

- **Orientalismo evitado** — bien en `avoidCliches`, pero el coste es **genericidad** sin sustituto urbano.
- **Tokio en preview lab = trabajo** — país aporta deber/precisión; falta urgencia urbana, escala, fatiga sensorial.
- **Sin imágenes urbanas** — la lectura no distingue megaciudad de pueblo japonés.

#### 5. Elementos a añadir (prioridad alta)

- **Megaciudad por capas** — quietud en un piso, ruido en otro; reglas no escritas del espacio público.
- **Ritmo estación-estación** — moverse como parte del día, no como turismo.
- **Trabajo visible / invisible** — oficio, servicio, horas largas, sentido del deber **urbano**.
- **Soledad en densidad** — vínculo que tarda; cercanía sin contacto (distinto de Japón rural).
- **Éxito** — maestría, mejora continua, reconocimiento por fiabilidad — en contexto metropolitano.

---

## IV. Análisis transversal

### 4.1 Frases intercambiables entre ciudades (top 12)

| # | Patrón / frase tipo | Ciudades afectadas |
|---|---------------------|-------------------|
| 1 | «El cuerpo puede/pide volver / descargar / ritmo propio» | Lisboa, Toronto, Cabo, blocks, interpretations |
| 2 | «Menos performar / teatro — más presencia / autenticidad» | Lisboa, Cabo, España, human presence |
| 3 | «Visibilidad / escaparate vs coherencia interna» | Toronto, Cabo, España, blocks MC |
| 4 | «Horizonte / escala que pone en perspectiva» | Toronto, Cabo, Sudáfrica, Lisboa (horizonte sin prisa) |
| 5 | «Esfuerzo sostenido / constancia / proceso» | Lisboa, Toronto, Canadá, Japón |
| 6 | «Confianza / vínculo construido despacio» | Lisboa, Toronto, Canadá, Japón |
| 7 | «Mesa / conversación / cotidiano» | Lisboa, Portugal, España |
| 8 | «Pausa / bajar exigencia / permiso» | Lisboa, Cabo, Sudáfrica, España |
| 9 | «En {ciudad}, …» bloques premium | **Todas** — voz compositor genérica |
| 10 | «Quizá notes / Puede que / Tal vez» país | **Todos los países** — mismo molde editorial |
| 11 | «Distancias que obligan a planificar el día» | Toronto = Canadá (duplicado) |
| 12 | «Dejar de luchar contra el reloj» | Cabo = Sudáfrica = interpretations |

### 4.2 Temas que se repiten demasiado

| Tema | Frecuencia | Problema |
|------|------------|----------|
| **Cuerpo vs agenda** | Alta | Válido en KAIROS; pierde utilidad discriminante |
| **Autenticidad vs performance** | Alta | Voz de marca, no de ciudad |
| **Visibilidad profesional** | Media-alta | Colapsa Toronto, Barcelona-vía-España, Cabo |
| **Conversación antes que confianza** | Media | Lisboa fuerte; Portugal la repite |
| **Horizonte / perspectiva / escala** | Media | Hemisferio norte y sur convergen |
| **Pausa negociada** | Media | Toronto, Cabo, España descanso |
| **Modales condicionales** | Muy alta | Necesarios anti-dogma; homogeneizan tono |

### 4.3 Dónde aparece voz genérica

| Capa | Ubicación | Efecto |
|------|-----------|--------|
| **Premium blocks** | `premium-blocks.js` | «En {ciudad}…» — mismo texto para Tokio y Lisboa |
| **GUIDING_QUESTIONS** | `narrative-intelligence-service.js` | Preguntas válidas pero no distintivas |
| **Human presence** | `city-premium-composition-service.js` | Transformaciones experienciales sin ancla urbana |
| **Country editorial line** | `buildCountryEditorialLine()` | Mismo molde «En Portugal, quizá notes…» |
| **Spine base** | goal + línea + bridge | Correcto que mande; puede opacar matiz urbano |
| **Barcelona / Tokio** | Sin atmosphere | 100% genérico + país |

### 4.4 Matriz ciudad × país (duplicación en lectura compuesta)

| Ciudad | Duplicación ciudad↔país | Riesgo en lectura final |
|--------|-------------------------|-------------------------|
| Lisboa | **Alta** (~30%) | Portugal repite mesa, luz, esfuerzo sostenido |
| Toronto | **Alta** (~35%) | Canadá repite distancias, cordialidad, proceso |
| Ciudad del Cabo | **Muy alta** (~45%) | Sudáfrica repite horizonte, silencio, reloj, cuerpo |
| Barcelona | N/A (solo país) | España sola no distingue Barcelona |
| Tokio | N/A (solo país) | Japón no distingue Tokio |

**Recomendación editorial (3.8f.6):** regla de **dedup semántico** país/ciudad — si imagen o matiz ya está en atmosphere, país debe aportar **macro distinto** (legal, escala nacional, tono colectivo), no repetir mesa/horizonte/distancia.

---

## V. Propuestas editoriales por ciudad

> Formato: propuesta de **matiz distintivo** para curación futura. No dogma. No postal. Compatible con `docs/voice_tone.txt`.

### 5.1 Lisboa

| Dimensión | Propuesta distintiva |
|-----------|---------------------|
| **Ritmo** | Pendiente y pausa conversacional: el día avanza en curvas, no en bloques; lo urgente pierde volumen sin detenerse del todo. |
| **Vínculo** | Confianza por proximidad cotidiana — mesa, barrio, repetición de gestos; ternura a veces velada por ironía elegante. |
| **Trabajo** | Oficio con alma, proyectos que caben en una vida; reputación por coherencia, no por escaparate. |
| **Descanso** | Recuperar gusto y conversación; permiso para bajar rendimiento sin desaparecer del mapa social. |
| **Éxito** | Ser recordado por quien te conoce de verdad; influencia discreta, red pequeña profunda, obra bien hecha. |
| **Clima emocional** | Luz suave sobre lo íntimo; melancolía sin castigo; afecto directo sin ruido. |

### 5.2 Toronto

| Dimensión | Propuesta distintiva |
|-----------|---------------------|
| **Ritmo** | Día con filo: invierno acumula, verano compensa; decisiones rápidas, distancias que obligan a planificar. |
| **Vínculo** | Acuerdos claros, consistencia en el tiempo; calidez cordial sin invasión; definición antes que fusión. |
| **Trabajo** | Escenario público de mérito; trayectoria documentada; prisa por demostrar lo que aún madura por dentro. |
| **Descanso** | Pausa negociada — compite con pendientes; descarga por movimiento, ordenar lo heredado. |
| **Éxito** | Trayectoria visible y creíble; «llegar» profesionalmente sin perder hilo identitario; mérito medible. |
| **Clima emocional** | Escala amplia — lo personal pequeño frente a la ciudad; soledad intervalo, honestidad práctica. |

### 5.3 Ciudad del Cabo

| Dimensión | Propuesta distintiva |
|-----------|---------------------|
| **Ritmo** | Pulso doble: intensidad al aire libre, recogimiento después; viento y luz marcan el paso. |
| **Vínculo** | Calor sin liviandad; franqueza con cuidado; confianza compartiendo espacio, no solo palabras. |
| **Trabajo** | Impulso y pausa alternados; iniciativa con procesos que maduran; sentido personal en contexto complejo. |
| **Descanso** | Volver al cuerpo; reentrenarse en recibir sol, aire, silencio; bajar exigencia sin performance de pausa. |
| **Éxito** | Impacto con verdad — coherencia entre valores y proyecto; visibilidad que no traiciona lo íntimo. |
| **Clima emocional** | Contraste vivido; belleza que devuelve a ti; resiliencia sin discurso heroico. |

### 5.4 Barcelona

| Dimensión | Propuesta distintiva |
|-----------|---------------------|
| **Ritmo** | Calle y estación — oleadas de estímulo y pausas en terraza; tarde larga sin siesta cliché. |
| **Vínculo** | Cercanía directa, amor de amigos y proyecto compartido; química en lo cotidiano, no solo gesto grande. |
| **Trabajo** | Creatividad con presión por mostrarse; coherencia entre imagen y obra; red profesional densa. |
| **Descanso** | Bajar volumen social sin culpa; recuperar ritmo propio entre oleadas; cuerpo en brisa y piedra. |
| **Éxito** | Obra reconocida en red creativa; influencia por diseño/proyecto, no por status vacío. |
| **Clima emocional** | Franqueza e ironía con calor; energía visible que no exige encogerse. |

### 5.5 Tokio

| Dimensión | Propuesta distintiva |
|-----------|---------------------|
| **Ritmo** | Precisión por capas — puntualidad del trayecto, quietud del hogar; megaciudad que respira en ciclos. |
| **Vínculo** | Respeto, tiempo, gestos sostenidos; cercanía sin contacto excesivo; confianza en lo repetido. |
| **Trabajo** | Deber urbano, mejora continua, oficio invisible; precisión antes que aplauso; horas largas con sentido. |
| **Descanso** | Orden interior; silencio ritual; pausa que no se siente vacía ni culpable. |
| **Éxito** | Maestría y fiabilidad; reconocimiento por constancia en sistema grande; excelencia sin espectáculo. |
| **Clima emocional** | Reserva cortés con profundidad bajo la forma; estímulo sensorial contenido. |

---

## VI. Recomendaciones para 3.8f.6 (editorial)

| Prioridad | Acción |
|-----------|--------|
| **P0** | Crear `CITY_ATMOSPHERE` para **Barcelona** y **Tokio** (mín. 35 líneas cada una, espejo en library) |
| **P0** | Regla dedup **ciudad↔país**: prohibir mismas imágenes en ambas capas (mesa Lisboa, distancias Toronto, horizonte Cabo) |
| **P1** | Reescribir `country-archetypes.js` imágenes duplicadas — país aporta macro, no copia ciudad |
| **P1** | Añadir dimensión **éxito** (`successTone`) en atmosphere — hoy ausente en las 3 curadas |
| **P2** | Diferenciar **Barcelona vs España** — país no debe ser la única voz de Barcelona |
| **P2** | Diferenciar **Tokio vs Japón** — país = contención cultural; ciudad = densidad, anonimato, ritmo metro |
| **P2** | Auditar premium-blocks — marcar bloques «solo si no hay atmosphere» o variantes por región |
| **P3** | Alinear con **Territorial Archetype Layer** (3.8h) — Barcelona como ciudad, no solo España |

---

## VII. Criterios de éxito (post-revisión editorial)

- [ ] Lectura ciega: identificar ciudad correcta ≥4/5 veces en panel lab
- [ ] Barcelona y Tokio con `citySlug` resuelto en `resolveCitySlug()`
- [ ] Cero duplicados exactos ciudad↔país en smoke semántico
- [ ] Cada ciudad con ≥3 imágenes urbanas **no intercambiables** con otra ciudad del piloto
- [ ] Dimensión **éxito** presente en atmosphere o goalTone por ciudad
- [ ] Smokes 3.8f existentes siguen PASS

---

## VIII. Referencias

| Documento | Relación |
|-----------|----------|
| `COUNTRY_ARCHETYPE_LAYER.md` | Capa país · peso 15% |
| `CITY_ATMOSPHERE_LIBRARY.md` | Fuente curada 3 ciudades |
| `TERRITORIAL_ARCHETYPE_LAYER.md` | Evolución multi-nivel |
| `KAIROS_CURRENT_CHECKPOINT.md` | Estado post-3.8f.4 |

---

*Auditoría editorial · Fase 3.8f.5b · Sin implementación · Sin commit automático*
