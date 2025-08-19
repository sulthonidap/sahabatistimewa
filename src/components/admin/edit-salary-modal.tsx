'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Loader2 } from 'lucide-react'

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

interface EditSalaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSalaryUpdated: () => void
  salary: Salary | null
}

export function EditSalaryModal({ isOpen, onClose, onSalaryUpdated, salary }: EditSalaryModalProps) {
  const [formData, setFormData] = useState({
    userId: '',
    month: '',
    year: '',
    baseSalary: '',
    allowance: '',
    bonus: '',
    deductions: '',
    status: '',
    notes: ''
  })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (salary && isOpen) {
      setFormData({
        userId: salary.userId,
        month: salary.month,
        year: salary.year.toString(),
        baseSalary: salary.baseSalary.toString(),
        allowance: salary.allowance.toString(),
        bonus: salary.bonus.toString(),
        deductions: salary.deductions.toString(),
        status: salary.status.toLowerCase(),
        notes: salary.notes || ''
      })
    }
  }, [salary, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  useEffect(() => {
    if (users.length > 0 && salary && isOpen) {
      setFormData(prev => ({
        ...prev,
        userId: salary.userId
      }))
    }
  }, [users, salary, isOpen])

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

  const calculateTotalSalary = () => {
    const baseSalary = parseFloat(formData.baseSalary) || 0
    const allowance = parseFloat(formData.allowance) || 0
    const bonus = parseFloat(formData.bonus) || 0
    const deductions = parseFloat(formData.deductions) || 0
    
    return baseSalary + allowance + bonus - deductions
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const totalSalary = calculateTotalSalary()
      
      const response = await fetch(`/api/salary/${salary?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          month: formData.month,
          year: parseInt(formData.year),
          baseSalary: parseFloat(formData.baseSalary),
          allowance: parseFloat(formData.allowance),
          bonus: parseFloat(formData.bonus),
          deductions: parseFloat(formData.deductions),
          totalSalary,
          status: formData.status.toUpperCase(),
          notes: formData.notes
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSalaryUpdated()
        onClose()
      } else {
        setError(data.error || 'Gagal mengupdate gaji')
      }
    } catch (error) {
      console.error('Error updating salary:', error)
      setError('Terjadi kesalahan saat mengupdate gaji')
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
        status: '',
        notes: ''
      })
      setError('')
      onClose()
    }
  }

  if (!isOpen || !salary) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl bg-white relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Edit Gaji</CardTitle>
              <CardDescription className="text-gray-600">Update informasi gaji</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Karyawan</label>
                <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })} disabled={loading}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    {users.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>{user.name} ({user.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bulan</label>
                  <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })} disabled={loading}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                      <SelectValue placeholder="Pilih bulan" />
                    </SelectTrigger>
                    <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                      {[
                        { value: 'Januari', label: 'Januari' },
                        { value: 'Februari', label: 'Februari' },
                        { value: 'Maret', label: 'Maret' },
                        { value: 'April', label: 'April' },
                        { value: 'Mei', label: 'Mei' },
                        { value: 'Juni', label: 'Juni' },
                        { value: 'Juli', label: 'Juli' },
                        { value: 'Agustus', label: 'Agustus' },
                        { value: 'September', label: 'September' },
                        { value: 'Oktober', label: 'Oktober' },
                        { value: 'November', label: 'November' },
                        { value: 'Desember', label: 'Desember' }
                      ].map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>{month.label}</span>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gaji Pokok</label>
                <Input
                  type="number"
                  placeholder="Masukkan gaji pokok"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                  required
                  disabled={loading}
                  min="0"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tunjangan</label>
                <Input
                  type="number"
                  placeholder="Masukkan tunjangan"
                  value={formData.allowance}
                  onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                  disabled={loading}
                  min="0"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bonus</label>
                <Input
                  type="number"
                  placeholder="Masukkan bonus"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  disabled={loading}
                  min="0"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Potongan</label>
                <Input
                  type="number"
                  placeholder="Masukkan potongan"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                  disabled={loading}
                  min="0"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} disabled={loading}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem
                      value="pending"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Menunggu</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="paid"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Dibayar</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="cancelled"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Dibatalkan</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Catatan</label>
                <Input
                  type="text"
                  placeholder="Masukkan catatan (opsional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={loading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              {/* Total Salary Display */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Gaji:</span>
                  <span className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(calculateTotalSalary())}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formula: Gaji Pokok + Tunjangan + Bonus - Potongan
                </p>
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
                    'Update Gaji'
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
