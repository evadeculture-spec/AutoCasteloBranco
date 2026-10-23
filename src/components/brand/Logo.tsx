import { cn } from "@/lib/cn";

/**
 * Símbolo: uma torre com três ameias — referência discreta ao "Castelo" —
 * desenhada com a mesma geometria rigorosa dos alçados técnicos.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true" focusable="false">
      <path
        d="M3 25V6h4.5v3.5h4V6h5v3.5h4V6H25v19z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 25v-7.5h8V25" fill="var(--color-accent)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark className="size-7 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display-wide text-[0.98rem] font-extrabold tracking-[-0.01em] uppercase">
          Castelo Branco
        </span>{" "}
        {!compact && (
          <span className="label mt-[5px] text-[0.6rem] tracking-[0.42em] opacity-70">Auto</span>
        )}
      </span>
    </span>
  );
}
