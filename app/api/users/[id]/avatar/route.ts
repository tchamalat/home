import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

// POST /api/users/[id]/avatar - Upload d'une nouvelle photo de profil
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await context.params
  // Récupère l'utilisateur courant par email
  const currentUser = await prisma.user.findUnique({ where: { mail: session.user.email } })
  if (!currentUser) return NextResponse.json({ error: 'Utilisateur courant introuvable' }, { status: 401 })
  if (currentUser.id !== id && !session.user.isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // Parse le form-data
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  // Vérifie le type MIME (jpg Google)
  if (file.type !== 'image/jpeg') {
    return NextResponse.json({ error: 'Format non supporté (jpg requis)' }, { status: 400 })
  }

  // Génère un nom unique à 8 chiffres
  const uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString()
  const ext = '.jpg'
  const fileName = `${uniqueId}${ext}`
  const dir = path.join(process.cwd(), 'media', 'image', 'pp')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, fileName)

  // Renomme l'ancienne pp si elle existe
  const user = await prisma.user.findUnique({ where: { id } })
  if (user?.avatarPath) {
    const oldPath = path.join(process.cwd(), user.avatarPath)
    if (fs.existsSync(oldPath)) {
      let i = 1
      let newOldPath
      do {
        newOldPath = oldPath.replace(/\.jpg$/, `_old_${i}.jpg`)
        i++
      } while (fs.existsSync(newOldPath))
      fs.renameSync(oldPath, newOldPath)
    }
  }

  // Sauvegarde la nouvelle image
  const arrayBuffer = await file.arrayBuffer()
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer))

  // Met à jour l'utilisateur
  await prisma.user.update({
    where: { id },
    data: { avatarPath: `media/image/pp/${fileName}` },
  })

  return NextResponse.json({ success: true })
}

// GET /api/users/[id]/avatar - Sert la photo de profil si autorisé
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await context.params
  if (!id) return NextResponse.json({ error: 'Paramètre id manquant' }, { status: 400 })
  // Récupère l'utilisateur courant par email
  const currentUser = await prisma.user.findUnique({ where: { mail: session.user.email }, include: { groups: true } })
  const target = await prisma.user.findUnique({ where: { id }, include: { groups: true } })
  if (!target?.avatarPath) return NextResponse.json({ error: 'Aucune image' }, { status: 404 })
  if (!currentUser) return NextResponse.json({ error: 'Utilisateur courant introuvable' }, { status: 401 })
  const targetGroups = new Set(target.groups.map(g => g.id))
  const currentGroups = new Set(currentUser.groups.map(g => g.id))
  const hasCommon = [...targetGroups].some(gid => currentGroups.has(gid))
  if (!hasCommon && currentUser.id !== id && !session.user.isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }
  const filePath = path.join(process.cwd(), target.avatarPath)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 })
  const imageBuffer = fs.readFileSync(filePath)
  return new Response(imageBuffer, {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400' },
  })
}
