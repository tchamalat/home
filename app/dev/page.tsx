import { Section } from "@/components/Section";

export default function Home() {
  return (
    <main>
      <Section>
        <h1 className="text-3xl font-semibold text-foreground">
          Let's dev a little.
        </h1>
      </Section>
      <Section>
        <a
          className="flex h-12 font-semibold text-foreground_proxmox hover:text-foreground_proxmox_hover bg-background_proxmox hover:bg-background_proxmox_hover items-center justify-center rounded-full px-5 transition-colors md:w-[158px]"
          href="https://pve.romantcham.fr"
          //target="_blank"
          rel="noopener noreferrer"
        >
          Proxmox
        </a>
      </Section>
    </main>
  );
}
