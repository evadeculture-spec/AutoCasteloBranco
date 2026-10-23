/**
 * Validação de pedidos (informação sobre viatura, marcação, contacto geral).
 * Partilhada entre o browser (feedback imediato) e o servidor (fonte de verdade).
 */

export type LeadKind = "viatura" | "marcacao" | "contacto";

export interface LeadInput {
  kind: LeadKind;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  /** viatura */
  vehicleId?: string;
  vehicleLabel?: string;
  /** marcação */
  carMakeModel?: string;
  service?: string;
  preferredDate?: string;
  /** contacto */
  subject?: string;
  /** campo-armadilha anti-spam: tem de ficar vazio */
  website?: string;
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Aceita números portugueses (9 dígitos) e internacionais (+xxx). */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s().-]/g, "");
  if (/^\+\d{8,15}$/.test(digits)) return true;
  if (/^00\d{8,15}$/.test(digits)) return true;
  return /^[29]\d{8}$/.test(digits);
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Data local AAAA-MM-DD de hoje, em Portugal. */
export function todayISO(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(now);
}

export const LIMITS = { name: 80, message: 1500, field: 120 } as const;

export function validateLead(input: LeadInput, now = new Date()): LeadErrors {
  const errors: LeadErrors = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();

  if (name.length < 2) errors.name = "Indique o seu nome.";
  else if (name.length > LIMITS.name) errors.name = `O nome não pode ter mais de ${LIMITS.name} caracteres.`;

  if (!phone && !email) {
    errors.phone = "Indique um telefone ou um email para o contactarmos.";
    errors.email = "Indique um telefone ou um email para o contactarmos.";
  }
  if (phone && !isValidPhone(phone)) errors.phone = "Confirme o número de telefone (ex.: 912 345 678).";
  if (email && !isValidEmail(email)) errors.email = "Confirme o endereço de email (ex.: nome@dominio.pt).";

  if (input.message.length > LIMITS.message)
    errors.message = `A mensagem não pode ter mais de ${LIMITS.message} caracteres.`;

  if (input.kind === "viatura" && !input.vehicleId) errors.vehicleId = "Viatura não identificada.";

  if (input.kind === "marcacao") {
    if (!input.carMakeModel?.trim()) errors.carMakeModel = "Indique a marca e o modelo do veículo.";
    else if (input.carMakeModel.length > LIMITS.field) errors.carMakeModel = "Texto demasiado longo.";
    if (!input.service) errors.service = "Escolha o serviço pretendido.";
    if (!input.preferredDate) errors.preferredDate = "Indique uma data preferencial.";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.preferredDate))
      errors.preferredDate = "Data inválida.";
    else if (input.preferredDate < todayISO(now))
      errors.preferredDate = "A data preferencial não pode ser anterior a hoje.";
  }

  if (input.kind === "contacto" && input.message.trim().length < 5)
    errors.message = "Escreva uma mensagem breve para sabermos como ajudar.";

  if (!input.consent) errors.consent = "É necessário aceitar o tratamento dos dados para respondermos.";

  return errors;
}

/** Normaliza dados vindos de um pedido HTTP. */
export function toLeadInput(raw: unknown): LeadInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).slice(0, 2000) : "");
  const kind = str("kind");
  if (kind !== "viatura" && kind !== "marcacao" && kind !== "contacto") return null;
  return {
    kind,
    name: str("name"),
    phone: str("phone"),
    email: str("email"),
    message: str("message"),
    consent: r.consent === true,
    vehicleId: str("vehicleId") || undefined,
    vehicleLabel: str("vehicleLabel") || undefined,
    carMakeModel: str("carMakeModel") || undefined,
    service: str("service") || undefined,
    preferredDate: str("preferredDate") || undefined,
    subject: str("subject") || undefined,
    website: str("website") || undefined,
  };
}
