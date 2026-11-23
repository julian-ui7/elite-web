"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, Menu, Search, X } from "lucide-react";
import clsx from "clsx";
import { orderCount, useOrderStore } from "@/core/stores/orderStore";
import { useUiStore } from "@/core/stores/uiStore";
import { nav, site } from "@/data/site";
import { quoteUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/Icons";

export function SiteHeader() {
  const items = useOrderStore((s) => s.items);
  const hydrated = useOrderStore((s) => s.hydrated);
  const openDrawer = useOrderStore((s) => s.openDrawer);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const menuOpen = useUiStore((s) => s.menuOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);

  const count = hydrated ? orderCount(items) : 0;

  // El badge "late" cada vez que el total aumenta.
  const [bumpKey, setBumpKey] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (count > prev.current) setBumpKey((k) => k + 1);
    prev.current = count;
  }, [count]);

  // Barra de progreso de lectura + sombra al hacer scroll (sin re-renderizar React).
  const bar = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      header.current?.toggleAttribute("data-scrolled", window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const iconBtn =
    "relative inline-flex h-11 items-center gap-2 rounded-sm px-3 text-carbon-200 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <>
      <header
        ref={header}
        data-site-header
        className={clsx(
          // Casi opaca: sobre secciones claras, un fondo más transparente se ve gris en vez de carbón.
          "sticky top-0 z-40 border-b border-white/10 bg-carbon-900/96 backdrop-blur-lg transition-shadow",
          "data-[scrolled]:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.9)]",
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label={`${site.name} — inicio`} className="shrink-0">
            <Logo priority className="h-9 sm:h-10" />
          </Link>

          <nav aria-label="Principal" className="ml-6 hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="relative px-3 py-2 font-display text-[1.05rem] font-semibold uppercase tracking-wider text-carbon-200 transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-elite-500 after:transition-transform hover:text-white hover:after:scale-x-100"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/tienda"
              className="ml-1 px-3 py-2 font-display text-[1.05rem] font-bold uppercase tracking-wider text-elite-500 transition-colors hover:text-elite-300"
            >
              Tienda
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* El texto visible forma parte del nombre accesible (WCAG 2.5.3): se oculta con
                sr-only —no con display:none— cuando no hay espacio, así el botón nunca queda sin nombre. */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-keyshortcuts="Control+K"
              className={iconBtn}
            >
              <Search className="size-5" aria-hidden />
              <span className="text-sm max-xl:sr-only">Buscar</span>
              <kbd aria-hidden className="hidden rounded-xs border border-white/20 px-1.5 py-0.5 text-[11px] text-carbon-400 xl:inline">
                Ctrl K
              </kbd>
            </button>

            <button type="button" onClick={openDrawer} className={iconBtn}>
              <ClipboardList className="size-5" aria-hidden />
              <span className="text-sm max-sm:sr-only">Mi pedido</span>
              {count > 0 && (
                <>
                  <span
                    key={bumpKey}
                    aria-hidden
                    className={clsx(
                      "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-elite-500 px-1 text-[11px] font-bold text-carbon-900",
                      bumpKey > 0 && "bump",
                    )}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                  <span className="sr-only">({count} {count === 1 ? "unidad" : "unidades"})</span>
                </>
              )}
            </button>

            <Button href={quoteUrl()} size="sm" className="ml-1 hidden md:inline-flex">
              Cotizar
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className={clsx(iconBtn, "lg:hidden")}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
        <div
          ref={bar}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-elite-500 will-change-transform"
        />
      </header>

      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        side="right"
        label="Menú"
        className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-carbon-850"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Logo className="h-9" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="grid size-10 place-items-center rounded-full text-carbon-300 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {[...nav, { label: "Tienda", href: "/tienda" }].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-3 py-3 display text-3xl text-white transition-colors hover:bg-white/5 hover:text-elite-500"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-white/10 p-4">
          <Button href={quoteUrl()} variant="whatsapp" size="lg" className="w-full">
            <WhatsAppIcon className="size-5" />
            Cotizar por WhatsApp
          </Button>
          <p className="text-center text-sm text-carbon-400">
            {site.hours.label} · {site.hours.short}
          </p>
        </div>
      </Modal>
    </>
  );
}
