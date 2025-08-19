'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Loader2, DollarSign } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Salary {
  id: string
  userId: string
  month: number
  year: number
  baseSalary: number
  allowance: number
  bonus: number
  deductions: number
  totalSalary: number
  status: string
  notes?: string
  user: User
}

interface SalaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSalaryAdded: () => void
  salary?: Salary | null // For editing
}

export function SalaryModal({ isOpen, onClose, onSalaryAdded, salary }: SalaryModalProps) {
  const [formData, setFormData] = useState({
    userId: '',
    month: '',
    year: '',
    baseSalary: '',
    allowance: '',
    bonus: '',
    deductions: '',
    notes: ''
  })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalSalary, setTotalSalary] = useState(0)

  const isEditing = !!salary

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
      if (salary) {
        // Populate form for editing
        setFormData({
          userId: salary.userId,
          month: salary.month.toString(),
          year: salary.year.toString(),
          baseSalary: salary.baseSalary.toString(),
          allowance: salary.allowance.toString(),
          bonus: salary.bonus.toString(),
          deductions: salary.deductions.toString(),
          notes: salary.notes || ''
        })
        setTotalSalary(salary.totalSalary)
      } else {
        // Reset form for adding
        setFormData({
          userId: '',
          month: '',
          year: '',
          baseSalary: '',
          allowance: '',
          bonus: '',
          deductions: '',
          notes: ''
        })
        setTotalSalary(0)
      }
    }
  }, [isOpen, salary])

  useEffect(() => {
    // Calculate total salary when form data changes
    const base = parseFloat(formData.baseSalary) || 0
    const allowance = parseFloat(formData.allowance) || 0
    const bonus = parseFloat(formData.bonus) || 0
    const deductions = parseFloat(formData.deductions) || 0
    
    setTotalSalary(base + allowance + bonus - deductions)
  }, [formData.baseSalary, formData.allowance, formData.bonus, formData.deductions])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        // Filter hanya therapist dan psychologist
        const filteredUsers = data.users.filter((user: User) => 
          user.role === 'THERAPIST' || user.role === 'PSYCHOLOGIST'
        )
        setUsers(filteredUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/api/salary` : '/api/salary'
      const method = isEditing ? 'PUT' : 'POST'
      
      const requestBody = isEditing 
        ? { id: salary?.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Reset form
        setFormData({
          userId: '',
          month: '',
          year: '',
          baseSalary: '',
          allowance: '',
          bonus: '',
          deductions: '',
          notes: ''
        })
        onSalaryAdded()
        onClose()
      } else {
        setError(data.error || 'Gagal menyimpan data gaji')
      }
    } catch (error) {
      console.error('Error saving salary:', error)
      setError('Terjadi kesalahan saat menyimpan data gaji')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        userId: '',
        month: '',
        year: '',
        baseSalary: '',
        allowance: '',
        bonus: '',
        deductions: '',
        notes: ''
      })
      setError('')
      onClose()
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return months[month - 1] || ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl bg-white relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Data Gaji' : 'Tambah Data Gaji'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isEditing ? 'Edit informasi gaji karyawan' : 'Masukkan informasi gaji karyawan baru'}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Karyawan</label>
                  <Select 
                    value={formData.userId} 
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                    disabled={loading || isEditing}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                      <SelectValue placeholder="Pilih karyawan" />
                    </SelectTrigger>
                    <SelectContent 
                      className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                      position="popper"
                      sideOffset={4}
                    >
                      {users.map((user) => (
                        <SelectItem 
                          key={user.id} 
                          value={user.id}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>{user.name} ({user.role})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bulan</label>
                  <Select 
                    value={formData.month} 
                    onValueChange={(value) => setFormData({ ...formData, month: value })}
                    disabled={loading}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent 
                      className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                      position="popper"
                      sideOffset={4}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem 
                          key={month} 
                          value={month.toString()}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>{getMonthName(month)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tahun</label>
                  <Input
                    type="number"
                    placeholder="2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    disabled={loading}
                    min="2020"
                    max="2030"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gaji Pokok</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                      required
                      disabled={loading}
                      min="0"
                      step="1000"
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tunjangan</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.allowance}
                      onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                      disabled={loading}
                      min="0"
                      step="1000"
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bonus</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                      disabled={loading}
                      min="0"
                      step="1000"
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Potongan</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.deductions}
                      onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                      disabled={loading}
                      min="0"
                      step="1000"
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Total Salary Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Total Gaji:</span>
                    <p className="text-xs text-gray-500 mt-1">Gaji Pokok + Tunjangan + Bonus - Potongan</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-600">
                      Rp {totalSalary.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Catatan</label>
                <Textarea
                  placeholder="Catatan tambahan (opsional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={loading}
                  rows={3}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    isEditing ? 'Update Gaji' : 'Tambah Gaji'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
