// src/backend/lib/prisma.ts

import { PrismaClient } from '@prisma/client';
// 1. Importar o adapter do Prisma e o driver peer
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 2. Obter a URL do .env ou do ambiente do Render
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    // Isso garantirá que o erro seja mais claro
    throw new Error("DATABASE_URL must be defined for Prisma Client to connect.");
}

// 3. Criar o Pool/Client do driver peer
const pool = new Pool({ connectionString });

// 4. Criar o Adapter
const adapter = new PrismaPg(pool);

// 5. Instanciar o Prisma Client usando o adapter
export const prisma = new PrismaClient({ adapter });