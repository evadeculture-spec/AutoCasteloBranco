/**
 * Configuração central da marca e dos contactos.
 *
 * Nenhum contacto é inventado: cada valor vem de uma variável de ambiente
 * (ver `.env.example`). Um valor vazio é tratado como "por configurar" e a
 * interface mostra um placeholder identificado em vez de um link.
 */

function env(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

const phone = env(process.env.NEXT_PUBLIC_CONTACT_PHONE);
const street = env(process.env.NEXT_PUBLIC_ADDRESS_STREET);
const postalCode = env(process.env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE);
const locality = env(process.env.NEXT_PUBLIC_ADDRESS_LOCALITY) ?? "Castelo Branco";
const hours = env(process.env.NEXT_PUBLIC_OPENING_HOURS);

export const site = {
  name: "Castelo Branco Auto",
  shortName: "CB Auto",
  url: (env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "pt_PT",
  /** Enquanto `true`, o site identifica o conteúdo como demonstrativo e não é indexado. */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  description:
    "Comércio de viaturas usadas e oficina automóvel em Castelo Branco. Viaturas apresentadas com rigor e assistência técnica com método.",
  contact: {
    /** Formato internacional, ex.: +351272000000 */
    phone,
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    /** Só dígitos, formato internacional, ex.: 351910000000 */
    whatsapp: env(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP)?.replace(/\D/g, "") || null,
  },
  address: {
    street,
    postalCode,
    locality,
    region: "Castelo Branco",
    country: "PT",
    /** A morada só é considerada validada quando a rua está preenchida. */
    isValidated: Boolean(street),
  },
  /** Linhas de horário; vazio = por confirmar. */
  openingHours: hours ? hours.split("|").map((line) => line.trim()).filter(Boolean) : [],
  legal: {
    name: env(process.env.NEXT_PUBLIC_LEGAL_NAME),
    nif: env(process.env.NEXT_PUBLIC_LEGAL_NIF),
  },
} as const;

export const nav = [
  { href: "/", label: "Início" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/oficina", label: "Oficina" },
  { href: "/sobre-nos", label: "Sobre nós" },
  { href: "/contactos", label: "Contactos" },
] as const;

/** Texto mostrado no lugar de um dado ainda não fornecido. */
export const PLACEHOLDER = {
  phone: "Telefone por configurar",
  email: "Email por configurar",
  address: "Morada por confirmar",
  hours: "Horário por confirmar",
} as const;
