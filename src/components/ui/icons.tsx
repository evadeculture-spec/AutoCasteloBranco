import type { SVGProps } from "react";

/**
 * Conjunto de ícones próprio: traço de 1.5px, cantos vivos, grelha de 20px.
 * Decorativos por defeito (aria-hidden); o texto adjacente dá o significado.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Icon className="arrow" {...p}>
    <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" />
  </Icon>
);
export const ArrowLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17 10H4M8.5 5.5 4 10l4.5 4.5" />
  </Icon>
);
export const ArrowUpRight = (p: IconProps) => (
  <Icon className="arrow" {...p}>
    <path d="M6 14 14 6M7.5 6H14v6.5" />
  </Icon>
);
export const ChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 7.5 5 5 5-5" />
  </Icon>
);
export const Phone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 3h3.5l1.5 4-2 1.25a9 9 0 0 0 4.75 4.75L13 11l4 1.5V16a1.5 1.5 0 0 1-1.5 1.5C9 17.5 2.5 11 2.5 4.5A1.5 1.5 0 0 1 4 3Z" />
  </Icon>
);
export const Mail = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 4.5h15v11h-15z" />
    <path d="m2.5 5 7.5 6 7.5-6" />
  </Icon>
);
export const Pin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 1 0-11 0C4.5 12.8 10 18 10 18Z" />
    <circle cx="10" cy="8.5" r="2" />
  </Icon>
);
export const Clock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 5.5V10l3 2" />
  </Icon>
);
export const Chat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 4h14v9.5H8.5L5 16.5v-3H3z" />
    <path d="M6.5 8h7M6.5 10.5h4.5" />
  </Icon>
);
export const Menu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 6h15M2.5 10h15M2.5 14h9" />
  </Icon>
);
export const Close = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" />
  </Icon>
);
export const Sliders = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h8M15 6h2M3 14h2M9 14h8" />
    <path d="M11 4h4v4h-4zM5 12h4v4H5z" />
  </Icon>
);
export const Check = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4 10.5 4 4 8-9" />
  </Icon>
);
export const Alert = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 6v5M10 13.5v.5" />
  </Icon>
);
export const Calendar = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 4.5h14v12H3zM3 8h14M7 2.5v3M13 2.5v3" />
  </Icon>
);
export const Gauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 14a7 7 0 1 1 13 0" />
    <path d="m10 11 3.5-4" />
  </Icon>
);
export const Fuel = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 17V3.5h7.5V17M2.5 17h10.5M4 8.5h7.5" />
    <path d="M11.5 6.5 15 9v6a1.5 1.5 0 0 0 3 0V7l-2-2" />
  </Icon>
);
export const Gearbox = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 3.5v13M10 3.5v13M15 3.5V10H5" />
  </Icon>
);
export const Wrench = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12.5 2.75a4 4 0 0 0-4.6 5.35L2.75 13.25 6.75 17.25l5.15-5.15a4 4 0 0 0 5.35-4.6L14.75 10 10 5.25z" />
  </Icon>
);
export const Car = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 13.5V10l2-4.5h11l2 4.5v3.5zM2.5 10h15" />
    <circle cx="6" cy="14.5" r="1.5" />
    <circle cx="14" cy="14.5" r="1.5" />
  </Icon>
);
export const Camera = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 6h3l1.5-2h6l1.5 2h3v10h-15z" />
    <circle cx="10" cy="10.5" r="3" />
  </Icon>
);
