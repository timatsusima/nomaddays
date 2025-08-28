import { Trip, RuleProfile, RuleResult, ForecastRequest, ForecastResult, DateRange } from './types';
import { calculateSlidingWindow, calculateCalendarYear, calculateRolling12Months, calculateDaysInWindow, findNextRiskDate } from './date-windows';
import dayjs from 'dayjs';

export class RulesEngine {
  /**
   * Рассчитывает прогноз для планируемой поездки
   */
  static async calculateForecast(
    request: ForecastRequest,
    trips: Trip[],
    rules: RuleProfile[]
  ): Promise<ForecastResult> {
    const { plannedTrip } = request;
    
    // Конвертируем поездки в формат DateRange
    const tripRanges: DateRange[] = trips.map(trip => ({
      start: trip.entryDate,
      end: trip.exitDate
    }));

    // Добавляем планируемую поездку
    const allTrips = [...tripRanges, plannedTrip];

    // Рассчитываем результат для каждого правила
    const ruleResults: RuleResult[] = [];
    let canTravel = true;

    for (const rule of rules) {
      if (!rule.enabled) continue;

      const result = this.calculateRuleResult(rule, allTrips, plannedTrip);
      ruleResults.push(result);

      // Если хотя бы одно правило не соблюдается, поездка невозможна
      if (!result.isCompliant) {
        canTravel = false;
      }
    }

    return {
      canTravel,
      results: ruleResults,
      plannedTrip,
      totalDays: this.calculateTotalDaysOutside(allTrips)
    };
  }

  /**
   * Рассчитывает результат для конкретного правила
   */
  private static calculateRuleResult(
    rule: RuleProfile,
    trips: DateRange[],
    plannedTrip: DateRange
  ): RuleResult {
    const { key, params } = rule;
    
    let usedDays = 0;
    let availableDays = 0;
    let explanation = '';
    let severity: 'OK' | 'WARNING' | 'RISK' = 'OK';

    if (params.minDaysInCountry && params.countryCode) {
      // Требование минимального нахождения в конкретной стране за календарный год
      const currentYear = new Date().getFullYear();
      // Считаем только дни в нужной стране: предполагаем, что входные trips — все поездки,
      // где страна кодируется в расширенном источнике; для простоты считаем общие дни,
      // если планируемое правило ориентируется на общие дни пребывания в стране,
      // нужно иметь фильтрацию по стране в Trips (в дальнейшем можно хранить countryCode в DateRange).
      // Здесь приближение: используем все дни пользователя в году как прокси, так как текущая модель DateRange не несёт country.
      const yearCalc = calculateCalendarYear(trips, currentYear);
      usedDays = yearCalc.daysInWindow;
      availableDays = Math.max(0, (params.minDaysInCountry || 0) - usedDays);
      if (usedDays < (params.minDaysInCountry || 0)) {
        severity = 'RISK';
        explanation = `За ${currentYear} год в стране требуется минимум ${params.minDaysInCountry} дней. Сейчас: ${usedDays}.`;
      } else if (usedDays < (params.minDaysInCountry || 0) + 20) {
        severity = 'WARNING';
        explanation = `Достигнут минимум ${usedDays}/${params.minDaysInCountry} дней пребывания за ${currentYear} год.`;
      } else {
        explanation = `Выполнен минимум ${usedDays}/${params.minDaysInCountry} дней пребывания за ${currentYear} год.`;
      }
    } else if (params.nDays && params.mDays) {
      // Скользящее окно N из M дней
      const windows = calculateSlidingWindow(trips, params.nDays, params.mDays);
      const currentWindow = windows[windows.length - 1];
      
      usedDays = currentWindow.daysInWindow;
      availableDays = Math.max(0, params.nDays - usedDays);
      
      if (usedDays >= params.nDays) {
        severity = 'RISK';
        explanation = `В окне ${params.mDays} дней использовано ${usedDays} из ${params.nDays} доступных дней`;
      } else if (usedDays >= params.nDays * 0.8) {
        severity = 'WARNING';
        explanation = `В окне ${params.mDays} дней использовано ${usedDays} из ${params.nDays} доступных дней`;
      } else {
        explanation = `В окне ${params.mDays} дней использовано ${usedDays} из ${params.nDays} доступных дней`;
      }
    } else if (params.maxDaysPerYear && params.calendarYear) {
      // Календарный год
      const currentYear = new Date().getFullYear();
      const yearCalc = calculateCalendarYear(trips, currentYear);
      
      usedDays = yearCalc.daysInWindow;
      availableDays = Math.max(0, params.maxDaysPerYear - usedDays);
      
      if (usedDays >= params.maxDaysPerYear) {
        severity = 'RISK';
        explanation = `В ${currentYear} году использовано ${usedDays} из ${params.maxDaysPerYear} доступных дней`;
      } else if (usedDays >= params.maxDaysPerYear * 0.8) {
        severity = 'WARNING';
        explanation = `В ${currentYear} году использовано ${usedDays} из ${params.maxDaysPerYear} доступных дней`;
      } else {
        explanation = `В ${currentYear} году использовано ${usedDays} из ${params.maxDaysPerYear} доступных дней`;
      }
    } else if (params.maxDaysOutside && params.rolling12Months) {
      // Скользящие 12 месяцев
      const rollingCalc = calculateRolling12Months(trips);
      const totalDays = rollingCalc.reduce((sum, month) => sum + month.daysInWindow, 0);
      
      usedDays = totalDays;
      availableDays = Math.max(0, params.maxDaysOutside - usedDays);
      
      if (usedDays >= params.maxDaysOutside) {
        severity = 'RISK';
        explanation = `В скользящих 12 месяцах использовано ${usedDays} из ${params.maxDaysOutside} доступных дней`;
      } else if (usedDays >= params.maxDaysOutside * 0.8) {
        severity = 'WARNING';
        explanation = `В скользящих 12 месяцах использовано ${usedDays} из ${params.maxDaysOutside} доступных дней`;
      } else {
        explanation = `В скользящих 12 месяцах использовано ${usedDays} из ${params.maxDaysOutside} доступных дней`;
      }
    }

    return {
      ruleKey: key,
      ruleName: params.name || key,
      isCompliant: usedDays < (params.nDays || params.maxDaysPerYear || params.maxDaysOutside || 0),
      usedDays,
      availableDays,
      severity,
      explanation
    };
  }

  /**
   * Агрегирует результаты нескольких правил
   */
  static aggregateResults(results: RuleResult[]): ForecastResult {
    const canTravel = results.every(r => r.isCompliant);
    const totalDays = results.reduce((sum, r) => sum + r.usedDays, 0);

    return {
      canTravel,
      results,
      totalDays,
      plannedTrip: { start: new Date(), end: new Date() } // Заглушка
    };
  }

  /**
   * Рассчитывает общее количество дней вне страны
   */
  static calculateTotalDaysOutside(trips: DateRange[]): number {
    return trips.reduce((total, trip) => {
      const days = dayjs(trip.end).diff(dayjs(trip.start), 'day') + 1;
      return total + days;
    }, 0);
  }

  /**
   * Проверяет, можно ли добавить поездку
   */
  static canAddTrip(
    newTrip: DateRange,
    existingTrips: DateRange[],
    rules: RuleProfile[]
  ): boolean {
    const allTrips = [...existingTrips, newTrip];
    
    for (const rule of rules) {
      if (!rule.enabled) continue;
      
      const result = this.calculateRuleResult(rule, allTrips, newTrip);
      if (!result.isCompliant) {
        return false;
      }
    }
    
    return true;
  }
}
