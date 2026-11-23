import { z } from "zod";

/** Validación del formulario de contacto (mismos campos que el sitio actual, ya corregidos). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre"),
  lastName: z.string().trim().optional(),
  // Acepta formatos habituales: 099 869 7360 · +593998697360 · (+593) 2-2828064 · 02-2828064
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]+$/, "Usa solo números, espacios, + , ( ) o guiones")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15; // 15 = máximo E.164
    }, "Ingresa un teléfono válido (entre 7 y 15 dígitos)"),
  email: z.email("Ingresa un correo válido"),
  message: z.string().trim().max(1000, "Máximo 1000 caracteres").optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

/** Devuelve los datos limpios o un mapa campo → mensaje (solo el primer error de cada campo). */
export function validateContact(raw: Record<string, FormDataEntryValue | null>):
  | { ok: true; data: ContactValues }
  | { ok: false; errors: ContactErrors } {
  const result = contactSchema.safeParse({
    name: raw.name ?? "",
    lastName: raw.lastName ?? "",
    phone: raw.phone ?? "",
    email: String(raw.email ?? "").trim(),
    message: raw.message ?? "",
  });
  if (result.success) return { ok: true, data: result.data };

  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactValues;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
