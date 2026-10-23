import { describe, expect, it } from "vitest";
import { vehicles } from "@/data/vehicles";
import {
  DEFAULT_FILTERS,
  applyFilters,
  getSimilarVehicles,
  getVehicleBySlug,
  parseFilters,
  priceSteps,
  serializeFilters,
} from "@/lib/inventory";

describe("dados de demonstração", () => {
  it("inclui as quatro viaturas obrigatórias, todas marcadas como demo", () => {
    expect(vehicles).toHaveLength(4);
    expect(vehicles.every((v) => v.demo)).toBe(true);
    expect(vehicles.filter((v) => v.make === "BMW")).toHaveLength(2);
    expect(vehicles.filter((v) => v.make === "SEAT" && v.model === "Leon")).toHaveLength(2);
  });

  it("tem os dados especificados", () => {
    const s3 = getVehicleBySlug("bmw-serie-3-2021-diesel")!;
    expect([s3.year, s3.mileageKm, s3.fuel, s3.transmission, s3.priceEur]).toEqual([2021, 78000, "Diesel", "Automática", 29900]);
    const leon = getVehicleBySlug("seat-leon-2021-diesel")!;
    expect([leon.year, leon.mileageKm, leon.fuel, leon.transmission, leon.priceEur]).toEqual([2021, 82000, "Diesel", "Manual", 18500]);
  });

  it("slugs únicos", () => {
    expect(new Set(vehicles.map((v) => v.slug)).size).toBe(vehicles.length);
  });
});

describe("filtros e ordenação", () => {
  it("filtra por marca", () => {
    const r = applyFilters(vehicles, { ...DEFAULT_FILTERS, make: "SEAT" });
    expect(r.map((v) => v.make)).toEqual(["SEAT", "SEAT"]);
  });

  it("filtra por combustível e preço máximo em conjunto", () => {
    const r = applyFilters(vehicles, { ...DEFAULT_FILTERS, fuel: "Diesel", maxPrice: 20000 });
    expect(r.map((v) => v.slug)).toEqual(["seat-leon-2021-diesel"]);
  });

  it("devolve lista vazia quando nada corresponde", () => {
    expect(applyFilters(vehicles, { ...DEFAULT_FILTERS, make: "BMW", maxPrice: 15000 })).toEqual([]);
  });

  it("ordena por preço e por ano", () => {
    const asc = applyFilters(vehicles, { ...DEFAULT_FILTERS, sort: "preco-asc" }).map((v) => v.priceEur);
    expect(asc).toEqual([18500, 19900, 21900, 29900]);
    const desc = applyFilters(vehicles, { ...DEFAULT_FILTERS, sort: "preco-desc" }).map((v) => v.priceEur);
    expect(desc).toEqual([29900, 21900, 19900, 18500]);
    const years = applyFilters(vehicles, { ...DEFAULT_FILTERS, sort: "ano-desc" }).map((v) => v.year);
    expect(years).toEqual([2022, 2021, 2021, 2020]);
  });

  it("converte filtros de e para o URL (ida e volta)", () => {
    const f = { ...DEFAULT_FILTERS, make: "BMW", fuel: "Diesel" as const, transmission: "Automática" as const, maxPrice: 30000, sort: "preco-asc" as const };
    const qs = serializeFilters(f);
    expect(qs.toString()).toBe("marca=bmw&combustivel=diesel&caixa=automatica&ate=30000&ordem=preco-asc");
    expect(parseFilters(qs, vehicles)).toEqual(f);
  });

  it("ignora parâmetros inválidos no URL", () => {
    const f = parseFilters(new URLSearchParams("marca=ferrari&combustivel=agua&ate=-5&ordem=xpto"), vehicles);
    expect(f).toEqual(DEFAULT_FILTERS);
  });

  it("gera escalões de preço a partir do inventário", () => {
    expect(priceSteps(vehicles)).toEqual([20000, 25000, 30000]);
  });

  it("viaturas semelhantes excluem a própria e preferem a mesma marca", () => {
    const s1 = getVehicleBySlug("bmw-serie-1-2020-gasolina")!;
    const similar = getSimilarVehicles(s1, 3);
    expect(similar.map((v) => v.id)).not.toContain(s1.id);
    expect(similar[0].make).toBe("BMW");
  });
});
