#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données
 * Crée les tables Prisma et démarre l'app
 */

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  try {
    console.log('🗄️ Initializing database schema...');
    
    // Attendre que PostgreSQL soit prêt
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Exécuter prisma db push
    await runCommand('node', [
      path.join(__dirname, '../node_modules/@prisma/client/runtime/index.js'),
      'db', 'push', '--skip-generate'
    ].join(' '));
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    console.log('⚠️ Continuing anyway - database might already exist');
  }

  // Démarrer l'app
  console.log('🚀 Starting application...');
  await runCommand('node', ['server.js']);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
