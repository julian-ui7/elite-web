# Elite Ecuador — propuesta de rediseño web

Propuesta funcional para reemplazar el sitio actual (WordPress + WooCommerce + Elementor, lento y genérico):
una **landing one-page** rápida e interactiva y una **mini-tienda** para armar pedidos que se envían por WhatsApp.
Corre **en local**: no hay backend, base de datos ni pasarela de pago.

- **Stack**: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript estricto · Tailwind 4 · Zustand · Zod · Vitest.
- **Identidad**: amarillo Elite `#F8DC15` (muestreado del logo) + carbón; titulares en Barlow Condensed cursiva (eco del logo), texto en Inter.

## Cómo correrlo

```bash
npm install
npm run dev          # desarrollo con recarga en caliente → http://localhost:3000
npm run build && npm start   # versión de producción (la que se debe mostrar al cliente)
```

Requiere Node ≥ 20.9 (probado con Node 24).

| Script | Qué hace |
|---|---|
| `npm run typecheck` · `npm run lint` · `npm test` | Tipos, ESLint y 52 pruebas (store del pedido, WhatsApp, búsqueda, horario, validación, integridad de datos) |
| `npm run data:products` | Vuelve a importar el catálogo desde el sitio actual (usa caché; `-- --refresh` re-descarga, `-- --images` reprocesa imágenes) |
| `npm run data:cutouts` | Regenera los recortes con transparencia de las 4 fotos del hero |

## Qué incluye

**Landing (`/`)** — header con buscador (`Ctrl/⌘ + K`) y contador del pedido · hero con recortes de producto que siguen al puntero · franja de valor · 9 categorías (bento) · productos destacados (carrusel) · nosotros con contadores y pestañas Misión/Visión/Objetivo · certificaciones · cómo trabajamos · banda de cotización · contacto con estado "Abierto ahora" (hora de Ecuador) y formulario · footer · botón flotante de WhatsApp.

**Tienda (`/tienda`)** — 202 productos reales, búsqueda, filtro por categoría y orden **sincronizados con la URL** (`/tienda?cat=pintura&q=rodillo`), vista rápida con variantes (358 reales), cajón "Mi pedido".
**Pedido (`/tienda/pedido`)** — ajustar cantidades, datos opcionales del cliente, **enviar por WhatsApp**, copiar o imprimir.

El pedido y el formulario **no se guardan en ningún servidor**: el pedido vive en `localStorage` y ambos terminan en un mensaje de WhatsApp (o correo) ya redactado para que lo envíe la persona.

## Estructura

```
scripts/            importador de productos y recortes (corren con Node, no forman parte del sitio)
public/{brand,certs,products,hero}/   logo, certificados, 202 fotos optimizadas (WebP), recortes del hero
src/app/            rutas: / · /tienda · /tienda/pedido · 404
src/components/     ui/ (átomos) · landing/ (secciones) · shop/ (catálogo y pedido) · layout/
src/core/stores/    orderStore (pedido persistente) · uiStore (diálogos)
src/data/           site.ts (datos de la empresa: única fuente) · categories.ts · products.json (generado)
src/lib/            whatsapp · búsqueda · horario · validación · formato
```

## Resultados medidos (Lighthouse 13, móvil, mediana de 3 mediciones)

| | Sitio actual | Propuesta |
|---|---|---|
| Rendimiento | 57 | **94** |
| Accesibilidad | 89 | **100** |
| SEO | 92 | **100** |
| Primer contenido visible (FCP) | 6,2 s | **1,1 s** |
| Contenido principal (LCP) | 31 s | **1,1 s** |
| Peso transferido | 7,6 MB | **468 KB** |
| Peticiones CSS / JS | 30 / 23 | **0 / 11** |
| Layout shift (CLS) | 0,011 | **0** |

Además: 0 violaciones en axe-core (WCAG 2.0/2.1 A y AA) en las 3 páginas, a 390 px y 1440 px.

**Salvedades honestas para cuando lo presentes**
- La propuesta se midió en `localhost` (sin latencia de red real); el sitio actual, en su hosting. Lighthouse aplica el mismo estrangulamiento a ambos, pero en producción se sumarán ~100–300 ms de servidor. El ahorro principal (imágenes de 6,4 MB → 80 KB, 53 archivos CSS/JS → 11) no depende de eso.
- El Total Blocking Time es **mejorable** (~150–300 ms con CPU 4× más lenta) por el costo base de React y de una página visualmente rica; no es un problema en la práctica.

## Pendientes por confirmar con el cliente (no se inventó nada)

1. **¿12 o +15 años?** El sitio dice "+15 años" en la home y "doce años" en *Sobre nosotros*. Se usó 15 (`src/data/site.ts → yearsExperience`).
2. **Certificaciones** (CE, IAF, Intertek, ISO 9001, ISO 14001, GS, CNAS): el sitio actual no da números, emisor ni vigencia. Validar antes de publicarlas como garantía.
3. **Precios de relleno**: 22 productos tenían $99,00/$99,99; aquí aparecen como **"A cotizar"**. Confirmar precios reales y si la venta es solo mayorista.
4. **Fotos de producto en alta resolución** (las actuales miden 300–594 px) y **logo en SVG** (hoy PNG); los certificados son JPG de 170×85 px.
5. Ciudad (probablemente Quito), redes sociales, cobertura de entrega, horario de fin de semana.
6. Testimonios y logos de clientes: hoy no existen en el sitio, por eso no hay sección de ellos.

## Para publicarlo más adelante

- `NEXT_PUBLIC_SITE_URL=https://su-dominio` y `NEXT_PUBLIC_INDEXABLE=true` **al compilar** (por defecto la propuesta es `noindex`).
- Es un sitio 100 % estático (las 4 rutas se prerrenderizan): se puede alojar en Vercel/Netlify/Cloudflare Pages o en su Apache con `next start`.
- Un pedido real con backend (inventario, precios por cliente, pagos) es una fase aparte; la mini-tienda está pensada como demostración y para recoger cotizaciones.
