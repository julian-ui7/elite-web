import { Clock, Headset, Package } from "lucide-react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { quoteUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { HeroVisual } from "./HeroVisual";

/** Los 4 mensajes de los slides del sitio actual, ahora como frase rotatoria. */
const MESSAGES = [
  "¡Tu proyecto empieza aquí!",
  "Especializado para cada espacio",
  "Renueva tus espacios",
  "Viaja seguro",
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-carbon-900">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_78%_32%,rgb(248_220_21/0.16),transparent_70%)]"
      />

      <Container className="grid min-h-[calc(100svh-var(--header-h)-5.5rem)] items-center gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-10">
        <div>
          <p className="eyebrow hero-rise text-elite-500">
            <span aria-hidden className="mr-2">{"///"}</span>
            Distribuidor ferretero · Ecuador
          </p>

          <h1
            id="hero-title"
            className="display hero-rise-solid mt-5 text-[clamp(3.4rem,9vw,7.25rem)] text-white"
          >
            El <span className="text-elite-500">poder</span>{" "}
            <br />
            en tus manos
          </h1>

          {/* Frase rotatoria decorativa; el texto accesible va en el párrafo oculto. */}
          <div
            aria-hidden
            className="display rotator hero-rise mt-5 text-[clamp(1.5rem,3.6vw,2.6rem)] text-carbon-200 [--d:200ms]"
          >
            <div className="rotator-list">
              {[...MESSAGES, MESSAGES[0]].map((m, i) => (
                <span key={i}>
                  <span className="mr-3 text-elite-500">›</span>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <p className="sr-only">{MESSAGES.join(". ")}.</p>

          <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-carbon-300 [--d:320ms]">
            Más de {site.yearsExperience} años equipando ferreterías en Ecuador con herramientas de calidad y
            asesoría técnica en cada cotización.
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-4 [--d:440ms]">
            <Button href={quoteUrl()} size="lg">
              Solicitar cotización
            </Button>
            <Button href="/tienda" variant="outline" size="lg">
              Ver catálogo
            </Button>
          </div>

          <ul className="hero-rise mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-carbon-300 [--d:560ms]">
            <li className="flex items-center gap-2">
              <Package className="size-4 text-elite-500" aria-hidden />
              {products.length} productos · {categories.length} categorías
            </li>
            <li className="flex items-center gap-2">
              <Headset className="size-4 text-elite-500" aria-hidden />
              Asesoría técnica en cada cotización
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-elite-500" aria-hidden />
              {site.hours.label} · {site.hours.short}
            </li>
          </ul>
        </div>

        <HeroVisual productCount={products.length} />
      </Container>

      {/* Cinta de categorías */}
      <div className="relative border-y border-white/10 bg-carbon-950/60">
        <div className="hazard h-1.5" aria-hidden />
        <Marquee speed={55} className="py-4">
          {[...categories, ...categories].map((c, i) => (
            <span key={i} className="flex items-center">
              <span className="display px-6 text-3xl text-transparent [-webkit-text-stroke:1px_var(--color-carbon-400)] sm:text-4xl">
                {c.name}
              </span>
              <span aria-hidden className="size-2.5 rotate-45 bg-elite-500" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
