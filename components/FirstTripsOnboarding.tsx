'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CountrySelector } from './CountrySelector';

interface Trip {
  id: string;
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

interface FirstTripsOnboardingProps {
  isOpen: boolean;
  onComplete: (trips: Trip[]) => void;
  onSkip: () => void;
}

export function FirstTripsOnboarding({ isOpen, onComplete, onSkip }: FirstTripsOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({});

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTrips([]);
      setCurrentTrip({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Добро пожаловать! 👋',
      description: 'Давайте добавим ваши поездки за последние 12 месяцев, чтобы правильно рассчитать доступные дни.',
      action: 'Начать'
    },
    {
      title: 'Добавьте поездку',
      description: 'Выберите страну и укажите даты въезда и выезда.',
      action: 'Добавить'
    }
  ];

  const handleAddTrip = () => {
    if (currentTrip.countryCode && currentTrip.entryDate && currentTrip.exitDate) {
      const newTrip: Trip = {
        id: Date.now().toString(),
        countryCode: currentTrip.countryCode,
        entryDate: currentTrip.entryDate,
        exitDate: currentTrip.exitDate
      };
      
      setTrips([...trips, newTrip]);
      setCurrentTrip({});
    }
  };

  const handleRemoveTrip = (tripId: string) => {
    setTrips(trips.filter(t => t.id !== tripId));
  };

  const handleComplete = () => {
    onComplete(trips);
  };

  const handleSkip = () => {
    onSkip();
  };

  const isCurrentTripValid = currentTrip.countryCode && currentTrip.entryDate && currentTrip.exitDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{steps[currentStep].description}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {currentStep === 0 ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-6">✈️</div>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                Это поможет нам точно рассчитать, сколько дней у вас осталось для путешествий.
              </p>
              <Button onClick={() => setCurrentStep(1)} className="w-full py-3 text-lg">
                {steps[0].action}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Trip Form */}
              <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 text-lg">Новая поездка</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Страна
                  </label>
                  <CountrySelector
                    value={currentTrip.countryCode}
                    onChange={(code) => setCurrentTrip({ ...currentTrip, countryCode: code })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата въезда
                    </label>
                    <input
                      type="date"
                      value={currentTrip.entryDate || ''}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, entryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата выезда
                    </label>
                    <input
                      type="date"
                      value={currentTrip.exitDate || ''}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, exitDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddTrip}
                  disabled={!isCurrentTripValid}
                  className="w-full py-3"
                >
                  Добавить поездку
                </Button>
              </div>

              {/* Added Trips */}
              {trips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Добавленные поездки ({trips.length})</h3>
                  <div className="space-y-3">
                    {trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {COUNTRIES.find(c => c.code === trip.countryCode)?.flag || '🏳️'}
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {COUNTRIES.find(c => c.code === trip.countryCode)?.name || trip.countryCode}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTrip(trip.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          {currentStep === 1 && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(0)}
                className="flex-1 py-3"
              >
                Назад
              </Button>
              <Button
                onClick={handleComplete}
                disabled={trips.length === 0}
                className="flex-1 py-3"
              >
                Завершить ({trips.length} поездок)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Временный массив стран для отображения флагов (дублируем из CountrySelector)
const COUNTRIES = [
  { code: 'DE', name: 'Германия', flag: '🇩🇪' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸' },
  { code: 'OUTSIDE', name: 'Вне РК', flag: '🌍' }
];
