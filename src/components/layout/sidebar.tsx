'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Menu,
  X,
  User,
  BookOpen,
  MessageSquare,
  BarChart3,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  userRole: string
}

const navigationItems = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Kelola Pengguna', href: '/admin/users', icon: Users },
    { name: 'Data Siswa', href: '/admin/students', icon: User },
    { name: 'Laporan Gaji', href: '/admin/salary', icon: BarChart3 },
  ],
  parent: [
    { name: 'Dashboard', href: '/parent', icon: Home },
    { name: 'Progress Anak', href: '/parent/progress', icon: BarChart3 },
    { name: 'Pekerjaan Rumah', href: '/parent/homework', icon: BookOpen },
    { name: 'Jadwal Terapi', href: '/parent/schedule', icon: Calendar },
    { name: 'Pesan', href: '/parent/messages', icon: MessageSquare },
  ],
  therapist: [
    { name: 'Dashboard', href: '/therapist', icon: Home },
    { name: 'Sesi Terapi', href: '/therapist/sessions', icon: Calendar },
    { name: 'Progress Siswa', href: '/therapist/progress', icon: BarChart3 },
    { name: 'Tugas Rumah', href: '/therapist/homework', icon: BookOpen },
    { name: 'Laporan Terapi', href: '/therapist/reports', icon: FileText },
    { name: 'Pesan', href: '/therapist/messages', icon: MessageSquare },
    { name: 'Data Siswa', href: '/therapist/students', icon: User },
  ],
  psychologist: [
    { name: 'Dashboard', href: '/psychologist', icon: Home },
    { name: 'Inbox Laporan', href: '/psychologist/reports', icon: FileText },
    { name: 'Review Sesi', href: '/psychologist/sessions', icon: Calendar },
    { name: 'Analisis Data', href: '/psychologist/analytics', icon: BarChart3 },
  ],
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const items = navigationItems[userRole as keyof typeof navigationItems] || []

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear localStorage
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      
      // Clear cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to login page
      window.location.href = '/login'
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Anak Hebat</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {items.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                  isActive
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-center">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Anak Hebat</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
