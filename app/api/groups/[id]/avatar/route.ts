import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

// GET /api/groups/[id]/avatar - Sert l'image du groupe
export async function GET(request: NextRequest) {
  // Récupère l'id depuis request.nextUrl
  const url = request.nextUrl || new URL(request.url)
  const id = url.pathname.split('/').at(-2)
  if (!id) {
    return NextResponse.json({ error: 'Paramètre id manquant', debug: { url: url.pathname } }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  
    // Vérifie que le groupe existe
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: { select: { mail: true } } },
    })
    if (!group || !group.avatarPath) {
      return NextResponse.json({ error: 'Image non trouvée', debug: { group } }, { status: 404 })
    }

    // Vérifie les droits : admin ou membre du groupe (par email)
    const isAdmin = session?.user?.isAdmin
    const userEmail = session?.user?.email
    const isMember = group.members.some(m => m.mail === userEmail)
    if (!isAdmin && !isMember) {
      return NextResponse.json({ error: 'Accès refusé', debug: { userEmail, members: group.members } }, { status: 403 })
    }

    const filePath = path.join(process.cwd(), group.avatarPath.startsWith('/') ? group.avatarPath.slice(1) : group.avatarPath)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Image non trouvée', debug: { filePath } }, { status: 404 })
    }

    const image = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    let contentType = 'image/jpeg'
    if (ext === '.png') contentType = 'image/png'
    if (ext === '.gif') contentType = 'image/gif'

    return new NextResponse(image, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': image.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    })
}
