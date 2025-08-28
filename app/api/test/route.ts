import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Проверяем подключение к базе
    await prisma.$connect();
    
    // Пробуем получить количество стран
    const countryCount = await prisma.country.count();
    
    // Пробуем получить количество поездок
    const tripCount = await prisma.trip.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      countryCount,
      tripCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
