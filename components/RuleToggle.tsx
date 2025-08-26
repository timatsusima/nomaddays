'use client';

import { useState } from 'react';
import { RuleProfile } from '@/core/rules/types';

interface RuleToggleProps {
  rule: RuleProfile;
  onToggle: (enabled: boolean) => void;
  onUpdate: (updates: Partial<RuleProfile>) => void;
}

const RuleToggle = ({ rule, onToggle }: RuleToggleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    onToggle(!rule.enabled);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            
            <div>
              <h3 className="font-medium">{rule.params.name}</h3>
              <p className="text-sm text-gray-600">{rule.params.description}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {rule.params.nDays && rule.params.mDays && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Окно дней:</span>
                <span className="font-medium">{rule.params.nDays} из {rule.params.mDays}</span>
              </div>
            )}
            
            {rule.params.maxDaysPerYear && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Максимум в год:</span>
                <span className="font-medium">{rule.params.maxDaysPerYear} дней</span>
              </div>
            )}
            
            {rule.params.maxDaysOutside && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Максимум вне страны:</span>
                <span className="font-medium">{rule.params.maxDaysOutside} дней</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Тип правила:</span>
              <span className="text-sm">
                {rule.params.calendarYear && 'Календарный год'}
                {rule.params.rolling12Months && 'Скользящие 12 месяцев'}
                {rule.params.nDays && rule.params.mDays && 'Скользящее окно'}
                {rule.params.maxDaysOutside && 'Максимум дней вне страны'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>⚠️ Все значения являются настраиваемыми параметрами</p>
            <p>📝 Измените значения в конфигурации для актуальных лимитов</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleToggle;
