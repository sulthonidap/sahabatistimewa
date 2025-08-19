'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  MessageSquare,
  Plus,
  Eye,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { getChildrenByParentId, getSessionsByChildId } from '@/data/mock-data'

interface Session {
  id: string
  childId: string
  therapistId: string
  date: Date
  notes: string
  images: string[]
  status: string
  therapistName?: string
  location?: string
  duration?: number
}

export default function ParentSchedulePage() {
  const [selectedChild, setSelectedChild] = useState('1')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')
  const parentId = '2' // Mock parent ID
  
  const children = getChildrenByParentId(parentId)
  const allSessions = getSessionsByChildId(selectedChild)
  const currentChild = children.find(child => child.id === selectedChild)

  // Mock additional session data
  const sessionsWithDetails: Session[] = allSessions.map(session => ({
    ...session,
    therapistName: 'Dr. Budi Santoso',
    location: 'Ruang Terapi A - Lantai 2',
    duration: 60
  }))

  // Add some upcoming sessions
  const upcomingSessions: Session[] = [
    {
      id: '4',
      childId: '1',
      therapistId: '3',
      date: new Date('2024-08-20'),
      notes: 'Sesi terapi motorik halus dan koordinasi',
      images: [],
      status: 'scheduled',
      therapistName: 'Dr. Budi Santoso',
      location: 'Ruang Terapi A - Lantai 2',
      duration: 60
    },
    {
      id: '5',
      childId: '1',
      therapistId: '3',
      date: new Date('2024-08-22'),
      notes: 'Sesi terapi kognitif dan konsentrasi',
      images: [],
      status: 'scheduled',
      therapistName: 'Dr. Budi Santoso',
      location: 'Ruang Terapi B - Lantai 2',
      duration: 45
    }
  ]

  const allSessionsWithDetails = [...sessionsWithDetails, ...upcomingSessions]

  // Filter sessions
  const filteredSessions = allSessionsWithDetails.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const sessionMonth = new Date(session.date).getMonth()
    const sessionYear = new Date(session.date).getFullYear()
    const selectedMonthYear = selectedMonth.getMonth()
    const selectedYear = selectedMonth.getFullYear()
    const matchesMonth = sessionMonth === selectedMonthYear && sessionYear === selectedYear
    return matchesStatus && matchesMonth
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="parent" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jadwal Terapi</h1>
            <p className="text-gray-600">Pantau jadwal sesi terapi anak Anda</p>
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

          {/* Calendar and Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Kalender Terapi</CardTitle>
                      <CardDescription>Jadwal {currentChild?.name} - {getMonthName(selectedMonth)}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                      const sessionsForDay = day ? getSessionsForDay(day) : []
                      const isToday = day ? day.toDateString() === new Date().toDateString() : false
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[80px] p-2 border border-gray-200 ${
                            day ? 'bg-white' : 'bg-gray-50'
                          } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium mb-1 ${
                                isToday ? 'text-purple-600' : 'text-gray-900'
                              }`}>
                                {day.getDate()}
                              </div>
                              <div className="space-y-1">
                                {sessionsForDay.slice(0, 2).map((session) => (
                                  <div
                                    key={session.id}
                                    className={`text-xs p-1 rounded ${
                                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}
                                    title={session.notes}
                                  >
                                    {session.date.toLocaleTimeString('id-ID', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </div>
                                ))}
                                {sessionsForDay.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{sessionsForDay.length - 2} lagi
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
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Sesi Terapi</CardTitle>
                      <CardDescription>Daftar sesi {getMonthName(selectedMonth)}</CardDescription>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="scheduled">Terjadwal</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Tidak ada sesi di bulan ini</p>
                      </div>
                    ) : (
                      filteredSessions.map((session) => (
                        <div key={session.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {session.date.toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {session.date.toLocaleTimeString('id-ID', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {session.duration} menit
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                {session.location}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {session.notes}
                              </p>
                            </div>
                            <div className="ml-2">
                              {getStatusBadge(session.status)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {session.therapistName}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Sesi Mendatang</CardTitle>
              <CardDescription>Sesi terapi yang akan datang untuk {currentChild?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {session.date.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {session.date.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {session.duration} menit
                        </p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{session.notes}</p>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {session.therapistName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {session.location}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Hubungi
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Aksi Cepat</CardTitle>
              <CardDescription>Fitur-fitur untuk mengelola jadwal terapi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Jadwalkan Sesi</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Hubungi Terapis</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Export Jadwal</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Laporkan Masalah</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
