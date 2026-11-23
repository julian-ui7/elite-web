import { quoteUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Banda amarilla de cierre: la acción principal del sitio (cotizar). */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-elite-500 text-carbon-900">
      <div aria-hidden className="hazard absolute inset-x-0 top-0 h-2" />
      <div
        aria-hidden
        className="absolute -right-24 top-0 hidden h-full w-[34rem] skew-x-[-10deg] bg-carbon-900/[0.06] md:block"
      />
      <Container className="relative flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <div className="reveal max-w-2xl">
          <h2 id="cta-title" className="display text-[clamp(2.4rem,5.5vw,4.25rem)] text-carbon-900">
            ¿Tienes una ferretería?
            <br />
            Cotiza tu pedido hoy.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-carbon-800">
            Cuéntanos qué necesita tu negocio y te ayudamos a armar un pedido inteligente.
          </p>
        </div>
        <div className="reveal flex flex-wrap gap-4 [--d:150ms]">
          <Button href={quoteUrl()} variant="dark" size="lg">
            <WhatsAppIcon className="size-5" />
            Cotizar por WhatsApp
          </Button>
          <Button href="/tienda" variant="outline-dark" size="lg">
            Armar pedido
          </Button>
        </div>
      </Container>
    </section>
  );
}
