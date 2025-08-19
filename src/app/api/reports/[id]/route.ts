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
        { error: 'ID laporan diperlukan' },
        { status: 400 }
      )
    }

    // Delete report from database
    await prisma.report.delete({
      where: { id }
    })

    console.log('Deleting report:', id)

    return NextResponse.json({
      success: true,
      message: 'Laporan berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete report error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
