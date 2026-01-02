import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Fonction utilitaire pour vérifier si un email est admin
// IMPORTANT: Cette vérification est faite UNIQUEMENT côté serveur
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminGmail = process.env.ADMIN_GMAIL;
  if (!adminGmail) return false;
  // Comparaison insensible à la casse pour plus de robustesse
  return email.toLowerCase() === adminGmail.toLowerCase();
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
    async jwt({ token, user }) {
      if (user) {
        token.image = user.image ?? undefined;
        // Le flag isAdmin est calculé côté serveur à chaque génération du JWT
        // Il n'est PAS stocké dans le token pour éviter toute manipulation
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
