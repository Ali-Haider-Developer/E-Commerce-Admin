import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful!');

    // Test query
    const counters = await prisma.counter.findMany();
    console.log('Counters:', counters);

    console.log('Database verification completed successfully');
  } catch (error) {
    console.error('Database verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 