/**
 * KAIROS MAPS — Identity Dimensions (Fase 7.5a infrastructure)
 *
 * Catálogo dimensional L3 · perfiles neutros únicamente.
 * Sin coeficientes · sin pesos · sin efectos editoriales.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.5a-0.1';
  var NEUTRAL_VALUE = 3;
  var SCALE_MIN = 1;
  var SCALE_MAX = 5;

  var DIMENSION_CATALOG = [
  {
    slug: 'activation',
    name: 'Activación',
    description: 'Mobilización psíquica hacia fuera.'
  },
  {
    slug: 'pace',
    name: 'Ritmo',
    description: 'Cadencia que la rutina urbana impone al día a día.'
  },
  {
    slug: 'cognitive_load',
    name: 'Carga cognitiva',
    description: 'Esfuerzo de navegar complejidad urbana.'
  },
  {
    slug: 'encounter_flow',
    name: 'Flujo de encuentro',
    description: 'Facilidad y frecuencia de encuentros significativos.'
  },
  {
    slug: 'inward_pull',
    name: 'Tiro interior',
    description: 'Fuerza hacia vida interior, memoria y reflexión.'
  },
  {
    slug: 'visibility_pressure',
    name: 'Presión de visibilidad',
    description: 'Presión de ser visto, evaluado o proyectado.'
  },
  {
    slug: 'structural_order',
    name: 'Orden estructural',
    description: 'Grado de orden y previsibilidad sistémica.'
  },
  {
    slug: 'transformative_charge',
    name: 'Carga transformadora',
    description: 'Presión vital hacia cambio de identidad.'
  },
  {
    slug: 'rooting_depth',
    name: 'Profundidad de arraigo',
    description: 'Potencial de pertenencia lenta sin performance.'
  },
  {
    slug: 'horizon_amplitude',
    name: 'Amplitud de horizonte',
    description: 'Amplitud psicológica que el entorno abre o cierra.'
  }
  ];

  var DIMENSION_SLUGS = DIMENSION_CATALOG.map(function (d) { return d.slug; });

  function buildNeutralDimensionVector() {
    var vector = {};
    DIMENSION_SLUGS.forEach(function (slug) {
      vector[slug] = NEUTRAL_VALUE;
    });
    return vector;
  }

  function getDimensionDefinition(slug) {
    if (!slug) return null;
    var key = String(slug).trim();
    for (var i = 0; i < DIMENSION_CATALOG.length; i++) {
      if (DIMENSION_CATALOG[i].slug === key) return DIMENSION_CATALOG[i];
    }
    return null;
  }

  window.KairosIdentityDimensions = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    NEUTRAL_VALUE: NEUTRAL_VALUE,
    SCALE_MIN: SCALE_MIN,
    SCALE_MAX: SCALE_MAX,
    DIMENSION_CATALOG: DIMENSION_CATALOG,
    DIMENSION_SLUGS: DIMENSION_SLUGS,
    buildNeutralDimensionVector: buildNeutralDimensionVector,
    getDimensionDefinition: getDimensionDefinition
  };
})();
