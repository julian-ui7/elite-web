import Image from "next/image";
import clsx from "clsx";

/** Logo oficial (PNG amarillo del sitio actual, 1869×788). Pedir versión SVG al cliente. */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/logo-elite.png"
      alt="Elite Ecuador"
      width={1869}
      height={788}
      sizes="160px"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={clsx("w-auto", className)}
    />
  );
}
