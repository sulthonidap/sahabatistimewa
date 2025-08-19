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
  FileText, 
  Calendar, 
  BarChart3, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Send,
  Star,
  Search,
  Filter,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
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

export default function PsychologistReportsPage() {
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
    const matchesSearch = report.child?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.period.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === 'all' || report.reportType.toLowerCase().includes(reportType.toLowerCase())
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
            <Star className="w-3 h-3 mr-1" />
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
    setConclusion(report.conclusion || '')
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
        throw new Error('Gagal mengirim review')
      }

      const result = await response.json()
      
      if (result.success) {
        // Reset form and close modal
        setConclusion('')
        setShowReviewModal(false)
        setSelectedReport(null)
        
        // Refresh data
        fetchReports()
        
        console.log('Review berhasil dikirim')
      } else {
        throw new Error(result.error || 'Terjadi kesalahan')
      }
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
    totalSessions: reports.length // Using reports as sessions for now
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="psychologist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox Laporan</h1>
            <p className="text-gray-600">Review laporan terapi dan analisis perkembangan siswa</p>
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
                    <p className="text-sm font-medium text-purple-600">Total Sesi</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Review Section */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Inbox Laporan</CardTitle>
                  <CardDescription>Laporan terapi yang memerlukan review</CardDescription>
                </div>
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
                        value="progress"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Progress Bulanan</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="evaluasi"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Evaluasi Awal</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="sesi"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Laporan Sesi</span>
                        </div>
                      </SelectItem>
                      <SelectItem 
                        value="akhir"
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>Laporan Akhir</span>
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
                data={filteredReports}
                searchKey="reportType"
                itemsPerPage={10}
                columns={[
                  {
                    key: 'reportType',
                    label: 'Jenis Laporan',
                    sortable: true,
                    render: (value, row) => (
                      <div className="font-medium text-gray-900">
                        {row.reportType}
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
                    key: 'period',
                    label: 'Periode',
                    sortable: true,
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
                    key: 'createdAt',
                    label: 'Dibuat',
                    sortable: true,
                    render: (value, row) => (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatDate(row.createdAt)}</span>
                      </div>
                    )
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

          {/* Analytics and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Analytics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Analisis Sesi</CardTitle>
                <CardDescription>Statistik sesi terapi bulan ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Sesi Berhasil</p>
                        <p className="text-sm text-gray-600">85% dari total sesi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">85%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Siswa Aktif</p>
                        <p className="text-sm text-gray-600">{children.length} dari {children.length} siswa</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Rata-rata Progress</p>
                        <p className="text-sm text-gray-600">Perkembangan siswa</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">78%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
                <CardDescription>Update terbaru dari terapis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Laporan baru dari Dr. Sarah Johnson
                      </p>
                      <p className="text-xs text-gray-600">
                        Sesi terapi Ahmad Wijaya - 2 jam yang lalu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Review selesai untuk Siti Santoso
                      </p>
                      <p className="text-xs text-gray-600">
                        Laporan dari Dr. Sarah Johnson - 1 hari yang lalu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Revisi diminta untuk Rina Wijaya
                      </p>
                      <p className="text-xs text-gray-600">
                        Laporan dari Dr. Sarah Johnson - 2 hari yang lalu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Progress signifikan Ahmad Wijaya
                      </p>
                      <p className="text-xs text-gray-600">
                        Peningkatan 15% dalam motorik halus - 3 hari yang lalu
                      </p>
                    </div>
                  </div>
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
                          <strong>Laporan:</strong> {selectedReport.reportType} - {selectedReport.child?.name}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
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
                    <Textarea
                      placeholder="Tulis kesimpulan dan rekomendasi berdasarkan laporan terapi..."
                      value={conclusion}
                      onChange={(e) => setConclusion(e.target.value)}
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
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Kirim Review
                        </>
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
