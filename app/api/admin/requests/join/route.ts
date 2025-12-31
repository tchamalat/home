import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/requests/join - Get all join requests
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const requests = await prisma.joinRequest.findMany({
    where: { status },
    include: {
      user: {
        select: { name: true, email: true, image: true, role: true },
      },
      group: {
        select: { name: true, description: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

// PATCH /api/admin/requests/join - Approve or reject join request
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { requestId, status } = await req.json();

  if (!requestId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "requestId et status (APPROVED/REJECTED) requis" }, { status: 400 });
  }

  const request = await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status },
  });

  // If approved, add member to group
  if (status === "APPROVED") {
    await prisma.groupMember.create({
      data: {
        groupId: request.groupId,
        userId: request.userId,
        addedById: session.user.id,
      },
    });
  }

  return NextResponse.json({ request });
}
