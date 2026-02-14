import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');

    await prisma.$connect();
    console.log('✅ Connected to database\n');

    console.log('📊 Checking tables...');
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`  - ${t.table_name}`));

    const f3himsTable = tables.find(t => t.table_name === 'f3_hims');
    if (!f3himsTable) {
      console.log('\n❌ "f3_hims" table NOT FOUND!');
    } else {
      console.log('\n✅ "f3_hims" table EXISTS');
      try {
        const count = await prisma.f3HIM.count();
        console.log(`\n📊 F3HIM count: ${count}`);
        if (count > 0) {
          const sample = await prisma.f3HIM.findMany({
            take: 5,
            select: {
              id: true,
              firebaseId: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          });
          console.log(`\n📋 Sample (first ${sample.length}):`);
          sample.forEach((a) => {
            console.log(`  - ${a.firstName ?? ""} ${a.lastName ?? ""} (${a.email ?? ""}) - ${a.firebaseId}`);
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`\n❌ Error querying f3_hims: ${msg}`);
      }
    }
  } catch (error: unknown) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
