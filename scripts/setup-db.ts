import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create initial counters
  const counters = [
    { name: 'total_orders', value: 0 },
    { name: 'total_customers', value: 0 },
    { name: 'total_products', value: 0 },
    { name: 'total_revenue', value: 0 },
  ];

  for (const counter of counters) {
    await prisma.counter.upsert({
      where: { name: counter.name },
      update: {},
      create: counter,
    });
  }

  // Create initial content
  const content = [
    {
      type: 'hero',
      title: 'Welcome to Our Store',
      description: 'Discover our latest collection of products',
      image: '/images/hero/hero-main.jpg',
      order: 1,
      active: true,
    },
    {
      type: 'feature',
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
      image: '/images/features/shipping.jpg',
      order: 1,
      active: true,
    },
    {
      type: 'feature',
      title: 'Secure Payment',
      description: '100% secure payment processing',
      image: '/images/features/payment.jpg',
      order: 2,
      active: true,
    },
  ];

  for (const item of content) {
    await prisma.content.upsert({
      where: { type_order: { type: item.type, order: item.order } },
      update: {},
      create: item,
    });
  }

  console.log('Database setup completed successfully');
}

main()
  .catch((e) => {
    console.error('Error setting up database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 