import Main from "@/components/Main";
import { Section } from "@/components/Section";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";

export default async function Home() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

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
    </Main>
  );
}
