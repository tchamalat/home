import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// POST /api/requests/join - Request to join a group (guests and family)
export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;

  const { groupId, message } = await req.json();

  if (!groupId) {
    return NextResponse.json({ error: "groupId requis" }, { status: 400 });
  }

  // Check if already member
  const existing = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: session.user.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Vous êtes déjà membre de ce groupe" }, { status: 400 });
  }

  // Check if already requested
  const existingRequest = await prisma.joinRequest.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: session.user.id,
      },
    },
  });

  if (existingRequest) {
    return NextResponse.json({ error: "Demande déjà envoyée" }, { status: 400 });
  }

  const request = await prisma.joinRequest.create({
    data: {
      groupId,
      userId: session.user.id,
      message,
    },
  });

  return NextResponse.json({ request }, { status: 201 });
}

// GET /api/requests/join - Get my join requests
export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (session instanceof NextResponse) return session;

  const requests = await prisma.joinRequest.findMany({
    where: { userId: session.user.id },
    include: {
      group: {
        select: { name: true, description: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
