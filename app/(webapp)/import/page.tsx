'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { importTripsFromCSV, exportTripsToCSV, createCSVTemplate } from '@/lib/csv';
import { Trip } from '@/core/rules/types';

interface ImportResultSuccess {
  success: true;
  trips: Trip[];
  errors: [];
}

interface ImportResultFailure {
  success: false;
  trips: Trip[];
  errors: string[];
}

type ImportResult = ImportResultSuccess | ImportResultFailure;

const ImportPage = () => {
  const [csvContent, setCsvContent] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleImport = () => {
    if (!csvContent.trim()) {
      alert('Введите CSV данные');
      return;
    }

    const result = importTripsFromCSV(csvContent);
    setImportResult(result);

    if (result.success) {
      setTrips(result.trips);
    }
  };

  const handleExport = () => {
    if (trips.length === 0) {
      alert('Нет поездок для экспорта');
      return;
    }

    const csvData = exportTripsToCSV(trips);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const template = createCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCsvContent('');
    setImportResult(null);
    setTrips([]);
  };

  return (
    <div className="tg-webapp">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Импорт/Экспорт</h1>
        <p className="text-gray-600">Загружайте и выгружайте поездки в CSV формате</p>
      </div>

      <div className="card mb-4">
        <div className="card-title">Импорт CSV</div>
        
        <div className="form-group">
          <label className="form-label">CSV данные</label>
          <textarea
            className="form-input"
            rows={8}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="country,entryDate,exitDate&#10;DE,2024-01-01,2024-01-15&#10;FR,2024-02-01,2024-02-10"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={handleImport} className="btn flex-1">
            Импортировать
          </button>
          <button onClick={handleDownloadTemplate} className="btn btn-secondary flex-1">
            Шаблон
          </button>
          <button onClick={handleClear} className="btn btn-secondary flex-1">
            Очистить
          </button>
        </div>
      </div>

      {importResult && (
        <div className="card mb-4">
          <div className="card-title">Результат импорта</div>
          
          {importResult.success ? (
            <div className="p-3 bg-green-50 text-green-800 rounded">
              <p className="font-medium">✅ Импорт успешен!</p>
              <p className="text-sm mt-1">Импортировано {importResult.trips.length} поездок</p>
            </div>
          ) : (
            <div className="p-3 bg-red-50 text-red-800 rounded">
              <p className="font-medium">❌ Ошибки при импорте</p>
              <div className="text-sm mt-2 space-y-1">
                {importResult.errors.map((error, index) => (
                  <p key={index}>• {error}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {trips.length > 0 && (
        <div className="card mb-4">
          <div className="card-title">Импортированные поездки</div>
          
          <div className="space-y-2 mb-4">
            {trips.map((trip, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{trip.countryCode}</span>
                <span className="text-sm text-gray-600">
                  {new Date(trip.entryDate).toLocaleDateString()} - {new Date(trip.exitDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          <button onClick={handleExport} className="btn w-full">
            Экспортировать в CSV
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-title">Формат CSV</div>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• Первая строка должна содержать заголовки: country,entryDate,exitDate</p>
          <p>• Код страны: двухбуквенный ISO код (DE, FR, IT, US)</p>
          <p>• Даты: в формате YYYY-MM-DD</p>
          <p>• Разделитель: запятая</p>
          <p>• Кодировка: UTF-8</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default ImportPage;
