import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {

    if (!id) {
      return NextResponse.json(
        { error: 'ID homework diperlukan' },
        { status: 400 }
      )
    }

    // Delete homework from database
    await prisma.homework.delete({
      where: { id }
    })

    console.log('Deleting homework:', id)

    return NextResponse.json({
      success: true,
      message: 'Homework berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete homework error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
