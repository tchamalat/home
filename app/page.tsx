import Main from "@/components/Main";
import { Title } from "@/components/Title";
import { CrackleSection } from "@/components/CrackleSection";
import { CrackleSection2 } from "@/components/CrackleSection2";

export default function Home() {
  return (
    <Main>
      <Title>
        Home
      </Title>
      <CrackleSection />
      <CrackleSection2 />
    </Main>
  );
}
