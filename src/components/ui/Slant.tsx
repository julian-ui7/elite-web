import type { CSSProperties } from "react";

const tokens = {
  carbon: "var(--color-carbon-900)",
  black: "var(--color-carbon-950)",
  bone: "var(--color-bone)",
  yellow: "var(--color-elite-500)",
} as const;

type Tone = keyof typeof tokens;

/**
 * Corte diagonal entre dos secciones (eco del rombo del logo).
 * `from` = color de la sección de arriba, `to` = color de la de abajo.
 */
export function Slant({ from, to, flip }: { from: Tone; to: Tone; flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="slant"
      data-flip={flip ? "" : undefined}
      style={{ "--from": tokens[from], "--to": tokens[to] } as CSSProperties}
    />
  );
}
