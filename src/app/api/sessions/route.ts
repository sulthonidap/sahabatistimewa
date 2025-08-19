import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const therapistId = searchParams.get('therapistId')
    const childId = searchParams.get('childId')
    const status = searchParams.get('status')

    // Build where clause for filtering
    const where: any = {}
    
    if (therapistId) {
      where.therapistId = therapistId
    }

    if (childId) {
      where.childId = childId
    }

    if (status) {
      where.status = status
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        child: {
          select: {
            id: true,
            name: true,
            age: true
          }
        },
        therapist: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Parse images JSON string back to array
    const sessionsWithParsedImages = sessions.map((session: any) => ({
      ...session,
      images: session.images ? JSON.parse(session.images) : []
    }))

    return NextResponse.json({
      success: true,
      sessions: sessionsWithParsedImages,
      total: sessionsWithParsedImages.length
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, therapistId, date, duration, location, notes, images = [], status = 'SCHEDULED' } = body

    // Validate required fields
    if (!childId || !therapistId || !date) {
      return NextResponse.json(
        { error: 'Child ID, Therapist ID, dan tanggal harus diisi' },
        { status: 400 }
      )
    }

    // Check if child and therapist exist
    const child = await prisma.child.findUnique({
      where: { id: childId }
    })

    const therapist = await prisma.user.findUnique({
      where: { id: therapistId }
    })

    if (!child) {
      return NextResponse.json(
        { error: 'Child tidak ditemukan' },
        { status: 404 }
      )
    }

    if (!therapist || therapist.role !== 'THERAPIST') {
      return NextResponse.json(
        { error: 'Therapist tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create new session
    const newSession = await prisma.session.create({
      data: {
        childId,
        therapistId,
        date: new Date(date),
        duration: duration ? parseInt(duration) : 60,
        location: location || 'Ruang Terapi A - Lantai 2',
        notes: notes || '',
        images: JSON.stringify(images),
        status: status.toUpperCase()
      },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            age: true
          }
        },
        therapist: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      session: {
        ...newSession,
        images: JSON.parse(newSession.images)
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
