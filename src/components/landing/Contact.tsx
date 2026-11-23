import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { mapsUrl, site } from "@/data/site";
import { quoteUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { OpenNowBadge } from "./OpenNowBadge";

const card =
  "group flex gap-4 rounded-md bg-carbon-800 p-5 ring-1 ring-white/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:ring-elite-500/60";
const iconBox = "skew-box grid size-11 shrink-0 place-items-center bg-elite-500 text-carbon-900";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative bg-carbon-900 py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Contacto"
            title={
              <span id="contacto-title">
                Hablemos de <span className="text-elite-500">tu pedido</span>
              </span>
            }
            lede="Escríbenos por WhatsApp, llámanos o visítanos. Te asesoramos en cada cotización."
          />

          <div className="reveal mt-6 [--d:100ms]">
            <OpenNowBadge />
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            <li className="reveal sm:col-span-2" style={{ "--d": "120ms" } as React.CSSProperties}>
              <a href={quoteUrl()} target="_blank" rel="noopener noreferrer" className={card}>
                <span className={`${iconBox} !bg-whatsapp`}>
                  <span className="unskew">
                    <WhatsAppIcon className="size-5" />
                  </span>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-carbon-400">WhatsApp</span>
                  <span className="mt-0.5 block text-lg font-semibold text-white">{site.phone.mobile}</span>
                  <span className="text-sm text-carbon-300">Respuesta rápida en horario de atención</span>
                </span>
              </a>
            </li>
            <li className="reveal" style={{ "--d": "180ms" } as React.CSSProperties}>
              <a href={`tel:${site.phone.fixedTel}`} className={card}>
                <span className={iconBox}>
                  <span className="unskew">
                    <Phone className="size-5" aria-hidden />
                  </span>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-carbon-400">Teléfono fijo</span>
                  <span className="mt-0.5 block font-semibold text-white">{site.phone.fixed}</span>
                </span>
              </a>
            </li>
            <li className="reveal" style={{ "--d": "240ms" } as React.CSSProperties}>
              <a href={`mailto:${site.email}`} className={card}>
                <span className={iconBox}>
                  <span className="unskew">
                    <Mail className="size-5" aria-hidden />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-carbon-400">Correo</span>
                  <span className="mt-0.5 block text-[15px] font-semibold text-white [overflow-wrap:anywhere]">{site.email}</span>
                </span>
              </a>
            </li>
            <li className="reveal" style={{ "--d": "300ms" } as React.CSSProperties}>
              <div className={card}>
                <span className={iconBox}>
                  <span className="unskew">
                    <Clock className="size-5" aria-hidden />
                  </span>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-carbon-400">Horario de atención</span>
                  <span className="mt-0.5 block font-semibold text-white">{site.hours.label}</span>
                  <span className="text-sm text-carbon-300">{site.hours.short}</span>
                </span>
              </div>
            </li>
            <li className="reveal" style={{ "--d": "360ms" } as React.CSSProperties}>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={card}>
                <span className={iconBox}>
                  <span className="unskew">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-carbon-400">Dirección</span>
                  <span className="mt-0.5 block font-semibold text-white">{site.address.street}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-elite-500">
                    <Navigation className="size-3.5" aria-hidden /> Cómo llegar
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="reveal [--d:200ms]">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
