import React, { useRef } from 'react';
import { apiClient } from '../services/apiClient';

interface Props {
  onStatus: (status: string) => void;
}

export const UploadForm: React.FC<Props> = ({ onStatus }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      onStatus('Aucun fichier sélectionné');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient('/media/upload', { method: 'POST', body: formData });
      const body = await response.json();
      if (response.ok) {
        onStatus(`Upload réussi: ${body.id}`);
      } else {
        onStatus(body.message || 'Erreur lors de l’upload');
      }
    } catch (error) {
      onStatus('API injoignable ou non autorisée');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Sélectionnez un fichier
        <input ref={fileRef} type="file" accept="image/*,video/*,audio/*,.pdf" />
      </label>
      <button type="submit">Uploader</button>
    </form>
  );
};
