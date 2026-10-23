import { describe, expect, it } from "vitest";
import { isValidPhone, toLeadInput, validateLead, type LeadInput } from "@/lib/leads";

const base: LeadInput = { kind: "contacto", name: "Ana Silva", phone: "912345678", email: "", message: "Olá, uma pergunta.", consent: true };
const now = new Date("2026-10-23T10:00:00Z");

describe("validação de pedidos", () => {
  it("aceita um contacto válido", () => {
    expect(validateLead(base, now)).toEqual({});
  });

  it("exige telefone ou email", () => {
    const e = validateLead({ ...base, phone: "", email: "" }, now);
    expect(e.phone).toBeDefined();
    expect(e.email).toBeDefined();
    expect(validateLead({ ...base, phone: "", email: "ana@exemplo.pt" }, now)).toEqual({});
  });

  it("valida formatos de telefone portugueses e internacionais", () => {
    expect(isValidPhone("912 345 678")).toBe(true);
    expect(isValidPhone("272 000 000")).toBe(true);
    expect(isValidPhone("+351 912 345 678")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("812345678")).toBe(false);
  });

  it("exige consentimento", () => {
    expect(validateLead({ ...base, consent: false }, now).consent).toBeDefined();
  });

  it("marcação: exige viatura, serviço e data não anterior a hoje", () => {
    const booking: LeadInput = { ...base, kind: "marcacao", message: "", carMakeModel: "", service: "", preferredDate: "" };
    const e = validateLead(booking, now);
    expect(Object.keys(e).sort()).toEqual(["carMakeModel", "preferredDate", "service"]);
    expect(validateLead({ ...booking, carMakeModel: "Renault Clio", service: "revisao", preferredDate: "2026-10-22" }, now).preferredDate).toMatch(
      /anterior/,
    );
    expect(validateLead({ ...booking, carMakeModel: "Renault Clio", service: "revisao", preferredDate: "2026-10-23" }, now)).toEqual({});
  });

  it("pedido de viatura exige identificação da viatura", () => {
    expect(validateLead({ ...base, kind: "viatura", message: "" }, now).vehicleId).toBeDefined();
    expect(validateLead({ ...base, kind: "viatura", message: "", vehicleId: "demo-01" }, now)).toEqual({});
  });

  it("normaliza dados recebidos e rejeita tipos desconhecidos", () => {
    expect(toLeadInput({ kind: "spam" })).toBeNull();
    expect(toLeadInput(null)).toBeNull();
    const parsed = toLeadInput({ kind: "contacto", name: 42, consent: "true" })!;
    expect(parsed.name).toBe("");
    expect(parsed.consent).toBe(false);
  });
});
