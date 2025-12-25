import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Roman's dev center",
  description: "My personal projects.",
};

export default function Home() {
  return (
    <Main title="Dev">
      <Section title="Let's dev a little.">
        <p className="text-foreground"> 
          Here is my page for usefull dev links.
        </p>
      </Section>
      <Section title="Proxmox, my virtualization platform">
        <a
          className="btn btn-primary w-fit"
          href="https://pve.romantcham.fr"
        >
          Proxmox
        </a>
        <p>
          Proxmox is the base of my home server project containing this website.
        </p>
      </Section>
    </Main>
  );
}
