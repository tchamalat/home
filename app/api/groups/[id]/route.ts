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
    const body = request.formData ? await request.formData() : await request.json()
    let name, description, file
    if (body instanceof FormData) {
      name = body.get('name')
      description = body.get('description')
      file = body.get('file') as File | null
    } else {
      name = body.name
      description = body.description
      file = null
    }

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

    // Gestion de l'image de groupe
    let avatarPath = existing.avatarPath
    if (file && file instanceof File && file.type === 'image/jpeg') {
      const fs = require('fs');
      const path = require('path');
      const dir = path.join(process.cwd(), 'media', 'image', 'grpp');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // Historique : renomme l'ancienne image si elle existe
      if (avatarPath) {
        const oldPath = path.join(process.cwd(), avatarPath);
        if (fs.existsSync(oldPath)) {
          let i = 1, newOldPath;
          do {
            newOldPath = oldPath.replace(/\.jpg$/, `_old_${i}.jpg`);
            i++;
          } while (fs.existsSync(newOldPath));
          fs.renameSync(oldPath, newOldPath);
        }
      }
      // Génère un nom unique
      let fileName, filePath;
      do {
        const uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString();
        fileName = `${uniqueId}.jpg`;
        filePath = path.join(dir, fileName);
      } while (fs.existsSync(filePath));
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      avatarPath = `media/image/grpp/${fileName}`;
    }

    // Mettre à jour le groupe
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description: description || null }),
        avatarPath,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    return NextResponse.json({ ...updatedGroup })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du groupe' },
      { status: 500 }
    )
  }
}
