import { PrismaClient } from '../lib/generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

import { neonConfig, Pool, PoolConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool as PoolConfig);

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

// We add the adapter to the PrismaClient
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma