import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// GET /api/groups/[id] - Récupérer un groupe avec ses membres
export async function GET(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            mail: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 })
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error fetching group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du groupe' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id] - Supprimer un groupe (et ses relations)
export async function DELETE(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params

    // Vérifier que le groupe existe
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 })
    }

    // Supprimer le groupe (les relations many-to-many sont automatiquement supprimées)
    await prisma.group.delete({ where: { id } })

    return NextResponse.json({ message: 'Groupe supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du groupe' },
      { status: 500 }
    )
  }
}

// PUT /api/groups/[id] - Modifier un groupe
export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, pp } = body

    // Vérifier que le groupe existe
    const existing = await prisma.group.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 })
    }

    // Si on change le nom, vérifier qu'il n'existe pas déjà
    if (name && name !== existing.name) {
      const nameExists = await prisma.group.findUnique({ where: { name } })
      if (nameExists) {
        return NextResponse.json(
          { error: 'Un groupe avec ce nom existe déjà' },
          { status: 409 }
        )
      }
    }

    // Mettre à jour le groupe
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(pp !== undefined && { pp: pp ? Buffer.from(pp, 'base64') : null }),
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    return NextResponse.json({
      ...updatedGroup,
      pp: updatedGroup.pp ? Buffer.from(updatedGroup.pp).toString('base64') : null,
    })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du groupe' },
      { status: 500 }
    )
  }
}
