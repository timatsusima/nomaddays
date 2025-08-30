// Dashboard v3.3 - Nomad Onboarding (Updated Navigation - 21:20)
// Build: 2024-08-27 21:20
// Cache: NO-CACHE-HEADERS
// Navigation: Updated (Import removed) - Force refresh

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import NomadOnboarding, { NomadData } from '@/components/NomadOnboarding';
import { resolveCountryName, countryColor } from '@/lib/countries';
import FlagIcon from '@/components/FlagIcon';
import dayjs from 'dayjs';
import AITips from '@/components/AITips';

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [residenceCode, setResidenceCode] = useState<string>('');

  useEffect(() => {
    loadInitialData();
    
    // Проверяем, нужно ли показать onboarding
    const hasCompletedOnboarding = localStorage.getItem('nomaddays_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
    const rc = localStorage.getItem('nomaddays_residence') || '';
    setResidenceCode(rc);
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

  // Дней до окончания статуса (РВП/ВНЖ/туристический)
  const [daysUntilPermitEnd, setDaysUntilPermitEnd] = useState<{ diff: number; type: string } | null>(null);
  const [outsideDaysLeft, setOutsideDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    try {
      const endStr = typeof window !== 'undefined' ? localStorage.getItem('nomaddays_permit_end') : null;
      const type = typeof window !== 'undefined' ? (localStorage.getItem('nomaddays_permit_type') || 'NONE') : 'NONE';
      if (!endStr) return;
      const end = new Date(endStr);
      const today = new Date();
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilPermitEnd({ diff, type });
    } catch {}
  }, []);

  // Остаток дней вне страны (для резиденства РК — не более 182 дней вне страны в 365)
  // вычисляем после расчёта countryDaysLast12m

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

  // Дни в стране ВНЖ/РВП за последние 12 месяцев = дни в окне - дни поездок не в стране ВНЖ
  const daysInResidenceLast12m = useMemo(() => {
    const windowDays = 365;
    const outside = countryDaysLast12m.reduce((sum, row) => {
      if (!residenceCode || row.code !== residenceCode) return sum + row.days;
      return sum;
    }, 0);
    return Math.max(0, windowDays - outside);
  }, [countryDaysLast12m, residenceCode]);

  // Дни в стране с начала календарного года
  const daysInResidenceCalendarYear = useMemo(() => {
    if (!residenceCode) return null;
    const year = new Date().getFullYear();
    const yearStart = new Date(`${year}-01-01T00:00:00Z`);
    const today = new Date();
    // считаем дни в стране резиденции: 365 (с начала года до сегодня) - дни поездок вне страны в этом окне
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const windowDays = Math.ceil((today.getTime() - yearStart.getTime()) / MS_PER_DAY) + 1;
    let outside = 0;
    for (const trip of trips) {
      const code = trip.countryCode;
      if (code === residenceCode) continue;
      const entry = new Date(trip.entryDate);
      const exit = new Date(trip.exitDate);
      const start = entry > yearStart ? entry : yearStart;
      const end = exit < today ? exit : today;
      if (end.getTime() <= start.getTime()) continue;
      outside += Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
    }
    return Math.max(0, windowDays - outside);
  }, [trips, residenceCode]);

  useEffect(() => {
    if (!residenceCode || residenceCode === 'NONE') {
      setOutsideDaysLeft(null);
      return;
    }
    const totalOutside = countryDaysLast12m.reduce((sum, row) => {
      if (row.code === residenceCode) return sum;
      return sum + row.days;
    }, 0);
    setOutsideDaysLeft(Math.max(0, 182 - totalOutside));
  }, [countryDaysLast12m, residenceCode]);

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

  // Итог по месяцам: сумма дней и доминирующая страна для цвета
  const monthlyTotals = useMemo(() => {
    const items = monthlyByCountry.map(({ month, data }) => {
      const entries = Object.entries(data);
      const total = entries.reduce((s, [, v]) => s + v, 0);
      const dominant = entries.sort((a, b) => b[1] - a[1])[0]?.[0] || 'ZZ';
      return { month, total, code: dominant };
    });
    const max = Math.max(1, ...items.map((i) => i.total));
    return { items, max };
  }, [monthlyByCountry]);

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">n0mad_days</h1>
          <Link href="/about" className="text-[var(--brand)] underline">О приложении</Link>
        </div>
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
        {daysUntilPermitEnd && (
          <div className="text-sm mt-2 text-[var(--text-secondary)]">
            Дней до окончания {daysUntilPermitEnd.type === 'RVP' ? 'РВП' : daysUntilPermitEnd.type === 'VNZH' ? 'ВНЖ' : 'статуса'}:
            <span className="ml-1 font-semibold text-[var(--text)]">{Math.max(0, daysUntilPermitEnd.diff)}</span>
          </div>
        )}
        {residenceCode && (
          <div className="text-sm mt-2 text-[var(--text-secondary)]">
            Дней в стране ВНЖ/РВП за 12 мес:
            <span className="ml-1 font-semibold text-[var(--text)]">{daysInResidenceLast12m}</span>
          </div>
        )}
        {daysInResidenceCalendarYear !== null && (
          <div className="text-sm mt-2 text-[var(--text-secondary)]">
            Дней в стране с начала года:
            <span className="ml-1 font-semibold text-[var(--text)]">{daysInResidenceCalendarYear}</span>
          </div>
        )}
        {outsideDaysLeft !== null && (
          <div className="text-sm mt-2 text-[var(--text-secondary)]">
            Остаток дней вне страны (лимит 182/365):
            <span className="ml-1 font-semibold text-[var(--text)]">{outsideDaysLeft}</span>
          </div>
        )}
        {(!residenceCode || residenceCode === 'NONE') && (
          <div className="mt-3">
            <button onClick={() => setShowOnboarding(true)} className="btn">Указать страну ВНЖ/РВП</button>
          </div>
        )}
      </div>

      {/* Country Days (Last 12 months) */}
      <div className="mb-6 px-4">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Дни по странам (12 мес.)</h2>
        {/* Простая «стековая» диаграмма по месяцам */}
        {monthlyTotals.items.length > 0 && (
          <div className="card mb-4 p-4 overflow-x-auto">
            <div className="flex items-end gap-3 min-w-[600px]">
              {monthlyTotals.items.map(({ month, total, code }) => {
                const height = Math.max(8, Math.round((total / monthlyTotals.max) * 96));
                const label = dayjs(`${month}-01`).format('MMM');
                return (
                  <div key={month} className="flex flex-col items-center w-12">
                    <div className="relative w-full h-24">
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-md flex items-center justify-center"
                        style={{ height: `${height}px`, backgroundColor: countryColor(code) }}
                        title={`${code}: ${total} дней`}
                      >
                        <span className="text-[10px] text-white font-semibold">{total}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1">{label}</div>
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
                  <FlagIcon code={row.code} />
                  <span>{row.name} ({row.code})</span>
                </div>
                <div className="font-bold" style={{ color: countryColor(row.code) }}>{row.days}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Tips */}
      <AITips trips={trips} />

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
                    <div className="font-semibold text-[var(--text)] flex items-center gap-2">
                      <FlagIcon code={trip.countryCode} />
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

      {/* Reset Profile Button at bottom */}
      <div className="px-4 mb-24">
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

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
