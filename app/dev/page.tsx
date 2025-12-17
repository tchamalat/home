import { Section } from "@/components/Section";

export default function Home() {
  return (
    <main>
      <Section title="Let's dev a little.">
        <p className="text-foreground"> 
          Here are some links to my development projects.
        </p>
      </Section>
      <Section title="Proxmox - my virtualization platform">
        <a
          className="btn btn-primary"
          href="https://pve.romantcham.fr"
        >
          Proxmox
        </a>
      </Section>
    </main>
  );
}
