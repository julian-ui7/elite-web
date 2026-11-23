import Link from "next/link";
import clsx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "outline-dark" | "whatsapp" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-elite-500 text-carbon-900 hover:bg-elite-400 hover:shadow-glow focus-visible:outline-white",
  dark: "bg-carbon-900 text-elite-500 hover:bg-carbon-800 hover:shadow-lift focus-visible:outline-carbon-900",
  outline:
    "border-2 border-white/30 text-white hover:border-elite-500 hover:text-elite-500 focus-visible:outline-elite-500",
  "outline-dark":
    "border-2 border-carbon-900 text-carbon-900 hover:bg-carbon-900 hover:text-elite-500 focus-visible:outline-carbon-900",
  whatsapp:
    "bg-whatsapp text-carbon-950 hover:brightness-110 hover:shadow-[0_18px_40px_-16px_rgb(37_211_102/0.7)] focus-visible:outline-white",
  ghost: "text-carbon-200 hover:text-elite-500 focus-visible:outline-elite-500",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

type Common = {
  variant?: Variant;
  size?: Size;
  /** Inclinación del logo (por defecto activa; los "ghost" no la usan). */
  skew?: boolean;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = AsLink | AsButton;

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/**
 * Botón con la inclinación del rombo del logo. El contenido se "des-inclina"
 * para que el texto quede recto. Renderiza <Link>, <a> o <button> según `href`.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", skew = true, className, children, ...rest } = props;
  const useSkew = skew && variant !== "ghost";

  const classes = clsx(
    "btn-sweep relative inline-flex select-none items-center justify-center font-display font-bold uppercase tracking-wider",
    "transition-[background-color,box-shadow,transform,color,border-color,filter] duration-300 ease-out active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    useSkew && "skew-box",
    className,
  );
  const inner = useSkew ? <span className="unskew">{children}</span> : children;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    if (isExternal(href)) {
      const web = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {inner}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...button}>
      {inner}
    </button>
  );
}
