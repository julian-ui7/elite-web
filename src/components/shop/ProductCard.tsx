"use client";

import Image from "next/image";
import { Check, Plus, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { useOrderStore } from "@/core/stores/orderStore";
import { useUiStore } from "@/core/stores/uiStore";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { formatMoney } from "@/lib/format";
import { toOrderItem } from "@/lib/order";

type Props = {
  product: Product;
  /** Imágenes sobre el pliegue: se cargan de inmediato. */
  eager?: boolean;
  className?: string;
};

export function ProductCard({ product, eager = false, className }: Props) {
  const add = useOrderStore((s) => s.add);
  const hydrated = useOrderStore((s) => s.hydrated);
  const inOrder = useOrderStore((s) =>
    s.items.reduce((n, i) => (i.productId === product.id ? n + i.qty : n), 0),
  );
  const openQuickView = useUiStore((s) => s.openQuickView);

  const hasVariants = product.variants.length > 0;
  const category = getCategory(product.category);
  const showBrand = product.brand && product.brand !== "Elite";
  const quote = product.price === null;

  return (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-md bg-white text-carbon-900",
        "shadow-lift transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift-lg",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => openQuickView(product)}
        aria-label={`Ver detalle de ${product.name}`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-white"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
          loading={eager ? "eager" : "lazy"}
          quality={75}
          className="object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {showBrand && (
          <span className="absolute left-2 top-2 rounded-xs bg-carbon-900 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-elite-500">
            {product.brand}
          </span>
        )}
        {hydrated && inOrder > 0 && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-xs bg-elite-500 px-2 py-0.5 text-[11px] font-bold text-carbon-900">
            <Check className="size-3" aria-hidden /> En tu pedido ×{inOrder}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 border-t border-carbon-100 p-4">
        {category && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-carbon-500">
            {category.name}
          </p>
        )}
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="text-left hover:underline decoration-elite-600 decoration-2 underline-offset-4"
          >
            {product.name}
          </button>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p
            className={clsx(
              "whitespace-nowrap font-display font-bold leading-none",
              quote ? "text-lg uppercase tracking-wide text-carbon-500" : "text-[1.7rem]",
            )}
          >
            {/* "Desde" va pequeño arriba para que el precio no se parta en dos líneas */}
            {!quote && product.priceMax !== null && (
              <span className="mb-1 block font-sans text-[11px] font-semibold uppercase tracking-wider text-carbon-500">
                Desde
              </span>
            )}
            {quote ? "A cotizar" : formatMoney(product.price!)}
          </p>

          {hasVariants ? (
            <button
              type="button"
              onClick={() => openQuickView(product)}
              className="inline-flex h-10 items-center gap-1.5 rounded-sm border-2 border-carbon-900 px-3 text-sm font-bold text-carbon-900 transition-colors hover:bg-carbon-900 hover:text-elite-500"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Opciones
            </button>
          ) : (
            <button
              type="button"
              onClick={() => add(toOrderItem(product))}
              aria-label={`Agregar ${product.name} al pedido`}
              className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-carbon-900 px-3 text-sm font-bold text-elite-500 transition-[background-color,transform] hover:bg-carbon-700 active:scale-95"
            >
              <Plus className="size-4" aria-hidden />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
