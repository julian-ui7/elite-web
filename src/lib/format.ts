import type { Product } from "@/data/products";

const money = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = (n: number) => money.format(n);

/** Texto de precio para tarjetas: "$1,97" · "Desde $1,97" · "A cotizar". */
export function priceLabel(p: Pick<Product, "price" | "priceMax">): string {
  if (p.price === null) return "A cotizar";
  if (p.priceMax !== null) return `Desde ${formatMoney(p.price)}`;
  return formatMoney(p.price);
}

/** Minúsculas, sin tildes ni espacios sobrantes (para búsquedas). */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
