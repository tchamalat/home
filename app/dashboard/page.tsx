"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    );
  }

  if (!session) {
    return null;
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
                  alt={session.user.name || "User"} 
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">Bienvenue, {session.user?.name}</h1>
                <p className="text-gray-500">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Section 1</h2>
            <p>Contenu de votre dashboard</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Voir plus</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Section 2</h2>
            <p>Continuez à construire... ouaw !</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Voir plus</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Section 3</h2>
            <p>Votre espace personnel</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Voir plus</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
