import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/users - Get all users
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  const where = role ? { role: role as any } : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          photos: true,
          groupMemberships: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

// PATCH /api/admin/users - Update user role
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { userId, role, adminEmail } = await req.json();

  if (!userId || !role) {
    return NextResponse.json({ error: "userId et role requis" }, { status: 400 });
  }

  // Empêcher de changer son propre rôle
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Impossible de modifier votre propre rôle" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json({ user });
}
