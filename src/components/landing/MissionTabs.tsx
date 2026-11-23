"use client";

import { useId, useRef, useState } from "react";
import clsx from "clsx";

type Tab = { id: string; label: string; text: string };

/** Pestañas accesibles (flechas, Inicio/Fin) para Misión · Visión · Objetivo. */
export function MissionTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (active + 1) % tabs.length
      : e.key === "ArrowLeft" ? (active - 1 + tabs.length) % tabs.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="relative overflow-hidden rounded-md bg-carbon-800 ring-1 ring-white/10">
      <div role="tablist" aria-label="Misión, visión y objetivo" onKeyDown={onKeyDown} className="flex border-b border-white/10">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={clsx(
              "relative flex-1 px-4 py-4 font-display text-xl font-bold uppercase tracking-wider transition-colors",
              i === active ? "text-carbon-900" : "text-carbon-300 hover:text-white",
            )}
          >
            {i === active && <span aria-hidden className="absolute inset-0 -z-0 bg-elite-500 [clip-path:polygon(6%_0,100%_0,94%_100%,0_100%)]" />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="relative p-7 sm:p-10"
        >
          <span
            aria-hidden
            className="display pointer-events-none absolute -bottom-4 -right-1 text-[5.5rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(248_220_21/0.22)] sm:-right-2 sm:-top-6 sm:bottom-auto sm:text-[9rem]"
          >
            0{i + 1}
          </span>
          <p className="relative max-w-xl font-display text-[1.7rem] font-semibold leading-snug text-white sm:text-3xl">
            {t.text}
          </p>
        </div>
      ))}
    </div>
  );
}
