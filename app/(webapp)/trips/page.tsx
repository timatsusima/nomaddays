// Trips Page v3.0 - FORCE REFRESH
// Build: 2024-08-27 21:00
// Cache: NO-CACHE-HEADERS

'use client';

import { useState, useEffect } from 'react';
import { CountrySelector } from '@/components/CountrySelector';
import { Button } from '@/components/ui/Button';
import Navigation from '@/components/Navigation';

// Импортируем COUNTRIES для функций getCountryFlag и getCountryName
const COUNTRIES = [
  { code: 'DE', name: 'Германия', flag: '🇩🇪' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸' },
  { code: 'NL', name: 'Нидерланды', flag: '🇳🇱' },
  { code: 'BE', name: 'Бельгия', flag: '🇧🇪' },
  { code: 'AT', name: 'Австрия', flag: '🇦🇹' },
  { code: 'CH', name: 'Швейцария', flag: '🇨🇭' },
  { code: 'PL', name: 'Польша', flag: '🇵🇱' },
  { code: 'CZ', name: 'Чехия', flag: '🇨🇿' },
  { code: 'HU', name: 'Венгрия', flag: '🇭🇺' },
  { code: 'SK', name: 'Словакия', flag: '🇸🇰' },
  { code: 'PT', name: 'Португалия', flag: '🇵🇹' },
  { code: 'IE', name: 'Ирландия', flag: '🇮🇪' },
  { code: 'FI', name: 'Финляндия', flag: '🇫🇮' },
  { code: 'SE', name: 'Швеция', flag: '🇸🇪' },
  { code: 'DK', name: 'Дания', flag: '🇩🇰' },
  { code: 'NO', name: 'Норвегия', flag: '🇳🇴' },
  { code: 'IS', name: 'Исландия', flag: '🇮🇸' },
  { code: 'EE', name: 'Эстония', flag: '🇪🇪' },
  { code: 'LV', name: 'Латвия', flag: '🇱🇻' },
  { code: 'LT', name: 'Литва', flag: '🇱🇹' },
  { code: 'LU', name: 'Люксембург', flag: '🇱🇺' },
  { code: 'MT', name: 'Мальта', flag: '🇲🇹' },
  { code: 'CY', name: 'Кипр', flag: '🇨🇾' },
  { code: 'US', name: 'США', flag: '🇺🇸' },
  { code: 'CA', name: 'Канада', flag: '🇨🇦' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧' },
  { code: 'AU', name: 'Австралия', flag: '🇦🇺' },
  { code: 'NZ', name: 'Новая Зеландия', flag: '🇳🇿' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵' },
  { code: 'KR', name: 'Южная Корея', flag: '🇰🇷' },
  { code: 'SG', name: 'Сингапур', flag: '🇸🇬' },
  { code: 'TH', name: 'Таиланд', flag: '🇹🇭' },
  { code: 'VN', name: 'Вьетнам', flag: '🇻🇳' },
  { code: 'MY', name: 'Малайзия', flag: '🇲🇾' },
  { code: 'ID', name: 'Индонезия', flag: '🇮🇩' },
  { code: 'PH', name: 'Филиппины', flag: '🇵🇭' },
  { code: 'IN', name: 'Индия', flag: '🇮🇳' },
  { code: 'BR', name: 'Бразилия', flag: '🇧🇷' },
  { code: 'AR', name: 'Аргентина', flag: '🇦🇷' },
  { code: 'MX', name: 'Мексика', flag: '🇲🇽' },
  { code: 'CL', name: 'Чили', flag: '🇨🇱' },
  { code: 'CO', name: 'Колумбия', flag: '🇨🇴' },
  { code: 'PE', name: 'Перу', flag: '🇵🇪' },
  { code: 'UY', name: 'Уругвай', flag: '🇺🇾' },
  { code: 'ZA', name: 'ЮАР', flag: '🇿🇦' },
  { code: 'EG', name: 'Египет', flag: '🇪🇬' },
  { code: 'MA', name: 'Марокко', flag: '🇲🇦' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷' },
  { code: 'IL', name: 'Израиль', flag: '🇮🇱' },
  { code: 'AE', name: 'ОАЭ', flag: '🇦🇪' },
  { code: 'SA', name: 'Саудовская Аравия', flag: '🇸🇦' },
  { code: 'QA', name: 'Катар', flag: '🇶🇦' },
  { code: 'KW', name: 'Кувейт', flag: '🇰🇼' },
  { code: 'BH', name: 'Бахрейн', flag: '🇧🇭' },
  { code: 'OM', name: 'Оман', flag: '🇴🇲' },
  { code: 'JO', name: 'Иордания', flag: '🇯🇴' },
  { code: 'LB', name: 'Ливан', flag: '🇱🇧' },
  { code: 'SY', name: 'Сирия', flag: '🇸🇾' },
  { code: 'IQ', name: 'Ирак', flag: '🇮🇶' },
  { code: 'IR', name: 'Иран', flag: '🇮🇷' },
  { code: 'AF', name: 'Афганистан', flag: '🇦🇫' },
  { code: 'PK', name: 'Пакистан', flag: '🇵🇰' },
  { code: 'BD', name: 'Бангладеш', flag: '🇧🇩' },
  { code: 'LK', name: 'Шри-Ланка', flag: '🇱🇰' },
  { code: 'NP', name: 'Непал', flag: '🇳🇵' },
  { code: 'BT', name: 'Бутан', flag: '🇧🇹' },
  { code: 'MM', name: 'Мьянма', flag: '🇲🇲' },
  { code: 'LA', name: 'Лаос', flag: '🇱🇦' },
  { code: 'KH', name: 'Камбоджа', flag: '🇰🇭' },
  { code: 'MN', name: 'Монголия', flag: '🇲🇳' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿' },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿' },
  { code: 'KG', name: 'Кыргызстан', flag: '🇰🇬' },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯' },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲' },
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿' },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪' },
  { code: 'AM', name: 'Армения', flag: '🇦🇲' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦' },
  { code: 'MD', name: 'Молдова', flag: '🇲🇩' },
  { code: 'RS', name: 'Сербия', flag: '🇷🇸' },
  { code: 'ME', name: 'Черногория', flag: '🇲🇪' },
  { code: 'BA', name: 'Босния и Герцеговина', flag: '🇧🇦' },
  { code: 'MK', name: 'Северная Македония', flag: '🇲🇰' },
  { code: 'AL', name: 'Албания', flag: '🇦🇱' },
  { code: 'XK', name: 'Косово', flag: '🇽🇰' },
  { code: 'AD', name: 'Андорра', flag: '🇱🇮' },
  { code: 'LI', name: 'Лихтенштейн', flag: '🇱🇮' },
  { code: 'MC', name: 'Монако', flag: '🇲🇨' },
  { code: 'SM', name: 'Сан-Марино', flag: '🇸🇲' },
  { code: 'VA', name: 'Ватикан', flag: '🇻🇦' },
  { code: 'OUTSIDE', name: 'Вне РК', flag: '🌍' }
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    countryCode: '',
    entryDate: '',
    exitDate: ''
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      // Silent fail for production - don't spam console
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTrip ? `/api/trips/${editingTrip.id}` : '/api/trips';
      const method = editingTrip ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTrips();
        resetForm();
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

  const handleDelete = async (tripId: string) => {
    if (confirm('Удалить поездку?')) {
      try {
        const response = await fetch(`/api/trips/${tripId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchTrips();
        }
      } catch (error) {
        // Silent fail for production
      }
    }
  };

  const resetForm = () => {
    setFormData({ countryCode: '', entryDate: '', exitDate: '' });
    setEditingTrip(null);
    setShowForm(false);
  };

  const getCountryFlag = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    return country?.flag || '🏳️';
  };

  const getCountryName = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    return country?.name || countryCode;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка поездок...</p>
        </div>
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
          <div className="card-title">Добавить поездку</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Страна</label>
              <CountrySelector
                value={formData.countryCode}
                onChange={(countryCode) => setFormData({ ...formData, countryCode })}
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
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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

      {/* Edit Modal */}
      {editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Редактировать поездку</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Страна</label>
                <CountrySelector
                  value={editingTrip.countryCode}
                  onChange={(countryCode) => setEditingTrip({ ...editingTrip, countryCode })}
                />
              </div>
              <div>
                <label className="form-label">Дата въезда</label>
                <input
                  type="date"
                  value={editingTrip.entryDate}
                  onChange={(e) => setEditingTrip({ ...editingTrip, entryDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Дата выезда</label>
                <input
                  type="date"
                  value={editingTrip.exitDate}
                  onChange={(e) => setEditingTrip({ ...editingTrip, exitDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn flex-1">
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrip(null)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation />
    </div>
  );
}
