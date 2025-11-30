import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { AuditPage } from './pages/Audit';
import { Login } from './pages/Login';
import { BaseLayout } from './components/layout/BaseLayout';
import './styles.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BaseLayout>
    </BrowserRouter>
  );
};
