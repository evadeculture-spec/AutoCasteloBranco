import { site, PLACEHOLDER } from "@/config/site";

/** Formata +351272000000 como "+351 272 000 000". */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/[^\d+]/g, "");
  const match = digits.match(/^\+351(\d{3})(\d{3})(\d{3})$/);
  return match ? `+351 ${match[1]} ${match[2]} ${match[3]}` : digits;
}

export function telHref(): string | null {
  return site.contact.phone ? `tel:${site.contact.phone.replace(/[^\d+]/g, "")}` : null;
}

export function mailHref(subject?: string): string | null {
  if (!site.contact.email) return null;
  return subject
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.contact.email}`;
}

export function whatsappHref(message?: string): string | null {
  if (!site.contact.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.contact.whatsapp}${text}`;
}

export function phoneLabel(): string {
  return site.contact.phone ? formatPhone(site.contact.phone) : PLACEHOLDER.phone;
}

export function emailLabel(): string {
  return site.contact.email ?? PLACEHOLDER.email;
}

export function addressLines(): string[] {
  const { street, postalCode, locality } = site.address;
  if (!street) return [PLACEHOLDER.address, locality];
  return [street, [postalCode, locality].filter(Boolean).join(" ")];
}

/** Link para mapas apenas quando existe morada validada. */
export function mapsHref(): string | null {
  if (!site.address.isValidated) return null;
  const query = [site.address.street, site.address.postalCode, site.address.locality, "Portugal"]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
