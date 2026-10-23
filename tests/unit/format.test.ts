import { describe, expect, it } from "vitest";
import { formatKm, formatPrice } from "@/lib/format";

const nbsp = " ";

describe("formatação pt-PT", () => {
  it("preços em euros com espaço como separador de milhares", () => {
    expect(formatPrice(29900)).toBe(`29${nbsp}900${nbsp}€`);
    expect(formatPrice(18500)).toBe(`18${nbsp}500${nbsp}€`);
  });

  it("agrupa também números de 4 dígitos (o Intl pt-PT não o faz)", () => {
    expect(formatPrice(9500)).toBe(`9${nbsp}500${nbsp}€`);
    expect(formatPrice(950)).toBe(`950${nbsp}€`);
  });

  it("quilometragem", () => {
    expect(formatKm(78000)).toBe(`78${nbsp}000${nbsp}km`);
    expect(formatKm(1234567)).toBe(`1${nbsp}234${nbsp}567${nbsp}km`);
  });
});
