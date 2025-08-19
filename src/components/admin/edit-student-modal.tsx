'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Loader2 } from 'lucide-react'

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

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onStudentUpdated: () => void
  child: Child | null
}

export function EditStudentModal({ isOpen, onClose, onStudentUpdated, child }: EditStudentModalProps) {
  const [formData, setFormData] = useState({ name: '', age: '', parentId: '' })
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (child && isOpen) {
      setFormData({
        name: child.name,
        age: child.age.toString(),
        parentId: child.parent?.id || ''
      })
    }
  }, [child, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchParents()
    }
  }, [isOpen])

  useEffect(() => {
    if (parents.length > 0 && child && isOpen) {
      setFormData(prev => ({
        ...prev,
        parentId: child.parent?.id || ''
      }))
    }
  }, [parents, child, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchParents()
    }
  }, [isOpen])

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/users?role=parent')
      const data = await response.json()
      
      if (data.success) {
        setParents(data.users)
      }
    } catch (error) {
      console.error('Error fetching parents:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/children/${child?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          parentId: formData.parentId
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onStudentUpdated()
        onClose()
      } else {
        setError(data.error || 'Gagal mengupdate siswa')
      }
    } catch (error) {
      console.error('Error updating student:', error)
      setError('Terjadi kesalahan saat mengupdate siswa')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', age: '', parentId: '' })
      setError('')
      onClose()
    }
  }

  if (!isOpen || !child) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-2xl bg-white relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Edit Siswa</CardTitle>
              <CardDescription className="text-gray-600">Update informasi siswa</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nama Siswa</label>
                <Input
                  type="text"
                  placeholder="Masukkan nama siswa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Usia</label>
                <Input
                  type="number"
                  placeholder="Masukkan usia"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  disabled={loading}
                  min="1"
                  max="18"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Orang Tua</label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })} disabled={loading}>
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Pilih orang tua" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" position="popper" sideOffset={4}>
                    {parents.map((parent) => (
                      <SelectItem
                        key={parent.id}
                        value={parent.id}
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 focus:text-purple-700 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span>{parent.name} ({parent.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
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
                      Menyimpan...
                    </>
                  ) : (
                    'Update Siswa'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
