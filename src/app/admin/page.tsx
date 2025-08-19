'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { AddUserModal } from '@/components/admin/add-user-modal'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'PARENT' | 'THERAPIST' | 'PSYCHOLOGIST'
  createdAt: string
}

interface Child {
  id: string
  name: string
  age: number
  parentId: string
  parent?: {
    name: string
  }
}

interface Stats {
  totalUsers: number
  totalChildren: number
  totalSessions: number
  totalReports: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalChildren: 0,
    totalSessions: 0,
    totalReports: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const { toast } = useToast()

  // Fetch data from API
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersResponse = await fetch('/api/users', {
        credentials: 'include'
      })
      
      if (usersResponse.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }
      
      const usersData = await usersResponse.json()
      
      if (usersData.success) {
        setUsers(usersData.users)
      }

      // Fetch children
      const childrenResponse = await fetch('/api/children', {
        credentials: 'include'
      })
      
      if (childrenResponse.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }
      
      const childrenData = await childrenResponse.json()
      
      if (childrenData.success) {
        setChildren(childrenData.children)
      }

      // Fetch sessions count
      const sessionsResponse = await fetch('/api/sessions', {
        credentials: 'include'
      })
      
      if (sessionsResponse.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }
      
      const sessionsData = await sessionsResponse.json()
      
      // Fetch reports count
      const reportsResponse = await fetch('/api/reports', {
        credentials: 'include'
      })
      
      if (reportsResponse.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }
      
      const reportsData = await reportsResponse.json()

      setStats({
        totalUsers: usersData.success ? usersData.users.length : 0,
        totalChildren: childrenData.success ? childrenData.children.length : 0,
        totalSessions: sessionsData.success ? sessionsData.sessions.length : 0,
        totalReports: reportsData.success ? reportsData.reports.length : 0
      })

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Gagal memuat data')
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
        fetchData() // Refresh stats
      } else {
        alert('Gagal menghapus pengguna')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Gagal menghapus pengguna')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Memuat data...</p>
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
          <Button onClick={fetchData} className="mt-4">Coba Lagi</Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="admin" />
        
        {/* Main Content */}
        <div className="lg:ml-64 pb-20 lg:pb-0">
          <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Kelola pengguna, data siswa, dan laporan sistem</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Pengguna</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalChildren}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Sesi</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Total Laporan</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.totalReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Kelola Pengguna</CardTitle>
                  <CardDescription>Kelola semua pengguna dalam sistem</CardDescription>
                </div>
                <Button 
                  onClick={() => setShowAddUser(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pengguna
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peran</SelectItem>
                    <SelectItem value="parent">Orang Tua</SelectItem>
                    <SelectItem value="therapist">Terapis</SelectItem>
                    <SelectItem value="psychologist">Psikolog</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Peran</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal Bergabung</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'PARENT' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'THERAPIST' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {user.role === 'ADMIN' ? 'Admin' :
                             user.role === 'PARENT' ? 'Orang Tua' :
                             user.role === 'THERAPIST' ? 'Terapis' :
                             'Psikolog'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Student Data Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Data Siswa</CardTitle>
                <CardDescription>Informasi siswa yang terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-600">
                          Usia: {child.age} tahun • Orang Tua: {child.parent?.name || 'Tidak diketahui'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
                <CardDescription>Ringkasan aktivitas sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Total Sesi Terapi</h4>
                      <p className="text-sm text-gray-600">Sesi yang telah diselesaikan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-900">{stats.totalSessions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Laporan Psikologis</h4>
                      <p className="text-sm text-gray-600">Laporan yang telah dibuat</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-900">{stats.totalReports}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Pengguna Aktif</h4>
                      <p className="text-sm text-gray-600">Pengguna yang terdaftar</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        {/* Add User Modal */}
        <AddUserModal 
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
          onUserAdded={fetchData}
        />
      </div>
    </ProtectedRoute>
  )
}
