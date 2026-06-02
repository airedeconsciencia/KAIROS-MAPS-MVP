# KAIROS MAPS — Auditoría Documental Completa

**Fase 3.6g** · Análisis exclusivo (sin modificación de docs existentes)  
**Fecha auditoría:** junio 2026  
**Commit de referencia:** `ac3e454` (3.7a highlight bridge sutil mapa)  
**Alcance:** todos los documentos `.md` / `.txt` en repo + artefactos legacy referenciados

---

## Resumen ejecutivo

### 1. ¿Dónde está realmente KAIROS hoy?

**Fase 3.7a operativa en `src/`** — MVP desktop-first con:

- Mapa astrocartográfico 40 líneas (`astro.js`)
- Onboarding + perfil local (5 pasos UI, no 9 del DOC-09)
- Motor natal Swiss Ephemeris WASM lazy-loaded
- Panel Carta natal lite + compositor + `bridgeProfile`
- Bridge natal→mapa con highlight sutil en mapa (3.7a)
- Golden gate 75/75 (manual pre-deploy)
- Firebase Hosting estático desde `dist/` (puede ir desincronizado)

**No operativo:** relocación UI, pareja, IA, premium paywall, Firestore, ranking ciudades.

### 2. ¿Qué parte está construida?

| Capa | Estado |
|------|--------|
| Mapa + interpretaciones ciudad×línea | ✅ Producción/DEV |
| Natal lite + compositor | ✅ DEV (`src/`) |
| Bridge + highlight mapa | ✅ DEV (3.7a) |
| Motores kairos-core | ✅ Integrados, congelados |
| Arquitectura multi-perfil (código) | 🟡 Solo `NATAL` + bridgeProfile |
| Reloc / pareja / IA | ❌ Documentado, no construido |

### 3. ¿Qué parte está documentada pero no construida?

Relocación premium, sinastría/compuesta/Davison, Cities Layer, IA interpretativa, Stripe/entitlements, PDF, comparador ciudades, navegación 4 módulos (Yo / Mi relación / Mis lugares / Mis decisiones), `astrocarto_engine.js` completo (DOC-16), backend Firestore según DOC-08 ideal.

### 4. ¿Qué parte no existe todavía?

Documentos ausentes en repo: **alertas**, **modelo de negocio dedicado**, glosario UI, spec navegación, briefs reloc/pareja, taxonomía objetivos, registro canónico único (DOC index). Fuentes OneDrive no versionadas: Manual Astrocartografía, Relocación Astrológica, Arquitectura Interpretativa Avanzada, bases terapéuticas.

### 5. ¿Cuál debería ser el siguiente paso real?

**Ordenar conocimiento antes de Relocación (3.7b):**

1. Actualizar **registro canónico** (`project-master-audit.md` + `VERSION.md` → estado post-3.7a o nuevo `KAIROS_DOC_INDEX.md`)
2. Marcar explícitamente docs **históricos/obsoletos** (PROJECT_CONTEXT Fase 0, phase-2.1a “sin implementar”)
3. Crear **vacíos P0** acordados: glosario UI + taxonomía objetivos (solo doc, sin código)
4. **Después** abrir 3.7b Relocation scaffold DEV

---

## Jerarquía de versiones (v1 vs v2)

| Tema | Fuente oficial | Reemplaza | Notas |
|------|----------------|-----------|-------|
| Arquitectura datos usuario | `docs/architecture.txt` **DOC-08 v2.0** | DOC-08 v1.0 *(no está en repo)* | v2 = cálculo en cliente MVP |
| Onboarding | `docs/onboarding.txt` **DOC-09 v2** | v1 implícita *(no en repo)* | UI actual ≈ 5 pasos, doc describe 9 |
| Diseño visual | `docs/visual_identity.txt` | — | Sin numeración v1/v2 en repo |
| Voz y tono | `docs/voice_tone.txt` | — | Sin versión explícita |
| Biblioteca interpretaciones | `docs/interpretations.txt` **DOC-17 v1.0** | — | Runtime parcial en `interpretations.js` |
| Motor astrocartográfico | **`src/engines/astro.js`** (implementación) | `docs/astro_engine.txt` DOC-16 *(spec alternativa)* | DOC-16 ≠ código actual |
| Estado operativo proyecto | **Git log + `NATAL_LITE_STATUS.md`** | `VERSION.md`, `PROJECT_CONTEXT.md` | Root docs desactualizados |
| Arquitectura producto/técnica | **`docs/architecture/KAIROS_*` (3.6–3.7)** | Fragmentos en `roadmap.txt` | Roadmap = visión histórica |

---

## Inventario completo — tabla por documento

**Leyenda estado:** OFICIAL · VIGENTE · HISTÓRICO · PARCIAL · OBSOLETO · EXTERNO · PROPUESTO  
**Prioridad:** CRÍTICA · ALTA · MEDIA · BAJA  
**Usado actualmente:** SÍ (runtime/gate activo) · PARCIAL · NO · REFERENCIA

### Raíz del repositorio

| Documento | Tipo | Estado | Prioridad | Versión | Usado actualmente | Observaciones |
|-----------|------|--------|-----------|---------|-------------------|---------------|
| `VERSION.md` | Seguimiento release | OBSOLETO | MEDIA | Fase 1.8 / mayo 2026 | NO | Último commit citado `be56c91`; ignora Fases 2–3.7. No usar para estado |
| `PROJECT_CONTEXT.md` | Contexto producto | HISTÓRICO | BAJA | Fase 0 | NO | Baseline pre-natal; contradice MVP actual |

### `docs/` — corpus editorial y estratégico

| Documento | Tipo | Estado | Prioridad | Versión | Usado actualmente | Observaciones |
|-----------|------|--------|-----------|---------|-------------------|---------------|
| `docs/voice_tone.txt` | VOZ | OFICIAL | CRÍTICA | v1 implícita | PARCIAL | Gate #1 editorial; no automatizado en CI; IA futura debe obedecer |
| `docs/onboarding.txt` | ONBOARDING | OFICIAL | ALTA | DOC-09 v2 | PARCIAL | 9 pantallas vs 5 en UI; filosofía y mainGoals sí alineados |
| `docs/visual_identity.txt` | DISEÑO | OFICIAL | ALTA | v1 implícita | PARCIAL | Colores/tipografía en CSS; no auditado vs cada componente nuevo |
| `docs/interpretations.txt` | INTERPRETACIÓN | OFICIAL | ALTA | DOC-17 v1.0 | PARCIAL | T1–T4 para IA/premium; mapa FREE usa subset en `interpretations.js` |
| `docs/roadmap.txt` | ROADMAP | HISTÓRICO | MEDIA | MVP/V2/V3 | REFERENCIA | Visión amplia; superseded parcialmente por `KAIROS_PRODUCT_ARCHITECTURE.md` |
| `docs/architecture.txt` | ARQUITECTURA DATOS | VIGENTE | ALTA | DOC-08 v2.0 | REFERENCIA | Firestore/backend = futuro; cliente MVP = correcto |
| `docs/astro_engine.txt` | MOTOR | PARCIAL | MEDIA | DOC-16 v1.0 | NO | Spec `astrocarto_engine.js`; producción usa `astro.js` simplificado |
| `docs/phase-2.1a-integration.md` | INTEGRACIÓN | HISTÓRICO | BAJA | v1.0 plan | NO | Decía “sin implementar”; integración ya hecha (2.1a–3.x) |
| `docs/project-master-audit.md` | AUDITORÍA OPS | PARCIAL | ALTA | v1.0 | PARCIAL | Útil como plantilla; commit auditado `773ecec` muy atrás |

### `docs/architecture/` — arquitectura viva (Fase 3.x)

| Documento | Tipo | Estado | Prioridad | Versión | Usado actualmente | Observaciones |
|-----------|------|--------|-----------|---------|-------------------|---------------|
| `KAIROS_PRODUCT_ARCHITECTURE.md` | PRODUCTO | VIGENTE | ALTA | post-2.2c | SÍ | FREE/PREMIUM; header desactualizado (no menciona 3.6–3.7) |
| `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` | UX PRODUCTO | OFICIAL | CRÍTICA | Fase 3.6f | SÍ | Lenguaje humano externo; gobierna UI futura |
| `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | ARQUITECTURA | OFICIAL | CRÍTICA | Fase 3.6e | SÍ | Perfiles internos; pre-reloc/pareja |
| `NATAL_INTERPRETATION_ARCHITECTURE.md` | INTERPRETACIÓN | OFICIAL | CRÍTICA | Fase 3.3 | SÍ | Jerarquía canónica editorial; capas content |
| `NATAL_LITE_STATUS.md` | CHECKLIST | VIGENTE | ALTA | Fase 3.4 | SÍ | Pre-deploy natal lite; más actual que VERSION.md |
| `NATAL_MAP_BRIDGE_ARCHITECTURE.md` | BRIDGE | PARCIAL | ALTA | Fase 3.6a | PARCIAL | Decía “sin UI visible”; 3.7a añadió highlight — actualizar en futuro |
| `NATAL_MAP_BRIDGE_SERVICE.md` | BRIDGE CONTRATO | OFICIAL | ALTA | post-3.6d | SÍ | Contrato `buildBridge` + bridgeProfile |
| `FASE_3_1_LAZY_WASM.md` | TÉCNICO | VIGENTE | MEDIA | 3.1 cerrada | SÍ | Lazy WASM + golden gate; referencia deploy |

### Legacy

| Documento | Tipo | Estado | Prioridad | Versión | Usado actualmente | Observaciones |
|-----------|------|--------|-----------|---------|-------------------|---------------|
| `legacy/kairos_maps_prototype.html` | PROTOTIPO | HISTÓRICO | BAJA | pre-Fase 0 | NO | Origen empaquetado; referencia histórica |

### Referenciados pero **fuera del repo**

| Documento | Tipo | Estado | Prioridad | Versión | Usado actualmente | Observaciones |
|-----------|------|--------|-----------|---------|-------------------|---------------|
| Arquitectura Interpretativa Avanzada | INTERPRETACIÓN | EXTERNO | ALTA | OneDrive | NO | Citado en NATAL_INTERPRETATION; no versionado |
| Manual Maestro Astrocartografía | ASTROCARTO | EXTERNO | ALTA | OneDrive | NO | Ciudades/objetivos vitales |
| Relocación Astrológica | RELOCACIÓN | EXTERNO | ALTA | OneDrive | NO | Pre-requisito editorial 3.7b+ |
| Bases terapéuticas / clínicas | TERAPIA | EXTERNO | MEDIA | — | NO | Riesgo tono; no importar verbatim |
| DOC-08 Arquitectura Datos v1.0 | ARQUITECTURA | EXTERNO/HISTÓRICO | BAJA | v1.0 | NO | Mencionado en v2; no presente en carpeta |
| **Alertas** (módulo citado en brief) | — | **AUSENTE** | — | — | NO | **No existe en repo** |
| **Modelo de negocio** (doc dedicado) | — | **AUSENTE** | — | — | PARCIAL | Disperso en roadmap + PRODUCT_ARCHITECTURE |

### Implementación runtime (no es documento, pero materializa docs)

| Artefacto | Documento fuente | Observación |
|-----------|------------------|-------------|
| `src/content/interpretations.js` | DOC-17 / voice_tone | 40 combos mapa — **canónico runtime mapa** |
| `src/content/natal-lite.js` | NATAL_INTERPRETATION + voice_tone | 23 fragmentos pilot |
| `src/services/natal-composition-service.js` | NATAL_MAP_BRIDGE_SERVICE | bridgeProfile |
| `src/services/natal-map-bridge-service.js` | NATAL_MAP_BRIDGE_* | Bridge scoring |
| `src/engines/astro.js` | — (≠ DOC-16) | Motor mapa real |

**Total documentos auditados en repo:** **20** (18 `.md`/`.txt` + 2 root `.md` contados; 1 legacy html = **21 artefactos** incluyendo legacy)

**Total referencias externas/ausentes auditadas:** **7**

---

## 1. Documentos oficiales (gobiernan el proyecto hoy)

Orden de autoridad práctica para **nuevo trabajo**:

| # | Documento | Rol |
|---|-----------|-----|
| 1 | `docs/voice_tone.txt` | Gate tono y ética |
| 2 | `docs/architecture/KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` | Lenguaje usuario y módulos visibles |
| 3 | `docs/architecture/NATAL_INTERPRETATION_ARCHITECTURE.md` | Capas interpretativas + jerarquía editorial |
| 4 | `docs/architecture/KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | Perfiles técnicos futuros |
| 5 | `docs/architecture/NATAL_MAP_BRIDGE_SERVICE.md` | Contrato Bridge operativo |
| 6 | `src/content/interpretations.js` + `docs/interpretations.txt` | Mapa geográfico |
| 7 | `src/content/natal-lite.js` + `NATAL_LITE_STATUS.md` | Natal lite FREE |
| 8 | `docs/onboarding.txt` + `docs/visual_identity.txt` | Onboarding e identidad |
| 9 | `docs/architecture/KAIROS_PRODUCT_ARCHITECTURE.md` | FREE/PREMIUM capacidades |
| 10 | `docs/architecture/FASE_3_1_LAZY_WASM.md` | Deploy gate |

**Estado operativo:** git log + `NATAL_LITE_STATUS.md` > `project-master-audit.md` > `VERSION.md`.

---

## 2. Documentos históricos (reemplazados o cumplidos)

| Documento | Motivo |
|-----------|--------|
| `PROJECT_CONTEXT.md` | Fase 0; pre-natal, pre-bridge |
| `VERSION.md` | Detenido en Fase 1.8 |
| `docs/phase-2.1a-integration.md` | Planificación cumplida |
| `docs/roadmap.txt` | Visión MVP/V2/V3; parcialmente superseded |
| `legacy/kairos_maps_prototype.html` | Prototipo empaquetado |
| DOC-08 v1 *(ausente)* | Supersedido por v2 en repo |
| Onboarding v1 *(ausente)* | Supersedido por DOC-09 v2 |

---

## 3. Documentos duplicados (mismo tema, múltiples fuentes)

| Tema | Documentos | Resolución recomendada |
|------|------------|------------------------|
| Roadmap / fases | `roadmap.txt`, `KAIROS_PRODUCT_ARCHITECTURE.md`, `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md`, `KAIROS_MULTI_PROFILE_ARCHITECTURE.md`, `NATAL_MAP_BRIDGE_ARCHITECTURE.md` | **PRODUCT_EXPERIENCE** = UX; **PRODUCT_ARCHITECTURE** = capacidades; **MULTI_PROFILE** = perfiles; **roadmap.txt** = archivo histórico |
| Estado del proyecto | `VERSION.md`, `PROJECT_CONTEXT.md`, `project-master-audit.md`, `NATAL_LITE_STATUS.md` | Un solo **status doc** actualizado |
| Interpretación mapa | `interpretations.txt`, `interpretations.js`, `NATAL_INTERPRETATION_ARCHITECTURE.md` | TXT = biblioteca; JS = runtime FREE; ARCH = capas |
| Motor mapa | `astro_engine.txt` (DOC-16), `astro.js` | Código manda; DOC-16 = futuro/alternativo |
| Bridge | `NATAL_MAP_BRIDGE_ARCHITECTURE.md`, `NATAL_MAP_BRIDGE_SERVICE.md` | ARCH = diseño; SERVICE = contrato |
| Arquitectura datos | `architecture.txt`, `KAIROS_PRODUCT_ARCHITECTURE.md` capa 0–5 | architecture.txt = Firestore futuro; PRODUCT = capas app |
| Onboarding | `onboarding.txt`, UI `onboarding.js` | Doc = north star; UI = subset 5 pasos |

---

## 4. Documentos en conflicto

| Conflicto | Severidad | Detalle |
|-----------|-----------|---------|
| Onboarding 9 vs 5 pantallas | **ALTA** | DOC-09 v2 vs implementación |
| `PROJECT_CONTEXT` “onboarding fuera MVP” vs onboarding operativo | **ALTA** | Contexto Fase 0 obsoleto |
| `phase-2.1a` “sin implementar” vs natal integrado | **MEDIA** | Doc planificación no cerrado |
| `NATAL_MAP_BRIDGE_ARCHITECTURE` “sin UI” vs 3.7a highlight | **MEDIA** | Doc pre-3.7a |
| `astro_engine.txt` vs `astro.js` | **MEDIA** | Spec distinta del motor real |
| `roadmap.txt` fases vs numeración 3.6–3.7 actual | **MEDIA** | Nomenclatura divergente |
| Móvil: freeze (`project-master-audit`) vs trabajo 1.7–1.8 (`VERSION.md`) | **MEDIA** | Política móvil ambigua |
| Sidebar técnico vs 4 módulos experiencia (`PRODUCT_EXPERIENCE`) | **BAJA** | Migración UI pendiente, documentada |
| Firestore en DOC-08 vs “solo Hosting” operativo | **BAJA** | Esperado (futuro vs hoy) |
| `voice_tone` gate obligatorio vs sin CI enforcement | **ALTA** | Crítico para IA; proceso manual |

---

## 5. Documentos huérfanos

Existen en repo pero **ninguna arquitectura 3.6+ los usa como fuente primaria**:

| Documento | Por qué huérfano |
|-----------|------------------|
| `VERSION.md` | No referenciado en arch docs 3.x |
| `PROJECT_CONTEXT.md` | No referenciado en arch docs 3.x |
| `docs/astro_engine.txt` | Motor real no sigue DOC-16 |
| `docs/phase-2.1a-integration.md` | Objetivo cumplido; sin puntero “cerrado” |
| `docs/roadmap.txt` | Citado históricamente; no en jerarquía NATAL_INTERPRETATION |
| `legacy/kairos_maps_prototype.html` | Sin referencia activa |

**Parcialmente huérfano:** `project-master-audit.md` — debería ser hub operativo pero está stale.

---

## 6. Vacíos documentales

| Vacío | Prioridad | Citado en |
|-------|-----------|-----------|
| `KAIROS_DOC_INDEX.md` (registro canónico único) | CRÍTICA | Esta auditoría |
| `KAIROS_UI_COPY_GLOSSARY.md` | ALTA | PRODUCT_EXPERIENCE 3.6f |
| `KAIROS_GOAL_TAXONOMY.md` | ALTA | PRODUCT_EXPERIENCE, onboarding |
| `KAIROS_NAVIGATION_SPEC.md` | ALTA | PRODUCT_EXPERIENCE |
| `KAIROS_PREMIUM_MESSAGING.md` | ALTA | PRODUCT_EXPERIENCE |
| Brief relocación (`reloc-lite-editorial-brief.md`) | ALTA | MULTI_PROFILE, NATAL_LITE_STATUS |
| Brief pareja (`relationship-editorial-brief.md`) | ALTA | MULTI_PROFILE |
| **Alertas** (módulo/documento) | MEDIA | Brief usuario — **no existe** |
| **Modelo de negocio** dedicado | MEDIA | Disperso; Stripe/PDF sin doc único |
| Actualización post-3.7a de BRIDGE_ARCHITECTURE | MEDIA | Highlight implementado |
| Status doc único post-3.7a | ALTA | Reemplazar VERSION + master-audit stale |
| Import controlado OneDrive → `docs/product/` | ALTA | NATAL_INTERPRETATION, MULTI_PROFILE |

---

## Mapa del conocimiento

```
                    ┌─────────────────────────────────────┐
                    │  EXTERNO (OneDrive) — editorial     │
                    │  Manual Astro · Reloc · Interp. Av. │
                    │  Terapéuticos · DOC-08 v1 (ausente) │
                    └──────────────────┬──────────────────┘
                                       │ revisión humana
                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│  VOZ — docs/voice_tone.txt                          [OBLIGATORIO]│
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  ONBOARDING — onboarding.txt + visual_identity.txt    [OBLIGATORIO]│
│  (UI: 5 pasos — doc 9 pantallas)                                   │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  NATAL — NATAL_INTERPRETATION_ARCHITECTURE.md         [OBLIGATORIO]│
│         natal-lite.js · NATAL_LITE_STATUS.md                       │
│         chart-service · kairos-core (FASE_3_1_LAZY_WASM)           │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  BRIDGE — NATAL_MAP_BRIDGE_SERVICE.md                 [OBLIGATORIO]│
│           NATAL_MAP_BRIDGE_ARCHITECTURE.md (parcial post-3.7a)     │
│           MULTI_PROFILE (BridgeSignalProfile futuro)                 │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  MAPA — astro.js (runtime) · interpretations.js       [OBLIGATORIO]│
│         interpretations.txt (DOC-17) · app.js highlight 3.7a       │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  EXPERIENCIA — KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE  [OBLIGATORIO]│
│                (lenguaje humano, 4 módulos)                        │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  RELOCACIÓN — ❌ NO EN REPO                                        │
│               architecture.txt (schema) · MULTI_PROFILE RELOCATION │
│               OneDrive Relocación Astrológica        [PENDIENTE]   │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  PAREJA — ❌ NO EN REPO                                            │
│           MULTI_PROFILE SYNASTRY/COMPOSITE/DAVISON     [PENDIENTE] │
│           PRODUCT_EXPERIENCE “Mi relación”                           │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│  IA — interpretations.txt T1–T4 · voice_tone gate      [FUTURO]    │
│       NATAL_INTERPRETATION capa IA · OneDrive Interp. Avanzada     │
└────────────────────────────────────────────────────────────────────┘

PRODUCTO transversal: KAIROS_PRODUCT_ARCHITECTURE.md (FREE/PREMIUM)
OPS / DEPLOY: FASE_3_1_LAZY_WASM.md · NATAL_LITE_STATUS.md · golden-gate
HISTÓRICO (opcional): roadmap.txt · VERSION.md · PROJECT_CONTEXT · phase-2.1a
```

**Obligatorios antes de nueva capa interpretativa:** voice_tone → EXPERIENCE → NATAL_INTERPRETATION → bridge SERVICE → MULTI_PROFILE (si multi-participante).

**Opcionales / referencia:** roadmap.txt, architecture.txt (Firestore futuro), astro_engine.txt.

---

## Riesgos (por severidad)

### CRÍTICA

| Riesgo | Evidencia | Impacto |
|--------|-----------|---------|
| Docs de estado obsoletos (`VERSION`, `PROJECT_CONTEXT`) | Fase 1 vs 3.7a | Decisiones erróneas de alcance |
| `voice_tone` no enforced en pipeline | Sin CI/linter editorial | IA y fragmentos divergen |
| Fuentes OneDrive críticas fuera de repo | Reloc/pareja/IA | Contenido premium sin base versionada |
| Sin registro canónico único | 20+ docs sin índice | Duplicidad y conflictos silenciosos |

### ALTA

| Riesgo | Evidencia | Impacto |
|--------|-----------|---------|
| DOC-09 vs UI onboarding | 9 vs 5 pantallas | UX/copy desalineados |
| Exceso documentación roadmap | 5+ docs con fases | Equipo lee fuentes distintas |
| `project-master-audit` stale | commit `773ecec` | Onboarding conversaciones incorrecto |
| Vacíos glosario + taxonomía objetivos | PRODUCT_EXPERIENCE 3.6f | UI futura inventará copy |

### MEDIA

| Riesgo | Evidencia | Impacto |
|--------|-----------|---------|
| DOC-16 ≠ astro.js | Motor mapa | Confusión técnica reloc/geo |
| BRIDGE_ARCH pre-3.7a | “sin UI” | Doc contradice producto |
| Modelo negocio disperso | Sin doc Stripe/PDF | Premium mal scoped |
| Alertas inexistentes | Brief usuario | Expectativa sin artefacto |

### BAJA

| Riesgo | Evidencia | Impacto |
|--------|-----------|---------|
| legacy/ prototype sin etiqueta | Carpeta legacy | Confusión histórica |
| Sidebar vs 4 módulos | EXPERIENCE doc | Solo naming; planificado |
| DOC-08 v1 ausente | Referencia en v2 | Baja si v2 es canónico |

---

## Matriz: construido vs documentado vs ausente

| Capa | Construido | Documentado | Ausente |
|------|------------|-------------|---------|
| Voz | Parcial (manual) | ✅ voice_tone | Enforcement CI |
| Onboarding | ✅ 5 pasos | ✅ DOC-09 v2 (9) | Alineación doc↔UI |
| Visual | ✅ CSS | ✅ visual_identity | Audit componentes |
| Mapa | ✅ astro.js | ✅ interpretations | DOC-16 motor alterno |
| Natal lite | ✅ | ✅ NATAL_* | Revisión OneDrive |
| Bridge | ✅ 3.7a | ✅ SERVICE + ARCH | ARCH refresh |
| Multi-perfil | Solo NATAL | ✅ MULTI_PROFILE | Adaptadores reloc/pareja |
| Experiencia UX | Parcial UI | ✅ PRODUCT_EXPERIENCE | NAV_SPEC, GLOSSARY |
| Relocación | ❌ | Parcial (MULTI, architecture.txt) | reloc-lite, OneDrive |
| Pareja | ❌ | ✅ MULTI + EXPERIENCE | relationship content |
| IA | ❌ | ✅ DOC-17 T1–T4 | Pipeline, OneDrive |
| Negocio/Premium | ❌ | Disperso PRODUCT_ARCH | Modelo negocio doc |
| Alertas | ❌ | ❌ | Todo el módulo |
| Backend | ❌ | ✅ architecture.txt | Firebase ops doc |

---

## Recomendación — siguiente fase (sin abrir Relocación aún)

### Fase 3.6h — Consolidación documental (propuesta)

1. Crear **`KAIROS_DOC_INDEX.md`** — índice canónico con estado, versión, obsoleto sí/no  
2. Actualizar **`project-master-audit.md`** → commit `ac3e454`, Fases 3.6–3.7a, bridge operativo  
3. Marcar **`VERSION.md`** y **`PROJECT_CONTEXT.md`** como históricos (banner, no borrar)  
4. Crear vacíos P0 solo-doc: **`KAIROS_UI_COPY_GLOSSARY.md`**, **`KAIROS_GOAL_TAXONOMY.md`**  
5. Nota en **`NATAL_MAP_BRIDGE_ARCHITECTURE.md`** (futuro commit): 3.7a highlight = UI mínima aceptada  

**Después de 3.6h:** abrir **3.7b** Relocation scaffold DEV con brief editorial basado en vacíos identificados.

---

## Qué NO hace esta auditoría

- No modifica documentos existentes  
- No propone funcionalidades nuevas de producto  
- No abre Relocación, Pareja ni IA  
- No toca código, `src/`, `dist/`, Firebase  

---

*Fase 3.6g · inventario junio 2026 · 21 artefactos repo + 7 referencias externas/ausentes*
