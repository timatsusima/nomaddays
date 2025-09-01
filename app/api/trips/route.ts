import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveCountryName } from '@/lib/countries';

// Временный tgUserId для тестирования (в проде заменится TG initData)
const TEST_TG_USER_ID = process.env.TEST_TG_USER_ID || 'test-user-123';

// Заголовки для отключения кеширования
const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// GET /api/trips - получить все поездки пользователя
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/trips - starting...');
    
    // Находим/создаём пользователя по tgUserId
    const user = await prisma.user.upsert({
      where: { tgUserId: TEST_TG_USER_ID },
      update: {},
      create: { tgUserId: TEST_TG_USER_ID }
    });
    console.log('Using userId:', user.id);

    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { entryDate: 'desc' }
    });

    console.log('Found trips:', trips.length);
    return NextResponse.json(trips, { headers: noCacheHeaders });
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

    // Находим/создаём пользователя по tgUserId
    const user = await prisma.user.upsert({
      where: { tgUserId: TEST_TG_USER_ID },
      update: {},
      create: { tgUserId: TEST_TG_USER_ID }
    });
    console.log('Using userId:', user.id);

    // Убеждаемся, что страна существует, если нет — создаём
    const normalizedCode = String(countryCode).toUpperCase();
    let country = await prisma.country.findUnique({ where: { code: normalizedCode } });
    if (!country) {
      const name = resolveCountryName(normalizedCode);
      country = await prisma.country.create({ data: { code: normalizedCode, name } });
      console.log('Country created on the fly:', country);
    }

    console.log('Creating trip with data:', { userId: user.id, countryCode, entryDate, exitDate });
    
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
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
