"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/** Estado "Abierto ahora / Cerrado" según la hora de Ecuador. Se calcula en el cliente. */
export function OpenNowBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Reserva el espacio mientras se calcula para no mover el layout.
  if (!status) return <span className={clsx("inline-block h-7", className)} aria-hidden />;

  return (
    <span
      role="status"
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
        status.open ? "bg-whatsapp/15 text-whatsapp" : "bg-white/10 text-carbon-300",
        className,
      )}
    >
      <span className="relative flex size-2.5">
        {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-whatsapp opacity-70" />}
        <span className={clsx("relative inline-flex size-2.5 rounded-full", status.open ? "bg-whatsapp" : "bg-carbon-400")} />
      </span>
      {status.label}
    </span>
  );
}
