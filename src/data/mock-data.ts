import { User, Child, Session, Homework, Report, SalaryData } from '@/types'

export interface ProgressData {
  id: string
  childId: string
  month: string
  year: number
  motorik: number
  kognitif: number
  sosial: number
  bahasa: number
  notes?: string
  createdAt: Date
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@anakhebat.com',
    name: 'Admin Utama',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'sari.parent@email.com',
    name: 'Sari Wijaya',
    role: 'parent',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'dr.budi@anakhebat.com',
    name: 'Dr. Budi Santoso',
    role: 'therapist',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    email: 'dr.ani@anakhebat.com',
    name: 'Dr. Ani Pratiwi',
    role: 'psychologist',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    email: 'ratna.parent@email.com',
    name: 'Ratna Sari',
    role: 'parent',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    email: 'dr.rina@anakhebat.com',
    name: 'Dr. Rina Kartika',
    role: 'therapist',
    createdAt: new Date('2024-01-20'),
  },
]

export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    parentId: '2',
    age: 7,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    parentId: '5',
    age: 5,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Rizki Pratama',
    parentId: '2',
    age: 9,
    createdAt: new Date('2024-01-20'),
  },
]

export const mockSessions: Session[] = [
  {
    id: '1',
    childId: '1',
    therapistId: '3',
    date: new Date('2024-08-15'),
    notes: 'Sesi terapi motorik halus berjalan dengan baik. Ahmad menunjukkan peningkatan dalam koordinasi tangan dan mata.',
    images: ['/api/mock-images/session-1-1.jpg', '/api/mock-images/session-1-2.jpg'],
    status: 'completed',
  },
  {
    id: '2',
    childId: '2',
    therapistId: '6',
    date: new Date('2024-08-16'),
    notes: 'Siti masih mengalami kesulitan dalam konsentrasi. Perlu latihan fokus yang lebih intensif.',
    images: ['/api/mock-images/session-2-1.jpg'],
    status: 'completed',
  },
  {
    id: '3',
    childId: '3',
    therapistId: '3',
    date: new Date('2024-08-17'),
    notes: 'Rizki menunjukkan kemajuan signifikan dalam kemampuan komunikasi verbal.',
    images: [],
    status: 'pending',
  },
]

export const mockHomework: Homework[] = [
  {
    id: '1',
    childId: '1',
    therapistId: '3',
    title: 'Latihan Menggambar Garis',
    description: 'Latih Ahmad untuk menggambar garis lurus, melengkung, dan zigzag selama 15 menit setiap hari.',
    dueDate: new Date('2024-08-20'),
    status: 'pending',
  },
  {
    id: '2',
    childId: '2',
    therapistId: '6',
    title: 'Latihan Konsentrasi',
    description: 'Minta Siti untuk menyelesaikan puzzle sederhana tanpa gangguan selama 10 menit.',
    dueDate: new Date('2024-08-18'),
    status: 'completed',
  },
  {
    id: '3',
    childId: '3',
    therapistId: '3',
    title: 'Latihan Bicara',
    description: 'Latih Rizki untuk mengucapkan kata-kata dengan jelas sambil melihat cermin.',
    dueDate: new Date('2024-08-19'),
    status: 'overdue',
  },
]

export const mockReports: Report[] = [
  {
    id: '1',
    sessionId: '1',
    psychologistId: '4',
    conclusion: 'Ahmad menunjukkan perkembangan yang baik dalam terapi motorik halus. Rekomendasi: lanjutkan program terapi dengan intensitas yang sama.',
    status: 'reviewed',
    createdAt: new Date('2024-08-16'),
  },
  {
    id: '2',
    sessionId: '2',
    psychologistId: '4',
    conclusion: 'Siti memerlukan pendekatan terapi yang lebih spesifik untuk masalah konsentrasi. Pertimbangkan untuk menambah sesi terapi.',
    status: 'pending',
    createdAt: new Date('2024-08-17'),
  },
]

export const mockSalaryData: SalaryData[] = [
  {
    id: '1',
    userId: '3',
    amount: 8500000,
    month: 'August',
    year: 2024,
    status: 'paid',
  },
  {
    id: '2',
    userId: '6',
    amount: 7500000,
    month: 'August',
    year: 2024,
    status: 'pending',
  },
  {
    id: '3',
    userId: '4',
    amount: 12000000,
    month: 'August',
    year: 2024,
    status: 'paid',
  },
]

// Helper functions to get data by relationships
export const getChildrenByParentId = (parentId: string) => {
  return mockChildren.filter(child => child.parentId === parentId)
}

export const getSessionsByChildId = (childId: string) => {
  return mockSessions.filter(session => session.childId === childId)
}

export const getHomeworkByChildId = (childId: string) => {
  return mockHomework.filter(homework => homework.childId === childId)
}

export const getReportsByPsychologistId = (psychologistId: string) => {
  return mockReports.filter(report => report.psychologistId === psychologistId)
}

export const getSalaryByUserId = (userId: string) => {
  return mockSalaryData.filter(salary => salary.userId === userId)
}

// Mock progress data for children
export const mockProgressData: ProgressData[] = [
  // Ahmad Wijaya (ID: 1) - 6 months progress
  {
    id: '1',
    childId: '1',
    month: '3',
    year: 2024,
    motorik: 60,
    kognitif: 65,
    sosial: 55,
    bahasa: 70,
    notes: 'Perkembangan motorik halus mulai terlihat, perlu latihan lebih intensif',
    createdAt: new Date('2024-03-31')
  },
  {
    id: '2',
    childId: '1',
    month: '4',
    year: 2024,
    motorik: 65,
    kognitif: 68,
    sosial: 58,
    bahasa: 72,
    notes: 'Kemampuan kognitif meningkat, konsentrasi lebih baik',
    createdAt: new Date('2024-04-30')
  },
  {
    id: '3',
    childId: '1',
    month: '5',
    year: 2024,
    motorik: 68,
    kognitif: 70,
    sosial: 62,
    bahasa: 75,
    notes: 'Interaksi sosial mulai berkembang, lebih percaya diri',
    createdAt: new Date('2024-05-31')
  },
  {
    id: '4',
    childId: '1',
    month: '6',
    year: 2024,
    motorik: 70,
    kognitif: 72,
    sosial: 65,
    bahasa: 78,
    notes: 'Kemampuan bahasa berkembang pesat, kosakata bertambah',
    createdAt: new Date('2024-06-30')
  },
  {
    id: '5',
    childId: '1',
    month: '7',
    year: 2024,
    motorik: 72,
    kognitif: 75,
    sosial: 68,
    bahasa: 82,
    notes: 'Koordinasi motorik halus semakin baik, bisa menulis dengan rapi',
    createdAt: new Date('2024-07-31')
  },
  {
    id: '6',
    childId: '1',
    month: '8',
    year: 2024,
    motorik: 75,
    kognitif: 78,
    sosial: 70,
    bahasa: 85,
    notes: 'Perkembangan sangat baik, siap untuk level terapi berikutnya',
    createdAt: new Date('2024-08-31')
  },
  
  // Siti Nurhaliza (ID: 2) - 4 months progress
  {
    id: '7',
    childId: '2',
    month: '5',
    year: 2024,
    motorik: 45,
    kognitif: 40,
    sosial: 50,
    bahasa: 55,
    notes: 'Masih perlu bantuan dalam konsentrasi dan fokus',
    createdAt: new Date('2024-05-31')
  },
  {
    id: '8',
    childId: '2',
    month: '6',
    year: 2024,
    motorik: 50,
    kognitif: 45,
    sosial: 55,
    bahasa: 60,
    notes: 'Kemampuan motorik mulai berkembang, perlu latihan rutin',
    createdAt: new Date('2024-06-30')
  },
  {
    id: '9',
    childId: '2',
    month: '7',
    year: 2024,
    motorik: 55,
    kognitif: 50,
    sosial: 60,
    bahasa: 65,
    notes: 'Konsentrasi mulai membaik, bisa fokus lebih lama',
    createdAt: new Date('2024-07-31')
  },
  {
    id: '10',
    childId: '2',
    month: '8',
    year: 2024,
    motorik: 60,
    kognitif: 55,
    sosial: 65,
    bahasa: 70,
    notes: 'Perkembangan konsisten, interaksi sosial lebih aktif',
    createdAt: new Date('2024-08-31')
  },
  
  // Rizki Pratama (ID: 3) - 3 months progress
  {
    id: '11',
    childId: '3',
    month: '6',
    year: 2024,
    motorik: 70,
    kognitif: 75,
    sosial: 60,
    bahasa: 65,
    notes: 'Kemampuan kognitif sangat baik, perlu fokus pada sosialisasi',
    createdAt: new Date('2024-06-30')
  },
  {
    id: '12',
    childId: '3',
    month: '7',
    year: 2024,
    motorik: 75,
    kognitif: 80,
    sosial: 65,
    bahasa: 70,
    notes: 'Kemampuan bahasa berkembang, lebih berani berbicara',
    createdAt: new Date('2024-07-31')
  },
  {
    id: '13',
    childId: '3',
    month: '8',
    year: 2024,
    motorik: 80,
    kognitif: 85,
    sosial: 70,
    bahasa: 75,
    notes: 'Perkembangan sangat baik di semua aspek',
    createdAt: new Date('2024-08-31')
  }
]

export const getProgressByChildId = (childId: string) => {
  return mockProgressData.filter(progress => progress.childId === childId)
}
