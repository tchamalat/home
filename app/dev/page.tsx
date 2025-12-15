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
          className="btn btn-secondary"
          href="https://pve.romantcham.fr"
        >
          Proxmox
        </a>
      </Section>
    </main>
  );
}
