import { RuleParams } from './types';

export const RULE_PRESETS: Record<string, RuleParams> = {
  // Казахстан (резидентство)
  KZ_RESIDENCY_TEST: {
    name: 'Тест резиденции РК',
    description: 'Не более 182 дней вне Казахстана за скользящие 12 месяцев',
    maxDaysOutside: 182,
    calendarYear: false,
    rolling12Months: true
  },

  KZ_RESIDENCY_MIN_STAY: {
    name: 'Минимум 183 дня в РК',
    description: 'Требование РВП/ВНЖ: находиться в РК не менее 183 дней за календарный год',
    minDaysInCountry: 183,
    countryCode: 'KZ',
    calendarYear: true
  },
  
  // TODO: Настроить актуальные лимиты для Шенгена
  SCHENGEN_90_180: {
    name: 'Шенген 90/180',
    description: '90 дней в любые 180 дней в Шенгенской зоне',
    nDays: 90,
    mDays: 180,
    calendarYear: false,
    rolling12Months: false
  },
  
  // TODO: Настроить актуальные лимиты для общих правил
  GENERIC_183_365: {
    name: 'Общее правило 183 дня',
    description: '183 дня в любые 365 дней (скользящий год)',
    nDays: 183,
    mDays: 365,
    calendarYear: false,
    rolling12Months: false
  },
  
  // TODO: Настроить актуальные лимиты для США
  US_TAX_RESIDENCY: {
    name: 'Налоговое резидентство США',
    description: 'Тест существенного присутствия для налогового резидентства',
    maxDaysPerYear: 183, // TODO: Уточнить актуальное значение
    calendarYear: true,
    rolling12Months: false
  },
  
  // TODO: Настроить актуальные лимиты для Великобритании
  UK_TAX_RESIDENCY: {
    name: 'Налоговое резидентство Великобритании',
    description: 'Правила для определения налогового резидентства',
    maxDaysPerYear: 183, // TODO: Уточнить актуальное значение
    calendarYear: true,
    rolling12Months: false
  },
  
  // TODO: Настроить актуальные лимиты для Австралии
  AU_TAX_RESIDENCY: {
    name: 'Налоговое резидентство Австралии',
    description: 'Правила для определения налогового резидентства',
    maxDaysPerYear: 183, // TODO: Уточнить актуальное значение
    calendarYear: true,
    rolling12Months: false
  }
};

export const getDefaultRuleProfiles = (): Array<{ key: string; params: RuleParams; enabled: boolean }> => {
  return [
    {
      key: 'KZ_RESIDENCY_TEST',
      params: RULE_PRESETS.KZ_RESIDENCY_TEST,
      enabled: true
    },
    {
      key: 'KZ_RESIDENCY_MIN_STAY',
      params: RULE_PRESETS.KZ_RESIDENCY_MIN_STAY,
      enabled: true
    },
    {
      key: 'SCHENGEN_90_180',
      params: RULE_PRESETS.SCHENGEN_90_180,
      enabled: true
    },
    {
      key: 'GENERIC_183_365',
      params: RULE_PRESETS.GENERIC_183_365,
      enabled: false
    }
  ];
};

export const getRulePreset = (key: string): RuleParams | undefined => {
  return RULE_PRESETS[key];
};

export const getAllRulePresets = (): Record<string, RuleParams> => {
  return { ...RULE_PRESETS };
};
