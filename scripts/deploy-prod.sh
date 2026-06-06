#!/usr/bin/env bash
# Kairos Maps — Deploy PRODUCCIÓN (kairos-maps-mvp.web.app)
# Requiere confirmación explícita DEPLOY-PROD.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Deploy PRODUCCIÓN"
echo " Destino: https://kairos-maps-mvp.web.app"
echo "══════════════════════════════════════════════════════════"
echo ""

read -r -p "¿Golden gate PASS y aprobación Roberto? (escribe DEPLOY-PROD): " ans
if [[ "$ans" != "DEPLOY-PROD" ]]; then
  echo "Cancelado."
  exit 1
fi

echo ""
echo "Sync src/ → dist/ (excluye .DS_Store y dev/)"
rsync -a --delete \
  --exclude '.DS_Store' \
  --exclude 'dev/' \
  "$ROOT/src/" "$ROOT/dist/"

echo ""
echo "Deploy SOLO hosting:prod"
firebase deploy --only hosting:prod

echo ""
echo "OK: https://kairos-maps-mvp.web.app"
