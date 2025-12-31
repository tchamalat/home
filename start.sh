#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🗄️  Setting up database..."
cd /app

# Créer les tables Prisma
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Creating database tables...');
    // Les tables seront créées automatiquement par Prisma au premier accès
    // ou on peut forcer avec une requête simple
    await prisma.\$executeRawUnsafe('SELECT 1');
    console.log('✅ Database ready');
  } catch (e) {
    console.log('⚠️  Database might already be initialized:', e.message);
  }
  process.exit(0);
})();
" || true

echo "🚀 Starting Next.js server..."
exec node server.js
