// Service de gestion des médias : validation et stockage préliminaire.
import { randomUUID } from 'crypto';

export interface MediaRecord {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  checksum: string;
}

export interface UploadedFileMeta {
  originalname: string;
  mimetype: string;
  size: number;
}

export class MediaService {
  async handleUpload(file: UploadedFileMeta): Promise<MediaRecord> {
    // TODO: persistance en stockage objet chiffré + audit + ancrage.
    const id = randomUUID();
    return {
      id,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      checksum: 'pending',
    };
  }

  async getById(id: string): Promise<MediaRecord | null> {
    // TODO: récupérer les métadonnées depuis le stockage et vérifier les droits d'accès.
    return null;
  }
}
