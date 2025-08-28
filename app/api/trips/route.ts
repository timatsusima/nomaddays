import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveCountryName } from '@/lib/countries';

// Временный userId для тестирования
const TEST_USER_ID = 'test-user-123';

// GET /api/trips - получить все поездки пользователя
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/trips - starting...');
    
    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;
    console.log('Using userId:', userId);

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { entryDate: 'desc' }
    });

    console.log('Found trips:', trips.length);
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST /api/trips - создать новую поездку
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/trips - starting...');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { countryCode, entryDate, exitDate } = body;

    if (!countryCode || !entryDate || !exitDate) {
      console.log('Missing fields:', { countryCode, entryDate, exitDate });
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['countryCode', 'entryDate', 'exitDate'],
          received: { countryCode, entryDate, exitDate }
        },
        { status: 400 }
      );
    }

    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;
    console.log('Using userId:', userId);

    // Убеждаемся, что страна существует, если нет — создаём
    const normalizedCode = String(countryCode).toUpperCase();
    let country = await prisma.country.findUnique({ where: { code: normalizedCode } });
    if (!country) {
      const name = resolveCountryName(normalizedCode);
      country = await prisma.country.create({ data: { code: normalizedCode, name } });
      console.log('Country created on the fly:', country);
    }

    console.log('Creating trip with data:', { userId, countryCode, entryDate, exitDate });
    
    const trip = await prisma.trip.create({
      data: {
        userId,
        countryCode: normalizedCode,
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate)
      }
    });

    console.log('Trip created successfully:', trip);
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// PUT /api/trips - обновить поездку
export async function PUT(request: NextRequest) {
  try {
    const { id, countryCode, entryDate, exitDate } = await request.json();

    if (!id || !countryCode || !entryDate || !exitDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли поездка
    const existingTrip = await prisma.trip.findUnique({
      where: { id }
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        countryCode,
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate)
      }
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips - удалить поездку
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Trip id is required' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли поездка
    const existingTrip = await prisma.trip.findUnique({
      where: { id }
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    await prisma.trip.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
