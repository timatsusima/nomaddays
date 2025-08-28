import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🚀 Manual database initialization requested...');
    
    // Подключаемся к базе
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Создаём таблицы (если их нет)
    console.log('📋 Creating database schema...');
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
    
    // Проверяем, есть ли таблицы
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Country'
      );
    `;
    
    if (!tableExists[0]?.exists) {
      console.log('🔄 Tables don\'t exist, creating them...');
      
      // Создаём таблицы вручную
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "tgUserId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Country" (
          "code" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          CONSTRAINT "Country_pkey" PRIMARY KEY ("code")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Trip" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "countryCode" TEXT NOT NULL,
          "entryDate" TIMESTAMP(3) NOT NULL,
          "exitDate" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "RuleProfile" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "key" TEXT NOT NULL,
          "params" TEXT NOT NULL,
          "enabled" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "RuleProfile_pkey" PRIMARY KEY ("id")
        );
      `;
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Setting" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "timezone" TEXT NOT NULL DEFAULT 'UTC',
          "locale" TEXT NOT NULL DEFAULT 'ru',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
        );
      `;
      
      console.log('✅ Tables created successfully');
    } else {
      console.log('✅ Tables already exist');
    }
    
    // Заполняем данными, если таблицы пустые
    const countryCount = await prisma.country.count();
    if (countryCount === 0) {
      console.log('🌱 Seeding database with initial data...');
      
      // Создаём страны
      await prisma.country.createMany({
        data: [
          { code: 'KZ', name: 'Казахстан' },
          { code: 'DE', name: 'Германия' },
          { code: 'FR', name: 'Франция' },
          { code: 'IT', name: 'Италия' },
          { code: 'ES', name: 'Испания' },
          { code: 'NL', name: 'Нидерланды' },
          { code: 'BE', name: 'Бельгия' },
          { code: 'AT', name: 'Австрия' },
          { code: 'CH', name: 'Швейцария' },
          { code: 'PL', name: 'Польша' },
          { code: 'CZ', name: 'Чехия' },
          { code: 'HU', name: 'Венгрия' },
          { code: 'SK', name: 'Словакия' },
          { code: 'PT', name: 'Португалия' },
          { code: 'IE', name: 'Ирландия' },
          { code: 'FI', name: 'Финляндия' },
          { code: 'SE', name: 'Швеция' },
          { code: 'DK', name: 'Дания' },
          { code: 'NO', name: 'Норвегия' },
          { code: 'US', name: 'США' },
        ]
      });
      
      console.log('✅ Database seeded successfully');
    } else {
      console.log(`✅ Database already has ${countryCount} countries`);
    }
    
    console.log('🎉 Database initialization completed!');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database initialized successfully',
      countryCount: await prisma.country.count(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
