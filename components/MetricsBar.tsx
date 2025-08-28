'use client';

import { Trip, RuleProfile } from '@/core/rules/types';
import { countryFlag } from '@/lib/countries';

interface MetricsBarProps {
  trips: Trip[];
  rules: RuleProfile[];
}

const MetricsBar = ({ trips, rules }: MetricsBarProps) => {
  const activeRules = rules.filter(rule => rule.enabled);
  const totalTrips = trips.length;
  
  // Простой расчёт дней (в реальном приложении используйте RulesEngine)
  const totalDays = trips.reduce((sum, trip) => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    const days = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="card text-center">
        <div className="text-2xl font-bold text-[var(--brand)]">{totalTrips}</div>
        <div className="text-sm text-[var(--text-secondary)]">Поездок</div>
      </div>
      
      <div className="card text-center">
        <div className="text-2xl font-bold text-[var(--brand)]">{totalDays}</div>
        <div className="text-sm text-[var(--text-secondary)]">Дней</div>
      </div>
      
      <div className="card text-center">
        <div className="text-2xl font-bold text-[var(--brand)]">{activeRules.length}</div>
        <div className="text-sm text-[var(--text-secondary)]">Активных правил</div>
      </div>
      
      <div className="card text-center">
        <div className="text-2xl font-bold status-ok">✓</div>
        <div className="text-sm text-[var(--text-secondary)]">Статус</div>
      </div>
    </div>
  );
};

export default MetricsBar;
