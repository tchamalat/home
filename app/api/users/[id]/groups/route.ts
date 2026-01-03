import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// PUT /api/users/[id]/groups - Modifier les groupes d'un utilisateur
export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const { groupIds } = body as { groupIds: string[] }

    // Remplace tous les groupes de l'utilisateur par la nouvelle liste
    const user = await prisma.user.update({
      where: { id },
      data: {
        groups: {
          set: groupIds.map((groupId) => ({ id: groupId })),
        },
      },
      include: {
        groups: true,
      },
    })

    return NextResponse.json({
      ...user,
      pp: user.pp ? Buffer.from(user.pp).toString('base64') : null,
    })
  } catch (error) {
    console.error('Error updating user groups:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des groupes' },
      { status: 500 }
    )
  }
}
