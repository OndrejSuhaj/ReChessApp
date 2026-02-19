import Fastify from 'fastify';
import cors from '@fastify/cors';
import prisma from './db/prisma';
import { authRoutes } from './routes/auth';
import { meRoutes } from './routes/me';

const PORT = parseInt(process.env.PORT || '3000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(cors, {
  origin: FRONTEND_URL,
});

// Declare request.user decorator (populated by authenticate preHandler)
fastify.decorateRequest('user', null);

// Auth routes
fastify.register(authRoutes);

// Self-service /me routes
fastify.register(meRoutes);

// Health check route with DB connectivity check
fastify.get('/health', async (request, reply) => {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    return { status: 'ok' };
  } catch (error) {
    fastify.log.error(error, 'Database connectivity check failed');
    reply.status(503);
    return { status: 'db_unavailable' };
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
