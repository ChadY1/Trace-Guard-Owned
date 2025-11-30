import React, { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload sécurisé' },
  { to: '/audit', label: 'Audit' },
  { to: '/login', label: 'Login' },
];

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__logo">TraceGuard</div>
        <div className="sidebar__section">UI inspirée de base44, sans appels externes.</div>
        <nav className="sidebar__nav">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'nav--active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar__hint">Configurez VITE_API_BASE_URL pour pointer vers le backend local.</div>
      </aside>
      <div className="main-area">
        <header className="toolbar">
          <span className="badge">Local</span>
          <span className="user-pill">Compte démo</span>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};
