"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import { InventoryGrid } from "./InventoryGrid";
import { ArrowRight, Close, Sliders } from "@/components/ui/icons";
import type { Vehicle } from "@/data/types";
import {
  SORT_OPTIONS,
  applyFilters,
  countActiveFilters,
  facets,
  parseFilters,
  serializeFilters,
  type VehicleFilters,
} from "@/lib/inventory";
import { formatPrice } from "@/lib/format";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/* ---------- Controlos ---------- */

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  allLabel,
}: {
  legend: string;
  options: readonly T[];
  value: T | null;
  onChange: (v: T | null) => void;
  allLabel: string;
}) {
  const items: Array<{ v: T | null; label: string }> = [{ v: null, label: allLabel }, ...options.map((o) => ({ v: o, label: o }))];
  return (
    <fieldset className="min-w-0">
      <legend className="label mb-2.5 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const active = item.v === value;
          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(item.v)}
              className={cn(
                "min-h-11 border px-3.5 text-[0.9rem] font-medium transition-colors duration-200",
                active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink/60",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  children,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label mb-2.5 block text-muted">
        {label}
      </label>
      <select id={id} className="field min-h-11 py-2 text-[0.92rem]" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
}

function FilterControls({
  filters,
  update,
  facetData,
  idPrefix,
  layout,
}: {
  filters: VehicleFilters;
  update: (patch: Partial<VehicleFilters>) => void;
  facetData: ReturnType<typeof facets>;
  idPrefix: string;
  layout: "bar" | "sheet";
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        layout === "bar" && "lg:grid-cols-[auto_auto_auto_minmax(10rem,13rem)] lg:items-end lg:gap-8",
      )}
    >
      <Segmented legend="Marca" allLabel="Todas" options={facetData.makes} value={filters.make} onChange={(make) => update({ make })} />
      <Segmented
        legend="Combustível"
        allLabel="Todos"
        options={facetData.fuels}
        value={filters.fuel}
        onChange={(fuel) => update({ fuel })}
      />
      <Segmented
        legend="Caixa de velocidades"
        allLabel="Todas"
        options={facetData.transmissions}
        value={filters.transmission}
        onChange={(transmission) => update({ transmission })}
      />
      <SelectControl
        id={`${idPrefix}-preco`}
        label="Preço máximo"
        value={filters.maxPrice ? String(filters.maxPrice) : ""}
        onChange={(v) => update({ maxPrice: v ? Number(v) : null })}
      >
        <option value="">Sem limite</option>
        {facetData.prices.map((p) => (
          <option key={p} value={p}>
            Até {formatPrice(p)}
          </option>
        ))}
      </SelectControl>
    </div>
  );
}

/* ---------- Componente principal ---------- */

export function InventoryBrowser({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uid = useId();

  const facetData = useMemo(() => facets(vehicles), [vehicles]);
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString()), vehicles), [searchParams, vehicles]);
  const results = useMemo(() => applyFilters(vehicles, filters), [vehicles, filters]);
  const active = countActiveFilters(filters);
  const signature = serializeFilters(filters).toString();

  function update(patch: Partial<VehicleFilters>) {
    const next = { ...filters, ...patch };
    const qs = serializeFilters(next).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    track("inventory_filter", { filters: qs || "nenhum" });
  }

  function reset() {
    router.replace(pathname, { scroll: false });
  }

  // Fechar a folha de filtros quando a página fica oculta (navegação com <Activity>).
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  // Fechar ao clicar no fundo da folha.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  const countLabel = `${results.length} ${results.length === 1 ? "viatura" : "viaturas"}`;

  return (
    <div>
      {/* Barra de filtros — desktop */}
      <div role="group" aria-label="Filtros" className="hidden border-y border-ink/15 py-7 lg:block">
        <FilterControls filters={filters} update={update} facetData={facetData} idPrefix={`${uid}-bar`} layout="bar" />
      </div>

      {/* Resumo + ordenação (todos os tamanhos) */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 py-5 max-lg:border-t lg:border-t-0">
        <div className="flex items-center gap-4">
          <p className="font-display tabular text-[1.25rem] font-semibold" aria-live="polite" aria-atomic="true">
            {countLabel}
          </p>
          {active > 0 && (
            <button type="button" onClick={reset} className="link-line hidden text-[0.9rem] font-medium text-muted hover:text-ink lg:inline">
              Limpar filtros ({active})
            </button>
          )}
        </div>
        <div className="flex w-full items-end gap-3 sm:w-auto">
          <button
            type="button"
            className="btn btn-outline min-h-11 flex-1 py-2 text-[0.92rem] lg:hidden"
            onClick={() => dialogRef.current?.showModal()}
            aria-haspopup="dialog"
          >
            <span className="inline-flex items-center gap-2">
              <Sliders size={18} /> Filtros{active > 0 && ` (${active})`}
            </span>
          </button>
          <div className="flex-1 sm:w-64 sm:flex-none">
            <label htmlFor={`${uid}-ordem`} className="sr-only">
              Ordenar por
            </label>
            <select
              id={`${uid}-ordem`}
              className="field min-h-11 py-2 text-[0.92rem]"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as VehicleFilters["sort"] })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Folha de filtros — telemóvel e tablet */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-sheet-title`}
        className="m-0 mt-auto max-h-[88svh] w-full max-w-none overflow-y-auto bg-paper p-0 text-ink backdrop:bg-ink/60 open:animate-[rise_300ms_var(--ease-out-quart)] lg:hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/15 bg-paper px-5 py-4">
          <h2 id={`${uid}-sheet-title`} className="font-display text-[1.3rem] font-semibold">
            Filtrar viaturas
          </h2>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center"
            aria-label="Fechar filtros"
            onClick={() => dialogRef.current?.close()}
          >
            <Close size={22} />
          </button>
        </div>
        <div className="px-5 py-6">
          <FilterControls filters={filters} update={update} facetData={facetData} idPrefix={`${uid}-sheet`} layout="sheet" />
        </div>
        <div className="sticky bottom-0 grid grid-cols-[auto_1fr] gap-3 border-t border-ink/15 bg-paper px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" className="btn btn-outline" onClick={reset} disabled={active === 0}>
            Limpar
          </button>
          <button type="button" className="btn btn-dark" onClick={() => dialogRef.current?.close()}>
            Ver {countLabel} <ArrowRight size={18} />
          </button>
        </div>
      </dialog>

      {/* Resultados */}
      <div className="pt-10">
        {results.length > 0 ? (
          <InventoryGrid vehicles={results} animateKey={signature} />
        ) : (
          <div className="anim-rise border border-dashed border-ink/25 px-6 py-16 text-center sm:px-12">
            <p className="font-display text-[1.6rem] font-semibold">Nenhuma viatura corresponde a estes filtros.</p>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Experimente alargar a pesquisa — ou diga-nos o que procura e avisamos quando surgir uma viatura adequada.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" className="btn btn-dark" onClick={reset}>
                Limpar filtros <ArrowRight size={18} />
              </button>
              <Link href="/contactos?assunto=procura#formulario" className="btn btn-outline">
                Dizer o que procuro <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

