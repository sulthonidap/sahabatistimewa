import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    const therapistId = searchParams.get('therapistId')
    const status = searchParams.get('status')

    // Build where clause for filtering
    const where: any = {}
    
    if (childId) {
      where.childId = childId
    }

    if (therapistId) {
      where.therapistId = therapistId
    }

    if (status) {
      where.status = status
    }

    const homework = await prisma.homework.findMany({
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
        dueDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      homework,
      total: homework.length
    })
  } catch (error) {
    console.error('Get homework error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { childId, therapistId, title, description, dueDate, status = 'ASSIGNED' } = body

    // Validate required fields
    if (!childId || !therapistId || !title || !dueDate) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Create homework in database
    const newHomework = await prisma.homework.create({
      data: {
        childId,
        therapistId,
        title,
        description,
        dueDate: new Date(dueDate),
        status: status as any
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

    console.log('Creating new homework:', newHomework)

    return NextResponse.json({
      success: true,
      homework: newHomework
    }, { status: 201 })
  } catch (error) {
    console.error('Create homework error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    // Update homework status in database
    const updatedHomework = await prisma.homework.update({
      where: { id },
      data: { status: status as any },
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

    console.log('Updating homework status:', { id, status })

    return NextResponse.json({
      success: true,
      homework: updatedHomework,
      message: 'Status homework berhasil diperbarui'
    })
  } catch (error) {
    console.error('Update homework error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}


