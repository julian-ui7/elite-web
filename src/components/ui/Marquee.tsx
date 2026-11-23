import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Cinta infinita en CSS puro. El contenido se duplica para el bucle sin saltos;
 * la copia es `aria-hidden` para que los lectores de pantalla no lo lean dos veces.
 */
export function Marquee({
  children,
  speed = 45,
  className,
}: {
  children: ReactNode;
  /** Segundos por vuelta. */
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx("marquee overflow-hidden", className)}
      style={{ ["--marquee-speed" as string]: `${speed}s` }}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
