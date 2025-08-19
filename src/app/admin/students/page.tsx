'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  GraduationCap,
  MoreHorizontal
} from 'lucide-react'
import { AddStudentModal } from '@/components/admin/add-student-modal'
import { StudentDetailsModal } from '@/components/admin/student-details-modal'
import { EditStudentModal } from '@/components/admin/edit-student-modal'
import { DeleteConfirmationModal } from '@/components/admin/delete-confirmation-modal'
import { EnhancedSelect } from '@/components/ui/enhanced-select'
import { Pagination } from '@/components/ui/pagination'

interface Parent {
  id: string
  name: string
  email: string
}

interface Child {
  id: string
  name: string
  age: number
  parent: Parent
  sessions: any[]
  homework: any[]
}

export default function AdminStudentsPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showStudentDetails, setShowStudentDetails] = useState(false)
  const [showEditStudent, setShowEditStudent] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [childToDelete, setChildToDelete] = useState<Child | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/children')
      const data = await response.json()
      
      if (data.success) {
        setChildren(data.children)
      } else {
        setError('Gagal memuat data siswa')
      }
    } catch (error) {
      console.error('Error fetching children:', error)
      setError('Gagal memuat data siswa')
    } finally {
      setLoading(false)
    }
  }

  const filteredChildren = children.filter(child => {
    const searchLower = searchTerm.toLowerCase()
    return (
      child.name.toLowerCase().includes(searchLower) ||
      child.parent.name.toLowerCase().includes(searchLower) ||
      child.parent.email.toLowerCase().includes(searchLower)
    )
  })

  // Pagination logic
  const totalItems = filteredChildren.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChildren = filteredChildren.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteChild = async (child: Child) => {
    setChildToDelete(child)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteChild = async () => {
    if (!childToDelete) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/children?id=${childToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchChildren()
        setShowDeleteConfirmation(false)
        setChildToDelete(null)
      } else {
        alert('Gagal menghapus siswa')
      }
    } catch (error) {
      console.error('Error deleting child:', error)
      alert('Gagal menghapus siswa')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleViewChild = (child: Child) => {
    setSelectedChild(child)
    setShowStudentDetails(true)
  }

  const handleEditChild = (child: Child) => {
    setSelectedChild(child)
    setShowEditStudent(true)
  }

  const handleAddStudentClick = () => {
    setShowAddStudent(true)
  }

  const handleCloseModal = () => {
    setShowAddStudent(false)
  }

  const handleStudentAdded = () => {
    fetchChildren()
  }

  const handleStudentUpdated = () => {
    fetchChildren()
  }

  const handleCloseEditModal = () => {
    setShowEditStudent(false)
    setSelectedChild(null)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmation(false)
    setChildToDelete(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getAverageAge = () => {
    if (children.length === 0) return 0
    const totalAge = children.reduce((sum, child) => sum + child.age, 0)
    return Math.round(totalAge / children.length)
  }

  const getActiveStudents = () => {
    return children.filter(child => child.sessions.length > 0).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-gray-600">Memuat data siswa...</p>
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
          <Button onClick={fetchChildren} className="mt-4">Coba Lagi</Button>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Siswa</h1>
            <p className="text-gray-600">Kelola data siswa dan informasi orang tua</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-blue-900">{children.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Siswa Aktif</p>
                    <p className="text-2xl font-bold text-green-900">{getActiveStudents()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Rata-rata Usia</p>
                    <p className="text-2xl font-bold text-purple-900">{getAverageAge()} tahun</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MoreHorizontal className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Siswa</CardTitle>
                  <CardDescription>Total {children.length} siswa terdaftar</CardDescription>
                </div>
                <Button 
                  onClick={handleAddStudentClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Siswa
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari siswa atau orang tua..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama Siswa</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Usia</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Orang Tua</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email Orang Tua</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Sesi</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Tugas Rumah</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentChildren.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          Tidak ada siswa ditemukan.
                        </td>
                      </tr>
                    ) : (
                      currentChildren.map((child) => (
                        <tr key={child.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">
                                  {child.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{child.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {child.age} tahun
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">{child.parent?.name || 'Tidak diketahui'}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-600">{child.parent?.email || 'Tidak diketahui'}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {child.sessions?.length || 0}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {child.homework?.length || 0}
                            </span>
                          </td>
                                                     <td className="py-4 px-4 text-right">
                             <div className="flex items-center justify-end space-x-2">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                 onClick={() => handleViewChild(child)}
                                 title="Lihat Detail"
                               >
                                 <Eye className="w-4 h-4" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                 onClick={() => handleEditChild(child)}
                                 title="Edit Siswa"
                               >
                                 <Edit className="w-4 h-4" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                 onClick={() => handleDeleteChild(child)}
                                 title="Hapus Siswa"
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

      {/* Student Details Modal */}
      {showStudentDetails && selectedChild && (
        <StudentDetailsModal
          isOpen={showStudentDetails}
          onClose={() => setShowStudentDetails(false)}
          child={selectedChild}
        />
      )}

      {/* Edit Student Modal */}
      {showEditStudent && selectedChild && (
        <EditStudentModal
          isOpen={showEditStudent}
          onClose={handleCloseEditModal}
          onStudentUpdated={handleStudentUpdated}
          child={selectedChild}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && childToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDeleteChild}
          title="Hapus Siswa"
          message="Apakah Anda yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan."
          itemName={childToDelete.name}
          loading={deleteLoading}
        />
      )}

      {showAddStudent && (
        <AddStudentModal
          isOpen={showAddStudent}
          onClose={handleCloseModal}
          onStudentAdded={handleStudentAdded}
        />
      )}
    </div>
  )
}
