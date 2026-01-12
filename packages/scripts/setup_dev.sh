#!/bin/bash
set -e

SCRIPT_DIR="$(cd "${BASH_SOURCE[0]%/*}" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"


echo "=========================================================================="
echo "============== INSTALLING FLEETFLOW DEVELOPMENT ENVIRONMENT =============="
echo "=========================================================================="
# Python to TypeScript Type Generation
npm install -g json-schema-to-typescript

(cd frontend && npm install)

## TODO: Add python .venv setups for emulator and backend.

echo "=========================================================================="
echo "============ FLEETFLOW DEVELOPMENT ENVIRONMENT SETUP COMPLETE ============"
echo "=========================================================================="