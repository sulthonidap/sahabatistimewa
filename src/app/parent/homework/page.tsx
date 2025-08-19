'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  User
} from 'lucide-react'
import { getChildrenByParentId, getHomeworkByChildId } from '@/data/mock-data'

export default function ParentHomeworkPage() {
  const [selectedChild, setSelectedChild] = useState('1')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const parentId = '2' // Mock parent ID
  
  const children = getChildrenByParentId(parentId)
  const allHomework = getHomeworkByChildId(selectedChild)
  const currentChild = children.find(child => child.id === selectedChild)

  // Filter homework based on status and search
  const filteredHomework = allHomework.filter(homework => {
    const matchesStatus = filterStatus === 'all' || homework.status === filterStatus
    const matchesSearch = homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Terlambat
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
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
    return allHomework.filter(hw => hw.status === status).length
  }

  const handleMarkComplete = (homeworkId: string) => {
    // In a real app, this would make an API call
    console.log('Marking homework as complete:', homeworkId)
    // You would update the homework status here
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
                    <p className="text-2xl font-bold text-green-900">{getStatusCount('completed')}</p>
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
                    <p className="text-2xl font-bold text-yellow-900">{getStatusCount('pending')}</p>
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
                    <p className="text-2xl font-bold text-red-900">{getStatusCount('overdue')}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari tugas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="overdue">Terlambat</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Homework List */}
              <div className="space-y-4">
                {filteredHomework.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Tidak ada pekerjaan rumah ditemukan</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Coba ubah filter atau kata kunci pencarian' 
                        : 'Belum ada tugas yang diberikan oleh terapis'
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
                                Deadline: {homework.dueDate.toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Dr. Budi Santoso
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Terapi Motorik
                              </div>
                            </div>

                            {/* Progress indicator for pending tasks */}
                            {homework.status === 'pending' && (
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
                            
                            {homework.status === 'pending' && (
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                onClick={() => handleMarkComplete(homework.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Tandai Selesai
                              </Button>
                            )}
                            
                            {homework.status === 'overdue' && (
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
