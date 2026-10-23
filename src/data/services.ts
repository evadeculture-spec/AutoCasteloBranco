/**
 * Serviços de oficina — CONTEÚDO DEMONSTRATIVO.
 *
 * `confirmed: false` significa que o serviço ainda não foi validado pelo
 * proprietário. Enquanto assim estiver, a página identifica-o como tal.
 * Não descrever equipamento, certificações ou técnicos sem confirmação.
 */
export interface WorkshopService {
  id: string;
  code: string;
  title: string;
  summary: string;
  includes: string[];
  confirmed: boolean;
}

export const services: WorkshopService[] = [
  {
    id: "manutencao",
    code: "M-01",
    title: "Manutenção preventiva",
    summary:
      "Intervenções periódicas segundo o plano do fabricante, para manter a viatura fiável e evitar avarias maiores.",
    includes: ["Mudança de óleo e filtros", "Verificação de níveis e fluidos", "Inspeção visual de componentes de desgaste"],
    confirmed: false,
  },
  {
    id: "revisao",
    code: "R-02",
    title: "Revisão",
    summary:
      "Revisão completa com verificação dos principais sistemas e registo do que foi feito, para saber exatamente o estado do seu automóvel.",
    includes: ["Verificação por pontos de controlo", "Relatório do estado da viatura", "Recomendações por prioridade"],
    confirmed: false,
  },
  {
    id: "diagnostico",
    code: "D-03",
    title: "Diagnóstico",
    summary:
      "Identificação da origem de avarias, luzes de aviso no painel ou comportamentos anormais, antes de qualquer reparação.",
    includes: ["Leitura de anomalias", "Análise do sintoma descrito", "Orçamento antes de intervir"],
    confirmed: false,
  },
  {
    id: "travagem",
    code: "T-04",
    title: "Sistema de travagem",
    summary: "Verificação e substituição de pastilhas, discos e líquido de travões.",
    includes: ["Medição de desgaste", "Substituição de componentes", "Verificação do líquido de travões"],
    confirmed: false,
  },
  {
    id: "pneus",
    code: "P-05",
    title: "Pneus e geometria",
    summary: "Montagem, equilibragem e verificação do estado dos pneus para uma condução segura.",
    includes: ["Montagem e equilibragem", "Verificação de pressão e desgaste", "Aconselhamento na escolha"],
    confirmed: false,
  },
  {
    id: "pre-inspecao",
    code: "I-06",
    title: "Preparação para inspeção",
    summary: "Verificação prévia dos pontos avaliados na inspeção periódica obrigatória.",
    includes: ["Iluminação e sinalização", "Travões e suspensão", "Emissões e elementos de segurança"],
    confirmed: false,
  },
];

/** Opções do formulário de marcação. */
export const serviceOptions = [
  ...services.map((s) => ({ value: s.id, label: s.title })),
  { value: "outro", label: "Outro / não sei" },
];
