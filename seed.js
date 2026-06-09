// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Mikando menu...');

  // Clear existing data
  await prisma.dish.deleteMany();

  await prisma.dish.createMany({
    data: [
      {
        name: 'Chips Chicken',
        price: 12000,
        description: 'Crispy golden chips + tender, juicy chicken',
        category: 'Main',
        available: true,
      },
      {
        name: 'Chicken Plain',
        price: 7000,
        description: 'Tender, juicy chicken — just the way you like it',
        category: 'Main',
        available: true,
      },
      {
        name: 'Chips Liver',
        price: 11000,
        description: 'Liver & chips combo, seasoned to perfection',
        category: 'Main',
        available: true,
      },
      {
        name: 'Chips Beef',
        price: 11000,
        description: 'Beef & chips — hearty and filling',
        category: 'Main',
        available: true,
      },
      {
        name: 'Chips Plain',
        price: 5000,
        description: 'Golden crispy chips, perfectly salted',
        category: 'Sides',
        available: true,
      },
      {
        name: 'Soda',
        price: 5000,
        description: '1 Litre chilled bottle',
        category: 'Drinks',
        available: true,
      },
    ],
  });

  console.log('✅ Seeded 6 dishes successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
