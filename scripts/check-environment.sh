#!/usr/bin/env bash
set -euo pipefail
echo "Jellyfin:"; command -v jellyfin >/dev/null && jellyfin --version || echo "not found"
echo ".NET SDKs:"; command -v dotnet >/dev/null && dotnet --list-sdks || echo "not found"
echo "Node:"; command -v node >/dev/null && node --version || echo "not found"
echo "npm:"; command -v npm >/dev/null && npm --version || echo "not found"
