#!/bin/bash
# Run Keycloak setup from your Mac (when not using the compose init container).
set -e
export KC_PUBLIC_URL="http://localhost:8181"
export KC_ADMIN_URL="http://localhost:8080"
export KC_USE_DOCKER_EXEC="true"
exec "$(dirname "$0")/scripts/keycloak-init.sh"
