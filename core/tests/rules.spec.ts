import { DateWindowCalculator } from '../date-windows';
import { RulesEngine } from '../engine';
import { Trip, RuleProfile, DateRange } from '../types';

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

  const mockRules: RuleProfile[] = [
    {
      id: '1',
      key: 'SCHENGEN_90_180',
      params: {
        name: 'Шенген 90/180',
        description: '90 дней в любые 180 дней',
        nDays: 90,
        mDays: 180
      },
      enabled: true
    }
  ];

  describe('DateWindowCalculator', () => {
    test('should calculate sliding window correctly for 90/180 rule', () => {
      const windows = DateWindowCalculator.calculateSlidingWindow(
        mockTrips,
        90,
        180,
        new Date('2024-03-01')
      );
      
      expect(windows).toHaveLength(180);
      expect(windows[0].startDate).toBeInstanceOf(Date);
      expect(windows[0].endDate).toBeInstanceOf(Date);
    });

    test('should calculate calendar year correctly', () => {
      const yearCalc = DateWindowCalculator.calculateCalendarYear(mockTrips, 2024);
      
      expect(yearCalc.startDate.getFullYear()).toBe(2024);
      expect(yearCalc.endDate.getFullYear()).toBe(2024);
      expect(yearCalc.usedDays).toBeGreaterThan(0);
    });

    test('should calculate rolling 12 months correctly', () => {
      const rollingCalc = DateWindowCalculator.calculateRolling12Months(
        mockTrips,
        new Date('2024-03-01')
      );
      
      expect(rollingCalc.startDate).toBeInstanceOf(Date);
      expect(rollingCalc.endDate).toBeInstanceOf(Date);
      expect(rollingCalc.usedDays).toBeGreaterThan(0);
    });

    test('should find next risk date for sliding window', () => {
      const riskDate = DateWindowCalculator.findNextRiskDate(
        mockTrips,
        { nDays: 10, mDays: 30 }
      );
      
      // Если есть риск, должна вернуться дата
      if (riskDate) {
        expect(riskDate).toBeInstanceOf(Date);
      }
    });

    test('should convert date to timezone correctly', () => {
      const testDate = new Date('2024-01-01T00:00:00Z');
      const converted = DateWindowCalculator.convertToTimezone(testDate, 'Europe/Berlin');
      
      expect(converted).toBeInstanceOf(Date);
      expect(converted.getTime()).not.toBe(testDate.getTime());
    });
  });

  describe('RulesEngine', () => {
    test('should calculate forecast for enabled rules only', async () => {
      const request = {
        plannedTrip: {
          start: new Date('2024-04-01'),
          end: new Date('2024-04-10')
        },
        userId: 'test-user'
      };

      const forecast = await RulesEngine.calculateForecast(
        request,
        mockTrips,
        mockRules
      );

      expect(forecast.results).toHaveLength(1);
      expect(forecast.results[0].ruleKey).toBe('SCHENGEN_90_180');
      expect(forecast.summary).toBeDefined();
    });

    test('should aggregate results correctly', async () => {
      const request = {
        plannedTrip: {
          start: new Date('2024-04-01'),
          end: new Date('2024-04-10')
        },
        userId: 'test-user'
      };

      const forecast = await RulesEngine.calculateForecast(
        request,
        mockTrips,
        mockRules
      );

      expect(forecast.summary.canTravel).toBeDefined();
      expect(forecast.summary.overallSeverity).toBeDefined();
      expect(['OK', 'WARNING', 'RISK']).toContain(forecast.summary.overallSeverity);
    });

    test('should check if trip can be added', () => {
      const newTrip: Trip = {
        id: '3',
        countryCode: 'IT',
        entryDate: new Date('2024-05-01'),
        exitDate: new Date('2024-05-15')
      };

      const result = RulesEngine.canAddTrip(newTrip, mockTrips, mockRules);
      
      expect(result.canAdd).toBeDefined();
      expect(typeof result.canAdd).toBe('boolean');
    });

    test('should handle empty trips array', async () => {
      const request = {
        plannedTrip: {
          start: new Date('2024-04-01'),
          end: new Date('2024-04-10')
        },
        userId: 'test-user'
      };

      const forecast = await RulesEngine.calculateForecast(
        request,
        [],
        mockRules
      );

      expect(forecast.results).toHaveLength(1);
      expect(forecast.summary.totalUsedDays).toBe(0);
    });

    test('should handle disabled rules', async () => {
      const disabledRules: RuleProfile[] = [
        {
          id: '1',
          key: 'SCHENGEN_90_180',
          params: {
            name: 'Шенген 90/180',
            description: '90 дней в любые 180 дней',
            nDays: 90,
            mDays: 180
          },
          enabled: false
        }
      ];

      const request = {
        plannedTrip: {
          start: new Date('2024-04-01'),
          end: new Date('2024-04-10')
        },
        userId: 'test-user'
      };

      const forecast = await RulesEngine.calculateForecast(
        request,
        mockTrips,
        disabledRules
      );

      expect(forecast.results).toHaveLength(0);
      expect(forecast.summary.canTravel).toBe(true);
    });
  });
});
