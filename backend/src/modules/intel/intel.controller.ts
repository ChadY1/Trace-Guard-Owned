// Routes de renseignement légal : IMINT, OSINT et signaux géopolitiques.
import { FastifyInstance } from 'fastify';
import { IntelService } from './intel.service';

export async function registerIntelRoutes(app: FastifyInstance) {
  const service = new IntelService();

  app.get('/intel/overview', {
    preValidation: [app.authenticate],
    schema: {
      summary: 'Vue synthétique IMINT/OSINT/géopolitique (sources autorisées uniquement)',
      security: [{ bearerAuth: [] }],
    },
  }, async () => service.getOverview());

  app.get('/intel/imint/sources', {
    preValidation: [app.authenticate],
    schema: { summary: 'Sources IMINT autorisées en suivi', security: [{ bearerAuth: [] }] },
  }, async () => service.listImintSources());

  app.get('/intel/osint/streams', {
    preValidation: [app.authenticate],
    schema: { summary: 'Flux OSINT surveillés légalement', security: [{ bearerAuth: [] }] },
  }, async () => service.listOsintStreams());

  app.get('/intel/geopolitics/signals', {
    preValidation: [app.authenticate],
    schema: { summary: 'Signaux géopolitiques agrégés', security: [{ bearerAuth: [] }] },
  }, async () => service.listGeopoliticalSignals());
}
