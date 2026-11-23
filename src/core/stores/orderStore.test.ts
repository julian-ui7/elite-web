import { beforeEach, describe, expect, it } from "vitest";
import {
  MAX_QTY,
  orderCount,
  orderQuoteCount,
  orderSubtotal,
  useOrderStore,
  type NewOrderItem,
} from "./orderStore";

const alicate: NewOrderItem = {
  productId: 1361,
  slug: "alicate-elite-profesional",
  name: "Alicate ELITE Profesional",
  image: "/products/alicate-elite-profesional.webp",
  variantId: 1362,
  variantLabel: '7"',
  unitPrice: 1.97,
};
const alicate8: NewOrderItem = { ...alicate, variantId: 1363, variantLabel: '8"', unitPrice: 4.07 };
const cerradura: NewOrderItem = {
  productId: 2262,
  slug: "cerradura-elite-de-pomo-acero",
  name: "Cerradura Elite de Pomo Acero",
  image: "/products/x.webp",
  variantId: null,
  variantLabel: null,
  unitPrice: null,
};

beforeEach(() => {
  localStorage.clear();
  useOrderStore.setState({ items: [], drawerOpen: false, lastAdded: null });
});

describe("orderStore", () => {
  it("agrega un ítem con cantidad 1 por defecto", () => {
    useOrderStore.getState().add(alicate);
    const { items } = useOrderStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ key: "1361:1362", qty: 1 });
  });

  it("suma la cantidad si el mismo producto y variante ya está en el pedido", () => {
    const { add } = useOrderStore.getState();
    add(alicate, 2);
    add(alicate, 3);
    expect(useOrderStore.getState().items).toHaveLength(1);
    expect(useOrderStore.getState().items[0].qty).toBe(5);
  });

  it("trata variantes distintas del mismo producto como líneas separadas", () => {
    const { add } = useOrderStore.getState();
    add(alicate);
    add(alicate8);
    expect(useOrderStore.getState().items.map((i) => i.key)).toEqual(["1361:1362", "1361:1363"]);
  });

  it("ignora cantidades no válidas al agregar", () => {
    const { add } = useOrderStore.getState();
    add(alicate, 0);
    add(alicate, -4);
    add(alicate, Number.NaN);
    expect(useOrderStore.getState().items).toHaveLength(0);
  });

  it("setQty cambia la cantidad y elimina la línea al llegar a 0", () => {
    const { add, setQty } = useOrderStore.getState();
    add(alicate);
    setQty("1361:1362", 12);
    expect(useOrderStore.getState().items[0].qty).toBe(12);
    setQty("1361:1362", 0);
    expect(useOrderStore.getState().items).toHaveLength(0);
  });

  it("limita la cantidad máxima y redondea decimales", () => {
    const { add, setQty } = useOrderStore.getState();
    add(alicate);
    setQty("1361:1362", 10 ** 9);
    expect(useOrderStore.getState().items[0].qty).toBe(MAX_QTY);
    setQty("1361:1362", 3.9);
    expect(useOrderStore.getState().items[0].qty).toBe(3);
  });

  it("remove y clear vacían el pedido", () => {
    const { add, remove, clear } = useOrderStore.getState();
    add(alicate);
    add(cerradura);
    remove("2262:0");
    expect(useOrderStore.getState().items).toHaveLength(1);
    clear();
    expect(useOrderStore.getState().items).toHaveLength(0);
  });

  it("registra el último producto agregado (para el aviso)", () => {
    useOrderStore.getState().add(alicate);
    expect(useOrderStore.getState().lastAdded?.name).toBe("Alicate ELITE Profesional");
  });

  it("persiste solo los ítems en localStorage (no el estado de la interfaz)", () => {
    useOrderStore.getState().add(alicate, 2);
    useOrderStore.getState().openDrawer();
    const saved = JSON.parse(localStorage.getItem("elite-pedido-v1") ?? "{}");
    expect(saved.state.items[0].qty).toBe(2);
    expect(saved.state).not.toHaveProperty("drawerOpen");
    expect(saved.state).not.toHaveProperty("hydrated");
  });

  it("recupera el pedido guardado al hidratar", async () => {
    useOrderStore.getState().add(alicate, 4);
    const saved = localStorage.getItem("elite-pedido-v1")!;
    // Simula una recarga: la memoria queda vacía pero localStorage conserva lo guardado
    // (setState también persiste, por eso se restaura lo guardado antes de rehidratar).
    useOrderStore.setState({ items: [] });
    localStorage.setItem("elite-pedido-v1", saved);
    await useOrderStore.persist.rehydrate();
    expect(useOrderStore.getState().items[0].qty).toBe(4);
  });
});

describe("selectores", () => {
  const items = [
    { ...alicate, key: "a", qty: 3 },
    { ...alicate8, key: "b", qty: 2 },
    { ...cerradura, key: "c", qty: 5 },
  ];

  it("cuenta unidades totales", () => {
    expect(orderCount(items)).toBe(10);
  });

  it("el subtotal solo suma ítems con precio y evita errores de coma flotante", () => {
    // 3 × 1,97 + 2 × 4,07 = 5,91 + 8,14 = 14,05
    expect(orderSubtotal(items)).toBe(14.05);
  });

  it("cuenta los ítems a cotizar", () => {
    expect(orderQuoteCount(items)).toBe(1);
  });
});
