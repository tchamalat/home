import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Roman's projects",
  description: "My personal projects.",
};

export default function Projects() {
  return (
    <Main title="Projects">
      <Section title="Here's some of my personal projects">
        <p className="text-foreground"> 
          I really like doing stuff.
        </p>
      </Section>
      <Section title="My home server" link="projects/home-server">
        <p>
          Economic, performant and safe, My home server hosts some pf my projects.
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
        <p>
          This website is my first ever framework based website creation.
        </p>
      </Section>
    </Main>
  );
}
