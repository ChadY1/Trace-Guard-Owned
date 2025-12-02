import React from 'react';
import { SecureBanner } from '../components/SecureBanner';
import { AuditTable } from '../components/AuditTable';

export const AuditPage: React.FC = () => {
  return (
    <main className="layout">
    <div className="page-grid">
      <SecureBanner />
      <section className="panel">
        <h1>Journal d'audit</h1>
        <p>Visualisez les actions récentes (lecture, upload, accès) pour vérifier la chaîne de garde.</p>
        <AuditTable />
      </section>
    </main>
    </div>
  );
};
