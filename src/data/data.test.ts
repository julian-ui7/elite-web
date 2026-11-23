import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORY_SLUGS, categories } from "./categories";
import { FEATURED_SLUGS, getProduct, products } from "./products";
import { certifications } from "./site";

const root = path.resolve(__dirname, "../..");

describe("catálogo importado", () => {
  it("tiene los 202 productos del sitio actual, sin slugs ni ids repetidos", () => {
    expect(products).toHaveLength(202);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it("todos los productos tienen una categoría curada válida", () => {
    for (const p of products) expect(CATEGORY_SLUGS).toContain(p.category);
  });

  it("no queda ninguna entidad HTML en los nombres", () => {
    for (const p of products) expect(p.name).not.toMatch(/&#?\w+;/);
  });

  it("los productos 'a cotizar' no exponen el precio de relleno", () => {
    for (const p of products.filter((x) => x.quoteOnly)) expect(p.price).toBeNull();
    const all = products.flatMap((p) => [p.price, p.priceMax, ...p.variants.map((v) => v.price)]);
    expect(all).not.toContain(99);
    expect(all).not.toContain(99.99);
  });

  it("los precios mínimo/máximo son coherentes con las variantes", () => {
    for (const p of products.filter((x) => x.variants.length && x.price !== null)) {
      const prices = p.variants.map((v) => v.price).filter((v): v is number => v !== null);
      expect(p.price).toBe(Math.min(...prices));
      if (p.priceMax !== null) expect(p.priceMax).toBe(Math.max(...prices));
    }
  });

  it("cada producto tiene su imagen optimizada en /public", () => {
    const missing = products.filter((p) => !existsSync(path.join(root, "public", p.image)));
    expect(missing.map((p) => p.slug)).toEqual([]);
  });
});

describe("categorías curadas", () => {
  it("son 9 y cada una tiene productos y una portada que existe", () => {
    expect(categories).toHaveLength(9);
    for (const c of categories) {
      expect(products.some((p) => p.category === c.slug), c.slug).toBe(true);
      expect(getProduct(c.cover), `portada de ${c.slug}`).toBeDefined();
    }
  });

  it("coinciden con las del script de importación (scripts/fetch-products.mjs)", () => {
    const script = readFileSync(path.join(root, "scripts/fetch-products.mjs"), "utf8");
    const block = script.match(/const PRIORITY = \[([\s\S]*?)\];/)?.[1] ?? "";
    const inScript = [...block.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]).sort();
    expect(inScript).toEqual([...CATEGORY_SLUGS].sort());
  });
});

describe("selección y marca", () => {
  it("los productos destacados existen", () => {
    for (const slug of FEATURED_SLUGS) expect(getProduct(slug), slug).toBeDefined();
  });

  it("existen el logo y los 7 certificados", () => {
    expect(existsSync(path.join(root, "public/brand/logo-elite.png"))).toBe(true);
    expect(certifications).toHaveLength(7);
    for (const c of certifications) expect(existsSync(path.join(root, "public", c.src)), c.src).toBe(true);
  });
});
