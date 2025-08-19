'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, CheckCircle, DollarSign, Loader2 } from 'lucide-react'

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

interface PayConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  salary: Salary | null
  loading: boolean
}

export function PayConfirmationModal({ isOpen, onClose, onConfirm, salary, loading }: PayConfirmationModalProps) {
  if (!isOpen || !salary) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Konfirmasi Pembayaran</CardTitle>
                  <CardDescription className="text-gray-600">Konfirmasi pembayaran gaji karyawan</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} disabled={loading} className="h-8 w-8 p-0 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {salary.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{salary.user.name}</h3>
                    <p className="text-sm text-gray-600">{salary.user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{salary.user.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Periode:</span>
                  <span className="text-sm text-gray-900 font-medium">{salary.month} {salary.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Gaji:</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(salary.totalSalary)}</span>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Konfirmasi Pembayaran</p>
                    <p className="text-sm text-green-700 mt-1">
                      Dengan mengkonfirmasi ini, status gaji akan berubah menjadi <strong>"Dibayar"</strong> dan 
                      tanggal pembayaran akan dicatat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengkonfirmasi...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Konfirmasi Pembayaran
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
