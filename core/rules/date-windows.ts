import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateRange {
  start: Date;
  end: Date;
}

export interface WindowCalculation {
  windowStart: Date;
  windowEnd: Date;
  daysInWindow: number;
  totalDays: number;
}

/**
 * Рассчитывает скользящее окно N из M дней
 */
export function calculateSlidingWindow(
  trips: DateRange[],
  nDays: number,
  mDays: number,
  referenceDate: Date = new Date()
): WindowCalculation[] {
  const results: WindowCalculation[] = [];
  const reference = dayjs(referenceDate);

  // Рассчитываем окна для последних M дней
  for (let i = 0; i < mDays; i++) {
    const windowStart = reference.subtract(mDays - i - 1, 'day');
    const windowEnd = reference.add(i, 'day');

    let daysInWindow = 0;
    let totalDays = 0;

    // Подсчитываем дни в текущем окне
    for (const trip of trips) {
      const tripStart = dayjs(trip.start);
      const tripEnd = dayjs(trip.end);

      // Проверяем пересечение с окном
      if (tripStart.isBefore(windowEnd) && tripEnd.isAfter(windowStart)) {
        const overlapStart = tripStart.isAfter(windowStart) ? tripStart : windowStart;
        const overlapEnd = tripEnd.isBefore(windowEnd) ? tripEnd : windowEnd;
        
        // Добавляем 1 день, так как день въезда и выезда считаются
        const overlapDays = overlapEnd.diff(overlapStart, 'day') + 1;
        daysInWindow += overlapDays;
      }

      // Подсчитываем общие дни
      totalDays += tripEnd.diff(tripStart, 'day') + 1;
    }

    results.push({
      windowStart: windowStart.toDate(),
      windowEnd: windowEnd.toDate(),
      daysInWindow,
      totalDays
    });
  }

  return results;
}

/**
 * Рассчитывает календарный год
 */
export function calculateCalendarYear(
  trips: DateRange[],
  year: number
): WindowCalculation {
  const yearStart = dayjs(`${year}-01-01`);
  const yearEnd = dayjs(`${year}-12-31`);

  let daysInYear = 0;
  let totalDays = 0;

  for (const trip of trips) {
    const tripStart = dayjs(trip.start);
    const tripEnd = dayjs(trip.end);

    if (tripStart.year() === year || tripEnd.year() === year) {
      const overlapStart = tripStart.isAfter(yearStart) ? tripStart : yearStart;
      const overlapEnd = tripEnd.isBefore(yearEnd) ? tripEnd : yearEnd;
      
      const overlapDays = overlapEnd.diff(overlapStart, 'day') + 1;
      daysInYear += overlapDays;
    }

    totalDays += tripEnd.diff(tripStart, 'day') + 1;
  }

  return {
    windowStart: yearStart.toDate(),
    windowEnd: yearEnd.toDate(),
    daysInWindow: daysInYear,
    totalDays
  };
}

/**
 * Рассчитывает скользящие 12 месяцев
 */
export function calculateRolling12Months(
  trips: DateRange[],
  referenceDate: Date = new Date()
): WindowCalculation[] {
  const results: WindowCalculation[] = [];
  const reference = dayjs(referenceDate);

  for (let i = 0; i < 12; i++) {
    const monthStart = reference.subtract(11 - i, 'month').startOf('month');
    const monthEnd = monthStart.endOf('month');

    let daysInMonth = 0;
    let totalDays = 0;

    for (const trip of trips) {
      const tripStart = dayjs(trip.start);
      const tripEnd = dayjs(trip.end);

      if (tripStart.isBefore(monthEnd) && tripEnd.isAfter(monthStart)) {
        const overlapStart = tripStart.isAfter(monthStart) ? tripStart : monthStart;
        const overlapEnd = tripEnd.isBefore(monthEnd) ? tripEnd : monthEnd;
        
        const overlapDays = overlapEnd.diff(overlapStart, 'day') + 1;
        daysInMonth += overlapDays;
      }

      totalDays += tripEnd.diff(tripStart, 'day') + 1;
    }

    results.push({
      windowStart: monthStart.toDate(),
      windowEnd: monthEnd.toDate(),
      daysInWindow: daysInMonth,
      totalDays
    });
  }

  return results;
}

/**
 * Подсчитывает дни в окне
 */
export function calculateDaysInWindow(
  trips: DateRange[],
  windowStart: Date,
  windowEnd: Date
): number {
  let days = 0;

  for (const trip of trips) {
    const tripStart = dayjs(trip.start);
    const tripEnd = dayjs(trip.end);

    if (tripStart.isBefore(windowEnd) && tripEnd.isAfter(windowStart)) {
      const overlapStart = tripStart.isAfter(windowStart) ? tripStart : dayjs(windowStart);
      const overlapEnd = tripEnd.isBefore(windowEnd) ? tripEnd : dayjs(windowEnd);
      
      days += overlapEnd.diff(overlapStart, 'day') + 1;
    }
  }

  return days;
}

/**
 * Находит следующую дату риска
 */
export function findNextRiskDate(
  trips: DateRange[],
  maxDays: number,
  windowSize: number,
  referenceDate: Date = new Date()
): Date | null {
  const reference = dayjs(referenceDate);

  for (let i = 0; i < windowSize; i++) {
    const windowStart = reference.add(i, 'day');
    const windowEnd = windowStart.add(windowSize - 1, 'day');

    const daysInWindow = calculateDaysInWindow(trips, windowStart.toDate(), windowEnd.toDate());

    if (daysInWindow >= maxDays) {
      return windowStart.toDate();
    }
  }

  return null;
}

/**
 * Конвертирует дату в указанный часовой пояс
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  return dayjs(date).tz(timezone).toDate();
}

/**
 * Проверяет, находится ли дата в диапазоне
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  const checkDate = dayjs(date);
  const start = dayjs(range.start);
  const end = dayjs(range.end);
  
  return checkDate.isAfter(start) && checkDate.isBefore(end);
}
