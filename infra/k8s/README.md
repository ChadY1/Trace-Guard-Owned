# Manifests Kubernetes (aperçu)

Ces manifests simples illustrent un déploiement TraceGuard dans un cluster Kubernetes privé. Ils servent de base et doivent être adaptés (TLS, stockage, secrets) avant production.

Fichiers fournis :
- `api-deployment.yaml` : déploiement de l'API TraceGuard + Service.
- `ingress.yaml` : exposition via un Ingress (à coupler avec Traefik/NGINX Ingress Controller et un WAF).
- `postgres-statefulset.yaml` : base Postgres minimaliste (à remplacer par un service managé en prod).

Instructions rapides :
1. Créer les secrets nécessaires (JWT, credentials DB, MinIO) via `kubectl create secret generic traceguard-secrets ...`.
2. Appliquer les manifests : `kubectl apply -f infra/k8s/`.
3. Brancher un gestionnaire de certificats (cert-manager) et ajuster les annotations Ingress pour ACME.
