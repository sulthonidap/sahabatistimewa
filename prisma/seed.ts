import { PrismaClient, UserRole, SessionStatus, HomeworkStatus, ReportStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Hash password function
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.report.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.session.deleteMany()
  await prisma.child.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'ngadmin@anakhebat.com',
      name: 'Admin Utama',
      password: await hashPassword('password'),
      role: UserRole.ADMIN,
    },
  })

  const parent1 = await prisma.user.create({
    data: {
      email: 'sari.parent@email.com',
      name: 'Sari Wijaya',
      password: await hashPassword('password'),
      role: UserRole.PARENT,
    },
  })

  const parent2 = await prisma.user.create({
    data: {
      email: 'budi.parent@email.com',
      name: 'Budi Santoso',
      password: await hashPassword('password'),
      role: UserRole.PARENT,
    },
  })

  const therapist = await prisma.user.create({
    data: {
      email: 'dr.sarah@anakhebat.com',
      name: 'Dr. Sarah Johnson',
      password: await hashPassword('password'),
      role: UserRole.THERAPIST,
    },
  })

  const psychologist = await prisma.user.create({
    data: {
      email: 'dr.ahmad@anakhebat.com',
      name: 'Dr. Ahmad Rahman',
      password: await hashPassword('password'),
      role: UserRole.PSYCHOLOGIST,
    },
  })

  // Create children
  const child1 = await prisma.child.create({
    data: {
      name: 'Ahmad Wijaya',
      age: 8,
      parentId: parent1.id,
    },
  })

  const child2 = await prisma.child.create({
    data: {
      name: 'Siti Santoso',
      age: 10,
      parentId: parent2.id,
    },
  })

  const child3 = await prisma.child.create({
    data: {
      name: 'Rina Wijaya',
      age: 6,
      parentId: parent1.id,
    },
  })

  // Create sessions
  const session1 = await prisma.session.create({
    data: {
      childId: child1.id,
      therapistId: therapist.id,
      date: new Date('2024-12-15'),
      duration: 60,
      notes: 'Sesi terapi pertama untuk Ahmad. Fokus pada keterampilan motorik halus.',
      status: SessionStatus.COMPLETED,
      images: JSON.stringify(['session1_1.jpg', 'session1_2.jpg']),
    },
  })

  const session2 = await prisma.session.create({
    data: {
      childId: child2.id,
      therapistId: therapist.id,
      date: new Date('2024-12-16'),
      duration: 45,
      notes: 'Sesi terapi untuk Siti. Latihan komunikasi dan interaksi sosial.',
      status: SessionStatus.COMPLETED,
      images: JSON.stringify(['session2_1.jpg']),
    },
  })

  const session3 = await prisma.session.create({
    data: {
      childId: child1.id,
      therapistId: therapist.id,
      date: new Date('2024-12-20'),
      duration: 60,
      notes: 'Sesi lanjutan untuk Ahmad. Progress yang baik dalam motorik halus.',
      status: SessionStatus.SCHEDULED,
      images: JSON.stringify([]),
    },
  })

  // Create homework
  const homework1 = await prisma.homework.create({
    data: {
      childId: child1.id,
      therapistId: therapist.id,
      title: 'Latihan Menggambar Lingkaran',
      description: 'Latihan menggambar lingkaran dengan pensil. Lakukan 10 kali sehari.',
      dueDate: new Date('2024-12-25'),
      status: HomeworkStatus.ASSIGNED,
    },
  })

  const homework2 = await prisma.homework.create({
    data: {
      childId: child2.id,
      therapistId: therapist.id,
      title: 'Latihan Berbicara di Depan Cermin',
      description: 'Berlatih berbicara di depan cermin selama 5 menit setiap hari.',
      dueDate: new Date('2024-12-28'),
      status: HomeworkStatus.COMPLETED,
    },
  })

  // Create reports
  const report1 = await prisma.report.create({
    data: {
      childId: child1.id,
      therapistId: therapist.id,
      reportType: 'Evaluasi Awal',
      period: 'Desember 2024',
      summary: 'Ahmad menunjukkan potensi yang baik dalam perkembangan motorik. Perlu latihan lebih lanjut untuk keterampilan komunikasi.',
      recommendations: 'Lanjutkan program terapi motorik dan tambahkan latihan komunikasi.',
      status: ReportStatus.COMPLETED,
    },
  })

  const report2 = await prisma.report.create({
    data: {
      childId: child2.id,
      therapistId: therapist.id,
      reportType: 'Progress Bulanan',
      period: 'Desember 2024',
      summary: 'Siti telah menunjukkan kemajuan signifikan dalam interaksi sosial. Teruskan program terapi yang sedang berjalan.',
      recommendations: 'Tingkatkan intensitas latihan komunikasi dan tambahkan aktivitas kelompok.',
      status: ReportStatus.IN_PROGRESS,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.child.count()} children`)
  console.log(`Created ${await prisma.session.count()} sessions`)
  console.log(`Created ${await prisma.homework.count()} homework assignments`)
  console.log(`Created ${await prisma.report.count()} reports`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
