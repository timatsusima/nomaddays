// Trips Page v3.1 - Fixed CountrySelector
// Build: 2024-08-27 21:10
// Cache: NO-CACHE-HEADERS

'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { CountrySelector } from '@/components/CountrySelector';

interface Trip {
  id: string;
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    countryCode: '',
    entryDate: '',
    exitDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      // Silent fail for production
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ countryCode: '', entryDate: '', exitDate: '' });
        setShowForm(false);
        loadTrips();
      }
    } catch (error) {
      // Silent fail for production
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      countryCode: trip.countryCode,
      entryDate: trip.entryDate,
      exitDate: trip.exitDate
    });
    setShowForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    try {
      const response = await fetch(`/api/trips`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTrip.id,
          ...formData
        })
      });

      if (response.ok) {
        setEditingTrip(null);
        setFormData({ countryCode: '', entryDate: '', exitDate: '' });
        setShowForm(false);
        loadTrips();
      }
    } catch (error) {
      // Silent fail for production
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/trips`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        loadTrips();
      }
    } catch (error) {
      // Silent fail for production
    }
  };

  const resetForm = () => {
    setFormData({ countryCode: '', entryDate: '', exitDate: '' });
    setEditingTrip(null);
    setShowForm(false);
  };

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
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Поездки</h1>
        <p className="text-[var(--text-secondary)]">Управляйте своими поездками</p>
      </div>

      {/* Add Trip Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn w-full"
        >
          {showForm ? 'Скрыть форму' : 'Добавить поездку'}
        </button>
      </div>

      {/* Add Trip Form */}
      {showForm && (
        <div className="card mx-4 mb-6">
          <div className="card-title">
            {editingTrip ? 'Редактировать поездку' : 'Добавить поездку'}
          </div>
          <form onSubmit={editingTrip ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Страна</label>
              <CountrySelector
                value={formData.countryCode}
                onChange={(countryCode) => setFormData({ ...formData, countryCode })}
                placeholder="Выберите страну"
              />
            </div>
            <div>
              <label className="form-label">Дата въезда</label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Дата выезда</label>
              <input
                type="date"
                value={formData.exitDate}
                onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn flex-1">
                {editingTrip ? 'Сохранить' : 'Добавить'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trips List */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Список поездок</h2>
        {trips.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-4xl mb-4">✈️</div>
            <div className="text-[var(--text-secondary)] mb-2">Нет поездок</div>
            <div className="text-sm text-[var(--text-secondary)] mb-4">
              Добавьте первую поездку, чтобы начать отслеживание
            </div>
            <button onClick={() => setShowForm(true)} className="btn">
              Добавить поездку
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div key={trip.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[var(--text)]">{trip.countryCode}</div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="text-[var(--brand)] hover:text-[var(--brand-hover)]"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-[var(--red)] hover:text-[var(--red)]"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
