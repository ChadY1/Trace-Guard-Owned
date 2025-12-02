# Plan d'architecture TraceGuard

## 1. Résumé exécutif
- **Vision** : plateforme de gouvernance et de surveillance légale des flux multimédias (vidéo, audio, photo, texte, métadonnées) pour traceguard.globaleurope.fr, pensée « privacy & security by design » et compatible Web3 lorsque pertinent.
- **Objectifs** : assurer collecte, sécurisation, traçabilité, partage contrôlé, et audit des preuves numériques, dans le respect des cadres réglementaires (RGPD, ePrivacy, NIS2) et des politiques internes.
- **Non-fonctionnels clés** : sécurité zéro-trust, résilience, observabilité complète, performances adaptées aux flux multimédia, extensibilité modulaire, interopérabilité API, conformité légale.

## 2. Modèle d’usage & cas d’emploi
- **Profils** : enquêteurs/opérateurs (ingestion, annotation), analystes (exploitation), administrateurs (gouvernance, secrets, clés), auditeurs/judiciaire (consultation et preuve), SRE/DevSecOps (exploitation, déploiement), produit (priorisation fonctionnalités).
- **Cas d’usage majeurs** :
  - Ingestion sécurisée de flux (caméras autorisées, mobiles embarqués, drones).
  - Normalisation, chiffrement, classification, signature horodatée, traçabilité des opérations.
  - Consultation contrôlée (RBAC/ABAC), journaux d’accès signés, partage restreint.
  - Chaîne de garde complète, archivage légal, purge et rétention différenciées.
  - Intégration SI (APIs internes/externes, connecteurs analytiques, export probatoire).
- **Données gérées** : médias bruts, transcodés, métadonnées (horodatage, géoloc, capteur), annotations, journaux d’audit, politiques de gouvernance, signaux IMINT/OSINT/GEO et résumés analytiques associés.

## 3. Architecture globale de la plateforme
- **Vue logique (services)** :
  - Ingestion multimédia (upload, normalisation, détection de corruption, chiffrement côté client ou edge).
  - Orchestrateur de traitement (transcodage, fingerprinting perceptuel, extraction de métadonnées, hashage immuable, signature).
  - Indexation & recherche (métadonnées, timeline, géolocalisation, similarité).
  - Analyse renseignement : IMINT (sources autorisées), OSINT (sources ouvertes légales), signaux géopolitiques corrélés.
  - Gouvernance d’accès (RBAC/ABAC, règles métiers, délégation, scopes temporels).
  - API Gateway + BFF (front web, mobiles, intégrations partenaires).
  - Web3/décentralisation optionnelle : registres d’empreintes, journalisation immuable, clés et preuves d’intégrité.
  - Observabilité (metrics, logs, traces), supervision sécurité (SIEM, SOAR), gestion des incidents.
- **Vue physique** : VPC multi-zones, subnets privés pour services/stateful, subnets publics pour front et edge proxy. Séparation Dev/Int/Preprod/Prod, pare-feu et SG restrictifs, peering ou VPN/IPSec vers SI partenaire.
- **Réseau & proxy/« serveur fantôme »** :
  - Front door via Cloudflare ou équivalent (WAF, DDoS, TLS, bot management, rate limiting, geo-fencing).
  - Reverse proxies internes (NGINX/Envoy) pour cloisonner microservices, mutual TLS, filtrage IP, validation JWT.
  - Routing onion-like optionnel pour échanges sensibles internes (service-to-service) lorsque requis, en restant conforme et auditable.
- **Web3** : registre d’empreintes et journaux d’audit immuables (ex : consortium chain, L2 permissionnée), stockage distribué sélectif (IPFS/Filecoin ou équivalent) pour artefacts non sensibles, avec chiffrement et accès contrôlé.

## 4. Conception des environnements (Dev / Int / Pré-Prod / Prod)
- Séparation stricte, données de prod non réutilisées ; jeux de données synthétiques ou anonymisés pour tests.
- **CI/CD GitHub** : workflows multi-branches (feature → PR → main), build/cache, tests auto, scans SAST/DAST/OSS, promotion via artefacts signés.
- **Secrets/config** : Vault ou AWS KMS/Secrets Manager ; rotation clés, scopes par service/environnement ; convention 12-factor.
- **Logs/observabilité** : OpenTelemetry, centralisation (ELK/EFK, Loki), métriques (Prometheus), traces (Tempo/Jaeger), alerting (PagerDuty/VictorOps), budgets SLO, collecte client côté front minimaliste (pas de trackers ni cookies non essentiels).

## 5. Design et restructuration des API
- **Cartographie cible** :
  - API d’ingestion (upload chunké, reprise, signature, contrôle d’intégrité).
  - API d’index/recherche (filtres avancés, timeline, géoloc, similarité, export probatoire).
  - API de gouvernance (rôles, droits, délégation, révocation, preuves d’accès).
  - API d’audit/traçabilité (logs signés, chaîne de garde, justificatifs légaux).
- **Patterns** :
  - API Gateway + BFF par client (web, mobile, partenaires). REST + gRPC interne ; GraphQL pour agrégation front si besoin.
  - Versioning, contrats OpenAPI/AsyncAPI, pagination/quotas/rate limit.
- **AuthN/AuthZ** : OIDC/OAuth2, MFA adaptatif, WebAuthn, device binding, RBAC/ABAC, PoLP, scopes temporels, consentement explicite.
- **Durcissement** : mTLS interne, WAF, schema validation, HSTS, CSP, anti-CSRF, anti-replay (nonce + horodatage), gestion d’erreurs sans fuite d’info.

## 6. Modèle de données & gouvernance multimédia
- **Schéma conceptuel** :
  - `Media` (id, type, hash, empreintes perceptuelles, chemin stockage, taille, checksum, clés utilisées).
  - `CaptureEvent` (horodatage, géoloc, dispositif, opérateur, politique de rétention associée, signature).
  - `Metadata` (EXIF, détecteurs, annotations, classification).
  - `AccessGrant` (sujet, droits, durée, scope, justification, jetons dérivés).
  - `AuditLog` (action, acteur, contexte, signature, ancre sur registre immuable).
- **Stockage** :
  - Objets chiffrés (S3/Blob) avec KMS, clés par locataire/projet.
  - Base relationnelle pour référentiels/transactions (PostgreSQL), moteur de recherche (OpenSearch/Elastic) pour métadonnées, time-series pour observabilité.
  - Bases chiffrées et cloisonnées pour signaux IMINT/OSINT/GEO, index plein texte + recherche géo ; stockage séparé des empreintes (hash) et des contenus, journalisation immuable des accès.
  - Web3/IPFS optionnel pour empreintes/ancrages ; off-chain chiffré pour données sensibles.
- **Politiques de rétention** : durées par classification, gel légal, purge sécurisée (crypto-shredding), archivage WORM selon besoin probatoire.
- **Chaîne de garde** : signatures, scellés, logs horodatés, ancrage sur registre immuable, preuves vérifiables.

## 7. Sécurité, confidentialité & résilience
- **Chiffrement** : TLS 1.3 partout, mTLS interne, PFS, AKE robuste ; chiffrement au repos (AES-GCM) avec rotation de clés ; secret zero-knowledge côté client possible pour flux critiques.
- **Anti-brute-force** : MFA, verrouillage adaptatif, rate limit, CAPTCHAs adaptés, détection d’anomalies, device risk scoring.
- **Zero Trust** : identité au centre, segmentation réseau, policy-as-code (OPA/Rego), just-in-time access, bastion.
- **Post-quantique (PQ)** : analyse de risques PQ, inventaire des primitives, stratégie de migration hybride (ex : TLS hybrides quand supporté), veille NIST/PQ; aucune primitive expérimentale en production sans validation.
- **Confidentialité** : minimisation des données, pseudonymisation/anonymisation, pas de tracking cookies/analytics invasifs ; consentement et bandeaux conformes.
- **Résilience** : multi-AZ, sauvegardes chiffrées, tests de restauration, chaos engineering ciblé, plan PRA/PCA.
- **Tests sécurité** : SAST/DAST/IAST, pentests encadrés, red team interne sur périmètre autorisé, bug bounty privé, revue de code sécurisée.

## 8. Front-end & UX : refonte et amélioration
- **Architecture front** : framework moderne (React/Next ou Vue/Nuxt), BFF dédié, design system (Storybook), composants réutilisables, micro-frontends si besoin.
- **Design x Responsivité** : grille fluide, layouts adaptatifs, dark/light, performances (code-splitting, lazy-loading médias), budget < LCP 2.5s sur mobiles, PWA pour embarqué.
- **Accessibilité & i18n** : WCAG 2.1 AA, navigation clavier, ARIA, localisation (fr/en au minimum), tests manuels + automatiques (axe-core).
- **Sécurité front** : CSP stricte, Trusted Types, Subresource Integrity, sandbox iframes, désactivation cookies non essentiels par défaut.

## 9. Pipeline de développement, qualité & automatisation
- **Process** : spec → RFC archi → user stories → dev → code review → tests → build → déploiement → validation.
- **CI/CD** : GitHub Actions avec matrices (lint, tests unitaires/intégration, build, scan deps, SAST/DAST), artefacts signés, promotions manuelles ou via change management.
- **Qualité** : linters (ESLint, Prettier, Ruff), tests (Jest/Vitest, pytest), coverage gates, contract testing pour APIs.
- **Traçabilité** : logs de build/test/deploy archivés (S3 + rétention), SBOM (CycloneDX), attestations de provenance (SLSA niveau visé ≥2 puis 3).

## 10. Stratégie de tests, validation et observabilité
- **Tests** : unitaires, intégration (API, DB), E2E (Playwright/Cypress), UI/accessibilité, charge (k6), résilience (chaos), sécurité (SAST/DAST/pentests planifiés).
- **Test harness médias** : jeux de médias synthétiques, scénarios d’ingestion/lecture, vérification hash/empreintes, latence bout-en-bout.
- **KPIs Prod** : disponibilité, latence P50/P95, taux d’erreurs, temps d’ingestion/transcodage, coût par Go, taux d’alertes bruitées.
- **Dashboards** : opérationnels (SRE), sécurité (SOC), métier (volume de cas, flux traités, respect SLA), conformité (logs d’accès, preuves).

## 11. Conformité légale & éthique
- **Principes** : privacy by design/default, DPIA, registre de traitements, politiques de conservation, portabilité, droit à l’effacement lorsque légalement possible.
- **Limitations** : aucune surveillance non autorisée ; seules sources administrées/contractuellement autorisées ; logs et audits horodatés prouvant la légitimité des accès.
- **Gouvernance** : comité éthique/sécurité, revues régulières, documentation auditable, clauses contractuelles (DPA), revue fournisseurs (Cloud, CDN, Web3).

## 12. Roadmap & jalons
- **Phase 0 (2-4 semaines)** : cadrage, DPIA préliminaire, choix techno, POC ingestion + hash + ancrage immuable, maquette UX.
- **Phase 1 (6-8 semaines)** : MVP ingestion sécurisée, API Gateway/BFF, RBAC, stockage chiffré, logs d’audit signés, CI/CD de base, observabilité initiale.
- **Phase 2 (8-12 semaines)** : recherche avancée, ABAC, intégrations SI, WebAuthn, durcissement sécurité (WAF, mTLS généralisé), tests perf/charge, A/B UX.
- **Phase 3 (12+ semaines)** : PQ-readiness (analyses + pilotes hybrides), décentralisation ciblée (ancrage registre), bug bounty privé, PRA/PCA validé, pré-prod complète.
- **Go-live** : critères qualité/sécurité (SLOs, scans propres, pentest OK), conformité (DPIA finalisé, registres), runbooks SRE/SOC, formation équipes.

