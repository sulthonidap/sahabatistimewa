'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Activity,
  MessageSquare,
  Award,
  Calendar,
  BarChart3,
  Download,
  Eye
} from 'lucide-react'
import { getChildrenByParentId, getProgressByChildId, ProgressData } from '@/data/mock-data'



export default function ParentProgressPage() {
  const [selectedChild, setSelectedChild] = useState('1')
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const parentId = '2' // Mock parent ID
  
  const children = getChildrenByParentId(parentId)
  const currentChild = children.find(child => child.id === selectedChild)
  
  // Get progress data from mock data
  const allProgressData = getProgressByChildId(selectedChild)
  
  // Filter progress data based on selected period
  const getFilteredProgressData = () => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    let monthsToShow = 6 // default 6 months
    if (selectedPeriod === '3months') monthsToShow = 3
    if (selectedPeriod === '1year') monthsToShow = 12
    
    const filteredData = allProgressData.filter(progress => {
      const progressDate = new Date(progress.year, parseInt(progress.month) - 1)
      const cutoffDate = new Date(currentYear, currentMonth - monthsToShow - 1)
      return progressDate >= cutoffDate
    })
    
    return filteredData.sort((a, b) => {
      const dateA = new Date(a.year, parseInt(a.month) - 1)
      const dateB = new Date(b.year, parseInt(b.month) - 1)
      return dateA.getTime() - dateB.getTime()
    })
  }
  
  const progressData = getFilteredProgressData()

  const currentProgress = progressData[progressData.length - 1]
  const previousProgress = progressData[progressData.length - 2] || currentProgress

  // Handle case when no progress data is available
  if (progressData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar userRole="parent" />
        
        <div className="lg:ml-64 pb-20 lg:pb-0">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Anak</h1>
              <p className="text-gray-600">Pantau perkembangan dan kemajuan anak Anda secara detail</p>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Progress</h3>
                <p className="text-gray-500 mb-4">
                  Data progress untuk {currentChild?.name} belum tersedia. 
                  Data akan muncul setelah terapis melakukan evaluasi.
                </p>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Data Lainnya
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const calculateImprovement = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const getImprovementIcon = (current: number, previous: number) => {
    const improvement = current - previous
    return improvement > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getImprovementColor = (current: number, previous: number) => {
    const improvement = current - previous
    return improvement > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getMonthName = (month: string) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return months[parseInt(month) - 1] || month
  }
  
  const getMonthShortName = (month: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
    return months[parseInt(month) - 1] || month
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="parent" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Anak</h1>
            <p className="text-gray-600">Pantau perkembangan dan kemajuan anak Anda secara detail</p>
          </div>

          {/* Child Selector and Period Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
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
            
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="1year">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Current Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  {getImprovementIcon(currentProgress.motorik, previousProgress.motorik)}
                </div>
                <p className="text-sm font-medium text-blue-600 mb-1">Motorik</p>
                <p className="text-2xl font-bold text-blue-900 mb-1">{currentProgress.motorik}%</p>
                <p className={`text-xs ${getImprovementColor(currentProgress.motorik, previousProgress.motorik)}`}>
                  {calculateImprovement(currentProgress.motorik, previousProgress.motorik)}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  {getImprovementIcon(currentProgress.kognitif, previousProgress.kognitif)}
                </div>
                <p className="text-sm font-medium text-green-600 mb-1">Kognitif</p>
                <p className="text-2xl font-bold text-green-900 mb-1">{currentProgress.kognitif}%</p>
                <p className={`text-xs ${getImprovementColor(currentProgress.kognitif, previousProgress.kognitif)}`}>
                  {calculateImprovement(currentProgress.kognitif, previousProgress.kognitif)}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  {getImprovementIcon(currentProgress.sosial, previousProgress.sosial)}
                </div>
                <p className="text-sm font-medium text-purple-600 mb-1">Sosial</p>
                <p className="text-2xl font-bold text-purple-900 mb-1">{currentProgress.sosial}%</p>
                <p className={`text-xs ${getImprovementColor(currentProgress.sosial, previousProgress.sosial)}`}>
                  {calculateImprovement(currentProgress.sosial, previousProgress.sosial)}% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  {getImprovementIcon(currentProgress.bahasa, previousProgress.bahasa)}
                </div>
                <p className="text-sm font-medium text-orange-600 mb-1">Bahasa</p>
                <p className="text-2xl font-bold text-orange-900 mb-1">{currentProgress.bahasa}%</p>
                <p className={`text-xs ${getImprovementColor(currentProgress.bahasa, previousProgress.bahasa)}`}>
                  {calculateImprovement(currentProgress.bahasa, previousProgress.bahasa)}% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Grafik Perkembangan</CardTitle>
                  <CardDescription>Perkembangan {currentChild?.name} dalam {selectedPeriod === '3months' ? '3' : selectedPeriod === '6months' ? '6' : '12'} bulan terakhir</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Detail
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Grafik perkembangan akan ditampilkan di sini</p>
                  <p className="text-sm text-gray-400">Integrasi dengan library chart (Chart.js/Recharts)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Progress Table */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Detail Perkembangan Bulanan</CardTitle>
              <CardDescription>Data perkembangan {currentChild?.name} per bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Bulan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Motorik</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Kognitif</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Sosial</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Bahasa</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody>
                                         {progressData.map((data, index) => {
                       const average = ((data.motorik + data.kognitif + data.sosial + data.bahasa) / 4).toFixed(1)
                       return (
                         <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                           <td className="py-4 px-4 font-medium text-gray-900">{getMonthShortName(data.month)} {data.year}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-900">{data.motorik}%</span>
                              {index > 0 && (
                                <span className={`ml-2 text-xs ${data.motorik > progressData[index - 1].motorik ? 'text-green-600' : 'text-red-600'}`}>
                                  {data.motorik > progressData[index - 1].motorik ? '↗' : '↘'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-900">{data.kognitif}%</span>
                              {index > 0 && (
                                <span className={`ml-2 text-xs ${data.kognitif > progressData[index - 1].kognitif ? 'text-green-600' : 'text-red-600'}`}>
                                  {data.kognitif > progressData[index - 1].kognitif ? '↗' : '↘'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-900">{data.sosial}%</span>
                              {index > 0 && (
                                <span className={`ml-2 text-xs ${data.sosial > progressData[index - 1].sosial ? 'text-green-600' : 'text-red-600'}`}>
                                  {data.sosial > progressData[index - 1].sosial ? '↗' : '↘'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-900">{data.bahasa}%</span>
                              {index > 0 && (
                                <span className={`ml-2 text-xs ${data.bahasa > progressData[index - 1].bahasa ? 'text-green-600' : 'text-red-600'}`}>
                                  {data.bahasa > progressData[index - 1].bahasa ? '↗' : '↘'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900">{average}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Rekomendasi Terapis</CardTitle>
              <CardDescription>Berdasarkan perkembangan {currentChild?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                   <h4 className="font-medium text-gray-900 mb-2">Motorik</h4>
                   <p className="text-sm text-gray-600 mb-3">
                     {currentProgress?.motorik < 80 ? 
                       'Perlu latihan motorik halus lebih intensif. Fokus pada koordinasi tangan dan mata.' :
                       'Motorik sudah berkembang dengan baik. Pertahankan latihan rutin.'
                     }
                   </p>
                   <div className="flex items-center text-xs text-blue-600">
                     <Calendar className="w-3 h-3 mr-1" />
                     Update terakhir: {currentProgress ? new Date(currentProgress.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                   </div>
                 </div>

                                 <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                   <h4 className="font-medium text-gray-900 mb-2">Kognitif</h4>
                   <p className="text-sm text-gray-600 mb-3">
                     {currentProgress?.kognitif < 80 ? 
                       'Latihan konsentrasi dan pemecahan masalah perlu ditingkatkan.' :
                       'Kemampuan kognitif berkembang pesat. Lanjutkan dengan latihan yang lebih kompleks.'
                     }
                   </p>
                   <div className="flex items-center text-xs text-green-600">
                     <Calendar className="w-3 h-3 mr-1" />
                     Update terakhir: {currentProgress ? new Date(currentProgress.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                   </div>
                 </div>

                                 <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                   <h4 className="font-medium text-gray-900 mb-2">Sosial</h4>
                   <p className="text-sm text-gray-600 mb-3">
                     {currentProgress?.sosial < 75 ? 
                       'Perlu lebih banyak interaksi sosial dengan teman sebaya.' :
                       'Kemampuan sosial sudah baik. Pertahankan aktivitas kelompok.'
                     }
                   </p>
                   <div className="flex items-center text-xs text-purple-600">
                     <Calendar className="w-3 h-3 mr-1" />
                     Update terakhir: {currentProgress ? new Date(currentProgress.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                   </div>
                 </div>

                                 <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                   <h4 className="font-medium text-gray-900 mb-2">Bahasa</h4>
                   <p className="text-sm text-gray-600 mb-3">
                     {currentProgress?.bahasa < 80 ? 
                       'Latihan pengucapan dan kosakata perlu ditingkatkan.' :
                       'Kemampuan bahasa berkembang sangat baik. Lanjutkan dengan latihan yang lebih menantang.'
                     }
                   </p>
                   <div className="flex items-center text-xs text-orange-600">
                     <Calendar className="w-3 h-3 mr-1" />
                     Update terakhir: {currentProgress ? new Date(currentProgress.createdAt).toLocaleDateString('id-ID') : 'N/A'}
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
