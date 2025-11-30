// Routes d'audit : enregistrement et consultation sommaire des événements.
import { FastifyInstance } from 'fastify';
import { AuditService } from './audit.service';

export async function registerAuditRoutes(app: FastifyInstance) {
  const service = new AuditService();

  app.post<{ Body: { action: string; resource: string; context?: Record<string, unknown> } }>('/audit', {
    preValidation: [app.authenticate],
    schema: { summary: 'Journalise une action critique', security: [{ bearerAuth: [] }] },
  }, async (request) => {
    const event = await service.log({
      actor: request.user.sub,
      action: request.body.action,
      resource: request.body.resource,
      timestamp: new Date().toISOString(),
      context: request.body.context,
    });
    return event;
  });

  app.get('/audit', {
    preValidation: [app.authenticate],
    schema: { summary: 'Consulte les derniers événements d’audit', security: [{ bearerAuth: [] }] },
  }, async () => service.list());
}
