import Link from "next/link";
import { VehicleVisual } from "./VehicleVisual";
import { ArrowRight } from "@/components/ui/icons";
import type { Vehicle } from "@/data/types";
import { AVAILABILITY_LABEL } from "@/lib/inventory";
import { formatKm, formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function AvailabilityTag({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const available = vehicle.availability === "disponivel";
  return (
    <span className={cn("label inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", available ? "bg-ok" : "bg-accent")}
      />
      {AVAILABILITY_LABEL[vehicle.availability]}
    </span>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn("label border border-current px-1.5 py-0.5 text-[0.6rem] tracking-[0.16em]", className)}
      title="Viatura fictícia de demonstração"
    >
      Exemplo
    </span>
  );
}

/** Linha de especificações principais, sempre na mesma ordem para facilitar comparação. */
export function SpecLine({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const items = [
    { k: "Ano", v: String(vehicle.year) },
    { k: "Quilometragem", v: formatKm(vehicle.mileageKm) },
    { k: "Combustível", v: vehicle.fuel },
    { k: "Caixa", v: vehicle.transmission },
  ];
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4", className)}>
      {items.map((i) => (
        <div key={i.k} className="min-w-0">
          <dt className="label text-[0.62rem] opacity-60">{i.k}</dt>
          <dd className="tabular mt-1 truncate text-[0.95rem] font-medium">{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function VehicleCard({
  vehicle,
  index,
  aspect = "aspect-[16/10]",
  size = "md",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  headingLevel = "h3",
}: {
  vehicle: Vehicle;
  index?: number;
  aspect?: string;
  size?: "md" | "lg";
  sizes?: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="group zoom-on-hover relative flex flex-col">
      <div className={cn("relative overflow-hidden", aspect)}>
        <VehicleVisual vehicle={vehicle} sizes={sizes} priority={priority} />
        <div className="absolute top-0 left-0 flex items-center gap-3 p-4 text-ink">
          {typeof index === "number" && (
            <span className="label tabular bg-paper/85 px-1.5 py-0.5">{String(index).padStart(2, "0")}</span>
          )}
          {vehicle.demo && <DemoTag className="bg-paper/85" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col border-b border-ink/15 pt-5 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <AvailabilityTag vehicle={vehicle} className="text-muted" />
            <Heading
              className={cn(
                "font-display mt-2 leading-[1.02] font-bold",
                size === "lg" ? "text-[clamp(1.7rem,3vw,2.6rem)]" : "text-[clamp(1.4rem,2vw,1.75rem)]",
              )}
            >
              {/* O link cobre todo o cartão, mantendo um único ponto de foco. */}
              <Link href={`/viaturas/${vehicle.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent">
                <span className="block text-[0.55em] font-semibold tracking-[0.02em] text-muted uppercase">{vehicle.make}</span>
                {vehicle.model}
                {vehicle.version && <span className="font-medium"> {vehicle.version}</span>}
                <span className="sr-only">, {vehicle.year}, {formatPrice(vehicle.priceEur)}</span>
              </Link>
            </Heading>
          </div>
          <p className="shrink-0 pt-6 text-right">
            <span className="sr-only">Preço: </span>
            <span
              className={cn(
                "font-display tabular font-semibold",
                size === "lg" ? "text-[clamp(1.5rem,2.4vw,2.1rem)]" : "text-[1.4rem]",
              )}
            >
              {formatPrice(vehicle.priceEur)}
            </span>
          </p>
        </div>
        <SpecLine vehicle={vehicle} className="mt-5" />
        <span className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-accent" aria-hidden="true">
          Ver viatura
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
