# TraceGuard Owned

Cadre initial pour documenter et concevoir TraceGuard (traceguard.globaleurope.fr), une plateforme de gouvernance et de surveillance légale de flux multimédias pensée « privacy & security by design ».

## Contenu
- **docs/architecture.md** : plan d’architecture complet (environnements, API, gouvernance des médias, sécurité, conformité, roadmap).
- **docs/DEVELOPMENT.md** : démarrage rapide des environnements locaux (Docker Compose, backend Fastify, frontend Vite).
- **docs/PROJECT_STRUCTURE.md** : arborescence synthétique et rôle des dossiers.
- **infra/** : compose Traefik + API + Postgres + MinIO avec headers de sécurité et rate limiting.
- **backend/** : API Fastify (auth, upload média, audit, policies), JWT protégé, Swagger.
- **frontend/** : Vite + React, premiers écrans de console sécurisée.
- **web3/** : contrat de registre immuable pour ancrer les empreintes de médias.
- **.github/workflows/ci.yml** : pipeline CI de build/lint backend/frontend.

## Prochaines étapes
- Brancher OIDC/WebAuthn et stockage objet chiffré réel dans le backend.
- Définir les politiques RBAC/ABAC dans une base relationnelle et brancher l’audit sur un SIEM.
- Étendre le front avec formulaires d’upload, timeline et consultation probatoire.
