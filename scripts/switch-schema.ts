import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const target = args[0];

if (!target || !['sqlite', 'postgresql'].includes(target)) {
  console.log('❌ Usage: npx tsx scripts/switch-schema.ts <sqlite|postgresql>');
  console.log('   Example: npx tsx scripts/switch-schema.ts sqlite');
  process.exit(1);
}

const schemaDir = path.join(process.cwd(), 'prisma');
const mainSchema = path.join(schemaDir, 'schema.prisma');
const sqliteSchema = path.join(schemaDir, 'schema.sqlite.prisma');

try {
  if (target === 'sqlite') {
    console.log('🔄 Switching to SQLite schema...');
    
    // Копируем SQLite схему в основную
    fs.copyFileSync(sqliteSchema, mainSchema);
    
    // Обновляем .env.local для SQLite
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      /DATABASE_URL="[^"]*"/,
      'DATABASE_URL="file:./dev.db"'
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Switched to SQLite schema');
    console.log('📝 Updated .env.local for SQLite');
    
  } else if (target === 'postgresql') {
    console.log('🔄 Switching to PostgreSQL schema...');
    
    // PostgreSQL схема уже в основном файле
    console.log('✅ Already using PostgreSQL schema');
    console.log('📝 Make sure DATABASE_URL is set to PostgreSQL in Vercel');
  }
  
  console.log('\n🚀 Next steps:');
  if (target === 'sqlite') {
    console.log('   1. Run: npx prisma generate');
    console.log('   2. Run: npx prisma db push');
    console.log('   3. Run: npx tsx scripts/seed.ts');
  } else {
    console.log('   1. Deploy to Vercel (PostgreSQL schema is already active)');
    console.log('   2. Vercel will automatically seed the database');
  }
  
} catch (error) {
  console.error('❌ Error switching schema:', error);
  process.exit(1);
}
