'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WelcomeModal } from '@/components/WelcomeModal';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    // Проверяем, первый ли раз пользователь зашёл
    const hasSeenWelcome = localStorage.getItem('nomaddays_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }

    // Загружаем данные
    fetchTrips();
    fetchRules();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules');
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('nomaddays_welcome_seen', 'true');
  };

  const totalDays = trips.reduce((sum, trip) => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    const days = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  const activeRules = rules.filter(rule => rule.enabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)}
        onComplete={handleWelcomeComplete}
      />
      
      <div className="p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">NomadDays</h1>
          <p className="text-lg text-gray-600 mb-8">Отслеживайте дни по странам</p>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
              <div className="text-gray-600">Поездок</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{totalDays}</div>
              <div className="text-gray-600">Дней</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">{activeRules}</div>
              <div className="text-gray-600">Активных правил</div>
            </div>
          </div>

          {/* Статус */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700">Статус</span>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/trips" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Добавить поездку
              </Link>
              <Link 
                href="/planner" 
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                Спланировать поездку
              </Link>
            </div>
          </div>

          {/* Последние поездки */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Последние поездки</h2>
            {trips.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <div className="text-gray-400 text-6xl mb-4">✈️</div>
                <p className="text-gray-600 mb-4">Нет поездок</p>
                <p className="text-gray-500 text-sm">Добавьте первую поездку, чтобы начать отслеживание</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {trips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">{trip.countryCode}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.ceil((new Date(trip.exitDate).getTime() - new Date(trip.entryDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
