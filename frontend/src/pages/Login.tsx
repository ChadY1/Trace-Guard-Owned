import React, { useState } from 'react';
import { SecureBanner } from '../components/SecureBanner';
import { apiClient } from '../services/apiClient';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await apiClient('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('traceguard_token', data.accessToken);
        setMessage('Authentification réussie. Jeton stocké en localStorage.');
      } else {
        setMessage(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setMessage('Impossible de contacter l’API');
    }
  };

  return (
    <div className="page-grid">
      <SecureBanner />
      <section className="panel">
        <h1>Connexion</h1>
        <form className="form" onSubmit={handleLogin}>
          <label>
            Identifiant
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit">Se connecter</button>
        </form>
        {message && <p className="status">{message}</p>}
      </section>
    </div>
  );
};
