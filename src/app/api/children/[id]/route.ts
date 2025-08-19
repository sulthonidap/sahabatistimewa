import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name, age, parentId } = body

    // Validasi input
    if (!name || !age || !parentId) {
      return NextResponse.json(
        { success: false, error: 'Nama, usia, dan orang tua harus diisi' },
        { status: 400 }
      )
    }

    // Validasi usia
    if (age < 1 || age > 18) {
      return NextResponse.json(
        { success: false, error: 'Usia harus antara 1-18 tahun' },
        { status: 400 }
      )
    }

    // Cek apakah parent exists
    const parent = await prisma.user.findUnique({
      where: { id: parentId }
    })

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update child
    const updatedChild = await prisma.child.update({
      where: { id },
      data: {
        name,
        age,
        parentId
      },
      include: {
        parent: {
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
      message: 'Siswa berhasil diupdate',
      child: updatedChild
    })

  } catch (error) {
    console.error('Error updating child:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate siswa' },
      { status: 500 }
    )
  }
}
