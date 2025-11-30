const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.traceguard.local';

export function apiClient(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('traceguard_token');
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
