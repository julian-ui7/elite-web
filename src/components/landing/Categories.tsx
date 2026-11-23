import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { categories } from "@/data/categories";
import { countByCategory, getProduct } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CategoryIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Bento de las 9 categorías curadas; cada una abre el catálogo ya filtrado. */
export function Categories() {
  const counts = countByCategory();

  return (
    <section id="categorias" aria-labelledby="categorias-title" className="relative bg-carbon-900 py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Categorías"
            title={
              <span id="categorias-title">
                Todo para equipar <span className="text-elite-500">tu negocio</span>
              </span>
            }
            lede="Nueve líneas de producto, desde herramientas manuales hasta maquinaria. Elige una y arma tu pedido."
          />
          <Link
            href="/tienda"
            className="reveal group inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-elite-500 hover:text-elite-300"
          >
            Ver todo el catálogo
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
          </Link>
        </div>

        <ul className="mt-14 grid auto-rows-[11.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] lg:grid-cols-4 lg:gap-4">
          {categories.map((c, i) => {
            const cover = getProduct(c.cover);
            const big = i === 0;
            return (
              <li
                key={c.slug}
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                className={clsx("reveal", big && "col-span-2 row-span-2")}
              >
                <Link
                  href={`/tienda?cat=${c.slug}`}
                  className={clsx(
                    "group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-md bg-carbon-800 p-4 ring-1 ring-white/10",
                    "transition-[transform,box-shadow,--tw-ring-color] duration-500 hover:-translate-y-1 hover:ring-elite-500/70 hover:shadow-glow",
                    big ? "sm:p-8" : "sm:p-5",
                  )}
                >
                  {/* placa blanca con el producto (se inclina al pasar el cursor) */}
                  {cover && (
                    <div
                      aria-hidden
                      className={clsx(
                        "absolute -bottom-3 -right-5 origin-bottom-right -skew-x-6 rounded-sm bg-white shadow-lift transition-transform duration-500 ease-out",
                        "group-hover:-translate-y-2 group-hover:scale-[1.07] group-hover:-rotate-2",
                        big ? "size-[66%]" : "size-[54%]",
                      )}
                    >
                      <div className="relative size-full skew-x-6">
                        <Image
                          src={cover.image}
                          alt=""
                          fill
                          sizes={big ? "(min-width:1024px) 30vw, 60vw" : "(min-width:1024px) 16vw, 32vw"}
                          quality={75}
                          className="object-contain p-2 mix-blend-multiply"
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 max-w-[72%]">
                    <span className="skew-box grid size-10 place-items-center bg-elite-500 text-carbon-900">
                      <span className="unskew">
                        <CategoryIcon name={c.icon} className="size-5" strokeWidth={2} />
                      </span>
                    </span>
                    <h3
                      className={clsx(
                        "display mt-4 text-white transition-colors group-hover:text-elite-500",
                        big ? "text-5xl sm:text-6xl" : "text-[1.7rem] sm:text-3xl",
                      )}
                    >
                      {c.name}
                    </h3>
                    {/* La descripción solo en la tarjeta grande: en las pequeñas chocaría con la placa. */}
                    {big && <p className="mt-2 max-w-xs text-sm leading-snug text-carbon-300">{c.blurb}</p>}
                  </div>

                  <p className="relative z-10 flex items-center gap-2 text-sm font-semibold text-carbon-200">
                    {/* En móvil solo el número: "productos" chocaría con la placa blanca. */}
                    <span className="rounded-xs bg-white/10 px-2 py-0.5">
                      {counts[c.slug]}
                      <span className="hidden sm:inline"> productos</span>
                      <span className="sr-only sm:hidden"> productos</span>
                    </span>
                    <ArrowUpRight
                      className="size-4 text-elite-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
