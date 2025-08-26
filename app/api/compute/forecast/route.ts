import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RulesEngine } from '@/core/rules/engine';
import { ForecastRequest, RuleParams, Trip } from '@/core/rules/types';

export async function POST(request: NextRequest) {
  try {
    const { plannedTrip, userId }: ForecastRequest = await request.json();

    if (!plannedTrip || !userId) {
      return NextResponse.json(
        { error: 'plannedTrip and userId are required' },
        { status: 400 }
      );
    }

    // Получаем поездки пользователя
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { entryDate: 'asc' }
    });

    // Получаем активные правила пользователя
    const rules = await prisma.ruleProfile.findMany({
      where: { 
        userId,
        enabled: true
      }
    });

    // Конвертируем в формат для движка
    const engineTrips = trips.map((trip: Trip) => ({
      id: trip.id,
      countryCode: trip.countryCode,
      entryDate: trip.entryDate,
      exitDate: trip.exitDate
    }));

    const engineRules = rules.map((rule: any) => {
      let parsedParams: RuleParams;
      try {
        parsedParams = JSON.parse(rule.params);
      } catch {
        // Если не удалось распарсить, используем пустые параметры
        parsedParams = {
          name: rule.key,
          description: `Rule ${rule.key}`,
          nDays: 0,
          mDays: 0,
          maxDaysPerYear: 0,
          maxDaysOutside: 0,
          calendarYear: false,
          rolling12Months: false
        };
      }
      
      return {
        id: rule.id,
        key: rule.key,
        params: parsedParams,
        enabled: rule.enabled
      };
    });

    // Рассчитываем прогноз
    const forecast = await RulesEngine.calculateForecast(
      { plannedTrip, userId },
      engineTrips,
      engineRules
    );

    return NextResponse.json(forecast);
  } catch (error) {
    console.error('Error computing forecast:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
