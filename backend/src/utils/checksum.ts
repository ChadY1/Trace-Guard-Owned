// Utilitaires pour calculer des empreintes SHA-256 des fichiers.
import { createHash } from 'crypto';

export function sha256(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex');
}
