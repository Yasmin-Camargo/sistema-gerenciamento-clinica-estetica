#!/bin/bash

set -e

echo "⚠️  WARNING: This will erase all database tables!"
read -p "Are you sure you want to continue? (y/n): " confirm
if [[ "$confirm" != "y" ]]; then
  echo "❌ Operation cancelled."
  exit 1
fi

echo "🧹 Dropping all tables..."
./mvnw liquibase:dropAll \
  -Dliquibase.url=jdbc:postgresql://localhost:5433/beauty-clinic-system-api \
  -Dliquibase.username=${DB_USERNAME} \
  -Dliquibase.password=${DB_PASSWORD} \
  -Dliquibase.changeLogFile=src/main/resources/db/changelog/db.changelog-master.yaml \
  -Dliquibase.driver=org.postgresql.Driver


echo "✅ Database reset complete."
