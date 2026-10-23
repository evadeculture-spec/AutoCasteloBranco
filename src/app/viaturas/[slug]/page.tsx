import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContactProcess } from "@/components/home/ContactProcess";
import { VehicleEnquiryForm } from "@/components/forms/VehicleEnquiryForm";
import { PhoneLink, WhatsAppLink } from "@/components/ui/ContactLinks";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AvailabilityTag, DemoTag, VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { ViewTracker } from "@/components/vehicles/ViewTracker";
import { site } from "@/config/site";
import { getSimilarVehicles, getVehicleBySlug, getVehicles, vehicleName } from "@/lib/inventory";
import { formatKm, formatNumber, formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/viaturas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicleBySlug(slug);
  if (!v) return { title: "Viatura não encontrada" };
  const name = vehicleName(v);
  return pageMetadata({
    title: `${name} ${v.year} · ${formatPrice(v.priceEur)}`,
    description: `${name} de ${v.year}, ${formatKm(v.mileageKm)}, ${v.fuel.toLowerCase()}, caixa ${v.transmission.toLowerCase()}. ${formatPrice(v.priceEur)}. Peça informação à Auto Castelo Branco.`,
    path: `/viaturas/${v.slug}`,
  });
}

const PENDING = "Por confirmar";

/**
 * A leitura de `params` fica dentro de <Suspense>: a navegação mostra de
 * imediato a estrutura da página (esqueleto) e a viatura entra logo a seguir.
 * As viaturas conhecidas são pré-renderizadas por completo no build.
 */
export default function VehiclePage({ params }: PageProps<"/viaturas/[slug]">) {
  return (
    <Suspense fallback={<VehicleSkeleton />}>
      <VehicleDetail params={params} />
    </Suspense>
  );
}

function VehicleSkeleton() {
  return (
    <div className="container-x pt-6 pb-24 lg:pt-8" aria-busy="true" aria-label="A carregar a viatura">
      <div className="h-5 w-40 bg-ink/8" />
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="aspect-[4/3] animate-pulse bg-paper-2 sm:aspect-[16/10] lg:col-span-8" />
        <div className="grid content-start gap-4 lg:col-span-4">
          <div className="h-4 w-24 bg-ink/8" />
          <div className="h-14 w-3/4 bg-ink/8" />
          <div className="mt-4 h-12 w-1/2 bg-ink/8" />
          <div className="mt-4 h-24 bg-ink/5" />
          <div className="h-13 bg-ink/10" />
        </div>
      </div>
    </div>
  );
}

async function VehicleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const name = vehicleName(vehicle);
  const label = `${name} · ${vehicle.year} · ${formatPrice(vehicle.priceEur)}`;
  const similar = getSimilarVehicles(vehicle, 3);
  const s = vehicle.specs;

  const specs: Array<[string, string]> = [
    ["Marca", vehicle.make],
    ["Modelo", vehicle.model],
    ["Versão", vehicle.version ?? PENDING],
    ["Ano", String(vehicle.year)],
    ["Quilometragem", formatKm(vehicle.mileageKm)],
    ["Combustível", vehicle.fuel],
    ["Caixa de velocidades", vehicle.transmission],
    ["Potência", s.powerHp ? `${s.powerHp} cv` : PENDING],
    ["Cilindrada", s.engineCc ? `${formatNumber(s.engineCc)} cm³` : PENDING],
    ["Tração", s.traction ?? PENDING],
    ["Portas", s.doors ? String(s.doors) : PENDING],
    ["Lugares", s.seats ? String(s.seats) : PENDING],
    ["Cor", s.colour ?? PENDING],
  ];

  return (
    <>
      <ViewTracker vehicleId={vehicle.id} name={name} price={vehicle.priceEur} />

      <div className="container-x pt-6 lg:pt-8">
        <nav aria-label="Localização" className="text-[0.88rem]">
          <ol className="flex flex-wrap items-center gap-2 text-muted">
            <li>
              <Link href="/viaturas" className="link-line inline-flex items-center gap-1.5 hover:text-ink">
                <ArrowLeft size={16} /> Viaturas
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {name}
            </li>
          </ol>
        </nav>
      </div>

      <article aria-labelledby="viatura-title">
        {/* ---------- Galeria + resumo ---------- */}
        <div className="container-x mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <VehicleGallery vehicle={vehicle} />
          </div>

          <aside className="lg:col-span-4" aria-label="Resumo e contacto">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="flex flex-wrap items-center gap-3">
                <AvailabilityTag vehicle={vehicle} className="text-muted" />
                {vehicle.demo && <DemoTag className="text-accent" />}
              </div>
              <h1 id="viatura-title" className="font-display mt-4 leading-[0.98] font-bold">
                <span className="block text-[1.05rem] font-semibold tracking-[0.04em] text-muted uppercase">{vehicle.make}</span>
                <span className="mt-1 block text-[clamp(2.4rem,4.4vw,3.6rem)]">
                  {vehicle.model}
                  {vehicle.version && <span className="font-medium"> {vehicle.version}</span>}
                </span>
              </h1>

              <p className="mt-6 border-y border-ink/15 py-5">
                <span className="label block text-muted">Preço</span>
                <span className="font-display tabular mt-1 block text-[2.6rem] leading-none font-bold">
                  {formatPrice(vehicle.priceEur)}
                </span>
                <span className="mt-2 block text-[0.85rem] text-muted">IVA e condições de venda a confirmar.</span>
              </p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-6">
                {[
                  ["Ano", String(vehicle.year)],
                  ["Quilometragem", formatKm(vehicle.mileageKm)],
                  ["Combustível", vehicle.fuel],
                  ["Caixa", vehicle.transmission],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-[0.62rem] text-muted">{k}</dt>
                    <dd className="tabular mt-1 text-[1.1rem] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid gap-3">
                <a href="#pedido" className="btn btn-primary">
                  Pedir informação <ArrowRight size={18} />
                </a>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[0.95rem] font-medium">
                  <PhoneLink context="vehicle_page" className="link-line" />
                  <WhatsAppLink
                    context="vehicle_page"
                    className="link-line"
                    message={`Olá, gostaria de saber mais sobre o ${label} (${site.url}/viaturas/${vehicle.slug}).`}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ---------- Descrição editorial + ficha técnica ---------- */}
        <section aria-labelledby="descricao-title" className="container-x mt-20 grid gap-14 border-t border-ink/15 pt-14 lg:mt-28 lg:grid-cols-12 lg:pt-20">
          <div className="lg:col-span-7">
            <SectionLabel index="01" className="text-muted">
              <span id="descricao-title">Sobre esta viatura</span>
            </SectionLabel>
            <p className="font-display mt-6 text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.15] font-semibold text-balance">
              {vehicle.headline}
            </p>
            <div className="mt-8 grid max-w-2xl gap-5 text-[1.05rem] leading-relaxed text-muted">
              {vehicle.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {vehicle.demo && (
              <p className="label mt-8 border-l-2 border-accent pl-3 leading-relaxed text-muted">
                Viatura de demonstração. Preço, ano, quilometragem e especificações são fictícios.
              </p>
            )}

            <div className="mt-14">
              <h2 className="font-display text-[1.5rem] font-semibold">Equipamento</h2>
              {vehicle.equipment.length ? (
                <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                  {vehicle.equipment.map((item) => (
                    <li key={item} className="border-b border-ink/10 py-2.5">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 max-w-xl leading-relaxed text-muted">
                  A lista de equipamento desta viatura ainda não foi confirmada. Só publicamos equipamento verificado — peça-nos
                  os detalhes e respondemos com o que for confirmado.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <h2 className="label text-muted">Ficha técnica</h2>
            <dl className="mt-5 border-t border-ink">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[1fr_auto] gap-4 border-b border-ink/15 py-3 text-[0.95rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd className={v === PENDING ? "label self-center text-[0.62rem] text-muted" : "tabular text-right font-semibold"}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- Pedido de informação ---------- */}
        <section id="pedido" aria-labelledby="pedido-title" className="on-dark mt-24 bg-graphite text-paper lg:mt-32">
          <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
            <div className="lg:col-span-5">
              <SectionLabel index="02" className="text-metal">
                Pedido de informação
              </SectionLabel>
              <h2 id="pedido-title" className="font-display mt-6 text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] font-bold text-balance">
                Quer saber mais sobre este {vehicle.model}?
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-mist">
                Deixe o seu contacto e respondemos com a informação disponível sobre esta viatura — disponibilidade,
                documentação e condições. Sem compromisso.
              </p>
              <div className="mt-10 grid gap-3 text-[1.05rem]">
                <p className="label text-metal">Prefere falar diretamente?</p>
                <PhoneLink context="vehicle_enquiry" className="font-display text-[1.4rem] font-semibold" />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <VehicleEnquiryForm vehicleId={vehicle.id} vehicleLabel={label} />
            </div>
          </div>
        </section>
      </article>

      {similar.length > 0 && (
        <section aria-labelledby="semelhantes-title" className="container-x py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="semelhantes-title" className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-bold">
              Viaturas semelhantes
            </h2>
            <Link href="/viaturas" className="link-line inline-flex items-center gap-2 font-semibold">
              Todo o inventário <ArrowRight size={18} />
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactProcess />
    </>
  );
}
