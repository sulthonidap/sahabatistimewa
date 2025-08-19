'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import { DeleteConfirmationModal } from '@/components/admin/delete-confirmation-modal'
import { 
  BookOpen,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  Upload,
  FileText,
  Target,
  X,
  MoreHorizontal,
  Loader2
} from 'lucide-react'
import { mockChildren, mockHomework } from '@/data/mock-data'

interface Homework {
  id: string
  childId: string
  therapistId: string
  title: string
  description?: string
  dueDate: string
  status: string
  createdAt: string
  updatedAt: string
  child?: {
    id: string
    name: string
    age: number
  }
  therapist?: {
    id: string
    name: string
    email: string
  }
}

export default function TherapistHomeworkPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [tableDateFilter, setTableDateFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)
  const [homeworkToDelete, setHomeworkToDelete] = useState<Homework | null>(null)
  const [homework, setHomework] = useState<Homework[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    childId: '',
    title: '',
    description: '',
    dueDate: ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const therapistId = 'cmehzhnfx00038saoy1wyo77f' // Actual therapist ID from database

  // Fetch homework data
  const fetchHomework = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/homework?therapistId=${therapistId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch homework')
      }
      const data = await response.json()
      setHomework(data.homework || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  // Fetch children data
  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/children')
      if (!response.ok) {
        throw new Error('Failed to fetch children')
      }
      const data = await response.json()
      setChildren(data.children || [])
    } catch (err) {
      console.error('Error fetching children:', err)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchHomework()
    fetchChildren()
  }, [])

  // Filter homework
  const filteredHomework = homework.filter(homework => {
    const matchesStatus = filterStatus === 'all' || homework.status === filterStatus
    const matchesSearch = homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.child?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Date filter
    let matchesDate = true
    if (tableDateFilter) {
      const homeworkDate = new Date(homework.dueDate).toISOString().split('T')[0]
      matchesDate = homeworkDate === tableDateFilter
    }
    
    return matchesStatus && matchesSearch && matchesDate
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        )
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Terlambat
          </span>
        )
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Diberikan
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

  const getStatusCount = (status: string) => {
    return homework.filter(hw => hw.status === status).length
  }

  const handleEditHomework = (homework: Homework) => {
    setSelectedHomework(homework)
    setShowEditModal(true)
  }

  const handleDeleteHomework = (homework: Homework) => {
    setHomeworkToDelete(homework)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!homeworkToDelete) return

    try {
      setLoading(true)
      
      const response = await fetch(`/api/homework/${homeworkToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus tugas rumah')
      }

      const result = await response.json()
      
      if (result.success) {
        // Refresh data
        fetchHomework()
        
        // Close modal and reset
        setShowDeleteModal(false)
        setHomeworkToDelete(null)
        
        // Show success message (you can add toast notification here)
        console.log('Tugas rumah berhasil dihapus')
      } else {
        throw new Error(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setHomeworkToDelete(null)
  }

  const handleMarkComplete = async (homeworkId: string) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/homework', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: homeworkId,
          status: 'COMPLETED'
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengubah status tugas')
      }

      const result = await response.json()
      
      if (result.success) {
        // Refresh data
        fetchHomework()
        
        // Show success message (you can add toast notification here)
        console.log('Status tugas berhasil diubah menjadi selesai')
      } else {
        throw new Error(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAddHomework = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.childId || !formData.title || !formData.dueDate) {
      setError('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    try {
      setSubmitLoading(true)
      setError(null)

      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: formData.childId,
          therapistId: therapistId,
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          status: 'ASSIGNED'
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal menambahkan tugas rumah')
      }

      const result = await response.json()
      
      if (result.success) {
        // Reset form
        setFormData({
          childId: '',
          title: '',
          description: '',
          dueDate: ''
        })
        
        // Close modal
        setShowAddModal(false)
        
        // Refresh data
        fetchHomework()
        
        // Show success message (you can add toast notification here)
        console.log('Tugas rumah berhasil ditambahkan')
      } else {
        throw new Error(result.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan server')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setFormData({
      childId: '',
      title: '',
      description: '',
      dueDate: ''
    })
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Tugas Rumah</h1>
            <p className="text-gray-600">Kelola dan pantau tugas rumah yang diberikan kepada siswa</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tugas</p>
                    <p className="text-2xl font-bold text-blue-900">{homework.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-900">{getStatusCount('COMPLETED')}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">{getStatusCount('ASSIGNED')}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Terlambat</p>
                    <p className="text-2xl font-bold text-red-900">{getStatusCount('OVERDUE')}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Tugas Rumah</CardTitle>
                  <CardDescription>Kelola semua tugas yang telah diberikan</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Berikan Tugas
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filters */}
              <div className="mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200">
                
                
                {/* Date Filter */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Pilih Status:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem 
                          value="all"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Semua Status</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="ASSIGNED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Diberikan</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="COMPLETED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Selesai</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="OVERDUE"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Terlambat</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700"> Pilih Tanggal:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                      <Input
                        type="date"
                        value={tableDateFilter}
                        onChange={(e) => setTableDateFilter(e.target.value)}
                        className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTableDateFilter(new Date().toISOString().split('T')[0])}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          Hari Ini
                        </Button>
                        {tableDateFilter && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTableDateFilter('')}
                            className="border-gray-300 hover:bg-gray-50"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {tableDateFilter ? (
                        `Menampilkan ${filteredHomework.length} tugas untuk tanggal ${new Date(tableDateFilter).toLocaleDateString('id-ID')}`
                      ) : (
                        `Menampilkan ${filteredHomework.length} dari ${homework.length} tugas`
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* DataTable */}
              <DataTable
                data={filteredHomework}
                columns={[
                  {
                    key: 'title',
                    label: 'Judul Tugas',
                    sortable: true,
                    render: (value, row) => (
                      <div className="font-medium text-gray-900">
                        {row.title}
                      </div>
                    )
                  },
                  {
                    key: 'child',
                    label: 'Siswa',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{row.child?.name || 'N/A'}</span>
                      </div>
                    )
                  },
                  {
                    key: 'dueDate',
                    label: 'Deadline',
                    sortable: true,
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{new Date(row.dueDate).toLocaleDateString('id-ID')}</span>
                      </div>
                    )
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value, row) => getStatusBadge(row.status)
                  },
                  {
                    key: 'actions',
                    label: 'Aksi',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Select>
                          <SelectTrigger className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50">
                            <MoreHorizontal className="w-4 h-4" />
                          </SelectTrigger>
                          <SelectContent 
                            className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                            position="popper"
                            sideOffset={4}
                          >
                            <SelectItem 
                              value="edit"
                              onClick={() => handleEditHomework(row)}
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </div>
                            </SelectItem>
                            {row.status === 'ASSIGNED' && (
                              <SelectItem 
                                value="complete"
                                onClick={() => handleMarkComplete(row.id)}
                                className="cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 focus:text-green-700 transition-all duration-200 ease-in-out"
                              >
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Tandai Selesai</span>
                                </div>
                              </SelectItem>
                            )}
                            <SelectItem 
                              value="delete"
                              onClick={() => handleDeleteHomework(row)}
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 focus:bg-gradient-to-r focus:from-red-50 focus:to-pink-50 focus:text-red-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }
                ]}
                searchKey="title"
                onEdit={handleEditHomework}
                onDelete={handleDeleteHomework}
                itemsPerPage={5}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          
        </div>
      </div>

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Berikan Tugas Rumah</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Buat tugas rumah baru untuk siswa</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseAddModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="pt-4 lg:pt-6">
                <form onSubmit={handleSubmitAddHomework} className="space-y-3 lg:space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pilih Siswa *</label>
                    <Select value={formData.childId} onValueChange={(value) => setFormData({...formData, childId: value})}>
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue placeholder="Pilih siswa" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        {children.map((child) => (
                          <SelectItem 
                            key={child.id} 
                            value={child.id}
                            className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <span>{child.name} ({child.age} tahun)</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Judul Tugas *</label>
                    <Input
                      placeholder="Masukkan judul tugas..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi Tugas</label>
                    <Textarea
                      placeholder="Jelaskan detail tugas yang harus dilakukan..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deadline *</label>
                    <Input 
                      type="date" 
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Upload Materi (Opsional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Klik untuk upload file</p>
                      <p className="text-xs text-gray-500">PDF, DOC, atau gambar (max 5MB)</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseAddModal}
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                      disabled={submitLoading}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        'Berikan Tugas'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Homework Modal */}
      {showEditModal && selectedHomework && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Edit Tugas Rumah</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Edit detail tugas rumah</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEditModal(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="pt-4 lg:pt-6">
                <form className="space-y-3 lg:space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Siswa</label>
                    <Input 
                      value={selectedHomework.child?.name || 'N/A'} 
                      disabled 
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Judul Tugas</label>
                    <Input 
                      defaultValue={selectedHomework.title}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi Tugas</label>
                    <Textarea
                      defaultValue={selectedHomework.description}
                      rows={4}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deadline</label>
                    <Input 
                      type="date" 
                      defaultValue={selectedHomework.dueDate.split('T')[0]}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select defaultValue={selectedHomework.status}>
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem 
                          value="ASSIGNED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Diberikan</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="COMPLETED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Selesai</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="overdue"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Terlambat</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Tugas Rumah"
        message="Anda yakin ingin menghapus tugas rumah ini? Tindakan ini tidak dapat dibatalkan."
        itemName={homeworkToDelete?.title || ''}
        loading={loading}
      />
    </div>
  )
}
