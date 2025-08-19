'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react'
import { AddUserModal } from '@/components/admin/add-user-modal'
import { EditUserModal } from '@/components/admin/edit-user-modal'
import { DeleteConfirmationModal } from '@/components/admin/delete-confirmation-modal'
import { EnhancedSelect } from '@/components/ui/enhanced-select'
import { Pagination } from '@/components/ui/pagination'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'PARENT' | 'THERAPIST' | 'PSYCHOLOGIST'
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      } else {
        setError('Gagal memuat data pengguna')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole
    return matchesSearch && matchesRole
  })

  // Pagination logic
  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRole])

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userToDelete.id))
        setShowDeleteConfirmation(false)
        setUserToDelete(null)
      } else {
        alert('Gagal menghapus pengguna')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Gagal menghapus pengguna')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditUser(true)
  }

  const handleAddUserClick = () => {
    console.log('Add user button clicked')
    setShowAddUser(true)
  }

  const handleCloseModal = () => {
    console.log('Closing modal')
    setShowAddUser(false)
  }

  const handleUserAdded = () => {
    console.log('User added, refreshing data')
    fetchUsers()
  }

  const handleUserUpdated = () => {
    console.log('User updated, refreshing data')
    fetchUsers()
  }

  const handleCloseEditModal = () => {
    setShowEditUser(false)
    setSelectedUser(null)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirmation(false)
    setUserToDelete(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const roleOptions = [
    { value: 'all', label: 'Semua Peran' },
    { value: 'parent', label: 'Orang Tua' },
    { value: 'therapist', label: 'Terapis' },
    { value: 'psychologist', label: 'Psikolog' },
    { value: 'admin', label: 'Admin' }
  ]

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'PARENT': return 'Orang Tua'
      case 'THERAPIST': return 'Terapis'
      case 'PSYCHOLOGIST': return 'Psikolog'
      case 'ADMIN': return 'Admin'
      default: return role
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
      case 'PARENT':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
      case 'THERAPIST':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
      case 'PSYCHOLOGIST':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-gray-600">Memuat data pengguna...</p>
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
          <Button onClick={fetchUsers} className="mt-4">Coba Lagi</Button>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pengguna</h1>
            <p className="text-gray-600">Kelola data pengguna sistem</p>
          </div>

          {/* Stats Card */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daftar Pengguna</CardTitle>
                  <CardDescription>Total {users.length} pengguna terdaftar</CardDescription>
                </div>
                <Button 
                  onClick={handleAddUserClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pengguna
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>

                <EnhancedSelect
                  value={filterRole}
                  onValueChange={setFilterRole}
                  placeholder="Pilih peran"
                  options={roleOptions}
                  disabled={loading}
                />
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Nama</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Peran</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Tanggal Bergabung</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                                     <tbody>
                     {currentUsers.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="text-center py-8 text-gray-500">
                           Tidak ada pengguna ditemukan.
                         </td>
                       </tr>
                     ) : (
                       currentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">{user.email}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={getRoleBadge(user.role)}>
                              {getRoleLabel(user.role)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => handleViewUser(user)}
                                title="Lihat Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                onClick={() => handleEditUser(user)}
                                title="Edit Pengguna"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteUser(user)}
                                title="Hapus Pengguna"
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

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-white">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Detail Pengguna</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserDetails(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Peran:</span>
                      <span className="text-sm text-gray-900">{getRoleLabel(selectedUser.role)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Tanggal Bergabung:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">ID Pengguna:</span>
                      <span className="text-sm text-gray-900 font-mono">{selectedUser.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {showAddUser && (
        <AddUserModal
          isOpen={showAddUser}
          onClose={handleCloseModal}
          onUserAdded={handleUserAdded}
        />
      )}

      {showEditUser && selectedUser && (
        <EditUserModal
          isOpen={showEditUser}
          onClose={handleCloseEditModal}
          onUserUpdated={handleUserUpdated}
          user={selectedUser}
        />
      )}

      {showDeleteConfirmation && userToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDeleteUser}
          title="Hapus Pengguna"
          message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
          itemName={userToDelete.name}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
