import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { ContactProcess } from "@/components/home/ContactProcess";
import { ClosingCta } from "@/components/home/ClosingCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowRight } from "@/components/ui/icons";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { serviceOptions, services } from "@/data/services";
import { facets, getFeaturedVehicles, getVehicles } from "@/lib/inventory";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // O modelo de título do layout não se aplica à página raiz: título absoluto com a marca.
  title: { absolute: "Auto Castelo Branco — Viaturas usadas e oficina em Castelo Branco" },
  description:
    "Auto Castelo Branco: viaturas usadas apresentadas com rigor e oficina para manutenção, revisão e diagnóstico em Castelo Branco. Peça informação ou marcação.",
  path: "/",
});

export default function HomePage() {
  const all = getVehicles();
  const featured = getFeaturedVehicles(4);
  const { makes } = facets(all);
  const fromPrice = all.length ? formatPrice(Math.min(...all.map((v) => v.priceEur))) : "—";

  return (
    <>
      <HomeHero
        data={{
          vehicles: all.map((v) => ({ make: v.make, priceEur: v.priceEur })),
          makes,
          prices: facets(all).prices,
          services: serviceOptions,
        }}
      />

      {/* ------------------------------------------------------------ */}
      {/* Duas áreas, um critério                                       */}
      {/* ------------------------------------------------------------ */}
      <section aria-labelledby="areas-title" className="container-x py-20 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01" className="text-muted">
              A casa
            </SectionLabel>
            <h2 id="areas-title" className="font-display mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] font-bold text-balance">
              Duas áreas de trabalho. Um só critério.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-12">
            <p className="text-[1.15rem] leading-relaxed text-muted">
              Quem nos compra uma viatura e quem nos confia a manutenção da sua procura o mesmo: saber exatamente o que está a
              receber. Por isso tratamos o comércio e a oficina com a mesma regra — dados claros, sem promessas que não possamos
              confirmar.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-px bg-ink/15 lg:grid-cols-12">
          <Link href="/viaturas" className="group relative bg-paper-2 p-8 transition-colors hover:bg-paper-3 sm:p-12 lg:col-span-7">
            <span className="label text-muted">Comércio automóvel</span>
            <span className="font-display mt-10 block text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-bold">Viaturas</span>
            <span className="mt-6 block max-w-md text-[1.02rem] leading-relaxed text-muted">
              Inventário com fotografias, especificações completas e preço visível. Cada ficha diz o que sabemos — e o que ainda
              falta confirmar.
            </span>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/15 pt-6">
              <div>
                <dt className="label text-[0.62rem] text-muted">Em inventário</dt>
                <dd className="font-display tabular mt-2 text-[1.8rem] font-semibold">{all.length}</dd>
              </div>
              <div>
                <dt className="label text-[0.62rem] text-muted">Desde</dt>
                <dd className="font-display tabular mt-2 text-[1.8rem] font-semibold">{fromPrice}</dd>
              </div>
              <div>
                <dt className="label text-[0.62rem] text-muted">Marcas</dt>
                <dd className="mt-3 text-[1rem] font-semibold">{makes.join(" · ")}</dd>
              </div>
            </dl>
            <span className="mt-10 inline-flex items-center gap-2 font-semibold text-accent">
              Explorar inventário <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/oficina"
            className="on-dark group relative bg-graphite p-8 text-paper transition-colors hover:bg-graphite-2 sm:p-12 lg:col-span-5"
          >
            <span className="label text-metal">Assistência técnica</span>
            <span className="font-display mt-10 block text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-bold">Oficina</span>
            <span className="mt-6 block max-w-sm text-[1.02rem] leading-relaxed text-mist">
              Manutenção, revisão e diagnóstico, com o trabalho explicado antes e depois de cada intervenção.
            </span>
            <ul className="mt-12 border-t border-steel">
              {services.slice(0, 4).map((s) => (
                <li key={s.id} className="flex items-baseline gap-4 border-b border-steel py-3">
                  <span className="label tabular text-metal">{s.code}</span>
                  <span className="text-[0.98rem]">{s.title}</span>
                </li>
              ))}
            </ul>
            <span className="mt-10 inline-flex items-center gap-2 font-semibold">
              Conhecer a oficina <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Viaturas em destaque — composição editorial assimétrica       */}
      {/* ------------------------------------------------------------ */}
      <section aria-labelledby="destaques-title" className="border-t border-ink/10 bg-paper py-20 lg:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="02" className="text-muted">
                Seleção
              </SectionLabel>
              <h2 id="destaques-title" className="font-display mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] font-bold">
                Viaturas em destaque
              </h2>
            </div>
            <Link href="/viaturas" className="link-line inline-flex items-center gap-2 font-semibold">
              Ver todas as viaturas ({all.length}) <ArrowRight size={18} />
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="mt-12 text-muted">De momento não há viaturas em inventário. Contacte-nos para saber o que está a chegar.</p>
          ) : (
            <ol className="mt-14 grid gap-x-10 gap-y-14 lg:grid-cols-12">
              {featured.map((v, i) => (
                <li
                  key={v.id}
                  className={
                    i === 0
                      ? "reveal lg:col-span-8"
                      : i === 1
                        ? "reveal lg:col-span-4 lg:pt-32"
                        : i === 2
                          ? "reveal lg:col-span-5"
                          : "reveal lg:col-span-6 lg:col-start-7 lg:-mt-16"
                  }
                >
                  <VehicleCard
                    vehicle={v}
                    index={i + 1}
                    size={i === 0 ? "lg" : "md"}
                    aspect={i === 0 ? "aspect-[16/9]" : i === 1 ? "aspect-[4/3]" : "aspect-[16/10]"}
                    sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
                    priority={i === 0}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Oficina — competência técnica                                */}
      {/* ------------------------------------------------------------ */}
      <section aria-labelledby="oficina-title" className="on-dark bg-graphite py-20 text-paper lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <SectionLabel index="03" className="text-metal">
                Oficina
              </SectionLabel>
              <h2 id="oficina-title" className="font-display mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] font-bold text-balance">
                Primeiro perceber. Depois intervir.
              </h2>
              <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-mist">
                Uma boa oficina não começa pela reparação: começa por ouvir, verificar e explicar. Só avançamos depois de saber —
                e de o informar — o que é necessário.
              </p>
              <Link href="/oficina#marcacao" className="btn btn-light mt-10">
                Pedir marcação <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="border-t border-steel">
              {services.map((s) => (
                <li key={s.id} className="reveal grid gap-2 border-b border-steel py-7 sm:grid-cols-[5.5rem_1fr] sm:gap-6">
                  <span className="label tabular pt-1.5 text-accent-light">{s.code}</span>
                  <div>
                    <h3 className="font-display text-[1.45rem] leading-tight font-semibold">{s.title}</h3>
                    <p className="mt-2 max-w-xl text-[0.98rem] leading-relaxed text-metal">{s.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="label mt-6 text-metal">Lista de serviços demonstrativa — sujeita a confirmação.</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Filosofia                                                     */}
      {/* ------------------------------------------------------------ */}
      <section aria-labelledby="filosofia-title" className="container-x py-20 lg:py-36">
        <SectionLabel index="04" className="text-muted">
          Filosofia
        </SectionLabel>
        <h2
          id="filosofia-title"
          className="font-display mt-8 max-w-[22ch] text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.04] font-bold text-balance"
        >
          Apresentar cada automóvel como gostaríamos que nos fosse apresentado.
        </h2>
        <div className="mt-16 grid gap-x-10 gap-y-12 border-t border-ink/15 pt-10 md:grid-cols-3">
          {[
            {
              t: "Transparência",
              d: "Preço visível, dados completos e a indicação clara de tudo o que ainda está por confirmar. Sem letra pequena.",
            },
            {
              t: "Rigor",
              d: "Cada especificação publicada é verificada. Se um dado não é conhecido, dizemo-lo — não o estimamos.",
            },
            {
              t: "Proximidade",
              d: "Uma casa de Castelo Branco, para quem vive e conduz na região. Atendimento direto, por quem conhece o trabalho.",
            },
          ].map((p, i) => (
            <div key={p.t} className="reveal">
              <p className="label tabular text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display mt-4 text-[1.5rem] font-semibold">{p.t}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.d}</p>
            </div>
          ))}
        </div>
        <Link href="/sobre-nos" className="link-line mt-14 inline-flex items-center gap-2 font-semibold">
          Sobre a Auto Castelo Branco <ArrowRight size={18} />
        </Link>
      </section>

      <ContactProcess index="05" />
      <ClosingCta />
    </>
  );
}
