"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import clsx from "clsx";
import { useOrderStore } from "@/core/stores/orderStore";
import { useUiStore } from "@/core/stores/uiStore";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { formatMoney, priceLabel } from "@/lib/format";
import { toOrderItem } from "@/lib/order";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { QuantityStepper } from "./QuantityStepper";

/** Vista rápida de un producto: elegir variante, cantidad y agregar al pedido. */
export function ProductDialog() {
  // El store conserva el producto al cerrar: el contenido no desaparece durante la animación de salida.
  const product = useUiStore((s) => s.quickView);
  const open = useUiStore((s) => s.quickViewOpen);
  const close = useUiStore((s) => s.closeQuickView);

  return (
    <Modal
      open={open}
      onClose={close}
      label={product ? `Detalle de ${product.name}` : "Detalle del producto"}
      className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-md bg-paper text-carbon-900 shadow-lift-lg"
    >
      {product && <Body key={product.id} product={product} onClose={close} />}
    </Modal>
  );
}

function Body({ product, onClose }: { product: Product; onClose: () => void }) {
  const add = useOrderStore((s) => s.add);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const needsVariant = product.variants.length > 0;
  const ready = !needsVariant || variant !== null;
  const category = getCategory(product.category);

  const unit = variant ? variant.price : product.price;
  const priceText = variant
    ? variant.price === null
      ? "A cotizar"
      : formatMoney(variant.price)
    : priceLabel(product);

  const handleAdd = () => {
    if (!ready) return;
    add(toOrderItem(product, variant), qty);
    onClose();
  };

  const quoteMessage = [
    "Hola Elite Ecuador 👋, quisiera cotizar:",
    "",
    `${product.name}${variant ? ` — ${variant.label}` : ""} · x${qty}`,
  ].join("\n");

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-carbon-900 text-white transition-colors hover:bg-carbon-700"
      >
        <X className="size-5" aria-hidden />
      </button>

      <div className="relative aspect-square bg-white md:aspect-auto md:min-h-[26rem]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 440px, 100vw"
          quality={85}
          className="object-contain p-6 mix-blend-multiply"
        />
      </div>

      <div className="flex flex-col gap-5 p-6 md:p-8">
        <div>
          {category && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-carbon-500">
              {category.name}
              {product.brand && product.brand !== "Elite" ? ` · ${product.brand}` : ""}
            </p>
          )}
          <h2 className="display mt-2 pr-10 text-4xl text-carbon-900 md:text-5xl">{product.name}</h2>
          {product.sku && <p className="mt-2 text-sm text-carbon-500">SKU {product.sku}</p>}
        </div>

        <p
          className={clsx(
            "font-display font-bold leading-none",
            unit === null && ready ? "text-2xl uppercase tracking-wide text-carbon-500" : "text-4xl",
          )}
        >
          {priceText}
          {unit !== null && ready && <span className="ml-2 text-sm font-medium text-carbon-500">c/u · referencial</span>}
        </p>

        {product.description && <p className="text-[15px] leading-relaxed text-carbon-600">{product.description}</p>}

        {needsVariant && (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">
              Elige una opción <span className="font-normal text-carbon-500">({product.variants.length} disponibles)</span>
            </legend>
            {product.variants.length <= 8 ? (
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <label
                    key={v.id}
                    className={clsx(
                      "cursor-pointer rounded-sm border-2 px-3 py-2 text-sm font-semibold transition-colors",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-carbon-900",
                      v.id === variantId
                        ? "border-carbon-900 bg-carbon-900 text-elite-500"
                        : "border-carbon-200 bg-white hover:border-carbon-900",
                    )}
                  >
                    <input
                      type="radio"
                      name={`variante-${product.id}`}
                      className="sr-only"
                      checked={v.id === variantId}
                      onChange={() => setVariantId(v.id)}
                    />
                    {v.label}
                  </label>
                ))}
              </div>
            ) : (
              <select
                value={variantId ?? ""}
                onChange={(e) => setVariantId(e.target.value ? Number(e.target.value) : null)}
                className="h-12 w-full rounded-sm border-2 border-carbon-200 bg-white px-3 text-base font-medium outline-none focus-visible:border-carbon-900"
              >
                <option value="">Selecciona una opción…</option>
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} — {v.price === null ? "a cotizar" : formatMoney(v.price)}
                  </option>
                ))}
              </select>
            )}
          </fieldset>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-carbon-200 pt-5">
          <QuantityStepper value={qty} onChange={setQty} label={product.name} tone="light" />
          <Button variant="dark" size="md" onClick={handleAdd} disabled={!ready} className="flex-1">
            <Plus className="size-5" aria-hidden />
            {ready ? "Agregar al pedido" : "Elige una opción"}
          </Button>
        </div>

        <a
          href={ready ? whatsappUrl(quoteMessage) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          className={clsx(
            "inline-flex items-center gap-2 self-start text-sm font-semibold text-carbon-900 underline decoration-whatsapp-dark decoration-2 underline-offset-4",
            !ready && "pointer-events-none opacity-40",
          )}
        >
          <WhatsAppIcon className="size-4 text-whatsapp-dark" />
          Cotizar solo este producto por WhatsApp
        </a>
      </div>
    </div>
  );
}
