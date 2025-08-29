'use client';

import { useState, useEffect } from 'react';

export default function TestAPIPage() {
  const [tripsData, setTripsData] = useState<any>(null);
  const [rulesData, setRulesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testAPIs();
  }, []);

  const testAPIs = async () => {
    try {
      setLoading(true);
      
      // Тестируем API trips
      console.log('Testing /api/trips...');
      const tripsResponse = await fetch('/api/trips');
      console.log('Trips response status:', tripsResponse.status);
      
      if (tripsResponse.ok) {
        const trips = await tripsResponse.json();
        setTripsData(trips);
        console.log('Trips data:', trips);
      } else {
        console.error('Trips API error:', tripsResponse.status);
      }

      // Тестируем API rules
      console.log('Testing /api/rules...');
      const rulesResponse = await fetch('/api/rules');
      console.log('Rules response status:', rulesResponse.status);
      
      if (rulesResponse.ok) {
        const rules = await rulesResponse.json();
        setRulesData(rules);
        console.log('Rules data:', rules);
      } else {
        console.error('Rules API error:', rulesResponse.status);
      }

    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const initDatabase = async () => {
    try {
      console.log('Initializing database...');
      const response = await fetch('/api/init-db', { method: 'POST' });
      console.log('Init DB response:', response.status);
      
      if (response.ok) {
        alert('База данных инициализирована!');
        await testAPIs(); // Перетестируем API
      } else {
        alert('Ошибка инициализации базы данных');
      }
    } catch (err) {
      console.error('Init DB error:', err);
      alert('Ошибка инициализации базы данных');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <div className="text-lg">Тестируем API...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Тест API</h1>
        
        {/* Кнопка инициализации БД */}
        <div className="mb-6">
          <button 
            onClick={initDatabase}
            className="btn bg-[var(--brand)] text-white px-6 py-3 rounded-lg"
          >
            🗄️ Инициализировать базу данных
          </button>
        </div>

        {/* Результаты тестов */}
        <div className="space-y-6">
          {/* API Trips */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">API /api/trips</h2>
            {tripsData ? (
              <div>
                <div className="text-sm text-[var(--text-secondary)] mb-2">
                  Статус: ✅ Успешно
                </div>
                <div className="text-sm text-[var(--text)]">
                  Данные: {JSON.stringify(tripsData, null, 2)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[var(--red)]">
                Статус: ❌ Ошибка или нет данных
              </div>
            )}
          </div>

          {/* API Rules */}
          <div className="card">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">API /api/rules</h2>
            {rulesData ? (
              <div>
                <div className="text-sm text-[var(--text-secondary)] mb-2">
                  Статус: ✅ Успешно
                </div>
                <div className="text-sm text-[var(--text)]">
                  Данные: {JSON.stringify(rulesData, null, 2)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-[var(--red)]">
                Статус: ❌ Ошибка или нет данных
              </div>
            )}
          </div>

          {/* Ошибки */}
          {error && (
            <div className="card bg-[var(--red)] text-white">
              <h3 className="font-semibold mb-2">Ошибка:</h3>
              <div className="text-sm">{error}</div>
            </div>
          )}
        </div>

        {/* Кнопка перезагрузки */}
        <div className="mt-6">
          <button 
            onClick={testAPIs}
            className="btn bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] px-6 py-3 rounded-lg"
          >
            🔄 Перетестировать API
          </button>
        </div>
      </div>
    </div>
  );
}
