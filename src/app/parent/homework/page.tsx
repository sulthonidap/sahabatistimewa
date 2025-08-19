'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  FileText,
  User,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export default function ParentHomeworkPage() {
  const [selectedChild, setSelectedChild] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [children, setChildren] = useState<any[]>([])
  const [allHomework, setAllHomework] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const { toast } = useToast()
  
  const currentChild = children.find(child => child.id === selectedChild)

  // Filter homework based on status, search, and date
  const filteredHomework = allHomework.filter(homework => {
    const matchesStatus = filterStatus === 'all' || homework.status === filterStatus
    const matchesSearch = homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Date filtering
    const homeworkDate = new Date(homework.dueDate)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    let matchesDate = true
    switch (dateFilter) {
      case 'today':
        matchesDate = homeworkDate.toDateString() === today.toDateString()
        break
      case 'tomorrow':
        matchesDate = homeworkDate.toDateString() === tomorrow.toDateString()
        break
      case 'this_week':
        matchesDate = homeworkDate >= today && homeworkDate <= nextWeek
        break
      case 'overdue':
        matchesDate = homeworkDate < today && homework.status !== 'COMPLETED'
        break
      case 'all':
      default:
        matchesDate = true
        break
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

  // Fetch children and homework data
  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError('')

      // Fetch children for this parent
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
        const parentChildren = childrenData.children.filter((child: any) => 
          child.parentId === user.id
        )
        setChildren(parentChildren)
        
        // Set first child as selected if available
        if (parentChildren.length > 0 && !selectedChild) {
          setSelectedChild(parentChildren[0].id)
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch homework when selected child changes
  useEffect(() => {
    if (selectedChild) {
      fetchHomework()
    }
  }, [selectedChild])

  const fetchHomework = async () => {
    try {
      const response = await fetch(`/api/homework?childId=${selectedChild}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setAllHomework(data.homework)
      }
    } catch (error) {
      console.error('Error fetching homework:', error)
      toast({
        title: 'Error',
        description: 'Gagal memuat data pekerjaan rumah',
        variant: 'destructive'
      })
    }
  }

  const getStatusCount = (status: string) => {
    return allHomework.filter(hw => hw.status === status).length
  }

  const getTotalAssigned = () => {
    return allHomework.filter(hw => hw.status === 'ASSIGNED').length
  }

  const getTotalCompleted = () => {
    return allHomework.filter(hw => hw.status === 'COMPLETED').length
  }

  const getTotalOverdue = () => {
    return allHomework.filter(hw => hw.status === 'OVERDUE').length
  }

  const handleMarkComplete = async (homeworkId: string) => {
    try {
      const response = await fetch('/api/homework', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: homeworkId,
          status: 'COMPLETED'
        })
      })

      if (response.status === 401) {
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
        return
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Berhasil',
          description: 'Pekerjaan rumah berhasil ditandai selesai',
          variant: 'default'
        })
        // Refresh homework data
        fetchHomework()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal memperbarui status',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error marking homework complete:', error)
      toast({
        title: 'Error',
        description: 'Gagal memperbarui status pekerjaan rumah',
        variant: 'destructive'
      })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="parent" />
        <div className="lg:ml-64 pb-20 lg:pb-0">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">Memuat data pekerjaan rumah...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="parent" />
        <div className="lg:ml-64 pb-20 lg:pb-0">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchData}>Coba Lagi</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="parent" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pekerjaan Rumah</h1>
            <p className="text-gray-600">Kelola dan pantau tugas dari terapis untuk anak Anda</p>
          </div>

          {/* Child Selector */}
          {children.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Anak
              </label>
              <div className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedChild === child.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {child.name} ({child.age} tahun)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tugas</p>
                    <p className="text-2xl font-bold text-blue-900">{allHomework.length}</p>
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
                    <p className="text-2xl font-bold text-green-900">{getTotalCompleted()}</p>
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
                    <p className="text-sm font-medium text-yellow-600">Diberikan</p>
                    <p className="text-2xl font-bold text-yellow-900">{getTotalAssigned()}</p>
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
                    <p className="text-2xl font-bold text-red-900">{getTotalOverdue()}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Pekerjaan Rumah</CardTitle>
                  <CardDescription>Tugas untuk {currentChild?.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Cari tugas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem 
                      value="all"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Semua Status
                    </SelectItem>
                    <SelectItem 
                      value="ASSIGNED"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Diberikan
                    </SelectItem>
                    <SelectItem 
                      value="COMPLETED"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Selesai
                    </SelectItem>
                    <SelectItem 
                      value="OVERDUE"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Terlambat
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Filter tanggal" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    <SelectItem 
                      value="all"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Semua Tanggal
                    </SelectItem>
                    <SelectItem 
                      value="today"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Hari Ini
                    </SelectItem>
                    <SelectItem 
                      value="tomorrow"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Besok
                    </SelectItem>
                    <SelectItem 
                      value="this_week"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Minggu Ini
                    </SelectItem>
                    <SelectItem 
                      value="overdue"
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                    >
                      Terlambat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Info */}
              {(filterStatus !== 'all' || dateFilter !== 'all' || searchTerm) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Filter className="w-4 h-4" />
                      <span>Filter Aktif:</span>
                      {filterStatus !== 'all' && (
                        <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                          Status: {filterStatus === 'ASSIGNED' ? 'Diberikan' : 
                                   filterStatus === 'COMPLETED' ? 'Selesai' : 'Terlambat'}
                        </span>
                      )}
                      {dateFilter !== 'all' && (
                        <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                          Tanggal: {dateFilter === 'today' ? 'Hari Ini' :
                                   dateFilter === 'tomorrow' ? 'Besok' :
                                   dateFilter === 'this_week' ? 'Minggu Ini' : 'Terlambat'}
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                          Pencarian: "{searchTerm}"
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterStatus('all')
                        setDateFilter('all')
                        setSearchTerm('')
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Reset Filter
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan {filteredHomework.length} dari {allHomework.length} pekerjaan rumah
                  {currentChild && ` untuk ${currentChild.name}`}
                </p>
              </div>

              {/* Homework List */}
              <div className="space-y-4">
                {filteredHomework.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      {searchTerm || filterStatus !== 'all' || dateFilter !== 'all'
                        ? `Tidak ada pekerjaan rumah yang sesuai dengan filter (${allHomework.length} total tugas)`
                        : 'Belum ada tugas yang diberikan oleh terapis'
                      }
                    </p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || filterStatus !== 'all' || dateFilter !== 'all'
                        ? 'Coba ubah filter atau kata kunci pencarian' 
                        : 'Terapis akan memberikan tugas melalui platform ini'
                      }
                    </p>
                  </div>
                ) : (
                  filteredHomework.map((homework) => (
                    <Card key={homework.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{homework.title}</h3>
                              {getStatusBadge(homework.status)}
                            </div>
                            
                            <p className="text-gray-600 mb-4 leading-relaxed">{homework.description}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Deadline: {new Date(homework.dueDate).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {homework.therapist?.name || 'Terapis'}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {homework.title}
                              </div>
                            </div>

                            {/* Progress indicator for assigned tasks */}
                            {homework.status === 'ASSIGNED' && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                  <span>Progress</span>
                                  <span>0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-6 flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                            
                            {homework.status === 'ASSIGNED' && (
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                onClick={() => handleMarkComplete(homework.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Tandai Selesai
                              </Button>
                            )}
                            
                            {homework.status === 'OVERDUE' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Hubungi Terapis
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Tips untuk Orang Tua</CardTitle>
              <CardDescription>Panduan membantu anak menyelesaikan pekerjaan rumah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2">Buat Rutinitas</h4>
                  <p className="text-sm text-gray-600">
                    Tetapkan waktu khusus setiap hari untuk mengerjakan tugas dari terapis. 
                    Konsistensi membantu anak membangun kebiasaan yang baik.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">Beri Dukungan Positif</h4>
                  <p className="text-sm text-gray-600">
                    Berikan pujian dan dorongan saat anak berhasil menyelesaikan tugas. 
                    Hindari kritik yang berlebihan jika ada kesalahan.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-2">Buat Menyenangkan</h4>
                  <p className="text-sm text-gray-600">
                    Ubah latihan menjadi permainan yang menyenangkan. 
                    Gunakan imajinasi dan kreativitas untuk membuat tugas lebih menarik.
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-gray-900 mb-2">Komunikasi dengan Terapis</h4>
                  <p className="text-sm text-gray-600">
                    Jangan ragu untuk menghubungi terapis jika ada kesulitan atau pertanyaan. 
                    Mereka siap membantu dan memberikan panduan tambahan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
