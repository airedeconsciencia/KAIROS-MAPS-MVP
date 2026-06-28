# KAIROS MAPS — Architectural Decisions (ADRs permanentes)

**Fase:** F7.11 · registro de decisiones no renegociables  
**Fecha:** 26 mayo 2026  
**Autoridad:** complementa `KAIROS_DOC_INDEX.md` § III (Principios P1–P14)

> Cambiar cualquier ADR de esta lista requiere: documento de excepción explícito, checkpoint actualizado, y aprobación humana.

---

## ADR-001 — Familia editorial antes de expansión territorial

**Decisión:** todo país nuevo debe asignarse a una **familia editorial existente** antes de entrar en catálogo/resolver, salvo sprint documentado de familia nueva.

**Motivo:** narrative, premium y knowledge dependen de packs por familia. País sin familia = leak editorial o copy genérico.

**Gate activo:** F7.0 GLOBAL EDITORIAL AUDIT antes de waves F6.4+.

**Referencias:** `EDITORIAL_FAMILY_POLICY.md` · `GLOBAL_EXPANSION_BACKLOG.md` · `WAVE_PLANNER.md`

---

## ADR-002 — No crear familia editorial sin packs

**Decisión:** prohibido registrar una familia nueva en el resolver sin tener **packs mínimos** listos para narrative, premium y knowledge (aunque estén en DEV).

**Motivo:** F6.0 MENA Architecture Sprint demostró que packs primero, países después evita deuda editorial irreversible.

**Excepción:** sprint `F6.0`-style — documentar packs, 0 países, cerrar antes de migración.

---

## ADR-003 — No activar Identity sin shadow + QA editorial

**Decisión:** `modulation.enabled` permanece `false` en producción hasta:

1. Shadow runtime + analytics + calibration PASS en DEV
2. `review_required` cities = 0
3. City signatures curadas editorialmente (no solo algorítmicas)
4. Feature flag DEV (F8.0) → preview narrative/premium (F8.1–F8.2) → activación controlada (F8.3)

**Motivo:** identity modula copy y pesos premium; activación prematura altera lecturas sin trazabilidad.

**Referencias:** `CITY_IDENTITY_ARCHITECTURE.md` § 4–6

---

## ADR-004 — City Identity no sustituye astrología

**Decisión:** la capa City Identity es **modulación editorial dimensional** sobre lecturas existentes. No reemplaza:

- Mapa astrocartográfico (40 líneas)
- Bridge / bridgeProfile
- Scorer / priorización técnica
- Motores WASM / efemérides

**Motivo:** el usuario contrata orientación astrocartográfica curada; identity matiza tono y énfasis, no el fundamento técnico.

**Implicación:** identity coefficients afectan canales (`narrative`, `premium`, `knowledge`, `atmosphere`), no recalculan posiciones planetarias.

---

## ADR-005 — City Signature no cambia arquetipo

**Decisión:** `citySignature.adjustments` matizan el **perfil dimensional** del arquetipo asignado. No pueden:

- Cambiar `identityArchetype` de una ciudad
- Invertir el orden dominante de dimensiones del arquetipo
- Exceder `adjustments ∈ [-0.25, +0.25]` ni `Σ|adj| ≤ 1.2`

**Motivo:** arquetipo = decisión editorial L2; firma = variación L3 intra-arquetipo.

**Fórmula:** `effectiveProfile = clamp(baseProfile + citySignature, 1, 5)`

---

## ADR-006 — `dist/` nunca se commitea

**Decisión:** `dist/` es artefacto de deploy generado por rsync desde `src/`. No es SSOT. No se commitea salvo política explícita revocada (no existe).

**Motivo:** desincronización `dist/` vs `src/` ha causado confusión en agentes y QA manual.

**Workflow deploy:** `src/` → rsync → `dist/` → `firebase deploy` · smokes pre-deploy.

---

## ADR-007 — Production deploy requiere gate explícito

**Decisión:** ningún deploy a producción sin:

1. MODE explícito en prompt (`deploy` / `deploy-prod`)
2. Smokes PASS (suite estándar + fase-specific)
3. Checkpoint doc actualizado
4. Aprobación humana explícita

**Motivo:** prod sirve usuarios reales; staging es gate intermedio obligatorio para cambios de runtime.

**URLs:** prod `kairos-maps-mvp.web.app` · staging `kairos-maps-dev.web.app`

---

## ADR-008 — Determinismo interno, experiencia humana no oracular

**Decisión:** motores deterministas (P12); UI y copy nunca prometen destino fijo, predicción ni certeza astrológica.

**Motivo:** alineación con Voice & Tone y responsabilidad psicológica.

**Gate:** `docs/voice_tone.txt` es gate #1 de todo copy.

---

## ADR-009 — Solo MAPS Architect orquesta Cursor

**Decisión:** prompts de implementación para Cursor los emite únicamente el agente MAPS System Architect. Engine y Product GPTs no deployan ni commitean.

**Motivo:** evitar scope creep, conflictos de fase y cambios no gateados en motores o copy.

---

## ADR-010 — Fail-soft en capas superiores

**Decisión:** narrative, premium, country archetype e identity **no pueden romper** mapa ni carta natal. Degradación silenciosa a neutral.

**Motivo:** P13 Constitución — valor percibido del core FREE protegido.

---

## ADR-011 — Motores congelados

**Decisión:** `src/engines/kairos-core/*` y `astro.js` no se modifican sin golden gate 75/75 PASS y ADR de excepción.

**Motivo:** estabilidad producción; recalcular efemérides por tier de producto prohibido (P14).

---

## ADR-012 — Expansión territorial pausada @ F7.0

**Decisión:** waves territoriales F6.4+ bloqueadas hasta GLOBAL EDITORIAL AUDIT READ-ONLY.

**Motivo:** saturación ANGLO @ 12, familias congeladas, ROI editorial antes de más países.

---

## ADR-013 — Commits atómicos por fase

**Decisión:** un commit = un cierre de fase con mensaje `fX.Y descripción`. Docs y código de la misma fase van juntos salvo `documentation only` explícito.

**Motivo:** trazabilidad git ↔ checkpoint ↔ smokes.

---

## ADR-014 — Identity Contract v1.0

**Decisión:** la modulación editorial Identity queda gobernada por **Identity Contract v1.0.0** (`contractSchemaVersion: "1.0.0"`), documentado en `CITY_IDENTITY_ARCHITECTURE.md` § 11. El contrato es **especificación arquitectónica permanente** hasta ADR de evolución.

**Envelope obligatorio (no biases):**

- `ReadingContext` — `mode` (`city_reading` | `relocation` | `couple` | `ai_assistant`), `locale`, `subjectScope` (`individual` | `dyad`)
- `applyPolicy` — `allowed` (gate editorial, separado de biases)

**Nivel A congelado (permanente v1.0.0):** `enabled`, `modulationStrength`, `toneBias`, `rhythmBias`, `densityBias`, `sectionBias`.

**Nivel B experimental (fuera del freeze v1.0.0):** `selectionBias` (ex `weightBoosts`) — solo Knowledge; promoción tras F8.6 Editorial QA.

**Derivado canónico (no input):** `atmosphereWeight` — sustituye `atmospherePresence` como variable independiente.

**Renombramientos adoptados:** `strength` → `modulationStrength`; `weightBoosts` → `selectionBias` (tier experimental).

**Principios no negociables:**

1. Consumidores **nunca** leen `effectiveProfile` directamente.
2. Aplicación requiere `enabled ∧ applyPolicy.allowed`; efecto = `bias × modulationStrength`.
3. Rango biases: `−0.3` … `+0.3`; `modulationStrength`: `0` … `1`.
4. Zona roja intacta: resolver, bridge, goal, scorer, country archetype, corpus literal, motores astro.
5. Nuevo producto → `ReadingContext.mode`; **prohibido** nuevo bias por conveniencia.
6. Evolución del contrato solo vía ADR + bump de `contractSchemaVersion`.

**Estado al aprobar ADR:** documentado F8.1E · **sin implementación** · **sin activación** · **sin cambios de runtime**.

**Gate implementación:** F8.2 Identity Decision Lab PASS sobre Nivel A antes de cablear servicios.

**Referencias:** `CITY_IDENTITY_ARCHITECTURE.md` § 11 · ADR-003 · ADR-004

---

## ADR-015 — Micro Modulation Lifecycle

**Decisión:** toda **nueva variable** de modulación Identity (o bump semántico de una variable congelada) debe seguir el ciclo oficial de cinco fases antes de considerarse aprobada para canario o activación.

**Ciclo obligatorio:**

```
Identity Contract v1.0 (especificación)
        ↓
Identity Decision Lab (evidencia A/B virtual DEV)
        ↓
Identity Impact Analysis (dirección · magnitud · riesgo)
        ↓
Editorial Decision Layer (alcance humano · canario · gates)
        ↓
Micro Modulation DEV (implementación post-composición aislada)
        ↓
Editorial QA (validación lectura · naturalidad · meaningStability)
        ↓
Variable Freeze (documentación SSOT + ADR si aplica)
```

**Fases documentales mínimas por variable:**

| Fase | Entregable |
|------|------------|
| Contract | Variable en Nivel A + canales autorizados (ADR-014) |
| Lab | Evidencia A/B · `meaningStability = 1` · strength=0 idéntico |
| Impact Analysis | Métricas por ciudad piloto · priorización |
| Editorial Decision | Alcance V1 · canario · variables excluidas |
| Micro Modulation | Servicio DEV aislado · smokes · sin wiring prod |
| Editorial QA | PASS humano/documentado por sección |
| Freeze | Sección SSOT `CITY_IDENTITY_ARCHITECTURE.md` + checkpoint |

**Primera variable completada:** `toneBias` V1 (Lisboa canario · strength ≤ 0.5 · Lexical Guard · F8.6B PASS · F8.5C freeze).

**Prohibido:**

1. Cablear variable nueva directamente en Narrative / Premium / Knowledge sin ciclo completo.
2. Ampliar canario o subir `modulationStrength` máx. sin re-QA editorial.
3. Saltar Lexical Guard o calibración de umbral cuando el replace modal afecte locuciones compuestas.
4. Activar en prod (F8.8) sin Controlled Activation DEV (F8.7).

**Motivo:** F8.6 detectó bloqueador (`podría que`) que el Lab virtual no capturaba con umbral distinto; el ciclo evita regresiones editoriales en modulación visible.

**Referencias:** `CITY_IDENTITY_ARCHITECTURE.md` § 13 · ADR-014 · F8.5C toneBias V1 Freeze

---

## Registro de excepciones

| ADR | Excepción documentada | Fecha |
|-----|----------------------|-------|
| — | ninguna activa | — |

---

*ADRs F7.11–F8.5C · vigentes al cierre F8.5C · ADR-014 Identity Contract v1.0 · ADR-015 Micro Modulation Lifecycle*
