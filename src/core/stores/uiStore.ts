import { create } from "zustand";
import type { Product } from "@/data/products";

/**
 * Estado de interfaz compartido (no se persiste). La vista rápida guarda el
 * producto completo para no tener que cargar todo el catálogo en cada página.
 * `quickView` se conserva al cerrar para que el contenido siga visible durante
 * la animación de salida; lo que controla el diálogo es `quickViewOpen`.
 */
type UiState = {
  quickView: Product | null;
  quickViewOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
  setSearchOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  quickView: null,
  quickViewOpen: false,
  searchOpen: false,
  menuOpen: false,
  openQuickView: (p) => set({ quickView: p, quickViewOpen: true, searchOpen: false }),
  closeQuickView: () => set({ quickViewOpen: false }),
  setSearchOpen: (open) => set({ searchOpen: open, menuOpen: false }),
  setMenuOpen: (open) => set({ menuOpen: open }),
}));
