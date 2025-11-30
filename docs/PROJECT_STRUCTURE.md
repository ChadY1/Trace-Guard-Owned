# Structure du projet TraceGuard

Arborescence synthétique des principaux dossiers et fichiers fournis pour lancer la plateforme TraceGuard en local ou en CI.

```
.
├── backend/                 # API Fastify sécurisée (auth, médias, audit, gouvernance)
│   ├── src/
│   │   ├── app.ts           # Construction de l'app Fastify (plugins, Swagger, routes)
│   │   ├── index.ts         # Entrée principale + migration de schéma Postgres
│   │   ├── db/              # Client Postgres + migration minimale
│   │   ├── modules/         # Auth, médias, audit, accès, renseignement (IMINT/OSINT/GEO)
│   │   ├── services/        # Stockage objet (MinIO), Web3 registry
│   │   ├── utils/           # Fonctions utilitaires (checksum)
│   │   └── app.test.ts      # Tests Jest de fumée (health, auth)
│   └── .env.example         # Variables d'environnement locales
├── frontend/                # Console React/Vite (dashboard, upload, audit)
├── infra/                   # Docker Compose, Traefik, manifests K8s optionnels
│   ├── docker-compose.yml   # Stack locale API + Postgres + MinIO + Traefik
│   ├── dockerfiles/         # Images API
│   ├── traefik/             # Configuration reverse proxy + headers de sécurité
│   └── k8s/                 # Manifests de déploiement K8s (API + ingress)
├── web3/                    # Contrats d'ancrage et README d'intégration
├── docs/                    # Architecture, démarrage, structure
└── .github/workflows/ci.yml # Pipeline CI (build/lint backend et frontend)
```

Pour les détails de conception, consulter `docs/architecture.md`; pour l'exécution locale et multi-OS, voir `docs/DEVELOPMENT.md` et `docs/INSTALLATION.md`.
