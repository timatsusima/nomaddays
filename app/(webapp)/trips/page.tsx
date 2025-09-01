'use client';

import { useState, useEffect } from 'react';
import { CountrySelector } from '@/components/CountrySelector';
import Navigation from '@/components/Navigation';
import { SwipeableTripItem } from '@/components/SwipeableTripItem';
import { resolveCountryName, countryFlag } from '@/lib/countries';
import FlagIcon from '@/components/FlagIcon';

interface Trip {
  id: string;
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: '',
    entryDate: '',
    exitDate: ''
  });
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'planned'>('all');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      } else {
        console.error('Failed to load trips:', response.status);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.countryCode || !formData.entryDate || !formData.exitDate) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);
      const url = editingTrip ? `/api/trips` : '/api/trips';
      const method = editingTrip ? 'PUT' : 'POST';
      
      const body = editingTrip 
        ? { ...formData, id: editingTrip.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        if (editingTrip) {
          setTrips(trips.map(trip => trip.id === editingTrip.id ? result : trip));
          setEditingTrip(null);
        } else {
          setTrips([...trips, result]);
        }
        setFormData({ countryCode: '', entryDate: '', exitDate: '' });
        setShowForm(false);
        alert(editingTrip ? 'Поездка обновлена!' : 'Поездка добавлена!');
        await loadTrips(); // Перезагружаем список
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Ошибка при сохранении поездки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!confirm('Удалить эту поездку?')) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/trips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tripId })
      });

      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId));
        alert('Поездка удалена!');
        await loadTrips(); // Перезагружаем список
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Ошибка при удалении поездки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      countryCode: trip.countryCode,
      entryDate: trip.entryDate.split('T')[0],
      exitDate: trip.exitDate.split('T')[0],

    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ countryCode: '', entryDate: '', exitDate: '' });
    setEditingTrip(null);
    setShowForm(false);
  };

  // Фильтрация поездок
  const filteredTrips = trips.filter(trip => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    const now = new Date();
    
    switch (filter) {
      case 'completed':
        return exit < now;
      case 'ongoing':
        return entry <= now && exit >= now;
      case 'planned':
        return entry > now;
      default:
        return true;
    }
  });

  return (
    <div className="tg-webapp">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Поездки
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управляйте своими поездками
          </p>
        </div>

        {/* Form Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {showForm ? 'Скрыть форму' : 'Добавить поездку'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingTrip ? 'Редактировать поездку' : 'Добавить поездку'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Страна
                </label>
                <CountrySelector
                  value={formData.countryCode}
                  onChange={(code) => setFormData({ ...formData, countryCode: code })}
                  placeholder="Выберите страну"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата въезда
                </label>
                <input
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата выезда
                </label>
                <input
                  type="date"
                  value={formData.exitDate}
                  onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Сохранение...' : (editingTrip ? 'Обновить' : 'Добавить')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        {trips.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Все
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Завершённые
              </button>
              <button
                onClick={() => setFilter('ongoing')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Текущие
              </button>
              <button
                onClick={() => setFilter('planned')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'planned' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Запланированные
              </button>
            </div>
          </div>
        )}

        {/* Trips List */}
        <div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">Загрузка...</div>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✈️</div>
              <div className="text-gray-500 dark:text-gray-400 mb-2">
                {filter === 'all' ? 'Нет поездок' : `Нет ${filter === 'completed' ? 'завершённых' : filter === 'ongoing' ? 'текущих' : 'запланированных'} поездок`}
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                {filter === 'all' ? 'Добавьте первую поездку, чтобы начать отслеживание' : 'Попробуйте другой фильтр'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((t) => {
                const entry = new Date(t.entryDate);
                const exit = new Date(t.exitDate);
                const duration = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const name = resolveCountryName(t.countryCode);
                return (
                  <div key={t.id} className="flex items-start gap-3">
                    <div className="text-2xl">
                      <FlagIcon code={t.countryCode} />
                    </div>
                    <div className="flex-1">
                      <SwipeableTripItem
                        trip={{
                          id: t.id,
                          country: name,
                          countryCode: t.countryCode,
                          flag: countryFlag(t.countryCode),
                          entryDate: entry.toLocaleDateString('ru-RU'),
                          exitDate: exit.toLocaleDateString('ru-RU'),
                          duration,
                          status: exit < new Date() ? 'completed' : entry > new Date() ? 'planned' : 'ongoing',
                        }}
                        onEdit={() => handleEdit(t)}
                        onDelete={() => handleDelete(t.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
