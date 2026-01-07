import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Info, Users, FolderOpen, Settings } from "lucide-react";
import { Section } from "@/components/Section";
import Main from "@/components/Main";

// Force la page à être dynamique (vérification à chaque requête)
export const dynamic = 'force-dynamic';

/**
 * Page Admin - Accessible uniquement si l'email de l'utilisateur correspond à ADMIN_GMAIL
 * 
 * SÉCURITÉ:
 * 1. Server Component: Le code s'exécute uniquement côté serveur
 * 2. getServerSession: Récupère la session de manière sécurisée depuis le serveur
 * 3. Vérification directe: On compare l'email directement avec ADMIN_GMAIL
 * 4. Redirection serveur: Les utilisateurs non-autorisés sont redirigés avant tout rendu
 */
export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Vérification 1: Utilisateur authentifié
  if (!session?.user) {
    redirect("/login");
  }

  // Vérification 2: L'utilisateur est admin (vérifié directement côté serveur)
  // On ne dépend PAS de session.user.isAdmin mais on vérifie directement
  const isAdmin = isAdminEmail(session.user.email);
  
  if (!isAdmin) {
    redirect("/login");
  }

  // Statistiques système
  const { prisma } = await import("@/lib/prisma");
  // Nombre total d'utilisateurs
  const userCount = await prisma.user.count();

  // Nombre de sessions actives (utilisateurs connectés dans les 30 dernières minutes)
  const THIRTY_MINUTES = 1000 * 60 * 30;
  const since = new Date(Date.now() - THIRTY_MINUTES);
  const activeSessions = await prisma.user.count({
    where: {
      lastLogin: { gte: since },
    },
  });

  // Uptime du serveur Node.js
  let uptime = "--";
  if (typeof process !== "undefined" && process.uptime) {
    const totalSeconds = Math.floor(process.uptime());
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    uptime = `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <Main title="Panel admin">
      <Section className="flex">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || "Admin"} 
              className="w-16 h-16 rounded-full ring-4 ring-primary"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-lg">Admin</span>
            </div>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      </Section>

      <div className="alert alert-info">
        <Info className="w-6 h-6 shrink-0" />
        <div>
          <h3 className="font-bold">Accès sécurisé</h3>
          <div className="text-xs">Cette page est protégée par une vérification côté serveur.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Section>
          <h2 className="card-title">
            <Users className="w-6 h-6" />
            Utilisateurs
          </h2>
          <p>Gérer les utilisateurs et leurs groupes</p>
          <div className="card-actions justify-end">
            <Link href="/admin/users" className="btn btn-primary btn-sm rounded-full">Gérer</Link>
          </div>
        </Section>
        <Section>
          <h2 className="card-title">
            <FolderOpen className="w-6 h-6" />
            Groupes
          </h2>
          <p>Créer et gérer les groupes</p>
          <div className="card-actions justify-end">
            <Link href="/admin/groups" className="btn btn-primary btn-sm rounded-full">Gérer</Link>
          </div>
        </Section>
        <Section>
          <h2 className="card-title">
            <Settings className="w-6 h-6" />
            Dev
          </h2>
          <p>Paramètres de développement</p>
          <div className="card-actions justify-end">
            <Link href="/admin/dev" className="btn btn-primary btn-sm rounded-full">Configurer</Link>
          </div>
        </Section>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Statistiques du système</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Utilisateurs</div>
              <div className="stat-value">{userCount}</div>
              <div className="stat-desc">Total enregistrés</div>
            </div>
            <div className="stat">
              <div className="stat-title">Connections dans les 30 dernières minutes</div>
              <div className="stat-value">{activeSessions}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Uptime</div>
              <div className="stat-value">{uptime}</div>
              <div className="stat-desc">Depuis le dernier redémarrage</div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
