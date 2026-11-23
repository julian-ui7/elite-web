import { Categories } from "@/components/landing/Categories";
import { Certifications } from "@/components/landing/Certifications";
import { Contact } from "@/components/landing/Contact";
import { CtaBand } from "@/components/landing/CtaBand";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { Hero } from "@/components/landing/Hero";
import { Process } from "@/components/landing/Process";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { WhyElite } from "@/components/landing/WhyElite";
import { Slant } from "@/components/ui/Slant";

/** Landing one-page. Casi todo son Server Components: el JS del cliente es mínimo. */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <Slant from="carbon" to="bone" />
      <FeaturedProducts />
      <Slant from="bone" to="carbon" flip />
      <WhyElite />
      <Slant from="carbon" to="bone" />
      <Certifications />
      <Slant from="bone" to="carbon" flip />
      <Process />
      <CtaBand />
      <Contact />
    </>
  );
}
