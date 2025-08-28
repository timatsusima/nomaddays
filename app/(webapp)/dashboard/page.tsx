// Dashboard v3.0 - FORCE REFRESH
// Build: 2024-08-27 21:00
// Cache: NO-CACHE-HEADERS

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WelcomeModal } from '@/components/WelcomeModal';
import { FirstTripsOnboarding } from '@/components/FirstTripsOnboarding';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем, первый ли раз пользователь зашёл
    const hasSeenWelcome = localStorage.getItem('nomaddays_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }

    // Проверяем, нужно ли показать onboarding первых поездок
    const hasAddedFirstTrips = localStorage.getItem('nomaddays_first_trips_added');
    if (!hasAddedFirstTrips && hasSeenWelcome) {
      setShowOnboarding(true);
    }

    // Загружаем данные
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchTrips(), fetchRules()]);
    } catch (error) {
      // Silent fail for production
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      // Silent fail for production - don't spam console
      setTrips([]);
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
      // Silent fail for production - don't spam console
      setRules([]);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('nomaddays_welcome_seen', 'true');
    
    // После welcome показываем onboarding первых поездок
    setTimeout(() => {
      setShowOnboarding(true);
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
      setShowOnboarding(false);
    } catch (error) {
      // Silent fail for production
      setShowOnboarding(false);
    }
  };

  const handleFirstTripsSkip = () => {
    localStorage.setItem('nomaddays_first_trips_added', 'true');
    setShowOnboarding(false);
  };

  const totalDays = trips.reduce((sum, trip) => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    const days = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  const activeRules = rules.filter(rule => rule.enabled).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-[var(--bg)] border-b border-[var(--border)] p-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">NomadDays</h1>
        <p className="text-[var(--text-secondary)]">Отслеживайте дни по странам</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--brand)] mb-1">{trips.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Поездок</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--brand)] mb-1">{totalDays}</div>
          <div className="text-sm text-[var(--text-secondary)]">Дней</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-[var(--brand)] mb-1">{rules.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">Правил</div>
        </div>
      </div>

      {/* Status */}
      <div className="card mb-6">
        <div className="card-title">Статус</div>
        <div className="text-[var(--text)]">
          {totalDays === 0 ? 'Нет поездок' : 'Все в порядке'}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Быстрые действия</h2>
        <div className="space-y-3">
          <Link href="/trips" className="card block hover:border-[var(--brand)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--brand)] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">+</span>
              </div>
              <div>
                <div className="font-semibold text-[var(--text)]">Добавить поездку</div>
                <div className="text-sm text-[var(--text-secondary)]">Записать новую поездку</div>
              </div>
            </div>
          </Link>
          <Link href="/planner" className="card block hover:border-[var(--brand)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--brand)] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📅</span>
              </div>
              <div>
                <div className="font-semibold text-[var(--text)]">Спланировать поездку</div>
                <div className="text-sm text-[var(--text-secondary)]">Проверить доступные дни</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Последние поездки</h2>
        {trips.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-4xl mb-4">✈️</div>
            <div className="text-[var(--text-secondary)] mb-2">Нет поездок</div>
            <div className="text-sm text-[var(--text-secondary)] mb-4">
              Добавьте первую поездку, чтобы начать отслеживание
            </div>
            <Link href="/trips" className="btn">
              Добавить поездку
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text)]">{trip.countryCode}</div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-[var(--brand)]">
                    {Math.ceil((new Date(trip.exitDate).getTime() - new Date(trip.entryDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        onComplete={handleWelcomeComplete}
      />
      <FirstTripsOnboarding 
        isOpen={showOnboarding} 
        onComplete={handleFirstTripsComplete}
        onSkip={handleFirstTripsSkip}
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
