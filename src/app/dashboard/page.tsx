'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect based on user role
        switch (user.role) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'PARENT':
            router.push('/parent')
            break
          case 'THERAPIST':
            router.push('/therapist')
            break
          case 'PSYCHOLOGIST':
            router.push('/psychologist')
            break
          default:
            router.push('/parent')
        }
      } else {
        // If not authenticated, redirect to login
        router.push('/login')
      }
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Mengalihkan ke dashboard...</p>
      </div>
    </div>
  )
}
