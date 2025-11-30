import React from 'react';
import { MediaList } from '../components/MediaList';
import { SecureBanner } from '../components/SecureBanner';

export const Dashboard: React.FC = () => {
  return (
    <main className="layout">
      <SecureBanner />
      <section className="panel">
        <h1>TraceGuard - Console</h1>
        <p>Surveillez et gouvernez les flux multimédias autorisés en toute conformité.</p>
        <MediaList />
      </section>
    </main>
  );
};
