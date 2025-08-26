import { Trip, RuleProfile, RuleResult, ForecastRequest, ForecastResult, DateRange } from './types';
import { DateWindowCalculator } from './date-windows';
import dayjs from 'dayjs';

export class RulesEngine {
  /**
   * Основной метод для расчёта прогноза доступных дней
   */
  static async calculateForecast(
    request: ForecastRequest,
    trips: Trip[],
    activeRules: RuleProfile[]
  ): Promise<ForecastResult> {
    const results: RuleResult[] = [];
    
    // Фильтруем только активные правила
    const enabledRules = activeRules.filter(rule => rule.enabled);
    
    for (const rule of enabledRules) {
      const result = this.calculateRuleResult(rule, trips, request.plannedTrip);
      results.push(result);
    }
    
    // Агрегируем результаты
    const summary = this.aggregateResults(results, request.plannedTrip);
    
    return {
      userId: request.userId,
      plannedTrip: request.plannedTrip,
      results,
      summary
    };
  }
  
  /**
   * Рассчитывает результат для конкретного правила
   */
  private static calculateRuleResult(
    rule: RuleProfile,
    trips: Trip[],
    plannedTrip: DateRange
  ): RuleResult {
    const params = JSON.parse(rule.params);
    let usedDays = 0;
    let availableDays = 0;
    let isCompliant = true;
    let explanation = '';
    let severity: 'OK' | 'WARNING' | 'RISK' = 'OK';
    
    if (params.nDays && params.mDays) {
      // Скользящее окно N из M дней
      const windows = DateWindowCalculator.calculateSlidingWindow(
        trips,
        params.nDays,
        params.mDays
      );
      
      // Находим окно, которое затрагивает планируемую поездку
      const relevantWindow = windows.find(w => 
        DateWindowCalculator.isDateInRange(plannedTrip.start, w) ||
        DateWindowCalculator.isDateInRange(plannedTrip.end, w)
      );
      
      if (relevantWindow) {
        usedDays = relevantWindow.usedDays;
        availableDays = relevantWindow.availableDays;
        isCompliant = relevantWindow.isWithinLimit;
        
        explanation = `В окне ${params.mDays} дней использовано ${usedDays} из ${params.nDays} доступных дней`;
      }
    } else if (params.calendarYear) {
      // Календарный год
      const currentYear = dayjs().year();
      const yearCalc = DateWindowCalculator.calculateCalendarYear(trips, currentYear);
      
      usedDays = yearCalc.usedDays;
      availableDays = yearCalc.availableDays;
      isCompliant = yearCalc.isWithinLimit;
      
      explanation = `В ${currentYear} году использовано ${usedDays} дней`;
    } else if (params.rolling12Months) {
      // Скользящие 12 месяцев
      const rollingCalc = DateWindowCalculator.calculateRolling12Months(trips);
      
      usedDays = rollingCalc.usedDays;
      availableDays = rollingCalc.availableDays;
      isCompliant = rollingCalc.isWithinLimit;
      
      explanation = `В скользящих 12 месяцах использовано ${usedDays} дней`;
    } else if (params.maxDaysOutside) {
      // Максимум дней вне страны
      const totalDays = this.calculateTotalDaysOutside(trips);
      usedDays = totalDays;
      availableDays = params.maxDaysOutside - totalDays;
      isCompliant = totalDays <= params.maxDaysOutside;
      
      explanation = `Всего дней вне страны: ${totalDays} из ${params.maxDaysOutside} максимально допустимых`;
    }
    
    // Определяем уровень риска
    if (!isCompliant) {
      severity = 'RISK';
    } else if (availableDays < 30) {
      severity = 'WARNING';
    } else {
      severity = 'OK';
    }
    
    // Находим ближайшую дату риска
    const riskDate = DateWindowCalculator.findNextRiskDate(trips, params);
    
    return {
      ruleKey: rule.key,
      ruleName: params.name,
      isCompliant,
      usedDays,
      availableDays,
      riskDate,
      explanation,
      severity
    };
  }
  
  /**
   * Агрегирует результаты всех правил
   */
  private static aggregateResults(
    results: RuleResult[],
    plannedTrip: DateRange
  ): ForecastResult['summary'] {
    const totalUsedDays = results.reduce((sum, r) => sum + r.usedDays, 0);
    const totalAvailableDays = results.reduce((sum, r) => sum + r.availableDays, 0);
    
    // Определяем общий уровень риска (fail-fast)
    let overallSeverity: 'OK' | 'WARNING' | 'RISK' = 'OK';
    if (results.some(r => r.severity === 'RISK')) {
      overallSeverity = 'RISK';
    } else if (results.some(r => r.severity === 'WARNING')) {
      overallSeverity = 'WARNING';
    }
    
    // Можно ли путешествовать (все правила соблюдены)
    const canTravel = results.every(r => r.isCompliant);
    
    // Находим ближайшую дату риска среди всех правил
    const riskDates = results
      .filter(r => r.riskDate)
      .map(r => r.riskDate!)
      .sort((a, b) => a.getTime() - b.getTime());
    
    const nextRiskDate = riskDates[0];
    
    return {
      canTravel,
      totalUsedDays,
      totalAvailableDays,
      nextRiskDate,
      overallSeverity
    };
  }
  
  /**
   * Рассчитывает общее количество дней вне страны
   */
  private static calculateTotalDaysOutside(trips: Trip[]): number {
    let totalDays = 0;
    
    for (const trip of trips) {
      const entry = dayjs(trip.entryDate);
      const exit = dayjs(trip.exitDate);
      const days = exit.diff(entry, 'day') + 1; // +1 для включения дня въезда
      totalDays += days;
    }
    
    return totalDays;
  }
  
  /**
   * Проверяет, можно ли добавить планируемую поездку
   */
  static canAddTrip(
    newTrip: Trip,
    existingTrips: Trip[],
    activeRules: RuleProfile[]
  ): { canAdd: boolean; reason?: string } {
    // Создаём временный список поездок с новой поездкой
    const tempTrips = [...existingTrips, newTrip];
    
    // Создаём фиктивный запрос для проверки
    const request: ForecastRequest = {
      plannedTrip: {
        start: new Date(),
        end: new Date()
      },
      userId: 'temp'
    };
    
    try {
      const forecast = this.calculateForecast(request, tempTrips, activeRules);
      
      if (forecast.summary.canTravel) {
        return { canAdd: true };
      } else {
        return { 
          canAdd: false, 
          reason: 'Добавление поездки нарушит лимиты правил' 
        };
      }
    } catch (error) {
      return { 
        canAdd: false, 
        reason: 'Ошибка при проверке правил' 
      };
    }
  }
}
