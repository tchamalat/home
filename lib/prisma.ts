import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from './generated/prisma/client'

// Pattern Singleton pour éviter d'épuiser les connexions en dev (hot-reload)
// Voir: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }
  
  // Créer un pool de connexions pg
  const pool = new Pool({ connectionString })
  globalForPrisma.pool = pool
  
  // Créer l'adapter avec le pool
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// En dev, on stocke le client dans une variable globale pour survivre au hot-reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
