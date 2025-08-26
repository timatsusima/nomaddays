'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Добро пожаловать в NomadDays!',
    description: 'Отслеживайте дни по странам и планируйте поездки с учётом правил резиденции',
    image: '🌍',
    action: 'Понятно'
  },
  {
    title: 'Добавляйте поездки',
    description: 'Указывайте страну, даты въезда и выезда. Приложение автоматически посчитает дни',
    image: '✈️',
    action: 'Дальше'
  },
  {
    title: 'Настройте правила',
    description: 'Включите правила для стран (например, Шенген 90/180 дней)',
    image: '⚖️',
    action: 'Дальше'
  },
  {
    title: 'Планируйте будущие поездки',
    description: 'Используйте планировщик, чтобы понять, сколько дней у вас осталось',
    image: '📅',
    action: 'Начать!'
  }
];

export function WelcomeModal({ isOpen, onClose, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        {/* Progress Bar */}
        <div className="flex justify-center mb-6">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="text-6xl mb-4">{step.image}</div>
        <h2 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Назад
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {step.action}
          </Button>
        </div>

        {/* Skip Button */}
        {!isLastStep && (
          <button
            onClick={handleSkip}
            className="text-gray-500 text-sm mt-4 hover:text-gray-700"
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
}
