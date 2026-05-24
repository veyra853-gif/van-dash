import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateBrandsToOurClients() {
  try {
    console.log('Starting migration of brands to ourclients...');

    // Fetch all brands
    const brands = await prisma.brands.findMany();
    console.log(`Found ${brands.length} brands`);

    if (brands.length === 0) {
      console.log('No brands to migrate');
      await prisma.$disconnect();
      return;
    }

    // Create OurClients records from brands
    for (const brand of brands) {
      const ourClient = await prisma.ourClients.create({
        data: {
          images: brand.images,
        },
      });
      console.log(`Created ourClient with ${ourClient.images.length} images`);
    }

    console.log('✓ Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateBrandsToOurClients();
