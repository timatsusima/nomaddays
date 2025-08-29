export interface DateRange {
  start: Date;
  end: Date;
  countryCode?: string;
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

  // Минимум дней в конкретной стране (например, для ВНЖ/РВП)
  minDaysInCountry?: number;
  countryCode?: string;
  
  // Название правила для UI
  name: string;
  
  // Описание правила
  description: string;
}

// Тип для базы данных (Prisma)
export interface RuleProfileDB {
  id: string;
  userId?: string;
  key: string;
  params: string; // JSON string в базе данных
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Тип для API (с распарсенными params)
export interface RuleProfile {
  id: string;
  userId?: string;
  key: string;
  params: RuleParams; // Объект RuleParams
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  residenceCountry?: string;
}

export interface ForecastResult {
  canTravel: boolean;
  results: RuleResult[];
  plannedTrip: DateRange;
  totalDays: number;
  userId?: string;
  summary?: {
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

// Утилиты для конвертации между типами
export function parseRuleParams(paramsString: string): RuleParams {
  try {
    return JSON.parse(paramsString);
  } catch (error) {
    throw new Error(`Failed to parse rule params: ${error}`);
  }
}

export function stringifyRuleParams(params: RuleParams): string {
  return JSON.stringify(params);
}

export function convertDBToRuleProfile(dbRule: RuleProfileDB): RuleProfile {
  return {
    id: dbRule.id,
    userId: dbRule.userId,
    key: dbRule.key,
    params: parseRuleParams(dbRule.params),
    enabled: dbRule.enabled,
    createdAt: dbRule.createdAt,
    updatedAt: dbRule.updatedAt
  };
}

export function convertRuleProfileToDB(rule: RuleProfile): Omit<RuleProfileDB, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId: rule.userId,
    key: rule.key,
    params: stringifyRuleParams(rule.params),
    enabled: rule.enabled
  };
}
