import { Section } from "@/components/Section";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full"> 
      <Section title="Here's some of my personal projects">
        <p className="text-foreground"> 
          I really like doing stuff.
        </p>
      </Section>
      <Section>
        <h2 className="flex flex-wrap text-2xl font-bold mb-4">
          This
        <Image
            className="mx-2 pt-1.5 in-data-[theme=night]:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          website.
        </h2>
      </Section>
    </main>
  );
}
