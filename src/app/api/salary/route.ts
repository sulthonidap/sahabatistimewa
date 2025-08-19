import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    // Build where clause for filtering
    const where: any = {}
    
    if (month) {
      where.month = parseInt(month)
    }
    
    if (year) {
      where.year = parseInt(year)
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (userId) {
      where.userId = userId
    }

    const salaries = await prisma.salary.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Calculate statistics
    const totalSalary = salaries.reduce((sum, salary) => sum + salary.totalSalary, 0)
    const paidSalary = salaries
      .filter(salary => salary.status === 'PAID')
      .reduce((sum, salary) => sum + salary.totalSalary, 0)
    const pendingSalary = salaries
      .filter(salary => salary.status === 'PENDING')
      .reduce((sum, salary) => sum + salary.totalSalary, 0)

    return NextResponse.json({
      success: true,
      salaries,
      total: salaries.length,
      statistics: {
        totalSalary,
        paidSalary,
        pendingSalary
      }
    })
  } catch (error) {
    console.error('Get salaries error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, month, year, baseSalary, allowance, bonus, deductions, notes } = body

    // Validate required fields
    if (!userId || !month || !year || !baseSalary) {
      return NextResponse.json(
        { error: 'User ID, bulan, tahun, dan gaji pokok harus diisi' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if salary already exists for this user, month, and year
    const existingSalary = await prisma.salary.findFirst({
      where: {
        userId,
        month: parseInt(month),
        year: parseInt(year)
      }
    })

    if (existingSalary) {
      return NextResponse.json(
        { error: 'Gaji untuk bulan dan tahun ini sudah ada' },
        { status: 409 }
      )
    }

    // Calculate total salary
    const totalSalary = (parseFloat(baseSalary) || 0) + 
                       (parseFloat(allowance) || 0) + 
                       (parseFloat(bonus) || 0) - 
                       (parseFloat(deductions) || 0)

    // Create new salary
    const newSalary = await prisma.salary.create({
      data: {
        userId,
        month: parseInt(month),
        year: parseInt(year),
        baseSalary: parseFloat(baseSalary),
        allowance: parseFloat(allowance) || 0,
        bonus: parseFloat(bonus) || 0,
        deductions: parseFloat(deductions) || 0,
        totalSalary,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      salary: newSalary
    }, { status: 201 })
  } catch (error) {
    console.error('Create salary error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, paidAt, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID gaji harus disediakan' },
        { status: 400 }
      )
    }

    // Check if salary exists
    const existingSalary = await prisma.salary.findUnique({
      where: { id }
    })

    if (!existingSalary) {
      return NextResponse.json(
        { error: 'Data gaji tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update salary
    const updateData: any = {}
    
    if (status) {
      updateData.status = status.toUpperCase()
      if (status.toUpperCase() === 'PAID') {
        updateData.paidAt = new Date()
      }
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const updatedSalary = await prisma.salary.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      salary: updatedSalary
    })
  } catch (error) {
    console.error('Update salary error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID gaji harus disediakan' },
        { status: 400 }
      )
    }

    // Check if salary exists
    const existingSalary = await prisma.salary.findUnique({
      where: { id }
    })

    if (!existingSalary) {
      return NextResponse.json(
        { error: 'Data gaji tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete salary
    await prisma.salary.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Data gaji berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete salary error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
