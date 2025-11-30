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
- Configurez `ALLOW_ORIGINS` côté backend pour autoriser `http://localhost:5173`

## Déploiement Kubernetes (aperçu)
- Manifests d'exemple sous `infra/k8s/` (Ingress Traefik, StatefulSet Postgres, Deployment API).
- Créez les secrets requis (JWT, Postgres, MinIO) avant d'appliquer.

## Sécurité & conformité
- Secrets dans un vault (non commités) ; `.env.example` documente les variables attendues.
- Reverse proxy Traefik applique headers, TLS et rate limiting ; à compléter avec WAF et mTLS interne.
- Les journaux d'audit doivent être expédiés vers un SIEM et ancrés optionnellement sur la chaîne (module Web3).
- Variables de performance : `POSTGRES_POOL_SIZE/POSTGRES_IDLE_TIMEOUT_MS/POSTGRES_CONNECTION_TIMEOUT_MS` pilotent le pooling, et
  `RESPONSE_CACHE_TTL_SECONDS/RESPONSE_CACHE_MAX` contrôlent le cache mémoire partagé utilisé pour les lectures répétées.
