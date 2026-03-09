#!/bin/bash

# Default values if arguments are missing
TARGET_URL=${1:-"http://host.docker.internal:3000"}

echo "-------------------------------------------------------"
echo "🚀 PRODUCTS API LOAD TEST"
echo "Target:   $TARGET_URL"
echo "Stage 1:  30s @ 20 requests/second"
echo "Stage 2:  1m @ 100 requests/second"
echo "-------------------------------------------------------"

# Run k6 via Docker
# -i: Interactive
# --rm: Clean up container after run
# -v: Mount tests/load directory to /scripts in container
# -e: Pass the Target URL as an environment variable
docker run --rm -i \
  -v "$(pwd)/tests/load:/scripts" \
  -e BASE_URL="$TARGET_URL" \
  grafana/k6 run /scripts/products-load-test.js

echo "-------------------------------------------------------"
echo "✅ Test execution finished."
echo "-------------------------------------------------------"
