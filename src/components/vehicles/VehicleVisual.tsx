import Image from "next/image";
import { CarRender } from "@/components/brand/CarRender";
import { Camera } from "@/components/ui/icons";
import { SHOT_LABELS } from "@/data/vehicles";
import type { Vehicle, VehicleImage } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Imagem de uma viatura. Usa a fotografia quando existe; caso contrário mostra
 * o alçado técnico com a indicação explícita de que a fotografia está por fazer.
 * A proporção é sempre fixa (sem saltos de layout), definida pelo contentor.
 */
export function VehicleVisual({
  vehicle,
  image,
  sizes,
  priority = false,
  tone = "paper",
  showShotLabel = false,
  bare = false,
  className,
}: {
  vehicle: Vehicle;
  image?: VehicleImage;
  sizes: string;
  priority?: boolean;
  tone?: "paper" | "graphite";
  showShotLabel?: boolean;
  /** Sem texto (miniaturas): o nome acessível fica no botão que a envolve. */
  bare?: boolean;
  className?: string;
}) {
  const img = image ?? vehicle.images[0];

  if (img?.src) {
    return (
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("zoom-target object-cover", className)}
      />
    );
  }

  const dark = tone === "graphite";
  const shot = img?.shot ?? "perfil";
  const shotIndex = Math.max(0, vehicle.images.findIndex((i) => i.shot === shot)) + 1;

  return (
    <div
      role={bare ? undefined : "img"}
      aria-label={bare ? undefined : `${img?.alt ?? `${vehicle.make} ${vehicle.model}`} — fotografia por fornecer`}
      aria-hidden={bare || undefined}
      className={cn(
        "@container absolute inset-0 overflow-hidden",
        dark ? "bg-graphite text-paper" : "bg-paper-2 text-ink",
        className,
      )}
    >
      {/* luz de estúdio */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(120% 80% at 50% 0%, #34383c 0%, #1a1c1e 55%, #111213 100%)"
            : "radial-gradient(120% 80% at 50% 0%, #faf8f4 0%, #ebe7e0 55%, #dcd7cd 100%)",
        }}
      />
      {/* grelha técnica */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {shot === "perfil" ? (
        <>
          {/* Modelo em tipografia de fundo: cada viatura com identidade própria. */}
          {!bare && <span
            aria-hidden="true"
            className="font-display-wide pointer-events-none absolute top-[17%] left-[5%] text-[19cqw] leading-none font-extrabold whitespace-nowrap uppercase opacity-[0.06] select-none"
          >
            {vehicle.model}
          </span>}
          {!showShotLabel && !bare && (
            <span aria-hidden="true" className="label tabular absolute top-[7%] right-[5%] hidden text-[0.6rem] opacity-50 @[22rem]:block">
              {vehicle.year} · {vehicle.fuel}
            </span>
          )}
          <div className="zoom-target absolute inset-0 flex items-end justify-center pb-[7%]">
            <div className="w-[86%] shrink-0">
              <CarRender type={vehicle.bodyType} finish={dark ? "graphite" : "silver"} lights={dark} reflection={!bare} />
            </div>
          </div>
        </>
      ) : (
        /* Guia de enquadramento: o plano que falta fotografar, sem simular a imagem. */
        <div className="zoom-target absolute inset-[8%] flex flex-col items-center justify-center text-center">
          {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map((c) => (
            <span key={c} aria-hidden="true" className={cn("absolute size-[9%] border-current opacity-40", c)} />
          ))}
          {!bare && <span aria-hidden="true" className="label tabular text-[0.6rem] opacity-50 @[16rem]:text-[0.7rem]">
            Plano {String(shotIndex).padStart(2, "0")}
          </span>}
          {!bare && <span aria-hidden="true" className="font-display mt-2 hidden max-w-[80%] text-[6cqw] leading-tight font-semibold opacity-70 first-letter:uppercase @[10rem]:block">
            {SHOT_LABELS[shot]}
          </span>}
          {bare && <Camera size={16} className="opacity-35" />}
        </div>
      )}

      {showShotLabel && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 sm:p-5">
          <Camera size={16} />
          <span className="label opacity-80">
            {SHOT_LABELS[shot]} · fotografia por fornecer
          </span>
        </div>
      )}
    </div>
  );
}
