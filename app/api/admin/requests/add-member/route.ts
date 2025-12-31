import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/requests/add-member - Get all add member requests from family
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const requests = await prisma.addMemberRequest.findMany({
    where: { status },
    include: {
      requestedBy: {
        select: { name: true, email: true, image: true, role: true },
      },
      targetUser: {
        select: { name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

// PATCH /api/admin/requests/add-member - Approve or reject add member request
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (session instanceof NextResponse) return session;

  const { requestId, status, role } = await req.json();

  if (!requestId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "requestId et status (APPROVED/REJECTED) requis" }, { status: 400 });
  }

  const request = await prisma.addMemberRequest.update({
    where: { id: requestId },
    data: { status },
  });

  // If approved, update user role or create user
  if (status === "APPROVED" && request.targetUserId) {
    await prisma.user.update({
      where: { id: request.targetUserId },
      data: { role: role || "FAMILY" },
    });
  }

  return NextResponse.json({ request });
}
