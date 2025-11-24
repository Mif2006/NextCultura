#!/bin/bash
set -e

echo "Building with webpack (avoiding Turbopack WASM issues)..."
npx next build --webpack || NODE_OPTIONS="--max-old-space-size=4096" npx next build --webpack
