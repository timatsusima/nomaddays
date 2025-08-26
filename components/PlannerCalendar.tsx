'use client';

import { useState } from 'react';
import { DateRange } from '@/core/rules/types';

interface PlannerCalendarProps {
  onDateSelection: (dates: DateRange) => void;
}

const PlannerCalendar = ({ onDateSelection }: PlannerCalendarProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('Выберите даты');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert('Дата окончания должна быть позже даты начала');
      return;
    }

    const dates: DateRange = {
      start: new Date(startDate),
      end: new Date(endDate)
    };

    onDateSelection(dates);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <div className="card-title">Выберите даты поездки</div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Дата начала</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={getMinDate()}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Дата окончания</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || getMinDate()}
            required
          />
        </div>

        <button type="submit" className="btn w-full">
          Проверить доступность
        </button>
      </form>

      {startDate && endDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <p>Выбрано: {startDate} - {endDate}</p>
            <p>
              Продолжительность: {
                Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
              } дней
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerCalendar;
