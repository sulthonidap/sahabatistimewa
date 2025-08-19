'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Salary {
  id: string
  userId: string
  month: string
  year: number
  baseSalary: number
  allowance: number
  bonus: number
  deductions: number
  totalSalary: number
  status: string
  paidAt: string | null
  notes: string | null
  user: User
}

interface SalaryDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  salary: Salary | null
}

export function SalaryDetailsModal({ isOpen, onClose, salary }: SalaryDetailsModalProps) {
  if (!isOpen || !salary) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Dibayar</span>
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Menunggu</span>
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Dibatalkan</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Admin</span>
      case 'PARENT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Parent</span>
      case 'THERAPIST':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Therapist</span>
      case 'PSYCHOLOGIST':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Psychologist</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Detail Gaji</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {salary.user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{salary.user.name}</h3>
                  <p className="text-gray-600">{salary.user.email}</p>
                  <div className="mt-1">{getRoleBadge(salary.user.role)}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Periode:</span>
                  <span className="text-sm text-gray-900">{salary.month} {salary.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className="text-sm">{getStatusBadge(salary.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Gaji Pokok:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(salary.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Tunjangan:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(salary.allowance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Bonus:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(salary.bonus)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Potongan:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(salary.deductions)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-sm font-bold text-gray-700">Total Gaji:</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(salary.totalSalary)}</span>
                </div>
                {salary.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Tanggal Dibayar:</span>
                    <span className="text-sm text-gray-900">{new Date(salary.paidAt).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
                {salary.notes && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Catatan:</span>
                    <span className="text-sm text-gray-900">{salary.notes}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">ID Gaji:</span>
                  <span className="text-sm text-gray-900 font-mono">{salary.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
