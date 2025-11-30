// Configuration centralisée (chargée via variables d'environnement) pour l'API TraceGuard.
import 'dotenv/config';
import { ethers } from 'ethers';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  postgresUrl: process.env.POSTGRES_URL || 'postgres://traceguard:traceguard@localhost:5432/traceguard',
  allowOrigins: (process.env.ALLOW_ORIGINS || '').split(',').map((v) => v.trim()).filter(Boolean),
  minioEndpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  minioAccessKey: process.env.MINIO_ACCESS_KEY || 'traceguard',
  minioSecretKey: process.env.MINIO_SECRET_KEY || 'traceguardsecret',
  minioBucket: process.env.MINIO_BUCKET || 'traceguard-media',
  web3RpcUrl: process.env.WEB3_RPC_URL || 'http://localhost:8545',
  web3RegistryAddress: process.env.WEB3_REGISTRY_ADDRESS || ethers.ZeroAddress,
};
