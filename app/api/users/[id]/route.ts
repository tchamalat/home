import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// GET /api/users/[id] - Récupérer un utilisateur
export async function GET(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        groups: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      pp: user.pp ? Buffer.from(user.pp).toString('base64') : null,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Modifier un utilisateur (firstname, lastname)
export async function PUT(request: NextRequest, { params }: Params) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const { firstname, lastname } = body

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstname !== undefined && { firstname }),
        ...(lastname !== undefined && { lastname }),
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
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}
