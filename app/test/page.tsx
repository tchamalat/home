import Main from "@/components/Main";
import { Section } from "@/components/Section";
import { CrackleSection } from "@/components/test/CrackleSection";
import { CrackleSection2 } from "@/components/test/CrackleSection2";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";
import { Button } from "@/components/Button";

export default async function Home() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <Main title="Test">
      <Button title="coucou" particleEffect/>
      <Section title="test 1" className="shadow-xl shadow-primary/10">
        <p>shadow-xl<br />
          shadow-primary/10</p>
      </Section>
      <Section title="test 2" className="bg-linear-to-r from-primary via-secondary to-accent text-white shadow-lg shadow-accent/40">
        <p>bg-linear-to-r<br />
          from-primary<br />
          via-secondary<br />
          to-accent<br /><br />
          text-white<br />
          shadow-lg<br />
          shadow-accent/40</p>
      </Section>
      <Section title="test 3 (home)" className="hover:-translate-y-2 transform transition-all duration-300 ease-in-out shadow-md shadow-secondary/20" link="/">
        <p>hover:-translate-y-2<br />
          transform<br />
          transition-all<br />
          duration-300<br />
          ease-in-out<br /><br />
          shadow-md<br />
          shadow-secondary/20</p>
      </Section>
      <Section title="test 4" className="bg-linear-to-br from-accent/30 to-transparent p-8 rounded-3xl shadow-md shadow-accent/20">
        <p>bg-gradient-to-b<br />
          from-accent/10<br />
          to-transparent<br />
          p-8<br />
          rounded-3xl<br />
          shadow-sm<br />
          shadow-accent/20</p>
      </Section>
      <Section title="test 5" className="hover:scale-105 transform transition-transform duration-200 ease-in-out bg-base-300 p-4 rounded-2xl shadow-inner shadow-base-300/30">
        <p>hover:scale-105<br />
          transform<br />
          transition-transform<br />
          duration-200<br />
          ease-in-out<br /><br />
          bg-base-200<br />
          p-4<br />
          rounded-2xl<br />
          shadow-inner<br />
          shadow-base-300/30</p>
          <Button title="click me" link="/" particleEffect={true}  />
      </Section>
      <CrackleSection 
        dict={filterDictByPrefix(dict, "crackle.") as any}
      />
      <CrackleSection2 
        dict={filterDictByPrefix(dict, "crackle2.") as any}
      />
      </Main>
  );
}