"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, ClipboardList, Copy, Printer, Trash2 } from "lucide-react";
import {
  orderCount,
  orderQuoteCount,
  orderSubtotal,
  useOrderStore,
} from "@/core/stores/orderStore";
import { site } from "@/data/site";
import { formatMoney, plural } from "@/lib/format";
import { buildOrderMessage, buildOrderUrl, type Customer } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { QuantityStepper } from "./QuantityStepper";

const input =
  "h-11 w-full rounded-sm border-2 border-carbon-200 bg-white px-3 text-base outline-none transition-colors placeholder:text-carbon-400 focus:border-carbon-900";

/** Página del pedido: revisar, completar datos y enviar por WhatsApp / copiar / imprimir. */
export function OrderPage() {
  const items = useOrderStore((s) => s.items);
  const hydrated = useOrderStore((s) => s.hydrated);
  const setQty = useOrderStore((s) => s.setQty);
  const remove = useOrderStore((s) => s.remove);
  const clear = useOrderStore((s) => s.clear);

  const [customer, setCustomer] = useState<Customer>({});
  const [copied, setCopied] = useState(false);

  const count = orderCount(items);
  const quotes = orderQuoteCount(items);
  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderMessage(items, customer));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copia tu pedido (Ctrl + C):", buildOrderMessage(items, customer));
    }
  };

  // Hasta leer localStorage no se sabe si hay pedido: evita parpadear el estado vacío.
  if (!hydrated) {
    return <div className="min-h-[50vh] bg-bone" aria-busy="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="on-light bg-bone text-carbon-900">
        <Container className="grid min-h-[50vh] place-items-center py-20 text-center">
          <div>
            <ClipboardList className="mx-auto size-16 text-carbon-400" strokeWidth={1.4} aria-hidden />
            <h1 className="display mt-5 text-5xl text-carbon-900">Tu pedido está vacío</h1>
            <p className="mx-auto mt-3 max-w-md text-carbon-600">
              Agrega productos desde el catálogo y aquí podrás revisarlos, ajustar cantidades y enviarlos por WhatsApp.
            </p>
            <Button href="/tienda" variant="dark" size="lg" className="mt-8">
              Explorar catálogo
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const { url, truncated } = buildOrderUrl(items, customer);

  return (
    <div className="on-light bg-bone text-carbon-900">
      <Container className="py-10 sm:py-14">
        {/* Solo al imprimir */}
        <div className="print-only mb-8 border-b border-black pb-4">
          <p className="text-2xl font-bold">{site.name} — Pedido / cotización</p>
          <p className="mt-1 text-sm">
            {new Date().toLocaleDateString("es-EC", { dateStyle: "long" })} · {site.phone.mobile} · {site.email}
          </p>
          {Object.values(customer).some(Boolean) && (
            <p className="mt-2 text-sm">
              {[customer.name, customer.company, customer.phone, customer.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/tienda" className="inline-flex items-center gap-2 font-semibold hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> Seguir agregando productos
          </Link>
          <button type="button" onClick={clear} className="inline-flex items-center gap-2 text-sm text-carbon-600 underline underline-offset-4 hover:text-danger">
            <Trash2 className="size-4" aria-hidden /> Vaciar pedido
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div>
            <h1 className="display text-5xl text-carbon-900 print:text-3xl">Mi pedido</h1>
            <p className="mt-2 text-carbon-600">
              {plural(count, "unidad", "unidades")} en {plural(items.length, "producto", "productos")}
            </p>

            <ul className="mt-6 divide-y divide-carbon-200 rounded-md bg-white shadow-lift">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-carbon-100 sm:size-24">
                    <Image src={i.image} alt="" fill sizes="96px" className="object-contain p-1.5 mix-blend-multiply" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{i.name}</p>
                    {i.variantLabel && <p className="text-sm text-carbon-500">{i.variantLabel}</p>}
                    <p className="mt-1 text-sm text-carbon-600">
                      {i.unitPrice === null ? <span className="font-semibold">A cotizar</span> : `${formatMoney(i.unitPrice)} c/u`}
                    </p>
                    <div className="no-print mt-3 flex items-center gap-3">
                      <QuantityStepper tone="light" size="sm" label={i.name} value={i.qty} onChange={(q) => setQty(i.key, q)} />
                      <button
                        type="button"
                        onClick={() => remove(i.key)}
                        aria-label={`Quitar ${i.name}`}
                        className="grid size-9 place-items-center rounded-sm text-carbon-500 transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    <p className="print-only mt-1 text-sm">Cantidad: {i.qty}</p>
                  </div>
                  <p className="shrink-0 self-start text-right font-display text-2xl font-bold">
                    {i.unitPrice === null ? <span className="text-base uppercase text-carbon-500">Cotizar</span> : formatMoney(i.unitPrice * i.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <div className="rounded-md bg-carbon-900 p-6 text-carbon-100 shadow-lift-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-carbon-300">Total referencial</span>
                <span className="font-display text-4xl font-bold text-white">{formatMoney(orderSubtotal(items))}</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-carbon-400">
                {quotes > 0 && `${plural(quotes, "producto está", "productos están")} a cotizar y no se suma${quotes === 1 ? "" : "n"} al total. `}
                Los precios son referenciales y se confirman en la cotización. No hay cobro en línea.
              </p>
            </div>

            {/* div role=group en vez de fieldset: un <legend> con fondo se monta sobre el borde de la tarjeta */}
            <div role="group" aria-labelledby="datos-cliente" className="no-print space-y-3 rounded-md bg-white p-6 shadow-lift">
              <h2 id="datos-cliente" className="font-display text-2xl font-bold uppercase">
                Tus datos (opcional)
              </h2>
              <input className={input} placeholder="Nombre" autoComplete="name" value={customer.name ?? ""} onChange={set("name")} aria-label="Nombre" />
              <input className={input} placeholder="Ferretería / empresa" autoComplete="organization" value={customer.company ?? ""} onChange={set("company")} aria-label="Ferretería o empresa" />
              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="Teléfono" type="tel" autoComplete="tel" value={customer.phone ?? ""} onChange={set("phone")} aria-label="Teléfono" />
                <input className={input} placeholder="Ciudad" autoComplete="address-level2" value={customer.city ?? ""} onChange={set("city")} aria-label="Ciudad" />
              </div>
              <textarea className={`${input} h-24 py-2`} placeholder="Notas para tu cotización" value={customer.notes ?? ""} onChange={set("notes")} aria-label="Notas" />
            </div>

            <div className="no-print space-y-3">
              <Button href={url} variant="whatsapp" size="lg" className="w-full">
                <WhatsAppIcon className="size-5" />
                Enviar pedido por WhatsApp
              </Button>
              {truncated && (
                <p className="text-xs text-carbon-600">
                  Tu pedido es muy largo para un solo mensaje: enviaremos los primeros productos. Usa «Copiar pedido» para pegar la lista completa.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline-dark" onClick={copy} skew={false} className="w-full">
                  {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  <span className="ml-2">{copied ? "¡Copiado!" : "Copiar pedido"}</span>
                </Button>
                <Button variant="outline-dark" onClick={() => window.print()} skew={false} className="w-full">
                  <Printer className="size-4" aria-hidden />
                  <span className="ml-2">Imprimir</span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
