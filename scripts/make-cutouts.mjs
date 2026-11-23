/**
 * Recorta el fondo blanco de las fotos del hero (transparencia real) para que los
 * productos conserven sus colores sobre el panel amarillo (mix-blend-mode los altera).
 *
 * Relleno por inundación desde los bordes: solo se borra el blanco CONECTADO al exterior,
 * así las partes blancas del propio producto (p. ej. el cuerpo de la motosierra) se conservan.
 *
 *   npm run data:cutouts
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public", "products");
const OUT = path.join(ROOT, "public", "hero");

/** Productos del hero (deben coincidir con HeroVisual.tsx). */
const SLUGS = ["motosierra-58cc", "martillos", "alicate-elite-profesional", "gatas-botella"];

const THRESHOLD = 238; // canal mínimo para considerar "casi blanco"
const ERODE_PX = 1; // quita el halo blanco del borde del producto
const BLUR = 0.7; // suaviza el borde

async function cutout(slug) {
  const { data, info } = await sharp(path.join(SRC, `${slug}.webp`))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  const isWhite = (p) => {
    const i = p * 3;
    return data[i] >= THRESHOLD && data[i + 1] >= THRESHOLD && data[i + 2] >= THRESHOLD;
  };

  // 1) inundación desde todos los píxeles blancos del borde
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (p) => {
    if (!bg[p] && isWhite(p)) {
      bg[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (p >= W) push(p - W);
    if (p < W * (H - 1)) push(p + W);
  }

  // 2) máscara alfa (255 = producto) y erosión
  let alpha = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) alpha[p] = bg[p] ? 0 : 255;
  for (let r = 0; r < ERODE_PX; r++) {
    const next = alpha.slice();
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const p = y * W + x;
        if (alpha[p] && (!alpha[p - 1] || !alpha[p + 1] || !alpha[p - W] || !alpha[p + W])) next[p] = 0;
      }
    }
    alpha = next;
  }

  // 3) suaviza el borde y une el canal alfa
  // (sharp devuelve 3 canales tras el desenfoque: se extrae uno solo para que W×H coincida)
  const softAlpha = await sharp(Buffer.from(alpha), { raw: { width: W, height: H, channels: 1 } })
    .blur(BLUR)
    .extractChannel(0)
    .raw()
    .toBuffer();

  // 4) recuadro real del producto (a partir del alfa) con 4 px de margen
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alpha[y * W + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 4;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const width = Math.min(W, maxX + pad + 1) - left;
  const height = Math.min(H, maxY + pad + 1) - top;

  const rgba = await sharp(data, { raw: { width: W, height: H, channels: 3 } })
    .joinChannel(softAlpha, { raw: { width: W, height: H, channels: 1 } })
    .raw()
    .toBuffer();

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left, top, width, height })
    .webp({ quality: 88, alphaQuality: 95 })
    .toFile(path.join(OUT, `${slug}.webp`));

  return { slug, w: width, h: height, removed: Math.round((bg.reduce((a, b) => a + b, 0) / (W * H)) * 100) };
}

await mkdir(OUT, { recursive: true });
for (const slug of SLUGS) {
  const r = await cutout(slug);
  console.log(`✔ ${r.slug}: ${r.w}×${r.h}px (fondo eliminado: ${r.removed}%)`);
}
