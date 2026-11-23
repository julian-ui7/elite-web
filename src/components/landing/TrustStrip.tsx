import { valueProps } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ValueIcon } from "@/components/ui/Icons";

/** Franja amarilla con los 3 bloques de valor del sitio actual. */
export function TrustStrip() {
  return (
    <section aria-label="Por qué Elite" className="relative bg-elite-500 text-carbon-900">
      <Container className="grid gap-10 py-14 md:grid-cols-3 md:gap-0 md:py-16">
        {valueProps.map((v, i) => (
          <div
            key={v.title}
            style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
            className="reveal relative md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-carbon-900/20"
          >
            <span className="skew-box grid size-14 place-items-center bg-carbon-900 text-elite-500 shadow-lift">
              <span className="unskew">
                <ValueIcon name={v.icon} className="size-7" strokeWidth={1.75} />
              </span>
            </span>
            <h2 className="display mt-5 text-[1.9rem] leading-none text-carbon-900">{v.title}</h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-carbon-800">{v.text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
