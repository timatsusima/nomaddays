export interface DateRange {
  start: Date;
  end: Date;
}

export interface Trip {
  id: string;
  countryCode: string;
  entryDate: Date;
  exitDate: Date;
}

export interface RuleParams {
  // N из M дней (например, 90 из 180)
  nDays?: number;
  mDays?: number;
  
  // Календарный год
  calendarYear?: boolean;
  
  // Скользящие 12 месяцев
  rolling12Months?: boolean;
  
  // Максимум дней в году
  maxDaysPerYear?: number;
  
  // Максимум дней вне страны (для резиденции)
  maxDaysOutside?: number;
  
  // Название правила для UI
  name: string;
  
  // Описание правила
  description: string;
}

export interface RuleProfile {
  id: string;
  key: string;
  params: RuleParams;
  enabled: boolean;
}

export interface RuleResult {
  ruleKey: string;
  ruleName: string;
  isCompliant: boolean;
  usedDays: number;
  availableDays: number;
  riskDate?: Date;
  explanation: string;
  severity: 'OK' | 'WARNING' | 'RISK';
}

export interface ForecastRequest {
  plannedTrip: DateRange;
  userId: string;
}

export interface ForecastResult {
  userId: string;
  plannedTrip: DateRange;
  results: RuleResult[];
  summary: {
    canTravel: boolean;
    totalUsedDays: number;
    totalAvailableDays: number;
    nextRiskDate?: Date;
    overallSeverity: 'OK' | 'WARNING' | 'RISK';
  };
}

export interface WindowCalculation {
  startDate: Date;
  endDate: Date;
  usedDays: number;
  availableDays: number;
  isWithinLimit: boolean;
}
