import { describe, expect, it } from "vitest";
import { getOpenStatus } from "./hours";

// Ecuador = UTC−5 todo el año (sin horario de verano). Lunes 2026-11-16.
const at = (isoLocal: string) => new Date(`${isoLocal}-05:00`);

describe("getOpenStatus (horario L–V 8:30–17:30, America/Guayaquil)", () => {
  it("abierto en horario laboral", () => {
    expect(getOpenStatus(at("2026-11-16T10:00:00"))).toEqual({
      open: true,
      label: "Abierto ahora · cerramos a las 17:30",
    });
  });

  it("abre justo a las 8:30 y cierra justo a las 17:30", () => {
    expect(getOpenStatus(at("2026-11-16T08:30:00")).open).toBe(true);
    expect(getOpenStatus(at("2026-11-16T08:29:00")).open).toBe(false);
    expect(getOpenStatus(at("2026-11-16T17:29:00")).open).toBe(true);
    expect(getOpenStatus(at("2026-11-16T17:30:00")).open).toBe(false);
  });

  it("antes de abrir dice que abre hoy", () => {
    expect(getOpenStatus(at("2026-11-17T07:00:00")).label).toBe("Cerrado ahora · abrimos hoy a las 8:30");
  });

  it("después de cerrar entre semana dice que abre mañana", () => {
    expect(getOpenStatus(at("2026-11-17T19:00:00")).label).toBe("Cerrado ahora · abrimos mañana a las 8:30");
  });

  it("viernes tarde y sábado: abre el lunes", () => {
    for (const d of ["2026-11-20T18:00:00", "2026-11-21T11:00:00"]) {
      expect(getOpenStatus(at(d)).label).toBe("Cerrado ahora · abrimos el lunes a las 8:30");
    }
  });

  it("domingo: el siguiente día hábil es el lunes, o sea mañana", () => {
    expect(getOpenStatus(at("2026-11-22T11:00:00")).label).toBe("Cerrado ahora · abrimos mañana a las 8:30");
  });

  it("usa la hora de Ecuador aunque el visitante esté en otra zona (misma instancia UTC)", () => {
    // 15:00 UTC = 10:00 en Guayaquil
    expect(getOpenStatus(new Date("2026-11-16T15:00:00Z")).open).toBe(true);
    // 03:00 UTC del martes = 22:00 del lunes en Guayaquil
    expect(getOpenStatus(new Date("2026-11-17T03:00:00Z")).open).toBe(false);
  });
});
