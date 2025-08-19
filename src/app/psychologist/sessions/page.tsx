'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Activity,
  X,
  Loader2
} from 'lucide-react'

interface Session {
  id: string
  childId: string
  therapistId: string
  date: string
  time: string
  duration: number
  location: string
  notes: string
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

export default function PsychologistSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [review, setReview] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [sessionType, setSessionType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const psychologistId = 'cmei5wjvk00038srgaqbkp9vv' // Using the same ID for now

  // Fetch sessions data
  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sessions?therapistId=${psychologistId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }
      const data = await response.json()
      setSessions(data.sessions || [])
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
    fetchSessions()
    fetchChildren()
  }, [])

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = sessionType === 'all' || session.status.toLowerCase().includes(sessionType.toLowerCase())
    return matchesSearch && matchesType
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
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" />
            Terjadwal
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
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

  const getStatusCount = (status: string) => {
    return sessions.filter(session => session.status === status).length
  }

  const handleReviewSession = (session: Session) => {
    setSelectedSession(session)
    setReview('')
    setShowReviewModal(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSession) return

    try {
      setSubmitLoading(true)
      setError(null)
      
      // In a real app, this would update the session with review
      console.log('Review submitted for session:', selectedSession.id, review)
      
      // Reset form and close modal
      setReview('')
      setShowReviewModal(false)
      setSelectedSession(null)
      
      console.log('Review berhasil dikirim')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan server')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCloseReviewModal = () => {
    setShowReviewModal(false)
    setSelectedSession(null)
    setReview('')
    setError(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    totalSessions: sessions.length,
    completedSessions: getStatusCount('COMPLETED'),
    scheduledSessions: getStatusCount('SCHEDULED'),
    pendingSessions: getStatusCount('PENDING')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="psychologist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Sesi Terapi</h1>
            <p className="text-gray-600">Review dan analisis sesi terapi siswa</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Sesi</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Selesai</p>
                    <p className="text-2xl font-bold text-green-900">{stats.completedSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Terjadwal</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.scheduledSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Menunggu</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.pendingSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions Review Section */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Sesi Terapi</CardTitle>
                  <CardDescription>Review dan analisis sesi terapi siswa</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="Filter status sesi" />
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
                        value="completed"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Selesai</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="scheduled"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Terjadwal</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="pending"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Menunggu</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  Menampilkan {filteredSessions.length} dari {sessions.length} sesi
                </div>
              </div>

              {/* DataTable */}
              <DataTable
                data={filteredSessions}
                searchKey="child"
                itemsPerPage={5}
                columns={[
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
                    key: 'date',
                    label: 'Tanggal',
                    sortable: true,
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatDate(row.date)}</span>
                      </div>
                    )
                  },
                  {
                    key: 'time',
                    label: 'Waktu',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatTime(row.time)}</span>
                      </div>
                    )
                  },
                  {
                    key: 'location',
                    label: 'Lokasi',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{row.location}</span>
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
                              value="review"
                              onClick={() => handleReviewSession(row)}
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Review</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="view"
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 focus:bg-gradient-to-r focus:from-blue-50 focus:to-cyan-50 focus:text-blue-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Lihat Detail</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="message"
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 focus:text-green-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>Kirim Pesan</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }
                ]}
              />
            </CardContent>
          </Card>

          {/* Session Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Performa Sesi</CardTitle>
                <CardDescription>Analisis performa sesi terapi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Tingkat Kehadiran</p>
                        <p className="text-sm text-gray-600">Siswa yang hadir</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">92%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Durasi Rata-rata</p>
                        <p className="text-sm text-gray-600">Waktu sesi terapi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">45m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Kepuasan Terapis</p>
                        <p className="text-sm text-gray-600">Rating sesi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Sesi Terbaru</CardTitle>
                <CardDescription>Sesi terapi yang baru saja selesai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {session.child?.name} - {formatDate(session.date)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatTime(session.time)} • {session.location}
                        </p>
                        <div className="mt-1">
                          {getStatusBadge(session.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Review Sesi Terapi</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Berikan review dan analisis sesi</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseReviewModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="pt-4 lg:pt-6">
                <form onSubmit={handleSubmitReview} className="space-y-3 lg:space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}
                  
                  {selectedSession && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Siswa:</strong> {selectedSession.child?.name}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          <strong>Tanggal:</strong> {formatDate(selectedSession.date)} • {formatTime(selectedSession.time)}
                        </p>
                        <p className="text-sm text-blue-700">
                          <strong>Lokasi:</strong> {selectedSession.location}
                        </p>
                      </div>
                      
                      {selectedSession.notes && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Catatan Terapis:</strong> {selectedSession.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Review dan Analisis *</label>
                    <Textarea
                      placeholder="Tulis review dan analisis sesi terapi..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={6}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseReviewModal}
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
                          Mengirim Review...
                        </>
                      ) : (
                        'Kirim Review'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
