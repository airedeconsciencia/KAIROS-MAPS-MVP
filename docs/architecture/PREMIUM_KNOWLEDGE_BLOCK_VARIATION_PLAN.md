# Premium Knowledge Block Variation — Plan P0 (Fase 3.8f.7b)

> **Tipo:** auditoría + diseño de intervención mínima  
> **Alcance auditado:** `premium-blocks.js`, `premium-knowledge-service.js`, `city-premium-composition-service.js`, `dev-premium-editorial-variation-smoke.sh`  
> **Post-3.8f.7a:** human spine ya variado; clonación residual concentrada en capa knowledge.  
> **Sin código · sin commit · sin deploy**

---

## 1. Diagnóstico ejecutivo

Tras 3.8f.7a, la repetición editorial ya no viene del spine humano sino de **Premium Knowledge**: selección determinista + bloques `goals: ['any']` + prioridad fija por distancia.

Simulación local (15 lecturas piloto — Roberto `1973-05-29`, 5 ciudades × 3 goals, pipeline completo `deriveNarrativeContext` → `getBlocksForContext` → `composeCityReading`):

| Hallazgo | Evidencia |
|----------|-----------|
| **Un solo bloque domina el cuerpo** | `doc6_intensidad_linea_cercana` aparece en **10/15** lecturas usadas (`blocksUsed`) |
| **Universal transversal** | Ese bloque cubre **5/5 ciudades** y **3/3 goals** |
| **Causa raíz** | `premium-knowledge-service.js` lo inyecta en `priorityIds` cuando `best.distKm >= 200` (Lisboa trabajo 453 km, Toronto 316, Barcelona 297, Tokio 387, Cabo descanso 322…) |
| **Selección fantasma** | `doc6_integrado_sobre_sombra` se selecciona **15/15** pero **0/15** entra al cuerpo (narrative spine + presupuesto sección) |
| **Objetivos DOC-6 duplicados** | `doc6_objetivo_*` se seleccionan **5/5** por goal pero **0/15** usados — el compositor prioriza `humanTheme` / `humanConflict` en integración |
| **DOC-17 diferencia bien** | Bloques `doc17_*` aparecen según influencia dominante (Sol×AC Lisboa/Cabo, Venus×AC Barcelona, Marte×MC Cabo trabajo) — **2–4/15**, no universales |
| **Polish homogeneiza** | `applyTextPolish` transforma «La señal es notable…» → «tal vez la señal te resulte notable» — mismo esqueleto semántico en 10 lecturas |

**Conclusión:** el P0 no requiere reestructurar el catálogo (74 bloques, 12 combos DOC-17). Requiere **des-universalizar intensidad observar** y **dejar de reservar slots a bloques que nunca llegan al cuerpo**.

---

## 2. Respuestas a las 7 preguntas de auditoría

### 2.1 Bloques en 10+ lecturas piloto (`blocksUsed`)

| Bloque | Frecuencia | Slot | Goals filter |
|--------|:----------:|------|--------------|
| **`doc6_intensidad_linea_cercana`** | **10/15** | synthesis / observar | `any` |

*Ningún otro bloque supera 9/15 en cuerpo final.*

### 2.2 Bloques en las 5 ciudades (cualquier goal)

| Bloque | Ciudades | Frecuencia |
|--------|:--------:|:----------:|
| **`doc6_intensidad_linea_cercana`** | **5/5** | 10/15 |

Ciudades afectadas: Lisboa (trabajo), Toronto (×3), Barcelona (amor, descanso), Tokio (×3), Ciudad del Cabo (descanso).

### 2.3 Bloques en los 3 aspectos (cualquier ciudad)

| Bloque | Goals | Frecuencia |
|--------|:-----:|:----------:|
| **`doc6_intensidad_linea_cercana`** | **3/3** | 10/15 |

### 2.4 Bloques demasiado genéricos

**Clase G1 — region-agnostic + prioridad automática**

| ID | Texto (extracto) | Por qué es genérico |
|----|------------------|---------------------|
| `doc6_intensidad_linea_cercana` | «La señal es notable pero no máxima: el lugar habla claro…» | `goals: any`, sin `{ciudad}`, sin planet/angle; gatillo solo distKm |
| `doc6_intensidad_linea_exacta` | «Muy cerca del trazo la experiencia puede ser intensa…» | Misma lógica; 1/15 hoy pero mismo patrón |
| `doc6_integrado_sobre_sombra` | «…espejo exigente antes que como premio…» | `any` + auto-priority con `tensionMode`; nunca compone |
| `doc6_objetivo_amor_dc_venus` | «Con foco en amor, conviene priorizar el encuentro…» | Redundante con `humanTheme` / narrative spine |
| `doc6_objetivo_trabajo_mc` | «Con foco en trabajo, la trayectoria…» | Idem |
| `doc6_objetivo_descanso_ic` | «Con foco en descanso, importan la raíz…» | Idem |
| `doc6_conclusion_alineacion` | «{ciudad} no clasifica como destino bueno o malo…» | Metodología `any`; excluida por `METHODOLOGY_BLOCK_IDS` con narrative — correcto pero frágil |
| `doc5_*`, `doc6_jerarquia_*`, `doc17_max_dos_profundas` | Metodología | Clase C — no deben competir con voz viva |

**Clase G2 — DOC-17 con plantilla `{ciudad}` repetible**

| Patrón | Frecuencia | Nota |
|--------|:----------:|------|
| `doc17_sol_ac_t1`…`t4` | 4/15 c/u | Misma influencia Sol×AC en Lisboa amor/trabajo y Cabo amor/trabajo — **clonación geográfica del lab**, no del catálogo |
| `doc17_venus_ac_*` | 2/15 c/u | Barcelona-only (Venus×AC dominante) — **valioso** |
| `doc17_saturno_ac_*` | 1–2/15 | Barcelona — **valioso** |
| `doc17_marte_mc_*` | 1/15 c/u | Cabo trabajo — **valioso** |

**Clase G3 — compositor (fuera de premium-blocks, referencia)**

Pads/top-up ya tratados en 3.8f.7a. Knowledge sigue aportando frases «la señal / el lugar habla / favorece» vía `applyTextPolish`.

### 2.5 Bloques valiosos — mantener intocados

| Bloque / familia | Motivo |
|------------------|--------|
| **`doc17_*` T1–T4** por `interpKey` | Única capa que ata lectura a planeta×ángulo real del mapa |
| **`doc17_venus_ac_*`, `doc17_saturno_ac_*`, `doc17_marte_mc_*`** | Diferencian Barcelona vs Cabo vs Lisboa según ranking |
| **`doc6_marte_jupiter_friccion`** | Match específico `planetPairs`; no aparece en piloto Roberto pero aporta fricción real |
| **`doc7_*` reloc** | Condicionados a `relocationProfile`; no contaminan piloto actual |
| **`doc6_intensidad_linea_exacta`** (concepto) | Distancia ≤80 km es señal fuerte; Barcelona trabajo (71 km) — debe persistir pero **no clonar texto** |
| **Objetivos DOC-6 (concepto)** | Reglas editoriales válidas; problema es **doble capa** con narrative, no el texto en sí |

### 2.6 Bloques candidatos a variantes por eje

| Eje | Bloques | Propuesta |
|-----|---------|-----------|
| **goal** | `doc6_intensidad_linea_cercana`, `doc6_intensidad_linea_exacta` | 3 variantes amor / trabajo / descanso (tono observar distinto) |
| **angle** | intensidad (futuro) | Variante AC (presencia) vs MC (trayectoria) vs IC (cuerpo) según `best.angle` |
| **planet** | intensidad (futuro P1) | Matiz Venus/Sol/Marte en cola de observar — **fuera P0** |
| **city profile** | DOC-17 T1 | Ya llevan `{ciudad}`; ampliar combos DOC-17 en fase posterior, no P0 |
| **region family** | ninguno en blocks hoy | Country/city atmosphere ya cubren región; blocks deben evitar duplicar país |

**P0 recomienda solo `goal` + selección por `seed`**. Angle/planet son P1.

### 2.7 Intervención mínima P0 (3–5 bloques, 1 helper)

#### Bloques a tocar en `premium-blocks.js` (4)

| # | Bloque | Acción |
|---|--------|--------|
| 1 | **`doc6_intensidad_linea_cercana`** | Sustituir texto único por **pool de 3 variantes** (amor / trabajo / descanso) — mismo `id`, textos distintos exportados como array en catálogo o 3 ids hermanos (`…_amor`, `…_trabajo`, `…_descanso`) |
| 2 | **`doc6_intensidad_linea_exacta`** | **2 variantes** (pareja amor+descanso suave / trabajo intenso) |
| 3 | **`doc6_integrado_sobre_sombra`** | Reescritura ligera: quitar tono metodológico; **o** dejar texto y corregir selección (ver helper) |
| 4 | **`doc6_objetivo_amor_dc_venus`** | Una variante alternativa amor (encuentro vs vínculo lento) — **solo si** se decide seguir seleccionándolo; preferible **no seleccionar** con narrative |

*Quinto candidato opcional:* `doc17_sol_ac_t1_integrated` — añadir matiz distinto Lisboa/Cabo **no es P0** (misma influencia = mismo texto es correcto).

#### Helper nuevo (1) — `premium-knowledge-service.js`

```text
pickBlockVariant(blockOrPool, ctx, slotKey)
```

- Entrada: bloque con `text` string **o** `variants: { amor: [], trabajo: [], descanso: [] }`
- Selección: `hash32(seed + slotKey + blockId) % pool.length` dentro del pool del `goalId`
- Uso inmediato en `selectSynthesisBlocks` para intensidad cercana/exacta
- **Segundo cambio en servicio (sin helper extra):** retirar `doc6_integrado_sobre_sombra` y `doc6_objetivo_*` de `priorityIds` cuando `ctx.narrativeContext` existe — liberan slots sin tocar catálogo

#### Qué NO hacer en P0

- Reindexar 74 bloques
- Cambiar taxonomía A–E del audit 3.8f.7
- Tocar `city-premium-composition-service.js` salvo smoke
- Ampliar DOC-17 piloto (eso es 3.8f.7c)

---

## 3. Ranking bloques problemáticos

| Rank | Bloque | Score problema | 15 lecturas | 5 ciudades | 3 goals |
|:----:|--------|:------------:|:-----------:|:----------:|:-------:|
| **P0** | `doc6_intensidad_linea_cercana` | **10** | 10/15 body | 5/5 | 3/3 |
| P1 | `doc6_integrado_sobre_sombra` | 8 | 0 body / 15 selected | — | — |
| P1 | `doc6_objetivo_*` (×3) | 7 | 0 body / 5 selected c/u | — | 1 each |
| P2 | `doc17_sol_ac_t1…t4` | 4 | 4/15 c/u | 2/5 | 2/3 |
| P3 | `doc6_intensidad_linea_exacta` | 3 | 1/15 | 1/5 | 1/3 |
| — | Resto DOC-17 | 1–2 | ≤2/15 | ≤1/5 | variado |

---

## 4. Bloques intocables (P0)

| Bloque / regla | Razón |
|----------------|-------|
| Todos `doc17_*` excepto reescritura cosmética | Anclaje planeta×ángulo |
| `doc6_marte_jupiter_friccion` | Match astrológico específico |
| `doc7_*` | Capa reloc condicionada |
| `METHODOLOGY_BLOCK_IDS` | Gate ya existe; no debilitar |
| `doc6_contradiccion_friccion_evolutiva` | Requiere ≥2 influencias; no aparece en piloto pero es diferenciador |
| Human spine (3.8f.7a) | Cerrado; no mezclar en este sprint |

---

## 5. Propuesta P0 detallada

### 5.1 Cambio A — Variantes intensidad (premium-blocks.js)

**`doc6_intensidad_linea_cercana`** → 3 textos goal-aware (ejemplos orientativos):

| Goal | Tono observar |
|------|---------------|
| amor | «A esta distancia el vínculo se nota sin exigirte escena perfecta — espacio para conocer sin dominar la energía del encuentro.» |
| trabajo | «La trayectoria aquí se percibe con claridad moderada: impulso visible sin la presión de la línea exacta — más sostenible para probar un ciclo laboral.» |
| descanso | «El cuerpo registra la señal sin sobresaltos: ritmo marcado pero no maximalista — útil para recuperar sin convertir la pausa en prueba.» |

**`doc6_intensidad_linea_exacta`** → 2 variantes (trabajo / amor+descanso).

Implementación preferida: campo `variantsByGoal` en el bloque + helper (no triplicar ids en INDEX).

### 5.2 Cambio B — Selección inteligente (premium-knowledge-service.js)

1. **`pickBlockVariant`** al resolver intensidad antes de `selectedIds[id] = true`.
2. **Condicionar sombra:** solo añadir `doc6_integrado_sobre_sombra` si `tensionMode` **y** no hay `humanConflict` equivalente en narrative (o directamente: no priority si `narrativeContext`).
3. **Condicionar objetivos:** si `narrativeContext`, omitir `doc6_objetivo_*` en `priorityIds` (ya cubiertos por spine).

### 5.3 Cambio C — Smoke (extensión mínima)

Extender `dev-premium-editorial-variation-smoke.sh` **o** añadir `dev-premium-knowledge-variation-smoke.sh`:

| Assert | Umbral |
|--------|--------|
| Ningún `block.id` en **15/15** lecturas | maxRepeat ≤ **14** |
| Ningún bloque en **5 ciudades × 3 goals** con mismo texto | max ciudades ≤ **4** para texto idéntico |
| `doc6_intensidad_linea_cercana` (texto normalizado) | ≤ **4/15** post-P0 |
| Bloques `blocksUsed` distintos por lectura | ≥ **8** ids únicos en corpus 15 |
| Gates 3.8f.7a | siguen PASS |
| Longitud | 500–900 palabras |

---

## 6. Criterio de éxito (futuro 3.8f.7b implementado)

| Métrica | Baseline post-7a | Objetivo 7b |
|---------|:----------------:|:-----------:|
| Bloque knowledge en 15/15 lecturas | 0 (spine) / **1** (`doc6_intensidad…`) | **0** |
| Bloque en 5 ciudades × 3 goals | **1** | **0** |
| `doc6_intensidad_linea_cercana` frecuencia | 10/15 | **≤4/15** |
| Textos distintos intensidad (3 goals) | 1 | **≥3** |
| Selección sin uso (`selected` >> `used`) | 4 ids × 15 | **0** ids ghost ≥10/15 |
| Sensación plantilla en observar | Alta | Baja sin perder rigor DOC-6 |
| Smokes existentes | PASS | PASS |

---

## 7. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|--------|:-----:|:-------:|------------|
| Recorte intensidad deja observar < palabras | Media | Alto | Variantes más largas, no eliminar bloque |
| Variantes goal suenan “terapéuticas” | Media | Medio | QA voz KAIROS + gate anti-clínico existente |
| Retirar objetivos DOC-6 reduce “rigor metodológico” | Baja | Bajo | Objetivo ya vive en narrative spine |
| `pickBlockVariant` rompe determinismo | Baja | Alto | Seed ya estable; test determinismo ×2 |
| Sol×AC sigue clonando Lisboa/Cabo | Alta | Medio | Aceptado en P0; resolver ampliando influencias lab o city atmosphere en P1 |
| Cambiar texto intensidad sin cambiar polish | Baja | Bajo | Actualizar fingerprint smoke (no buscar «la señal es notable») |

---

## 8. Smokes necesarios

| Script | Rol |
|--------|-----|
| `dev-premium-editorial-variation-smoke.sh` | Regresión 3.8f.7a + añadir sección `blocksUsed` |
| **Nuevo** `dev-premium-knowledge-variation-smoke.sh` (recomendado) | Métricas block.id / texto / 5×3 matriz |
| `dev-city-premium-composition-smoke.sh` | Longitud + composición |
| `dev-premium-knowledge-smoke.sh` | Catálogo íntegro |
| `dev-narrative-intelligence-smoke.sh` | Spine no regresiona |

---

## 9. Roadmap sugerido post-P0

| Fase | Entregable |
|------|------------|
| **3.8f.7b** | Este plan implementado (intensidad + selección ghost) |
| 3.8f.7c | Ampliar DOC-17 piloto (12 combos → 20+) |
| 3.8f.7d | Variantes intensidad por `angle` |
| 3.8f.7e | Re-audit distintividad 3.8f.6c |

---

## 10. Referencias de simulación

- **Lab chart:** Roberto — Sol Géminis, Luna Aries, Asc Cáncer; UTC `1973-05-29T05:30:00Z`
- **Ciudades:** Lisboa, Toronto, Barcelona, Tokio, Ciudad del Cabo
- **Pipeline:** `KairosPremiumKnowledge.getBlocksForContext` → `KairosCityPremiumComposition.composeCityReading`
- **Métrica body:** `reading.meta.blocksUsed` (no solo `selectedIds`)

---

## Anexo — Matriz distKm × intensidad (15 lecturas)

| Ciudad | Goal | distKm | Intensidad seleccionada | En cuerpo |
|--------|------|--------|-------------------------|-----------|
| Lisboa | amor | 197 | — | — |
| Lisboa | trabajo | 453 | cercana | ✓ |
| Lisboa | descanso | 197 | — | — |
| Toronto | * | 316 | cercana | ✓ (×3) |
| Barcelona | amor | 297 | cercana | ✓ |
| Barcelona | trabajo | 71 | exacta | ✓ |
| Barcelona | descanso | 297 | cercana | ✓ |
| Tokio | * | 387 | cercana | ✓ (×3) |
| Cabo | amor | 80 | — | — |
| Cabo | trabajo | 124 | — | — |
| Cabo | descanso | 322 | cercana | ✓ |

Umbral servicio: `maxDistKm: 80` → exacta · `minDistKm: 200` → cercana · banda 80–200 km → **sin bloque intensidad** (correcto).

---

*Plan editorial · Fase 3.8f.7b audit · Sin código · Sin commit · Sin deploy*
