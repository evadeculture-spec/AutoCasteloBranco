import type { BodyType } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Alçado técnico de uma viatura (perfil lateral), desenhado a traço.
 * Não representa nenhum modelo concreto nem reproduz marcas: é a linguagem
 * gráfica da Auto Castelo Branco enquanto não existem fotografias reais.
 */

interface Geometry {
  body: string;
  glass: string;
  pillar: string;
  shoulder: string;
  sill: string;
  door: string;
  headlight: string;
  taillight: string;
  mirror: string;
  wheels: [number, number];
  length: [number, number];
}

const GEOMETRY: Record<BodyType, Geometry> = {
  berlina: {
    body: "M70 292 C56 278 52 242 66 218 C84 203 126 196 172 191 C252 183 322 174 376 167 C424 140 470 113 522 103 C584 92 664 92 716 100 C774 111 822 141 852 162 C884 166 916 171 936 180 C950 193 952 227 948 257 C946 277 940 289 930 292 L819.3 294 A64 64 0 1 0 700.7 294 L274.3 294 A64 64 0 1 0 155.7 294 Z",
    glass: "M398 162 C436 140 480 117 526 109 C586 100 656 100 704 108 C746 116 790 140 816 158 Z",
    pillar: "M606 102 L610 160",
    shoulder: "M88 226 C300 216 610 209 940 198",
    sill: "M300 279 L676 279",
    door: "M402 166 C396 205 396 250 404 282 M610 160 L614 284",
    headlight: "M72 214 L132 206 L146 214 L92 222 Z",
    taillight: "M918 182 L944 186 L947 205 L916 201 Z",
    mirror: "M420 160 L440 152 L446 162 L424 166 Z",
    wheels: [215, 760],
    length: [52, 952],
  },
  hatchback: {
    body: "M76 292 C60 278 58 244 72 220 C90 205 130 198 176 193 C246 186 306 178 360 170 C410 142 456 115 508 105 C572 95 660 95 724 100 C780 105 826 113 856 123 C872 141 884 169 890 201 C896 237 894 271 886 292 L794.3 294 A64 64 0 1 0 675.7 294 L279.3 294 A64 64 0 1 0 160.7 294 Z",
    glass: "M382 166 C420 142 464 119 512 112 C576 103 650 103 710 107 C760 111 800 119 828 129 L846 165 Z",
    pillar: "M594 105 L600 164",
    shoulder: "M92 228 C300 218 600 210 892 198",
    sill: "M300 279 L656 279",
    door: "M386 168 C380 206 380 250 388 282 M600 164 L604 284",
    headlight: "M78 216 L138 208 L150 216 L98 224 Z",
    taillight: "M866 166 L888 174 L892 196 L868 190 Z",
    mirror: "M404 162 L424 154 L430 164 L408 168 Z",
    wheels: [220, 735],
    length: [58, 896],
  },
};

function Wheel({ cx }: { cx: number }) {
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * 11}
        y1={270 + Math.sin(a) * 11}
        x2={cx + Math.cos(a) * 36}
        y2={270 + Math.sin(a) * 36}
      />
    );
  });
  return (
    <g>
      <circle cx={cx} cy={270} r={56} />
      <circle cx={cx} cy={270} r={39} strokeOpacity={0.7} />
      <circle cx={cx} cy={270} r={29} strokeOpacity={0.35} strokeDasharray="2 5" />
      <circle cx={cx} cy={270} r={8} />
      <g strokeOpacity={0.55}>{spokes}</g>
    </g>
  );
}

export interface CarElevationProps {
  type?: BodyType;
  className?: string;
  /** Mostra cotas (distância entre eixos, comprimento) — o registo técnico. */
  dimensions?: boolean;
  /** Anima o traço à entrada (respeita movimento reduzido via CSS). */
  animate?: boolean;
  /** Texto alternativo. Sem ele, o desenho é decorativo. */
  title?: string;
  tone?: "light" | "dark";
}

export function CarElevation({
  type = "berlina",
  className,
  dimensions = false,
  animate = false,
  title,
  tone = "light",
}: CarElevationProps) {
  const g = GEOMETRY[type];
  const [w1, w2] = g.wheels;
  const [l1, l2] = g.length;
  const stroke = tone === "light" ? "var(--color-paper)" : "var(--color-ink)";
  const draw = animate ? "anim-draw" : undefined;

  return (
    <svg
      viewBox="0 0 1000 400"
      className={cn("car-elevation block h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* chão e reflexo */}
      <line x1="-3000" y1="326.5" x2="4000" y2="326.5" stroke={stroke} strokeOpacity={0.28} />
      <ellipse cx={(l1 + l2) / 2} cy="328" rx={(l2 - l1) / 2 + 30} ry="9" fill={stroke} fillOpacity={0.07} />

      <g
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d={g.body} className={draw} style={{ ["--len" as string]: 2600 }} />
        <path d={g.glass} strokeOpacity={0.85} className={draw} style={{ ["--len" as string]: 1200, ["--delay" as string]: "250ms" }} />
        <path d={g.pillar} strokeOpacity={0.85} />
        <path d={g.door} strokeOpacity={0.4} />
        <path d={g.shoulder} strokeOpacity={0.5} className={draw} style={{ ["--len" as string]: 1000, ["--delay" as string]: "500ms" }} />
        <path d={g.sill} strokeOpacity={0.3} />
        <path d={g.headlight} strokeOpacity={0.8} />
        <path d={g.mirror} strokeOpacity={0.7} />
        <Wheel cx={w1} />
        <Wheel cx={w2} />
      </g>

      {/* farolim traseiro: o único elemento a vermelho */}
      <path d={g.taillight} fill="var(--color-accent)" stroke="var(--color-accent-light)" strokeWidth={1} />

      {dimensions && (
        <g
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="1.5"
          fill={stroke}
          fillOpacity={0.6}
          stroke={stroke}
          strokeOpacity={0.4}
          strokeWidth={1}
        >
          {/* distância entre eixos */}
          <line x1={w1} y1="342" x2={w2} y2="342" />
          <line x1={w1} y1="334" x2={w1} y2="350" />
          <line x1={w2} y1="334" x2={w2} y2="350" />
          <text x={(w1 + w2) / 2} y="364" textAnchor="middle" stroke="none">
            DISTÂNCIA ENTRE EIXOS
          </text>
          {/* comprimento total */}
          <line x1={l1} y1="384" x2={l2} y2="384" strokeDasharray="3 4" />
          <line x1={l1} y1="376" x2={l1} y2="392" />
          <line x1={l2} y1="376" x2={l2} y2="392" />
          {/* eixos verticais */}
          <line x1={w1} y1="190" x2={w1} y2="214" strokeDasharray="2 3" />
          <line x1={w2} y1="190" x2={w2} y2="214" strokeDasharray="2 3" />
        </g>
      )}
    </svg>
  );
}
