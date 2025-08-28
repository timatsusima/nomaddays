'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nomaddays_openai_api_key') || '';
    setApiKey(saved);
  }, []);

  const save = () => {
    localStorage.setItem('nomaddays_openai_api_key', apiKey.trim());
    alert('API ключ сохранён локально');
  };

  return (
    <div className="tg-webapp">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Настройки ИИ</h1>
        <p className="text-[var(--text-secondary)]">Введите OpenAI API ключ. Он хранится только локально.</p>
      </div>

      <div className="card mb-4">
        <div className="form-group">
          <label className="form-label">OpenAI API Key</label>
          <input
            className="form-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <button className="btn mt-3" onClick={save}>Сохранить</button>
      </div>

      <Navigation />
    </div>
  );
}


