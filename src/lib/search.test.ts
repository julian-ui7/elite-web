import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { formatMoney, normalize, priceLabel } from "./format";
import { searchProducts } from "./search";

describe("normalize", () => {
  it("quita tildes, mayúsculas y espacios repetidos", () => {
    expect(normalize("  Agrícola   JARDÍN ")).toBe("agricola jardin");
  });
});

describe("formato de precios", () => {
  it("usa coma decimal y símbolo $", () => {
    expect(formatMoney(1.97)).toMatch(/^\$\s?1,97$/);
  });

  it("describe rango, precio fijo y cotización", () => {
    expect(priceLabel({ price: 1.97, priceMax: 4.07 })).toMatch(/^Desde /);
    expect(priceLabel({ price: 3.5, priceMax: null })).toMatch(/3,50/);
    expect(priceLabel({ price: null, priceMax: null })).toBe("A cotizar");
  });
});

describe("searchProducts", () => {
  it("encuentra sin importar tildes ni mayúsculas", () => {
    const a = searchProducts(products, { q: "FUMIGADORA" });
    const b = searchProducts(products, { q: "fumigadora" });
    expect(a.length).toBeGreaterThan(3);
    expect(a.map((p) => p.id)).toEqual(b.map((p) => p.id));
    expect(searchProducts(products, { q: "guadana" }).length).toBe(
      searchProducts(products, { q: "guadaña" }).length,
    );
  });

  it("exige que coincidan todas las palabras", () => {
    const r = searchProducts(products, { q: "machete bellota" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => /machete/i.test(p.name) && /bellota/i.test(p.name))).toBe(true);
  });

  it("filtra por categoría e ignora categorías inexistentes", () => {
    const cat = searchProducts(products, { cat: "pintura" });
    expect(cat.length).toBeGreaterThan(0);
    expect(cat.every((p) => p.category === "pintura")).toBe(true);
    expect(searchProducts(products, { cat: "no-existe" })).toHaveLength(products.length);
  });

  it("pone primero las coincidencias al inicio del nombre", () => {
    const r = searchProducts(products, { q: "llave" });
    expect(r[0].name.toLowerCase().startsWith("llave")).toBe(true);
  });

  it("ordena por precio y deja los 'a cotizar' al final en ambos sentidos", () => {
    for (const sort of ["precio-asc", "precio-desc"] as const) {
      const r = searchProducts(products, { sort });
      const firstQuote = r.findIndex((p) => p.price === null);
      expect(firstQuote).toBeGreaterThan(-1);
      expect(r.slice(firstQuote).every((p) => p.price === null)).toBe(true);
    }
    const asc = searchProducts(products, { sort: "precio-asc" }).filter((p) => p.price !== null);
    for (let i = 1; i < asc.length; i++) expect(asc[i].price!).toBeGreaterThanOrEqual(asc[i - 1].price!);
  });

  it("devuelve lista vacía si nada coincide", () => {
    expect(searchProducts(products, { q: "zzzzxxxx" })).toEqual([]);
  });
});
