const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminEmail() {
  try {
    console.log('🔄 Mengupdate email admin...\n');
    
    // Update email admin
    const updatedAdmin = await prisma.user.update({
      where: { email: 'admin@anakhebat.com' },
      data: { email: 'ngadmin@anakhebat.com' }
    });
    
    console.log('✅ Email admin berhasil diupdate!');
    console.log(`   Nama: ${updatedAdmin.name}`);
    console.log(`   Email baru: ${updatedAdmin.email}`);
    console.log(`   Role: ${updatedAdmin.role}`);
    
    console.log('\n🎯 Sekarang Anda bisa login dengan:');
    console.log('   Email: ngadmin@anakhebat.com');
    console.log('   Password: password');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminEmail();
