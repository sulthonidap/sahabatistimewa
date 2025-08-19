'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'PARENT' | 'THERAPIST' | 'PSYCHOLOGIST'
  createdAt: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        })
      } else {
        // Clear any stored auth data
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        
        setAuthState({
          user: null,
          loading: false,
          error: null
        })

        // Show unauthorized toast if it's a 401 error
        if (response.status === 401) {
          toast({
            title: 'Sesi Berakhir',
            description: 'Silakan login kembali untuk melanjutkan',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthState({
        user: null,
        loading: false,
        error: 'Terjadi kesalahan saat memeriksa autentikasi'
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store token in localStorage and cookie
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        document.cookie = `auth-token=${data.token}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`
        
        setAuthState({
          user: data.user,
          loading: false,
          error: null
        })

        // Redirect directly to dashboard based on role
        switch (data.user.role) {
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
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Login gagal'
        }))
      }
    } catch (error) {
      console.error('Login error:', error)
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Terjadi kesalahan saat login'
      }))
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      })
      
      router.push('/login')
    }
  }

  const hasRole = (roles: string[]) => {
    return authState.user ? roles.includes(authState.user.role) : false
  }

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    hasRole,
    checkAuth
  }
}
