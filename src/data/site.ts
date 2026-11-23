/**
 * Única fuente de verdad de datos de la empresa y textos clave.
 * Los textos provienen del sitio actual (eliteecuador.com), con erratas corregidas.
 *
 * PENDIENTE DE CONFIRMAR CON EL CLIENTE (ver "Puntos a confirmar" del plan):
 *  - yearsExperience: la home dice "+15 años" y "Sobre nosotros" dice "doce años".
 *  - certificaciones: validar vigencia, titularidad y números antes de publicarlas.
 *  - ciudad, redes sociales, cobertura de entrega y horario de fin de semana.
 */
export const site = {
  name: "Elite Ecuador",
  slogan: "El poder en tus manos",
  tagline: "Tu Aliado Ferretero Nº1",
  url: "https://eliteecuador.com",
  yearsExperience: 15,

  phone: {
    fixed: "(+593) 2-2828064",
    fixedTel: "+59322828064",
    mobile: "(+593) 99 869 7360",
    mobileTel: "+593998697360",
    whatsapp: "593998697360",
  },
  email: "info@eliteecuador.com",
  address: {
    street: "Gabriel García Moreno N4-239 y 28 de Junio",
    country: "Ecuador",
  },
  hours: {
    label: "Lunes a Viernes",
    short: "8:30 – 17:30",
    openMinutes: 8 * 60 + 30,
    closeMinutes: 17 * 60 + 30,
    days: [1, 2, 3, 4, 5], // 0 = domingo
    timeZone: "America/Guayaquil",
  },
  /** Aún no hay redes sociales verificadas en el sitio actual. */
  social: [] as { name: string; href: string }[],
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.address.street}, ${site.address.country}`,
)}`;

export const nav = [
  { label: "Categorías", href: "/#categorias" },
  { label: "Destacados", href: "/#destacados" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Calidad", href: "/#calidad" },
  { label: "Contacto", href: "/#contacto" },
] as const;

/** Textos de "Sobre nosotros" (copia fiel del sitio actual). */
export const about = {
  history:
    "Elite ha sido proveedor líder en la comercialización de herramientas para el sector de la construcción, agrícola y ferreterías.",
  mission:
    "Impulsar el crecimiento del sector ferretero, agrícola, ganadero y de construcción, ofreciendo herramientas de calidad que fortalezcan la productividad y distribuyendo soluciones confiables y eficientes.",
  vision:
    "Ser el distribuidor de herramientas más confiable y reconocido por ferreterías y cadenas ferreteras de Ecuador.",
  objective:
    "Ser el aliado estratégico del sector ferretero, proporcionando herramientas de calidad que impulsen la productividad y apoyando el desarrollo económico de Ecuador.",
} as const;

export const valueProps = [
  {
    icon: "ShieldCheck",
    title: "Calidad Garantizada",
    text: "Productos de alto rendimiento, diseñados para resistir las exigencias del trabajo profesional e industrial.",
  },
  {
    icon: "Headset",
    title: "Atención Personalizada",
    text: "Asesoría técnica en cada cotización. Te ayudamos a armar pedidos inteligentes según la demanda de tu negocio.",
  },
  {
    icon: "Award",
    title: `+${site.yearsExperience} Años de Experiencia`,
    text: `Nuestra trayectoria es tu mejor garantía. Más de ${site.yearsExperience} años equipando ferreterías en Ecuador con seriedad y cumplimiento.`,
  },
] as const;

export const certifications = [
  { id: "ce", name: "CE", src: "/certs/ce.jpg" },
  { id: "iaf", name: "IAF", src: "/certs/iaf.jpg" },
  { id: "intertek", name: "Intertek", src: "/certs/intertek.jpg" },
  { id: "iso9001", name: "ISO 9001", src: "/certs/iso9001.jpg" },
  { id: "iso14001", name: "ISO 14001", src: "/certs/iso14001.jpg" },
  { id: "gs", name: "GS", src: "/certs/gs.jpg" },
  { id: "cnas", name: "CNAS", src: "/certs/cnas.jpg" },
] as const;

export const certificationPoints = [
  {
    title: "Calidad garantizada y certificada",
    text: "Nuestros certificados avalan que cada producto y nuestro proceso de manufactura cumplen con los más altos estándares internacionales de calidad y rendimiento.",
  },
  {
    title: "Confianza y respaldo empresarial",
    text: "Contamos con certificaciones de gestión empresarial que demuestran nuestro compromiso con la transparencia, la mejora continua y la eficiencia operativa.",
  },
  {
    title: "Durabilidad y rendimiento superior",
    text: "Las pruebas rigurosas exigidas por nuestras certificaciones aseguran que las herramientas Elite están construidas para durar en condiciones de uso profesional y continuo.",
  },
  {
    title: "Cumplimiento de normativas",
    text: "Nuestros productos y operaciones cumplen con las normativas técnicas y legales vigentes, minimizando riesgos y garantizando un uso seguro.",
  },
] as const;

export const process = [
  {
    title: "Cuéntanos qué necesita tu negocio",
    text: "Escríbenos por WhatsApp o arma tu lista directamente desde el catálogo.",
  },
  {
    title: "Recibe asesoría técnica y cotización",
    text: "Te ayudamos a armar pedidos inteligentes según la demanda de tu ferretería.",
  },
  {
    title: "Confirma tu pedido",
    text: "Coordinamos tu pedido con la seriedad y el cumplimiento que nos respaldan.",
  },
] as const;
