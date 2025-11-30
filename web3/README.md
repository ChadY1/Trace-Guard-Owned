# Web3 TraceGuard

Contrats et intégrations pour l'ancrage immuable des empreintes de médias et l'audit décentralisé.

## Contenu
- `contracts/TraceGuardRegistry.sol` : registre d'empreintes (hash) avec ancrage horodaté et URI de métadonnées hors-chaîne (stockage chiffré ou IPFS privé).

## Principes de sécurité
- Contrat minimaliste pour limiter la surface d'attaque ; à enrichir avec une gouvernance (multisig) avant production.
- Hash préalablement dérivé hors chaîne (SHA-256 ou BLAKE2) et/ou hash perceptuel stocké chiffré, aucun média brut sur la chaîne.
- Déploiement recommandé sur une chaîne permissionnée ou L2 privée pour respecter la confidentialité et la réglementation.

## Intégration backend
- Lors de l'ingestion média, calculer le hash et publier `anchor(mediaHash, metadataUri)`.
- Conserver l'ID de transaction et le block number dans les journaux d'audit.
- Prévoir un module de rotation/migration pour primitives post-quantique (ex: ancrage double hash si supporté) après validation cryptographique.
