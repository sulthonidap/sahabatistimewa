import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    const therapistId = searchParams.get('therapistId')
    const reportType = searchParams.get('reportType')
    const status = searchParams.get('status')

    // Build where clause for filtering
    const where: any = {}
    
    if (childId) {
      where.childId = childId
    }

    if (therapistId) {
      where.therapistId = therapistId
    }

    if (reportType && reportType !== 'all') {
      where.reportType = reportType
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const reports = await prisma.report.findMany({
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
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      reports,
      total: reports.length
    })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      childId, 
      therapistId, 
      reportType, 
      period, 
      summary, 
      recommendations, 
      conclusion,
      status = 'DRAFT' 
    } = body

    // Validate required fields
    if (!childId || !therapistId || !reportType || !period) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Create report in database
    const newReport = await prisma.report.create({
      data: {
        childId,
        therapistId,
        reportType,
        period,
        summary,
        recommendations,
        conclusion,
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

    console.log('Creating new report:', newReport)

    return NextResponse.json({
      success: true,
      report: newReport
    }, { status: 201 })
  } catch (error) {
    console.error('Create report error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Update report in database
    const updatedReport = await prisma.report.update({
      where: { id },
      data: updateData,
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

    console.log('Updating report:', { id, updateData })

    return NextResponse.json({
      success: true,
      report: updatedReport,
      message: 'Laporan berhasil diperbarui'
    })
  } catch (error) {
    console.error('Update report error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
