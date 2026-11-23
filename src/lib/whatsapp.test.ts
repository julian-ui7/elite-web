import { describe, expect, it } from "vitest";
import type { OrderItem } from "@/core/stores/orderStore";
import {
  MAX_ENCODED_LENGTH,
  buildContactMessage,
  buildOrderMessage,
  buildOrderUrl,
  quoteUrl,
  whatsappUrl,
} from "./whatsapp";

const item = (n: number, over: Partial<OrderItem> = {}): OrderItem => ({
  key: `${n}:0`,
  productId: n,
  slug: `producto-${n}`,
  name: `Producto de prueba número ${n} con nombre largo`,
  image: "/x.webp",
  variantId: null,
  variantLabel: null,
  unitPrice: 2.5,
  qty: 2,
  ...over,
});

const decode = (url: string) => decodeURIComponent(url.split("?text=")[1]);

describe("whatsappUrl", () => {
  it("apunta al WhatsApp de Elite y codifica el texto", () => {
    const url = whatsappUrl("Hola & adiós ñ");
    expect(url.startsWith("https://wa.me/593998697360?text=")).toBe(true);
    expect(decode(url)).toBe("Hola & adiós ñ");
  });

  it("quoteUrl abre un mensaje genérico de cotización", () => {
    expect(decode(quoteUrl())).toContain("cotización");
  });
});

describe("buildOrderMessage", () => {
  it("lista cada ítem con cantidad, variante y precio, y el total referencial", () => {
    const msg = buildOrderMessage([
      item(1, { name: "Alicate", variantLabel: '7"', unitPrice: 1.97, qty: 3 }),
      item(2, { name: "Cerradura", unitPrice: null, qty: 1 }),
    ]);
    expect(msg).toContain('1. Alicate — 7" · x3 ·');
    expect(msg).toContain("1,97");
    expect(msg).toContain("2. Cerradura · x1 · a cotizar");
    expect(msg).toContain("Total referencial");
    expect(msg).toContain("más 1 ítem a cotizar");
    expect(msg).toContain("referenciales");
  });

  it("incluye solo los datos del cliente que fueron llenados", () => {
    const msg = buildOrderMessage([item(1)], { name: "Ana", company: "  ", city: "Quito" });
    expect(msg).toContain("Nombre: Ana");
    expect(msg).toContain("Ciudad: Quito");
    expect(msg).not.toContain("Ferretería / empresa");
    expect(msg).not.toContain("Teléfono");
  });
});

describe("buildOrderUrl", () => {
  it("no recorta pedidos normales", () => {
    const r = buildOrderUrl([item(1), item(2), item(3)]);
    expect(r.truncated).toBe(false);
    expect(decode(r.url)).toBe(r.message);
  });

  it("recorta pedidos enormes para no pasar el límite de la URL y lo avisa", () => {
    const many = Array.from({ length: 150 }, (_, i) => item(i + 1));
    const r = buildOrderUrl(many);
    expect(r.truncated).toBe(true);
    expect(encodeURIComponent(r.message).length).toBeLessThan(MAX_ENCODED_LENGTH + 400);
    expect(r.message).toMatch(/… y \d+ ítems más/);
    expect(r.message).toContain("1. Producto de prueba número 1");
  });
});

describe("buildContactMessage", () => {
  it("arma el mensaje del formulario de contacto", () => {
    const msg = buildContactMessage({
      name: "Ana",
      lastName: "Pérez",
      phone: "0998697360",
      email: "ana@correo.com",
      message: "Necesito cotizar machetes",
    });
    expect(msg).toContain("Nombre: Ana Pérez");
    expect(msg).toContain("ana@correo.com");
    expect(msg).toContain("Necesito cotizar machetes");
  });
});
