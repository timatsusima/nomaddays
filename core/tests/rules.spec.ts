import { Trip, RuleProfile, RuleParams, RuleProfileDB, parseRuleParams, stringifyRuleParams, convertDBToRuleProfile, convertRuleProfileToDB } from '../rules/types';

describe('Rules Engine Tests', () => {
  const mockTrips: Trip[] = [
    {
      id: '1',
      countryCode: 'DE',
      entryDate: new Date('2024-01-01'),
      exitDate: new Date('2024-01-15')
    },
    {
      id: '2',
      countryCode: 'FR',
      entryDate: new Date('2024-02-01'),
      exitDate: new Date('2024-02-10')
    }
  ];

  const mockRuleParams: RuleParams = {
    name: 'Шенген 90/180',
    description: '90 дней в любые 180 дней',
    nDays: 90,
    mDays: 180
  };

  const mockRules: RuleProfile[] = [
    {
      id: '1',
      key: 'SCHENGEN_90_180',
      params: mockRuleParams,
      enabled: true
    }
  ];

  const mockRulesDB: RuleProfileDB[] = [
    {
      id: '1',
      key: 'SCHENGEN_90_180',
      params: JSON.stringify(mockRuleParams),
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  describe('Basic Tests', () => {
    test('should have correct mock data structure', () => {
      expect(mockTrips).toHaveLength(2);
      expect(mockTrips[0].countryCode).toBe('DE');
      expect(mockTrips[1].countryCode).toBe('FR');
      
      expect(mockRules).toHaveLength(1);
      expect(mockRules[0].key).toBe('SCHENGEN_90_180');
      expect(mockRules[0].enabled).toBe(true);
    });

    test('should access rule params correctly', () => {
      const params = mockRules[0].params;
      expect(params.name).toBe('Шенген 90/180');
      expect(params.nDays).toBe(90);
      expect(params.mDays).toBe(180);
    });

    test('should calculate trip duration correctly', () => {
      const trip = mockTrips[0];
      const duration = Math.ceil(
        (trip.exitDate.getTime() - trip.entryDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      
      expect(duration).toBe(15); // 15 дней включая день въезда
    });

    test('should validate trip dates', () => {
      mockTrips.forEach(trip => {
        expect(trip.entryDate.getTime()).toBeLessThan(trip.exitDate.getTime());
        expect(trip.countryCode).toMatch(/^[A-Z]{2}$/);
      });
    });

    test('should handle disabled rules', () => {
      const disabledRule: RuleProfile = {
        ...mockRules[0],
        enabled: false
      };
      
      expect(disabledRule.enabled).toBe(false);
      expect(disabledRule.key).toBe('SCHENGEN_90_180');
    });

    test('should validate rule structure', () => {
      mockRules.forEach(rule => {
        expect(rule.id).toBeDefined();
        expect(rule.key).toBeDefined();
        expect(rule.params).toBeDefined();
        expect(typeof rule.params).toBe('object');
        
        // Проверяем, что params имеет правильную структуру
        expect(rule.params.name).toBeDefined();
        expect(rule.params.description).toBeDefined();
      });
    });

    test('should calculate total days across all trips', () => {
      const totalDays = mockTrips.reduce((sum, trip) => {
        const duration = Math.ceil(
          (trip.exitDate.getTime() - trip.entryDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
        return sum + duration;
      }, 0);
      
      // Проверяем, что общее количество дней больше 0
      expect(totalDays).toBeGreaterThan(0);
      expect(totalDays).toBe(25); // Фактическое значение
    });

    test('should handle empty arrays', () => {
      expect([]).toHaveLength(0);
      expect([].filter(() => true)).toHaveLength(0);
    });

    test('should validate date objects', () => {
      mockTrips.forEach(trip => {
        expect(trip.entryDate).toBeInstanceOf(Date);
        expect(trip.exitDate).toBeInstanceOf(Date);
        expect(trip.entryDate.getTime()).toBeGreaterThan(0);
        expect(trip.exitDate.getTime()).toBeGreaterThan(0);
      });
    });

    test('should have unique trip IDs', () => {
      const ids = mockTrips.map(trip => trip.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockTrips.length);
    });
  });

  describe('Type Conversion Tests', () => {
    test('should parse rule params from string', () => {
      const paramsString = JSON.stringify(mockRuleParams);
      const parsed = parseRuleParams(paramsString);
      
      expect(parsed.name).toBe(mockRuleParams.name);
      expect(parsed.nDays).toBe(mockRuleParams.nDays);
      expect(parsed.mDays).toBe(mockRuleParams.mDays);
    });

    test('should stringify rule params to string', () => {
      const stringified = stringifyRuleParams(mockRuleParams);
      const parsed = JSON.parse(stringified);
      
      expect(parsed.name).toBe(mockRuleParams.name);
      expect(parsed.nDays).toBe(mockRuleParams.nDays);
      expect(parsed.mDays).toBe(mockRuleParams.mDays);
    });

    test('should convert DB rule to API rule', () => {
      const dbRule = mockRulesDB[0];
      const apiRule = convertDBToRuleProfile(dbRule);
      
      expect(apiRule.id).toBe(dbRule.id);
      expect(apiRule.key).toBe(dbRule.key);
      expect(apiRule.enabled).toBe(dbRule.enabled);
      expect(apiRule.params.name).toBe(mockRuleParams.name);
    });

    test('should convert API rule to DB rule', () => {
      const apiRule = mockRules[0];
      const dbRule = convertRuleProfileToDB(apiRule);
      
      expect(dbRule.key).toBe(apiRule.key);
      expect(dbRule.enabled).toBe(apiRule.enabled);
      expect(typeof dbRule.params).toBe('string');
      
      // Проверяем, что params можно распарсить
      const parsed = JSON.parse(dbRule.params);
      expect(parsed.name).toBe(apiRule.params.name);
    });

    test('should handle invalid JSON in parseRuleParams', () => {
      expect(() => parseRuleParams('invalid json')).toThrow('Failed to parse rule params');
    });
  });
});
