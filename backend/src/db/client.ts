// Client PostgreSQL léger pour TraceGuard.
// Utilise un pool partagé et laisse la gestion TLS et IAM à l'infrastructure.
import { Pool } from 'pg';
import { config } from '../config/config';

export const pool = new Pool({ connectionString: config.postgresUrl });

export async function migrateBaseSchema() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      metadata JSONB DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS media_records (
      id UUID PRIMARY KEY,
      filename TEXT NOT NULL,
      size BIGINT NOT NULL,
      mime_type TEXT NOT NULL,
      checksum TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_by TEXT NOT NULL,
      storage_uri TEXT,
      classification TEXT DEFAULT 'unclassified'
    );
  `);
}
