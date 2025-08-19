import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { 
      userId, 
      month, 
      year, 
      baseSalary, 
      allowance, 
      bonus, 
      deductions, 
      totalSalary, 
      status, 
      notes 
    } = body

    // Validasi input
    if (!userId || !month || !year || !baseSalary || !status) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi kecuali catatan' },
        { status: 400 }
      )
    }

    // Validasi tahun
    if (year < 2020 || year > 2030) {
      return NextResponse.json(
        { success: false, error: 'Tahun harus antara 2020-2030' },
        { status: 400 }
      )
    }

    // Validasi gaji pokok
    if (baseSalary < 0) {
      return NextResponse.json(
        { success: false, error: 'Gaji pokok tidak boleh negatif' },
        { status: 400 }
      )
    }

    // Cek apakah user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Cek apakah sudah ada gaji untuk bulan dan tahun yang sama (kecuali untuk record yang sedang diupdate)
    const existingSalary = await prisma.salary.findFirst({
      where: {
        userId,
        month,
        year,
        id: { not: id }
      }
    })

    if (existingSalary) {
      return NextResponse.json(
        { success: false, error: 'Sudah ada gaji untuk karyawan ini pada periode yang sama' },
        { status: 400 }
      )
    }

    // Update salary
    const updatedSalary = await prisma.salary.update({
      where: { id },
      data: {
        userId,
        month,
        year,
        baseSalary,
        allowance: allowance || 0,
        bonus: bonus || 0,
        deductions: deductions || 0,
        totalSalary,
        status,
        notes: notes || null,
        paidAt: status === 'PAID' ? new Date() : null
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
      message: 'Gaji berhasil diupdate',
      salary: updatedSalary
    })

  } catch (error) {
    console.error('Error updating salary:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate gaji' },
      { status: 500 }
    )
  }
}
