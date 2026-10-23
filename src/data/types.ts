export type Fuel = "Gasolina" | "Diesel" | "Híbrido" | "Híbrido plug-in" | "Elétrico" | "GPL";
export type Transmission = "Manual" | "Automática";
export type Availability = "disponivel" | "reservado" | "vendido";
export type BodyType = "berlina" | "hatchback";

/**
 * Plano de fotografia: os enquadramentos que cada viatura deve ter.
 * Enquanto uma fotografia não existir, a galeria mostra o enquadramento
 * pretendido como guia para a sessão fotográfica.
 */
export type Shot =
  | "frente-34"
  | "perfil"
  | "traseira-34"
  | "interior"
  | "painel"
  | "detalhe";

export interface VehicleImage {
  shot: Shot;
  /** Caminho em /public (ex.: /viaturas/bmw-serie-3/01.jpg). `null` = por fotografar. */
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
}

export interface Vehicle {
  id: string;
  slug: string;
  /** `true` para conteúdo fictício de demonstração. Nunca publicar como real. */
  demo: boolean;
  make: string;
  model: string;
  /** Versão comercial exata (ex.: "320d"). `null` = por confirmar. */
  version: string | null;
  year: number;
  mileageKm: number;
  fuel: Fuel;
  transmission: Transmission;
  priceEur: number;
  availability: Availability;
  bodyType: BodyType;
  /** Especificações opcionais: `null` = por confirmar, nunca inventar. */
  specs: {
    powerHp: number | null;
    engineCc: number | null;
    doors: number | null;
    seats: number | null;
    colour: string | null;
    traction: string | null;
  };
  /** Frase de abertura editorial. */
  headline: string;
  /** Parágrafos da descrição editorial. */
  description: string[];
  /** Equipamento confirmado. Lista vazia = por confirmar. */
  equipment: string[];
  images: VehicleImage[];
  /** Data de entrada no inventário (ISO). */
  listedAt: string;
}
