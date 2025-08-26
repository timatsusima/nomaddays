import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/rules - получить правила пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const rules = await prisma.ruleProfile.findMany({
      where: { userId },
      orderBy: { key: 'asc' }
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rules - создать или обновить правило
export async function POST(request: NextRequest) {
  try {
    const { userId, key, params, enabled } = await request.json();

    if (!userId || !key || !params) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const rule = await prisma.ruleProfile.upsert({
      where: { 
        userId_key: {
          userId,
          key
        }
      },
      update: {
        params: JSON.stringify(params),
        enabled: enabled ?? true
      },
      create: {
        userId,
        key,
        params: JSON.stringify(params),
        enabled: enabled ?? true
      }
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error('Error creating/updating rule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/rules - обновить правило
export async function PUT(request: NextRequest) {
  try {
    const { id, params, enabled } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'rule id is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (params !== undefined) {
      updateData.params = JSON.stringify(params);
    }
    if (enabled !== undefined) {
      updateData.enabled = enabled as boolean;
    }

    const rule = await prisma.ruleProfile.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ rule });
  } catch (error) {
    console.error('Error updating rule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rules - удалить правило
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'rule id is required' },
        { status: 400 }
      );
    }

    await prisma.ruleProfile.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
