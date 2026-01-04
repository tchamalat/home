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

// Pendant le build Docker, on ne crée pas le client (pas de DB disponible)
// Le client sera créé au runtime quand DATABASE_URL sera disponible
function getPrismaClient(): PrismaClient {
  if (process.env.DOCKER_BUILD === 'true') {
    // Retourne un proxy qui lance une erreur si utilisé pendant le build
    // En pratique, les routes API ne sont pas appelées pendant le build
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('Prisma client cannot be used during Docker build')
      }
    })
  }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()

// En dev, on stocke le client dans une variable globale pour survivre au hot-reload
if (process.env.NODE_ENV !== 'production' && process.env.DOCKER_BUILD !== 'true') {
  globalForPrisma.prisma = prisma
}

export default prisma
