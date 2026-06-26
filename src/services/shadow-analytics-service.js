/**
 * KAIROS MAPS — Shadow Analytics (Fase 7.9c)
 *
 * Instrumentación DEV del Shadow Runtime con effective profiles.
 * Solo métricas · sin texto editorial · sin impacto en producto.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.9c-0.1';
  var CHANNELS = ['narrative', 'premium', 'knowledge', 'atmosphere'];

  var Shadow = window.KairosIdentityShadowRuntime;
  var Comparison = window.KairosShadowComparison;
  var Index = window.KairosCityIdentityIndex;
  var Archetypes = window.KairosCityIdentityArchetypes;
  var Profile = window.KairosIdentityModulationProfile;
  var Catalog = window.KairosCitiesCatalog;

  function round(value, decimals) {
    if (value == null || isNaN(value) || !isFinite(value)) return 0;
    var factor = Math.pow(10, decimals != null ? decimals : 4);
    return Math.round(value * factor) / factor;
  }

  function dimensionSlugs() {
    if (Profile && Profile.PROFILE_DIMENSION_SLUGS) return Profile.PROFILE_DIMENSION_SLUGS.slice();
    return [
      'activation', 'tempo', 'visibility', 'rooting', 'reflection',
      'complexity', 'novelty', 'social_density', 'structure', 'horizon'
    ];
  }

  function archetypeSlugs() {
    if (Archetypes && Archetypes.ARCHETYPE_SLUGS) return Archetypes.ARCHETYPE_SLUGS.slice();
    return [];
  }

  function listCitySlugs() {
    if (!Index || typeof Index.listCityIdentities !== 'function') return [];
    return Index.listCityIdentities().map(function (entry) { return entry.citySlug; });
  }

  function mean(values) {
    if (!values.length) return 0;
    var sum = values.reduce(function (acc, value) { return acc + value; }, 0);
    return sum / values.length;
  }

  function variance(values) {
    if (!values.length) return 0;
    var avg = mean(values);
    var sumSq = values.reduce(function (acc, value) {
      var diff = value - avg;
      return acc + diff * diff;
    }, 0);
    return sumSq / values.length;
  }

  function stdDev(values) {
    return Math.sqrt(variance(values));
  }

  function minValue(values) {
    if (!values.length) return 0;
    return values.reduce(function (min, value) { return value < min ? value : min; }, values[0]);
  }

  function maxValue(values) {
    if (!values.length) return 0;
    return values.reduce(function (max, value) { return value > max ? value : max; }, values[0]);
  }

  function dimensionDeltaMagnitude(delta) {
    var slugs = dimensionSlugs();
    var total = 0;
    slugs.forEach(function (slug) {
      total += Math.abs(Number(delta && delta[slug]) || 0);
    });
    return total;
  }

  function coefficientDeltaMagnitude(comparison) {
    if (!comparison || !comparison.coefficients || !comparison.coefficients.delta) return 0;
    var total = 0;
    CHANNELS.forEach(function (channel) {
      var entry = comparison.coefficients.delta[channel];
      if (entry) total += Math.abs(Number(entry.scalarMagnitude) || 0);
    });
    return total;
  }

  function dominantDimensionFromDelta(delta) {
    var slugs = dimensionSlugs();
    var dominant = null;
    var maxAbs = -1;
    slugs.forEach(function (slug) {
      var abs = Math.abs(Number(delta && delta[slug]) || 0);
      if (abs > maxAbs) {
        maxAbs = abs;
        dominant = slug;
      }
    });
    return dominant;
  }

  function dominantChannelFromComparison(comparison) {
    return comparison && comparison.deltaSummary
      ? comparison.deltaSummary.dominantChannel
      : null;
  }

  function buildCityRecord(citySlug) {
    var shadow = Shadow.computeShadowIdentity(citySlug);
    var comparison = Comparison.computeComparison(citySlug);
    var indexEntry = Index && Index.getCityIdentity ? Index.getCityIdentity(citySlug) : null;
    var archetypeSlug = shadow.identityArchetype;
    var archetype = archetypeSlug && Archetypes ? Archetypes.getArchetype(archetypeSlug) : null;

    return {
      citySlug: citySlug,
      identityArchetype: archetypeSlug,
      macroIdentity: archetype && archetype.metadata ? archetype.metadata.macroIdentity : null,
      editorialFamily: shadow.shadowMetadata && shadow.shadowMetadata.editorialFamily,
      confidence: indexEntry && indexEntry.confidence,
      status: indexEntry && indexEntry.status,
      neutralFallback: shadow.shadowMetadata && shadow.shadowMetadata.neutralFallback === true,
      reviewRequired: indexEntry && indexEntry.status === 'review_required',
      baseProfile: shadow.baseProfile || {},
      citySignature: shadow.citySignature || null,
      effectiveProfile: shadow.effectiveProfile || shadow.dimensionProfile || {},
      signatureApplied: shadow.trace && shadow.trace.signatureApplied === true,
      dimensions: shadow.effectiveProfile || shadow.dimensionProfile || {},
      dimensionDelta: comparison.dimensions && comparison.dimensions.delta ? comparison.dimensions.delta : {},
      dimensionVariance: round(variance(dimensionSlugs().map(function (slug) {
        var dims = shadow.effectiveProfile || shadow.dimensionProfile || {};
        return Number(dims[slug]) || 3;
      })), 4),
      dimensionDeltaMagnitude: round(dimensionDeltaMagnitude(comparison.dimensions && comparison.dimensions.delta), 4),
      coefficientDeltaMagnitude: round(coefficientDeltaMagnitude(comparison), 4),
      dominantDimension: dominantDimensionFromDelta(comparison.dimensions && comparison.dimensions.delta),
      dominantChannel: dominantChannelFromComparison(comparison)
    };
  }

  function buildCityDataset() {
    return listCitySlugs().map(function (citySlug) {
      return buildCityRecord(citySlug);
    });
  }

  function computeAnalytics(citySlug) {
    var slug = citySlug != null ? String(citySlug).trim() : '';
    if (!slug) {
      return {
        schemaVersion: SCHEMA_VERSION,
        citySlug: null,
        metrics: {
          found: false,
          neutralFallback: true,
          dimensionVariance: 0,
          coefficientVariance: 0,
          dimensionDeltaMagnitude: 0,
          coefficientDeltaMagnitude: 0,
          dominantDimension: null,
          dominantChannel: null
        }
      };
    }

    var record = buildCityRecord(slug);
    return {
      schemaVersion: SCHEMA_VERSION,
      citySlug: slug,
      identityArchetype: record.identityArchetype,
      editorialFamily: record.editorialFamily,
      confidence: record.confidence,
      status: record.status,
      metrics: {
        found: !record.neutralFallback,
        neutralFallback: record.neutralFallback,
        reviewRequired: record.reviewRequired === true,
        dimensionVariance: record.dimensionVariance,
        coefficientVariance: round(Math.pow(record.coefficientDeltaMagnitude, 2), 4),
        dimensionDeltaMagnitude: record.dimensionDeltaMagnitude,
        coefficientDeltaMagnitude: record.coefficientDeltaMagnitude,
        dominantDimension: record.dominantDimension,
        dominantChannel: record.dominantChannel,
        signatureApplied: record.signatureApplied === true,
        dimensionsChanged: Object.keys(record.dimensionDelta).filter(function (key) {
          return record.dimensionDelta[key] !== 0;
        }).length
      }
    };
  }

  function incrementCount(map, key) {
    if (!key) key = '_unknown';
    map[key] = (map[key] || 0) + 1;
  }

  function sortCountMap(map) {
    return Object.keys(map)
      .map(function (key) {
        return { key: key, count: map[key] };
      })
      .sort(function (a, b) {
        return b.count - a.count || a.key.localeCompare(b.key);
      });
  }

  function computeDatasetAnalytics() {
    var dataset = buildCityDataset();
    var total = dataset.length;
    var expectedCities = Index && Index.EXPECTED_CITY_COUNT ? Index.EXPECTED_CITY_COUNT : 106;
    var expectedCountries = Catalog && Catalog.EXPECTED_COUNTRY_COUNT ? Catalog.EXPECTED_COUNTRY_COUNT : 103;
    var countryCount = Catalog && Catalog.CITIES
      ? new Set(Catalog.CITIES.map(function (city) { return city.country; })).size
      : 0;

    var reviewRequired = 0;
    var neutralFallbackCount = 0;
    var signatureAppliedCount = 0;
    var dimensionVarianceValues = [];
    var coefficientVarianceValues = [];
    var dimensionFrequency = {};
    var channelFrequency = {};
    var archetypeDistribution = {};
    var macroIdentityDistribution = {};
    var familyDistribution = {};

    dataset.forEach(function (record) {
      if (record.reviewRequired) reviewRequired += 1;
      if (record.neutralFallback) neutralFallbackCount += 1;
      if (record.signatureApplied) signatureAppliedCount += 1;
      dimensionVarianceValues.push(record.dimensionVariance);
      coefficientVarianceValues.push(Math.pow(record.coefficientDeltaMagnitude, 2));
      incrementCount(dimensionFrequency, record.dominantDimension);
      incrementCount(channelFrequency, record.dominantChannel);
      incrementCount(archetypeDistribution, record.identityArchetype);
      incrementCount(macroIdentityDistribution, record.macroIdentity);
      incrementCount(familyDistribution, record.editorialFamily);
    });

    var coverage = Index && typeof Index.getIdentityCoverage === 'function'
      ? Index.getIdentityCoverage()
      : { mapped: total, expected: expectedCities, complete: total === expectedCities };

    return {
      schemaVersion: SCHEMA_VERSION,
      datasetSize: total,
      coverage: {
        cities: {
          mapped: coverage.mapped,
          expected: coverage.expected || expectedCities,
          complete: coverage.complete === true,
          rate: round(total / (coverage.expected || expectedCities), 4)
        },
        countries: {
          count: countryCount,
          expected: expectedCountries,
          complete: countryCount === expectedCountries
        }
      },
      reviewRequired: {
        count: reviewRequired,
        rate: round(total ? reviewRequired / total : 0, 4)
      },
      neutralFallbackRate: round(total ? neutralFallbackCount / total : 0, 4),
      signatureAppliedCount: signatureAppliedCount,
      signatureAppliedRate: round(total ? signatureAppliedCount / total : 0, 4),
      averageDimensionVariance: round(mean(dimensionVarianceValues), 4),
      averageCoefficientVariance: round(mean(coefficientVarianceValues), 4),
      dominantDimensions: sortCountMap(dimensionFrequency),
      dominantChannels: sortCountMap(channelFrequency),
      archetypeDistribution: sortCountMap(archetypeDistribution),
      macroIdentityDistribution: sortCountMap(macroIdentityDistribution),
      familyDistribution: sortCountMap(familyDistribution)
    };
  }

  function computeArchetypeStatistics() {
    var dataset = buildCityDataset();
    var slugs = archetypeSlugs();
    var grouped = {};

    slugs.forEach(function (slug) {
      grouped[slug] = [];
    });

    dataset.forEach(function (record) {
      if (record.identityArchetype && grouped[record.identityArchetype]) {
        grouped[record.identityArchetype].push(record);
      }
    });

    return slugs.map(function (slug) {
      var rows = grouped[slug] || [];
      var dims = dimensionSlugs();
      var centroid = {};
      var dimVariance = {};
      var confidence = { A: 0, M: 0, B: 0 };

      dims.forEach(function (dim) {
        var values = rows.map(function (row) {
          return Number(row.dimensions[dim]) || 3;
        });
        centroid[dim] = round(mean(values), 4);
        dimVariance[dim] = round(variance(values), 4);
      });

      rows.forEach(function (row) {
        if (row.confidence && confidence[row.confidence] != null) {
          confidence[row.confidence] += 1;
        }
      });

      var archetype = Archetypes ? Archetypes.getArchetype(slug) : null;
      var varianceValues = dims.map(function (dim) { return dimVariance[dim]; });

      return {
        archetypeSlug: slug,
        cityCount: rows.length,
        macroIdentity: archetype && archetype.metadata ? archetype.metadata.macroIdentity : null,
        confidence: confidence,
        dimensionalCentroid: centroid,
        variance: {
          perDimension: dimVariance,
          aggregate: round(mean(varianceValues), 4)
        }
      };
    });
  }

  function computeDimensionStatistics() {
    var dataset = buildCityDataset();
    var slugs = dimensionSlugs();

    return slugs.map(function (slug) {
      var values = dataset.map(function (record) {
        return Number(record.dimensions[slug]) || 3;
      });
      return {
        dimensionSlug: slug,
        mean: round(mean(values), 4),
        standardDeviation: round(stdDev(values), 4),
        variance: round(variance(values), 4),
        min: round(minValue(values), 4),
        max: round(maxValue(values), 4),
        sampleSize: values.length
      };
    });
  }

  function computeConfidenceStatistics() {
    var dataset = buildCityDataset();
    var totals = { A: 0, M: 0, B: 0 };
    var byArchetype = {};
    var byFamily = {};
    var reviewRequired = 0;

    dataset.forEach(function (record) {
      if (record.confidence && totals[record.confidence] != null) {
        totals[record.confidence] += 1;
      }
      if (record.reviewRequired) reviewRequired += 1;
      incrementCount(byArchetype, record.identityArchetype + '::' + (record.confidence || '_unknown'));
      incrementCount(byFamily, record.editorialFamily + '::' + (record.confidence || '_unknown'));
    });

    var total = dataset.length;
    return {
      schemaVersion: SCHEMA_VERSION,
      totals: totals,
      rates: {
        A: round(total ? totals.A / total : 0, 4),
        M: round(total ? totals.M / total : 0, 4),
        B: round(total ? totals.B / total : 0, 4)
      },
      reviewRequired: {
        count: reviewRequired,
        rate: round(total ? reviewRequired / total : 0, 4)
      },
      byArchetype: Object.keys(byArchetype).sort().map(function (key) {
        var parts = key.split('::');
        return {
          archetypeSlug: parts[0],
          confidence: parts[1],
          count: byArchetype[key]
        };
      }),
      byFamily: Object.keys(byFamily).sort().map(function (key) {
        var parts = key.split('::');
        return {
          editorialFamily: parts[0],
          confidence: parts[1],
          count: byFamily[key]
        };
      })
    };
  }

  window.KairosShadowAnalytics = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    CHANNELS: CHANNELS.slice(),
    DIMENSION_SLUGS: dimensionSlugs(),
    computeAnalytics: computeAnalytics,
    computeDatasetAnalytics: computeDatasetAnalytics,
    computeArchetypeStatistics: computeArchetypeStatistics,
    computeDimensionStatistics: computeDimensionStatistics,
    computeConfidenceStatistics: computeConfidenceStatistics
  };
})();
