

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Main from "@/components/Main";
import { Section } from "@/components/Section";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';


export default async function AccountPage() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Récupérer la date de première connexion depuis la base (champ firstLogin)
  let firstLogin: Date | null = null;
  if (session.user?.email) {
    const user = await prisma.user.findUnique({
      where: { mail: session.user.email },
      select: { firstLogin: true },
    });
    firstLogin = user?.firstLogin ?? null;
  }

  return (
    <Main title={dict["account.title"]}>
      <Section className="flex">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || dict["account.avatar.alt"]}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      </Section>
      <Section>
        <h2 className="text-xl font-semibold mb-2">{dict["account.data.title"]}</h2>
        <ul className="list-disc ml-6">
          <li><strong>{dict["account.data.email"]}:</strong> {session.user?.email}</li>
          <li><strong>{dict["account.data.name"]}:</strong> {session.user?.name}</li>
          {firstLogin && (
            <li><strong>{dict["account.data.firstlogin"]}:</strong> {firstLogin.toLocaleString(locale)}</li>
          )}
          {session.user?.isAdmin && <li><strong>{dict["account.data.admin"]}:</strong> {dict["account.data.admin.yes"]}</li>}
        </ul>
      </Section>
    </Main>
  );
}
