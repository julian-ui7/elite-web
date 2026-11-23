import type { Metadata } from "next";
import { OrderPage } from "@/components/shop/OrderPage";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mi pedido",
  description: "Revisa tu pedido y envíalo por WhatsApp para recibir tu cotización.",
};

export default function PedidoPage() {
  return (
    <>
      <section className="no-print relative border-b border-white/10 bg-carbon-900">
        <Container className="py-8">
          <p className="eyebrow text-elite-500">
            <span aria-hidden className="mr-2">{"///"}</span>
            Cotización
          </p>
        </Container>
      </section>
      <OrderPage />
    </>
  );
}
