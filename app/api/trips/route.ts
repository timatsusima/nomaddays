import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveCountryName } from '@/lib/countries';
import { randomUUID } from 'crypto';

// Временный tgUserId для тестирования (в проде заменится TG initData)
const TEST_TG_USER_ID = process.env.TEST_TG_USER_ID || 'test-user-123';

// Заголовки для отключения кеширования
const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

async function getOrCreateUser(tgUserId: string) {
  const existing = await prisma.user.findFirst({ where: { tgUserId } });
  if (existing) return existing;
  return prisma.user.create({ data: { id: randomUUID(), tgUserId } });
}

// GET /api/trips - получить все поездки пользователя
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser(TEST_TG_USER_ID);
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      orderBy: { entryDate: 'desc' }
    });
    return NextResponse.json(trips, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/trips - создать новую поездку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, entryDate, exitDate } = body;

    if (!countryCode || !entryDate || !exitDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await getOrCreateUser(TEST_TG_USER_ID);

    const normalizedCode = String(countryCode).toUpperCase();
    let country = await prisma.country.findUnique({ where: { code: normalizedCode } });
    if (!country) {
      const name = resolveCountryName(normalizedCode);
      country = await prisma.country.create({ data: { code: normalizedCode, name } });
    }

    const trip = await prisma.trip.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        countryCode: normalizedCode,
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate)
      }
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/trips - обновить поездку
export async function PUT(request: NextRequest) {
  try {
    const { id, countryCode, entryDate, exitDate } = await request.json();

    if (!id || !countryCode || !entryDate || !exitDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        countryCode: String(countryCode).toUpperCase(),
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate)
      }
    });

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
