"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { PackageSearch, Search, X } from "lucide-react";
import clsx from "clsx";
import { categories, getCategory, isCategorySlug, type CategorySlug } from "@/data/categories";
import { products } from "@/data/products";
import { plural } from "@/lib/format";
import { SORT_OPTIONS, isSortKey, searchProducts, type SortKey } from "@/lib/search";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 24;

/** Catálogo: búsqueda, categorías y orden sincronizados con la URL (enlaces compartibles). */
export function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const catParam = params.get("cat");
  const cat: CategorySlug | null = isCategorySlug(catParam) ? catParam : null;
  const sortParam = params.get("orden");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "relevancia";

  const setParams = (next: { q?: string; cat?: string | null; orden?: SortKey }) => {
    const p = new URLSearchParams(params.toString());
    const apply = (key: string, value: string | null | undefined, empty: string | null = "") => {
      if (value === undefined) return;
      if (!value || value === empty) p.delete(key);
      else p.set(key, value);
    };
    apply("q", next.q);
    apply("cat", next.cat);
    apply("orden", next.orden, "relevancia");
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // La URL es la fuente de verdad (enlaces compartibles). useOptimistic hace que el campo
  // de búsqueda responda al instante aunque la URL tarde un instante en actualizarse.
  const [qLive, setQLive] = useOptimistic(q);
  const [, startTransition] = useTransition();
  const onSearch = (value: string) =>
    startTransition(() => {
      setQLive(value);
      setParams({ q: value });
    });

  const results = useMemo(() => searchProducts(products, { q: qLive, cat, sort }), [qLive, cat, sort]);

  // Conteo por categoría respetando la búsqueda actual.
  const counts = useMemo(() => {
    const base = searchProducts(products, { q: qLive });
    const c = new Map<string, number>();
    for (const p of base) c.set(p.category, (c.get(p.category) ?? 0) + 1);
    return { total: base.length, by: c };
  }, [qLive]);

  // "Mostrar más": se reinicia al cambiar cualquier filtro.
  const filterKey = `${qLive}|${cat}|${sort}`;
  const [shown, setShown] = useState({ key: filterKey, n: PAGE_SIZE });
  const n = shown.key === filterKey ? shown.n : PAGE_SIZE;
  const visible = results.slice(0, n);

  const activeCategory = getCategory(cat);
  const hasFilters = !!(qLive || cat);

  const chip = (active: boolean) =>
    clsx(
      "inline-flex shrink-0 items-center gap-2 rounded-sm border-2 px-3.5 py-2 text-sm font-semibold transition-colors",
      active
        ? "border-carbon-900 bg-carbon-900 text-elite-500"
        : "border-carbon-200 bg-white text-carbon-700 hover:border-carbon-900",
    );

  return (
    <div className="on-light bg-bone text-carbon-900">
      <Container className="py-8 sm:py-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        {/* Categorías (escritorio) */}
        <aside className="hidden lg:block" aria-label="Categorías">
          <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
            <p className="eyebrow text-carbon-500">Categorías</p>
            <ul className="mt-4 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setParams({ cat: null })}
                  aria-pressed={!cat}
                  className={clsx(
                    "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left font-semibold transition-colors",
                    !cat ? "bg-carbon-900 text-elite-500" : "hover:bg-carbon-100",
                  )}
                >
                  Todas <span className="text-sm opacity-70">{counts.total}</span>
                </button>
              </li>
              {categories.map((c) => {
                const count = counts.by.get(c.slug) ?? 0;
                return (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setParams({ cat: c.slug })}
                      aria-pressed={cat === c.slug}
                      disabled={count === 0 && cat !== c.slug}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left font-semibold transition-colors disabled:opacity-35",
                        cat === c.slug ? "bg-carbon-900 text-elite-500" : "hover:bg-carbon-100",
                      )}
                    >
                      {c.name} <span className="text-sm opacity-70">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Barra de herramientas */}
          {/* Sin "sticky": en móvil ocuparía ~170 px de la pantalla mientras se navega el catálogo. */}
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-carbon-500" aria-hidden />
                <input
                  type="search"
                  value={qLive}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Buscar en el catálogo: machete, alicate, brocha…"
                  aria-label="Buscar en el catálogo"
                  className="h-12 w-full rounded-sm border-2 border-carbon-200 bg-white pl-12 pr-11 text-base outline-none transition-colors placeholder:text-carbon-400 focus:border-carbon-900 [&::-webkit-search-cancel-button]:hidden"
                />
                {qLive && (
                  <button
                    type="button"
                    onClick={() => onSearch("")}
                    aria-label="Borrar búsqueda"
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-carbon-500 hover:bg-carbon-100"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <select
                value={sort}
                onChange={(e) => setParams({ orden: e.target.value as SortKey })}
                aria-label="Ordenar productos"
                className="h-12 rounded-sm border-2 border-carbon-200 bg-white px-3 font-medium outline-none focus:border-carbon-900 sm:w-56"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Categorías (móvil) */}
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden" role="group" aria-label="Categorías">
              <button type="button" className={chip(!cat)} aria-pressed={!cat} onClick={() => setParams({ cat: null })}>
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  className={chip(cat === c.slug)}
                  aria-pressed={cat === c.slug}
                  onClick={() => setParams({ cat: c.slug })}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-bold uppercase leading-none">
              {activeCategory ? activeCategory.name : "Todos los productos"}
            </h2>
            <p role="status" aria-live="polite" className="text-sm text-carbon-600">
              {plural(results.length, "producto", "productos")}
              {qLive && (
                <>
                  {" "}para “<strong className="text-carbon-900">{qLive}</strong>”
                </>
              )}
            </p>
          </div>

          {/* Resultados */}
          {results.length === 0 ? (
            <div className="mt-8 grid place-items-center rounded-md border-2 border-dashed border-carbon-300 bg-white/60 px-6 py-16 text-center">
              <PackageSearch className="size-14 text-carbon-400" strokeWidth={1.5} aria-hidden />
              <h3 className="display mt-4 text-4xl text-carbon-900">No encontramos ese producto</h3>
              <p className="mx-auto mt-3 max-w-md text-carbon-600">
                {qLive ? `No hay resultados para “${qLive}”` : "No hay productos en esta categoría"}. Prueba con otra palabra o pídenos que lo
                cotizemos por WhatsApp.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {hasFilters && (
                  <Button
                    variant="outline-dark"
                    onClick={() => startTransition(() => {
                      setQLive("");
                      router.replace(pathname, { scroll: false });
                    })}
                  >
                    Quitar filtros
                  </Button>
                )}
                <Button
                  variant="whatsapp"
                  href={whatsappUrl(
                    `Hola Elite Ecuador 👋, no encontré ${qLive ? `“${qLive}”` : "lo que busco"} en el catálogo. ¿Me pueden ayudar a cotizarlo?`,
                  )}
                >
                  <WhatsAppIcon className="size-5" />
                  Preguntar por WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((p, i) => (
                  <li key={p.id} className="reveal" style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}>
                    <ProductCard product={p} eager={i < 4} />
                  </li>
                ))}
              </ul>

              {n < results.length && (
                <div className="mt-12 text-center">
                  <p className="mb-4 text-sm text-carbon-600">
                    Mostrando {visible.length} de {results.length}
                  </p>
                  <Button variant="dark" size="lg" onClick={() => setShown({ key: filterKey, n: n + PAGE_SIZE })}>
                    Mostrar más productos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
