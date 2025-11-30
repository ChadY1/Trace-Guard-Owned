import React from 'react';

const mockMedia = [
  { id: 'm1', name: 'Drone capture #1', classification: 'Confidentiel', status: 'Hashé & chiffré' },
  { id: 'm2', name: 'Caméra périmètre', classification: 'Diffusion restreinte', status: 'En cours de revue' },
];

export const MediaList: React.FC = () => (
  <div className="card">
    <header>
      <h2>Médias récents</h2>
    </header>
    <ul>
      {mockMedia.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <small>{item.classification}</small>
          </div>
          <span>{item.status}</span>
        </li>
      ))}
    </ul>
  </div>
);
