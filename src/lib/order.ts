import type { NewOrderItem } from "@/core/stores/orderStore";
import type { Product, Variant } from "@/data/products";

/** Convierte un producto (y variante elegida) en una línea de pedido. */
export function toOrderItem(product: Product, variant?: Variant | null): NewOrderItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    variantId: variant?.id ?? null,
    variantLabel: variant?.label ?? null,
    unitPrice: variant ? variant.price : product.price,
  };
}
