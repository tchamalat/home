import { Section } from "@/components/Section";
import { CrackleSection } from "@/components/CrackleSection";
import { CrackleSection2 } from "@/components/CrackleSection2";

export default function Home() {
  return (
    <main>
      <CrackleSection />
      <CrackleSection2 />
      <Section title="Rien de plus pour l'instant.">
        <p>
          Cette page évoluera bientôt, mais en attendant tu peux t'amuser à
          générer des craquelures interactives juste au-dessus.
        </p>
      </Section>
    </main>
  );
}
