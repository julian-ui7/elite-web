import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FEATURED_SLUGS, pickProducts } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCarousel } from "./ProductCarousel";

export function FeaturedProducts() {
  const featured = pickProducts(FEATURED_SLUGS);

  return (
    <section id="destacados" aria-labelledby="destacados-title" className="on-light bg-bone py-20 text-carbon-900 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            tone="light"
            eyebrow="Destacados"
            title={<span id="destacados-title">Herramientas que no fallan</span>}
            lede="Una selección de nuestro catálogo. Agrégalas a tu pedido y te enviamos la cotización por WhatsApp."
          />
          <Link
            href="/tienda"
            className="reveal group inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-carbon-900 underline decoration-elite-500 decoration-4 underline-offset-8 hover:decoration-carbon-900"
          >
            Ver todos
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <div className="reveal mt-10 [--d:120ms]">
          <ProductCarousel products={featured} />
        </div>
      </Container>
    </section>
  );
}
