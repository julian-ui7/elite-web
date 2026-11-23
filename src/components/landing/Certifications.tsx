import Image from "next/image";
import { Check } from "lucide-react";
import { certificationPoints, certifications } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Certifications() {
  // Se repite el set para que la cinta cubra pantallas anchas sin huecos.
  const strip = [...certifications, ...certifications];

  return (
    <section id="calidad" aria-labelledby="calidad-title" className="on-light bg-bone py-20 text-carbon-900 sm:py-28">
      <Container>
        <SectionHeading
          tone="light"
          eyebrow="Calidad"
          title={<span id="calidad-title">Calidad que se respalda</span>}
          lede="Herramientas fabricadas y evaluadas bajo estándares internacionales, para trabajo profesional y continuo."
        />
      </Container>

      <Marquee speed={40} className="reveal my-14 [--d:100ms]">
        {strip.map((c, i) => (
          <figure
            key={i}
            className="mx-3 flex w-[210px] shrink-0 flex-col items-center rounded-md bg-white p-4 shadow-lift ring-1 ring-carbon-100"
          >
            <Image
              src={c.src}
              alt={c.name}
              width={170}
              height={85}
              sizes="170px"
              className="h-[85px] w-[170px] object-contain mix-blend-multiply"
            />
            <figcaption className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">{c.name}</figcaption>
          </figure>
        ))}
      </Marquee>

      <Container>
        <ul className="grid gap-x-12 gap-y-9 md:grid-cols-2">
          {certificationPoints.map((p, i) => (
            <li
              key={p.title}
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              className="reveal flex gap-4"
            >
              <span className="skew-box mt-1 grid size-9 shrink-0 place-items-center bg-carbon-900 text-elite-500">
                <span className="unskew">
                  <Check className="size-5" strokeWidth={3} aria-hidden />
                </span>
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold uppercase leading-none">{p.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-carbon-600">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
