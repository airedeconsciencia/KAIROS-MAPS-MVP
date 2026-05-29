# KAIROS MAPS — Contrato Bridge Service (Fase 3.6b)

**Archivo:** `src/services/natal-map-bridge-service.js`  
**API global:** `window.KairosNatalMapBridge`  
**Smoke:** `./scripts/dev-bridge-smoke.sh`  
**Estado:** scaffold funcional · invisible para usuario

---

## Propósito

Priorizar líneas del mapa según **tags** y **themes** del perfil natal lite.  
Devuelve **estructura numérica** — sin texto interpretativo, sin IA, sin motores.

---

## Entrada (`buildBridge(input)`)

```javascript
{
  tags: string[],           // semanticTags del compositor natal (ej. communication)
  themes: string[],         // themes editoriales opcionales (ej. visibility)
  tensionMode: boolean,     // del compositor natal lite
  mapLines: MapLineRef[]    // subset de state.lines
}
```

### `MapLineRef` mínimo

```javascript
{
  id: 'mercurio-mc',   // opcional; default planet-angle
  planet: 'mercurio',  // acepta aliases: MERCURY, Mercury, …
  angle: 'MC'          // AC | DC | MC | IC (ASC → AC)
}
```

---

## Salida

### Éxito (`ok: true`)

```javascript
{
  ok: true,
  matches: BridgeMatch[],
  priorityLines: string[],   // hasta 5 lineIds, score ≥ 0.35
  confidence: number,        // 0–1
  meta: {
    schemaVersion: '0.1.0-bridge',
    tensionMode, tagCount, themeCount, lineCount,
    highCount, mediumCount, lowCount
  }
}
```

### `BridgeMatch`

```javascript
{
  lineId: 'mercurio-mc',
  planet: 'mercurio',
  angle: 'MC',
  score: 0.7234,              // 0–1, determinista
  priority: 'high' | 'medium' | 'low',
  reasons: [
    { type: 'tag_planet', key: 'communication', weight: 1 },
    { type: 'theme_angle', key: 'communication', weight: 0.55 }
  ]
}
```

### Fail-soft

| Condición | `ok` | `error` | Salida |
|-----------|------|---------|--------|
| `mapLines` vacío | `false` | `NO_LINES` | arrays vacíos, confidence 0 |
| sin tags ni themes | `false` | `NO_SIGNAL` | matches con score 0, priorityLines [] |

---

## Scoring (v0.1)

1. **Tag → planeta** — tabla interna `TAG_PLANET_WEIGHTS` (peso 65 %)
2. **Theme → ángulo** — tabla `THEME_ANGLE_WEIGHTS` (peso 35 %)
3. **tensionMode** — boost Luna (+0.12), IC (+0.08); dampen Sol MC (−0.05)

Umbrales:

- `high` ≥ 0.55  
- `medium` ≥ 0.35  
- `priorityLines` — top N con score ≥ medium (máx. 5)

---

## Límites

- No importa `engines/`, `astro.js`, `interpretations.js`, `natal-lite.js`
- No genera copy humano
- No conectado a UI ni `index.html` en 3.6b
- No desplegado en `dist/` hasta sync explícita

---

## Uso en Node (smoke)

```bash
./scripts/dev-bridge-smoke.sh
```

Casos: payload válido · incompleto · vacío · sin señal · determinismo.

---

## Integración futura (3.6c+)

```javascript
var composition = KairosNatalComposition.composeNatalLiteReading({ sun, moon, asc });
var tags = composition.meta.sharedTags /* o merge sections */;
var bridge = KairosNatalMapBridge.buildBridge({
  tags: tags,
  themes: deriveThemes(composition),
  tensionMode: composition.meta.tensionMode,
  mapLines: state.lines
});
// bridge.priorityLines → highlight en mapa (3.7a)
```

---

*Ver también: `NATAL_MAP_BRIDGE_ARCHITECTURE.md`*
