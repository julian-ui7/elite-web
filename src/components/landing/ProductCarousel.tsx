"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

/** Carrusel con CSS scroll-snap (sin librerías). Flechas, teclado y gesto táctil nativos. */
export function ProductCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 280) + 16;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const arrow =
    "grid size-12 place-items-center rounded-full border-2 border-carbon-900 text-carbon-900 transition-colors hover:bg-carbon-900 hover:text-elite-500 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div>
      <div className="mb-6 flex justify-end gap-3">
        <button type="button" onClick={() => scroll(-1)} disabled={edge.start} aria-label="Productos anteriores" className={arrow}>
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={edge.end} aria-label="Más productos" className={arrow}>
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>

      <ul
        ref={track}
        onScroll={update}
        tabIndex={0}
        aria-label="Productos destacados"
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-8 pt-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {/* El carrusel está bajo el pliegue: sus imágenes cargan de forma perezosa (sin `eager`). */}
        {products.map((p) => (
          <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23.4%]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
