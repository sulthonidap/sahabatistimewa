import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that require authentication
const protectedRoutes = [
  '/admin',
  '/parent', 
  '/therapist',
  '/psychologist'
]

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if it's an API route that needs protection
  const isProtectedApiRoute = pathname.startsWith('/api/') && 
    !pathname.startsWith('/api/auth/') && 
    !pathname.startsWith('/api/test-db/')

  // Get token from cookies (more secure than localStorage)
  const token = request.cookies.get('auth-token')?.value

  // If accessing protected route without token, redirect to login
  if ((isProtectedRoute || isProtectedApiRoute) && !token) {
    // For API routes, return 401 instead of redirect
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'Sesi berakhir, silakan login kembali',
          redirect: '/login' 
        },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth route with valid token, redirect to appropriate dashboard
  if (isAuthRoute && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret'
      )
      
      const { payload } = await jwtVerify(token, secret)
      const userRole = payload.role as string
      
      let dashboardUrl = '/parent' // default
      switch (userRole) {
        case 'ADMIN':
          dashboardUrl = '/admin'
          break
        case 'PARENT':
          dashboardUrl = '/parent'
          break
        case 'THERAPIST':
          dashboardUrl = '/therapist'
          break
        case 'PSYCHOLOGIST':
          dashboardUrl = '/psychologist'
          break
      }
      
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    } catch (error) {
      // Invalid token, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  // For protected routes with valid token, add user info to headers
  if ((isProtectedRoute || isProtectedApiRoute) && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret'
      )
      
      const { payload } = await jwtVerify(token, secret)
      
      // Clone the request and add user info to headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId as string)
      requestHeaders.set('x-user-email', payload.email as string)
      requestHeaders.set('x-user-role', payload.role as string)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
