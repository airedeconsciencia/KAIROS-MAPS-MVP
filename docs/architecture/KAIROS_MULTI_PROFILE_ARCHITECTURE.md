# KAIROS MAPS — Arquitectura Multi-Perfil (futuro)

**Fase 3.6e** · Documento estratégico (sin implementación)  
**Estado:** validación arquitectónica  
**Alcance:** evitar acoplamiento del Bridge a una sola carta natal individual

---

## Resumen ejecutivo

KAIROS hoy opera **Natal individual → Bridge → Mapa**. El producto completo exigirá **ocho modos interpretativos** sobre la misma geografía: natal, relocación, sinastría, compuesta, Davison, relocaciones de cartas de pareja y compatibilidad geográfica de pareja.

Este documento define cómo **generalizar el contrato** sin reescribir el Bridge ni los motores ya congelados. La regla central:

> El Bridge **no conoce** sinastría ni Davison. Solo consume un **`BridgeSignalProfile`** normalizado — sea cual sea su origen.

La arquitectura actual (compositor natal lite + `bridgeProfile` + `KairosNatalMapBridge.buildBridge`) es el **primer perfil** (`NATAL`). Los demás son **adaptadores** que producen el mismo shape de señal hacia el mapa.

---

## 1. Tipos de perfil futuros

| ID | Tipo | Descripción | Origen de cálculo | Tier esperado |
|----|------|-------------|-------------------|---------------|
| `NATAL` | Carta natal individual | Sol/Luna/Asc + planetas esenciales | `chart-service` + kairos-core | FREE (lite) |
| `RELOCATION` | Relocación individual | ASC/MC/casas recalculadas en ciudad X | `getRelocatedAngles` / chart-service ext. | PREMIUM |
| `SYNASTRY` | Sinastría | Aspectos cruzados A↔B, overlays | Motor pareja (futuro) | PREMIUM |
| `COMPOSITE` | Carta compuesta | Punto medio chart A + B | Motor pareja (futuro) | PREMIUM |
| `DAVISON` | Carta Davison | Punto medio temporal-espacial | Motor pareja (futuro) | PREMIUM |
| `COMPOSITE_RELOCATION` | Reloc. carta compuesta | Compuesta recalcada en ciudad X | Compuesta + reloc | PREMIUM |
| `DAVISON_RELOCATION` | Reloc. Davison | Davison recalcada en ciudad X | Davison + reloc | PREMIUM |
| `COUPLE_GEO` | Compatibilidad geográfica pareja | Bridge(A) + Bridge(B) + intersección en mapa | Dos perfiles + Cities Layer | PREMIUM |

### Relación con módulos UI (roadmap producto)

| Módulo sidebar | Perfil(es) principal(es) |
|----------------|--------------------------|
| Carta | `NATAL` |
| Reloc | `RELOCATION`, `COMPOSITE_RELOCATION`, `DAVISON_RELOCATION` |
| Pareja | `SYNASTRY`, `COMPOSITE`, `DAVISON` |
| Destino | `COUPLE_GEO`, Cities Layer |

---

## 2. Contrato genérico — `BridgeSignalProfile`

Contrato **estable** entre cualquier compositor/adaptador y el Bridge. Evoluciona `meta.bridgeProfile` (3.6d) sin romper consumidores.

```javascript
{
  schemaVersion: '0.2.0-multi-scaffold',
  profileType: 'NATAL' | 'RELOCATION' | 'SYNASTRY' | 'COMPOSITE' | 'DAVISON'
             | 'COMPOSITE_RELOCATION' | 'DAVISON_RELOCATION' | 'COUPLE_GEO',

  profileKey: string,           // hash estable p.ej. "natal|1973-05-29|..." o "syn|idA|idB"
  participantKeys: string[],    // 1 = individual; 2 = pareja; N futuro

  tags: string[],               // vocabulario semántico unificado (communication, intimacy…)
  themes: string[],             // subset geo-relevante (máx. 6–8)
  tensionMode: boolean,

  dominantPatterns: {
    roles: string[],            // NATAL: ['ASC','MOON','SUN']; SYNASTRY: ['VENUS_MARS',…]
    contradictionPairs: object[],
    affinityHints: object[]     // opcional: pares con score para pareja
  },

  sourceIds: {
    fragmentIds: string[],      // IDs curados en content/*.js
    chartRefs: string[],        // refs motor: 'SUN_GEMINI', 'COMPOSITE_MC_CAPRICORN'
    documentRefs: string[]      // trazabilidad editorial: 'voice_tone', 'interpretations.txt#T2'
  },

  meta: {
    goal: string | null,        // mainGoal perfil: amor, trabajo, descanso…
    cityRef: string | null,     // reloc / geo: slug ciudad
    derivedFrom: string | null  // p.ej. COMPOSITE_RELOCATION ← COMPOSITE + RELOCATION
  }
}
```

### Mapeo desde `bridgeProfile` actual (NATAL)

| Campo 3.6d | Campo multi-perfil |
|------------|-------------------|
| `tags` | `tags` |
| `themes` | `themes` |
| `tensionMode` | `tensionMode` |
| `dominantRoles` | `dominantPatterns.roles` |
| `contradictionPairs` | `dominantPatterns.contradictionPairs` |
| `sourceFragmentIds` | `sourceIds.fragmentIds` |
| — | `profileType: 'NATAL'` |
| — | `participantKeys: [natalKey]` |

**Migración:** `buildBridge(input)` acepta hoy `{ tags, themes, tensionMode, mapLines }`. En 4.x puede aceptar `{ signalProfile, mapLines }` con fallback al shape legacy.

---

## 3. Qué debe recibir el Bridge

### Input mínimo (invariante)

```javascript
{
  signalProfile: BridgeSignalProfile,  // o shape legacy tags/themes/tensionMode
  mapLines: MapLineRef[],              // 40 líneas astro.js — mismo mapa base
  context?: {
    mainGoal: string | null,
    cityRef: string | null,
    compareProfile: BridgeSignalProfile | null  // COUPLE_GEO: segundo perfil
  }
}
```

### Reglas

1. **Un mapa, N perfiles** — las líneas AC/DC/MC/IC no cambian por tipo de carta; cambia la **priorización**.
2. **Sin texto interpretativo** — el Bridge nunca recibe `reading`, `headline`, ni copy de `interpretations.js`.
3. **Determinismo** — mismo `signalProfile` + `mapLines` → mismo output (salvo version bump).
4. **Fail-soft** — perfil incompleto → `ok: false`; mapa sin highlight.

### Input específico por tipo (adaptadores upstream)

| profileType | Adaptador futuro | Produce signalProfile desde |
|-------------|------------------|----------------------------|
| `NATAL` | `natal-composition-service` ✅ | `composeNatalLiteReading` → `bridgeProfile` |
| `RELOCATION` | `reloc-composition-service` | delta ASC/MC + fragmentos `reloc-lite.js` |
| `SYNASTRY` | `synastry-composition-service` | aspectos cruzados + tags pareja |
| `COMPOSITE` | `composite-composition-service` | carta compuesta → tags roles compuestos |
| `DAVISON` | `davison-composition-service` | carta Davison → tags |
| `COMPOSITE_RELOCATION` | pipeline compuesta + reloc | merge tags con peso ciudad |
| `DAVISON_RELOCATION` | pipeline Davison + reloc | idem |
| `COUPLE_GEO` | `couple-geo-bridge-service` | intersección priorityLines(A) ∩ priorityLines(B) |

---

## 4. Qué debe devolver el Bridge

### Output actual (v0.1 — reutilizable)

```javascript
{
  ok: true,
  profileType: 'NATAL',           // eco del input — trazabilidad
  profileKey: string,
  matches: BridgeLineMatch[],
  priorityLines: string[],
  confidence: number,
  meta: { schemaVersion, tagCount, themeCount, highCount, … }
}
```

### Extensiones futuras (sin romper v0.1)

| Campo | Cuándo | Uso |
|-------|--------|-----|
| `sharedPriorityLines` | `COUPLE_GEO` | Líneas altas en A **y** B |
| `divergentLines` | `COUPLE_GEO` | Alta en A, baja en B — UI explica tensión |
| `relocDelta` | `RELOCATION*` | Qué ángulos cambian vs natal base |
| `compareMeta` | Sinastría | No copy — solo IDs de aspectos que influyeron score |

**Regla:** popup mapa sigue usando `interpretations.js` por `interpretationKey`; el Bridge solo entrega **IDs y scores**.

---

## 5. Capas reutilizables vs específicas

### Reutilizables (individual + pareja)

| Capa | Artefacto | Notas |
|------|-----------|-------|
| Motor mapa | `astro.js` | 40 líneas — **congelado** |
| Motor natal WASM | `kairos-core` | Base para compuesta/Davison vía servicios |
| Bridge core | `natal-map-bridge-service.js` | Scoring tag→planeta, theme→ángulo |
| Vocabulario tags | `semanticTags` en fragmentos | Mismo léxico Sol/Luna/pareja |
| Mapa ciudad×línea | `interpretations.js` | 40×3 objetivos — no duplicar en natal-lite |
| Voz y Tono | `docs/voice_tone.txt` | Gate obligatorio todo copy |
| Golden gate | `dev/golden/` | Natal; extender referencias pareja aparte |
| Patrón content | `src/content/*.js` IIFE + lookup | natal-lite → synastry-lite → composite-lite |
| DEV labs | `src/dev/*-preview.html` | bridge-preview, futuros syn-preview |

### Específicas de pareja / multi-participante

| Capa | Artefacto futuro | Notas |
|------|------------------|-------|
| Cálculo sinastría | `synastry-service.js` | Aspectos cruzados; no en bridge |
| Cálculo compuesta/Davison | `composite-service.js`, `davison-service.js` | Midpoint math |
| Contenido pareja | `content/synastry-lite.js`, `relationship-*.js` | Fragmentos A↔B |
| Compositor pareja | `synastry-composition-service.js` | Produce `BridgeSignalProfile` |
| Merge geo pareja | `couple-geo-bridge-service.js` | Intersección de priorityLines |
| UI Pareja | workspace `pareja` | Segundo perfil onboarding |
| Persistencia | Firestore `couples/{id}` | Dos `participantKeys` |
| Entitlements | feature flags | SYNASTRY, COMPOSITE gated |

### Individual-only (por ahora)

| Capa | Estado |
|------|--------|
| Panel Carta natal lite | ✅ operativo |
| `bridgeProfile` compositor | ✅ 3.6d |
| Onboarding single birthData | ✅ operativo |

---

## 6. Documentos canónicos detectados

### En repo (runtime o gate editorial)

| Prioridad | Documento | Rol |
|-----------|-----------|-----|
| 1 | `docs/voice_tone.txt` | **Voz, tono, prohibiciones** — gate #1 todo fragmento |
| 2 | `src/content/interpretations.js` | Copy mapa ciudad×línea×objetivo |
| 3 | `docs/interpretations.txt` | Biblioteca T1–T4; profundidad editorial mapa |
| 4 | `src/content/natal-lite.js` | Fragmentos natal lite + `semanticTags` |
| 5 | `docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md` | Capas interpretativas, FREE/PREMIUM |
| 6 | `docs/architecture/NATAL_MAP_BRIDGE_ARCHITECTURE.md` | Bridge natal→mapa |
| 7 | `docs/architecture/NATAL_MAP_BRIDGE_SERVICE.md` | Contrato `buildBridge` + bridgeProfile |
| 8 | `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | Producto, fases, límites FREE |
| 9 | `docs/architecture/NATAL_LITE_STATUS.md` | Checklist pre-deploy natal lite |
| 10 | `docs/visual_identity.txt` | Identidad visual (no interpretación) |
| 11 | `docs/onboarding.txt` | Flujo primer uso |
| 12 | `docs/roadmap.txt` | Visión producto histórica |
| 13 | `docs/astro_engine.txt` | Contrato motores + `getRelocatedAngles` |

### Referenciados pero **fuera del repo** (canónicos editoriales — indicar explícitamente)

| Documento | Rol | Estado |
|-----------|-----|--------|
| Arquitectura Interpretativa Avanzada | Scoring profundo, IA futura | ⚠️ OneDrive — no en runtime |
| Manual Maestro Astrocartografía | Ciudad, líneas, objetivos vitales | ⚠️ OneDrive |
| Relocación Astrológica | Delta natal↔reloc | ⚠️ OneDrive |
| Bases terapéuticas / documentos clínicos | Reutilización cautelosa | ⚠️ No versionados en repo — **riesgo** |

**Regla:** no inventar voz nueva. Todo fragmento pareja debe pasar por `voice_tone.txt` + revisión contra Manual Astrocartografía (externo) antes de merge.

---

## 7. Flujos objetivo

### Hoy (3.6 — operativo / scaffold)

```
birthData → chart-service → composeNatalLiteReading
         → meta.bridgeProfile → buildBridge → priorityLines
         → (3.7a) highlight mapa
```

### Futuro individual ampliado

```
birthData + city → reloc-service → reloc-composition
                → BridgeSignalProfile(RELOCATION)
                → buildBridge → priorityLines_reloc
```

### Futuro pareja

```
profileA + profileB → synastry-service → synastry-composition
                   → BridgeSignalProfile(SYNASTRY)
                   → buildBridge → priorityLines_syn

profileA + profileB → composite-service → composite-composition
                   → BridgeSignalProfile(COMPOSITE)
                   → buildBridge → priorityLines_comp

buildBridge(A) + buildBridge(B) → couple-geo-merge
                               → sharedPriorityLines
                               → Cities Layer
```

**Sin reescribir Bridge core** — solo nuevos adaptadores que emiten `BridgeSignalProfile`.

---

## 8. Riesgos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Duplicación de contenido** | natal-lite vs synastry-lite repiten Sol en Géminis | Tags compartidos; copy distinto solo donde el rol cambia (individual vs “entre dos”) |
| **Contradicciones natal ↔ pareja** | Carta dice X; sinastría dice ¬X | `contradictionPairs` en perfil; UI no fusiona readings; COUPLE_GEO usa intersección, no promedio |
| **Explosión de fragmentos** | 12 signos × 3 roles × 8 tipos = inviable | Rollout por tipo; sinastría lite = aspectos clave, no 144 combos |
| **Bridge acoplado a NATAL** | Refactor costoso en 4.x | Este doc + `profileType` desde 3.7; alias bridgeProfile → signalProfile |
| **Dependencia IA** | Pareja “generada” sin curaduría | IA Fase 5+ solo selecciona fragment IDs; motores y Bridge deterministas |
| **Docs terapéuticos externos** | Tono clínico vs Kairos | No importar verbatim; `sourceIds.documentRefs` + revisión voice_tone |
| **Reloc × mapa confundidos** | Usuario cree que línea “se mueve” | Copy claro: mapa fijo; reloc cambia **énfasis**, no geometría |
| **Compuesta vs Davison** | Usuario no entiende diferencia | UI premium separada; no mezclar perfiles en un solo reading |

---

## 9. Roadmap 3.7 → 5.x

| Fase | Entrega | Perfil(es) | Bridge |
|------|---------|------------|--------|
| **3.7a** | Highlight mapa natal | `NATAL` | `bridgeProfile` → priorityLines |
| **3.7b** | Reloc scaffold DEV | `RELOCATION` | Mismo buildBridge; adapter reloc |
| **3.7c** | Cities Layer teaser | `NATAL` + city | Bridge + distancia línea |
| **3.8** | Compatibility scaffold | `COUPLE_GEO` | Merge dos Bridge outputs |
| **4.1** | Reloc premium UI | `RELOCATION` | reloc-lite.js content |
| **4.2** | Segundo participante onboarding | — | `participantKeys[2]` |
| **4.3** | Sinastría lite DEV | `SYNASTRY` | synastry-composition → signalProfile |
| **4.4** | Compuesta lite DEV | `COMPOSITE` | composite-composition |
| **4.5** | Davison lite DEV | `DAVISON` | davison-composition |
| **4.6** | Reloc compuesta/Davison | `COMPOSITE_RELOCATION`, `DAVISON_RELOCATION` | Pipeline compuesto |
| **5.0** | IA interpretativa | Todos | Selección fragment IDs; no recalcular |
| **5.x** | PDF / informes pareja | Todos | Snapshot serializado signalProfile + mapa |

### Criterio de no-regresión

- Golden natal 75/75 intacto en cada fase
- Bridge smoke + composition smoke PASS
- Un solo `buildBridge` — no forks por tipo de carta

---

## 10. Decisiones arquitectónicas (ADRs implícitas)

1. **AD-MP-01:** El mapa astrocartográfico es **único por nacimiento** (UTC + lat/lon origen). Reloc y pareja cambian **interpretación**, no recalculan líneas planetarias salvo producto futuro explícito.
2. **AD-MP-02:** `BridgeSignalProfile` es el **único** input semántico al Bridge.
3. **AD-MP-03:** Pareja requiere **dos** `participantKeys` mínimo; COUPLE_GEO es capa **sobre** dos Bridge outputs, no un tercer compositor monolítico.
4. **AD-MP-04:** Contenido pareja vive en `content/relationship-*.js` — nunca inline en UI.
5. **AD-MP-05:** Documentos OneDrive son fuente editorial; **repo** es fuente de verdad runtime.

---

## 11. Qué NO hace este documento

- No implementa sinastría, compuesta, Davison ni reloc UI
- No modifica `natal-composition-service`, Bridge, mapa ni Firebase
- No autoriza IA generativa ni nuevos fragmentos
- No sustituye `voice_tone.txt` ni inventa tono pareja

---

*Fase 3.6e · post-bridgeProfile 3.6d · pre-highlight mapa 3.7a*
