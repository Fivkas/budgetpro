import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Fivos',
      email: 'fivos@example.com',
      password: '1234',
    },
  });

  const food = await prisma.category.create({
    data: { name: 'Food', userId: user.id },
  });

  const groceries = await prisma.transaction.create({
    data: {
      title: 'Groceries',
      amount: -50,
      type: 'expense',
      userId: user.id,
      categoryId: food.id,
    },
  });

  const salary = await prisma.transaction.create({
    data: {
      title: 'Salary',
      amount: 2500,
      type: 'income',
      userId: user.id,
      categoryId: food.id,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

