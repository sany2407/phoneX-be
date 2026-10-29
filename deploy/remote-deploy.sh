#!/usr/bin/env bash
#
# Runs ON the EC2 instance. Pulls the branch, rebuilds the image and brings
# the stack back up. Invoked by GitHub Actions, or by hand:
#
#   ssh ubuntu@<host> 'bash -s' < deploy/remote-deploy.sh
#
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/phoneX-be}"
BRANCH="${BRANCH:-dev}"

cd "$APP_DIR"

if [ ! -f .env ]; then
  echo "!! $APP_DIR/.env is missing — copy deploy/env.production.example and fill it in." >&2
  exit 1
fi

echo "==> Fetching origin/$BRANCH"
git fetch --prune origin
git checkout -q -f "$BRANCH"
git reset -q --hard "origin/$BRANCH"

echo "==> Building and starting"
docker compose up -d --build --remove-orphans

echo "==> Pruning superseded images"
docker image prune -f >/dev/null

echo "==> Waiting for the API to report healthy"
for _ in $(seq 1 40); do
  if curl -fsS http://127.0.0.1:8080/api/v1/health >/dev/null 2>&1; then
    echo "✅ API is healthy"
    docker compose ps
    exit 0
  fi
  sleep 2
done

echo "❌ API did not become healthy within 80s" >&2
docker compose ps >&2
docker compose logs --tail=80 >&2
exit 1
