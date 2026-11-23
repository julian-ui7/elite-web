import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { categories } from "@/data/categories";
import { mapsUrl, nav, site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { quoteUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer data-site-footer className="relative bg-carbon-950 text-carbon-300">
      <div className="hazard h-2" aria-hidden />
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Logo className="h-12" />
          <p className="display mt-5 text-2xl text-white">{site.slogan}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            {site.tagline}. Más de {site.yearsExperience} años de calidad y servicio equipando ferreterías en Ecuador.
          </p>
        </div>

        <div>
          <h2 className="eyebrow text-elite-500">Navegación</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[...nav, { label: "Tienda", href: "/tienda" }, { label: "Mi pedido", href: "/tienda/pedido" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-block py-1 transition-colors hover:text-elite-500">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-elite-500">Categorías</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/tienda?cat=${c.slug}`} className="inline-block py-1 transition-colors hover:text-elite-500">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-elite-500">Contáctanos</h2>
          <ul className="mt-4 space-y-3.5 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-elite-500" aria-hidden />
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-elite-500">
                {site.address.street}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-elite-500" aria-hidden />
              <span>
                <a href={`tel:${site.phone.fixedTel}`} className="inline-block py-1 hover:text-elite-500">
                  {site.phone.fixed}
                </a>
                <br />
                <a href={`tel:${site.phone.mobileTel}`} className="inline-block py-1 hover:text-elite-500">
                  {site.phone.mobile}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-whatsapp" />
              <a href={quoteUrl()} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-elite-500">
                Escríbenos por WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-elite-500" aria-hidden />
              <a href={`mailto:${site.email}`} className="inline-block py-1 hover:text-elite-500">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-elite-500" aria-hidden />
              <span>
                {site.hours.label}
                <br />
                {site.hours.short}
              </span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-carbon-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Todos los derechos reservados.</p>
          <p>Los precios son referenciales y se confirman en la cotización.</p>
        </Container>
      </div>
    </footer>
  );
}
