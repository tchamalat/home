import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        session.user.id = user.id;
        session.user.role = dbUser?.role || "GUEST";
      }
      return session;
    },
    async signIn({ user, account }) {
      // Auto-set admin role for configured email
      if (user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { role: "ADMIN" },
        });
      }
      
      // Log successful login
      if (user.id) {
        await prisma.connectionLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            ipAddress: null,
            userAgent: null,
          },
        });
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
  },
  events: {
    async signOut({ session }) {
      // Log logout
      if (session?.user?.id) {
        await prisma.connectionLog.create({
          data: {
            userId: session.user.id,
            action: "LOGOUT",
            ipAddress: null,
            userAgent: null,
          },
        });
      }
    },
  },
});

export { handler as GET, handler as POST };
