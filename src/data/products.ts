import raw from "./products.json";
import type { CategorySlug } from "./categories";

export type Variant = {
  id: number;
  label: string;
  sku: string | null;
  /** USD. `null` = a cotizar. */
  price: number | null;
};

export type Product = {
  id: number;
  slug: string;
  sku: string | null;
  name: string;
  brand: string | null;
  category: CategorySlug;
  description: string | null;
  image: string;
  /** Precio mínimo en USD (referencial). `null` = a cotizar. */
  price: number | null;
  /** Precio máximo cuando hay variantes con precios distintos. */
  priceMax: number | null;
  quoteOnly: boolean;
  variants: Variant[];
};

export const products = raw as Product[];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export const getProduct = (slug: string) => bySlug.get(slug);

/** Productos de una lista de slugs, en ese orden (ignora los que no existan). */
export function pickProducts(slugs: readonly string[]): Product[] {
  return slugs.map((s) => bySlug.get(s)).filter((p): p is Product => !!p);
}

export function countByCategory(): Record<CategorySlug, number> {
  const out = {} as Record<CategorySlug, number>;
  for (const p of products) out[p.category] = (out[p.category] ?? 0) + 1;
  return out;
}

/** Selección editorial para la landing (herramientas reconocibles y con foto limpia). */
export const FEATURED_SLUGS = [
  "motosierra-58cc",
  "alicate-elite-profesional",
  "gatas-botella",
  "martillos",
  "desbrozadora-profesional-bellota-db4200-s",
  "juego-de-dados-1-2-20-pzas",
  "candado-elite-de-barril-bronce",
  "llave-francesa",
  "carretilla-elite",
  "pistola-de-gravedad-400cc-elite",
  "rodillo-felpa-elite",
  "tijera-de-poda-extensible-elite",
] as const;
