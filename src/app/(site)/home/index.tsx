import { Hero } from "./_molecules/hero";
import { Stats } from "./_molecules/stats";
import { Services } from "./_molecules/services";
import { HowItWorks } from "./_molecules/how-it-works";
import { CtaBanner } from "./_molecules/cta-banner";
import { Faqs } from "./_molecules/faqs";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <CtaBanner />
      <Faqs />
    </>
  );
}
