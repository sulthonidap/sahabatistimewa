export type UserRole = 'admin' | 'parent' | 'therapist' | 'psychologist'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface Child {
  id: string
  name: string
  parentId: string
  age: number
  createdAt: Date
}

export interface Session {
  id: string
  childId: string
  therapistId: string
  date: Date
  notes: string
  images: string[]
  status: 'completed' | 'pending' | 'cancelled'
}

export interface Homework {
  id: string
  childId: string
  therapistId: string
  title: string
  description: string
  dueDate: Date
  status: 'pending' | 'completed' | 'overdue'
}

export interface Report {
  id: string
  sessionId: string
  psychologistId: string
  conclusion: string
  status: 'pending' | 'reviewed' | 'revision_requested'
  createdAt: Date
}

export interface SalaryData {
  id: string
  userId: string
  amount: number
  month: string
  year: number
  status: 'paid' | 'pending'
}
