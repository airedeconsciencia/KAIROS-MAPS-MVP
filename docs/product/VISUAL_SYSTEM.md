---
title: "Diseño Visual e Identidad (DOC-13 v2)"
source_master: "docs/Master/13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx"
converted_phase: "3.6h4"
status: canonical-md
governs: "Diseño visual · Reports"
priority: "CRÍTICA"
---

# Diseño Visual e Identidad (DOC-13 v2)

> **Origen canónico:** [`docs/Master/13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx`](../Master/13 REVISADO v2 — Diseño Visual e Identidad — Kairos Maps.docx)  
> **Conversión:** Fase 3.6h4 · Contenido extraído del Master — preservar alineación con fuente Word  
> **Regla:** Este Markdown gobierna editorialmente su capa. No sustituye contratos técnicos en `docs/architecture/`.

---

## KAIROS MAPS — DOC-13 REVISADO v2

## Diseño Visual E Identidad

### Mayo 2026 — Versión corregida con paleta oficial KAIROS

Corrección principal: colores de planetas y signos alineados con chart_650_v1.js

════════════════════════════════════════════════════════

### NOTA DE CORRECCIÓN v2

════════════════════════════════════════════════════════

### La versión anterior definía colores planetarios genéricos

que no coincidían con los colores reales de KAIROS.

### Esta versión usa los colores extraídos directamente de

chart_650_v1.js — el motor visual oficial de KAIROS —

para garantizar coherencia total entre ambas apps.

════════════════════════════════════════════════════════

### 1. FILOSOFÍA VISUAL

════════════════════════════════════════════════════════

### Kairos Maps NO debe parecer:

- una app de tarot o horóscopos baratos

- una aplicación espiritual genérica

- software técnico astrológico

- Google Maps con líneas encima

### Debe sentirse como:

"una herramienta sofisticada de orientación humana y espacial"

### Inspiración visual correcta:

### Apple Maps · Notion · Oura · Arc Browser · Headspace

### Calm · National Geographic moderno · observatorios astronómicos

════════════════════════════════════════════════════════

### 2. PALETA DE COLOR PRINCIPAL

════════════════════════════════════════════════════════

### Fondos:

### Fondo principal: #0F1115 (negro profundo suave — nunca negro puro)

### Fondo secundario: #151A22 (azul noche)

### Superficies: #232832 (gris grafito)

### Texto:

### Texto principal: #F4F1EA (blanco cálido — nunca blanco puro)

### Texto secundario: #AAB2BF (gris suave)

### Acento dorado (marca KAIROS):

#C9A96E (el dorado KAIROS — usado en botones y marca)

════════════════════════════════════════════════════════

### 3. PALETA OFICIAL DE PLANETAS

════════════════════════════════════════════════════════

FUENTE: chart_650_v1.js — motor visual oficial KAIROS

Estos colores son los mismos que usa la carta natal de KAIROS.

NO cambiar. Son el sistema de identidad visual del ecosistema.

### Sol → #B45309 (ámbar tostado)

### Luna → #7C3AED (violeta)

### Mercurio → #0369A1 (azul profundo)

### Venus → #BE185D (rosa oscuro)

### Marte → #B91C1C (rojo)

### Júpiter → #D97706 (naranja ámbar)

### Saturno → #4B5563 (gris oscuro)

### Urano → #0E7490 (cian profundo)

### Neptuno → #106191 (azul marino)

### Plutón → #6B21A8 (púrpura)

### Nodo Norte→ #047857 (verde esmeralda, tomado de Capricornio)

### Quirón → #9CA3AF (gris plateado neutro)

### Reglas de uso:

— Los colores planetarios son para las LÍNEAS en el mapa

— Usar con opacidad 0.6-0.8, no al 100%

— Nunca saturar el mapa con todos los colores a la vez

— Activar capas por selección del usuario

════════════════════════════════════════════════════════

### 4. PALETA OFICIAL DE SIGNOS DEL ZODIACO

════════════════════════════════════════════════════════

FUENTE: chart_650_v1.js — SIGN_COLORS oficial

### Fuego:

### Aries → #EF4444 (rojo vivo)

### Leo → #F59E0B (ámbar dorado)

### Sagitario → #DC2626 (rojo oscuro)

### Tierra:

### Tauro → #10B981 (esmeralda)

### Virgo → #059669 (verde medio)

### Capricornio → #047857 (verde oscuro)

### Aire:

### Géminis → #8B5CF6 (violeta claro)

### Libra → #7C3AED (violeta)

### Acuario → #6D28D9 (violeta oscuro)

### Agua:

### Cáncer → #3B82F6 (azul claro)

### Escorpio → #0891B2 (cian azul)

### Piscis → #0E7490 (azul petróleo)

### Reglas de uso:

— Los colores de signos aparecen en la carta natal relocada

— En el mapa, se usan como etiquetas muy pequeñas y discretas

— Nunca como fondos ni bloques de color grandes

════════════════════════════════════════════════════════

### 5. COLORES DE ASPECTOS

════════════════════════════════════════════════════════

FUENTE: chart_650_v1.js — ASPECT_DEFS oficial

### Conjunción → #EAB308 (amarillo dorado)

### Oposición → #B91C1C (rojo)

### Trígono → #3B82F6 (azul)

### Cuadratura → #EF4444 (rojo claro)

### Sextil → #06B6D4 (cian)

### Estos colores se usan en la carta natal relocada,

no directamente en el mapa astrocartográfico.

════════════════════════════════════════════════════════

### 6. SÍMBOLOS OFICIALES

════════════════════════════════════════════════════════

FUENTE: chart_650_v1.js — KAIROS_GLYPHS

KAIROS tiene glifos SVG propios para todos los planetas y signos.

NO usar Unicode astrológico estándar (♄ ♃ ☿ ♀ ♂).

Usar siempre window.getKairosSymbol() del motor oficial.

Los glifos están disponibles en window.KAIROS_GLYPHS:

- window.KAIROS_GLYPHS.planets → Sol, Luna, Mercurio, etc.

- window.KAIROS_GLYPHS.zodiac → Aries, Tauro, Géminis, etc.

### Para renderizar en el mapa:

const svgPath = window.getKairosSymbol('planets', 'Venus');

// Devuelve el path SVG del glifo oficial

### Tamaño recomendado en el mapa: 14-18px

### Tamaño en etiquetas de línea: 10-12px

Usar siempre el color oficial del planeta como color del glifo.

════════════════════════════════════════════════════════

### 7. TIPOGRAFÍA

════════════════════════════════════════════════════════

### Tipografía principal (elegir una):

Inter · SF Pro · Neue Haas Grotesk · Manrope · General Sans

### Jerarquía:

### Títulos principales: 28-36px · peso 300-400 · espaciado amplio

### Subtítulos: 18-22px · peso 400

Texto interpretativo: 15-16px · peso 400 · line-height 1.7

### Etiquetas del mapa: 10-12px · peso 500 · mayúsculas

### Reglas críticas:

— Nunca tipografía manuscrita, cursiva esotérica o zodiacal

— El texto interpretativo es largo: la legibilidad es prioritaria

— Líneas de texto cortas (max 65-70 caracteres por línea)

— Espaciado generoso entre párrafos

════════════════════════════════════════════════════════

### 8. DISEÑO DEL MAPA

════════════════════════════════════════════════════════

El mapa es el corazón emocional de la app.

### Estilo base:

— Fondo oscuro (no negro puro, #0F1115 o similar)

— Océanos: azul muy oscuro y profundo, textura sutil

— Países: gris muy suave, sin detalle político excesivo

— Fronteras: líneas finísimas 0.3-0.5px, opacidad 30%

### Líneas planetarias:

— Color: el color oficial del planeta (ver sección 3)

— Opacidad base: 0.55

— Opacidad al hover/selección: 0.9

— Grosor: 1.5px base, 2.5px al seleccionar

— Las líneas MC/IC son verticales con trazo ligeramente diferente

— Las líneas AC/DC son curvas orgánicas

### Sistema de capas:

— Por defecto mostrar solo 3-4 líneas (las más relevantes para el objetivo)

— El usuario activa más capas manualmente

— NUNCA mostrar las 48 líneas simultáneamente

### Sistema de zoom:

### Zoom global: solo líneas principales, sin etiquetas

### Zoom regional: aparecen etiquetas de planeta y ángulo

### Zoom ciudad: aparece intensidad, distancia, recomendación

════════════════════════════════════════════════════════

### 9. COMPONENTES DE INTERFAZ

════════════════════════════════════════════════════════

### Cards de interpretación:

— Fondo: #232832 (gris grafito)

— Borde: 1px #3A4250 (sutil)

— Border-radius: 16px

— Padding: 24px

— Sombra: muy suave, difusa

### Botón principal:

— Fondo: #C9A96E (dorado KAIROS)

— Texto: #0F1115 (negro profundo)

— Border-radius: 999px (pill)

— Peso tipográfico: 600

— Letra-spacing: 0.05em

### Botón secundario:

— Fondo: transparente

— Borde: 1px #C9A96E

— Texto: #C9A96E

### Pills de planeta (etiquetas en el mapa):

— Fondo: color del planeta al 15% de opacidad

— Borde: 1px color del planeta al 60%

— Texto: color del planeta al 100%

— Glifo SVG del planeta a la izquierda

════════════════════════════════════════════════════════

### 10. ANIMACIONES

════════════════════════════════════════════════════════

### Correctas:

— Transiciones suaves (300-500ms, ease-in-out)

— Fade elegante al aparecer contenido

— Líneas que aparecen gradualmente al calcular

— Pulso muy suave en líneas activas (no agresivo)

— Zoom fluido en el mapa

### Incorrectas:

— Rebotes agresivos

— Efectos cósmicos o destellos

— Partículas mágicas flotantes

— Transiciones demasiado rápidas o demasiado lentas

════════════════════════════════════════════════════════

### 11. LO QUE NUNCA DEBE APARECER

════════════════════════════════════════════════════════

### Visualmente prohibido:

— Galaxias de fondo o imágenes cósmicas cliché

— Mandalas o patrones geométricos esotéricos

— Degradados arcoíris

— Azules neón o colores fluorescentes

— Mujeres flotando en el espacio

— Ojos místicos o símbolos new age

— Fondos con estrellas animadas

— Efectos de partículas mágicas

════════════════════════════════════════════════════════

### 12. COHERENCIA CON KAIROS (APP PRINCIPAL)

════════════════════════════════════════════════════════

### Kairos Maps y KAIROS deben compartir:

✓ Colores de planetas (chart_650_v1.js — PLANET_DEFS)

✓ Colores de signos (chart_650_v1.js — SIGN_COLORS)

✓ Glifos SVG (chart_650_v1.js — KAIROS_GLYPHS)

✓ Color dorado de marca (#C9A96E)

✓ Estética oscura y elegante

✓ Tipografía sans-serif moderna

### Pueden diferir en:

✓ Layout (Kairos Maps es mapa-first, KAIROS es módulos-first)

✓ Componentes específicos del mapa

✓ Flujos de usuario

════════════════════════════════════════════════════════

### FIN DEL DOCUMENTO — DOC-13 v2 REVISADO

### Kairos Maps | Mayo 2026

════════════════════════════════════════════════════════

