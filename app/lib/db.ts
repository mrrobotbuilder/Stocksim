import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const dbFile = process.env.DATABASE_URL?.replace('file:', '') ?? './prisma/dev.db'
  const url = path.isAbsolute(dbFile) ? dbFile : path.join(process.cwd(), dbFile)
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
