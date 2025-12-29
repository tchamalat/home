import type { Metadata } from "next";
import Main from "@/components/Main"
import { Section } from "@/components/Section";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Home server project",
  description: "How does work my home server.",
};

export default function HomeServer() {
  return (
    <Main title="Home server">
      <Section title="Hardware choices">
        <p className="text-foreground"> 
          My server is a nic in my room connected to my network.
        </p>
      </Section>
    </Main>
  );
}
