#!/usr/bin/env bash
set -e

# Production startup script for ECS/AWS
# Use environment variables for database connection

if [ -z "$DATABASE_HOST" ]; then
  echo "ERROR: DATABASE_HOST environment variable is not set"
  exit 1
fi

if [ -z "$DATABASE_PORT" ]; then
  DATABASE_PORT=5432
fi

echo "Waiting for database at $DATABASE_HOST:$DATABASE_PORT"
/opt/wait-for-it.sh "$DATABASE_HOST:$DATABASE_PORT" --timeout=60 --strict -- echo "Database is ready"

echo "Running database migrations..."
npm run migration:run

echo "Running database seeds..."
npm run seed:run:relational

echo "Starting application..."
npm run start:prod