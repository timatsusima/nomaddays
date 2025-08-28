// Dashboard v3.1 - Nomad Onboarding
// Build: 2024-08-27 21:10
// Cache: NO-CACHE-HEADERS

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NomadOnboarding, { NomadData } from '@/components/NomadOnboarding';
import { resolveCountryName, countryFlag, countryColor } from '@/lib/countries';

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
      if (data.residencePermitType) localStorage.setItem('nomaddays_permit_type', data.residencePermitType);
      if (data.residencePermitStart) localStorage.setItem('nomaddays_permit_start', data.residencePermitStart);
      if (data.residencePermitEnd) localStorage.setItem('nomaddays_permit_end', data.residencePermitEnd);
      
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

  const handleResetProfile = () => {
    try {
      const keys = [
        'nomaddays_onboarding_completed',
        'nomaddays_citizenship',
        'nomaddays_residence'
      ];
      keys.forEach((k) => localStorage.removeItem(k));
      setShowOnboarding(true);
      alert('Профиль сброшен. Пройдите онбординг заново.');
    } catch (_) {}
  };

  const totalDays = trips.reduce((sum, trip) => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    return sum + Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);

  // Дни по странам за последние 12 месяцев
  const countryDaysLast12m = useMemo(() => {
    const now = new Date();
    const windowStart = new Date(now.getTime());
    windowStart.setDate(windowStart.getDate() - 365);
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const acc = new Map<string, number>();

    for (const trip of trips) {
      const tripStart = new Date(trip.entryDate);
      const tripEnd = new Date(trip.exitDate);

      // Пересечение с окном последних 12 месяцев
      const start = tripStart > windowStart ? tripStart : windowStart;
      const end = tripEnd < now ? tripEnd : now;
      if (end.getTime() <= start.getTime()) continue;

      const days = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
      acc.set(trip.countryCode, (acc.get(trip.countryCode) || 0) + days);
    }

    return Array.from(acc.entries())
      .map(([code, days]) => ({ code, name: resolveCountryName(code), days }))
      .sort((a, b) => b.days - a.days);
  }, [trips]);

  // Подготовка данных для месячной диаграммы: {month: '2025-01', KZ: 10, TH: 20, ...}
  const monthlyByCountry = useMemo(() => {
    const map = new Map<string, Record<string, number>>();
    const add = (monthKey: string, code: string, days: number) => {
      if (!map.has(monthKey)) map.set(monthKey, {});
      const bucket = map.get(monthKey)!;
      bucket[code] = (bucket[code] || 0) + days;
    };
    for (const trip of trips) {
      let start = new Date(trip.entryDate);
      const end = new Date(trip.exitDate);
      while (start <= end) {
        const monthKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;
        add(monthKey, trip.countryCode, 1);
        start = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      }
    }
    // Сортированный массив по месяцу
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([month, data]) => ({ month, data }));
  }, [trips]);

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

      {/* Country Days (Last 12 months) */}
      <div className="mb-6 px-4">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Дни по странам (12 мес.)</h2>
        {/* Простая «стековая» диаграмма по месяцам */}
        {monthlyByCountry.length > 0 && (
          <div className="card mb-4 p-4 overflow-x-auto">
            <div className="flex items-end gap-2 min-w-[600px]">
              {monthlyByCountry.map(({ month, data }) => {
                const total = Object.values(data).reduce((s, v) => s + v, 0) || 1;
                let yOffset = 96; // рисуем стек снизу вверх
                return (
                  <div key={month} className="flex flex-col items-center w-10">
                    <div className="relative w-full h-24 border border-[var(--border)] rounded overflow-hidden">
                      {Object.entries(data)
                        .sort((a, b) => a[1] - b[1])
                        .map(([code, days]) => {
                          const height = Math.max(2, Math.round((days / total) * 96));
                          yOffset -= height;
                          const style = { backgroundColor: countryColor(code), height: `${height}px`, top: `${yOffset}px`, borderTop: '1px solid rgba(0,0,0,.1)' } as React.CSSProperties;
                          return <div key={code} className="absolute left-0 right-0" style={style} title={`${countryFlag(code)} ${code}: ${days}`} />;
                        })}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1">{month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {countryDaysLast12m.length === 0 ? (
          <div className="card text-center py-6 text-[var(--text-secondary)]">Нет данных</div>
        ) : (
          <div className="space-y-2">
            {countryDaysLast12m.map((row) => (
              <div key={row.code} className="card flex items-center justify-between py-3">
                <div className="font-semibold text-[var(--text)] flex items-center gap-2">
                  <span>{countryFlag(row.code)}</span>
                  <span>{row.name} ({row.code})</span>
                </div>
                <div className="font-bold" style={{ color: countryColor(row.code) }}>{row.days}</div>
              </div>
            ))}
          </div>
        )}
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
          <button onClick={handleResetProfile} className="card block w-full text-left hover:border-[var(--brand)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--red)] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">↺</span>
              </div>
              <div>
                <div className="font-semibold text-[var(--text)]">Сбросить профиль</div>
                <div className="text-sm text-[var(--text-secondary)]">Очистить данные и начать заново</div>
              </div>
            </div>
          </button>
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
                    <div className="font-semibold text-[var(--text)] flex items-center gap-2">
                      <span>{countryFlag(trip.countryCode)}</span>
                      <span>{trip.countryCode}</span>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-bold" style={{ color: countryColor(trip.countryCode) }}>
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
