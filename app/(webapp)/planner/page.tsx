'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import PlannerCalendar from '@/components/PlannerCalendar';
import { Trip, RuleProfile, DateRange } from '@/core/rules/types';

const PlannerPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [rules, setRules] = useState<RuleProfile[]>([]);
  const [selectedDates, setSelectedDates] = useState<DateRange | null>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Загрузить данные с API
    setLoading(false);
  }, []);

  const handleDateSelection = async (dates: DateRange) => {
    setSelectedDates(dates);
    
    // TODO: Вызвать API для расчёта прогноза
    // const result = await fetch('/api/compute/forecast', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ plannedTrip: dates, userId: 'current-user' })
    // });
    // const forecastData = await result.json();
    // setForecast(forecastData);
    
    // Заглушка для демонстрации
    setForecast({
      canTravel: true,
      results: [
        {
          ruleKey: 'SCHENGEN_90_180',
          ruleName: 'Шенген 90/180',
          isCompliant: true,
          usedDays: 45,
          availableDays: 45,
          severity: 'OK',
          explanation: 'В окне 180 дней использовано 45 из 90 доступных дней'
        }
      ]
    });
  };

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
        <h1 className="text-2xl font-bold mb-4">Планировщик поездок</h1>
        <p className="text-gray-600">Выберите даты для проверки доступных дней</p>
      </div>

      <PlannerCalendar onDateSelection={handleDateSelection} />

      {selectedDates && (
        <div className="card">
          <div className="card-title">Выбранные даты</div>
          <div className="text-center mb-4">
            <p className="font-medium">
              {selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              {Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)) + 1} дней
            </p>
          </div>
        </div>
      )}

      {forecast && (
        <div className="card">
          <div className="card-title">Результат проверки</div>
          
          <div className={`text-center mb-4 p-3 rounded ${
            forecast.canTravel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-bold">
              {forecast.canTravel ? '✅ Можно путешествовать' : '❌ Путешествие не рекомендуется'}
            </p>
          </div>

          <div className="space-y-3">
            {forecast.results.map((result: any, index: number) => (
              <div key={index} className={`p-3 rounded border ${
                result.severity === 'OK' ? 'border-green-200 bg-green-50' :
                result.severity === 'WARNING' ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }`}>
                <div className="font-medium mb-2">{result.ruleName}</div>
                <div className="text-sm text-gray-600 mb-2">{result.explanation}</div>
                <div className="flex justify-between text-sm">
                  <span>Использовано: {result.usedDays} дней</span>
                  <span>Доступно: {result.availableDays} дней</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default PlannerPage;
