import { quoteUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Botón flotante de WhatsApp (cotización inmediata), dentro de un landmark propio. */
export function FloatingActions() {
  return (
    <aside data-floating aria-label="Contacto rápido">
      <a
        href={quoteUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cotizar por WhatsApp"
        className="group fixed bottom-5 right-4 z-50 flex items-center gap-3 rounded-full bg-whatsapp p-3.5 text-carbon-950 shadow-[0_14px_36px_-10px_rgb(37_211_102/0.65)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-10px_rgb(37_211_102/0.8)] focus-visible:outline-white sm:right-6"
      >
        <WhatsAppIcon className="size-7" />
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap pr-0 font-display text-base font-bold uppercase tracking-wider transition-[max-width,padding] duration-500 ease-out group-hover:max-w-44 group-hover:pr-2 group-focus-visible:max-w-44 group-focus-visible:pr-2 sm:inline">
          Cotizar ahora
        </span>
      </a>
    </aside>
  );
}
