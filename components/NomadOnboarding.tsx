// NomadOnboarding v1.0 - Nomad-specific onboarding
// Build: 2024-08-27 21:10

'use client';

import React, { useState } from 'react';
import { CountrySelector, Country } from './CountrySelector';

export interface NomadOnboardingProps {
  isOpen: boolean;
  onComplete: (data: NomadData) => void;
  onSkip: () => void;
}

export interface NomadData {
  citizenship: string;
  residenceCountry: string;
  trips: TripData[];
}

export interface TripData {
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

export default function NomadOnboarding({ isOpen, onComplete, onSkip }: NomadOnboardingProps) {
  const [step, setStep] = useState(1);
  const [citizenship, setCitizenship] = useState('');
  const [residenceCountry, setResidenceCountry] = useState('');
  const [trips, setTrips] = useState<TripData[]>([]);
  const [currentTrip, setCurrentTrip] = useState<TripData>({
    countryCode: '',
    entryDate: '',
    exitDate: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && citizenship) {
      setStep(2);
    } else if (step === 2 && residenceCountry) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddTrip = () => {
    if (currentTrip.countryCode && currentTrip.entryDate && currentTrip.exitDate) {
      setTrips([...trips, currentTrip]);
      setCurrentTrip({ countryCode: '', entryDate: '', exitDate: '' });
    }
  };

  const handleRemoveTrip = (index: number) => {
    setTrips(trips.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onComplete({
      citizenship,
      residenceCountry,
      trips
    });
  };

  const canProceed = () => {
    if (step === 1) return citizenship;
    if (step === 2) return residenceCountry;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Добро пожаловать в NomadDays!</h2>
          <p className="text-[var(--text-secondary)]">Давайте настроим ваш профиль номада</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                stepNumber <= step
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        {/* Step 1: Citizenship */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Ваше гражданство</label>
              <CountrySelector
                value={citizenship}
                onChange={setCitizenship}
                placeholder="Выберите страну гражданства"
              />
            </div>
            <div className="text-sm text-[var(--text-secondary)] text-center">
              Это поможет определить правила въезда/выезда для вас
            </div>
          </div>
        )}

        {/* Step 2: Residence */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Страна ВНЖ/РВП</label>
              <CountrySelector
                value={residenceCountry}
                onChange={setResidenceCountry}
                placeholder="Выберите страну ВНЖ/РВП"
              />
            </div>
            <div className="text-sm text-[var(--text-secondary)] text-center">
              Если у вас нет ВНЖ/РВП, выберите "Вне РК"
            </div>
          </div>
        )}

        {/* Step 3: Trips */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Добавить поездку за последние 12 месяцев</label>
              <div className="space-y-3">
                <CountrySelector
                  value={currentTrip.countryCode}
                  onChange={(code) => setCurrentTrip({ ...currentTrip, countryCode: code })}
                  placeholder="Страна поездки"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-sm">Дата въезда</label>
                    <input
                      type="date"
                      value={currentTrip.entryDate}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, entryDate: e.target.value })}
                      className="form-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="form-label text-sm">Дата выезда</label>
                    <input
                      type="date"
                      value={currentTrip.exitDate}
                      onChange={(e) => setCurrentTrip({ ...currentTrip, exitDate: e.target.value })}
                      className="form-input text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTrip}
                  disabled={!currentTrip.countryCode || !currentTrip.entryDate || !currentTrip.exitDate}
                  className="btn w-full text-sm"
                >
                  Добавить поездку
                </button>
              </div>
            </div>

            {/* Added Trips */}
            {trips.length > 0 && (
              <div>
                <label className="form-label">Добавленные поездки ({trips.length})</label>
                <div className="space-y-2">
                  {trips.map((trip, index) => (
                    <div key={index} className="card p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[var(--text)] text-sm">
                            {trip.countryCode}
                          </div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {trip.entryDate} - {trip.exitDate}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTrip(index)}
                          className="text-[var(--red)] hover:text-[var(--red)] text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-[var(--text-secondary)] text-center">
              Добавьте все поездки за последние 12 месяцев для точного расчета
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={handleBack} className="btn-secondary flex-1">
              Назад
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn flex-1"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="btn flex-1"
            >
              Завершить
            </button>
          )}
        </div>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            onClick={onSkip}
            className="text-[var(--text-secondary)] text-sm hover:text-[var(--text)]"
          >
            Пропустить настройку
          </button>
        </div>
      </div>
    </div>
  );
}
