import { vehicles } from "@/data/vehicles";
import type { Availability, Fuel, Transmission, Vehicle } from "@/data/types";

/**
 * Camada de acesso ao inventário.
 *
 * Hoje lê um ficheiro local; amanhã pode ler uma base de dados ou um
 * backoffice. As páginas só dependem destas funções, por isso a troca
 * da fonte de dados não exige alterações na apresentação.
 */

export function getVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.availability !== "vendido");
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getFeaturedVehicles(limit = 4): Vehicle[] {
  return sortVehicles(getVehicles(), "recentes").slice(0, limit);
}

/** Semelhantes: mesma marca ou carroçaria, ordenados por proximidade de preço. */
export function getSimilarVehicles(vehicle: Vehicle, limit = 3): Vehicle[] {
  return getVehicles()
    .filter((v) => v.id !== vehicle.id)
    .map((v) => ({
      v,
      score:
        (v.make === vehicle.make ? 0 : 1) * 100000 +
        (v.bodyType === vehicle.bodyType ? 0 : 1) * 50000 +
        Math.abs(v.priceEur - vehicle.priceEur),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ v }) => v);
}

export function vehicleName(v: Pick<Vehicle, "make" | "model" | "version">): string {
  return [v.make, v.model, v.version].filter(Boolean).join(" ");
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

/* ------------------------------------------------------------------ */
/* Filtros e ordenação — funções puras, partilhadas com o cliente.     */
/* ------------------------------------------------------------------ */

export const SORT_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "preco-asc", label: "Preço mais baixo" },
  { value: "preco-desc", label: "Preço mais alto" },
  { value: "ano-desc", label: "Ano mais recente" },
  { value: "ano-asc", label: "Ano mais antigo" },
  { value: "km-asc", label: "Menos quilómetros" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface VehicleFilters {
  make: string | null;
  fuel: Fuel | null;
  transmission: Transmission | null;
  maxPrice: number | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: VehicleFilters = {
  make: null,
  fuel: null,
  transmission: null,
  maxPrice: null,
  sort: "recentes",
};

const SORT_KEYS = new Set<string>(SORT_OPTIONS.map((o) => o.value));

/** Lê filtros a partir dos parâmetros do URL, ignorando valores inválidos. */
export function parseFilters(params: URLSearchParams, list: Vehicle[]): VehicleFilters {
  const makes = new Set(list.map((v) => v.make.toLowerCase()));
  const fuels = new Set<string>(list.map((v) => v.fuel));
  const transmissions = new Set<string>(list.map((v) => v.transmission));

  const make = params.get("marca");
  const fuel = params.get("combustivel");
  const transmission = params.get("caixa");
  const maxPrice = Number(params.get("ate"));
  const sort = params.get("ordem");

  const matchedMake = make ? list.find((v) => v.make.toLowerCase() === make.toLowerCase())?.make : null;
  const matchedFuel = fuel ? [...fuels].find((f) => slugify(f) === fuel) : null;
  const matchedTransmission = transmission ? [...transmissions].find((t) => slugify(t) === transmission) : null;

  return {
    make: matchedMake && makes.has(matchedMake.toLowerCase()) ? matchedMake : null,
    fuel: (matchedFuel as Fuel) ?? null,
    transmission: (matchedTransmission as Transmission) ?? null,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : null,
    sort: sort && SORT_KEYS.has(sort) ? (sort as SortKey) : "recentes",
  };
}

/** Converte filtros em parâmetros de URL legíveis (ex.: ?marca=bmw&combustivel=diesel). */
export function serializeFilters(filters: VehicleFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.make) params.set("marca", filters.make.toLowerCase());
  if (filters.fuel) params.set("combustivel", slugify(filters.fuel));
  if (filters.transmission) params.set("caixa", slugify(filters.transmission));
  if (filters.maxPrice) params.set("ate", String(filters.maxPrice));
  if (filters.sort !== "recentes") params.set("ordem", filters.sort);
  return params;
}

export function applyFilters(list: Vehicle[], filters: VehicleFilters): Vehicle[] {
  const filtered = list.filter(
    (v) =>
      (!filters.make || v.make === filters.make) &&
      (!filters.fuel || v.fuel === filters.fuel) &&
      (!filters.transmission || v.transmission === filters.transmission) &&
      (!filters.maxPrice || v.priceEur <= filters.maxPrice),
  );
  return sortVehicles(filtered, filters.sort);
}

export function sortVehicles(list: Vehicle[], sort: SortKey): Vehicle[] {
  const sorted = [...list];
  const by: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
    recentes: (a, b) => b.listedAt.localeCompare(a.listedAt),
    "preco-asc": (a, b) => a.priceEur - b.priceEur,
    "preco-desc": (a, b) => b.priceEur - a.priceEur,
    "ano-desc": (a, b) => b.year - a.year || a.mileageKm - b.mileageKm,
    "ano-asc": (a, b) => a.year - b.year || a.mileageKm - b.mileageKm,
    "km-asc": (a, b) => a.mileageKm - b.mileageKm,
  };
  return sorted.sort(by[sort]);
}

export function countActiveFilters(filters: VehicleFilters): number {
  return [filters.make, filters.fuel, filters.transmission, filters.maxPrice].filter(Boolean).length;
}

/** Escalões de preço gerados a partir do inventário (múltiplos de 5 000 €). */
export function priceSteps(list: Vehicle[]): number[] {
  if (!list.length) return [];
  const min = Math.min(...list.map((v) => v.priceEur));
  const max = Math.max(...list.map((v) => v.priceEur));
  const steps: number[] = [];
  for (let p = Math.ceil(min / 5000) * 5000; p < max + 5000; p += 5000) steps.push(p);
  return steps;
}

export function facets(list: Vehicle[]) {
  const uniq = <T,>(arr: T[]) => [...new Set(arr)].sort();
  return {
    makes: uniq(list.map((v) => v.make)),
    fuels: uniq(list.map((v) => v.fuel)),
    transmissions: uniq(list.map((v) => v.transmission)),
    prices: priceSteps(list),
  };
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
