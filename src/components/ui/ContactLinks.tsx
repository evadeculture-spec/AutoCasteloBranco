import { TrackedLink } from "./TrackedLink";
import { Chat, Mail, Phone } from "./icons";
import { emailLabel, mailHref, phoneLabel, telHref, whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/cn";

/**
 * Telefone / email / WhatsApp. Quando um contacto não está configurado,
 * mostra um placeholder identificado em vez de um link falso.
 */
export function PhoneLink({ className, context }: { className?: string; context: string }) {
  const href = telHref();
  if (!href)
    return (
      <span className={cn("inline-flex items-center gap-2 opacity-70", className)} title="Definir NEXT_PUBLIC_CONTACT_PHONE">
        <Phone size={18} />
        <span>{phoneLabel()}</span>
      </span>
    );
  return (
    <TrackedLink href={href} event="phone_click" eventParams={{ context }} className={cn("inline-flex items-center gap-2", className)}>
      <Phone size={18} />
      <span className="tabular">{phoneLabel()}</span>
    </TrackedLink>
  );
}

export function EmailLink({ className, context, subject }: { className?: string; context: string; subject?: string }) {
  const href = mailHref(subject);
  if (!href)
    return (
      <span className={cn("inline-flex items-center gap-2 opacity-70", className)} title="Definir NEXT_PUBLIC_CONTACT_EMAIL">
        <Mail size={18} />
        <span>{emailLabel()}</span>
      </span>
    );
  return (
    <TrackedLink href={href} event="email_click" eventParams={{ context }} className={cn("inline-flex items-center gap-2", className)}>
      <Mail size={18} />
      <span>{emailLabel()}</span>
    </TrackedLink>
  );
}

/** WhatsApp só aparece depois de configurado. */
export function WhatsAppLink({ className, context, message }: { className?: string; context: string; message?: string }) {
  const href = whatsappHref(message);
  if (!href) return null;
  return (
    <TrackedLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      event="whatsapp_click"
      eventParams={{ context }}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Chat size={18} />
      <span>WhatsApp</span>
    </TrackedLink>
  );
}
