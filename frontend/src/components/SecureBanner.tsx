import React from 'react';

export const SecureBanner: React.FC = () => (
  <div className="banner">
    <strong>Mode sécurisé activé</strong>
    <ul>
      <li>Trafic proxifié via passerelle protégée (WAF, TLS, mTLS interne)</li>
      <li>Pas de cookies de tracking, analytics opt-in uniquement</li>
      <li>Audit et traçabilité des accès par profil (enquêteur, analyste, auditeur)</li>
    </ul>
  </div>
);
