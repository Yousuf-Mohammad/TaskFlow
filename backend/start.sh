#!/bin/sh
echo "Running database seed..."
node dist/database/seed.js
echo "Starting NestJS API..."
exec node dist/main.js
