import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "FAMILY" | "GUEST";
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}
