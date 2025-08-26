'use client';

import { Trip } from '@/core/rules/types';

interface TripsTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
}

const TripsTable = ({ trips, onEdit, onDelete }: TripsTableProps) => {
  if (trips.length === 0) {
    return (
      <div className="card">
        <div className="text-center text-gray-500 py-8">
          <p>Нет поездок</p>
          <p className="text-sm mt-2">Добавьте первую поездку</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Список поездок</div>
      
      <div className="space-y-3">
        {trips.map((trip) => (
          <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{trip.countryCode}</div>
              <div className="text-sm text-gray-600">
                {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {Math.ceil((new Date(trip.exitDate).getTime() - new Date(trip.entryDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} дней
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(trip)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(trip.id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsTable;
