import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  as?: "h2" | "h1";
};

/** Encabezado de sección: etiqueta "/// categoría", título display y bajada. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "dark",
  align = "left",
  className,
  as: Tag = "h2",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={clsx("reveal max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={clsx("eyebrow", dark ? "text-elite-500" : "text-carbon-600")}>
        <span aria-hidden className={clsx("mr-2", dark ? "text-elite-500" : "text-carbon-900")}>
          {"///"}
        </span>
        {eyebrow}
      </p>
      <Tag
        className={clsx(
          "display mt-3 text-[clamp(2.5rem,6vw,4.5rem)]",
          dark ? "text-white" : "text-carbon-900",
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p
          className={clsx(
            "mt-5 max-w-2xl text-lg leading-relaxed",
            align === "center" && "mx-auto",
            dark ? "text-carbon-300" : "text-carbon-500",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
