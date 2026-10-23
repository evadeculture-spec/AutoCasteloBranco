import { CarElevation } from "@/components/brand/CarElevation";

/**
 * Diagrama de inspeção: o alçado técnico com pontos de verificação numerados.
 * É a imagem-assinatura da área de oficina (as viaturas usam o registo editorial).
 */
const POINTS = [
  { code: "M-01", label: "Motor e fluidos", x: 17, y: 50 },
  { code: "D-03", label: "Diagnóstico", x: 44, y: 34 },
  { code: "T-04", label: "Travagem", x: 22, y: 67 },
  { code: "P-05", label: "Pneus", x: 73.5, y: 80 },
  { code: "I-06", label: "Iluminação", x: 88.6, y: 45 },
];

export function InspectionDiagram() {
  return (
    <figure className="relative">
      <div className="relative">
        <CarElevation type="hatchback" animate />
        {POINTS.map((p, i) => (
          <div
            key={p.code}
            className="anim-fade absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, ["--delay" as string]: `${1400 + i * 140}ms` }}
          >
            <span className="relative -mt-2.5 -ml-2.5 flex size-5 items-center justify-center rounded-full border border-accent-light bg-ink">
              <span className="size-1.5 rounded-full bg-accent-light" />
            </span>
            <span
              className={`absolute top-0 hidden -translate-y-1/2 items-center sm:flex ${
                p.x > 70 ? "right-2.5 flex-row-reverse" : "left-2.5"
              }`}
            >
              <span aria-hidden="true" className="h-px w-6 bg-accent-light/70" />
              <span className="label border border-steel bg-ink px-1.5 py-1 text-[0.6rem] whitespace-nowrap text-mist">
                <span className="text-accent-light">{p.code}</span> {p.label}
              </span>
            </span>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">Diagrama ilustrativo dos principais pontos de verificação de uma viatura.</figcaption>
    </figure>
  );
}
