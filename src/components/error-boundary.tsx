'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Check if it's an authentication error
    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      // Clear auth data
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to login
      window.location.href = '/login'
      return
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Terjadi Kesalahan
              </h1>
              <p className="text-gray-600 mb-4">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Detail Error
                  </summary>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
