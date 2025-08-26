'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import TripForm from '@/components/TripForm';
import TripsTable from '@/components/TripsTable';
import { Trip } from '@/core/rules/types';

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Загрузить поездки с API
    setLoading(false);
  }, []);

  const handleAddTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`
    };
    setTrips([...trips, newTrip]);
    setShowForm(false);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    setEditingTrip(null);
    setShowForm(false);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Удалить поездку?')) {
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  if (loading) {
    return (
      <div className="tg-webapp">
        <div className="text-center mt-4">
          <p>Загрузка...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="tg-webapp">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Поездки</h1>
        <button 
          className="btn w-full"
          onClick={() => setShowForm(true)}
        >
          Добавить поездку
        </button>
      </div>

      {showForm && (
        <TripForm
          trip={editingTrip}
          onSubmit={editingTrip ? handleUpdateTrip : handleAddTrip}
          onCancel={() => {
            setShowForm(false);
            setEditingTrip(null);
          }}
        />
      )}

      <TripsTable
        trips={trips}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
      />

      <Navigation />
    </div>
  );
};

export default TripsPage;
