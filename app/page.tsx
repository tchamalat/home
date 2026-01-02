import Main from "@/components/Main";
import { Section } from "@/components/Section";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Home() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);
  const session = await getServerSession(authOptions);

  return (
    <Main title={dict["home.title"]}>
      <Section title={dict["home.section1.title"]}>
        <p className="text-foreground"> 
          {dict["home.section1.text"]}
        </p>
      </Section>
      <Section title={dict["home.section2.title"]}>
        <p>
          {dict["home.section2.text"]}
        </p>
      </Section>
      {session && (
        <Section title={dict["home.sectionDashboard.title"]}>
          <p>{dict["home.sectionDashboard.text"]}</p>
          <Link className="btn btn-primary mt-4 rounded-full" href="/dashboard">
            {dict["home.sectionDashboard.cta"]}
          </Link>
        </Section>
      )}
    </Main>
  );
}
