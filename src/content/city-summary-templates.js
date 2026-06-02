/**
 * KAIROS MAPS — City summary templates (Fase 3.8b)
 * Una plantilla por goal. Voice & tone: modal, sin jerga, sin promesas.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '1.0.0';

  var TEMPLATES = {
    amor: 'Este lugar puede favorecer más conexión y apertura relacional.',
    trabajo: 'Aquí podrían activarse temas de visibilidad, movimiento profesional y dirección.',
    descanso: 'Este entorno puede ayudarte a bajar el ritmo y recuperar estabilidad.',
    viajes: 'Este lugar puede abrir perspectiva y sensación de exploración.',
    cambio: 'Este entorno puede impulsar un proceso de cambio personal.',
    creatividad: 'Este lugar puede favorecer inspiración y expresión creativa.',
    raices: 'Aquí puede aparecer una sensación más hogareña y arraigada.',
    crecimiento: 'Aquí podrían activarse impulso de crecimiento y amplitud vital.'
  };

  function buildHumanSummary(goalId, reasonKeys) {
    var id = goalId || 'amor';
    if (TEMPLATES[id]) return TEMPLATES[id];
    return TEMPLATES.amor;
  }

  window.KairosCitySummaryTemplates = {
    schemaVersion: SCHEMA_VERSION,
    templates: TEMPLATES,
    buildHumanSummary: buildHumanSummary
  };
})();
