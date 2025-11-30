// Configuration centralisée (chargée via variables d'environnement) pour l'API TraceGuard.
import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  postgresUrl: process.env.POSTGRES_URL || 'postgres://traceguard:traceguard@localhost:5432/traceguard',
  allowOrigins: (process.env.ALLOW_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean),
};
