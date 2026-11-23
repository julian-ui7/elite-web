import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

/** Ancho máximo + gutters de 16/24/32 px (contenido nunca pegado al borde). */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={clsx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
