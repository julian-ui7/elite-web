"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import clsx from "clsx";
// zod pesa ~36 KB gzip: se carga bajo demanda (al enfocar un campo), no con la página.
import type { ContactErrors } from "@/lib/contactSchema";
import { buildContactMessage, mailtoUrl, whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

type Channel = "whatsapp" | "mail";

/**
 * Formulario sin backend: valida en el navegador y entrega el mensaje armado por
 * WhatsApp (principal) o correo. Así la propuesta funciona sin servidor.
 */
export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const uid = useId();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState<{ channel: Channel; url: string } | null>(null);
  const schema = useRef<typeof import("@/lib/contactSchema") | null>(null);

  // Precarga la validación al enfocar el primer campo. Así "Enviar" corre de forma síncrona
  // dentro del gesto del usuario y el navegador no bloquea la ventana de WhatsApp.
  const warm = () => {
    if (!schema.current) import("@/lib/contactSchema").then((m) => (schema.current = m));
  };

  const submit = async (channel: Channel) => {
    if (!form.current) return;
    const raw = Object.fromEntries(new FormData(form.current));
    const { validateContact } = schema.current ?? (schema.current = await import("@/lib/contactSchema"));
    const result = validateContact(raw);
    if (!result.ok) {
      setErrors(result.errors);
      // Lleva el foco al primer campo con error.
      const first = (["name", "phone", "email", "message"] as const).find((k) => result.errors[k]);
      if (first) form.current.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    const text = buildContactMessage(result.data);
    const url = channel === "whatsapp" ? whatsappUrl(text) : mailtoUrl("Consulta desde la página web", text);
    if (channel === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setSent({ channel, url });
  };

  if (sent) {
    return (
      <div role="status" className="grid min-h-[26rem] place-items-center rounded-md bg-carbon-800 p-8 text-center ring-1 ring-white/10">
        <div>
          <CheckCircle2 className="mx-auto size-14 text-whatsapp" aria-hidden />
          <h3 className="display mt-5 text-4xl text-white">¡Listo!</h3>
          <p className="mx-auto mt-3 max-w-sm text-carbon-300">
            {sent.channel === "whatsapp"
              ? "Abrimos WhatsApp con tu mensaje ya escrito. Solo falta que lo envíes."
              : "Abrimos tu correo con el mensaje ya escrito. Solo falta que lo envíes."}
          </p>
          <p className="mt-3 text-sm text-carbon-400">
            ¿No se abrió?{" "}
            <a
              href={sent.url}
              {...(sent.channel === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-semibold text-elite-500 underline underline-offset-4 hover:text-elite-300"
            >
              Toca aquí
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(null)}
            className="mt-6 font-semibold text-elite-500 underline underline-offset-4 hover:text-elite-300"
          >
            Escribir otro mensaje
          </button>
        </div>
      </div>
    );
  }

  const field = (name: keyof ContactErrors, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, required = false) => {
    const id = `${uid}-${name}`;
    const err = errors[name];
    return (
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-carbon-200">
          {label} {required && <span className="text-elite-500" aria-hidden>*</span>}
        </label>
        <input
          id={id}
          name={name}
          required={required}
          aria-required={required}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={() => err && setErrors((e) => ({ ...e, [name]: undefined }))}
          className={clsx(
            "h-12 w-full rounded-sm border-2 bg-carbon-900 px-4 text-white outline-none transition-colors placeholder:text-carbon-500",
            err ? "border-danger" : "border-carbon-600 focus:border-elite-500",
          )}
          {...props}
        />
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  const messageId = `${uid}-message`;

  return (
    <form
      ref={form}
      noValidate
      onFocusCapture={warm}
      onSubmit={(e) => {
        e.preventDefault();
        submit("whatsapp");
      }}
      className="rounded-md bg-carbon-800 p-6 ring-1 ring-white/10 sm:p-9"
    >
      <h3 className="display text-4xl text-white">Déjanos un mensaje</h3>
      <p className="mt-2 text-carbon-300">Completa el formulario y un representante te contactará pronto.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {field("name", "Nombre", { autoComplete: "given-name", placeholder: "Tu nombre" }, true)}
        {field("lastName", "Apellidos", { autoComplete: "family-name", placeholder: "Tus apellidos" })}
        {field("phone", "Número telefónico", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "099 000 0000" }, true)}
        {field("email", "Correo electrónico", { type: "email", autoComplete: "email", placeholder: "tu@correo.com" }, true)}
        <div className="sm:col-span-2">
          <label htmlFor={messageId} className="mb-2 block text-sm font-semibold text-carbon-200">
            Mensaje
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            placeholder="Cuéntanos qué productos necesitas cotizar…"
            aria-invalid={!!errors.message}
            className="w-full rounded-sm border-2 border-carbon-600 bg-carbon-900 px-4 py-3 text-white outline-none transition-colors placeholder:text-carbon-500 focus:border-elite-500"
          />
          {errors.message && <p className="mt-1.5 text-sm text-danger">{errors.message}</p>}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="whatsapp" size="lg">
          <WhatsAppIcon className="size-5" />
          Enviar por WhatsApp
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => submit("mail")}>
          <Mail className="size-5" aria-hidden />
          Enviar por correo
        </Button>
      </div>
      <p className="mt-4 text-xs text-carbon-400">
        No guardamos tus datos en esta página: el mensaje se abre en tu WhatsApp o correo para que lo envíes tú.
      </p>
    </form>
  );
}
