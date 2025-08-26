import { NextRequest, NextResponse } from 'next/server';
import { validateInitData } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: 'initData is required' },
        { status: 400 }
      );
    }

    const user = validateInitData(initData);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid initData signature' },
        { status: 401 }
      );
    }

    // TODO: Создать или получить пользователя из базы данных
    // const dbUser = await prisma.user.upsert({
    //   where: { tgUserId: user.id.toString() },
    //   update: {},
    //   create: {
    //     tgUserId: user.id.toString(),
    //   }
    // });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error verifying initData:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
