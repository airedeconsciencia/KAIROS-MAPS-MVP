/**
 * KAIROS MAPS — City Identity Archetypes (Fase 7.5b catalog)
 *
 * Catálogo semántico L2 · 28 arquetipos · solo metadatos.
 * Sin ciudades · sin dimensiones · sin pesos · sin modulación.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.5b-0.1';

  var CATALOG = [
    {
      id: 'ci-001',
      slug: 'creative_expansion',
      displayName: 'Expansión creativa',
      summary: 'Proceso vital de ampliar la vida mediante escena, creación y encuentro colectivo — sin prometer reconocimiento.',
      compatibleGoals: ['amor', 'trabajo', 'descanso'],
      incompatibleLabels: [
        'retiro total',
        'invisibilidad forzada',
        'vida mínima de estímulo'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'scene_making',
        stability: 'core',
        editorialCluster: 'Creative Laboratory'
      }
    },
    {
      id: 'ci-002',
      slug: 'projection',
      displayName: 'Proyección',
      summary: 'Modo urbano donde el yo necesita ser legible en el espacio público o profesional — escena, no destino.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'anonimato prolongado',
        'retiro meditativo',
        'vida sin testigo'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'visible_self',
        stability: 'core',
        editorialCluster: 'Lifestyle Metropolis'
      }
    },
    {
      id: 'ci-003',
      slug: 'quiet_integration',
      displayName: 'Integración silenciosa',
      summary: 'Pertenencia que madura en lo cotidiano sin performance ni escena — enraizar sin exhibirse.',
      compatibleGoals: ['amor', 'descanso', 'trabajo'],
      incompatibleLabels: [
        'escena constante',
        'urgencia de visibilidad',
        'red sin pausa'
      ],
      metadata: {
        macroIdentity: 'integration',
        identityAxis: 'slow_belonging',
        stability: 'core',
        editorialCluster: 'Forest Refuge'
      }
    },
    {
      id: 'ci-004',
      slug: 'disciplined_precision',
      displayName: 'Precisión disciplinada',
      summary: 'Afinación vital mediante orden, detalle y refinamiento — compostura antes que aspaviento.',
      compatibleGoals: ['trabajo', 'descanso'],
      incompatibleLabels: [
        'caos productivo',
        'expresividad desbordada',
        'improvisación permanente'
      ],
      metadata: {
        macroIdentity: 'attunement',
        identityAxis: 'refinement',
        stability: 'core',
        editorialCluster: 'Academic City'
      }
    },
    {
      id: 'ci-005',
      slug: 'spontaneous_exchange',
      displayName: 'Intercambio espontáneo',
      summary: 'La vida avanza por encuentros fluidos y trato directo — conexión sin guion previo.',
      compatibleGoals: ['amor', 'trabajo', 'descanso'],
      incompatibleLabels: [
        'aislamiento funcional',
        'jerarquía rígida',
        'protocolo sin calor'
      ],
      metadata: {
        macroIdentity: 'attachment',
        identityAxis: 'flow_encounter',
        stability: 'core',
        editorialCluster: 'Regional Connector'
      }
    },
    {
      id: 'ci-006',
      slug: 'contemplative_depth',
      displayName: 'Profundidad contemplativa',
      summary: 'Giro hacia la alineación interior con el contexto — memoria y reflexión como proceso, no como retiro definitivo.',
      compatibleGoals: ['descanso', 'amor'],
      incompatibleLabels: [
        'aceleración constante',
        'performance pública',
        'urgencia competitiva'
      ],
      metadata: {
        macroIdentity: 'introspection',
        identityAxis: 'inner_alignment',
        stability: 'core',
        editorialCluster: 'Meditative Haven'
      }
    },
    {
      id: 'ci-007',
      slug: 'strategic_expansion',
      displayName: 'Expansión estratégica',
      summary: 'Construcción calculada de posición y alcance — crecimiento con mapa, no con impulso ciego.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'indefinición prolongada',
        'vida sin dirección',
        'emergencia sin estructura'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'position_building',
        stability: 'core',
        editorialCluster: 'Emerging Capital'
      }
    },
    {
      id: 'ci-008',
      slug: 'expressive_intensity',
      displayName: 'Intensidad expresiva',
      summary: 'Permiso para que lo afectivo ocupe espacio — volumen sentido sin prometer felicidad.',
      compatibleGoals: ['amor', 'trabajo', 'descanso'],
      incompatibleLabels: [
        'contención extrema',
        'neutralidad afectiva',
        'compostura sin margen'
      ],
      metadata: {
        macroIdentity: 'manifestation',
        identityAxis: 'felt_volume',
        stability: 'core',
        editorialCluster: 'Artistic Ecosystem'
      }
    },
    {
      id: 'ci-009',
      slug: 'structural_ambition',
      displayName: 'Ambición estructural',
      summary: 'Vida organizada por escalera, sistema y jerarquía reconocible — ascenso como proceso urbano.',
      compatibleGoals: ['trabajo'],
      incompatibleLabels: [
        'margen sin jerarquía',
        'vida sin escalera',
        'caos institucional'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'system_climb',
        stability: 'core',
        editorialCluster: 'Financial Center'
      }
    },
    {
      id: 'ci-010',
      slug: 'adaptive_reinvention',
      displayName: 'Reinvención adaptativa',
      summary: 'Ruptura y rehacerse cuando el entorno exige otra versión — metamorfosis sin garantía de éxito.',
      compatibleGoals: ['trabajo', 'amor', 'descanso'],
      incompatibleLabels: [
        'continuidad cómoda',
        'pasado como ancla fija',
        'vida sin revisión'
      ],
      metadata: {
        macroIdentity: 'metamorphosis',
        identityAxis: 'rupture_remake',
        stability: 'core',
        editorialCluster: 'Transformation Gateway'
      }
    },
    {
      id: 'ci-011',
      slug: 'coastal_balance',
      displayName: 'Equilibrio costero',
      summary: 'La proximidad al agua modera ritmo y perspectiva — amplitud que regula, no que promete.',
      compatibleGoals: ['descanso', 'amor', 'trabajo'],
      incompatibleLabels: [
        'vida comprimida',
        'urgencia sin pausa',
        'horizonte cerrado'
      ],
      metadata: {
        macroIdentity: 'horizon',
        identityAxis: 'water_moderation',
        stability: 'core',
        editorialCluster: 'Port Metropolis'
      }
    },
    {
      id: 'ci-012',
      slug: 'institutional_visibility',
      displayName: 'Visibilidad institucional',
      summary: 'Presencia vital mediada por sistema, institución u orden público — legibilidad sin personaje.',
      compatibleGoals: ['trabajo'],
      incompatibleLabels: [
        'expresividad desbordada',
        'vida fuera del sistema',
        'anonimato como ideal'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'system_presence',
        stability: 'core',
        editorialCluster: 'Diplomatic Center'
      }
    },
    {
      id: 'ci-013',
      slug: 'island_retreat',
      displayName: 'Retiro insular',
      summary: 'Contención acotada y ritmo propio — escala humana que protege el interior sin aislar del mundo.',
      compatibleGoals: ['descanso', 'amor'],
      incompatibleLabels: [
        'red sin frontera',
        'momentum urbano',
        'escena permanente'
      ],
      metadata: {
        macroIdentity: 'attunement',
        identityAxis: 'bounded_calm',
        stability: 'core',
        editorialCluster: 'Island Retreat'
      }
    },
    {
      id: 'ci-014',
      slug: 'cultural_memory',
      displayName: 'Memoria cultural',
      summary: 'El pasado como capa viva del presente — profundidad histórica que orienta, no que fija identidad.',
      compatibleGoals: ['descanso', 'amor', 'trabajo'],
      incompatibleLabels: [
        'ruptura sin contexto',
        'presente sin raíz',
        'olvido como ideal'
      ],
      metadata: {
        macroIdentity: 'introspection',
        identityAxis: 'layered_past',
        stability: 'core',
        editorialCluster: 'Historic Core'
      }
    },
    {
      id: 'ci-015',
      slug: 'technological_acceleration',
      displayName: 'Aceleración tecnológica',
      summary: 'Ritmo de cambio y sincronía con innovación — velocidad como entorno, no como promesa de progreso.',
      compatibleGoals: ['trabajo'],
      incompatibleLabels: [
        'ritmo dilatado',
        'vida sin actualización',
        'contemplación prolongada'
      ],
      metadata: {
        macroIdentity: 'amplification',
        identityAxis: 'pace_sync',
        stability: 'core',
        editorialCluster: 'Innovation Hub'
      }
    },
    {
      id: 'ci-016',
      slug: 'trade_crossroads',
      displayName: 'Cruce comercial',
      summary: 'Identidad de paso e intercambio — ciudad como nodo, no como hogar definitivo.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'arraigo sin tránsito',
        'vida monolítica',
        'cierre de fronteras'
      ],
      metadata: {
        macroIdentity: 'liminality',
        identityAxis: 'passage_identity',
        stability: 'core',
        editorialCluster: 'Movement Hub'
      }
    },
    {
      id: 'ci-017',
      slug: 'resilient_ordinariness',
      displayName: 'Ordinariedad resiliente',
      summary: 'Dignidad cotidiana bajo presión o escala reducida — sostener lo ordinario sin espectáculo.',
      compatibleGoals: ['trabajo', 'descanso', 'amor'],
      incompatibleLabels: [
        'escena obligatoria',
        'proyección constante',
        'vida solo de ruptura'
      ],
      metadata: {
        macroIdentity: 'endurance',
        identityAxis: 'daily_dignity',
        stability: 'core',
        editorialCluster: 'Resilient City'
      }
    },
    {
      id: 'ci-018',
      slug: 'expansive_horizon',
      displayName: 'Horizonte expansivo',
      summary: 'La amplitud del entorno abre perspectiva vital — paisaje que modula posibilidades, no destino.',
      compatibleGoals: ['descanso', 'amor', 'trabajo'],
      incompatibleLabels: [
        'vida comprimida',
        'densidad sin respiro',
        'perspectiva cerrada'
      ],
      metadata: {
        macroIdentity: 'horizon',
        identityAxis: 'landscape_opening',
        stability: 'core',
        editorialCluster: 'Oceanic Frontier'
      }
    },
    {
      id: 'ci-019',
      slug: 'networked_momentum',
      displayName: 'Impulso en red',
      summary: 'Densidad de conexiones como motor — la ciudad como flujo relacional y oportunidad en movimiento.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'aislamiento prolongado',
        'retiro insular',
        'vida sin contacto'
      ],
      metadata: {
        macroIdentity: 'attachment',
        identityAxis: 'density_connect',
        stability: 'core',
        editorialCluster: 'Movement Hub'
      }
    },
    {
      id: 'ci-020',
      slug: 'ceremonial_hospitality',
      displayName: 'Hospitalidad ceremonial',
      summary: 'Calidez ritual en el trato — vínculo mediado por costumbre y gesto formal, no por intimidad instantánea.',
      compatibleGoals: ['amor', 'descanso'],
      incompatibleLabels: [
        'frialdad relacional',
        'trato puramente utilitario',
        'aislamiento protocolar'
      ],
      metadata: {
        macroIdentity: 'attachment',
        identityAxis: 'warm_ritual',
        stability: 'extended',
        editorialCluster: 'Regional Connector'
      }
    },
    {
      id: 'ci-021',
      slug: 'frontier_emergence',
      displayName: 'Emergencia fronteriza',
      summary: 'Devenir en terreno aún indefinido — proceso vital de formación, no de llegada.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'orden consolidado',
        'pasado como freno único',
        'vida sin incertidumbre'
      ],
      metadata: {
        macroIdentity: 'metamorphosis',
        identityAxis: 'undefined_becoming',
        stability: 'extended',
        editorialCluster: 'Frontier City'
      }
    },
    {
      id: 'ci-022',
      slug: 'meditative_withdrawal',
      displayName: 'Retiro meditativo',
      summary: 'Interioridad protegida y ritmo mínimo — pausa que puede sostener revisión, no huida garantizada.',
      compatibleGoals: ['descanso'],
      incompatibleLabels: [
        'escena pública',
        'red constante',
        'urgencia social'
      ],
      metadata: {
        macroIdentity: 'introspection',
        identityAxis: 'guarded_interior',
        stability: 'core',
        editorialCluster: 'Mountain Sanctuary'
      }
    },
    {
      id: 'ci-023',
      slug: 'cosmopolitan_collage',
      displayName: 'Collage cosmopolita',
      summary: 'Pluralidad de mundos en un mismo habitar — identidad compuesta sin fusión simple.',
      compatibleGoals: ['trabajo', 'amor', 'descanso'],
      incompatibleLabels: [
        'homogeneidad forzada',
        'un solo código vital',
        'cierre identitario'
      ],
      metadata: {
        macroIdentity: 'stratification',
        identityAxis: 'plural_self',
        stability: 'core',
        editorialCluster: 'Cultural Crossroads'
      }
    },
    {
      id: 'ci-024',
      slug: 'sovereign_calm',
      displayName: 'Calma soberana',
      summary: 'Compostura y poder contenido — presencia estable sin aspaviento ni urgencia performativa.',
      compatibleGoals: ['trabajo', 'descanso'],
      incompatibleLabels: [
        'caos emocional',
        'urgencia de escena',
        'vida sin margen'
      ],
      metadata: {
        macroIdentity: 'attunement',
        identityAxis: 'composed_power',
        stability: 'core',
        editorialCluster: 'Diplomatic Center'
      }
    },
    {
      id: 'ci-025',
      slug: 'regenerative_slow_burn',
      displayName: 'Regeneración lenta',
      summary: 'Cambio vital en ciclo largo — transformación que madura en el tiempo, no en la ruptura inmediata.',
      compatibleGoals: ['descanso', 'amor', 'trabajo'],
      incompatibleLabels: [
        'ruptura instantánea',
        'vida sin pausa',
        'cambio como espectáculo'
      ],
      metadata: {
        macroIdentity: 'metamorphosis',
        identityAxis: 'long_cycle',
        stability: 'core',
        editorialCluster: 'Transformation Gateway'
      }
    },
    {
      id: 'ci-026',
      slug: 'border_threshold',
      displayName: 'Umbral fronterizo',
      summary: 'Habitar la mezcla no resuelta entre mundos — limen como proceso, no como conflicto a cerrar.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'identidad única cerrada',
        'orden sin fricción',
        'pureza cultural'
      ],
      metadata: {
        macroIdentity: 'liminality',
        identityAxis: 'unresolved_mix',
        stability: 'core',
        editorialCluster: 'Continental Bridge'
      }
    },
    {
      id: 'ci-027',
      slug: 'layered_capital',
      displayName: 'Capital estratificada',
      summary: 'Navegar complejidad en capas — densidad urbana como mapa mental, no como laberinto sin salida.',
      compatibleGoals: ['trabajo', 'amor'],
      incompatibleLabels: [
        'simplicidad forzada',
        'vida sin capas',
        'transparencia total'
      ],
      metadata: {
        macroIdentity: 'stratification',
        identityAxis: 'complexity_nav',
        stability: 'core',
        editorialCluster: 'Political Capital'
      }
    },
    {
      id: 'ci-028',
      slug: 'contained_intensity',
      displayName: 'Intensidad contenida',
      summary: 'Fuerza vital comprimida bajo restricción — presión que concentra, no que libera automáticamente.',
      compatibleGoals: ['trabajo', 'descanso'],
      incompatibleLabels: [
        'amplitud sin límite',
        'expansión desbordada',
        'vida sin fricción'
      ],
      metadata: {
        macroIdentity: 'endurance',
        identityAxis: 'compressed_force',
        stability: 'extended',
        editorialCluster: 'Resilient City'
      }
    }
  ];

  var ARCHETYPE_INDEX = {};
  var ARCHETYPE_SLUGS = [];

  CATALOG.forEach(function (entry) {
    ARCHETYPE_INDEX[entry.slug] = entry;
    ARCHETYPE_SLUGS.push(entry.slug);
  });

  function getArchetype(slug) {
    if (!slug) return null;
    return ARCHETYPE_INDEX[String(slug).trim()] || null;
  }

  function getArchetypeById(id) {
    if (!id) return null;
    var key = String(id).trim();
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].id === key) return CATALOG[i];
    }
    return null;
  }

  function listArchetypeSlugs() {
    return ARCHETYPE_SLUGS.slice();
  }

  function listArchetypes() {
    return CATALOG.map(function (entry) {
      return entry;
    });
  }

  window.KairosCityIdentityArchetypes = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CATALOG: CATALOG,
    ARCHETYPE_INDEX: ARCHETYPE_INDEX,
    ARCHETYPE_SLUGS: ARCHETYPE_SLUGS,
    getArchetype: getArchetype,
    getArchetypeById: getArchetypeById,
    listArchetypeSlugs: listArchetypeSlugs,
    listArchetypes: listArchetypes
  };
})();
