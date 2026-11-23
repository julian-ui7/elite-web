"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import clsx from "clsx";
import { useUiStore } from "@/core/stores/uiStore";
import { categories, getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { priceLabel } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import { Modal } from "@/components/ui/Modal";

const SUGGESTIONS = ["machete", "alicate", "desbrozadora", "brocha", "gata", "candado"];

/** Buscador global (Ctrl/⌘ + K). El catálogo se carga solo la primera vez que se abre. */
export function SearchDialog() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const openQuickView = useUiStore((s) => s.openQuickView);
  const router = useRouter();

  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !catalog) import("@/data/products").then((m) => setCatalog(m.products));
  }, [open, catalog]);

  // Atajo de teclado global.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useUiStore.getState().searchOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Al abrir: limpiar la consulta (ajuste durante el render, sin efecto) y enfocar el campo.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQ("");
      setActive(0);
    }
  }
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const all = useMemo(() => (catalog && q.trim() ? searchProducts(catalog, { q }) : []), [catalog, q]);
  const results = all.slice(0, 7);
  const close = () => setOpen(false);

  const goAll = (query: string, cat?: string) => {
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (cat) p.set("cat", cat);
    close();
    router.push(`/tienda${p.size ? `?${p}` : ""}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) openQuickView(results[active]);
      else goAll(q);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      side="top"
      label="Buscar productos"
      className="w-full max-w-2xl overflow-hidden rounded-md border border-white/10 bg-carbon-850 shadow-lift-lg"
    >
      {/* El foco se indica con la línea inferior amarilla (el campo no lleva anillo propio). */}
      <div className="flex items-center gap-3 border-b-2 border-white/10 px-4 transition-colors focus-within:border-elite-500">
        <Search className="size-5 shrink-0 text-elite-500" aria-hidden />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-label="Buscar productos"
          placeholder="Busca por nombre: machete, alicate, desbrozadora…"
          className="h-14 w-full bg-transparent text-lg text-white outline-none focus-visible:outline-none placeholder:text-carbon-500"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar búsqueda"
          className="grid size-9 shrink-0 place-items-center rounded-sm text-carbon-400 hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="max-h-[60dvh] overflow-y-auto p-2">
        {!q.trim() ? (
          <div className="space-y-5 p-3">
            <div>
              <p className="eyebrow mb-3 text-carbon-400">Sugerencias</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-sm border border-white/15 px-3 py-1.5 text-sm text-carbon-200 transition-colors hover:border-elite-500 hover:text-elite-500"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3 text-carbon-400">Categorías</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => goAll("", c.slug)}
                    className="rounded-sm bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-carbon-100 transition-colors hover:bg-elite-500 hover:text-carbon-900"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : !catalog ? (
          <p className="p-6 text-center text-carbon-400">Cargando catálogo…</p>
        ) : results.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-display text-2xl font-bold uppercase text-white">Sin resultados para “{q}”</p>
            <p className="mt-2 text-carbon-400">Prueba con otra palabra o pídenos que lo cotizemos por WhatsApp.</p>
          </div>
        ) : (
          <>
            <ul id="search-results" role="listbox" aria-label="Resultados">
              {results.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => openQuickView(p)}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-sm p-2 text-left transition-colors",
                      i === active ? "bg-white/10" : "hover:bg-white/5",
                    )}
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xs bg-white">
                      <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-white">{p.name}</span>
                      <span className="block text-xs text-carbon-400">{getCategory(p.category)?.name}</span>
                    </span>
                    <span className="shrink-0 font-display text-lg font-bold text-elite-500">{priceLabel(p)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => goAll(q)}
              className="mt-1 flex w-full items-center justify-between rounded-sm px-3 py-3 text-sm font-semibold text-elite-500 transition-colors hover:bg-white/5"
            >
              Ver los {all.length} resultados en el catálogo
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </>
        )}
      </div>

      <footer className="hidden items-center gap-4 border-t border-white/10 px-4 py-2.5 text-xs text-carbon-400 sm:flex">
        <span className="inline-flex items-center gap-1.5">
          <kbd className="rounded-xs border border-white/20 px-1.5 py-0.5">↑</kbd>
          <kbd className="rounded-xs border border-white/20 px-1.5 py-0.5">↓</kbd> navegar
        </span>
        <span className="inline-flex items-center gap-1.5">
          <kbd className="rounded-xs border border-white/20 px-1.5 py-0.5">
            <CornerDownLeft className="inline size-3" aria-hidden />
          </kbd>{" "}
          abrir
        </span>
        <span className="inline-flex items-center gap-1.5">
          <kbd className="rounded-xs border border-white/20 px-1.5 py-0.5">Esc</kbd> cerrar
        </span>
      </footer>
    </Modal>
  );
}
