'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as XLSX from 'xlsx'
import { 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  Download,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react'
import { SalaryModal } from '@/components/admin/salary-modal'
import { SalaryDetailsModal } from '@/components/admin/salary-details-modal'
import { EditSalaryModal } from '@/components/admin/edit-salary-modal'
import { DeleteConfirmationModal } from '@/components/admin/delete-confirmation-modal'
import { PayConfirmationModal } from '@/components/admin/pay-confirmation-modal'
import { Pagination } from '@/components/ui/pagination'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Salary {
  id: string
  userId: string
  month: string | number
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

interface SalaryStatistics {
  totalSalary: number
  paidSalary: number
  pendingSalary: number
}

export default function AdminSalaryPage() {
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null)
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null)
  const [showSalaryDetails, setShowSalaryDetails] = useState(false)
  const [showEditSalary, setShowEditSalary] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showPayConfirmation, setShowPayConfirmation] = useState(false)
  const [salaryToDelete, setSalaryToDelete] = useState<Salary | null>(null)
  const [salaryToPay, setSalaryToPay] = useState<Salary | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [statistics, setStatistics] = useState<SalaryStatistics>({
    totalSalary: 0,
    paidSalary: 0,
    pendingSalary: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchSalaries()
  }, [filterMonth, filterYear, filterStatus])

  const fetchSalaries = async () => {
    try {
      setLoading(true)
      setError('')
      
      let url = '/api/salary?'
      if (filterMonth !== 'all') url += `month=${filterMonth}&`
      if (filterYear !== 'all') url += `year=${filterYear}&`
      if (filterStatus !== 'all') url += `status=${filterStatus}&`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setSalaries(data.salaries)
        setStatistics(data.statistics)
      } else {
        setError('Gagal memuat data gaji')
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
      setError('Gagal memuat data gaji')
    } finally {
      setLoading(false)
    }
  }

  const filteredSalaries = salaries.filter(salary => {
    const searchLower = searchTerm.toLowerCase()
    return (
      salary.user.name.toLowerCase().includes(searchLower) ||
      salary.user.email.toLowerCase().includes(searchLower) ||
      salary.user.role.toLowerCase().includes(searchLower)
    )
  })

  // Pagination logic
  const totalItems = filteredSalaries.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSalaries = filteredSalaries.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterMonth, filterYear, filterStatus])

  const handleDeleteSalary = async (salary: Salary) => {
    setSalaryToDelete(salary)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteSalary = async () => {
    if (!salaryToDelete) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/salary?id=${salaryToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSalaries()
        setShowDeleteConfirmation(false)
        setSalaryToDelete(null)
      } else {
        alert('Gagal menghapus data gaji')
      }
    } catch (error) {
      console.error('Error deleting salary:', error)
      alert('Terjadi kesalahan saat menghapus data gaji')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePaySalary = async (salary: Salary) => {
    setSalaryToPay(salary)
    setShowPayConfirmation(true)
  }

  const confirmPaySalary = async () => {
    if (!salaryToPay) return

    try {
      setPayLoading(true)
      const response = await fetch('/api/salary', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: salaryToPay.id,
          status: 'PAID'
        }),
      })

      if (response.ok) {
        fetchSalaries()
        setShowPayConfirmation(false)
        setSalaryToPay(null)
      } else {
        alert('Gagal mengubah status gaji')
      }
    } catch (error) {
      console.error('Error updating salary status:', error)
      alert('Terjadi kesalahan saat mengubah status gaji')
    } finally {
      setPayLoading(false)
    }
  }

  const handleAddSalaryClick = () => {
    setEditingSalary(null)
    setShowSalaryModal(true)
  }

  const handleViewSalary = (salary: Salary) => {
    setSelectedSalary(salary)
    setShowSalaryDetails(true)
  }

  const handleEditSalary = (salary: Salary) => {
    setSelectedSalary(salary)
    setShowEditSalary(true)
  }

  const handleEditSalaryClick = (salary: Salary) => {
    setEditingSalary(salary)
    setShowSalaryModal(true)
  }

  const handleCloseModal = () => {
    setShowSalaryModal(false)
    setEditingSalary(null)
  }

  const handleSalaryAdded = () => {
    fetchSalaries()
  }

  const handleSalaryUpdated = () => {
    fetchSalaries()
  }

  const handleCloseEditModal = () => {
    setShowEditSalary(false)
    setSelectedSalary(null)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmation(false)
    setSalaryToDelete(null)
  }

  const handleClosePayModal = () => {
    setShowPayConfirmation(false)
    setSalaryToPay(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getMonthName = (month: string) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return months[parseInt(month) - 1] || month
  }

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredSalaries.map((salary) => ({
        'Nama Karyawan': salary.user.name,
        'Email': salary.user.email,
        'Jabatan': salary.user.role,
        'Periode': `${getMonthName(salary.month)} ${salary.year}`,
        'Gaji Pokok': salary.baseSalary,
        'Tunjangan': salary.allowance,
        'Bonus': salary.bonus,
        'Potongan': salary.deductions,
        'Total Gaji': salary.totalSalary,
        'Status': salary.status === 'PENDING' ? 'Pending' : 
                 salary.status === 'PAID' ? 'Sudah Dibayar' : 
                 salary.status === 'CANCELLED' ? 'Dibatalkan' : salary.status,
        'Tanggal Dibayar': salary.paidAt ? new Date(salary.paidAt).toLocaleDateString('id-ID') : '-',
        'Catatan': salary.notes || '-'
      }))

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Nama Karyawan
        { wch: 25 }, // Email
        { wch: 15 }, // Jabatan
        { wch: 15 }, // Periode
        { wch: 15 }, // Gaji Pokok
        { wch: 15 }, // Tunjangan
        { wch: 15 }, // Bonus
        { wch: 15 }, // Potongan
        { wch: 15 }, // Total Gaji
        { wch: 15 }, // Status
        { wch: 15 }, // Tanggal Dibayar
        { wch: 30 }, // Catatan
      ]
      worksheet['!cols'] = columnWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Gaji')

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0]
      const fileName = `Laporan_Gaji_${currentDate}.xlsx`

      // Save file
      XLSX.writeFile(workbook, fileName)

      // Show success message
      alert('Data berhasil diekspor ke Excel!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Gagal mengekspor data ke Excel')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Sudah dibayar
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Dibatalkan
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-gray-600">Memuat data gaji...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchSalaries} className="mt-4">Coba Lagi</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="admin" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Gaji</h1>
            <p className="text-gray-600">Kelola dan monitor pembayaran gaji karyawan</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Gaji</p>
                    <p className="text-2xl font-bold text-blue-900">
                      Rp {statistics.totalSalary.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Sudah Dibayar</p>
                    <p className="text-2xl font-bold text-green-900">
                      Rp {statistics.paidSalary.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      Rp {statistics.pendingSalary.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Karyawan</p>
                    <p className="text-2xl font-bold text-purple-900">{salaries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salary Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Gaji</CardTitle>
                  <CardDescription>Total {salaries.length} data gaji</CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddSalaryClick}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Gaji
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                    disabled={loading || filteredSalaries.length === 0}
                    onClick={exportToExcel}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>

                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem 
                      value="all"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Semua bulan</span>
                      </div>
                    </SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem 
                        key={month} 
                        value={month.toString()}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>{getMonthName(month.toString())}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem 
                      value="all"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Semua tahun</span>
                      </div>
                    </SelectItem>
                    {Array.from({ length: 5 }, (_, i) => 2024 - i).map((year) => (
                      <SelectItem 
                        key={year} 
                        value={year.toString()}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>{year}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem 
                      value="all"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Semua status</span>
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="pending"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem 
                      value="paid"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span>Sudah dibayar</span>
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

              {/* Salaries Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Karyawan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Periode</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Gaji Pokok</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Tunjangan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Bonus</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Potongan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSalaries.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-500">
                          Tidak ada data gaji ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentSalaries.map((salary) => (
                        <tr key={salary.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{salary.user.name}</p>
                              <p className="text-sm text-gray-600">{salary.user.email}</p>
                              <p className="text-xs text-gray-500">{salary.user.role}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">{getMonthName(salary.month)} {salary.year}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">Rp {salary.baseSalary.toLocaleString('id-ID')}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">Rp {salary.allowance.toLocaleString('id-ID')}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">Rp {salary.bonus.toLocaleString('id-ID')}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">Rp {salary.deductions.toLocaleString('id-ID')}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-900">Rp {salary.totalSalary.toLocaleString('id-ID')}</p>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(salary.status)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                                                          {salary.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium"
                                  onClick={() => handlePaySalary(salary)}
                                  title="Konfirmasi Pembayaran"
                                >
                                  Konfirmasi
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => handleViewSalary(salary)}
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                onClick={() => handleEditSalary(salary)}
                                title="Edit Gaji"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteSalary(salary)}
                                title="Hapus Gaji"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Salary Details Modal */}
      {showSalaryDetails && selectedSalary && (
        <SalaryDetailsModal
          isOpen={showSalaryDetails}
          onClose={() => setShowSalaryDetails(false)}
          salary={selectedSalary}
        />
      )}

      {/* Edit Salary Modal */}
      {showEditSalary && selectedSalary && (
        <EditSalaryModal
          isOpen={showEditSalary}
          onClose={handleCloseEditModal}
          onSalaryUpdated={handleSalaryUpdated}
          salary={selectedSalary}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && salaryToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDeleteSalary}
          title="Hapus Gaji"
          message="Apakah Anda yakin ingin menghapus data gaji ini? Tindakan ini tidak dapat dibatalkan."
          itemName={salaryToDelete.user.name}
          loading={deleteLoading}
        />
      )}

      {/* Pay Confirmation Modal */}
      {showPayConfirmation && salaryToPay && (
        <PayConfirmationModal
          isOpen={showPayConfirmation}
          onClose={handleClosePayModal}
          onConfirm={confirmPaySalary}
          salary={salaryToPay}
          loading={payLoading}
        />
      )}

      {showSalaryModal && (
        <SalaryModal
          isOpen={showSalaryModal}
          onClose={handleCloseModal}
          onSalaryAdded={handleSalaryAdded}
          salary={editingSalary}
        />
      )}
    </div>
  )
}
