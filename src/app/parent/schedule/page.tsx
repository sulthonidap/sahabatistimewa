'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  X,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface Session {
  id: string
  childId: string
  therapistId: string
  date: Date | string
  notes: string
  images: string[]
  status: string
  therapist?: {
    id: string
    name: string
    email: string
  }
  child?: {
    id: string
    name: string
    age: number
  }
  location?: string
  duration?: number
}

export default function ParentSchedulePage() {
  const [selectedChild, setSelectedChild] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')
  const [children, setChildren] = useState<any[]>([])
  const [allSessions, setAllSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const { toast } = useToast()
  
  const currentChild = children.find(child => child.id === selectedChild)

  // Fetch children and sessions data
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

  // Fetch sessions when selected child changes
  useEffect(() => {
    if (selectedChild) {
      fetchSessions()
    }
  }, [selectedChild])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/sessions?childId=${selectedChild}`, {
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
        setAllSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast({
        title: 'Error',
        description: 'Gagal memuat data sesi terapi',
        variant: 'destructive'
      })
    }
  }

  // Filter sessions
  const filteredSessions = allSessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const sessionDate = new Date(session.date)
    const sessionMonth = sessionDate.getMonth()
    const sessionYear = sessionDate.getFullYear()
    const selectedMonthYear = selectedMonth.getMonth()
    const selectedYear = selectedMonth.getFullYear()
    const matchesMonth = sessionMonth === selectedMonthYear && sessionYear === selectedYear
    return matchesStatus && matchesMonth
  })

  // Get upcoming sessions (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const upcomingSessions = allSessions.filter(session => {
    const sessionDate = new Date(session.date)
    return sessionDate >= today && sessionDate <= nextWeek && session.status === 'SCHEDULED'
  })

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Dibatalkan
          </span>
        )
      case 'SCHEDULED':
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
                <p className="text-gray-600">Memuat jadwal terapi...</p>
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
                                      session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                      session.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}
                                    title={session.notes}
                                  >
                                    {new Date(session.date).toLocaleTimeString('id-ID', { 
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
                      <SelectTrigger className="w-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                        <SelectItem 
                          value="all"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          Semua
                        </SelectItem>
                        <SelectItem 
                          value="SCHEDULED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          Terjadwal
                        </SelectItem>
                        <SelectItem 
                          value="COMPLETED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          Selesai
                        </SelectItem>
                        <SelectItem 
                          value="CANCELLED"
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                        >
                          Dibatalkan
                        </SelectItem>
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
                                {new Date(session.date).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {new Date(session.date).toLocaleTimeString('id-ID', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {session.duration || 60} menit
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                {session.location || 'Ruang Terapi A - Lantai 2'}
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
                              {session.therapist?.name || 'Terapis'}
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
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Tidak ada sesi mendatang</p>
                  <p className="text-sm text-gray-400">
                    Sesi terapi dalam 7 hari ke depan akan ditampilkan di sini
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {new Date(session.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {session.duration || 60} menit
                        </p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{session.notes}</p>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {session.therapist?.name || 'Terapis'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {session.location || 'Ruang Terapi A - Lantai 2'}
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
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          
        </div>
      </div>
    </div>
  )
}
