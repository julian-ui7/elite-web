import { process } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative bg-carbon-900 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title={
            <span id="proceso-title">
              De tu necesidad a tu <span className="text-elite-500">pedido</span>
            </span>
          }
          lede="Sin vueltas: nos dices qué necesita tu negocio y te acompañamos hasta la cotización."
        />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* línea que une los pasos */}
          <div
            aria-hidden
            className="absolute left-0 right-[33.33%] top-9 hidden border-t-2 border-dashed border-white/15 md:block"
          />
          {process.map((s, i) => (
            <li
              key={s.title}
              style={{ "--d": `${i * 140}ms` } as React.CSSProperties}
              className="reveal relative"
            >
              <span className="relative z-10 inline-block bg-carbon-900 pr-4">
                <span className="display block text-[5.5rem] leading-none text-transparent [-webkit-text-stroke:2px_var(--color-elite-500)]">
                  0{i + 1}
                </span>
              </span>
              <h3 className="mt-4 font-display text-[1.7rem] font-bold uppercase leading-tight text-white">{s.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-carbon-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
