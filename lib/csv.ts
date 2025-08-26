import { Trip } from '@/core/rules/types';
import dayjs from 'dayjs';

export interface CSVRow {
  country: string;
  entryDate: string;
  exitDate: string;
}

export interface CSVImportResult {
  success: boolean;
  trips: Trip[];
  errors: string[];
}

/**
 * Парсит CSV строку в объект поездки
 */
export function parseCSVRow(row: string): CSVRow | null {
  try {
    const columns = row.split(',').map(col => col.trim().replace(/"/g, ''));
    
    if (columns.length < 3) {
      return null;
    }
    
    return {
      country: columns[0],
      entryDate: columns[1],
      exitDate: columns[2]
    };
  } catch (error) {
    return null;
  }
}

/**
 * Импортирует CSV файл с поездками
 */
export function importTripsFromCSV(csvContent: string): CSVImportResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const trips: Trip[] = [];
  const errors: string[] = [];
  
  // Пропускаем заголовок
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = parseCSVRow(line);
    
    if (!row) {
      errors.push(`Строка ${i + 1}: Неверный формат`);
      continue;
    }
    
    // Валидируем даты
    const entryDate = dayjs(row.entryDate);
    const exitDate = dayjs(row.exitDate);
    
    if (!entryDate.isValid()) {
      errors.push(`Строка ${i + 1}: Неверная дата въезда: ${row.entryDate}`);
      continue;
    }
    
    if (!exitDate.isValid()) {
      errors.push(`Строка ${i + 1}: Неверная дата выезда: ${row.exitDate}`);
      continue;
    }
    
    if (exitDate.isBefore(entryDate)) {
      errors.push(`Строка ${i + 1}: Дата выезда раньше даты въезда`);
      continue;
    }
    
    // Валидируем код страны
    if (!row.country || row.country.length !== 2) {
      errors.push(`Строка ${i + 1}: Неверный код страны: ${row.country}`);
      continue;
    }
    
    trips.push({
      id: `imported-${i}`,
      countryCode: row.country.toUpperCase(),
      entryDate: entryDate.toDate(),
      exitDate: exitDate.toDate()
    });
  }
  
  return {
    success: errors.length === 0,
    trips,
    errors
  };
}

/**
 * Экспортирует поездки в CSV формат
 */
export function exportTripsToCSV(trips: Trip[]): string {
  const headers = ['country,entryDate,exitDate'];
  const rows = trips.map(trip => 
    `${trip.countryCode},${dayjs(trip.entryDate).format('YYYY-MM-DD')},${dayjs(trip.exitDate).format('YYYY-MM-DD')}`
  );
  
  return [...headers, ...rows].join('\n');
}

/**
 * Создаёт шаблон CSV для импорта
 */
export function createCSVTemplate(): string {
  return 'country,entryDate,exitDate\nDE,2024-01-01,2024-01-15\nFR,2024-02-01,2024-02-10';
}

/**
 * Валидирует формат CSV файла
 */
export function validateCSVFormat(csvContent: string): boolean {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return false;
  }
  
  const header = lines[0].toLowerCase();
  const requiredColumns = ['country', 'entrydate', 'exitdate'];
  
  return requiredColumns.every(col => header.includes(col));
}
