import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { about, certifications, site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MissionTabs } from "./MissionTabs";

export function WhyElite() {
  const stats = [
    { value: site.yearsExperience, prefix: "+", label: "años de experiencia" },
    { value: products.length, label: "productos en catálogo" },
    { value: categories.length, label: "categorías" },
    { value: certifications.length, label: "certificaciones y marcas de calidad" },
  ];

  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative overflow-hidden bg-carbon-900 py-20 sm:py-28">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-0 opacity-60" />
      <Container className="relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Nosotros"
            title={
              <span id="nosotros-title">
                {site.tagline.replace("Nº1", "")}
                <span className="text-elite-500">Nº1</span>
              </span>
            }
            lede={`Más de ${site.yearsExperience} años de calidad y servicio. El respaldo que tu negocio necesita. Variedad, experiencia y confianza en cada pedido.`}
          />
          <p className="reveal mt-6 max-w-xl leading-relaxed text-carbon-300 [--d:120ms]">{about.history}</p>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{ "--d": `${i * 100}ms` } as React.CSSProperties}
                className="reveal border-l-4 border-elite-500 pl-5"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    to={s.value}
                    prefix={s.prefix}
                    className="display block text-6xl text-white sm:text-7xl"
                  />
                  <span className="mt-1 block text-sm uppercase tracking-wider text-carbon-300">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal [--d:200ms] lg:sticky lg:top-28">
          <MissionTabs
            tabs={[
              { id: "mision", label: "Misión", text: about.mission },
              { id: "vision", label: "Visión", text: about.vision },
              { id: "objetivo", label: "Objetivo", text: about.objective },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
