/**
 * Migration script: Athlete -> F3HIM
 * Migrates existing Athlete data to F3HIM before schema change
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateToF3HIM() {
  try {
    console.log('🔄 Starting migration: Athlete -> F3HIM\n');

    // Check if athletes table exists and has data
    const athleteCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM athletes;
    `;
    
    const count = Number(athleteCount[0]?.count || 0);
    console.log(`📊 Found ${count} athlete(s) to migrate\n`);

    if (count === 0) {
      console.log('✅ No athletes to migrate. Safe to proceed with schema change.');
      return;
    }

    // Check if f3_hims table already exists
    const f3himTableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'f3_hims'
      ) as exists;
    `;

    if (f3himTableExists[0]?.exists) {
      console.log('⚠️  f3_hims table already exists. Checking if migration needed...\n');
      const f3himCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM f3_hims;
      `;
      const existingCount = Number(f3himCount[0]?.count || 0);
      
      if (existingCount >= count) {
        console.log('✅ Data already migrated. Skipping migration.\n');
        return;
      }
    }

    // Step 1: Create f3_hims table if it doesn't exist
    console.log('📝 Step 1: Ensuring f3_hims table exists...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS f3_hims (
        id TEXT PRIMARY KEY,
        firebase_id TEXT UNIQUE NOT NULL,
        email TEXT,
        first_name TEXT,
        last_name TEXT,
        f3_handle TEXT UNIQUE,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ f3_hims table ready\n');

    // Step 2: Migrate athlete data to f3_hims
    console.log('📝 Step 2: Migrating athlete data to f3_hims...');
    await prisma.$executeRaw`
      INSERT INTO f3_hims (id, firebase_id, email, first_name, last_name, f3_handle, photo_url, created_at, updated_at)
      SELECT 
        id,
        firebase_id,
        email,
        first_name,
        last_name,
        gofast_handle as f3_handle,
        photo_url,
        created_at,
        updated_at
      FROM athletes
      ON CONFLICT (firebase_id) DO NOTHING;
    `;
    console.log('✅ Data migrated\n');

    // Step 3: Update foreign keys in related tables
    console.log('📝 Step 3: Updating foreign keys in related tables...');
    
    // Check and update attendance_records
    const attendanceTableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'attendance_records'
        AND column_name = 'f3_him_id'
      ) as exists;
    `;

    if (!attendanceTableExists[0]?.exists) {
      console.log('  - Adding f3_him_id to attendance_records...');
      await prisma.$executeRaw`
        ALTER TABLE attendance_records 
        ADD COLUMN IF NOT EXISTS f3_him_id TEXT;
      `;
      
      await prisma.$executeRaw`
        UPDATE attendance_records 
        SET f3_him_id = athlete_id 
        WHERE f3_him_id IS NULL;
      `;
      console.log('  ✅ attendance_records updated');
    }

    // Check and update effort_records
    const effortTableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'effort_records'
        AND column_name = 'f3_him_id'
      ) as exists;
    `;

    if (!effortTableExists[0]?.exists) {
      console.log('  - Adding f3_him_id to effort_records...');
      await prisma.$executeRaw`
        ALTER TABLE effort_records 
        ADD COLUMN IF NOT EXISTS f3_him_id TEXT;
      `;
      
      await prisma.$executeRaw`
        UPDATE effort_records 
        SET f3_him_id = athlete_id 
        WHERE f3_him_id IS NULL;
      `;
      console.log('  ✅ effort_records updated');
    }

    // Check and update weekly_reflections
    const reflectionTableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'weekly_reflections'
        AND column_name = 'f3_him_id'
      ) as exists;
    `;

    if (!reflectionTableExists[0]?.exists) {
      console.log('  - Adding f3_him_id to weekly_reflections...');
      await prisma.$executeRaw`
        ALTER TABLE weekly_reflections 
        ADD COLUMN IF NOT EXISTS f3_him_id TEXT;
      `;
      
      await prisma.$executeRaw`
        UPDATE weekly_reflections 
        SET f3_him_id = athlete_id 
        WHERE f3_him_id IS NULL;
      `;
      console.log('  ✅ weekly_reflections updated');
    }

    // Check and update self_report_entries
    const selfReportTableExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'self_report_entries'
        AND column_name = 'f3_him_id'
      ) as exists;
    `;

    if (!selfReportTableExists[0]?.exists) {
      console.log('  - Adding f3_him_id to self_report_entries...');
      await prisma.$executeRaw`
        ALTER TABLE self_report_entries 
        ADD COLUMN IF NOT EXISTS f3_him_id TEXT;
      `;
      
      await prisma.$executeRaw`
        UPDATE self_report_entries 
        SET f3_him_id = athlete_id 
        WHERE f3_him_id IS NULL;
      `;
      console.log('  ✅ self_report_entries updated');
    }

    console.log('\n✅ Migration complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npx prisma db push');
    console.log('   2. Verify data integrity');
    console.log('   3. Test application');

  } catch (error: any) {
    console.error('\n❌ Migration error:', error.message);
    console.error('Details:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateToF3HIM()
  .then(() => {
    console.log('\n✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed');
    process.exit(1);
  });

