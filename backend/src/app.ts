// App Fastify : routes principales et documentation Swagger.
import { IncomingMessage, Server, ServerResponse } from 'http';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import compress from '@fastify/compress';
import securityPlugin from './plugins/security';
import { config } from './config/config';
import { registerAuthRoutes } from './modules/auth/auth.controller';
import { registerMediaRoutes } from './modules/media/media.controller';
import { registerAuditRoutes } from './modules/audit/audit.controller';
import { registerAccessRoutes } from './modules/access/access.controller';

export async function buildApp(): Promise<FastifyInstance> {
  const loggerOptions = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true, translateTime: true } },
  } as const;

  const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: loggerOptions,
    trustProxy: true,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'TraceGuard API',
        version: '0.1.0',
        description: 'API sécurisée pour la gouvernance multimédia TraceGuard',
      },
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs', uiConfig: { docExpansion: 'list' } });

  await app.register(multipart);
  await app.register(compress, { global: true, encodings: ['gzip', 'deflate', 'br'] });
  await app.register(jwt, { secret: config.jwtSecret });
  await app.register(securityPlugin);

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  await registerAuthRoutes(app);
  await registerMediaRoutes(app);
  await registerAuditRoutes(app);
  await registerAccessRoutes(app);

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
