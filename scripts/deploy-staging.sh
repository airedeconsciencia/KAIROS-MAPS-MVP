#!/usr/bin/env bash
# Kairos Maps — Deploy STAGING only (kairos-maps-dev.web.app)
# Nunca despliega producción.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Deploy STAGING"
echo " Destino: https://kairos-maps-dev.web.app"
echo "══════════════════════════════════════════════════════════"
echo ""

echo "Sync src/ → dist/ (excluye .DS_Store y dev/)"
rsync -a --delete \
  --exclude '.DS_Store' \
  --exclude 'dev/' \
  "$ROOT/src/" "$ROOT/dist/"

echo ""
echo "Deploy SOLO hosting:staging"
firebase deploy --only hosting:staging

echo ""
echo "OK: https://kairos-maps-dev.web.app"
