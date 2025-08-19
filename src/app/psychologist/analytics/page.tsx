'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  PieChart,
  LineChart,
  User,
  MapPin,
  MessageSquare
} from 'lucide-react'

interface AnalyticsData {
  totalStudents: number
  totalSessions: number
  totalReports: number
  averageProgress: number
  attendanceRate: number
  satisfactionScore: number
  monthlySessions: number[]
  progressByCategory: {
    motorik: number
    kognitif: number
    sosial: number
    bahasa: number
  }
  topPerformers: Array<{
    name: string
    progress: number
    sessions: number
  }>
  recentActivities: Array<{
    type: string
    description: string
    time: string
    icon: any
  }>
}

export default function PsychologistAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudents: 3,
    totalSessions: 24,
    totalReports: 8,
    averageProgress: 78,
    attendanceRate: 92,
    satisfactionScore: 4.8,
    monthlySessions: [12, 19, 15, 22, 18, 24],
    progressByCategory: {
      motorik: 85,
      kognitif: 78,
      sosial: 92,
      bahasa: 88
    },
    topPerformers: [
      { name: 'Ahmad Wijaya', progress: 92, sessions: 8 },
      { name: 'Siti Santoso', progress: 88, sessions: 7 },
      { name: 'Rina Wijaya', progress: 85, sessions: 9 }
    ],
    recentActivities: [
      {
        type: 'session',
        description: 'Sesi terapi Ahmad Wijaya selesai',
        time: '2 jam yang lalu',
        icon: CheckCircle
      },
      {
        type: 'report',
        description: 'Laporan bulanan Siti Santoso direview',
        time: '1 hari yang lalu',
        icon: FileText
      },
      {
        type: 'progress',
        description: 'Progress Rina Wijaya meningkat 15%',
        time: '2 hari yang lalu',
        icon: TrendingUp
      }
    ]
  })
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedStudent, setSelectedStudent] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="psychologist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analisis Data</h1>
                <p className="text-gray-600">Analisis komprehensif perkembangan siswa dan performa terapi</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                    <SelectItem value="quarter">Kuartal</SelectItem>
                    <SelectItem value="year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Siswa</SelectItem>
                    <SelectItem value="ahmad">Ahmad Wijaya</SelectItem>
                    <SelectItem value="siti">Siti Santoso</SelectItem>
                    <SelectItem value="rina">Rina Wijaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-blue-900">{analyticsData.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Sesi</p>
                    <p className="text-2xl font-bold text-green-900">{analyticsData.totalSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Rata-rata Progress</p>
                    <p className="text-2xl font-bold text-purple-900">{analyticsData.averageProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Tingkat Kehadiran</p>
                    <p className="text-2xl font-bold text-orange-900">{analyticsData.attendanceRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Progress by Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Progress per Kategori</CardTitle>
                <CardDescription>Perkembangan siswa berdasarkan kategori kemampuan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Motorik</p>
                        <p className="text-sm text-gray-600">Kemampuan fisik</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.progressByCategory.motorik}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Kognitif</p>
                        <p className="text-sm text-gray-600">Kemampuan berpikir</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{analyticsData.progressByCategory.kognitif}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Sosial</p>
                        <p className="text-sm text-gray-600">Interaksi sosial</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{analyticsData.progressByCategory.sosial}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Bahasa</p>
                        <p className="text-sm text-gray-600">Komunikasi verbal</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">{analyticsData.progressByCategory.bahasa}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Top Performers</CardTitle>
                <CardDescription>Siswa dengan performa terbaik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPerformers.map((student, index) => (
                    <div key={student.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-orange-500'
                        }`}>
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.sessions} sesi</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{student.progress}%</p>
                        <p className="text-xs text-gray-500">Progress</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Session Trends */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Trend Sesi</CardTitle>
                <CardDescription>Jumlah sesi per bulan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.monthlySessions.map((sessions, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bulan {index + 1}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(sessions / Math.max(...analyticsData.monthlySessions)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{sessions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satisfaction Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Kepuasan</CardTitle>
                <CardDescription>Rating dan feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {analyticsData.satisfactionScore}/5
                    </div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(analyticsData.satisfactionScore) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Rata-rata kepuasan</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sangat Puas</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Puas</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kurang Puas</span>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
                <CardDescription>Update terbaru dari sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'session' ? 'bg-green-500' :
                        activity.type === 'report' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}>
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Insight Performa</CardTitle>
              <CardDescription>Analisis mendalam performa terapi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Durasi Optimal</h3>
                  <p className="text-2xl font-bold text-blue-600">45m</p>
                  <p className="text-sm text-gray-600">Rata-rata sesi</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Target Tercapai</h3>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-sm text-gray-600">Dari target bulanan</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pertumbuhan</h3>
                  <p className="text-2xl font-bold text-purple-600">+12%</p>
                  <p className="text-sm text-gray-600">Dari bulan lalu</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Siswa Aktif</h3>
                  <p className="text-2xl font-bold text-orange-600">100%</p>
                  <p className="text-sm text-gray-600">Kehadiran reguler</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
