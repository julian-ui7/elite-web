"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "center" | "right" | "top";
  className?: string;
  children: ReactNode;
};

/**
 * Modal sobre <dialog> nativo: trampa de foco, Escape y "inert" del resto de la
 * página vienen gratis del navegador. Clic en el fondo = cerrar.
 */
export function Modal({ open, onClose, label, side = "center", className, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      data-side={side}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        // Solo si el clic fue sobre el fondo (el propio <dialog>), no sobre el panel.
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={clsx("modal-panel", className)} data-side={side}>
        {children}
      </div>
    </dialog>
  );
}
