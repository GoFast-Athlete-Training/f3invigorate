/**
 * EMERGENCY RECOVERY CHECK
 * Run this to check for any recovery options
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRecoveryOptions() {
  try {
    console.log('🚨 EMERGENCY RECOVERY CHECK\n');
    console.log('Checking for recovery options...\n');

    // 1. Check for backup tables
    console.log('1️⃣ Checking for backup tables...');
    const backupTables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%backup%' OR table_name LIKE '%Backup%' OR table_name LIKE '%_bak%')
      ORDER BY table_name;
    `;
    
    if (backupTables.length > 0) {
      console.log(`✅ Found ${backupTables.length} backup table(s):`);
      backupTables.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('❌ No backup tables found');
    }

    // 2. Check current athlete count
    console.log('\n2️⃣ Current database state:');
    const athleteCount = await prisma.athlete.count();
    console.log(`   Athletes: ${athleteCount}`);
    
    if (athleteCount === 0) {
      console.log('   ⚠️  DATABASE IS EMPTY - DATA LOSS CONFIRMED');
    }

    // 3. Check for other athlete-related tables
    console.log('\n3️⃣ Checking for related data...');
    const relatedTables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%athlete%' OR table_name LIKE '%activity%')
      ORDER BY table_name;
    `;
    
    console.log(`   Found ${relatedTables.length} related table(s):`);
    relatedTables.forEach(t => {
      if (t.table_name !== 'athletes') {
        console.log(`   - ${t.table_name}`);
      }
    });

    // 4. Check database connection info
    console.log('\n4️⃣ Database connection:');
    const dbInfo = await prisma.$queryRaw<Array<{ current_database: string, version: string }>>`
      SELECT current_database(), version();
    `;
    console.log(`   Database: ${dbInfo[0].current_database}`);
    console.log(`   Provider: Prisma Data Platform (db.prisma.io)`);

    // 5. Recovery instructions
    console.log('\n5️⃣ RECOVERY STEPS:');
    console.log('   1. Go to Prisma Dashboard: https://console.prisma.io');
    console.log('   2. Navigate to your project');
    console.log('   3. Check "Backups" section');
    console.log('   4. Contact Prisma Support: support@prisma.io');
    console.log('   5. Request point-in-time recovery');

    console.log('\n⚠️  IMPORTANT:');
    console.log('   - DO NOT run any more schema changes');
    console.log('   - Firebase Auth accounts are SAFE');
    console.log('   - Users can re-signup to recreate athlete records');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecoveryOptions();

