// Routes de gouvernance d'accès : ébauche RBAC/ABAC pour TraceGuard.
import { FastifyInstance } from 'fastify';

const mockPolicies = [
  { id: 'policy-default', subject: 'admin', resource: '*', effect: 'allow', conditions: ['mfa_required'] },
];

export async function registerAccessRoutes(app: FastifyInstance) {
  app.get('/access/policies', {
    preValidation: [app.authenticate],
    schema: { summary: 'Liste les politiques d’accès (exemple)', security: [{ bearerAuth: [] }] },
  }, async () => mockPolicies);
}
