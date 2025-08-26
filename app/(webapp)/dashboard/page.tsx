'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import MetricsBar from '@/components/MetricsBar';
import { Trip, RuleProfile } from '@/core/rules/types';

const DashboardPage = () => {
  const [trips] = useState<Trip[]>([]);
  const [rules] = useState<RuleProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Загрузить данные с API
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="tg-webapp">
        <div className="text-center mt-4">
          <p>Загрузка...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="tg-webapp">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">NomadDays</h1>
        <p className="text-gray-600">Отслеживайте дни по странам</p>
      </div>

      <MetricsBar trips={trips} rules={rules} />

      <div className="card">
        <div className="card-title">Быстрые действия</div>
        <div className="flex flex-col gap-3">
          <button className="btn w-full">Добавить поездку</button>
          <button className="btn btn-secondary w-full">Спланировать поездку</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Последние поездки</div>
        {trips.length === 0 ? (
          <p className="text-gray-500">Нет поездок</p>
        ) : (
          <div className="space-y-2">
            {trips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{trip.countryCode}</span>
                <span className="text-sm text-gray-600">
                  {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default DashboardPage;
