import { GEOMETRY } from "./CarElevation";
import type { BodyType } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Render de estúdio de uma viatura em perfil: pintura metalizada, vidros com
 * reflexo, jantes com pinça vermelha, faróis acesos e reflexo no piso.
 * Ilustração própria da marca — não representa nenhum modelo concreto.
 *
 * `xray` torna a carroçaria translúcida e revela o traço técnico por baixo
 * (usado na área de oficina).
 */

type Finish = "graphite" | "silver";

const PAINT: Record<Finish, { top: string; mid: string; low: string; base: string; line: string; glass: [string, string] }> = {
  graphite: { top: "#5b6168", mid: "#2a2e33", low: "#121416", base: "#08090a", line: "#9aa1a8", glass: ["#2a3036", "#07090b"] },
  silver: { top: "#f4f2ee", mid: "#c9c6c0", low: "#8d8a85", base: "#4b4945", line: "#ffffff", glass: ["#5a6066", "#1b1f23"] },
};

function Wheel({ cx, id, finish }: { cx: number; id: string; finish: Finish }) {
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    const w = 0.2;
    // Arredondado: o servidor e o browser podem diferir nas últimas casas decimais.
    const p = (r: number, d: number) => `${(cx + Math.cos(a + d) * r).toFixed(2)},${(270 + Math.sin(a + d) * r).toFixed(2)}`;
    return <polygon key={i} points={`${p(12, -w * 1.6)} ${p(37, -w * 0.55)} ${p(37, w * 0.55)} ${p(12, w * 1.6)}`} />;
  });
  return (
    <g>
      {/* pneu */}
      <circle cx={cx} cy={270} r={56} fill="#0b0c0d" />
      <circle cx={cx} cy={270} r={53} fill="none" stroke="#1c1e21" strokeWidth={3} />
      {/* jante */}
      <circle cx={cx} cy={270} r={40} fill={`url(#${id}-rim)`} />
      {/* disco e pinça de travão vermelha */}
      <circle cx={cx} cy={270} r={30} fill="#2a2d31" />
      <path
        d={`M ${cx - 22} ${246} A 33 33 0 0 1 ${cx + 6} ${237.5} L ${cx + 4} ${246} A 25 25 0 0 0 ${cx - 16} ${252} Z`}
        fill="var(--color-accent)"
      />
      <g fill={finish === "graphite" ? "#c3c8cd" : "#e9e7e3"}>{spokes}</g>
      <circle cx={cx} cy={270} r={40} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.5} />
      <circle cx={cx} cy={270} r={9} fill="#1a1c1f" stroke="#d9dde1" strokeWidth={1.5} />
    </g>
  );
}

export function CarRender({
  type = "berlina",
  finish = "graphite",
  lights = true,
  reflection = true,
  xray = false,
  className,
  title,
}: {
  type?: BodyType;
  finish?: Finish;
  lights?: boolean;
  reflection?: boolean;
  xray?: boolean;
  className?: string;
  title?: string;
}) {
  const g = GEOMETRY[type];
  const c = PAINT[finish];
  const id = `car-${type}-${finish}`;
  const [w1, w2] = g.wheels;
  const [l1, l2] = g.length;
  const front = l1;

  const car = (
    <g>
      {/* cavas das rodas */}
      <circle cx={w1} cy={270} r={62} fill="#050506" />
      <circle cx={w2} cy={270} r={62} fill="#050506" />
      {/* carroçaria */}
      <path d={g.body} fill={`url(#${id}-paint)`} />
      <path d={g.body} fill={`url(#${id}-side)`} />
      {/* faixa de luz no ombro */}
      <path d={g.shoulder} fill="none" stroke={`url(#${id}-streak)`} strokeWidth={5} strokeLinecap="round" />
      <path d={g.shoulder} transform="translate(0 4)" fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={2} />
      {/* vidros */}
      <path d={g.glass} fill={`url(#${id}-glass)`} />
      <g clipPath={`url(#${id}-glassclip)`}>
        <path d="M380 260 L560 60 L620 60 L440 260 Z" fill="#ffffff" fillOpacity={0.09} />
        <path d="M470 260 L650 60 L672 60 L492 260 Z" fill="#ffffff" fillOpacity={0.06} />
      </g>
      <path d={g.pillar} stroke={c.base} strokeWidth={7} />
      {/* linhas de carroçaria */}
      <g fill="none" stroke={c.line} strokeOpacity={0.22} strokeWidth={1.2}>
        <path d={g.door} />
        <path d={g.sill} />
      </g>
      <path d={g.body} fill="none" stroke={c.line} strokeOpacity={0.35} strokeWidth={1.2} />
      <path d={g.mirror} fill={c.mid} stroke={c.line} strokeOpacity={0.4} />
      {/* óticas */}
      <path d={g.headlight} fill={lights ? "#f6f4ee" : "#bfc3c7"} />
      <path d={g.taillight} fill="var(--color-accent)" />
      <Wheel cx={w1} id={id} finish={finish} />
      <Wheel cx={w2} id={id} finish={finish} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 1000 400"
      className={cn("block h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="90" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.top} />
          <stop offset="0.42" stopColor={c.mid} />
          <stop offset="0.5" stopColor={c.top} stopOpacity={0.9} />
          <stop offset="0.58" stopColor={c.mid} />
          <stop offset="1" stopColor={c.base} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1={l1} y1="0" x2={l2} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity={0.35} />
          <stop offset="0.35" stopColor="#000" stopOpacity={0} />
          <stop offset="0.7" stopColor="#fff" stopOpacity={0.06} />
          <stop offset="1" stopColor="#000" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id={`${id}-streak`} x1={l1} y1="0" x2={l2} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="0.75" stopColor="#fff" stopOpacity={0.15} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="100" x2="0" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={c.glass[0]} />
          <stop offset="1" stopColor={c.glass[1]} />
        </linearGradient>
        <radialGradient id={`${id}-rim`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f1f3f5" />
          <stop offset="0.6" stopColor="#9097a0" />
          <stop offset="1" stopColor="#3b4046" />
        </radialGradient>
        <clipPath id={`${id}-glassclip`}>
          <path d={g.glass} />
        </clipPath>
        <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity={0.75} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff8e6" stopOpacity={0.9} />
          <stop offset="1" stopColor="#fff8e6" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-redglow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff3b3f" stopOpacity={0.7} />
          <stop offset="1" stopColor="#ff3b3f" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-beam`} x1={front} y1="0" x2={front - 200} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8e6" stopOpacity={0.13} />
          <stop offset="1" stopColor="#fff8e6" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="326" x2="0" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0.16} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-reflmask`} maskUnits="userSpaceOnUse" x="-200" y="326" width="1400" height="120">
          <rect x="-200" y="326" width="1400" height="120" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      {/* sombra de contacto */}
      <ellipse cx={(l1 + l2) / 2} cy={328} rx={(l2 - l1) / 2 + 40} ry={16} fill={`url(#${id}-shadow)`} />

      {/* reflexo no piso */}
      {reflection && !xray && (
        <g mask={`url(#${id}-reflmask)`}>
          <g transform="translate(0 652) scale(1 -1)">{car}</g>
        </g>
      )}

      {/* feixe dos faróis */}
      {lights && !xray && (
        <>
          <path d={`M ${front + 30} 212 L ${front - 200} 178 L ${front - 200} 268 Z`} fill={`url(#${id}-beam)`} />
          <ellipse cx={front + 40} cy={214} rx={46} ry={22} fill={`url(#${id}-glow)`} />
          <ellipse cx={g.length[1] - 14} cy={190} rx={36} ry={20} fill={`url(#${id}-redglow)`} />
        </>
      )}

      <g className="transition-opacity duration-700" style={{ opacity: xray ? 0.16 : 1 }}>
        {car}
      </g>

      {/* traço técnico revelado em modo raio-X */}
      <g
        className="transition-opacity duration-700"
        style={{ opacity: xray ? 1 : 0 }}
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      >
        <path d={g.body} />
        <path d={g.glass} strokeOpacity={0.8} />
        <path d={g.pillar} strokeOpacity={0.8} />
        <path d={g.shoulder} strokeOpacity={0.45} />
        <path d={g.door} strokeOpacity={0.35} />
        <circle cx={w1} cy={270} r={56} />
        <circle cx={w2} cy={270} r={56} />
        <circle cx={w1} cy={270} r={39} strokeOpacity={0.6} />
        <circle cx={w2} cy={270} r={39} strokeOpacity={0.6} />
      </g>
    </svg>
  );
}
