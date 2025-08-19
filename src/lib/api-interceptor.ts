// API Interceptor untuk handle authentication errors
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Show toast notification
      if (typeof window !== 'undefined') {
        // Import toast dynamically to avoid SSR issues
        const { useToast } = await import('@/hooks/use-toast')
        const { toast } = useToast()
        toast({
          title: 'Sesi Berakhir',
          description: 'Silakan login kembali untuk melanjutkan',
          variant: 'destructive'
        })
      }
      
      // Redirect to login
      window.location.href = '/login'
      return null
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new Error('Anda tidak memiliki izin untuk mengakses resource ini')
    }

    return response
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// Hook untuk handle API calls dengan auto-redirect
export function useApi() {
  const makeRequest = async (url: string, options: RequestInit = {}) => {
    return await apiRequest(url, options)
  }

  return { makeRequest }
}
