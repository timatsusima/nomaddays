import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Временный userId для тестирования
const TEST_USER_ID = 'test-user-123';

// GET /api/trips - получить все поездки пользователя
export async function GET(request: NextRequest) {
  try {
    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { entryDate: 'desc' }
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/trips - создать новую поездку
export async function POST(request: NextRequest) {
  try {
    const { countryCode, entryDate, exitDate } = await request.json();

    if (!countryCode || !entryDate || !exitDate) {
      return NextResponse.json(
        { error: 'Missing required fields: countryCode, entryDate, exitDate' },
        { status: 400 }
      );
    }

    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;

    // Проверяем, существует ли страна
    const country = await prisma.country.findUnique({
      where: { code: countryCode }
    });

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        countryCode,
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate)
      }
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'trip id is required' },
        { status: 400 }
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
