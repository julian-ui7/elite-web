"use client";

import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Trash2, X } from "lucide-react";
import {
  orderCount,
  orderQuoteCount,
  orderSubtotal,
  useOrderStore,
} from "@/core/stores/orderStore";
import { formatMoney, plural } from "@/lib/format";
import { buildOrderUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { QuantityStepper } from "./QuantityStepper";

/** Cajón lateral "Mi pedido": revisar, ajustar cantidades y enviar por WhatsApp. */
export function OrderDrawer() {
  const open = useOrderStore((s) => s.drawerOpen);
  const close = useOrderStore((s) => s.closeDrawer);
  const items = useOrderStore((s) => s.items);
  const setQty = useOrderStore((s) => s.setQty);
  const remove = useOrderStore((s) => s.remove);
  const clear = useOrderStore((s) => s.clear);

  const count = orderCount(items);
  const quotes = orderQuoteCount(items);

  return (
    <Modal
      open={open}
      onClose={close}
      side="right"
      label="Mi pedido"
      className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-carbon-850 text-carbon-100 shadow-lift-lg"
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="display text-3xl text-white">Mi pedido</h2>
          <p className="mt-1 text-sm text-carbon-400">
            {count ? `${plural(count, "unidad", "unidades")} · ${plural(items.length, "producto", "productos")}` : "Aún no hay productos"}
          </p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar pedido"
          className="grid size-10 place-items-center rounded-full text-carbon-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" aria-hidden />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
          <span className="grid size-20 place-items-center skew-box bg-elite-500/10 text-elite-500">
            <ClipboardList className="size-9 -skew-x-0" aria-hidden />
          </span>
          <div>
            <p className="font-display text-2xl font-bold uppercase text-white">Tu pedido está vacío</p>
            <p className="mt-2 text-carbon-400">
              Agrega productos del catálogo y te enviamos la cotización por WhatsApp.
            </p>
          </div>
          <Button href="/tienda" onClick={close}>
            Explorar catálogo
          </Button>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
            {items.map((i) => (
              <li key={i.key} className="flex gap-4 py-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-white">
                  <Image
                    src={i.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1.5 mix-blend-multiply"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">{i.name}</p>
                  {i.variantLabel && <p className="mt-0.5 text-sm text-carbon-400">{i.variantLabel}</p>}
                  <p className="mt-1 text-sm text-carbon-300">
                    {i.unitPrice === null ? (
                      <span className="font-semibold text-elite-500">A cotizar</span>
                    ) : (
                      <>
                        {formatMoney(i.unitPrice)} c/u ·{" "}
                        <span className="font-semibold text-white">{formatMoney(i.unitPrice * i.qty)}</span>
                      </>
                    )}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      size="sm"
                      label={i.name}
                      value={i.qty}
                      onChange={(q) => setQty(i.key, q)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(i.key)}
                      aria-label={`Quitar ${i.name}`}
                      className="grid size-9 place-items-center rounded-sm text-carbon-400 transition-colors hover:bg-danger/15 hover:text-danger"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="space-y-4 border-t border-white/10 bg-carbon-900 px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-carbon-300">Total referencial</span>
              <span className="font-display text-3xl font-bold text-white">{formatMoney(orderSubtotal(items))}</span>
            </div>
            <p className="text-xs leading-relaxed text-carbon-400">
              {quotes > 0 && `${plural(quotes, "producto está", "productos están")} a cotizar y no suma${quotes === 1 ? "" : "n"} al total. `}
              Los precios son referenciales y se confirman en la cotización. No se realiza ningún cobro en línea.
            </p>
            <Button
              href={buildOrderUrl(items).url}
              variant="whatsapp"
              size="lg"
              className="w-full"
            >
              <WhatsAppIcon className="size-5" />
              Enviar pedido por WhatsApp
            </Button>
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/tienda/pedido"
                onClick={close}
                className="font-semibold text-elite-500 underline underline-offset-4 hover:text-elite-300"
              >
                Ver pedido completo
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-carbon-400 underline underline-offset-4 transition-colors hover:text-danger"
              >
                Vaciar pedido
              </button>
            </div>
          </footer>
        </>
      )}
    </Modal>
  );
}
