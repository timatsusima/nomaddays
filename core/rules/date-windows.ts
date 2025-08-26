import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DateRange, Trip, WindowCalculation } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateWindowCalculator {
  /**
   * Рассчитывает скользящее окно N из M дней
   */
  static calculateSlidingWindow(
    trips: Trip[],
    nDays: number,
    mDays: number,
    referenceDate: Date = new Date()
  ): WindowCalculation[] {
    const windows: WindowCalculation[] = [];
    const reference = dayjs(referenceDate);
    
    // Создаём окна с шагом в 1 день
    for (let i = 0; i < mDays; i++) {
      const windowStart = reference.subtract(mDays - i, 'day');
      const windowEnd = reference.add(i, 'day');
      
      const usedDays = this.calculateDaysInWindow(trips, windowStart.toDate(), windowEnd.toDate());
      const availableDays = nDays - usedDays;
      
      windows.push({
        startDate: windowStart.toDate(),
        endDate: windowEnd.toDate(),
        usedDays,
        availableDays,
        isWithinLimit: usedDays <= nDays
      });
    }
    
    return windows;
  }
  
  /**
   * Рассчитывает дни в календарном году
   */
  static calculateCalendarYear(
    trips: Trip[],
    year: number
  ): WindowCalculation {
    const yearStart = dayjs(`${year}-01-01`);
    const yearEnd = dayjs(`${year}-12-31`);
    
    const usedDays = this.calculateDaysInWindow(trips, yearStart.toDate(), yearEnd.toDate());
    
    return {
      startDate: yearStart.toDate(),
      endDate: yearEnd.toDate(),
      usedDays,
      availableDays: 365 - usedDays,
      isWithinLimit: usedDays <= 365
    };
  }
  
  /**
   * Рассчитывает скользящие 12 месяцев от указанной даты
   */
  static calculateRolling12Months(
    trips: Trip[],
    referenceDate: Date = new Date()
  ): WindowCalculation {
    const reference = dayjs(referenceDate);
    const startDate = reference.subtract(11, 'month').startOf('month');
    const endDate = reference.endOf('month');
    
    const usedDays = this.calculateDaysInWindow(trips, startDate.toDate(), endDate.toDate());
    
    return {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      usedDays,
      availableDays: 365 - usedDays,
      isWithinLimit: usedDays <= 365
    };
  }
  
  /**
   * Рассчитывает количество дней в указанном окне
   */
  private static calculateDaysInWindow(
    trips: Trip[],
    windowStart: Date,
    windowEnd: Date
  ): number {
    let totalDays = 0;
    
    for (const trip of trips) {
      const tripStart = dayjs(trip.entryDate);
      const tripEnd = dayjs(trip.exitDate);
      
      // Проверяем пересечение с окном
      if (tripStart.isBefore(windowEnd) && tripEnd.isAfter(windowStart)) {
        const overlapStart = dayjs.max(tripStart, dayjs(windowStart));
        const overlapEnd = dayjs.min(tripEnd, dayjs(windowEnd));
        
        // Добавляем 1 день, так как день въезда и выезда считаются
        const overlapDays = overlapEnd.diff(overlapStart, 'day') + 1;
        totalDays += Math.max(0, overlapDays);
      }
    }
    
    return totalDays;
  }
  
  /**
   * Находит ближайшую дату риска для правила
   */
  static findNextRiskDate(
    trips: Trip[],
    ruleParams: any,
    referenceDate: Date = new Date()
  ): Date | undefined {
    const reference = dayjs(referenceDate);
    
    if (ruleParams.nDays && ruleParams.mDays) {
      // Для скользящего окна
      const windows = this.calculateSlidingWindow(trips, ruleParams.nDays, ruleParams.mDays, referenceDate);
      const riskWindow = windows.find(w => !w.isWithinLimit);
      return riskWindow?.startDate;
    }
    
    if (ruleParams.calendarYear) {
      // Для календарного года
      const currentYear = reference.year();
      const yearCalc = this.calculateCalendarYear(trips, currentYear);
      if (!yearCalc.isWithinLimit) {
        return yearCalc.startDate;
      }
    }
    
    if (ruleParams.rolling12Months) {
      // Для скользящих 12 месяцев
      const rollingCalc = this.calculateRolling12Months(trips, referenceDate);
      if (!rollingCalc.isWithinLimit) {
        return rollingCalc.startDate;
      }
    }
    
    return undefined;
  }
  
  /**
   * Конвертирует дату в указанный часовой пояс
   */
  static convertToTimezone(date: Date, timezone: string): Date {
    return dayjs(date).tz(timezone).toDate();
  }
  
  /**
   * Проверяет, находится ли дата в указанном диапазоне
   */
  static isDateInRange(date: Date, range: DateRange): boolean {
    const checkDate = dayjs(date);
    const start = dayjs(range.start);
    const end = dayjs(range.end);
    
    return checkDate.isAfter(start) && checkDate.isBefore(end);
  }
}
