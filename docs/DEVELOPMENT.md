# Démarrage TraceGuard

## Prérequis
- Docker / Docker Compose
- Node.js >= 20 pour les développements locaux
- Accès à un registre privé si déploiement cloud (optionnel)

## Lancer l'environnement local
```bash
cd infra
docker compose up --build
```
- API: https://api.traceguard.local/docs (via Traefik)
- MinIO console: http://localhost:9001

## Back-end (Fastify)
```bash
cd backend
npm install
npm run dev
```
- JWT statique pour tests: généré via `/auth/login` (remplacer par OIDC en production)
- Tests unitaires rapides: `npm test`

## Front-end (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
- Créez un fichier `.env.local` (ou copiez `.env.example`) avec `VITE_API_BASE_URL=http://localhost:3000` pour pointer vers le backend.
- Configurez `ALLOW_ORIGINS` côté backend pour autoriser `http://localhost:5173`
- Ouvrez `http://localhost:5173` (ou `http://localhost:4173` si Vite choisit ce port)

## MinIO (stockage objet S3-like)
1. Démarrez MinIO et l'initialisation du bucket :
   ```bash
   cd infra
   docker compose up -d minio minio-init
   ```
2. Console d'admin : http://localhost:9001 (identifiants par défaut `traceguard` / `traceguardsecret`).
3. Vérifiez le bucket auto-créé : `traceguard-media` (visible dans la console ou via `docker compose logs minio-init`).
4. Le backend lit ses secrets dans `.env` :
   - `MINIO_ENDPOINT=http://minio:9000` (ou `http://localhost:9000` si lancé hors compose)
   - `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`
   - `MINIO_BUCKET=traceguard-media`
5. Exemple d'upload côté backend : route `POST /media/upload` (multipart) avec un JWT obtenu via `POST /auth/login`.

## Déploiement Kubernetes (aperçu)
- Manifests d'exemple sous `infra/k8s/` (Ingress Traefik, StatefulSet Postgres, Deployment API).
- Créez les secrets requis (JWT, Postgres, MinIO) avant d'appliquer.

## Sécurité & conformité
- Secrets dans un vault (non commités) ; `.env.example` documente les variables attendues.
- Reverse proxy Traefik applique headers, TLS et rate limiting ; à compléter avec WAF et mTLS interne.
- Les journaux d'audit doivent être expédiés vers un SIEM et ancrés optionnellement sur la chaîne (module Web3).
- Variables de performance : `POSTGRES_POOL_SIZE/POSTGRES_IDLE_TIMEOUT_MS/POSTGRES_CONNECTION_TIMEOUT_MS` pilotent le pooling, et
  `RESPONSE_CACHE_TTL_SECONDS/RESPONSE_CACHE_MAX` contrôlent le cache mémoire partagé utilisé pour les lectures répétées.
