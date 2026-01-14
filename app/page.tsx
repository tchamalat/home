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
    <Main title={dict["home.title"]} isGsaped>
      <Section title={dict["home.sectionWelcome.title"]}>
        <p>{dict["home.sectionWelcome.text"]}</p>
      </Section>
      {session && (
        <Section title={dict["home.sectionApps.title"]}>
          <p>{dict["home.sectionApps.text"]}</p>
          <Link className="btn btn-primary mt-4 rounded-full" href="/apps">
            {dict["home.sectionApps.cta"]}
          </Link>
        </Section>
      )}
      <Section title={dict["home.sectionActiveDev.title"]}>
        <p>{dict["home.sectionActiveDev.text"]}</p>
      </Section>
      <Section title={dict["home.sectionPersonalProjects.title"]} link="projects">
        <p>{dict["home.sectionPersonalProjects.text"]}</p>
      </Section>
      <Section title={dict["home.design_test.title"]} link="test">
        <p>
          {dict["home.design_test.text"]}
        </p>
      </Section>
    </Main>
  );
}
