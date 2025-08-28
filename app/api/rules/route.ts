import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TEST_USER_ID = 'test-user-123';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/rules - starting...');
    
    const userId = TEST_USER_ID;
    console.log('Using userId:', userId);
    
    const rules = await prisma.ruleProfile.findMany({ 
      where: { userId } 
    });
    
    console.log('Found rules:', rules.length);
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
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

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/rules - starting...');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { key, params, enabled } = body;
    
    if (!key || !params) {
      console.log('Missing fields:', { key, params });
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['key', 'params'],
          received: { key, params, enabled }
        },
        { status: 400 }
      );
    }
    
    const userId = TEST_USER_ID;
    console.log('Creating rule with data:', { userId, key, params, enabled });
    
    const rule = await prisma.ruleProfile.create({
      data: {
        userId,
        key,
        params: JSON.stringify(params),
        enabled: enabled ?? true
      }
    });
    
    console.log('Rule created successfully:', rule);
    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('Error creating rule:', error);
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
