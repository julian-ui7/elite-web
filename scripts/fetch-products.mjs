/**
 * Importa el catálogo actual de eliteecuador.com (Store API pública de WooCommerce)
 * y genera los datos locales de la mini-tienda:
 *
 *   src/data/products.json     catálogo normalizado (categorías curadas, precios limpios)
 *   public/products/*.webp     imágenes optimizadas
 *   public/brand/*, public/certs/*   logo y certificados del sitio actual
 *
 * Uso:
 *   npm run data:products              usa la caché si existe (no vuelve a llamar al servidor)
 *   npm run data:products -- --refresh vuelve a descargar todo desde el sitio
 *   npm run data:products -- --images  vuelve a descargar/optimizar imágenes aunque existan
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ORIGIN = "https://eliteecuador.com";
const API = `${ORIGIN}/wp-json/wc/store/v1/products`;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "scripts", ".cache", "raw.json");
const OUT_JSON = path.join(ROOT, "src", "data", "products.json");
const OUT_IMG = path.join(ROOT, "public", "products");

const args = new Set(process.argv.slice(2));
const REFRESH = args.has("--refresh");
const FORCE_IMAGES = args.has("--images");

/** Precios de relleno que el cliente dejó en la tienda (99,00 y 99,99) → "Cotizar". */
const PLACEHOLDER_CENTS = new Set([9900, 9999]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true, () => false);

async function getJson(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === tries) throw new Error(`${url}: ${err.message}`);
      await sleep(600 * i);
    }
  }
}

// ---------------------------------------------------------------- texto
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function decode(str = "") {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
}
const stripHtml = (html = "") =>
  decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const norm = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ---------------------------------------------------------------- categorías
/** Debe coincidir con src/data/categories.ts (hay un test que lo verifica). */
const PRIORITY = [
  "seguridad",
  "maquinaria",
  "automotriz",
  "electricidad",
  "pintura",
  "agricola-jardin",
  "herramientas",
  "hogar",
  "ferreteria",
];

/** Reglas por nombre: tienen prioridad porque las categorías de origen están mal etiquetadas. */
const NAME_RULES = [
  ["ferreteria", /amarra|garrucha|tacos fisher|pie de amigo|yee elite|mangueras? de (aire|gas)/],
  ["seguridad", /guante|gafas|orejera|careta|vidrios solares|candado|cinta peligro|cerradura|cerrojo/],
  ["maquinaria", /desbrozadora|motosierra|hoyadora|compresor|fumigadora .*motor|carrete|hilo elite|disco circular|cuchilla (corbat|g\.?preafilada|pulida)|acople elite/],
  ["automotriz", /\bgatas?\b|llave de rueda|inflador|medidor de presion|inflar|bateria|tanque de gasolina/],
  ["electricidad", /linterna|foco led|cautin/],
  ["pintura", /brocha|rodillo|llana|espatula|bandeja elite para pintura|pistola de gravedad|pulverizadora elite|\bgrata\b/],
  ["hogar", /ducha|fregadero|trapeador|cocina/],
  ["herramientas", /broca|destornill?ador|^dado /],
];

/** Categoría de origen (WooCommerce) → categoría curada. */
const SOURCE_MAP = {
  agricola: "agricola-jardin",
  jardineria: "agricola-jardin",
  "herramientas-de-jardin": "agricola-jardin",
  fumigadoras: "agricola-jardin",
  machetes: "agricola-jardin",
  palas: "agricola-jardin",
  "herramienta-agricola": "agricola-jardin",
  serruchos: "agricola-jardin",
  "tijera-de-podar": "agricola-jardin",
  "tijera-de-cesped": "agricola-jardin",
  "tijera-de-flor": "agricola-jardin",
  manguera: "agricola-jardin",
  escoba: "agricola-jardin",
  cuchillas: "agricola-jardin",
  "maquinaria-agricola": "maquinaria",
  desbrozadora: "maquinaria",
  guadana: "maquinaria",
  motoguadana: "maquinaria",
  "moto-guadana": "maquinaria",
  "compresores-y-accesorios": "maquinaria",
  pintura: "pintura",
  mecanica: "herramientas",
  carpinteria: "herramientas",
  "herramientas-de-corte": "herramientas",
  "herramientas-de-medicion": "herramientas",
  "martillos-y-combos": "herramientas",
  "herramientas-manuales": "herramientas",
  "herramientas-electricas": "herramientas", // el cliente etiqueta así llaves y destornilladores
  construccion: "herramientas",
  ferreteria: "ferreteria",
  "sujecion-y-anclaje": "ferreteria",
  "pernos-y-tornilos": "ferreteria",
  garruchas: "ferreteria",
  soporte: "ferreteria",
  herreria: "ferreteria",
  acero: "ferreteria",
  "cepillo-acero": "ferreteria",
  metalmecanica: "ferreteria",
  soldadura: "ferreteria",
  plomeria: "ferreteria",
  fontaneria: "ferreteria",
  tuberias: "ferreteria",
  carga: "ferreteria",
  carretilla: "ferreteria",
  automotriz: "automotriz",
  "automotriz-mecanica": "automotriz",
  gata: "automotriz",
  "herramientas-neumaticas-y-accesorios": "automotriz",
  "medicion-neumatica": "automotriz",
  hogar: "hogar",
  bano: "hogar",
  cocina: "hogar",
  fregadero: "hogar",
  "set-de-ducha": "hogar",
  iluminacion: "electricidad",
  linternas: "electricidad",
  seguridad: "seguridad",
  "seguridad-industrial": "seguridad",
  "seguridad-industrial-ferreteria": "seguridad",
  bioseguridad: "seguridad",
  proteccion: "seguridad",
  reflectivos: "seguridad",
};

function classify(name, sourceSlugs) {
  const n = norm(name);
  for (const [cat, re] of NAME_RULES) if (re.test(n)) return cat;
  const votes = new Map();
  for (const s of sourceSlugs) {
    const cat = SOURCE_MAP[s];
    if (cat) votes.set(cat, (votes.get(cat) ?? 0) + 1);
  }
  if (!votes.size) return "ferreteria";
  return [...votes.entries()].sort(
    (a, b) => b[1] - a[1] || PRIORITY.indexOf(a[0]) - PRIORITY.indexOf(b[0]),
  )[0][0];
}

const BRANDS = ["Bellota", "Gavilan", "Incolma", "Travex", "Fisher", "Elite"];
function detectBrand(name) {
  const n = norm(name);
  return BRANDS.find((b) => n.includes(b.toLowerCase())) ?? null;
}

// ---------------------------------------------------------------- precios
const cents = (v) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : null;
};
const toUsd = (c) => (c === null || PLACEHOLDER_CENTS.has(c) ? null : c / 100);

function variantLabel(v) {
  if (Array.isArray(v.attributes) && v.attributes.length) {
    return v.attributes.map((a) => decode(a.value)).join(" · ");
  }
  // "Dimensión: 4.5″" | "COLOR: Gris, Media: 12 x 14"
  return decode(v.variation ?? "")
    .split(/,\s*(?=[^:,]+:)/)
    .map((part) => part.replace(/^[^:]+:\s*/, ""))
    .join(" · ");
}

// ---------------------------------------------------------------- descarga
async function loadRaw() {
  if (!REFRESH && (await exists(CACHE))) {
    console.log("· usando caché local (--refresh para volver a descargar)");
    return JSON.parse(await readFile(CACHE, "utf8"));
  }
  console.log("· descargando catálogo…");
  const products = [];
  for (let page = 1; ; page++) {
    const batch = await getJson(`${API}?per_page=100&page=${page}`);
    products.push(...batch);
    if (batch.length < 100) break;
  }
  console.log(`  ${products.length} productos`);

  const variable = products.filter((p) => p.type === "variable");
  const variations = {};
  console.log(`· descargando variaciones de ${variable.length} productos…`);
  for (const p of variable) {
    variations[p.id] = await getJson(`${API}?type=variation&parent=${p.id}&per_page=100`);
    await sleep(120); // trato amable con el servidor del cliente
  }
  const raw = { fetchedAt: new Date().toISOString(), products, variations };
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(raw));
  return raw;
}

/**
 * Algunas fotos recientes del cliente traen un fondo gris claro (~#EEE) en vez de blanco.
 * Se detecta por el color de las esquinas y se pasa a blanco solo el gris CONECTADO a los
 * bordes (relleno por inundación), sin alterar los colores del producto.
 * Devuelve null si el fondo ya es blanco o no es un gris neutro.
 */
async function whitenGrayBackground(buf) {
  const { data, info } = await sharp(buf)
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  // color de fondo = promedio de bloques 3×3 en las 4 esquinas
  let r = 0, g = 0, b = 0, n = 0;
  for (const [cx, cy] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]]) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const i = ((cy + dy) * W + (cx + dx)) * 3;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
  }
  r /= n; g /= n; b /= n;
  const lo = Math.min(r, g, b), hi = Math.max(r, g, b);
  if (hi - lo > 6 || lo >= 250 || lo < 215) return null; // no es un gris claro neutro

  const TOL = 12;
  const near = (p) => {
    const i = p * 3;
    return Math.abs(data[i] - r) <= TOL && Math.abs(data[i + 1] - g) <= TOL && Math.abs(data[i + 2] - b) <= TOL;
  };
  const seen = new Uint8Array(W * H);
  const stack = [];
  const push = (p) => {
    if (!seen[p] && near(p)) {
      seen[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (p >= W) push(p - W);
    if (p < W * (H - 1)) push(p + W);
  }
  for (let p = 0; p < W * H; p++) {
    if (seen[p]) data[p * 3] = data[p * 3 + 1] = data[p * 3 + 2] = 255;
  }
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

async function downloadImage(url, dest) {
  if (!FORCE_IMAGES && (await exists(dest))) return "cache";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const original = Buffer.from(await res.arrayBuffer());
  const buf = (await whitenGrayBackground(original)) ?? original;

  // 1) aplana sobre blanco y recorta el margen vacío
  const { data, info } = await sharp(buf)
    .flatten({ background: "#ffffff" })
    .trim({ background: "#ffffff", threshold: 14 })
    .toBuffer({ resolveWithObject: true });

  // 2) centra el producto en un lienzo cuadrado blanco (mín. 300 px, margen ~7 %)
  const side = Math.max(300, Math.round(Math.max(info.width, info.height) * 1.14));
  // (en sharp, resize se ejecuta antes que composite: se hace en dos pasos)
  const square = await sharp({
    create: { width: side, height: side, channels: 3, background: "#ffffff" },
  })
    .composite([{ input: data, gravity: "centre" }])
    .png()
    .toBuffer();
  await sharp(square)
    .resize({ width: 640, height: 640, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  return "ok";
}

async function pool(items, size, worker) {
  const queue = [...items];
  const results = [];
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (queue.length) results.push(await worker(queue.shift()));
    }),
  );
  return results;
}

async function saveBrandAssets() {
  const assets = [
    ["public/brand/logo-elite.png", "/wp-content/uploads/2026/03/Logo-Elite-Amarillo-v1.png"],
    ["public/certs/ce.jpg", "/wp-content/uploads/2025/12/ce.jpg"],
    ["public/certs/iaf.jpg", "/wp-content/uploads/2025/12/iaf.jpg"],
    ["public/certs/intertek.jpg", "/wp-content/uploads/2025/12/intertek.jpg"],
    ["public/certs/iso9001.jpg", "/wp-content/uploads/2025/12/iso9001.jpg"],
    ["public/certs/iso14001.jpg", "/wp-content/uploads/2025/12/iso14001.jpg"],
    ["public/certs/gs.jpg", "/wp-content/uploads/2025/12/gs.jpg"],
    ["public/certs/cnas.jpg", "/wp-content/uploads/2025/12/cnas.jpg"],
  ];
  for (const [rel, remote] of assets) {
    const dest = path.join(ROOT, rel);
    if (await exists(dest)) continue;
    await mkdir(path.dirname(dest), { recursive: true });
    const res = await fetch(ORIGIN + remote);
    if (!res.ok) {
      console.warn(`  ! no se pudo descargar ${remote} (HTTP ${res.status})`);
      continue;
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`  + ${rel}`);
  }
}

// ---------------------------------------------------------------- main
async function main() {
  const raw = await loadRaw();
  await mkdir(OUT_IMG, { recursive: true });

  const used = new Set();
  const products = raw.products.map((p) => {
    const name = decode(p.name).replace(/\s+/g, " ").trim();
    let slug = norm(p.slug).replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || `p-${p.id}`;
    if (used.has(slug)) slug = `${slug}-${p.id}`;
    used.add(slug);

    const sourceSlugs = p.categories.map((c) => c.slug);
    const description = stripHtml(p.short_description || p.description) || null;

    const min = cents(p.prices?.price_range?.min_amount ?? p.prices?.price);
    const max = cents(p.prices?.price_range?.max_amount ?? p.prices?.price);

    // Orden natural (4.5″, 6″, 7″, 8″ y no 4.5, 6, 8, 7).
    const variants = (raw.variations[p.id] ?? [])
      .map((v) => ({
        id: v.id,
        label: variantLabel(v),
        sku: v.sku || null,
        price: toUsd(cents(v.prices?.price)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));

    const priced = variants.map((v) => v.price).filter((x) => x !== null);
    const price = variants.length ? (priced.length ? Math.min(...priced) : null) : toUsd(min);
    const priceMax = variants.length
      ? priced.length ? Math.max(...priced) : null
      : toUsd(max);

    return {
      id: p.id,
      slug,
      sku: p.sku || null,
      name,
      brand: detectBrand(name),
      category: classify(name, sourceSlugs),
      description,
      image: `/products/${slug}.webp`,
      imageSource: p.images?.[0]?.src ?? null,
      price,
      priceMax: priceMax !== null && priceMax !== price ? priceMax : null,
      quoteOnly: price === null,
      variants,
    };
  });

  console.log("· optimizando imágenes…");
  let ok = 0;
  let cached = 0;
  const missing = [];
  await pool(products, 6, async (p) => {
    if (!p.imageSource) return missing.push(p.slug);
    try {
      const r = await downloadImage(p.imageSource, path.join(OUT_IMG, `${p.slug}.webp`));
      if (r === "ok") ok++;
      else cached++;
    } catch (err) {
      missing.push(`${p.slug} (${err.message})`);
    }
  });
  console.log(`  nuevas: ${ok} · en caché: ${cached} · fallidas: ${missing.length}`);
  if (missing.length) console.warn("  sin imagen:", missing.join(", "));

  const clean = products
    .filter((p) => !missing.some((m) => m.startsWith(p.slug)))
    .map((p) => {
      const out = { ...p };
      delete out.imageSource; // solo se usa para descargar la imagen
      return out;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  await mkdir(path.dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, JSON.stringify(clean, null, 2) + "\n");

  const byCat = clean.reduce((acc, p) => ((acc[p.category] = (acc[p.category] ?? 0) + 1), acc), {});
  console.log("· resumen por categoría:", byCat);
  console.log(
    `· ${clean.length} productos · ${clean.filter((p) => p.quoteOnly).length} solo cotización · ${clean.filter((p) => p.variants.length).length} con variantes`,
  );

  console.log("· logo y certificados…");
  await saveBrandAssets();
  console.log("✔ listo →", path.relative(ROOT, OUT_JSON));
}

main().catch((err) => {
  console.error("✖", err);
  process.exit(1);
});
