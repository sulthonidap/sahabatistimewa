const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickUpdate() {
  try {
    console.log('Updating admin email...');
    
    const result = await prisma.user.updateMany({
      where: { 
        email: 'admin@anakhebat.com',
        role: 'ADMIN'
      },
      data: { 
        email: 'ngadmin@anakhebat.com'
      }
    });
    
    console.log('Updated:', result.count, 'records');
    console.log('Now you can login with: ngadmin@anakhebat.com / password');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickUpdate();
