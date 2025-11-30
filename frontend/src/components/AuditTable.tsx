import React from 'react';

const demoEvents = [
  { actor: 'admin', action: 'media.upload', resource: 'm1', timestamp: '2024-01-01T10:00:00Z' },
  { actor: 'auditor', action: 'media.view', resource: 'm1', timestamp: '2024-01-02T09:00:00Z' },
];

export const AuditTable: React.FC = () => (
  <div className="card">
    <header>
      <h2>Événements récents</h2>
    </header>
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
        {demoEvents.map((evt) => (
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
