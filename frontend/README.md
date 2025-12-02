# TraceGuard – Frontend Vite/React

Console de gouvernance utilisant le design "base44" (layout sombre, cartes, panneaux) sans aucune dépendance aux APIs externes base44.

## Démarrage rapide
1. Installer les dépendances :
   ```bash
   cd frontend
   npm install
   ```
2. Configurer l'URL API (copiez l'exemple) :
   ```bash
   cp .env.example .env.local
   # Ajustez si besoin pour Docker Compose / Traefik
   # VITE_API_BASE_URL=http://localhost:3000
   ```
3. Lancer le serveur Vite :
   ```bash
   npm run dev
   ```
4. Ouvrir le front : http://localhost:5173 (ou le port que Vite indique).

## Où se brancher sur le backend TraceGuard
- Client HTTP central : `src/services/apiClient.ts` (injecte le JWT depuis `localStorage`).
- Composants connectés :
  - `src/components/MediaList.tsx` → GET `/media` (auth requise) pour lister les médias.
  - `src/components/AuditTable.tsx` → GET `/audit` (auth requise) pour voir les événements.
  - `src/components/UploadForm.tsx` → POST `/media/upload` (multipart) pour envoyer un fichier.
- Auth démo : `src/pages/Login.tsx` appelle `POST /auth/login` et stocke le jeton dans `localStorage`.

## Intégrer/porter votre UI "base44" sans ses APIs
- Layout global : `src/components/layout/BaseLayout.tsx` (sidebar + toolbar). Vous pouvez y coller vos sections/header base44.
- Styles : `src/styles.css` (classes `.app-shell`, `.sidebar__nav`, `.panel`, etc.). Remplacez/complétez avec vos tokens base44.
- Cartes/listes : `MediaList` et `AuditTable` montrent comment remplacer les appels externes par `apiClient` → `/media`, `/audit`.
- Vérification rapide : exécutez `rg "base44" frontend` pour confirmer qu'aucune URL externe n'est appelée. Tous les fetch passent par `apiClient`.

## Astuces
- Si le backend tourne derrière Traefik (host `api.traceguard.local`), mettez `VITE_API_BASE_URL=https://api.traceguard.local` dans `.env.local`.
- Pour changer le port Vite, ajoutez `--host`/`--port` à `npm run dev` ou créez un `vite.config` dédié.
- Les composants acceptent un JWT stocké sous `traceguard_token`; obtenez-le via la page Login ou en appelant manuellement `/auth/login`.
