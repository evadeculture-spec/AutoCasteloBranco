import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/data/types";

/** Grelha do inventário — também usada como versão sem JavaScript / pré-renderizada. */
export function InventoryGrid({ vehicles, animateKey }: { vehicles: Vehicle[]; animateKey?: string }) {
  return (
    <ol key={animateKey} className="grid gap-x-8 gap-y-14 md:grid-cols-2 3xl:grid-cols-3">
      {vehicles.map((v, i) => (
        <li
          key={v.id}
          className={animateKey !== undefined ? "anim-rise" : undefined}
          style={animateKey !== undefined ? { ["--delay" as string]: `${Math.min(i, 6) * 60}ms` } : undefined}
        >
          <VehicleCard vehicle={v} sizes="(min-width: 1792px) 33vw, (min-width: 768px) 50vw, 100vw" priority={i < 2} />
        </li>
      ))}
    </ol>
  );
}
