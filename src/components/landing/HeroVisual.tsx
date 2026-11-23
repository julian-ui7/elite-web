"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { quoteUrl } from "@/lib/whatsapp";

type Layer = {
  /** Recorte con transparencia real (scripts/make-cutouts.mjs): conserva los colores del producto. */
  src: string;
  alt: string;
  /** Tamaño intrínseco del recorte (para reservar el espacio y evitar saltos de layout). */
  size: [w: number, h: number];
  /** Posición/tamaño en % del contenedor. */
  box: { left: string; top: string; width: string };
  rotate: number;
  /** Profundidad del parallax (mayor = se mueve más). */
  depth: number;
  float: [seconds: number, delay: number];
  eager?: boolean;
};

const layers: Layer[] = [
  {
    src: "/hero/motosierra-58cc.webp",
    alt: "Motosierra 58cc Elite",
    size: [462, 325],
    box: { left: "15%", top: "25%", width: "76%" },
    rotate: -5,
    depth: 1,
    float: [8, 0],
    eager: true,
  },
  {
    src: "/hero/martillos.webp",
    alt: "Martillo Elite",
    size: [362, 409],
    box: { left: "60%", top: "3%", width: "31%" },
    rotate: -10,
    depth: 1.5,
    float: [6.5, 0.6],
  },
  {
    src: "/hero/alicate-elite-profesional.webp",
    alt: "Alicate Elite profesional",
    size: [142, 412],
    box: { left: "11%", top: "56%", width: "17%" },
    rotate: 12,
    depth: 1.7,
    float: [7.2, 1.2],
  },
  {
    src: "/hero/gatas-botella.webp",
    alt: "Gata de botella Elite",
    size: [351, 428],
    box: { left: "55%", top: "63%", width: "28%" },
    rotate: 5,
    depth: 0.8,
    float: [9, 0.3],
  },
];

const PANEL = "polygon(14% 0, 100% 0, 86% 100%, 0 100%)";

/**
 * Composición de productos sobre el rombo amarillo del logo.
 * Los productos (recortes con transparencia, colores reales) flotan sobre el panel y siguen
 * suavemente el puntero (solo con mouse y sin "reducir movimiento").
 */
export function HeroVisual({ productCount }: { productCount: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const set = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => set(x, y));
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    set(0, 0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="hero-slide relative mx-auto aspect-[5/6] w-full max-w-[34rem] [--d:250ms]"
      style={{ "--mx": 0, "--my": 0 } as CSSProperties}
    >
      {/* Panel + productos recortados al rombo */}
      <div className="absolute inset-0 overflow-hidden bg-elite-500" style={{ clipPath: PANEL }}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-80deg, transparent 0 22px, rgb(0 0 0 / 0.06) 22px 24px)",
          }}
        />
        {layers.map((l) => (
          <div
            key={l.src}
            className="absolute transition-transform duration-300 ease-out will-change-transform"
            style={{
              ...l.box,
              transform: `translate3d(calc(var(--mx) * ${l.depth * 18}px), calc(var(--my) * ${l.depth * 14}px), 0)`,
            }}
          >
            <div
              className="float"
              style={{ "--r": `${l.rotate}deg`, "--float-t": `${l.float[0]}s`, "--float-d": `${l.float[1]}s` } as CSSProperties}
            >
              <Image
                src={l.src}
                alt={l.alt}
                width={l.size[0]}
                height={l.size[1]}
                sizes="(min-width: 1024px) 30rem, 80vw"
                quality={85}
                loading={l.eager ? "eager" : "lazy"}
                fetchPriority={l.eager ? "high" : "auto"}
                className="h-auto w-full drop-shadow-[0_18px_18px_rgb(0_0_0/0.18)]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Contorno del rombo (eco del logo) */}
      <svg
        aria-hidden
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-3 size-[calc(100%+1.5rem)] text-elite-500/50"
      >
        <polygon
          points="14,0 100,0 86,120 0,120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          transform="translate(3 3.6) scale(0.94 0.94)"
        />
      </svg>

      {/* Etiquetas flotantes */}
      <div className="absolute -left-2 top-[14%] hidden rounded-sm border border-white/15 bg-carbon-900/95 px-4 py-3 shadow-lift-lg backdrop-blur sm:block lg:-left-8">
        <p className="font-display text-4xl font-bold leading-none text-elite-500">{productCount}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-carbon-300">productos en catálogo</p>
      </div>

      <a
        href={quoteUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute -right-1 bottom-[1%] flex items-center gap-3 rounded-sm bg-carbon-900 px-4 py-3 shadow-lift-lg ring-1 ring-white/15 transition-[transform,box-shadow] hover:-translate-y-1 hover:ring-elite-500 lg:-right-6"
      >
        <span className="text-left">
          <span className="block font-display text-lg font-bold uppercase leading-none text-white">Cotiza hoy</span>
          <span className="mt-1 block text-xs text-carbon-300">Asesoría técnica por WhatsApp</span>
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-elite-500 text-carbon-900 transition-transform group-hover:rotate-45">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </a>
    </div>
  );
}
