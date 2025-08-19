'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  MessageSquare
} from 'lucide-react'
import { mockChildren, getProgressByChildId } from '@/data/mock-data'

interface StudentDetail {
  id: string
  name: string
  age: number
  gender: string
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  diagnosis: string
  joinDate: Date
  lastSession: Date
  totalSessions: number
  currentProgress: {
    motorik: number
    kognitif: number
    sosial: number
    bahasa: number
  }
}

export default function TherapistStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAge, setFilterAge] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const therapistId = '3' // Mock therapist ID

  // Mock student details
  const studentDetails: StudentDetail[] = [
    {
      id: '1',
      name: 'Ahmad Wijaya',
      age: 8,
      gender: 'Laki-laki',
      parentName: 'Ibu Sarah Wijaya',
      parentPhone: '081234567890',
      parentEmail: 'sarah.wijaya@email.com',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      diagnosis: 'Autism Spectrum Disorder (ASD)',
      joinDate: new Date('2024-01-15'),
      lastSession: new Date('2024-08-19'),
      totalSessions: 24,
      currentProgress: {
        motorik: 85,
        kognitif: 78,
        sosial: 72,
        bahasa: 80
      }
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      age: 7,
      gender: 'Perempuan',
      parentName: 'Bapak Nurhaliza',
      parentPhone: '081234567891',
      parentEmail: 'nurhaliza@email.com',
      address: 'Jl. Thamrin No. 456, Jakarta Pusat',
      diagnosis: 'Attention Deficit Hyperactivity Disorder (ADHD)',
      joinDate: new Date('2024-02-20'),
      lastSession: new Date('2024-08-18'),
      totalSessions: 20,
      currentProgress: {
        motorik: 70,
        kognitif: 85,
        sosial: 78,
        bahasa: 75
      }
    },
    {
      id: '3',
      name: 'Budi Santoso',
      age: 9,
      gender: 'Laki-laki',
      parentName: 'Ibu Rina Putri',
      parentPhone: '081234567892',
      parentEmail: 'rina.putri@email.com',
      address: 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
      diagnosis: 'Developmental Delay',
      joinDate: new Date('2024-03-10'),
      lastSession: new Date('2024-08-17'),
      totalSessions: 18,
      currentProgress: {
        motorik: 65,
        kognitif: 70,
        sosial: 85,
        bahasa: 68
      }
    }
  ]

  // Filter students
  const filteredStudents = studentDetails.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAge = filterAge === 'all' || 
                      (filterAge === 'young' && student.age < 8) ||
                      (filterAge === 'middle' && student.age >= 8 && student.age <= 10) ||
                      (filterAge === 'older' && student.age > 10)
    return matchesSearch && matchesAge
  })

  const handleViewDetail = (student: StudentDetail) => {
    setSelectedStudent(student)
    setShowDetailModal(true)
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysSinceLastSession = (lastSession: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastSession.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Siswa</h1>
            <p className="text-gray-600">Kelola dan pantau data siswa yang sedang dalam terapi</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-blue-900">{studentDetails.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Aktif</p>
                    <p className="text-2xl font-bold text-green-900">
                      {studentDetails.filter(s => getDaysSinceLastSession(s.lastSession) <= 7).length}
                    </p>
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
                    <p className="text-sm font-medium text-yellow-600">Perlu Evaluasi</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {studentDetails.filter(s => getDaysSinceLastSession(s.lastSession) > 7).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Rata-rata Progress</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Math.round(studentDetails.reduce((acc, s) => 
                        acc + (s.currentProgress.motorik + s.currentProgress.kognitif + 
                               s.currentProgress.sosial + s.currentProgress.bahasa) / 4, 0) / studentDetails.length
                      )}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
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
                  <CardTitle className="text-xl">Daftar Siswa</CardTitle>
                  <CardDescription>Kelola semua data siswa</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Siswa
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Export Data
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
                    placeholder="Cari siswa atau orang tua..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <Select value={filterAge} onValueChange={setFilterAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter usia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Usia</SelectItem>
                    <SelectItem value="young">5-7 tahun</SelectItem>
                    <SelectItem value="middle">8-10 tahun</SelectItem>
                    <SelectItem value="older">11+ tahun</SelectItem>
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

              {/* Students List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Tidak ada siswa ditemukan</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || filterAge !== 'all' 
                        ? 'Coba ubah filter atau kata kunci pencarian' 
                        : 'Belum ada data siswa'
                      }
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <Card key={student.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-500">{student.age} tahun • {student.gender}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(student)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="truncate">{student.parentName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="w-4 h-4 mr-2" />
                            <span>{student.diagnosis}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Bergabung: {formatDate(student.joinDate)}</span>
                          </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Motorik</span>
                            <span className={`font-medium ${getProgressColor(student.currentProgress.motorik)}`}>
                              {student.currentProgress.motorik}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressBgColor(student.currentProgress.motorik).replace('bg-', 'bg-').replace('-100', '-500')}`}
                              style={{ width: `${student.currentProgress.motorik}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kognitif</span>
                            <span className={`font-medium ${getProgressColor(student.currentProgress.kognitif)}`}>
                              {student.currentProgress.kognitif}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressBgColor(student.currentProgress.kognitif).replace('bg-', 'bg-').replace('-100', '-500')}`}
                              style={{ width: `${student.currentProgress.kognitif}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Progress
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Pesan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Detail Siswa</CardTitle>
                  <CardDescription>Informasi lengkap {selectedStudent.name}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pribadi</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedStudent.name}</p>
                          <p className="text-sm text-gray-500">{selectedStudent.age} tahun • {selectedStudent.gender}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Diagnosis</p>
                          <p className="text-sm text-gray-500">{selectedStudent.diagnosis}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Bergabung</p>
                          <p className="text-sm text-gray-500">{formatDate(selectedStudent.joinDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Alamat</p>
                          <p className="text-sm text-gray-500">{selectedStudent.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Orang Tua</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedStudent.parentName}</p>
                          <p className="text-sm text-gray-500">Orang Tua</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedStudent.parentPhone}</p>
                          <p className="text-sm text-gray-500">Nomor Telepon</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedStudent.parentEmail}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress and Statistics */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Terapi</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="font-medium text-gray-900">Total Sesi</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{selectedStudent.totalSessions}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium text-gray-900">Sesi Terakhir</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(selectedStudent.lastSession)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="w-5 h-5 text-purple-500 mr-3" />
                          <span className="font-medium text-gray-900">Rata-rata Progress</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">
                          {Math.round((selectedStudent.currentProgress.motorik + 
                                       selectedStudent.currentProgress.kognitif + 
                                       selectedStudent.currentProgress.sosial + 
                                       selectedStudent.currentProgress.bahasa) / 4)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Detail</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="font-medium text-gray-900">Motorik</span>
                          </div>
                          <span className={`font-bold ${getProgressColor(selectedStudent.currentProgress.motorik)}`}>
                            {selectedStudent.currentProgress.motorik}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressBgColor(selectedStudent.currentProgress.motorik).replace('bg-', 'bg-').replace('-100', '-500')}`}
                            style={{ width: `${selectedStudent.currentProgress.motorik}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Brain className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="font-medium text-gray-900">Kognitif</span>
                          </div>
                          <span className={`font-bold ${getProgressColor(selectedStudent.currentProgress.kognitif)}`}>
                            {selectedStudent.currentProgress.kognitif}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressBgColor(selectedStudent.currentProgress.kognitif).replace('bg-', 'bg-').replace('-100', '-500')}`}
                            style={{ width: `${selectedStudent.currentProgress.kognitif}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-gray-900">Sosial</span>
                          </div>
                          <span className={`font-bold ${getProgressColor(selectedStudent.currentProgress.sosial)}`}>
                            {selectedStudent.currentProgress.sosial}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressBgColor(selectedStudent.currentProgress.sosial).replace('bg-', 'bg-').replace('-100', '-500')}`}
                            style={{ width: `${selectedStudent.currentProgress.sosial}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="font-medium text-gray-900">Bahasa</span>
                          </div>
                          <span className={`font-bold ${getProgressColor(selectedStudent.currentProgress.bahasa)}`}>
                            {selectedStudent.currentProgress.bahasa}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressBgColor(selectedStudent.currentProgress.bahasa).replace('bg-', 'bg-').replace('-100', '-500')}`}
                            style={{ width: `${selectedStudent.currentProgress.bahasa}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Lihat Progress Detail
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Kirim Pesan
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
