'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar,
  BookOpen,
  FileText,
  MessageSquare,
  User,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Bell
} from 'lucide-react'
import { mockChildren, getProgressByChildId } from '@/data/mock-data'

export default function TherapistDashboardPage() {
  const therapistId = '3' // Mock therapist ID

  // Mock data for dashboard
  const todaySessions = [
    {
      id: '1',
      childName: 'Ahmad Wijaya',
      time: '09:00 - 10:00',
      type: 'Terapi Motorik',
      status: 'completed'
    },
    {
      id: '2',
      childName: 'Siti Nurhaliza',
      time: '11:00 - 12:00',
      type: 'Terapi Kognitif',
      status: 'upcoming'
    },
    {
      id: '3',
      childName: 'Budi Santoso',
      time: '14:00 - 15:00',
      type: 'Terapi Sosial',
      status: 'upcoming'
    }
  ]

  const recentProgress = [
    {
      id: '1',
      childName: 'Ahmad Wijaya',
      area: 'Motorik',
      improvement: '+15%',
      date: 'Hari ini'
    },
    {
      id: '2',
      childName: 'Siti Nurhaliza',
      area: 'Kognitif',
      improvement: '+8%',
      date: 'Kemarin'
    },
    {
      id: '3',
      childName: 'Budi Santoso',
      area: 'Sosial',
      improvement: '+12%',
      date: '2 hari lalu'
    }
  ]

  const pendingTasks = [
    {
      id: '1',
      childName: 'Ahmad Wijaya',
      task: 'Latihan Menulis Huruf',
      dueDate: 'Besok'
    },
    {
      id: '2',
      childName: 'Siti Nurhaliza',
      task: 'Latihan Berhitung',
      dueDate: '3 hari lagi'
    }
  ]

  const unreadMessages = 5
  const totalStudents = mockChildren.length
  const completedSessions = 12
  const pendingReports = 3

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </span>
        )
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Akan Datang
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Terapis</h1>
            <p className="text-gray-600">Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda hari ini.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                    <p className="text-2xl font-bold text-blue-900">{totalStudents}</p>
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
                    <p className="text-sm font-medium text-green-600">Sesi Selesai</p>
                    <p className="text-2xl font-bold text-green-900">{completedSessions}</p>
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
                    <p className="text-sm font-medium text-purple-600">Pesan Baru</p>
                    <p className="text-2xl font-bold text-purple-900">{unreadMessages}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Laporan Pending</p>
                    <p className="text-2xl font-bold text-orange-900">{pendingReports}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Sessions */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Jadwal Hari Ini</CardTitle>
                      <CardDescription>Sesi terapi yang dijadwalkan untuk hari ini</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Lihat Semua
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{session.childName}</h4>
                            <p className="text-sm text-gray-500">{session.type}</p>
                            <p className="text-xs text-gray-400">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(session.status)}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Aksi Cepat</CardTitle>
                  <CardDescription>Fitur-fitur yang sering digunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Sesi Baru
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Berikan Tugas
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Buat Laporan
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Progress Terbaru</CardTitle>
                  <CardDescription>Perkembangan siswa terbaru</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentProgress.map((progress) => (
                      <div key={progress.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{progress.childName}</p>
                          <p className="text-sm text-gray-600">{progress.area}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{progress.improvement}</p>
                          <p className="text-xs text-gray-500">{progress.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Pending Tasks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Tugas Pending</CardTitle>
                    <CardDescription>Tugas rumah yang belum selesai</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{task.childName}</p>
                        <p className="text-sm text-gray-600">{task.task}</p>
                        <p className="text-xs text-gray-500">Deadline: {task.dueDate}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Aktivitas Terbaru</CardTitle>
                <CardDescription>Riwayat aktivitas terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sesi terapi Ahmad selesai</p>
                      <p className="text-xs text-gray-500">2 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Laporan Siti diupload</p>
                      <p className="text-xs text-gray-500">4 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pesan dari orang tua Budi</p>
                      <p className="text-xs text-gray-500">6 jam yang lalu</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
