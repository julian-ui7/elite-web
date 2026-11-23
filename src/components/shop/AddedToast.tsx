"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useOrderStore } from "@/core/stores/orderStore";

/** Aviso breve al agregar un producto, con acceso directo al pedido. */
export function AddedToast() {
  const lastAdded = useOrderStore((s) => s.lastAdded);
  const openDrawer = useOrderStore((s) => s.openDrawer);
  const drawerOpen = useOrderStore((s) => s.drawerOpen);

  // En vez de "mostrar/ocultar" con estado, se recuerda cuál aviso ya se descartó.
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(() => setDismissedAt(lastAdded.at), 3200);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const show = lastAdded && lastAdded.at !== dismissedAt && !drawerOpen;

  return (
    <div
      role="status"
      aria-live="polite"
      data-floating
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-6"
    >
      {show && (
        <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-md border border-elite-500/40 bg-carbon-850 py-2.5 pl-3 pr-2 text-sm text-white shadow-lift-lg animate-[rise_0.4s_var(--ease-out-expo)_both]">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-elite-500 text-carbon-900">
            <Check className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 truncate">
            <strong className="font-semibold">{lastAdded.name}</strong> agregado
          </span>
          <button
            type="button"
            onClick={openDrawer}
            className="shrink-0 rounded-sm bg-elite-500 px-3 py-1.5 font-bold text-carbon-900 transition-colors hover:bg-elite-400"
          >
            Ver pedido
          </button>
        </div>
      )}
    </div>
  );
}
