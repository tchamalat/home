import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminGmail = process.env.ADMIN_GMAIL;
  if (!adminGmail) return false;
  return email.toLowerCase() === adminGmail.toLowerCase();
}

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
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { mail: user.email },
        });

        let avatarPath: string | null = null;
        if (user.image) {
          // Si l'utilisateur a déjà un avatarPath et que le fichier existe, on le réutilise
          if (existingUser?.avatarPath) {
            const fs = require('fs');
            const path = require('path');
            const oldPath = path.join(process.cwd(), existingUser.avatarPath);
            if (fs.existsSync(oldPath)) {
              avatarPath = existingUser.avatarPath;
            }
          }
          // Sinon, on télécharge et stocke la nouvelle image
          if (!avatarPath) {
            const imageRes = await fetch(user.image);
            if (imageRes.ok) {
              const arrayBuffer = await imageRes.arrayBuffer();
              const fs = require('fs');
              const path = require('path');
              const dir = path.join(process.cwd(), 'media', 'image', 'pp');
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              let fileName, filePath;
              do {
                const uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString();
                fileName = `${uniqueId}.jpg`;
                filePath = path.join(dir, fileName);
              } while (fs.existsSync(filePath));
              fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
              avatarPath = `media/image/pp/${fileName}`;
            }
          }
        }

        if (existingUser) {
          await prisma.user.update({
            where: { mail: user.email },
            data: {
              lastLogin: new Date(),
              ...(avatarPath && { avatarPath }),
            },
          });
        } else {
          const { firstname, lastname } = splitName(user.name);
          await prisma.user.create({
            data: {
              mail: user.email,
              firstname,
              lastname,
              avatarPath,
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
