/**
 * Las 9 categorías curadas (el sitio actual tiene 64 con duplicados y erratas).
 * Los slugs deben coincidir con scripts/fetch-products.mjs (lo verifica un test).
 * `cover` es el producto cuya foto representa la categoría.
 */
export const CATEGORY_SLUGS = [
  "herramientas",
  "agricola-jardin",
  "maquinaria",
  "ferreteria",
  "pintura",
  "automotriz",
  "seguridad",
  "electricidad",
  "hogar",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Category = {
  slug: CategorySlug;
  name: string;
  /** Ejemplos reales tomados de los productos de la categoría. */
  blurb: string;
  icon: "Wrench" | "Sprout" | "Factory" | "Cog" | "PaintRoller" | "Car" | "ShieldCheck" | "Zap" | "House";
  cover: string;
};

export const categories: readonly Category[] = [
  {
    slug: "herramientas",
    name: "Herramientas",
    blurb: "Alicates, llaves, martillos, brocas y destornilladores",
    icon: "Wrench",
    cover: "alicate-elite-profesional",
  },
  {
    slug: "agricola-jardin",
    name: "Agrícola | Jardín",
    blurb: "Machetes, palas, tijeras de podar y fumigadoras",
    icon: "Sprout",
    cover: "tijera-de-poda-extensible-elite",
  },
  {
    slug: "maquinaria",
    name: "Maquinaria",
    blurb: "Desbrozadoras, motosierras y hoyadoras",
    icon: "Factory",
    cover: "motosierra-58cc",
  },
  {
    slug: "ferreteria",
    name: "Ferretería",
    blurb: "Garruchas, amarras, tacos y tarrajas",
    icon: "Cog",
    cover: "carretilla-elite",
  },
  {
    slug: "pintura",
    name: "Pintura",
    blurb: "Brochas, rodillos, llanas y pistolas",
    icon: "PaintRoller",
    cover: "rodillo-felpa-elite",
  },
  {
    slug: "automotriz",
    name: "Automotriz",
    blurb: "Gatas, infladores y medidores de presión",
    icon: "Car",
    cover: "gatas-botella",
  },
  {
    slug: "seguridad",
    name: "Seguridad",
    blurb: "Candados, guantes, caretas y cerraduras",
    icon: "ShieldCheck",
    cover: "candado-elite-de-barril-bronce",
  },
  {
    slug: "electricidad",
    name: "Electricidad",
    blurb: "Linternas, focos LED y cautines",
    icon: "Zap",
    cover: "linternas-usb",
  },
  {
    slug: "hogar",
    name: "Acabados | Hogar",
    blurb: "Fregaderos, duchas y trapeadores",
    icon: "House",
    cover: "fregadero-multifuncion",
  },
];

const bySlug = new Map<string, Category>(categories.map((c) => [c.slug, c]));

export const getCategory = (slug: string | null | undefined) =>
  slug ? bySlug.get(slug) : undefined;

export const isCategorySlug = (v: string | null | undefined): v is CategorySlug =>
  !!v && bySlug.has(v);
