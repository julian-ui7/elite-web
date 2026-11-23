"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Un único observador global: marca `.is-in` en los elementos `.reveal` al entrar
 * en pantalla. Así las secciones siguen siendo Server Components (cero JS por sección).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)");

    if (!("IntersectionObserver" in window)) {
      els().forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const watch = () => els().forEach((el) => io.observe(el));
    watch();

    // Elementos añadidos después (p. ej. "Mostrar más" en la tienda).
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
