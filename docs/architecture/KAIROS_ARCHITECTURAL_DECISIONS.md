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

## Registro de excepciones

| ADR | Excepción documentada | Fecha |
|-----|----------------------|-------|
| — | ninguna activa | — |

---

*ADRs F7.11 · vigentes al cierre F7.10 · revisar al cerrar F8.0*
