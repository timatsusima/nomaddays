import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // Создаём страны
  const countries = [
    { code: 'KZ', name: 'Казахстан' },
    { code: 'DE', name: 'Германия' },
    { code: 'FR', name: 'Франция' },
    { code: 'IT', name: 'Италия' },
    { code: 'ES', name: 'Испания' },
    { code: 'NL', name: 'Нидерланды' },
    { code: 'BE', name: 'Бельгия' },
    { code: 'AT', name: 'Австрия' },
    { code: 'CH', name: 'Швейцария' },
    { code: 'US', name: 'Соединённые Штаты' },
    { code: 'GB', name: 'Великобритания' },
    { code: 'AU', name: 'Австралия' },
    { code: 'CA', name: 'Канада' },
    { code: 'JP', name: 'Япония' },
    { code: 'SG', name: 'Сингапур' },
    { code: 'TH', name: 'Таиланд' },
    { code: 'VN', name: 'Вьетнам' },
    { code: 'ID', name: 'Индонезия' },
    { code: 'MY', name: 'Малайзия' },
    { code: 'PH', name: 'Филиппины' }
  ];

  console.log('📍 Создаём страны...');
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: { name: country.name },
      create: country
    });
  }

  // Создаём тестового пользователя
  console.log('👤 Создаём тестового пользователя...');
  const testUser = await prisma.user.upsert({
    where: { tgUserId: '123456789' },
    update: {},
    create: {
      tgUserId: '123456789'
    }
  });

  // Создаём настройки пользователя
  console.log('⚙️ Создаём настройки пользователя...');
  await prisma.setting.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      timezone: 'Asia/Almaty',
      locale: 'ru'
    }
  });

  // Создаём правила по умолчанию
  console.log('📋 Создаём правила по умолчанию...');
  const defaultRules = [
    {
      key: 'KZ_RESIDENCY_TEST',
      params: {
        name: 'Тест резиденции РК',
        description: 'Максимум дней вне Казахстана для сохранения налогового резидентства',
        maxDaysOutside: 183,
        calendarYear: true,
        rolling12Months: false
      },
      enabled: true
    },
    {
      key: 'SCHENGEN_90_180',
      params: {
        name: 'Шенген 90/180',
        description: '90 дней в любые 180 дней в Шенгенской зоне',
        nDays: 90,
        mDays: 180,
        calendarYear: false,
        rolling12Months: false
      },
      enabled: true
    },
    {
      key: 'GENERIC_183_365',
      params: {
        name: 'Общее правило 183 дня',
        description: '183 дня в любые 365 дней (скользящий год)',
        nDays: 183,
        mDays: 365,
        calendarYear: false,
        rolling12Months: false
      },
      enabled: false
    }
  ];

  for (const rule of defaultRules) {
    await prisma.ruleProfile.upsert({
      where: {
        userId_key: {
          userId: testUser.id,
          key: rule.key
        }
      },
      update: {
        params: JSON.stringify(rule.params),
        enabled: rule.enabled
      },
      create: {
        userId: testUser.id,
        key: rule.key,
        params: JSON.stringify(rule.params),
        enabled: rule.enabled
      }
    });
  }

  // Создаём тестовые поездки
  console.log('✈️ Создаём тестовые поездки...');
  const testTrips = [
    {
      countryCode: 'DE',
      entryDate: new Date('2024-01-15'),
      exitDate: new Date('2024-01-30')
    },
    {
      countryCode: 'FR',
      entryDate: new Date('2024-02-10'),
      exitDate: new Date('2024-02-25')
    },
    {
      countryCode: 'IT',
      entryDate: new Date('2024-03-05'),
      exitDate: new Date('2024-03-20')
    }
  ];

  for (const trip of testTrips) {
    await prisma.trip.create({
      data: {
        userId: testUser.id,
        countryCode: trip.countryCode,
        entryDate: trip.entryDate,
        exitDate: trip.exitDate
      }
    });
  }

  console.log('✅ База данных успешно заполнена!');
  console.log(`📊 Создано: ${countries.length} стран, 1 пользователь, ${defaultRules.length} правил, ${testTrips.length} поездок`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
