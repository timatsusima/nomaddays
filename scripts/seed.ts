import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  try {
    // Очищаем существующие данные
    console.log('🧹 Очищаем существующие данные...');
    await prisma.trip.deleteMany();
    await prisma.ruleProfile.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    // Создаём страны
    console.log('📍 Создаём страны...');
    const countries = await Promise.all([
      prisma.country.create({ data: { code: 'KZ', name: 'Казахстан' } }),
      prisma.country.create({ data: { code: 'DE', name: 'Германия' } }),
      prisma.country.create({ data: { code: 'FR', name: 'Франция' } }),
      prisma.country.create({ data: { code: 'IT', name: 'Италия' } }),
      prisma.country.create({ data: { code: 'ES', name: 'Испания' } }),
      prisma.country.create({ data: { code: 'NL', name: 'Нидерланды' } }),
      prisma.country.create({ data: { code: 'BE', name: 'Бельгия' } }),
      prisma.country.create({ data: { code: 'AT', name: 'Австрия' } }),
      prisma.country.create({ data: { code: 'CH', name: 'Швейцария' } }),
      prisma.country.create({ data: { code: 'PL', name: 'Польша' } }),
      prisma.country.create({ data: { code: 'CZ', name: 'Чехия' } }),
      prisma.country.create({ data: { code: 'HU', name: 'Венгрия' } }),
      prisma.country.create({ data: { code: 'SK', name: 'Словакия' } }),
      prisma.country.create({ data: { code: 'PT', name: 'Португалия' } }),
      prisma.country.create({ data: { code: 'IE', name: 'Ирландия' } }),
      prisma.country.create({ data: { code: 'FI', name: 'Финляндия' } }),
      prisma.country.create({ data: { code: 'SE', name: 'Швеция' } }),
      prisma.country.create({ data: { code: 'DK', name: 'Дания' } }),
      prisma.country.create({ data: { code: 'NO', name: 'Норвегия' } }),
      prisma.country.create({ data: { code: 'US', name: 'США' } }),
    ]);

    // Создаём тестового пользователя
    console.log('👤 Создаём тестового пользователя...');
    const user = await prisma.user.create({
      data: {
        tgUserId: 'test-user-123',
      },
    });

    // Создаём настройки пользователя
    console.log('⚙️ Создаём настройки пользователя...');
    await prisma.setting.create({
      data: {
        userId: user.id,
        timezone: 'Asia/Almaty',
        locale: 'ru',
      },
    });

    // Создаём правила по умолчанию
    console.log('📋 Создаём правила по умолчанию...');
    await Promise.all([
      prisma.ruleProfile.create({
        data: {
          userId: user.id,
          key: 'SCHENGEN_90_180',
          params: JSON.stringify({ enabled: true, daysIn: 90, daysOut: 180 }),
          enabled: true,
        },
      }),
      prisma.ruleProfile.create({
        data: {
          userId: user.id,
          key: 'KZ_RESIDENCY_TEST',
          params: JSON.stringify({ enabled: true, daysInYear: 183 }),
          enabled: true,
        },
      }),
      prisma.ruleProfile.create({
        data: {
          userId: user.id,
          key: 'GENERIC_183_365',
          params: JSON.stringify({ enabled: true, daysInYear: 183 }),
          enabled: true,
        },
      }),
    ]);

    // Создаём тестовые поездки
    console.log('✈️ Создаём тестовые поездки...');
    await Promise.all([
      prisma.trip.create({
        data: {
          userId: user.id,
          countryCode: 'DE',
          entryDate: new Date('2024-01-15'),
          exitDate: new Date('2024-02-15'),
        },
      }),
      prisma.trip.create({
        data: {
          userId: user.id,
          countryCode: 'FR',
          entryDate: new Date('2024-03-01'),
          exitDate: new Date('2024-03-31'),
        },
      }),
      prisma.trip.create({
        data: {
          userId: user.id,
          countryCode: 'IT',
          entryDate: new Date('2024-05-01'),
          exitDate: new Date('2024-05-15'),
        },
      }),
    ]);

    console.log('✅ База данных успешно заполнена!');
    console.log(`📊 Создано: ${countries.length} стран, 1 пользователь, 3 правил, 3 поездок`);
  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
