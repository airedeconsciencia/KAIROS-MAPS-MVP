#!/usr/bin/env bash
# Kairos Maps — Export Shadow Analytics JSON (7.8b)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/tmp"
OUT_FILE="$OUT_DIR/shadow-analytics-f7.8b.json"

CATALOG="$ROOT/src/content/cities-catalog.js"
ARCHETYPES="$ROOT/src/content/city-identity-archetypes.js"
DIMENSIONS="$ROOT/src/content/identity-dimensions.js"
PROFILE="$ROOT/src/content/identity-modulation-profile.js"
INDEX="$ROOT/src/content/city-identity-index.js"
EDITORIAL="$ROOT/src/services/editorial-family-resolver.js"
MODULATION="$ROOT/src/services/identity-modulation-service.js"
SHADOW="$ROOT/src/services/identity-shadow-runtime-service.js"
COMPARISON="$ROOT/src/services/shadow-comparison-service.js"
ANALYTICS="$ROOT/src/services/shadow-analytics-service.js"

for f in "$CATALOG" "$ARCHETYPES" "$DIMENSIONS" "$PROFILE" "$INDEX" "$EDITORIAL" \
  "$MODULATION" "$SHADOW" "$COMPARISON" "$ANALYTICS"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: No se encuentra: $f"
    exit 1
  fi
done

mkdir -p "$OUT_DIR"

export CATALOG ARCHETYPES DIMENSIONS PROFILE INDEX EDITORIAL MODULATION SHADOW COMPARISON ANALYTICS OUT_FILE

node <<'NODE'
const fs = require('fs');
const vm = require('vm');

const ctx = { window: {}, console: console };
vm.createContext(ctx);

function load(path) {
  vm.runInContext(fs.readFileSync(path, 'utf8'), ctx, { filename: path });
}

[
  process.env.CATALOG,
  process.env.DIMENSIONS,
  process.env.ARCHETYPES,
  process.env.PROFILE,
  process.env.INDEX,
  process.env.EDITORIAL,
  process.env.MODULATION,
  process.env.SHADOW,
  process.env.COMPARISON,
  process.env.ANALYTICS
].forEach(load);

const Analytics = ctx.window.KairosShadowAnalytics;
const Archetypes = ctx.window.KairosCityIdentityArchetypes;
const Catalog = ctx.window.KairosCitiesCatalog;

const datasetAnalytics = Analytics.computeDatasetAnalytics();
const archetypeStatistics = Analytics.computeArchetypeStatistics();
const dimensionStatistics = Analytics.computeDimensionStatistics();
const confidenceStatistics = Analytics.computeConfidenceStatistics();

const countryCount = new Set(Catalog.CITIES.map(function (c) { return c.country; })).size;

const payload = {
  generatedAt: new Date().toISOString(),
  schemaVersion: '7.8b-0.1',
  cityCount: datasetAnalytics.datasetSize,
  countryCount: countryCount,
  archetypeCount: Archetypes.ARCHETYPE_SLUGS.length,
  dimensionCount: Analytics.DIMENSION_SLUGS.length,
  reviewRequiredCount: datasetAnalytics.reviewRequired.count,
  neutralFallbackRate: datasetAnalytics.neutralFallbackRate,
  datasetAnalytics: datasetAnalytics,
  archetypeStatistics: archetypeStatistics,
  dimensionStatistics: dimensionStatistics,
  confidenceStatistics: confidenceStatistics
};

fs.writeFileSync(process.env.OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('Exported:', process.env.OUT_FILE);
console.log('cityCount:', payload.cityCount);
console.log('schemaVersion:', payload.schemaVersion);
NODE
