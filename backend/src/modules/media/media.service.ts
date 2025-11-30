// Service de gestion des médias : validation et stockage préliminaire.
import { randomUUID } from 'crypto';
import { pool } from '../../db/client';
import { putObject } from '../../services/storage/object-storage';
import { config } from '../../config/config';
import { sha256 } from '../../utils/checksum';

export interface MediaRecord {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  checksum: string;
  storageUri?: string;
}

export interface UploadedFileMeta {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const allowedMime = ['image/', 'video/', 'audio/', 'application/pdf'];

export class MediaService {
  async handleUpload(file: UploadedFileMeta, actor: string): Promise<MediaRecord> {
    if (!allowedMime.some((prefix) => file.mimetype.startsWith(prefix))) {
      throw new Error('unsupported mime type');
    }

    const id = randomUUID();
    const checksum = sha256(file.buffer);
    const objectKey = `${id}-${file.originalname}`;
    const stored = await putObject(config.minioBucket, objectKey, file.buffer, file.mimetype);

    await pool.query(
      'INSERT INTO media_records (id, filename, size, mime_type, checksum, created_by, storage_uri) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, file.originalname, file.size, file.mimetype, checksum, actor, stored.location]
    );

    return {
      id,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      checksum,
      storageUri: stored.location,
    };
  }

  async getById(id: string): Promise<MediaRecord | null> {
    const { rows } = await pool.query(
      'SELECT id, filename, size, mime_type AS "mimeType", checksum, storage_uri AS "storageUri" FROM media_records WHERE id=$1',
      [id]
    );
    return rows[0] || null;
  }
}
