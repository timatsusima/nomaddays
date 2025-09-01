import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database on Vercel...');
    await prisma.$connect();
    console.log('✅ Database connected');

    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;

    const tableExistsResult = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Country'
      ) as exists;
    `;

    const tableExists = Array.isArray(tableExistsResult) &&
      tableExistsResult.length > 0 && typeof tableExistsResult[0] === 'object' &&
      tableExistsResult[0] !== null && 'exists' in tableExistsResult[0] &&
      (tableExistsResult as any)[0].exists === true;

    if (!tableExists) {
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
    }

    const countryCount = await prisma.country.count();
    if (countryCount === 0) {
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
          { code: 'US', name: 'США' }
        ]
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.VERCEL) initializeDatabase().catch((e) => { console.error(e); process.exit(1); });
