import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedClientsSection() {
  try {
    console.log('Creating initial ClientsSection record...');

    // Check if a record already exists
    const existing = await prisma.clientsSection.findFirst({});
    if (existing) {
      console.log('ClientsSection record already exists, skipping...');
      await prisma.$disconnect();
      return;
    }

    const record = await prisma.clientsSection.create({
      data: {
        badgeLabel: 'Trusted Partners',
        title: 'Proud to Work With',
        description: 'Leading organizations trust us with their most critical operations and transformational initiatives',
      },
    });

    console.log('✓ ClientsSection record created:', record.id);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedClientsSection();
