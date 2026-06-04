#!/bin/bash
# Idempotent Keycloak setup for realm fitness-app.
set -e

KC_PUBLIC_URL="${KC_PUBLIC_URL:-http://localhost:8181}"
KC_ADMIN_URL="${KC_ADMIN_URL:-http://keycloak:8080}"
KC_ADMIN_USER="${KC_ADMIN_USER:-admin}"
KC_ADMIN_PASSWORD="${KC_ADMIN_PASSWORD:-admin}"

kcadm() {
  if [ "${KC_USE_DOCKER_EXEC}" = "true" ]; then
    docker exec keycloak /opt/keycloak/bin/kcadm.sh "$@"
  else
    /opt/keycloak/bin/kcadm.sh "$@"
  fi
}

echo "==> Waiting for Keycloak admin API..."
for i in $(seq 1 30); do
  if kcadm config credentials \
    --server "${KC_ADMIN_URL}" \
    --realm master \
    --user "${KC_ADMIN_USER}" \
    --password "${KC_ADMIN_PASSWORD}" 2>/dev/null; then
    break
  fi
  sleep 2
done

kcadm config credentials \
  --server "${KC_ADMIN_URL}" \
  --realm master \
  --user "${KC_ADMIN_USER}" \
  --password "${KC_ADMIN_PASSWORD}"

if kcadm get realms/fitness-app >/dev/null 2>&1; then
  echo "==> Realm fitness-app already exists."
else
  echo "==> Creating realm fitness-app..."
  kcadm create realms -s realm=fitness-app -s enabled=true
fi

CLIENT_ID=$(kcadm get clients -r fitness-app -q clientId=pkce-client \
  --fields id --format csv --noquotes 2>/dev/null | tail -n 1)
if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" = "id" ]; then
  echo "==> Creating client pkce-client..."
  kcadm create clients -r fitness-app \
    -s clientId=pkce-client \
    -s enabled=true \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=true \
    -s 'redirectUris=["http://localhost:5173/*","http://localhost:5173"]' \
    -s 'webOrigins=["+","http://localhost:5173"]'
else
  echo "==> Updating client pkce-client..."
  kcadm update "clients/${CLIENT_ID}" -r fitness-app \
    -s enabled=true \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=true \
    -s 'redirectUris=["http://localhost:5173/*","http://localhost:5173"]' \
    -s 'webOrigins=["+","http://localhost:5173"]'
fi

create_user() {
  local username=$1
  local password=$2
  local email=$3
  local count
  count=$(kcadm get users -r fitness-app -q username="$username" \
    --fields username --format csv --noquotes 2>/dev/null | grep -c "^${username}$" || true)
  if [ "$count" -ge 1 ]; then
    echo "    User ${username} exists."
  else
    echo "    Creating user ${username}..."
    kcadm create users -r fitness-app \
      -s username="$username" \
      -s enabled=true \
      -s email="$email" \
      -s emailVerified=true
  fi
  kcadm set-password -r fitness-app \
    --username "$username" --new-password "$password" --temporary=false
}

echo "==> Ensuring users exist..."
create_user "user1" "user1" "user1@example.com"
create_user "user" "password" "user@example.com"

if kcadm get realms/fitness-app >/dev/null 2>&1; then
  echo "==> Done. Open ${KC_PUBLIC_URL%/}/realms/fitness-app and login with user1 / user1"
else
  echo "==> Failed: fitness-app realm is missing."
  exit 1
fi
