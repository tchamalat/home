import Main from "@/components/Main";
import { Section } from "@/components/Section";
import { CrackleSection } from "@/components/CrackleSection";
import { CrackleSection2 } from "@/components/CrackleSection2";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";

export default async function Home() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <Main title="Test">
      <CrackleSection 
        dict={filterDictByPrefix(dict, "crackle.") as any}
      />
      <CrackleSection2 
        dict={filterDictByPrefix(dict, "crackle2.") as any}
      />
    </Main>
  );
}