'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Star,
  Target,
  Award,
  Activity
} from 'lucide-react'
import { getChildrenByParentId, getHomeworkByChildId, getSessionsByChildId } from '@/data/mock-data'

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState('1') // Default to first child
  const parentId = '2' // Mock parent ID
  
  const children = getChildrenByParentId(parentId)
  const homework = getHomeworkByChildId(selectedChild)
  const sessions = getSessionsByChildId(selectedChild)
  
  const currentChild = children.find(child => child.id === selectedChild)
  
  // Mock progress data
  const progressData = {
    motorik: 75,
    kognitif: 82,
    sosial: 68,
    bahasa: 90
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="parent" />
      
      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Orang Tua</h1>
            <p className="text-gray-600">Pantau perkembangan dan aktivitas anak Anda</p>
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

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Motorik</p>
                    <p className="text-2xl font-bold text-blue-900">{progressData.motorik}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Kognitif</p>
                    <p className="text-2xl font-bold text-green-900">{progressData.kognitif}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Sosial</p>
                    <p className="text-2xl font-bold text-purple-900">{progressData.sosial}%</p>
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
                    <p className="text-sm font-medium text-orange-600">Bahasa</p>
                    <p className="text-2xl font-bold text-orange-900">{progressData.bahasa}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Grafik Perkembangan</CardTitle>
              <CardDescription>Perkembangan {currentChild?.name} dalam 6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Grafik perkembangan akan ditampilkan di sini</p>
                  <p className="text-sm text-gray-400">Integrasi dengan library chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homework and Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Homework Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Pekerjaan Rumah</CardTitle>
                    <CardDescription>Tugas dari terapis untuk {currentChild?.name}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {homework.map((task) => (
                    <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Deadline: {task.dueDate.toLocaleDateString('id-ID')}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status === 'completed' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Selesai
                              </>
                            ) : task.status === 'overdue' ? (
                              'Terlambat'
                            ) : (
                              'Pending'
                            )}
                          </span>
                        </div>
                      </div>
                      {task.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Button size="sm" className="w-full">
                            Tandai Selesai
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Jadwal Terapi</CardTitle>
                    <CardDescription>Sesi terapi mendatang</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Lihat Kalender
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            Sesi Terapi - {session.date.toLocaleDateString('id-ID')}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {session.notes.substring(0, 100)}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {session.date.toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status === 'completed' ? 'Selesai' :
                             session.status === 'cancelled' ? 'Dibatalkan' :
                             'Terjadwal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Upcoming Session */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Sesi Berikutnya</h4>
                      <p className="text-sm text-gray-600">
                        Senin, 20 Agustus 2024 - 14:00 WIB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Pencapaian Terbaru</CardTitle>
              <CardDescription>Prestasi dan kemajuan {currentChild?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Motorik Halus</h4>
                      <p className="text-sm text-gray-600">Meningkat 15%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Konsentrasi</h4>
                      <p className="text-sm text-gray-600">Bertahan 20 menit</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Komunikasi</h4>
                      <p className="text-sm text-gray-600">Kata baru: 10</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
