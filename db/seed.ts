import prisma from '@/lib/prisma'
import sampleData from './sample-data'

async function main() {
  try {
    console.log('Starting database seeding...')

    await prisma.product.deleteMany()
    console.log('✅ Existing products data deleted.')
    await prisma.user.deleteMany()
    console.log('✅ Existing users data deleted.')
  
    await prisma.product.createMany({ data: sampleData.products })
    await prisma.user.createMany({ data: sampleData.users })
    console.log('✅ Database seeding completed successfully')
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1)
  } finally {
    await prisma.$disconnect();
  }
}

main()