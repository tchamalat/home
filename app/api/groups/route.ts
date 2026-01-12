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
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    // Ajout d'un log détaillé pour Prisma
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des groupes', details: error.message, stack: error.stack },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des groupes', details: error },
      { status: 500 }
    )
  }
}

// POST /api/groups - Créer un groupe
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    // On attend un multipart/form-data pour gérer l'upload d'image
    const contentType = request.headers.get('content-type') || ''
    let name = ''
    let description = ''
    let avatarPath = null
    let imageFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name = (formData.get('name') as string)?.trim() || ''
      description = (formData.get('description') as string)?.trim() || ''
      imageFile = formData.get('avatar') as File | null
    } else {
      const body = await request.json()
      name = body.name?.trim() || ''
      description = body.description?.trim() || ''
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom du groupe est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le nom existe déjà
    const existing = await prisma.group.findUnique({
      where: { name },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Un groupe avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Gestion de l'image : enregistrer dans media/image/grpp, nom unique, historique
    if (imageFile && imageFile.size > 0) {
      const fs = require('fs')
      const path = require('path')
      const mediaDir = path.join(process.cwd(), 'media', 'image', 'grpp')
      if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true })

      // Nom unique : 8 chiffres + extension, collision check
      let ext = path.extname(imageFile.name) || '.jpg'
      let uniqueName = ''
      let tries = 0
      do {
        uniqueName = `${Math.floor(10000000 + Math.random() * 90000000)}${ext}`
        tries++
      } while (fs.existsSync(path.join(mediaDir, uniqueName)) && tries < 10)
      if (tries === 10) {
        return NextResponse.json({ error: 'Impossible de générer un nom de fichier unique' }, { status: 500 })
      }

      // Sauvegarde du fichier
      const arrayBuffer = await imageFile.arrayBuffer()
      fs.writeFileSync(path.join(mediaDir, uniqueName), Buffer.from(arrayBuffer))
      avatarPath = `/media/image/grpp/${uniqueName}`

      // Historique : si le groupe existe déjà, on peut archiver l'ancien avatar
      // Ici, à la création, pas d'historique à gérer
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || null,
        avatarPath,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du groupe' },
      { status: 500 }
    )
  }
}
