import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

interface AuditRow {
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
}

export const AuditTable: React.FC = () => {
  const [events, setEvents] = useState<AuditRow[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unauthenticated' | 'error'>('idle');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setStatus('loading');
      try {
        const res = await apiClient('/audit', { signal: controller.signal });
        if (res.status === 401) {
          setStatus('unauthenticated');
          return;
        }
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
        setStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus('error');
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="card">
      <header>
        <h2>Événements récents</h2>
        {status === 'loading' && <small>Chargement…</small>}
        {status === 'error' && <small>API injoignable</small>}
      </header>
      {status === 'unauthenticated' && <p>Connectez-vous pour consulter l’audit.</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Acteur</th>
            <th>Action</th>
            <th>Ressource</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((evt) => (
            <tr key={`${evt.resource}-${evt.timestamp}`}>
              <td>{evt.actor}</td>
              <td>{evt.action}</td>
              <td>{evt.resource}</td>
              <td>{new Date(evt.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
