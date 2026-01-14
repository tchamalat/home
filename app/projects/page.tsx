import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import Image from "next/image";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict["meta.projects.title"],
    description: dict["meta.projects.description"],
  };
}

export default async function Projects() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <Main title={dict["projects.title"]} isGsaped>
      <Section title={dict["projects.section1.title"]}>
        <p className="text-foreground"> 
          {dict["projects.section1.text"]}
        </p>
      </Section>
      <Section title={dict["projects.section2.title"]} link="projects/home-server">
        <p>
          {dict["projects.section2.text"]}
        </p>
      </Section>
      <Section>
        <h2 className="flex flex-wrap text-2xl font-bold mb-4">
          {dict["projects.section3.title"]}
        <Image
            className="mx-2 in-data-[theme=night]:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={90}
            height={18}
            priority
          />
          {dict["projects.section3.title2"]}
        </h2>
        <p>
          {dict["projects.section3.text"]}
        </p>
      </Section>
    </Main>
  );
}
