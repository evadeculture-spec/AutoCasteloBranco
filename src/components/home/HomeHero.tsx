import Link from "next/link";
import { CarElevation } from "@/components/brand/CarElevation";
import { ArrowRight } from "@/components/ui/icons";

export function HomeHero({ vehicleCount, fromPrice }: { vehicleCount: number; fromPrice: string }) {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-ink text-paper">
      {/* Luz de estúdio: um foco sobre a viatura, nada de gradientes decorativos. */}
      <div
        aria-hidden="true"
        className="anim-fade absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 64% 58%, rgba(207,203,196,0.13) 0%, rgba(17,18,19,0) 70%), linear-gradient(180deg, #111213 0%, #16181a 62%, #1e2124 100%)",
        }}
      />
      {/* Linhas de construção */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.06]">
        <div className="container-x grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-l border-paper last:border-r max-lg:[&:nth-child(n+5)]:hidden" />
          ))}
        </div>
      </div>

      <div className="container-x flex sm:min-h-[max(38rem,min(calc(100svh-2rem),60rem))] flex-col pt-[calc(var(--header-h)+1.5rem)] sm:pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        <h1 id="hero-title">
          <span className="label anim-rise block text-metal" style={{ ["--delay" as string]: "80ms" }}>
            <span className="max-sm:hidden">Castelo Branco Auto — </span>Viaturas usadas e oficina
          </span>
          <span
            className="font-display anim-rise mt-5 block text-[clamp(2.5rem,5.6vw,5.4rem)] leading-[0.98] font-bold"
            style={{ ["--delay" as string]: "160ms" }}
          >
            Confiança na estrada.
            <br />
            <span className="text-metal">Rigor em cada detalhe.</span>
          </span>
        </h1>

        <div className="mt-6 grid flex-1 items-end gap-y-2 sm:mt-8 sm:gap-y-6 lg:mt-4 lg:grid-cols-12">
          <div className="anim-rise lg:col-span-4 lg:pb-[clamp(5rem,11vh,8rem)]" style={{ ["--delay" as string]: "300ms" }}>
            <p className="max-w-sm text-[1rem] leading-relaxed text-mist sm:text-[1.05rem]">
              Compra e venda de viaturas e assistência técnica em Castelo Branco, com o mesmo critério: informação clara e
              trabalho bem explicado.
            </p>
            <Link
              href="/oficina#marcacao"
              className="link-line mt-6 hidden items-center gap-2 text-[0.95rem] font-semibold text-paper sm:inline-flex"
            >
              Pedir marcação na oficina <ArrowRight size={16} />
            </Link>
          </div>
          {/* Alçado técnico */}
          <div className="-mr-[10%] ml-[4%] sm:mr-0 sm:ml-0 lg:col-span-8 lg:flex lg:justify-end">
            <CarElevation type="berlina" animate dimensions className="w-full max-sm:max-h-[24svh] lg:w-[min(100%,96vh)]" />
          </div>
        </div>

        {/* Dois caminhos */}
        <nav aria-label="Áreas principais" className="anim-rise relative mt-4 grid border-t sm:mt-6 border-steel sm:grid-cols-2" style={{ ["--delay" as string]: "500ms" }}>
          <Link
            href="/viaturas"
            className="group flex items-center justify-between gap-6 border-b border-steel py-4 sm:border-r sm:border-b-0 sm:py-6 sm:pr-8"
          >
            <span>
              <span className="label tabular text-metal">01 · Viaturas</span>
              <span className="font-display mt-2 block text-[1.6rem] leading-none font-semibold sm:text-[2rem]">Ver viaturas</span>
              <span className="mt-2 block text-[0.9rem] text-metal">
                {vehicleCount} em inventário · desde {fromPrice}
              </span>
            </span>
            <span className="flex size-14 shrink-0 items-center justify-center bg-accent text-white transition-colors group-hover:bg-accent-strong">
              <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <Link href="/oficina" className="group flex items-center justify-between gap-6 py-4 sm:py-6 sm:pl-8">
            <span>
              <span className="label tabular text-metal">02 · Oficina</span>
              <span className="font-display mt-2 block text-[1.6rem] leading-none font-semibold sm:text-[2rem]">Conhecer a oficina</span>
              <span className="mt-2 block text-[0.9rem] text-metal max-sm:hidden">Manutenção, revisão e diagnóstico</span>
            </span>
            <span className="flex size-14 shrink-0 items-center justify-center border border-paper/40 transition-colors group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
              <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
