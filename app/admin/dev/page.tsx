import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import DockerLogs from "@/components/DockerLogs";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";
import { redirect } from "next/dist/client/components/navigation";
import { authOptions, isAdminEmail } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict["meta.dev.title"],
    description: dict["meta.dev.description"],
  };
}

export default async function Dev() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);
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

  return (
    <Main title={dict["dev.title"]}>
      <Section title={dict["dev.section1.title"]}>
        <p className="text-foreground"> 
          {dict["dev.section1.text"]}
        </p>
      </Section>
      <Section title={dict["dev.section2.title"]}>
        <a
          className="btn btn-primary w-fit"
          href="https://pve.romantcham.fr"
        >
          Proxmox
        </a>
        <p>
          {dict["dev.section2.text"]}
        </p>
      </Section>
      <DockerLogs 
        dict={{
          "dockerlogs.title": dict["dockerlogs.title"],
          "dockerlogs.connected": dict["dockerlogs.connected"],
          "dockerlogs.disconnected": dict["dockerlogs.disconnected"],
          "dockerlogs.clear": dict["dockerlogs.clear"],
          "dockerlogs.waiting": dict["dockerlogs.waiting"]
        }}
      />
    </Main>
  );
}