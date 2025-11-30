// App Fastify : routes principales et documentation Swagger.
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import securityPlugin from './plugins/security';
import { config } from './config/config';
import { registerAuthRoutes } from './modules/auth/auth.controller';
import { registerMediaRoutes } from './modules/media/media.controller';
import { registerAuditRoutes } from './modules/audit/audit.controller';
import { registerAccessRoutes } from './modules/access/access.controller';

export async function buildApp() {
  const app = Fastify({ logger: true });

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
  await app.register(jwt, { secret: config.jwtSecret });
  await app.register(securityPlugin);

  app.decorate('authenticate', async (request: any, reply: any) => {
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
