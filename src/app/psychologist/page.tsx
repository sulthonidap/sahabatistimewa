'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import { 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  MapPin,
  MessageSquare,
  Eye,
  MoreHorizontal,
  X,
  Loader2
} from 'lucide-react'

interface Report {
  id: string
  childId: string
  therapistId: string
  reportType: string
  period: string
  summary: string
  recommendations: string
  conclusion: string
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

export default function PsychologistDashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [conclusion, setConclusion] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [reportType, setReportType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const psychologistId = 'cmei5wjvk00038srgaqbkp9vv'

  // Fetch reports data
  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?therapistId=${psychologistId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      const data = await response.json()
      setReports(data.reports || [])
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
    fetchReports()
    fetchChildren()
  }, [])

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.period?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.status?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === 'all' || report.reportType === reportType
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </span>
        )
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu Review
          </span>
        )
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Direview
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Award className="w-3 h-3 mr-1" />
            Disetujui
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
    return reports.filter(report => report.status === status).length
  }

  const handleReviewReport = (report: Report) => {
    setSelectedReport(report)
    setConclusion('')
    setShowReviewModal(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReport) return

    try {
      setSubmitLoading(true)
      setError(null)
      
      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conclusion,
          status: 'REVIEWED'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Refresh reports data
      await fetchReports()
      
      // Reset form and close modal
      setConclusion('')
      setShowReviewModal(false)
      setSelectedReport(null)
      
      console.log('Review berhasil dikirim')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan server')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCloseReviewModal = () => {
    setShowReviewModal(false)
    setSelectedReport(null)
    setConclusion('')
    setError(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const stats = {
    totalReports: reports.length,
    pendingReviews: getStatusCount('SUBMITTED'),
    reviewedReports: getStatusCount('REVIEWED'),
    totalStudents: children.length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="psychologist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Psikolog</h1>
            <p className="text-gray-600">Selamat datang! Berikut adalah ringkasan aktivitas dan laporan terapi</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Laporan</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Menunggu Review</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.pendingReviews}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Sudah Direview</p>
                    <p className="text-2xl font-bold text-green-900">{stats.reviewedReports}</p>
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
                    <p className="text-sm font-medium text-purple-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
                <CardDescription>Update terbaru dari sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Laporan baru diterima</p>
                      <p className="text-xs text-gray-600">Laporan bulanan Ahmad Wijaya</p>
                      <p className="text-xs text-blue-600">2 jam yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Review selesai</p>
                      <p className="text-xs text-gray-600">Laporan Siti Santoso telah direview</p>
                      <p className="text-xs text-green-600">1 hari yang lalu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Progress meningkat</p>
                      <p className="text-xs text-gray-600">Rina Wijaya menunjukkan kemajuan 15%</p>
                      <p className="text-xs text-purple-600">2 hari yang lalu</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Ringkasan Performa</CardTitle>
                <CardDescription>Statistik kinerja terapi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Target Review</p>
                        <p className="text-sm text-gray-600">Bulan ini</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">85%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Rata-rata Waktu</p>
                        <p className="text-sm text-gray-600">Review per laporan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">2.5h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Kepuasan</p>
                        <p className="text-sm text-gray-600">Rating terapis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Laporan Terbaru</CardTitle>
                  <CardDescription>Laporan terapi yang baru diterima</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = '/psychologist/reports'}
                >
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="Filter jenis laporan" />
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
                          <span>Semua Jenis</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="Bulanan"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Laporan Bulanan</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="Mingguan"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Laporan Mingguan</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  Menampilkan {filteredReports.length} dari {reports.length} laporan
                </div>
              </div>

              {/* DataTable */}
              <DataTable
                data={filteredReports.slice(0, 5)} // Show only 5 recent reports
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
                    key: 'reportType',
                    label: 'Jenis Laporan',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{row.reportType}</span>
                      </div>
                    )
                  },
                  {
                    key: 'period',
                    label: 'Periode',
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{row.period}</span>
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
                              onClick={() => handleReviewReport(row)}
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
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Review Laporan Terapi</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Berikan kesimpulan dan rekomendasi</CardDescription>
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
                  
                  {selectedReport && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Siswa:</strong> {selectedReport.child?.name}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          <strong>Jenis Laporan:</strong> {selectedReport.reportType}
                        </p>
                        <p className="text-sm text-blue-700">
                          <strong>Periode:</strong> {selectedReport.period}
                        </p>
                      </div>
                      
                      {selectedReport.summary && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Ringkasan Terapis:</strong> {selectedReport.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kesimpulan dan Rekomendasi *</label>
                    <textarea
                      placeholder="Tulis kesimpulan dan rekomendasi berdasarkan laporan terapi..."
                      value={conclusion}
                      onChange={(e) => setConclusion(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
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
