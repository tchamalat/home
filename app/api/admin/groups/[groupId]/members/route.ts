import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// POST /api/admin/groups/[groupId]/members - Add member to group (Admin only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { groupId } = await params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  // Check if already member
  const existing = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "L'utilisateur est déjà membre" }, { status: 400 });
  }

  const member = await prisma.groupMember.create({
    data: {
      groupId,
      userId,
      addedById: session.user.id,
    },
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}

// DELETE /api/admin/groups/[groupId]/members - Remove member from group
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { groupId } = await params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  await prisma.groupMember.delete({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  return NextResponse.json({ success: true });
}

// GET /api/admin/groups/[groupId]/members - Get all members of a group
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { groupId } = await params;
  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json({ members });
}
