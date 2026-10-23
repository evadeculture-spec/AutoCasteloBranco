import { CarRender } from "@/components/brand/CarRender";
import type { BodyType } from "@/data/types";

/**
 * Pontos de verificação sobre o alçado (percentagens do viewBox 1000×400).
 * É a imagem-assinatura da área de oficina: a viatura em "raio-X".
 */
const LABELS = [
  { code: "M-01", label: "Motor e fluidos" },
  { code: "D-03", label: "Diagnóstico" },
  { code: "T-04", label: "Travagem" },
  { code: "P-05", label: "Pneus" },
  { code: "I-06", label: "Iluminação" },
];

const POSITIONS: Record<BodyType, Array<[number, number]>> = {
  berlina: [[17, 50], [44, 34], [21.5, 67], [76, 80.5], [93.2, 48]],
  hatchback: [[17, 50], [44, 34], [22, 67], [73.5, 80], [88.6, 45]],
};

export function inspectionPoints(type: BodyType) {
  return LABELS.map((l, i) => ({ ...l, x: POSITIONS[type][i][0], y: POSITIONS[type][i][1] }));
}

export function InspectionDiagram({ type = "hatchback" }: { type?: BodyType }) {
  return (
    <figure className="relative">
      <div className="relative">
        <CarRender type={type} xray />
        {inspectionPoints(type).map((p, i) => (
          <div
            key={p.code}
            className="anim-fade absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%`, ["--delay" as string]: `${600 + i * 140}ms` }}
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
