#!/usr/bin/env bash

# Prevent db push on shared or production environments
if [[ "$DATABASE_URL" == *"gofast"* ]] && [[ "$1" == "db" && "$2" == "push" ]]; then
  echo "❌ ERROR: 'prisma db push' is blocked for GoFast/F3 Invigorate environments."
  exit 1
fi

# Block any use of --accept-data-loss globally
if [[ "$@" == *"--accept-data-loss"* ]]; then
  echo "❌ ERROR: --accept-data-loss is forbidden in this repo."
  exit 1
fi

# Environment guard: Check if schema is locked
if [[ "$PRISMA_SCHEMA_LOCKED" == "true" ]] && [[ "$1" == "db" && "$2" == "push" ]]; then
  echo "❌ Schema is locked. db push is disabled."
  exit 1
fi

# Forward all other prisma commands
npx prisma "$@"

