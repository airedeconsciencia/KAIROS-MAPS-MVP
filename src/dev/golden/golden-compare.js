/**
 * Fase 2.1a-2c — Golden compare (motor natal vs referencias)
 * Sin DOM. Expone window.GoldenCompare para golden-test.html
 */
(function () {
  'use strict';

  var BODY_KEYS = ['SUN', 'MOON', 'ASC', 'MC'];
  var BODY_LABELS = {
    SUN: 'Sol',
    MOON: 'Luna',
    ASC: 'Ascendente',
    MC: 'Medio Cielo'
  };

  function norm360(deg) {
    var d = deg % 360;
    return d < 0 ? d + 360 : d;
  }

  function deltaDeg(actual, expected) {
    var diff = Math.abs(norm360(actual) - norm360(expected));
    return diff > 180 ? 360 - diff : diff;
  }

  function fmtDelta(deg) {
    if (deg == null || Number.isNaN(deg)) return '—';
    var sign = deg <= 0.00005 ? '±' : '+';
    return sign + deg.toFixed(4) + '°';
  }

  function aspectKey(p1, p2, aspect) {
    var pair = [p1, p2].sort().join('|');
    return pair + '::' + aspect;
  }

  function findAspect(aspects, ref) {
    if (!aspects) return null;
    var target = aspectKey(ref.p1, ref.p2, ref.aspect);
    for (var i = 0; i < aspects.length; i++) {
      var a = aspects[i];
      if (aspectKey(a.p1, a.p2, a.aspect) === target) return a;
    }
    return null;
  }

  function getBodyLongitude(chart, key) {
    if (key === 'ASC' || key === 'MC') {
      return chart.angles && chart.angles[key] ? chart.angles[key].longitude : null;
    }
    return chart.planets && chart.planets[key] ? chart.planets[key].longitude : null;
  }

  function pushResult(results, item) {
    results.push(item);
    return item;
  }

  function compareUtc(chart, refCase, tolerances, results) {
    var actual = chart.input && chart.input.utc;
    var expected = refCase.reference.utc;
    var pass = actual === expected;
    return pushResult(results, {
      group: 'UTC',
      field: 'Instante UTC',
      expected: expected,
      actual: actual || '—',
      delta: pass ? '±0.0000°' : '≠',
      tolerance: 'exacto',
      pass: pass,
      note: refCase.notes && refCase.notes.dst ? refCase.notes.dst : ''
    });
  }

  function compareBodies(chart, refCase, tolerances, results) {
    var tol = tolerances.planetsDeg;
    var angleTol = tolerances.anglesDeg;
    BODY_KEYS.forEach(function (key) {
      var refBody = refCase.reference.bodies[key];
      if (!refBody) return;
      var actualLon = getBodyLongitude(chart, key);
      var isAngle = key === 'ASC' || key === 'MC';
      var limit = isAngle ? angleTol : tol;
      var delta = actualLon != null ? deltaDeg(actualLon, refBody.longitude) : null;
      var pass = delta != null && delta <= limit;
      pushResult(results, {
        group: isAngle ? 'Ángulos' : 'Planetas',
        field: BODY_LABELS[key] + ' (' + key + ')',
        expected: refBody.longitude.toFixed(4) + '° · ' + (refBody.sign || ''),
        actual: actualLon != null ? actualLon.toFixed(4) + '°' : '—',
        delta: fmtDelta(delta),
        tolerance: '±' + limit + '°',
        pass: pass
      });
    });
  }

  function compareHouses(chart, refCase, tolerances, results) {
    var tol = tolerances.housesDeg;
    var refHouses = refCase.reference.houses || [];
    var actualHouses = chart.houses || [];
    var allPass = true;
    refHouses.forEach(function (expectedLon, i) {
      var actualLon = actualHouses[i] ? actualHouses[i].longitude : null;
      var delta = actualLon != null ? deltaDeg(actualLon, expectedLon) : null;
      var pass = delta != null && delta <= tol;
      if (!pass) allPass = false;
      pushResult(results, {
        group: 'Casas Placidus',
        field: 'Casa ' + (i + 1),
        expected: expectedLon.toFixed(4) + '°',
        actual: actualLon != null ? actualLon.toFixed(4) + '°' : '—',
        delta: fmtDelta(delta),
        tolerance: '±' + tol + '°',
        pass: pass
      });
    });
    return allPass;
  }

  function compareAspects(chart, refCase, tolerances, results) {
    var tol = tolerances.aspectsOrbDeg;
    var refAspects = refCase.reference.aspects || [];
    var actualAspects = chart.aspects || [];
    refAspects.forEach(function (refAsp) {
      var found = findAspect(actualAspects, refAsp);
      if (!found) {
        pushResult(results, {
          group: 'Aspectos',
          field: refAsp.p1 + ' ' + refAsp.aspect + ' ' + refAsp.p2,
          expected: 'orbe ' + refAsp.orb.toFixed(4) + '°',
          actual: 'no detectado',
          delta: '—',
          tolerance: 'tipo + orbe ±' + tol + '°',
          pass: false
        });
        return;
      }
      var orbDelta = Math.abs(found.orb - refAsp.orb);
      var pass = orbDelta <= tol;
      pushResult(results, {
        group: 'Aspectos',
        field: refAsp.p1 + ' ' + refAsp.aspect + ' ' + refAsp.p2,
        expected: 'orbe ' + refAsp.orb.toFixed(4) + '°',
        actual: 'orbe ' + found.orb.toFixed(4) + '° (' + (found.formattedOrb || '') + ')',
        delta: fmtDelta(orbDelta),
        tolerance: '±' + tol + '°',
        pass: pass
      });
    });
  }

  function compareCase(chart, refCase, meta) {
    var tolerances = meta.tolerances;
    var results = [];
    compareUtc(chart, refCase, tolerances, results);
    compareBodies(chart, refCase, tolerances, results);
    compareHouses(chart, refCase, tolerances, results);
    compareAspects(chart, refCase, tolerances, results);

    var passed = results.filter(function (r) { return r.pass; }).length;
    var failed = results.filter(function (r) { return !r.pass; }).length;
    var groups = {};
    results.forEach(function (r) {
      if (!groups[r.group]) groups[r.group] = { pass: 0, fail: 0 };
      if (r.pass) groups[r.group].pass++; else groups[r.group].fail++;
    });

    return {
      id: refCase.id,
      label: refCase.label,
      pass: failed === 0,
      summary: {
        total: results.length,
        passed: passed,
        failed: failed
      },
      groups: groups,
      results: results,
      chartMeta: {
        utc: chart.input && chart.input.utc,
        motor: chart.metadata && (chart.metadata.motor || chart.metadata.engine),
        houseSystem: chart.metadata && chart.metadata.house_system,
        elapsedMs: chart.elapsedMs,
        fromCache: chart.fromCache
      }
    };
  }

  function compareAll(chartsById, goldenData) {
    var meta = goldenData.meta;
    var reports = goldenData.cases.map(function (refCase) {
      var chart = chartsById[refCase.id];
      if (!chart) {
        return {
          id: refCase.id,
          label: refCase.label,
          pass: false,
          error: 'Carta no calculada para ' + refCase.id,
          results: []
        };
      }
      return compareCase(chart, refCase, meta);
    });

    var allPass = reports.every(function (r) { return r.pass; });
    return {
      allPass: allPass,
      meta: meta,
      reports: reports
    };
  }

  window.GoldenCompare = {
    compareCase: compareCase,
    compareAll: compareAll,
    deltaDeg: deltaDeg,
    fmtDelta: fmtDelta,
    BODY_LABELS: BODY_LABELS
  };
})();
