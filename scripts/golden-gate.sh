#!/usr/bin/env bash
# Kairos Maps — Golden gate local (Fase 3.1e)
# Guard manual pre-deploy. Sin Puppeteer/Playwright. No toca dist/ ni Firebase.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src"
GOLDEN_HTML="$SRC/dev/golden/golden-test.html"
GOLDEN_JSON="$SRC/dev/golden/golden-charts.json"
PORT="${KAIROS_GATE_PORT:-8099}"
MAX_PORT_TRIES=10

if [[ ! -f "$GOLDEN_HTML" ]]; then
  echo "ERROR: No se encuentra golden-test.html en:"
  echo "  $GOLDEN_HTML"
  exit 1
fi

if [[ ! -f "$GOLDEN_JSON" ]]; then
  echo "ERROR: No se encuentra golden-charts.json en:"
  echo "  $GOLDEN_JSON"
  exit 1
fi

pick_port() {
  local p="$PORT"
  local tries=0
  while lsof -nP -iTCP:"$p" -sTCP:LISTEN >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [[ "$tries" -ge "$MAX_PORT_TRIES" ]]; then
      echo "ERROR: No hay puerto libre entre $PORT y $((PORT + MAX_PORT_TRIES - 1))."
      exit 1
    fi
    p=$((p + 1))
  done
  echo "$p"
}

PORT="$(pick_port)"

echo ""
echo "══════════════════════════════════════════════════════════"
echo " KAIROS MAPS — Golden gate local (manual)"
echo "══════════════════════════════════════════════════════════"
echo ""
echo "Raíz repo:  $ROOT"
echo "Servir desde: $SRC"
echo "Puerto:     $PORT"
echo ""
echo "Comprobaciones previas: OK"
echo "  • dev/golden/golden-test.html"
echo "  • dev/golden/golden-charts.json"
echo ""
echo "Iniciando servidor HTTP…"
echo ""

cd "$SRC"
python3 -m http.server "$PORT" &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  echo ""
  echo "Servidor detenido (PID $SERVER_PID)."
}
trap cleanup EXIT INT TERM

GOLDEN_URL="http://localhost:${PORT}/dev/golden/golden-test.html"

cat <<EOF
Servidor activo (PID $SERVER_PID).

──────────────────────────────────────────────────────────
1. Abre en el navegador (desktop):

   $GOLDEN_URL

2. Pulsa «Ejecutar golden tests».

3. Verifica manualmente:

   • Badge / resumen: PASS (no FAIL)
   • 75/75 comprobaciones PASS (G1 + G2 + G3)
   • En consola del navegador (opcional):

       window.__goldenTestResult.allPass === true

   • 0 FAIL en la tabla de resultados

4. Regla pre-deploy:

   NO sincronizar dist/ ni desplegar si golden ≠ 75/75 PASS.

──────────────────────────────────────────────────────────
Otras comprobaciones recomendadas (manual, misma sesión):

   • index.html        — mapa OK; panel natal tras «Calcular mi mapa»
   • dev/natal-view.html  — carta G1 correcta
   • dev/natal-test.html  — TEST PASSED en pantalla

   Cold start: sin descarga de swisseph.data / swisseph.wasm
   hasta el primer cálculo natal.

──────────────────────────────────────────────────────────
Cerrar servidor:

   • Pulsa Enter en esta terminal, o
   • Ctrl+C

EOF

read -r -p "Pulsa Enter cuando hayas terminado la verificación… " _

echo "Cerrando golden gate…"
