import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  created_at?: string;
  createdAt?: string;
  checksum?: string;
}

export const MediaList: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unauthenticated' | 'error'>('idle');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setStatus('loading');
      try {
        const res = await apiClient('/media?limit=20', { signal: controller.signal });
        if (res.status === 401) {
          setStatus('unauthenticated');
          setItems([]);
          return;
        }
        const data = await res.json();
        const parsed: MediaItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
            ? data.items
            : [];
        setItems(parsed);
        setStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus('error');
      }
    };
    load();
    return () => controller.abort();
  }, []);

  if (status === 'unauthenticated') {
    return (
      <div className="card">
        <header>
          <h2>Médias récents</h2>
        </header>
        <p>Connectez-vous pour charger les médias depuis le backend TraceGuard.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <header>
        <h2>Médias récents</h2>
        {status === 'loading' && <small>Chargement…</small>}
        {status === 'error' && <small>API injoignable</small>}
      </header>
      {items.length === 0 && status === 'ready' && <p>Aucun média disponible (essayez un upload).</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.filename}</strong>
              <small>{item.mimeType}</small>
              <small>
                {item.createdAt || item.created_at
                  ? new Date(item.createdAt || item.created_at || '').toLocaleString()
                  : ''}
              </small>
            </div>
            <span className="pill">{item.checksum ? 'Hashé' : 'Reçu'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
