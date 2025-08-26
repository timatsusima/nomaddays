'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WelcomeModal } from '@/components/WelcomeModal';
import { FirstTripsOnboarding } from '@/components/FirstTripsOnboarding';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFirstTrips, setShowFirstTrips] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    // Проверяем, первый ли раз пользователь зашёл
    const hasSeenWelcome = localStorage.getItem('nomaddays_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }

    // Проверяем, нужно ли показать onboarding первых поездок
    const hasAddedFirstTrips = localStorage.getItem('nomaddays_first_trips_added');
    if (!hasAddedFirstTrips && hasSeenWelcome) {
      setShowFirstTrips(true);
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
    
    // После welcome показываем onboarding первых поездок
    setTimeout(() => {
      setShowFirstTrips(true);
    }, 500);
  };

  const handleFirstTripsComplete = async (newTrips: any[]) => {
    // Сохраняем поездки через API
    try {
      for (const trip of newTrips) {
        await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip)
        });
      }
      
      // Обновляем список поездок
      await fetchTrips();
      
      // Отмечаем, что первые поездки добавлены
      localStorage.setItem('nomaddays_first_trips_added', 'true');
      setShowFirstTrips(false);
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const handleFirstTripsSkip = () => {
    localStorage.setItem('nomaddays_first_trips_added', 'true');
    setShowFirstTrips(false);
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
      
      <FirstTripsOnboarding
        isOpen={showFirstTrips}
        onComplete={handleFirstTripsComplete}
        onSkip={handleFirstTripsSkip}
      />
      
      <div className="p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">NomadDays</h1>
            <p className="text-lg text-gray-600 leading-relaxed">Отслеживайте дни по странам</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Поездок</p>
                  <p className="text-3xl font-bold text-blue-600">{trips.length}</p>
                </div>
                <div className="text-3xl">✈️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Дней</p>
                  <p className="text-3xl font-bold text-green-600">{totalDays}</p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Правил</p>
                  <p className="text-3xl font-bold text-purple-600">{activeRules}</p>
                </div>
                <div className="text-3xl">⚖️</div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-700 font-medium">Статус: Все в порядке</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Быстрые действия</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/trips" 
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">➕</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Добавить поездку
                    </h3>
                    <p className="text-sm text-gray-500">Записать новую поездку</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/planner" 
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">📋</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Спланировать поездку
                    </h3>
                    <p className="text-sm text-gray-500">Проверить доступные дни</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Последние поездки</h2>
            {trips.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-300 text-6xl mb-4">✈️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Нет поездок</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">Добавьте первую поездку, чтобы начать отслеживание</p>
                <Link 
                  href="/trips"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Добавить поездку
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {trips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {/* Здесь можно добавить флаг страны */}
                          🌍
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{trip.countryCode}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {Math.ceil((new Date(trip.exitDate).getTime() - new Date(trip.entryDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-sm text-gray-500">дней</div>
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
