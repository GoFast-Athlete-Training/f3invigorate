import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');

    // Check if we can connect
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Check tables using raw SQL
    console.log('📊 Checking tables...');
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`  - ${t.table_name}`));

    // Check if athletes table exists
    const athletesTable = tables.find(t => t.table_name === 'athletes');
    if (!athletesTable) {
      console.log('\n❌ "athletes" table NOT FOUND!');
    } else {
      console.log('\n✅ "athletes" table EXISTS');
      
      // Try to query it
      try {
        const count = await prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*) as count FROM athletes;
        `;
        const athleteCount = Number(count[0].count);
        console.log(`\n📊 Athletes count: ${athleteCount}`);
        
        if (athleteCount === 0) {
          console.log('\n⚠️  ⚠️  ⚠️  WARNING: Table exists but is EMPTY - data was deleted! ⚠️  ⚠️  ⚠️');
        } else {
          // Show first few athletes
          const athletes = await prisma.athlete.findMany({
            take: 5,
            select: {
              id: true,
              firebaseId: true,
              email: true,
              firstName: true,
              lastName: true,
            }
          });
          console.log(`\n📋 Sample athletes (first ${athletes.length}):`);
          athletes.forEach(a => {
            console.log(`  - ${a.firstName} ${a.lastName} (${a.email}) - ${a.firebaseId}`);
          });
        }
      } catch (err: any) {
        console.log(`\n❌ Error querying athletes table: ${err.message}`);
      }
    }

    // Check GoFastCompany
    const companyTable = tables.find(t => t.table_name === 'GoFastCompany' || t.table_name === 'go_fast_companies');
    if (companyTable) {
      try {
        const count = await prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*) as count FROM "GoFastCompany";
        `;
        console.log(`\n📊 GoFastCompany count: ${Number(count[0].count)}`);
      } catch (err: any) {
        console.log(`\n⚠️  Could not query GoFastCompany: ${err.message}`);
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

