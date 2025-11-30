// Adaptateur MinIO/S3 pour stocker les médias de TraceGuard.
import { Client } from 'minio';
import { config } from '../../config/config';

export interface StoredObject {
  key: string;
  bucket: string;
  location: string;
}

const endpoint = new URL(config.minioEndpoint);
export const objectClient = new Client({
  endPoint: endpoint.hostname,
  port: parseInt(endpoint.port || '443', 10),
  useSSL: endpoint.protocol === 'https:',
  accessKey: config.minioAccessKey,
  secretKey: config.minioSecretKey,
});

export async function ensureBucketExists(bucket: string) {
  const exists = await objectClient.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await objectClient.makeBucket(bucket, '');
  }
}

export async function putObject(bucket: string, key: string, data: Buffer, mimeType: string): Promise<StoredObject> {
  await ensureBucketExists(bucket);
  await objectClient.putObject(bucket, key, data, data.length, { 'Content-Type': mimeType });
  return {
    key,
    bucket,
    location: `${config.minioEndpoint.replace(/\/$/, '')}/${bucket}/${key}`,
  };
}
