import type { Shot, Vehicle, VehicleImage } from "./types";

/**
 * ============================================================
 *  INVENTÁRIO DE DEMONSTRAÇÃO — DADOS FICTÍCIOS
 * ============================================================
 *  Todas as viaturas abaixo têm `demo: true`. Preços, anos,
 *  quilometragens e especificações são fictícios e servem apenas
 *  para demonstrar o website. Não existem matrículas, números de
 *  chassis, históricos ou garantias associados.
 *
 *  Para substituir por inventário real, edite este ficheiro ou
 *  troque a implementação de `src/lib/inventory.ts` por uma
 *  ligação a base de dados / backoffice (ver README).
 * ============================================================
 */

const SHOT_LABEL: Record<Shot, string> = {
  perfil: "perfil lateral",
  "frente-34": "vista frontal a três quartos",
  "traseira-34": "vista traseira a três quartos",
  interior: "habitáculo e posto de condução",
  painel: "painel de instrumentos",
  detalhe: "detalhe de jante e travões",
};

/** Plano de fotografia padrão, ainda sem fotografias. */
function shotList(name: string): VehicleImage[] {
  return (Object.keys(SHOT_LABEL) as Shot[]).map((shot) => ({
    shot,
    src: null,
    alt: `${name} — ${SHOT_LABEL[shot]}`,
  }));
}

export const SHOT_LABELS = SHOT_LABEL;

const unknownSpecs = {
  powerHp: null,
  engineCc: null,
  doors: null,
  seats: null,
  colour: null,
  traction: null,
} as const;

export const vehicles: Vehicle[] = [
  {
    id: "demo-01",
    slug: "bmw-serie-3-2021-diesel",
    demo: true,
    make: "BMW",
    model: "Série 3",
    version: null,
    year: 2021,
    mileageKm: 78000,
    fuel: "Diesel",
    transmission: "Automática",
    priceEur: 29900,
    availability: "disponivel",
    bodyType: "berlina",
    specs: { ...unknownSpecs },
    headline: "Uma berlina executiva para quem passa muitas horas ao volante.",
    description: [
      "A Série 3 é, há várias gerações, uma referência entre as berlinas de segmento médio-superior: equilíbrio entre conforto em viagem, comportamento em estrada e um habitáculo pensado para quem conduz.",
      "Esta unidade combina motorização Diesel com caixa automática — uma configuração adequada a quem faz quilómetros regulares em autoestrada e procura consumos contidos sem abdicar de suavidade.",
      "Antes de qualquer visita, confirmamos consigo a disponibilidade, a documentação existente e as condições de venda. Tudo o que não estiver confirmado não é apresentado como facto.",
    ],
    equipment: [],
    images: shotList("BMW Série 3"),
    listedAt: "2026-10-01",
  },
  {
    id: "demo-02",
    slug: "bmw-serie-1-2020-gasolina",
    demo: true,
    make: "BMW",
    model: "Série 1",
    version: null,
    year: 2020,
    mileageKm: 65000,
    fuel: "Gasolina",
    transmission: "Manual",
    priceEur: 21900,
    availability: "disponivel",
    bodyType: "hatchback",
    specs: { ...unknownSpecs },
    headline: "Compacto, bem construído e à vontade tanto na cidade como em viagem.",
    description: [
      "O Série 1 traz a qualidade de construção e o cuidado de acabamentos da marca para um formato compacto, fácil de estacionar e versátil no dia a dia.",
      "Motor a gasolina e caixa manual: uma escolha para quem faz sobretudo percursos urbanos e mistos e valoriza o envolvimento na condução.",
      "Todas as especificações de versão, equipamento e histórico são confirmadas diretamente consigo antes de qualquer decisão.",
    ],
    equipment: [],
    images: shotList("BMW Série 1"),
    listedAt: "2026-09-24",
  },
  {
    id: "demo-03",
    slug: "seat-leon-2022-gasolina",
    demo: true,
    make: "SEAT",
    model: "Leon",
    version: null,
    year: 2022,
    mileageKm: 54000,
    fuel: "Gasolina",
    transmission: "Manual",
    priceEur: 19900,
    availability: "disponivel",
    bodyType: "hatchback",
    specs: { ...unknownSpecs },
    headline: "Um familiar compacto atual, com espaço e tecnologia para o dia a dia.",
    description: [
      "A quarta geração do Leon trouxe um desenho mais tenso e um habitáculo moderno, mantendo aquilo que sempre o distinguiu: espaço bem aproveitado e uma condução descontraída.",
      "Com a quilometragem mais baixa do inventário de demonstração, esta unidade a gasolina e caixa manual é uma proposta equilibrada para quem procura um carro recente a um preço contido.",
      "Versão, equipamento e documentação são confirmados antes de qualquer visita ou reserva.",
    ],
    equipment: [],
    images: shotList("SEAT Leon"),
    listedAt: "2026-10-08",
  },
  {
    id: "demo-04",
    slug: "seat-leon-2021-diesel",
    demo: true,
    make: "SEAT",
    model: "Leon",
    version: null,
    year: 2021,
    mileageKm: 82000,
    fuel: "Diesel",
    transmission: "Manual",
    priceEur: 18500,
    availability: "disponivel",
    bodyType: "hatchback",
    specs: { ...unknownSpecs },
    headline: "Diesel, caixa manual e uma relação equilibrada entre preço e utilização.",
    description: [
      "Para quem faz muitos quilómetros, o Leon Diesel continua a ser uma das opções mais racionais do segmento: consumos contidos, bom espaço interior e uma posição de condução confortável.",
      "É a proposta de entrada do inventário de demonstração — pensada para quem quer um compacto recente sem esticar o orçamento.",
      "Confirmamos consigo disponibilidade, documentação existente e condições antes de qualquer deslocação.",
    ],
    equipment: [],
    images: shotList("SEAT Leon"),
    listedAt: "2026-09-30",
  },
];
