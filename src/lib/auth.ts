import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret'
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret)
  return payload as JWTPayload
}

export async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  return request.cookies.get('auth-token')?.value || null
}

export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = await getTokenFromRequest(request)
    if (!token) return null
    
    return await verifyToken(token)
  } catch (error) {
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<JWTPayload> {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<JWTPayload> {
  const user = await requireAuth(request)
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

// Client-side auth utilities
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth-token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth-token', token)
  // Also set cookie for SSR
  document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth-token')
  localStorage.removeItem('user')
  // Also remove cookie
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function getCurrentUserClient(): any {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}
