import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, email, role, password } = body

    // Validasi input
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan role harus diisi' },
        { status: 400 }
      )
    }

    // Validasi role
    const validRoles = ['ADMIN', 'PARENT', 'THERAPIST', 'PSYCHOLOGIST']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role tidak valid' },
        { status: 400 }
      )
    }

    // Cek apakah email sudah digunakan oleh user lain
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: { not: id }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email sudah digunakan' },
        { status: 400 }
      )
    }

    // Persiapkan data update
    const updateData: any = {
      name,
      email,
      role
    }

    // Jika ada password baru, hash password
    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil diupdate',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate pengguna' },
      { status: 500 }
    )
  }
}
