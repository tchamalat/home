import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Fonction utilitaire pour vérifier si un email est admin
// IMPORTANT: Cette vérification est faite UNIQUEMENT côté serveur
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminGmail = process.env.ADMIN_GMAIL;
  if (!adminGmail) return false;
  // Comparaison insensible à la casse pour plus de robustesse
  return email.toLowerCase() === adminGmail.toLowerCase();
}

// Fonction pour splitter le nom Google en prénom/nom
function splitName(fullName: string | null | undefined): { firstname: string; lastname: string } {
  if (!fullName) return { firstname: "", lastname: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0], lastname: "" };
  const firstname = parts[0];
  const lastname = parts.slice(1).join(" ");
  return { firstname, lastname };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Upsert de l'utilisateur en BDD à chaque connexion
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { mail: user.email },
        });

        // Télécharger l'image Google si disponible
        let ppBuffer: Buffer | null = null;
        if (user.image) {
          try {
            const imageRes = await fetch(user.image);
            if (imageRes.ok) {
              const arrayBuffer = await imageRes.arrayBuffer();
              ppBuffer = Buffer.from(arrayBuffer);
            }
          } catch (err) {
            console.error('Erreur téléchargement image Google:', err);
          }
        }

        if (existingUser) {
          // User existe → on update lastLogin et l'image si elle a changé
          await prisma.user.update({
            where: { mail: user.email },
            data: {
              lastLogin: new Date(),
              ...(ppBuffer && { pp: ppBuffer }),
            },
          });
        } else {
          // Nouveau user → on le crée avec le nom splitté
          const { firstname, lastname } = splitName(user.name);
          await prisma.user.create({
            data: {
              mail: user.email,
              firstname,
              lastname,
              pp: ppBuffer,
              firstLogin: new Date(),
              lastLogin: new Date(),
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.image = user.image ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.image = token.image as string;
        // SÉCURITÉ: isAdmin est calculé à chaque requête côté serveur
        // La vérification compare l'email de la session avec ADMIN_GMAIL
        // Cette valeur ne peut PAS être modifiée par le client
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
