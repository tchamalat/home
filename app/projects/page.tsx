import { Section } from "@/components/Section";
import Image from "next/image";

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
        <h1 className="text-3xl flex font-semibold text-foreground">
          This
          <Image
            className="mx-2 pt-1 in-data-[theme=night]:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          website.
        </h1>
      </Section>
    </main>
  );
}
