import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Проверяем таблицу стран
    const countries = await prisma.country.findMany();
    console.log(`📊 Countries table: ${countries.length} records`);
    
    if (countries.length === 0) {
      console.log('⚠️  Countries table is empty! Need to seed data.');
    } else {
      console.log('📋 Sample countries:', countries.slice(0, 3).map(c => `${c.name} (${c.code})`));
    }
    
    // Проверяем таблицу поездок
    const trips = await prisma.trip.findMany();
    console.log(`✈️  Trips table: ${trips.length} records`);
    
    // Проверяем таблицу правил
    const rules = await prisma.ruleProfile.findMany();
    console.log(`⚖️  Rules table: ${rules.length} records`);
    
    // Проверяем таблицу пользователей
    const users = await prisma.user.findMany();
    console.log(`👤 Users table: ${users.length} records`);
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
