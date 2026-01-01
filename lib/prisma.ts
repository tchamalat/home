import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/romantcham'
  );
};

const connectionString = getDatabaseUrl();
const pool = new Pool({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
