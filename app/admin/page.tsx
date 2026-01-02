import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Info, Users, FileText, Settings } from "lucide-react";

// Force la page à être dynamique (vérification à chaque requête)
export const dynamic = 'force-dynamic';

// Fonction de vérification admin côté serveur (duplicata intentionnel pour sécurité)
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminGmail = process.env.ADMIN_GMAIL;
  if (!adminGmail) {
    console.warn("[ADMIN] ADMIN_GMAIL non défini dans les variables d'environnement");
    return false;
  }
  return email.toLowerCase() === adminGmail.toLowerCase();
}

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
    redirect("/");
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
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
                  <h1 className="text-3xl font-bold">Panel Admin</h1>
                  <span className="badge badge-primary badge-lg">Admin</span>
                </div>
                <p className="text-gray-500">{session.user?.email}</p>
              </div>
            </div>
            <Link href="/dashboard" className="btn btn-outline">
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <Info className="w-6 h-6 shrink-0" />
        <div>
          <h3 className="font-bold">Accès sécurisé</h3>
          <div className="text-xs">Cette page est protégée par une vérification côté serveur.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Users className="w-6 h-6" />
              Utilisateurs
            </h2>
            <p>Gérer les utilisateurs de l&apos;application</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Gérer</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <FileText className="w-6 h-6" />
              Logs
            </h2>
            <p>Consulter les logs de l&apos;application</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Voir les logs</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Settings className="w-6 h-6" />
              Configuration
            </h2>
            <p>Paramètres de l&apos;application</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Configurer</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Statistiques du système</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">Utilisateurs</div>
              <div className="stat-value">--</div>
              <div className="stat-desc">Total enregistrés</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Sessions actives</div>
              <div className="stat-value">--</div>
              <div className="stat-desc">En ce moment</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Uptime</div>
              <div className="stat-value">--</div>
              <div className="stat-desc">Depuis le dernier redémarrage</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
