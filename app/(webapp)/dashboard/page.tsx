// Dashboard v3.1 - Nomad Onboarding
// Build: 2024-08-27 21:10
// Cache: NO-CACHE-HEADERS

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NomadOnboarding, { NomadData } from '@/components/NomadOnboarding';

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    
    // Проверяем, нужно ли показать onboarding
    const hasCompletedOnboarding = localStorage.getItem('nomaddays_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const loadInitialData = async () => {
    try {
      // Загружаем поездки
      const tripsResponse = await fetch('/api/trips');
      if (tripsResponse.ok) {
        const tripsData = await tripsResponse.json();
        setTrips(tripsData);
      }

      // Загружаем правила
      const rulesResponse = await fetch('/api/rules');
      if (rulesResponse.ok) {
        const rulesData = await rulesResponse.json();
        setRules(rulesData);
      }
    } catch (error) {
      // Silent fail for production
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (data: NomadData) => {
    try {
      console.log('Onboarding completed with data:', data);
      
      // Сохраняем данные номада
      localStorage.setItem('nomaddays_citizenship', data.citizenship);
      localStorage.setItem('nomaddays_residence', data.residenceCountry);
      
      // Добавляем поездки через API
      if (data.trips.length > 0) {
        for (const trip of data.trips) {
          const response = await fetch('/api/trips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trip)
          });
          
          if (!response.ok) {
            console.error('Failed to add trip:', trip);
          }
        }
      }
      
      // Отмечаем onboarding как завершенный
      localStorage.setItem('nomaddays_onboarding_completed', 'true');
      setShowOnboarding(false);
      
      // Перезагружаем данные
      await loadInitialData();
      
      alert('Профиль номада настроен!');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Ошибка при настройке профиля');
      localStorage.setItem('nomaddays_onboarding_completed', 'true');
      setShowOnboarding(false);
    }
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('nomaddays_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const totalDays = trips.reduce((sum, trip) => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    return sum + Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="text-[var(--text)]">Загрузка...</div>
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
      <div className="grid grid-cols-3 gap-4 mb-6 px-4">
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
      <div className="card mx-4 mb-6">
        <div className="card-title">Статус</div>
        <div className="text-[var(--text)]">
          {totalDays === 0 ? 'Нет поездок' : 'Все в порядке'}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 px-4">
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
      <div className="mb-6 px-4">
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

      {/* Nomad Onboarding */}
      <NomadOnboarding 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
