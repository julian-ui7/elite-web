import { describe, expect, it } from "vitest";
import { validateContact } from "./contactSchema";

const valid = {
  name: "Ana",
  lastName: "Pérez",
  phone: "099 869 7360",
  email: "ana@correo.com",
  message: "Necesito cotizar",
};

describe("validateContact", () => {
  it("acepta datos válidos y recorta espacios", () => {
    const r = validateContact({ ...valid, name: "  Ana  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe("Ana");
  });

  it("acepta teléfonos con +593, paréntesis y guiones", () => {
    for (const phone of ["+593998697360", "(+593) 2-2828064", "02-2828064"]) {
      expect(validateContact({ ...valid, phone }).ok, phone).toBe(true);
    }
  });

  it("el apellido y el mensaje son opcionales", () => {
    expect(validateContact({ name: "Ana", phone: "0998697360", email: "a@b.co" }).ok).toBe(true);
  });

  it("rechaza teléfonos demasiado cortos, largos o con letras", () => {
    for (const phone of ["12345", "1".repeat(16), "099-ABC-1234"]) {
      expect(validateContact({ ...valid, phone }).ok, phone).toBe(false);
    }
  });

  it("devuelve un mensaje por cada campo inválido", () => {
    const r = validateContact({ name: "A", lastName: "", phone: "abc", email: "no-es-correo", message: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors).sort()).toEqual(["email", "name", "phone"]);
      expect(r.errors.email).toMatch(/correo/i);
    }
  });

  it("rechaza mensajes demasiado largos", () => {
    const r = validateContact({ ...valid, message: "x".repeat(1001) });
    expect(r.ok).toBe(false);
  });
});
