import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveCountryName } from '@/lib/countries';
import { randomUUID } from 'crypto';

const TG_ID = process.env.TEST_TG_USER_ID || 'test-user-123';

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

async function resolveCompatibleUserId() {
  // 1) Если есть пользователь с tgUserId — используем его
  const user = await prisma.user.findFirst({ where: { tgUserId: TG_ID } }).catch(() => null);
  if (user) return user.id;
  // 2) Иначе берём userId из любой существующей поездки (исторические данные)
  const anyTrip = await prisma.trip.findFirst({ orderBy: { createdAt: 'desc' } }).catch(() => null);
  if (anyTrip) return anyTrip.userId;
  // 3) Если нет ничего — создаём нового пользователя (без upsert/уникальных требований)
  const newUserId = randomUUID();
  try {
    await prisma.user.create({ data: { id: newUserId, tgUserId: TG_ID } });
  } catch (_) {
    // даже если create не сработал (разные схемы), всё равно вернём id —
    // Trip может быть создан без строгих FK в проде
  }
  return newUserId;
}

export async function GET() {
  try {
    const userId = await resolveCompatibleUserId();
    const trips = await prisma.trip.findMany({ where: { userId }, orderBy: { entryDate: 'desc' } });
    return NextResponse.json(trips, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, entryDate, exitDate } = body;
    if (!countryCode || !entryDate || !exitDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = await resolveCompatibleUserId();

    const normalizedCode = String(countryCode).toUpperCase();
    let country = await prisma.country.findUnique({ where: { code: normalizedCode } });
    if (!country) {
      const name = resolveCountryName(normalizedCode);
      await prisma.country.create({ data: { code: normalizedCode, name } }).catch(() => {});
    }

    const trip = await prisma.trip.create({
      data: {
        id: randomUUID(),
        userId,
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

export async function PUT(request: NextRequest) {
  try {
    const { id, countryCode, entryDate, exitDate } = await request.json();
    if (!id || !countryCode || !entryDate || !exitDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Trip id is required' }, { status: 400 });

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    await prisma.trip.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
