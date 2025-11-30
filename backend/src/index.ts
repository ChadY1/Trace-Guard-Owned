// Entrée principale : démarre l'application Fastify avec configuration sécurisée.
import { buildApp } from './app';
import { config } from './config/config';
import { migrateBaseSchema } from './db/client';

async function start() {
  await migrateBaseSchema();
  const app = await buildApp();
  await app.listen({ port: config.port, host: '0.0.0.0' });
  app.log.info(`TraceGuard API listening on port ${config.port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
