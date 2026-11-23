import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Pedido / lista de cotización. Vive solo en el navegador (localStorage):
 * esta propuesta no tiene backend ni pasarela de pago.
 */
export type OrderItem = {
  /** `${productId}:${variantId ?? 0}` */
  key: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  variantId: number | null;
  variantLabel: string | null;
  /** Precio unitario referencial en USD. `null` = a cotizar. */
  unitPrice: number | null;
  qty: number;
};

export type NewOrderItem = Omit<OrderItem, "key" | "qty">;

export const MAX_QTY = 9999;

type OrderState = {
  items: OrderItem[];
  /** `true` cuando ya se leyó localStorage (evita desajustes de hidratación). */
  hydrated: boolean;
  drawerOpen: boolean;
  lastAdded: { name: string; at: number } | null;

  add: (item: NewOrderItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const itemKey = (productId: number, variantId: number | null) =>
  `${productId}:${variantId ?? 0}`;

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n) || 0));

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      drawerOpen: false,
      lastAdded: null,

      add: (item, qty = 1) =>
        set((s) => {
          const add = clampQty(qty);
          if (add === 0) return s;
          const key = itemKey(item.productId, item.variantId);
          const existing = s.items.find((i) => i.key === key);
          const items = existing
            ? s.items.map((i) =>
                i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + add) } : i,
              )
            : [...s.items, { ...item, key, qty: add }];
          return { items, lastAdded: { name: item.name, at: Date.now() } };
        }),

      setQty: (key, qty) =>
        set((s) => {
          const q = clampQty(qty);
          return {
            items:
              q === 0
                ? s.items.filter((i) => i.key !== key)
                : s.items.map((i) => (i.key === key ? { ...i, qty: q } : i)),
          };
        }),

      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "elite-pedido-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      // Se hidrata en un efecto (OrderHydrator) para que servidor y cliente rendericen igual.
      skipHydration: true,
    },
  ),
);

/** Lee localStorage una sola vez en el cliente. */
export function hydrateOrderStore() {
  return Promise.resolve(useOrderStore.persist.rehydrate()).finally(() =>
    useOrderStore.setState({ hydrated: true }),
  );
}

// ---- selectores puros ----------------------------------------------------

export const orderCount = (items: readonly OrderItem[]) =>
  items.reduce((n, i) => n + i.qty, 0);

/** Suma solo los ítems con precio; los "a cotizar" no entran. */
export const orderSubtotal = (items: readonly OrderItem[]) =>
  Math.round(
    items.reduce((sum, i) => sum + (i.unitPrice === null ? 0 : i.unitPrice * i.qty), 0) * 100,
  ) / 100;

export const orderQuoteCount = (items: readonly OrderItem[]) =>
  items.filter((i) => i.unitPrice === null).length;
