// Service de gestion des médias : validation et stockage préliminaire.
import { randomUUID } from 'crypto';
import { pool } from '../../db/client';
import { putObject } from '../../services/storage/object-storage';
import { config } from '../../config/config';
import { sha256 } from '../../utils/checksum';
import { getCache } from '../../utils/cache';

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
  private cachePromise = getCache();

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

    const cache = await this.cachePromise;
    await cache.del(`media:${id}`);

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
    const cacheKey = `media:${id}`;
    const cache = await this.cachePromise;
    const cached = await cache.get<MediaRecord>(cacheKey);
    if (cached) {
      return cached;
    }

    const { rows } = await pool.query(
      'SELECT id, filename, size, mime_type AS "mimeType", checksum, storage_uri AS "storageUri" FROM media_records WHERE id=$1',
      [id]
    );
    const record: MediaRecord | null = rows[0] || null;
    if (record) {
      await cache.set(cacheKey, record, config.responseCacheTtlSeconds);
    }
    return record;
  }

  async listRecent(limit = 20): Promise<MediaRecord[]> {
    const cappedLimit = Math.min(Math.max(limit, 1), 100);
    const cacheKey = `media:list:${cappedLimit}`;
    const cache = await this.cachePromise;
    const cached = await cache.get<MediaRecord[]>(cacheKey);
    if (cached) return cached;

    const { rows } = await pool.query(
      'SELECT id, filename, size, mime_type AS "mimeType", checksum, storage_uri AS "storageUri", created_at AS "createdAt" FROM media_records ORDER BY created_at DESC LIMIT $1',
      [cappedLimit]
    );
    await cache.set(cacheKey, rows, config.responseCacheTtlSeconds);
    return rows;
  }
}
