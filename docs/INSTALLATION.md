# Guide d'installation multi-plateformes

Ce guide décrit comment installer et compiler TraceGuard sur les systèmes les plus courants. Toutes les instructions restent dans un cadre légal : exploitez uniquement des sources et équipements autorisés et protégez les données sensibles (chiffrement, accès restreint, audit).

## 1. Prérequis communs
- **Node.js 20+** et **npm** pour l'API Fastify, le front Vite/React et les outils Hardhat.
- **Docker/Podman** pour les déploiements containerisés (API, Postgres, MinIO, Traefik).
- **Git** pour cloner le dépôt.
- **Accès réseau** aux registres d'images et aux endpoints Web3 internes si utilisés.
- Variables d'environnement sensibles à fournir via fichiers `.env` ou vault (voir `backend/.env.example`).

## 2. Linux (Debian/Ubuntu génériques)
```bash
# Prérequis
sudo apt update && sudo apt install -y curl git build-essential docker.io docker-compose-plugin
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone et installation
git clone https://example.com/TraceGuard-Owned.git
cd TraceGuard-Owned/backend && npm ci && npm run build
cd ../frontend && npm ci && npm run build

# Lancer la stack locale
cd ../infra
docker compose up --build
```

## 3. Linux (autres distribs)
- Installez Node.js 20+ via le gestionnaire de paquets ou nvm.
- Activez Docker/Podman et un utilisateur avec accès au socket.
- Exécutez les mêmes commandes `npm ci && npm run build` dans `backend/` et `frontend/`.

## 4. Windows
- **Option recommandée : WSL2 (Ubuntu)** pour bénéficier d'un environnement proche de la prod.
- Installez WSL2 + Ubuntu, puis suivez la section Debian/Ubuntu depuis le shell WSL.
- Alternatif natif : installez **Node.js 20 LTS** (msi), **Git for Windows**, **Docker Desktop** (activez le backend WSL2). Dans PowerShell :
```powershell
git clone https://example.com/TraceGuard-Owned.git
cd TraceGuard-Owned\backend
npm ci; npm run build
cd ..\frontend
npm ci; npm run build
# Docker Desktop doit être démarré pour utiliser docker compose
cd ..\infra
docker compose up --build
```

## 5. macOS
- Installez **Homebrew**, puis :
```bash
brew install node@20 git
brew install --cask docker
# Démarrez l'app Docker Desktop

git clone https://example.com/TraceGuard-Owned.git
cd TraceGuard-Owned/backend && npm ci && npm run build
cd ../frontend && npm ci && npm run build
cd ../infra && docker compose up --build
```

## 6. Android (APK) / iOS (IPA) – enveloppe applicative
Le dépôt fournit une console web (Vite/React) et une API. Pour des apps mobiles :
- Générez le front en **PWA** (`frontend/npm run build`) puis encapsulez-le avec **Capacitor** ou une WebView native.
- Android : utilisez Android Studio, importez le projet Capacitor, signez et générez un **APK/AAB**.
- iOS : utilisez Xcode, provisionnez, signez et générez l'**IPA** (nécessite un compte Apple Developer).
- Les apps doivent consommer l'API TraceGuard via HTTPS et respecter les politiques de consentement, chiffrement et audit.

## 7. Images/ISO ou bundles autonomes
- Pour des environnements isolés, créez une image **OCI** via `infra/dockerfiles/Dockerfile.api` et `infra/docker-compose.yml`, puis exportez-la (`docker save`).
- Pour un usage type **ISO/live**, encapsulez Docker + configuration dans une VM ou un OS live pré-configuré ; veillez à injecter les secrets via un mécanisme sécurisé au boot.

## 8. Hardhat (Web3)
```bash
cd web3
npm ci
npm run build  # si un script est défini, sinon npx hardhat compile
# Pour déployer sur un réseau privé :
WEB3_RPC_URL=<rpc_url> WEB3_SIGNER_KEY=<clé> npx hardhat run scripts/deploy.ts --network <network>
```

## 9. Bonnes pratiques transverses
- Chiffrez les données au repos (chiffrement disque/objets) et en transit (TLS). Utilisez des backends de clés (KMS/vault).
- Limitez les origines et activez le WAF/reverse proxy (Traefik/Nginx) en frontal.
- Journalisez dans un SIEM et activez la rotation ; respectez RGPD/ePrivacy (pas de tracking invasif).
- Ne collectez ni n'exploitez de données ou flux sans autorisation explicite.

## 10. Vérification rapide
- API : `curl http://localhost:3001/health`
- Front : http://localhost:3000 ou via Traefik selon votre configuration
- Tests backend : `cd backend && npm test -- --runInBand`
- Lint : `cd backend && npm run lint -- --max-warnings=0`

Adaptez les chemins de clone et les variables d'environnement à votre infrastructure (dev, préprod, prod). Documentez les paramètres réseau et secrets dans un vault, jamais en clair dans le dépôt.
