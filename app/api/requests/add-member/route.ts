import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFamilyOrAdmin } from "@/lib/auth";

// POST /api/requests/add-member - Family members request to add someone
export async function POST(req: NextRequest) {
  const session = await requireFamilyOrAdmin(req);
  if (session instanceof NextResponse) return session;

  // Only FAMILY can make this request (not ADMIN, admin adds directly)
  if (session.user.role === "ADMIN") {
    return NextResponse.json({ error: "Les admins ajoutent directement les membres" }, { status: 400 });
  }

  const { targetEmail, message } = await req.json();

  if (!targetEmail) {
    return NextResponse.json({ error: "targetEmail requis" }, { status: 400 });
  }

  // Check if user exists
  const targetUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  const request = await prisma.addMemberRequest.create({
    data: {
      requestedById: session.user.id,
      targetUserId: targetUser?.id || "",
      targetEmail,
      message,
    },
  });

  return NextResponse.json({ request }, { status: 201 });
}

// GET /api/requests/add-member - Get my add member requests
export async function GET(req: NextRequest) {
  const session = await requireFamilyOrAdmin(req);
  if (session instanceof NextResponse) return session;

  const requests = await prisma.addMemberRequest.findMany({
    where: { requestedById: session.user.id },
    include: {
      targetUser: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
