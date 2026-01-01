import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  
  return session;
}

export async function requireAdmin(req: NextRequest) {
  const session = await requireAuth(req);

  if (session instanceof NextResponse) return session;

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = adminEmail && session.user?.email === adminEmail;

  if (!isAdmin) {
    return NextResponse.json({ error: "Accès refusé - Admin uniquement" }, { status: 403 });
  }

  return session;
}

export async function requireFamilyOrAdmin(req: NextRequest) {
  const session = await requireAuth(req);

  if (session instanceof NextResponse) return session;

  // Sans gestion de rôles côté DB, on considère tous les utilisateurs authentifiés comme autorisés.
  return session;
}
