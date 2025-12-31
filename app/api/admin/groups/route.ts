import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/groups - Get all groups
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const groups = await prisma.group.findMany({
    include: {
      _count: {
        select: {
          members: true,
          photos: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ groups });
}

// POST /api/admin/groups - Create a new group (Admin only)
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Le nom du groupe est requis" }, { status: 400 });
  }

  const group = await prisma.group.create({
    data: { name, description },
  });

  return NextResponse.json({ group }, { status: 201 });
}

// DELETE /api/admin/groups - Delete a group (Admin only)
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { groupId } = await req.json();

  if (!groupId) {
    return NextResponse.json({ error: "groupId requis" }, { status: 400 });
  }

  await prisma.group.delete({
    where: { id: groupId },
  });

  return NextResponse.json({ success: true });
}
