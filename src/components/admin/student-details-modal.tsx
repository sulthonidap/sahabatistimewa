'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface Parent {
  id: string
  name: string
  email: string
}

interface Child {
  id: string
  name: string
  age: number
  parent: Parent
  sessions: any[]
  homework: any[]
}

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  child: Child | null
}

export function StudentDetailsModal({ isOpen, onClose, child }: StudentDetailsModalProps) {
  if (!isOpen || !child) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Detail Siswa</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-gray-600">{child.age} tahun</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Nama Lengkap:</span>
                  <span className="text-sm text-gray-900">{child.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Usia:</span>
                  <span className="text-sm text-gray-900">{child.age} tahun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Orang Tua:</span>
                  <span className="text-sm text-gray-900">{child.parent?.name || 'Tidak diketahui'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Email Orang Tua:</span>
                  <span className="text-sm text-gray-900">{child.parent?.email || 'Tidak diketahui'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Sesi:</span>
                  <span className="text-sm text-gray-900">{child.sessions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Tugas Rumah:</span>
                  <span className="text-sm text-gray-900">{child.homework?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">ID Siswa:</span>
                  <span className="text-sm text-gray-900 font-mono">{child.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
