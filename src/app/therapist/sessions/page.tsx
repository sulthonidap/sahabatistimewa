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
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { mockChildren, mockSessions } from '@/data/mock-data'

interface Session {
  id: string
  childId: string
  therapistId: string
  date: Date
  notes: string
  images: string[]
  status: string
  childName?: string
  duration?: number
  location?: string
}

export default function TherapistSessionsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [detailPage, setDetailPage] = useState(1)
  const [tableDateFilter, setTableDateFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    childId: '',
    date: '',
    duration: '',
    location: '',
    notes: ''
  })
  const [sessions, setSessions] = useState<Session[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const therapistId = 'cmehzhnfx00038saoy1wyo77f' // Dr. Sarah Johnson

  // Fetch sessions from API
  useEffect(() => {
    fetchSessions()
    fetchChildren()
  }, [])

  const fetchSessions = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/sessions?therapistId=${therapistId}`)
      const data = await response.json()

      if (data.success) {
        // Transform API data to match our Session interface
        const transformedSessions: Session[] = data.sessions.map((session: any) => ({
          id: session.id,
          childId: session.childId,
          therapistId: session.therapistId,
          date: new Date(session.date),
          notes: session.notes || '',
          images: session.images || [],
          status: session.status.toLowerCase(),
          childName: session.child?.name,
          duration: session.duration || 60,
          location: session.location || 'Ruang Terapi A - Lantai 2'
        }))
        setSessions(transformedSessions)
      } else {
        console.error('Failed to fetch sessions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/children')
      const data = await response.json()

      if (data.success) {
        setChildren(data.children)
      } else {
        console.error('Failed to fetch children:', data.error)
      }
    } catch (error) {
      console.error('Error fetching children:', error)
    }
  }

  // Filter sessions
  const filteredSessions = sessions.filter((session: Session) => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const matchesSearch = session.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.notes.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by date if tableDateFilter is set
    let matchesDate = true
    if (tableDateFilter) {
      const sessionDate = session.date.toISOString().split('T')[0]
      matchesDate = sessionDate === tableDateFilter
    }

    return matchesStatus && matchesSearch && matchesDate
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
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Dibatalkan
          </span>
        )
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" />
            Terjadwal
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setDetailPage(1) // Reset pagination when date changes
    // Auto-fill table date filter
    setTableDateFilter(date.toISOString().split('T')[0])
  }

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate.toDateString() === date.toDateString()
    })
  }

  const getPaginatedSessionsForDate = (date: Date, page: number, limit: number = 3) => {
    const sessionsForDate = getSessionsForDate(date)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return {
      sessions: sessionsForDate.slice(startIndex, endIndex),
      total: sessionsForDate.length,
      totalPages: Math.ceil(sessionsForDate.length / limit)
    }
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedMonth(newDate)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getSessionsForDay = (date: Date) => {
    return filteredSessions.filter(session => {
      const sessionDate = new Date(session.date)
      return sessionDate.toDateString() === date.toDateString()
    })
  }

  const days = getDaysInMonth(selectedMonth)



  const handleSubmitAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: formData.childId,
          therapistId: therapistId,
          date: new Date(formData.date),
          duration: parseInt(formData.duration),
          location: formData.location,
          notes: formData.notes,
          status: 'scheduled'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Reset form
        setFormData({
          childId: '',
          date: '',
          duration: '',
          location: '',
          notes: ''
        })
        setShowAddModal(false)
        // Refresh sessions list
        fetchSessions()
      } else {
        setError(data.error || 'Gagal menambah sesi')
      }
    } catch (error) {
      console.error('Error adding session:', error)
      setError('Terjadi kesalahan saat menambah sesi')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseAddModal = () => {
    if (!loading) {
      setFormData({
        childId: '',
        date: '',
        duration: '',
        location: '',
        notes: ''
      })
      setError('')
      setShowAddModal(false)
    }
  }

  // DataTable columns definition
  const columns = [
    {
      key: 'childName',
      label: 'Siswa',
      sortable: true
    },
    {
      key: 'date',
      label: 'Tanggal & Waktu',
      sortable: true,
      render: (value: Date) => (
        <div>
          <div className="font-medium text-gray-900">
            {value.toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </div>
          <div className="text-sm text-gray-500">
            {value.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Durasi',
      sortable: true,
      render: (value: number) => `${value} menit`
    },
    {
      key: 'location',
      label: 'Lokasi',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'notes',
      label: 'Catatan',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || '-'}
        </div>
      )
    }
  ]

  // DataTable action handlers
  const handleViewSession = (session: Session) => {
    setSelectedSession(session)
    setShowEditModal(true)
  }

  const handleEditSession = (session: Session) => {
    setSelectedSession(session)
    setShowEditModal(true)
  }

  const handleDeleteSession = (session: Session) => {
    if (confirm('Apakah Anda yakin ingin menghapus sesi ini?')) {
      // In a real app, this would make an API call
      console.log('Deleting session:', session.id)
      // Refresh sessions list
      fetchSessions()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />

      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-4 lg:p-6 xl:p-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Manajemen Sesi Terapi</h1>
            <p className="text-gray-600 text-sm lg:text-base">Kelola jadwal dan laporan sesi terapi</p>
          </div>

          {/* Calendar and Sessions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Calendar */}
            <div className="xl:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg lg:text-xl">Kalender Sesi</CardTitle>
                      <CardDescription className="text-sm lg:text-base">{getMonthName(selectedMonth)}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-3 lg:mb-4">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      const sessionsForDay = day ? getSessionsForDay(day) : []
                      const isToday = day ? day.toDateString() === new Date().toDateString() : false
                      const isSelected = day && selectedDate ? day.toDateString() === selectedDate.toDateString() : false

                      return (
                        <div
                          key={index}
                          className={`min-h-[60px] lg:min-h-[80px] p-1 lg:p-2 border border-gray-200 cursor-pointer transition-all duration-200 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                            } ${isToday ? 'ring-2 ring-purple-500' : ''} ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                          onClick={() => day && handleDateClick(day)}
                        >
                          {day && (
                            <>
                              <div className={`text-xs lg:text-sm font-medium mb-1 ${isToday ? 'text-purple-600' : 'text-gray-900'
                                } ${sessionsForDay.length > 0 ? 'font-bold' : ''}`}>
                                {day.getDate()}
                                {sessionsForDay.length > 0 && (
                                  <span className={`ml-1 inline-block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full z-10 relative shadow-sm ${isSelected ? 'bg-white border-2 border-blue-500' : 'bg-blue-500'
                                    }`}></span>
                                )}
                              </div>
                              <div className="space-y-0.5 lg:space-y-1">
                                {sessionsForDay.slice(0, 2).map((session) => (
                                  <div
                                    key={session.id}
                                    className={`text-xs p-0.5 lg:p-1 rounded cursor-pointer ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                          'bg-blue-100 text-blue-800'
                                      }`}
                                    title={session.notes}
                                    onClick={() => handleEditSession(session)}
                                  >
                                    {session.date.toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                ))}
                                {sessionsForDay.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{sessionsForDay.length - 2}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sessions List */}
            <div className="xl:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        Detail Sesi
                      </CardTitle>
                      <CardDescription className={selectedDate ? "flex items-center justify-between" : ""}>
                        {selectedDate ? (
                          <>
                            <span>Sesi untuk tanggal {selectedDate.toLocaleDateString('id-ID')}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDate(null)
                                setDetailPage(1)
                                setTableDateFilter('') // Clear table date filter too
                              }}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          'Klik tanggal di kalender untuk melihat detail sesi'
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (selectedDate) {
                          setFormData(prev => ({
                            ...prev,
                            date: selectedDate.toISOString().split('T')[0]
                          }))
                        }
                        setShowAddModal(true)
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-8 px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {selectedDate ? 'Tambah' : 'Tambah'}
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="text"
                        placeholder="Cari sesi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-28 h-8 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="all" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Semua</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="scheduled" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Terjadwal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Selesai</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Dibatalkan</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {fetchLoading ? (
                      <div className="text-center py-6">
                        <Loader2 className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-500 text-sm">Memuat sesi...</p>
                      </div>
                    ) : !selectedDate ? (
                      <div className="text-center py-6">
                        <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Pilih tanggal di kalender untuk melihat detail sesi</p>
                      </div>
                    ) : getSessionsForDate(selectedDate).length === 0 ? (
                      <div className="text-center py-6">
                        <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Tidak ada sesi untuk tanggal ini</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              date: selectedDate.toISOString().split('T')[0]
                            }))
                            setShowAddModal(true)
                          }}
                          className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Jadwalkan Sesi
                        </Button>
                      </div>
                    ) : (
                      <>
                        {(() => {
                          const { sessions: paginatedSessions, total, totalPages } = getPaginatedSessionsForDate(selectedDate, detailPage, 3)
                          return (
                            <>
                              {paginatedSessions.map((session: Session) => (
                                <div key={session.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                        {session.childName}
                                      </h4>
                                      <p className="text-xs text-gray-600 mb-1">
                                        {session.date.toLocaleTimeString('id-ID', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })} - {session.duration} menit
                                      </p>
                                      <p className="text-xs text-gray-500 mb-1 truncate">
                                        {session.location}
                                      </p>
                                      {session.notes && (
                                        <p className="text-xs text-gray-600 line-clamp-1">
                                          {session.notes}
                                        </p>
                                      )}
                                    </div>
                                    <div className="ml-2 flex-shrink-0">
                                      {getStatusBadge(session.status)}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <User className="w-3 h-3 mr-1" />
                                      <span className="truncate">{session.childName}</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleEditSession(session)}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                        onClick={() => handleDeleteSession(session)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Pagination */}
                              {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                  <div className="text-xs text-gray-500">
                                    {total} sesi total
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDetailPage(prev => Math.max(1, prev - 1))}
                                      disabled={detailPage === 1}
                                      className="h-7 w-7 p-0"
                                    >
                                      <ChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs text-gray-600 px-2 py-1">
                                      {detailPage} / {totalPages}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDetailPage(prev => Math.min(totalPages, prev + 1))}
                                      disabled={detailPage === totalPages}
                                      className="h-7 w-7 p-0"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* DataTable */}
          <Card className="border-0 shadow-lg mt-6 lg:mt-8">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Tabel Data Sesi</CardTitle>
              <CardDescription className="text-sm lg:text-base">Data lengkap semua sesi terapi dalam format tabel</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Date Filter */}
              <div className="mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter Tanggal:</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                    <Input
                      type="date"
                      value={tableDateFilter}
                      onChange={(e) => setTableDateFilter(e.target.value)}
                      className="w-full sm:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTableDateFilter(new Date().toISOString().split('T')[0])}
                        className="h-8 px-3 text-gray-600 hover:text-gray-800"
                      >
                        Hari Ini
                      </Button>
                      {selectedDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTableDateFilter(selectedDate.toISOString().split('T')[0])}
                          className="h-8 px-3 text-purple-600 hover:text-purple-800 border-purple-300"
                        >
                          Dari Kalender
                        </Button>
                      )}
                      {tableDateFilter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTableDateFilter('')}
                          className="h-8 px-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {tableDateFilter ? (
                      `Menampilkan ${filteredSessions.length} sesi untuk tanggal ${new Date(tableDateFilter).toLocaleDateString('id-ID')}`
                    ) : (
                      `Menampilkan ${filteredSessions.length} dari ${sessions.length} sesi`
                    )}
                  </div>
                </div>
              </div>
              {fetchLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                  <p className="text-gray-500 text-sm">Memuat data...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Tidak ada data sesi</p>
                </div>
              ) : (
                <DataTable
                  data={filteredSessions}
                  columns={columns}
                  searchKey="childName"
                  onView={handleViewSession}
                  onEdit={handleEditSession}
                  onDelete={handleDeleteSession}
                  itemsPerPage={10}
                />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}

        </div>
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Jadwalkan Sesi Baru</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Buat jadwal sesi terapi baru</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAddModal}
                  disabled={loading}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="pt-4 lg:pt-6">
                <form onSubmit={handleSubmitAddSession} className="space-y-3 lg:space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pilih Siswa</label>
                    <Select
                      value={formData.childId}
                      onValueChange={(value) => setFormData({ ...formData, childId: value })}
                      disabled={loading}
                    >
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
                    <label className="text-sm font-medium text-gray-700">Tanggal & Waktu</label>
                    <Input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      disabled={loading}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Durasi (menit)</label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue placeholder="Pilih durasi" />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="30" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>30 menit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="45" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>45 menit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="60" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>60 menit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="90" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>90 menit</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Lokasi</label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                      disabled={loading}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue placeholder="Pilih lokasi" />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="Ruang Terapi A - Lantai 2" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Ruang Terapi A - Lantai 2</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Ruang Terapi B - Lantai 2" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Ruang Terapi B - Lantai 2</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Ruang Terapi C - Lantai 3" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Ruang Terapi C - Lantai 3</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Catatan</label>
                    <Textarea
                      placeholder="Catatan tambahan untuk sesi ini..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      disabled={loading}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseAddModal}
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menambah...
                        </>
                      ) : (
                        'Jadwalkan'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="w-full max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-white relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
                <div>
                  <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">Edit Sesi Terapi</CardTitle>
                  <CardDescription className="text-gray-600 text-sm lg:text-base">Edit detail sesi terapi</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Siswa</label>
                    <Input
                      value={selectedSession.childName}
                      disabled
                      className="border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tanggal & Waktu</label>
                    <Input
                      type="datetime-local"
                      defaultValue={selectedSession.date.toISOString().slice(0, 16)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select defaultValue={selectedSession.status}>
                      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="scheduled" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Terjadwal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Selesai</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled" className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span>Dibatalkan</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Catatan</label>
                    <Textarea
                      defaultValue={selectedSession.notes}
                      rows={4}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                    >
                      Simpan Perubahan
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
