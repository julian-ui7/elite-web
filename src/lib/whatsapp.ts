import { site } from "@/data/site";
import type { OrderItem } from "@/core/stores/orderStore";
import { orderQuoteCount, orderSubtotal } from "@/core/stores/orderStore";
import { formatMoney } from "./format";

/** Los navegadores/WhatsApp recortan URLs muy largas; dejamos margen. */
export const MAX_ENCODED_LENGTH = 3800;

export type Customer = {
  name?: string;
  company?: string;
  phone?: string;
  city?: string;
  notes?: string;
};

export function whatsappUrl(message: string, number: string = site.phone.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const GENERIC_QUOTE_MESSAGE =
  "Hola Elite Ecuador 👋, quisiera solicitar una cotización.";

export const quoteUrl = () => whatsappUrl(GENERIC_QUOTE_MESSAGE);

function itemLine(i: OrderItem, n: number): string {
  const variant = i.variantLabel ? ` — ${i.variantLabel}` : "";
  const price = i.unitPrice === null ? "a cotizar" : `${formatMoney(i.unitPrice)} c/u`;
  return `${n}. ${i.name}${variant} · x${i.qty} · ${price}`;
}

function customerBlock(c?: Customer): string[] {
  if (!c) return [];
  const rows: [string, string | undefined][] = [
    ["Nombre", c.name],
    ["Ferretería / empresa", c.company],
    ["Teléfono", c.phone],
    ["Ciudad", c.city],
  ];
  const lines = rows.filter(([, v]) => v?.trim()).map(([k, v]) => `${k}: ${v!.trim()}`);
  if (c.notes?.trim()) lines.push(`Notas: ${c.notes.trim()}`);
  return lines.length ? ["", ...lines] : [];
}

/** Texto plano del pedido: sirve para WhatsApp, copiar al portapapeles o correo. */
export function buildOrderMessage(items: readonly OrderItem[], customer?: Customer): string {
  const quotes = orderQuoteCount(items);
  const footer = [
    "",
    `Total referencial: ${formatMoney(orderSubtotal(items))}` +
      (quotes ? ` (más ${quotes} ${quotes === 1 ? "ítem" : "ítems"} a cotizar)` : ""),
    "Los precios son referenciales y están sujetos a confirmación.",
    ...customerBlock(customer),
  ];
  const head = ["Hola Elite Ecuador 👋, quisiera cotizar este pedido:", ""];
  const lines = items.map((i, idx) => itemLine(i, idx + 1));
  return [...head, ...lines, ...footer].join("\n");
}

/**
 * URL de WhatsApp con el pedido. Si el texto es demasiado largo para una URL,
 * recorta la lista de ítems y lo avisa en el mensaje (el usuario puede "Copiar pedido").
 */
export function buildOrderUrl(items: readonly OrderItem[], customer?: Customer) {
  let shown = items.length;
  let message = buildOrderMessage(items, customer);
  while (encodeURIComponent(message).length > MAX_ENCODED_LENGTH && shown > 1) {
    shown = Math.max(1, Math.floor(shown * 0.8));
    const rest = items.length - shown;
    const trimmed = buildOrderMessage(items.slice(0, shown), customer);
    message = `${trimmed}\n\n… y ${rest} ${rest === 1 ? "ítem más" : "ítems más"} (te los envío en otro mensaje).`;
  }
  return { url: whatsappUrl(message), message, truncated: shown < items.length };
}

export type ContactForm = {
  name: string;
  lastName?: string;
  phone: string;
  email: string;
  message?: string;
};

export function buildContactMessage(f: ContactForm): string {
  const fullName = [f.name, f.lastName].filter((x) => x?.trim()).join(" ");
  return [
    "Hola Elite Ecuador 👋, les escribo desde su página web.",
    "",
    `Nombre: ${fullName}`,
    `Teléfono: ${f.phone}`,
    `Correo: ${f.email}`,
    ...(f.message?.trim() ? ["", f.message.trim()] : []),
  ].join("\n");
}

export const mailtoUrl = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
