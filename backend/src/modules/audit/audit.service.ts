// Service d'audit : centralise la journalisation des actions sensibles.
import { pool } from '../../db/client';

export interface AuditEvent {
  actor: string;
  action: string;
  resource: string;
  timestamp?: string;
  context?: Record<string, unknown>;
}

export class AuditService {
  async log(event: AuditEvent): Promise<AuditEvent> {
    const timestamp = event.timestamp || new Date().toISOString();
    await pool.query(
      'INSERT INTO audit_logs (actor, action, resource, created_at, metadata) VALUES ($1, $2, $3, $4, $5)',
      [event.actor, event.action, event.resource, timestamp, event.context || {}]
    );
    return { ...event, timestamp };
  }

  async list(limit = 50) {
    const { rows } = await pool.query('SELECT actor, action, resource, created_at AS timestamp, metadata FROM audit_logs ORDER BY created_at DESC LIMIT $1', [limit]);
    return rows;
  }
}
