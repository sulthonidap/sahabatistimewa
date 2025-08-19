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
  FileText,
  Download,
  Calendar,
  Search,
  Filter,
  User,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  StarOff,
  Printer,
  Share2,
  Archive,
  Settings,
  MoreHorizontal,
  X,
  Loader2
} from 'lucide-react'

interface Report {
  id: string
  childId: string
  reportType: string
  period: string
  status: string
  summary?: string
  recommendations?: string
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

export default function TherapistReportsPage() {
  const [selectedChild, setSelectedChild] = useState('')
  const [reportType, setReportType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    childId: '',
    reportType: '',
    period: '',
    summary: '',
    recommendations: ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const therapistId = 'cmei5wjvk00038srgaqbkp9vv' // Actual therapist ID from database

  // Fetch reports data
  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?therapistId=${therapistId}`)
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
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        )
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" />
            Dalam Proses
          </span>
        )
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Direview
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

  const handleGenerateReport = () => {
    setShowGenerateModal(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  const handleDeleteReport = (report: Report) => {
    setReportToDelete(report)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!reportToDelete) return

    try {
      setLoading(true)
      
      const response = await fetch(`/api/reports/${reportToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus laporan')
      }

      const result = await response.json()
      
      if (result.success) {
        // Refresh data
        fetchReports()
        
        // Close modal and reset
        setShowDeleteModal(false)
        setReportToDelete(null)
        
        // Show success message
        console.log('Laporan berhasil dihapus')
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
    setReportToDelete(null)
  }

  const handleExportReport = (reportId: string) => {
    // In a real app, this would generate and download the report
    console.log('Exporting report:', reportId)
  }

  const handleSubmitAddReport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitLoading(true)
      setError(null)
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          therapistId
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat laporan')
      }

      const result = await response.json()
      
      if (result.success) {
        // Reset form and close modal
        setFormData({
          childId: '',
          reportType: '',
          period: '',
          summary: '',
          recommendations: ''
        })
        setShowGenerateModal(false)
        
        // Refresh data
        fetchReports()
        
        console.log('Laporan berhasil dibuat')
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
    setShowGenerateModal(false)
    setFormData({
      childId: '',
      reportType: '',
      period: '',
      summary: '',
      recommendations: ''
    })
    setError(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Terapi</h1>
            <p className="text-gray-600">Kelola dan generate laporan perkembangan siswa</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Laporan</p>
                    <p className="text-2xl font-bold text-blue-900">{reports.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
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
                     <p className="text-sm font-medium text-yellow-600">Draft</p>
                     <p className="text-2xl font-bold text-yellow-900">{getStatusCount('DRAFT')}</p>
                   </div>
                   <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                     <Clock className="w-6 h-6 text-white" />
                   </div>
                 </div>
               </CardContent>
             </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Bulan Ini</p>
                                         <p className="text-2xl font-bold text-purple-900">
                       {reports.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
                     </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
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
                  <CardTitle className="text-xl">Daftar Laporan</CardTitle>
                  <CardDescription>Kelola semua laporan terapi</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateReport}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Laporan
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Semua
                  </Button>
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
                 itemsPerPage={5}
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
                              value="edit"
                              onClick={() => handleEditReport(row)}
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="export"
                              onClick={() => handleExportReport(row.id)}
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 focus:bg-gradient-to-r focus:from-blue-50 focus:to-cyan-50 focus:text-blue-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="preview"
                              className="cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 focus:text-green-700 transition-all duration-200 ease-in-out"
                            >
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Preview</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="delete"
                              onClick={() => handleDeleteReport(row)}
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
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Generate Laporan Baru</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Buat laporan terapi baru</CardDescription>
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
                <form onSubmit={handleSubmitAddReport} className="space-y-3 lg:space-y-4">
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
                    <label className="text-sm font-medium text-gray-700">Jenis Laporan *</label>
                    <Select value={formData.reportType} onValueChange={(value) => setFormData({...formData, reportType: value})}>
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue placeholder="Pilih jenis laporan" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem 
                          value="Progress Bulanan"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Progress Bulanan</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="Evaluasi Awal"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Evaluasi Awal</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="Laporan Sesi"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Laporan Sesi</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="Laporan Akhir"
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Periode *</label>
                    <Input 
                      type="text"
                      placeholder="Contoh: Agustus 2024"
                      value={formData.period}
                      onChange={(e) => setFormData({...formData, period: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ringkasan</label>
                    <Textarea
                      placeholder="Ringkasan perkembangan dan hasil terapi..."
                      rows={3}
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Rekomendasi</label>
                    <Textarea
                      placeholder="Rekomendasi untuk terapi selanjutnya..."
                      rows={3}
                      value={formData.recommendations}
                      onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
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
                          Membuat Laporan...
                        </>
                      ) : (
                        'Generate Laporan'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {showEditModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Laporan</CardTitle>
              <CardDescription>Edit detail laporan terapi</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Siswa
                  </label>
                                     <Input value={selectedReport.child?.name || 'N/A'} disabled />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Laporan
                  </label>
                  <Input defaultValue={selectedReport.reportType} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Periode
                  </label>
                  <Input defaultValue={selectedReport.period} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                                     <Select defaultValue={selectedReport.status}>
                     <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent 
                       className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                       position="popper"
                       sideOffset={4}
                     >
                       <SelectItem 
                         value="DRAFT"
                         className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                       >
                         <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span>Draft</span>
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
                         value="PENDING"
                         className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                       >
                         <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span>Pending</span>
                         </div>
                       </SelectItem>
                       <SelectItem 
                         value="IN_PROGRESS"
                         className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                       >
                         <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span>Dalam Proses</span>
                         </div>
                       </SelectItem>
                       <SelectItem 
                         value="REVIEWED"
                         className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                       >
                         <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <span>Direview</span>
                         </div>
                       </SelectItem>
                     </SelectContent>
                   </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ringkasan
                  </label>
                  <Textarea
                    defaultValue={selectedReport.summary}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rekomendasi
                  </label>
                  <Textarea
                    defaultValue={selectedReport.recommendations}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Simpan Perubahan
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Hapus Laporan"
        message="Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan."
        itemName={reportToDelete?.reportType || ''}
        loading={loading}
      />
    </div>
  )
}
