import type { Metadata, Viewport } from "next";
import "./globals.css";
import { barlow, barlowItalic, inter } from "@/config/fonts";
import { site } from "@/data/site";
import { AddedToast } from "@/components/shop/AddedToast";
import { OrderDrawer } from "@/components/shop/OrderDrawer";
import { ProductDialog } from "@/components/shop/ProductDialog";
import { SearchDialog } from "@/components/shop/SearchDialog";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { OrderHydrator } from "@/components/layout/OrderHydrator";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/ui/RevealObserver";

const description =
  "Distribuidor de herramientas y artículos de ferretería en Ecuador. Calidad certificada, asesoría técnica en cada cotización y más de 15 años equipando ferreterías.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name} — ${site.slogan} | Herramientas y ferretería`,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    "ferretería",
    "herramientas",
    "distribuidor ferretero",
    "Ecuador",
    "herramientas agrícolas",
    "maquinaria",
    "Elite Ecuador",
  ],
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description,
  },
  // Propuesta de diseño: no se indexa salvo que se publique con NEXT_PUBLIC_INDEXABLE=true.
  robots:
    process.env.NEXT_PUBLIC_INDEXABLE === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#101214",
  colorScheme: "dark",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: site.name,
  slogan: site.slogan,
  url: site.url,
  email: site.email,
  telephone: site.phone.fixedTel,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressCountry: "EC",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:30",
    closes: "17:30",
  },
  areaServed: "EC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowItalic.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Activa los efectos de revelado solo si hay JS (el contenido nunca queda oculto sin él). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-sm bg-elite-500 px-4 py-2 font-bold text-carbon-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        <OrderDrawer />
        <ProductDialog />
        <SearchDialog />
        <AddedToast />
        <FloatingActions />
        <RevealObserver />
        <OrderHydrator />
      </body>
    </html>
  );
}
