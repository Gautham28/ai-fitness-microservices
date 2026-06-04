#!/bin/bash
# Starts services in order so config-server is ready before microservices boot.
set -e
cd "$(dirname "$0")/.."

echo "==> Starting infrastructure..."
docker compose up -d postgres mongodb rabbitmq keycloak config-server

echo "==> Waiting for config-server..."
for i in $(seq 1 40); do
  if curl -sf http://localhost:8888/user-service/default >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "==> Starting eureka..."
docker compose up -d eureka-server
sleep 15

echo "==> Starting microservices..."
docker compose up -d user-service activity-service ai-service
echo "==> Waiting for microservices (up to 90s)..."
for i in $(seq 1 45); do
  US=$(docker inspect -f '{{.State.Status}}' user-service 2>/dev/null || echo missing)
  AS=$(docker inspect -f '{{.State.Status}}' activity-service 2>/dev/null || echo missing)
  if [ "$US" = "running" ] && [ "$AS" = "running" ]; then
    break
  fi
  sleep 2
done

echo "==> Starting gateway, Keycloak setup, frontend..."
docker compose up -d api-gateway
docker compose up keycloak-setup 2>/dev/null || true
docker compose up -d frontend

echo "==> Status:"
docker compose ps

echo ""
echo "Open http://localhost:5173 — login: user1 / user1"
echo "If a service shows Exited, run: docker compose restart user-service activity-service api-gateway"
