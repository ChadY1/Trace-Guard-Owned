import React, { useState } from 'react';
import { UploadForm } from '../components/UploadForm';
import { SecureBanner } from '../components/SecureBanner';

export const Upload: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  return (
    <div className="page-grid">
      <SecureBanner />
      <section className="panel">
        <h1>Upload sécurisé</h1>
        <p>Envoyez un média chiffré vers le backend TraceGuard (requiert un jeton JWT valide côté API).</p>
        <UploadForm onStatus={setStatus} />
        {status && <p className="status">{status}</p>}
      </section>
    </div>
  );
};
