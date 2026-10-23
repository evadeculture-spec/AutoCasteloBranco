import { cn } from "@/lib/cn";

/** Rótulo de secção numerado — o índice editorial que atravessa o site. */
export function SectionLabel({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("label flex items-center gap-3", className)}>
      {index && <span className="tabular">{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}
