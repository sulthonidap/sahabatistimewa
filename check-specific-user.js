const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('🔍 Mengecek user admin...\n');
    
    // Cek dengan email lama
    const oldAdmin = await prisma.user.findUnique({
      where: { email: 'admin@anakhebat.com' }
    });
    
    // Cek dengan email baru
    const newAdmin = await prisma.user.findUnique({
      where: { email: 'ngadmin@anakhebat.com' }
    });
    
    console.log('📧 Email lama (admin@anakhebat.com):');
    if (oldAdmin) {
      console.log(`   ✅ Ditemukan: ${oldAdmin.name} - ${oldAdmin.role}`);
    } else {
      console.log('   ❌ Tidak ditemukan');
    }
    
    console.log('\n📧 Email baru (ngadmin@anakhebat.com):');
    if (newAdmin) {
      console.log(`   ✅ Ditemukan: ${newAdmin.name} - ${newAdmin.role}`);
    } else {
      console.log('   ❌ Tidak ditemukan');
    }
    
    // Cek semua admin
    console.log('\n👥 Semua user dengan role ADMIN:');
    const allAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { email: true, name: true }
    });
    
    allAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name} - ${admin.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
