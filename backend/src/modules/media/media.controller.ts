// Routes de gestion des médias : upload sécurisé et consultation contrôlée.
import { FastifyInstance } from 'fastify';
import { MediaService } from './media.service';
import { AuditService } from '../audit/audit.service';
import { RegistryService } from '../../services/web3/registry.service';
import { config } from '../../config/config';

export async function registerMediaRoutes(app: FastifyInstance) {
  const service = new MediaService();
  const audit = new AuditService();
  const registry = new RegistryService();

  app.post('/media/upload', {
    preValidation: [app.authenticate],
    schema: {
      summary: 'Upload sécurisé d’un média',
      consumes: ['multipart/form-data'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const data = await request.file();
    if (!data) return reply.badRequest('file missing');
    const buffer = await data.toBuffer();
    const record = await service.handleUpload(
      {
        originalname: data.filename,
        mimetype: data.mimetype,
        size: buffer.byteLength,
        buffer,
      },
      request.user.sub
    );
    await audit.log({ actor: request.user.sub, action: 'media.upload', resource: record.id, context: { filename: record.filename } });
    // Ancrage optionnel dans le registre Web3 (peut être désactivé en changeant l'adresse du registre).
    if (config.web3RegistryAddress && config.web3RegistryAddress !== '0x0000000000000000000000000000000000000000') {
      await registry
        .anchor({ mediaHash: `0x${record.checksum}`, metadataUri: record.storageUri || '' })
        .catch((err) => app.log.warn({ err }, 'web3 anchor skipped'));
    }
    return { id: record.id, filename: record.filename, size: record.size, checksum: record.checksum };
  });

  app.get('/media', {
    preValidation: [app.authenticate],
    schema: { summary: 'Liste les médias récents', security: [{ bearerAuth: [] }] },
  }, async (request) => {
    const { limit = 20 } = request.query as { limit?: number };
    const records = await service.listRecent(Number(limit));
    return { items: records, total: records.length };
  });

  app.get('/media/:id', {
    preValidation: [app.authenticate],
    schema: { summary: 'Récupère les métadonnées d’un média', security: [{ bearerAuth: [] }] },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const record = await service.getById(id);
    if (!record) return reply.notFound();
    return record;
  });
}
