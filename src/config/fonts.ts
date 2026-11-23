import { Barlow_Condensed, Inter } from "next/font/google";

/*
 * Solo se cargan las 3 variantes que el diseño usa (antes eran 9 archivos, todos con preload):
 *  - Barlow Condensed 700 recta  → etiquetas, botones, precios, navegación (`font-display`)
 *  - Barlow Condensed 800 cursiva → titulares (`.display`), eco del logo "Elite®"
 *  - Inter variable               → texto corrido
 */
export const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
  variable: "--font-barlow",
  display: "swap",
});

export const barlowItalic = Barlow_Condensed({
  subsets: ["latin"],
  weight: "800",
  style: "italic",
  variable: "--font-barlow-italic",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
