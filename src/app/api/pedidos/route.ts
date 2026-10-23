import { toLeadInput, validateLead } from "@/lib/leads";
import { vehicleName } from "@/lib/inventory";
import { vehicles } from "@/data/vehicles";

/**
 * Receção de pedidos (informação sobre viatura, marcação, contacto).
 *
 * - Valida sempre no servidor (a validação do browser é apenas conveniência).
 * - Se `LEADS_WEBHOOK_URL` estiver definido, entrega o pedido em JSON a esse
 *   endereço (CRM, automação, email transacional…). Caso contrário, responde
 *   em modo de demonstração: o pedido é validado mas NÃO é entregue.
 */

const MAX_BODY = 16_000;

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY) return Response.json({ ok: false, error: "payload_too_large" }, { status: 413 });

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const input = toLeadInput(raw);
  if (!input) return Response.json({ ok: false, error: "invalid_kind" }, { status: 400 });

  // Campo-armadilha preenchido: responder como sucesso para não dar pistas a bots.
  if (input.website) return Response.json({ ok: true, delivered: false, mode: "filtered" });

  const errors = validateLead(input);
  if (Object.keys(errors).length) return Response.json({ ok: false, error: "validation", errors }, { status: 422 });

  // A viatura é identificada no servidor a partir do ID — não confiamos no texto enviado.
  const vehicle = input.vehicleId ? vehicles.find((v) => v.id === input.vehicleId) : undefined;
  if (input.kind === "viatura" && !vehicle)
    return Response.json({ ok: false, error: "validation", errors: { vehicleId: "Viatura não encontrada." } }, { status: 422 });

  const lead = {
    kind: input.kind,
    receivedAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.trim() || null,
    email: input.email.trim() || null,
    message: input.message.trim() || null,
    vehicle: vehicle
      ? { id: vehicle.id, name: vehicleName(vehicle), year: vehicle.year, slug: vehicle.slug, demo: vehicle.demo }
      : null,
    carMakeModel: input.carMakeModel?.trim() || null,
    service: input.service || null,
    /** Preferência do cliente — não é uma marcação confirmada. */
    preferredDate: input.preferredDate || null,
    subject: input.subject || null,
    consent: true,
  };

  const webhook = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") console.info("[pedidos] modo demonstração — pedido não entregue:", lead);
    return Response.json({ ok: true, delivered: false, mode: "demo" });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEADS_WEBHOOK_SECRET && { "X-Webhook-Secret": process.env.LEADS_WEBHOOK_SECRET }),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true, delivered: true, mode: "live" });
  } catch (error) {
    console.error("[pedidos] falha na entrega:", error);
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
