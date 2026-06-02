# KAIROS MAPS — Auditoría del Corpus Master (integración interna)

**Fase 3.6h3** · Corpus interno en `docs/Master/`  
**Fecha:** junio 2026  
**Commit referencia:** `ac3e454` (3.7a)  
**Alcance:** sustituir referencias “OneDrive / externo” por corpus importado — sin interpretar contenido profundo

---

## Cambio de estado documental

| Antes (3.6g / 3.6h2) | Ahora (3.6h3) |
|----------------------|---------------|
| Manual Astro, Relocación, Interp. Avanzada, Alertas, Negocio = **OneDrive / ausente** | **20 `.docx` en `docs/Master/`** |
| Fuentes críticas no versionadas en repo | Corpus **interno**; legible vía extracción XML |
| `docs/*.txt` como única fuente editorial | `docs/*.txt` = **exportaciones parciales** del Master |

**Regla constitucional actualizada:**

> Para editorial y arquitectura de producto, **`docs/Master/` (v2 revisado)** manda sobre `docs/*.txt` cuando divergen. Para runtime y contratos técnicos Fase 3.x, mandan **`docs/architecture/KAIROS_*`** + código en `src/content/` (sin modificar en esta fase).

---

## 1. ¿Qué documentos existen en `docs/Master/`?

**Total: 20 archivos `.docx`** — verificado físicamente junio 2026.

| # | Nombre exacto | Tamaño | Lectura Cursor |
|---|---------------|--------|----------------|
| 1 | `1 Astrocartografía Amor, la Salud, el Propósito y la Experiencia Humana.docx` | ~25 KB | ⚠️ extracción XML |
| 2 | `2 Astrocartografía Humana y Experiencia Vital.docx` | ~23 KB | ⚠️ extracción XML |
| 3 | `3 Astrocartografía, Transformación Personal y Reconstrucción Interior.docx` | ~25 KB | ⚠️ extracción XML |
| 4 | `4 Astrocartografía Emocional y Equilibrio Vital.docx` | ~26 KB | ⚠️ extracción XML |
| 5 | `5 Tutotia Maestro de Astrocartografía Aplicada.docx` | ~54 KB | ⚠️ extracción XML |
| 6 | `6 Arquitectura Interpretativa Avanzada para Astrocartografía Humana y Sistemas de Orientación Espacial.docx` | ~33 KB | ⚠️ extracción XML |
| 7 | `7 Relocación Astrológica y Sistemas de Transformación Espacial Humana.docx` | ~32 KB | ⚠️ extracción XML |
| 8 | `8 Arquitectura de datos del usuario para Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 9 | `9 Flujo Completo de Onboarding — Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 10 | `08 REVISADO v2 — Arquitectura de Datos — Kairos Maps.docx` | ~21 KB | ⚠️ extracción XML |
| 11 | `09 REVISADO v2 — Flujo Completo de Onboarding — Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 12 | `10 Libro de Voz y Tono — Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 13 | `12 Sistema de Alertas y Notificaciones — Kairos Maps.docx` | ~16 KB | ⚠️ extracción XML |
| 14 | `13 Diseño Visual e Identidad — Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 15 | `13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx` | ~16 KB | ⚠️ extracción XML |
| 16 | `14 Roadmap de Desarrollo — Kairos Maps.docx` | ~17 KB | ⚠️ extracción XML |
| 17 | `15 Modelo de Negocio Detallado — Kairos Maps.docx` | ~18 KB | ⚠️ extracción XML |
| 18 | `16 Motor Astrocartográfico — astrocarto_engine.js — Kairos Maps.docx` | ~27 KB | ⚠️ extracción XML |
| 19 | `16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx` | ~16 KB | ⚠️ extracción XML |
| 20 | `17 Biblioteca de Interpretaciones Modulares — Kairos Maps.docx` | ~31 KB | ⚠️ extracción XML |

**Lectura nativa Cursor (`Read` tool):** ❌ no fiable en `.docx` binarios.  
**Lectura verificada:** ✅ 20/20 vía extracción `word/document.xml` (ZIP interno).

**Propuesta (fase posterior, sin código):** convertir a `docs/Master/export/` en `.md` o `.txt` los DOC **v2 canónicos** + docs **7, 5, 6, 12, 15** prioritarios.

---

## 2. ¿Cuáles son canónicos?

### Canónicos Master (fuente editorial activa)

| Master (canónico) | DOC | Duplicado repo |
|-------------------|-----|----------------|
| `10 Libro de Voz y Tono — Kairos Maps.docx` | 10 | `docs/voice_tone.txt` ✅ alineado |
| `08 REVISADO v2 — Arquitectura de Datos…` | 08 v2 | `docs/architecture.txt` ✅ alineado |
| `09 REVISADO v2 — Flujo Completo de Onboarding…` | 09 v2 | `docs/onboarding.txt` ✅ alineado |
| `13 REVISADO v2 — Diseño Visual e Identidad…` | 13 v2 | `docs/visual_identity.txt` ⚠️ **repo = v1** |
| `16 REVISADO v2 — Motor Astrocartográfico colores KAIROS…` | 16 v2 | `docs/astro_engine.txt` ⚠️ **repo = v1** |
| `17 Biblioteca de Interpretaciones Modulares…` | 17 | `docs/interpretations.txt` ✅ alineado |
| `14 Roadmap de Desarrollo…` | 14 | `docs/roadmap.txt` ✅ alineado |
| `5 Tutotia Maestro de Astrocartografía Aplicada.docx` | Manual | ❌ solo Master |
| `6 Arquitectura Interpretativa Avanzada…` | — | ❌ solo Master |
| `7 Relocación Astrológica…` | — | ❌ solo Master |
| `12 Sistema de Alertas y Notificaciones…` | 12 | ❌ solo Master |
| `15 Modelo de Negocio Detallado…` | 15 | ❌ solo Master |
| `1–4` Astrocartografía temática | — | ❌ solo Master |

### Canónicos arquitectura repo (Fase 3.x — no sustituidos por Master)

| Documento | Rol |
|-----------|-----|
| `KAIROS_PRODUCT_EXPERIENCE_ARCHITECTURE.md` | UX humana post-Master |
| `KAIROS_MULTI_PROFILE_ARCHITECTURE.md` | Perfiles RELOCATION/COUPLE |
| `NATAL_INTERPRETATION_ARCHITECTURE.md` | Capas content |
| `NATAL_MAP_BRIDGE_SERVICE.md` | Contrato Bridge operativo |
| `NATAL_LITE_STATUS.md` | Checklist deploy natal |
| `FASE_3_1_LAZY_WASM.md` | Golden gate |

---

## 3. ¿Cuáles son históricos?

| Master (histórico — no fuente activa) | Sustituido por |
|---------------------------------------|----------------|
| `8 Arquitectura de datos del usuario…` | `08 REVISADO v2` |
| `9 Flujo Completo de Onboarding…` | `09 REVISADO v2` |
| `13 Diseño Visual e Identidad…` | `13 REVISADO v2` |
| `16 Motor Astrocartográfico…` (v1) | `16 REVISADO v2` |

| Repo (histórico) | Notas |
|------------------|-------|
| `VERSION.md` | Fase 1.8 |
| `PROJECT_CONTEXT.md` | Fase 0 |
| `docs/phase-2.1a-integration.md` | Plan cumplido |
| `docs/visual_identity.txt` | **v1** — desalineado vs Master v2 |
| `docs/astro_engine.txt` | **DOC-16 v1** — desalineado vs Master v2 |

---

## 4. ¿Cuáles sustituyen versiones anteriores?

| v1 (archivar) | v2 (manda) | Acción repo recomendada |
|---------------|------------|-------------------------|
| Master `8…` | Master `08 REVISADO v2…` | `architecture.txt` ya es v2 ✅ |
| Master `9…` | Master `09 REVISADO v2…` | `onboarding.txt` ya es v2 ✅ |
| Master `13…` | Master `13 REVISADO v2…` | **Re-exportar** `visual_identity.txt` desde v2 |
| Master `16…` | Master `16 REVISADO v2…` | **Re-exportar** `astro_engine.txt` desde v2 |

---

## 5. ¿Cuáles gobiernan próximas fases?

| Fase | Documentos Master que gobiernan |
|------|--------------------------------|
| **3.7b Relocation DEV** | **7 Relocación** · 10 Voz · 6 Interp. Avanzada · 17 Biblioteca · `KAIROS_MULTI_PROFILE` (repo) |
| **3.8–3.9 Cities / Goals** | **5 Manual Maestro** · 1–4 temáticos · 09 v2 Onboarding (mainGoal) · `KAIROS_PRODUCT_EXPERIENCE` |
| **4.x Couple** | 1 Amor · 5 Manual · 6 Interp. Avanzada · `KAIROS_MULTI_PROFILE` |
| **5.x IA** | **6 Interp. Avanzada** · **17 Biblioteca** · 10 Voz |
| **5.x Reports / PDF** | 15 Modelo Negocio · 17 Biblioteca · 10 Voz |
| **Premium / monetización** | **15 Modelo Negocio** · 14 Roadmap · `KAIROS_PRODUCT_ARCHITECTURE` |
| **Alertas (futuro)** | **12 Alertas** (único doc dedicado) |
| **Backend profile cloud** | 08 REVISADO v2 · `architecture.txt` |

---

## 6. ¿Cuáles están parcialmente reflejados en código?

*Referencia cruzada sin modificar `src/` — estado al commit 3.7a.*

| Master | Reflejo en producto | Grado |
|--------|---------------------|-------|
| 10 Voz y Tono | `natal-lite.js`, `interpretations.js`, compositor warnings | 🟡 PARCIAL |
| 17 Biblioteca | `interpretations.js` (40×3; no T1–T4 completo) | 🟡 PARCIAL |
| 09 v2 Onboarding | `onboarding.js` (5 pantallas; mainGoal sí) | 🟡 PARCIAL |
| 13 v2 Diseño | `styles.css`, UI general | 🟡 PARCIAL (repo txt v1) |
| 16 v2 Motor | `astro.js` — **motor distinto**, no astrocarto_engine | 🔴 BAJO |
| 6 Interp. Avanzada | Bridge scoring, compositor tensionMode | 🟡 PARCIAL (conceptual) |
| 5 Manual Maestro | Popup ciudad×línea; sin ranking ciudades | 🔴 BAJO |
| 7 Relocación | `getRelocatedAngles` en spec v1 repo; **sin UI reloc** | 🔴 NO |
| 12 Alertas | — | ❌ NO |
| 15 Negocio | Teasers workspace; sin Stripe | ❌ NO |
| 08 v2 Datos | `profile.js` localStorage; sin Firestore | 🟡 PARCIAL |
| 1–4 Temáticos | — | ❌ NO directo |

---

## 7. ¿Cuáles aún no se usan?

**Sin uso en producto ni en arquitectura activa (solo importados):**

- `1–4` Astrocartografía temática
- `5` Manual Maestro *(crítico futuro; no runtime)*
- `6` Arquitectura Interpretativa Avanzada *(crítico IA/scoring; no pipeline)*
- `7` Relocación *(bloqueante 3.7b editorial)*
- `12` Alertas
- `15` Modelo de Negocio
- v1 históricos: `8`, `9`, `13`, `16` (versiones antiguas en carpeta)

---

## TAREA 3 — Gobernanza por capas

| Documento Master | Capa(s) que gobierna | Prioridad | Estado | Fase donde se usará |
|------------------|----------------------|-----------|--------|---------------------|
| `10 Voz y Tono` | Voz y tono · IA · Reports · Premium copy | CRÍTICA | Canónico · txt alineado | Todas |
| `09 REVISADO v2 Onboarding` | Onboarding · Goals Layer · Profile | CRÍTICA | Canónico · txt alineado | 3.9+ |
| `13 REVISADO v2 Diseño Visual` | Diseño visual · Reports PDF visual | CRÍTICA | Canónico · **txt desactualizado** | 4.0 UI |
| `15 Modelo de Negocio` | Modelo de negocio · Premium | ALTA | Solo Master | 5.x Premium |
| `14 Roadmap` | Roadmap · Producto | ALTA | Canónico · txt alineado | Planificación |
| `08 REVISADO v2 Datos` | Arquitectura de datos · Profile cloud | ALTA | Canónico · txt alineado | 5.x Firebase |
| `5 Manual Maestro` | Astrocartografía · Cities Layer · Goals | CRÍTICA | Solo Master | 3.9 Cities |
| `1–4 Temáticos` | Astrocartografía · Goals · Couple (amor) | MEDIA | Solo Master | 3.9 / 4.x |
| `16 REVISADO v2 Motor` | Astrocartografía (spec motor) | ALTA | Canónico · **txt v1** | Motor futuro |
| `7 Relocación` | Relocación · Premium Mi reubicación | CRÍTICA | Solo Master | **3.7b** |
| `6 Interp. Avanzada` | Bridge · IA interpretativa · Scoring | CRÍTICA | Solo Master | 3.7b–5.x |
| `17 Biblioteca` | IA · Reports · Astrocartografía · Natal Lite | CRÍTICA | Canónico · txt alineado | 3.7b+ |
| `12 Alertas` | Alertas | ALTA | Solo Master | 5.x+ |
| — | Bridge operativo | CRÍTICA | Repo `NATAL_MAP_BRIDGE_*` + código | **Operativo 3.7a** |
| — | Couple / Relationship | ALTA | Repo `KAIROS_MULTI_PROFILE` | 4.x |
| — | Cities Layer | ALTA | Repo BRIDGE_ARCH + Manual 5 | 3.9 |
| — | Premium (UX) | CRÍTICA | Repo `KAIROS_PRODUCT_EXPERIENCE` | 4.x |

---

## TAREA 4 — Resolución de versiones (definitiva)

| Tema | **MANDA (activo)** | **HISTÓRICO (no usar)** | Motivo |
|------|-------------------|-------------------------|--------|
| Arquitectura datos | `08 REVISADO v2` | Master `8…` | Corrección MVP cliente |
| Onboarding | `09 REVISADO v2` | Master `9…` | Especificaciones técnicas v2 |
| Diseño visual | `13 REVISADO v2` | Master `13…` v1 + `visual_identity.txt` v1 | Paleta corregida v2 |
| Motor astrocartográfico | `16 REVISADO v2` (colores Kairos) | Master `16…` v1 + `astro_engine.txt` v1 | Colores alineados marca |

**Excepción técnica:** el **runtime mapa** usa `src/engines/astro.js`, no `astrocarto_engine.js` del DOC-16. El Master 16 v2 gobierna **spec futura/colores**, no el motor actual hasta decisión explícita de convergencia.

---

## TAREA 6 — ¿Listo para 3.7b Relocation scaffold DEV?

## **NO**

### Documentos Master que **deben** gobernar 3.7b (cuando se abra)

1. **`7 Relocación Astrológica y Sistemas de Transformación Espacial Humana.docx`** — editorial reloc
2. **`10 Libro de Voz y Tono`** — gate copy
3. **`6 Arquitectura Interpretativa Avanzada`** — scoring / señal
4. **`17 Biblioteca de Interpretaciones Modulares`** — patrones copy
5. **`5 Manual Maestro`** — contexto geo (secundario en 3.7b)
6. Repo: **`KAIROS_MULTI_PROFILE_ARCHITECTURE.md`** (perfil RELOCATION)

### Qué falta **antes** de abrir 3.7b (solo documentación)

| # | Falta | Por qué |
|---|-------|---------|
| 1 | **Extraer Doc 7 → `.md`** (`docs/product/RELOCATION_EDITORIAL_BRIEF.md` o similar) | Cursor no trabaja bien con `.docx` en sesiones largas |
| 2 | **Re-exportar** `visual_identity.txt` y `astro_engine.txt` desde Master v2 | Repo desalineado vs canónico |
| 3 | **`KAIROS_DOC_INDEX.md`** ✅ (creado en 3.6h3) | Punto de entrada único |
| 4 | Nota en **`KAIROS_MULTI_PROFILE`** o brief reloc enlazando Master Doc 7 | Puente editorial ↔ arquitectura |
| 5 | (Opcional) Extract **Doc 6** sección scoring → referencia Bridge futuro | Evitar duplicar criterios |

**No bloqueante pero recomendado:** convertir **Doc 10 + Doc 17** ya tienen `.txt`; **Doc 7, 6, 5** prioritarios para conversión.

---

## Duplicados resueltos (resumen)

- **4 pares v1/v2** en Master → **v2 manda**, v1 histórico
- **7 pares Master ↔ `docs/*.txt`** → 5 alineados, **2 desalineados** (visual v1, astro v1)
- **DOC-11** ausente en corpus (numeración 10 → 12)

---

## Documentos que Cursor no lee bien

| Formato | Cantidad | Solución |
|---------|----------|----------|
| `.docx` en `docs/Master/` | 20 | Conversión a `.md`/`.txt` en `docs/Master/export/` (fase posterior) |

---

*Fase 3.6h3 · corpus interno verificado · sin commit · ver `KAIROS_DOC_INDEX.md`*
