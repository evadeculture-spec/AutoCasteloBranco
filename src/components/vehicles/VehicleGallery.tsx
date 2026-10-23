"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { VehicleVisual } from "./VehicleVisual";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import type { Vehicle } from "@/data/types";
import { SHOT_LABELS } from "@/data/vehicles";
import { cn } from "@/lib/cn";

/**
 * Galeria: deslizar (scroll-snap nativo) em ecrãs táteis, setas e teclado
 * (← →) no computador, miniaturas para saltar diretamente.
 */
export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const images = vehicle.images;
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const total = images.length;

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = Math.max(0, Math.min(total - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
      setIndex(next);
    },
    [total],
  );

  // Sincronizar o índice quando o utilizador desliza com o dedo.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / el.clientWidth)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!total) return null;

  return (
    <div
      role="region"
      aria-roledescription="galeria"
      aria-label={`Imagens de ${vehicle.make} ${vehicle.model}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(index + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(index - 1);
        }
      }}
    >
      <div className="relative">
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="Use as setas do teclado para mudar de imagem"
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain sm:aspect-[16/10]"
        >
          {images.map((img, i) => (
            <div
              key={`${img.shot}-${i}`}
              role="group"
              aria-roledescription="imagem"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== index}
              className="relative h-full w-full shrink-0 snap-center snap-always"
            >
              <VehicleVisual
                vehicle={vehicle}
                image={img}
                sizes="(min-width: 1024px) 64vw, 100vw"
                priority={i === 0}
                showShotLabel
              />
            </div>
          ))}
        </div>

        {/* Contador */}
        <p className="label tabular pointer-events-none absolute top-4 right-4 bg-paper/90 px-2 py-1 text-ink" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        {/* Setas */}
        <div className="absolute right-4 bottom-4 hidden gap-1 sm:flex">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Imagem anterior"
            className="flex size-12 items-center justify-center bg-ink text-paper transition-opacity hover:bg-steel disabled:opacity-30"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
            aria-label="Imagem seguinte"
            className="flex size-12 items-center justify-center bg-ink text-paper transition-opacity hover:bg-steel disabled:opacity-30"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Miniaturas */}
      <ol id={uid} className="no-scrollbar mt-2 flex gap-2 overflow-x-auto" aria-label="Miniaturas">
        {images.map((img, i) => (
          <li key={`${img.shot}-${i}`} className="w-[22%] shrink-0 sm:w-auto sm:flex-1">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? "true" : undefined}
              aria-label={`Ver imagem ${i + 1}: ${SHOT_LABELS[img.shot]}`}
              className={cn(
                "relative block aspect-[4/3] w-full overflow-hidden transition-opacity",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:transition-colors",
                i === index ? "opacity-100 after:bg-accent" : "opacity-55 after:bg-transparent hover:opacity-90",
              )}
            >
              <VehicleVisual vehicle={vehicle} image={img} sizes="120px" bare />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
