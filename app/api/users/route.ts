import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/users - Liste tous les utilisateurs
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const users = await prisma.user.findMany({
      include: {
        groups: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { lastLogin: 'desc' },
    })

    // Convertir les pp (Uint8Array) en base64 pour le JSON
    const usersWithBase64 = users.map(user => ({
      ...user,
      pp: user.pp ? Buffer.from(user.pp).toString('base64') : null,
    }))

    return NextResponse.json(usersWithBase64)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}
