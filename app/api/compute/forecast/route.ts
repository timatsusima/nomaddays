import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RulesEngine } from '@/core/rules/engine';
import { env } from '@/lib/env';
import OpenAI from 'openai';
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

    // Учитываем только поездки за последние 12 месяцев (относительно текущей даты)
    const now = new Date();
    const windowStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const tripsLast12m = trips.filter((t) => {
      const entry = new Date(t.entryDate);
      const exit = new Date(t.exitDate);
      return exit >= windowStart && entry <= now;
    });

    // Получаем активные правила пользователя
    const rules = await prisma.ruleProfile.findMany({
      where: { 
        userId,
        enabled: true
      }
    });

    // Конвертируем в формат для движка
    const engineTrips = tripsLast12m.map((trip: Trip) => ({
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

    // Если задан серверный ключ OpenAI — обращаемся к LLM
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const userProfile = {
        citizenship: '',
        residenceCountry: '',
        residencePermitType: 'NONE',
        residencePermitStart: '',
        residencePermitEnd: ''
      };
      // Пытаемся обогатить профилем из local-likes не доступны на сервере; оставляем пустым
      const payload = {
        userProfile,
        trips: tripsLast12m.map(t => ({ countryCode: t.countryCode, entryDate: t.entryDate, exitDate: t.exitDate })),
        plannedTrip: { start: plannedTrip.start, end: plannedTrip.end }
      };
      const prompt = `You are an expert assistant for digital nomads. Use ONLY provided trips (they already filtered to last 12 months). Consider plannedTrip possibly in the future. Apply up-to-date residency and travel rules (e.g., 90/180, 183 days in country, etc.). Return concise JSON: {canTravel, results:[{ruleKey,ruleName,isCompliant,usedDays,availableDays,severity,explanation}]}.`;
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: JSON.stringify(payload) }
        ]
      });
      const text = chat.choices?.[0]?.message?.content ?? '{}';
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {}
    }

    // Fallback: локальный движок
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
