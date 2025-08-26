'use client';

import { useState, useEffect } from 'react';
import { Trip } from '@/core/rules/types';

interface TripFormProps {
  trip?: Trip | null;
  onSubmit: (trip: Omit<Trip, 'id'>) => void;
  onCancel: () => void;
}

const TripForm = ({ trip, onSubmit, onCancel }: TripFormProps) => {
  const [countryCode, setCountryCode] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');

  useEffect(() => {
    if (trip) {
      setCountryCode(trip.countryCode);
      setEntryDate(new Date(trip.entryDate).toISOString().split('T')[0]);
      setExitDate(new Date(trip.exitDate).toISOString().split('T')[0]);
    }
  }, [trip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!countryCode || !entryDate || !exitDate) {
      alert('Заполните все поля');
      return;
    }

    if (new Date(exitDate) <= new Date(entryDate)) {
      alert('Дата выезда должна быть позже даты въезда');
      return;
    }

    onSubmit({
      countryCode: countryCode.toUpperCase(),
      entryDate: new Date(entryDate),
      exitDate: new Date(exitDate)
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-title">
        {trip ? 'Редактировать поездку' : 'Добавить поездку'}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Код страны</label>
          <input
            type="text"
            className="form-input"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            placeholder="DE, FR, IT..."
            maxLength={2}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Дата въезда</label>
          <input
            type="date"
            className="form-input"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Дата выезда</label>
          <input
            type="date"
            className="form-input"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn flex-1">
            {trip ? 'Обновить' : 'Добавить'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary flex-1"
            onClick={onCancel}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
