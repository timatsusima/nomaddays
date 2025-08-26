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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Поездки</h1>
            <p className="text-gray-600">Управляйте своими поездками</p>
          </div>

          {/* Add Trip Button */}
          <div className="mb-8">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Добавить поездку
            </Button>
          </div>

          {/* Trip Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingTrip ? 'Редактировать поездку' : 'Добавить поездку'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Страна
                  </label>
                  <CountrySelector
                    value={formData.countryCode}
                    onChange={(code) => setFormData({ ...formData, countryCode: code })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата въезда
                    </label>
                    <input
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата выезда
                    </label>
                    <input
                      type="date"
                      value={formData.exitDate}
                      onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingTrip ? 'Обновить' : 'Добавить'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Trips List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Список поездок</h2>
            
            {trips.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-300 text-6xl mb-4">✈️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет поездок</h3>
                <p className="text-gray-500 mb-6">Добавьте первую поездку, чтобы начать отслеживание</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Добавить поездку
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {trips.map((trip) => (
                  <div key={trip.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getCountryFlag(trip.countryCode)}</div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {getCountryName(trip.countryCode)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {Math.ceil((new Date(trip.exitDate).getTime() - new Date(trip.entryDate).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                          <div className="text-sm text-gray-500">дней</div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(trip)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
