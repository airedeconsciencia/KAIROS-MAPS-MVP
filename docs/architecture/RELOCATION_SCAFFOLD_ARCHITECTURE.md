# KAIROS MAPS — Relocation Scaffold DEV (Fase 3.7b)

**Estado:** scaffold arquitectónico · sin producto visible  
**Alcance:** contrato, adapter DEV, lab y smoke — **sin motor nuevo, sin UI pública**  
**Gobierna:** `src/services/relocation-profile-service.js`, `src/dev/relocation-preview.html`

---

## 1. Qué es Relocation para el usuario

**Pregunta visible (futuro):** *«¿Qué cambia si vivo en otro lugar?»*

Relocation responde cómo **cambia la lectura de la carta** cuando la misma fecha/hora UTC de nacimiento se proyecta sobre **coordenadas de una ciudad concreta**. No es un mapa global: es la **carta recalculada para ese territorio** — ángulos, casas y énfasis vitales distintos al lugar de origen.

Lenguaje Kairos (voice_tone): modal, psicológico, sin promesas. *«Aquí podría activarse…»*, *«Este entorno puede modificar…»* — nunca *destino*, *perfecto*, *garantizado*.

---

## 2. Qué NO es

| No es | Por qué |
|-------|---------|
| Predicción / destino | voice_tone + Master Doc 7 |
| Ciudad perfecta / ranking mágico | Master §506 — no existe lugar ideal |
| Sustituto del mapa astrocartográfico | Astrocartografía = líneas globales; Relocation = carta local |
| Reemplazo de Cities Layer | Cities sugiere explorar; Relocation profundiza *vivir* en X |
| IA generativa | Solo fragmentos curados + IDs |
| Producto Premium visible (ahora) | Scaffold DEV únicamente |
| Cálculo matemático nuevo (ahora) | Motores congelados; mocks hasta chart-service ext. |

---

## 3. Astrocartografía vs Relocation

| Dimensión | Astrocartografía (Maps hoy) | Relocation (futuro premium) |
|-----------|----------------------------|----------------------------|
| Unidad | Líneas planetarias × ángulos sobre el globo | Carta completa en ciudad destino |
| Pregunta | *¿Dónde pasan cerca mis líneas?* | *¿Cómo me leo viviendo aquí?* |
| Motor | `astro.js` — 40 líneas | `chart-service` + ángulos/casas relocadas |
| Bridge input | `bridgeProfile` natal | `bridgeProfile` RELOCATION |
| UI actual | Mapa + popup + Cities Lite ✅ | Teaser sidebar — **no activo** |
| Copy | `interpretations.js` por línea×ciudad | `reloc-lite.js` (futuro) por delta ángulos |

**Regla constitucional:** el mapa de líneas **no cambia** por Relocation. Cambia la **señal hacia el Bridge** (priorización de líneas según tags/themes relocados).

---

## 4. Flujo futuro (target)

```
Natal chart (base)
    +
Target city (lat, lon, name)
    +
Relocated angles / houses (motor — futuro)
    +
GoalContext (GoalSignal)
        ↓
RelocationSignalProfile  ← buildRelocationProfile()
        ↓
Bridge (natal-map-bridge-service)
        ↓
Relocation reading (reloc-lite + voice_tone — futuro)
```

**Pipeline interno:**

```
RELOCATION → BridgeSignalProfile → GoalContext → Bridge
```

El Bridge **no conoce** relocación. Solo consume `tags`, `themes`, `tensionMode` — mismo contrato que NATAL (`KAIROS_MULTI_PROFILE_ARCHITECTURE.md`).

---

## 5. Contrato `RelocationProfile` (scaffold 0.1)

### Input — `RelocationProfileInput`

```javascript
{
  natalChart: {
    sun?: string,           // slug signo: gemini
    moon?: string,
    asc?: string,
    angles?: {              // alternativa explícita
      AC?: { sign, slug, degree? },
      MC?: { … }, IC?: { … }, DC?: { … }
    }
  },
  targetLocation: {
    name: string,           // "Lisboa"
    country?: string,
    lat: number,
    lon: number,
    cityId?: string         // slug estable
  },
  relocatedAngles: {
    AC: { sign, slug, degree? },
    MC: { … },
    IC?: { … },
    DC?: { … }
  },
  relocatedHouses?: object[],  // opcional — no inventar si ausente
  goalContext?: GoalContext    // KairosGoalSignal.buildContext
}
```

### Output — `RelocationProfile`

```javascript
{
  ok: boolean,
  reason?: string,              // si ok:false — fail-soft

  profileType: 'RELOCATION',
  profileKey: string,           // "reloc|natalKey|cityId"

  tags: string[],
  themes: string[],
  tensionMode: boolean,

  dominantPatterns: {
    roles: string[],            // ángulos con delta significativo
    contradictionPairs: object[],
    relocDelta: {               // trazabilidad DEV
      AC?: { from, to, elementShift? },
      MC?: { … }, …
    }
  },

  sourceIds: {
    fragmentIds: string[],      // vacío en scaffold — futuro reloc-lite.js
    chartRefs: string[],        // RELOC_AC_LIBRA, …
    documentRefs: string[]
  },

  bridgeProfile: {              // shape compatible buildBridge()
    schemaVersion: string,
    tags: string[],
    themes: string[],
    tensionMode: boolean,
    contradictionPairs: object[],
    dominantRoles: string[],
    sourceFragmentIds: string[]
  },

  meta: {
    schemaVersion: '0.1.0-relocation-scaffold',
    goal: string | null,
    cityRef: string | null,
    derivedFrom: 'NATAL',
    housesProvided: boolean,
    housesCount: number
  }
}
```

### Fail-soft

| Condición | Resultado |
|-----------|-----------|
| Sin `targetLocation` o sin `lat`/`lon`/`name` | `ok: false`, `reason: 'missing_target_location'` |
| Sin `relocatedAngles` o sin `AC`+`MC` | `ok: false`, `reason: 'missing_relocated_angles'` |
| Sin `natalChart` mínimo | `ok: false`, `reason: 'missing_natal_chart'` |
| Error interno | `ok: false`, `reason: 'internal_error'` |

---

## 6. Qué se puede hacer ahora (3.7b)

| Entrega | Descripción |
|---------|-------------|
| Este documento | Arquitectura + contrato estable |
| `relocation-profile-service.js` | `buildRelocationProfile(input)` — tags/themes desde mocks |
| `relocation-preview.html` | Lab DEV — JSON + Bridge opcional |
| `dev-relocation-profile-smoke.sh` | 6 casos Node PASS |
| Constitución | EN CURSO 3.7b — sin mover a producto visible |

**Mocks permitidos:** ángulos relocados precalculados (Roberto×Lisboa, Roberto×Toronto) sin invocar WASM.

---

## 7. Qué NO se hace ahora

- UI pública / sidebar Reloc activo  
- Premium / paywall / Stripe  
- `reloc-lite.js` copy interpretativo  
- Carta relocada completa visible  
- Cálculo de casas/ángulos en runtime  
- Modificar `astro.js`, kairos-core, WASM  
- Couple / sinastría / compuesta / Davison  
- IA / Reports / Alertas  
- Sync `dist/` / deploy  

---

## 8. Integración Bridge (sin cambiar Bridge)

```javascript
var reloc = KairosRelocationProfile.buildRelocationProfile(input);
if (!reloc.ok) return;

var bridge = KairosNatalMapBridge.buildBridge({
  tags: reloc.bridgeProfile.tags,
  themes: reloc.bridgeProfile.themes,
  tensionMode: reloc.bridgeProfile.tensionMode,
  mapLines: mapLines,
  goalContext: input.goalContext
});
```

Futuro 4.x: `buildBridge({ signalProfile: reloc, mapLines })` con shape unificado.

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Confundir Relocation con astrocartografía | Copy y arquitectura separan mapa vs carta relocada |
| Prometer ciudad ideal | voice_tone + fail-soft; sin ranking en scaffold |
| Duplicar scoring Bridge | Un solo Bridge; adapter solo produce tags/themes |
| Scaffold parece producto | Solo `src/dev/` — no index.html producto |
| Tags derivados sin corpus reloc | chartRefs + documentRefs trazables; reloc-lite después |

---

## 10. Criterios PASS 3.7b

- [ ] `buildRelocationProfile` ok:true con mock válido  
- [ ] ok:false sin targetLocation / relocatedAngles  
- [ ] `profileType === 'RELOCATION'`  
- [ ] `bridgeProfile.tags` y `themes` no vacíos en válido  
- [ ] Determinismo smoke ×2  
- [ ] Lab DEV carga sin mapa  
- [ ] Constitución EN CURSO actualizada  
- [ ] Sin cambios motores / dist / UI producto  

---

## Referencias

| Documento | Ruta |
|-----------|------|
| Constitución Viva | `KAIROS_DOC_INDEX.md` |
| Multi-perfil | `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` |
| Bridge | `NATAL_MAP_BRIDGE_ARCHITECTURE.md` |
| Editorial Relocation | `docs/product/RELOCATION_EDITORIAL_BRIEF.md` |
| Experiencia | `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` |
| Lab Bridge (patrón) | `src/dev/bridge-preview.html` |

---

*Relocation Scaffold DEV · Fase 3.7b · Adapter sin motor · Bridge-first*
