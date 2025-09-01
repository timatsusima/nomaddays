'use client';

import { useState, useEffect } from 'react';
import { CountrySelector } from '@/components/CountrySelector';
import Navigation from '@/components/Navigation';
import { SwipeableTripItem } from '@/components/SwipeableTripItem';
import { resolveCountryName, countryFlag } from '@/lib/countries';

interface Trip {
  id: string;
  countryCode: string;
  entryDate: string;
  exitDate: string;
}

type NotesMap = Record<string, string>;

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [notesMap, setNotesMap] = useState<NotesMap>({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: '',
    entryDate: '',
    exitDate: '',
    notes: ''
  });
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'planned'>('all');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('nomaddays_trip_notes') : null;
    if (saved) setNotesMap(JSON.parse(saved));
    loadTrips();
  }, []);

  const persistNotes = (next: NotesMap) => {
    setNotesMap(next);
    if (typeof window !== 'undefined') localStorage.setItem('nomaddays_trip_notes', JSON.stringify(next));
  };

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
    if (formData.notes.length > 256) {
      alert('Комментарий не должен превышать 256 символов');
      return;
    }

    try {
      setIsLoading(true);
      const url = '/api/trips';
      const method = editingTrip ? 'PUT' : 'POST';
      
      const body = editingTrip 
        ? { countryCode: formData.countryCode, entryDate: formData.entryDate, exitDate: formData.exitDate, id: editingTrip.id }
        : { countryCode: formData.countryCode, entryDate: formData.entryDate, exitDate: formData.exitDate };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        // Сохраняем комментарий локально
        const newId = editingTrip ? editingTrip.id : result.id;
        if (formData.notes) {
          const next = { ...notesMap, [newId]: formData.notes };
          persistNotes(next);
        }
        await loadTrips();
        setFormData({ countryCode: '', entryDate: '', exitDate: '', notes: '' });
        setShowForm(false);
        setEditingTrip(null);
        alert('Поездка сохранена');
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
        const next = { ...notesMap };
        delete next[tripId];
        persistNotes(next);
        await loadTrips();
        alert('Поездка удалена!');
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
      notes: notesMap[trip.id] || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ countryCode: '', entryDate: '', exitDate: '', notes: '' });
    setEditingTrip(null);
    setShowForm(false);
  };

  const filteredTrips = trips.filter(trip => {
    const entry = new Date(trip.entryDate);
    const exit = new Date(trip.exitDate);
    const now = new Date();
    switch (filter) {
      case 'completed': return exit < now;
      case 'ongoing': return entry <= now && exit >= now;
      case 'planned': return entry > now;
      default: return true;
    }
  });

  return (
    <div className="tg-webapp">
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Поездки</h1>
          <p className="text-[var(--text-secondary)]">Управляйте своими поездками</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {showForm ? 'Скрыть форму' : 'Добавить поездку'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <h2 className="card-title">{editingTrip ? 'Редактировать поездку' : 'Добавить поездку'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Страна</label>
                <CountrySelector value={formData.countryCode} onChange={(code) => setFormData({ ...formData, countryCode: code })} placeholder="Выберите страну" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Дата въезда</label>
                  <input type="date" className="form-input" value={formData.entryDate} onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm mb-1">Дата выезда</label>
                  <input type="date" className="form-input" value={formData.exitDate} onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Комментарий (до 256 символов)</label>
                <textarea className="form-input h-24" maxLength={256} placeholder="Например: Отличная поездка, много работы..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="submit" disabled={isLoading} className="flex-1 bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-60 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  {isLoading ? 'Сохранение...' : (editingTrip ? 'Обновить' : 'Добавить')}
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          {isLoading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-8">Нет поездок</div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((t) => {
                const entry = new Date(t.entryDate);
                const exit = new Date(t.exitDate);
                const duration = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const name = resolveCountryName(t.countryCode);
                const note = notesMap[t.id];
                return (
                  <SwipeableTripItem
                    key={t.id}
                    trip={{
                      id: t.id,
                      country: name,
                      countryCode: t.countryCode,
                      flag: countryFlag(t.countryCode),
                      entryDate: entry.toLocaleDateString('ru-RU'),
                      exitDate: exit.toLocaleDateString('ru-RU'),
                      duration,
                      status: exit < new Date() ? 'completed' : entry > new Date() ? 'planned' : 'ongoing',
                      notes: note
                    } as any}
                    onEdit={() => handleEdit(t)}
                    onDelete={() => handleDelete(t.id)}
                  />
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
