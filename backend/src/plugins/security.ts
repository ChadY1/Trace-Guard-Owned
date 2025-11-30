// Plugin Fastify pour appliquer les protections de base (headers, rate limiting, validation JWT).
import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
import { config } from '../config/config';
import cors from '@fastify/cors';

export default fp(async function security(fastify: FastifyInstance) {
  await fastify.register(sensible);
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https:'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
  });

  await fastify.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    allowList: [],
  });

  await fastify.register(cors, {
    origin: config.allowOrigins.length ? config.allowOrigins : true,
    credentials: true,
  });

  fastify.addHook('onRequest', async (request, reply) => {
    if (config.allowOrigins.length && request.headers.origin && !config.allowOrigins.includes(request.headers.origin)) {
      reply.code(403).send({ message: 'origin not allowed' });
    }
  });
});
