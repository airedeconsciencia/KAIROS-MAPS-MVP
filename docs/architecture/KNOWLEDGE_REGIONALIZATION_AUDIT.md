# Knowledge Regionalization — Auditoría P0 (Fase 3.8f.7c)

> **Tipo:** auditoría doc-only · sin implementación · sin commit obligatorio  
> **Lab:** Roberto `1973-05-29` · 5 ciudades × 3 goals = **15 lecturas premium**  
> **Post:** 3.8f.7a (human spine) + 3.8f.7b (intensidad DOC-6 por goal)  
> **Restricción de fase:** no aumentar bloques · no tocar DOC-17 · no tocar UI

---

## 1. Diagnóstico ejecutivo

Tras 7a y 7b, el cuello de botella de distintividad **ya no es atmosphere ni country** — es la **capa compositor universal** que rellena 500–900 palabras.

Evidencia en 15 lecturas piloto:

| Capa | Contribución a clonación transversal | Severidad |
|------|--------------------------------------|-----------|
| **`HUMAN_EDITORIAL_PADS_BY_GOAL.universal`** | Frases idénticas en **13–14/15** lecturas | **Crítica** |
| **`HUMAN_TOPUP_VARIANTS`** | Segunda ola de frases universales (**8–10/15**) | **Alta** |
| **`humanizePresenceText`** (DOC-17 blocks) | Inyecta `quizá` / `puede que` / `tal vez` en bloques planet×angle | **Media** |
| **`premium-blocks.js`** | Solo `doc6_intensidad_linea_cercana` en 5 ciudades (ya variado por goal en 7b) | **Baja** post-7b |
| **Narrative spine** | Metáforas `puerta`/`espejo` en conflictos; `ritmo`/`presencia` en atmosphere | **Media-baja** (más diferenciado por ciudad) |

**Conclusión:** la «voz universal KAIROS» que el usuario percibe en capturas proviene **~70% compositor pads/topup**, **~20% polish modal**, **~10% narrative + blocks residuales**.

No hace falta más bloques DOC-17 para esta fase. Hace falta **regionalizar o rotar el relleno editorial universal** sin tocar arquitectura.

---

## 2. Evidencia real (simulación 15 lecturas)

**Pipeline:** `deriveNarrativeContext` → `getBlocksForContext` → `composeCityReading`  
**Métricas:** conteo en cuerpo final (`sections[].body` unido)

### 2.1 TOP 25 frases exactas (normalizadas `{ciudad}`)

| Rank | Frase (extracto) | Apariciones | Lecturas | Capa probable |
|:----:|------------------|:-----------:|:--------:|---------------|
| 1 | «no necesitas prisa: solo presencia.» | 14 | 14/15 | universal pad |
| 2 | «cuando algo incomoda, escúchalo como brújula, no como fallo.» | 14 | 14/15 | universal pad |
| 3 | «a veces lo esencial aparece en gestos pequeños…» | 14 | 14/15 | universal pad |
| 4 | «lo hermoso vive en la repetición tranquila…» | 13 | 13/15 | universal pad |
| 5 | «{ciudad} enseña despacio, sin pedirte prisa.» | 13 | 13/15 | universal pad |
| 6 | «afloja la prisa de concluir; deja que la experiencia…» | 13 | 13/15 | universal pad |
| 7 | «un hilo vivo puede bastarte para seguir habitando {ciudad}…» | 13 | 13/15 | universal pad |
| 8 | «el mapa abre una puerta y tú decides si la caminas.» | 11 | 11/15 | universal pad |
| 9 | «tal vez descubras que algunas lecturas maduran despacio.» | 10 | 10/15 | topup |
| 10 | «vuelve a esta lectura en unas semanas…» | 10 | 9/15 | topup |
| 11 | «los ritmos honestos suelen guiar mejor…» | 9 | 8/15 | goal pad + topup |
| 12 | «puede que notes el lugar en detalles…» | 9 | 9/15 | topup |
| 13 | «un hilo vivo puede bastarte para seguir caminando {ciudad}…» | 9 | 9/15 | topup |
| 14 | «la coherencia no tiene que ser total: basta un hilo…» | 8 | 8/15 | topup |
| 15 | «a veces hay que caminar una escena cotidiana…» | 8 | 8/15 | topup |
| 16 | «quizá la clave no sea hacer más, sino escuchar cuál señal…» | 8 | 8/15 | topup |
| 17 | «puede que notes que {ciudad} se afina cuando el cuerpo…» | 8 | 8/15 | topup |
| 18 | «los ritmos honestos del encuentro suelen guiar…» | 5 | 5/5 amor | goal pad (template) |
| 19 | «mira si la cercanía aguanta cuando baja el impulso…» | 5 | 5/5 amor | goal pad |
| 20 | «si algo incomoda en el vínculo, escúchalo como brújula…» | 5 | 5/5 amor | goal pad |
| 21 | «lo contradictorio de hoy puede volverse legible… demostrar.» | 5 | 5/5 trabajo | goal pad (template) |
| 22 | «mira si el cansancio es de obra o de postureo…» | 5 | 5/5 trabajo | goal pad |
| 23 | «la cercanía de esta línea puede sentirse…» (intensidad) | 10 | 10/15 | premium-blocks 7b |
| 24 | «{ciudad} puede activar una prisa muy humana…» (conflict) | 5 | 5/5 trabajo | narrative spine |
| 25 | «dejar de llamar puerta a cualquier espejo» | 3 | 2/15 | narrative conflict |

### 2.2 TOP 25 conceptos (tokens en cuerpo)

| Rank | Concepto | Total | Lecturas |
|:----:|----------|:-----:|:--------:|
| 1 | cuerpo | 53 | 12/15 |
| 2 | prisa | 52 | **15/15** |
| 3 | ritmo | 50 | **15/15** |
| 4 | gesto | 35 | 14/15 |
| 5 | hilo | 30 | **15/15** |
| 6 | brújula | 28 | 14/15 |
| 7 | presencia | 25 | **15/15** |
| 8 | vínculo | 25 | 5/15 |
| 9 | verdad | 25 | **15/15** |
| 10 | escena | 24 | 12/15 |
| 11 | pausa | 23 | 5/15 |
| 12 | puerta | 22 | 13/15 |
| 13 | encuentro | 22 | 6/15 |
| 14 | mapa | 19 | 12/15 |
| 15 | sostener | 18 | 13/15 |
| 16 | calma | 17 | 9/15 |
| 17 | ruido | 17 | 10/15 |
| 18 | lugar | 16 | 12/15 |
| 19 | coherencia | 13 | 11/15 |
| 20 | trayectoria | 10 | 5/15 |
| 21 | habitar | 8 | 7/15 |
| 22 | contraste | 6 | 5/15 |
| 23 | matiz | 4 | 4/15 |
| 24 | personaje | 2 | 2/15 |
| 25 | performance | 1 | 1/15 |

**Patrón:** conceptos de **vocabulario KAIROS universal** (`prisa`, `ritmo`, `hilo`, `presencia`, `verdad`) aparecen en **todas** las lecturas — no porque falte atmosphere, sino porque los **pads universales** los anclan.

---

## 3. Qué proviene de cada capa

### 3.1 Knowledge (`premium-blocks.js`)

| Bloque | ≥3 ciudades | 3 goals | Notas |
|--------|:-----------:|:-------:|-------|
| `doc6_intensidad_linea_cercana` | **5/5** | **3/3** | 10/15 body · **texto ya difiere por goal** (7b) pero comparte estructura «cercanía de esta línea» |
| `doc17_sol_ac_*` | 2/5 (Lisboa, Cabo) | 2/3 | Misma influencia lab · no universal |
| `doc17_venus_ac_*` | 1/5 (Barcelona) | 2/3 | Diferenciador real |
| `doc17_marte_mc_*` | 1/5 (Cabo trabajo) | 1/3 | Diferenciador real |

**Frases semánticamente equivalentes en blocks:**

- «el lugar habla / favorece / activa» → transformadas por `humanizePresenceText` a modales
- «abre puertas» en Sol×AC, Mercurio×MC (DOC-17)
- «ritmo» en múltiples slots T1/T2

**Veredicto:** post-7b, blocks **no son** el principal clonador transversal. DOC-17 aporta diferencia cuando la influencia dominante cambia.

### 3.2 Polish (`applyTextPolish` → `softenMethodologyText` + `humanizePresenceText`)

**`softenMethodologyText`** — reescrituras deterministas:

| Entrada (block) | Salida típica | Efecto regional |
|-----------------|---------------|-----------------|
| «con foco en amor/trabajo/descanso» | «En amor/trabajo/descanso, {ciudad}…» | Bajo · inserta ciudad pero mismo esqueleto |
| «como mucho dos capas» | «Con dos hilos vivos basta…» | **Introduce hilo universal** |
| «conviene moderar expectativas» | «afloja ritmo y expectativas» | Refuerza ritmo/prisa |

**`humanizePresenceText`** — inyecta modales en bloques DOC-17:

| Patrón origen | Reemplazo | Frecuencia efecto |
|---------------|-----------|-------------------|
| `el lugar favorece` | quizá/puede que notes que se abre | Homogeneiza 5 ciudades |
| `el lugar habla` | tal vez notes que el lugar habla | Idem |
| `puede activarse` | quizá se active | Idem |
| `la señal es notable` | tal vez la señal te resulte notable | Intensidad 7b |

**Modales agregados:** `quizá` 59× · `tal vez` 30× · `puede que notes` 18× en 15 lecturas.

**`claimMetaphor`** limita `como brújula` a 1 fingerprint/lectura, pero **`needFill` bypass** en padding permite **2× brújula/lectura** (goal pad + universal pad).

**Veredicto:** polish **no crea** las frases universal más graves, pero **amplifica modales** y **no regionaliza**.

### 3.3 Narrative Intelligence

| Subcapa | Repetición | Distintividad ciudad |
|---------|------------|----------------------|
| `cityAtmosphere.selectedLines` | Baja entre ciudades | **Alta** (5 slugs únicos) |
| `countryContext.lines` | 0–2/lectura | **Media** (país curado) |
| `HUMAN_CONFLICT_BY_LABEL` | «puerta/espejo» en amor Barcelona/Lisboa | Media |
| `HUMAN_THEME_BY_GOAL` | «presencia — no personaje» | Baja (goal, no ciudad) |
| `humanClosing` / `humanObserve` (7a) | maxRepeat 1–2 | **Alta** post-7a |

**Metáforas transversales en narrative:**

- `puerta` / `espejo` — conflict amor (dogma controlado pero repetible)
- `ritmo`, `presencia`, `coherencia` — atmosphere + spine
- «dejar de llamar puerta a cualquier espejo» — Lisboa + Barcelona amor

**Veredicto:** narrative **ya diferencia** ciudades en atmosphere; el problema es que **pads compositor tapizan** esa diferencia con 8 frases universales por lectura.

---

## 4. Regiones culturales existentes vs faltantes

### 4.1 Ya en producto (sin capa «regional pads»)

| Región / matiz | Dónde vive | Cobertura piloto 5 ciudades |
|----------------|------------|----------------------------|
| **Ciudad** | `CITY_ATMOSPHERE_INDEX` (Lisboa, Toronto, Cabo, Barcelona, Tokio) | 5/5 |
| **País** | `country-archetypes.js` · `region` field | 5/5 (PT, ES, CA, JP, ZA) |
| **Goal** | spine + pads by goal + intensidad 7b | 3/3 |
| **Influencia** | DOC-17 por interpKey | Variable |

**Country `region` en catálogo actual:**

| region (country-archetypes) | Países piloto |
|----------------------------|---------------|
| Europa occidental | Portugal, Francia, UK, Canadá* |
| Europa meridional | Italia, España |
| Asia oriental | Japón |
| África austral | Sudáfrica |
| América del Norte | Canadá |
| América del Sur | Brasil, Argentina |

\* Canadá tiene doble etiqueta conceptual (anglo + occidental).

### 4.2 Faltante para 3.8f.7c

No existe **regionalización del relleno compositor** (`HUMAN_EDITORIAL_PADS.universal`, `HUMAN_TOPUP_VARIANTS`).

Propuesta de familias (design only):

| Familia | Ciudades piloto | Gap vs country region |
|---------|-----------------|------------------------|
| **IBERIAN** | Lisboa, Barcelona | Parcialmente cubierto por PT/ES country + atmosphere |
| **ANGLO** | Toronto | Parcialmente CA country |
| **EAST_ASIAN** | Tokio | JP country + atmosphere |
| **AFRICAN_COASTAL** | Ciudad del Cabo | ZA country · costa ≠ interior |
| **MEDITERRANEAN** | Barcelona (overlap) | No explícito |
| **NORDIC** | — | Sin ciudad piloto |
| **PACIFIC** | — | Sin ciudad piloto |

**Nota:** country archetype ya aporta matiz regional **en 1–2 líneas**; el universal pad aporta **8–12 líneas idénticas** — ratio desbalanceado ~1:6.

---

## 5. Ranking bloques problemáticos (post-7b)

| Prioridad | Fuente | Item | Impacto |
|:---------:|--------|------|---------|
| **P0** | compositor | `HUMAN_EDITORIAL_PADS_BY_GOAL.universal` (8 frases) | 13–14/15 lecturas |
| **P0** | compositor | `HUMAN_TOPUP_VARIANTS` (10 frases) | 8–10/15 |
| **P1** | compositor | Template «los ritmos honestos del {dominio}…» ×3 goals | 5/5 por goal |
| **P1** | compositor | Template «escúchalo como brújula — no como {fallo}» ×3 goals | 5/5 por goal |
| **P1** | compositor | `claimMetaphor` bypass cuando `needFill` | 2× brújula/lectura |
| **P2** | polish | `humanizePresenceText` modales en DOC-17 | Homogeneiza bloques diferenciados |
| **P2** | polish | `softenMethodologyText` → «dos hilos vivos» | Introduce hilo |
| **P3** | narrative | Conflict «puerta/espejo» | 2–3/15 |
| **P3** | blocks | Intensidad cercana (estructura compartida) | 10/15 · mitigado por goal en 7b |
| **P4** | blocks | Sol×AC clone Lisboa/Cabo | Lab chart · no regional |

---

## 6. Propuesta: Knowledge Regional Layers (design only)

### 6.1 Principio

**No añadir bloques.** Reetiquetar y dividir pools **existentes** del compositor:

```
HUMAN_EDITORIAL_PADS_BY_GOAL[goal]  → mantener (ya goal-aware)
HUMAN_EDITORIAL_PADS_UNIVERSAL      → sustituir por
HUMAN_EDITORIAL_PADS_BY_REGION[regionFamily][goal?]
HUMAN_TOPUP_VARIANTS                → idem regional + reducir count universal
```

**Resolución determinista:**

```text
regionFamily = resolveRegionFamily(city, countryContext)
pool = pads[regionFamily][goalId] || pads[regionFamily].universal
pick = hash32(seed + regionFamily + slot) % pool.length
```

**Mapping piloto:**

| Ciudad | regionFamily |
|--------|--------------|
| Lisboa | IBERIAN |
| Barcelona | IBERIAN (o MEDITERRANEAN si se split) |
| Toronto | ANGLO |
| Tokio | EAST_ASIAN |
| Ciudad del Cabo | AFRICAN_COASTAL |

### 6.2 Alcance P0 mínimo (sin implementar)

| Cambio | Archivos | Bloques nuevos |
|--------|----------|:--------------:|
| Split universal pad → 5 familias × 6–8 frases | `city-premium-composition-service.js` only | **0** |
| Split topup → 5 familias × 4 frases + 2 global | idem | **0** |
| `resolveRegionFamily(city, countryId)` helper | idem | **0** |
| Endurecer `claimMetaphor` en `needFill` | idem | **0** |
| Smoke regional repetition | `dev-premium-editorial-variation-smoke.sh` ext. | **0** |

**Fuera de scope 7c:** DOC-17, premium-blocks.js, narrative-intelligence, UI.

### 6.3 Coste estimado

| Dimensión | Estimación |
|-----------|------------|
| **Redacción** | 5 familias × (8 universal + 4 topup) ≈ **60 frases** curadas (reescritura, no net-new conceptos) |
| **Código** | 1 helper + refactor pools · **~120–180 LOC** · 1 archivo servicio |
| **QA** | Extender smoke editorial + manual 5 ciudades |
| **Tiempo** | **1 sprint DEV** (paralelo a redacción) |

### 6.4 Riesgo

| Riesgo | Prob. | Mitigación |
|--------|:-----:|------------|
| Estereotipo regional | Media | Prudencia country-archetype · evitar clichés · revisión humana |
| Lisboa ≈ Barcelona (IBERIAN) | Alta | Sub-split MEDITERRANEAN o citySlug override |
| Lecturas <500 palabras | Baja | Mantener volume guard |
| Canadá / UK / US colisión ANGLO | Media | `countryId` fine-grain antes que continente |
| Bypass atmosphere | Media | Cap regional lines ≤40% palabras pad |

### 6.5 Mejora esperada

| Métrica | Hoy (15 lect.) | Objetivo 7c |
|---------|:--------------:|:-----------:|
| Frase universal idéntica en ≥10/15 | **7 frases** | **0** |
| «escúchalo como brújula» total | 28 | **≤8** |
| «un hilo vivo puede bastarte» | 22 | **≤6** |
| Concepto `prisa` en 15/15 lecturas | 52× | ≤35× |
| Distintividad ciudad (subjetivo) | ~7.8 | **~8.3** |
| Sensación premium | ~8.2 | **~8.5** |

---

## 7. Smokes necesarios (futuro)

| Smoke | Assert regional |
|-------|-----------------|
| `dev-premium-editorial-variation-smoke.sh` | Ninguna frase universal pad en >4/15 lecturas |
| `dev-premium-knowledge-variation-smoke.sh` | Sin regresión blocks |
| Nuevo opcional `dev-premium-regional-pad-smoke.sh` | Misma frase pad ≤2/15 · ≥3 familias distintas en corpus |

---

## 8. Criterio de éxito 7c (implementación futura)

1. Ninguna frase de `universal` pad aparece en **>4/15** lecturas.
2. Cada familia regional aporta **≥4 frases únicas** no compartidas con otra familia.
3. Lisboa ≠ Barcelona en **≥2 frases pad** (city override o subfamilia).
4. Longitud 500–900 intacta.
5. Gates 7a/7b/3.8g smokes **PASS**.

---

## Referencias

| Artefacto | Rol |
|-----------|-----|
| `src/services/city-premium-composition-service.js` | Pads, topup, polish |
| `src/content/premium-blocks.js` | Blocks (post-7b bajo clonación) |
| `src/services/narrative-intelligence-service.js` | Atmosphere + spine |
| `src/content/country-archetypes.js` | Region country |
| `.cache/knowledge-regionalization-audit.json` | Datos simulación 15 lecturas |
| `docs/architecture/PREMIUM_KNOWLEDGE_BLOCK_VARIATION_PLAN.md` | Auditoría 7b |

---

*Auditoría · Fase 3.8f.7c · Doc-only · Sin implementación · Sin deploy*
