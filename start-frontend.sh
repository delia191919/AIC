#!/bin/sh
podman run --rm -p 8081:80 \
  -e BACKEND_HOST="${BACKEND_HOST:-host.containers.internal}" \
  -e BACKEND_PORT="${BACKEND_PORT:-8080}" \
  aic-frontend
