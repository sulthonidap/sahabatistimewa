import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { parent: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const children = await prisma.child.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        sessions: {
          select: {
            id: true,
            date: true,
            status: true
          }
        },
        homework: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      children,
      total: children.length
    })
  } catch (error) {
    console.error('Get children error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, age, parentId } = body

    // Validate required fields
    if (!name || !age || !parentId) {
      return NextResponse.json(
        { error: 'Nama, usia, dan orang tua harus diisi' },
        { status: 400 }
      )
    }

    // Check if parent exists
    const parent = await prisma.user.findUnique({
      where: { id: parentId }
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Orang tua tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create new child
    const newChild = await prisma.child.create({
      data: {
        name,
        age: parseInt(age),
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
      child: newChild
    }, { status: 201 })
  } catch (error) {
    console.error('Create child error:', error)
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
        { error: 'ID siswa harus disediakan' },
        { status: 400 }
      )
    }

    // Check if child exists
    const existingChild = await prisma.child.findUnique({
      where: { id }
    })

    if (!existingChild) {
      return NextResponse.json(
        { error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete child
    await prisma.child.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Siswa berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete child error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
