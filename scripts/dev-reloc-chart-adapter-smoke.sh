#!/usr/bin/env bash
# Kairos Maps — Smoke Reloc Chart Adapter (Fase 3.7b.6)
# Node: estructura + mapping sin WASM.
# Real: fixture firmada desde lab (?capture=1) o browser smoke manual.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADAPTER="$ROOT/src/services/reloc-chart-adapter.js"
FIXTURE="$ROOT/src/dev/fixtures/relocation-roberto-lisboa-real.json"
RELOC_PROFILE="$ROOT/src/services/relocation-profile-service.js"
RELOC_COMP="$ROOT/src/services/reloc-composition-service.js"
RELOC_LITE="$ROOT/src/content/reloc-lite.js"
GOAL_SIGNAL="$ROOT/src/content/goal-signal.js"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Reloc chart adapter smoke"
echo "══════════════════════════════════════════════════════════"
echo ""

for f in "$ADAPTER" "$RELOC_PROFILE" "$RELOC_COMP" "$RELOC_LITE" "$GOAL_SIGNAL"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

export ROOT ADAPTER FIXTURE RELOC_PROFILE RELOC_COMP RELOC_LITE GOAL_SIGNAL

node <<'NODE'
const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

vm.runInContext(fs.readFileSync(process.env.ADAPTER, 'utf8'), ctx, { filename: process.env.ADAPTER });

const Adapter = ctx.window.KairosRelocChartAdapter;
if (!Adapter) throw new Error('KairosRelocChartAdapter no definido');

let allPass = true;

function assert(label, ok, detail) {
  console.log('─'.repeat(60));
  console.log(label);
  console.log('RESULT:', ok ? 'PASS' : 'FAIL');
  if (detail) console.log(' ', detail);
  if (!ok) allPass = false;
}

assert('1. adapter existe', !!Adapter.buildRelocationInputFromChart, 'schema=' + Adapter.SCHEMA_VERSION);

assert(
  "2. signSlug('Géminis') → gemini",
  Adapter.signSlug('Géminis') === 'gemini',
  'got=' + Adapter.signSlug('Géminis')
);

var mockChart = {
  angles: {
    ASC: { sign: 'Libra', longitude: 12.5, deg: 12, min: 30 },
    MC: { sign: 'Capricornio', longitude: 98.2, deg: 8, min: 12 },
    DC: { sign: 'Aries', longitude: 192.5, deg: 12, min: 30 },
    IC: { sign: 'Cáncer', longitude: 278.2, deg: 8, min: 12 }
  }
};

var mapped = Adapter.anglesFromChart(mockChart);
assert(
  '3. anglesFromChart mapea AC/MC/DC/IC + slugs',
  mapped && mapped.AC.slug === 'libra' && mapped.MC.slug === 'capricorn' &&
    mapped.DC.slug === 'aries' && mapped.IC.slug === 'cancer',
  JSON.stringify({
    AC: mapped && mapped.AC.slug,
    MC: mapped && mapped.MC.slug,
    DC: mapped && mapped.DC.slug,
    IC: mapped && mapped.IC.slug
  })
);

var opp = Adapter.verifyAngleOppositions(mapped, 1.5);
assert(
  '4. AC↔DC y MC↔IC opuestos (mock chart)',
  opp.acDc && opp.mcIc,
  JSON.stringify(opp)
);

Adapter.buildRelocationInputFromChart({
  birthData: { date: '1973-05-29', time: '07:30', timezone: 'Europe/Madrid', lat: 39.88, lon: 4.26 },
  targetLocation: { name: 'Lisboa', lat: 38.72, lon: -9.14 }
}).then(function (r) {
  assert(
    '5. sin chart-service → chart_service_unavailable',
    r.ok === false && r.reason === 'chart_service_unavailable',
    'reason=' + r.reason
  );

  [
    process.env.GOAL_SIGNAL,
    process.env.RELOC_LITE,
    process.env.RELOC_PROFILE,
    process.env.RELOC_COMP
  ].forEach(function (path) {
    vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
  });

  var fixturePath = process.env.FIXTURE;
  if (!fs.existsSync(fixturePath)) {
    assert(
      '6. fixture real (opcional)',
      true,
      'SKIP — generar: abrir dev/relocation-preview.html?capture=1 en browser con WASM'
    );
  } else {
    var fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    var angles = fixture.relocatedAngles;
    var fOpp = Adapter.verifyAngleOppositions(angles, 2);
    assert('6a. fixture AC/DC opuestos', fOpp.acDc, JSON.stringify(fOpp));
    assert('6b. fixture MC/IC opuestos', fOpp.mcIc, '');
    assert(
      '6c. slugs válidos en fixture',
      ['AC', 'MC', 'IC', 'DC'].every(function (k) {
        return angles[k] && angles[k].signSlug && angles[k].signSlug.length > 2;
      }),
      JSON.stringify(angles)
    );

    var GS = ctx.window.KairosGoalSignal;
    var profileInput = Adapter.buildProfileInputFromAdapter({
      ok: true,
      natalChart: fixture.natalChart || { sun: 'gemini', moon: 'aries', asc: 'cancer', angles: {} },
      targetLocation: fixture.targetLocation,
      relocatedAngles: angles,
      relocatedHouses: [],
      goalContext: GS.buildContext({ mainGoal: 'amor' })
    });

    var natalWithAngles = fixture.natalChart || {};
    if (!natalWithAngles.angles) {
      natalWithAngles = Object.assign({}, natalWithAngles, {
        angles: {
          AC: { slug: 'cancer' },
          MC: { slug: 'pisces' },
          IC: { slug: 'virgo' },
          DC: { slug: 'capricorn' }
        }
      });
    }
    profileInput.natalChart = natalWithAngles;

    var profile = ctx.window.KairosRelocationProfile.buildRelocationProfile(profileInput);
    var fids = profile.sourceIds.fragmentIds || [];
    var fmeta = profile.sourceIds.fragmentMeta || [];
    var typeByAngle = {};
    fmeta.forEach(function (m) { typeByAngle[m.angleKey] = m.fragmentType; });

    assert(
      '7. buildRelocationProfile() Roberto real → 4 fragmentIds',
      profile.ok === true && profile.profileType === 'RELOCATION' && fids.length === 4,
      'fragmentIds=' + JSON.stringify(fids)
    );
    assert(
      '7b. AC/DC delta · MC/IC presence',
      fids.indexOf('RELOC_ASC_TO_AIR') !== -1 &&
        fids.indexOf('RELOC_DC_TO_FIRE') !== -1 &&
        fids.indexOf('RELOC_MC_PRESENT_WATER') !== -1 &&
        fids.indexOf('RELOC_IC_PRESENT_EARTH') !== -1 &&
        typeByAngle.AC === 'delta' && typeByAngle.DC === 'delta' &&
        typeByAngle.MC === 'presence' && typeByAngle.IC === 'presence',
      'types=' + JSON.stringify(typeByAngle)
    );

    var composed = ctx.window.KairosRelocComposition.composeRelocationReading({
      relocationProfile: profile,
      goalContext: profileInput.goalContext
    });
    var minC = ctx.window.KairosRelocComposition.MIN_CHARS;
    var maxC = ctx.window.KairosRelocComposition.MAX_CHARS;
    var cc = composed.meta && composed.meta.charCount;
    assert(
      '8. composeRelocationReading() ok · charCount 500–850 · roleCoverage 100%',
      composed.ok === true &&
        cc >= minC && cc <= maxC &&
        composed.meta.roleCoveragePercent === 100 &&
        (composed.meta.omittedRoles || []).length === 0,
      'charCount=' + cc + ' · includedRoles=' + JSON.stringify(composed.meta.includedRoles)
    );
  }

  ['dev-relocation-profile-smoke.sh', 'dev-reloc-composition-smoke.sh', 'dev-reloc-lite-smoke.sh'].forEach(function (script) {
    try {
      execSync(process.env.ROOT + '/scripts/' + script, { stdio: 'pipe', encoding: 'utf8' });
      assert(script, true, 'OVERALL: PASS');
    } catch (e) {
      assert(script, false, (e.stdout || e.message || '').slice(0, 200));
    }
  });

  console.log('');
  console.log('═'.repeat(60));
  console.log('Browser real smoke (manual):');
  console.log('  cd src && python3 -m http.server 8091');
  console.log('  open http://localhost:8091/dev/relocation-preview.html?dataSource=real&capture=1');
  console.log('  guardar #capture-out → src/dev/fixtures/relocation-roberto-lisboa-real.json');
  console.log('═'.repeat(60));
  console.log('OVERALL:', allPass ? 'PASS' : 'FAIL');
  console.log('═'.repeat(60));
  console.log('');

  process.exit(allPass ? 0 : 1);
}).catch(function (e) {
  console.error(e);
  process.exit(1);
});
NODE
