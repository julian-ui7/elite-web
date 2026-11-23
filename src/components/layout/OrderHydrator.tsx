"use client";

import { useEffect } from "react";
import { hydrateOrderStore } from "@/core/stores/orderStore";

/** Lee el pedido guardado en localStorage una sola vez, ya en el cliente. */
export function OrderHydrator() {
  useEffect(() => {
    hydrateOrderStore();
  }, []);
  return null;
}
