// Routes d'authentification : login et introspection simple.
import { FastifyInstance } from 'fastify';
import { AuthService } from './auth.service';
import { loginSchema } from './auth.schema';

export async function registerAuthRoutes(app: FastifyInstance) {
  const service = new AuthService(app);

  app.post('/auth/login', {
    schema: {
      summary: 'Authentification de base (à remplacer par OIDC)',
      body: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' } }, required: ['username', 'password'] },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            expiresIn: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest('invalid payload');
    const result = await service.login(parsed.data);
    return result;
  });

  app.get('/auth/me', {
    preValidation: [app.authenticate],
    schema: { summary: 'Retourne les claims du token courant', security: [{ bearerAuth: [] }] },
  }, async (request: any) => ({ subject: request.user.sub, roles: request.user.roles }));
}
