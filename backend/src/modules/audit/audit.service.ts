// Service d'audit : centralise la journalisation des actions sensibles.
export interface AuditEvent {
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export class AuditService {
  async log(event: AuditEvent): Promise<AuditEvent> {
    // TODO: persister dans une table immuable + ancrage Web3 optionnel.
    return event;
  }
}
