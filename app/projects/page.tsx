import Image from "next/image";
import { Section } from "@/components/Section";

export default function Home() {
  return (
    <main> 
      <Section>
      <h1 className="text-3xl font-semibold text-foreground">
        Here's some of my personal projects
      </h1>
      <p className="text-foreground"> 
        I really like doing stuff.
      </p>
    </Section>
    <Section>
      <h1 className="text-3xl font-semibold text-foreground">
        This website.
      </h1>
    </Section>
    </main>
  );
}
