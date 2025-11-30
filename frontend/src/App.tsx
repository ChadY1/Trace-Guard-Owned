import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { AuditPage } from './pages/Audit';
import { Login } from './pages/Login';
import './styles.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="logo">TraceGuard</div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/upload">Upload sécurisé</Link>
          <Link to="/audit">Audit</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
