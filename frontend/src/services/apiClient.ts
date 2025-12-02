const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.traceguard.local';
// Client HTTP centralisé pour le frontend TraceGuard.
// Conserve l'UI Base44 mais redirige toutes les requêtes vers l'API locale TraceGuard.
const rawBase =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_BASE = rawBase.replace(/\/$/, '');

export function apiClient(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('traceguard_token');
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...options, headers });
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, { ...options, headers });
}
