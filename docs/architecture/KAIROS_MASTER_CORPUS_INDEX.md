# KAIROS MAPS — Índice del Corpus Master

**Fase 3.6h1** · Verificación de importación (sin interpretación de contenido)  
**Fecha:** junio 2026  
**Ubicación corpus:** `docs/Master/`  
**Formato:** Microsoft Word (`.docx`)

---

## Resumen de verificación

| Métrica | Resultado |
|---------|-----------|
| **Documentos encontrados** | **20** |
| **Documentos esperados (usuario)** | 20 |
| **Documentos no encontrados** | 0 en `docs/Master/` |
| **Legibles (extracción texto .docx)** | 20/20 READ_OK |
| **Legibles vía `Read` nativo Cursor** | ⚠️ `.docx` binario — requiere extracción (zip/XML) o conversión a `.txt`/`.md` |
| **Subcarpetas** | Ninguna — corpus plano en `docs/Master/` |

**Nota técnica:** Los 20 archivos fueron verificados con extracción `word/document.xml` desde el ZIP interno del `.docx`. Cursor puede indexarlos en conversación mediante shell/script; no están en formato texto plano del repo.

---

## Inventario completo (20 documentos)

| # | Nombre exacto | Ruta | Tamaño | Temática principal | Categoría |
|---|---------------|------|--------|-------------------|-----------|
| 1 | `1 Astrocartografía Amor, la Salud, el Propósito y la Experiencia Humana.docx` | `docs/Master/` | ~25 KB | Astrocartografía aplicada (amor, salud, propósito) | Astrocartografía |
| 2 | `2 Astrocartografía Humana y Experiencia Vital.docx` | `docs/Master/` | ~23 KB | Astrocartografía humana; experiencia vital | Astrocartografía |
| 3 | `3 Astrocartografía, Transformación Personal y Reconstrucción Interior.docx` | `docs/Master/` | ~25 KB | Transformación personal; reconstrucción interior | Astrocartografía |
| 4 | `4 Astrocartografía Emocional y Equilibrio Vital.docx` | `docs/Master/` | ~26 KB | Astrocartografía emocional; equilibrio vital | Astrocartografía |
| 5 | `5 Tutotia Maestro de Astrocartografía Aplicada.docx` | `docs/Master/` | ~54 KB | Manual maestro astrocartografía aplicada | Astrocartografía · Biblioteca interpretativa |
| 6 | `6 Arquitectura Interpretativa Avanzada para Astrocartografía Humana y Sistemas de Orientación Espacial.docx` | `docs/Master/` | ~33 KB | Arquitectura interpretativa avanzada; scoring/orientación | Interpretación · Arquitectura |
| 7 | `7 Relocación Astrológica y Sistemas de Transformación Espacial Humana.docx` | `docs/Master/` | ~32 KB | Relocación astrológica; transformación espacial | Relocación |
| 8 | `8 Arquitectura de datos del usuario para Kairos Maps.docx` | `docs/Master/` | ~17 KB | Arquitectura datos usuario (v1) | Datos · Arquitectura |
| 9 | `9 Flujo Completo de Onboarding — Kairos Maps.docx` | `docs/Master/` | ~17 KB | Onboarding (v1) | Onboarding |
| 10 | `08 REVISADO v2 — Arquitectura de Datos — Kairos Maps.docx` | `docs/Master/` | ~21 KB | Arquitectura datos usuario DOC-08 v2 | Datos · Arquitectura |
| 11 | `09 REVISADO v2 — Flujo Completo de Onboarding — Kairos Maps.docx` | `docs/Master/` | ~17 KB | Onboarding DOC-09 v2 | Onboarding |
| 12 | `10 Libro de Voz y Tono — Kairos Maps.docx` | `docs/Master/` | ~17 KB | Voz, tono, prohibiciones, ética | Voz y tono |
| 13 | `12 Sistema de Alertas y Notificaciones — Kairos Maps.docx` | `docs/Master/` | ~16 KB | Alertas y notificaciones | Alertas |
| 14 | `13 Diseño Visual e Identidad — Kairos Maps.docx` | `docs/Master/` | ~17 KB | Diseño visual (v1) | Diseño visual |
| 15 | `13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx` | `docs/Master/` | ~16 KB | Diseño visual DOC-13 v2 | Diseño visual |
| 16 | `14 Roadmap de Desarrollo — Kairos Maps.docx` | `docs/Master/` | ~17 KB | Roadmap MVP / V2 / V3 | Producto |
| 17 | `15 Modelo de Negocio Detallado — Kairos Maps.docx` | `docs/Master/` | ~18 KB | Modelo económico; monetización | Negocio |
| 18 | `16 Motor Astrocartográfico — astrocarto_engine.js — Kairos Maps.docx` | `docs/Master/` | ~27 KB | Motor astrocartográfico DOC-16 (v1) | Arquitectura · Astrocartografía |
| 19 | `16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx` | `docs/Master/` | ~16 KB | Motor astrocartográfico DOC-16 v2 (colores Kairos) | Arquitectura · Astrocartografía |
| 20 | `17 Biblioteca de Interpretaciones Modulares — Kairos Maps.docx` | `docs/Master/` | ~31 KB | Biblioteca interpretativa modular DOC-17 | Biblioteca interpretativa · Interpretación |

---

## Tabla — TIPO · ESTADO · PRIORIDAD

| Documento (abreviado) | TIPO | ESTADO | PRIORIDAD |
|----------------------|------|--------|-----------|
| 1 — Astro Amor/Salud/Propósito | Editorial temático | IMPORTADO | ALTA |
| 2 — Astro Humana Experiencia Vital | Editorial temático | IMPORTADO | ALTA |
| 3 — Transformación Personal | Editorial temático | IMPORTADO | MEDIA |
| 4 — Astro Emocional Equilibrio | Editorial temático | IMPORTADO | MEDIA |
| 5 — Manual Maestro Astrocartografía | Manual maestro | IMPORTADO | CRÍTICA |
| 6 — Arquitectura Interpretativa Avanzada | Arquitectura interpretativa | IMPORTADO | CRÍTICA |
| 7 — Relocación Astrológica | Relocación | IMPORTADO | CRÍTICA |
| 8 — Arquitectura Datos (v1) | Arquitectura datos | HISTÓRICO (v1) | BAJA |
| 9 — Onboarding (v1) | Onboarding | HISTÓRICO (v1) | BAJA |
| 08 REVISADO v2 — Arquitectura Datos | Arquitectura datos | OFICIAL (v2) | CRÍTICA |
| 09 REVISADO v2 — Onboarding | Onboarding | OFICIAL (v2) | CRÍTICA |
| 10 — Voz y Tono | Voz | OFICIAL | CRÍTICA |
| 12 — Alertas y Notificaciones | Alertas | IMPORTADO | ALTA |
| 13 — Diseño Visual (v1) | Diseño | HISTÓRICO (v1) | BAJA |
| 13 REVISADO v2 — Diseño Visual | Diseño | OFICIAL (v2) | CRÍTICA |
| 14 — Roadmap | Producto / roadmap | IMPORTADO | ALTA |
| 15 — Modelo de Negocio | Negocio | IMPORTADO | ALTA |
| 16 — Motor Astrocartográfico (v1) | Motor / spec | HISTÓRICO (v1) | MEDIA |
| 16 REVISADO v2 — Motor (colores) | Motor / spec | OFICIAL (v2) | ALTA |
| 17 — Biblioteca Interpretaciones | Biblioteca | OFICIAL | CRÍTICA |

---

## Duplicados detectados (mismo tema, dos versiones)

| Par v1 → v2 | Resolución documental (sin interpretar contenido) |
|-------------|---------------------------------------------------|
| `8 Arquitectura de datos…` → `08 REVISADO v2…` | **Gana v2** — nombre explícito REVISADO v2; v1 histórico |
| `9 Flujo Completo de Onboarding…` → `09 REVISADO v2…` | **Gana v2** |
| `13 Diseño Visual…` → `13 REVISADO v2…` | **Gana v2** |
| `16 Motor Astrocartográfico…` → `16 REVISADO v2…` | **Gana v2** (colores Kairos) |

**Duplicado parcial repo ↔ master (mismo DOC, distinto formato):**

| Master (.docx) | Repo existente (`.txt`) | Notas |
|----------------|-------------------------|-------|
| 08 REVISADO v2 | `docs/architecture.txt` | Probable mismo DOC-08; verificar en fase posterior |
| 09 REVISADO v2 | `docs/onboarding.txt` | Probable mismo DOC-09 |
| 10 Voz y Tono | `docs/voice_tone.txt` | Probable mismo contenido |
| 13 REVISADO v2 | `docs/visual_identity.txt` | Repo puede ser v1; master trae v2 |
| 14 Roadmap | `docs/roadmap.txt` | |
| 16 / 16 v2 | `docs/astro_engine.txt` | Repo ≈ DOC-16 v1 |
| 17 Biblioteca | `docs/interpretations.txt` | |

---

## Documentos revisados (v2) — lista

1. `08 REVISADO v2 — Arquitectura de Datos — Kairos Maps.docx`
2. `09 REVISADO v2 — Flujo Completo de Onboarding — Kairos Maps.docx`
3. `13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx`
4. `16 REVISADO v2 — Motor Astrocartográfico colores KAIROS — astrocarto_engine.js.docx`

---

## Documentos históricos (v1 en corpus)

1. `8 Arquitectura de datos del usuario para Kairos Maps.docx`
2. `9 Flujo Completo de Onboarding — Kairos Maps.docx`
3. `13 Diseño Visual e Identidad — Kairos Maps.docx`
4. `16 Motor Astrocartográfico — astrocarto_engine.js — Kairos Maps.docx`

---

## Documentos incompletos / observaciones de importación

| Observación | Documento |
|-------------|-----------|
| Typo en nombre de archivo: **«Tutotia»** | Doc 5 Manual Maestro |
| **DOC-11 ausente** en corpus (salto 10 → 12 en numeración DOC) | — |
| Formato **solo .docx** — no hay `.txt`/`.md` espejo en `docs/Master/` | Todos |
| Contenido **no contrastado** con repo en esta fase | Todos |
| v1 y v2 **conviven** en la misma carpeta | Pares 8/08, 9/09, 13/13, 16/16 |

---

## Documentos no encontrados

| Esperado | Estado |
|----------|--------|
| 20 documentos en `docs/Master/` | ✅ **20/20 presentes** |
| DOC-11 (numeración serie) | ❌ **No importado** — hueco en serie |
| Subcarpetas temáticas | ❌ No existen — corpus plano |

---

## Relevancia aparente por capa (solo por título — sin interpretar contenido)

| Capa | Documentos master aparentemente críticos |
|------|------------------------------------------|
| **Natal Lite** | 10 Voz y Tono · 17 Biblioteca · 6 Arq. Interpretativa Avanzada |
| **Bridge** | 6 Arq. Interpretativa Avanzada · 17 Biblioteca · 5 Manual Maestro |
| **Relocation** | **7 Relocación Astrológica** |
| **Couple** | 1 Astro Amor · 5 Manual Maestro *(títulos; sin verificar)* |
| **Cities** | **5 Manual Maestro** · 1–4 temáticos astrocartografía |
| **AI** | **6 Arq. Interpretativa Avanzada** · **17 Biblioteca** |
| **Reports** | 15 Modelo de Negocio · 17 Biblioteca *(títulos; sin verificar)* |
| **Alertas** | **12 Sistema de Alertas** *(único doc dedicado)* |

---

## Correspondencia numeración DOC (cabeceras detectadas en preview)

| DOC | Archivo master |
|-----|----------------|
| — | 1, 2, 3, 4 (temáticos astrocartografía) |
| Manual | 5 |
| — | 6 (Arquitectura Interpretativa Avanzada) |
| — | 7 (Relocación) |
| 08 v1 / **08 v2** | 8 / 08 REVISADO v2 |
| 09 v1 / **09 v2** | 9 / 09 REVISADO v2 |
| 10 | 10 Voz y Tono |
| **11** | **AUSENTE** |
| 12 | 12 Alertas |
| 13 v1 / **13 v2** | 13 / 13 REVISADO v2 |
| 14 | 14 Roadmap |
| 15 | 15 Modelo de Negocio |
| 16 v1 / **16 v2** | 16 / 16 REVISADO v2 |
| 17 | 17 Biblioteca |

---

## Próximo paso documental (fuera de alcance 3.6h1)

- Conversión selectiva `.docx` → `.txt`/`.md` para lectura nativa en repo (opcional)
- Diff master v2 vs `docs/*.txt` existentes
- Auditoría constitucional 3.6h2+ con corpus master integrado

---

*Fase 3.6h1 · verificación importación · 20/20 archivos legibles · sin commit*
