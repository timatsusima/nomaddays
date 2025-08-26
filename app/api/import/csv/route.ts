import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { importTripsFromCSV } from '@/lib/csv';

export async function POST(request: NextRequest) {
  try {
    const { csvContent, userId } = await request.json();

    if (!csvContent || !userId) {
      return NextResponse.json(
        { error: 'csvContent and userId are required' },
        { status: 400 }
      );
    }

    // Парсим CSV
    const result = importTripsFromCSV(csvContent);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        errors: result.errors
      }, { status: 400 });
    }

    // Сохраняем поездки в базу данных
    const savedTrips = [];
    
    for (const trip of result.trips) {
      try {
        // Проверяем, существует ли страна
        let country = await prisma.country.findUnique({
          where: { code: trip.countryCode }
        });

        // Если страна не существует, создаём её
        if (!country) {
          country = await prisma.country.create({
            data: {
              code: trip.countryCode,
              name: trip.countryCode // TODO: Добавить названия стран
            }
          });
        }

        // Создаём поездку
        const savedTrip = await prisma.trip.create({
          data: {
            userId,
            countryCode: trip.countryCode,
            entryDate: trip.entryDate,
            exitDate: trip.exitDate
          },
          include: { country: true }
        });

        savedTrips.push(savedTrip);
      } catch (error) {
        console.error(`Error saving trip ${trip.countryCode}:`, error);
        result.errors.push(`Ошибка сохранения поездки ${trip.countryCode}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      trips: savedTrips,
      totalImported: savedTrips.length,
      errors: result.errors
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
