import type { Product } from "@/data/products";
import { getCategory, isCategorySlug, type CategorySlug } from "@/data/categories";
import { normalize } from "./format";

export const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevancia" },
  { value: "nombre", label: "Nombre (A–Z)" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const isSortKey = (v: string | null | undefined): v is SortKey =>
  SORT_OPTIONS.some((o) => o.value === v);

export type Filters = {
  q?: string;
  cat?: CategorySlug | string | null;
  sort?: SortKey;
};

const haystacks = new WeakMap<Product, string>();
function haystack(p: Product): string {
  let h = haystacks.get(p);
  if (!h) {
    h = normalize(
      [p.name, p.brand ?? "", getCategory(p.category)?.name ?? "", p.description ?? ""].join(" "),
    );
    haystacks.set(p, h);
  }
  return h;
}

function score(p: Product, tokens: string[]): number {
  const name = normalize(p.name);
  let s = 0;
  for (const t of tokens) {
    if (name.startsWith(t)) s += 4;
    else if (name.includes(` ${t}`)) s += 3;
    else if (name.includes(t)) s += 2;
    else s += 1; // coincidencia en marca / categoría / descripción
  }
  return s;
}

const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "es");

/** Los productos "a cotizar" van siempre al final al ordenar por precio. */
function byPrice(dir: 1 | -1) {
  return (a: Product, b: Product) => {
    if (a.price === null && b.price === null) return byName(a, b);
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return (a.price - b.price) * dir || byName(a, b);
  };
}

export function searchProducts(list: readonly Product[], f: Filters = {}): Product[] {
  const tokens = normalize(f.q ?? "")
    .split(" ")
    .filter(Boolean);
  const cat = isCategorySlug(f.cat as string) ? f.cat : null;

  let out = list.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (!tokens.length) return true;
    const h = haystack(p);
    return tokens.every((t) => h.includes(t));
  });

  switch (f.sort) {
    case "nombre":
      out = out.sort(byName);
      break;
    case "precio-asc":
      out = out.sort(byPrice(1));
      break;
    case "precio-desc":
      out = out.sort(byPrice(-1));
      break;
    default:
      out = tokens.length
        ? out
            .map((p) => ({ p, s: score(p, tokens) }))
            .sort((a, b) => b.s - a.s || byName(a.p, b.p))
            .map((x) => x.p)
        : out.sort(byName);
  }
  return out;
}
