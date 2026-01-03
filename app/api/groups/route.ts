import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/groups - Liste tous les groupes
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convertir les Bytes (Uint8Array) en base64 pour le JSON
    const groupsWithBase64 = groups.map(group => ({
      ...group,
      pp: group.pp ? Buffer.from(group.pp).toString('base64') : null,
    }))

    return NextResponse.json(groupsWithBase64)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes' },
      { status: 500 }
    )
  }
}

// POST /api/groups - Créer un groupe
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const { name, description, pp } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Le nom du groupe est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le nom existe déjà
    const existing = await prisma.group.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Un groupe avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        // pp est un Bytes, on s'attend à recevoir un Buffer ou base64
        pp: pp ? Buffer.from(pp, 'base64') : null,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    // Convertir pp en base64 pour le JSON
    return NextResponse.json({
      ...group,
      pp: group.pp ? Buffer.from(group.pp).toString('base64') : null,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    )
  }
}
