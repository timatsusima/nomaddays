import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Временный userId для тестирования
const TEST_USER_ID = 'test-user-123';

// GET /api/rules - получить все правила пользователя
export async function GET(request: NextRequest) {
  try {
    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;

    const rules = await prisma.ruleProfile.findMany({
      where: { userId },
      orderBy: { key: 'asc' }
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rules - создать новое правило
export async function POST(request: NextRequest) {
  try {
    const { key, params, enabled } = await request.json();

    if (!key || !params) {
      return NextResponse.json(
        { error: 'key and params are required' },
        { status: 400 }
      );
    }

    // Временно используем hardcoded userId для тестирования
    const userId = TEST_USER_ID;

    const rule = await prisma.ruleProfile.create({
      data: {
        userId,
        key,
        params: JSON.stringify(params),
        enabled: enabled ?? true
      }
    });

    return NextResponse.json(rule, { status: 201 });
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
    const { id, key, params, enabled } = await request.json();

    if (!id || !key || !params) {
      return NextResponse.json(
        { error: 'id, key and params are required' },
        { status: 400 }
      );
    }

    const rule = await prisma.ruleProfile.update({
      where: { id },
      data: {
        key,
        params: JSON.stringify(params),
        enabled: enabled ?? true
      }
    });

    return NextResponse.json(rule);
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
