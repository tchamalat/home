import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import Image from "next/image";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict["meta.homeserver.title"],
    description: dict["meta.homeserver.description"],
  };
}

export default async function HomeServer() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <Main title={dict["homeserver.title"]}>
      <Section title={dict["homeserver.section1.title"]}>
        <p className="text-foreground"> 
          {dict["homeserver.section1.text"]}
        </p>
      </Section>
    </Main>
  );
}
