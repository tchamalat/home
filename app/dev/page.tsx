import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import DockerLogs from "@/components/DockerLogs";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale, filterDictByPrefix } from "@/lib/i18n";

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