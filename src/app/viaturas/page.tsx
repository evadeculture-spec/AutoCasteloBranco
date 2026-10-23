import Link from "next/link";
import { Suspense } from "react";
import { ClosingCta } from "@/components/home/ClosingCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { InventoryBrowser } from "@/components/vehicles/InventoryBrowser";
import { InventoryGrid } from "@/components/vehicles/InventoryGrid";
import { getVehicles, sortVehicles } from "@/lib/inventory";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Viaturas usadas à venda em Castelo Branco",
  description:
    "Inventário de viaturas usadas da Auto Castelo Branco: fotografias, quilometragem, combustível, caixa de velocidades e preço. Filtre por marca, preço e combustível.",
  path: "/viaturas",
});

export default function VehiclesPage() {
  const vehicles = getVehicles();
  const hasDemo = vehicles.some((v) => v.demo);

  return (
    <>
      <section aria-labelledby="viaturas-title" className="container-x pt-14 pb-10 lg:pt-20 lg:pb-14">
        <SectionLabel className="text-muted">Comércio automóvel</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 id="viaturas-title" className="font-display-wide text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-extrabold lg:col-span-7">
            Viaturas
          </h1>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="max-w-md text-[1.08rem] leading-relaxed text-muted">
              Cada ficha mostra preço, quilometragem, combustível e caixa de velocidades. O que não está confirmado aparece
              identificado como tal.
            </p>
            {hasDemo && (
              <p className="label mt-5 inline-block border border-ink/25 px-2 py-1 text-muted">
                Inventário de demonstração — dados fictícios
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Inventário" className="container-x pb-24 lg:pb-32">
        {/* Sem JavaScript ou durante o carregamento: a lista completa, já ordenada. */}
        <Suspense fallback={<InventoryGrid vehicles={sortVehicles(vehicles, "recentes")} />}>
          <InventoryBrowser vehicles={vehicles} />
        </Suspense>
        <p className="mt-16 text-[0.95rem] text-muted">
          Procura uma viatura específica que não está aqui?{" "}
          <Link href="/contactos?assunto=procura#formulario" className="link-line font-semibold text-ink">
            Diga-nos o que procura
          </Link>
          .
        </p>
      </section>

      <ClosingCta title="Viu uma viatura que lhe interessa? Fale connosco." context="inventory_cta" />
    </>
  );
}
