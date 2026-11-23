import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Catálogo y pedido",
  description: `Catálogo de ${products.length} herramientas y artículos de ferretería. Arma tu pedido y cotízalo por WhatsApp.`,
};

export default function TiendaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-carbon-900">
        <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden className="hazard absolute inset-x-0 bottom-0 h-1.5" />
        <Container className="py-12 sm:py-16">
          <nav aria-label="Ruta" className="text-sm text-carbon-400">
            <Link href="/" className="hover:text-elite-500">
              Inicio
            </Link>
            <span aria-hidden className="mx-2">{"/"}</span>
            <span className="text-carbon-200">Tienda</span>
          </nav>
          <h1 className="display mt-4 text-[clamp(3rem,8vw,5.5rem)] text-white">
            Catálogo <span className="text-elite-500">Elite</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-carbon-300">
            {products.length} productos para ferreterías y profesionales. Arma tu pedido y envíalo por WhatsApp para recibir tu
            cotización: sin pagos en línea ni registro.
          </p>
          <p className="mt-3 text-sm text-carbon-400">Atención {site.hours.label.toLowerCase()} · {site.hours.short}</p>
        </Container>
      </section>

      {/* useSearchParams exige Suspense en páginas estáticas */}
      <Suspense fallback={<div className="min-h-[60vh] bg-bone" aria-busy="true" />}>
        <ShopClient />
      </Suspense>
    </>
  );
}
