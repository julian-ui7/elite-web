"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { MAX_QTY } from "@/core/stores/orderStore";

type Props = {
  value: number;
  onChange: (qty: number) => void;
  /** Mínimo permitido. Con 0 el padre decide qué hacer (p. ej. quitar la línea). */
  min?: number;
  size?: "sm" | "md";
  label: string;
  tone?: "dark" | "light";
};

/** Selector de cantidad: botones − / + y campo editable (pedidos mayoristas = cantidades grandes). */
export function QuantityStepper({ value, onChange, min = 1, size = "md", label, tone = "dark" }: Props) {
  // El campo es editable (texto) pero debe seguir al valor del padre cuando este cambia
  // (botones −/+, o el store). Patrón recomendado por React: ajustar el estado durante el render.
  const [text, setText] = useState(String(value));
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setText(String(value));
  }

  const commit = (raw: string) => {
    const n = Math.floor(Number(raw));
    const next = Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(min, n)) : value;
    setText(String(next));
    if (next !== value) onChange(next);
  };

  const dark = tone === "dark";
  const btn = clsx(
    "grid place-items-center transition-colors disabled:opacity-30",
    size === "sm" ? "size-9" : "size-11",
    dark ? "hover:bg-white/10 text-white" : "hover:bg-carbon-100 text-carbon-900",
  );

  return (
    <div
      role="group"
      aria-label={label}
      className={clsx(
        "inline-flex items-stretch overflow-hidden rounded-sm border",
        dark ? "border-white/15 bg-carbon-900" : "border-carbon-200 bg-white",
      )}
    >
      <button
        type="button"
        className={btn}
        aria-label="Disminuir cantidad"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={`${label}: cantidad`}
        value={text}
        onChange={(e) => setText(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commit((e.target as HTMLInputElement).value)}
        className={clsx(
          "text-center font-semibold tabular-nums outline-none focus-visible:bg-elite-500/15",
          size === "sm" ? "w-11 text-sm" : "w-14",
          dark ? "bg-transparent text-white" : "bg-transparent text-carbon-900",
        )}
      />
      <button
        type="button"
        className={btn}
        aria-label="Aumentar cantidad"
        disabled={value >= MAX_QTY}
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
